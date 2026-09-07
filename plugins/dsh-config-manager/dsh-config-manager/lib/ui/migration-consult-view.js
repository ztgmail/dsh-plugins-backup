/** verdict → Badge kind（语义映射） */
export function consultVerdictBadgeKind(v) {
    switch (v) {
        case 'healthy': return 'ok';
        case 'needs-attention': return 'warn';
        case 'critical': return 'error';
    }
}
/** recommendation → Badge kind */
export function consultRecommendationBadgeKind(r) {
    switch (r) {
        case 'proceed': return 'ok';
        case 'review': return 'warn';
        case 'block': return 'error';
    }
}
/** 维度 label（i18n key 后缀） */
export function consultDimensionLabel(id, t) {
    switch (id) {
        case 'compatibility': return t('consult.dim.compatibility');
        case 'integrity': return t('consult.dim.integrity');
        case 'sections': return t('consult.dim.sections');
        case 'consistency': return t('consult.dim.consistency');
        case 'sensitive': return t('consult.dim.sensitive');
        case 'migratability': return t('consult.dim.migratability');
    }
}
/** 把 ConsultReport 转成视图数据（纯函数） */
export function consultView(report, t) {
    const dimensions = report.dimensions.map((d) => ({
        id: d.id,
        label: consultDimensionLabel(d.id, t),
        score: d.score,
        verdict: d.verdict,
        badgeKind: consultVerdictBadgeKind(d.verdict),
        issues: d.issues.map((i) => ({ severity: i.severity, message: i.message })),
    }));
    return {
        healthScore: report.healthScore,
        verdict: report.verdict,
        verdictBadgeKind: consultVerdictBadgeKind(report.verdict),
        recommendation: report.recommendation,
        recommendationBadgeKind: consultRecommendationBadgeKind(report.recommendation),
        recommendationLabel: consultRecommendationLabel(report.recommendation, t),
        reasons: report.recommendationReasons,
        dimensions,
        willApply: {
            sections: report.willApply.sections,
            itemCount: report.willApply.itemCount,
            conflicts: report.willApply.conflicts,
            risks: report.willApply.risks,
            overwritten: report.willApply.overwritten,
            dryRun: report.willApply.dryRun,
        },
    };
}
/** recommendation 的可读标签 */
export function consultRecommendationLabel(r, t) {
    switch (r) {
        case 'proceed': return t('consult.recommendation.proceed');
        case 'review': return t('consult.recommendation.review');
        case 'block': return t('consult.recommendation.block');
    }
}
//# sourceMappingURL=migration-consult-view.js.map