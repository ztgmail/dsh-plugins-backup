import type { MsgFunc } from '../core/messages.ts';
import type { FilesSection } from '../schema/types.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, ValidationResult } from '../core/types.ts';
export declare const DEFAULT_PLUGIN_FILE_WHITELIST: readonly string[];
export declare class PluginFilesAdapter implements ConfigAdapter<FilesSection> {
    readonly id: "pluginFiles";
    readonly displayName = "Plugin Files";
    readonly defaultIncluded = false;
    readonly portability: "deviceSpecific";
    private readonly whitelist;
    /** 约定配置目录（相对 ~/.dsh 根，如 'plugin-config'）；递归收集其下所有文件。undefined = 不收集。 */
    private readonly collectDir?;
    constructor(whitelist?: string[], collectDir?: string);
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<FilesSection>>;
    analyzeImport(data: FilesSection, ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: FilesSection, msg?: MsgFunc): Promise<ValidationResult>;
}
