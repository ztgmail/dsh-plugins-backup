/**
 * 冲突决策收集（规范 §11，m6-ui）。
 *
 * 输入：ImportPlan.items 中的 Conflict 项（目标存在且不同）。
 * 输出：逐项决策 Keep Current / Use Imported / Review，转为 core ImportDecisions.resolutions。
 *
 * 纯逻辑：只收集用户选择，不触碰 core；未决（review/未选）项在预览时如实展示。
 */
import type { ImportPlan, ItemResolution, PlanItem } from '../core/types.ts';
import type { ConflictViewItem } from './types.ts';
export declare class ConflictCollector {
    private readonly plan;
    private readonly decisions;
    constructor(plan: ImportPlan);
    /** 需要用户决策的冲突项（kind === 'Conflict'） */
    get conflicts(): PlanItem[];
    /** 设置某项决策；未出现在冲突列表中的 id 忽略并返回 false */
    resolve(itemId: string, resolution: ItemResolution): boolean;
    /** 批量决策全部冲突项（keepCurrent / useImported）—— P0-③ 批量操作。
     *  返回实际决策的项数（= 当前冲突数）。与逐项 resolve 语义一致：
     *  未出现在冲突列表中的 id 不会进入决策表。 */
    resolveAll(resolution: Extract<ItemResolution, 'keepCurrent' | 'useImported'>): number;
    /** 单项当前决策（未决策返回 null） */
    decisionOf(itemId: string): ItemResolution | null;
    /** 仍未解决（review 或未决策）的冲突项 */
    unresolved(): PlanItem[];
    get hasUnresolved(): boolean;
    /** 转 core 决策表（供 createImportPlan / executeImportPlan 使用） */
    toResolutions(): Record<string, ItemResolution>;
    /** 构造视图项列表（React 绑定用）：含当前/导入摘要占位 */
    viewItems(): ConflictViewItem[];
}
