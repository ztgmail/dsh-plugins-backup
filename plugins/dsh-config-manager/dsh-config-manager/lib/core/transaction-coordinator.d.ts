/**
 * MutationTransactionCoordinator（Phase 3：Crash Journal 核心正确性边界）。
 *
 * 职责链：acquire global lock → 检查/reconcile active ≤1 → 创建 operationId + journal CREATED
 * → 快照（SNAPSHOT_CREATED）→ 执行 WAL steps → 尾操作 + validate → 决定 terminal
 * → 写 durable terminal → move journal → 请求 release（guard 验证 isTerminal）。
 *
 * **职责分离（Rev 3 P1-NEW-1）**：Coordinator 决定 COMMITTED / ROLLED_BACK /
 * NEEDS_ATTENTION / RECOVERY_REQUIRED。Environment Lock 不决定。
 *
 * **Release Invariant**：durable terminal（COMMITTED/ROLLED_BACK/NEEDS_ATTENTION）BEFORE release。
 * Environment Lock 的 release guard 只验证 isTerminal。
 *
 * **禁止**：往 env-lock.ts 塞 recovery policy。本文件依赖最小 MutationLockPort；
 * SAFE MODE 门禁经注入谓词（isBlocked）由 Coordinator 传入 lock helper（见 env-lock 改造）。
 */
import { JournalStore } from './journal.ts';
import type { MutationLockContext, MutationLockPort } from '../utils/env-lock.ts';
export interface CoordinatorStepSpec {
    stepId: string;
    adapter: string;
    ref: string;
    kind: string;
    /** 外部副作用（插件/Git/WebDAV/reinstall）——crash 后不可证明，一律保守 */
    external: boolean;
}
export interface CoordinatedStepResult {
    /** ok = side effect 已执行（本地可指纹，afterFp 已重读）；attention = 已执行但不可证明/外部 */
    status: 'ok' | 'attention';
    beforeFp?: string | null;
    afterFp?: string | null;
    warning?: string;
}
export interface CoordinatedOperation {
    operationType: string;
    buildSteps(): CoordinatorStepSpec[];
    /** 可选：pre-operation 快照（回滚点）。返回 snapshotId。 */
    createSnapshot?(): Promise<{
        snapshotId: string | null;
    }>;
    /** 执行单个 step 的 side effect，并返回指纹证据。 */
    executeStep(stepId: string): Promise<CoordinatedStepResult>;
    /** 尾操作（markSnapshotStatus、vault 回填等）必须在 COMMITTED 之前完成，不得抛错过去。 */
    tailOperations?(): Promise<void>;
    validate(): Promise<{
        ok: boolean;
        warnings: string[];
    }>;
    /** 可选：在线回滚（基于快照，带 parentContext 复用锁，走 rollback WAL）。 */
    rollback?(snapshotId: string | null, ctx: MutationLockContext, entryDone: (entryIndex: number) => Promise<void>): Promise<{
        full: boolean;
        failed: string[];
    }>;
}
export type CoordinatorResult = {
    outcome: 'COMMITTED';
    operationId: string;
    snapshotId: string | null;
} | {
    outcome: 'ROLLED_BACK';
    operationId: string;
    full: boolean;
    failed: string[];
    snapshotId: string | null;
} | {
    outcome: 'NEEDS_ATTENTION';
    operationId: string;
    reason: string;
    snapshotId: string | null;
} | {
    outcome: 'RECOVERY_REQUIRED';
    operationId: string | null;
    reason: string;
};
export interface CoordinatorDeps {
    store: JournalStore;
    /** 最小锁契约（可为 null = 测试无锁环境，不 acquire/release，仅走 journal）。 */
    lock: MutationLockPort | null;
    /** 锁上下文（已由调用方 acquire 或 coordinator 内部 acquire）。 */
    acquireLock(): Promise<MutationLockContext>;
    /** active≤1 强制：扫描 active/，存在非当前 live owner 的残留 → 返回残留 operationId（须先 reconcile）。 */
    checkActiveClear(context: MutationLockContext): Promise<{
        clear: true;
    } | {
        clear: false;
        residue: string;
    }>;
    /** reconcile 残留（active≤1 前置）。实现见 reconcile.ts；此处由 Coordinator 委托。 */
    reconcileResidue?(residueOpId: string, context: MutationLockContext): Promise<'recovered' | 'rolled-back' | 'needs-attention'>;
    /** 元数据：Journal→Lock 单向绑定的 lock 侧标识。 */
    lockId: string;
    ownerInstanceId: string;
    packageVersion: string;
    environmentFingerprint: string;
    /** release：terminal guard 验证 isTerminal 后才真正 release lock。 */
    releaseLock(context: MutationLockContext, operationId: string): Promise<void>;
    /** 文本脱敏（journal error/reason）。缺省用 redactJournalText。 */
    redactText?(text: string): string;
}
export declare class MutationTransactionCoordinator {
    private readonly deps;
    private readonly redact;
    constructor(deps: CoordinatorDeps);
    /** 运行一个 coordinated operation。返回 terminal CoordinatorResult。 */
    run(op: CoordinatedOperation): Promise<CoordinatorResult>;
    /**
     * 显式回滚（用户确认后由宿主/Reconcile 调用；走 rollback WAL）。Coordinator.run 不自动触发。
     * 正常返回 ROLLED_BACK；失败返回 RECOVERY_REQUIRED（不伪造终态）。
     */
    rollbackForRecovery(op: CoordinatedOperation, context: MutationLockContext, operationId: string, snapshotId: string | null, cause: string): Promise<CoordinatorResult>;
    /** 在线回滚（rollback WAL）：ROLLING_BACK durable → 计划补偿 → entryDone → ROLLED_BACK。 */
    private doRollback;
    /** terminal NEEDS_ATTENTION + 规整（NEEDS_ATTENTION 是 terminal → 写 SAFE MODE 后 release）。 */
    private finalizeAttention;
}
