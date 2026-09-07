import type { GitHubForkInfo, GitHubPullRequestInfo, GitHubPullRequestParams, GitHubRepoInfo, GitHubUserInfo } from './github-repos.ts';
import type { GitFileWriter } from './git-file-writer.ts';
import type { MarketPrepareInput, MarketPrepareResult } from './prepare.ts';
import type { MarketPublishMode } from './types.ts';
import type { SectionId } from '../schema/types.ts';
/** 官方收录目标仓库原样复用 t1 常量（github-repos.ts）
 *  —— 与内置市场同一仓库，界面不提供任何修改入口（设计 §2.4 产品决策）。 */
/** 用户公开仓库固定名：<login>/dsh-configs（系统按规则生成，不可配置） */
export declare const USER_CONFIGS_REPO = "dsh-configs";
/** 用户仓库 index.json 的名称/描述（展示用） */
export declare const USER_INDEX_NAME = "\u6211\u7684\u914D\u7F6E\u4ED3\u5E93";
/** PR 分支固定名模式：dsh-market-sync/<itemId>（收录） */
export declare const PR_BRANCH_PREFIX = "dsh-market-sync";
/** 下架 PR 分支固定名模式：dsh-market-delist/<itemId>（删除已收录条目；独立分支避免与收录分支混淆，
 *  防止 listItems 的 pr-pending 判定把下架 PR 误判为收录待审、以及删除后重传时 PR 复用错乱） */
export declare const DELIST_BRANCH_PREFIX = "dsh-market-delist";
/** 由 itemId 生成 PR 分支名（固定模式，同条目复用同一分支：未合并 force push 更新、已合并基于最新 main 重开） */
export declare function prBranchFor(itemId: string): string;
/** 由 itemId 生成下架 PR 分支名（删除已收录条目时用；独立于收录分支） */
export declare function delistBranchFor(itemId: string): string;
/** 用户公开仓库 URL（https 形态，绝不携带凭据） */
export declare function userConfigsRepoUrl(login: string): string;
/** 条目收录状态：未收录（本地独有）｜ PR 待审核（带 PR 链接）｜ 已收录（官方市场 index 含该 id） */
export type MyItemStatus = 'not-listed' | 'pr-pending' | 'listed';
/** 上传表单：仅用户填写的描述性内容；id/author/version/updatedAt/repoUrl 全自动 */
export interface MyRepoForm {
    /** 配置名（预填 zip 文件名，可改）；id 由其派生稳定 slug */
    name: string;
    /** 显式目标条目 id（**仅 update 模式**用：由列表「更新」按钮预填，避免靠 name→slug 猜测匹配；
     *  上传（新条目）时省略；后端校验存在性，缺省回退 name slug 匹配（向后兼容） */
    id?: string;
    description?: string;
    categories?: string[];
    /** 发布模式（F6 迁移/分享双模式）：'share' 时 prepare 走分享强制拦截（排除设备/平台分区 + 保守档隐私扫描）；
     *  缺省 undefined = migrate（迁移全带，行为与历史一致）。 */
    mode?: MarketPublishMode;
}
/** 收录流程状态：pending=已提交、后台处理中；done=已提交收录（PR 已开/复用）；failed=收录失败可重试 */
export type ListingState = 'pending' | 'done' | 'failed';
/**
 * upload / update 返回（ok=false 时携带已脱敏 error + errorCode）。
 * 流程拆分（2026-08-20 优化）：upload/update 只同步执行「推用户仓库」并立即返回
 * （listing='pending'），「收录流程」（fork + 官方 index + PR）在后台异步执行，
 * 避免 GitHub fork 排队时整个上传请求长时间挂起；收录结果经 listingStatus /
 * /me/items 状态徽章查询。
 */
export interface UploadResult {
    ok: boolean;
    itemId: string;
    version: string;
    sha256: string;
    sections: SectionId[];
    /** 用户公开仓库 URL（https://github.com/<login>/dsh-configs） */
    repoUrl: string;
    /** 收录 PR 编号（异步模式下收起完成前为 null；完成经 listingStatus 查询） */
    prNumber: number | null;
    /** 收录 PR 链接（同上） */
    prUrl: string | null;
    warnings: string[];
    /** 收录流程状态：ok=true 且上传成功后为 'pending'（后台进行中）；失败无收录流程时 'done' 无意义 */
    listing: ListingState;
    /** listing='failed' 时：收录失败原因（已脱敏，含重试指引） */
    listingError?: string;
    /** ok=false 时：可展示错误（已脱敏，无 token 形态） */
    error?: string;
    /** ok=false 时：错误分类码（unauthorized/prepare_failed/...；无则 'internal'） */
    errorCode?: string;
}
/** POST /me/listing 响应：收录任务状态（结果卡轮询用，比拉全列表更轻） */
export interface ListingStatusResponse {
    itemId: string;
    listing: ListingState;
    /** listing='done' 时：PR 编号 */
    prNumber: number | null;
    /** listing='done' 时：PR 链接 */
    prUrl: string | null;
    /** listing='failed' 时：失败原因（已脱敏） */
    error?: string;
}
/** POST /me/delete 响应：删除条目结果 */
export interface DeleteResult {
    ok: boolean;
    itemId: string;
    /** 是否已异步提交「下架 PR」（条目此前已收录进官方市场时 true） */
    delisted: boolean;
    /** 被关闭的收录 PR（条目处于待审核、有 open PR 时关闭它） */
    prNumber: number | null;
    /** 被关闭 PR 的链接（同上） */
    prUrl: string | null;
    warnings: string[];
    /** ok=false 时：可展示错误（已脱敏） */
    error?: string;
    /** ok=false 时：错误分类码（item_not_found/unauthorized/...） */
    errorCode?: string;
}
/** listItems 条目：用户仓库 index.json 条目 + 收录状态 */
export interface MyItemEntry {
    id: string;
    name: string;
    version?: string;
    description?: string;
    author?: string;
    updatedAt?: string;
    categories?: string[];
    status: MyItemStatus;
    /** status=pr-pending 时：PR 链接 */
    prUrl?: string;
    /** 用户公开仓库 URL */
    repoUrl: string;
    /** 用户公开仓库（<login>/dsh-configs）的 star 数（仓库级；undefined = 无数据） */
    stars?: number;
}
/**
 * MyRepoService 需要的 GitHub REST 子集（GitHubAuthRest 结构兼容；测试用普通对象 mock）。
 * 类型用接口而非具体类，便于 plain-object mock 注入。
 */
export interface GitHubRestLike {
    getUser(): Promise<GitHubUserInfo>;
    repoExists(owner: string, repo: string): Promise<boolean>;
    createPublicRepo(name: string, description?: string): Promise<GitHubRepoInfo>;
    ensureFork(owner: string, repo: string): Promise<GitHubForkInfo>;
    readFile(owner: string, repo: string, path: string, ref?: string): Promise<string | null>;
    /** 读仓库 star 数（带 token；「我的配置」页展示自己仓库 star 用；404 → null） */
    getRepoStars(owner: string, repo: string): Promise<number | null>;
    openPullRequest(params: GitHubPullRequestParams): Promise<GitHubPullRequestInfo>;
    listOpenPullRequests(owner: string, repo: string, head?: string): Promise<GitHubPullRequestInfo[]>;
    /** 关闭 PR（删除条目时关闭待审核的收录 PR） */
    closePullRequest(owner: string, repo: string, number: number): Promise<GitHubPullRequestInfo>;
}
export interface MyRepoServiceOptions {
    /** 8 道校验 + 秘密扫描（复用 prepareMarketItem；测试 mock；抛 MarketPrepareError 视为校验失败） */
    prepare: (input: MarketPrepareInput) => MarketPrepareResult;
    /** GitHub REST 薄客户端（复用 GitHubAuthRest 或 mock） */
    rest: GitHubRestLike;
    /** git 文件写入器（缺省用 tokenProvider 构造真实 GitFileWriterClient；测试注入 mock） */
    gitWriter?: GitFileWriter;
    /** token 提供者（真实 gitWriter 缺省构造用；与 rest/gitWriter 的 token 同源） */
    tokenProvider: () => Promise<string>;
    /** 时钟（updatedAt 生成用）；缺省 new Date() */
    now?: () => Date;
    /** 工作副本根目录（缺省 os.tmpdir()/dsh-config-manager-my-configs）；测试注入隔离目录 */
    workDirRoot?: string;
}
/** MyRepoService 可预期错误（错误码供上层分类） */
export declare class MyRepoError extends Error {
    readonly code: string;
    constructor(message: string, code?: string);
}
/** 后台市场任务动作：list=收录（写官方 index + 提收录 PR）；delist=下架（从官方 index 移除 + 提下架 PR） */
export type ListingAction = 'list' | 'delist';
/** 后台市场任务（收录/下架共用同一管道；内存 Map<itemId, job>，进程重启后丢失，靠 relist/删除重新提交） */
export interface ListingJob {
    action: ListingAction;
    login: string;
    itemId: string;
    version: string;
    /** 用户公开仓库 URL（条目内容托管地） */
    repoUrl: string;
    status: ListingState;
    prNumber: number | null;
    prUrl: string | null;
    /** status='failed' 时：失败原因（已脱敏） */
    error: string | null;
    startedAt: number;
    finishedAt: number | null;
}
/** name → 稳定安全 itemId：小写、非字母数字折叠为 -、字母数字开头、去头尾分隔符；空 → config-<hash> */
export declare function slugifyItemId(name: string): string;
/** 冲突自动加后缀（设计：id=name 稳定 slug，同名已存在 → my-config-2 / -3 ...） */
export declare function uniqueItemId(base: string, existing: readonly string[]): string;
/** 版本纯自动 +1：最后一个数字段 +1；非数字尾 → 追加 .1 */
export declare function bumpVersion(version: string): string;
export declare class MyRepoService {
    private readonly prepare;
    private readonly rest;
    private readonly gitWriter;
    private readonly tokenProvider;
    private readonly now;
    private readonly workDirRoot;
    /** 后台市场任务表（收录/下架；key=itemId；内存态，重启丢失 → 列表状态徽章回退 + relist/删除可重提） */
    private readonly listingJobs;
    /** 同一 login 的「写用户仓库」串行队列（user-<login> 工作副本共享；上传/删除并发时防踩踏） */
    private readonly loginWriteQueues;
    constructor(options: MyRepoServiceOptions);
    /** 一键上传：新条目（version 1.0.0；同名冲突自动加后缀）。 */
    upload(params: {
        zipBytes: Uint8Array;
        form: MyRepoForm;
    }): Promise<UploadResult>;
    /** 一键更新：id 保持不变、version 纯自动 +1、updatedAt 刷新；名称变化视为新条目。 */
    update(params: {
        zipBytes: Uint8Array;
        form: MyRepoForm;
    }): Promise<UploadResult>;
    /** 列出已上传条目（读用户仓库 index.json）+ 收录状态（官方 index / open PR）+ 自己仓库 star。 */
    listItems(): Promise<MyItemEntry[]>;
    /**
     * 查询收录/下架任务状态。
     * 内存任务表命中 → 直接返回；未命中（进程重启 / 从未提交）→ 回退 GitHub 实况推导：
     * 官方 index 含该 id → done（已收录）；存在 open 收录 PR → done（带 PR 链接）；否则 null。
     */
    listingStatus(itemId: string): Promise<ListingStatusResponse | null>;
    /** 重新提交收录（收录失败 / 进程重启丢失后的一键重试）：幂等 —— 已有 pending 任务直接复用，不再重复启动 */
    relist(itemId: string): Promise<ListingStatusResponse>;
    /** 等待任务终态（测试辅助 / 需要同步等待的场景；超时抛 internal 错误） */
    waitForListing(itemId: string, timeoutMs?: number): Promise<ListingStatusResponse>;
    /**
     * 删除已上传条目：
     * ① 从用户仓库 index.json 移除条目 + 删除 items/<itemId>/ 目录（同步，秒级）
     * ② 收录状态处理：
     *    - 已收录进官方市场（listed）→ 后台异步提「下架 PR」（从官方 index 移除，独立 delist 分支）
     *    - 有待审核的收录 open PR → 同步关闭该 PR
     *    - 未收录 / 无 PR → 无额外操作
     * 返回 DeleteResult（ok=false 时携带已脱敏 error + errorCode）。
     */
    deleteItem(itemId: string): Promise<DeleteResult>;
    private runPublish;
    /** ⑥ 写用户仓库工作副本（隔离方法，便于单测断言 gitWriter 调用） */
    private gitWriterManifestSync;
    /** 读用户仓库最新 index.json；文件不存在（未上传过）→ 空索引；无法解析 → 中止（防覆盖写坏） */
    private readUserIndex;
    /** 读官方市场 index.json（公开仓库 contents API）；缺失/无法解析 → 中止 */
    private readOfficialIndex;
    /** prepare 生成的 manifestText 解析回对象（受控字段）；异常 → 内部错误 */
    private parsePreparedManifest;
    /** ⑤ ensure 用户仓库：存在 → 返回已知信息；不存在 → createPublicRepo（公开，系统命名） */
    private ensureUserRepo;
    /** ⑨ ensure PR：open PR（head=<login>:<branch>）存在 → 复用；否则 openPullRequest(base=main)。
     *  action='delist' 时标题/正文为下架语义（分支用 delistBranchFor，head 过滤天然隔离）。 */
    private ensurePullRequest;
    /** 启动后台任务（fire-and-forget）：同 itemId 已有 pending 任务 → 不重复启动（幂等） */
    private launchListing;
    /**
     * 后台任务主体（收录/下架共用管道）：
     * 读用户仓库条目 → ensureFork（复用/新建+轮询就绪）→ 读官方 index → 改（收录 upsert 带 repo /
     * 下架 remove）→ 写 fork 分支（workDir 按 itemId 隔离，防并发踩踏）force push → 开/复用 PR。
     */
    private finishListing;
    /** job → ListingStatusResponse（错误文本 redact 兜底） */
    private toListingStatus;
    /** 同一 login 的「写用户仓库」串行化（user-<login> 工作副本共享；上传/删除并发防踩踏）。
     *  前一个操作失败不阻塞队列：catch 吞掉错误只作为队列锚点，真实错误已由调用方处理。 */
    private withLoginLock;
    private userWorkDir;
    /** fork 工作副本按 itemId 隔离（fork-<login>/<itemId>）：不同条目的后台收录/下架并发操作互不踩踏 */
    private forkWorkDir;
}
