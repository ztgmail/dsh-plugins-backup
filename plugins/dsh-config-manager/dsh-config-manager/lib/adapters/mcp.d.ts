import type { MsgFunc } from '../core/messages.ts';
import type { McpServerEntry } from '../schema/types.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, ValidationResult } from '../core/types.ts';
/** 导出记录：McpServerEntry 之外附加来源 patch 行 id（导入写回定位用） */
export interface McpExportEntry extends McpServerEntry {
    sourceLineId: string;
}
export interface McpExportSection {
    version: 1;
    servers: McpExportEntry[];
}
/** 从 patch 行数组中提取 MCP server 条目（以 config.serverName 存在为判定） */
export declare function extractMcpServers(lines: {
    lineId: string;
    raw: unknown;
}[]): McpExportEntry[];
/** 由导出条目构造写回 patch 行 raw（单行形态，与 dsh-mcp-client 组合 config 语义一致） */
export declare function buildMcpPatchLine(lineId: string, server: McpServerEntry): Record<string, unknown>;
export declare class McpAdapter implements ConfigAdapter<McpExportSection> {
    readonly id: "mcp";
    readonly displayName = "MCP Servers";
    readonly defaultIncluded = true;
    readonly portability: "platformSpecific";
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<McpExportSection>>;
    analyzeImport(data: McpExportSection, ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: McpExportSection, msg?: MsgFunc): Promise<ValidationResult>;
}
