import type { MsgFunc } from '../core/messages.ts';
import type { ProviderEntry } from '../schema/types.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, ValidationResult } from '../core/types.ts';
import { type NamespaceProvider } from './settings.ts';
/** 导出记录：ProviderEntry 之外附加 namespace 级元数据（导入写回用），满足 ProvidersSection 形状 */
export interface ProviderExportEntry extends ProviderEntry {
    /** 来源 settings namespace（llm-deepseek / llm-pi-ai） */
    namespace: string;
    /** 乐观锁 revision（导入时检测并发修改） */
    revision: number;
    secrets?: {
        path: string[];
        set: boolean;
    }[];
    /** 该 namespace 的完整 redacted 值（导入整体写回，避免按字段重建丢失结构） */
    raw?: Record<string, unknown>;
}
export interface ProviderExportSection {
    version: 1;
    providers: Record<string, ProviderExportEntry>;
}
export declare const DEFAULT_PROVIDER_NAMESPACES: readonly string[];
export declare class ProvidersAdapter implements ConfigAdapter<ProviderExportSection> {
    readonly id: "providers";
    readonly displayName = "Providers & Models";
    readonly defaultIncluded = true;
    readonly portability: "portable";
    private readonly namespaces;
    constructor(namespaces?: string[] | NamespaceProvider);
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<ProviderExportSection>>;
    analyzeImport(data: ProviderExportSection, ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: ProviderExportSection, msg?: MsgFunc): Promise<ValidationResult>;
}
