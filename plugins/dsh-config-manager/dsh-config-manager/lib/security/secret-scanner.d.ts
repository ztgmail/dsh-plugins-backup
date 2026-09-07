import type { SecretScanner, SensitiveHit } from '../core/types.ts';
/** 剥离占位（与 core defaultSecretScanner 语义一致：空串 = 需补录提示） */
export declare const REDACTED_PLACEHOLDER = "";
/**
 * 敏感字段名单（规范化名：小写、无分隔符）。
 * 覆盖规范 §6 原始清单 + 设计 §7.2 + core logger 名单，并保持克制以防误伤
 * （不收录 `key`/`session` 等过宽子串——`sessionIds`/`monkey` 不得中招）。
 */
export declare const DEFAULT_SECRET_FIELD_NAMES: readonly string[];
/** 引用字段（值只是「名字」而非秘密）：规范化精确命中即豁免 */
export declare const DEFAULT_REFERENCE_FIELDS: readonly string[];
/** 值形状强模式（默认开）：一眼可辨的密钥/凭据形态（包含式：值内任意位置出现即命中） */
export interface ValuePattern {
    name: string;
    re: RegExp;
}
export declare const SECRET_VALUE_PATTERNS: readonly ValuePattern[];
/** 值是否命中强模式 secret 形状（示例/占位形态 → null；返回命中模式名；未命中返回 null）。
 *  extraPatterns 为可选的个人化附加值形状模式（与 SECRET_VALUE_PATTERNS 合并判定，默认内置优先）；
 *  单参调用行为与历史完全一致（向后兼容）。 */
export declare function matchSecretValuePattern(value: string, extraPatterns?: readonly ValuePattern[]): string | null;
export interface SecretScannerOptions {
    /** 附加敏感字段名（任意原始形态，内部会规范化） */
    extraFieldNames?: string[];
    /** 附加引用字段名（规范化后精确命中即豁免） */
    extraReferenceFields?: string[];
    /**
     * 附加值形状强模式（个人化规则，如昵称/用户名格式；与 SECRET_VALUE_PATTERNS 合并参与值形状判定，
     * 默认内置模式优先；示例/占位形态同样降噪放行）。来自部署配置 personalPatterns，不进开源代码。
     */
    extraValuePatterns?: ValuePattern[];
    /** 值形状启发式开关（默认 true） */
    valuePatterns?: boolean;
    /** 高熵长串启发式（默认 false：误伤风险高，需显式开启） */
    highEntropy?: boolean;
    /**
     * 宽松档（默认 false = 保守档）。
     * 保守档（导出/同步脱敏）：字段名敏感即命中，值形状优先、引用/env 名豁免；
     * 宽松档（市场发布扫描）：字段名敏感**且**值像真实字面量凭据才命中——占位符 /
     * 模板引用 / 代码表达式 / 类型词 / 短标识符放行，消除「值不是秘密」的误报。
     */
    literalValueOnly?: boolean;
    /** 最大递归深度（默认 64，与 JSON 深度上限一致） */
    maxDepth?: number;
}
/** 规范化字段名：小写 + 去 `_-. ` 分隔符（用于名单匹配） */
export declare function normalizeFieldName(name: string): string;
/** 是否为「环境变量名」形态（全大写下划线，如 DEEPSEEK_API_KEY）→ 视为引用名 */
export declare function isEnvVarName(value: string): boolean;
/** 是否为模板/环境变量引用形态（${VAR} / {{VAR}} / %VAR% / $VAR）→ 值是名字不是秘密。
 *  注意：文本扫描的 `field: value` 正则用 `[^\s,;}]` 取值，`${...}` / `{{...}}` 的右花括号
 *  会被截断，因此除完整闭合形态外，也接受「以 ${ / {{ / % 开头、内容全为变量名字符」的截断形态。 */
export declare function isTemplateReference(value: string): boolean;
/** 字段名是否命中敏感名单（规范化后精确 / 敏感后缀 / 敏感前缀） */
export declare function isSensitiveFieldName(field: string, extra?: readonly string[]): boolean;
/** 是否为引用字段（值只是名字，不剥离） */
export declare function isReferenceField(field: string, extra?: readonly string[]): boolean;
/** 递归扫描 + 剥离（纯函数，不改原数据；深度保护；返回清洗后数据与命中清单） */
export declare function scanAndRedact(data: unknown, opts?: SecretScannerOptions): {
    sanitized: unknown;
    hits: SensitiveHit[];
};
/** 文本级扫描：逐行找「敏感字段名 + 疑似真实字面量凭据」与「值形状」命中（只报告，不修改文本）。
 *  2026-08-20 优化：字段名命中不再是充分条件 —— 值必须是「非代码引用 / 非占位符 / 非类型词 /
 *  非短标识符」的字面量，消除技能/代码文档中 `token:`/`password:` 等示例命名的误报；
 *  2026-08-21 优化：值形状（sk-/ghp_/AKIA/JWT/PEM/Bearer）对示例/占位形态（含 your/example/
 *  xxx/test/<...> 等占位词）放行；混合字符串需像真实凭据（含数字/符号/大小写混合）才报告。 */
export declare function scanText(text: string, opts?: SecretScannerOptions): SensitiveHit[];
/** 强化版 SecretScanner（对齐 core SecretScanner 契约，可注入 Exporter.scanner） */
export declare function createSecretScanner(opts?: SecretScannerOptions): SecretScanner;
/**
 * 部署配置（F2 个人隐私规则注入，对齐 dsh-packer config.personalPatterns 设计）：
 * 通用隐私规则开源内置（DEFAULT_SECRET_FIELD_NAMES / SECRET_VALUE_PATTERNS 等），
 * 个人化规则（昵称/用户名等）由部署者注入，不进开源代码。
 */
export interface ConfiguredSecretPatterns {
    /** 附加敏感字段名（个人账号/昵称等字段） */
    extraFieldNames?: string[];
    /** 附加引用字段名（值只是名字，如引用环境变量名的个人字段） */
    extraReferenceFields?: string[];
    /** 附加值形状强模式（个人昵称/用户名等一眼可辨格式） */
    extraValuePatterns?: ValuePattern[];
}
/** 从部署配置构造扫描器；未配置（undefined 或全部为空）时返回默认 createSecretScanner()，
 *  行为与默认完全一致。配置了个人化规则时将其作为附加字段名 / 引用字段 / 值形状模式合并进扫描器。 */
export declare function createConfiguredSecretScanner(patterns: ConfiguredSecretPatterns | undefined): SecretScanner;
