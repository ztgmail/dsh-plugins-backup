import type { GitAuthor, GitCredentialProvider, GitExecFn } from '../sync/git/git-transport.ts';
/** 单条写入条目：仓库相对路径（正斜杠；自动建父目录）+ 内容（string → UTF-8，Uint8Array → 原样） */
export interface GitFileWriteEntry {
    path: string;
    content: string | Uint8Array;
}
/** writeFiles 调用参数 */
export interface GitFileWriteCall {
    /** 目标仓库 https 地址（token 绝不拼入；过 validateRepoUrl） */
    repoUrl: string;
    /** 本地 git 工作副本目录（不存在则 clone；已存在则 pull --ff-only） */
    workDir: string;
    /** 要写入的文件 */
    entries: GitFileWriteEntry[];
    /** commit message */
    commitMessage: string;
    /** 目标分支：指定则 checkout -B（PR 分支场景）；缺省 = 默认分支直接提交推送 */
    branch?: string;
    /** 分支基点（如 'upstream/main'）；branch 提供且缺省 baseRef 时按 origin/main → origin/master 探测 */
    baseRef?: string;
    /** 额外远端（官方仓库）：clone fork 后 add upstream + fetch 官方 main，供 baseRef 使用 */
    upstreamUrl?: string;
    /** force push 用（PR 分支更新场景）：--force-with-lease */
    force?: boolean;
}
/** writeFiles 结果：pushed=false = 内容无变化（幂等，不产生 commit/push） */
export interface GitFileWriterResult {
    pushed: boolean;
    /** 实际推送的分支（未指定分支时 'default'） */
    branch: string;
}
/** 通用 git 文件写入器契约（MyRepoService 依赖注入点；测试 mock 用） */
export interface GitFileWriter {
    writeFiles(call: GitFileWriteCall): Promise<GitFileWriterResult>;
}
/** createGitFileWriter 选项 */
export interface CreateGitFileWriterOptions {
    /** token 提供者（必填；http(s) 远端经 credential helper 注入） */
    credentials: GitCredentialProvider;
    /** 注入 exec（测试 mock 用）；缺省 = execFile 封装 */
    exec?: GitExecFn;
    /** 单条 git 命令超时 ms，默认 60000 */
    timeoutMs?: number;
    /** 提交作者（写入远端历史） */
    author?: GitAuthor;
}
export declare class GitFileWriterError extends Error {
    constructor(message: string);
}
/** 实现 GitFileWriter 的真实 git 写入器（安全模式与 GitTransport 一致）。 */
export declare class GitFileWriterClient implements GitFileWriter {
    private readonly credentials;
    private readonly gitBin;
    private readonly timeoutMs;
    private readonly exec;
    private readonly author;
    private readonly credentialUsername;
    constructor(options: CreateGitFileWriterOptions);
    /**
     * 写文件并推送：
     * 1. ensureRepo：工作副本不存在 → clone（带凭据）；存在 → pull --ff-only（无 tracking 静默跳过）；
     * 2. upstreamUrl → ensureUpstream（add upstream + fetch 官方 main，公开仓库匿名只读）；
     * 3. branch 指定 → checkout -B <branch> <baseRef ?? 远端默认分支探测>；
     * 4. 写文件（自动建目录）→ add → diff --cached --quiet（无变化 → 返回 pushed:false 幂等）→ commit → push；
     * 5. push：branch → push -u origin <branch> [--force-with-lease]；否则 push -u origin HEAD。
     */
    writeFiles(call: GitFileWriteCall): Promise<GitFileWriterResult>;
    /**
     * 执行 git 命令；withCredential=true 时注入 credential helper store（token 不进 argv），
     * 失败时错误消息经 mask 脱敏。
     */
    private runGit;
    /**
     * 为网络命令构造 credential helper 参数：token 写入 os.tmpdir() 下临时 store 文件
     * （权限 0600），命令后立即删除 —— 永不落工作副本/远端/日志。
     */
    private buildCredentialArgs;
    /** 确保工作副本就绪：克隆（带凭据）或 pull --ff-only（无 tracking 静默跳过）。 */
    private ensureRepo;
    /** 添加 upstream（官方仓库）并 fetch 官方 main（公开仓库匿名只读，零凭据）。 */
    private ensureUpstream;
    /** 探测远端默认分支（origin/main → origin/master）；找不到抛错。 */
    private detectDefaultBase;
}
/** createGitFileWriter 工厂（MyRepoService 缺省 gitWriter 与路由层装配用） */
export declare function createGitFileWriter(options: CreateGitFileWriterOptions): GitFileWriter;
