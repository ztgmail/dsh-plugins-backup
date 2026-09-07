import type { MsgFunc } from '../core/messages.ts';
import type { PluginsSection } from '../schema/types.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, ValidationResult } from '../core/types.ts';
export declare const USER_PATCH_FILE = "cordis.patch.yml";
/** pnpm-workspace.yaml 相对 $DSH_HOME 的路径（plugins 分区内按「插件安装配置」管理）。 */
export declare const PNPM_WORKSPACE_REL: (profile: string | undefined) => string;
export declare class PluginsAdapter implements ConfigAdapter<PluginsSection> {
    readonly id: "plugins";
    readonly displayName = "Plugins";
    readonly defaultIncluded = true;
    readonly portability: "portable";
    /** 插件自身包名：导出 plugins 分区时不列自己（避免备份里出现「当前正在生成备份的插件」的自引用条目） */
    private readonly selfName;
    constructor(selfName?: string);
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<PluginsSection>>;
    analyzeImport(data: PluginsSection, ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: PluginsSection, msg?: MsgFunc): Promise<ValidationResult>;
}
