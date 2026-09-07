import type { SectionId } from '../schema/types.ts';
import type { ConfigAdapter, HostContext, ImportPlan, Snapshot, SnapshotStatus, SnapshotStore } from './types.ts';
/** 解析文件类目标的绝对路径（引擎通用快照与回滚共用） */
export declare function resolveFileTarget(ctx: HostContext, adapter: SectionId, ref: string): string;
/**
 * 文件类目标的 home-relative 相对路径（P2-B，Phase 8）。
 * 供导入逐项指纹（analyzer 经 HostContext.fs.readFile(read rel) 读文件算 sha256）
 * 与 journal step.ref 的 posix 规范化。仅适用于 isFileSection adapter。
 */
export declare function resolveFileTargetRel(adapter: SectionId, ref: string): string;
export interface CreateSnapshotOptions {
    ctx: HostContext;
    plan: ImportPlan;
    sourceZip: string;
    store: SnapshotStore;
    adapters: ConfigAdapter[];
    /** Phase 4：operation-bound binding（journal.operationId / environmentFingerprint / ownerInstanceId / operationType） */
    operationId?: string;
    operationType?: string;
    environmentFingerprint?: string;
    ownerInstanceId?: string;
}
/**
 * 生成并落盘快照：只覆盖将被写入的目标。
 * 文件字节经 blobs Map 交给 store.save（SnapshotEntry 契约不含二进制）。
 */
export declare function createSnapshot(opts: CreateSnapshotOptions): Promise<Snapshot>;
/** 快照保留上限：save 落盘后超过该数量则删除最旧快照目录 */
export declare const SNAPSHOT_RETENTION_LIMIT = 10;
/** 纯函数：返回应清理的最旧快照 id（按 createdAt 升序取超限部分；恰好 limit 个 → 空数组）。
 * 参数用最小结构类型，避免引入 restore.ts 的 SnapshotMeta 造成循环 import。 */
export declare function selectPruneCandidates(metas: ReadonlyArray<{
    id: string;
    createdAt: string;
}>, limit?: number): string[];
export interface FileSnapshotStoreOptions {
    /** 快照根目录（宿主决定，如 ~/.dsh/dsh-config-manager/snapshots） */
    dir: string;
    /**
     * Phase 4 F3：可恢复 / 未收敛 journal 引用的 snapshotId 集合提供者。
     * prune 必须豁免这些 snapshot（绝不可删被 recovery 引用的回滚点）。
     * 缺省 = 空集合（不豁免）。宿主注入 JournalStore.listReferencedSnapshotIds。
     */
    referencedSnapshotIds?: () => Promise<Set<string>>;
    /**
     * Phase 6：自动保留清理的迁移历史回调（best-effort）。
     * prune 删除后回调被清 snapshotId 列表；宿主据其写统一审计史（snapshot-prune kind）。
     * 缺省 = 不记录（不改变 prune 行为、不污染核心引擎）。
     */
    onPrune?: (removedIds: string[]) => void;
}
/** 文件快照存储：<dir>/<id>/snapshot.json + <dir>/<id>/blobs/* */
export declare class FileSnapshotStore implements SnapshotStore {
    private readonly options;
    constructor(options: FileSnapshotStoreOptions);
    private snapshotDir;
    save(snapshot: Snapshot, blobs?: Map<string, Uint8Array>): Promise<string>;
    /** 保留清理：扫描快照根目录，超限时删除最旧快照目录（损坏/非快照目录跳过；目录缺失容错）。
   *  P1-⑧：置顶（pinned=true）的快照豁免自动清理——用户显式保留的导入前回滚点不得被
   *  自动淘汰，只能手动删除（deleteSnapshot）。
   *  Phase 4 F3：被 active/quarantine 未收敛 journal 引用的 snapshot（recovery 回滚点）
   *  必须豁免——引用提供者（referencedSnapshotIds）返回的 id 绝不自动清理。 */
    private prune;
    load(id: string): Promise<Snapshot>;
    readBlob(id: string, blobPath: string): Promise<Uint8Array>;
    /** 标记快照生命周期状态：重写 <dir>/<id>/snapshot.json（保留其余字段）。 */
    updateStatus(id: string, status: SnapshotStatus): Promise<void>;
}
/**
 * 破坏性内容 hash（稳定，不含 readiness/status）：entries + hostFileBackups + beforePlugins。
 * READY 发布与 status 更新不改变此 hash（B-P1-1 修复）。
 */
export declare function computeMetadataHash(snapshot: Snapshot): string;
export interface SnapshotVerifyResult {
    ok: boolean;
    reason?: string;
}
/**
 * 从磁盘重读并验证快照（F1）：id 合法 + snapshot.json 存在 + manifest 存在 + blob hashes 匹配 +
 * metadataHash 匹配 + 必要 blobs 存在 + 路径安全。不信任内存对象。
 */
export declare function verifySnapshot(snapshotsDir: string, id: string): Promise<SnapshotVerifyResult>;
