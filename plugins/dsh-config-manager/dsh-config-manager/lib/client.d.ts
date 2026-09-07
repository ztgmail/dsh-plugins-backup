window.__ModuleLoader__.load({
	id: "dsh-config-manager",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;

import { ClientContext } from "@deepseek-ai/dsh-client-runtime/client";
import { PropsRuntime, TranslateNS } from "@deepseek-ai/dsh-client-ui-slots";
//#region src/schema/types.d.ts
/**
 * 核心领域类型（Export Schema v1 的纯类型定义）。
 *
 * 对齐 Docs/design/architecture.md §13.1 —— m3/m5 的共同契约。
 * 本文件只含与 DSH 运行时无关的纯数据形状；DSH Service 门面类型见 src/core/types.ts。
 */
/** 运行平台（等价 NodeJS.Platform，但保持类型自包含，可在浏览器侧引用） */
type Platform = 'win32' | 'darwin' | 'linux' | 'freebsd' | 'openbsd' | 'aix' | 'sunos' | 'android' | 'cygwin' | 'haiku' | 'netbsd' | 'other';
/**
 * 分区标识，与 ZIP 目录结构、manifest.sections 键一一对应。
 * 明确不实现的分区（keybindings/workflows/commands）不在此列；
 * rules 已由 agentInstructions（~/.dsh/AGENTS.md，dsh-agent-instructions 全局指令）承接。
 */
type SectionId = 'settings' | 'ui' | 'providers' | 'plugins' | 'mcp' | 'prompts' | 'skills' | 'agentPresets' | 'agentInstructions' | 'workspaces' | 'pluginFiles' | 'credentialsStatus' | 'secrets' | 'sessions' | 'self';
/** 加密备份的算法参数（非秘密：salt/iv/authTag 仅用于解密与完整性校验） */
interface EncryptionInfo {
  algorithm: 'aes-256-gcm';
  kdf: 'scrypt';
  kdfParams: {
    N: number;
    r: number;
    p: number;
    keyLength: number;
  };
  salt: string;
  iv: string;
  authTag: string;
  version: number;
}
/** 每个导出 ZIP 根部的 manifest.json */
interface Manifest {
  schemaVersion: number;
  exporter: {
    name: string;
    version: string;
  };
  source: {
    dshVersion: string;
    platform: Platform;
    arch: string;
  };
  exportedAt: string;
  sections: Record<SectionId, boolean>;
  security: {
    containsSecrets: boolean;
    encrypted: boolean;
    encryption: EncryptionInfo | null;
  };
}
//#endregion
//#region src/schema/tombstones.d.ts
/**
 * 删除墓碑（tombstone）机制（F4）：记录用户明确删除的条目，
 * 导入/恢复时据此过滤，防止「旧备份复活已删条目」。
 *
 * 设计（借鉴 uagent-sync workspace-state-codec）：墓碑按 kind+id 去重，
 * 过滤时把恢复数据里的条目映射为 {kind, id} 键，命中墓碑的条目剔除。
 *
 * 持久化：<dataDir>/tombstones.json（self 分区数据目录 $DSH_HOME/dsh-config-manager/ 下）。
 * 本模块零依赖（不 import node 模块 / 核心层类型），fs 由调用方注入，
 * 纯逻辑可独立测试；dataDir 与文件名形态由调用方保持一致。
 *
 * 安全语义：墓碑文件缺失/损坏一律安全降级为空列表（尽力而为的过滤，
 * 绝不因墓碑文件问题阻塞导入主流程）。
 */
/** 墓碑条目类型：插件 / 技能（skills 分区文件）/ 整个分区 / 其他文件（agentPresets 等文件类分区） */
type TombstoneKind = 'plugin' | 'skill' | 'section' | 'file';
//#endregion
//#region src/core/types.d.ts
interface ExportOptions {
  /** 是否包含真实秘密（必须配合 encryption 提供者；缺省 false = 只导状态） */
  includeSecrets: boolean;
  /** 仅导出指定分区（缺省 = 全部默认包含分区） */
  only?: SectionId[];
  /** 导出文件路径（缺省自动生成 dsh-config-<date>.zip） */
  outPath?: string;
  /** 导出备注（P0-④：host 写入 exports/.backup-notes.json，随 self 分区迁移；非敏感） */
  note?: string;
}
type PlanItemKind = 'Create' | 'Update' | 'Skip' | 'Conflict' | 'Install' | 'MissingSecret' | 'MissingDependency' | 'PathMapping' | 'Warning' | 'Error';
type ItemResolution = 'keepCurrent' | 'useImported' | 'review';
type GlobalConflictStrategy = 'merge' | 'replace' | 'skipExisting';
interface ConflictDecision {
  itemId: string;
  resolution: ItemResolution;
}
interface PathMapping {
  oldPrefix: string;
  newPrefix: string;
  appliesTo: ('workspaces' | 'mcp' | 'pluginConfig' | 'skills')[];
}
interface PathIssue {
  kind: 'missing' | 'platformMismatch' | 'homeMismatch';
  value: string;
  mappedTo?: string;
}
interface SnapshotTarget {
  adapter: SectionId;
  ref: string;
}
interface PlanItem {
  id: string;
  kind: PlanItemKind;
  adapter: SectionId;
  description: string;
  detail?: string;
  severity: 'info' | 'warning' | 'error';
  conflict?: ConflictDecision;
  pathMapping?: PathMapping;
  missingDependency?: string;
  target?: SnapshotTarget;
}
interface ImportAnalysis {
  valid: boolean;
  errors: string[];
  warnings: string[];
  compatibility: 'excellent' | 'good' | 'partial' | 'unsupported';
  sectionsInZip: SectionId[];
  pluginSummary: {
    installed: number;
    toInstall: number;
  };
  pathIssues: PathIssue[];
  secretCount: number;
  dependencyIssues: {
    item: string;
    dependency: string;
  }[];
  /** 备份是否加密（manifest.security.encrypted）：加密备份的凭据必须用解密密码恢复 */
  encrypted: boolean;
}
interface ImportDecisions {
  strategy: GlobalConflictStrategy;
  resolutions: Record<string, ItemResolution>;
  pathMappings: PathMapping[];
}
interface ImportPlan {
  items: PlanItem[];
  globalStrategy: GlobalConflictStrategy;
  pathMappings: PathMapping[];
  missingSecrets: {
    ref: string;
    required: boolean;
  }[];
  needsRestart: boolean;
  estimatedActions: Record<SectionId, number>;
  /** F4：被删除墓碑（tombstone）过滤掉的计划项（缺省/空数组 = 无过滤；UI 据此提示用户） */
  skippedTombstoned?: SkippedTombstone[];
}
/** F4：被墓碑过滤的计划项记录（条目级：kind+id；分区级：kind='section'，id=分区 id） */
interface SkippedTombstone {
  kind: TombstoneKind;
  id: string;
  adapter: SectionId;
}
interface ExecutedItem {
  itemId: string;
  /** warning = 未应用但非致命（目标不可达等），不计入失败、不触发回滚 */
  status: 'ok' | 'skipped' | 'warning' | 'failed';
  message?: string;
  /** 用户主动跳过（导入中点击「跳过当前插件」）：status 为 skipped 且此标记为 true。
   * 结果页据此区分「用户跳过」与「引擎跳过」，并提供重试入口。 */
  skippedByUser?: boolean;
}
interface ImportResult {
  ok: boolean;
  executed: ExecutedItem[];
  needsRestart: boolean;
  missingSecrets: string[];
  warnings: string[];
  rollback: RollbackReport | null;
  snapshotId: string | null;
  /** F4：本次导入被删除墓碑过滤掉的条目（缺省/空 = 无过滤；UI 据此提示用户） */
  skippedTombstoned?: SkippedTombstone[];
}
/** 快照生命周期状态（M1 增强；旧快照无此字段，视为未知/兼容） */
type SnapshotStatus = 'pending' | 'done' | 'rolled-back';
interface RollbackReport {
  full: boolean;
  restored: string[];
  failed: {
    item: string;
    reason: string;
    manualHint?: string;
  }[];
}
interface ExportReport {
  included: {
    section: SectionId;
    counts: Record<string, number>;
  }[];
  excluded: SectionId[];
  security: {
    secretsExcluded: boolean;
    containsSecrets: boolean;
    encrypted: boolean;
    redactedHits: number;
    /** 本次导出镜像到本机 vault 的敏感文件数（文件级 vault；0 或缺失 = 未镜像） */
    vaultRefreshed?: number;
  };
  file: {
    name: string;
    sizeBytes: number;
  };
  warnings: string[];
}
//#endregion
//#region src/core/restore.d.ts
type RestoreActionKind = 'hostFileRestore' | 'hostFileRemove' | 'pluginRemove' | 'fileRestore' | 'fileRemove' | 'credentialHint' | 'skip';
interface RestoreAction {
  kind: RestoreActionKind;
  /** 人类可读描述 */
  description: string;
  /** 目标：相对 $DSH_HOME 的 relPath（hostFile/file 类）或插件名（pluginRemove） */
  target?: string;
  /** hostFileRestore/fileRestore：快照内 blob 相对路径（相对 snapshotDir） */
  blobPath?: string;
  /** pluginRemove：插件包名 */
  pluginName?: string;
  /** credentialHint：人工提示文本 */
  manualHint?: string;
  /** 附加说明（旧快照缺基线 / 离线无法恢复等） */
  detail?: string;
  /** 该动作是否对应 settings 主文件（settingsPath 解析出的文件） */
  isSettings?: boolean;
}
interface RestorePlan {
  snapshotId: string;
  createdAt: string;
  sourceZip: string;
  actions: RestoreAction[];
  summary: {
    hostFileRestores: number;
    hostFileRemoves: number;
    pluginRemoves: number;
    fileRestores: number;
    fileRemoves: number;
    credentialHints: number;
    skips: number;
  };
  /** beforePlugins 基线是否可用（undefined=旧快照无基线 → 不计划任何插件卸载） */
  pluginBaselineConfirmed: boolean;
}
interface RestoreReport {
  snapshotId: string;
  /** 已还原/已删除的目标（相对 $DSH_HOME） */
  restored: string[];
  /** 已卸载的插件名 */
  removedPlugins: string[];
  /** 需人工处理的提示（凭据补录等） */
  manualHints: string[];
  /** 失败清单 */
  failed: {
    item: string;
    reason: string;
  }[];
  /** 跳过项（无动作 / 离线无法处理） */
  skipped: string[];
  /**
   * 幽灵会话（F5 失效归档清理）：快照记录的 sessions 分区会话在磁盘 sessions 目录
   * 已无任何文件（备份有记录、磁盘无文件）。DSH 官方无归档会话 API，降级本地校验，
   * 仅供报告、需人工在 DSH 确认清理；无会话分区/无幽灵时为缺省或空数组。
   */
  ghostSessions?: string[];
}
interface SnapshotMeta {
  id: string;
  createdAt: string;
  sourceZip: string;
  status?: SnapshotStatus;
  entryCount: number;
  hostFileBackupCount: number;
  beforePluginCount: number;
  /** 置顶标记（P1-⑧）：置顶快照不参与自动保留清理（最多保留 N 个时的淘汰豁免） */
  pinned?: boolean;
}
//#endregion
//#region src/profiles/profile-manager.d.ts
interface ProfileMeta {
  name: string;
  createdAt: string;
  updatedAt: string;
  sections: SectionId[];
  fileCount: number;
}
interface SwitchPreview {
  items: PlanItem[];
  missingSecrets: {
    ref: string;
    required: boolean;
  }[];
  needsRestart: boolean;
  sectionsInProfile: SectionId[];
}
interface ProfileSwitchResult {
  ok: boolean;
  executed: ExecutedItem[];
  needsRestart: boolean;
  missingSecrets: string[];
  warnings: string[];
  rollback: RollbackReport | null;
  snapshotId: string | null;
}
//#endregion
//#region src/core/run-registry.d.ts
/** run 类型：导出 / 导入 / 自动同步 / 一键同步逐项应用 / 定时备份 / 快照恢复 / 配置档案切换 / recovery 恢复。 */
type RunKind = 'export' | 'import' | 'autosync' | 'sync-apply' | 'backup-schedule' | 'restore' | 'profile-switch' | 'recovery';
/** run 状态：进行中 / 完成 / 失败。 */
type RunStatus = 'running' | 'done' | 'failed';
/** 单个 run 的实时状态（/progress 返回体；纯 JSON 可序列化）。 */
interface RunState {
  /** 不可猜测的 run id（32 hex 字符）。 */
  runId: string;
  kind: RunKind;
  status: RunStatus;
  /** 当前分区（adapter id 或导入阶段名）；无则 null。 */
  section: string | null;
  /** 分区总数（导出 = 选中分区数；导入无此语义 = null）。 */
  sectionTotal: number | null;
  /** 已完成的内部计数（导出 = 当前分区序号；导入 = 已处理计划项数）。 */
  item: number | null;
  /** 内部计数总数（导出 = 分区总数；导入 = 计划项总数）。 */
  itemTotal: number | null;
  /** 非敏感进度摘要（当前分区 / 当前计划项 id）。 */
  detail: string | null;
  /** 执行日志行（导入为逐计划项操作 + 子进程命令；append-only，封顶 MAX_RUN_LOG_LINES）。
   * 只存非敏感文本（命令/操作摘要），绝不写入密钥、密码、秘密补录值。 */
  log: string[];
  /** 完成时的业务结果（仅 JSON 可序列化、不含秘密值）。 */
  result?: unknown;
  /** 失败时的错误消息（非敏感）。 */
  error?: string;
  createdAt: number;
  updatedAt: number;
}
//#endregion
//#region src/core/migration-consult.d.ts
type ConsultSourceType = 'export-zip' | 'local-snapshot' | 'remote-snapshot' | 'profile';
type HealthVerdict = 'healthy' | 'needs-attention' | 'critical';
type Recommendation = 'proceed' | 'review' | 'block';
type ConsultDimensionId = 'compatibility' | 'integrity' | 'sections' | 'consistency' | 'sensitive' | 'migratability';
interface ConsultSourceRef {
  type: ConsultSourceType;
  /** 源标识：ZIP 路径 / snapshotId / 远端快照 id / profile 名 */
  id: string;
  /** 关联 snapshotId（local-snapshot / remote-snapshot） */
  snapshotId?: string;
}
interface ConsultIssue {
  severity: 'info' | 'warning' | 'error';
  /** 稳定问题码（i18n 键后缀；如 'integrity.manifestInvalid'） */
  code: string;
  /** 已 redact 的可读消息（宿主/UI 层负责脱敏） */
  message: string;
  /** 已 redact 的证据（可选） */
  evidence?: string;
}
interface HealthDimension {
  id: ConsultDimensionId;
  /** 0-100 */
  score: number;
  verdict: HealthVerdict;
  issues: ConsultIssue[];
}
interface ConsultWillApply {
  sections: SectionId[];
  itemCount: number;
  conflicts: number;
  risks: number;
  overwritten: number;
  /** 咨询恒为 dry-run（只读分析） */
  dryRun: boolean;
}
interface ConsultReport {
  source: ConsultSourceRef;
  /** 0-100 */
  healthScore: number;
  verdict: HealthVerdict;
  recommendation: Recommendation;
  /** 触发项（已 redact） */
  recommendationReasons: string[];
  dimensions: HealthDimension[];
  willApply: ConsultWillApply;
  bound: {
    manifest?: Manifest;
    snapshotId?: string;
    sourceId: string;
  };
  generatedAt: string;
}
//#endregion
//#region src/sync/backup-schedule-config.d.ts
/** 定时备份间隔档位（全量备份无需太频繁；默认 24h）。
 *  - '6h' | '12h' | '24h' | '7d'：固定间隔；
 *  - 'custom'：每周固定时刻（见 customSchedule）。 */
type BackupInterval = '6h' | '12h' | '24h' | '7d' | 'custom';
/**
 * 自定义（每周固定时刻）档配置：
 * - dayOfWeek：0-6（0 = 周日，1 = 周一 … 6 = 周六）；
 * - hour：0-23；
 * - minute：0-59。
 * 语义 = 每周该时刻触发一次全量备份（错过的时间点不补跑——下次排期自然对齐）。
 */
interface BackupWeeklySchedule {
  dayOfWeek: number;
  hour: number;
  minute: number;
}
/** 最近一次定时备份执行状态 */
type BackupRunStatus = 'success' | 'skipped' | 'failed';
//#endregion
//#region src/sync/backup-scheduler.d.ts
interface BackupRunResult {
  status: BackupRunStatus;
  zip?: string;
  sizeBytes?: number;
  sections?: string[];
  skipReason?: string;
  error?: string;
  consecutiveFailures: number;
}
//#endregion
//#region src/ui/backup-schedule.d.ts
/** 设置草稿（表单编辑态：总开关 + 间隔档位 + 自定义周档）。 */
interface BackupScheduleDraft {
  enabled: boolean;
  interval: BackupInterval;
  /** custom 档的每周固定时刻（仅 interval='custom' 时校验；其他档位忽略） */
  customSchedule?: BackupWeeklySchedule;
}
/** 定时备份配置的浏览器侧视图（与 sync/backup-schedule-config.ts 的持久化面一致；无敏感字段）。 */
interface BackupScheduleStatus {
  enabled: boolean;
  interval: BackupInterval;
  customSchedule?: BackupWeeklySchedule;
  startupMinIntervalMs: number;
  consecutiveFailures: number;
  lastRunAt?: string;
  lastRunStatus?: BackupRunStatus;
  lastRunMessage?: string;
}
//#endregion
//#region src/sync/backup-files.d.ts
/** 备份文件来源（UI Badge 展示） */
type BackupFileSource = 'auto' | 'manual';
/** 备份文件元信息（列表行数据；无敏感字段） */
interface BackupFileMeta {
  /** 文件名（如 dsh-config-auto-20260824-120000-abc.zip） */
  name: string;
  /** 绝对路径（供 /download 与导入向导引用） */
  path: string;
  /** 字节数 */
  sizeBytes: number;
  /** 修改时间（ms 时间戳；按此倒序展示/清理） */
  mtimeMs: number;
  /** 来源：auto = 定时备份；manual = 手动导出 */
  source: BackupFileSource;
  /** 用户备注（手动导出时可选填写；null = 无备注） */
  note?: string | null;
}
//#endregion
//#region src/ui/i18n.d.ts
/**
 * 客户端展示层（src/ui/*、src/client/common/*）的渲染文案目录（zh 源语言 / en 镜像）。
 *
 * 与 core 的 messages.ts 分工：本目录负责「客户端纯渲染层」（ReportView / ErrorBanner /
 * ProgressBar / sync-view）产生的中文文案；core 侧引擎消息已随 API 数据源翻译。
 * 这些纯函数原先直接内嵌中文，现经 UiDict 注入：Client 挂载时按 ctx.locale 提供。
 *
 * 纪律：
 *  - TextKey 类型 = keyof typeof uiZh，en 缺键/多键即编译错误；
 *  - {param} 插值，缺参原样保留。
 */
declare const uiZh: {
  readonly commonClose: "关闭";
  readonly commonCancel: "取消";
  readonly commonRetry: "重试";
  readonly commonLoading: "加载中…";
  readonly commonUnknownError: "未知错误";
  readonly commonNext: "下一步";
  readonly commonBack: "上一步";
  readonly commonDone: "完成";
  readonly 'export.download': "下载备份文件";
  readonly 'export.running': "正在导出…";
  readonly 'export.run': "开始导出";
  readonly 'export.selectionWarnings': "以下分区为设备相关数据，跨设备导入时可能不适用：";
  readonly 'export.included': "已包含";
  readonly 'export.excluded': "未包含";
  readonly 'export.unknownSection': "未知分区：{id}";
  readonly 'export.deviceSpecific': "{label} 为设备相关数据（{portability}），跨设备导入时可能不适用";
  readonly 'report.backupCreated': "备份已创建";
  readonly 'report.importComplete': "导入完成";
  readonly 'report.importFailed': "导入失败";
  readonly 'report.tombstonedSkipped': "已按删除记录跳过 {count} 项";
  readonly 'report.included': "已包含：";
  readonly 'report.excluded': "未包含：";
  readonly 'report.security': "安全：";
  readonly 'report.apiKeysExcluded': "API 密钥已排除：";
  readonly 'report.containsSecrets': "包含密钥：";
  readonly 'report.encrypted': "已加密：";
  readonly 'report.redacted': "{count} 个敏感字段已脱敏";
  readonly 'report.file': "文件：";
  readonly 'report.yes': "是";
  readonly 'report.yesEncrypted': "是（加密）";
  readonly 'report.no': "否";
  readonly 'report.importedRestored': "已导入/恢复";
  readonly 'report.skipped': "跳过";
  readonly 'report.needAttention': "需注意";
  readonly 'report.failed': "失败";
  readonly 'report.noChanges': "无变更";
  readonly 'report.reason': "原因";
  readonly 'report.note': "说明";
  readonly 'report.unknownReason': "未知原因";
  readonly 'report.secrets': "密钥：";
  readonly 'report.credentialsNeedEntry': "{count} 个凭据需要补录";
  readonly 'report.restartRequired': "重启 DSH 后生效：{detail}";
  readonly 'report.restartPluginsMcp': "插件/MCP 更改将在重启 DSH 后生效";
  readonly 'report.rollbackFull': "回滚：已完整恢复导入前的配置。";
  readonly 'report.rollbackPartial': "回滚部分完成。";
  readonly 'report.rollbackManual': "以下项目可能需要人工恢复：";
  readonly 'report.restored': "已恢复：{count} 项";
  readonly 'error.notMounted': "config-manager 服务未挂载（插件未加载）：请确认 profile 中已安装 dsh-config-manager 并重启 DSH";
  readonly 'error.httpInvalidJson': "HTTP {status}: 无效的 JSON 响应";
  readonly 'error.fallback': "操作失败";
  readonly 'error.downloadFailed': "下载失败：HTTP {status}";
  readonly 'error.exportTimeout': "导出超时（{minutes} 分钟）：导出过程未完成，请重试；若反复超时请检查 DSH 状态";
  readonly 'error.syncTimeout': "同步请求超时（{minutes} 分钟）：请检查网络与仓库可达性后重试";
  readonly 'error.recoveryTimeout': "恢复请求超时（{minutes} 分钟）：恢复过程未完成，请重试；若反复超时请检查 DSH 状态";
  readonly 'error.settingsConflict.title': "配置已被并发修改";
  readonly 'error.settingsConflict.action': "目标 DSH 的该配置在导入期间被其他进程修改，为避免覆盖请重新导出或手动核对后再试。";
  readonly 'error.notConfirmed.title': "导入未确认";
  readonly 'error.notConfirmed.action': "请在预览页确认导入内容后重试。";
  readonly 'error.integrity.title': "备份完整性校验失败";
  readonly 'error.integrity.action': "备份文件可能已损坏或被篡改，请重新导出备份后再试。";
  readonly 'error.schema.title': "备份格式版本不受支持";
  readonly 'error.schema.action': "请升级 DSH Config Manager 或使用相同版本的备份文件。";
  readonly 'error.notFound.title': "文件或路径不存在";
  readonly 'error.notFound.action': "请检查文件路径是否正确、文件是否已被移动或删除。";
  readonly 'error.permission.title': "权限不足";
  readonly 'error.permission.action': "请检查目标目录的读写权限后重试。";
  readonly 'error.needsRestart.title': "插件安装需要重启生效";
  readonly 'error.needsRestart.action': "导入已完成，插件将在重启 DSH 后生效；请在 DSH Desktop 中重启服务。";
  readonly 'error.reason': "原因";
  readonly 'error.suggestedAction': "建议操作";
  readonly 'error.item': "相关项";
  readonly 'progress.analyzing': "正在分析配置…";
  readonly 'progress.exportingSettings': "正在导出设置…";
  readonly 'progress.scanningSecrets': "正在扫描密钥…";
  readonly 'progress.exportingPlugins': "正在导出插件…";
  readonly 'progress.creatingArchive': "正在创建归档…";
  readonly 'progress.calculatingChecksums': "正在核对文件完整性…";
  readonly 'progress.exporting': "正在导出配置…";
  readonly 'progress.validating': "正在校验备份…";
  readonly 'progress.checkingCompatibility': "正在检查兼容性…";
  readonly 'progress.creatingSnapshot': "正在创建安全快照…";
  readonly 'progress.restoringSettings': "正在恢复设置…";
  readonly 'progress.restoringPlugins': "正在恢复插件…";
  readonly 'progress.restoringMcp': "正在恢复 MCP…";
  readonly 'progress.validatingConfig': "正在校验配置…";
  readonly 'progress.rollingBack': "正在回滚…";
  readonly 'progress.executing': "正在应用配置（插件安装可能需要较长时间）…";
  readonly 'progress.done': "完成";
  readonly 'snapshots.createdAt': "创建时间";
  readonly 'snapshots.sourceZip': "来源";
  readonly 'snapshots.status': "状态";
  readonly 'snapshots.entries': "条目";
  readonly 'snapshots.plugins': "插件";
  readonly 'snapshots.statusPending': "待处理";
  readonly 'snapshots.statusDone': "已完成";
  readonly 'snapshots.statusRolledback': "已回滚";
  readonly 'snapshots.statusUnknown': "未知";
  readonly 'snapshots.planTitle': "恢复计划预览";
  readonly 'snapshots.confirmRestore': "确认恢复？会先把当前文件备份到一个安全位置，再删除导入期间新增的插件。";
  readonly 'snapshots.execute': "执行恢复";
  readonly 'snapshots.executing': "正在恢复…";
  readonly 'snapshots.restored': "已恢复";
  readonly 'snapshots.removedPlugins': "已卸载插件";
  readonly 'snapshots.manualHints': "需人工处理";
  readonly 'snapshots.failed': "失败";
  readonly 'snapshots.skipped': "跳过";
  readonly 'snapshots.noActions': "该快照无可恢复动作（或全部跳过）。";
  readonly 'snapshots.empty': "暂无快照。导入时会自动创建安全快照。";
  readonly 'snapshots.loading': "正在加载快照…";
  readonly 'snapshots.selectHint': "选择一个快照预览其恢复计划（只读预览，不会改动任何设置）：";
  readonly 'snapshots.reportTitle': "恢复报告";
  readonly 'sync.privateRepoHint': "安全要求：同步仓库必须为私有仓库（public 仓库会公开你的配置内容）。认证 token 仅用于仓库访问，绝不写入同步文件、提交内容或日志。";
  readonly 'sync.kind.create': "新增";
  readonly 'sync.kind.update': "更新";
  readonly 'sync.kind.skip': "跳过";
  readonly 'sync.kind.conflict': "冲突";
  readonly 'sync.kind.install': "安装";
  readonly 'sync.kind.missingSecret': "缺密钥";
  readonly 'sync.kind.missingDependency': "缺依赖";
  readonly 'sync.kind.pathMapping': "路径映射";
  readonly 'sync.kind.warning': "警告";
  readonly 'sync.kind.error': "错误";
  readonly 'sync.severity.error': "错误";
  readonly 'sync.severity.warning': "警告";
  readonly 'sync.severity.info': "信息";
  readonly 'sync.pushLabel': "推送到远端";
  readonly 'sync.pullLabel': "拉取差异预览";
  readonly 'sync.pushing': "正在推送…";
  readonly 'sync.pulling': "正在拉取…";
  readonly 'sync.statusLoading': "正在读取同步状态…";
  readonly 'sync.statusUnconfigured': "尚未配置同步仓库（请填写仓库地址并推送一次以保存配置）";
  readonly 'sync.credConfigured': "凭据已配置";
  readonly 'sync.credMissing': "未配置凭据（token 将在首次推送/拉取时写入 DSH credentials）";
  readonly 'sync.lastSync': "上次同步：{time}";
  readonly 'sync.neverSynced': "尚未同步过";
  readonly 'sync.neverSyncedShort': "从未同步";
  readonly 'sync.pushFailed': "推送失败";
  readonly 'sync.pushOk': "推送成功（快照 {id}）";
  readonly 'sync.pushPreviewHeadline': "将推送 {total} 个分区（{changed} 个有变化）";
  readonly 'sync.pushPreviewHint': "以上为只读预览，不会写入远端。确认后点击「推送」才真正上传。";
  readonly 'sync.pushPreviewEncrypted': "加密快照：载荷将整体加密，各分区相对基线的变化不可比对。";
  readonly 'sync.pullFailed': "拉取失败";
  readonly 'sync.pullOk': "远端快照 {id} 差异预览：共 {count} 项变更";
  readonly 'sync.pullEmpty': "远端快照与本地一致（无变更）";
  readonly 'sync.previewHint': "以上为只读差异预览，不会执行导入。当前版本暂不支持一键导入；如需应用远端配置，请使用「导入恢复」向导手动导入导出的备份。";
  readonly 'sync.syncTitle': "一键同步";
  readonly 'sync.syncButton': "一键同步";
  readonly 'sync.syncing': "正在同步…";
  readonly 'sync.syncHeadline': "远端快照 {id} 差异确认：共 {count} 项";
  readonly 'sync.syncEmpty': "远端快照与本地一致（无变更）";
  readonly 'sync.syncFailed': "同步失败";
  readonly 'sync.confirmAdopt': "采用远端";
  readonly 'sync.confirmSkip': "跳过";
  readonly 'sync.confirmRequired': "需要人工决策";
  readonly 'sync.needsReviewBadge': "需人工决策";
  readonly 'sync.selectSnapshot': "选择历史快照";
  readonly 'sync.latestSnapshot': "最新快照";
  readonly 'sync.noSnapshots': "远端暂无快照";
  readonly 'sync.confirmImport': "确认导入";
  readonly 'sync.cancelConfirm': "取消";
  readonly 'sync.conflictResolve': "冲突解决";
  readonly 'sync.conflictUseLocal': "用本地";
  readonly 'sync.conflictUseRemote': "用远端";
  readonly 'sync.conflictSkip': "跳过";
  readonly 'sync.conflictResolvedLocal': "已选：本地";
  readonly 'sync.conflictResolvedRemote': "已选：远端";
  readonly 'sync.conflictResolvedSkip': "已选：跳过";
  readonly 'sync.importDone': "已导入 {n} 个分区";
  readonly 'sync.importSkipped': "已跳过 {n} 项";
  readonly 'sync.importFailed': "导入失败（已整体回滚）";
  readonly 'sync.rollbackButton': "回滚到应用前";
  readonly 'sync.rollingBack': "正在回滚…";
  readonly 'sync.rollbackDone': "已回滚到应用前";
  readonly 'sync.appliedSections': "已写入";
  readonly 'sync.importWarnings': "导入告警";
  readonly 'sync.autosyncTitle': "自动同步";
  readonly 'sync.autosyncDesc': "开启后，DSH 将按固定间隔自动执行双向同步（拉取合并 + 上传）；DSH 启动时还会触发一次「自动下载合并（不上传）」以保持本地为最新。仅在无冲突且无需人工干预时才自动写入。";
  readonly 'sync.autosyncEnabled': "启用自动同步";
  readonly 'sync.autosyncInterval': "同步间隔";
  readonly 'sync.autosyncIntervalHint': "DSH 启动时自动下载合并不上传。";
  readonly 'sync.autosyncNever': "从未运行";
  readonly 'sync.autosyncLastRun': "上次运行：{time}";
  readonly 'sync.autosyncNextIn': "下次约 {time} 后";
  readonly 'sync.autosyncSuccess': "成功";
  readonly 'sync.autosyncSkipped': "已跳过";
  readonly 'sync.autosyncFailed': "失败";
  readonly 'sync.autosyncPartial': "部分成功";
  readonly 'sync.autosyncFailCount': "连续失败 {n} 次";
  readonly 'sync.autosyncSyncing': "自动同步进行中…";
  readonly 'sync.interval.5m': "5 分钟";
  readonly 'sync.interval.15m': "15 分钟";
  readonly 'sync.interval.30m': "30 分钟";
  readonly 'sync.interval.60m': "60 分钟";
  readonly 'sync.interval.6h': "6 小时";
  readonly 'sync.interval.12h': "12 小时";
  readonly 'sync.interval.24h': "24 小时";
  readonly 'sync.duration.min': "{n} 分钟";
  readonly 'sync.duration.hour': "{n} 小时";
  readonly 'sync.duration.day': "{n} 天";
  readonly 'sync.hist.autosync': "自动同步";
  readonly 'sync.hist.directionPull': "下载";
  readonly 'sync.hist.directionPush': "上传";
  readonly 'sync.hist.directionBoth': "双向";
  readonly 'sync.hist.skipReasonConflict': "冲突项被跳过";
  readonly 'sync.hist.skipReasonNoRemote': "远端无快照";
  readonly 'sync.hist.skipReasonNotConfigured': "未配置仓库";
  readonly 'sync.hist.skipReasonNetwork': "网络问题";
  readonly 'sync.hist.conflictedSections': "跳过冲突分区：{sections}";
  readonly 'sync.hist.appliedSections': "应用分区：{sections}";
  readonly 'sync.hist.failedError': "错误：{error}";
  readonly 'sync.hist.notifiedAt': "已通知";
  readonly 'sync.github.starting': "正在发起 GitHub 授权…";
  readonly 'sync.github.waitingNoCode': "请在浏览器中打开授权页面并完成授权…";
  readonly 'sync.github.waiting': "请在浏览器中打开授权页面，输入一次性代码 {code} 完成授权（自动等待确认）。";
  readonly 'sync.github.polling': "正在确认 GitHub 授权状态…";
  readonly 'sync.github.success': "GitHub 登录成功：token 已安全写入 DSH credentials，可直接推送/拉取。";
  readonly 'sync.github.failed': "GitHub 登录失败";
  readonly 'sync.github.defaultStatus': "通过 GitHub OAuth 设备码流程登录，token 自动写入 DSH credentials（无需手动输入）。";
  readonly 'sync.github.login': "使用 GitHub 登录";
  readonly 'sync.github.relogin': "重新登录";
  readonly 'sync.github.pollSuccess': "GitHub 登录成功：token 已安全写入 DSH credentials。";
  readonly 'sync.github.pollDenied': "GitHub 授权被拒绝（access_denied）。可重新发起登录，或改用下方手动 token 输入。";
  readonly 'sync.github.pollExpired': "GitHub 授权已过期（expired_token）。请重新发起登录。";
  readonly 'sync.github.pollError': "GitHub OAuth 错误：{detail}";
  readonly 'sync.github.unknownError': "未知错误";
  readonly 'market.statusLoading': "正在读取市场状态…";
  readonly 'market.statusUnconfigured': "尚未添加市场（请输入公开 Git 仓库地址）";
  readonly 'market.statusConfigured': "已添加 {count} 个市场";
  readonly 'market.supplyUnofficial': "来自公共网络、非官方审核";
  readonly 'market.supplySource': "来源仓库：{url}";
  readonly 'market.supplyDownloadedAt': "下载时间：{time}";
  readonly 'market.supplyAuthor': "作者：{author}";
  readonly 'market.supplyProvenanceSource': "作者声明来源：{source}";
  readonly 'market.supplyProvenanceNote': "作者自述：{note}";
  readonly 'market.detail.sections': "包含分区：{sections}";
  readonly 'market.detail.sectionsEmpty': "未声明分区";
  readonly 'market.detail.statusValid': "校验通过";
  readonly 'market.detail.statusInvalid': "校验未通过";
  readonly 'myConfigs.autoField': "系统自动";
  readonly 'myConfigs.field.id': "条目 ID";
  readonly 'myConfigs.field.author': "作者";
  readonly 'myConfigs.field.version': "版本";
  readonly 'myConfigs.field.updatedAt': "更新时间";
  readonly 'myConfigs.status.notListed': "未收录";
  readonly 'myConfigs.status.pendingPr': "PR 待审核";
  readonly 'myConfigs.status.listed': "已收录";
  readonly 'myConfigs.form.errorName': "名称不能为空";
  readonly 'consult.dim.compatibility': "版本/平台兼容性";
  readonly 'consult.dim.integrity': "结构完整性";
  readonly 'consult.dim.sections': "分区完整性";
  readonly 'consult.dim.consistency': "一致性";
  readonly 'consult.dim.sensitive': "敏感暴露";
  readonly 'consult.dim.migratability': "可迁移性";
  readonly 'consult.recommendation.proceed': "建议：可继续";
  readonly 'consult.recommendation.review': "建议：需人工确认";
  readonly 'consult.recommendation.block': "建议：阻止执行";
  readonly 'consult.title': "迁移前咨询";
  readonly 'consult.healthScore': "健康评分 {score}";
  readonly 'consult.dryRun': "只读分析";
  readonly 'consult.reasons': "建议依据";
  readonly 'consult.willApply': "将应用";
  readonly 'consult.sections': "{count} 个分区";
  readonly 'consult.items': "{count} 项";
  readonly 'consult.conflicts': "{count} 个冲突";
  readonly 'consult.risks': "{count} 个风险";
  readonly 'consult.dimensions': "评分维度";
  readonly 'consult.loading': "正在生成咨询报告…";
};
type UiTextKey = keyof typeof uiZh;
/** UI 翻译函数：key → 当前语言文案（{param} 插值；未知键回退 zh/键名）。 */
type UiT = (key: UiTextKey, params?: Record<string, string | number>) => string;
//#endregion
//#region src/client/api.d.ts
/** Host 半健康检查响应（plugin 版本 / DSH 版本 / 平台，用于主页横幅与兼容性说明） */
interface ServiceStatus {
  ready: boolean;
  pluginVersion: string;
  dshVersion: string;
  platform: string;
  arch: string;
}
/** export 端点响应（对齐 ExportFlow 的 ExportRunResult 前半部分；runId 为 m1 run 注册表标识） */
interface ExportResponse {
  zipPath: string;
  manifest: Manifest;
  report: ExportReport;
  /** m1：本次导出 run 的 id（可用 /progress 查询状态 / 刷新恢复） */
  runId: string;
}
/** upload 端点响应：Host 把用户上传的 ZIP 存入受控临时目录，返回可被 analyze/plan/execute 引用的路径 */
interface UploadResponse {
  zipPath: string;
  name: string;
  sizeBytes: number;
  /** zip=普通备份；encrypted=整体加密备份容器（需先 decryptArchive 解锁才能按 ZIP 解析） */
  containerType: 'zip' | 'encrypted';
}
/** P1-⑦/P2-⑬：备份内容查看 / 差异对比结果（只读；复用 analyze + plan 链路，零写入） */
interface BackupInspectResult {
  analysis: ImportAnalysis;
  plan: ImportPlan;
}
/** P2-⑫：导出前预览响应（不落盘 ZIP；各分区 counts + 估算大小） */
interface ExportPreviewResponse {
  ok: boolean;
  sections: {
    section: SectionId;
    count: number;
    sizeBytes: number;
  }[];
  totalSections: number;
  totalSizeBytes: number;
  sectionsFailed: number;
}
/** decrypt-archive 端点响应：解锁整体加密容器后返回明文 ZIP 路径 + 解密覆盖的凭据 ref 名（非值） */
interface DecryptArchiveResponse {
  zipPath: string;
  /** 解密覆盖的凭据 ref 名（非值）；UI 据此从补录阶段剔除已恢复项 */
  refs: string[];
}
/** restore 端点响应：dryRun=true 返回 plan；执行返回 report（与 CLI 一致的诚实报告）。
 *  runId 仅真实执行时存在（宿主 RunRegistry 登记；/runs + /progress 刷新恢复用）。 */
interface RestoreResponse {
  dryRun: boolean;
  plan?: RestorePlan;
  report?: RestoreReport;
  runId?: string;
}
/** Star 引导弹窗状态（GET /star-prompt；纯偏好，无 secret） */
interface StarPromptStatus {
  ok: boolean;
  /** 引导用户点 Star 的 GitHub 仓库地址（Host 提供，硬编码常量） */
  repoUrl: string;
  /** 首次进入页面时间（ms 时间戳）；undefined = 尚未进入过页面 */
  firstSeenAt?: number;
  /** 用户点过「不再提示」 */
  dismissed: boolean;
  /** 用户点过「去点 Star」（方案 A：引导完成） */
  clicked: boolean;
}
/** Star 引导弹窗状态的局部更新补丁（POST /star-prompt；全部可选） */
interface StarPromptPatch {
  firstSeenAt?: number;
  dismissed?: boolean;
  clicked?: boolean;
}
/** POST /star-prompt 响应（更新后的最新状态） */
interface StarPromptSaveResponse {
  ok: boolean;
  firstSeenAt?: number;
  dismissed: boolean;
  clicked: boolean;
}
/** 更新内容弹窗状态（GET /release-notes-prompt） */
interface ReleaseNotesPromptStatus {
  ok: boolean;
  lastSeenVersion?: string;
  dismissed: boolean;
  currentVersion?: string;
}
/** 更新内容弹窗状态局部更新补丁（POST /release-notes-prompt） */
interface ReleaseNotesPromptPatch {
  lastSeenVersion?: string;
  dismissed?: boolean;
}
/** POST /release-notes-prompt 响应 */
interface ReleaseNotesPromptSaveResponse {
  ok: boolean;
  lastSeenVersion?: string;
  dismissed: boolean;
}
/** 携带路由 JSON error 消息的错误类型 */
declare class ConfigManagerApiError extends Error {
  constructor(message: string);
}
/** 导出下载结果（流式落盘或内存 Blob 兜底） */
interface DownloadResult {
  blob?: Blob;
  filename: string;
  streamed: boolean;
  bytes: number;
}
/** 下载选项：saveDialog=true 才弹系统保存对话框（需用户手势）；缺省自动下载到浏览器下载目录 */
interface DownloadOptions {
  saveDialog?: boolean;
}
/**
 * Config Manager 浏览器半的唯一数据入口。
 * 同时实现 `ExportPort`（export-flow 用）与 `ImportPort`（import-wizard 用）。
 */
declare class ConfigManagerApi {
  /**
   * 加密备份密码（仅内存，默认 null = 普通备份）。
   * ExportView 在 run 前设置；export 请求体携带给 Host 半做 AES-256-GCM 加密。
   * 绝不写入 manifest / 任何 DSH 配置 / localStorage。
   */
  exportPassword: string | null;
  /** 客户端展示层翻译器（zh 源 / en 镜像，见 ui/i18n.ts）。 */
  readonly t: UiT;
  constructor(t?: UiT);
  /** 健康/版本检查（主页横幅：插件版本 / DSH 版本 / 平台） */
  status(): Promise<ServiceStatus>;
  /** Star 引导弹窗状态（进入页面时判定是否展示 / 是否补记首次使用时间）。 */
  starPromptStatus(): Promise<StarPromptStatus>;
  /** P2-⑫：导出前只读预览（不落盘 ZIP）——「将打包 X 分区 / Y 条目 / 约 Z 大小」。 */
  exportPreview(only?: SectionId[]): Promise<ExportPreviewResponse>;
  /** 保存 Star 引导弹窗状态（局部更新：firstSeenAt / dismissed / clicked）。
   * 纯偏好无 secret；失败由调用方静默降级（本次不弹/不记，下次再判）。 */
  saveStarPrompt(patch: StarPromptPatch): Promise<StarPromptSaveResponse>;
  /** 更新内容弹窗状态（进入页面时判定是否展示 / 是否已永不提示）。 */
  releaseNotesPromptStatus(): Promise<ReleaseNotesPromptStatus>;
  /** 保存更新内容弹窗状态（局部更新：lastSeenVersion / dismissed）。 */
  saveReleaseNotesPrompt(patch: ReleaseNotesPromptPatch): Promise<ReleaseNotesPromptSaveResponse>;
  /** ExportPort.export：调用 Host 侧导出编排（core Exporter）。加密密码随请求体传输（仅内存）。
   * 带 AbortController 超时：宿主若卡死，客户端得到明确错误而不是永远停在进度条。 */
  export(options: ExportOptions): Promise<ExportResponse>;
  /**
   * 把导出的 ZIP 下载到本机。
   * - 默认（saveDialog 缺省/false）：读取为 Blob 后用 <a download> 触发浏览器
   *   静默下载到「下载」目录，无需用户额外操作（导出完成即可自动调用）；
   * - saveDialog: true：优先 File System Access API 流式落盘（不占整文件内存），
   *   用户可在系统保存对话框中选择位置；不可用/取消时回退 Blob 下载。
   */
  download(zipPath: string, opts?: DownloadOptions, onProgress?: (received: number, total: number) => void): Promise<DownloadResult>;
  /** 上传用户选择的 ZIP 到 Host 受控临时目录，返回可引用的 zipPath（dsh-ssh 同款原始字节上传） */
  upload(file: File): Promise<UploadResponse>;
  /** ImportPort.analyzeImport：零写入分析（校验/兼容性/差异/路径/秘密检测） */
  analyzeImport(zipPath: string): Promise<ImportAnalysis>;
  /** ImportPort.createImportPlan：用用户决策（冲突/路径映射/策略）生成最终计划（Dry Run 零写入） */
  createImportPlan(zipPath: string, decisions: ImportDecisions): Promise<ImportPlan>;
  /** ImportPort.decryptArchive：解锁整体加密备份容器 → 明文 ZIP 路径 + 解密覆盖的凭据 ref 名 */
  decryptArchive(zipPath: string, password: string): Promise<DecryptArchiveResponse>;
  /** ImportPort.executeImportPlan：快照→分阶段 apply→validate→commit/rollback */
  executeImportPlan(zipPath: string, plan: ImportPlan, opts: {
    confirm: boolean;
    secretInputs?: Record<string, string>;
    rollbackOnError: boolean;
    decryptPassword?: string;
  }): Promise<ImportResult & {
    runId: string;
  }>;
  /** m1：查询单个 run 的实时状态（执行中轮询 / 刷新恢复用；404 = 已过保留期或不存在） */
  progress(runId: string): Promise<RunState>;
  /** m1：列出当前活跃（running）的 run（刷新后重新订阅进行中任务的入口） */
  runs(): Promise<RunState[]>;
  /** 导入中「跳过当前插件」：宿主 abort 当前计划项的中止控制器（kill 子进程 + 清半装状态）。
   * 404 = run 不在执行（已完成/无进行中导入）。 */
  skipExecute(runId: string): Promise<{
    skipped: boolean;
  }>;
  /** 列出全部快照元信息（createdAt 倒序；含 status/条目数/宿主文件数/插件数） */
  snapshots(): Promise<SnapshotMeta[]>;
  /** 快照恢复：dryRun=true 只取动作计划（零写入）；false 执行并返回诚实报告 */
  restoreSnapshot(snapshotId: string, dryRun: boolean): Promise<RestoreResponse>;
  /** P1-⑧：手动删除单个快照（危险操作：该导入前回滚点不可恢复；`removed` 为是否实际删除）。 */
  deleteSnapshot(snapshotId: string): Promise<{
    removed: boolean;
  }>;
  /** P1-⑧：置顶/取消置顶快照（置顶快照豁免自动保留清理，只能手动删除）。 */
  setSnapshotPinned(snapshotId: string, pinned: boolean): Promise<{
    pinned: boolean;
  }>;
  /** 列出全部 Profile（name/createdAt/updatedAt/sections/fileCount）。 */
  profilesList(): Promise<ProfileMeta[]>;
  /** 保存当前 DSH 配置为新 Profile（天然不含秘密值）。 */
  profileSave(name: string, sections?: SectionId[]): Promise<ProfileMeta>;
  /** 删除 Profile（危险操作：该组配置快照不可恢复）。 */
  profileDelete(name: string): Promise<void>;
  /** 重命名 Profile（目录级移动）。 */
  profileRename(name: string, newName: string): Promise<ProfileMeta>;
  /** 切换前预览（只读，零写入）：分析切换到该 Profile 会产生的计划项。 */
  profileAnalyzeSwitch(name: string): Promise<SwitchPreview>;
  /** 执行切换（confirm=true 安全阀；走快照 + 分阶段 apply + 失败回滚；响应含 runId）。 */
  profileExecuteSwitch(name: string, opts: {
    strategy?: 'merge' | 'replace' | 'skipExisting';
    secretInputs?: Record<string, string>;
    rollbackOnError?: boolean;
  }): Promise<ProfileSwitchResult & {
    runId: string;
  }>;
  /** 导入 Profile（content = profile.json 字符串；asName 可选覆盖目标名）。 */
  profileImport(content: string, asName?: string): Promise<ProfileMeta>;
  /** 读取定时备份配置（enabled / interval / 上次运行状态；无敏感字段）。 */
  backupSchedule(): Promise<BackupScheduleStatus>;
  /** 保存定时备份设置（enabled + interval）；Host 校验后原子写 + 重排调度器。 */
  saveBackupSchedule(draft: BackupScheduleDraft): Promise<BackupScheduleStatus>;
  /** 立即执行一次全量备份（复用调度器 runOnce，防重；返回执行结果 + 最新配置）。 */
  runBackupNow(): Promise<{
    run: BackupRunResult;
    schedule: BackupScheduleStatus;
  }>;
  /** 列出导出目录（exports/*.zip）下的全部备份文件（时间倒序；含来源 auto/manual）。 */
  listBackupFiles(): Promise<BackupFileMeta[]>;
  /** 删除一个备份文件（危险操作：不可恢复；仅限 exports 目录内 .zip）。 */
  deleteBackupFile(name: string): Promise<{
    removed: boolean;
  }>;
  /** 迁移前咨询（只读健康评分 + 建议）：对 4 种可迁移源生成统一咨询报告。 */
  consult(input: {
    type: 'export-zip' | 'local-snapshot' | 'remote-snapshot' | 'profile';
    id: string;
    snapshotId?: string;
  }): Promise<ConsultReport>;
  /** 「查看备份内容」：对 exports 目录内的备份文件做只读分析（reuse /analyze，零写入）。
   *  返回分析 + 与当前配置的差异计划摘要（"装/导这个备份会动你什么"）。 */
  inspectBackup(zipPath: string): Promise<BackupInspectResult>;
}
//#endregion
//#region src/sync/sync-engine.d.ts
interface SyncPushReport {
  ok: boolean;
  snapshotId: string;
  /** 实际进入同步的 portable 分区 */
  sections: SectionId[];
  /** 分区级告警（单项失败不拖垮整体，§34.17 语义） */
  warnings: string[];
  message?: string;
}
/** 差异报告中的单个变更项（PlanItem 摘要，不含敏感细节） */
interface PullChange {
  id: string;
  adapter: SectionId;
  kind: PlanItemKind;
  description: string;
  severity: PlanItem['severity'];
}
interface SyncPullReport {
  ok: boolean;
  snapshotId: string;
  changes: PullChange[];
  /** 是否存在需要人工决策的项（Conflict / MissingSecret / MissingDependency / 路径问题）。
   * 插件 Install 不算 —— 插件安装随同步自动采用（product requirement）。 */
  needsReview: boolean;
  message?: string;
}
/** P0-②：push 前只读预览 ——「将推送什么」的单分区摘要（不写远端、不落盘）。 */
interface SyncPushPreviewSection {
  /** 分区 id（将进入快照的 portable 分区） */
  section: SectionId;
  /** 分区内条目计数（adapter.export 的 counts 聚合；无计数时为 0） */
  count: number;
  /** 相对上次基线（sync-state）是否变化：true = 本次会更新该分区；false = 与基线一致 */
  changed: boolean;
}
/** P0-②：push 前预览结果（零写入）。 */
interface SyncPushPreview {
  ok: boolean;
  /** 将推送的分区清单（含计数与变化标记） */
  sections: SyncPushPreviewSection[];
  /** 远端现有快照数（0 = 首次推送将创建首个基线） */
  remoteSnapshotCount: number;
  /** 加密快照：载荷将整体加密（分区计数与基线比较不可得） */
  encrypted: boolean;
  message?: string;
}
//#endregion
//#region src/client/sync/sync-api.d.ts
/** 远程同步通道类型：git（默认）或 webdav */
type SyncTransportType = 'git' | 'webdav';
/** GET /sync/status 响应：配置/凭据/上次同步的只读事实（无任何 secret 值） */
interface SyncStatusResponse {
  ok: boolean;
  /** 是否已保存过仓库/通道配置（sync-config.json；任一通道配置过即为 true） */
  configured: boolean;
  /** git 通道：已配置的仓库地址（不含 token，可回显；与当前通道无关，配置过即返回） */
  repoUrl?: string;
  /** git 通道：DSH credentials 中是否已存在 token（describe 只报状态，值永不返回） */
  credentialConfigured: boolean;
  credentialWritable: boolean;
  /** webdav 通道：配置状态（url 可回显，username 非敏感；password 值永不返回；
   *  与当前通道无关，配置过即返回，供 git ↔ webdav 切换时回填表单） */
  webdav?: WebDavStatusResponse;
  /** sync-state.lastSyncAt；'' = 从未同步 */
  lastSyncAt?: string;
  /** sync-state.sections 条目数 */
  sectionCount: number;
  transport?: {
    type: string;
    ref: string;
  };
  /** 上次选择的同步通道（磁盘 ui-prefs.json；UI 回填优先于此，localStorage 仅兜底） */
  lastSyncChannel?: 'git' | 'webdav';
  /** 可同步分区目录（「高级/自定义导出」勾选列表；host adapters 唯一事实源，只含 portable） */
  syncSections?: SyncSectionInfo[];
  /** 当前分区选择（当前激活通道；UI 回填用，自动同步与手动 push 共用） */
  syncSelection?: SyncSelectionPayload;
  /** 全部通道的分区选择（git/webdav 各自独立；UI 按当前 tab 取对应通道） */
  syncSelectionByChannel?: Record<SyncTransportType, SyncSelectionPayload>;
  /** 自动同步当前状态（当前激活通道；供 UI 顶部开关回填；§3.9） */
  autosync?: AutosyncStatusResponse;
  /** 全部通道的自动同步状态（git/webdav 各自独立；UI 按当前 tab 取对应通道） */
  autosyncByChannel?: Record<SyncTransportType, AutosyncStatusResponse>;
}
/** 同步分区选择（POST /sync/selection 请求体 + status.syncSelection 响应；持久化于 Host）。
 *  git/webdav 通道各自独立（transport 缺省 git）。 */
interface SyncSelectionPayload {
  /** 目标通道（git/webdav 各自独立的模式与勾选；缺省 git） */
  transport?: SyncTransportType;
  mode: 'default' | 'advanced';
  /** 高级模式勾选分区；default 模式可为空数组 */
  sections: SectionId[];
  /** 手动推送默认加密快照（密码每次推送输入，不持久化） */
  encrypt?: boolean;
  /** 手动推送默认导出真实凭据值（必须同时 encrypt） */
  includeSecrets?: boolean;
}
/** webdav 通道状态字段（无任何 secret 值；password 只报 passwordConfigured 布尔） */
interface WebDavStatusResponse {
  /** 上次使用的服务器地址（可回显；不含 userinfo） */
  url?: string;
  /** 上次使用的用户名（非敏感，可回显；供表单回填） */
  username?: string;
  /** 是否已填过用户名（布尔；便于 UI 提示徽章） */
  usernameConfigured: boolean;
  /** DSH credentials 中是否已存在密码（值永不返回） */
  passwordConfigured: boolean;
}
/** POST /sync/config 响应：保存成功后的轻量凭据状态（无 secret 值；UI 直接合并刷新徽章）。 */
interface SyncConfigSaveResponse {
  ok: boolean;
  configured: boolean;
  transport: SyncTransportType;
  /** git 通道：token 是否已配置（值永不返回） */
  credentialConfigured: boolean;
  /** webdav 通道：username/password 是否已配置（值永不返回；git 通道为 undefined） */
  webdav?: {
    usernameConfigured: boolean;
    passwordConfigured: boolean;
  };
}
/** 可同步分区条目（status.syncSections 项）。只含 portable —— 与 SyncEngine 同步通道一致。 */
interface SyncSectionInfo {
  id: SectionId;
  /** 展示名（host adapter displayName） */
  displayName: string;
  portability: 'portable' | 'deviceSpecific' | 'platformSpecific';
  defaultIncluded: boolean;
}
/** push 请求体（token 可选：非空则 Host 先写入 DSH credentials 再使用）。
 *  扁平形状与 Host parseSyncBody 一致：git 携带 repoUrl/token；
 *  webdav 携带 url/username/password（顶层，不嵌套 webdav 对象）。
 *  git 可执行文件固定使用系统 PATH 中的 git，不再接受自定义路径。
 *  sections 可选（高级/自定义导出模式）：只推送勾选分区；缺省 = 默认模式全部推荐分区。
 *  encrypt/encryptPassword/includeSecrets：加密快照（含可选密钥导出；密码仅内存传输，绝不落盘）。 */
interface SyncPushPayload {
  /** 通道类型；缺省 'git' */
  transport?: SyncTransportType;
  repoUrl?: string;
  token?: string;
  /** webdav 通道字段（transport='webdav' 时使用；扁平顶层） */
  url?: string;
  username?: string;
  password?: string;
  /** 仅同步指定分区（缺省 = 全部 portable 推荐分区；即「默认/快速导出」vs「高级/自定义导出」） */
  sections?: SectionId[];
  /** 加密快照（sections 载荷整体加密；开启时必须提供 encryptPassword） */
  encrypt?: boolean;
  /** 加密密码（仅本次请求体内存传输，Host 绝不落盘/落日志；encrypt=true 时必填） */
  encryptPassword?: string;
  /** 导出真实凭据值（必须同时 encrypt=true，否则 Host 拒绝：密钥绝不明文进同步通道） */
  includeSecrets?: boolean;
}
/** pull 请求体（strategy 缺省 merge：冲突保留待决策；snapshotId 缺省 = 最新；
 *  decryptPassword 可选：拉取加密快照时提供，仅内存传输）。 */
interface SyncPullPayload extends SyncPushPayload {
  strategy?: 'merge' | 'replace' | 'skipExisting';
  snapshotId?: string;
  /** 解密密码（拉取/一键同步遇到加密快照时提供；仅内存传输，绝不落盘） */
  decryptPassword?: string;
}
/** GET /sync/snapshots-list 响应：远端历史快照列表（按 createdAt 倒序）。 */
interface SyncSnapshotsListResponse {
  ok: boolean;
  /** 按 createdAt 倒序（最新在前） */
  snapshots: SyncSnapshotLite[];
  /** 当前本地祖先指针（sync-state.lastSnapshotId），用于高亮当前基线 */
  currentSnapshotId?: string;
}
/** 远端快照摘要（「选择历史快照」下拉项）。 */
interface SyncSnapshotLite {
  id: string;
  createdAt: string;
  sectionCount: number;
  platform: string;
  dshVersion: string;
}
/** POST /sync/sync 请求体（一键同步第一步：拉取 → 差异确认会话）。 */
interface SyncStartPayload extends SyncPushPayload {
  /** 缺省 = 最新快照；传入则对该历史快照拉取 */
  snapshotId?: string;
}
/** POST /sync/sync 响应：差异确认会话（items 供 UI 逐项确认）。 */
interface SyncStartResponse {
  ok: boolean;
  /** 差异确认会话 id：后续 apply-items / cancel 引用 */
  syncSessionId: string;
  /** 被拉取的远端快照 id */
  snapshotId: string;
  items: SyncConfirmItem[];
  /** 是否包含任何需人工决策项 */
  needsReview: boolean;
  compatibility: 'excellent' | 'good' | 'partial' | 'unsupported';
  message?: string;
}
/** 单条可确认的差异项（由 ImportPlan.item 投影 + 冲突详情）。 */
interface SyncConfirmItem {
  itemId: string;
  adapter: SectionId;
  kind: PlanItemKind;
  description: string;
  /** 变更详情（如插件「当前 1.1 vs 导入 1.6」），与导入恢复向导展示一致 */
  detail?: string;
  severity: 'info' | 'warning' | 'error';
  /** 默认采纳方向；Conflict/MissingSecret 等人工项默认 false */
  defaultAdopt: boolean;
  /** 用户最终决策（缺省 = defaultAdopt） */
  adopt: boolean;
  /** 冲突项内联解决所需详情（仅 Conflict 项非空） */
  conflict?: SyncConflictDetail;
  /** 该项若采用将写入的目标摘要 */
  target?: {
    adapter: SectionId;
    ref: string;
  };
}
/** 冲突项内联解决详情（来源 MergeConflict + 可读 diff）。 */
interface SyncConflictDetail {
  path: string;
  kind: 'key' | 'file' | 'section';
  local?: unknown;
  remote?: unknown;
  ancestor?: unknown;
  diff?: string;
}
/** POST /sync/apply-items 请求体（一键同步第二步：按逐项决策执行导入）。 */
interface ApplyItemsPayload {
  syncSessionId: string;
  /** 每项的最终采纳决策（未列出项视为 adopt=false） */
  adoptions: SyncItemAdoption[];
}
/** 单条采纳决策。 */
interface SyncItemAdoption {
  itemId: string;
  adopt: boolean;
  /** 冲突项解决方案（仅当该项是 Conflict 且 adopt=true 时必须）。
   *  与导入恢复向导一致：keepLocal=保留当前 / useRemote=使用导入；跳过 = adopt=false。 */
  resolution?: 'useRemote' | 'keepLocal';
}
/** POST /sync/apply-items 响应。 */
interface ApplyItemsResponse {
  ok: boolean;
  applied: string[];
  skipped: string[];
  needsRestart: boolean;
  warnings: string[];
  /** 应用前快照 id（UI 一键回滚用） */
  restoreId: string;
  /** 任一失败是否整体回滚 */
  rolledBack: boolean;
  failed: {
    itemId: string;
    message?: string;
  }[];
  result: unknown;
}
/** 统一间隔类型。 */
type AutosyncInterval = '5m' | '15m' | '30m' | '60m' | '6h' | '12h' | '24h';
/** 最近一次自动同步执行状态。 */
type AutosyncRunStatus = 'success' | 'skipped' | 'failed' | 'partial';
/** GET/POST /sync/autosync 响应：自动同步状态。 */
interface AutosyncStatusResponse {
  enabled: boolean;
  interval: AutosyncInterval;
  lastRunAt?: string;
  lastRunStatus?: AutosyncRunStatus;
  lastRunMessage?: string;
  consecutiveFailures: number;
  /** 距上次自动同步已过 ms（host 计算，供 UI 倒计时/立即触发判断） */
  elapsedMs: number;
  lastRunHistoryId?: string;
}
/** POST /sync/autosync 请求体（transport 指定目标通道；git/webdav 各自独立）。 */
interface AutosyncUpdatePayload {
  /** 目标通道（git/webdav 各自独立的开关/间隔/状态；缺省 git） */
  transport?: SyncTransportType;
  enabled: boolean;
  interval?: AutosyncInterval;
  startupMinIntervalMs?: number;
}
/** 自动同步执行记录（§3.7 AutosyncHistoryEntry）。 */
interface AutosyncHistoryEntry {
  /** 触发该次运行的同步通道（git / webdav；旧记录缺省 undefined） */
  transport?: SyncTransportType;
  direction: 'pull' | 'push' | 'both';
  status: 'success' | 'skipped' | 'failed' | 'partial';
  /** 跳过原因（冲突项 / 缺失依赖 / Install / 错误 / 无远端 / 网络） */
  skipReason?: string;
  /** 被跳过的冲突分区 id（冲突跳过时列出） */
  conflictedSections?: string[];
  /** 本次自动合并实际写入的分区 */
  appliedSections?: string[];
  /** 本次 push 产生的快照 id */
  pushedSnapshotId?: string;
  /** 本次 pull 来源快照 id */
  pulledSnapshotId?: string;
  error?: string;
  notifiedAt?: string;
  /** 本次触发时的连续失败计数 */
  failureCountAtRun: number;
  createdAt: string;
}
/** 同步历史条目（Host 端返回；kind='autosync' 时 autosync 非空）。 */
interface SyncHistoryEntry {
  id: string;
  createdAt: string;
  kind: 'push' | 'pull' | 'apply' | 'autosync' | 'rollback';
  sectionCount?: number;
  reviewCount?: number;
  /** 快照类条目的触发通道（git / webdav；旧快照缺省 undefined） */
  transport?: string;
  autosync?: AutosyncHistoryEntry;
}
/** GET /sync/history 响应：{ entries }。 */
interface SyncHistoryResponse {
  entries: SyncHistoryEntry[];
}
/** POST /sync/github/start 响应：UI 展示用（device_code 只存宿主，绝不回传） */
interface GithubDeviceFlowStartResponse {
  /** 随机 flowId：后续 poll/cancel 凭它引用宿主侧登记的 device_code */
  flowId: string;
  /** 一次性用户码（用户在 GitHub 授权页输入） */
  userCode: string;
  /** GitHub 授权页 URL（用户浏览器打开） */
  verificationUri: string;
  /** 设备码过期秒数 */
  expiresIn: number;
  /** GitHub 建议轮询间隔秒数 */
  interval: number;
}
/** POST /sync/github/poll 响应状态 */
type GithubPollStatus = 'pending' | 'success' | 'denied' | 'expired' | 'error';
/** POST /sync/github/poll 响应：成功时 token 已由 Host 写入 DSH credentials（值永不回传） */
interface GithubPollResponse {
  status: GithubPollStatus;
  /** pending：下次轮询前应等待的毫秒数 */
  pollDelayMs?: number;
  /** 终止态错误码（GitHub error code） */
  errorCode?: string;
  /** 终止态可展示消息（来自 GitHub error_description / 宿主文案，不含秘密） */
  message?: string;
  /** success 时恒 true（凭据已配置）；便于 UI 直接刷新状态 */
  credentialConfigured?: boolean;
}
/** POST /sync/github/validate 响应：token 是否已配置 + 是否有效（GET /user；
 *  401 → 无效）。只回布尔 + 登录名（非敏感），token 值永不回传浏览器。 */
interface GithubValidateResponse {
  ok: boolean;
  /** token 是否存在于 DSH credentials */
  configured: boolean;
  /** token 是否有效（GitHub GET /user 成功；configured=false 时恒 false） */
  valid: boolean;
  /** GitHub 登录名（valid=true 时；非敏感展示位） */
  login?: string;
}
/** 远程同步浏览器半数据入口（备份与迁移页第 4 个 tab 的注入业务面） */
declare class SyncApi {
  readonly t: UiT;
  constructor(t?: UiT);
  /** 读取同步状态（配置 / 凭据 / 上次同步时间 / 分区数） */
  status(): Promise<SyncStatusResponse>;
  /** 推送：导出 portable 分区 → 提交到私有 Git 仓库 → 更新 sync-state */
  push(payload: SyncPushPayload): Promise<SyncPushReport>;
  /** P0-②：push 前只读预览（「将推送什么」，零写入远端）——body.preview=true 触发 */
  pushPreview(payload: SyncPushPayload): Promise<SyncPushPreview>;
  /** 拉取差异预览：拉取远端最新快照 → 只读分析（绝不执行导入） */
  pull(payload: SyncPullPayload): Promise<SyncPullReport>;
  /** GitHub OAuth device flow：发起登录，返回一次性用户码 + 授权页 URL + flowId */
  githubStart(): Promise<GithubDeviceFlowStartResponse>;
  /** GitHub OAuth device flow：凭 flowId 轮询授权结果（成功时 token 已由 Host 写入 credentials） */
  githubPoll(flowId: string): Promise<GithubPollResponse>;
  /** GitHub OAuth device flow：取消（丢弃宿主侧登记，零副作用） */
  githubCancel(flowId: string): Promise<{
    ok: boolean;
  }>;
  /** GitHub token 有效性校验（判定「是否已登录」：token 存在且 GitHub API 接受；
   *  401 → valid:false 引导重新登录；非 401 错误向上抛，UI 兜底不误判登出） */
  githubValidate(): Promise<GithubValidateResponse>;
  /** 同步历史：列出本地祖先快照 + 自动同步执行记录（按 createdAt 倒序合并）。 */
  history(): Promise<SyncHistoryResponse>;
  /** 远端历史快照列表（供「选择历史快照」下拉）。 */
  snapshotsList(payload: SyncPushPayload): Promise<SyncSnapshotsListResponse>;
  /** 一键同步第一步：拉取 → 差异确认会话（items 逐项确认，暂不导入）。 */
  sync(payload: SyncStartPayload): Promise<SyncStartResponse>;
  /** 一键同步第二步：按用户对差异项的逐项决策执行导入。 */
  applyItems(payload: ApplyItemsPayload): Promise<ApplyItemsResponse>;
  /** 取消/清理差异确认会话（丢弃临时 ZIP，零副作用）。 */
  cancel(syncSessionId: string): Promise<{
    ok: boolean;
  }>;
  /** 自动同步状态（GET /sync/autosync 返回全部通道的 { git, webdav }，各自独立）。 */
  autosyncStatusAll(): Promise<Record<SyncTransportType, AutosyncStatusResponse>>;
  /** 自动同步状态（指定通道；从全部通道状态中取）。 */
  autosyncStatus(transport?: SyncTransportType): Promise<AutosyncStatusResponse>;
  /** 自动同步配置更新（POST /sync/autosync；payload.transport 指定目标通道）。 */
  autosyncUpdate(payload: AutosyncUpdatePayload): Promise<AutosyncStatusResponse>;
  /** 保存同步分区选择（POST /sync/selection）：模式 + 勾选分区持久化到 Host。
   *  自动同步调度器与手动 push 共用此配置（刷新/重启后仍然生效）。 */
  saveSelection(payload: SyncSelectionPayload): Promise<SyncSelectionPayload>;
  /** 保存同步通道配置（POST /sync/config）：url/username/password（git: repoUrl/token）持久化。
   *  password/token 经 Host 写入 DSH credentials（值永不回传）；返回凭据布尔供 UI 刷新徽章。 */
  saveConfig(payload: SyncPushPayload): Promise<SyncConfigSaveResponse>;
  /** 保存插件 UI 偏好（POST /sync/ui-prefs）：当前为上次选择的同步通道（ui-prefs.json，
   *  随 self 分区进导出备份）。纯偏好无 secret；失败由调用方静默降级（localStorage 兜底）。 */
  saveUiPrefs(payload: {
    lastSyncChannel?: 'git' | 'webdav';
  }): Promise<{
    ok: boolean;
    lastSyncChannel?: 'git' | 'webdav';
  }>;
  /** 一键回滚：按 restoreId 调用 backup→rollback */
  rollback(payload: {
    restoreId: string;
  }): Promise<{
    ok: boolean;
    full: boolean;
  }>;
  /** Phase 7 迁移前咨询（只读健康评分 + 建议）：对远端快照生成咨询报告。 */
  consult(input: {
    type: 'remote-snapshot';
    id: string;
    snapshotId?: string;
  }): Promise<ConsultReport>;
}
//#endregion
//#region src/market/types.d.ts
/**
 * 发布模式（F6 迁移/分享双模式，借鉴 dsh-packer config.personalPatterns 同源设计）：
 *  - 'migrate'（缺省）：迁移模式，同一份数据全带（只受 BANNED 分区与字面量凭据扫描约束）；
 *  - 'share'：分享模式，自动排除设备/平台相关分区（deviceSpecific/platformSpecific），
 *    并对隐私内容**强制拦截**（发现任何敏感痕迹直接拒绝打包，而不是仅警告）。
 */
type MarketPublishMode = 'migrate' | 'share';
/** index.json 中的单条目摘要（浏览卡片数据源；仅展示，不直接作为导入依据） */
interface MarketIndexItem {
  /** 条目 id —— 对应 items/<itemId>/，必须过 SAFE_ITEM_ID_RE */
  id: string;
  /** 条目标题（卡片标题） */
  name: string;
  /** 一句话描述 */
  description?: string;
  /** 作者 / 发布者（字符串，不做身份校验） */
  author?: string;
  /** 条目版本号（展示用；与 L2 manifest.version 一致性见 security） */
  version?: string;
  /** 发布/更新时间 ISO-8601（展示用） */
  updatedAt?: string;
  /** 内容类别标签（展示用；禁止执行语义） */
  categories?: string[];
  /** 条目来源仓库 URL（发布者自托管；读取路由依据）；缺省 = 市场仓库自身（兼容现状单仓）。
   *  存在时必须过 validateRepoUrl（拒绝 userinfo / 空白），只读拉取、永不注入凭据。 */
  repo?: string;
}
/** 供应链/来源信息（纯展示，不做身份验证） */
interface MarketItemProvenance {
  /** 作者声明的来源（仓库 URL 等，展示用） */
  source?: string;
  /** 作者自述（展示用） */
  note?: string;
}
/** 已添加的市场摘要（GET/POST market 响应；无凭据） */
interface MarketSummary {
  url: string;
  addedAt: string;
  /** 最近一次刷新拉到的 index.json 市场名（可空） */
  name?: string;
  /** 缓存 index 的条目数（可空） */
  itemCount?: number;
  /** 最近一次成功拉取时间（可空） */
  lastFetchedAt?: string;
}
/** POST /market/browse 响应：合并 index + 缓存状态的列表项 */
interface MarketListItem {
  id: string;
  name: string;
  description?: string;
  author?: string;
  version?: string;
  updatedAt?: string;
  categories?: string[];
  /** 条目来源仓库 URL（来自 index 条目；UI 据此显示来源徽章）；缺省 = 市场仓库自身 */
  repo?: string;
  /** 条目来源仓库的 star 数（仓库级，非条目级；undefined = 无数据——查询失败/非 GitHub 仓库） */
  stars?: number;
  /** 本地缓存状态：cached | fresh | none（UI 徽章） */
  cacheState: 'cached' | 'fresh' | 'none';
  /** 分区清单（P2-⑭：已缓存条目从 L2 manifest 合并；未缓存条目缺省 = 未知，列表分区筛选时排除） */
  sections?: SectionId[];
}
/** POST /market/download 响应：条目详情 + 校验结果（dry-run 预览） */
interface MarketItemDetail {
  id: string;
  name: string;
  version: string;
  author?: string;
  description?: string;
  updatedAt?: string;
  sections: SectionId[];
  /** 条目来源仓库 URL（本次下载实际读取的仓库，repo ?? 市场 url）；展示用 */
  repo?: string;
  /** 供应链/来源信息（UI 恒展示） */
  provenance?: MarketItemProvenance;
  /** 下载/校验时间 */
  downloadedAt: string;
  /** 校验状态：valid | invalid */
  status: 'valid' | 'invalid';
  errors?: string[];
  /** 供应链警示（不论 status 都恒有；invalid 时叠加 errors） */
  warnings: string[];
}
/** market/download 的 payload（供后续 /execute 确认导入用） */
interface MarketDownloadResult extends MarketItemDetail {
  /** 受控临时区路径，供 confirm 后调 /execute */
  zipPath: string;
  /** 复用现有 analyzeImport 输出（dry-run） */
  analysis: ImportAnalysis;
  /** 复用现有 createImportPlan 输出（dry-run 预览） */
  plan: ImportPlan;
}
/** GET /market/status 响应：{ configured, markets } */
interface MarketStatusResponse {
  ok: boolean;
  /** 是否已添加过至少一个市场 */
  configured: boolean;
  markets: MarketSummary[];
  /** 本次 dsh 启动后市场是否已刷新过（首次打开市场页自动更新一次的依据；进程内存，dsh 重启后重置） */
  bootAutoRefreshed?: boolean;
}
/** POST /market/refresh 响应：{ ok, items, market } */
interface MarketRefreshResponse {
  ok: boolean;
  items: MarketIndexItem[];
  /** 该市场的缓存摘要（含最新 name/itemCount/lastFetchedAt） */
  market: MarketSummary;
}
/** POST /market/browse 响应：{ ok, items } */
interface MarketBrowseResponse {
  ok: boolean;
  items: MarketListItem[];
}
/** POST /market/prepare 请求体：由上传 zip + 用户填写元数据生成市场条目包（发布向导） */
interface MarketPreparePayload {
  /** 受控临时区中的配置 zip 路径（upload 端点返回；必须引用 staged upload） */
  zipPath: string;
  itemId: string;
  name: string;
  version?: string;
  description?: string;
  author?: string;
  /** 作者托管仓库 URL（可选；非空须过 validateRepoUrl） */
  repoUrl?: string;
  categories?: string[];
  /** 发布模式：'migrate'（缺省，迁移全带）| 'share'（分享：自动排除敏感分区 + 强制隐私拦截） */
  mode?: MarketPublishMode;
}
/** POST /market/prepare 响应：条目包生成结果（manifest 文本 + 校验摘要 + 发布目录） */
interface MarketPrepareResponse {
  ok: boolean;
  /** 发布目录（受控临时区，含 items/<id>/manifest.json + config.zip；懒 GC 与下载临时区同款） */
  dir: string;
  /** 发布目录打包 zip 路径（受控临时区，供 /download 端点下载；懒 GC 清理） */
  zipPath: string;
  /** items/<id>/manifest.json 内容（pretty JSON，可直接复制/写入） */
  manifestText: string;
  /** config.zip 的 SHA-256（与 manifest.checksums.zip 一致） */
  sha256: string;
  /** zip 内启用的分区（与 manifest.sections 一致） */
  sections: SectionId[];
  /** 供应链警示（恒生成：发布即公开、未经审核） */
  warnings: string[];
}
//#endregion
//#region src/client/market/market-api.d.ts
/** 配置市场浏览器半数据入口（备份与迁移页第 5 个 tab 的注入业务面） */
declare class MarketApi {
  readonly t: UiT;
  constructor(t?: UiT);
  /** 读取内置市场摘要（条目数 / 最近拉取时间；无任何凭据） */
  status(): Promise<MarketStatusResponse>;
  /** 拉取市场最新 index.json（内置单市场；返回目录条目 + 市场缓存摘要） */
  refresh(): Promise<MarketRefreshResponse>;
  /** 浏览内置市场（合并 index + 本地缓存状态 → 条目列表带 cacheState） */
  browse(): Promise<MarketBrowseResponse>;
  /** 下载 + 校验单条目（dry-run 预览：拉取 → §6 校验 → analyzeImport → createImportPlan）。
   *  repo 可选：条目来源仓库（作者自托管）。自托管条目（官方 index 带 repo 引用、或「我的配置」
   *  未收录条目）内容文件在作者自己的公开仓库，必须显式传 repo 才能从正确来源拉取；
   *  缺省 = 市场仓库（官方同仓条目）。
   *  真正落盘由用户对预览确认后走现有 executeImportPlan（confirm:true 安全阀 + 回滚）。 */
  download(itemId: string, repo?: string): Promise<MarketDownloadResult>;
  /** 发布向导：由「上传 zip + 用户填写元数据」生成市场条目包（L2 manifest + SHA-256 + sections），
   *  供 UI 展示/复制与引导推送。零写入配置（发布目录在受控临时区）；不含任何凭据字段。 */
  prepare(payload: MarketPreparePayload): Promise<MarketPrepareResponse>;
  /** 发布包下载 URL（受控临时区 zip；经宿主 /download 端点，无凭据、无写操作） */
  downloadPublishUrl(zipPath: string): string;
}
//#endregion
//#region src/market/my-repo.d.ts
/** 条目收录状态：未收录（本地独有）｜ PR 待审核（带 PR 链接）｜ 已收录（官方市场 index 含该 id） */
type MyItemStatus = 'not-listed' | 'pr-pending' | 'listed';
/** 上传表单：仅用户填写的描述性内容；id/author/version/updatedAt/repoUrl 全自动 */
interface MyRepoForm {
  /** 配置名（预填 zip 文件名，可改）；id 由其派生稳定 slug */
  name: string;
  /** 显式目标条目 id（**仅 update 模式**用：由列表「更新」按钮预填，避免靠 name→slug 猜测匹配；
   *  上传（新条目）时省略；后端校验存在性，缺省回退 name slug 匹配（向后兼容） */
  id?: string;
  description?: string;
  categories?: string[];
  /** 发布模式（F6 迁移/分享双模式）：'share' 时 prepare 走分享强制拦截（排除设备/平台分区 + 保守档隐私扫描）；
   *  缺省 undefined = migrate（迁移全带，行为与历史一致）。 */
  mode?: MarketPublishMode;
}
/** 收录流程状态：pending=已提交、后台处理中；done=已提交收录（PR 已开/复用）；failed=收录失败可重试 */
type ListingState = 'pending' | 'done' | 'failed';
/**
 * upload / update 返回（ok=false 时携带已脱敏 error + errorCode）。
 * 流程拆分（2026-08-20 优化）：upload/update 只同步执行「推用户仓库」并立即返回
 * （listing='pending'），「收录流程」（fork + 官方 index + PR）在后台异步执行，
 * 避免 GitHub fork 排队时整个上传请求长时间挂起；收录结果经 listingStatus /
 * /me/items 状态徽章查询。
 */
interface UploadResult {
  ok: boolean;
  itemId: string;
  version: string;
  sha256: string;
  sections: SectionId[];
  /** 用户公开仓库 URL（https://github.com/<login>/dsh-configs） */
  repoUrl: string;
  /** 收录 PR 编号（异步模式下收起完成前为 null；完成经 listingStatus 查询） */
  prNumber: number | null;
  /** 收录 PR 链接（同上） */
  prUrl: string | null;
  warnings: string[];
  /** 收录流程状态：ok=true 且上传成功后为 'pending'（后台进行中）；失败无收录流程时 'done' 无意义 */
  listing: ListingState;
  /** listing='failed' 时：收录失败原因（已脱敏，含重试指引） */
  listingError?: string;
  /** ok=false 时：可展示错误（已脱敏，无 token 形态） */
  error?: string;
  /** ok=false 时：错误分类码（unauthorized/prepare_failed/...；无则 'internal'） */
  errorCode?: string;
}
/** POST /me/listing 响应：收录任务状态（结果卡轮询用，比拉全列表更轻） */
interface ListingStatusResponse {
  itemId: string;
  listing: ListingState;
  /** listing='done' 时：PR 编号 */
  prNumber: number | null;
  /** listing='done' 时：PR 链接 */
  prUrl: string | null;
  /** listing='failed' 时：失败原因（已脱敏） */
  error?: string;
}
/** POST /me/delete 响应：删除条目结果 */
interface DeleteResult {
  ok: boolean;
  itemId: string;
  /** 是否已异步提交「下架 PR」（条目此前已收录进官方市场时 true） */
  delisted: boolean;
  /** 被关闭的收录 PR（条目处于待审核、有 open PR 时关闭它） */
  prNumber: number | null;
  /** 被关闭 PR 的链接（同上） */
  prUrl: string | null;
  warnings: string[];
  /** ok=false 时：可展示错误（已脱敏） */
  error?: string;
  /** ok=false 时：错误分类码（item_not_found/unauthorized/...） */
  errorCode?: string;
}
/** listItems 条目：用户仓库 index.json 条目 + 收录状态 */
interface MyItemEntry {
  id: string;
  name: string;
  version?: string;
  description?: string;
  author?: string;
  updatedAt?: string;
  categories?: string[];
  status: MyItemStatus;
  /** status=pr-pending 时：PR 链接 */
  prUrl?: string;
  /** 用户公开仓库 URL */
  repoUrl: string;
  /** 用户公开仓库（<login>/dsh-configs）的 star 数（仓库级；undefined = 无数据） */
  stars?: number;
}
//#endregion
//#region src/client/market/my-configs-api.d.ts
/**
 * POST /me/status 响应：登录态 + 用户配置仓库状态（设计文档 §4.2）。
 * 仅非敏感展示位：login 用户名可回显；token 值永不回传浏览器。
 */
interface MyMeStatusResponse {
  loggedIn: boolean;
  /** GitHub 登录名（展示 @login 用） */
  login?: string;
  /** 用户自己的配置仓库 URL（无则尚未创建） */
  repoUrl?: string;
  /** 配置仓库是否已存在（false = 尚未创建过） */
  repoExists?: boolean;
}
/**
 * 一键上传/更新请求体中的表单（设计文档 §2.4 用户输入最小化）：
 * 仅 name（必填，预填 zip 文件名可改）/ description（可选）/ categories（可选）；
 * id / author / version / updatedAt 全部系统自动生成，不在表单里。
 * categories 为数组（UI 层先经 parseCategories 解析逗号分隔文本）。
 * **与 Host 半 my-repo.ts 的 MyRepoForm 同构**（对齐导出，避免漂移）。
 */
type MyConfigsFormPayload = MyRepoForm;
/**
 * POST /me/upload | /me/update 响应（**对齐 host 半 my-repo.ts 的 UploadResult**）。
 * ok=false 时 itemId/version/sha256 可为空串，warnings/error/errorCode 携带可展示信息（已脱敏）。
 */
type MyUploadResult = UploadResult;
/** POST /me/items 响应：用户仓库的全部条目（空仓库 → 空数组）。
 *  条目 = Host 侧 MyItemEntry（含收录状态 status + prUrl + repoUrl，§4.5 在 Host 判定）。 */
interface MyItemsResponse {
  items: MyItemEntry[];
}
/**
 * 「我的配置」浏览器半数据入口（MarketPanel 的「我的配置」子视图注入业务面）。
 * 登录（GitHub device flow）不在此类 —— 复用 SyncApi.githubStart/githubPoll/githubCancel。
 */
declare class MyConfigsApi {
  readonly t: UiT;
  constructor(t?: UiT);
  /** 读取登录态 + 用户配置仓库状态（token 失效 → Host 返回 401/未登录，UI 引导重新登录） */
  meStatus(): Promise<MyMeStatusResponse>;
  /** 一键上传：校验 → 建/复用仓库 → 写入用户仓库 → fork → 改官方 index → 提收录 PR */
  meUpload(payload: {
    zipPath: string;
    form: MyConfigsFormPayload;
  }): Promise<MyUploadResult>;
  /** 读取已上传条目列表（用户仓库 index.json；每条目含 Host 侧判定的收录状态） */
  meItems(): Promise<MyItemsResponse>;
  /** 一键更新：version 自动 +1，复用/重开收录 PR */
  meUpdate(payload: {
    zipPath: string;
    form: MyConfigsFormPayload;
  }): Promise<MyUploadResult>;
  /** 查询收录/下架任务状态（结果卡轮询；任务表未命中时 Host 回退 GitHub 实况推导；无任务无实况 → null） */
  meListing(itemId: string): Promise<ListingStatusResponse | null>;
  /** 重新提交收录（失败/重启丢失后重试；幂等复用已存在 fork/open PR） */
  meRelist(itemId: string): Promise<ListingStatusResponse>;
  /** 删除条目（同步删本地索引+文件；已收录自动后台提下架 PR；待审核自动关闭收录 PR） */
  meDelete(itemId: string): Promise<DeleteResult>;
}
//#endregion
//#region src/ui/types.d.ts
/** recovery 决策（§5.2）：rollback-recommended=恢复到 trusted snapshot；rollback-continue=续跑中断回滚；needs-attention=需人工调查。 */
type RecoveryDecision = 'rollback-recommended' | 'rollback-continue' | 'needs-attention';
/** post-recovery verification verdict（§6.3）。 */
type RecoveryVerdict = 'MATCH' | 'PARTIAL_MATCH' | 'MISMATCH' | 'VERIFICATION_ERROR';
/** GET /recovery/status 的单个 incident（未解决 operation）。 */
interface RecoveryIncident {
  operationId: string;
  operationType: string;
  state: string;
  decision: RecoveryDecision;
  snapshotId: string | null;
  /** 已 redact 的原因文本。 */
  reason: string;
  createdAt: string;
}
/** GET /recovery/status 响应。 */
interface RecoveryStatus {
  incidents: RecoveryIncident[];
  running: {
    runId: string;
    status: string;
  }[];
}
/** GET /recovery/:operationId/preview 响应（只读，零写入）。 */
interface RecoveryPreview {
  operationId: string;
  operationType: string;
  state: string;
  decision: RecoveryDecision;
  snapshotId: string | null;
  snapshotVerdict: string | null;
  snapshotMeta: {
    id: string;
    createdAt: string;
    operationType?: string;
  } | null;
  environmentFingerprint: string;
  environmentCompatible: boolean;
  reason: string;
  createdAt: string;
}
/** POST /recovery/:operationId/verify 响应。 */
interface RecoveryVerifyResult {
  ok: boolean;
  operationId: string;
  verdict: RecoveryVerdict;
  terminal: string;
  /** 每项检查结果（已 redact）。 */
  details: string[];
  /** 需人工处理项（已 redact）。 */
  manualHints: string[];
}
/** POST /recovery/:operationId/execute|retry 响应。 */
interface RecoveryExecuteResult {
  ok: boolean;
  operationId: string;
  decision: RecoveryDecision;
  state: string;
  runId: string;
}
/** POST /recovery/:operationId/confirm 响应。 */
interface RecoveryConfirmResult {
  ok: boolean;
  operationId: string;
  snapshotId: string;
  verdict: string;
}
/** POST /recovery/:operationId/dismiss 响应。 */
interface RecoveryDismissResult {
  ok: boolean;
  operationId: string;
  dismissed: boolean;
}
/**
 * Recovery 端口契约（§10.3）：recovery 无现有 port（ExportPort/ImportPort 只服务控制器）。
 * `recovery-api.ts` 实现之；`recovery-view.ts` 是纯渲染模型（非控制器），消费本端口返回的渲染数据。
 * 安全：所有 destructive 动作（confirm/execute/retry/dismiss）必须显式传 userConfirmed=true，
 * 由 Host 侧双重校验（请求体 + journal 状态机）。
 */
interface RecoveryPort {
  status(): Promise<RecoveryStatus>;
  preview(operationId: string): Promise<RecoveryPreview>;
  confirm(operationId: string, userConfirmed: boolean): Promise<RecoveryConfirmResult>;
  execute(operationId: string, userConfirmed: boolean): Promise<RecoveryExecuteResult>;
  verify(operationId: string): Promise<RecoveryVerifyResult>;
  retry(operationId: string, userConfirmed: boolean): Promise<RecoveryExecuteResult>;
  dismiss(operationId: string, userConfirmed: boolean): Promise<RecoveryDismissResult>;
}
//#endregion
//#region src/client/recovery/recovery-api.d.ts
/** Recovery 浏览器半数据入口（实现 RecoveryPort 契约）。 */
declare class RecoveryApi implements RecoveryPort {
  readonly t: UiT;
  constructor(t?: UiT);
  /** GET /recovery/status：列出未解决 operation + reconcile decision。 */
  status(): Promise<RecoveryStatus>;
  /** GET /recovery/:operationId/preview：只读恢复预览（restore plan + verification plan）。 */
  preview(operationId: string): Promise<RecoveryPreview>;
  /** POST /recovery/:operationId/confirm：确认恢复（journal 保持 NEEDS_ATTENTION）。 */
  confirm(operationId: string, userConfirmed: boolean): Promise<RecoveryConfirmResult>;
  /** POST /recovery/:operationId/execute：执行恢复/回滚（NEEDS_ATTENTION → RECOVERING）。 */
  execute(operationId: string, userConfirmed: boolean): Promise<RecoveryExecuteResult>;
  /** POST /recovery/:operationId/verify：post-recovery verification（原子写 verification + terminal）。 */
  verify(operationId: string): Promise<RecoveryVerifyResult>;
  /** POST /recovery/:operationId/retry：验证失败后重跑 execute + verify。 */
  retry(operationId: string, userConfirmed: boolean): Promise<RecoveryExecuteResult>;
  /** POST /recovery/:operationId/dismiss：放弃恢复（quarantine，不销毁证据）。 */
  dismiss(operationId: string, userConfirmed: boolean): Promise<RecoveryDismissResult>;
}
//#endregion
//#region src/core/migration-history.d.ts
/** 合法 kind 集合（§5 COMPLETE 清单 + 评审补 'profile-import'）。 */
declare const MIGRATION_KINDS: readonly ["import", "restore", "rollback", "profile-switch", "profile-delete", "profile-rename", "profile-save", "profile-import", "sync-apply", "autosync", "recovery", "backup", "snapshot-delete", "snapshot-prune"];
/** §5 覆盖的操作 kind（COMPLETE 不变量；常量枚举，天然非敏感）。 */
type MigrationKind = (typeof MIGRATION_KINDS)[number];
/** 操作结果。 */
type MigrationResult = 'success' | 'failed' | 'skipped';
/** 触发来源（常量）。 */
type MigrationSource = 'api' | 'autosync' | 'backup-scheduler' | 'recovery' | 'cli' | 'internal';
/** 一条不可变的迁移历史记录（磁盘形态；schemaVersion 内联）。 */
interface MigrationHistoryEntry {
  schemaVersion: number;
  at: string;
  kind: MigrationKind;
  result: MigrationResult;
  /** 涉及分区 adapter id（常量集合）。 */
  sections: string[];
  /** Journal operation id（UUID，BOUND）。 */
  operationId?: string;
  /** 快照 id（UUID，BOUND）。 */
  snapshotId?: string;
  /** run-registry runId（UUID，BOUND）。 */
  runId?: string;
  source: MigrationSource;
  /** 非敏感摘要（redact + high-entropy 后）。 */
  summary: string;
  /** 失败原因（redact + high-entropy 后）。 */
  error?: string;
}
/**
 * 磁盘形态：schemaVersion + contentHash（对除 contentHash 外全字段的 SHA-256）。
 * contentHash 用于 **append-only 篡改检测**：合法 JSON 内改字段值（含 result/summary/at）
 * → 读回 hash 不符 → 该文件被识别为损坏并跳过（满足「篡改必须被拒绝或检测」）。
 * 仅是内联字段（非 MAC/签名 / 非第二套 integrity framework；审计史非对抗性安全边界）。
 */
interface StoredMigrationHistoryEntry extends Omit<MigrationHistoryEntry, 'schemaVersion'> {
  schemaVersion: number;
  contentHash: string;
}
/** 统计（纯函数）。 */
interface MigrationHistoryStats {
  total: number;
  byKind: Partial<Record<MigrationKind, number>>;
  byResult: Partial<Record<MigrationResult, number>>;
}
//#endregion
//#region src/client/history/history-api.d.ts
/** 列表查询返回体。 */
interface HistoryListResult {
  ok: boolean;
  entries: StoredMigrationHistoryEntry[];
  stats: MigrationHistoryStats;
  corrupted: string[];
}
/** 导出 JSON 返回体（markdown 走附件下载，不返回 JSON body）。 */
interface HistoryExportJsonResult {
  ok: boolean;
  generatedAt: string;
  text: string;
}
type HistoryExportFormat = 'json' | 'markdown';
/** History 浏览器半数据入口。 */
declare class HistoryApi {
  readonly t: UiT;
  constructor(t?: UiT);
  private buildListUrl;
  /** GET /history：按 kind/result/时间/分区 过滤读取历史。 */
  list(params?: {
    kind?: MigrationKind | MigrationKind[];
    result?: MigrationResult | MigrationResult[];
    from?: number;
    to?: number;
    sections?: string[];
  }): Promise<HistoryListResult>;
  /**
   * 导出历史报告（markdown → 下载附件；json → { text }）。
   * 过滤参数与 list 相同。
   */
  exportReport(format: HistoryExportFormat, params?: {
    kind?: MigrationKind | MigrationKind[];
    result?: MigrationResult | MigrationResult[];
  }): Promise<HistoryExportJsonResult | {
    downloaded: true;
  }>;
  private buildExportUrl;
}
//#endregion
//#region src/client/client-types.d.ts
/** 本插件 Client 半的注入业务面：每个 settings.section 注册项都拿到同一个 api 实例 */
interface ConfigManagerSectionInjected {
  api: ConfigManagerApi;
  /** 远程同步 API（备份与迁移页第 4 个 tab 使用，主 section 注册时注入） */
  syncApi: SyncApi;
  /** 远程同步 locale（config-manager-sync 命名空间，主 section 注册时注入） */
  syncT: import('@deepseek-ai/dsh-client-ui-slots').TranslateNS<'config-manager-sync'>;
  /** 配置市场 API（备份与迁移页第 5 个 tab 使用，主 section 注册时注入） */
  marketApi: MarketApi;
  /** 「我的配置」API（MarketPanel 的「我的配置」子视图使用，主 section 注册时注入） */
  myConfigsApi: MyConfigsApi;
  /** 配置市场 locale（config-manager-market 命名空间，主 section 注册时注入） */
  marketT: import('@deepseek-ai/dsh-client-ui-slots').TranslateNS<'config-manager-market'>;
  /** Recovery API（Phase 5：引导式恢复工作流；主 section 注册时注入） */
  recoveryApi: RecoveryApi;
  /** Recovery locale（config-manager-recovery 命名空间，主 section 注册时注入） */
  recoveryT: import('@deepseek-ai/dsh-client-ui-slots').TranslateNS<'config-manager-recovery'>;
  /** Migration History API（Phase 6：统一审计史；主 section 注册时注入） */
  historyApi: HistoryApi;
  /** Migration History locale（config-manager-history 命名空间，主 section 注册时注入） */
  historyT: import('@deepseek-ai/dsh-client-ui-slots').TranslateNS<'config-manager-history'>;
}
//#endregion
//#region src/client/locales.d.ts
/**
 * Config Manager 表面文案：zh 为源语言，en 镜像每个键。
 * 字典 namespace 由 client/index.ts 注册（declare module 合并进 LocaleNamespaceMap）。
 * 键集合通过 `ConfigManagerKey` 类型在注册处做编译期校验（缺键/多键即编译错误）。
 */
declare const zh$3: {
  readonly 'section.label': "备份与迁移";
  readonly 'section.description': "导出 / 导入 / 迁移 DSH 配置（备份不含密钥，加密备份可选）";
  readonly 'view.transfer': "导出与导入";
  readonly 'view.export': "导出备份";
  readonly 'view.import': "导入恢复";
  readonly 'view.snapshots': "备份与快照";
  readonly 'view.sync': "远程同步";
  readonly 'view.market': "配置市场";
  readonly 'view.about': "关于";
  readonly 'view.more': "更多";
  readonly 'view.profiles': "配置文件";
  readonly 'common.close': "关闭";
  readonly 'common.cancel': "取消";
  readonly 'common.back': "上一步";
  readonly 'common.next': "下一步";
  readonly 'common.done': "完成";
  readonly 'common.retry': "重试";
  readonly 'common.confirm': "确认";
  readonly 'common.loading': "加载中…";
  readonly 'common.unknownError': "未知错误";
  readonly 'status.ready': "Config Manager 已就绪（插件 {version} · DSH {dsh} · {platform}）";
  readonly 'status.unavailable': "Config Manager 服务未就绪，请确认插件已正确挂载。";
  readonly 'export.mode.quick': "快速导出";
  readonly 'export.mode.quickHint': "一键导出推荐分区（可迁移、不含设备专属数据），适合常规备份。";
  readonly 'export.mode.custom': "自定义导出";
  readonly 'export.mode.customHint': "按分组逐项勾选要导出的分区。";
  readonly 'export.security': "安全选项";
  readonly 'export.encrypt': "加密备份";
  readonly 'export.encryptHint': "用密码加密整个备份文件（AES-256-GCM）。密码仅用于本次加密，不会写入备份或任何配置文件；导入时必须输入该密码才能解锁。";
  readonly 'export.password': "备份加密密码";
  readonly 'export.passwordConfirm': "确认密码";
  readonly 'export.passwordMismatch': "两次输入的密码不一致";
  readonly 'export.passwordRequired': "加密备份必须设置密码";
  readonly 'export.includeSecrets': "导出密钥";
  readonly 'export.includeSecretsHint': "把真实密钥（凭据值）写入备份。密钥必须以加密形式保存：勾选时会自动选中「加密备份」；取消「加密备份」会同时取消「导出密钥」。";
  readonly 'export.run': "开始导出";
  readonly 'export.preview': "预览将导出内容";
  readonly 'export.previewing': "正在统计…";
  readonly 'export.previewSummary': "将打包 {sections} 个分区，约 {size}（不含密钥）";
  readonly 'export.previewSkipped': "{count} 个分区导出失败已跳过";
  readonly 'export.running': "正在导出…";
  readonly 'export.download': "下载备份文件";
  readonly 'export.saved': "已保存到下载目录：{name}";
  readonly 'export.selectionWarnings': "以下分区为设备相关数据，跨设备导入时可能不适用：";
  readonly 'export.group.unknown': "其他";
  readonly 'export.included': "已包含";
  readonly 'export.excluded': "未包含";
  readonly 'export.naming': "文件名与备注（可选）";
  readonly 'export.fileName': "自定义文件名";
  readonly 'export.fileNameHint': "留空自动命名（dsh-config-<日期>.zip）；无需手动输入 .zip 后缀，保存时自动补全。仅允许字母数字、空格、- _ .。";
  readonly 'export.fileNameInvalid': "文件名不合法：仅允许字母数字、空格、- _ .，不能包含路径分隔符。";
  readonly 'export.note': "备注";
  readonly 'export.notePlaceholder': "例如：迁移前的完整备份 / 2026-08 存档";
  readonly 'export.noteHint': "备注保存在本机备份列表中（随配置备份迁移），便于区分多个导出产物。";
  readonly 'import.select.title': "选择备份文件";
  readonly 'import.select.hint': "选择本机导出的 dsh-config-*.zip 备份文件开始导入。分析阶段只读，不会修改任何配置。";
  readonly 'import.select.browse': "选择 ZIP 文件";
  readonly 'import.select.reselect': "重新选择";
  readonly 'import.select.cancel': "取消选择";
  readonly 'import.select.file': "已选择：{name}";
  readonly 'import.analyzing': "正在分析备份…";
  readonly 'import.compatibility.title': "兼容性";
  readonly 'import.compatibility.score': "兼容性评分：{score}";
  readonly 'import.compatibility.ok': "备份可导入";
  readonly 'import.compatibility.fail': "备份分析失败：{reason}";
  readonly 'import.preview.title': "导入预览";
  readonly 'import.preview.willChange': "将变更 {count} 项";
  readonly 'import.preview.unchanged': "已一致跳过 {count} 项";
  readonly 'import.preview.settings': "设置更新 {count}";
  readonly 'import.preview.plugins': "插件待安装 {count}";
  readonly 'import.preview.mcp': "MCP 新增 {count}";
  readonly 'import.preview.prompts': "提示词 {count}";
  readonly 'import.preview.paths': "路径映射 {count}";
  readonly 'import.preview.secrets': "密钥待补录 {count}";
  readonly 'import.preview.conflicts': "冲突 {count}";
  readonly 'import.preview.restart': "导入后需重启 DSH 生效";
  readonly 'import.confirm.execute': "确认导入";
  readonly 'import.confirm.warning': "导入将修改当前 DSH 配置；执行前会自动创建安全快照，失败时整体回滚。";
  readonly 'import.confirm.encrypted': "将用备份密码解密并恢复 {count} 个凭据。";
  readonly 'import.rollbackOnError': "失败时整体回滚（推荐）";
  readonly 'import.importing': "正在导入…（插件安装较多时可能需要几分钟，请勿关闭页面）";
  readonly 'import.log.title': "导入日志";
  readonly 'import.log.empty': "等待命令输出…";
  readonly 'import.log.newOutput': "↓ 新输出";
  readonly 'import.skipCurrent': "跳过当前插件";
  readonly 'import.skipPending': "正在跳过…其余项将继续导入";
  readonly 'import.retrySkipped': "重试失败/跳过的项 ({count})";
  readonly 'import.secrets.title': "补录密钥";
  readonly 'import.secrets.hint': "以下凭据未随备份导出（安全设计）。如需在目标 DSH 使用，请手动补录；留空将跳过。";
  readonly 'import.secrets.optional': "（可选）";
  readonly 'import.secrets.required': "（必需）";
  readonly 'import.decrypt.badge': "加密备份";
  readonly 'import.decryptArchive.title': "解锁加密备份";
  readonly 'import.decryptArchive.hint': "此备份已整体加密（整个文件被密码保护）。输入导出时设置的密码即可解密并继续导入——备份内的加密凭据也会用同一密码自动恢复，全程只需输入这一次密码；密码仅本次使用，绝不落盘。";
  readonly 'import.decryptArchive.passwordPlaceholder': "输入备份加密密码";
  readonly 'import.decryptArchive.unlock': "解锁并继续";
  readonly 'import.decryptArchive.unlocking': "解锁中…";
  readonly 'import.decrypt.previewHint': "加密备份：凭据已由解锁密码自动恢复，无需再次输入密码。";
  readonly 'import.conflicts.title': "解决冲突";
  readonly 'import.conflicts.hint': "以下配置项在目标 DSH 已存在且与备份不同，请逐项决策。";
  readonly 'import.conflicts.keepCurrent': "保留当前";
  readonly 'import.conflicts.useImported': "使用备份";
  readonly 'import.conflicts.review': "稍后决定";
  readonly 'import.conflicts.unresolved': "还有 {count} 项未决策";
  readonly 'import.conflicts.keepCurrentAll': "全部保留当前配置";
  readonly 'import.conflicts.useImportedAll': "全部使用备份配置";
  readonly 'import.paths.title': "路径映射";
  readonly 'import.paths.hint': "备份中的绝对路径在目标机器可能不存在，请为每条路径指定新位置（留空将跳过该路径）。";
  readonly 'import.paths.old': "原路径";
  readonly 'import.paths.new': "新路径";
  readonly 'import.paths.unresolved': "还有 {count} 条路径未映射";
  readonly 'snapshots.title': "备份与快照";
  readonly 'snapshots.hint': "导出备份 = 便携 ZIP（下载 / 一键导入 / 删除，含定时全量备份）；快照恢复 = 恢复到导入前状态：整文件还原 settings/patch、卸载导入期间新增插件、补偿被修改文件，执行前会把当前文件备份到一个安全位置。";
  readonly 'snapshots.subTab.restore': "快照恢复";
  readonly 'snapshots.subTab.files': "备份文件";
  readonly 'snapshots.subTab.recovery': "恢复";
  readonly 'snapshots.empty': "暂无快照。执行导入时会自动创建安全快照。";
  readonly 'snapshots.loading': "加载快照中…";
  readonly 'snapshots.selectHint': "选择快照以预览恢复计划（只读预览，不会改动任何设置）：";
  readonly 'snapshots.createdAt': "创建时间";
  readonly 'snapshots.sourceZip': "来源备份";
  readonly 'snapshots.status': "状态";
  readonly 'snapshots.entries': "条目";
  readonly 'snapshots.plugins': "插件";
  readonly 'snapshots.actions': "操作";
  readonly 'snapshots.retentionHint': "最多自动保留 {count} 个快照（超出清理最旧的）；置顶的快照不参与自动清理，只能手动删除。";
  readonly 'snapshots.pin': "置顶";
  readonly 'snapshots.unpin': "取消置顶";
  readonly 'snapshots.delete': "删除";
  readonly 'snapshots.deleteConfirmTitle': "删除快照";
  readonly 'snapshots.deleteConfirm': "确认删除 {time} 创建的快照？该导入前回滚点将被永久删除，不可恢复。";
  readonly 'snapshots.status.pending': "进行中";
  readonly 'snapshots.status.done': "已完成";
  readonly 'snapshots.status.rolled-back': "已回滚";
  readonly 'snapshots.status.unknown': "未知";
  readonly 'snapshots.planTitle': "恢复计划预览";
  readonly 'snapshots.viewPlan': "查看恢复计划";
  readonly 'snapshots.noActions': "该快照无可用恢复动作（或全部跳过）。";
  readonly 'snapshots.execute': "执行恢复";
  readonly 'snapshots.executing': "恢复执行中…";
  readonly 'snapshots.confirmTitle': "确认恢复";
  readonly 'snapshots.confirmRestore': "确认执行恢复？会先把当前文件备份到一个安全位置，再删除导入期间新增的插件。";
  readonly 'snapshots.reportTitle': "恢复报告";
  readonly 'snapshots.restored': "已还原";
  readonly 'snapshots.removedPlugins': "已卸载插件";
  readonly 'snapshots.manualHints': "需人工处理";
  readonly 'snapshots.failed': "失败";
  readonly 'snapshots.skipped': "跳过";
  readonly 'snapshots.kind.hostFileRestore': "整文件还原";
  readonly 'snapshots.kind.hostFileRemove': "整文件删除";
  readonly 'snapshots.kind.pluginRemove': "卸载插件";
  readonly 'snapshots.kind.fileRestore': "还原文件";
  readonly 'snapshots.kind.fileRemove': "删除文件";
  readonly 'snapshots.kind.credentialHint': "人工提示";
  readonly 'snapshots.kind.skip': "跳过";
  readonly 'snapshots.kind.unknown': "未知";
  readonly 'snapshots.summary': "整文件还原 {hostFileRestores} · 整文件删除 {hostFileRemoves} · 插件卸载 {pluginRemoves} · 文件还原 {fileRestores} · 文件删除 {fileRemoves} · 凭据提示 {credentialHints} · 跳过 {skips}";
  readonly 'backupSchedule.title': "定时全量备份";
  readonly 'backupSchedule.hint': "按固定间隔在后台自动导出全量备份 ZIP（恒不含 secret、不加密；要加密请手动导出）。配置存 sync/backup-schedule.json，随 self 分区备份 / 远程同步迁移。";
  readonly 'backupSchedule.enabled': "启用定时备份";
  readonly 'backupSchedule.enabledHint': "开启后 DSH 在后台按间隔自动备份；每次启动时立即执行一次（距上次运行不足 1 小时则跳过启动触发）。";
  readonly 'backupSchedule.interval': "备份间隔";
  readonly 'backupSchedule.interval.6h': "每 6 小时";
  readonly 'backupSchedule.interval.12h': "每 12 小时";
  readonly 'backupSchedule.interval.24h': "每 24 小时";
  readonly 'backupSchedule.interval.7d': "每 7 天";
  readonly 'backupSchedule.interval.custom': "自定义（每周固定时刻）";
  readonly 'backupSchedule.customHint': "每周在选定星期与时刻各执行一次全量备份（错过的时间点不补跑）";
  readonly 'backupSchedule.weekday.sunday': "周日";
  readonly 'backupSchedule.weekday.monday': "周一";
  readonly 'backupSchedule.weekday.tuesday': "周二";
  readonly 'backupSchedule.weekday.wednesday': "周三";
  readonly 'backupSchedule.weekday.thursday': "周四";
  readonly 'backupSchedule.weekday.friday': "周五";
  readonly 'backupSchedule.weekday.saturday': "周六";
  readonly 'backupSchedule.save': "保存设置";
  readonly 'backupSchedule.saved': "设置已保存";
  readonly 'backupSchedule.runNow': "立即备份";
  readonly 'backupSchedule.running': "备份中…";
  readonly 'backupSchedule.lastRun': "上次运行";
  readonly 'backupSchedule.never': "从未运行";
  readonly 'backupSchedule.status.success': "成功";
  readonly 'backupSchedule.status.skipped': "已跳过";
  readonly 'backupSchedule.status.failed': "失败";
  readonly 'backupSchedule.consecutiveFailures': "定时备份连续失败 {count} 次，请检查配置（磁盘空间 / 权限 / 分区导出错误）";
  readonly 'backupSchedule.loading': "加载定时备份设置…";
  readonly 'backupSchedule.error': "定时备份设置加载失败";
  readonly 'backupFiles.title': "备份文件";
  readonly 'backupFiles.hint': "导出产物（手动导出与定时备份）统一在此管理：可下载到本机、直接导入恢复，或删除。定时备份自动保留最近 10 个。";
  readonly 'backupFiles.empty': "暂无备份文件。手动导出或启用定时备份后此处会列出。";
  readonly 'backupFiles.loading': "加载备份文件…";
  readonly 'backupFiles.error': "备份文件加载失败";
  readonly 'backupFiles.source.auto': "定时备份";
  readonly 'backupFiles.source.manual': "手动导出";
  readonly 'backupFiles.download': "下载";
  readonly 'backupFiles.import': "导入";
  readonly 'backupFiles.delete': "删除";
  readonly 'backupFiles.deleteConfirmTitle': "删除备份文件";
  readonly 'backupFiles.deleteConfirm': "确认删除备份文件「{name}」？此操作不可恢复。";
  readonly 'backupFiles.searchPlaceholder': "按文件名或备注搜索…";
  readonly 'backupFiles.searchEmpty': "没有匹配的备份文件";
  readonly 'backupFiles.inspect': "查看 / 对比";
  readonly 'backupFiles.inspectLoading': "正在分析备份内容…";
  readonly 'backupFiles.inspectEmpty': "该备份无法分析（文件损坏或格式不支持）";
  readonly 'backupFiles.inspectSections': "包含的分区";
  readonly 'backupFiles.inspectDiff': "与此备份的差异（只读预览）";
  readonly 'backupFiles.inspectItems': "变更明细";
  readonly 'backupFiles.inspectGroup.conflicts': "冲突（需决策）";
  readonly 'backupFiles.inspectGroup.changes': "变更（将写入）";
  readonly 'backupFiles.inspectGroup.paths': "路径映射（需处理）";
  readonly 'backupFiles.inspectGroup.skipped': "已一致（无需处理）";
  readonly 'backupFiles.inspectGroup.others': "其他";
  readonly 'report.export.title': "导出完成";
  readonly 'report.import.title': "导入结果";
  readonly 'report.rollback.title': "回滚报告";
  readonly 'report.action.fixIssues': "查看失败项";
  readonly 'report.action.viewDetails': "查看详情";
  readonly 'report.action.done': "完成";
  readonly 'report.needsRestart': "插件 / MCP 变更将在重启 DSH 后生效。";
  readonly 'nextSteps.title': "接下来需要处理";
  readonly 'nextSteps.done': "全部完成，无需额外处理";
  readonly 'nextSteps.restart.title': "重启 DSH 后生效（{count}）";
  readonly 'nextSteps.restart.hint': "以下变更需要重启 DSH 才会生效：";
  readonly 'nextSteps.secrets.title': "补录凭据（{count}）";
  readonly 'nextSteps.secrets.hint': "以下凭据未随备份导出，需在本机手动补录：";
  readonly 'nextSteps.unresolved.title': "失败 / 已跳过（{count}）";
  readonly 'nextSteps.unresolved.hint': "以下项未成功应用，可在结果页点击「重试」：";
  readonly 'error.title': "操作失败";
  readonly 'error.hint': "错误消息已自动脱敏，不会泄露任何密钥信息。";
  readonly 'starPrompt.title': "喜欢 Config Manager 吗？";
  readonly 'starPrompt.body': "如果你觉得这个插件有用，欢迎到 GitHub 点个 ⭐ Star 支持一下——你的支持是持续维护的最大动力！";
  readonly 'starPrompt.star': "去点 Star";
  readonly 'starPrompt.dismiss': "不再提示";
  readonly 'about.title': "关于 DSH Config Manager";
  readonly 'about.subtitle': "插件信息、作者与反馈入口";
  readonly 'about.official': "官方";
  readonly 'about.version': "版本 {version}";
  readonly 'about.dshVersion': "DSH {version}";
  readonly 'about.links': "相关链接";
  readonly 'about.star': "⭐ 在 GitHub 上点赞";
  readonly 'about.repo': "GitHub 仓库";
  readonly 'about.docs': "使用文档";
  readonly 'about.issues': "反馈问题";
  readonly 'about.authorLabel': "作者";
  readonly 'about.loading': "正在获取版本信息…";
  readonly 'about.retryStatus': "重新获取";
  readonly 'about.releaseNotes': "更新内容";
  readonly 'about.releaseNotes.title': "版本更新内容";
  readonly 'about.releaseNotes.loading': "正在获取更新内容…";
  readonly 'about.releaseNotes.loadingMore': "正在加载更多版本…";
  readonly 'about.releaseNotes.empty': "暂无版本发布记录。";
  readonly 'about.releaseNotes.error': "获取更新内容失败，请检查网络连接或稍后重试。";
  readonly 'about.releaseNotes.retry': "重试";
  readonly 'about.releaseNotes.viewOnGithub': "在 GitHub 上查看全部 Releases";
  readonly 'about.releaseNotes.viewSingleOnGithub': "在 GitHub 上查看此版本";
  readonly 'about.releaseNotes.allLoaded': "已加载全部版本记录";
  readonly 'about.releaseNotes.prerelease': "预发布";
  readonly 'about.releaseNotes.latest': "最新";
  readonly 'about.releaseNotes.noBody': "该版本暂无详细更新说明。";
  readonly 'about.releaseNotes.confirm': "确认";
  readonly 'about.releaseNotes.neverShow': "永不提示";
  readonly 'about.cli.title': "CLI 救援工具";
  readonly 'about.cli.hint': "GUI 运行在 DSH 内部——DSH 无法启动时，独立安装的 CLI（dsh-config-manager）是第一救援手段：列快照 / 离线恢复 / 一键重装 DSH，全程无需 DSH 运行。安装一次即可在任何机器上用：";
  readonly 'about.cli.docs': "CLI 使用文档";
  readonly 'profiles.title': "配置档案";
  readonly 'profiles.subtitle': "把当前 DSH 配置保存为多套档案（Work / Personal / …），随时切换；切换含预览 + 自动快照 + 失败回滚。";
  readonly 'profiles.save.title': "保存当前配置为档案";
  readonly 'profiles.save.hint': "输入档案名并保存：内容复用导出管道（不含密钥），文件类分区（技能/预设）一并内嵌。";
  readonly 'profiles.save.placeholder': "例如 Work / Personal / Minimal";
  readonly 'profiles.save.action': "保存档案";
  readonly 'profiles.save.saving': "保存中…";
  readonly 'profiles.nameInvalid': "档案名不合法：仅允许字母数字与常见字符，禁止路径分隔符（/ \\）与 ..";
  readonly 'profiles.name': "档案名";
  readonly 'profiles.sections': "分区";
  readonly 'profiles.updatedAt': "更新时间";
  readonly 'profiles.loading': "加载档案中…";
  readonly 'profiles.empty': "暂无档案。先保存一份当前配置即可开始。";
  readonly 'profiles.switch': "切换";
  readonly 'profiles.previewHint': "点击查看切换预览（只读）";
  readonly 'profiles.rename': "重命名";
  readonly 'profiles.delete': "删除";
  readonly 'profiles.renameTitle': "重命名档案";
  readonly 'profiles.renameMessage': "将档案「{name}」重命名为：";
  readonly 'profiles.deleteTitle': "删除档案";
  readonly 'profiles.deleteMessage': "确认删除档案「{name}」？该组配置快照将被永久删除，不可恢复。";
  readonly 'profiles.import.title': "导入档案";
  readonly 'profiles.import.hint': "导入导出的 profile.json 文件（本机或他机导出的档案，含文件类分区内嵌数据）。";
  readonly 'profiles.import.choose': "选择 JSON 文件";
  readonly 'profiles.switchPreviewTitle': "切换预览：{name}";
  readonly 'profiles.previewing': "正在分析切换计划…";
  readonly 'profiles.previewSummary': "切换影响";
  readonly 'profiles.previewWillChange': "将变更 {count} 项";
  readonly 'profiles.previewUnchanged': "已一致 {count} 项";
  readonly 'profiles.previewConflicts': "冲突 {count}";
  readonly 'profiles.previewSecrets': "需补录密钥 {count}";
  readonly 'profiles.previewRestart': "需重启 DSH 生效";
  readonly 'profiles.previewNote': "以上为只读预览（零写入）。确认后会自动创建快照并执行，失败时整体回滚。";
  readonly 'profiles.previewSections': "档案包含的分区";
  readonly 'profiles.previewItems': "变更明细";
  readonly 'profiles.switchConfirm': "确认切换";
  readonly 'profiles.switching': "切换中…（自动快照 + 分阶段应用）";
  readonly 'profiles.switchDone': "切换完成：{count} 项已应用";
  readonly 'profiles.switchFailed': "切换失败（部分项未应用）";
  readonly 'profiles.switchRolledBack': "切换失败，已整体回滚";
};
/** 字典键联合（注册处 compile-time 校验） */
type ConfigManagerKey = keyof typeof zh$3;
//#endregion
//#region src/client/sync/sync-locales.d.ts
/**
 * 远程同步设置区块（config-manager-sync）表面文案：zh 为源语言，en 镜像每个键。
 * 独立命名空间、独立文件：不触碰共享的 locales.ts（并行会话已改），零冲突。
 * 键集合经 `SyncKey` 类型在 client/index.ts 注册处做编译期校验。
 */
declare const zh$2: {
  readonly 'section.label': "远程同步";
  readonly 'section.description': "通过 Git 私有仓库在设备间同步可移植配置（密钥永不参与同步）";
  readonly privateRepoHint: "安全要求：同步仓库必须为私有仓库（public 仓库会公开你的配置内容）。认证 token 仅用于仓库访问，绝不写入同步文件、提交内容或日志。";
  readonly 'config.title': "仓库配置";
  readonly 'config.repoUrl': "仓库地址";
  readonly 'config.repoUrlHint': "Git 私有仓库地址（https / ssh / 本地路径）。认证 token 请使用下方凭据字段，不要拼入地址。";
  readonly 'config.token': "认证 token";
  readonly 'config.tokenHint': "将安全写入 DSH credentials（引用名 {ref}），不会写入同步文件或日志。留空表示沿用已保存的凭据。";
  readonly 'config.tokenSaved': "凭据已配置";
  readonly 'config.tokenPlaceholder': "ghp_…（可选）";
  readonly 'config.save': "保存配置";
  readonly 'config.saving': "保存中…";
  readonly 'config.saveHint': "表单改动会自动保存（密码/token 安全写入 DSH credentials，不会写入同步文件或日志）；也可点击按钮立即保存。";
  readonly 'channel.title': "同步通道";
  readonly 'channel.git': "Git 私有仓库";
  readonly 'channel.webdav': "WebDAV 服务器";
  readonly 'channel.perChannelHint': "GitHub 与 WebDAV 通道的自动同步、同步模式、加密与远端快照各自独立配置。";
  readonly 'channel.open': "配置同步通道";
  readonly 'channel.openHint': "远程同步通过「同步通道」进行：Git 私有仓库或 WebDAV 服务器。点击按钮在弹窗中配置或修改。";
  readonly 'channel.configured': "已配置";
  readonly 'channel.notConfigured': "未配置";
  readonly 'channel.currentUrl': "当前地址";
  readonly 'webdav.title': "WebDAV 配置";
  readonly 'webdav.url': "服务器地址";
  readonly 'webdav.urlHint': "WebDAV 服务器根地址（https://…）。同步快照与索引存放于该地址的 dsh-config-manager/ 子目录下。请勿在地址中包含用户名/密码。";
  readonly 'webdav.username': "用户名";
  readonly 'webdav.usernameHint': "HTTP Basic 认证用户名（非敏感，可回显）。";
  readonly 'webdav.password': "密码";
  readonly 'webdav.passwordHint': "将安全写入 DSH credentials（引用名 {ref}），不会写入同步文件或日志。留空表示沿用已保存的凭据。";
  readonly 'webdav.passwordSaved': "凭据已配置";
  readonly 'webdav.passwordPlaceholder': "密码（可选）";
  readonly 'webdav.presetHint': "选择常见 WebDAV 服务器可快速填入地址；含 <占位符> 的模板请替换为你的真实服务器/用户名。";
  readonly 'github.title': "GitHub 登录";
  readonly 'github.description': "通过 GitHub OAuth 设备码流程授权：无需手动输入 token，在浏览器中确认授权后，token 自动写入 DSH credentials。";
  readonly 'github.login': "使用 GitHub 登录";
  readonly 'github.retry': "重新登录";
  readonly 'github.cancel': "取消";
  readonly 'github.tokenInvalid': "GitHub 登录已失效，请重新登录。";
  readonly 'github.userCode': "一次性授权代码";
  readonly 'github.openAuth': "打开 GitHub 授权页面";
  readonly 'github.clientIdHint': "需要插件配置 githubClientId（GitHub OAuth App 的 client_id）才能使用 GitHub 登录。";
  readonly 'status.title': "同步状态";
  readonly 'status.never': "从未同步";
  readonly 'action.push': "推送到远端";
  readonly 'action.pull': "拉取差异预览";
  readonly 'action.pushing': "正在推送…";
  readonly 'action.pulling': "正在拉取…";
  readonly 'push.title': "推送结果";
  readonly 'pull.title': "拉取差异预览";
  readonly 'pull.previewHint': "以上为只读差异预览，不会执行导入。当前版本暂不支持一键导入；如需应用远端配置，请使用「导入恢复」向导手动导入导出的备份。";
  readonly 'pull.needsReview': "包含需要人工决策的项（冲突 / 密钥 / 依赖 / 安装）";
  readonly 'pull.empty': "远端快照与本地一致（无变更）";
  readonly 'change.total': "共 {total} 项变更";
  readonly 'sections.title': "同步分区";
  readonly 'warnings.title': "分区告警";
  readonly 'syncflow.title': "一键同步";
  readonly 'syncflow.button': "一键同步";
  readonly 'syncflow.syncing': "正在同步…";
  readonly 'syncflow.syncFailed': "同步失败";
  readonly 'syncflow.snapshotOption': "（{date} · {count} 分区）";
  readonly 'syncflow.selectSnapshot': "选择历史快照";
  readonly 'syncflow.refreshSnapshots': "刷新快照列表";
  readonly 'syncflow.refreshingSnapshots': "正在获取…";
  readonly 'syncflow.latestSnapshot': "最新快照";
  readonly 'syncflow.noSnapshots': "远端暂无快照";
  readonly 'syncflow.confirmImport': "确认导入";
  readonly 'syncflow.cancel': "取消";
  readonly 'syncflow.adoptRemote': "采用远端";
  readonly 'syncflow.adoptHint': "勾选 = 导入该项；取消 = 跳过";
  readonly 'syncflow.needsReviewBadge': "需人工决策";
  readonly 'syncflow.empty': "远端快照与本地一致（无变更）";
  readonly 'syncflow.diffCount': "共 {count} 项差异";
  readonly 'syncflow.keepLocalAll': "全部保留当前配置";
  readonly 'syncflow.useRemoteAll': "全部使用备份配置";
  readonly 'syncflow.bulkHint': "批量决策仅作用于冲突项；其余差异默认自动采用。";
  readonly 'syncflow.conflictTitle': "冲突解决";
  readonly 'syncflow.conflictUseLocal': "保留当前";
  readonly 'syncflow.conflictUseRemote': "使用备份";
  readonly 'syncflow.conflictLocalLabel': "当前";
  readonly 'syncflow.conflictRemoteLabel': "备份";
  readonly 'syncflow.conflictAncestorLabel': "共同祖先";
  readonly 'syncflow.conflictUnresolved': "冲突项 {itemId} 尚未选择解决方式（保留当前 / 使用备份）";
  readonly 'syncflow.diff': "差异";
  readonly 'syncflow.importDone': "已导入 {n} 个分区";
  readonly 'syncflow.importFailed': "导入失败（已整体回滚）";
  readonly 'syncflow.importedSections': "已写入";
  readonly 'syncflow.importWarnings': "导入告警";
  readonly 'syncflow.rollback': "回滚到应用前";
  readonly 'syncflow.rollingBack': "正在回滚…";
  readonly 'syncflow.rollbackDone': "已回滚到应用前";
  readonly 'syncflow.needsRestart': "部分改动需要重启 DSH 后生效";
  readonly 'syncflow.pushPreviewTitle': "确认推送";
  readonly 'syncflow.pushPreviewSections': "将推送的分区";
  readonly 'syncflow.pushConfirm': "确认推送";
  readonly 'syncflow.pushing': "正在推送…";
  readonly 'syncflow.pushFirstBaseline': "远端暂无快照：本次将创建首个同步基线";
  readonly 'mode.title': "同步模式";
  readonly 'mode.hint': "选择推送时导出哪些分区：默认 = 推荐分区一键推送（快速导出）；高级 = 自定义勾选（自定义导出）。";
  readonly 'mode.default': "默认（快速导出）";
  readonly 'mode.defaultHint': "一键推送全部推荐分区（settings、providers、plugins、prompts、skills 等），无需配置。";
  readonly 'mode.advanced': "高级（自定义导出）";
  readonly 'mode.advancedHint': "手动勾选要推送的分区（等同导出备份的自定义导出）；仅可移植分区可参与同步。";
  readonly 'mode.sectionsTitle': "同步分区";
  readonly 'mode.sectionsHint': "仅可移植分区可同步：设备相关（插件文件、凭据状态、会话）与平台相关（MCP、工作区）分区不参与远程同步。";
  readonly 'mode.atLeastOne': "请至少勾选一个同步分区";
  readonly 'mode.defaultCount': "将同步 {n} 个推荐分区";
  readonly 'mode.sectionPortable': "可移植";
  readonly 'mode.sectionRecommended': "推荐";
  readonly 'mode.persistHint': "模式与分区选择已保存到本机：自动同步和手动推送都会使用此配置（重启后仍生效）。";
  readonly 'mode.security': "加密与密钥导出（安全选项）";
  readonly 'mode.encrypt': "加密备份";
  readonly 'mode.encryptHint': "用密码加密同步快照（AES-256-GCM）。密码仅本次推送使用、绝不落盘；自动同步无法解密加密快照，会自动跳过并在同步历史中提示。";
  readonly 'mode.password': "加密密码";
  readonly 'mode.passwordConfirm': "确认密码";
  readonly 'mode.passwordMismatch': "两次输入的密码不一致";
  readonly 'mode.passwordRequired': "加密必须设置密码";
  readonly 'mode.includeSecrets': "导出密钥";
  readonly 'mode.includeSecretsHint': "把真实凭据值写入加密快照（勾选时自动选中加密；密钥绝不进入未加密快照）。";
  readonly 'mode.encryptAutosyncNotice': "加密快照仅通过手动推送/拉取使用；自动同步无密码，遇到加密快照会跳过并在历史中提示。";
  readonly 'mode.decryptPassword': "解密密码（加密快照拉取/同步用，可选）";
  readonly 'mode.decryptPasswordHint': "拉取或一键同步遇到加密快照时输入；不输入则加密快照无法读取（自动同步会跳过并在历史中提示）。";
  readonly 'autosync.title': "自动同步";
  readonly 'autosync.description': "开启后，DSH 在后台保持配置一致：本地配置有改动时自动上传，检测到远端有新快照时才自动拉取合并；定时器仅作兜底轮询，无变化不重复动作。仅在无冲突且无需人工干预时才自动写入本地。";
  readonly 'autosync.enable': "启用自动同步";
  readonly 'autosync.interval': "兜底轮询间隔";
  readonly 'autosync.intervalHint': "间隔到点 / DSH 启动时检查远端是否有新快照，有才拉取合并（不上传本地）；本地配置改动会触发上传。";
  readonly 'autosync.interval5m': "5 分钟";
  readonly 'autosync.interval15m': "15 分钟";
  readonly 'autosync.interval30m': "30 分钟";
  readonly 'autosync.interval60m': "60 分钟";
  readonly 'autosync.interval6h': "6 小时";
  readonly 'autosync.interval12h': "12 小时";
  readonly 'autosync.interval24h': "24 小时";
  readonly 'autosync.status': "上次运行：{status}（{time}）";
  readonly 'autosync.statusNever': "从未运行";
  readonly 'autosync.nextRun': "下次约 {time} 后";
  readonly 'autosync.due': "已到同步时间，即将执行";
  readonly 'autosync.failCount': "连续失败 {n} 次";
  readonly 'autosync.running': "自动同步进行中…";
  readonly 'autosync.success': "成功";
  readonly 'autosync.skipped': "已跳过";
  readonly 'autosync.failed': "失败";
  readonly 'autosync.partial': "部分成功";
  readonly 'history.title': "同步历史";
  readonly 'history.empty': "尚无同步历史";
  readonly 'history.emptyHint': "完成首次 push / 一键同步 / 自动同步后，这里会显示记录。";
  readonly 'history.colTime': "时间";
  readonly 'history.colKind': "类型";
  readonly 'history.colDetail': "详情";
  readonly 'history.kindSnapshot': "快照";
  readonly 'history.kindAutosync': "自动同步";
  readonly 'history.sectionCount': "分区";
  readonly 'history.detail': "明细";
  readonly 'history.autosyncDirection': "方向：{direction}";
  readonly 'history.autosyncPull': "下载";
  readonly 'history.autosyncPush': "上传";
  readonly 'history.autosyncBoth': "双向";
  readonly 'history.autosyncSkipReason': "跳过原因：{reason}";
  readonly 'history.autosyncReasonConflict': "冲突";
  readonly 'history.autosyncReasonNoRemote': "无远端快照";
  readonly 'history.autosyncReasonNotConfigured': "未配置仓库";
  readonly 'history.autosyncReasonNetwork': "网络问题";
  readonly 'history.autosyncConflicted': "跳过冲突分区：{sections}";
  readonly 'history.autosyncApplied': "应用分区：{sections}";
  readonly 'history.autosyncError': "错误：{error}";
  readonly 'history.autosyncNotified': "已通知（连续失败 3 次）";
  readonly 'history.column.snapshot': "快照";
  readonly 'history.column.autosync': "自动同步";
  readonly 'history.channelGit': "GitHub";
  readonly 'history.channelWebdav': "WebDAV";
  readonly 'common.close': "关闭";
  readonly 'common.retry': "重试";
  readonly 'common.loading': "加载中…";
};
/** 字典键联合（注册处 compile-time 校验） */
type SyncKey = keyof typeof zh$2;
//#endregion
//#region src/client/market/market-locales.d.ts
/**
 * 配置市场区块（config-manager-market）表面文案：zh 为源语言，en 镜像每个键。
 * 独立命名空间、独立文件：与 config-manager / config-manager-sync 平行，不触碰共享字典。
 *
 * 双层文案分工（与 SyncSettingsView 同款）：
 *  - 本命名空间（TranslateNS<'config-manager-market'>）= React 壳文案（标题 / 表单 / 按钮 / 列表控件）；
 *  - 纯渲染模型文案（market-view.ts 产出，如供应链警示、状态行、条目徽章文本）走共享
 *    `src/ui/i18n.ts` 的 `market.*` 键（UiT），由 MarketApi.t 提供 —— 与 sync-view.ts 用 `sync.*` 同构。
 *
 * 键集合经 `MarketKey` 类型在 client/index.ts 注册处做编译期校验。
 */
declare const zh$1: {
  readonly 'section.label': "配置市场";
  readonly 'section.description': "浏览并下载社区共享的配置（公开 Git 仓库；下载内容一律视为不可信，导入前必经校验与确认）";
  readonly 'config.title': "市场仓库";
  readonly 'config.refresh': "拉取最新";
  readonly 'config.refreshing': "拉取中…";
  readonly 'list.empty': "内置市场尚未加载。请先「拉取最新」。";
  readonly 'list.browse': "浏览";
  readonly 'list.loading': "正在读取市场…";
  readonly 'list.noItems': "该市场暂无条目。";
  readonly 'list.searchPlaceholder': "搜索名称 / 作者 / 描述…";
  readonly 'list.categoriesAll': "全部类别";
  readonly 'list.sectionsAll': "全部分区";
  readonly 'list.sectionsUnknown': "另有 {count} 个条目未下载，无法按分区匹配";
  readonly 'list.sourceAll': "全部来源";
  readonly 'list.sourceOfficial': "官方配置";
  readonly 'list.sourcePersonal': "个人配置";
  readonly 'list.sortDefault': "默认排序";
  readonly 'list.sortUpdated': "最新更新";
  readonly 'list.sortStars': "⭐ 最多";
  readonly 'list.sortName': "名称 A–Z";
  readonly 'list.stars': "⭐ {count}";
  readonly 'list.starsHint': "来源仓库 star 数（仓库级，非本条目）";
  readonly 'list.count': "共 {count} 个条目";
  readonly 'list.filtered': "（筛选后 {count} 个）";
  readonly 'list.cacheCached': "已缓存";
  readonly 'list.cacheFresh': "刚刚拉取";
  readonly 'list.cacheNone': "未缓存";
  readonly 'list.download': "查看详情";
  readonly 'detail.title': "条目详情";
  readonly 'detail.downloadedAt': "下载时间：{time}";
  readonly 'detail.version': "版本 {version}";
  readonly 'detail.errors': "校验错误：";
  readonly 'detail.emptySections': "该条目未包含任何可导入分区";
  readonly 'detail.needReview': "需要人工确认";
  readonly 'detail.previewHint': "以下为只读预览（不会改动任何设置）。确认导入将复用现有安全管道（快照 + 校验 + 失败回滚）。";
  readonly 'detail.impact.willChange': "将变更 {count} 项";
  readonly 'detail.impact.unchanged': "已一致 {count} 项";
  readonly 'detail.impact.conflicts': "冲突 {count}";
  readonly 'detail.impact.secrets': "需补录密钥 {count}";
  readonly 'detail.impact.paths': "路径映射 {count}";
  readonly 'detail.impact.restart': "需重启 DSH 生效";
  readonly 'detail.import': "确认导入";
  readonly 'detail.back': "返回列表";
  readonly 'detail.approval.title': "逐分区批准导入";
  readonly 'detail.approval.highRiskHint': "以下分区涉及安装插件 / 写入文件 / 注入全局指令 / 注册 MCP / 恢复会话，属高风险变更，默认不导入；如需导入请逐项勾选。";
  readonly 'detail.approval.requiresApproval': "需逐项批准";
  readonly 'detail.approval.safe': "可导入";
  readonly 'detail.approval.count': "已批准 {selected}/{total} 分区";
  readonly 'detail.noApproval': "未批准任何分区，无法导入";
  readonly 'myconfigs.tab.browse': "浏览市场";
  readonly 'myconfigs.tab.myconfigs': "我的配置";
  readonly 'myconfigs.back': "返回市场";
  readonly 'myconfigs.login.title': "GitHub 登录";
  readonly 'myconfigs.login.hint': "登录后即可一键上传配置到你的公开仓库（自动创建 <login>/dsh-configs）并提交官方市场收录（目标仓库固定，不可修改）。";
  readonly 'myconfigs.login.checking': "正在检查登录状态…";
  readonly 'myconfigs.login.loggedInAs': "已登录：{login}";
  readonly 'myconfigs.login.targetRepo': "收录目标（固定）：{repo}";
  readonly 'myconfigs.login.repoMissing': "配置仓库尚未创建，首次上传将自动创建（公开）";
  readonly 'myconfigs.login.repoReady': "配置仓库：{repo}";
  readonly 'myconfigs.login.start': "使用 GitHub 登录";
  readonly 'myconfigs.login.relogin': "重新登录";
  readonly 'myconfigs.login.cancel': "取消登录";
  readonly 'myconfigs.login.userCode': "一次性代码：{code}";
  readonly 'myconfigs.login.openAuth': "打开授权页";
  readonly 'myconfigs.upload.title': "一键上传";
  readonly 'myconfigs.upload.selectHint': "选择导出的配置 zip（先在「导出」tab 生成备份文件，再回到这里选择）。市场通道永不携带秘密——包含密钥的备份将被拒绝。";
  readonly 'myconfigs.upload.select': "选择 ZIP…";
  readonly 'myconfigs.upload.reselect': "重新选择";
  readonly 'myconfigs.upload.selected': "已选择：{name}";
  readonly 'myconfigs.upload.validate': "开始校验";
  readonly 'myconfigs.upload.validating': "校验中…";
  readonly 'myconfigs.upload.validateOk': "校验通过：内容合法、不含密钥";
  readonly 'myconfigs.upload.validateSecrets': "包含密钥：市场通道永不携带秘密，拒绝上传";
  readonly 'myconfigs.upload.validateInvalid': "内容校验未通过，无法上传";
  readonly 'myconfigs.upload.form.title': "条目信息";
  readonly 'myconfigs.upload.form.name': "名称";
  readonly 'myconfigs.upload.form.nameHint': "预填 zip 文件名，可修改";
  readonly 'myconfigs.upload.form.description': "描述（可选）";
  readonly 'myconfigs.upload.form.categories': "类别（可选，逗号分隔）";
  readonly 'myconfigs.upload.form.autoHint': "以下字段由系统自动生成：";
  readonly 'myconfigs.upload.mode.title': "发布模式";
  readonly 'myconfigs.upload.mode.migrate': "迁移（保留全部内容）";
  readonly 'myconfigs.upload.mode.share': "分享（自动排除敏感内容）";
  readonly 'myconfigs.upload.mode.shareHint': "分享模式将自动排除设备/平台相关分区（凭据状态 / 会话 / MCP / 工作区等），并对隐私内容强制拦截——发现任何敏感痕迹将拒绝发布，而不是仅警告。";
  readonly 'myconfigs.upload.run': "一键上传";
  readonly 'myconfigs.upload.running': "上传中…";
  readonly 'myconfigs.update.title': "更新配置";
  readonly 'myconfigs.update.hint': "版本将自动 +1，已预填原条目信息（名称可改）。";
  readonly 'myconfigs.update.run': "一键更新";
  readonly 'myconfigs.update.running': "更新中…";
  readonly 'myconfigs.update.zipHint': "更新需要新的配置包：选择新 zip 后自动校验，通过后即可一键更新。";
  readonly 'myconfigs.update.selectZip': "选择新 ZIP…";
  readonly 'myconfigs.result.title': "上传/更新完成";
  readonly 'myconfigs.result.version': "版本 {version}";
  readonly 'myconfigs.result.sha256': "SHA-256：{hash}";
  readonly 'myconfigs.result.sections': "分区：{sections}";
  readonly 'myconfigs.result.repo': "配置仓库";
  readonly 'myconfigs.result.openRepo': "打开仓库";
  readonly 'myconfigs.result.pr': "收录 PR #{number}";
  readonly 'myconfigs.result.openPr': "查看 PR";
  readonly 'myconfigs.result.listingPending': "已上传 ✓ 正在后台提交收录（fork + 收录 PR），稍后列表状态自动更新";
  readonly 'myconfigs.result.listingFailed': "收录失败";
  readonly 'myconfigs.result.relist': "重新提交收录";
  readonly 'myconfigs.list.title': "已上传";
  readonly 'myconfigs.list.empty': "尚未上传任何配置";
  readonly 'myconfigs.list.loading': "正在读取…";
  readonly 'myconfigs.list.refresh': "刷新";
  readonly 'myconfigs.list.summary': "共 {total} 条 · {listed} 已收录 · {pending} 待审核 · {none} 未收录";
  readonly 'myconfigs.list.openRepo': "打开仓库";
  readonly 'myconfigs.item.update': "更新";
  readonly 'myconfigs.item.install': "装回本地";
  readonly 'myconfigs.item.openPr': "查看收录 PR";
  readonly 'myconfigs.delete.run': "删除";
  readonly 'myconfigs.delete.confirm': "确认删除";
  readonly 'myconfigs.delete.confirmTitle': "删除条目";
  readonly 'myconfigs.delete.confirmText': "确认删除？该操作会从配置仓库永久删除该条目的索引与文件（不可恢复）";
  readonly 'myconfigs.delete.delistStarted': "已删除本地条目，并自动提交「下架 PR」（官方市场移除需人工合并，期间市场可能仍显示该条目）";
  readonly 'myconfigs.delete.prClosed': "已删除本地条目，并关闭该条目的待审核收录 PR";
  readonly 'disclaimer.title': "免责声明";
  readonly 'disclaimer.upload.text': "你即将把配置上传到你的公开仓库（<login>/dsh-configs）并提交官方市场收录申请。\n\n上传后内容将对所有人公开可见，且需经过人工审核才能进入官方市场。请确保：\n· 内容不包含任何真实密钥 / 凭据（环境变量引用如 $VAR 是安全的）；\n· 内容不包含个人隐私或本地环境信息；\n· 你有权分享这些配置。";
  readonly 'disclaimer.download.text': "你即将从公共网络市场下载配置并导入本地。\n\n下载内容属于不可信输入：未经官方审核、可能包含风险（安装插件 / 写入文件 / 修改设置）。\n· 导入前会逐项展示并校验，高风险分区默认不导入、需逐项批准；\n· 导入会先自动创建快照，失败可回滚；\n· 请核对来源与内容后再确认导入。";
  readonly 'disclaimer.install.text': "你即将把配置从你的公开仓库装回本地。\n\n该内容属于你此前上传的配置，但同样会经过安全校验与逐分区批准：\n· 高风险分区默认不导入、需逐项批准；\n· 导入前自动创建快照，失败可回滚。";
  readonly 'disclaimer.confirm': "我已了解，继续";
  readonly 'disclaimer.dontAsk': "不再提示（该操作以后不再显示免责声明）";
  readonly 'myconfigs.error.loadStatus': "登录状态读取失败";
  readonly 'myconfigs.error.loadItems': "已上传列表读取失败";
  readonly 'common.cancel': "取消";
  readonly 'common.close': "关闭";
  readonly 'common.retry': "重试";
  readonly 'common.loading': "加载中…";
  readonly 'common.unknownError': "未知错误";
};
/** 字典键联合（注册处 compile-time 校验） */
type MarketKey = keyof typeof zh$1;
//#endregion
//#region src/client/recovery/recovery-locales.d.ts
/**
 * Recovery 区块（config-manager-recovery）表面文案：zh 为源语言，en 镜像每个键。
 * 独立命名空间、独立文件：不触碰共享的 locales.ts（并行会话已改），零冲突。
 * 键集合经 `RecoveryKey` 类型在 client/index.ts 注册处做编译期校验。
 *
 * 覆盖（§10.2 / Step 8 要求）：Recovery Required / Rollback Recommended / Recovery In Progress /
 * Verification / Verified / Partial Match / Mismatch / Verification Error / Needs Attention /
 * Preview / Confirm / Execute / Verify / Retry / Dismiss / Quarantine / Snapshot / Operation /
 * Environment / Manual Action Required。
 */
declare const zh: {
  readonly 'common.cancel': "取消";
  readonly 'common.retry': "重试";
  readonly 'common.unknownError': "未知错误";
  readonly 'view.recovery': "恢复";
  readonly 'recovery.banner': "配置修改已被保护：存在未完成的恢复事项。请先处理后继续。";
  readonly 'recovery.bannerAction': "去处理";
  readonly 'recovery.required': "需要恢复";
  readonly 'recovery.requiredHint': "检测到一次操作未正常完成，为安全起见已暂停所有会修改配置的操作。请处理以下恢复事项以恢复正常。";
  readonly 'recovery.rollbackRecommended': "建议回滚";
  readonly 'recovery.rollbackContinue': "续跑回滚";
  readonly 'recovery.inProgress': "恢复进行中";
  readonly 'recovery.verified': "已验证";
  readonly 'recovery.partialMatch': "部分匹配";
  readonly 'recovery.mismatch': "不匹配";
  readonly 'recovery.verificationError': "验证错误";
  readonly 'recovery.needsAttention': "需要人工处理";
  readonly 'recovery.manualActionRequired': "需要人工处理";
  readonly 'recovery.incident.title': "发生了什么";
  readonly 'recovery.incident.operationId': "操作 ID";
  readonly 'recovery.incident.operationType': "操作类型";
  readonly 'recovery.incident.createdAt': "发生时间";
  readonly 'recovery.incident.reason': "原因";
  readonly 'recovery.incident.decision': "建议";
  readonly 'recovery.incident.state': "状态";
  readonly 'recovery.incident.state.recovering': "恢复中";
  readonly 'recovery.incident.state.needsAttention': "需人工处理";
  readonly 'recovery.incident.state.rolledBack': "已回滚";
  readonly 'recovery.incident.state.recovered': "已恢复";
  readonly 'recovery.incident.state.committed': "已完成";
  readonly 'recovery.incident.state.unknown': "未知";
  readonly 'recovery.decision.unknown': "未知";
  readonly 'recovery.verify.verdict.unknown': "未知";
  readonly 'recovery.currentState.title': "当前状态";
  readonly 'recovery.currentState.safeMode': "已进入安全模式（会修改配置的操作已暂停）";
  readonly 'recovery.currentState.safeModeCleared': "已恢复正常，可继续操作";
  readonly 'recovery.currentState.hasSnapshot': "存在可信恢复快照";
  readonly 'recovery.currentState.noSnapshot': "无可信恢复快照";
  readonly 'recovery.snapshot.title': "恢复快照";
  readonly 'recovery.snapshot.id': "快照 ID";
  readonly 'recovery.snapshot.createdAt': "快照时间";
  readonly 'recovery.snapshot.operationType': "快照操作";
  readonly 'recovery.snapshot.verdict': "快照校验";
  readonly 'recovery.snapshot.verdict.trusted': "可信（与本次操作绑定）";
  readonly 'recovery.snapshot.verdict.manual': "手动/本地快照（本次操作外）";
  readonly 'recovery.snapshot.verdict.legacy': "旧快照（需显式确认）";
  readonly 'recovery.snapshot.verdict.wrongEnv': "环境不匹配";
  readonly 'recovery.snapshot.verdict.corrupt': "损坏";
  readonly 'recovery.snapshot.verdict.invalid': "非法";
  readonly 'recovery.snapshot.verdict.unsafe': "路径不安全";
  readonly 'recovery.snapshot.verdict.unknown': "未知";
  readonly 'recovery.environment.title': "环境";
  readonly 'recovery.environment.compatible': "环境匹配";
  readonly 'recovery.environment.incompatible': "环境不匹配（可能来自其他机器/安装）";
  readonly 'recovery.preview.title': "恢复预览";
  readonly 'recovery.preview.hint': "以下为只读预览（零写入）。确认后才会执行恢复。";
  readonly 'recovery.preview.loading': "正在生成预览…";
  readonly 'recovery.preview.empty': "该操作无可用恢复动作（或全部跳过）。";
  readonly 'recovery.preview.action': "动作";
  readonly 'recovery.preview.detail': "说明";
  readonly 'recovery.preview.summary': "将执行 {count} 个动作";
  readonly 'recovery.confirm.title': "确认恢复";
  readonly 'recovery.confirm.message': "恢复/回滚是危险操作。确认执行？系统会先把当前文件备份到一个安全位置。";
  readonly 'recovery.confirm.rollbackContinue': "继续完成刚才中断的撤销（已完成的部分会自动跳过，不重复执行）。";
  readonly 'recovery.confirm.retry': "验证失败后重试恢复。确认再次执行？";
  readonly 'recovery.confirm.dismiss': "放弃恢复？该操作会被隔离保存，相关快照与操作记录会保留，但不会自动恢复。";
  readonly 'recovery.confirm.dismissTitle': "放弃恢复";
  readonly 'recovery.execute': "执行恢复";
  readonly 'recovery.executing': "恢复执行中…";
  readonly 'recovery.retry': "重试";
  readonly 'recovery.retrying': "重试中…";
  readonly 'recovery.verify': "验证";
  readonly 'recovery.verifying': "验证中…";
  readonly 'recovery.dismiss': "放弃恢复";
  readonly 'recovery.dismissing': "放弃中…";
  readonly 'recovery.continue': "续跑";
  readonly 'recovery.verify.title': "验证结果";
  readonly 'recovery.verify.details': "检查明细";
  readonly 'recovery.verify.manualHints': "需人工处理";
  readonly 'recovery.verify.verdict.match': "验证通过：目标状态与可信快照匹配";
  readonly 'recovery.verify.verdict.partial': "验证通过（部分匹配）：核心状态匹配，但存在无法自动验证的项";
  readonly 'recovery.verify.verdict.mismatch': "验证失败：目标状态与可信快照不匹配，恢复未完成";
  readonly 'recovery.verify.verdict.error': "验证错误：无法可靠完成验证，恢复未完成";
  readonly 'recovery.verify.terminal.rolledBack': "已回滚";
  readonly 'recovery.verify.terminal.recovered': "已恢复";
  readonly 'recovery.verify.terminal.needsAttention': "需要人工处理";
  readonly 'recovery.completed': "恢复完成";
  readonly 'recovery.completed.rolledBack': "已回滚并验证通过";
  readonly 'recovery.completed.recovered': "已恢复并验证通过";
  readonly 'recovery.needsAttention.title': "需要人工处理";
  readonly 'recovery.needsAttention.hint': "恢复未能完成或验证失败。请查看原因，可重试或放弃。";
  readonly 'recovery.empty': "暂无需要处理的恢复事项。";
  readonly 'recovery.loading': "正在检查恢复状态…";
  readonly 'recovery.error': "恢复状态加载失败";
  readonly 'recovery.actionError': "操作失败";
  readonly 'recovery.running': "恢复任务进行中";
  readonly 'recovery.runningHint': "恢复/回滚正在执行，请勿关闭页面。";
};
/** 字典键联合（注册处 compile-time 校验）。 */
type RecoveryKey = keyof typeof zh;
//#endregion
//#region src/client/history/history-locales.d.ts
type KindKey = `history.kind.${MigrationKind}`;
type ResultKey = `history.result.${MigrationResult}`;
type CommonKey = 'view.history' | 'history.title' | 'history.subtitle' | 'history.empty' | 'history.loading' | 'history.corruptedBanner' | 'history.corruptedCount' | 'history.stats.total' | 'history.stats.success' | 'history.stats.failed' | 'history.stats.skipped' | 'history.filter.kind' | 'history.filter.result' | 'history.filter.recent' | 'history.filter.recent.all' | 'history.filter.recent.50' | 'history.filter.recent.200' | 'history.filter.sections' | 'history.filter.title' | 'history.search.placeholder' | 'history.export.json' | 'history.export.markdown' | 'history.exported' | 'history.exporting' | 'history.exportError' | 'history.loadError' | 'history.reload' | 'history.table.time' | 'history.table.kind' | 'history.table.result' | 'history.table.sections' | 'history.table.summary' | 'history.updatedAt' | 'history.refresh';
type HistoryKey = KindKey | ResultKey | CommonKey;
//#endregion
//#region src/client/ConfigManagerSection.d.ts
type ConfigManagerSectionProps = PropsRuntime<'settings.section'> & ConfigManagerSectionInjected & {
  t: TranslateNS<'config-manager'>;
};
//#endregion
//#region src/client/export/ExportView.d.ts
interface ExportViewProps {
  api: ConfigManagerApi;
  t: TranslateNS<'config-manager'>;
}
//#endregion
//#region src/client/import/ImportWizardView.d.ts
interface ImportWizardViewProps {
  api: ConfigManagerApi;
  t: TranslateNS<'config-manager'>;
}
//#endregion
//#region src/client/sync/SyncSettingsView.d.ts
interface SyncSettingsViewProps {
  api: SyncApi;
  t: TranslateNS<'config-manager-sync'>;
}
//#endregion
//#region src/client/market/MarketPanel.d.ts
interface MarketPanelProps {
  api: MarketApi;
  /** 「我的配置」API（/me/* 端点：登录态/一键上传/查看已上传/一键更新；登录复用 SyncApi.github*） */
  myConfigsApi: MyConfigsApi;
  /** 确认导入复用的主 ConfigManagerApi（executeImportPlan：安全阀 + 回滚） */
  importApi: ConfigManagerApi;
  /** GitHub 登录 API（「我的配置」登录卡复用 sync github device flow，同 token 槽） */
  syncApi: SyncApi;
  t: TranslateNS<'config-manager-market'>;
}
//#endregion
//#region src/client/about/AboutPanel.d.ts
interface AboutPanelProps {
  api: ConfigManagerApi;
  t: TranslateNS<'config-manager'>;
}
//#endregion
//#region src/client/index.d.ts
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Config Manager 表面文案。 */
    'config-manager': ConfigManagerKey;
    /** 远程同步设置区块文案（m-sync-ui）。 */
    'config-manager-sync': SyncKey;
    /** 配置市场区块文案（m-market-ui）。 */
    'config-manager-market': MarketKey;
    /** Recovery 区块文案（Phase 5）。 */
    'config-manager-recovery': RecoveryKey;
    /** Migration History 区块文案（Phase 6）。 */
    'config-manager-history': HistoryKey;
  }
}
/** 必需服务（fiber inject 等待 —— slots/locale 必须先就绪）。 */
declare const inject: string[];
/**
 * 注册 Config Manager 设置页。
 * @param ctx - client root context（slots + locale 服务）。
 */
declare function apply(ctx: ClientContext): void;
//#endregion
export { type AboutPanelProps, type ConfigManagerApiError, type ConfigManagerKey, type ConfigManagerSectionProps, type DownloadResult, type ExportViewProps, type HistoryKey, type ImportWizardViewProps, type MarketKey, type MarketPanelProps, type RecoveryKey, type ServiceStatus, type SyncKey, type SyncSettingsViewProps, type UploadResponse, apply, inject };

		return module.exports;
	}
});
//# sourceMappingURL=client.d.ts.map