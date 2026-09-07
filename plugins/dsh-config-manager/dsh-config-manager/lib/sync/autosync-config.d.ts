import type { SyncTransportType } from './sync-config.ts';
export declare const AUTOSYNC_CONFIG_FILE = "sync-autosync.json";
export declare const AUTOSYNC_CONFIG_SCHEMA_VERSION = 2;
/** 统一间隔类型 */
export type AutosyncInterval = '5m' | '15m' | '30m' | '60m' | '6h' | '12h' | '24h';
/** 缺省间隔 */
export declare const DEFAULT_AUTOSYNC_INTERVAL: AutosyncInterval;
/** 缺省启动触发最小间隔阈值（5 分钟，防频繁重启反复同步） */
export declare const DEFAULT_STARTUP_MIN_INTERVAL_MS: number;
/** 最近一次自动同步执行状态 */
export type AutosyncRunStatus = 'success' | 'skipped' | 'failed' | 'partial';
/** 自动同步配置（持久化面；单通道） */
export interface AutosyncConfig {
    /** 总开关（同时控制上传 + 下载） */
    enabled: boolean;
    /** 统一间隔 */
    interval: AutosyncInterval;
    /** 重启触发的「自动下载合并」最小间隔阈值（ms） */
    startupMinIntervalMs: number;
    /** 连续失败计数（用于通知判定） */
    consecutiveFailures: number;
    /** 最近一次自动同步执行时间（ISO-8601 UTC）；''/undefined = 从未执行 */
    lastRunAt?: string;
    /** 最近一次自动同步执行状态 */
    lastRunStatus?: AutosyncRunStatus;
    lastRunMessage?: string;
    /** 最近一次自动同步触发的同步历史条目 id */
    lastRunHistoryId?: string;
}
/** 全通道配置视图（v2 文件直接读取；status 路由一次返回两个通道的状态）。 */
export type AutosyncConfigByChannel = Record<SyncTransportType, AutosyncConfig>;
/** 缺省配置（首次无文件 / 损坏 / 不支持 schema 时回退） */
export declare function defaultAutosyncConfig(): AutosyncConfig;
/** 读取全部通道的自动同步配置（v2 文件；v1 迁移为 git；webdav 缺省）。 */
export declare function readAllAutosyncConfigs(dir: string): Promise<AutosyncConfigByChannel>;
/** 读取指定通道的自动同步配置；文件不存在 / 损坏 / 不支持 schema → 缺省值（不抛错）。 */
export declare function readAutosyncConfig(dir: string, channel: SyncTransportType): Promise<AutosyncConfig>;
/** 写入指定通道的自动同步配置（原子写：临时文件 + rename；保留另一通道；自动创建目录）。 */
export declare function writeAutosyncConfig(dir: string, channel: SyncTransportType, cfg: AutosyncConfig): Promise<void>;
