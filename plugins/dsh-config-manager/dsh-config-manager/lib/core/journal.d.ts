/**
 * journal 专用文本脱敏（Security P1-1 / §29 已并入）：
 * 现有 redact()（结构字段 + 已知值形状）+ 高熵长 token 掩码。
 * 用于 error / recovery.reason 等可能嵌入任意值的字段。
 */
export declare function redactJournalText(text: string): string;
export declare const JOURNAL_SCHEMA_VERSION = 1;
export declare const TRANSACTIONS_DIR = "transactions";
export declare const ACTIVE_DIR = "active";
export declare const COMPLETED_DIR = "completed";
export declare const QUARANTINE_DIR = "quarantine";
export declare const RECOVERY_HISTORY_DIR = "recovery-history";
export declare const SAFE_MODE_MARKER = "safe-mode";
export declare const NEEDS_ATTENTION_SIDECAR_SUFFIX = ".needs-attention";
export declare const VALID_OPERATION_ID_RE: RegExp;
export type JournalState = 'CREATED' | 'SNAPSHOT_CREATED' | 'APPLYING' | 'VALIDATING' | 'COMMITTED' | 'ROLLING_BACK' | 'ROLLED_BACK' | 'RECOVERING' | 'RECOVERED' | 'NEEDS_ATTENTION';
/** terminal states：进入后 operation 不可再改向（只可 move/quarantine/retention） */
export declare const TERMINAL_STATES: ReadonlySet<JournalState>;
/** 合法状态迁移表（严格；禁止无效 transition）。纯函数，供单测。 */
export declare const ALLOWED_TRANSITIONS: Record<JournalState, JournalState[]>;
export declare function isValidTransition(from: JournalState, to: JournalState): boolean;
export declare function isTerminalState(s: JournalState): boolean;
export type StepStatus = 'planned' | 'done' | 'failed' | 'skipped' | 'attention';
export interface JournalStep {
    adapter: string;
    ref: string;
    kind: string;
    /** 外部副作用（插件/Git/WebDAV/reinstall）——crash 后不可证明，一律保守 */
    external: boolean;
    /** side effect 前目标内容指纹（null = 不可指纹） */
    beforeFp: string | null;
    /** side effect 完成后重读磁盘算出的指纹（null = 不可指纹） */
    afterFp: string | null;
    status: StepStatus;
    appliedAt: string | null;
}
export interface JournalCommit {
    at: string | null;
    validated: boolean;
    validationWarnings: string[];
}
export interface JournalRollback {
    attemptedAt: string | null;
    full: boolean;
    failed: string[];
    /** 回滚 WAL：已补偿的 entry 序号（crash during rollback 判定用） */
    entryDone: Record<number, boolean>;
}
/** recovery 元数据；outcome 为 true 表示已达 terminal */
export interface JournalRecovery {
    attemptedAt: string | null;
    outcome: 'RECOVERED' | 'ROLLED_BACK' | 'NEEDS_ATTENTION' | null;
    reason: string;
    attempts: number;
}
/** Phase 5 post-recovery verification verdict（§6.3）。 */
export type RecoveryVerificationVerdict = 'MATCH' | 'PARTIAL_MATCH' | 'MISMATCH' | 'VERIFICATION_ERROR';
/** Phase 5 post-recovery verification 结果（journal 可选字段，additive，不 bump schema）。 */
export interface RecoveryVerification {
    verdict: RecoveryVerificationVerdict;
    /** 每项检查结果（写入前过 redactJournalText 强脱敏）。 */
    details: string[];
    /** 需人工处理项（凭据等；写入前过 redactJournalText 强脱敏）。 */
    manualHints: string[];
    at: string;
}
/** 单个 operation 的 durable journal。不保存任何 secret 值。 */
export interface OperationJournal {
    schemaVersion: number;
    operationId: string;
    operationType: string;
    createdAt: string;
    updatedAt: string;
    state: JournalState;
    /** Journal→Lock 单向绑定（不回填 environment.lock） */
    ownerInstanceId: string;
    lockId: string;
    packageVersion: string;
    environmentFingerprint: string;
    snapshotId: string | null;
    plannedSteps: string[];
    steps: Record<string, JournalStep>;
    commit: JournalCommit;
    rollback: JournalRollback;
    recovery: JournalRecovery;
    /** 最后错误/原因文本（已 redact；非 secret） */
    error: string;
    /**
     * Phase 5：post-recovery verification 结果（可选，additive）。
     * 旧 journal 无此字段（parseSafe 不受影响，schemaVersion 仍为 1）。
     * details/manualHints 写入前必须过 redactJournalText（journal 安全不变量：不保存 secret）。
     */
    recoveryVerification?: RecoveryVerification;
}
export declare function createJournalEntry(operationType: string, lockCtx: {
    operationId: string;
    ownerInstanceId: string;
    lockId: string;
    packageVersion: string;
    environmentFingerprint: string;
}, now: string): OperationJournal;
/** 把 journal 从旧状态迁移到新状态（校验合法 transition；非法抛错）。纯函数。 */
export declare function transitionJournalState(j: OperationJournal, to: JournalState): OperationJournal;
/** 可注入 IO（测 failure injection；默认包 node:fs/promises）。 */
export interface JournalIo {
    mkdir(dir: string, opts: {
        recursive: boolean;
    }): Promise<void>;
    readFileText(p: string): Promise<string>;
    writeAll(target: string, content: string): Promise<void>;
    rename(a: string, b: string): Promise<void>;
    readdirNames(dir: string): Promise<string[]>;
    readdirEntries(dir: string): Promise<Array<{
        name: string;
        isDirectory(): boolean;
    }>>;
    lstat(p: string): Promise<{
        isSymbolicLink(): boolean;
    } | null>;
    rm(p: string, opts: {
        recursive?: boolean;
        force?: boolean;
    }): Promise<void>;
    exists(p: string): Promise<boolean>;
}
export interface JournalStoreOptions {
    transactionsDir: string;
    io?: JournalIo;
}
/** journal 严格 UUID 校验（防文件名穿越）。 */
export declare function isValidOperationId(id: unknown): id is string;
/** 判断文件 basename 是否是可追踪的 journal（<uuid>.json）。忽略 tmp 及其它。 */
export declare function isJournalBasename(name: string): boolean;
/** JournalStore：journal 持久化原语。不决定 transaction outcome。 */
export declare class JournalStore {
    private readonly transactionsDir;
    private readonly io;
    constructor(opts: JournalStoreOptions);
    private activeDir;
    private completedDir;
    private quarantineDir;
    private recoveryHistoryDir;
    private safeModePath;
    private activePath;
    private completedPath;
    private quarantinePath;
    ensureDirs(): Promise<void>;
    /** 写 journal（atomic + 0600 + symlink reject）。返回写入后的 journal。 */
    persist(operationId: string, j: OperationJournal): Promise<OperationJournal>;
    /** 创建新 journal（CREATED）。调用方保证 active≤1。 */
    create(entry: OperationJournal): Promise<OperationJournal>;
    load(operationId: string): Promise<OperationJournal | null>;
    loadActive(operationId: string): Promise<OperationJournal | null>;
    /** 更新 journal（按 updater 修改后原子持久化）。不负责 transition 校验（调用方经 transitionJournalState）。 */
    update(operationId: string, updater: (j: OperationJournal) => OperationJournal): Promise<OperationJournal>;
    /** 原子迁移状态（校验合法 transition），并立即持久化。 */
    transition(operationId: string, to: JournalState): Promise<OperationJournal>;
    /** 扫描 active/ 下全部 journal op id（只认 <uuid>.json；忽略 tmp/损坏）。 */
    scanActive(): Promise<string[]>;
    /** 判断某 op 是否已 terminal（读 active 或 completed 的 journal state）。 */
    isTerminal(operationId: string): Promise<boolean>;
    isActive(operationId: string): Promise<boolean>;
    terminalStateOf(operationId: string): Promise<JournalState | null>;
    /** move active → completed（terminal journal 规整；复用 rename，失败抛错由调用方策略处理）。 */
    moveToCompleted(operationId: string): Promise<void>;
    /** quarantine 损坏/无法 parse/绑定失败的 journal（+ attention sidecar）。幂等。 */
    quarantine(operationId: string, reason: string): Promise<void>;
    /** 追加 recovery-history 事件（审计；best-effort 由调用方 try/catch 包裹）。 */
    appendRecoveryHistory(marker: string, entry: unknown): Promise<void>;
    listRecoveryHistory(): Promise<string[]>;
    /**
     * 收集已被「可恢复 / 未收敛 journal」引用的 snapshotId（Phase 4 F3 prune 保护）：
     * 扫描 active/ + quarantine/ 下的 journal，凡 state 非 COMMITTED（即可能仍需 recovery /
     * NEEDS_ATTENTION / ROLLING_BACK / RECOVERY_REQUIRED / 非终态）且 snapshotId 合法
     * → 收集。返回 Set<string>。COMMITTED 的 snapshot 已消费，不保护（可被 retention 淘汰）。
     * 该集合用于 FileSnapshotStore.prune 豁免 —— 引用的 recovery snapshot 绝不可被自动淘汰。
     */
    listReferencedSnapshotIds(): Promise<Set<string>>;
    /** 读 SAFE MODE（RECOVERY_REQUIRED / NEEDS_ATTENTION）持久标记。存在且内容为 blocked → true。 */
    readSafeMode(): Promise<boolean>;
    /** 写/清 SAFE MODE 标记（atomic）。 */
    writeSafeMode(blocked: boolean): Promise<void>;
    /** 保留策略：completed 保留 N，recovery-history 保留 M。删最旧。幂等。 */
    retention(completedLimit?: number, historyLimit?: number): Promise<void>;
    private pruneOldest;
}
/**
 * 环境指纹：hash(hostname + 持久化 per-install 随机 token)。
 * token 存 <dataDir>/environment-fingerprint.token（0600，atomic），重启稳定、跨安装不同。
 * 不能用 Date.now/pid/临时 id。
 */
export declare function environmentFingerprint(dataDir: string, io?: JournalIo): Promise<string>;
/** 生成 operationId（UUID v4，严格 <uuid>.json 形态）。 */
export declare function generateOperationId(): string;
