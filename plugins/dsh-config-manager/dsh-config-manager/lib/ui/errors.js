/**
 * 可操作错误模型（规范 §23，m6-ui）。
 *
 * 绝不只有 "Something went wrong."：
 *  - 解析错误 → Reason + Suggested action（可操作）；
 *  - 输出前强制脱敏（redact），Secret 永不进入 UI/日志；
 *  - 文案经 UiT 注入（zh 源 / en 镜像，见 i18n.ts）。
 */
import { redact } from "../security/redaction.js";
import { zhUiT } from "./i18n.js";
function buildErrorRules(t) {
    return [
        {
            match: (m) => /SETTINGS_CONFLICT|revision.*conflict/i.test(m),
            title: t('error.settingsConflict.title'),
            suggestedAction: t('error.settingsConflict.action'),
            retryable: true,
        },
        {
            match: (m) => /ImportNotConfirmed|未确认/i.test(m),
            title: t('error.notConfirmed.title'),
            suggestedAction: t('error.notConfirmed.action'),
            retryable: true,
        },
        {
            match: (m) => /backup integrity|完整性校验失败|checksum/i.test(m),
            title: t('error.integrity.title'),
            suggestedAction: t('error.integrity.action'),
            retryable: false,
        },
        {
            match: (m) => /schema.*(不支持|超出)|无法导入|Unsupported|schemaUnsupported|无法导入/i.test(m),
            title: t('error.schema.title'),
            suggestedAction: t('error.schema.action'),
            retryable: false,
        },
        {
            match: (m) => /ENOENT|not found|无法读取|不存在|readFailed/i.test(m),
            title: t('error.notFound.title'),
            suggestedAction: t('error.notFound.action'),
            retryable: true,
        },
        {
            match: (m) => /EACCES|permission|权限/i.test(m),
            title: t('error.permission.title'),
            suggestedAction: t('error.permission.action'),
            retryable: true,
        },
        {
            match: (m) => /install.*(plugin|插件)|needsRestart|重启/i.test(m),
            title: t('error.needsRestart.title'),
            suggestedAction: t('error.needsRestart.action'),
            retryable: false,
        },
    ];
}
/** 将任意错误转换为可操作错误（消息已脱敏，不泄漏 Secret） */
export function toActionableError(err, opts) {
    const t = opts?.t ?? zhUiT;
    const raw = err instanceof Error ? err.message : String(err ?? t('commonUnknownError'));
    const message = redact(raw);
    const rule = buildErrorRules(t).find((r) => r.match(message));
    return {
        title: rule?.title ?? opts?.fallbackTitle ?? t('error.fallback'),
        reason: message,
        suggestedAction: rule?.suggestedAction,
        item: opts?.item !== undefined ? redact(opts.item) : undefined,
        retryable: rule?.retryable ?? true,
    };
}
/** 格式化为用户可读的多行文本（Reason / Suggested action） */
export function formatActionableError(e, t = zhUiT) {
    const lines = [e.title];
    lines.push(`${t('error.reason')}: ${e.reason}`);
    if (e.suggestedAction)
        lines.push(`${t('error.suggestedAction')}: ${e.suggestedAction}`);
    if (e.item)
        lines.push(`${t('error.item')}: ${e.item}`);
    return lines.join('\n');
}
//# sourceMappingURL=errors.js.map