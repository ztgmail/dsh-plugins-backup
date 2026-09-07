/**
 * m-autosync：自动同步配置持久化（sync-autosync.json）。
 *
 * 与 sync-config.json 并列独立文件：语义清楚、schema 演进独立。
 * schemaVersion:2 —— 按同步通道拆分（git / webdav 各自独立的自动同步配置与运行状态）：
 * ```
 * { "schemaVersion": 2,
 *   "channels": {
 *     "git":    { enabled, interval, startupMinIntervalMs, consecutiveFailures, lastRunAt, ... },
 *     "webdav": { ... } } }
 * ```
 * v1（顶层单通道）→ 读取时归一为 v2 的 git 通道（webdav 回退缺省）。
 *
 * 原子写（临时文件 + rename），损坏/不支持 schema 回退缺省（enabled=false,
 * interval='30m', startupMinIntervalMs=5*60*1000）。
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseJsonSafe, stringifyJsonSafe } from "../utils/json.js";
import { atomicWriteFile } from "../utils/atomic-write.js";
export const AUTOSYNC_CONFIG_FILE = 'sync-autosync.json';
export const AUTOSYNC_CONFIG_SCHEMA_VERSION = 2;
/** 缺省间隔 */
export const DEFAULT_AUTOSYNC_INTERVAL = '30m';
/** 缺省启动触发最小间隔阈值（5 分钟，防频繁重启反复同步） */
export const DEFAULT_STARTUP_MIN_INTERVAL_MS = 5 * 60 * 1000;
/** 缺省配置（首次无文件 / 损坏 / 不支持 schema 时回退） */
export function defaultAutosyncConfig() {
    return {
        enabled: false,
        interval: DEFAULT_AUTOSYNC_INTERVAL,
        startupMinIntervalMs: DEFAULT_STARTUP_MIN_INTERVAL_MS,
        consecutiveFailures: 0,
    };
}
/** 从 v1 顶层字段（缺 schemaVersion 或 schemaVersion=1）解析单通道配置；非法字段回退缺省。 */
function parseV1Channel(obj) {
    const cfg = defaultAutosyncConfig();
    if (typeof obj['enabled'] === 'boolean')
        cfg.enabled = obj['enabled'];
    if (isAutosyncInterval(obj['interval']))
        cfg.interval = obj['interval'];
    if (typeof obj['startupMinIntervalMs'] === 'number' && Number.isFinite(obj['startupMinIntervalMs']) && obj['startupMinIntervalMs'] > 0) {
        cfg.startupMinIntervalMs = obj['startupMinIntervalMs'];
    }
    if (typeof obj['consecutiveFailures'] === 'number' && Number.isFinite(obj['consecutiveFailures']) && obj['consecutiveFailures'] >= 0) {
        cfg.consecutiveFailures = obj['consecutiveFailures'];
    }
    if (typeof obj['lastRunAt'] === 'string' && obj['lastRunAt'] !== '')
        cfg.lastRunAt = obj['lastRunAt'];
    if (typeof obj['lastRunStatus'] === 'string' && (obj['lastRunStatus'] === 'success' || obj['lastRunStatus'] === 'skipped' || obj['lastRunStatus'] === 'failed' || obj['lastRunStatus'] === 'partial')) {
        cfg.lastRunStatus = obj['lastRunStatus'];
    }
    if (typeof obj['lastRunMessage'] === 'string')
        cfg.lastRunMessage = obj['lastRunMessage'];
    if (typeof obj['lastRunHistoryId'] === 'string')
        cfg.lastRunHistoryId = obj['lastRunHistoryId'];
    return cfg;
}
/** 从 v2 channels 命名空间解析单通道配置；缺失/非法 → 缺省。 */
function parseV2Channel(ns) {
    if (ns === null || typeof ns !== 'object' || Array.isArray(ns))
        return defaultAutosyncConfig();
    return parseV1Channel(ns);
}
/** 读取全部通道的自动同步配置（v2 文件；v1 迁移为 git；webdav 缺省）。 */
export async function readAllAutosyncConfigs(dir) {
    const file = path.join(dir, AUTOSYNC_CONFIG_FILE);
    let raw;
    try {
        raw = await fs.readFile(file, 'utf8');
    }
    catch {
        return { git: defaultAutosyncConfig(), webdav: defaultAutosyncConfig() };
    }
    let parsed;
    try {
        parsed = parseJsonSafe(raw);
    }
    catch {
        return { git: defaultAutosyncConfig(), webdav: defaultAutosyncConfig() };
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return { git: defaultAutosyncConfig(), webdav: defaultAutosyncConfig() };
    }
    const obj = parsed;
    // schemaVersion：缺省视为 v1；非缺省但 != 2 → 回退缺省
    const ver = typeof obj['schemaVersion'] === 'number' ? obj['schemaVersion'] : 1;
    if (ver !== 1 && ver !== AUTOSYNC_CONFIG_SCHEMA_VERSION) {
        return { git: defaultAutosyncConfig(), webdav: defaultAutosyncConfig() };
    }
    if (ver === 1) {
        // v1 迁移：顶层字段 → git 通道（webdav 缺省；首次按 v2 写回时持久化）
        return { git: parseV1Channel(obj), webdav: defaultAutosyncConfig() };
    }
    const channels = obj['channels'];
    const ch = channels !== null && typeof channels === 'object' && !Array.isArray(channels)
        ? channels
        : {};
    return {
        git: parseV2Channel(ch['git']),
        webdav: parseV2Channel(ch['webdav']),
    };
}
/** 读取指定通道的自动同步配置；文件不存在 / 损坏 / 不支持 schema → 缺省值（不抛错）。 */
export async function readAutosyncConfig(dir, channel) {
    const all = await readAllAutosyncConfigs(dir);
    return all[channel];
}
/** 写入指定通道的自动同步配置（原子写：临时文件 + rename；保留另一通道；自动创建目录）。 */
export async function writeAutosyncConfig(dir, channel, cfg) {
    await fs.mkdir(dir, { recursive: true });
    const existing = await readAllAutosyncConfigs(dir);
    const channels = {
        git: channel === 'git' ? cfg : existing.git,
        webdav: channel === 'webdav' ? cfg : existing.webdav,
    };
    const payload = {
        schemaVersion: AUTOSYNC_CONFIG_SCHEMA_VERSION,
        channels: {
            git: toChannelPayload(channels.git),
            webdav: toChannelPayload(channels.webdav),
        },
    };
    const target = path.join(dir, AUTOSYNC_CONFIG_FILE);
    const data = stringifyJsonSafe(payload, { space: 2 });
    await atomicWriteFile(target, data, { mode: 0o600 });
}
/** AutosyncConfig → 文件载荷（可选运行字段仅在非空时写入，保持文件干净）。 */
function toChannelPayload(cfg) {
    const payload = {
        enabled: cfg.enabled,
        interval: cfg.interval,
        startupMinIntervalMs: cfg.startupMinIntervalMs,
        consecutiveFailures: cfg.consecutiveFailures,
    };
    if (cfg.lastRunAt !== undefined && cfg.lastRunAt !== '')
        payload['lastRunAt'] = cfg.lastRunAt;
    if (cfg.lastRunStatus !== undefined)
        payload['lastRunStatus'] = cfg.lastRunStatus;
    if (cfg.lastRunMessage !== undefined && cfg.lastRunMessage !== '')
        payload['lastRunMessage'] = cfg.lastRunMessage;
    if (cfg.lastRunHistoryId !== undefined && cfg.lastRunHistoryId !== '')
        payload['lastRunHistoryId'] = cfg.lastRunHistoryId;
    return payload;
}
function isAutosyncInterval(v) {
    return v === '5m' || v === '15m' || v === '30m' || v === '60m' || v === '6h' || v === '12h' || v === '24h';
}
//# sourceMappingURL=autosync-config.js.map