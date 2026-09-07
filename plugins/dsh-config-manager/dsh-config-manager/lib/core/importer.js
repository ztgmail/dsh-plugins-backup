import { Analyzer } from "./analyzer.js";
export class Importer {
    analyzer;
    constructor(opts) {
        this.analyzer = new Analyzer(opts);
    }
    /** 步骤 1-8 + 分析：只读，返回 ImportAnalysis（含兼容性/路径/依赖/秘密摘要） */
    analyzeImport(zipPath) {
        return this.analyzer.analyzeImport(zipPath);
    }
    /** 步骤 9：Dry Run / Preview —— 合并用户冲突决策与路径映射，输出最终可执行计划（零写入） */
    createImportPlan(zipPath, decisions) {
        return this.analyzer.createImportPlan(zipPath, decisions);
    }
    /** 步骤 10-14：确认 → 快照 → 执行 → 校验 → 结果；失败可整体回滚并如实报告 */
    executeImportPlan(zipPath, plan, opts) {
        return this.analyzer.executeImportPlan(zipPath, plan, {
            confirm: opts.confirm,
            secretInputs: opts.secretInputs,
            decryptedCredentials: opts.decryptedCredentials,
            rollbackOnError: opts.rollbackOnError,
            onItem: opts.onItem,
            onItemStart: opts.onItemStart,
            onLog: opts.onLog,
            snapshotBinding: opts.snapshotBinding,
        });
    }
}
//# sourceMappingURL=importer.js.map