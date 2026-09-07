export declare const BACKUP_SCHEDULE_FILE = "backup-schedule.json";
export declare const BACKUP_SCHEDULE_SCHEMA_VERSION = 1;
/** 定时备份间隔档位（全量备份无需太频繁；默认 24h）。
 *  - '6h' | '12h' | '24h' | '7d'：固定间隔；
 *  - 'custom'：每周固定时刻（见 customSchedule）。 */
export type BackupInterval = '6h' | '12h' | '24h' | '7d' | 'custom';
/**
 * 自定义（每周固定时刻）档配置：
 * - dayOfWeek：0-6（0 = 周日，1 = 周一 … 6 = 周六）；
 * - hour：0-23；
 * - minute：0-59。
 * 语义 = 每周该时刻触发一次全量备份（错过的时间点不补跑——下次排期自然对齐）。
 */
export interface BackupWeeklySchedule {
    dayOfWeek: number;
    hour: number;
    minute: number;
}
/** 缺省间隔 */
export declare const DEFAULT_BACKUP_INTERVAL: BackupInterval;
/** 缺省启动触发最小间隔阈值（1 小时，防频繁重启反复备份） */
export declare const DEFAULT_STARTUP_MIN_INTERVAL_MS: number;
/** 最近一次定时备份执行状态 */
export type BackupRunStatus = 'success' | 'skipped' | 'failed';
/** 定时备份配置（持久化面） */
export interface BackupScheduleConfig {
    /** 总开关 */
    enabled: boolean;
    /** 备份间隔档位 */
    interval: BackupInterval;
    /** custom 档的每周固定时刻（仅 interval='custom' 时有意义；写入/读取宽容：其他档位忽略） */
    customSchedule?: BackupWeeklySchedule;
    /** 重启触发的「启动备份」最小间隔阈值（ms） */
    startupMinIntervalMs: number;
    /** 连续失败计数（用于通知判定） */
    consecutiveFailures: number;
    /** 最近一次执行时间（ISO-8601 UTC）；''/undefined = 从未执行 */
    lastRunAt?: string;
    /** 最近一次执行状态 */
    lastRunStatus?: BackupRunStatus;
    lastRunMessage?: string;
}
/** 缺省配置（首次无文件 / 损坏 / 不支持 schema 时回退） */
export declare function defaultBackupSchedule(): BackupScheduleConfig;
/** 间隔 → ms 换算（固定间隔档；'custom' 无固定周期 → NaN，调用方改用 nextBackupDelayMs） */
export declare function backupIntervalToMs(interval: BackupInterval): number;
/** 校验自定义周档（0-6 周几 / 0-23 时 / 0-59 分）；非法返回 null。 */
export declare function parseWeeklySchedule(v: unknown): BackupWeeklySchedule | null;
/**
 * 计算下一次「定时备份」触发的 delay ms（相对 now；至少 >0）。
 * - 固定间隔档：直接返回 interval ms（与旧行为一致——从上次排期算固定周期）；
 * - 'custom'：计算从 now 到下一个匹配「周几 时:分」时刻的毫秒数（跨周自动对齐；
 *   若今天正好是该时刻且已过 → 排到下周同刻；未过 → 今天同刻）。
 * 配置非法（custom 无 valid customSchedule）→ 返回 null（调用方不排期）。
 */
export declare function nextBackupDelayMs(cfg: Pick<BackupScheduleConfig, 'interval' | 'customSchedule'>, now?: Date): number | null;
/** 读取定时备份配置；文件不存在 / 损坏 / 不支持 schema → 缺省值（不抛错）。 */
export declare function readBackupSchedule(dir: string): Promise<BackupScheduleConfig>;
/** 写入定时备份配置（原子写：临时文件 + rename；自动创建目录）。 */
export declare function writeBackupSchedule(dir: string, cfg: BackupScheduleConfig): Promise<void>;
