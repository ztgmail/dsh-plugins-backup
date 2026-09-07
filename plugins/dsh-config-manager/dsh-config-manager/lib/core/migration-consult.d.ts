import type { Manifest, SectionId } from '../schema/types.ts';
import type { ManifestIssue } from '../schema/manifest.ts';
import type { SensitiveHit } from './types.ts';
export type ConsultSourceType = 'export-zip' | 'local-snapshot' | 'remote-snapshot' | 'profile';
export type HealthVerdict = 'healthy' | 'needs-attention' | 'critical';
export type Recommendation = 'proceed' | 'review' | 'block';
export type ConsultDimensionId = 'compatibility' | 'integrity' | 'sections' | 'consistency' | 'sensitive' | 'migratability';
export interface ConsultSourceRef {
    type: ConsultSourceType;
    /** 源标识：ZIP 路径 / snapshotId / 远端快照 id / profile 名 */
    id: string;
    /** 关联 snapshotId（local-snapshot / remote-snapshot） */
    snapshotId?: string;
}
export interface ConsultIssue {
    severity: 'info' | 'warning' | 'error';
    /** 稳定问题码（i18n 键后缀；如 'integrity.manifestInvalid'） */
    code: string;
    /** 已 redact 的可读消息（宿主/UI 层负责脱敏） */
    message: string;
    /** 已 redact 的证据（可选） */
    evidence?: string;
}
export interface HealthDimension {
    id: ConsultDimensionId;
    /** 0-100 */
    score: number;
    verdict: HealthVerdict;
    issues: ConsultIssue[];
}
/** 可迁移性（宿主经 analyzeImport / createImportPlan / analyzeSwitch 计算；null = 未评估） */
export interface MigratabilityResult {
    ok: boolean;
    itemCount: number;
    fatalConflicts: number;
    warnings: number;
    sections: SectionId[];
    errors: string[];
}
/** 归一化后的源数据（宿主按源类型读取填充；核心只做评分） */
export interface ConsultSourceData {
    source: ConsultSourceRef;
    manifest: Manifest | null;
    manifestIssues: ManifestIssue[];
    sections: Map<SectionId, unknown>;
    sectionFiles: Map<string, Uint8Array>;
    checksums: Record<string, string> | null;
    checksumIssues: string[];
    zipSlipIssues: string[];
    encrypted: boolean;
    containsSecrets: boolean;
    sourceDsh: string;
    sourcePlatform: string;
    schemaVersion: number;
    missingSections: SectionId[];
    /** 敏感暴露面（宿主经 scanAndRedact 统计；只含路径/字段名，不含值） */
    sensitiveHits: SensitiveHit[];
    /** 可迁移性（宿主计算；null = 未评估） */
    migratability: MigratabilityResult | null;
}
export interface ConsultTarget {
    targetDsh: string;
    targetPlatform: string;
}
export interface ConsultOptions {
    /** block 是否允许（health=critical 且此 true 时 recommendation=block；缺省 false） */
    allowBlock?: boolean;
    /** 各维度权重（缺省内置；总和应为 1） */
    weights?: Partial<Record<ConsultDimensionId, number>>;
}
export interface ConsultWillApply {
    sections: SectionId[];
    itemCount: number;
    conflicts: number;
    risks: number;
    overwritten: number;
    /** 咨询恒为 dry-run（只读分析） */
    dryRun: boolean;
}
export interface ConsultReport {
    source: ConsultSourceRef;
    /** 0-100 */
    healthScore: number;
    verdict: HealthVerdict;
    recommendation: Recommendation;
    /** 触发项（已 redact） */
    recommendationReasons: string[];
    dimensions: HealthDimension[];
    willApply: ConsultWillApply;
    bound: {
        manifest?: Manifest;
        snapshotId?: string;
        sourceId: string;
    };
    generatedAt: string;
}
/** 内置维度权重（总和 = 1） */
export declare const DEFAULT_DIMENSION_WEIGHTS: Record<ConsultDimensionId, number>;
/** 维度 verdict 阈值：score>=90 → healthy；60<=score<90 → needs-attention；score<60 → critical */
export declare const HEALTHY_THRESHOLD = 90;
export declare const CRITICAL_THRESHOLD = 60;
/** 兼容性维度：复用 computeCompatibility（扩展而非重写） */
export declare function scoreCompatibility(data: ConsultSourceData, target: ConsultTarget): HealthDimension;
/** 结构完整性维度：manifest 合法 + checksums 匹配 + 无 Zip Slip */
export declare function scoreIntegrity(data: ConsultSourceData): HealthDimension;
/** 分区完整性维度：每个声明分区的数据可解析、无残缺 */
export declare function scoreSections(data: ConsultSourceData): HealthDimension;
/** 一致性维度：跨分区引用（凭据引用）是否自洽；孤立/悬空引用 */
export declare function scoreConsistency(data: ConsultSourceData): HealthDimension;
/** 敏感暴露维度：快照是否含未加密 secret、高熵 token 泄漏面 */
export declare function scoreSensitive(data: ConsultSourceData): HealthDimension;
/** 可迁移性维度：dry-run 应用能否通过（无致命冲突） */
export declare function scoreMigratability(data: ConsultSourceData): HealthDimension;
/** 计算全部维度（确定性） */
export declare function computeDimensions(data: ConsultSourceData, target: ConsultTarget, weights?: Record<ConsultDimensionId, number>): HealthDimension[];
/** 汇总健康评分 + verdict + recommendation（确定性） */
export declare function computeConsultReport(data: ConsultSourceData, target: ConsultTarget, opts?: ConsultOptions): ConsultReport;
