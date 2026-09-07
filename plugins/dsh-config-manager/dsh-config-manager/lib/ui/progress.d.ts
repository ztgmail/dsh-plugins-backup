/**
 * 进度阶段文案与进度追踪（规范 §29，m6-ui）。
 *
 * 纯文本层：每个阶段 id 有默认文案；未知阶段回退显示 id 本身。
 * ProgressTracker 供导出/导入控制器在调用 core 前后发出阶段事件（UI 不冻结）。
 */
import type { ProgressListener } from './types.ts';
import { type UiT } from './i18n.ts';
/** 导出阶段文案（规范 §29 Export 示例） */
export declare const EXPORT_STAGES: readonly string[];
/** 导入阶段文案（规范 §29 Import 示例 + 快照/回滚阶段） */
export declare const IMPORT_STAGES: readonly string[];
/**
 * 真实执行阶段（不在 IMPORT_STAGES 序列里，因此 step/total 缺省 → 进度条渲染
 * 为不定态动画而非伪造百分比）。execute 是一个单次 HTTP 请求，Host 端串行
 * 跑完全部计划项（其中插件安装是 npm 串行，耗时最长）；请求期间没有中间
 * 进度事件可回传，旧实现把 restoring-settings / restoring-plugins /
 * restoring-mcp / validating-config 在请求前全部预发，导致进度条瞬间跳到
 * 78% 后长时间无变化——像卡死。现在统一在请求期间显示 'executing' 不定态，
 * 让用户明确知道「仍在执行，请等待」。
 */
export declare const EXECUTING_STAGE: "executing";
/** 阶段 id → 用户可读文案（未知阶段回退 id） */
export declare function stageText(stage: string, t?: UiT): string;
/**
 * 进度追踪器：按给定阶段序列在回调时附带 step/total 序号。
 * 控制器调用 core 前后 emit()，UI 侧渲染进度条/阶段文字。
 */
export declare class ProgressTracker {
    private readonly listener;
    private readonly stages;
    private readonly emitted;
    constructor(stages: readonly string[], listener?: ProgressListener);
    /** 发出某阶段事件（可携带 detail）；未在序列中的阶段 step/total 缺省 */
    emit(stage: string, detail?: string): void;
    /** 已发出阶段的快照（测试与日志用） */
    get events(): readonly string[];
}
