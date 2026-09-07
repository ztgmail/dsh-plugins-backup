/**
 * m-market：仓库 star 缓存（StarCache）。
 * docs/design/2026-08-21-market-star-filter-sort-design.md §3.1.3。
 *
 * 职责：市场浏览时按「条目来源仓库」批量查询 star 数的编排层——
 * - **按仓库 URL 去重**：一次浏览中同一 URL 只查一次 GitHub（官方条目共 1 个仓库、
 *   每作者 1 个 dsh-configs 仓库，去重后查询次数远小于条目数）；
 * - **内存缓存 + TTL**：成功结果缓存（默认 1 小时），TTL 内重复查询零网络请求
 *   （进程内存，dsh 重启自然清空，无需落盘）；
 * - **失败降级**：单个仓库查询失败不影响其他条目（getMany 逐项 try/catch），
 *   失败的条目返回 undefined（UI 显示「—」），且**不缓存失败**——下轮自然重试；
 * - **并发去重**：同一 URL 的并发查询只发一次请求（in-flight 共享）。
 *
 * 依赖注入：`query(url) → number | null`（调用方组装 parseGitHubRepoUrl + getRepoStarsPublic /
 * getRepoStars），本类只做缓存编排，全部可 mock、node 可测。不持有任何凭据。
 */
/** 单 URL star 查询函数（调用方注入；404/解析失败返回 null 表示无数据） */
export type StarQuery = (url: string) => Promise<number | null>;
export interface StarCacheOptions {
    /** 查询函数（必填；调用方组装解析 + GitHub REST） */
    query: StarQuery;
    /** 时钟（epoch ms；测试注入用）；缺省 Date.now */
    now?: () => number;
    /** 成功结果缓存时长（ms）；缺省 1 小时 */
    ttlMs?: number;
}
export declare class StarCache {
    private readonly query;
    private readonly now;
    private readonly ttlMs;
    /** 成功结果缓存：url → { value, expiresAt } */
    private readonly cache;
    /** in-flight 去重：url → Promise（并发同 URL 只查一次） */
    private readonly inflight;
    constructor(options: StarCacheOptions);
    /**
     * 查单个 URL 的 star 数；undefined = 无数据（查询失败 / 仓库不存在 / URL 非 GitHub 仓库）。
     * 永不抛错（失败吞掉返回 undefined）；成功结果缓存 TTL，失败不缓存。
     */
    get(url: string): Promise<number | undefined>;
    /**
     * 批量查询：urls 逐项查询，返回 Map<url, number | undefined>。
     * 单项失败只影响该项（undefined），不中断整体。
     */
    getMany(urls: readonly string[]): Promise<Map<string, number | undefined>>;
    /** 并发去重：同 URL 的并发查询共享同一个 in-flight Promise。 */
    private resolve;
}
