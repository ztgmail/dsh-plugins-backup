/**
 * providers 分区 adapter（设计 §3.3/§13.1）：
 * 数据源 = settings.yaml 的 llm-deepseek / llm-pi-ai section（providers 与 models 天然同 section，不拆文件）。
 *
 * 导入走 settings 写通道（replace llm-* namespace + 乐观锁）：
 * 每项携带 raw（该 namespace 的完整 redacted 值）用于整体写回，apiKey 值经 credentials 状态占位（不导出值）。
 */
import { isDeepStrictEqual } from 'node:util';
import { msgOf, zhMsg } from "../core/messages.js";
import { resolveNamespaces, isEmptyValue } from "./settings.js";
export const DEFAULT_PROVIDER_NAMESPACES = ['llm-deepseek', 'llm-pi-ai'];
/** 无 raw 时的兜底重建：只取 ProviderEntry 已知字段 */
function stripEntry(entry) {
    const out = {};
    for (const key of ['apiKeyEnv', 'displayName', 'baseURL', 'models', 'modelOverrides', 'reasoning', 'transport', 'retryPolicy']) {
        if (entry[key] !== undefined)
            out[key] = entry[key];
    }
    return out;
}
export class ProvidersAdapter {
    id = 'providers';
    displayName = 'Providers & Models';
    defaultIncluded = true;
    portability = 'portable';
    namespaces;
    constructor(namespaces = DEFAULT_PROVIDER_NAMESPACES) {
        this.namespaces = namespaces;
    }
    async export(ctx, _options) {
        const providers = {};
        const warnings = [];
        for (const ns of await resolveNamespaces(this.namespaces, ctx)) {
            let info;
            try {
                info = await ctx.settings.describe(ns, { redactSecrets: true });
            }
            catch (err) {
                warnings.push(msgOf(ctx)('adapter.providerNsReadFailed', { ns, reason: err instanceof Error ? err.message : String(err) }));
                continue;
            }
            const value = (info.value ?? {});
            // llm-pi-ai 形态：value.providers = { route: {...} }；llm-deepseek 形态：value 即单 provider 配置
            const routes = value.providers !== null && typeof value.providers === 'object'
                ? Object.entries(value.providers)
                : [[ns, value]];
            for (const [route, pv] of routes) {
                // 每个 route 独立深拷贝 secrets / pv / raw：同一 namespace 的多 route 若共享引用，
                // m4 强化版 createSecretScanner 的 visited 循环检测会误判「检测到循环引用」（见 providers.test.ts）。
                providers[route] = {
                    route,
                    namespace: ns,
                    revision: info.revision,
                    secrets: structuredClone(info.secrets),
                    ...structuredClone(pv),
                    raw: structuredClone(value),
                };
            }
        }
        return {
            sectionId: 'providers',
            data: { version: 1, providers },
            counts: { providers: Object.keys(providers).length },
            warnings,
        };
    }
    async analyzeImport(data, ctx) {
        const msg = ctx.msg;
        const items = [];
        for (const [route, entry] of Object.entries(data.providers)) {
            const id = `provider:${route}`;
            let current = null;
            let targetUnavailable = false;
            try {
                current = await ctx.target.settings.describe(entry.namespace, { redactSecrets: true });
            }
            catch {
                // 目标未注册该 namespace（缺少提供它的插件）→ 写入必失败，按依赖缺失处理（§15）
                targetUnavailable = true;
            }
            if (targetUnavailable) {
                items.push({
                    id, kind: 'MissingDependency', adapter: 'providers',
                    description: msg('adapter.providerUnregistered', { route, ns: entry.namespace }),
                    severity: 'warning', target: { adapter: 'providers', ref: entry.namespace },
                });
            }
            else if (current === null || isEmptyValue(current.value)) {
                // 目标已注册但为空 → 初始化（Create）
                items.push({
                    id, kind: 'Create', adapter: 'providers',
                    description: msg('adapter.providerCreate', { route, ns: entry.namespace }), severity: 'info',
                    target: { adapter: 'providers', ref: entry.namespace },
                });
            }
            else if (isDeepStrictEqual(current.value, entry.raw ?? stripEntry(entry))) {
                items.push({ id, kind: 'Skip', adapter: 'providers', description: msg('adapter.providerSame', { route }), severity: 'info' });
            }
            else {
                items.push({
                    id, kind: 'Conflict', adapter: 'providers',
                    description: msg('adapter.providerDiff', { route }),
                    detail: `namespace=${entry.namespace} current=${JSON.stringify(current.value)} imported=${JSON.stringify(entry.raw ?? stripEntry(entry))}`.slice(0, 200),
                    severity: 'warning', target: { adapter: 'providers', ref: entry.namespace },
                });
            }
        }
        return items;
    }
    async applyItem(item, ctx) {
        const route = item.id.replace(/^provider:/, '');
        const data = ctx.sections.get('providers');
        const entry = data?.providers[route];
        if (!entry)
            return { ok: false, message: ctx.msg('adapter.providerMissing', { route }) };
        const value = entry.raw ?? stripEntry(entry);
        let expected;
        try {
            expected = (await ctx.target.settings.describe(entry.namespace, { redactSecrets: true })).revision;
        }
        catch {
            expected = undefined; // 目标 namespace 不存在（Create）
        }
        await ctx.target.settings.replace(entry.namespace, value, expected);
        return { ok: true };
    }
    async validate(data, msg = zhMsg) {
        const issues = [];
        if (data === null || typeof data !== 'object') {
            return { valid: false, issues: [{ path: '$', message: msg('adapter.validate.object', { subject: 'providers' }), severity: 'error' }] };
        }
        if (data.version !== 1) {
            issues.push({ path: 'version', message: msg('adapter.validate.version', { value: String(data.version) }), severity: 'error' });
        }
        if (data.providers === null || typeof data.providers !== 'object') {
            issues.push({ path: 'providers', message: msg('adapter.validate.missingObject', { subject: 'providers' }), severity: 'error' });
        }
        else {
            for (const [route, entry] of Object.entries(data.providers)) {
                if (entry === null || typeof entry !== 'object') {
                    issues.push({ path: `providers.${route}`, message: msg('adapter.validate.recordObject', { subject: 'provider' }), severity: 'error' });
                    continue;
                }
                if (typeof entry.namespace !== 'string' || entry.namespace === '') {
                    issues.push({ path: `providers.${route}.namespace`, message: msg('adapter.validate.sourceNamespace'), severity: 'error' });
                }
                if (typeof entry.revision !== 'number') {
                    issues.push({ path: `providers.${route}.revision`, message: msg('adapter.validate.number', { subject: 'revision' }), severity: 'error' });
                }
            }
        }
        return { valid: issues.filter((i) => i.severity === 'error').length === 0, issues };
    }
}
//# sourceMappingURL=providers.js.map