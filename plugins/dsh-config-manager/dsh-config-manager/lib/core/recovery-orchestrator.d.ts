import { type JournalStore } from './journal.ts';
import { RunRegistry } from './run-registry.ts';
import type { HostContext } from './types.ts';
import type { MsgFunc } from './messages.ts';
/** 路由注入的恢复执行器（restore / rollback 引擎；测试注入 mock）。 */
export interface RecoveryExecutorFns {
    /** rollback-recommended：恢复到 trusted snapshot（restore.ts 引擎）。 */
    performRestore: (snapshotId: string) => Promise<{
        full: boolean;
        failed: string[];
    }>;
    /** rollback-continue：续跑中断回滚（rollback.ts 引擎）。 */
    performRollback: (snapshotId: string) => Promise<{
        full: boolean;
        failed: string[];
    }>;
}
export interface RecoveryOrchestratorDeps {
    store: JournalStore;
    runs: RunRegistry;
    snapshotsDir: string;
    host: HostContext;
    msg: MsgFunc;
    /** journal↔snapshot 正向校验（phase3Recovery.recoveryHooks.snapshotExists）。 */
    snapshotExists: (snapshotId: string | null, binding?: {
        operationId?: string;
        ownerInstanceId?: string;
        environmentFingerprint?: string;
    }) => Promise<boolean>;
    /**
     * 当前环境指纹（**动态 getter**，非创建时捕获快照）。
     * 原因：宿主启动 recovery 分类在 fire-and-forget 异步块中跑 `initFingerprint()`，
     * 未在 makeRoutes 前 await 完成；若此处捕获创建时的值会拿到 'unknown' 初值，
     * 导致后续所有 recovery API 判 WRONG_ENVIRONMENT（环境指纹不匹配）。动态读取
     * 保证 initFingerprint 完成后，API 调用时取到真实指纹。
     */
    getEnvironmentFingerprint: () => string;
    /**
     * 清除 SAFE MODE（解除阻断）。宿主注入 `phase3Recovery.clearSafeMode()`：
     * 同时重置内存 `safeModeActive` 标志（isBlocked 读它）与 durable 标记。
     * 仅当 recovery 成功且无其他未解决 incident 时调用（见 maybeClearSafeMode）。
     */
    clearSafeMode: () => Promise<void>;
}
/** 编排结果（路由映射为 HTTP 响应）。 */
export type RecoveryResult = {
    status: 200;
    body: Record<string, unknown>;
} | {
    status: 400;
    body: Record<string, unknown>;
} | {
    status: 404;
    body: Record<string, unknown>;
} | {
    status: 409;
    body: Record<string, unknown>;
} | {
    status: 500;
    body: Record<string, unknown>;
};
export interface RecoveryOrchestrator {
    status(): Promise<RecoveryResult>;
    preview(operationId: string): Promise<RecoveryResult>;
    confirm(operationId: string, userConfirmed: boolean): Promise<RecoveryResult>;
    execute(operationId: string, userConfirmed: boolean, makeExecutors: (runId: string) => RecoveryExecutorFns): Promise<RecoveryResult>;
    verify(operationId: string): Promise<RecoveryResult>;
    retry(operationId: string, userConfirmed: boolean, makeExecutors: (runId: string) => RecoveryExecutorFns): Promise<RecoveryResult>;
    dismiss(operationId: string, userConfirmed: boolean): Promise<RecoveryResult>;
}
export declare function createRecoveryOrchestrator(deps: RecoveryOrchestratorDeps): RecoveryOrchestrator;
