import { EXECUTING_STAGE, IMPORT_STAGES, ProgressTracker } from "./progress.js";
import { formatActionableError, toActionableError } from "./errors.js";
export class ImportWizard {
    port;
    onProgress;
    tracker;
    step = 'select';
    zipPath = null;
    analysis = null;
    plan = null;
    result = null;
    rollbackOnError;
    errors = [];
    decisions = {
        strategy: 'merge',
        resolutions: {},
        pathMappings: [],
    };
    secretInputs = {};
    /** 加密备份的解密密码（仅内存，绝不持久化；刷新后要求重输） */
    decryptPassword = '';
    /** 整体加密备份容器是否已解锁（upload 探测到 encrypted 容器后为 false；unlockArchive 成功后为 true） */
    archiveUnlocked = false;
    /**
     * 解锁后的明文 ZIP 路径（仅内存，绝不持久化；指向受控临时目录）。
     * decryptArchive 端点解出明文 ZIP 并返回新 zipPath，后续 analyze/plan/execute 都基于它。
     */
    unlockedZipPath = null;
    constructor(opts) {
        this.port = opts.port;
        this.onProgress = opts.onProgress;
        this.tracker = new ProgressTracker(IMPORT_STAGES, this.onProgress);
        this.rollbackOnError = opts.defaultRollbackOnError ?? true;
    }
    /** 当前状态快照（React 绑定 / 测试断言用） */
    snapshot() {
        return {
            step: this.step,
            zipPath: this.zipPath,
            analysis: this.analysis,
            plan: this.plan,
            result: this.result,
            rollbackOnError: this.rollbackOnError,
            errors: [...this.errors],
        };
    }
    get currentStep() {
        return this.step;
    }
    /**
     * 解析「当前应传给 analyze/plan/execute 的 ZIP 路径」：
     * - 已解锁的整体加密容器 → 用解密后的明文 ZIP 路径；
     * - 否则 → 直接上传/传入的路径。
     */
    resolvedZipPath() {
        return this.archiveUnlocked && this.unlockedZipPath !== null ? this.unlockedZipPath : this.zipPath;
    }
    /**
     * 设置整体加密备份容器是否为 encrypted（upload 探测结果；仅内存）。
     * 调用方先在解密阶段展示密码输入，成功后调用 unlockArchive。
     * 传入 zipPath 时同步记录容器路径（供 unlockArchive/selectZip 引用，
     * 避免 syncWizard 把 store 中已 patch 的 zipPath 覆盖回 null）。
     */
    setArchiveEncrypted(encrypted, zipPath) {
        this.archiveUnlocked = !encrypted;
        if (encrypted && zipPath !== undefined)
            this.zipPath = zipPath;
        this.unlockedZipPath = null;
    }
    /**
     * 解锁整体加密备份容器（只读，零写入）：用备份密码解密上传的容器 → 明文 ZIP。
     * 成功后 archiveUnlocked=true；之后 analyze/plan/execute 基于解密后的 ZIP 路径。
     * 返回明文 ZIP 路径与解密覆盖的凭据 ref 名（导出时容器密码与 secrets.enc 密码
     * 同源，解锁即完成凭据解密验证）——导入全程只需输入这一次密码。
     */
    async unlockArchive(encryptedPath, password) {
        this.zipPath = encryptedPath;
        const { zipPath, refs } = await this.port.decryptArchive(encryptedPath, password);
        this.unlockedZipPath = zipPath;
        this.archiveUnlocked = true;
        return { zipPath, refs };
    }
    /** 步骤 1-2：选 ZIP → Analyzing → Compatibility（analyzeImport 零写入） */
    async selectZip(path) {
        this.zipPath = path;
        this.step = 'analyzing';
        this.tracker.emit('validating');
        this.errors = [];
        try {
            this.analysis = await this.port.analyzeImport(this.resolvedZipPath());
            this.tracker.emit('checking-compatibility');
            if (!this.analysis.valid) {
                // 分析失败（完整性/schema/兼容性）：错误进 errors，UI 停在失败态
                this.errors.push(...this.analysis.errors.map((e) => formatActionableError(toActionableError(new Error(e)))));
                throw new Error(this.analysis.errors.join('; ') || '备份分析失败');
            }
            this.step = 'compatibility';
            return this.analysis;
        }
        catch (err) {
            // 仅当尚未记录分析错误时才追加（避免重复）
            if (this.errors.length === 0) {
                this.errors.push(formatActionableError(toActionableError(err)));
            }
            throw err;
        }
    }
    /** 步骤 3→4：用户确认兼容性后进入 Preview（Dry Run：用当前决策生成计划摘要，零写入） */
    async confirmCompatibility() {
        if (this.analysis === null || this.zipPath === null) {
            throw new Error('尚未完成分析，请先选择备份文件');
        }
        this.plan = await this.port.createImportPlan(this.resolvedZipPath(), this.decisions);
        this.step = 'preview';
        return this.plan;
    }
    /** 更新全局冲突策略（merge/replace/skipExisting，规范 §11） */
    setStrategy(strategy) {
        this.decisions = { ...this.decisions, strategy };
    }
    /** 设置逐项冲突决策（keepCurrent/useImported/review） */
    setResolutions(resolutions) {
        this.decisions = { ...this.decisions, resolutions };
    }
    /** 设置路径映射（§12） */
    setPathMappings(mappings) {
        this.decisions = { ...this.decisions, pathMappings: mappings };
    }
    /** 设置秘密补录值（仅内存，绝不持久化） */
    setSecretInputs(inputs) {
        this.secretInputs = inputs;
    }
    /** 设置加密备份的解密密码（仅内存，绝不持久化；导出密码不可复用，无明文存储） */
    setDecryptPassword(password) {
        this.decryptPassword = password;
    }
    /** Preview 摘要（规范 §10 数值化；基于当前 plan 与 analysis） */
    previewSummary() {
        const items = this.plan?.items ?? [];
        const analysis = this.analysis;
        const count = (kinds) => items.filter((i) => kinds.includes(i.kind)).length;
        return {
            willChange: count(['Create', 'Update', 'Install', 'Conflict']),
            unchanged: count(['Skip']),
            settingsUpdates: count(['Create', 'Update']),
            pluginsInstalled: analysis?.pluginSummary.installed ?? 0,
            pluginsToInstall: count(['Install']),
            mcpAdds: items.filter((i) => i.adapter === 'mcp' && i.kind === 'Create').length,
            prompts: items.filter((i) => i.adapter === 'prompts' && i.kind !== 'Skip').length,
            pathMappingsNeeded: analysis?.pathIssues.length ?? 0,
            secretsNeeded: this.plan?.missingSecrets.length ?? analysis?.secretCount ?? 0,
            conflicts: count(['Conflict']),
            needsRestart: this.plan?.needsRestart ?? false,
        };
    }
    /** 冲突项（供 ConflictCollector 使用） */
    conflictItems() {
        return (this.plan?.items ?? []).filter((i) => i.kind === 'Conflict');
    }
    /** 设置回滚策略（场景 E 选择；执行前调用） */
    setRollbackOnError(enable) {
        this.rollbackOnError = enable;
    }
    /**
     * 步骤 10-14：确认导入 → 快照 → 执行 → 校验 → 结果。
     * 用最终决策重建计划（与预览一致），显式传 rollbackOnError。
     */
    async execute(opts) {
        if (this.zipPath === null || this.analysis === null) {
            throw new Error('尚未完成分析，请先选择备份文件');
        }
        if (opts.confirm !== true) {
            throw new Error('导入未确认：必须确认后才允许修改任何数据');
        }
        const rollbackOnError = opts.rollbackOnError ?? this.rollbackOnError;
        this.step = 'importing';
        // 快照由 Host 端在 executeImportPlan 内部第一步创建；此处只发开始阶段。
        this.tracker.emit('creating-snapshot');
        try {
            // 用最终决策重建计划（与预览逻辑一致，保证 Dry Run 与真实导入一致）
            this.plan = await this.port.createImportPlan(this.resolvedZipPath(), this.decisions);
            // executeImportPlan 是一个单次 HTTP 请求：Host 端串行跑完全部计划项
            // （插件安装为 npm 串行，耗时最长）。请求期间没有任何中间进度事件可
            // 回传——旧实现把 restoring-settings / restoring-plugins /
            // restoring-mcp / validating-config 在请求前全部预发，进度条瞬间跳到
            // 78% 后长时间不动，看起来像卡死。现在统一改为 EXECUTING_STAGE
            // 不定态（无 step/total → 动画），让用户明确知道「仍在执行」。
            // 真实各分区结果在返回后的报告里逐项展示。
            this.tracker.emit(EXECUTING_STAGE);
            this.result = await this.port.executeImportPlan(this.resolvedZipPath(), this.plan, {
                confirm: true,
                secretInputs: this.secretInputs,
                rollbackOnError,
                // 未设置解密密码（普通备份/未解锁）→ 不携带该字段
                decryptPassword: this.decryptPassword === '' ? undefined : this.decryptPassword,
            });
            // 失败且已整体回滚（场景 E）→ 报告回滚阶段
            if (!this.result.ok && this.result.rollback) {
                this.tracker.emit('rolling-back');
            }
            this.tracker.emit('done');
            this.step = 'result';
            return this.result;
        }
        catch (err) {
            this.errors.push(formatActionableError(toActionableError(err)));
            throw err;
        }
    }
    /** 可重试项计数：执行失败（failed）或用户跳过（skippedByUser）的项。 */
    retryableCount() {
        return (this.result?.executed ?? []).filter((e) => e.status === 'failed' || e.skippedByUser === true).length;
    }
    /** 可重试项 id 集合（与 result.executed 对齐；供 executeRetry 过滤计划）。 */
    retryableIds() {
        return new Set((this.result?.executed ?? [])
            .filter((e) => e.status === 'failed' || e.skippedByUser === true)
            .map((e) => e.itemId));
    }
    /**
     * 步骤 10-14（重试版）：只重跑「失败 + 用户跳过」的子集计划（结果页「重试」按钮）。
     * - 复用已解析的最终计划（this.plan，含冲突决策/路径映射），过滤出可重试项；
     * - 仍走 executeImportPlan 全流程：快照 → 子集 apply → 校验 → 结果（幂等）；
     * - 已成功的项不重跑，不重建整体导入；secret 补录值仍沿用仅内存的 secretInputs。
     */
    async executeRetry(opts) {
        if (this.plan === null || this.result === null) {
            throw new Error('没有可重试的导入结果');
        }
        const retryable = this.retryableIds();
        const subset = this.plan.items.filter((i) => retryable.has(i.id));
        if (subset.length === 0) {
            throw new Error('没有失败或跳过的项需要重试');
        }
        const rollbackOnError = opts.rollbackOnError ?? this.rollbackOnError;
        this.step = 'importing';
        this.tracker.emit('creating-snapshot');
        try {
            this.tracker.emit(EXECUTING_STAGE);
            this.result = await this.port.executeImportPlan(this.resolvedZipPath(), { ...this.plan, items: subset }, {
                confirm: true,
                secretInputs: this.secretInputs,
                rollbackOnError,
                decryptPassword: this.decryptPassword === '' ? undefined : this.decryptPassword,
            });
            if (!this.result.ok && this.result.rollback) {
                this.tracker.emit('rolling-back');
            }
            this.tracker.emit('done');
            this.step = 'result';
            return this.result;
        }
        catch (err) {
            this.errors.push(formatActionableError(toActionableError(err)));
            throw err;
        }
    }
    /** 重置向导（可复用实例开始新导入） */
    reset() {
        this.step = 'select';
        this.zipPath = null;
        this.analysis = null;
        this.plan = null;
        this.result = null;
        this.errors = [];
        this.decisions = { strategy: 'merge', resolutions: {}, pathMappings: [] };
        this.secretInputs = {};
        this.decryptPassword = '';
        this.archiveUnlocked = false;
        this.unlockedZipPath = null;
    }
}
//# sourceMappingURL=import-wizard.js.map