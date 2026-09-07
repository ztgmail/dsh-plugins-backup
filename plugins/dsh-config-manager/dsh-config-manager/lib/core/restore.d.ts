import type { MsgFunc } from './messages.ts';
import type { SnapshotStatus } from './types.ts';
export type RestoreActionKind = 'hostFileRestore' | 'hostFileRemove' | 'pluginRemove' | 'fileRestore' | 'fileRemove' | 'credentialHint' | 'skip';
export interface RestoreAction {
    kind: RestoreActionKind;
    /** 人类可读描述 */
    description: string;
    /** 目标：相对 $DSH_HOME 的 relPath（hostFile/file 类）或插件名（pluginRemove） */
    target?: string;
    /** hostFileRestore/fileRestore：快照内 blob 相对路径（相对 snapshotDir） */
    blobPath?: string;
    /** pluginRemove：插件包名 */
    pluginName?: string;
    /** credentialHint：人工提示文本 */
    manualHint?: string;
    /** 附加说明（旧快照缺基线 / 离线无法恢复等） */
    detail?: string;
    /** 该动作是否对应 settings 主文件（settingsPath 解析出的文件） */
    isSettings?: boolean;
}
export interface RestorePlan {
    snapshotId: string;
    createdAt: string;
    sourceZip: string;
    actions: RestoreAction[];
    summary: {
        hostFileRestores: number;
        hostFileRemoves: number;
        pluginRemoves: number;
        fileRestores: number;
        fileRemoves: number;
        credentialHints: number;
        skips: number;
    };
    /** beforePlugins 基线是否可用（undefined=旧快照无基线 → 不计划任何插件卸载） */
    pluginBaselineConfirmed: boolean;
}
export interface RestoreOptions {
    /** 快照目录 <snapshotsDir>/<id>/（含 snapshot.json 与 blobs/） */
    snapshotDir: string;
    /** $DSH_HOME（默认 ~/.dsh） */
    homeDir: string;
    /** 管理的 DSH profile 名（插件卸载走 profiles/<profile>） */
    profile: string;
    /** 覆盖 settings 文件路径（默认探测 $DSH_HOME/settings.yaml → settings.json） */
    settingsPath?: string;
    /** 注入式插件卸载器（测试用；缺省走 runDshPlugin 官方通道） */
    pluginUninstaller?: (name: string, profileDir: string, profile: string) => Promise<{
        ok: boolean;
        message?: string;
    }>;
    /** 每项动作执行回调（宿主路由埋点：更新 RunRegistry 进度；index/1-based、total=计划动作数、
     * detail=动作描述。dry-run/planRestore 不触发） */
    onAction?: (info: {
        index: number;
        total: number;
        detail: string;
    }) => void;
    /** 消息翻译器（缺省 zh；宿主按 DSH 应用语言注入） */
    msg?: MsgFunc;
    /**
     * Phase 4 统一恢复校验：快照根目录（<snapshotsDir>，<snapshotDir> 的直接父级）。
     * 提供时，planRestore 顶端强制调用 validateSnapshotForRestore；CORRUPT/INVALID/UNSAFE_PATH/
     * WRONG_ENVIRONMENT 拒绝计划。缺省 = 不强制（兼容旧调用；新入口都应传）。
     */
    snapshotsRoot?: string;
    /** Phase 4 恢复校验时校验环境指纹（不匹配 → WRONG_ENVIRONMENT；缺省不校验）。 */
    environmentFingerprint?: string;
    /**
     * Phase 4 恢复确认策略：缺省允许 LEGACY 显式恢复。若调用方要求「非 operation-bound 一律拒绝」，
     * 可传 'requireOperationBound'。
     */
    requireOperationBound?: boolean;
}
export interface RestoreReport {
    snapshotId: string;
    /** 已还原/已删除的目标（相对 $DSH_HOME） */
    restored: string[];
    /** 已卸载的插件名 */
    removedPlugins: string[];
    /** 需人工处理的提示（凭据补录等） */
    manualHints: string[];
    /** 失败清单 */
    failed: {
        item: string;
        reason: string;
    }[];
    /** 跳过项（无动作 / 离线无法处理） */
    skipped: string[];
    /**
     * 幽灵会话（F5 失效归档清理）：快照记录的 sessions 分区会话在磁盘 sessions 目录
     * 已无任何文件（备份有记录、磁盘无文件）。DSH 官方无归档会话 API，降级本地校验，
     * 仅供报告、需人工在 DSH 确认清理；无会话分区/无幽灵时为缺省或空数组。
     */
    ghostSessions?: string[];
}
export interface SnapshotMeta {
    id: string;
    createdAt: string;
    sourceZip: string;
    status?: SnapshotStatus;
    entryCount: number;
    hostFileBackupCount: number;
    beforePluginCount: number;
    /** 置顶标记（P1-⑧）：置顶快照不参与自动保留清理（最多保留 N 个时的淘汰豁免） */
    pinned?: boolean;
}
/**
 * 快照恢复前可信校验的 verdict（统一供 Host API / ModelTools / CLI / sync rollback 消费）。
 *
 * - TRUSTED_OPERATION_SNAPSHOT：READY + manifest 完整 + blob hash 匹配 + 有 op/env/owner binding。
 *   可授权自动/推荐回滚。
 * - TRUSTED_MANUAL_LOCAL：READY + 完整校验通过，但无 Phase4 binding（如用户手动/pinned 快照）。
 *   可显式手动恢复，不可作 Phase3 自动 recovery 证据。
 * - LEGACY_REQUIRES_CONFIRMATION：旧快照（无 manifest / 无 readiness）。结构/路径校验通过即可显式确认恢复，
 *   绝不可自动恢复。
 * - INVALID / CORRUPT / UNSAFE_PATH / WRONG_ENVIRONMENT：拒绝。
 */
export type RestoreSnapshotVerdict = 'TRUSTED_OPERATION_SNAPSHOT' | 'TRUSTED_MANUAL_LOCAL' | 'LEGACY_REQUIRES_CONFIRMATION' | 'WRONG_ENVIRONMENT' | 'CORRUPT' | 'INVALID' | 'UNSAFE_PATH';
export interface RestoreSnapshotValidation {
    verdict: RestoreSnapshotVerdict;
    reason?: string;
}
/**
 * 统一恢复前校验（供 planRestore 顶端对所有 restore 类型强制调用）：
 * 1. isValidSnapshotId（语法）
 * 2. snapshot.json + manifest 存在、id 匹配（结构）
 * 3. verifySnapshot（磁盘重读：metadataHash + blob hashes + 路径安全）→ CORRUPT
 * 4. symlink 检查（snapshot.json / manifest / blobs）→ UNSAFE_PATH
 * 5. readiness + provenance：
 *    - 无 binding 字段（旧快照）→ LEGACY_REQUIRES_CONFIRMATION
 *    - 有 manifest/READY 但无 op binding → TRUSTED_MANUAL_LOCAL
 *    - 有 READY + manifest + op/env/owner binding → TRUSTED_OPERATION_SNAPSHOT
 * 绝不把「不可证明」当成 trusted。
 */
export declare function validateSnapshotForRestore(snapshotDir: string, snapshotsRoot: string, env?: {
    environmentFingerprint?: string;
}): Promise<RestoreSnapshotValidation>;
/**
 * 生成恢复动作计划（dry-run 预览的唯一入口；零写入）：
 * 读快照 + 探测当前文件/已装插件状态，输出按执行顺序排列的动作清单。
 */
export declare function planRestore(opts: RestoreOptions): Promise<RestorePlan>;
/**
 * 执行恢复：按计划顺序 整文件还原 → 插件卸载 → file 补偿，
 * 覆盖/删除前全部先复制到 <snapshotDir>/pre-restore/（双保险），
 * 逐项 try/catch（单项失败不拖垮其余），输出诚实报告。
 */
export declare function restore(opts: RestoreOptions): Promise<RestoreReport>;
/**
 * 扫描快照根目录下每个子目录的 snapshot.json，返回按 createdAt 倒序的元信息。
 * 目录缺失/条目损坏自动跳过（不阻断其他快照）。
 */
export declare function listSnapshots(dir: string): Promise<SnapshotMeta[]>;
/** 快照 id 安全校验（防路径穿越）：字母数字 + - _ .，长度 1-80。 */
export declare function isValidSnapshotId(id: unknown): id is string;
/** 删除单个快照（手动删除；P1-⑧）。只接受合法 id（防穿越），目标是快照根下的 <id>/ 目录。
 *  不存在视为成功（幂等）。返回是否实际删除。 */
export declare function deleteSnapshot(snapshotsDir: string, id: string): Promise<boolean>;
/** 切换置顶状态（P1-⑧）：置顶快照豁免自动保留清理。重写 <dir>/<id>/snapshot.json 的 pinned 字段。
 *  只接受合法 id；快照不存在抛错。 */
export declare function setSnapshotPinned(snapshotsDir: string, id: string, pinned: boolean): Promise<boolean>;
