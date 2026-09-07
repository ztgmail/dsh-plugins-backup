export declare const MIGRATION_HISTORY_SCHEMA_VERSION = 1;
export declare const MIGRATION_HISTORY_DIR = "migration-history";
/** 默认保留上限（retention 删最旧）。 */
export declare const DEFAULT_MIGRATION_RETENTION = 1000;
/** 合法 kind 集合（§5 COMPLETE 清单 + 评审补 'profile-import'）。 */
declare const MIGRATION_KINDS: readonly ["import", "restore", "rollback", "profile-switch", "profile-delete", "profile-rename", "profile-save", "profile-import", "sync-apply", "autosync", "recovery", "backup", "snapshot-delete", "snapshot-prune"];
/** §5 覆盖的操作 kind（COMPLETE 不变量；常量枚举，天然非敏感）。 */
export type MigrationKind = (typeof MIGRATION_KINDS)[number];
/** 操作结果。 */
export type MigrationResult = 'success' | 'failed' | 'skipped';
/** 触发来源（常量）。 */
export type MigrationSource = 'api' | 'autosync' | 'backup-scheduler' | 'recovery' | 'cli' | 'internal';
/** 一条不可变的迁移历史记录（磁盘形态；schemaVersion 内联）。 */
export interface MigrationHistoryEntry {
    schemaVersion: number;
    at: string;
    kind: MigrationKind;
    result: MigrationResult;
    /** 涉及分区 adapter id（常量集合）。 */
    sections: string[];
    /** Journal operation id（UUID，BOUND）。 */
    operationId?: string;
    /** 快照 id（UUID，BOUND）。 */
    snapshotId?: string;
    /** run-registry runId（UUID，BOUND）。 */
    runId?: string;
    source: MigrationSource;
    /** 非敏感摘要（redact + high-entropy 后）。 */
    summary: string;
    /** 失败原因（redact + high-entropy 后）。 */
    error?: string;
}
/**
 * 磁盘形态：schemaVersion + contentHash（对除 contentHash 外全字段的 SHA-256）。
 * contentHash 用于 **append-only 篡改检测**：合法 JSON 内改字段值（含 result/summary/at）
 * → 读回 hash 不符 → 该文件被识别为损坏并跳过（满足「篡改必须被拒绝或检测」）。
 * 仅是内联字段（非 MAC/签名 / 非第二套 integrity framework；审计史非对抗性安全边界）。
 */
export interface StoredMigrationHistoryEntry extends Omit<MigrationHistoryEntry, 'schemaVersion'> {
    schemaVersion: number;
    contentHash: string;
}
/** 查询条件（纯函数过滤）。 */
export interface MigrationQuery {
    kinds?: MigrationKind[];
    /** 起始时间（epoch ms，含）。 */
    from?: number;
    /** 结束时间（epoch ms，含）。 */
    to?: number;
    result?: MigrationResult[];
    /** sections 子集匹配（条目 sections 含任一查询分区即命中）。 */
    sections?: string[];
}
/** 统计（纯函数）。 */
export interface MigrationHistoryStats {
    total: number;
    byKind: Partial<Record<MigrationKind, number>>;
    byResult: Partial<Record<MigrationResult, number>>;
}
export type ExportFormat = 'json' | 'markdown';
/** 读取历史的结果：合法条目 + 被识别为损坏/跳过的文件名（append-only 篡改检测）。 */
export interface ReadMigrationResult {
    entries: StoredMigrationHistoryEntry[];
    /** 被跳过/损坏的文件名（读取时识别，UI 可选警示；不静默接受）。 */
    corrupted: string[];
}
/** 追加写入结果（best-effort 调用方据此判断降级）。 */
export interface AppendResult {
    ok: boolean;
    entry: StoredMigrationHistoryEntry;
    file?: string;
    error?: string;
}
/** 可注入 IO 门面（测试注入失败点）；默认包 node:fs/promises。 */
export interface MigrationIo {
    mkdir(dir: string, opts: {
        recursive: boolean;
    }): Promise<void>;
    readdirNames(dir: string): Promise<string[]>;
    readFileText(p: string): Promise<string>;
    writeAll(target: string, content: string): Promise<void>;
    rm(p: string, opts: {
        recursive?: boolean;
        force?: boolean;
    }): Promise<void>;
    lstat(p: string): Promise<{
        isSymbolicLink(): boolean;
    } | null>;
    exists(p: string): Promise<boolean>;
}
/**
 * 历史文本强脱敏：redact（结构化字段 + 已知值形状）+ 高熵长 token 掩码。
 * 用于 summary / error 等可能嵌入任意值的字段（REDACTED 不变量）。
 */
export declare function redactHistoryText(text: string): string;
/**
 * 构造安全条目：对 summary / error 做强脱敏（scanAndRedact 高熵档 + redactHistoryText），
 * 做白名单字段规范化，并计算 contentHash（对除 contentHash 外全字段的 SHA-256）。
 * **历史写入的唯一出口入口**，禁止绕过。
 */
export declare function sanitizeEntry(raw: Omit<MigrationHistoryEntry, 'schemaVersion'> & {
    schemaVersion?: number;
}): StoredMigrationHistoryEntry;
/** 合法 kind 判定（类型守卫 + 运行时校验）。 */
export declare function isValidMigrationKind(k: unknown): k is MigrationKind;
/** 判断文件 basename 是否是可追踪历史文件（<sortable>-<hex>.json）。忽略 tmp 及其它。 */
export declare function isHistoryBasename(name: string): boolean;
/** 文件名安全：仅 basename（不含目录分隔符/穿越）。 */
export declare function isSafeHistoryFilename(name: string): boolean;
/**
 * 生成排序文件名（Windows-safe 定宽时间戳 + 随机后缀 + kind 标记）。
 *
 * 时间戳契约（Windows/排序可靠性）：`toISOString().replace(/[:Z]/g,'')`
 * → `2026-08-30T120000.123`（UTC 定宽、仅 ASCII、无 Windows 非法字符 `<>:"/\|?*`、
 * 字典序== 时间序）。**禁止**以原始 `toISOString()`（含 `:`）直接落文件名（Windows rename 失败）。
 * 与既有 `dateStamp`（`YYYYMMDD-HHmmss`）语义同为「定宽 + 仅 ASCII + 可排序」，本实现用 UTC 含毫秒
 * 以获得更高时序精度；排序可靠性一致。
 */
export declare function makeHistoryFilename(now: Date, kind: MigrationKind): string;
export interface MigrationStoreOptions {
    /** history 存放目录（<dataDir>/migration-history）。 */
    dir: string;
    io?: MigrationIo;
    /** 保留上限（retention 用；调用方可覆盖）。 */
    retention?: number;
}
/** MigrationHistory：per-file append-only 历史存储。 */
export declare class MigrationStore {
    private readonly dir;
    private readonly io;
    constructor(opts: MigrationStoreOptions);
    /** 追加一条历史（原子写）。best-effort：调用方须经 tryAppendHistory 处理失败降级。 */
    append(raw: Omit<MigrationHistoryEntry, 'schemaVersion' | 'at' | 'kind'> & {
        kind: MigrationKind;
        at?: string;
    }): Promise<AppendResult>;
    /** 读取全部合法历史条目（旧→新；损坏/非史文件跳过并计数）。 */
    read(): Promise<ReadMigrationResult>;
    /**
     * 保留清理：按文件名排序删除最旧合法历史文件，幂等。只删合法历史文件（防误删）。
     * 返回本次删除的文件名。
     */
    retention(limit?: number): Promise<string[]>;
}
/** 纯函数过滤（无 IO）。 */
export declare function queryHistory(entries: StoredMigrationHistoryEntry[], q: MigrationQuery): StoredMigrationHistoryEntry[];
/** 纯函数统计（kind/result 计数）。 */
export declare function summarizeHistory(entries: StoredMigrationHistoryEntry[]): MigrationHistoryStats;
/** 导出报告（纯函数）。渲染文本统一过 redact() 兜底（安全不变量）。 */
export declare function renderExport(entries: StoredMigrationHistoryEntry[], format: ExportFormat, locale?: 'zh' | 'en'): string;
/** 解析查询参数为 MigrationQuery（宿主路由复用；过滤非法输入）。 */
export declare function parseHistoryQuery(raw: Record<string, unknown>): MigrationQuery;
export {};
