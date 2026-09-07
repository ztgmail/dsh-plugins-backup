/**
 * Export 控制器（规范 §1 / §21，m6-ui）。
 *
 * 职责：
 *  - Quick Export：推荐项 = defaultIncluded 且非 deviceSpecific 的分区（设计 §11.1）；
 *  - Custom Export：按 §1 分组目录逐项勾选（含默认关闭的可选分区 pluginFiles/sessions）；
 *  - 进度事件：调用 core 前后按 §29 阶段文案发出（UI 不冻结）；
 *  - 结果：返回 ExportReport 并渲染 §21 文本报告。
 *
 * 依赖注入：ExportPort 由宿主在挂载时接入真实 Exporter（core/exporter.ts），
 * 测试注入内存 mock —— 本层零依赖 core 实现。
 */
import type { Manifest, SectionId } from '../schema/types.ts';
import type { ExportOptions, ExportReport } from '../core/types.ts';
import { type ExportCategory, type ExportGroup, type ProgressListener } from './types.ts';
import { type UiT } from './i18n.ts';
/** UI → core 的导出端口（宿主注入 Exporter.export；测试注入 mock） */
export interface ExportPort {
    export(options: ExportOptions): Promise<{
        zipPath: string;
        manifest: Manifest;
        report: ExportReport;
    }>;
}
/**
 * 自定义导出文件名的归一化（P0-④ 体验优化）：无需用户手动输入 `.zip`。
 * - trim 首尾空白；空串 → ''（宿主自动命名）；
 * - 非空且未以 `.zip` 结尾 → 自动补全 `.zip`（大小写不敏感判定，统一补小写后缀）；
 * - 已以 `.zip` 结尾 → 原样返回（含首字符为字母数字的校验由调用方/宿主把关）。
 */
export declare function normalizeExportFileName(raw: string): string;
/** 导出附加选项（P0-④：自定义文件名/备注——经 ExportFlow.run 透传给 host /export） */
export interface ExportExtraOptions {
    /** 自定义导出文件名（.zip；缺省宿主自动命名） */
    fileName?: string;
    /** 导出备注（写入 exports/.backup-notes.json；缺省无） */
    note?: string;
}
export interface ExportFlowOptions {
    port: ExportPort;
    /** 分类目录（缺省用内置目录，与 adapters 的 displayName/defaultIncluded/portability 对齐） */
    categories?: ExportCategory[];
    onProgress?: ProgressListener;
    /** 报告渲染翻译器（zh/en，见 i18n.ts） */
    t?: UiT;
}
export interface ExportRunResult {
    zipPath: string;
    manifest: Manifest;
    report: ExportReport;
    /** §21 渲染文本（report.ts） */
    text: string;
}
/** 内置分类目录（与 src/adapters/* 的 displayName/defaultIncluded/portability 对齐，研究报告 §2.2） */
export declare const DEFAULT_CATEGORIES: readonly ExportCategory[];
export declare class ExportFlow {
    readonly categories: readonly ExportCategory[];
    private readonly port;
    private readonly onProgress;
    private readonly t;
    constructor(opts: ExportFlowOptions);
    /** Quick Export 推荐分区（defaultIncluded 且非 deviceSpecific） */
    quickSelection(): SectionId[];
    /** 按 §1 分组返回分类目录（Custom Export 树） */
    groupedCatalog(): {
        group: ExportGroup;
        label: string;
        note?: string;
        categories: ExportCategory[];
    }[];
    /** 校验 Custom 勾选：未知分区 = invalid；deviceSpecific 分区给提示警告（仍可继续） */
    validateSelection(selection: readonly SectionId[]): {
        valid: boolean;
        warnings: string[];
    };
    /** 执行导出：发进度事件 → 调 core → 渲染 §21 报告 */
    run(mode: 'quick' | 'custom', selection: readonly SectionId[], opts?: {
        includeSecrets?: boolean;
        fileName?: string;
        note?: string;
    }): Promise<ExportRunResult>;
}
