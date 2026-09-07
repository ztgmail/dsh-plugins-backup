#!/usr/bin/env node
import { type SnapshotMeta } from '../core/restore.ts';
import { type ReinstallItemId } from '../core/reinstall.ts';
export type CliCommand = 'snapshots' | 'restore' | 'reinstall' | 'recover-stale-lock' | 'help';
export interface CliOptions {
    command: CliCommand;
    /** --data-dir：快照数据目录覆盖 */
    dataDir?: string;
    /** --id：目标快照 id（restore 缺省取最近非 rolled-back） */
    id?: string;
    /** --dry-run：只打印计划（restore / reinstall） */
    dryRun: boolean;
    /** --profile：管理的 DSH profile（缺省 web） */
    profile: string;
    /** --settings：覆盖 settings 文件路径 */
    settings?: string;
    /** --version：reinstall 要安装的 DSH 版本（缺省 latest） */
    version?: string;
    /** --yes：reinstall 非交互（全选 + 跳过确认） */
    yes: boolean;
    /** --list：reinstall 列出可选清理项后退出 */
    list: boolean;
    /** --wipe-config：reinstall 等价勾选全部数据类（settings/plugins/data） */
    wipeConfig: boolean;
}
export type ParseResult = {
    ok: true;
    options: CliOptions;
} | {
    ok: false;
    error: string;
};
/** 解析 CLI 参数（纯函数；help 返回 command:'help'，未知/缺值返回错误） */
export declare function parseCli(argv: readonly string[]): ParseResult;
/** 解析 reinstall 交互多选输入：逗号/空格分隔的 1-based 编号；空串返回 null（用默认）。非法编号也返回 null。 */
export declare function parseSelectionInput(text: string): Set<ReinstallItemId> | null;
/** 解析 reinstall 二次确认输入：仅 "YES" 或 "Y"（忽略大小写/空白）视为确认。 */
export declare function parseConfirmInput(text: string): boolean;
/** $DSH_HOME：环境变量优先，缺省 ~/.dsh（dsh-home-paths 的简化规则，CLI 零依赖版） */
export declare function resolveDshHome(env?: Record<string, string | undefined>): string;
/** 快照数据目录：--data-dir 覆盖优先，缺省 $DSH_HOME/dsh-config-manager/snapshots */
export declare function resolveDataDir(flag: string | undefined, env?: Record<string, string | undefined>): string;
/** 检查 Phase 3 SAFE MODE：存在未恢复 transaction → CLI destructive 应拒绝（返回错误文案，否则 null）。 */
export declare function checkSafeModeBlocked(homeDir: string): string | null;
/** 快照 id 校验：拒绝路径分隔符/保留名（防 join 越界） */
export declare function validateSnapshotId(id: string): string;
/** 缺省快照选择：metas 已按 createdAt 倒序，取第一个 status !== 'rolled-back' */
export declare function pickDefaultSnapshotId(metas: readonly SnapshotMeta[]): string | null;
export interface CliIo {
    log: (s: string) => void;
    error: (s: string) => void;
}
export declare function printUsage(io?: CliIo): void;
export interface CliDeps {
    /** 交互提问（缺省用真实 stdin/stdout readline） */
    ask?: (prompt: string) => Promise<string>;
    /** 命令执行器（缺省跨平台：Windows powershell -Command / Unix bash -c） */
    exec?: (cmd: string) => Promise<string>;
    /** 平台（仅影响缺省 exec 的包装方式，缺省 process.platform） */
    platform?: NodeJS.Platform;
}
/**
 * CLI 主流程（io/env/deps 可注入供测试）：
 * snapshots → 列表；restore → dry-run 打印计划 / 执行并打印诚实报告；
 * reinstall → 交互多选 + 二次确认 + 跨平台执行。失败项存在时 exit 1，否则 0。
 */
export declare function runCli(argv: readonly string[], io?: CliIo, env?: Record<string, string | undefined>, deps?: CliDeps): Promise<number>;
