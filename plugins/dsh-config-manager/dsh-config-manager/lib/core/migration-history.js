/**
 * Migration History & Auditability Engine（Phase 6）——统一、持久、append-only、可查询、可导出的
 * 迁移/审计历史存储。
 *
 * 职责（严格限定）：
 *  - migration-history/ 目录下 per-file append-only 条目存储；
 *  - 原子写（atomicWriteFile，0600 + symlink-reject）；
 *  - 读取（只认合法历史文件，忽略 tmp/脏文件；损坏文件跳过并计数）；
 *  - 查询（kind / 结果 / 时间 / 分区 过滤）、统计、导出（JSON / Markdown）；
 *  - retention（删最旧、幂等）；
 *  - **Redaction 边界**：条目内仅有 summary / error 是自由文本，写入前必须经
 *    scanAndRedact（含 high-entropy 档）+ redactJournalText 双重清洗；其余字段
 *    （kind/result/source/sections/operationId/snapshotId/runId/at）均为常量或 UUID，
 *    无 secret 承载面。
 *
 * 安全/架构纪律（Phase 6 §3）：
 *  - **不建第二套 framework**：复用 Phase 1 atomicWriteFile、journal 的 per-file append
 *    模式、security 脱敏、paths 保留前缀；本模块是新能力（审计史），非重复基础设施。
 *  - **APPEND-ONLY**：条目写入即完整独立文件，无 update/delete API（编译层无暴露）；
 *    仅 retention 删最旧。篡改文件 → 读回损坏识别并跳过（不静默接受）。
 *  - **DURABLE**：落盘跨重启。
 *  - **BOUND**：条目尽量关联 operationId / snapshotId / runId。
 *
 * 与 DSH 运行时解耦：IO 经可注入门面（测试注入失败点），引擎层零 DSH 依赖。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { atomicWriteFile } from "../utils/atomic-write.js";
import { redact } from "../security/redaction.js";
import { scanAndRedact } from "../security/secret-scanner.js";
import { sha256Hex } from "../utils/hashing.js";
// ---------- 常量 ----------
export const MIGRATION_HISTORY_SCHEMA_VERSION = 1;
export const MIGRATION_HISTORY_DIR = 'migration-history';
/** 默认保留上限（retention 删最旧）。 */
export const DEFAULT_MIGRATION_RETENTION = 1000;
/** 文件名正则：`<stamp>-<hex12>.<kind>.json`，只认合法历史文件。 */
const HISTORY_BASENAME_RE = /^[0-9A-Za-z:.+-]{8,}-[0-9a-f]{12}\.[a-z-]+\.json$/i;
const TMP_PREFIX = '.dshcm.';
/** 合法 kind 集合（§5 COMPLETE 清单 + 评审补 'profile-import'）。 */
const MIGRATION_KINDS = [
    'import', 'restore', 'rollback',
    'profile-switch', 'profile-delete', 'profile-rename', 'profile-save', 'profile-import',
    'sync-apply', 'autosync', 'recovery',
    'backup', 'snapshot-delete', 'snapshot-prune',
];
const defaultIo = {
    async mkdir(d, o) { await fs.mkdir(d, o); },
    async readdirNames(d) { try {
        return await fs.readdir(d);
    }
    catch {
        return [];
    } },
    async readFileText(p) { return (await fs.readFile(p, 'utf8')).toString(); },
    async writeAll(t, c) { await atomicWriteFile(t, c, { mode: 0o600, symlink: 'reject' }); },
    async rm(p, o) { await fs.rm(p, o); },
    async lstat(p) { try {
        return await fs.lstat(p);
    }
    catch {
        return null;
    } },
    async exists(p) { try {
        await fs.access(p);
        return true;
    }
    catch {
        return false;
    } },
};
// ---------- Redaction（双保险） ----------
/** journal 级高熵长 token 掩码（复用 journal 语义，独立实现避免跨层依赖）。 */
const HIGH_ENTROPY_RE = /([A-Za-z0-9+/_=-]{28,})/g;
/**
 * 历史文本强脱敏：redact（结构化字段 + 已知值形状）+ 高熵长 token 掩码。
 * 用于 summary / error 等可能嵌入任意值的字段（REDACTED 不变量）。
 */
export function redactHistoryText(text) {
    let out = text;
    try {
        out = redact(out);
    }
    catch { /* 脱敏失败保守处理 */ }
    out = out.replace(HIGH_ENTROPY_RE, '[REDACTED]');
    return out;
}
/**
 * 构造安全条目：对 summary / error 做强脱敏（scanAndRedact 高熵档 + redactHistoryText），
 * 做白名单字段规范化，并计算 contentHash（对除 contentHash 外全字段的 SHA-256）。
 * **历史写入的唯一出口入口**，禁止绕过。
 */
export function sanitizeEntry(raw) {
    // 1) 无损子串掩码（redact 值形状 + 高熵长 token），保留周边可读文本——优先，
    //    避免「一个 sk- 子串就整段清空」导致审计可读性全失。
    const masked = {
        summary: redactHistoryText(raw.summary ?? ''),
        error: redactHistoryText(raw.error ?? ''),
    };
    // 2) scanAndRedact（高熵档）作为残留防线：若掩码后仍检测到威胁，保守整值清空，
    //    绝不带敏感值落盘。（scanAndRedact 对裸 string 静默跳过 → 固定包对象。）
    const { sanitized } = scanAndRedact({ summary: masked.summary, error: masked.error }, { highEntropy: true, valuePatterns: true });
    const s = (sanitized ?? {});
    const summary = typeof s.summary === 'string' ? s.summary : '';
    const hasError = ((masked.error ?? '') !== '');
    const error = hasError ? (typeof s.error === 'string' ? s.error : '') : undefined;
    const entry = {
        schemaVersion: MIGRATION_HISTORY_SCHEMA_VERSION,
        at: raw.at,
        kind: raw.kind,
        result: raw.result,
        sections: Array.isArray(raw.sections) ? raw.sections.filter((s) => typeof s === 'string') : [],
        source: sourceGuard(raw.source),
        summary,
        error,
    };
    if (raw.operationId !== undefined && isUuid(raw.operationId))
        entry.operationId = raw.operationId;
    if (raw.snapshotId !== undefined && isUuid(raw.snapshotId))
        entry.snapshotId = raw.snapshotId;
    if (raw.runId !== undefined && isUuid(raw.runId))
        entry.runId = raw.runId;
    const stored = entry;
    stored.contentHash = computeContentHash(entry);
    return stored;
}
const VALID_SOURCES = new Set([
    'api', 'autosync', 'backup-scheduler', 'recovery', 'cli', 'internal',
]);
/** 运行期校验 source 属合法枚举；非法回退 'internal'（防未知来源绕过/清洗不一致）。 */
function sourceGuard(v) {
    return typeof v === 'string' && VALID_SOURCES.has(v) ? v : 'internal';
}
/** 对除 contentHash 外全字段计算稳定 SHA-256（字段序稳定、无无关缩进/空白）。 */
function computeContentHash(entry) {
    const payload = Object.fromEntries(Object.entries(entry).filter(([k]) => k !== 'contentHash'));
    return sha256Hex(canonicalStringify(payload));
}
/** 稳定 JSON 序列化（键排序 + 无多余空白），保证 hash 跨运行稳定。 */
function canonicalStringify(value) {
    return JSON.stringify(sortKeys(value));
}
function sortKeys(v) {
    if (Array.isArray(v))
        return v.map(sortKeys);
    if (v !== null && typeof v === 'object') {
        const out = {};
        for (const k of Object.keys(v).sort()) {
            out[k] = sortKeys(v[k]);
        }
        return out;
    }
    return v;
}
function isUuid(v) {
    return typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}
/** 合法 kind 判定（类型守卫 + 运行时校验）。 */
export function isValidMigrationKind(k) {
    return typeof k === 'string' && MIGRATION_KINDS.includes(k);
}
/** 判断文件 basename 是否是可追踪历史文件（<sortable>-<hex>.json）。忽略 tmp 及其它。 */
export function isHistoryBasename(name) {
    if (!HISTORY_BASENAME_RE.test(name))
        return false;
    return !name.startsWith(TMP_PREFIX);
}
/** 文件名安全：仅 basename（不含目录分隔符/穿越）。 */
export function isSafeHistoryFilename(name) {
    if (name === '' || name.includes('/') || name.includes('\\') || name.includes('\0'))
        return false;
    return name !== '.' && name !== '..';
}
/**
 * 生成排序文件名（Windows-safe 定宽时间戳 + 随机后缀 + kind 标记）。
 *
 * 时间戳契约（Windows/排序可靠性）：`toISOString().replace(/[:Z]/g,'')`
 * → `2026-08-30T120000.123`（UTC 定宽、仅 ASCII、无 Windows 非法字符 `<>:"/\|?*`、
 * 字典序== 时间序）。**禁止**以原始 `toISOString()`（含 `:`）直接落文件名（Windows rename 失败）。
 * 与既有 `dateStamp`（`YYYYMMDD-HHmmss`）语义同为「定宽 + 仅 ASCII + 可排序」，本实现用 UTC 含毫秒
 * 以获得更高时序精度；排序可靠性一致。
 */
export function makeHistoryFilename(now, kind) {
    const stamp = now.toISOString().replace(/[:Z]/g, '');
    const rand = crypto.randomBytes(6).toString('hex');
    return `${stamp}-${rand}.${kind}.json`;
}
// ---------- 解析 ----------
function parseEntry(text) {
    try {
        const p = JSON.parse(text);
        if (p === null || typeof p !== 'object')
            return null;
        if (p.schemaVersion !== MIGRATION_HISTORY_SCHEMA_VERSION)
            return null;
        if (!isValidMigrationKind(p.kind))
            return null;
        if (typeof p.at !== 'string' || p.at === '')
            return null;
        if (!['success', 'failed', 'skipped'].includes(p.result))
            return null;
        if (typeof p.source !== 'string')
            return null;
        if (typeof p.summary !== 'string')
            return null;
        // 可选字段校验
        if (p.operationId !== undefined && !isUuid(p.operationId))
            return null;
        if (p.snapshotId !== undefined && !isUuid(p.snapshotId))
            return null;
        if (p.runId !== undefined && !isUuid(p.runId))
            return null;
        if (p.sections !== undefined && (!Array.isArray(p.sections) || p.sections.some((s) => typeof s !== 'string')))
            return null;
        if (p.error !== undefined && typeof p.error !== 'string')
            return null;
        // **append-only 篡改检测**：contentHash 必须匹配（对除 contentHash 外全字段）。
        // 合法 JSON 内改任意字段值 → hash 不符 → 拒绝（计入 corrupted，不静默接受）。
        if (typeof p.contentHash !== 'string' || p.contentHash === '')
            return null;
        const payload = Object.fromEntries(Object.entries(p).filter(([k]) => k !== 'contentHash'));
        if (sha256Hex(canonicalStringify(payload)) !== p.contentHash)
            return null;
        const { contentHash, ...rest } = p;
        return { ...rest, contentHash };
    }
    catch {
        return null;
    }
}
/** MigrationHistory：per-file append-only 历史存储。 */
export class MigrationStore {
    dir;
    io;
    constructor(opts) {
        this.dir = opts.dir;
        this.io = opts.io ?? defaultIo;
    }
    /** 追加一条历史（原子写）。best-effort：调用方须经 tryAppendHistory 处理失败降级。 */
    async append(raw) {
        try {
            const at = raw.at ?? new Date().toISOString();
            const entry = sanitizeEntry({ ...raw, at });
            // **防覆盖**：目标已存在（同毫秒+同随机后缀碰撞，概率极低但非零）→ 换名，
            // 绝不覆盖既有条目（APPEND-ONLY 硬不变量：条目一旦写入不可改）。
            let filename = makeHistoryFilename(new Date(at), entry.kind);
            let target = path.join(this.dir, filename);
            await this.io.mkdir(this.dir, { recursive: true });
            let guard = 0;
            while (await this.io.exists(target)) {
                if (++guard > 8)
                    return { ok: false, entry, error: 'history filename collision (retry 上限)' };
                filename = makeHistoryFilename(new Date(at + guard), entry.kind);
                target = path.join(this.dir, filename);
            }
            await this.io.writeAll(target, `${JSON.stringify(entry, null, 2)}\n`);
            return { ok: true, entry, file: filename };
        }
        catch (error) {
            const entry = sanitizeEntry({ ...raw, at: raw.at ?? new Date().toISOString() });
            return { ok: false, entry, error: error instanceof Error ? error.message : String(error) };
        }
    }
    /** 读取全部合法历史条目（旧→新；损坏/非史文件跳过并计数）。 */
    async read() {
        const names = await this.io.readdirNames(this.dir).catch(() => []);
        const entries = [];
        const corrupted = [];
        const sorted = names.filter(isHistoryBasename).sort();
        for (const name of sorted) {
            const p = path.join(this.dir, name);
            let text;
            try {
                if ((await this.io.lstat(p))?.isSymbolicLink() === true) {
                    corrupted.push(name);
                    continue;
                } // symlink 防御
                text = await this.io.readFileText(p);
            }
            catch {
                corrupted.push(name);
                continue;
            }
            const parsed = parseEntry(text);
            if (parsed === null) {
                corrupted.push(name);
                continue;
            }
            entries.push(parsed);
        }
        return { entries, corrupted };
    }
    /**
     * 保留清理：按文件名排序删除最旧合法历史文件，幂等。只删合法历史文件（防误删）。
     * 返回本次删除的文件名。
     */
    async retention(limit = DEFAULT_MIGRATION_RETENTION) {
        const names = (await this.io.readdirNames(this.dir).catch(() => [])).filter(isHistoryBasename).sort();
        const removed = [];
        if (names.length <= limit)
            return removed;
        const toRemove = names.slice(0, names.length - limit);
        for (const name of toRemove) {
            try {
                await this.io.rm(path.join(this.dir, name), { force: true });
                removed.push(name);
            }
            catch { /* 单文件删失败不中断其余 */ }
        }
        return removed;
    }
}
// ---------- 查询 / 统计 / 导出（纯函数） ----------
/** 纯函数过滤（无 IO）。 */
export function queryHistory(entries, q) {
    return entries.filter((e) => {
        if (q.kinds !== undefined && q.kinds.length > 0 && !q.kinds.includes(e.kind))
            return false;
        if (q.result !== undefined && q.result.length > 0 && !q.result.includes(e.result))
            return false;
        if (q.sections !== undefined && q.sections.length > 0) {
            if (!e.sections.some((s) => q.sections.includes(s)))
                return false;
        }
        const t = Date.parse(e.at);
        if (!Number.isNaN(t)) {
            if (q.from !== undefined && t < q.from)
                return false;
            if (q.to !== undefined && t > q.to)
                return false;
        }
        return true;
    });
}
/** 纯函数统计（kind/result 计数）。 */
export function summarizeHistory(entries) {
    const stats = { total: entries.length, byKind: {}, byResult: {} };
    for (const e of entries) {
        stats.byKind[e.kind] = (stats.byKind[e.kind] ?? 0) + 1;
        stats.byResult[e.result] = (stats.byResult[e.result] ?? 0) + 1;
    }
    return stats;
}
/** 导出报告（纯函数）。渲染文本统一过 redact() 兜底（安全不变量）。 */
export function renderExport(entries, format, locale = 'zh') {
    const L = locale === 'zh'
        ? { title: 'DSH 配置迁移历史', total: '总数', empty: '暂无迁移记录', kind: '操作', time: '时间', result: '结果', sections: '分区', detail: '摘要' }
        : { title: 'DSH Config Migration History', total: 'Total', empty: 'No migration records', kind: 'Operation', time: 'Time', result: 'Result', sections: 'Sections', detail: 'Summary' };
    const resultLabel = (r) => r === 'success' ? (locale === 'zh' ? '成功' : 'success') : r === 'failed' ? (locale === 'zh' ? '失败' : 'failed') : (locale === 'zh' ? '跳过' : 'skipped');
    if (format === 'json') {
        const stats = summarizeHistory(entries);
        return redact(JSON.stringify({ title: L.title, stats, entries }, null, 2));
    }
    if (entries.length === 0)
        return `# ${L.title}\n\n${L.empty}\n`;
    const lines = [];
    lines.push(`# ${L.title}`, '');
    lines.push(`> ${L.total}: ${entries.length}`, '');
    lines.push('| ' + [L.time, L.kind, L.result, L.sections, L.detail].join(' | ') + ' |');
    lines.push('|' + ' --- |'.repeat(5));
    for (const e of entries) {
        const detail = redact(e.summary + (e.error !== undefined ? ` — ${e.error}` : ''));
        lines.push(`| ${e.at} | ${e.kind} | ${resultLabel(e.result)} | ${redact(e.sections.join(', '))} | ${detail} |`);
    }
    lines.push('');
    return lines.join('\n');
}
/** 解析查询参数为 MigrationQuery（宿主路由复用；过滤非法输入）。 */
export function parseHistoryQuery(raw) {
    const q = {};
    const kinds = parseList(raw['kind']);
    if (kinds.length > 0)
        q.kinds = kinds.filter(isValidMigrationKind);
    const results = parseList(raw['result']);
    if (results.length > 0)
        q.result = results.filter((r) => r === 'success' || r === 'failed' || r === 'skipped');
    const sections = parseList(raw['sections']);
    if (sections.length > 0)
        q.sections = sections;
    const from = parseNum(raw['from']);
    const to = parseNum(raw['to']);
    if (from !== undefined)
        q.from = from;
    if (to !== undefined)
        q.to = to;
    return q;
}
function parseList(v) {
    if (v === undefined)
        return [];
    if (typeof v === 'string')
        return v.split(',').map((s) => s.trim()).filter((s) => s !== '');
    if (Array.isArray(v))
        return v.filter((x) => typeof x === 'string' && x !== '');
    return [];
}
function parseNum(v) {
    if (typeof v === 'string' && v !== '' && !Number.isNaN(Number(v)))
        return Number(v);
    if (typeof v === 'number' && !Number.isNaN(v))
        return v;
    return undefined;
}
//# sourceMappingURL=migration-history.js.map