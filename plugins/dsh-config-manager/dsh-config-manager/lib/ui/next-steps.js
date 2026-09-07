/** 与 analyzer.createImportPlan 的 needsRestart 判定同一事实源（避免两处规则漂移）。
 *  plan.needsRestart 由「存在 Install 项 或 mcp 非 skip/warning 变更」推出；这里
 *  把实际需要重启的**项**列出来，供 UI 逐项展示（而不只是布尔）。 */
export function restartRequiredItems(plan) {
    return plan.items
        .filter((i) => i.kind === 'Install' || (i.adapter === 'mcp' && i.kind !== 'Skip' && i.kind !== 'Warning'))
        .map((i) => ({ id: i.id, adapter: i.adapter, description: i.description }));
}
/** 失败 / 用户跳过的项（结果页「重试失败/跳过的子集」的对象；引擎跳过 Skip 不算）。
 *  skippedByUser=true 或 status='failed' 才进 unresolved —— 与 ImportWizard.retryableCount
 *  的语义一致（failed || skippedByUser），避免 UI 与控制器口径漂移。 */
export function unresolvedItems(result) {
    return result.executed
        .filter((e) => e.status === 'failed' || e.skippedByUser === true)
        .map((e) => ({ id: e.itemId, status: e.status === 'failed' ? 'failed' : 'skipped', message: e.message }));
}
/** 聚合收尾清单：plan（待重启项）+ result（补录凭据 / 失败跳过项）。 */
export function importNextSteps(plan, result) {
    const restartItems = restartRequiredItems(plan);
    const missingSecrets = [...result.missingSecrets];
    const unresolved = unresolvedItems(result);
    return {
        restartItems,
        missingSecrets,
        unresolved,
        hasNextSteps: restartItems.length > 0 || missingSecrets.length > 0 || unresolved.length > 0,
    };
}
//# sourceMappingURL=next-steps.js.map