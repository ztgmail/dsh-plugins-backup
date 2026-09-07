/**
 * 分区风险映射（v1 静态表；可后续接入适配器声明的 risk 字段动态化）。
 * - low    ：低风险——自动应用（无冲突时）
 *   settings / ui / providers / prompts
 * - medium ：中风险——待审队列（路径映射、安装、变更）
 *   workspaces / plugins / mcp
 * - high   ：高风险——永不自动（含双向冲突、设备专属、凭据/秘密）
 *   credentialsStatus / secrets / sessions / pluginFiles / workspaces? 不，
 *   按规划表 workspaces 归 medium（中风险），credentialsStatus/secrets 归 high；
 *   agentPresets / skills 暂归 low（受 sync 通道的 portable 过滤实际不会携带 skills）。
 */
export const SECTION_RISK_TIER = {
    settings: 'low',
    ui: 'low',
    providers: 'low',
    prompts: 'low',
    workspaces: 'medium',
    plugins: 'medium',
    mcp: 'medium',
    skills: 'low',
    agentPresets: 'low',
    agentInstructions: 'low',
    pluginFiles: 'high',
    sessions: 'high',
    self: 'low',
    credentialsStatus: 'high',
    secrets: 'high',
};
/**
 * 按风险等级 + firstSync 标志将 MergePlan 分流到三组。
 * 纯函数：相同输入 → 相同输出；不读 fs、不发网络。
 */
export function classifyMergePlan(plan, opts) {
    const autoApply = [];
    const review = [];
    const skipped = [];
    for (const r of plan.sections) {
        // 跳过：决策为 skip（远端缺且本地未改 / 完全无变化）
        if (r.decision === 'skip') {
            skipped.push(r);
            continue;
        }
        // 双向冲突永远进 review（最高优先级）
        if (r.decision === 'conflict') {
            review.push(r);
            continue;
        }
        // 首次同步强制预览：所有非 skip 项一律进 review
        if (opts.firstSync) {
            review.push(r);
            continue;
        }
        const tier = SECTION_RISK_TIER[r.id];
        // 未知分区（防御性）一律进 review 而非自动应用
        if (tier === undefined) {
            review.push(r);
            continue;
        }
        if (tier === 'low') {
            // 低风险且决策明确（useRemote / keepLocal）→ 自动应用
            autoApply.push(r);
        }
        else {
            // medium / high → 待审
            review.push(r);
        }
    }
    return { autoApply, review, skipped };
}
export function summarizeApplyPlan(apply) {
    return {
        autoApplyCount: apply.autoApply.length,
        reviewCount: apply.review.length,
        skippedCount: apply.skipped.length,
        totalCount: apply.autoApply.length + apply.review.length + apply.skipped.length,
    };
}
//# sourceMappingURL=risk.js.map