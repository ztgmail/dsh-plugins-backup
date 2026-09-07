import type { SyncSnapshot, SyncSnapshotMeta, SyncTransport } from '../transport.ts';
import type { MsgFunc } from '../../core/messages.ts';
/** git 命令执行结果（code ≠ 0 = git 命令失败/退出非零） */
export interface GitExecResult {
    stdout: string;
    stderr: string;
    code: number;
}
/** 可注入的 git 执行器（测试 mock 用）；默认实现 = child_process.execFile promise 封装 */
export type GitExecFn = (cmd: string, args: string[], opts: {
    cwd?: string;
    timeoutMs?: number;
}) => Promise<GitExecResult>;
/** 凭据提供者：token 只从这里读取，绝不在任何地方持久化 */
export interface GitCredentialProvider {
    getToken(): Promise<string>;
}
export interface GitAuthor {
    name: string;
    email: string;
}
export interface GitTransportOptions {
    /** 远端私有仓库地址（https/ssh/本地路径）；token 绝不拼入此 URL */
    repoUrl: string;
    /** 本地 git 工作副本目录（不存在则创建；已 clone 则复用） */
    workDir: string;
    /** token 提供者（http(s) 远端必填；本地/ssh 远端不会被调用） */
    credentials: GitCredentialProvider;
    /** 单条 git 命令超时 ms，默认 60000 */
    timeoutMs?: number;
    /** 注入 exec（测试 mock 用）；缺省 = execFile 封装 */
    exec?: GitExecFn;
    /** 提交作者（写入远端历史），默认 DSH Config Sync <sync@dsh.local> */
    author?: GitAuthor;
    /** credential 用户名（GitHub PAT 用 oauth2），默认 'oauth2' */
    credentialUsername?: string;
    /** 消息翻译器（缺省 zh） */
    msg?: MsgFunc;
}
export declare class GitTransportError extends Error {
    constructor(message: string);
}
/** 实现 SyncTransport 的 git 通道。所有操作前 ensureRepo() 保证工作副本就绪，网络命令带凭据。 */
export declare class GitTransport implements SyncTransport {
    readonly type = "git";
    private readonly o;
    private repoReady;
    private privateHint;
    private readonly msg;
    constructor(options: GitTransportOptions);
    /** 最近一次 checkIsPrivate() 的结果；null = 尚未检查 */
    get isPrivateHint(): boolean | null;
    /** 列出远端已有快照（按 createdAt 升序）。读取工作副本 snapshots/（明文散文件）
     *  与 snapshots-encrypted/（密文单文件）两个目录（先 pull 同步远端）。 */
    list(): Promise<SyncSnapshotMeta[]>;
    /**
     * 上传快照：写散文件目录（明文）或密文单文件（加密）→ add → commit → push；
     * 同 id 覆盖；内容无变化时幂等（不产生 commit）。
     * 双形态互斥：同 id 从一种形态切到另一种时先清掉旧形态残留，保证工作副本/远端布局自洽。
     */
    upload(snapshot: SyncSnapshot): Promise<SyncSnapshotMeta>;
    /** 下载快照完整载荷。明文 → 读回散文件目录；加密 → 读回密文单文件。不存在的 id 必须抛错（契约）。 */
    download(id: string): Promise<SyncSnapshot>;
    /** 删除远端快照（明文散文件目录或密文单文件；不存在视为成功，契约）。 */
    delete(id: string): Promise<void>;
    /**
     * 私有仓库可见性探测（结果缓存于 isPrivateHint）：
     * 匿名 ls-remote 成功 → 公开；匿名失败 + 凭据探测成功 → 私有；两者都失败 → 抛错。
     * UI 层可用 isPrivateHint 提示「私有仓库推荐」；公开仓库也可用（内容需自行评估）。
     */
    checkIsPrivate(): Promise<boolean>;
    private ensureRepo;
    /** pull --ff-only 同步远端；无本地提交（全新仓库）或无 upstream 时静默跳过 */
    private pullFromRemote;
    /** 执行 git 命令；withCredential=true 时注入 credential helper（token 不进 argv），失败时错误消息脱敏 */
    private runGit;
    /**
     * 为网络命令构造 credential helper 参数：
     * 仅 http(s) 远端需要 token；本地路径 / ssh 走 git 原生认证（密钥），不调用 provider。
     * token 写入 os.tmpdir() 下临时 store 文件（权限 0600），命令后立即删除 —— 永不落工作副本/远端。
     */
    private buildCredentialArgs;
    /** 从 repoUrl 提取 credential 匹配用的 host[:port] */
    private repoHost;
    /** 读取一次 token（错误消息脱敏用）；非 http(s) 场景返回空 */
    private readTokenOnce;
    /** 错误/日志脱敏：token（原文与 URL 编码两种形态）与 repoUrl 一律替换 */
    private mask;
    private assertSafeId;
    private snapshotDir;
    private snapshotsDir;
    /** 加密快照密文单文件目录（<workDir>/snapshots-encrypted/） */
    private encryptedSnapshotsDir;
    /** 加密快照密文单文件路径（<id>.json） */
    private encryptedSnapshotFile;
    /** 读密文单文件快照（解析失败 → null，调用方跳过，不静默失败整体 list）。 */
    private readEncryptedSnapshotFile;
    /** 读快照目录 manifest.json（结构不合法 → null，调用方跳过） */
    private readDirManifest;
}
