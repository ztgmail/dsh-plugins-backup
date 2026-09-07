/**
 * ui 分区 adapter（设计 §3.3/§4.1/§4.3）：
 * 数据源 = settings.yaml 中「UI 类」namespace（pet / dsh-better-sidebar / remote-web-ui / ui-onboarding / skin 等）。
 * localStorage 等 Host 不可迁移的 UI 状态以 uiMigrationNotes 纯说明形式导出（不含任何值）。
 */
import type { UiSection } from '../schema/types.ts';
import type { MsgFunc } from '../core/messages.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, ValidationResult } from '../core/types.ts';
import { type NamespaceProvider } from './settings.ts';
/** UI 类 namespace 前缀名单（设计 §4.1；随新插件扩展，只影响「某一 namespace 归哪一边」，不影响数据完整性） */
export declare const KNOWN_UI_NAMESPACE_PREFIXES: readonly string[];
/** namespace 名是否属于 UI 类（大小写不敏感前缀匹配） */
export declare function isUiNamespace(name: string): boolean;
/** localStorage 等 Host 无通道的 UI 状态说明（纯说明，不含值；研究报告 §2.2/§4.4） */
export declare const UI_MIGRATION_NOTES: UiSection['uiMigrationNotes'];
export declare class UiAdapter implements ConfigAdapter<UiSection> {
    readonly id: "ui";
    readonly displayName = "UI Preferences";
    readonly defaultIncluded = true;
    readonly portability: "portable";
    private readonly namespaces;
    constructor(namespaces?: string[] | NamespaceProvider);
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<UiSection>>;
    analyzeImport(data: UiSection, ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: UiSection, msg?: MsgFunc): Promise<ValidationResult>;
}
