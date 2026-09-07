/**
 * dsh-config-manager reinstall — 一键重装 DSH 程序（跨平台）。
 *
 * 场景：DSH 配置损坏 / 无法启动时，用户可用本命令迅速重装 `@deepseek-ai/dsh`
 * 启动器（连同可选清理），装好后启动 GUI 插件，再同步远程仓库中的快照恢复配置。
 *
 * 设计要点：
 *  - 纯 Node，零新增依赖；命令执行（child_process）由调用方注入，便于 TDD。
 *  - 动作按类别组织，CLI 层据此做交互式多选：
 *      program   重装 DSH 程序本体（卸载 -g + 清全局残留 + 重装 -g + 验证）
 *      cache     清理全局残留缓存（pnpm store / npm cache）
 *      settings  清空 ~/.dsh 设置（settings.yaml 等）
 *      plugins   清空 profile 已装插件依赖
 *      data      清空会话记录与凭据（最高风险，CLI 层强制二次确认）
 *  - 跨平台：npm 子命令（uninstall/install/cache clean）本身跨平台；目录删除用
 *    平台对应命令（Windows PowerShell `Remove-Item` / Unix `rm -rf`）；路径用
 *    node:os / process.env 动态解析，绝不硬编码机器路径。
 *  - 平台可注入：`isWindows(platform)` 与各命令构建器接受可选的 `platform`
 *    参数（缺省 process.platform），便于在任意宿主上测试 Windows / Unix 两套输出。
 *  - `NS` = 一律不删快照目录（snapshots/）：它是恢复的最后依靠，除非用户将来
 *    显式亮出独立开关删除。
 */
export type ReinstallItemId = 'program' | 'cache' | 'settings' | 'plugins' | 'data';
export interface ReinstallItemDef {
    id: ReinstallItemId;
    /** 中文名（CLI 交互清单 / 日志用） */
    label: string;
    /** 一句话影响说明（交互选择时展示） */
    desc: string;
    /** 是否触及用户数据（即是否属于"清空 ~/.dsh"危险面，需二次确认） */
    destructive: boolean;
    /** 是否默认勾选（program / cache 默认；数据类默认不勾） */
    defaultOn: boolean;
}
export declare const REINSTALL_ITEMS: readonly ReinstallItemDef[];
export type ReinstallSelection = ReadonlySet<ReinstallItemId>;
/**
 * 当前是否 Windows。platform 可注入以便测试 Unix 分支。
 */
export declare function isWindows(platform?: NodeJS.Platform): boolean;
/** 当前用户主目录。 */
export declare function resolveHomeDir(env?: Record<string, string | undefined>): string;
/** DSH 数据主目录：$DSH_HOME 优先，缺省 ~/.dsh（与 CLI resolveDshHome 一致）。 */
export declare function resolveDshHome(env?: Record<string, string | undefined>): string;
/** 全局 npm root（node_modules 所在目录）：`npm root -g`。 */
export declare function resolveNpmGlobalRoot(exec: (cmd: string) => Promise<string>): Promise<string>;
/** 全局 pnpm 缓存/存储目录：优先 $PNPM_STORE_PATH，其次 $LOCALAPPDATA/pnpm/store（Win）或 ~/.local/share/pnpm/store（Unix）。 */
export declare function resolvePnpmStoreDir(env?: Record<string, string | undefined>, platform?: NodeJS.Platform): string | null;
/**
 * POSIX / sh 单引号逃逸：路径含单引号时按 `'...'\''...'` 拼接。
 * 用于 Unix 命令（rm -rf / cp -r）。
 */
export declare function shellQuote(s: string): string;
/**
 * PowerShell 单引号逃逸：内嵌单引号用 `''` 翻倍（PowerShell 语法），
 * 用于 Windows 命令（Remove-Item / Copy-Item）。
 */
export declare function psQuote(s: string): string;
/**
 * 目录删除命令（平台差异）：Windows → PowerShell `Remove-Item -Recurse -Force`；
 * Unix → `rm -rf`。路径已做对应 shell 安全逃逸。
 */
export declare function rmCommand(dir: string, platform?: NodeJS.Platform): string;
/**
 * 复制目录（Windows 用 Copy-Item / Unix 用 cp -r）。为避免残留旧备份，
 * 先删除目标再复制。
 */
export declare function copyDirCommand(src: string, dest: string, platform?: NodeJS.Platform): string;
export interface ReinstallStep {
    /** 步骤中文描述（日志 / dry-run 展示） */
    label: string;
    /** 实际执行的 shell 命令；dry-run 时不执行 */
    command: string;
    /** 是否属于危险（触及 ~/.dsh 数据）动作 */
    dangerous: boolean;
}
export interface ReinstallPlan {
    /** 目标 DSH 版本（'latest' 表示最新版） */
    version: string;
    steps: ReinstallStep[];
    /** 是否涉及清空 ~/.dsh 数据（settings/plugins/data 任一勾选即 true） */
    wipeConfig: boolean;
}
/**
 * 生成重装计划。exec 用于实时解析 npm root 等路径；plan 生成完成后，
 * 执行由调用方逐条跑 `exec(step.command)`（dry-run 则不跑）。
 *
 * @param selection 已选类别集合
 * @param version   DSH 版本号（空或 'latest' → latest）
 * @param exec      命令执行器（解析 npm 路径用；纯测试可注入假实现）
 * @param env       环境变量（home / DSH_HOME / pnpm 路径）
 * @param platform  平台判定（缺省 process.platform；测试可注入）
 */
export declare function buildReinstallPlan(selection: ReinstallSelection, version: string, exec: (cmd: string) => Promise<string>, env?: Record<string, string | undefined>, platform?: NodeJS.Platform): Promise<ReinstallPlan>;
/**
 * 探测当前已安装的全局 DSH 版本（`dsh --version` 输出末行 trim）。
 * 返回 null = 无法探测（reinstall program 步应 fail-closed，不允许继续 uninstall）。
 * exec 可注入（测试用假实现；真实 `exec('dsh --version')`）。
 */
export declare function detectInstalledDshVersion(exec: (cmd: string) => Promise<string>): Promise<string | null>;
export interface ReinstallRecoveryPoint {
    /** 绑定 upgrade operation（journal.operationId ↔ recovery point.operationId） */
    operationId: string;
    environmentFingerprint: string;
    /** 重装前已安装 DSH 版本（recovery evidence：恢复目标版本） */
    previousInstalledVersion: string;
    /** 请求的目标版本 spec（'latest' 或缺省字符串） */
    requestedTargetSpec: string;
    createdAt: string;
    /** 供人工恢复参考的命令元数据 */
    recoveryHint: string;
}
/**
 * 写 durable reinstall recovery point（F29/F30）。
 * 必须在 `npm uninstall -g` 之前调用并把文件落盘成功，才允许继续 program 步。
 * 写入 <dataDir>/recovery/reinstall-<operationId>.json（atomic 0600）。
 * 返回写入的 recovery point；写失败抛错 → 调用方 fail-closed（不继续 uninstall）。
 */
export declare function writeReinstallRecoveryPoint(dataDir: string, point: ReinstallRecoveryPoint, fs?: {
    mkdir(p: string, opts?: {
        recursive?: boolean;
    }): Promise<unknown>;
    writeFile(p: string, content: string, opts?: {
        mode?: number;
    }): Promise<unknown>;
}): Promise<string>;
/** 读取 reinstall recovery point（供恢复/审计；不存在返回 null）。 */
export declare function readReinstallRecoveryPoint(dataDir: string, operationId: string): Promise<ReinstallRecoveryPoint | null>;
