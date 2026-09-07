import type { MsgFunc } from '../core/messages.ts';
export declare const SYNC_CONFIG_FILE = "sync-config.json";
/** 同步通道类型（git / webdav；host 侧统一引用，autosync-config / sync-selection 复用）。 */
export type SyncTransportType = 'git' | 'webdav';
/** 当前 sync-config.json schema 版本号（v3：双命名空间共存，切换通道不丢失另一通道配置）。 */
export declare const SYNC_CONFIG_SCHEMA_VERSION = 3;
/** 历史可读取版本：v1、v2、v3。 */
export declare const SYNC_CONFIG_SUPPORTED_VERSIONS: readonly number[];
/** git 通道配置（不含任何凭据；git 可执行文件固定使用系统 PATH 中的 git） */
export interface GitConfig {
    repoUrl: string;
}
/** webdav 通道配置（不含 password；password 走 DSH credentials） */
export interface WebDavConfig {
    /** WebDAV 端点地址（不含凭据；拒绝 userinfo） */
    url: string;
    /** 可选用户名（可回显） */
    username?: string;
}
/**
 * 完整双命名空间配置视图（v3 文件直接读取，供 status 路由回填另一通道的 repoUrl/url）。
 * 与可辨识联合 SyncConfig 不同：git 和 webdav 命名空间同时存在，可能缺失。
 */
export interface FullSyncConfig {
    transport: 'git' | 'webdav';
    git?: GitConfig;
    webdav?: WebDavConfig;
}
/** 持久化的同步通道配置：可辨识联合（schemaVersion 恒 2） */
export type SyncConfig = {
    schemaVersion: 2;
    transport: 'git';
    git: GitConfig;
} | {
    schemaVersion: 2;
    transport: 'webdav';
    webdav: WebDavConfig;
};
/** git 通道守卫 */
export declare function isGitConfig(cfg: SyncConfig): cfg is Extract<SyncConfig, {
    transport: 'git';
}>;
/** webdav 通道守卫 */
export declare function isWebDavConfig(cfg: SyncConfig): cfg is Extract<SyncConfig, {
    transport: 'webdav';
}>;
/**
 * 读取同步通道配置；文件不存在/损坏/不支持 schema → null（视为未配置，UI 显示空表单）。
 * 兼容旧文件：缺 schemaVersion 字段视为 v1（git 通道）。
 * 恒返回 schemaVersion=2 的规范形态（v1 读取时归一为 git）。
 */
export declare function readSyncConfig(dir: string): Promise<SyncConfig | null>;
/**
 * 读取完整的双命名空间配置（供 status 路由回填另一通道的 repoUrl/url）。
 * 文件不存在/损坏/无任何通道配置 → null（视为未配置）。
 */
export declare function readFullSyncConfig(dir: string): Promise<FullSyncConfig | null>;
/**
 * 读取指定通道的同步通道配置（供自动同步调度器按通道运行）。
 * 从完整双命名空间配置取对应通道构造可辨识联合 SyncConfig；该通道未配置 → null。
 */
export declare function readSyncConfigFor(dir: string, channel: SyncTransportType): Promise<SyncConfig | null>;
/**
 * 保存同步通道配置（自动创建目录；恒写 schemaVersion=3 双命名空间）。
 * - 写入当前通道的命名空间（git/webdav）；
 * - 另一通道之前配置过 → 一并保留（切换通道不丢失另一通道的 repoUrl/url）；
 * - 覆盖旧值；未配置过的字段不写入。
 */
export declare function writeSyncConfig(dir: string, cfg: SyncConfig): Promise<void>;
/**
 * 仓库地址合法性校验（返回错误消息；null = 合法）。
 * 安全约束：token 永不拼入 repoUrl —— http(s) 地址带 userinfo（username[:password]@）直接拒绝，
 * 引导用户把 token 放凭据字段（DSH credentials），避免 token 经 URL 泄漏进 git 历史/日志。
 */
export declare function validateRepoUrl(repoUrl: string, msg?: MsgFunc): string | null;
/**
 * WebDAV 端点地址合法性校验（返回错误消息；null = 合法）。
 * 安全约束：口令/密码永不拼入 url —— 仅接受 http(s)，且拒绝带 userinfo
 * （username[:password]@）的地址，引导用户把口令放 DSH credentials，避免凭据经 URL 泄漏进出入口/日志。
 */
export declare function validateWebDavUrl(url: string, msg?: MsgFunc): string | null;
