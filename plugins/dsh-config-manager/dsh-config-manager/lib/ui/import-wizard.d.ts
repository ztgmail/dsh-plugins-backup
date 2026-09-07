/**
 * Import 向导状态机（规范 §9/§10/§28，m6-ui）。
 *
 * 步骤：Select ZIP → Analyzing → Compatibility → Import Preview → Resolve Conflicts
 *       → Path Mapping → Secrets → Importing → Result。
 *
 * 关键安全/正确性约束：
 *  - analyzeImport / createImportPlan 零写入（Dry Run 复用，规范 §10）；
 *  - executeImportPlan 必须 confirm=true（core 安全阀），UI 在用户点「确认导入」后传入；
 *  - **显式传 rollbackOnError**：场景 E（§36）要求导入中途失败整体回滚，
 *    本向导默认 rollbackOnError=true，UI 可在执行前让用户选择（true=整体回滚 / false=单项失败继续 §34.17）；
 *  - 秘密补录值仅内存（secretInputs），绝不落日志/落盘。
 */
import type { GlobalConflictStrategy, ImportAnalysis, ImportPlan, ImportResult, PathMapping, PlanItem } from '../core/types.ts';
import type { ImportPort, ImportPreviewSummary, ImportStep, ProgressListener, WizardSnapshot } from './types.ts';
export interface ImportWizardOptions {
    port: ImportPort;
    onProgress?: ProgressListener;
    /** 默认回滚策略（场景 E：true=整体回滚；UI 可在执行前覆盖） */
    defaultRollbackOnError?: boolean;
}
export declare class ImportWizard {
    private readonly port;
    private readonly onProgress;
    private readonly tracker;
    private step;
    private zipPath;
    private analysis;
    private plan;
    private result;
    private rollbackOnError;
    private errors;
    private decisions;
    private secretInputs;
    /** 加密备份的解密密码（仅内存，绝不持久化；刷新后要求重输） */
    private decryptPassword;
    /** 整体加密备份容器是否已解锁（upload 探测到 encrypted 容器后为 false；unlockArchive 成功后为 true） */
    private archiveUnlocked;
    /**
     * 解锁后的明文 ZIP 路径（仅内存，绝不持久化；指向受控临时目录）。
     * decryptArchive 端点解出明文 ZIP 并返回新 zipPath，后续 analyze/plan/execute 都基于它。
     */
    private unlockedZipPath;
    constructor(opts: ImportWizardOptions);
    /** 当前状态快照（React 绑定 / 测试断言用） */
    snapshot(): WizardSnapshot;
    get currentStep(): ImportStep;
    /**
     * 解析「当前应传给 analyze/plan/execute 的 ZIP 路径」：
     * - 已解锁的整体加密容器 → 用解密后的明文 ZIP 路径；
     * - 否则 → 直接上传/传入的路径。
     */
    private resolvedZipPath;
    /**
     * 设置整体加密备份容器是否为 encrypted（upload 探测结果；仅内存）。
     * 调用方先在解密阶段展示密码输入，成功后调用 unlockArchive。
     * 传入 zipPath 时同步记录容器路径（供 unlockArchive/selectZip 引用，
     * 避免 syncWizard 把 store 中已 patch 的 zipPath 覆盖回 null）。
     */
    setArchiveEncrypted(encrypted: boolean, zipPath?: string): void;
    /**
     * 解锁整体加密备份容器（只读，零写入）：用备份密码解密上传的容器 → 明文 ZIP。
     * 成功后 archiveUnlocked=true；之后 analyze/plan/execute 基于解密后的 ZIP 路径。
     * 返回明文 ZIP 路径与解密覆盖的凭据 ref 名（导出时容器密码与 secrets.enc 密码
     * 同源，解锁即完成凭据解密验证）——导入全程只需输入这一次密码。
     */
    unlockArchive(encryptedPath: string, password: string): Promise<{
        zipPath: string;
        refs: string[];
    }>;
    /** 步骤 1-2：选 ZIP → Analyzing → Compatibility（analyzeImport 零写入） */
    selectZip(path: string): Promise<ImportAnalysis>;
    /** 步骤 3→4：用户确认兼容性后进入 Preview（Dry Run：用当前决策生成计划摘要，零写入） */
    confirmCompatibility(): Promise<ImportPlan>;
    /** 更新全局冲突策略（merge/replace/skipExisting，规范 §11） */
    setStrategy(strategy: GlobalConflictStrategy): void;
    /** 设置逐项冲突决策（keepCurrent/useImported/review） */
    setResolutions(resolutions: Record<string, 'keepCurrent' | 'useImported' | 'review'>): void;
    /** 设置路径映射（§12） */
    setPathMappings(mappings: PathMapping[]): void;
    /** 设置秘密补录值（仅内存，绝不持久化） */
    setSecretInputs(inputs: Record<string, string>): void;
    /** 设置加密备份的解密密码（仅内存，绝不持久化；导出密码不可复用，无明文存储） */
    setDecryptPassword(password: string): void;
    /** Preview 摘要（规范 §10 数值化；基于当前 plan 与 analysis） */
    previewSummary(): ImportPreviewSummary;
    /** 冲突项（供 ConflictCollector 使用） */
    conflictItems(): PlanItem[];
    /** 设置回滚策略（场景 E 选择；执行前调用） */
    setRollbackOnError(enable: boolean): void;
    /**
     * 步骤 10-14：确认导入 → 快照 → 执行 → 校验 → 结果。
     * 用最终决策重建计划（与预览一致），显式传 rollbackOnError。
     */
    execute(opts: {
        confirm: boolean;
        rollbackOnError?: boolean;
    }): Promise<ImportResult>;
    /** 可重试项计数：执行失败（failed）或用户跳过（skippedByUser）的项。 */
    retryableCount(): number;
    /** 可重试项 id 集合（与 result.executed 对齐；供 executeRetry 过滤计划）。 */
    private retryableIds;
    /**
     * 步骤 10-14（重试版）：只重跑「失败 + 用户跳过」的子集计划（结果页「重试」按钮）。
     * - 复用已解析的最终计划（this.plan，含冲突决策/路径映射），过滤出可重试项；
     * - 仍走 executeImportPlan 全流程：快照 → 子集 apply → 校验 → 结果（幂等）；
     * - 已成功的项不重跑，不重建整体导入；secret 补录值仍沿用仅内存的 secretInputs。
     */
    executeRetry(opts: {
        rollbackOnError?: boolean;
    }): Promise<ImportResult>;
    /** 重置向导（可复用实例开始新导入） */
    reset(): void;
}
