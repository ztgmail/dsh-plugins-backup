/**
 * 迁移前咨询的纯渲染模型（Phase 7，m6-ui）。
 *
 * 把 core 的 ConsultReport 转成 React 可直接绑定的视图数据：
 *  - 健康评分徽章（verdict → Badge kind）
 *  - 维度明细（每维度：label / score / verdict / issues）
 *  - 建议（proceed / review / block + 触发项）
 *  - 将应用摘要（willApply）
 *
 * 安全：所有展示文本渲染前由 UI 层 redact() 兜底；本模型只做结构转换，不引入敏感值。
 * 文案走 UiT（zh 源 / en 镜像，见 src/ui/i18n.ts）。
 */
import type { UiT } from './i18n.ts';
import type { ConsultReport, ConsultDimensionId, HealthVerdict, Recommendation } from '../core/migration-consult.ts';
/** Badge kind（与 DESIGN.md 四态语义一一对应） */
export type ConsultBadgeKind = 'ok' | 'info' | 'warn' | 'error';
/** 维度视图数据 */
export interface ConsultDimensionView {
    id: ConsultDimensionId;
    label: string;
    score: number;
    verdict: HealthVerdict;
    badgeKind: ConsultBadgeKind;
    issues: {
        severity: 'info' | 'warning' | 'error';
        message: string;
    }[];
}
/** 咨询卡视图数据 */
export interface ConsultView {
    healthScore: number;
    verdict: HealthVerdict;
    verdictBadgeKind: ConsultBadgeKind;
    recommendation: Recommendation;
    recommendationBadgeKind: ConsultBadgeKind;
    recommendationLabel: string;
    reasons: string[];
    dimensions: ConsultDimensionView[];
    willApply: {
        sections: string[];
        itemCount: number;
        conflicts: number;
        risks: number;
        overwritten: number;
        dryRun: boolean;
    };
}
/** verdict → Badge kind（语义映射） */
export declare function consultVerdictBadgeKind(v: HealthVerdict): ConsultBadgeKind;
/** recommendation → Badge kind */
export declare function consultRecommendationBadgeKind(r: Recommendation): ConsultBadgeKind;
/** 维度 label（i18n key 后缀） */
export declare function consultDimensionLabel(id: ConsultDimensionId, t: UiT): string;
/** 把 ConsultReport 转成视图数据（纯函数） */
export declare function consultView(report: ConsultReport, t: UiT): ConsultView;
/** recommendation 的可读标签 */
export declare function consultRecommendationLabel(r: Recommendation, t: UiT): string;
