import { JournalStore } from './journal.ts';
import { type ReconcileProbeHooks } from './reconcile.ts';
import { type LockState, type MutationLockContext } from '../utils/env-lock.ts';
import type { JournalStepRecord } from './types.ts';
/** 存在未收敛的 active transaction → 拒绝创建第二个（active≤1）。 */
export declare class TransactionRecoveryRequiredError extends Error {
    constructor(opId: string);
}
/**
 * Phase 4 生产 journal↔snapshot 绑定 API（deferred 模式）：
 *  fn 收到此 ctx，在【首个 destructive side effect 前】：
 *   - 用 plan 创建 op-bound snapshot（operationId/operationType/environmentFingerprint/ownerInstanceId）
 *   - `bindSnapshot(id)`：journal 记录 snapshotId，CREATED→SNAPSHOT_CREATED
 *   - 首个 mutation 前 `markApplying()`：SNAPSHOT_CREATED→APPLYING
 *  保证「快照 durable+verified 且 journal 已知」先于任何写。显式 ctx，无 process-global reentrancy。
 */
export interface JournalRunContext {
    operationId: string;
    operationType: string;
    environmentFingerprint: string;
    ownerInstanceId: string;
    /** 记录 journal.snapshotId 并推进 CREATED→SNAPSHOT_CREATED（或幂等）。 */
    bindSnapshot: (snapshotId: string) => Promise<void>;
    /** 首个 destructive side effect 前调用：SNAPSHOT_CREATED/CREATED→APPLYING。 */
    markApplying: () => Promise<void>;
    /** 逐计划项 WAL step 记录（P2-B，Phase 8）：文件类带 fp，非文件类 external=true。 */
    recordStep: (step: JournalStepRecord) => Promise<void>;
}
/** 把环境锁分类映射到 startup 判定：ACQUIRED 视同 LOCKED（有活跃 owner），IO/PERMISSION 保守 LOCKED。 */
export declare function mapLockStateForStartup(state: LockState): 'LOCKED' | 'STALE_LOCK_DETECTED' | 'UNKNOWN_STATE' | 'FREE';
export interface Phase3RecoveryOptions {
    dataDir: string;
    packageVersion: string;
    /** 覆盖环境指纹（测试） */
    environmentFingerprint?: string;
    /** 环境指纹持久化 token 目录（缺省 dataDir） */
    fingerprintDataDir?: string;
    /**
     * Phase 4 F21/F11 生产正向校验：校验 journal 引用的 snapshot 是否「存在 + READY + verified +
     * op/env/owner binding 匹配」。缺省 = 保守 false（无法证明存在 → 不强推回滚）。
     * 宿主注入 FileSnapshotStore + verifySnapshot + manifest binding 校验实现。
     */
    snapshotExists?: (snapshotId: string | null, binding?: SnapshotBindingRef) => Promise<boolean>;
}
/** journal↔snapshot binding 引用（与 reconcile ReconcileProbeHooks.snapshotExists 的 binding 一致）。 */
export interface SnapshotBindingRef {
    operationId?: string;
    ownerInstanceId?: string;
    environmentFingerprint?: string;
}
export declare class Phase3Recovery {
    readonly store: JournalStore;
    readonly packageVersion: string;
    private readonly dataDir;
    private readonly fingerprintDataDir;
    private environmentFingerprint;
    private readonly snapshotExistsFn;
    /** 内存 SAFE MODE 标志（isBlocked 同步谓词用） */
    safeModeActive: boolean;
    constructor(opts: Phase3RecoveryOptions);
    /** 计算环境指纹（持久化 token；跨启动稳定）。在 startup 前调用一次。 */
    initFingerprint(): Promise<string>;
    /** isBlocked 同步谓词（供 withMutationLock / runWithMutationLock 注入；env-lock 只问 blocked?） */
    isBlocked(): boolean;
    /** 刷新 SAFE MODE 标志（读 durable 标记） */
    refreshSafeMode(): Promise<void>;
    /** 同步探测 durable SAFE MODE 标记（宿主 apply() 同步阶段、scheduler.start() 前调用，保证先阻断）。 */
    probeSafeModeSync(): boolean;
    /** 保守 hooks：无法证明默认 needs-attention（绝不自动恢复/回滚）。snapshotExists 用宿主注入的正向校验（若提供）。 */
    private conservativeHooks;
    /**
     * 启动只读 reconcile：返回是否需 SAFE MODE / RECOVERY_REQUIRED，并写 durable 标记。
     * @param lockState 宿主 EnvironmentLockManager 的 inspectLockState 结果（只分类，不自动 recover）
     * @param expectedOwnershipInstanceId 若在显式 recovery 前已捕获 stale ownership 的 owner.instanceId，传入以做 P1-A binding 校验
     */
    startup(lockState: LockState, expectedOwnershipInstanceId?: string | null): Promise<{
        safeModeRequired: boolean;
        recoveryRequired: boolean;
    }>;
    /** P1-A：读取 crashed stale ownership 的 owner.instanceId（environment.lock 的 owner 证据；不可用返回 null）。 */
    captureStaleOwnershipInstanceId(): Promise<string | null>;
    /** 用户确认恢复后清除 SAFE MODE（清空 durable 标记 + 内存标志） */
    clearSafeMode(): Promise<void>;
    /** 保守 reconcile hooks（供启动 barrier / inspect 用） */
    get recoveryHooks(): ReconcileProbeHooks;
    /** 环境指纹（供启动 barrier 用） */
    get recoveryEnvFingerprint(): string;
    /**
     * 生产 journal 包装（关闭 P0-A）：在【已持 GLOBAL 锁】下，为该 destructive operation
     * 创建 durable journal（CREATED → snapshot → APPLYING → 执行真实引擎 → COMMITTED → 规整）。
     *
     *  - active≤1（§14）：创建前扫描 active/；存在非 terminal 残留（非当前 live owner）→ 抛错阻断，不建第二个 journal。
     *  - Journal→Lock 绑定（§15/P1-A）：ownerInstanceId = lockCtx.token.instanceId（= Phase 2 activeInstanceId，
     *      acquisition-specific）；lockId = 同一 ownership epoch identity（ownerInstanceId）。recovery 时强制校验。
     *  - 不 double-acquire（§6）：调用方（host gate）已持锁，本方法只负责 journal 生命周期，不 re-acquire、不 release（release 由 gate 负责）。
     *  - 异常 → NEEDS_ATTENTION + durable SAFE MODE + rethrow（不破坏既有错误/响应流）。
     *  - 返回 { operationId, result }。
     *
     *  Phase 4 snapshot 两种模式：
     *   - `snapshotProvider`（pre-fn）：journal CREATED → 调用 provider 创建并 verify snapshot → 绑定 snapshotId
     *     → SNAPSHOT_CREATED → APPLYING → fn（适合 provider 不依赖请求体 plan 的场景）。
     *   - `deferredSnapshot`（推荐，F20 生产接线）：plan 只在 handler 解析请求体后可用，因此 journal 停留在 CREATED，
     *     fn 收到 `ctx`（含 `bindSnapshot` / `markApplying`）。引擎在【首个 destructive side effect 前】用 plan 创建
     *     op-bound snapshot → ctx.bindSnapshot(id)（CREATED→SNAPSHOT_CREATED，记录 snapshotId）→ 首个 mutation 前
     *     ctx.markApplying()（SNAPSHOT_CREATED→APPLYING）。保证「快照 durable+verified 且 journal 已知」先于任何写。
     */
    runJournaled<T>(opts: {
        operationType: string;
        lockCtx: MutationLockContext;
        /** 可选：真实 pre-operation snapshot（回滚点），返回 snapshotId（pre-fn 模式）。 */
        snapshotProvider?(): Promise<string | null>;
        /** 可选：deferred 绑定模式——journal 停留 CREATED，fn 收到 ctx 自行 bindSnapshot/markApplying。 */
        deferredSnapshot?: boolean;
        fn: (ctx?: JournalRunContext) => Promise<T>;
    }): Promise<{
        operationId: string;
        result: T;
    }>;
    /**
     * 轻量 operation 包装（意图 journal，供外部/不可证明操作如 sync-push / reinstall 用）：
     *   创建 CREATED → APPLYING（含 external intent step）→ 执行 → COMMITTED；异常 → NEEDS_ATTENTION + SAFE MODE。
     */
    runExternalIntent<T>(opts: {
        operationType: string;
        lockCtx: MutationLockContext;
        intent: {
            adapter: string;
            ref: string;
            kind: string;
        };
        fn: (ctx?: {
            operationId: string;
        }) => Promise<T>;
    }): Promise<{
        operationId: string;
        result: T;
    }>;
}
