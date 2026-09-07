import type { SnapshotFs } from './fs.ts';
import type { SyncSnapshot } from './transport.ts';
/** 默认保留的祖先快照数量（最旧超出则被裁剪）。 */
export declare const DEFAULT_ANCESTOR_KEEP = 10;
/** 按 snapshotId 读取祖先快照目录；不存在抛错，不静默降级。 */
export declare function loadAncestor(localSnapshotsDir: string, snapshotId: string, fsx?: SnapshotFs): Promise<SyncSnapshot>;
/** 把合并后的快照写入本地祖先副本目录（覆盖同名 id）。 */
export declare function writeAncestor(localSnapshotsDir: string, snapshot: SyncSnapshot, fsx?: SnapshotFs): Promise<void>;
/** 列出 localSnapshotsDir 下全部祖先快照目录的 (id, createdAt) 对，按 createdAt 升序。 */
export declare function listAncestors(localSnapshotsDir: string, fsx?: SnapshotFs): Promise<Array<{
    id: string;
    createdAt: string;
}>>;
/** 保留最近 keep 个祖先（按 createdAt 升序的最末 keep 个）；其余删除。
 * keep <= 0 视为保留全部（不做任何删除）。
 * 返回被删除的祖先 id 列表（按 createdAt 升序，即先删最旧）。 */
export declare function pruneAncestors(localSnapshotsDir: string, keep?: number, fsx?: SnapshotFs): Promise<string[]>;
