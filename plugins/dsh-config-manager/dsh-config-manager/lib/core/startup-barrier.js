/**
 * P1-B：Startup Recovery Barrier。
 *
 * Rev 3 §8.3/§26 要求「recovery classification MUST complete BEFORE destructive schedulers may start」。
 * 本模块提供：
 *  - `StartupRecoveryState`：启动分类的显式结果（NORMAL / LOCKED_LIVE / RECOVERY_REQUIRED / NEEDS_ATTENTION / UNKNOWN_STATE）。
 *  - `StartupRecoveryController`：`await run()` 完成分类；`startSchedulersIfAllowed()` 只在 NORMAL 下启动 schedulers（幂等）。
 *    `failClosed`：任何 inspect 抛错 → 归为 RECOVERY_REQUIRED/NEEDS_ATTENTION，绝不自动 NORMAL，schedulers 不启动。
 *
 * 不依赖全局 flag「稍后同步」赌时序——调用方必须 `await run()` 再据 state 决定。read-only 服务可继续（diagnostics/recovery UI）。
 */
import { inspectStartup } from "./reconcile.js";
/** 用 inspectStartup 结果构造分类器。lockState: 'LOCKED'|'STALE_LOCK_DETECTED'|'UNKNOWN_STATE'|'FREE'。 */
export function classifyStartup(opts) {
    return {
        async classify() {
            const insp = await inspectStartup(opts.store, opts.hooks, opts.env, opts.options ?? {}, opts.lockState);
            let state;
            if (opts.lockState === 'LOCKED') {
                // fresh heartbeat：活锁；若仍有 unresolved journal → 视为 live op（LOCKED_LIVE，不作 recovery/接管）
                state = insp.unresolved.length > 0 ? { kind: 'LOCKED_LIVE', operationId: insp.unresolved[0] } : { kind: 'NORMAL' };
            }
            else if (insp.recoveryRequired) {
                state = { kind: 'RECOVERY_REQUIRED', operationId: insp.unresolved[0] };
            }
            else if (insp.unresolved.length > 0 || insp.safeModeRequired) {
                state = { kind: 'NEEDS_ATTENTION', operationId: insp.unresolved[0] };
            }
            else {
                state = { kind: 'NORMAL' };
            }
            return { state, safeModeRequired: insp.safeModeRequired, recoveryRequired: insp.recoveryRequired };
        },
    };
}
/**
 * StartupRecoveryController：`await run()` 完成后调度器才可启动。
 * `startSchedulersIfAllowed()` 只在 NORMAL 启动（幂等）；否则（RECOVERY_REQUIRED/NEEDS_ATTENTION/UNKNOWN/LOCKED_LIVE）
 * 不启动 destructive schedulers（read-only host 仍活，diagnostics/recovery API 可用）。fail-closed：classify 抛错 → RECOVERY_REQUIRED。
 */
export class StartupRecoveryController {
    state = { kind: 'NEEDS_ATTENTION' };
    settled = false;
    schedulersStarted = false;
    classifier;
    schedulers;
    constructor(classifier, schedulers) {
        this.classifier = classifier;
        this.schedulers = schedulers;
    }
    async run() {
        try {
            const r = await this.classifier.classify();
            this.state = r.state;
        }
        catch (err) {
            // fail closed：inspect 抛错 → 不默认 NORMAL
            this.state = { kind: 'RECOVERY_REQUIRED', operationId: undefined };
        }
        finally {
            this.settled = true;
        }
        return this.state;
    }
    get stateValue() { return this.state; }
    get isSettled() { return this.settled; }
    /** 仅在 NORMAL 下启动 schedulers（幂等；返回是否已启动）。 */
    startSchedulersIfAllowed() {
        if (this.state.kind === 'NORMAL' && !this.schedulersStarted) {
            this.schedulers.start();
            this.schedulersStarted = true;
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=startup-barrier.js.map