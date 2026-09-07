/** 会话文件目录键提取：把会话相对路径归一为会话目录键 <projectKey>/<sessionId>。
 * 分隔符统一为 '/'（兼容 Windows '\'）；不足两段（无法归一会话目录）返回 null。 */
export function sessionKeyOf(relPath) {
    if (typeof relPath !== 'string' || relPath === '')
        return null;
    const norm = relPath.replace(/\\/g, '/').replace(/\/{2,}/g, '/').replace(/^\/+|\/+$/g, '');
    if (norm === '')
        return null;
    const segments = norm.split('/');
    if (segments.length < 2)
        return null;
    return `${segments[0]}/${segments[1]}`;
}
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
export function sweepGhostSessions(sessionIds, diskEntries) {
    const disk = new Set();
    for (const d of diskEntries) {
        const key = sessionKeyOf(d);
        if (key !== null)
            disk.add(key);
    }
    const ghosts = [];
    const seen = new Set();
    for (const id of sessionIds) {
        const key = sessionKeyOf(id);
        if (key === null)
            continue; // 无法归一会话目录的条目不参与判定
        if (!disk.has(key) && !seen.has(key)) {
            seen.add(key);
            ghosts.push(key);
        }
    }
    return ghosts;
}
/** 从快照条目中提取「恢复后应存在于磁盘」的会话文件相对路径（sessions 分区、existed=true）。
 * 仅参与过导入且快照时存在的会话文件才算期望项；existed=false（导入新增、恢复时删除）不算。 */
export function expectedSessionRefs(entries) {
    return entries
        .filter((e) => e.kind === 'file' && e.adapter === 'sessions' && e.existed === true)
        .map((e) => e.ref);
}
//# sourceMappingURL=ghost-sweep.js.map