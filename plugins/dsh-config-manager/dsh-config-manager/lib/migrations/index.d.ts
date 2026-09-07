export interface MigrationStep {
    from: number;
    to: number;
    /** 纯函数式转换：输入旧结构 → 输出新结构（不触碰目标 DSH） */
    migrate(doc: unknown): unknown;
}
export interface MigrationResult {
    doc: unknown;
    migratedFrom: number;
    applied: {
        from: number;
        to: number;
    }[];
}
/**
 * 迁移注册表：按 from 升序的链式步骤。
 * 当前只有 v1→v2 占位（CURRENT=1 时不会触发，schema v2 发布后生效）。
 */
export declare const MIGRATIONS: MigrationStep[];
/** 注册新迁移步骤（供未来版本追加；保持链式无环：from 严格递增） */
export declare function registerMigration(step: MigrationStep): void;
/**
 * 沿迁移链把文档升级到目标版本（缺省当前版本）。
 * - 已是目标版本 → 原样返回；
 * - 高于目标 → UnsupportedSchemaError（需升级插件）；
 * - 低于最低支持 → UnsupportedSchemaError；
 * - 无可用迁移路径 → 抛错。
 */
export declare function migrateToCurrent(doc: unknown, fromVersion: number, targetVersion?: number): MigrationResult;
