/** 锁目录相对 dataDir */
export declare const LOCKS_DIR = "locks";
/** 所有权记录文件名（immutable） */
export declare const OWNERSHIP_FILE = "environment.lock";
/** heartbeat sidecar 前缀 + 文件名模板：environment.heartbeat.<instanceId> */
export declare const HEARTBEAT_PREFIX = "environment.heartbeat.";
/** recovery 捕获文件名临时前缀 + 模板：environment.recovering.<recoveryInstanceId> */
export declare const RECOVERING_PREFIX = "environment.recovering.";
/** lock schema 版本 */
export declare const LOCK_SCHEMA_VERSION = 1;
/** 默认心跳间隔 ms */
export declare const DEFAULT_HEARTBEAT_INTERVAL_MS = 1000;
/** 默认 stale 阈值 ms（≥ 10 × heartbeatInterval） */
export declare const DEFAULT_STALE_AFTER_MS = 10000;
/** 默认 acquire 等待超时（等待活跃锁释放）ms；0 = 不等待直接返回 */
export declare const DEFAULT_ACQUIRE_TIMEOUT_MS = 0;
/** 进程身份（可注入探测；OS 可验证的 process creation identity 才用于 PID reuse） */
export interface ProcessIdentity {
    /** OS 可验证的进程创建身份串（Linux /proc/<pid>/stat starttime、macOS ps、Windows Get-Process）；null = 无法可靠取得 */
    osProcessStartIdentity: string | null;
    /** 进程是否存活（best-effort） */
    alive: boolean;
}
/** 可注入的进程身份探测门面（默认实现跨平台；测试可注入）。
 * 契约：`alive:false` 只表示 **确证不存在**（ESRCH）；探测失败/不确定必须 **抛错**，
 * 由上层归为 UNKNOWN_STATE —— 绝不把失败误报为「确证死亡」（否则会成为误删许可）。 */
export interface ProcessIdentityProbe {
    /** 探测某 pid 的存活与 OS 身份；确证不存在返回 alive:false；不确定/失败抛错 */
    probe(pid: number): Promise<ProcessIdentity>;
    /** 是否能够可靠取得 OS process creation identity（该平台上实现能力） */
    canGetOsIdentity(): boolean;
}
/** 可注入 IO 门面（对齐 Phase 1 AtomicIo；默认包 node:fs/promises） */
export interface EnvLockIo {
    mkdir(dir: string, opts: {
        recursive: boolean;
    }): Promise<void>;
    /** open；flag 含 'x'（wx/wx+）用于独占创建 */
    open(p: string, flag: string, mode?: number): Promise<EnvLockHandle>;
    rename(src: string, dst: string): Promise<void>;
    unlink(p: string): Promise<void>;
    stat(p: string): Promise<{
        isFile(): boolean;
    } | null>;
    readFileText(p: string): Promise<string>;
    lstat?(p: string): Promise<{
        isSymbolicLink(): boolean;
    } | null>;
    /** 列出目录条目名（诊断；不存在 → 空） */
    listLocksDir?(dir: string): Promise<string[]>;
}
export interface EnvLockHandle {
    writeFile(data: Uint8Array): Promise<void>;
    sync(): Promise<void>;
    close(): Promise<void>;
}
export type LockState = 
/** 成功获得所有权 */
'ACQUIRED'
/** 锁被活跃 owner 持有 */
 | 'LOCKED'
/** 检测到确定 stale（heartbeat 超时 + 进程确证死亡 或 PID reuse）—— 只报告，不自动删除 */
 | 'STALE_LOCK_DETECTED'
/** 无法可靠判定（探测失败 / OS identity 缺失）—— 不删除、不 recover、destructive 不执行 */
 | 'UNKNOWN_STATE'
/** lock 目录 / 文件 IO 错误（非占用） */
 | 'LOCK_IO_ERROR'
/** 权限错误（EPERM/EACCES 且无法确认 lock 存在） */
 | 'PERMISSION_ERROR';
/** 所有权记录（immutable）：写入后直到 release 不再改名/替换 */
export interface LockOwnershipRecord {
    schemaVersion: number;
    owner: {
        instanceId: string;
        /** 本实例启动时刻（Date.now()，应用层时间戳；PID reuse 判断不使用它） */
        instanceStartedAt: number;
        pid: number;
        hostname: string;
        /** OS 可验证的进程创建身份（写入方 acquire 时探测自身）；可能为 null */
        osProcessStartIdentity: string | null;
    };
    op: string;
    target: string;
    acquiredAt: number;
    lockVersion: string;
    /** 预留 Phase 3 journal id；本阶段恒 null，不实现 */
    journalId: string | null;
}
/** heartbeat sidecar 内容（atomicWriteFile 更新；文件名含 instanceId） */
export interface HeartbeatRecord {
    ownerInstanceId: string;
    heartbeatAt: number;
    seq: number;
}
/** 一次 acquire 的返回 */
export interface AcquireResult {
    state: LockState;
    /** state === 'ACQUIRED' 时非 null */
    token: MutationLockToken | null;
    /** 诊断信息（非敏感）：占用方 op/hostname、或错误描述 */
    detail?: string;
}
/** operation-scoped lock token：accepted 后只属于当前 mutation 调用链 */
export interface MutationLockToken {
    /** 本 token 唯一的不可伪造 id */
    readonly tokenId: string;
    /** 所属 manager 身份（防止 foreign token） */
    readonly managerId: string;
    /** owner instanceId（release 校验用） */
    readonly instanceId: string;
    /** acquire 时刻 */
    readonly acquiredAt: number;
}
/** nested operation 显式传递的 lock context */
export interface MutationLockContext {
    readonly token: MutationLockToken;
}
/**
 * core/CLI/ModelTools 依赖的最小锁契约（与具体 EnvironmentLockManager 解耦，便于 mock 测试）。
 * 满足：acquire → 无 token 时获取全局锁；reuseLock → nested 复用（不 reacquire）。
 */
export interface MutationLockPort {
    /**
     * 尝试获取 GLOBAL mutation lock。
     * @param parentContext 若提供且有效（validate=true），表示调用链已持锁 → 复用，不 reacquire，恒返回 {state:'ACQUIRED', token: parentContext.token}
     * @returns 未持锁时走完整 acquire；被占 → LOCKED；stale/unknown → 对应状态（不自动删）
     */
    acquire(opts: {
        op: string;
        target?: string;
        /** nested：若有效父 token → 复用（不 reacquire），否则正常 acquire */
        parentContext?: MutationLockContext;
    }): Promise<AcquireResult>;
    /** 校验 token 是否有效且属于当前持有（nested reuse 判断用） */
    validate(token: unknown): token is MutationLockToken;
    /** release（release 前校验 instanceId；mismatch 抛 EnvironmentLockOwnedByAnotherError） */
    release(token: MutationLockToken): Promise<void>;
}
/**
 * 便捷包装：核心引擎「无父 token → acquire；有有效父 token → reuse（不 reacquire）」。
 * 返回 { token, context, release }：调用方在 finally 中调用 release（仅当本次真正 acquire 才 release）。
 * 若未提供 port（测试/无锁环境）→ 恒成功、不锁定（token=null、release = no-op）。
 *
 * @example
 * const { context, release } = await withMutationLock(ctx.mutationLock, { op: 'import', target })
 * if (!context) throw new Error('环境锁被占用')   // token===null 且真正需要锁 → 被挡
 * try { ...mutation...; await rollback(..., { lockContext: context }) } finally { await release() }
 */
/**
 * 便捷包装：核心/宿主「无父 token → acquire；有有效父 token → reuse（不 reacquire）」。
 * 返回 { context, release }：
 *  - context 非 null = 有锁（或已传入有效父 token 复用）；release 仅当**本次真正 acquire**才实际释放；
 *  - context null = 锁不可得（被挡）或未配置锁环境。
 * 调用方必须区分：port 未配置（无锁环境）→ context null 且可放行；port 已配置但 context null → 被挡必须拒绝。
 */
export declare function withMutationLock(port: MutationLockPort | undefined, opts: {
    op: string;
    target?: string;
    parentContext?: MutationLockContext;
    isBlocked?: () => boolean;
}): Promise<{
    context: MutationLockContext | null;
    release(): Promise<void>;
    reason?: LockBlockReason;
}>;
/**
 * 直接执行式的 mutation 守卫：acquire（或复用父 token）→ 执行 → 释放。
 * - port 未配置（无锁环境/测试）→ 直接执行 fn(null)，不锁定。
 * - port 已配置但 acquire 失败 → **抛 EnvironmentLockUnavailableError**（destructive 不得执行）。
 * - 复用父 token 时（parentContext 有效）→ 不 reacquire、不释放父 token，fn 收到父 context。
 */
export declare function runWithMutationLock<T>(port: MutationLockPort | undefined, opts: {
    op: string;
    target?: string;
    parentContext?: MutationLockContext;
    isBlocked?: () => boolean;
}, fn: (ctx: MutationLockContext | null) => Promise<T>): Promise<T>;
/** 判断某 state 是否意味着「未获得锁（被挡）」；ACQUIRED 才放行 destructive */
export declare function isAcquired(state: LockState): boolean;
/** 一次 recover 的返回 */
export interface RecoverResult {
    ok: boolean;
    /** 是否实际移除了 stale inode（ok=true 时为 true） */
    removed: boolean;
    /** 判定：STALE_LOCK_DETECTED / UNKNOWN_STATE（拒绝）/ LOCKED（拒绝，owner healthy）/ LOCK_IO_ERROR / PERMISSION_ERROR */
    state: LockState;
    /** 诊断 */
    detail?: string;
}
export interface EnvLockManagerOptions {
    /** dataDir（缺省 ~/.dsh/dsh-config-manager）—— 锁在 <dataDir>/locks */
    dataDir?: string;
    /** 覆盖绝对 locks 目录（测试/CLI 注入） */
    locksDir?: string;
    /** 可注入 io */
    io?: EnvLockIo;
    /** 可注入进程探测 */
    probe?: ProcessIdentityProbe;
    /** 时钟（测试注入） */
    now?: () => number;
    /** 心跳间隔 ms（缺省 1000） */
    heartbeatIntervalMs?: number;
    /** stale 阈值 ms（缺省 10000） */
    staleAfterMs?: number;
    /** acquire 等待活跃锁释放的超时 ms（缺省 0=不等待） */
    acquireTimeoutMs?: number;
    /** 诊断用的当前 operation 描述（写入 ownership.op） */
    op?: string;
    /** 诊断用的 target 描述 */
    target?: string;
    /** 插件版本（写入 ownership.lockVersion） */
    lockVersion?: string;
    /** heartbeat 续期写失败回调（留痕；不中断 mutation） */
    onHeartbeatWriteFailure?: (err: unknown) => void;
}
/**
 * EnvironmentLockManager：跨进程环境锁管理器。
 *
 * 用法：
 *   const mgr = new EnvironmentLockManager({ locksDir })
 *   const { state, token } = await mgr.acquire({ op: 'import' })
 *   if (state !== 'ACQUIRED') throw ...            // destructive 必须成功 acquire
 *   try { ...mutation... } finally { await mgr.release(token) }
 *   // nested rollback：mutation 内 rollback(..., { lockContext: { token } }) → reuse，不 reacquire
 */
export declare class EnvironmentLockManager {
    private readonly locksDir;
    private readonly io;
    private readonly probe;
    private readonly now;
    private readonly heartbeatIntervalMs;
    private readonly staleAfterMs;
    private readonly acquireTimeoutMs;
    private readonly lockVersion;
    private readonly onHeartbeatWriteFailure;
    /** 诊断用（acquire 时写 ownership.op/target） */
    private readonly defaultOp;
    private readonly defaultTarget;
    /** 本 manager 唯一 id（forever token 校验用） */
    private readonly managerId;
    /** 本 manager 持有的当前活跃 token（单锁单持有者） */
    private activeToken;
    private heartbeatTimer;
    private heartbeatSeq;
    private readonly activeInstanceId;
    private heartbeatDegraded;
    /** 瞬时错误（EBUSY 等）有界重试计数 */
    private transientRetries;
    private readonly maxTransientRetries;
    /** 有界瞬时重试：EBUSY（Windows sharing violation / 杀软）后小退避重试；超限则返回 false（交由 classify） */
    private tryTransientRetry;
    /** 重置瞬时重试计数（每次 acquire 成功/失败收敛时调用） */
    private resetTransientRetries;
    constructor(opts?: EnvLockManagerOptions);
    get ownershipPath(): string;
    get locksDirectory(): string;
    /** 本 manager 是否当前持有锁（诊断用） */
    get isHolding(): boolean;
    /**
     * 尝试获取 GLOBAL mutation lock。
     * - 成功 → state=ACQUIRED，返回 token（token 只属于当前调用链）。
     * - 被活跃 owner 持有 → LOCKED（可选等待 acquireTimeoutMs 后仍失败）。
     * - 确定 stale → STALE_LOCK_DETECTED（**不自动删除**；destructive 不得执行）。
     * - 其它 → UNKNOWN_STATE / LOCK_IO_ERROR / PERMISSION_ERROR。
     *
     * 所有权用 `open(ownershipPath, 'wx')` 独占创建；**绝不用 atomicWriteFile 获取所有权**。
     */
    acquire(opts?: {
        op?: string;
        target?: string;
    }): Promise<AcquireResult>;
    /**
     * 校验 token 是否有效且属于当前持有（供 nested operation 判断能否 reuse）。
     * 返回 true = 该 token 授权本调用链 reuse 当前持有。
     */
    validate(token: unknown): token is MutationLockToken;
    /**
     * 释放锁：release 前**校验 ownership record 的 instanceId === token.instanceId**（以及 manager/tokenId）。
     * 匹配 → 清理 heartbeat + unlink ownership；不匹配 → **不 unlink**，记录 ownership-lost violation。
     *
     * 错误语义（F2 修复）：仅当磁盘 ownership 被确认成功删除后才清空 activeToken；unlink 失败/异常时
     * **保留 activeToken**（本调用链仍持有该 inode），允许调用方重试 release，绝不留下"令牌已失效但锁在磁盘上"的卡死态。
     */
    release(token: MutationLockToken): Promise<void>;
    private startHeartbeat;
    private stopHeartbeat;
    /** 写 heartbeat sidecar（atomicWriteFile 更新 sidecar，不影响 ownership；失败 → degraded，不中断 mutation） */
    private writeHeartbeat;
    /** 删除指定 instanceId 的 heartbeat sidecar（不受 activeToken 状态影响——F1 修复；调用方传自己的 instanceId）。 */
    private cleanupHeartbeat;
    /** 检查 environment.lock 是否确实存在（§8.1 分类用；stat 失败/无法确认 → null） */
    private statLockExists;
    /** ownership 三态读取：missing（缺失）/ corrupt（存在但空或非法）/ ok（有效 owner）。
     *  用于区分「无锁」与「崩溃残留的 0 字节/损坏锁」——后者可被显式 recovery 安全回收（无有效 owner 无从误删）。 */
    private readOwnershipState;
    /** 读取 owner instanceId 的 heartbeat sidecar（无 → null） */
    private readHeartbeat;
    /**
     * 判定锁状态（只分类）。按 Design §6.3 正式状态表：
     *  heartbeat fresh                    → LOCKED
     *  heartbeat expired + PID dead       → STALE_LOCK_DETECTED
     *  heartbeat expired + PID alive + identity 不同 → STALE_LOCK_DETECTED (PID reuse)
     *  heartbeat expired + PID alive + identity 相同 → LOCKED (owner alive / heartbeat degraded)
     *  probe 无法可靠确定                 → UNKNOWN_STATE
     */
    inspectLockState(): Promise<{
        state: LockState;
        detail?: string;
    }>;
    /**
     * 显式 stale recovery（独立动作；对应 CLI `--recover-stale-lock`）。
     * 只执行：inspect → prove definitely stale → 原子 rename 捕获 → 二次验证 → unlink。
     * **不自动触发**；仅当检测为 STALE_LOCK_DETECTED 才允许 capture。
     * 二次验证失败 → quarantine（保留 recovering 文件，不 rename 回环境锁，不覆盖 successor）。
     */
    recoverStaleLock(): Promise<RecoverResult>;
    /** recovery 二次验证：重新探测 recorded pid 是否确证死亡（保守——任何不确定性 → 失败）。
     *  与 inspectLockState 同一套语义：alive:false 仅确证死亡 → stale 成立；
     *  alive 则需 OS identity 判断是否 reuse；无法确定 → 保守失败（不删除）。 */
    private reProveStale;
    /** 列出 locks 目录内容（诊断；不存在 → 空） */
    listLockFiles(): Promise<string[]>;
}
/** 当 release/recover 发现 ownership 已不属于本 token（异常恢复/人工修改）时抛出 */
export declare class EnvironmentLockOwnedByAnotherError extends Error {
    constructor(msg: string);
}
/** release 时 IO 失败（unlink/读 ownership）抛出；保留 activeToken 以便调用方重试 release */
export declare class EnvironmentLockIOError extends Error {
    readonly underlyingCause: unknown;
    constructor(msg: string, underlying?: unknown);
}
/** 锁被挡时向用户呈现的分类（用户可读文案据此选择，绝不暴露环境锁/op/路径等内部细节）。 */
export type LockBlockReason = 
/** 被另一进程/任务活跃持有（LOCKED → 「另一个任务正在运行，请稍后重试」） */
'locked'
/** Phase 3 SAFE MODE 注入谓词阻断（isBlocked → 「配置修改已被保护，请先处理恢复事项」） */
 | 'blocked'
/** 锁不可用/IO/权限/UNKNOWN/STALE（→ 「操作暂时无法执行，请稍后重试」） */
 | 'unavailable';
/** destructive 必须成功获取 Environment Lock；否则抛此错（被另一进程/操作持有，或锁不可用）。
 *  携带 op 与 reason 供内部日志诊断；.message 恒为用户可读的友好文案（不暴露锁/op/路径）。 */
export declare class EnvironmentLockUnavailableError extends Error {
    readonly reason: LockBlockReason;
    readonly op: string;
    constructor(op: string, reason?: LockBlockReason);
}
/** 便捷：以 token 授权当前持有（供 nested operation 判断复用）—— 等价于 manager.validate 的纯函数形态 */
export declare function isTokenValid(manager: EnvironmentLockManager, ctx: MutationLockContext | undefined): ctx is MutationLockContext;
