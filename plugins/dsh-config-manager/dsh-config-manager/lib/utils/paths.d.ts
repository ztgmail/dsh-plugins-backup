import type { PathMapping } from '../core/types.ts';
/** 归一化内部表示：统一 `/` 分隔、去尾部斜杠（空串保持） */
export declare function normalizePath(p: string): string;
/** 转当前平台原生路径 */
export declare function toNativePath(p: string): string;
/** 跨平台绝对路径识别（POSIX `/x` 与 Windows `C:\x`、UNC `\\server\share`） */
export declare function isAbsolutePath(p: string): boolean;
/** 路径是否为 home 目录（~ 或用户主目录开头） */
export declare function isHomePath(p: string, homeDir: string): boolean;
/** 目标平台与当前平台是否一致 */
export declare function isSamePlatform(a: string, b: string): boolean;
/** ZIP 条目名安全检查（Zip Slip / 绝对路径 / 盘符 / NUL，规范 §19.1-2）。
 * 规则与 node:path 解耦：纯分段校验，跨平台无歧义。 */
export declare function isPathSafe(entryName: string): boolean;
/** 候选目录是否位于父目录之内（含等于父目录） */
export declare function isSameOrChild(p: string, parent: string): boolean;
/**
 * 归一化并折叠 `.` / `..` 路径段（Reviewer B P0 修复）。
 * 宿主 fs 经 `resolve(join(homeDir, rel))` 会折叠 `..`，因此「看似不在保留命名空间、实际经 `..` 落到保留区」
 * 的路径（如 `dsh-config-manager/../dsh-config-manager/snapshots/...`）必须在此折叠后再判，否则 F23 被绕过。
 * 纯字符串、跨平台（只用 `/`）语义与 node:path normalize 一致；`..` 超根时按根截断（不越到 home 外）。
 */
export declare function normalizePathCollapsed(p: string): string;
/** 判断相对 homeDir 的路径是否落在内部 control-plane namespace（F23 投毒防护）。
 *  大小写不敏感（Windows 文件系统大小写不敏感，防 `DSh-Config-Manager/...` 绕过）；
 *  先折叠 `..`/`.` 段（宿主 fs 会折叠，此处必须同样折叠以免被路径穿越绕过）。 */
export declare function isReservedInternalRel(relPath: string): boolean;
/**
 * 前缀批量映射（规范 §12）：把对象内所有字符串值中匹配 oldPrefix 的路径
 * 替换为 newPrefix（路径感知：必须落在段边界）。返回新对象（不改原对象）。
 */
export declare function applyPrefixMappings(value: unknown, mappings: PathMapping[]): unknown;
/** 对对象内所有字符串叶节点做变换（迭代式，保留非字符串原样；二进制 Uint8Array 视为叶子） */
export declare function mapStrings(value: unknown, fn: (s: string) => string): unknown;
/**
 * 收集对象中所有绝对路径叶值（供 analyzer 做跨设备路径检测）。
 * 返回 (value, jsonPath) 对；jsonPath 形如 "workspaces[0].path"。
 */
export declare function collectAbsolutePaths(value: unknown, prefix?: string): {
    value: string;
    path: string;
}[];
