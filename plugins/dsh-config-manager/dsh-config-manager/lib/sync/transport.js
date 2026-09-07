import { hashSection } from "./sync-state.js";
/** 由快照计算元信息：sections hash 记录 + manifest 摘要透传。
 *  加密快照（sections 为密文载荷）→ sections hash 记录为空（密文无法与本地明文比较）。 */
export function computeSnapshotMeta(snapshot) {
    const sections = {};
    if (!isEncryptedSections(snapshot.sections)) {
        for (const [id, data] of Object.entries(snapshot.sections)) {
            sections[id] = hashSection(data);
        }
    }
    return { id: snapshot.id, createdAt: snapshot.createdAt, sections, manifest: snapshot.manifest };
}
/** 判定远端索引条目与本地快照「内容相同」（快照级跳过判定，供 webdav 通道增量上传用）：
 *  仅比较各分区内容 hash（sections 全等），不比较 createdAt / manifest 摘要
 *  （同 id 重复上传但内容未变 → 视为幂等覆盖，无需重新 PUT 载荷）。
 *  - 本地 sections 为空对象（加密快照：密文无法与远端明文 hash 比较）→ 返回 false，
 *    「无法比较」必须照常上传，绝不跳过；
 *  - 键集合与每个键的 hash 值全部相等 → true；否则 false。
 */
export function sectionsEqual(remote, local) {
    const r = remote.sections;
    const l = local.sections;
    if (Object.keys(l).length === 0)
        return false; // 本地为空（加密快照）→ 无法比较
    if (Object.keys(r).length !== Object.keys(l).length)
        return false;
    for (const key of Object.keys(r)) {
        if (r[key] !== l[key])
            return false;
    }
    return true;
}
/** 判定 sections 是否为加密密文载荷（duck-typing：含 encrypted.info + encrypted.data 字符串）。 */
export function isEncryptedSections(sections) {
    if (sections === null || typeof sections !== 'object')
        return false;
    const enc = sections.encrypted;
    if (enc === null || typeof enc !== 'object')
        return false;
    const e = enc;
    return typeof e.data === 'string' && e.data !== '' && e.info !== null && typeof e.info === 'object';
}
/** 从导出 Manifest 提取摘要 */
export function manifestSummaryFrom(manifest) {
    return {
        schemaVersion: manifest.schemaVersion,
        dshVersion: manifest.source.dshVersion,
        platform: manifest.source.platform,
        sectionIds: Object.entries(manifest.sections)
            .filter(([, included]) => included)
            .map(([id]) => id),
        containsSecrets: manifest.security.containsSecrets,
    };
}
//# sourceMappingURL=transport.js.map