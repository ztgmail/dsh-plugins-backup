import type { MsgFunc } from '../core/messages.ts';
import type { SectionData, SectionId } from '../schema/types.ts';
import type { SnapshotFs } from './fs.ts';
export declare const SYNC_STATE_SCHEMA_VERSION = 2;
/** 历史可读取版本：v1 缺 lastSnapshotId 时做内存迁移到 v2（lastSnapshotId=''）。 */
export declare const SYNC_STATE_SUPPORTED_VERSIONS: readonly number[];
export declare const SYNC_STATE_FILE = "sync-state.json";
/** 单个分区的同步状态：内容 hash + 最近变更时间 */
export interface SyncSectionState {
    hash: string;
    updatedAt: string;
}
/** sync-state.json 结构 */
export interface SyncState {
    schemaVersion: number;
    lastSyncAt: string;
    sections: Partial<Record<SectionId, SyncSectionState>>;
    /** 当前绑定的传输通道（type = SyncTransport.type，ref = 通道内引用，如 git 分支） */
    transport?: {
        type: string;
        ref: string;
    };
    /** 最近一次同步的快照 ID（= 共同祖先指针）；'' = 从未同步或无祖先 */
    lastSnapshotId: string;
}
/**
 * 分区内容 hash：
 * - JSON 分区：键序规范化的 JSON 序列化 → SHA-256（同一内容不同键序 → 相同 hash）
 * - 文件类分区：文件相对路径 + 文件字节 SHA-256 的有序清单 → SHA-256
 *   （文件数组顺序无关；contentHash 字段不参与，以字节为准）
 */
export declare function hashSection(data: SectionData): string;
/** 读取同步状态；文件不存在 → 返回缺省空状态（从未同步）。
 * v1 文件 → 内存迁移到 v2（lastSnapshotId=''），不在磁盘上就地升级。 */
export declare function loadSyncState(dir: string, fsx?: SnapshotFs, msg?: MsgFunc): Promise<SyncState>;
/** 保存同步状态（自动创建目录） */
export declare function saveSyncState(dir: string, state: SyncState, fsx?: SnapshotFs): Promise<void>;
