/** 临时文件缺省保留期：24 小时（覆盖跨会话「刷新恢复导入」窗口，昨天的残留自动清） */
export declare const TMP_RETENTION_DEFAULT_MS: number;
/** 导出产物缺省保留期：7 天（导出时用户已通过浏览器下载/另存到本地，host 端副本按周回收） */
export declare const EXPORTS_RETENTION_DEFAULT_MS: number;
/** 市场缓存/工作副本缺省保留期：7 天（重建成本 = 一次网络拉取） */
export declare const MARKET_RETENTION_DEFAULT_MS: number;
export interface CacheCleanupOptions {
    /** 临时目录（$DSH_HOME/dsh-config-manager/tmp） */
    tmpDir: string;
    /** 导出产物目录（$DSH_HOME/dsh-config-manager/exports） */
    exportsDir: string;
    /** 市场缓存根（$DSH_HOME/dsh-config-manager/market/cache） */
    marketCacheRoot: string;
    /** 市场工作副本根（$DSH_HOME/dsh-config-manager/market/work） */
    marketWorkRoot: string;
    /** 临时文件保留期（缺省 24h） */
    tmpRetentionMs?: number;
    /** 导出产物保留期（缺省 7 天） */
    exportsRetentionMs?: number;
    /**
     * exports 清理豁免的文件名前缀（如定时备份的 dsh-config-auto-）：
     * 匹配该前缀的 ZIP 不按保留期回收 —— 其生命周期由业务保留策略管理
     * （BackupScheduler.pruneAutoBackups「保留最近 N 个」）。缺省不豁免。
     */
    exportsExemptPrefix?: string;
    /** 市场缓存/工作副本保留期（缺省 7 天） */
    marketRetentionMs?: number;
    /** 时间源（测试注入；缺省 Date.now） */
    now?: () => number;
}
export interface CacheCleanupResult {
    /** 删除条目数（文件 + 目录） */
    removed: number;
    /** 释放字节数（仅被删文件的 size 累计；目录删除统计为 0） */
    freedBytes: number;
    /** 单项失败数（不影响主流程） */
    errors: number;
    /** 每条删除记录（相对 dataDir 的描述 + 字节数），供日志/审计 */
    detail: string[];
}
/**
 * 执行一次缓存清理（幂等；可重复调用）。
 * 只清理超期（超过保留期）的缓存/临时条目，其余一律保留。
 */
export declare function cleanupCaches(opts: CacheCleanupOptions): Promise<CacheCleanupResult>;
