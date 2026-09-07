import { Importer } from '../core/importer.ts';
import type { ConfigAdapter, GlobalConflictStrategy, HostContext, ImportAnalysis, ImportPlan, ImportResult, PlanItem, PlanItemKind, SecretScanner } from '../core/types.ts';
import type { SectionId } from '../schema/types.ts';
import type { SnapshotFs } from './fs.ts';
import type { SyncSnapshot, SyncSnapshotMeta, SyncTransport } from './transport.ts';
import type { MsgFunc } from '../core/messages.ts';
import type { MergePlan } from './merge.ts';
import type { SyncApplyPlan } from './risk.ts';
import type { TransactionSnapshotContext } from '../core/types.ts';
import type { PlanItemProgress } from '../core/analyzer.ts';
export interface SyncEngineOptions {
    ctx: HostContext;
    transport: SyncTransport;
    /** sync-state.json 所在目录 */
    stateDir: string;
    /** 分区 adapter 列表（缺省 createAdapters()；宿主应注入 namespaces 等） */
    adapters?: ConfigAdapter[];
    /** 秘密扫描器（缺省 defaultSecretScanner：敏感字段名剥离） */
    scanner?: SecretScanner;
    /** pull 需要；不注入则 pull 抛错（push 不受影响） */
    importer?: Importer;
    now?: () => Date;
    /** 快照 id 生成器（缺省 sync-<uuid>；须符合通道安全字符集） */
    snapshotId?: () => string;
    /** 记录到 sync-state.transport.ref（如 git 分支名） */
    transportRef?: string;
    /** 本地散文件快照副本目录（push 落盘审计副本；不传则跳过本地落盘） */
    localSnapshotsDir?: string;
    /** 一键回滚兜底快照目录（apply-items / apply-merge-plan 落盘；缺省 <stateDir>/snapshots，
     *  与 Host /sync/rollback 路由读取的目录保持一致，否则回滚找不到 snapshot.json） */
    rollbackSnapshotsDir?: string;
    /** pull 临时 ZIP 目录（缺省 os.tmpdir()） */
    zipDir?: string;
    exporterVersion?: string;
    fsx?: SnapshotFs;
    /** 消息翻译器（缺省 ctx.msg ?? zh） */
    msg?: MsgFunc;
    /**
     * 同步范围（高级/自定义导出模式持久化配置）：只处理这些 portable 分区。
     * 缺省 = 全部 portable 推荐分区。应用于 push / merge / applyMergePlan / applyItems
     * 等全部链路（portableAdapters 层过滤），供自动同步等后台流程复用用户选择；
     * 手动请求仍可用 push(opts.sections) 覆盖。
     */
    sections?: SectionId[];
}
export interface SyncPushOptions {
    /** 覆盖自动生成的快照 id */
    snapshotId?: string;
    /** 仅同步指定分区（缺省 = 全部 portable 推荐分区，即「默认/快速导出」模式）。
     *  传入非 portable 或未知分区 → 忽略并告警（同步通道安全约束：
     *  deviceSpecific/platformSpecific 永不进入同步通道；未知 id 不静默吞掉）。 */
    sections?: SectionId[];
    /** 加密快照：sections 载荷整体加密（AES-256-GCM），manifest.encrypted=true。
     *  开启时必须提供 password（仅本次调用内存使用，绝不落盘/落日志）。 */
    encrypt?: boolean;
    /** 加密密码（仅内存；encrypt=true 时必填）。 */
    password?: string;
    /** 导出真实凭据值（凭据值进入快照）。安全不变量：includeSecrets=true 必须同时 encrypt=true，
     *  否则拒绝（密钥绝不明文进入同步通道）；自动同步恒 includeSecrets=false（推普通快照）。 */
    includeSecrets?: boolean;
}
export interface SyncPullOptions {
    /** 指定远端快照 id（缺省 = 最新） */
    snapshotId?: string;
    /** 冲突全局策略（缺省 merge：冲突保留待决策） */
    strategy?: GlobalConflictStrategy;
    /** 解密密码（加密快照需要；仅内存，绝不落盘/落日志） */
    password?: string;
}
export interface SyncPushReport {
    ok: boolean;
    snapshotId: string;
    /** 实际进入同步的 portable 分区 */
    sections: SectionId[];
    /** 分区级告警（单项失败不拖垮整体，§34.17 语义） */
    warnings: string[];
    message?: string;
}
/** 差异报告中的单个变更项（PlanItem 摘要，不含敏感细节） */
export interface PullChange {
    id: string;
    adapter: SectionId;
    kind: PlanItemKind;
    description: string;
    severity: PlanItem['severity'];
}
export interface SyncPullReport {
    ok: boolean;
    snapshotId: string;
    changes: PullChange[];
    /** 是否存在需要人工决策的项（Conflict / MissingSecret / MissingDependency / 路径问题）。
     * 插件 Install 不算 —— 插件安装随同步自动采用（product requirement）。 */
    needsReview: boolean;
    message?: string;
}
/** P0-②：push 前只读预览 ——「将推送什么」的单分区摘要（不写远端、不落盘）。 */
export interface SyncPushPreviewSection {
    /** 分区 id（将进入快照的 portable 分区） */
    section: SectionId;
    /** 分区内条目计数（adapter.export 的 counts 聚合；无计数时为 0） */
    count: number;
    /** 相对上次基线（sync-state）是否变化：true = 本次会更新该分区；false = 与基线一致 */
    changed: boolean;
}
/** P0-②：push 前预览结果（零写入）。 */
export interface SyncPushPreview {
    ok: boolean;
    /** 将推送的分区清单（含计数与变化标记） */
    sections: SyncPushPreviewSection[];
    /** 远端现有快照数（0 = 首次推送将创建首个基线） */
    remoteSnapshotCount: number;
    /** 加密快照：载荷将整体加密（分区计数与基线比较不可得） */
    encrypted: boolean;
    message?: string;
}
/** 一键 sync 预览结果（preview() 返回；临时 ZIP 由调用方持有并负责清理）。 */
export interface SyncPreviewResult {
    ok: boolean;
    /** 临时标准 ZIP 路径（apply-items 复用 executeImportPlan 需要；调用方清理） */
    zipPath: string;
    plan: ImportPlan | null;
    analysis: ImportAnalysis | null;
    snapshotId: string;
    message?: string;
}
/** 自动应用执行器（P2b）报告 */
export interface ApplyReport {
    ok: boolean;
    /** 实际写入本地的分区 id 列表 */
    applied: string[];
    /** 应用前快照 id（UI 可借此一键回滚）；失败时仍透传以便排查 */
    restoreId: string;
    /** 是否触发了整体回滚 */
    rolledBack: boolean;
    /** 失败时移到 review 队列的项（ReviewQueueItem 形态供 UI 直接渲染） */
    review: import('./review-queue.ts').ReviewQueueItem[];
    /** 来自 Importer.ImportResult 的 warnings；UI 可用于红条提示 */
    warnings: string[];
}
/** applyItems 报告（§3.4 ApplyItemsResponse 的服务端形态） */
export interface ApplyItemsReport {
    ok: boolean;
    /** 实际写入的分区 id 列表（去重） */
    applied: string[];
    /** 未采纳的 itemId 列表 */
    skipped?: string[];
    /** 应用前快照 id（UI 一键回滚用；失败时仍透传以便排查） */
    restoreId: string;
    /** 任一失败是否整体回滚 */
    rolledBack: boolean;
    warnings: string[];
    failed: {
        itemId: string;
        message?: string;
    }[];
    /** 透传 executeImportPlan 结果 */
    result: ImportResult | null;
    needsRestart?: boolean;
}
/**
 * 远端快照保留数量上限：每次 push 上传成功后对远端裁剪，
 * 保留最新 N 个（按 createdAt 升序的最末 N 个，含刚 push 的），更旧的逐个删除。
 * 只按数量裁剪，不按时间窗口。删除失败只告警（进 push 的 warnings），不上抛阻断主流程。
 */
export declare const MAX_REMOTE_SNAPSHOTS = 10;
export declare class SyncEngine {
    private readonly ctx;
    private readonly transport;
    private readonly stateDir;
    private readonly adapters;
    private readonly scanner;
    private readonly importer;
    private readonly now;
    private readonly snapshotIdFn;
    private readonly transportRef;
    private readonly localSnapshotsDir;
    private readonly rollbackSnapshotsDir;
    private readonly zipDir;
    private readonly exporterVersion;
    private readonly fsx;
    private readonly msg;
    private readonly sections;
    constructor(opts: SyncEngineOptions);
    /** 同步只做 portable 分区（deviceSpecific/platformSpecific 永不参与）。
     *  构造注入 sections（同步范围）时再按注入范围过滤 —— 自动同步等后台流程
     *  merge/apply/push 全链路复用用户选择；手动请求仍可用 push(opts.sections) 覆盖。 */
    private portableAdapters;
    /**
     * push 候选 adapter：
     * - sections 缺省/空 → 全部 portable（「默认/快速导出」模式）；
     * - sections 显式给出 → 只取 portable 且命中的（「高级/自定义导出」模式）；
     *   非 portable / 未知分区 → 警告跳过（安全约束 + 不静默，用户能看见自己勾了哪个无效项）。
     */
    private pushTargets;
    /** 结构性断言：凭据/秘密分区绝不进入同步载荷（双保险，portable 过滤之上） */
    private assertNoForbiddenSections;
    /**
     * 快照读取准备（download 后、使用前）：
     * - 加密快照（manifest.encrypted）→ 用 password 解密回明文 sections（原地替换）；
     *   无密码 → 明确报错（自动同步等无密码场景在调用方先行跳过）。
     * - 普通快照声明 containsSecrets=true → 拒绝（同步通道永不携带秘密，防御篡改/旧坏数据）。
     * 密码仅本次调用内存使用，绝不落盘/落日志。
     */
    private prepareSnapshot;
    /**
     * push：导出 portable 分区 → 组装快照 → 本地散文件副本 → transport.upload → 更新 sync-state。
     * 单项分区导出失败只告警跳过（§34.17），全部失败才整体失败。
     * opts.sections：指定仅同步这些分区（高级/自定义模式）；缺省 = 全部 portable 推荐分区。
     * opts.encrypt/password/includeSecrets：加密快照（含可选密钥导出）。
     * 安全不变量：includeSecrets ⇒ encrypt（密钥绝不明文进入同步通道）；密码仅内存。
     */
    push(opts?: SyncPushOptions): Promise<SyncPushReport>;
    /**
     * P0-②：push 前只读预览「将推送什么」—— 零写入、零远端变更：
     *  - 导出目标 portable 分区（与 push 同口径：sections 过滤 + secret 剥离）；
     *  - 逐分区相对上次基线（sync-state.sections hash）的 changed 标记；
     *  - 远端现有快照数（list 只读；首次推送 = 0）。
     * 加密快照（encrypt）时不再比较基线（密文不可比），sections 只带计数。
     * 任何失败都不写任何内容；预览只是 push 的「确认前说明书」。
     */
    previewPush(opts?: SyncPushOptions): Promise<SyncPushPreview>;
    /**
     * 裁剪远端快照：调用 transport.list() 获取全部快照（按 createdAt 升序），
     * 保留最新 MAX_REMOTE_SNAPSHOTS 个（含刚 push 的 pushedId），对更旧的逐个调用 transport.delete()。
     * 只按数量裁剪，不按时间窗口。
     *
     * 失败语义：list/delete 失败均只 push 进 warnings，不上抛 —— 裁剪是「尽力而为」的后台整理，
     * 绝不影响 push 主流程的成功与否（§34.17 分区级告警同款语义）。
     */
    private pruneRemoteSnapshots;
    /**
     * pull：拉取远端最新（或指定）快照 → 过滤 portable 分区 → 转临时标准 ZIP →
     * 复用 Importer 预览流程（analyzeImport/createImportPlan）产出差异报告。
     * 绝不直接写配置、绝不执行导入；执行由上层按用户确认后走 Importer.executeImportPlan。
     */
    pull(opts?: SyncPullOptions): Promise<SyncPullReport>;
    /** 列出远端已有快照（按 createdAt 升序）—— 供「选择历史快照」下拉。 */
    listSnapshots(): Promise<SyncSnapshotMeta[]>;
    /**
     * 远端是否出现比本地共同祖先（sync-state.lastSnapshotId）更新的快照（§3.2「检测到远端新快照」）。
     * - 远端为空 → false（无物可拉）；
     * - 本地从未同步（lastSnapshotId=''）且远端非空 → true（首次可拉）；
     * - 否则比较远端最新快照 id 与 lastSnapshotId。
     * 只读远端列表（transport.list），不做下载/合并。
     */
    hasNewRemoteSnapshot(): Promise<boolean>;
    /**
     * 本地 portable 配置当前内容与上次基线（sync-state.sections hash）相比是否有变化（§3.1 上传「看变化」）。
     * - 从未同步（sync-state.sections 为空）→ true；
     * - 任一 portable 分区当前导出 hash ≠ 基线 hash → true；
     * - 全部一致 → false（无本地改动，不上传）。
     * 只读本地导出 + sync-state，不写任何东西、不碰远端。
     */
    hasLocalChanges(): Promise<boolean>;
    /**
     * 一键同步预览：拉取远端（最新或指定历史快照）→ 转临时 ZIP → Importer 分析出计划。
     * 与 pull 的区别：临时 ZIP **不清理**（由调用方 / 会话持有，供 apply-items 复用），
     * 并返回完整 plan/analysis/snapshotId 供会话登记。
     * 调用方负责在会话消费或取消后清理 zipPath 所在目录。
     */
    preview(opts?: SyncPullOptions): Promise<SyncPreviewResult>;
    merge(opts?: {
        snapshotId?: string;
        password?: string;
    }): Promise<MergePlan>;
    /**
     * 记录祖先基线：写本地祖先副本 + 更新 sync-state（lastSnapshotId、每分区 hash/updatedAt、lastSyncAt、transport）+ 裁剪到 keep。
     * 通常由 push() 在上传成功后调用，也可被上层（合并 apply 完成后）显式调用以更新基线到合并后的快照。
     */
    recordBaseline(snapshotId: string, sections: SyncSnapshot['sections'], nowIso?: string, opts?: {
        writeAncestor?: boolean;
    }): Promise<void>;
    /**
     * 应用自动应用计划：写本地（走 Importer.executeImportPlan 标准路径；应用前调 backup.createSnapshot 兜底）；
     * 任一 auto 项失败 → 整体 rollback；成功后 recordBaseline 更新祖先基线。
     * 返回 ApplyReport；不抛错到调用方（失败返回 ok:false + rolledBack:true）。
     * 不再写 review-queue（§2.3/§7.4：待审语义改由同步历史 skipped 标记表达）。
     */
    applyMergePlan(apply: SyncApplyPlan): Promise<ApplyReport>;
    /**
     * applyItems：按用户对差异项的逐项决策执行导入（§3.4/§5.3）。
     *
     * 与 applyMergePlan 的区别：applyItems 接收「会话级临时 ZIP + 子计划」，
     * 直接执行（backup.createSnapshot 兜底 → importer.executeImportPlan →
     * 成功 recordBaseline / 失败 rollback），不构造中间 SyncApplyPlan。
     *
     * @param zipPath 会话级临时标准 ZIP（由 sync/sync 生成，包含采纳项的 merged payload）
     * @param subPlan 子计划（仅含采纳项的 ImportPlan；globalStrategy/pathMappings/needsRestart 沿用会话 plan）
     * @param opts 执行选项（onItem 进度回调）
     * @returns ApplyItemsReport（ok/applied/restoreId/rolledBack/warnings/result）
     */
    applyItems(zipPath: string, subPlan: ImportPlan, opts?: {
        onItem?: (info: PlanItemProgress) => void;
        /** Phase 4 生产 journal↔snapshot 绑定（deferred；透传给 Importer.executeImportPlan） */
        snapshotBinding?: TransactionSnapshotContext;
    }): Promise<ApplyItemsReport>;
    /** 散文件快照 → 标准导出 ZIP（临时目录，用完即删）：buildManifest + checksums + 平铺分区 */
    private snapshotToZip;
}
