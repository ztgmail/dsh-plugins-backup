import type { SectionId } from '../schema/types.ts';
import type { SyncTransportType } from './sync-config.ts';
export declare const SYNC_HISTORY_FILE = "sync-history.json";
export declare const SYNC_HISTORY_SCHEMA_VERSION = 1;
/** 自动同步历史保留上限 */
export declare const AUTOSYNC_HISTORY_KEEP = 200;
/** 自动同步执行记录（§3.7 AutosyncHistoryEntry） */
export interface AutosyncHistoryEntry {
    /** 触发该次运行的同步通道（git / webdav；旧记录缺省 undefined） */
    transport?: SyncTransportType;
    /** 执行方向 */
    direction: 'pull' | 'push' | 'both';
    status: 'success' | 'skipped' | 'failed' | 'partial';
    /** 跳过原因（冲突项 / 缺失依赖 / Install / 错误 / 无远端 / 网络） */
    skipReason?: string;
    /** 被跳过的冲突分区 id（冲突跳过时列出） */
    conflictedSections?: SectionId[];
    /** 本次自动合并实际写入的分区 */
    appliedSections?: SectionId[];
    /** 本次 push 产生的快照 id（direction 含 push 时） */
    pushedSnapshotId?: string;
    /** 本次 pull 来源快照 id */
    pulledSnapshotId?: string;
    /** failed 时的错误摘要（脱敏） */
    error?: string;
    /** 连续失败 3 次通知时间（ISO-8601 UTC） */
    notifiedAt?: string;
    /** 本次触发时的连续失败计数 */
    failureCountAtRun: number;
    /** 记录创建时间（ISO-8601 UTC） */
    createdAt: string;
}
/** sync-history.json 文件结构 */
export interface SyncHistoryFile {
    schemaVersion: number;
    autosyncEntries: AutosyncHistoryEntry[];
    updatedAt: string;
}
/** 读取同步历史；文件不存在 → 空列表（schemaVersion=1）。损坏 JSON 抛错。 */
export declare function readSyncHistory(dir: string): Promise<SyncHistoryFile>;
/** 追加一条自动同步执行记录（升序），裁剪到 AUTOSYNC_HISTORY_KEEP 条，原子写。 */
export declare function appendAutosyncEntry(dir: string, entry: AutosyncHistoryEntry, now?: () => Date): Promise<void>;
