/** GitHub REST API v3 基址 */
export declare const GITHUB_API_BASE = "https://api.github.com";
/**
 * 官方收录目标仓库（产品决策 2026-08-20，docs/design/2026-08-20-my-configs-design.md §2.4）：
 * 收录 / PR 相关目标**固定**为 xiajiajun516/dsh-config-market，写死常量、界面不提供任何修改入口。
 * 与 src/market/builtin.ts 的内置市场为同一仓库（内置市场 URL 可经 env 覆盖仅用于浏览，
 * 收录目标不受 env 影响，恒为官方仓库）。
 */
export declare const MARKET_UPSTREAM_OWNER = "xiajiajun516";
/** 官方收录目标仓库名（见 MARKET_UPSTREAM_OWNER） */
export declare const MARKET_UPSTREAM_REPO = "dsh-config-market";
/** GET /user 的投影（只保留编排 / UI 需要的最小字段，不携带任何凭据） */
export interface GitHubUserInfo {
    login: string;
    id: number;
    name?: string;
}
/** 仓库元信息投影（cloneUrl 为 https 形态，token 绝不拼入） */
export interface GitHubRepoInfo {
    fullName: string;
    htmlUrl: string;
    cloneUrl: string;
    defaultBranch: string;
    private: boolean;
    fork: boolean;
}
/** fork 就绪后的元信息（ensureFork 返回；cloneUrl 供 GitTransport 使用） */
export interface GitHubForkInfo {
    fullName: string;
    htmlUrl: string;
    cloneUrl: string;
    defaultBranch: string;
}
/** PR 信息投影（openPullRequest / listOpenPullRequests 返回） */
export interface GitHubPullRequestInfo {
    number: number;
    htmlUrl: string;
    title: string;
    /** PR 源分支（head.ref；跨仓库 head 过滤的 `<login>:<branch>` 拼接由调用方负责） */
    head: string;
    state: string;
    merged: boolean;
}
/** POST /pulls 入参；owner/repo 缺省指向固定官方收录仓库（MARKET_UPSTREAM_OWNER/REPO） */
export interface GitHubPullRequestParams {
    base: string;
    head: string;
    title: string;
    body?: string;
    owner?: string;
    repo?: string;
}
/** GitHubAuthRest 构造选项：tokenProvider 必填，其余全部可注入（测试 mock 用） */
export interface GitHubAuthRestOptions {
    /** 取当前 GitHub access token（宿主侧经 credentials.resolve(credentialRef(...)) 提供） */
    tokenProvider: () => Promise<string>;
    /** 可注入 fetcher（测试 mock 用）；缺省 = global fetch */
    fetcher?: typeof fetch;
    /** 可注入时钟（epoch ms；fork 轮询超时判定用）；缺省 = Date.now */
    now?: () => number;
    /** fork 就绪轮询间隔（毫秒）；缺省 5000；测试可设 0 避免真实等待 */
    pollIntervalMs?: number;
    /** fork 就绪轮询超时（毫秒）；缺省 300000（后台异步收录，不阻塞用户） */
    pollTimeoutMs?: number;
}
/**
 * GitHub REST 可预期错误：status = HTTP 状态（网络层 / 内部错误无），code 可分类消费。
 * message 已过 redact() 脱敏，绝不内嵌 token 形态内容。
 */
export declare class GitHubApiError extends Error {
    readonly code: string;
    readonly status: number | undefined;
    constructor(message: string, code: string, status?: number);
}
/**
 * GitHub REST 薄客户端。
 * 无状态（token 由 tokenProvider 每次现取），fetch / 时钟 / 轮询参数可注入。
 */
export declare class GitHubAuthRest {
    private readonly tokenProvider;
    private readonly fetcher;
    private readonly now;
    private readonly pollIntervalMs;
    private readonly pollTimeoutMs;
    constructor(options: GitHubAuthRestOptions);
    /** 验证 token 并取回当前用户（/me/status 与 ensureFork 的前置）。401 → unauthorized。 */
    getUser(): Promise<GitHubUserInfo>;
    /** 仓库是否存在：200 → true；404 → false；其余状态抛 GitHubApiError。 */
    repoExists(owner: string, repo: string): Promise<boolean>;
    /** 创建公开仓库（POST /user/repos；private:false + auto_init:true 保证有初始 commit 可 clone）。 */
    createPublicRepo(name: string, description?: string): Promise<GitHubRepoInfo>;
    /**
     * 确保存在「当前用户 fork 的 <owner>/<repo>」：
     * 1. 优先复用：直查 GET /repos/<login>/<repo>，校验 fork:true + parent.full_name 匹配
     *    （不翻上游 forks 分页列表，避免 per_page=100 上限下旧 fork 被挤出首页而漏检）→ 直接返回；
     * 2. 否则创建 fork（POST /forks，异步）并轮询 GET /repos/<login>/<repo> 直到就绪
     *    （owner.login 匹配 + fork:true + parent 匹配）；超时抛可重试错误（fork_timeout）。
     */
    ensureFork(owner: string, repo: string): Promise<GitHubForkInfo>;
    /**
     * 读仓库内文本文件（contents API，base64 解码为 UTF-8）。
     * 404（文件不存在）→ null；路径是目录 / 非文件 → not_a_file；其余错误抛 GitHubApiError。
     */
    readFile(owner: string, repo: string, path: string, ref?: string): Promise<string | null>;
    /**
     * 读仓库 star 数（stargazers_count）。带 token 通道（「我的配置」页用，登录态 5000 次/小时）。
     * 404（仓库不存在）→ null；其余错误抛 GitHubApiError。
     */
    getRepoStars(owner: string, repo: string): Promise<number | null>;
    /**
     * 读仓库 star 数（stargazers_count）。**匿名通道（不注入 token）** —— 市场浏览页专用：
     * `/market/browse` 不触碰任何凭据（安全不变式：市场端点无 token），star 属公开数据，
     * 匿名 REST 限额（60 次/小时）配合 StarCache 去重 + TTL 足够。404 → null。
     */
    getRepoStarsPublic(owner: string, repo: string): Promise<number | null>;
    /** 开 PR（POST /pulls）；owner/repo 缺省 = 固定官方收录仓库。 */
    openPullRequest(params: GitHubPullRequestParams): Promise<GitHubPullRequestInfo>;
    /** 关闭 PR（PATCH /pulls/{number}，state=closed）；返回关闭后的 PR 信息。 */
    closePullRequest(owner: string, repo: string, number: number): Promise<GitHubPullRequestInfo>;
    /** 列 open PR（GET /pulls?state=open）；head 可选（跨仓库形态 `<login>:<branch>`，URL 编码传入）。 */
    listOpenPullRequests(owner: string, repo: string, head?: string): Promise<GitHubPullRequestInfo[]>;
    /**
     * 直查用户自己的同名仓库（GET /repos/<login>/<repo>）判断是否已是本上游的 fork：
     * - 404 → null（无 fork，需创建）；
     * - 200 + fork:true + parent.full_name 匹配 → 返回 fork 信息（复用）；
     * - 200 + fork:false 或 parent 不匹配（同名但非本上游 fork）→ 抛 fork_name_conflict
     *   （此时既不能复用也不能再 fork——同名仓库已存在，GitHub 会以同名冲突拒绝）。
     */
    private findOwnFork;
    /** 解析直查响应并校验「是本上游的 fork」；不满足 → fork_name_conflict。 */
    private tryReadOwnFork;
    /** 创建 fork（POST /forks）。GitHub 异步执行，返回 202/200 即视为已接受，就绪状态由轮询确认。 */
    private createFork;
    /** 轮询 GET /repos/<login>/<repo> 直到 fork 就绪（owner.login 匹配 + fork:true + parent 匹配）。 */
    private waitForkReady;
    /** 解析一次轮询响应；未就绪（结构不完整 / owner 未出现 / parent 未匹配）→ null 继续等。 */
    private tryReadForkInfo;
    /** 统一请求管道：注入 token（Bearer 头）、Accept、API 版本；网络异常 → network_error（消息脱敏）。 */
    private request;
    /**
     * 匿名请求管道（**不注入 token / authorization 头**）：仅用于读取公开数据
     * （仓库 star 数等），守住「市场端点零凭据」安全不变式。网络异常 → network_error（消息脱敏）。
     */
    private requestPublic;
    /** 解析仓库响应 → stargazers_count（非负有限数）；404 → null；缺失/非法 → invalid_response。 */
    private parseStars;
    /** 请求 + 2xx 校验 + JSON 解析（空体 → undefined）。非 2xx → apiError。 */
    private requestJson;
    /** 非 2xx → 分类 GitHubApiError：提取 GitHub message + 脱敏（token 形态必被掩码）。 */
    private apiError;
}
