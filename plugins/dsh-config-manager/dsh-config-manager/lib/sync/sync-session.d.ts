import type { ImportAnalysis, ImportPlan } from '../core/types.ts';
import type { SyncConfig } from './sync-config.ts';
/** 默认会话 TTL（30 分钟） */
export declare const DEFAULT_SESSION_TTL_MS: number;
/** 一次差异确认会话的完整数据 */
export interface SyncSession {
    id: string;
    /** 临时标准 ZIP（apply-items 执行 executeImportPlan 需要） */
    zipPath: string;
    plan: ImportPlan;
    analysis: ImportAnalysis;
    /** 被拉取的远端快照 id */
    snapshotId: string;
    /** 该次同步使用的通道配置（git/webdav 通用；apply-items 据此重建引擎） */
    config: SyncConfig;
    /** 创建时间（epoch ms） */
    createdAt: number;
    /** 过期时间（epoch ms；过期条目惰性清理） */
    expiresAt: number;
}
/** 内存会话存储；同 id 覆盖；过期条目视为不存在。 */
export declare class SyncSessionStore {
    private readonly sessions;
    private readonly ttlMs;
    private readonly now;
    constructor(opts?: {
        ttlMs?: number;
        now?: () => number;
    });
    /** 登记（或覆盖）会话；id 缺省时自动生成。createdAt/expiresAt 缺省自动填充。返回会话 id。 */
    set(session: Omit<SyncSession, 'id' | 'createdAt' | 'expiresAt'> & {
        id?: string;
        createdAt?: number;
        expiresAt?: number;
    }): string;
    /** 读取会话；过期条目返回 undefined（惰性清理）。 */
    get(id: string): SyncSession | undefined;
    /** 删除会话（cancel / apply-items 消费后调用）。 */
    delete(id: string): void;
}
