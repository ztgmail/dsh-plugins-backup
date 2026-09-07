/**
 * Reconciler（Phase 3：startup reconciliation）。
 *
 * 职责：扫描 active journals → parse/schema 校验（corrupt 隔离）→ 验 environment fingerprint
 * → 验 Journal→Lock 绑定 → 验快照 → 验 step 指纹 → 外部探测 → 选择推荐 recovery outcome
 * → 执行（需用户确认的破坏性动作才执行）→ recovery-history → 幂等。
 *
 * **Reconciler 不拥有 Environment Lock primitive 实现** —— 通过 Coordinator/port 使用
 * （release、active≤1、recover 显式流程由宿主/Coordinator 编排）。
 *
 * **Startup（Rev 3 P1-NEW-2）不自动 recover stale lock**：
 *  - 若发现 stale lock + incomplete journal → RECOVERY_REQUIRED / SAFE MODE，不自动 recoverStaleLock；
 *  - 用户显式确认后才 prove stale → recover → acquire → reconcile。
 */
import { JournalStore, type OperationJournal, type JournalStep } from './journal.ts';
export type StepFingerprintVerdict = 'before-match' | 'after-match' | 'none' | 'unable';
export type ExternalProbe = 'installed' | 'half-installed' | 'reverse-residue' | 'not-installed' | 'unknown';
export interface ReconcileProbeHooks {
    /** 对某 step 的目标做磁盘指纹判定。 */
    verifyStepFingerprint(step: JournalStep): Promise<StepFingerprintVerdict>;
    /** 外部步骤（插件/Git/WebDAV）状态探测。 */
    probeExternal(step: JournalStep): Promise<ExternalProbe>;
    /**
     * 快照完整性（id 合法 + snapshot.json 存在 + 必要 blobs 存在 + READY + 属于本 op）。
     * binding 为 journal 的绑定字段（operationId/ownerInstanceId/environmentFingerprint），
     * 实现应校验 snapshot 的 manifest binding 与 journal 一致（P1-1：防伪造快照过 snapshotExists）。
     */
    snapshotExists(snapshotId: string | null, binding?: {
        operationId?: string;
        ownerInstanceId?: string;
        environmentFingerprint?: string;
    }): Promise<boolean>;
}
export interface ReconcileEnv {
    environmentFingerprint: string;
    /** 判定某 journal 是否属于仍存活的 live owner（live op 不可 reconcile/quarantine/move）。 */
    isLiveOwner(journal: OperationJournal): boolean | Promise<boolean>;
    /**
     * P1-A：期望的 crashed-ownership instanceId（= stale environment.lock owner.instanceId）。
     * 显式 recovery 捕获 stale ownership 证据后传入：active journal 的 ownerInstanceId/lockId
     * 必须匹配该 crashed ownership，才可作为 trusted transaction 参与 reconcile/rollback/resume；
     * 否则 → needs-attention（SAFE MODE，不 trusted），防跨 transaction/伪造 journal。
     */
    expectedOwnershipInstanceId?: string;
}
export interface ReconcileOptions {
    /** 是否自动隔离 corrupt journal（move 到 quarantine + attention sidecar）。默认 true。 */
    autoQuarantine?: boolean;
    /** 是否对 terminal-in-active journal 自动 move 到 completed。默认 true。 */
    organizeTerminal?: boolean;
}
export type ReconcileDecisionKind = 'live' | 'corrupt' | 'env-mismatch' | 'organized' | 'recovered' | 'noop' | 'rollback-recommended' | 'rollback-continue' | 'needs-attention';
export interface ReconcileDecision {
    operationId: string;
    kind: ReconcileDecisionKind;
    reason: string;
    snapshotId: string | null;
}
/** 汇总结果：是否该进入 SAFE MODE（任一 needs-attention / env-mismatch / corrupt / rollback-recommended）。 */
export interface ReconcileOutcome {
    decisions: ReconcileDecision[];
    safeModeRequired: boolean;
    /** unresolved（未到 terminal）的 incomplete op id（RECOVERY_REQUIRED 候选）。 */
    unresolved: string[];
}
/**
 * 分析 active/ 下的所有 journal，返回每个 op 的决策 + 是否需 SAFE MODE。
 * 只读（除 corrupt quarantine 与 terminal organize / recovery-history 外，不做 data mutation）。
 */
export declare function reconcileActive(store: JournalStore, hooks: ReconcileProbeHooks, env: ReconcileEnv, opts?: ReconcileOptions): Promise<ReconcileOutcome>;
export interface RecoveryExecutorInput {
    operationId: string;
    action: 'rollback' | 'resume' | 'dismiss';
    snapshotId: string | null;
}
/** 执行恢复（破坏性动作必须 userConfirm=true 才执行）。 */
export interface RecoveryExecutorInput {
    operationId: string;
    action: 'rollback' | 'resume' | 'dismiss';
    snapshotId: string | null;
    /**
     * 恢复决策（§5.2 引擎映射）：rollback-recommended → restore executor（恢复到 trusted snapshot）；
     * rollback-continue → rollback executor（续跑中断回滚）。缺省 = rollback-continue（兼容旧调用）。
     */
    decision?: 'rollback-recommended' | 'rollback-continue';
    /** 宿主注入的实际回滚执行器（rollback-continue：续跑中断回滚；破坏性副作用由宿主/Coordinator 执行）。 */
    performRollback?: (snapshotId: string) => Promise<{
        full: boolean;
        failed: string[];
    }>;
    /** 宿主注入的 restore 执行器（rollback-recommended：恢复到 trusted snapshot）。 */
    performRestore?: (snapshotId: string) => Promise<{
        full: boolean;
        failed: string[];
    }>;
}
export declare function executeRecovery(store: JournalStore, input: RecoveryExecutorInput, userConfirmed: boolean): Promise<'done' | 'needs-confirmation' | 'failed'>;
/**
 * 对 terminal `NEEDS_ATTENTION` journal 重算 recovery 决策（§5.4，Reviewer A 第二轮 P1-2）。
 *
 * `reconcileActive` 对 terminal `NEEDS_ATTENTION` journal 恒返回 `needs-attention`
 * （`NEEDS_ATTENTION` 是 terminal，`rollback-recommended`/`rollback-continue` 只在转换进
 * NEEDS_ATTENTION 的当次 pass 出现一次）。`GET /recovery/status` 用本函数重算，区分
 * `rollback-recommended` / `rollback-continue` / `needs-attention`。
 *
 * **只读**：不修改 journal，不写 SAFE MODE，不写 recovery-history。
 */
export declare function recomputeRecoveryDecision(j: OperationJournal, hooks: Pick<ReconcileProbeHooks, 'snapshotExists'>): Promise<'rollback-continue' | 'rollback-recommended' | 'needs-attention'>;
export interface StartupInspection {
    safeModeRequired: boolean;
    recoveryRequired: boolean;
    decisions: ReconcileDecision[];
    unresolved: string[];
}
/**
 * Startup 只读事务状态 + 锁状态扫描（Rev 3 P1-NEW-2）：
 * 只检测、只读；**不自动 recoverStaleLock、不自动 create journal**。
 * lockState: 'LOCKED' | 'STALE_LOCK_DETECTED' | 'UNKNOWN_STATE' | 'FREE'
 */
export declare function inspectStartup(store: JournalStore, hooks: ReconcileProbeHooks, env: ReconcileEnv, opts: ReconcileOptions, lockState: 'LOCKED' | 'STALE_LOCK_DETECTED' | 'UNKNOWN_STATE' | 'FREE'): Promise<StartupInspection>;
