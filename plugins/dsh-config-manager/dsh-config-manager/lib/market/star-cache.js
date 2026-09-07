export class StarCache {
    query;
    now;
    ttlMs;
    /** 成功结果缓存：url → { value, expiresAt } */
    cache = new Map();
    /** in-flight 去重：url → Promise（并发同 URL 只查一次） */
    inflight = new Map();
    constructor(options) {
        this.query = options.query;
        this.now = options.now ?? (() => Date.now());
        this.ttlMs = options.ttlMs ?? 60 * 60 * 1000;
    }
    /**
     * 查单个 URL 的 star 数；undefined = 无数据（查询失败 / 仓库不存在 / URL 非 GitHub 仓库）。
     * 永不抛错（失败吞掉返回 undefined）；成功结果缓存 TTL，失败不缓存。
     */
    async get(url) {
        const hit = this.cache.get(url);
        if (hit !== undefined && hit.expiresAt > this.now())
            return hit.value;
        try {
            const value = await this.resolve(url);
            if (value !== null) {
                this.cache.set(url, { value, expiresAt: this.now() + this.ttlMs });
                return value;
            }
            return undefined;
        }
        catch {
            return undefined;
        }
    }
    /**
     * 批量查询：urls 逐项查询，返回 Map<url, number | undefined>。
     * 单项失败只影响该项（undefined），不中断整体。
     */
    async getMany(urls) {
        const out = new Map();
        for (const url of urls) {
            out.set(url, await this.get(url));
        }
        return out;
    }
    /** 并发去重：同 URL 的并发查询共享同一个 in-flight Promise。 */
    resolve(url) {
        const pending = this.inflight.get(url);
        if (pending !== undefined)
            return pending;
        const p = this.query(url).finally(() => {
            this.inflight.delete(url);
        });
        this.inflight.set(url, p);
        return p;
    }
}
//# sourceMappingURL=star-cache.js.map