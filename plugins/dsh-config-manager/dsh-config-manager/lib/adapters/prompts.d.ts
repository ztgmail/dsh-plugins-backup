import type { MsgFunc } from '../core/messages.ts';
import type { PromptEntry } from '../schema/types.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, ValidationResult } from '../core/types.ts';
/** 导出记录：PromptEntry 之外记录来源行名（导入需要重建行时使用） */
export interface PromptExportEntry extends PromptEntry {
    sourceLineName?: string;
}
export interface PromptsExportSection {
    version: 1;
    prompts: PromptExportEntry[];
}
/** 从 patch 行 config 中提取 prompt 条目（systemPrompt.persona / planMode.sections[].text） */
export declare function extractPrompts(lines: {
    lineId: string;
    raw: unknown;
}[]): PromptExportEntry[];
/** 把 prompt 文本合并进目标行 config（systemPrompt.persona 或 planMode.sections） */
export declare function mergePromptIntoLine(raw: unknown, prompt: PromptExportEntry): Record<string, unknown>;
/** 由导出条目构造「重建行」raw（Create 导入用；行名取自来源行，缺失时用占位名） */
export declare function buildPromptLine(lineId: string, prompt: PromptExportEntry): Record<string, unknown>;
export declare class PromptsAdapter implements ConfigAdapter<PromptsExportSection> {
    readonly id: "prompts";
    readonly displayName = "Prompts";
    readonly defaultIncluded = true;
    readonly portability: "portable";
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<PromptsExportSection>>;
    analyzeImport(data: PromptsExportSection, ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: PromptsExportSection, msg?: MsgFunc): Promise<ValidationResult>;
}
