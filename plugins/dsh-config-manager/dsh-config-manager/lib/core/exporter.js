/**
 * Export 编排（规范 §1/§18/§21，设计 §4.4）：
 *   adapter 收集各分区 → Secret 过滤 → manifest → checksum → ZIP。
 *
 * 安全不变量：
 *  - Secret 值默认永不进入导出数据（结构化分区逐一过 SecretScanner）；
 *  - includeSecrets=true 必须注入 EncryptionProvider（m4 实现），否则拒绝导出；
 *  - 注入 EncryptionProvider 时备份标记为加密（encrypted=true）：includeSecrets=false
 *    时 secrets.enc 加密空内容占位，备份仍需要密码导入，但不含任何凭据值；
 *  - 加密密码/秘密值绝不写入 manifest 与日志。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildChecksums } from "../utils/hashing.js";
import { stringifyJsonSafe } from "../utils/json.js";
import { buildManifest, CHECKSUMS_FILE, MANIFEST_FILE, EXPORTER_NAME } from "../schema/manifest.js";
import { SECTION_JSON_PATHS, SECTION_FILE_PREFIXES, isFileSection } from "../schema/config.js";
import { DEFAULT_SENSITIVE_RELS, refreshVault } from "../security/vault.js";
import { writeZip } from "../utils/zip.js";
import { msgOf } from "./messages.js";
/** 缺省 SecretScanner：递归黑名单字段剥离（字段名大小写不敏感；二进制/Uint8Array 原样跳过） */
export function defaultSecretScanner() {
    const SENSITIVE_FIELDS = [
        'password', 'passwd', 'token', 'accesstoken', 'refreshtoken', 'apikey',
        'secret', 'credential', 'authorization', 'cookie', 'privatekey', 'clientsecret',
    ];
    /** 仅存「引用名」而非值的字段（如 apiKeyEnv=DEEPSEEK_API_KEY 是环境变量名，不是秘密） */
    const REFERENCE_FIELDS = new Set([
        'apikeyenv', 'api_key_env', 'apikeyname', 'tokenenv', 'accesstokenenv',
        'refreshtokenenv', 'clientsecretenv', 'passwordenv',
    ]);
    return {
        scanAndRedact(data) {
            const hits = [];
            const walk = (v, p) => {
                if (v === null || typeof v !== 'object')
                    return v;
                if (v instanceof Uint8Array)
                    return v; // 二进制内容不按字段展开
                if (Array.isArray(v))
                    return v.map((item, i) => walk(item, `${p}[${i}]`));
                const out = {};
                for (const [k, val] of Object.entries(v)) {
                    const lower = k.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const isRefName = REFERENCE_FIELDS.has(lower);
                    const sensitive = !isRefName && SENSITIVE_FIELDS.some((f) => lower.includes(f));
                    if (sensitive && typeof val === 'string' && val !== '') {
                        hits.push({ path: p === '' ? k : `${p}.${k}`, field: k });
                        out[k] = ''; // 值剥离为空串（保留字段名与位置，供「需补录」提示）
                        continue;
                    }
                    out[k] = walk(val, p === '' ? k : `${p}.${k}`);
                }
                return out;
            };
            return { sanitized: walk(data, ''), hits };
        },
    };
}
export class Exporter {
    ctx;
    adapters;
    scanner;
    encryption;
    exporterVersion;
    now;
    msg;
    onSection;
    vaultDataDir;
    constructor(opts) {
        this.ctx = opts.ctx;
        this.adapters = opts.adapters;
        this.scanner = opts.scanner ?? defaultSecretScanner();
        this.encryption = opts.encryption ?? null;
        this.exporterVersion = opts.exporterVersion ?? '0.1.0';
        this.now = opts.now ?? (() => new Date());
        this.msg = opts.msg ?? msgOf(opts.ctx);
        this.onSection = opts.onSection;
        this.vaultDataDir = opts.vaultDataDir ?? path.join(opts.ctx.homeDir, 'dsh-config-manager');
    }
    /**
     * 导出：收集 → 过滤 → checksum → manifest → ZIP。
     * 返回 zipPath（含文件名）、manifest、报告。
     */
    async export(options) {
        const { includeSecrets, only } = options;
        if (includeSecrets && !this.encryption) {
            throw new Error(this.msg('export.encryptionRequired'));
        }
        // 1. 选定分区（only 过滤 + 默认包含）
        const selected = this.adapters
            .filter((a) => (only === undefined ? a.defaultIncluded : only.includes(a.id)))
            .map((a) => a.id);
        // 2. 逐 adapter 收集（导出数据）
        const sections = [];
        const warnings = [];
        const redactedHits = [];
        const included = [];
        const excluded = this.adapters.filter((a) => !selected.includes(a.id)).map((a) => a.id);
        // m1 埋点：每导出一个分区前上报真实进度（onSection 抛错不得中断导出）
        let sectionIndex = 0;
        for (const adapter of this.adapters) {
            if (!selected.includes(adapter.id))
                continue;
            sectionIndex += 1;
            try {
                this.onSection?.({ section: adapter.id, index: sectionIndex, total: selected.length });
            }
            catch {
                // 埋点回调失败不影响导出本身（进度是尽力而为）
            }
            let section;
            try {
                section = await adapter.export(this.ctx, options);
            }
            catch (err) {
                // 单个分区失败不拖垮整体（§34.17）；如实告警并跳过
                warnings.push(this.msg('export.sectionFailed', { adapter: adapter.id, reason: err instanceof Error ? err.message : String(err) }));
                excluded.push(adapter.id);
                continue;
            }
            // 3. Secret 过滤：结构化数据逐一过 scanner；
            //    文件类分区（skills 等）内容为自由文本，扫描语义由 m4 强化，此处不动
            let sanitized = section.data;
            if (!isFileSection(adapter.id)) {
                const scanned = this.scanner.scanAndRedact(section.data);
                redactedHits.push(...scanned.hits);
                sanitized = scanned.sanitized;
            }
            sections.push({ ...section, data: sanitized });
            included.push({ section: adapter.id, counts: section.counts });
            warnings.push(...section.warnings);
        }
        // 4. 组装 ZIP 条目（JSON 分区 + 文件类分区 + secrets.enc + checksums + manifest）
        const entries = [];
        const sectionFlags = buildSectionFlags(sections);
        let containsSecrets = false;
        let encrypted = false;
        let encryption = null;
        for (const section of sections) {
            if (isFileSection(section.sectionId)) {
                const prefix = SECTION_FILE_PREFIXES[section.sectionId];
                const files = section.data.files ?? [];
                for (const file of files) {
                    entries.push({ name: `${prefix}${file.relativePath}`, data: file.data });
                }
                continue;
            }
            const jsonPath = SECTION_JSON_PATHS[section.sectionId];
            if (jsonPath === undefined)
                continue;
            entries.push({
                name: jsonPath,
                data: Buffer.from(stringifyJsonSafe(section.data, { space: 2 }), 'utf8'),
            });
        }
        // secrets.enc：有加密提供者即生成。includeSecrets=true 时加密真实的凭据原文；
        // 只勾选加密（不导出密钥）时加密空内容占位，备份仍标记 encrypted（导入需密码），
        // 但绝不把凭据值放进去（containsSecrets 保持 false；安全不变量不破）。
        if (this.encryption) {
            const credentialsFile = path.join(this.ctx.homeDir, '.credentials.yaml');
            let plaintext;
            if (includeSecrets) {
                try {
                    const raw = await this.ctx.fs.readFile(credentialsFile);
                    plaintext = Buffer.from(raw).toString('utf8');
                }
                catch (err) {
                    warnings.push(this.msg('export.credentialsReadFailed', { reason: err instanceof Error ? err.message : String(err) }));
                    plaintext = '';
                }
            }
            else {
                plaintext = '';
            }
            const result = await this.encryption.encrypt(plaintext);
            entries.push({ name: 'security/secrets.enc', data: result.blob });
            encryption = result.info;
            containsSecrets = includeSecrets && plaintext !== '';
            encrypted = true;
        }
        // 4b. 文件级 vault（includeSecrets=false：敏感文件明文不进归档 → 镜像到本机 vault）。
        //     尽力而为：任何失败仅记警告，不中断导出。includeSecrets=true 时秘密已加密进归档，
        //     无需镜像（vault 只服务于「明文不进备份」的本机留存场景）。
        let vaultRefreshed = 0;
        if (!includeSecrets) {
            try {
                const vault = await refreshVault(this.ctx.fs, this.vaultDataDir, this.ctx.homeDir, DEFAULT_SENSITIVE_RELS);
                vaultRefreshed = vault.mirrored.length;
                if (vault.mirrored.length > 0) {
                    warnings.push(this.msg('export.vaultRefreshed', { count: vault.mirrored.length }));
                }
                for (const s of vault.skipped) {
                    warnings.push(this.msg('export.vaultRefreshSkipped', { rel: s.rel, reason: s.reason }));
                }
            }
            catch (err) {
                warnings.push(this.msg('export.vaultRefreshFailed', { reason: err instanceof Error ? err.message : String(err) }));
            }
        }
        // 5. checksums（覆盖除 manifest/checksums 外的全部条目）
        const checksums = buildChecksums(entries);
        entries.push({ name: CHECKSUMS_FILE, data: Buffer.from(stringifyJsonSafe(checksums, { space: 2 }), 'utf8') });
        // 6. manifest（最后写：需要完整分区与安全信息）
        const manifest = buildManifest({
            exporterVersion: this.exporterVersion,
            dshVersion: this.ctx.dshVersion,
            platform: this.ctx.platform,
            arch: this.ctx.arch,
            sections: sectionFlags,
            containsSecrets,
            encrypted,
            encryption,
            exportedAt: this.now().toISOString(),
        });
        entries.push({ name: MANIFEST_FILE, data: Buffer.from(stringifyJsonSafe(manifest, { space: 2 }), 'utf8') });
        // 7. 落盘
        const outPath = options.outPath ?? defaultOutPath(this.now());
        await writeZip(outPath, entries);
        const stat = await fs.stat(outPath);
        // 日志不泄值：只记分区与命中数量
        this.ctx.log.info('导出完成', {
            file: path.basename(outPath),
            sizeBytes: stat.size,
            sections: Object.keys(sectionFlags).filter((k) => sectionFlags[k]),
            redactedFields: redactedHits.length,
            containsSecrets,
            encrypted,
            vaultRefreshed,
        });
        const report = {
            included,
            excluded,
            security: {
                secretsExcluded: !includeSecrets,
                containsSecrets,
                encrypted,
                redactedHits: redactedHits.length,
                vaultRefreshed,
            },
            file: { name: path.basename(outPath), sizeBytes: stat.size },
            warnings,
        };
        return { zipPath: outPath, manifest, report };
    }
}
/** 构建 manifest.sections 布尔表（只含实际导出分区） */
function buildSectionFlags(sections) {
    const flags = {};
    for (const id of Object.keys(SECTION_JSON_PATHS))
        flags[id] = false;
    for (const id of Object.keys(SECTION_FILE_PREFIXES))
        flags[id] = false;
    flags['secrets'] = false;
    for (const section of sections)
        flags[section.sectionId] = true;
    return flags;
}
function defaultOutPath(now) {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `dsh-config-${y}-${m}-${d}.zip`;
}
/** 供报告使用：导出器身份（避免与 manifest 常量重复维护） */
export const EXPORTER_INFO = { name: EXPORTER_NAME };
//# sourceMappingURL=exporter.js.map