/**
 * dsh plugin CLI 通道（方案A 主机侧实现，M1）。
 *
 * 本模块是唯一的子进程启动点：把「安装 / 更新 profile 插件」转成官方
 * `dsh plugin --profile <name> <args…>` 调用（dsh CLI 内部转发 pnpm，并在
 * 成功后 reconcile dsh.profile.bundles），以及从 profile 文件实时读取已装
 * 插件清单（不依赖 web 专用 pluginMarketplace / pluginInventory 服务）。
 *
 * 设计对齐：
 *  - dsh 官方实现 @deepseek-ai/dsh/lib/plugin-*.js（runPlugin / reconcilePlugins /
 *    exportsPatch 的 bundle 判定语义）；
 *  - dshmarket src/dsh-cli.ts（dshArgv / spawnShim / killTree / spawnEnv）与
 *    src/profile.ts（readInstalled / readInstalledVersion / hasDshManifest）。
 *
 * 只依赖 node 内置模块，零 DSH 运行时依赖（M5 的 TDD 可直接单测本模块）。
 */
import type { ChildProcess } from 'node:child_process';
import type { PluginInfo } from './types.ts';
/**
 * dsh 出厂自带的 in-box bundle（profile 模板自身安装的层）：唯一从「已装
 * 插件清单」中隐藏的名字。社区插件可以合法地发布在官方 scope 下，因此不能
 * 按 scope 整段过滤（dshmarket #28 的结论）。
 */
export declare const INBOX_BUNDLES: ReadonlySet<string>;
/**
 * profile 名合法性校验，与 dsh-app-boot 的 resolveProfileDir 一致：拒绝空名、
 * 路径分隔符与保留名，防止 join(home, 'profiles', name) 越界。
 */
export declare function validateProfileName(profile: string): string;
/** Profile 目录：$DSH_HOME/profiles/<name>（homeDir 由宿主 resolveDshHome() 解析）。 */
export declare function resolveProfileDir(homeDir: string, profile: string): string;
/**
 * 从启动参数解析 profile 名：`--profile <name>` → 缺省 'web'。与宿主 apply 时的
 * resolveProfileName 同源（config 覆盖仅 apply 处有；报告/适配器场景用本函数即可）。
 * argv 参数化便于测试；缺省读当前进程 argv。
 * 宽容语义：缺值 / 值以 '-' 开头 / 校验非法 → 一律回退 'web'。消息构建路径
 * （applyItem 失败分支、补行等）绝不允许因 profile 名抛错破坏非致命 warning；
 * 且 launcher 在启动时已拒绝非法 profile，此分支实际不可达。
 */
export declare function resolveProfileNameFromArgv(argv?: readonly string[]): string;
interface ProfileManifest {
    dependencies?: Record<string, string>;
    dsh?: {
        profile?: {
            bundles?: string[];
        };
    };
}
/** 读 profile package.json；不可读（未初始化 / 损坏）返回 null。 */
export declare function readProfileManifest(profileDir: string): ProfileManifest | null;
/** 写回 profile package.json（2 空格缩进 + 尾换行，与 dsh-app-boot 一致；原子写防半装损坏）。 */
export declare function writeProfileManifest(profileDir: string, manifest: ProfileManifest): void;
/** 真实已装的依赖（in-box bundles 过滤掉）：name → 声明的版本 spec。 */
export declare function readInstalled(profileDir: string): Record<string, string>;
/** node_modules/<name>/package.json 里实际落盘的版本；未装 / 不可读为 null。 */
export declare function readInstalledVersion(profileDir: string, name: string): string | null;
/** 包的 package.json 是否声明 dsh.bundle.patch（即它是一个 bundle / profile 层）。 */
export declare function hasDshBundlePatch(pkgDir: string): boolean;
/**
 * 维护 dsh.profile.bundles 与已装依赖一致（语义对齐官方 plugin 命令的
 * reconcilePlugins，按「已装状态」而非依赖 diff 判定）：
 *  - 声明 dsh.bundle.patch 的依赖必须出现在 bundles（追加在依赖顺序尾部）；
 *  - bundles 中「曾是依赖、但不再是（移除或版本不再声明 patch）」的条目移出；
 *  - in-box bundles 不是依赖，永远不碰。
 * 仅在确有变化时写回 package.json。返回是否写回。
 */
export declare function reconcileBundles(profileDir: string): boolean;
/**
 * 中止安装后清理半装状态（用户「跳过当前插件」）：移除 profile package.json 中的
 * 依赖行 + reconcile bundles + 删 node_modules/<pkg>。
 *
 * 目的：pnpm add 被中途 kill 后，package.json 可能已声明依赖但 node_modules 不完整，
 * 直接启动 DSH 会因缺包而失败。本函数把 manifest 恢复为「该插件未安装」的一致状态，
 * 消除「声明了依赖但没装全」的启动风险。pnpm-lock.yaml 不触碰（运行时不被读取，
 * 下次安装 pnpm 自行对齐）。尽力而为：任何失败不抛错，由调用方记录告警。
 */
export declare function cleanupAbortedInstall(profileDir: string, pkg: string): void;
/** 实时读 profile 已装插件清单（先 reconcile bundles，再逐依赖取版本/bundle 属性）。 */
export declare function listInstalledPlugins(homeDir: string, profile: string): PluginInfo[];
/** 安装目标：非 registry spec 按 spec 安装；其余按裸包名（npm 最新版）。 */
export declare function installSpecFor(pkg: string, spec?: string): string;
/**
 * 重放启动当前宿主进程的 dsh CLI：
 *  - process.argv[1] 是 dsh 入口（全局 bin / 源码启动的 bin.ts / bin.js）→ 用
 *    当前 Node 重新执行该入口（execArgv 原样保留，cwd 靠近入口保持相对导入可解析）；
 *  - 否则退回 PATH 上的 `dsh`（Windows 是 .cmd，需经 shell）。
 */
export declare function dshArgv(): {
    file: string;
    args: string[];
    cwd: string | undefined;
    viaShell: boolean;
};
/** 为一个 argv token 构造 cmd.exe 命令行引用（需要引用的 token 用双引号包裹并加倍内部引号）。 */
export declare function quoteCmdArg(arg: string): string;
/** 由 argv 构造 cmd.exe 命令行（仅 Windows 垫片路径使用）。 */
export declare function cmdCommandLine(argv: readonly string[]): string;
/**
 * 杀掉子进程整棵进程树：Windows 的 kill() 只终止包装进程、pnpm 子进程还活着，
 * 用 taskkill /T /F；POSIX 子进程独立进程组启动（detached），先 SIGTERM 组、
 * 5 秒后 SIGKILL 兜底。
 */
export declare function killTree(child: ChildProcess): void;
/** 一次 dsh plugin 子进程调用的原始结果（M2 失败分类器的输入）。 */
export interface DshPluginResult {
    exitCode: number | null;
    timedOut: boolean;
    /** 经 AbortSignal 中止（用户跳过/取消）：进程树被 kill，非失败语义 */
    aborted?: boolean;
    stdout: string;
    stderr: string;
    /** spawn 自身失败（如 ENOENT）；此时 exitCode 固定为 127。 */
    spawnError?: string;
}
/**
 * 运行 `dsh plugin --profile <profile> <pluginArgs…>`：
 * cwd=profile 目录、CI 环境、windowsHide、pipe 输出、15 分钟超时杀进程树。
 * 永远 resolve（不 throw），由调用方判定成败。
 *
 * signal：可选 AbortSignal。中止时立即 killTree 杀掉整棵进程树（dsh 包装 + pnpm 孙进程），
 * 结果标记 aborted=true（调用方据此判定「用户跳过/取消」，而非失败）。
 */
export declare function runDshPlugin(profileDir: string, profile: string, pluginArgs: readonly string[], timeoutMs?: number, signal?: AbortSignal): Promise<DshPluginResult>;
/**
 * 已识别的 pnpm/dsh CLI 失败模式（纯函数，可独立单测）。
 * 识别语义对齐 dshmarket src/pnpm-compat.ts：dsh 的包装行不提供原因，必须
 * 从 pnpm 的真实诊断文本里认。
 */
export type DshPluginFailureCode = 'hoist-pattern-diff' | 'adding-to-root' | 'not-a-workspace' | 'release-age-violation' | 'git-build-blocked' | 'fetch-404' | 'transient-network' | 'pnpm-missing';
export interface DshPluginFailure {
    code: DshPluginFailureCode;
    /** 双语可操作消息（同一字符串内 zh / en）。 */
    message: string;
    /** true = 按消息指示重跑（重建 / 直接重试）通常即可恢复；false = 需要人工动作。 */
    recoverable: boolean;
}
/**
 * 瞬时网络故障判定：pnpm 的 5xx 拉取码、meta 拉取放弃、以及穿透 dsh 包装的
 * 原始 socket 错误。永久的形态（404、鉴权）刻意排除——重试只会加倍等坏消息。
 */
export declare function isTransientDshPluginFailure(output: string): boolean;
/**
 * 把一次失败的 dsh plugin 调用的合并输出映射到已知失败模式。
 * @param output - stdout+stderr 合并文本。
 * @returns 分类结果；未识别返回 null（调用方展示原始摘要）。
 */
export declare function classifyDshPluginFailure(output: string): DshPluginFailure | null;
/** 安装失败 → 分类后的双语可读 Error；未识别则保留 stderr 尾部摘要。 */
export declare function installErrorFor(pkg: string, result: DshPluginResult): Error;
export {};
