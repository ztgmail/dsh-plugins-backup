/**
 * SHA-256 完整性工具（integrity/checksums.json 的生成与校验）。
 * m4 的 security/integrity.ts 可在此之上强化（本模块已实现规范 §18 全部语义）。
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
export function sha256Hex(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}
export async function hashFile(filePath) {
    const data = await fs.readFile(filePath);
    return sha256Hex(data);
}
/** 生成一组 ZIP 相对路径 → SHA-256 的校验表（路径必须为 ZIP 内正斜杠相对路径） */
export function buildChecksums(entries) {
    const checksums = {};
    for (const e of entries) {
        checksums[e.name] = sha256Hex(e.data);
    }
    return checksums;
}
/**
 * 校验：checksums 表内每个相对路径必须在 entries 中存在且 SHA-256 一致。
 * entries 中多余的文件（如 manifest.json / checksums.json 自身）不参与校验。
 */
export function verifyChecksums(entries, checksums) {
    const mismatches = [];
    const missing = [];
    for (const [relPath, expected] of Object.entries(checksums)) {
        const data = entries.get(relPath);
        if (data === undefined) {
            missing.push(relPath);
            continue;
        }
        if (sha256Hex(data) !== expected) {
            mismatches.push(relPath);
        }
    }
    return { ok: mismatches.length === 0 && missing.length === 0, mismatches, missing };
}
//# sourceMappingURL=hashing.js.map