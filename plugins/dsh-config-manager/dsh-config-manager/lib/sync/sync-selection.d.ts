import type { SectionId } from '../schema/types.ts';
import type { SyncTransportType } from './sync-config.ts';
export declare const SYNC_SELECTION_FILE = "sync-selection.json";
export declare const SYNC_SELECTION_SCHEMA_VERSION = 2;
/** 远程同步分区选择模式：default = 快速导出（全量推荐分区）；advanced = 自定义勾选。 */
export type SyncSelectionMode = 'default' | 'advanced';
/** 远程同步分区选择（持久化面；单通道）。 */
export interface SyncSelection {
    schemaVersion: number;
    mode: SyncSelectionMode;
    /** 高级模式勾选分区；default 模式可为空数组 */
    sections: SectionId[];
    /** 手动推送默认加密快照（密码仅每次推送输入，绝不持久化） */
    encrypt: boolean;
    /** 手动推送默认导出真实凭据值（安全：必须同时 encrypt；自动同步恒 false） */
    includeSecrets: boolean;
}
/** 全通道选择视图（v2 文件直接读取；status 路由一次返回两个通道的选择）。 */
export type SyncSelectionByChannel = Record<SyncTransportType, SyncSelection>;
/** 缺省配置（首次无文件 / 损坏 / 不支持 schema 时回退） */
export declare function defaultSyncSelection(): SyncSelection;
/**
 * 生效的同步分区范围：
 * - mode='advanced' 且 sections 非空 → sections（自定义导出）；
 * - 其余（default / advanced 但未勾选）→ undefined（= 全部 portable 推荐分区）。
 */
export declare function effectiveSections(sel: SyncSelection): SectionId[] | undefined;
/** 读取全部通道的分区选择配置；文件不存在 / 损坏 / 不支持 schema → 缺省值（不抛错）。 */
export declare function readAllSyncSelections(dir: string): Promise<SyncSelectionByChannel>;
/** 读取指定通道的分区选择配置；文件不存在 / 损坏 / 不支持 schema → 缺省值（不抛错）。 */
export declare function readSyncSelection(dir: string, channel: SyncTransportType): Promise<SyncSelection>;
/** 写入指定通道的分区选择配置（原子写：临时文件 + rename；保留另一通道；自动创建目录）。 */
export declare function writeSyncSelection(dir: string, channel: SyncTransportType, sel: SyncSelection): Promise<void>;
