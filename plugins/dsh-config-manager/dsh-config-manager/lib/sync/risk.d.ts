/**
 * m-sync-flow：分级自动应用策略 + 首次强制预览（纯函数）。
 *
 * 数据源：P2a 的 MergePlan（每分区 decision + conflicts）。
 * 产出：SyncApplyPlan 三组（autoApply / review / skipped），供 SyncEngine.applyMergePlan 与 UI 使用。
 *
 * 规则：
 *  - SECTION_RISK_TIER 把每个 SectionId 静态归类到 low / medium / high；
 *  - 双向 conflict 分区永远进 review（无论风险与 firstSync 与否）；
 *  - firstSync=true 时所有非 skip 项一律进 review（安全第一：人工确认后才开启自动）；
 *  - firstSync=false 时按风险等级分流：低风险且 useRemote/keepLocal 进 autoApply；
 *    中风险、high、双向冲突 → review；skip 或无变化 → skipped。
 */
import type { MergePlan, MergeSectionResult } from './merge.ts';
import type { SectionId } from '../schema/types.ts';
/** 分区风险等级（驱动自动应用 vs 待审） */
export type RiskTier = 'low' | 'medium' | 'high';
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
export declare const SECTION_RISK_TIER: Readonly<Record<SectionId, RiskTier>>;
export interface ClassifyOptions {
    /**
     * true = 首次同步：所有非 skip 项一律进 review（无论风险等级）；
     * false（默认）= 按风险等级分流。
     * 调用方在 SyncEngine 中维护 firstSyncCompleted 标志。
     */
    firstSync: boolean;
}
/** 自动应用三组结果（互斥：同一 sectionId 只出现在一组） */
export interface SyncApplyPlan {
    autoApply: MergeSectionResult[];
    review: MergeSectionResult[];
    skipped: MergeSectionResult[];
}
/**
 * 按风险等级 + firstSync 标志将 MergePlan 分流到三组。
 * 纯函数：相同输入 → 相同输出；不读 fs、不发网络。
 */
export declare function classifyMergePlan(plan: MergePlan, opts: ClassifyOptions): SyncApplyPlan;
/**
 * 分流摘要计数（供 UI 徽章显示）。
 * 同一函数复用：纯函数无副作用。
 */
export interface SyncApplySummary {
    autoApplyCount: number;
    reviewCount: number;
    skippedCount: number;
    totalCount: number;
}
export declare function summarizeApplyPlan(apply: SyncApplyPlan): SyncApplySummary;
