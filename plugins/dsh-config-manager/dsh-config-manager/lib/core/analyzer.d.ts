import { type ZipArchive, type ZipSafetyLimits } from '../utils/zip.ts';
import type { SectionId } from '../schema/types.ts';
import type { MsgFunc } from './messages.ts';
import { type ConfigAdapter, type ExecutedItem, type HostContext, type ImportAnalysis, type ImportDecisions, type ImportPlan, type ImportResult, type SnapshotStore, type TransactionSnapshotContext } from './types.ts';
export interface AnalyzerOptions {
    ctx: HostContext;
    adapters: ConfigAdapter[];
    snapshotStore: SnapshotStore;
    limits?: ZipSafetyLimits;
    /** 依赖存在性检查器（缺省不检查；m5/宿主可注入 which 类实现） */
    dependencyChecker?: (command: string) => Promise<boolean>;
    /** m4 可注入强化版 ZIP 安全解析 */
    parseZipOverride?: (buf: Uint8Array, limits?: ZipSafetyLimits) => ZipArchive;
    /** 消息翻译器（缺省 ctx.msg ?? zh） */
    msg?: MsgFunc;
}
/** m1：每完成一个计划项的进度回调信息（Host 侧 run 状态更新用） */
export interface PlanItemProgress {
    adapter: SectionId;
    /** 已处理计划项序号（1 起，含 skip/warning 信息项） */
    index: number;
    /** 将实际执行的计划项总数（APPLY_ORDER 内各项合计） */
    total: number;
    /** 该项最终状态（ok/skipped/warning/failed） */
    status?: ExecutedItem['status'];
    /** 当前计划项 id（非敏感） */
    detail?: string;
}
export declare class Analyzer {
    private readonly ctx;
    private readonly adapters;
    private readonly snapshotStore;
    private readonly limits?;
    private readonly dependencyChecker?;
    private readonly parseZipFn;
    private readonly msg;
    /** 会话内 bundle 缓存（zipPath → 解析结果），避免重复解压 */
    private readonly bundleCache;
    constructor(opts: AnalyzerOptions);
    private loadBundle;
    private extractSections;
    private analyzeBundle;
    analyzeImport(zipPath: string): Promise<ImportAnalysis>;
    createImportPlan(zipPath: string, decisions: ImportDecisions): Promise<ImportPlan>;
    executeImportPlan(zipPath: string, plan: ImportPlan, opts?: {
        confirm?: boolean;
        secretInputs?: Record<string, string>;
        decryptedCredentials?: Map<string, string>;
        rollbackOnError?: boolean;
        /** m1：每完成一个计划项调用（真实进度埋点；不传则无埋点） */
        onItem?: (info: PlanItemProgress) => void;
        /** m1：每开始一个计划项调用（供 UI 显示「正在执行项 X」/ 判定跳过按钮；不传则无埋点） */
        onItemStart?: (info: {
            adapter: SectionId;
            index: number;
            total: number;
            detail: string;
        }) => void;
        /** 执行日志回调（逐计划项操作 + 子进程命令行；注入 ImportContext 供适配器调用；不传则无日志） */
        onLog?: (line: string) => void;
        /**
         * Phase 4 生产 journal↔snapshot 绑定（deferred 模式）。
         * 宿主经 runJournaled({ deferredSnapshot:true }) 的 ctx 注入；引擎在快照创建/首 mutation 时绑定，
         * 保证快照 durable+verified 且 journal 已知先于任何写。不传 = 无 journal 绑定（非生产 journaled 路径）。
         */
        snapshotBinding?: TransactionSnapshotContext;
    }): Promise<ImportResult>;
    /** 快照状态标记（M1）：成功→done / 失败回滚→rolled-back。元数据写失败只告警不抛错。 */
    private markSnapshotStatus;
    /**
     * 该计划项是否会产生真实 side effect（需 journal step 追踪）。
     * 排除无副作用的「信息/跳过/错误」项与未采用其导入内容的 Conflict ——
     * 这些不写目标，记录只会保守化 reconcile 而无收益。
     */
    private shouldJournalStep;
    /** 文件类且可指纹 → 返回 home-relative 目标路径（posix）；否则 null（不可指纹外部项）。 */
    private static fileRelFor;
    /** 读目标文件算 sha256（home-relative；经 HostContext.fs 使测试 mock 可注入）。失败返回 null。 */
    private fileFp;
    private applyOne;
}
