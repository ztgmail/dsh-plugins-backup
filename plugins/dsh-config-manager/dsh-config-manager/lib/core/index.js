/**
 * 核心引擎公共出口：m5（适配器）、m6（UI）、m7（测试）与宿主插件统一从这里引用。
 */
export { Exporter, defaultSecretScanner, EXPORTER_INFO, } from "./exporter.js";
export { Importer, } from "./importer.js";
export { Analyzer, } from "./analyzer.js";
export { createSnapshot, FileSnapshotStore, resolveFileTarget, verifySnapshot, } from "./backup.js";
export { rollback } from "./rollback.js";
export { planRestore, restore, listSnapshots, } from "./restore.js";
export { computeCompatibility, describeCompatibility, describeSchemaStatus, validateSections, } from "./validator.js";
export { ImportNotConfirmedError, ImportFailedError, } from "./types.js";
/* —— 迁移历史引擎（Phase 6） —— */
export { MigrationStore, sanitizeEntry, queryHistory, summarizeHistory, renderExport, parseHistoryQuery, isValidMigrationKind, redactHistoryText, makeHistoryFilename, isHistoryBasename, MIGRATION_HISTORY_DIR, DEFAULT_MIGRATION_RETENTION, MIGRATION_HISTORY_SCHEMA_VERSION, } from "./migration-history.js";
//# sourceMappingURL=index.js.map