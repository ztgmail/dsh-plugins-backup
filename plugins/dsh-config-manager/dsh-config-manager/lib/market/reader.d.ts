import type { SnapshotFs } from '../sync/fs.ts';
import type { GitExecResult } from '../sync/git/git-transport.ts';
import type { MsgFunc } from '../core/messages.ts';
/** 可注入 git 执行器（与 git-transport GitExecFn 同构；测试 mock 用） */
export type MarketGitExecFn = (cmd: string, args: string[], opts: {
    cwd?: string;
    timeoutMs?: number;
}) => Promise<GitExecResult>;
export declare class MarketReaderError extends Error {
    constructor(message: string);
}
/** 只读市场读取通道接口（§4.1） */
export interface MarketReader {
    /** 拉取市场目录（拉最新 index.json；返回原文 + 拉取时间） */
    readIndex(opts: {
        url: string;
        workDir: string;
    }): Promise<{
        text: string;
        fetchedAt: string;
    }>;
    /** 拉取单条目 manifest.json（返回 raw 文本）；repo 可选：条目来源仓库，缺省 = url（市场仓库） */
    readItemManifest(opts: {
        url: string;
        workDir: string;
        itemId: string;
        repo?: string;
    }): Promise<{
        text: string;
    }>;
    /** 拉取单条目 config.zip（返回 bytes）；repo 可选：条目来源仓库，缺省 = url（市场仓库） */
    readItemZip(opts: {
        url: string;
        workDir: string;
        itemId: string;
        repo?: string;
    }): Promise<{
        data: Uint8Array;
    }>;
}
export interface GitMarketReaderOptions {
    /** git 可执行文件名/路径，默认 'git' */
    gitBin?: string;
    /** 单条 git 命令超时 ms，默认 60000 */
    timeoutMs?: number;
    /** 注入 exec（测试 mock 用）；缺省 = execFile 封装 */
    exec?: MarketGitExecFn;
    /** 注入 fs 门面（测试 mock 用） */
    fsx?: SnapshotFs;
    /** 消息翻译器（缺省 zh） */
    msg?: MsgFunc;
}
/** 只读 git 市场读取通道实现 */
export declare class GitMarketReader implements MarketReader {
    private readonly gitBin;
    private readonly timeoutMs;
    private readonly exec;
    private readonly fsx;
    private readonly msg;
    constructor(options?: GitMarketReaderOptions);
    /**
     * 拉取市场目录。首次 clone --depth 1 到 workDir；已存在副本则 pull --ff-only。
     * 返回 index.json 原文 + 拉取时间（ISO-8601）。
     */
    readIndex(opts: {
        url: string;
        workDir: string;
    }): Promise<{
        text: string;
        fetchedAt: string;
    }>;
    /**
     * 拉取单条目 L2 manifest.json 原文。
     * repo 存在时从条目来源仓库读取（读取目录 = repo ?? url；workDir 由调用方按来源仓库
     * url-hash 分目录，天然隔离），index.json 永远从市场仓库读（不变）。
     */
    readItemManifest(opts: {
        url: string;
        workDir: string;
        itemId: string;
        repo?: string;
    }): Promise<{
        text: string;
    }>;
    /** 拉取单条目 L3 config.zip 字节（repo 语义同 readItemManifest）。 */
    readItemZip(opts: {
        url: string;
        workDir: string;
        itemId: string;
        repo?: string;
    }): Promise<{
        data: Uint8Array;
    }>;
    /** 确保本地工作副本就绪：首次 clone --depth 1；已有 .git 则 pull --ff-only 同步远端。 */
    private ensureRepo;
    private runGit;
    /** 错误脱敏：公开 URL 无可泄 token，但保留通用脱敏（防御 url 意外含凭据）。 */
    private mask;
}
/** 校验市场仓库地址（validateRepoUrl + 强制 http(s)，拒绝 git@/ssh）；非法抛错。 */
export declare function validateMarketUrl(url: string): void;
