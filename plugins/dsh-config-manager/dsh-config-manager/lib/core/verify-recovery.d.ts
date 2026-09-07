import type { RecoveryVerification, RecoveryVerificationVerdict } from './journal.ts';
import type { HostContext, Snapshot } from './types.ts';
export interface VerifyRecoveryOptions {
    /** 快照根目录（<snapshotsDir>，<snapshotDir> 的直接父级）。 */
    snapshotsRoot: string;
    /** 当前环境指纹（必须与 snapshot binding 一致，否则 WRONG_ENVIRONMENT）。 */
    environmentFingerprint: string;
    /** 期望的 operationId（journal.operationId）。快照 operationId 必须与之双向一致，否则 WRONG_OPERATION。 */
    expectedOperationId?: string;
}
/**
 * Post-recovery verification（§6.4）。
 *
 * @param snapshot 被恢复 operation 的 journal 引用快照（id + binding 用于定位与交叉校验；
 *                 实际校验以磁盘重读为准，不信任内存对象）。
 * @param ctx      HostContext（homeDir / fs / settings / plugins 门面）。
 * @param opts     snapshotsRoot + environmentFingerprint。
 */
export declare function verifyRecovery(snapshot: Snapshot, ctx: HostContext, opts: VerifyRecoveryOptions): Promise<RecoveryVerification>;
/** 便捷：把 RecoveryVerification 映射为 journal 终态（供 verify 路由单次原子 update 使用）。 */
export declare function recoveryTerminalState(verdict: RecoveryVerificationVerdict): 'ROLLED_BACK' | 'RECOVERED' | 'NEEDS_ATTENTION';
