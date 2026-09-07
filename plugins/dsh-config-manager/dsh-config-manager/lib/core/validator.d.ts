import type { SectionId } from '../schema/types.ts';
import type { CompatibilityInput, CompatibilityScore, ValidationResult } from './types.ts';
export { validateManifest } from '../schema/manifest.ts';
export { validateSectionData } from '../schema/config.ts';
/** 校验 ZIP 内分区数据集合（空对象=合法）；返回合并的校验结果 */
export declare function validateSections(sections: ReadonlyMap<SectionId, unknown>): ValidationResult;
/**
 * 兼容性评分（规则驱动，不凭感觉）：
 *  unsupported — schema 超出本插件支持范围（过高/过低）
 *  partial     — 跨平台、分区缺失、或备份 DSH 比目标新
 *  good        — 备份 DSH 比目标旧（向后兼容）且其余正常
 *  excellent   — 同平台、无缺失、schema 支持
 */
export declare function computeCompatibility(input: CompatibilityInput): CompatibilityScore;
/** 兼容性得分的可读描述（UI 报告用） */
export declare function describeCompatibility(score: CompatibilityScore): string;
/** 用 describeVersion 生成 schema 状态的用户可读说明 */
export declare function describeSchemaStatus(schemaVersion: number): string;
