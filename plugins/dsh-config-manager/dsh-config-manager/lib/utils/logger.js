/** 敏感字段名黑名单（大小写不敏感；命中即掩码值，规范 §6 清单） */
export const SENSITIVE_FIELD_BLACKLIST = [
    'password', 'passwd', 'token', 'accesstoken', 'refreshtoken', 'apikey',
    'secret', 'credential', 'authorization', 'cookie', 'privatekey', 'clientsecret',
    'sessionkey', 'authtoken', 'bearer',
];
const REDACTED = '***REDACTED***';
/** 字段名是否命中敏感黑名单（大小写不敏感，子串匹配） */
export function isSensitiveField(field) {
    const lower = field.toLowerCase().replace(/[^a-z0-9]/g, '');
    return SENSITIVE_FIELD_BLACKLIST.some((f) => lower.includes(f));
}
/** 对象级掩码：字段名命中黑名单 → 值替换（返回新对象，不改原对象） */
export function redactValue(value, blacklist = SENSITIVE_FIELD_BLACKLIST) {
    if (value === null || typeof value !== 'object')
        return value;
    if (Array.isArray(value))
        return value.map((v) => redactValue(v, blacklist));
    const out = {};
    for (const [k, v] of Object.entries(value)) {
        const lower = k.toLowerCase();
        const hit = blacklist.some((f) => lower.includes(f));
        out[k] = hit ? REDACTED : redactValue(v, blacklist);
    }
    return out;
}
/** 文本级掩码：JSON 片段 `"field": "value"`、`field=value`、`field: value` 形态 */
export function redact(text, blacklist = SENSITIVE_FIELD_BLACKLIST) {
    let out = text;
    for (const field of blacklist) {
        // "field": "anything"
        out = out.replace(new RegExp(`("${field}"\\s*:\\s*")[^"]*(")`, 'gi'), `$1${REDACTED}$2`);
        // field=value / field: value（不含 JSON 引号形态）
        out = out.replace(new RegExp(`(\\b${field}\\s*=\\s*)[^\\s,;]+`, 'gi'), `$1${REDACTED}`);
        out = out.replace(new RegExp(`(\\b${field}\\s*:\\s*)[^\\s,;}]+`, 'gi'), `$1${REDACTED}`);
    }
    return out;
}
const LEVEL_ORDER = { debug: 0, info: 1, warn: 2, error: 3 };
/** 创建结构化日志器（默认 console JSON 行，全部输出过 redact） */
export function createLogger(opts = {}) {
    const level = opts.level ?? 'info';
    const blacklist = [...SENSITIVE_FIELD_BLACKLIST, ...(opts.extraBlacklist ?? [])];
    const sink = opts.sink ?? ((lvl, message, meta) => {
        const line = JSON.stringify({
            ts: new Date().toISOString(),
            level: lvl,
            msg: redact(message, blacklist),
            ...(meta ? { meta: redactValue(meta, blacklist) } : {}),
        });
        // eslint-disable-next-line no-console
        (lvl === 'error' ? console.error : lvl === 'warn' ? console.warn : console.log)(line);
    });
    const emit = (lvl, message, meta) => {
        if (LEVEL_ORDER[lvl] < LEVEL_ORDER[level])
            return;
        try {
            sink(lvl, message, meta);
        }
        catch {
            // 日志器自身永不抛错
        }
    };
    return {
        level,
        debug: (m, meta) => emit('debug', m, meta),
        info: (m, meta) => emit('info', m, meta),
        warn: (m, meta) => emit('warn', m, meta),
        error: (m, meta) => emit('error', m, meta),
    };
}
/** 静默日志器（测试用） */
export function nullLogger() {
    return {
        level: 'error',
        debug: () => { },
        info: () => { },
        warn: () => { },
        error: () => { },
    };
}
//# sourceMappingURL=logger.js.map