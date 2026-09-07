import { type Logger } from '../utils/logger.ts';
import { sha256Hex } from '../utils/hashing.ts';
import type { CredentialsFacade, FileSystemFacade, HostContext, ImportContext, NamespaceInfo, PatchFileFacade, PluginInfo, PluginsFacade, SettingsFacade, Snapshot, SnapshotStore, WorkspaceFacade } from '../core/types.ts';
import type { Manifest, WorkspaceRecord } from '../schema/types.ts';
export declare class MemFs implements FileSystemFacade {
    files: Map<string, Uint8Array<ArrayBufferLike>>;
    private readonly homeDir;
    constructor(homeDir: string);
    private key;
    readFile(relPath: string): Promise<Uint8Array>;
    writeFile(relPath: string, data: Uint8Array): Promise<void>;
    exists(relPath: string): Promise<boolean>;
    copy(from: string, to: string): Promise<void>;
    remove(relPath: string): Promise<void>;
    listRecursive(dir: string): Promise<string[]>;
    mkdir(): Promise<void>;
}
/** ns.set 时自动注册（有值即视为对应插件已激活；对齐真实 dsh-settings 的注册语义） */
declare class AutoRegisterMap extends Map<string, {
    value: unknown;
    base?: unknown;
    revision: number;
    applies?: string[];
    secrets: {
        path: string[];
        set: boolean;
    }[];
}> {
    private readonly registered;
    constructor(registered: Set<string>);
    set(key: string, value: {
        value: unknown;
        base?: unknown;
        revision: number;
        applies?: string[];
        secrets: {
            path: string[];
            set: boolean;
        }[];
    }): this;
}
export declare class MemSettings implements SettingsFacade {
    /** 已注册命名空间（对齐真实 dsh-settings：插件激活时注册；未注册的 describe/replace 抛错） */
    registered: Set<string>;
    /** 有值的命名空间自动视为已注册 */
    ns: AutoRegisterMap;
    describe(namespace: string, _opts?: {
        redactSecrets?: boolean;
    }): Promise<NamespaceInfo>;
    replace(namespace: string, value: unknown, expectedRevision?: number): Promise<void>;
    update?(namespace: string, patch: unknown, expectedRevision?: number): Promise<void>;
}
export declare class MemCredentials implements CredentialsFacade {
    values: Map<string, string>;
    describe(ref: string): Promise<{
        configured: boolean;
        source?: string;
        writable?: boolean;
    }>;
    set(ref: string, value: string): Promise<void>;
    unset(ref: string): Promise<void>;
}
export declare class MemPlugins implements PluginsFacade {
    installed: Map<string, PluginInfo>;
    /** 测试钩子：install 抛错（模拟 npm ERESOLVE / 网络失败） */
    failInstall: boolean;
    /** 测试钩子：记录最近一次 install 收到的 spec（验证非 registry spec 透传） */
    lastSpec: string | undefined;
    listInstalled(): Promise<PluginInfo[]>;
    install(pkg: string, spec?: string): Promise<{
        needsRestart: boolean;
    }>;
}
export declare class MemWorkspace implements WorkspaceFacade {
    records: Map<string, WorkspaceRecord>;
    listRecords(): Promise<WorkspaceRecord[]>;
    writeRecord(r: WorkspaceRecord): Promise<void>;
    removeRecord(id: string): Promise<void>;
}
export declare class MemPatch implements PatchFileFacade {
    lines: Map<string, {
        lineId: string;
        raw: unknown;
    }>;
    readPatchLines(_file: string): Promise<{
        lineId: string;
        raw: unknown;
    }[]>;
    applyPatchChanges(_file: string, changes: {
        lineId: string;
        raw: unknown;
        action: 'insert' | 'update' | 'remove';
    }[]): Promise<void>;
}
export declare class MemSnapshotStore implements SnapshotStore {
    snapshots: Map<string, Snapshot>;
    blobs: Map<string, Uint8Array<ArrayBufferLike>>;
    save(snapshot: Snapshot, blobs?: Map<string, Uint8Array>): Promise<string>;
    load(id: string): Promise<Snapshot>;
    readBlob(id: string, blobPath: string): Promise<Uint8Array>;
    updateStatus(id: string, status: Snapshot['status']): Promise<void>;
}
export declare class MockHostContext implements HostContext {
    platform: string;
    arch: string;
    homeDir: string;
    dshVersion: string;
    log: Logger;
    profile?: string;
    settings: MemSettings;
    credentials: MemCredentials;
    plugins: MemPlugins;
    workspace: MemWorkspace;
    patchFile: MemPatch;
    fs: MemFs;
    constructor(platform: string, homeDir: string, profile?: string);
}
export declare function makeContext(platform: string, homeDir: string, profile?: string): MockHostContext;
/** 构造最小合法 manifest（adapter 单测用；真实 manifest 由 exporter 生成） */
export declare function makeManifest(platform?: string): Manifest;
/** 构造 ImportContext（adapter 单测用；sections 键运行时即 SectionId 字符串） */
export declare function makeImportContext(target: HostContext, sections: ReadonlyMap<string, unknown>, overrides?: Partial<ImportContext>): ImportContext;
export { sha256Hex };
