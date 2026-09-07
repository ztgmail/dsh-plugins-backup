/**
 * Export Schema 版本判定 —— 集中唯一出口（对齐 Docs/design/architecture.md §10.3）。
 *
 * 业务代码零版本判断：所有模块一律通过本文件函数判定，
 * 任何 `if (v === 1)` 式散落判断均为禁止项。
 */
/** 当前 Export Schema 版本（v1 起点；未来随迁移链演进） */
export declare const CURRENT_SCHEMA_VERSION: 1;
/** 本插件支持导入的最低 schema 版本 */
export declare const MIN_SUPPORTED_SCHEMA_VERSION: 1;
/** 版本不受支持（过新或过旧）时的错误；携带版本号便于 UI 提示升级/更新备份 */
export declare class UnsupportedSchemaError extends Error {
    readonly version: number;
    constructor(version: number, message?: string);
}
/** 恰好是当前版本 */
export declare function isCurrent(v: number): boolean;
/** 版本在支持范围内（含需要迁移的旧版本） */
export declare function isSupported(v: number): boolean;
/** 旧版本：低于当前但仍在支持范围内 → 需要沿迁移链升级 */
export declare function needsMigration(v: number): boolean;
/** 过新版本：高于当前 → 必须升级本插件才能导入 */
export declare function isTooNew(v: number): boolean;
/** 是否可导入（当前版本或可迁移的旧版本） */
export declare function canImport(v: number): boolean;
/** 版本的可读描述（报告/日志用） */
export declare function describeVersion(v: number): string;
