import type { ReconcileProbeHooks, ReconcileEnv, ReconcileOptions } from './reconcile.ts';
import type { JournalStore } from './journal.ts';
export type StartupRecoveryState = {
    kind: 'NORMAL';
} | {
    kind: 'LOCKED_LIVE';
    operationId?: string;
} | {
    kind: 'RECOVERY_REQUIRED';
    operationId?: string;
} | {
    kind: 'NEEDS_ATTENTION';
    operationId?: string;
} | {
    kind: 'UNKNOWN_STATE';
    reason: string;
};
export interface StartupClassifier {
    classify(): Promise<{
        state: StartupRecoveryState;
        safeModeRequired: boolean;
        recoveryRequired: boolean;
    }>;
}
/** 用 inspectStartup 结果构造分类器。lockState: 'LOCKED'|'STALE_LOCK_DETECTED'|'UNKNOWN_STATE'|'FREE'。 */
export declare function classifyStartup(opts: {
    store: JournalStore;
    hooks: ReconcileProbeHooks;
    env: ReconcileEnv;
    options?: ReconcileOptions;
    lockState: 'LOCKED' | 'STALE_LOCK_DETECTED' | 'UNKNOWN_STATE' | 'FREE';
}): StartupClassifier;
export interface StartupSchedulers {
    start(): void;
}
/**
 * StartupRecoveryController：`await run()` 完成后调度器才可启动。
 * `startSchedulersIfAllowed()` 只在 NORMAL 启动（幂等）；否则（RECOVERY_REQUIRED/NEEDS_ATTENTION/UNKNOWN/LOCKED_LIVE）
 * 不启动 destructive schedulers（read-only host 仍活，diagnostics/recovery API 可用）。fail-closed：classify 抛错 → RECOVERY_REQUIRED。
 */
export declare class StartupRecoveryController {
    private state;
    private settled;
    private schedulersStarted;
    private readonly classifier;
    private readonly schedulers;
    constructor(classifier: StartupClassifier, schedulers: StartupSchedulers);
    run(): Promise<StartupRecoveryState>;
    get stateValue(): StartupRecoveryState;
    get isSettled(): boolean;
    /** 仅在 NORMAL 下启动 schedulers（幂等；返回是否已启动）。 */
    startSchedulersIfAllowed(): boolean;
}
