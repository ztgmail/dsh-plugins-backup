/**
 * m-sync-selection：远程同步分区选择持久化（sync-selection.json）。
 *
 * 与 sync-config.json / sync-autosync.json 并列独立文件：语义清楚、schema 演进独立。
 * schemaVersion:2 —— 按同步通道拆分（git / webdav 各自独立的模式与分区勾选）：
 * ```
 * { "schemaVersion": 2,
 *   "channels": {
 *     "git":    { mode: 'default'|'advanced', sections: SectionId[], encrypt, includeSecrets },
 *     "webdav": { ... } } }
 * ```
 * - mode='default'（快速导出）：推送/自动同步使用全部 portable 推荐分区（sections 可空）；
 * - mode='advanced'（自定义导出）：推送/自动同步只处理勾选的 sections（非 portable 由
 *   SyncEngine portableAdapters 过滤兜底；空 sections 回退全量，避免自动同步卡死）。
 * v1（顶层单通道）→ 读取时归一为 v2 的 git 通道（webdav 回退缺省）。
 *
 * 原子写（临时文件 + rename），损坏/不支持 schema 回退缺省（mode='default', sections=[]）。
 * 持久化原因：自动同步调度器运行于 Host 进程（浏览器关闭也在跑），必须从磁盘读
 * 用户选择，而不是依赖浏览器 localStorage。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseJsonSafe, stringifyJsonSafe } from "../utils/json.js";
import { atomicWriteFile } from "../utils/atomic-write.js";
export const SYNC_SELECTION_FILE = 'sync-selection.json';
export const SYNC_SELECTION_SCHEMA_VERSION = 2;
/** 缺省配置（首次无文件 / 损坏 / 不支持 schema 时回退） */
export function defaultSyncSelection() {
    return { schemaVersion: SYNC_SELECTION_SCHEMA_VERSION, mode: 'default', sections: [], encrypt: false, includeSecrets: false };
}
/**
 * 生效的同步分区范围：
 * - mode='advanced' 且 sections 非空 → sections（自定义导出）；
 * - 其余（default / advanced 但未勾选）→ undefined（= 全部 portable 推荐分区）。
 */
export function effectiveSections(sel) {
    if (sel.mode === 'advanced' && sel.sections.length > 0)
        return [...sel.sections];
    return undefined;
}
/** 从单通道对象解析（v1 顶层或 v2 channels 命名空间共用；非法字段回退缺省）。 */
function parseChannelSelection(obj) {
    const sel = defaultSyncSelection();
    if (obj['mode'] === 'advanced' || obj['mode'] === 'default')
        sel.mode = obj['mode'];
    if (Array.isArray(obj['sections'])) {
        sel.sections = obj['sections'].filter((s) => typeof s === 'string' && s !== '');
    }
    if (typeof obj['encrypt'] === 'boolean')
        sel.encrypt = obj['encrypt'];
    if (typeof obj['includeSecrets'] === 'boolean')
        sel.includeSecrets = obj['includeSecrets'];
    // 安全兜底：持久化数据被篡改导致 includeSecrets 但未 encrypt → 强制关掉导出密钥
    if (sel.includeSecrets && !sel.encrypt)
        sel.includeSecrets = false;
    return sel;
}
/** 读取全部通道的分区选择配置；文件不存在 / 损坏 / 不支持 schema → 缺省值（不抛错）。 */
export async function readAllSyncSelections(dir) {
    const file = path.join(dir, SYNC_SELECTION_FILE);
    let raw;
    try {
        raw = await fs.readFile(file, 'utf8');
    }
    catch {
        return { git: defaultSyncSelection(), webdav: defaultSyncSelection() };
    }
    let parsed;
    try {
        parsed = parseJsonSafe(raw);
    }
    catch {
        return { git: defaultSyncSelection(), webdav: defaultSyncSelection() };
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { git: defaultSyncSelection(), webdav: defaultSyncSelection() };
    }
    const obj = parsed;
    // schemaVersion：缺省视为 v1；非缺省但 != 2 → 回退缺省
    const ver = typeof obj['schemaVersion'] === 'number' ? obj['schemaVersion'] : 1;
    if (ver !== 1 && ver !== SYNC_SELECTION_SCHEMA_VERSION) {
        return { git: defaultSyncSelection(), webdav: defaultSyncSelection() };
    }
    if (ver === 1) {
        // v1 迁移：顶层字段 → git 通道（webdav 缺省；首次按 v2 写回时持久化）
        return { git: parseChannelSelection(obj), webdav: defaultSyncSelection() };
    }
    const channels = obj['channels'];
    const ch = channels !== null && typeof channels === 'object' && !Array.isArray(channels)
        ? channels
        : {};
    const gitNs = ch['git'];
    const webdavNs = ch['webdav'];
    return {
        git: gitNs !== null && typeof gitNs === 'object' && !Array.isArray(gitNs)
            ? parseChannelSelection(gitNs)
            : defaultSyncSelection(),
        webdav: webdavNs !== null && typeof webdavNs === 'object' && !Array.isArray(webdavNs)
            ? parseChannelSelection(webdavNs)
            : defaultSyncSelection(),
    };
}
/** 读取指定通道的分区选择配置；文件不存在 / 损坏 / 不支持 schema → 缺省值（不抛错）。 */
export async function readSyncSelection(dir, channel) {
    const all = await readAllSyncSelections(dir);
    return all[channel];
}
/** 写入指定通道的分区选择配置（原子写：临时文件 + rename；保留另一通道；自动创建目录）。 */
export async function writeSyncSelection(dir, channel, sel) {
    await fs.mkdir(dir, { recursive: true });
    const existing = await readAllSyncSelections(dir);
    const channels = {
        git: channel === 'git' ? sel : existing.git,
        webdav: channel === 'webdav' ? sel : existing.webdav,
    };
    const payload = {
        schemaVersion: SYNC_SELECTION_SCHEMA_VERSION,
        channels: {
            git: { mode: channels.git.mode, sections: channels.git.sections, encrypt: channels.git.encrypt, includeSecrets: channels.git.includeSecrets },
            webdav: { mode: channels.webdav.mode, sections: channels.webdav.sections, encrypt: channels.webdav.encrypt, includeSecrets: channels.webdav.includeSecrets },
        },
    };
    const target = path.join(dir, SYNC_SELECTION_FILE);
    const data = stringifyJsonSafe(payload, { space: 2 });
    await atomicWriteFile(target, data, { mode: 0o600 });
}
//# sourceMappingURL=sync-selection.js.map