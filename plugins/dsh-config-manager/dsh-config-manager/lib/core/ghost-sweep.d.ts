import type { SnapshotEntry } from './types.ts';
/** 会话文件目录键提取：把会话相对路径归一为会话目录键 <projectKey>/<sessionId>。
 * 分隔符统一为 '/'（兼容 Windows '\'）；不足两段（无法归一会话目录）返回 null。 */
export declare function sessionKeyOf(relPath: string): string | null;
/**
 * 幽灵会话检测（纯函数）：
 * 期望存在的会话（快照/备份记录的会话条目）在磁盘 sessions 目录已无任何对应文件 → 幽灵。
 *
 * @param sessionIds 快照/备份记录的会话条目（相对 sessions 基准目录的路径，如
 *   'proj-a/s1/session.jsonl.zstd' 或目录键 'proj-a/s1'）
 * @param diskEntries 磁盘 sessions 目录扫描出的实际相对路径（同样相对 sessions 基准目录，
 *   分隔符不限 Windows/Unix）
 * @returns 失效（幽灵）会话键清单（<projectKey>/<sessionId>，去重保序）；
 *   仅磁盘有、备份没有的会话不是幽灵（属备份后新建），不返回。
 */
export declare function sweepGhostSessions(sessionIds: string[], diskEntries: string[]): string[];
/** 从快照条目中提取「恢复后应存在于磁盘」的会话文件相对路径（sessions 分区、existed=true）。
 * 仅参与过导入且快照时存在的会话文件才算期望项；existed=false（导入新增、恢复时删除）不算。 */
export declare function expectedSessionRefs(entries: SnapshotEntry[]): string[];
