/**
 * m-market：市场只读读取通道（MarketReader / GitMarketReader）。
 *
 * 与 docs/design/marketplace.md §4 对齐：
 * - 市场用「只读 git fetch」，不复用 GitTransport 的写路径（commit/push/snapshots/<id>/ 布局）；
 * - 复用点：git 命令执行层（execFile promise 封装 / 脱敏 mask / SnapshotFs）+ validateRepoUrl；
 * - 每次读取：ensureRepo() 首次 git clone --depth 1，已存在副本则 git pull --ff-only；
 * - 默认公开市场不注入凭据（repoUrl 拒绝 userinfo）；二期私有市场才走 token credential helper；
 * - itemId 必须过 assertSafeItemId（防 items/<id>/ 越界）；
 * - 条目级来源仓库（方案 B，docs/design/2026-08-19-market-publish-design.md §3.2）：
 *   readItemManifest/readItemZip 接受可选 repo，读取目录 = repo ?? url；workDir 由调用方按
 *   来源仓库 url-hash 分目录，index.json 永远从市场仓库读。
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import { createSnapshotFs, joinFs } from "../sync/fs.js";
import { validateMarketRepoUrl } from "./url.js";
import { zhMsg } from "../core/messages.js";
import { assertSafeItemId } from "./types.js";
const execFileAsync = promisify(execFile);
const defaultExec = async (cmd, args, opts) => {
    try {
        const { stdout, stderr } = await execFileAsync(cmd, args, {
            cwd: opts.cwd,
            timeout: opts.timeoutMs,
            maxBuffer: 16 * 1024 * 1024,
            windowsHide: true,
            encoding: 'utf8',
        });
        return { stdout: String(stdout), stderr: String(stderr), code: 0 };
    }
    catch (err) {
        const e = err;
        return {
            stdout: String(e.stdout ?? ''),
            stderr: String(e.stderr ?? (err instanceof Error ? err.message : String(err))),
            code: typeof e.code === 'number' ? e.code : 1,
        };
    }
};
export class MarketReaderError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MarketReaderError';
    }
}
/** 只读 git 市场读取通道实现 */
export class GitMarketReader {
    gitBin;
    timeoutMs;
    exec;
    fsx;
    msg;
    constructor(options = {}) {
        this.gitBin = options.gitBin ?? 'git';
        this.timeoutMs = options.timeoutMs ?? 60_000;
        this.exec = options.exec ?? defaultExec;
        this.fsx = options.fsx ?? createSnapshotFs();
        this.msg = options.msg ?? zhMsg;
    }
    /**
     * 拉取市场目录。首次 clone --depth 1 到 workDir；已存在副本则 pull --ff-only。
     * 返回 index.json 原文 + 拉取时间（ISO-8601）。
     */
    async readIndex(opts) {
        validateMarketUrl(opts.url);
        await this.ensureRepo(opts.url, opts.workDir);
        const abs = joinFs(opts.workDir, 'index.json');
        if (!(await this.fsx.exists(abs))) {
            throw new MarketReaderError(this.msg('market.missingIndex', { url: opts.url }));
        }
        const raw = Buffer.from(await this.fsx.readFile(abs)).toString('utf8');
        return { text: raw, fetchedAt: new Date().toISOString() };
    }
    /**
     * 拉取单条目 L2 manifest.json 原文。
     * repo 存在时从条目来源仓库读取（读取目录 = repo ?? url；workDir 由调用方按来源仓库
     * url-hash 分目录，天然隔离），index.json 永远从市场仓库读（不变）。
     */
    async readItemManifest(opts) {
        assertSafeItemId(opts.itemId);
        validateMarketUrl(opts.url);
        const sourceUrl = opts.repo ?? opts.url;
        if (opts.repo !== undefined)
            validateMarketUrl(opts.repo);
        await this.ensureRepo(sourceUrl, opts.workDir);
        const abs = joinFs(opts.workDir, `items/${opts.itemId}/manifest.json`);
        if (!(await this.fsx.exists(abs))) {
            throw new MarketReaderError(this.msg('market.missingManifest', { id: opts.itemId }));
        }
        const raw = Buffer.from(await this.fsx.readFile(abs)).toString('utf8');
        return { text: raw };
    }
    /** 拉取单条目 L3 config.zip 字节（repo 语义同 readItemManifest）。 */
    async readItemZip(opts) {
        assertSafeItemId(opts.itemId);
        validateMarketUrl(opts.url);
        const sourceUrl = opts.repo ?? opts.url;
        if (opts.repo !== undefined)
            validateMarketUrl(opts.repo);
        await this.ensureRepo(sourceUrl, opts.workDir);
        const abs = joinFs(opts.workDir, `items/${opts.itemId}/config.zip`);
        if (!(await this.fsx.exists(abs))) {
            throw new MarketReaderError(this.msg('market.missingZip', { id: opts.itemId }));
        }
        return { data: await this.fsx.readFile(abs) };
    }
    /* ---------------- 内部实现 ---------------- */
    /** 确保本地工作副本就绪：首次 clone --depth 1；已有 .git 则 pull --ff-only 同步远端。 */
    async ensureRepo(url, workDir) {
        const fsx = this.fsx;
        if (await fsx.exists(path.join(workDir, '.git'))) {
            const res = await this.runGit(['pull', '--ff-only'], { cwd: workDir });
            if (res.code !== 0) {
                // 无 upstream / 全新分支等 → 静默跳过（内容可能已是最新或本地有未跟踪改动）
                if (/no tracking information/i.test(res.stderr))
                    return;
                throw new MarketReaderError(this.msg('market.pullFailed', { err: this.mask(res.stderr, url) }));
            }
            return;
        }
        await fsx.mkdir(workDir);
        const entries = await fsx.readdir(workDir);
        if (entries.length > 0) {
            throw new MarketReaderError(this.msg('market.workDirNotRepo', { dir: workDir }));
        }
        // 只读方针：--depth 1 兜底体积；公开市场无凭据（repoUrl 已拒绝 userinfo）
        const res = await this.runGit(['clone', '--depth', '1', url, '.'], { cwd: workDir });
        if (res.code !== 0) {
            throw new MarketReaderError(this.msg('market.cloneFailed', { err: this.mask(res.stderr, url) }));
        }
    }
    async runGit(args, opts) {
        return this.exec(this.gitBin, args, { cwd: opts.cwd, timeoutMs: this.timeoutMs });
    }
    /** 错误脱敏：公开 URL 无可泄 token，但保留通用脱敏（防御 url 意外含凭据）。 */
    mask(text, url) {
        return text.split(url).join('[REPO_URL]');
    }
}
/** 校验市场仓库地址（validateRepoUrl + 强制 http(s)，拒绝 git@/ssh）；非法抛错。 */
export function validateMarketUrl(url) {
    const err = validateMarketRepoUrl(url);
    if (err !== null)
        throw new MarketReaderError(err);
}
//# sourceMappingURL=reader.js.map