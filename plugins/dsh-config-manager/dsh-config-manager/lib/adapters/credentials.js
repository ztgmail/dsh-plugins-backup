import { msgOf, zhMsg } from "../core/messages.js";
import { resolveNamespaces } from "./settings.js";
/** 缺省 ref 收集：遍历 settings namespace，收集 llm apiKeyEnv / providers[].apiKeyEnv，
 * 以及 secrets 标记中「引用类字段」（apiKeyEnv/tokenEnv…）的字段值。
 * 注意 secrets[].path[0] 是 settings 文档内的字段路径（如 ['apiKey']），本身不是凭据 ref（设计 §4.2），
 * 只有指向 env 名的引用字段才值得收集。 */
export function defaultCredentialRefs(namespaces) {
    return async (ctx) => {
        const refs = new Set();
        for (const ns of await resolveNamespaces(namespaces, ctx)) {
            try {
                const info = await ctx.settings.describe(ns, { redactSecrets: true });
                const value = (info.value ?? {});
                // 引用类字段名（值 = env/凭据引用名，非秘密本身）
                const REFERENCE_REF_FIELDS = new Set([
                    'apikeyenv', 'api_key_env', 'apikeyname', 'tokenenv', 'accesstokenenv',
                    'refreshtokenenv', 'clientsecretenv', 'passwordenv',
                ]);
                for (const s of info.secrets) {
                    const first = s.path?.[0];
                    if (typeof first !== 'string' || first === '')
                        continue;
                    const norm = first.toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (!REFERENCE_REF_FIELDS.has(norm))
                        continue;
                    const val = value[first];
                    if (typeof val === 'string' && val !== '')
                        refs.add(val);
                }
                if (typeof value['apiKeyEnv'] === 'string' && value['apiKeyEnv'] !== '')
                    refs.add(value['apiKeyEnv']);
                const providers = value['providers'];
                if (providers !== null && typeof providers === 'object') {
                    for (const pv of Object.values(providers)) {
                        if (pv !== null && typeof pv === 'object' && typeof pv.apiKeyEnv === 'string' && pv.apiKeyEnv !== '') {
                            refs.add(pv.apiKeyEnv);
                        }
                    }
                }
            }
            catch {
                // namespace 不存在则跳过
            }
        }
        return [...refs];
    };
}
export class CredentialsAdapter {
    id = 'credentialsStatus';
    displayName = 'Credentials';
    defaultIncluded = true;
    portability = 'deviceSpecific';
    refs;
    constructor(options = {}) {
        this.refs = options.refs ?? defaultCredentialRefs(options.namespaces ?? []);
    }
    async export(ctx, _options) {
        const credentials = [];
        const warnings = [];
        for (const ref of await this.refs(ctx)) {
            try {
                const status = await ctx.credentials.describe(ref);
                credentials.push({
                    ref,
                    required: true,
                    configured: status.configured,
                    source: status.source ?? 'file',
                    hasValue: false, // 值未导出（安全不变量）
                });
            }
            catch (err) {
                warnings.push(msgOf(ctx)('adapter.credStatusReadFailed', { ref, reason: err instanceof Error ? err.message : String(err) }));
            }
        }
        return {
            sectionId: 'credentialsStatus',
            data: { version: 1, credentials },
            counts: { credentials: credentials.length },
            warnings,
        };
    }
    async analyzeImport(_data, _ctx) {
        // MissingSecret 计划项由引擎在 createImportPlan 兜底生成（analyzer.ensureMissingSecrets），
        // 依据 = 本分区里 configured=true 的凭据 → 用户补录清单。这里保持零写入纯计算。
        return [];
    }
    async applyItem(item, ctx) {
        const ref = item.target?.ref;
        if (!ref)
            return { ok: false, message: ctx.msg('adapter.missingTargetRef') };
        const value = ctx.secretInputs[ref] ?? ctx.decryptedCredentials?.get(ref);
        if (value === undefined || value === '')
            return { ok: false, message: ctx.msg('adapter.credentialValueMissing') };
        await ctx.target.credentials.set(ref, value);
        return { ok: true };
    }
    async validate(data, msg = zhMsg) {
        const issues = [];
        if (data === null || typeof data !== 'object') {
            return { valid: false, issues: [{ path: '$', message: msg('adapter.validate.object', { subject: 'credentials' }), severity: 'error' }] };
        }
        if (data.version !== 1) {
            issues.push({ path: 'version', message: msg('adapter.validate.version', { value: String(data.version) }), severity: 'error' });
        }
        if (!Array.isArray(data.credentials)) {
            issues.push({ path: 'credentials', message: msg('adapter.validate.array', { subject: 'credentials' }), severity: 'error' });
        }
        else {
            for (const c of data.credentials) {
                if (c === null || typeof c !== 'object' || typeof c.ref !== 'string' || c.ref === '') {
                    issues.push({ path: 'credentials[]', message: msg('adapter.validate.credentialRef'), severity: 'error' });
                }
                if (c.hasValue === true) {
                    // 安全不变量：普通导出恒不携带值；若备份声称有值，视为结构异常
                    issues.push({ path: `credentials.${c.ref}.hasValue`, message: msg('adapter.validate.hasValueFalse'), severity: 'error' });
                }
            }
        }
        return { valid: issues.filter((i) => i.severity === 'error').length === 0, issues };
    }
}
//# sourceMappingURL=credentials.js.map