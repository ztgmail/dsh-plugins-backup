/** 定时备份产物前缀（区别于手动导出的 dsh-config-；同时是来源标识与清理豁免依据） */
export declare const AUTO_BACKUP_PREFIX = "dsh-config-auto-";
/** 定时备份缺省保留数量：最近 N 个（用户决策 2026-08-24） */
export declare const DEFAULT_BACKUP_RETENTION = 10;
/** 备份文件来源（UI Badge 展示） */
export type BackupFileSource = 'auto' | 'manual';
/** 文件名 → 来源判定（auto 前缀优先；未知前缀归 manual，UI 上仍可管理） */
export declare function backupFileSource(name: string): BackupFileSource;
/** 备份文件元信息（列表行数据；无敏感字段） */
export interface BackupFileMeta {
    /** 文件名（如 dsh-config-auto-20260824-120000-abc.zip） */
    name: string;
    /** 绝对路径（供 /download 与导入向导引用） */
    path: string;
    /** 字节数 */
    sizeBytes: number;
    /** 修改时间（ms 时间戳；按此倒序展示/清理） */
    mtimeMs: number;
    /** 来源：auto = 定时备份；manual = 手动导出 */
    source: BackupFileSource;
    /** 用户备注（手动导出时可选填写；null = 无备注） */
    note?: string | null;
}
/** 备注清单文件名（exports 目录内；可随 self 分区白名单迁移——见 src/adapters/self.ts） */
export declare const BACKUP_NOTES_FILE = ".backup-notes.json";
/** 文件名校验（导出自定义文件名复用）：非空、仅文件名、.zip 结尾；
 *  显式拒绝 `/` `\` 与空白字符（防路径穿越与非法字符）。 */
export declare function isValidExportFileName(name: unknown): name is string;
/**
 * 同名去重：导出时若目标文件名已存在，自动追加数字后缀而非覆盖
 * （用户决策 2026-08-25：同名导出保留两个备份，不互相覆盖）。
 *
 * - 纯函数：仅依据现有文件名集合计算，无 I/O（可 node 直测）；
 * - `foo.zip` 已存在 → `foo-1.zip`；`foo-1.zip` 也存在 → `foo-2.zip` …；
 * - `existingNames` 为现有集合（目录下所有文件名）或可迭代；
 * - 集合不含该名 → 原样返回（零额外开销）。
 */
export declare function resolveNonCollidingExportName(desiredName: string, existingNames: Iterable<string>): string;
/** 读取备注清单（{ 文件名 → 备注 }；缺失/损坏 → 空对象）。 */
export declare function readBackupNotes(exportsDir: string): Promise<Record<string, string>>;
/** 写入单条备注（保留其余；删除备份文件时同步清理，见 deleteBackupFile）。 */
export declare function writeBackupNote(exportsDir: string, name: string, note: string): Promise<Record<string, string>>;
/**
 * 列出导出目录下的全部备份 ZIP（*.zip，时间倒序），合并备注。
 * 目录缺失/不可读 → 返回空数组（不抛错）。
 */
export declare function listBackupFiles(exportsDir: string): Promise<BackupFileMeta[]>;
/** 文件名合法性校验：非空、仅文件名（无路径分隔符，防穿越）、.zip 结尾。
 *  显式拒绝 `/` 与 `\` 两种分隔符——不能依赖 path.basename 判定（平台相关：
 *  POSIX 的 basename 不识别反斜杠，Windows 两者都识别，跨平台会不一致）。 */
export declare function isValidBackupFileName(name: unknown): name is string;
/**
 * 删除一个备份文件（仅限 exportsDir 内 *.zip；防穿越由 isValidBackupFileName 保证）。
 * 同步清理该文件的备注（若存在）。不存在视为成功（幂等）；返回是否实际删除。
 */
export declare function deleteBackupFile(exportsDir: string, name: string): Promise<boolean>;
/**
 * 定时备份保留策略：只保留最近 keep 个 auto 前缀 ZIP，删除更旧的。
 * - 只动 AUTO_BACKUP_PREFIX 前缀的文件（手动导出文件永不在此被删）；
 * - 按 mtime 取最新的 keep 个，其余删除（stat 失败保守不删该文件）；
 * - 返回删除的文件名列表；目录缺失 → 空（不抛错）。
 */
export declare function pruneAutoBackups(exportsDir: string, keep: number): Promise<string[]>;
