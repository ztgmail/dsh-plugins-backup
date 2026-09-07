/** 从分析 + 计划构建分区清单（sectionsInZip ↔ estimatedActions 对齐）。 */
export function inspectSections(analysis, plan) {
    return analysis.sectionsInZip.map((section) => ({ section, count: plan.estimatedActions[section] ?? 0 }));
}
/** 从计划构建差异摘要（与导入预览统计口径一致）。 */
export function inspectSummary(analysis, plan) {
    const items = plan.items;
    const kind = (kinds) => items.filter((i) => kinds.includes(i.kind)).length;
    return {
        willChange: kind(['Create', 'Update', 'Install', 'Conflict']),
        unchanged: kind(['Skip']),
        conflicts: kind(['Conflict']),
        secretsNeeded: plan.missingSecrets.length,
        pathMappingsNeeded: analysis.pathIssues.length,
        needsRestart: plan.needsRestart,
        changes: [...items],
    };
}
/** 判断 PlanItem 是否属于「变更」组（Create/Update/Install —— 将实际写入的项）。 */
function isChangeKind(kind) {
    return kind === 'Create' || kind === 'Update' || kind === 'Install';
}
/**
 * 把逐项变更列表按用户视角分组并排序（纯函数，接受任意 PlanItem 数组——
 * 备份 diff、配置档案切换预览共用同一分组语义）：
 * 冲突（需决策，error）→ 变更（将写入，info）→ 路径映射（需处理，warn）
 * → 一致跳过（无需处理，ok）→ 其余（MissingSecret/MissingDependency/
 * Warning/Error 等，warn）。空组不返回；非冲突类条目全部保留（不丢信息）。
 */
export function groupPlanItems(items) {
    const by = (pred) => items.filter(pred);
    const groups = [];
    const conflicts = by((i) => i.kind === 'Conflict');
    if (conflicts.length > 0)
        groups.push({ key: 'conflicts', kind: 'error', items: conflicts });
    const changes = by((i) => isChangeKind(i.kind));
    if (changes.length > 0)
        groups.push({ key: 'changes', kind: 'info', items: changes });
    const paths = by((i) => i.kind === 'PathMapping');
    if (paths.length > 0)
        groups.push({ key: 'paths', kind: 'warn', items: paths });
    const skipped = by((i) => i.kind === 'Skip');
    if (skipped.length > 0)
        groups.push({ key: 'skipped', kind: 'ok', items: skipped });
    const others = items.filter((i) => (i.kind !== 'Conflict' && !isChangeKind(i.kind) && i.kind !== 'PathMapping' && i.kind !== 'Skip'));
    if (others.length > 0)
        groups.push({ key: 'others', kind: 'warn', items: others });
    return groups;
}
/** 备份 diff 分组入口：从差异摘要取 changes 数组分组（与配置档案预览共用语义）。 */
export function inspectGroupedChanges(summary) {
    return groupPlanItems(summary.changes);
}
//# sourceMappingURL=backup-inspect.js.map