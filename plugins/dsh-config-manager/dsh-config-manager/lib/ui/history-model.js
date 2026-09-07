/** 结果徽章语义（Badge kind 四态中的三态；skipped 归 warn）。 */
export function resultBadgeKind(result) {
    if (result === 'success')
        return 'ok';
    if (result === 'failed')
        return 'error';
    return 'warn'; // skipped
}
export function kindLabelKey(kind) {
    return `history.kind.${kind}`;
}
/** 全量 kind 枚举（UI 过滤下拉用；顺序 = §5 清单顺序）。 */
export const HISTORY_KIND_OPTIONS = [
    'import', 'restore', 'rollback',
    'profile-switch', 'profile-delete', 'profile-rename', 'profile-save', 'profile-import',
    'sync-apply', 'autosync', 'recovery',
    'backup', 'snapshot-delete', 'snapshot-prune',
];
/** 结果过滤选项。 */
export const HISTORY_RESULT_OPTIONS = ['success', 'failed', 'skipped'];
/** 把 UI 过滤模型转为后端 query 参数（kind/recent 转 kinds/recent 语义）。 */
export function filterToQuery(f) {
    const q = {};
    if (f.kind !== undefined)
        q['kind'] = f.kind;
    if (f.result !== undefined)
        q['result'] = f.result;
    return q;
}
export function summarize(entries) {
    let success = 0;
    let failed = 0;
    let skipped = 0;
    for (const e of entries) {
        if (e.result === 'success')
            success += 1;
        else if (e.result === 'failed')
            failed += 1;
        else
            skipped += 1;
    }
    return { total: entries.length, success, failed, skipped };
}
/**
 * 按 kind 分组（保持 HISTORY_KIND_OPTIONS 顺序），组内按 at 时间倒序。
 * 空组不渲染。纯函数，无 IO。
 */
export function groupByKind(entries) {
    const byKind = new Map();
    for (const e of entries) {
        const list = byKind.get(e.kind);
        if (list === undefined)
            byKind.set(e.kind, [e]);
        else
            list.push(e);
    }
    const groups = [];
    for (const kind of HISTORY_KIND_OPTIONS) {
        const list = byKind.get(kind);
        if (list === undefined)
            continue;
        list.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
        groups.push({ kind, kindLabelKey: kindLabelKey(kind), count: list.length, entries: list });
    }
    return groups;
}
/**
 * 最近 N 条过滤（0 = 全部）。按 at 时间倒序取前 N。
 */
export function applyRecent(entries, recent) {
    if (recent <= 0)
        return entries;
    const sorted = [...entries].sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
    return sorted.slice(0, recent);
}
/** 客户端侧文本子串过滤（补充后端过滤；按 summary/error/kind 匹配，大小写不敏感）。 */
export function filterByText(entries, query) {
    const q = query.trim().toLowerCase();
    if (q === '')
        return entries;
    return entries.filter((e) => e.kind.toLowerCase().includes(q) ||
        e.summary.toLowerCase().includes(q) ||
        (e.error ?? '').toLowerCase().includes(q) ||
        e.sections.some((s) => s.toLowerCase().includes(q)));
}
/** 空态判定。 */
export function isEmpty(entries) {
    return entries.length === 0;
}
//# sourceMappingURL=history-model.js.map