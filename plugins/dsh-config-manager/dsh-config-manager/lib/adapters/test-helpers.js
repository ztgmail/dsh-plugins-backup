/**
 * 适配器测试基础设施（仿 src/core/smoke.test.ts 的内存 mock 门面）。
 * 仅供 src/adapters/*.test.ts 使用，不参与生产构建语义。
 */
import { normalizePath } from "../utils/paths.js";
import { createLogger } from "../utils/logger.js";
import { sha256Hex } from "../utils/hashing.js";
import { zhMsg } from "../core/messages.js";
export class MemFs {
    files = new Map();
    homeDir;
    constructor(homeDir) {
        this.homeDir = homeDir;
    }
    key(p) {
        return normalizePath(p.startsWith(this.homeDir) ? p : `${this.homeDir}/${p}`);
    }
    async readFile(relPath) {
        const v = this.files.get(this.key(relPath));
        if (v === undefined)
            throw new Error(`ENOENT: ${relPath}`);
        return v;
    }
    async writeFile(relPath, data) {
        this.files.set(this.key(relPath), data);
    }
    async exists(relPath) {
        return this.files.has(this.key(relPath));
    }
    async copy(from, to) {
        const v = this.files.get(this.key(from));
        if (v === undefined)
            throw new Error(`ENOENT: ${from}`);
        this.files.set(this.key(to), v);
    }
    async remove(relPath) {
        this.files.delete(this.key(relPath));
    }
    async listRecursive(dir) {
        const base = normalizePath(this.homeDir);
        const prefix = normalizePath(dir) === '' ? base : `${base}/${normalizePath(dir)}`;
        const out = [];
        for (const k of this.files.keys()) {
            if (k === prefix || k.startsWith(prefix + '/')) {
                out.push(k.slice(base.length).replace(/^[\\/]+/, ''));
            }
        }
        return out.sort();
    }
    async mkdir() { }
}
/** ns.set 时自动注册（有值即视为对应插件已激活；对齐真实 dsh-settings 的注册语义） */
class AutoRegisterMap extends Map {
    registered;
    constructor(registered) {
        super();
        this.registered = registered;
    }
    set(key, value) {
        this.registered.add(key);
        return super.set(key, value);
    }
}
export class MemSettings {
    /** 已注册命名空间（对齐真实 dsh-settings：插件激活时注册；未注册的 describe/replace 抛错） */
    registered = new Set();
    /** 有值的命名空间自动视为已注册 */
    ns = new AutoRegisterMap(this.registered);
    async describe(namespace, _opts) {
        if (!this.registered.has(namespace))
            throw new Error(`settings namespace "${namespace}" is not registered`);
        const rec = this.ns.get(namespace);
        return {
            value: rec?.value,
            base: rec?.base,
            revision: rec?.revision ?? 0,
            applies: rec?.applies,
            secrets: rec?.secrets ?? [],
        };
    }
    async replace(namespace, value, expectedRevision) {
        if (!this.registered.has(namespace))
            throw new Error(`settings namespace "${namespace}" is not registered`);
        const rec = this.ns.get(namespace);
        if (expectedRevision !== undefined && rec && rec.revision !== expectedRevision) {
            throw new Error(`SETTINGS_CONFLICT: ${namespace} revision ${rec.revision} !== ${expectedRevision}`);
        }
        this.ns.set(namespace, {
            value, revision: (rec?.revision ?? 0) + 1, secrets: rec?.secrets ?? [], base: rec?.base, applies: rec?.applies,
        });
    }
    async update(namespace, patch, expectedRevision) {
        if (!this.registered.has(namespace))
            throw new Error(`settings namespace "${namespace}" is not registered`);
        const rec = this.ns.get(namespace);
        if (expectedRevision !== undefined && rec && rec.revision !== expectedRevision) {
            throw new Error(`SETTINGS_CONFLICT: ${namespace} revision ${rec.revision} !== ${expectedRevision}`);
        }
        const merged = { ...rec?.value, ...patch };
        this.ns.set(namespace, { value: merged, revision: (rec?.revision ?? 0) + 1, secrets: rec?.secrets ?? [] });
    }
}
export class MemCredentials {
    values = new Map();
    async describe(ref) {
        const v = this.values.get(ref);
        return { configured: v !== undefined, source: v !== undefined ? 'file' : 'env', writable: true };
    }
    async set(ref, value) { this.values.set(ref, value); }
    async unset(ref) { this.values.delete(ref); }
}
export class MemPlugins {
    installed = new Map();
    /** 测试钩子：install 抛错（模拟 npm ERESOLVE / 网络失败） */
    failInstall = false;
    /** 测试钩子：记录最近一次 install 收到的 spec（验证非 registry spec 透传） */
    lastSpec;
    async listInstalled() {
        return [...this.installed.values()];
    }
    async install(pkg, spec) {
        if (this.failInstall)
            throw new Error(`npm error code ERESOLVE: could not resolve ${pkg}`);
        if (this.installed.has(pkg))
            return { needsRestart: false };
        this.lastSpec = spec;
        this.installed.set(pkg, { name: pkg, version: '1.0.0', enabled: true, spec });
        return { needsRestart: true };
    }
}
export class MemWorkspace {
    records = new Map();
    async listRecords() { return [...this.records.values()]; }
    async writeRecord(r) { this.records.set(r.id, r); }
    async removeRecord(id) { this.records.delete(id); }
}
export class MemPatch {
    lines = new Map();
    async readPatchLines(_file) {
        return [...this.lines.values()];
    }
    async applyPatchChanges(_file, changes) {
        for (const c of changes) {
            if (c.action === 'remove')
                this.lines.delete(c.lineId);
            else
                this.lines.set(c.lineId, { lineId: c.lineId, raw: c.raw });
        }
    }
}
export class MemSnapshotStore {
    snapshots = new Map();
    blobs = new Map();
    async save(snapshot, blobs = new Map()) {
        this.snapshots.set(snapshot.id, snapshot);
        for (const [k, v] of blobs)
            this.blobs.set(`${snapshot.id}/${k}`, v);
        return snapshot.id;
    }
    async load(id) {
        const s = this.snapshots.get(id);
        if (!s)
            throw new Error(`snapshot not found: ${id}`);
        return s;
    }
    async readBlob(id, blobPath) {
        const v = this.blobs.get(`${id}/${blobPath}`);
        if (!v)
            throw new Error(`blob not found: ${id}/${blobPath}`);
        return v;
    }
    async updateStatus(id, status) {
        const s = this.snapshots.get(id);
        if (!s)
            throw new Error(`snapshot not found: ${id}`);
        s.status = status;
    }
}
export class MockHostContext {
    platform;
    arch = 'x64';
    homeDir;
    dshVersion = '0.1.0-rc.6';
    log;
    profile;
    settings = new MemSettings();
    credentials = new MemCredentials();
    plugins = new MemPlugins();
    workspace = new MemWorkspace();
    patchFile = new MemPatch();
    fs;
    constructor(platform, homeDir, profile) {
        this.platform = platform;
        this.homeDir = homeDir;
        this.profile = profile;
        this.fs = new MemFs(homeDir);
        this.log = createLogger({ level: 'error', sink: () => { } });
    }
}
export function makeContext(platform, homeDir, profile) {
    return new MockHostContext(platform, homeDir, profile);
}
/** 构造最小合法 manifest（adapter 单测用；真实 manifest 由 exporter 生成） */
export function makeManifest(platform = 'win32') {
    return {
        schemaVersion: 1,
        exporter: { name: 'dsh-config-manager-test', version: '0.0.0' },
        source: { dshVersion: '0.1.0-rc.6', platform: platform, arch: 'x64' },
        exportedAt: new Date('2026-08-14T12:00:00.000Z').toISOString(),
        sections: {
            settings: false, ui: false, providers: false, plugins: false, mcp: false, prompts: false,
            skills: false, agentPresets: false, agentInstructions: false, workspaces: false, pluginFiles: false,
            credentialsStatus: false, secrets: false, sessions: false, self: false,
        },
        security: { containsSecrets: false, encrypted: false, encryption: null },
    };
}
/** 构造 ImportContext（adapter 单测用；sections 键运行时即 SectionId 字符串） */
export function makeImportContext(target, sections, overrides = {}) {
    return {
        manifest: makeManifest(target.platform),
        targetPlatform: target.platform,
        target,
        sections: sections,
        pathMappings: [],
        resolutions: {},
        secretInputs: {},
        log: target.log,
        msg: zhMsg,
        ...overrides,
    };
}
export { sha256Hex };
//# sourceMappingURL=test-helpers.js.map