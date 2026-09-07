import type { MsgFunc } from '../core/messages.ts';
import type { WorkspacesSection } from '../schema/types.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, ValidationResult } from '../core/types.ts';
export declare class WorkspacesAdapter implements ConfigAdapter<WorkspacesSection> {
    readonly id: "workspaces";
    readonly displayName = "Workspaces";
    readonly defaultIncluded = true;
    readonly portability: "platformSpecific";
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<WorkspacesSection>>;
    analyzeImport(data: WorkspacesSection, ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: WorkspacesSection, msg?: MsgFunc): Promise<ValidationResult>;
}
