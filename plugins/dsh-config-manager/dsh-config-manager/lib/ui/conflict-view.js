export class ConflictCollector {
    plan;
    decisions = new Map();
    constructor(plan) {
        this.plan = plan;
    }
    /** 需要用户决策的冲突项（kind === 'Conflict'） */
    get conflicts() {
        return this.plan.items.filter((i) => i.kind === 'Conflict');
    }
    /** 设置某项决策；未出现在冲突列表中的 id 忽略并返回 false */
    resolve(itemId, resolution) {
        if (!this.conflicts.some((i) => i.id === itemId))
            return false;
        this.decisions.set(itemId, resolution);
        return true;
    }
    /** 批量决策全部冲突项（keepCurrent / useImported）—— P0-③ 批量操作。
     *  返回实际决策的项数（= 当前冲突数）。与逐项 resolve 语义一致：
     *  未出现在冲突列表中的 id 不会进入决策表。 */
    resolveAll(resolution) {
        let applied = 0;
        for (const item of this.conflicts) {
            this.decisions.set(item.id, resolution);
            applied += 1;
        }
        return applied;
    }
    /** 单项当前决策（未决策返回 null） */
    decisionOf(itemId) {
        return this.decisions.get(itemId) ?? null;
    }
    /** 仍未解决（review 或未决策）的冲突项 */
    unresolved() {
        return this.conflicts.filter((i) => {
            const d = this.decisions.get(i.id);
            return d === undefined || d === 'review';
        });
    }
    get hasUnresolved() {
        return this.unresolved().length > 0;
    }
    /** 转 core 决策表（供 createImportPlan / executeImportPlan 使用） */
    toResolutions() {
        const out = {};
        for (const [id, res] of this.decisions)
            out[id] = res;
        return out;
    }
    /** 构造视图项列表（React 绑定用）：含当前/导入摘要占位 */
    viewItems() {
        return this.conflicts.map((item) => ({
            item,
            currentSummary: item.detail?.split('\n')[0],
            importedSummary: undefined,
            resolution: this.decisionOf(item.id),
        }));
    }
}
//# sourceMappingURL=conflict-view.js.map