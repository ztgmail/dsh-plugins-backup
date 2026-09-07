import type { MsgFunc } from '../core/messages.ts';
import type { NamespaceRecord, SettingsSection } from '../schema/types.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, ValidationResult } from '../core/types.ts';
/** namespace 清单提供者：宿主从 settings.yaml 顶层 key / 插件注册表获得 */
export type NamespaceProvider = (ctx: HostContext) => Promise<string[]> | string[];
export declare function resolveNamespaces(namespaces: string[] | NamespaceProvider, ctx: HostContext): Promise<string[]>;
/** 批量读取 namespace 的 redacted 记录（settings/ui 共用；单项失败跳过并告警） */
export declare function collectNamespaceRecords(ctx: HostContext, names: string[], warnings: string[]): Promise<Record<string, NamespaceRecord>>;
/** 值是否“空”（目标已注册但从未配置 → 视为待初始化，Create 而非 Conflict） */
export declare function isEmptyValue(v: unknown): boolean;
/** 对比导入记录与目标当前值：不存在 → Create；一致 → Skip；不同 → Conflict；
 * 目标端 describe 抛错（命名空间未注册：提供它的插件在目标未激活/未安装）→ MissingDependency（§15 依赖检测），
 * 此时 Create/Update 必然失败，标记为“需注意”让导入继续，而不是整体失败。纯计算，零写入。 */
export declare function planNamespaceItems(data: Record<string, NamespaceRecord>, adapter: 'settings' | 'ui', ctx: ImportContext): Promise<PlanItem[]>;
/** 写入单个 namespace（settings/ui 共用）：读时锁 + expectedRevision 乐观锁，防覆盖并发修改 */
export declare function applyNamespaceItem(item: PlanItem, sectionId: 'settings' | 'ui', ctx: ImportContext): Promise<ApplyResult>;
export declare class SettingsAdapter implements ConfigAdapter<SettingsSection> {
    readonly id: "settings";
    readonly displayName = "Settings";
    readonly defaultIncluded = true;
    readonly portability: "portable";
    private readonly namespaces;
    constructor(namespaces?: string[] | NamespaceProvider);
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<SettingsSection>>;
    analyzeImport(data: SettingsSection, ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: SettingsSection, msg?: MsgFunc): Promise<ValidationResult>;
}
