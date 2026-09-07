import type { Logger } from '../utils/logger.ts';
import type { MsgFunc } from '../core/messages.ts';
import type { SectionId } from '../schema/types.ts';
import type { RunRegistry } from '../core/run-registry.ts';
import type { SyncEngine } from './sync-engine.ts';
import type { MutationLockPort, MutationLockContext } from '../utils/env-lock.ts';
import type { AutosyncConfig, AutosyncInterval } from './autosync-config.ts';
import type { SyncConfig, SyncTransportType } from './sync-config.ts';
import { readSyncHistory } from './sync-history.ts';
import type { AutosyncHistoryEntry } from './sync-history.ts';
import type { MergePlan } from './merge.ts';
import type { SyncApplyPlan } from './risk.ts';
/** 间隔 → ms 换算（§4.3） */
export declare function intervalToMs(interval: AutosyncInterval): number;
/**
 * 启动触发下载合并且满足阈值（now - lastRunAt >= startupMinIntervalMs）？
 * lastRunAt 为 undefined（从未运行）→ true。
 */
export declare function shouldTriggerStartupRun(lastRunAt: string | undefined, startupMinIntervalMs: number, nowMs?: number): boolean;
/** runOnce 执行结果 */
export interface AutosyncRunResult {
    status: 'success' | 'skipped' | 'failed' | 'partial';
    direction: 'pull' | 'push' | 'both' | 'none';
    skipReason?: string;
    conflictedSections?: SectionId[];
    appliedSections?: SectionId[];
    pushedSnapshotId?: string;
    pulledSnapshotId?: string;
    error?: string;
    historyId: string;
    consecutiveFailures: number;
}
export interface AutoSyncSchedulerOptions {
    syncDir: string;
    host: {
        log: Logger;
    };
    /** 注入 SyncEngine 构造器：按 SyncConfig 构造对应通道的引擎（git/webdav）。 */
    makeSyncEngine: (cfg: SyncConfig) => SyncEngine;
    /** 消息翻译器 */
    msg: MsgFunc;
    runs: RunRegistry;
    /** 时间源（测试注入） */
    now?: () => Date;
    /** 注入 autosync-config 读写（按通道；测试可内存实现） */
    readConfig?: (channel: SyncTransportType) => Promise<AutosyncConfig>;
    writeConfig?: (channel: SyncTransportType, cfg: AutosyncConfig) => Promise<void>;
    /** 注入 sync-config 读取（按通道） */
    readSyncConfigFn?: (channel: SyncTransportType) => Promise<SyncConfig | null>;
    /** 注入 sync-history 读写 */
    readHistoryFn?: () => Promise<Awaited<ReturnType<typeof readSyncHistory>>>;
    appendHistoryFn?: (entry: AutosyncHistoryEntry) => Promise<void>;
    /** 注入计时器（测试用；缺省 setInterval/clearInterval） */
    setTimer?: (fn: () => void, ms: number) => ReturnType<typeof setTimeout>;
    clearTimer?: (timer: ReturnType<typeof setTimeout>) => void;
    /**
     * 远端新快照检测（§3.2「下载=检测到远端新快照才拉取」）。
     * 缺省：若 engine 实现了 hasNewRemoteSnapshot() 则调用；否则视为 true（保持旧行为=每次拉取）。
     */
    detectRemoteNew?: (engine: SyncEngine) => Promise<boolean>;
    /**
     * 本地配置变化检测（§3.1「上传=本地改动才推」）。
     * 缺省：若 engine 实现了 hasLocalChanges() 则调用；否则视为 true（保持旧行为=每次都推）。
     */
    detectLocalChange?: (engine: SyncEngine) => Promise<boolean>;
    /** Phase 2 跨进程环境锁端口（可选注入；缺省无锁环境——自动同步 apply（写本地配置）属 GLOBAL mutation） */
    mutationLock?: MutationLockPort;
    /** Phase 3 SAFE MODE：注入同步谓词（被挡 → autosync skip），供 withMutationLock isBlocked 用。 */
    isBlocked?: () => boolean;
    /** Phase 3 recovery（可选注入）：apply/push 包 intent journal（P0-A 接线）。 */
    phase3Recovery?: {
        runExternalIntent(opts: {
            operationType: string;
            lockCtx: MutationLockContext;
            intent: {
                adapter: string;
                ref: string;
                kind: string;
            };
            fn: () => Promise<unknown>;
        }): Promise<{
            operationId: string;
            result: unknown;
        }>;
    };
}
export declare class AutoSyncScheduler {
    private readonly syncDir;
    private readonly host;
    private readonly makeSyncEngine;
    private readonly msg;
    private readonly runs;
    private readonly now;
    private readonly readConfig;
    private readonly writeConfig;
    private readonly readSyncConfigFn;
    private readonly readHistoryFn;
    private readonly appendHistoryFn;
    private readonly setTimer;
    private readonly clearTimer;
    private readonly detectRemoteNew;
    private readonly detectLocalChange;
    private readonly mutationLock;
    private readonly isBlocked;
    private readonly phase3Recovery;
    /** 本次 runOnce 由 withMutationLock 取得的下游锁上下文（供 apply/push journal-wrap），非线程级。 */
    private lockCtxForJournal;
    /** 每通道一个定时器（git/webdav 各自 enabled 时独立排期）。 */
    private readonly timers;
    private stopped;
    private running;
    constructor(opts: AutoSyncSchedulerOptions);
    /** 追加一条自动同步历史（自动带上触发通道；0x 安全：绝不覆盖调用方显式 transport）。 */
    private appendHistory;
    /** 启动：读两个通道配置 → enabled 通道各自排定时器 → 对每个 enabled 通道执行一次启动触发。 */
    start(): void;
    /** 停止：清全部定时器、标记不再调度；正在执行的任务允许自然结束。 */
    stop(): void;
    /** 重新加载配置（路由 POST /sync/autosync 后调用；重排所有通道定时器）。 */
    reload(): Promise<void>;
    private refreshTimers;
    /** 启动触发下载合并（每个 enabled 通道；受各自 startupMinIntervalMs 阈值约束）。 */
    private startupRuns;
    /**
     * 执行一次指定通道的自动同步（§6.1）。
     * @param channel - 同步通道（git / webdav；各自独立的配置与运行状态）
     * @param opts.startup - true 表示启动触发变体（只做 Phase A+B，不做 Phase C push）
     */
    runOnce(channel: SyncTransportType, opts?: {
        startup?: boolean;
    }): Promise<AutosyncRunResult>;
    /** 收尾：写该通道 autosync-config（lastRunAt, lastRunStatus, consecutiveFailures, lastRunHistoryId）。 */
    private writeFinalConfig;
    /** 连续失败 ≥ 3 → 通知（host.log.warn）。 */
    private maybeNotify;
}
/** 从 MergePlan 构造 SyncApplyPlan（autoApply = 所有非 skip 非 conflict 项）。 */
export declare function buildAutoApplyPlan(plan: MergePlan): SyncApplyPlan;
/**
 * 同步通道是否「已配置」：git 看 git.repoUrl 非空；webdav 看 webdav.url 非空；
 * 未配置（null / 缺字段）→ false。作为 autosync 未配置跳过的判定依据。
 */
export declare function syncIsConfigured(cfg: SyncConfig | null): boolean;
