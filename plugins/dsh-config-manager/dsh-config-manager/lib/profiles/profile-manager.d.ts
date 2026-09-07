import type { ConfigAdapter, ExecutedItem, GlobalConflictStrategy, HostContext, ItemResolution, PlanItem, RollbackReport, SnapshotStore, TransactionSnapshotContext } from '../core/types.ts';
import type { SectionId } from '../schema/types.ts';
export interface ProfileMeta {
    name: string;
    createdAt: string;
    updatedAt: string;
    sections: SectionId[];
    fileCount: number;
}
/** profile.json 的磁盘形状（文件类分区 data 为 base64） */
export interface StoredProfile {
    name: string;
    version: 1;
    createdAt: string;
    updatedAt: string;
    sections: Partial<Record<SectionId, unknown>>;
}
export interface SwitchPreview {
    items: PlanItem[];
    missingSecrets: {
        ref: string;
        required: boolean;
    }[];
    needsRestart: boolean;
    sectionsInProfile: SectionId[];
}
export interface ProfileSwitchResult {
    ok: boolean;
    executed: ExecutedItem[];
    needsRestart: boolean;
    missingSecrets: string[];
    warnings: string[];
    rollback: RollbackReport | null;
    snapshotId: string | null;
}
export interface ProfileManagerOptions {
    /** Profile 根目录（建议 ~/.dsh/dsh-config-manager，绝对路径） */
    dataDir: string;
    ctx: HostContext;
    adapters: ConfigAdapter[];
    snapshotStore: SnapshotStore;
    /** Save/切换涉及的默认分区（缺省 = adapter.defaultIncluded 的分区） */
    includeSections?: SectionId[];
}
/** 执行阶段顺序（与 core/analyzer.ts APPLY_ORDER 对齐：副作用大的 patch/安装最后） */
export declare const APPLY_ORDER: readonly SectionId[];
/** Profile 名校验：拒绝路径穿越与非法字符 */
export declare function isValidProfileName(name: string): boolean;
/** Profile 落盘编码：文件类分区 files[].data(Uint8Array) → base64；JSON 分区原样（已可序列化） */
export declare function encodeSections(sections: ReadonlyMap<SectionId, unknown>): Partial<Record<SectionId, unknown>>;
/** Profile 读入解码：base64 → Uint8Array */
export declare function decodeSections(encoded: Partial<Record<SectionId, unknown>>): Map<SectionId, unknown>;
export declare class ProfileManager {
    private readonly dataDir;
    private readonly ctx;
    private readonly adapters;
    private readonly snapshotStore;
    private readonly includeSections;
    private readonly profilesDir;
    constructor(options: ProfileManagerOptions);
    list(): Promise<ProfileMeta[]>;
    private profileDir;
    private profileFile;
    private meta;
    private readStored;
    private writeStored;
    /** 保存当前 DSH 配置为 Profile（复用 adapter.export，天然不含秘密值） */
    saveCurrent(name: string, opts?: {
        sections?: SectionId[];
    }): Promise<ProfileMeta>;
    /** 复制 Profile（含全部分区数据） */
    duplicate(name: string, newName: string): Promise<ProfileMeta>;
    /** 重命名 Profile（目录级移动） */
    rename(oldName: string, newName: string): Promise<ProfileMeta>;
    /** 删除 Profile */
    delete(name: string): Promise<void>;
    private exists;
    /** 只读读取 profile 的分区数据（Phase 7 迁移前咨询用；零写入） */
    readSections(name: string): Promise<Map<SectionId, unknown>>;
    /** Preview（纯读，零写入）：分析切换到该 Profile 会产生的计划项 */
    analyzeSwitch(name: string): Promise<SwitchPreview>;
    /** 执行切换：confirm → Snapshot → 分阶段 apply → 失败 rollback（与导入同一安全语义） */
    executeSwitch(name: string, opts?: {
        confirm?: boolean;
        strategy?: GlobalConflictStrategy;
        resolutions?: Record<string, ItemResolution>;
        secretInputs?: Record<string, string>;
        decryptedCredentials?: Map<string, string>;
        rollbackOnError?: boolean;
        /** Phase 4 生产 journal↔snapshot 绑定（deferred）；不传 = 无 journal 绑定 */
        snapshotBinding?: TransactionSnapshotContext;
    }): Promise<ProfileSwitchResult>;
    /** 逐分区 validate + analyzeImport（纯计算；MissingSecret 兜底与 analyzer.ensureMissingSecrets 等价） */
    private analyzeSections;
    /** 单计划项执行（语义对齐 core/analyzer.ts applyOne） */
    private applyOne;
    /** 导出 Profile 为单 JSON 文件（dsh-profile-<name>.json，自包含可分发；文件类数据 base64 内嵌） */
    exportProfile(name: string, outPath: string): Promise<{
        path: string;
        fileCount: number;
    }>;
    /** 导入 Profile 文件（JSON 校验 + 存入 profiles 目录；同名已存在默认拒绝） */
    importProfile(filePath: string, opts?: {
        asName?: string;
    }): Promise<ProfileMeta>;
}
