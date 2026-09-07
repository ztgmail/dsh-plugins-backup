/**
 * UI 层测试辅助（m6-ui）：mock core 调用与样本数据。
 * 仅供 src/ui/*.test.ts 使用，不参与生产构建语义。
 */
import type { Manifest } from '../schema/types.ts';
import type { ExportReport, ImportAnalysis, ImportDecisions, ImportPlan, ImportResult, PlanItem, RollbackReport } from '../core/types.ts';
import type { ExportPort } from './export-flow.ts';
import type { ImportPort } from './types.ts';
/** 样本 manifest（UI 测试不关心真实字段，仅类型占位） */
export declare function makeManifest(): Manifest;
export declare function makeExportReport(overrides?: Partial<ExportReport>): ExportReport;
/** 内存 ExportPort mock：记录调用参数，返回固定结果 */
export declare class MockExportPort implements ExportPort {
    calls: {
        includeSecrets: boolean;
        only?: string[];
    }[];
    result: {
        zipPath: string;
        manifest: Manifest;
        report: ExportReport;
    };
    constructor(report?: ExportReport);
    export(opts: {
        includeSecrets: boolean;
        only?: string[];
    }): Promise<{
        zipPath: string;
        manifest: Manifest;
        report: ExportReport;
    }>;
}
export declare function makeAnalysis(overrides?: Partial<ImportAnalysis>): ImportAnalysis;
export declare function makePlanItem(overrides?: Partial<PlanItem>): PlanItem;
export declare function makePlan(overrides?: Partial<ImportPlan>): ImportPlan;
export declare function makeRollbackReport(overrides?: Partial<RollbackReport>): RollbackReport;
export declare function makeImportResult(overrides?: Partial<ImportResult>): ImportResult;
/** 内存 ImportPort mock：可编排各阶段返回与调用记录 */
export declare class MockImportPort implements ImportPort {
    analysis: ImportAnalysis;
    plan: ImportPlan;
    result: ImportResult;
    analyzeCalls: number;
    planCalls: ImportDecisions[];
    executeCalls: {
        confirm: boolean;
        secretInputs?: Record<string, string>;
        rollbackOnError: boolean;
        decryptPassword?: string;
        plan?: ImportPlan;
    }[];
    constructor(opts?: {
        analysis?: ImportAnalysis;
        plan?: ImportPlan;
        result?: ImportResult;
    });
    analyzeImport(): Promise<ImportAnalysis>;
    createImportPlan(_zip: string, decisions: ImportDecisions): Promise<ImportPlan>;
    decryptArchive(zipPath: string): Promise<{
        zipPath: string;
        refs: string[];
    }>;
    executeImportPlan(_zip: string, plan: ImportPlan, opts: {
        confirm: boolean;
        secretInputs?: Record<string, string>;
        rollbackOnError: boolean;
        decryptPassword?: string;
    }): Promise<ImportResult>;
}
