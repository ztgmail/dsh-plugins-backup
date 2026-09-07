import type { ConfigAdapter, HostContext, RollbackReport, Snapshot, SnapshotStore } from './types.ts';
export interface RollbackOptions {
    ctx: HostContext;
    snapshot: Snapshot;
    store?: SnapshotStore;
    adapters?: ConfigAdapter[];
    /** 回滚 WAL（Phase 3）：每补偿完一条 entry 调用，供 Coordinator 记录 rollback.entryDone；
     *   crash during rollback 后 reconcile 从 WAL 判定已补偿/未补偿，避免盲目从头重做。 */
    entryDone?: (entryIndex: number) => Promise<void>;
}
/** 回滚：逆序补偿全部条目；返回诚实报告（full / partial） */
export declare function rollback(opts: RollbackOptions): Promise<RollbackReport>;
