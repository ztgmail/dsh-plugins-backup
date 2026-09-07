/**
 * 路径映射编辑器（规范 §12，m6-ui）。
 *
 * 两种形态（§12 批量映射优先）：
 *  - 单项映射：某条具体 PathIssue（如 workspace 绝对路径）→ 新路径；
 *  - 批量前缀映射：oldPrefix → newPrefix，一次替换全部相关路径。
 *
 * 输出 core PathMapping[]：newPrefix 非空的映射才进入执行计划
 * （core mergePathMappings 只保留已解析映射；未解析项保留在 plan.items 供 UI 提示）。
 * 应用范围 appliesTo 缺省 []（全部相关分区），与 core applyMappingsToSections 语义一致。
 */
import type { PathIssue, PathMapping } from '../core/types.ts';
import type { PathMappingAppliesTo, PathMappingDraft } from './types.ts';
export interface PathMappingEditorOptions {
    /** 从分析结果得到的路径问题 */
    issues?: PathIssue[];
    /** 预置映射（如上次导入可复用的映射） */
    existing?: PathMapping[];
}
export declare class PathMappingEditor {
    private readonly issues;
    private drafts;
    constructor(opts?: PathMappingEditorOptions);
    /** 全部草稿（含未解析） */
    get all(): PathMappingDraft[];
    /** 已解析（newPrefix 非空）的草稿 */
    get resolved(): PathMappingDraft[];
    /** 未解析的问题（UI 需提示用户选择文件夹；按「是否被已解析映射覆盖」判断，批量前缀映射一次覆盖多条） */
    get unresolved(): PathIssue[];
    /** 单项/批量设置映射（oldPrefix 已存在则更新；否则新建批量映射） */
    setMapping(oldPrefix: string, newPrefix: string, appliesTo?: PathMappingAppliesTo[]): void;
    /** 对某个具体值应用当前映射，返回替换结果（预览用；无映射则原样返回） */
    preview(value: string): string;
    /** 未解析项是否可进入执行（false = 有路径问题未解决） */
    get isComplete(): boolean;
    /** 输出 core PathMapping[]（仅已解析项） */
    toPathMappings(): PathMapping[];
}
