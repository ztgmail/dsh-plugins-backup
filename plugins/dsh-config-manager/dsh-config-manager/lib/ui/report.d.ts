/**
 * 报告渲染（规范 §21 导出报告 / §22 导入报告 / §17 回滚报告，m6-ui）。
 *
 * 纯文本渲染：输出用户可读的多行文本（未来 React 客户端可直接替换为组件渲染）。
 * 导入报告按分区统计：从 ExecutedItem.itemId 前缀推断所属分区（与 adapters 的 id 规则一致）。
 */
import type { SectionId } from '../schema/types.ts';
import type { ExecutedItem, ExportReport, ImportResult, RollbackReport } from '../core/types.ts';
import type { ImportResultAction, ImportSectionStat } from './types.ts';
import { type UiT } from './i18n.ts';
export declare function renderExportReport(report: ExportReport, t?: UiT): string;
/** 从 itemId 前缀推断所属分区（与 adapters id 规则对齐；未知归 'other'） */
export declare function sectionFromItemId(itemId: string): SectionId | 'other';
/** 按分区聚合执行结果（统计 + 明细） */
export declare function importSectionStats(executed: readonly ExecutedItem[]): ImportSectionStat[];
/** 导入报告渲染（含回滚状态；§22 动作按钮由 suggestedActions 给出） */
export declare function renderImportReport(result: ImportResult, t?: UiT): string;
/** 结果页动作按钮（§22）。报告已内联展示全部失败/警告项的原因与回滚详情（§23），
 * 不再提供空操作的 Fix Issues / View Details 按钮——仅保留「完成」。 */
export declare function suggestedActions(_result: ImportResult): ImportResultAction[];
/** 回滚报告渲染（full / partial + 人工恢复清单） */
export declare function renderRollbackReport(rr: RollbackReport, t?: UiT): string;
export declare function formatBytes(n: number): string;
