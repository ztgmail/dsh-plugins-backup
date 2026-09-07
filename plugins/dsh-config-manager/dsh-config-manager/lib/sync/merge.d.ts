/**
 * m-sync-flow：三方合并引擎（纯函数）。
 *
 * 输入：local / remote / ancestor 各分区的 SectionData + 分区 hash。
 * 行为（每分区）：
 *   - localHash == remoteHash        → skip（无变化）
 *   - localHash != remoteHash：
 *     - localHash == ancestorHash    → useRemote（远端独有改动）
 *     - remoteHash == ancestorHash   → keepLocal（本地独有改动）
 *     - 其余                          → 进入精细合并：JSON 分区按 top-level key 合并、FilesSection 按 relativePath 合并；
 *                                       仅双侧均改且值不同的键/文件留为 conflict，其余非重叠变更自动合入。
 *
 * 输出：MergePlan（纯数据，不含副作用），由上层（SyncEngine.merge）返回给 UI 决策。
 *
 * 安全约束：ancestor 为 undefined 时退化为两方合并：local != remote 视为整分区 conflict（拒绝猜测共同祖先）。
 */
import type { SectionData, SectionId } from '../schema/types.ts';
export type MergeDecision = 'useRemote' | 'keepLocal' | 'skip';
/** 分区内精细合并产生的单条冲突（JSON key 或 FilesSection 单文件）。 */
export interface MergeConflict {
    /** 冲突位置：JSON 分区是 top-level key；FilesSection 是 relativePath。 */
    path: string;
    kind: 'key' | 'file';
    local?: unknown;
    remote?: unknown;
    ancestor?: unknown;
}
export interface MergeSectionResult {
    id: SectionId;
    /** 分区级决策；'skip' 时无 merged/conflicts；'conflict' 时 merged 为 null（仅 conflicts）。 */
    decision: MergeDecision | 'conflict';
    /** 当 decision 为 'useRemote' / 'keepLocal' 时：合并后的整分区数据（= 胜出方原值）。 */
    merged?: SectionData;
    /** 仅 decision === 'conflict' 时非空：分区级冲突或精细合并后剩余冲突。 */
    conflicts: MergeConflict[];
}
export interface MergePlan {
    /** 每分区的合并结果；仅含 local/remote/ancestor 三者任一出现的分区。 */
    sections: MergeSectionResult[];
}
/** 主入口：三方合并。纯函数，无副作用。 */
export declare function merge(local: Partial<Record<SectionId, SectionData>>, remote: Partial<Record<SectionId, SectionData>>, ancestor?: Partial<Record<SectionId, SectionData>>): MergePlan;
