/**
 * credentialsStatus 分区 adapter（设计 §3.3/§7.1）：
 * 数据源 = ctx.credentials.describe(ref) 的状态（configured/source/writable），
 * 以及 settings secrets 标记 / llm apiKeyEnv 中引用的凭据 ref 名。
 *
 * 安全不变量：永不导出值（hasValue 恒 false）；导入生成 MissingSecret 清单，
 * 用户补录值经 ctx.secretInputs / decryptedCredentials（仅内存）→ credentials.set()。
 * .credentials.yaml 文件字节交由 m4 加密层处理，本 adapter 不触碰。
 */
import type { CredentialsSection } from '../schema/types.ts';
import type { MsgFunc } from '../core/messages.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, ValidationResult } from '../core/types.ts';
import { type NamespaceProvider } from './settings.ts';
export type CredentialRefsProvider = (ctx: HostContext) => Promise<string[]>;
/** 缺省 ref 收集：遍历 settings namespace，收集 llm apiKeyEnv / providers[].apiKeyEnv，
 * 以及 secrets 标记中「引用类字段」（apiKeyEnv/tokenEnv…）的字段值。
 * 注意 secrets[].path[0] 是 settings 文档内的字段路径（如 ['apiKey']），本身不是凭据 ref（设计 §4.2），
 * 只有指向 env 名的引用字段才值得收集。 */
export declare function defaultCredentialRefs(namespaces: string[] | NamespaceProvider): CredentialRefsProvider;
export interface CredentialsAdapterOptions {
    /** 凭据 ref 名收集器（缺省从 settings 推断） */
    refs?: CredentialRefsProvider;
    /** 供缺省 refs 使用的 namespace 清单 */
    namespaces?: string[] | NamespaceProvider;
}
export declare class CredentialsAdapter implements ConfigAdapter<CredentialsSection> {
    readonly id: "credentialsStatus";
    readonly displayName = "Credentials";
    readonly defaultIncluded = true;
    readonly portability: "deviceSpecific";
    private readonly refs;
    constructor(options?: CredentialsAdapterOptions);
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<CredentialsSection>>;
    analyzeImport(_data: CredentialsSection, _ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: CredentialsSection, msg?: MsgFunc): Promise<ValidationResult>;
}
