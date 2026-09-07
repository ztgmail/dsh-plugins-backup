/**
 * dsh-config-manager — host half.
 *
 * Mounts the backup / export / import engine (src/core Exporter + Importer
 * three-stage flow) behind the `/api/dsh-config-manager/*` route family that
 * the browser half (`./client`) calls, and wraps the real DSH host services
 * into the engine's `HostContext` facade (src/core/types.ts):
 *
 *   ctx.settings           -> SettingsFacade      (@deepseek-ai/dsh-settings)
 *   ctx.credentials        -> CredentialsFacade   (@deepseek-ai/dsh-credentials)
 *   ctx.plugins            -> PluginsFacade       (官方 dsh plugin CLI 通道 + profile 文件，
 *                                                  见 src/core/plugin-cli.ts)
 *   ctx.workspaceRegistry  -> WorkspaceFacade     (@deepseek-ai/dsh-workspace)
 *   ~/.dsh/cordis.patch.yml-> PatchFileFacade     (js-yaml)
 *   $DSH_HOME files        -> FileSystemFacade    (node:fs, home-relative)
 *   resolveDshHome()       -> homeDir             (@deepseek-ai/dsh-home-paths)
 *
 * Security posture (mirrors the verified @linxin666/dsh-ssh@0.1.12 routes):
 *  - every route carries the loopback-only + same-origin trust fence
 *    (isLoopbackRequest); LAN-exposed deployments never serve these endpoints;
 *  - uploads/exported ZIPs are staged under $DSH_HOME/dsh-config-manager/{tmp,exports}
 *    and every `path`/`zipPath` reference is confined to those roots;
 *  - the encryption password is in-memory only: used to derive the AES-256-GCM
 *    key for secrets.enc, never written to any file, manifest, or log;
 *  - the import execute endpoint refuses to run without `confirm: true`
 *    (core ImportNotConfirmedError safety valve).
 *
 * Optional services are read with ctx.get() at call time (never injected), so
 * the engine keeps working in profiles without the web-only workspace
 * service; hard dependencies are the core `settings`/`credentials` services
 * present in every profile. Plugin install/list no longer depend on the
 * web-only pluginMarketplace/pluginInventory services: both go through the
 * official `dsh plugin --profile <name>` CLI (pnpm forwarder) and read the
 * profile's package.json / node_modules directly.
 */
import type { ServerResponse } from 'node:http';
import type { Context } from '@deepseek-ai/cordis';
import type { CredentialProvider } from '@deepseek-ai/dsh-credentials';
import { type RestorePlan, type RestoreReport } from './core/restore.ts';
import type { MsgFunc } from './core/messages.ts';
import { runDshPlugin } from './core/plugin-cli.ts';
import type { PatchFileFacade, PluginInfo, PluginsFacade } from './core/types.ts';
import type { SyncConfig } from './sync/sync-config.ts';
import type { ConfiguredSecretPatterns } from './security/secret-scanner.ts';
import type { SectionId } from './schema/types.ts';
/** Stable cordis plugin name — must match the cordis.patch.yml row id. */
export declare const name = "config-manager";
/** Services required before the engine can mount (present in every profile). */
export declare const inject: string[];
/**
 * 内置 GitHub OAuth App 的 client_id（「使用 GitHub 登录」device flow 缺省值）。
 * Client ID 是公开标识（GitHub 官方明确非机密）：内置后所有安装者开箱即用，
 * 无需各自注册/配置 OAuth App；token 仍按用户私有（各自授权、各自存 credentials）。
 * 插件配置的 githubClientId 优先于本默认值（换自有 App 时覆盖）。
 */
export declare const DEFAULT_GITHUB_CLIENT_ID = "Ov23liq4i7n8UsylGRfb";
/** Plugin config (composition entry); the loader applies it as-is. */
export interface Config {
    /** Master switch; defaults to true. */
    enabled?: boolean;
    /** Data root override; defaults to $DSH_HOME/dsh-config-manager. */
    dataDir?: string;
    /** 管理的 profile 名（插件依赖读写/安装目标）；缺省取启动参数 --profile，再缺省 'web'。 */
    profile?: string;
    /**
     * GitHub OAuth App 的 client_id（「使用 GitHub 登录」device flow）。
     * 缺省使用内置 DEFAULT_GITHUB_CLIENT_ID（公开标识，开箱即用）；
     * 显式配置可覆盖（换自有 OAuth App 时）。
     */
    githubClientId?: string;
    /**
     * GitHub OAuth App 的 client_secret（confidential app 必需；public app 可省略）。
     * 只存在于宿主进程：device flow 轮询时由宿主直接发送给 GitHub，绝不回传浏览器/日志。
     */
    githubClientSecret?: string;
    /**
     * pluginFiles 分区：额外白名单文件（相对 ~/.dsh 根的单文件名或子路径）。
     * 与默认白名单（dsh-ssh.json、pet.json）合并；用于精确指定要随导出携带的插件配置文件。
     */
    pluginFiles?: string[];
    /**
     * pluginFiles 分区：约定的插件配置目录（相对 ~/.dsh 根，如 'plugin-config'）。
     * 导出时递归收集该目录下所有文件（按相对 ~/.dsh 根的路径写回），实现「往目录放文件即自动随备份携带」。
     */
    pluginFilesDir?: string;
    /**
     * F2 个人隐私规则（对齐 dsh-packer config.personalPatterns）：个人化敏感字段名 /
     * 引用字段 / 值形状模式，由部署者注入（个人昵称、本机用户名等），不进开源代码。
     * 未配置时扫描器行为与默认完全一致。
     */
    personalPatterns?: ConfiguredSecretPatterns;
}
/**
 * 同步 token 的 DSH credentials 引用名（POSIX env-var 形态，满足 CredentialRef 品牌要求）。
 * token 只经 credentialRef 读写（写入由请求体触发，读取在每次 git 网络操作时 resolve），
 * 永不进 repoUrl / argv / commit / 同步文件 / 日志。
 */
export declare const SYNC_CREDENTIAL_REF = "DSH_CONFIG_MANAGER_SYNC_TOKEN";
/**
 * WebDAV 通道口令的独立 DSH credentials 引用（与 git token 槽位分离）。
 * 口令只经 credentialRef 读写（写入由请求体触发，读取在每次 WebDAV 网络操作时
 * by WebDavTransport 经注入的 getPassword() resolve），永不进 URL / 请求头 / 日志。
 */
export declare const SYNC_WEBDAV_CREDENTIAL_REF = "DSH_CONFIG_MANAGER_SYNC_WEBDAV_PASSWORD";
/** 包名 → patch 行 id slug（仿 marketplace ensureRow）：去 @、非法字符→-、连续-合并、去首尾-。 */
export declare function slugOf(name: string): string;
/** 某 patch 行（raw）是否激活了指定包名（兼容单行与 insert 块成员）。 */
export declare function patchRowActivates(raw: unknown, name: string): boolean;
/**
 * 非 bundle 插件安装成功后，幂等补 profile cordis.patch.yml 激活行
 * （{id: pm-<slug>, name: <pkg>}，仿 marketplace ensureRow）。bundle 包不写行
 * （CLI 的 reconcile 已维护 dsh.profile.bundles）。
 */
export declare function ensureActivationRow(patchFile: PatchFileFacade, pkgDir: string, pkg: string): Promise<void>;
/**
 * Plugins facade：官方 dsh plugin CLI 通道（任何 profile 可用）+ profile 文件
 * 实时清单 + 非 bundle 插件激活行幂等补写。不再依赖 web 专用
 * pluginMarketplace / pluginInventory 服务。
 *
 * 导出 + runner 可注入：M5 单测用 mock runner 验证「无 marketplace 时 install
 * 走 CLI 通道」的行为契约，不触发真实子进程；生产路径默认参数不变。
 */
export declare class DshPluginsFacade implements PluginsFacade {
    private readonly homeDir;
    private readonly profile;
    private readonly patchFile;
    private readonly msg;
    private readonly runner;
    constructor(homeDir: string, profile: string, patchFile: PatchFileFacade, runner?: typeof runDshPlugin, msg?: MsgFunc);
    listInstalled(): Promise<PluginInfo[]>;
    install(pkg: string, spec?: string, signal?: AbortSignal): Promise<{
        needsRestart: boolean;
    }>;
}
/** 同步路由可预期的请求级错误（status 缺省 400；引擎/传输失败走 500） */
export declare class SyncRouteError extends Error {
    readonly status: number;
    constructor(message: string, status?: number);
}
/** 同步路由错误统一出口：SyncRouteError 用其 status，其余 500（GitTransport 错误消息已脱敏） */
export declare function writeSyncRouteError(res: ServerResponse, error: unknown): void;
/** parseSyncBody 的凭据写入依赖（只用到 set；测试可注入内存 mock）。 */
export interface ParseSyncBodyDeps {
    credentials: Pick<CredentialProvider, 'set'>;
}
/**
 * 解析同步请求体，按 transport 分支返回归一化的 SyncConfig（可辨识联合，schemaVersion=2）。
 * 请求体形状（flat，M4 契约）：
 * - git:    { transport:'git', repoUrl, token? } —— token 非空写 SYNC_CREDENTIAL_REF；
 *   git 可执行文件固定使用系统 PATH 中的 git（不再接受自定义 gitBin）。
 * - webdav: { transport:'webdav', url, username?, password? } —— password 非空写 SYNC_WEBDAV_CREDENTIAL_REF。
 * 返回值不含任何 secret（password/token 只进 credentials，永不回传/落同步文件）。
 */
export declare function parseSyncBody(body: Record<string, unknown>, deps: ParseSyncBodyDeps): Promise<SyncConfig>;
/** 由 SyncConfig 合成 WebDAV 通道 baseUrl（webdav.url，尾部规范化带 '/'；git 通道返回 ''）。 */
export declare function webdavBaseUrl(cfg: SyncConfig): string;
/**
 * 补全 webdav 配置缺失的 username（从持久化配置回填；纯函数，不修改入参）。
 * 语义与 password 一致：请求未带 username（表单留空/挂载自动加载）→ 沿用已保存的值；
 * 请求显式带 username → 原样保留（用户新输入优先）。非 webdav / 无持久化 → 原样返回。
 */
export declare function mergePersistedWebDavUsername(cfg: SyncConfig, persisted: SyncConfig | null): SyncConfig;
/**
 * 解析 push 请求体的分区选择（sections）——「高级/自定义导出」模式负载。
 * - 缺省 / 非数组 / 空数组 → undefined（= 全部 portable 推荐分区，即「默认/快速导出」模式）；
 * - 元素必须是 knownIds（已知 adapter id）中的非空字符串，非法 → SyncRouteError（不静默吞错）；
 * - 返回去重后的数组（保持原顺序；重复分区不做重复导出）。
 */
export declare function extractSyncSections(body: Record<string, unknown>, knownIds: ReadonlySet<string>): SectionId[] | undefined;
/** POST /restore 请求体校验（纯函数；snapshotId 拒绝路径分隔符防 join 越界）。 */
export type BuildRestoreBodyResult = {
    ok: true;
    value: {
        snapshotId: string;
        dryRun: boolean;
    };
} | {
    ok: false;
    error: string;
};
export declare function buildRestoreBody(body: unknown): BuildRestoreBodyResult;
/**
 * 宿主侧恢复动作执行器（真实执行 restore 计划）：
 * 整文件/文件还原与删除走 ctx.fs（home-relative facade，越界由 facade 再拦一道），
 * blob 读取与 pre-restore 副本走快照目录（node fs），插件卸载走官方 dsh plugin CLI。
 */
export interface RestoreExecutor {
    /** 读快照目录内 blob（相对 snapshotDir） */
    readBlob(blobPath: string): Promise<Uint8Array>;
    /** 把当前 home 文件内容复制到 <snapshotDir>/pre-restore/（覆盖/删除前的双保险） */
    savePreRestore(relPath: string): Promise<void>;
    existsHome(relPath: string): Promise<boolean>;
    writeHome(relPath: string, data: Uint8Array): Promise<void>;
    removeHome(relPath: string): Promise<void>;
    /** 卸载插件（官方通道）；失败返回 { ok:false, message } */
    uninstallPlugin(name: string): Promise<{
        ok: boolean;
        message?: string;
    }>;
}
/**
 * 按计划执行恢复动作（纯执行器；逐项 try/catch 不拖垮其余），
 * 返回与 CLI 一致的诚实报告。顺序 = 计划顺序（整文件 → 插件 → file 补偿）。
 * @param onAction - 每项动作执行回调（宿主路由埋点：更新 RunRegistry 进度；
 *   index/1-based、total=计划动作数、detail=动作描述）
 */
export declare function executeRestorePlan(plan: RestorePlan, exec: RestoreExecutor, onAction?: (info: {
    index: number;
    total: number;
    detail: string;
}) => void): Promise<RestoreReport>;
/**
 * Mount the config-manager engine: host context, adapters, and the
 * /api/dsh-config-manager routes (when a webServer is present).
 * @param ctx - host plugin context carrying settings/credentials/webServer.
 * @param config - resolved plugin config.
 */
export declare function apply(ctx: Context, config?: Config): void;
