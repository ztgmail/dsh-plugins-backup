window.__ModuleLoader__.load({
	id: "dsh-config-manager",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;

Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let react = require("react");
let react_jsx_runtime = require("react/jsx-runtime");
//#region src/ui/i18n.ts
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
const uiZh = {
	"commonClose": "关闭",
	"commonCancel": "取消",
	"commonRetry": "重试",
	"commonLoading": "加载中…",
	"commonUnknownError": "未知错误",
	"commonNext": "下一步",
	"commonBack": "上一步",
	"commonDone": "完成",
	"export.download": "下载备份文件",
	"export.running": "正在导出…",
	"export.run": "开始导出",
	"export.selectionWarnings": "以下分区为设备相关数据，跨设备导入时可能不适用：",
	"export.included": "已包含",
	"export.excluded": "未包含",
	"export.unknownSection": "未知分区：{id}",
	"export.deviceSpecific": "{label} 为设备相关数据（{portability}），跨设备导入时可能不适用",
	"report.backupCreated": "备份已创建",
	"report.importComplete": "导入完成",
	"report.importFailed": "导入失败",
	"report.tombstonedSkipped": "已按删除记录跳过 {count} 项",
	"report.included": "已包含：",
	"report.excluded": "未包含：",
	"report.security": "安全：",
	"report.apiKeysExcluded": "API 密钥已排除：",
	"report.containsSecrets": "包含密钥：",
	"report.encrypted": "已加密：",
	"report.redacted": "{count} 个敏感字段已脱敏",
	"report.file": "文件：",
	"report.yes": "是",
	"report.yesEncrypted": "是（加密）",
	"report.no": "否",
	"report.importedRestored": "已导入/恢复",
	"report.skipped": "跳过",
	"report.needAttention": "需注意",
	"report.failed": "失败",
	"report.noChanges": "无变更",
	"report.reason": "原因",
	"report.note": "说明",
	"report.unknownReason": "未知原因",
	"report.secrets": "密钥：",
	"report.credentialsNeedEntry": "{count} 个凭据需要补录",
	"report.restartRequired": "重启 DSH 后生效：{detail}",
	"report.restartPluginsMcp": "插件/MCP 更改将在重启 DSH 后生效",
	"report.rollbackFull": "回滚：已完整恢复导入前的配置。",
	"report.rollbackPartial": "回滚部分完成。",
	"report.rollbackManual": "以下项目可能需要人工恢复：",
	"report.restored": "已恢复：{count} 项",
	"error.notMounted": "config-manager 服务未挂载（插件未加载）：请确认 profile 中已安装 dsh-config-manager 并重启 DSH",
	"error.httpInvalidJson": "HTTP {status}: 无效的 JSON 响应",
	"error.fallback": "操作失败",
	"error.downloadFailed": "下载失败：HTTP {status}",
	"error.exportTimeout": "导出超时（{minutes} 分钟）：导出过程未完成，请重试；若反复超时请检查 DSH 状态",
	"error.syncTimeout": "同步请求超时（{minutes} 分钟）：请检查网络与仓库可达性后重试",
	"error.recoveryTimeout": "恢复请求超时（{minutes} 分钟）：恢复过程未完成，请重试；若反复超时请检查 DSH 状态",
	"error.settingsConflict.title": "配置已被并发修改",
	"error.settingsConflict.action": "目标 DSH 的该配置在导入期间被其他进程修改，为避免覆盖请重新导出或手动核对后再试。",
	"error.notConfirmed.title": "导入未确认",
	"error.notConfirmed.action": "请在预览页确认导入内容后重试。",
	"error.integrity.title": "备份完整性校验失败",
	"error.integrity.action": "备份文件可能已损坏或被篡改，请重新导出备份后再试。",
	"error.schema.title": "备份格式版本不受支持",
	"error.schema.action": "请升级 DSH Config Manager 或使用相同版本的备份文件。",
	"error.notFound.title": "文件或路径不存在",
	"error.notFound.action": "请检查文件路径是否正确、文件是否已被移动或删除。",
	"error.permission.title": "权限不足",
	"error.permission.action": "请检查目标目录的读写权限后重试。",
	"error.needsRestart.title": "插件安装需要重启生效",
	"error.needsRestart.action": "导入已完成，插件将在重启 DSH 后生效；请在 DSH Desktop 中重启服务。",
	"error.reason": "原因",
	"error.suggestedAction": "建议操作",
	"error.item": "相关项",
	"progress.analyzing": "正在分析配置…",
	"progress.exportingSettings": "正在导出设置…",
	"progress.scanningSecrets": "正在扫描密钥…",
	"progress.exportingPlugins": "正在导出插件…",
	"progress.creatingArchive": "正在创建归档…",
	"progress.calculatingChecksums": "正在核对文件完整性…",
	"progress.exporting": "正在导出配置…",
	"progress.validating": "正在校验备份…",
	"progress.checkingCompatibility": "正在检查兼容性…",
	"progress.creatingSnapshot": "正在创建安全快照…",
	"progress.restoringSettings": "正在恢复设置…",
	"progress.restoringPlugins": "正在恢复插件…",
	"progress.restoringMcp": "正在恢复 MCP…",
	"progress.validatingConfig": "正在校验配置…",
	"progress.rollingBack": "正在回滚…",
	"progress.executing": "正在应用配置（插件安装可能需要较长时间）…",
	"progress.done": "完成",
	"snapshots.createdAt": "创建时间",
	"snapshots.sourceZip": "来源",
	"snapshots.status": "状态",
	"snapshots.entries": "条目",
	"snapshots.plugins": "插件",
	"snapshots.statusPending": "待处理",
	"snapshots.statusDone": "已完成",
	"snapshots.statusRolledback": "已回滚",
	"snapshots.statusUnknown": "未知",
	"snapshots.planTitle": "恢复计划预览",
	"snapshots.confirmRestore": "确认恢复？会先把当前文件备份到一个安全位置，再删除导入期间新增的插件。",
	"snapshots.execute": "执行恢复",
	"snapshots.executing": "正在恢复…",
	"snapshots.restored": "已恢复",
	"snapshots.removedPlugins": "已卸载插件",
	"snapshots.manualHints": "需人工处理",
	"snapshots.failed": "失败",
	"snapshots.skipped": "跳过",
	"snapshots.noActions": "该快照无可恢复动作（或全部跳过）。",
	"snapshots.empty": "暂无快照。导入时会自动创建安全快照。",
	"snapshots.loading": "正在加载快照…",
	"snapshots.selectHint": "选择一个快照预览其恢复计划（只读预览，不会改动任何设置）：",
	"snapshots.reportTitle": "恢复报告",
	"sync.privateRepoHint": "安全要求：同步仓库必须为私有仓库（public 仓库会公开你的配置内容）。认证 token 仅用于仓库访问，绝不写入同步文件、提交内容或日志。",
	"sync.kind.create": "新增",
	"sync.kind.update": "更新",
	"sync.kind.skip": "跳过",
	"sync.kind.conflict": "冲突",
	"sync.kind.install": "安装",
	"sync.kind.missingSecret": "缺密钥",
	"sync.kind.missingDependency": "缺依赖",
	"sync.kind.pathMapping": "路径映射",
	"sync.kind.warning": "警告",
	"sync.kind.error": "错误",
	"sync.severity.error": "错误",
	"sync.severity.warning": "警告",
	"sync.severity.info": "信息",
	"sync.pushLabel": "推送到远端",
	"sync.pullLabel": "拉取差异预览",
	"sync.pushing": "正在推送…",
	"sync.pulling": "正在拉取…",
	"sync.statusLoading": "正在读取同步状态…",
	"sync.statusUnconfigured": "尚未配置同步仓库（请填写仓库地址并推送一次以保存配置）",
	"sync.credConfigured": "凭据已配置",
	"sync.credMissing": "未配置凭据（token 将在首次推送/拉取时写入 DSH credentials）",
	"sync.lastSync": "上次同步：{time}",
	"sync.neverSynced": "尚未同步过",
	"sync.neverSyncedShort": "从未同步",
	"sync.pushFailed": "推送失败",
	"sync.pushOk": "推送成功（快照 {id}）",
	"sync.pushPreviewHeadline": "将推送 {total} 个分区（{changed} 个有变化）",
	"sync.pushPreviewHint": "以上为只读预览，不会写入远端。确认后点击「推送」才真正上传。",
	"sync.pushPreviewEncrypted": "加密快照：载荷将整体加密，各分区相对基线的变化不可比对。",
	"sync.pullFailed": "拉取失败",
	"sync.pullOk": "远端快照 {id} 差异预览：共 {count} 项变更",
	"sync.pullEmpty": "远端快照与本地一致（无变更）",
	"sync.previewHint": "以上为只读差异预览，不会执行导入。当前版本暂不支持一键导入；如需应用远端配置，请使用「导入恢复」向导手动导入导出的备份。",
	"sync.syncTitle": "一键同步",
	"sync.syncButton": "一键同步",
	"sync.syncing": "正在同步…",
	"sync.syncHeadline": "远端快照 {id} 差异确认：共 {count} 项",
	"sync.syncEmpty": "远端快照与本地一致（无变更）",
	"sync.syncFailed": "同步失败",
	"sync.confirmAdopt": "采用远端",
	"sync.confirmSkip": "跳过",
	"sync.confirmRequired": "需要人工决策",
	"sync.needsReviewBadge": "需人工决策",
	"sync.selectSnapshot": "选择历史快照",
	"sync.latestSnapshot": "最新快照",
	"sync.noSnapshots": "远端暂无快照",
	"sync.confirmImport": "确认导入",
	"sync.cancelConfirm": "取消",
	"sync.conflictResolve": "冲突解决",
	"sync.conflictUseLocal": "用本地",
	"sync.conflictUseRemote": "用远端",
	"sync.conflictSkip": "跳过",
	"sync.conflictResolvedLocal": "已选：本地",
	"sync.conflictResolvedRemote": "已选：远端",
	"sync.conflictResolvedSkip": "已选：跳过",
	"sync.importDone": "已导入 {n} 个分区",
	"sync.importSkipped": "已跳过 {n} 项",
	"sync.importFailed": "导入失败（已整体回滚）",
	"sync.rollbackButton": "回滚到应用前",
	"sync.rollingBack": "正在回滚…",
	"sync.rollbackDone": "已回滚到应用前",
	"sync.appliedSections": "已写入",
	"sync.importWarnings": "导入告警",
	"sync.autosyncTitle": "自动同步",
	"sync.autosyncDesc": "开启后，DSH 将按固定间隔自动执行双向同步（拉取合并 + 上传）；DSH 启动时还会触发一次「自动下载合并（不上传）」以保持本地为最新。仅在无冲突且无需人工干预时才自动写入。",
	"sync.autosyncEnabled": "启用自动同步",
	"sync.autosyncInterval": "同步间隔",
	"sync.autosyncIntervalHint": "DSH 启动时自动下载合并不上传。",
	"sync.autosyncNever": "从未运行",
	"sync.autosyncLastRun": "上次运行：{time}",
	"sync.autosyncNextIn": "下次约 {time} 后",
	"sync.autosyncSuccess": "成功",
	"sync.autosyncSkipped": "已跳过",
	"sync.autosyncFailed": "失败",
	"sync.autosyncPartial": "部分成功",
	"sync.autosyncFailCount": "连续失败 {n} 次",
	"sync.autosyncSyncing": "自动同步进行中…",
	"sync.interval.5m": "5 分钟",
	"sync.interval.15m": "15 分钟",
	"sync.interval.30m": "30 分钟",
	"sync.interval.60m": "60 分钟",
	"sync.interval.6h": "6 小时",
	"sync.interval.12h": "12 小时",
	"sync.interval.24h": "24 小时",
	"sync.duration.min": "{n} 分钟",
	"sync.duration.hour": "{n} 小时",
	"sync.duration.day": "{n} 天",
	"sync.hist.autosync": "自动同步",
	"sync.hist.directionPull": "下载",
	"sync.hist.directionPush": "上传",
	"sync.hist.directionBoth": "双向",
	"sync.hist.skipReasonConflict": "冲突项被跳过",
	"sync.hist.skipReasonNoRemote": "远端无快照",
	"sync.hist.skipReasonNotConfigured": "未配置仓库",
	"sync.hist.skipReasonNetwork": "网络问题",
	"sync.hist.conflictedSections": "跳过冲突分区：{sections}",
	"sync.hist.appliedSections": "应用分区：{sections}",
	"sync.hist.failedError": "错误：{error}",
	"sync.hist.notifiedAt": "已通知",
	"sync.github.starting": "正在发起 GitHub 授权…",
	"sync.github.waitingNoCode": "请在浏览器中打开授权页面并完成授权…",
	"sync.github.waiting": "请在浏览器中打开授权页面，输入一次性代码 {code} 完成授权（自动等待确认）。",
	"sync.github.polling": "正在确认 GitHub 授权状态…",
	"sync.github.success": "GitHub 登录成功：token 已安全写入 DSH credentials，可直接推送/拉取。",
	"sync.github.failed": "GitHub 登录失败",
	"sync.github.defaultStatus": "通过 GitHub OAuth 设备码流程登录，token 自动写入 DSH credentials（无需手动输入）。",
	"sync.github.login": "使用 GitHub 登录",
	"sync.github.relogin": "重新登录",
	"sync.github.pollSuccess": "GitHub 登录成功：token 已安全写入 DSH credentials。",
	"sync.github.pollDenied": "GitHub 授权被拒绝（access_denied）。可重新发起登录，或改用下方手动 token 输入。",
	"sync.github.pollExpired": "GitHub 授权已过期（expired_token）。请重新发起登录。",
	"sync.github.pollError": "GitHub OAuth 错误：{detail}",
	"sync.github.unknownError": "未知错误",
	"market.statusLoading": "正在读取市场状态…",
	"market.statusUnconfigured": "尚未添加市场（请输入公开 Git 仓库地址）",
	"market.statusConfigured": "已添加 {count} 个市场",
	"market.supplyUnofficial": "来自公共网络、非官方审核",
	"market.supplySource": "来源仓库：{url}",
	"market.supplyDownloadedAt": "下载时间：{time}",
	"market.supplyAuthor": "作者：{author}",
	"market.supplyProvenanceSource": "作者声明来源：{source}",
	"market.supplyProvenanceNote": "作者自述：{note}",
	"market.detail.sections": "包含分区：{sections}",
	"market.detail.sectionsEmpty": "未声明分区",
	"market.detail.statusValid": "校验通过",
	"market.detail.statusInvalid": "校验未通过",
	"myConfigs.autoField": "系统自动",
	"myConfigs.field.id": "条目 ID",
	"myConfigs.field.author": "作者",
	"myConfigs.field.version": "版本",
	"myConfigs.field.updatedAt": "更新时间",
	"myConfigs.status.notListed": "未收录",
	"myConfigs.status.pendingPr": "PR 待审核",
	"myConfigs.status.listed": "已收录",
	"myConfigs.form.errorName": "名称不能为空",
	"consult.dim.compatibility": "版本/平台兼容性",
	"consult.dim.integrity": "结构完整性",
	"consult.dim.sections": "分区完整性",
	"consult.dim.consistency": "一致性",
	"consult.dim.sensitive": "敏感暴露",
	"consult.dim.migratability": "可迁移性",
	"consult.recommendation.proceed": "建议：可继续",
	"consult.recommendation.review": "建议：需人工确认",
	"consult.recommendation.block": "建议：阻止执行",
	"consult.title": "迁移前咨询",
	"consult.healthScore": "健康评分 {score}",
	"consult.dryRun": "只读分析",
	"consult.reasons": "建议依据",
	"consult.willApply": "将应用",
	"consult.sections": "{count} 个分区",
	"consult.items": "{count} 项",
	"consult.conflicts": "{count} 个冲突",
	"consult.risks": "{count} 个风险",
	"consult.dimensions": "评分维度",
	"consult.loading": "正在生成咨询报告…"
};
const uiEn = {
	"commonClose": "Close",
	"commonCancel": "Cancel",
	"commonRetry": "Retry",
	"commonLoading": "Loading…",
	"commonUnknownError": "Unknown error",
	"commonNext": "Next",
	"commonBack": "Back",
	"commonDone": "Done",
	"export.download": "Download backup file",
	"export.running": "Exporting…",
	"export.run": "Start Export",
	"export.selectionWarnings": "Device-specific sections may not apply on another machine:",
	"export.included": "Included",
	"export.excluded": "Excluded",
	"export.unknownSection": "Unknown section: {id}",
	"export.deviceSpecific": "{label} is device-specific ({portability}) and may not apply on another machine",
	"report.backupCreated": "Backup Created",
	"report.importComplete": "Import Complete",
	"report.importFailed": "Import Failed",
	"report.tombstonedSkipped": "{count} item(s) skipped by deletion records",
	"report.included": "Included:",
	"report.excluded": "Excluded:",
	"report.security": "Security:",
	"report.apiKeysExcluded": "API Keys excluded:",
	"report.containsSecrets": "Contains secrets:",
	"report.encrypted": "Encrypted:",
	"report.redacted": "{count} sensitive field(s) redacted",
	"report.file": "File:",
	"report.yes": "yes",
	"report.yesEncrypted": "yes (encrypted)",
	"report.no": "no",
	"report.importedRestored": "imported/restored",
	"report.skipped": "skipped",
	"report.needAttention": "need attention",
	"report.failed": "failed",
	"report.noChanges": "no changes",
	"report.reason": "Reason",
	"report.note": "Note",
	"report.unknownReason": "Unknown reason",
	"report.secrets": "Secrets:",
	"report.credentialsNeedEntry": "{count} credential(s) need to be entered",
	"report.restartRequired": "Restart DSH to apply: {detail}",
	"report.restartPluginsMcp": "Plugin / MCP changes take effect after restarting DSH",
	"report.rollbackFull": "Rollback: fully restored the pre-import configuration.",
	"report.rollbackPartial": "Rollback partially completed.",
	"report.rollbackManual": "These items may require manual recovery:",
	"report.restored": "Restored: {count} item(s)",
	"error.notMounted": "config-manager service is not mounted (plugin not loaded): make sure dsh-config-manager is installed in the profile and restart DSH",
	"error.httpInvalidJson": "HTTP {status}: invalid JSON response",
	"error.fallback": "Operation failed",
	"error.downloadFailed": "Download failed: HTTP {status}",
	"error.exportTimeout": "Export timed out ({minutes} min): the export did not complete, please retry; if it keeps timing out, check the DSH state",
	"error.syncTimeout": "Sync request timed out ({minutes} min): check network and repository reachability, then retry",
	"error.recoveryTimeout": "Recovery request timed out ({minutes} min): the recovery did not complete, please retry; if it keeps timing out, check the DSH state",
	"error.settingsConflict.title": "Configuration changed concurrently",
	"error.settingsConflict.action": "This configuration on the target DSH was modified by another process during import. To avoid overwriting it, re-export or review it manually, then retry.",
	"error.notConfirmed.title": "Import not confirmed",
	"error.notConfirmed.action": "Confirm the import on the preview page, then retry.",
	"error.integrity.title": "Backup integrity check failed",
	"error.integrity.action": "The backup may be corrupted or tampered with. Re-export the backup, then retry.",
	"error.schema.title": "Backup format version not supported",
	"error.schema.action": "Upgrade DSH Config Manager or use a backup from the same version.",
	"error.notFound.title": "File or path not found",
	"error.notFound.action": "Check that the file path is correct and the file has not been moved or deleted.",
	"error.permission.title": "Permission denied",
	"error.permission.action": "Check read/write permissions on the target directory, then retry.",
	"error.needsRestart.title": "Plugin install requires a restart",
	"error.needsRestart.action": "The import is complete; plugins take effect after restarting DSH. Restart the service in DSH Desktop.",
	"error.reason": "Reason",
	"error.suggestedAction": "Suggested action",
	"error.item": "Item",
	"progress.analyzing": "Analyzing configuration...",
	"progress.exportingSettings": "Exporting settings...",
	"progress.scanningSecrets": "Scanning secrets...",
	"progress.exportingPlugins": "Exporting plugins...",
	"progress.creatingArchive": "Creating archive...",
	"progress.calculatingChecksums": "Verifying file integrity...",
	"progress.exporting": "Exporting configuration...",
	"progress.validating": "Validating backup...",
	"progress.checkingCompatibility": "Checking compatibility...",
	"progress.creatingSnapshot": "Creating safety snapshot...",
	"progress.restoringSettings": "Restoring settings...",
	"progress.restoringPlugins": "Restoring plugins...",
	"progress.restoringMcp": "Restoring MCP...",
	"progress.validatingConfig": "Validating configuration...",
	"progress.rollingBack": "Rolling back...",
	"progress.executing": "Applying configuration (plugin installs may take a while)...",
	"progress.done": "Done",
	"snapshots.createdAt": "Created",
	"snapshots.sourceZip": "Source",
	"snapshots.status": "Status",
	"snapshots.entries": "Entries",
	"snapshots.plugins": "Plugins",
	"snapshots.statusPending": "Pending",
	"snapshots.statusDone": "Done",
	"snapshots.statusRolledback": "Rolled back",
	"snapshots.statusUnknown": "Unknown",
	"snapshots.planTitle": "Restore Plan Preview",
	"snapshots.confirmRestore": "Confirm restore? Current files are first backed up to a safe location, then plugins added during the import are removed.",
	"snapshots.execute": "Restore now",
	"snapshots.executing": "Restoring…",
	"snapshots.restored": "Restored",
	"snapshots.removedPlugins": "Removed plugins",
	"snapshots.manualHints": "Manual action needed",
	"snapshots.failed": "Failed",
	"snapshots.skipped": "Skipped",
	"snapshots.noActions": "No restorable actions for this snapshot (or all skipped).",
	"snapshots.empty": "No snapshots yet. A safety snapshot is created automatically on import.",
	"snapshots.loading": "Loading snapshots…",
	"snapshots.selectHint": "Select a snapshot to preview its restore plan (read-only preview, changes nothing):",
	"snapshots.reportTitle": "Restore Report",
	"sync.privateRepoHint": "Security requirement: the sync repository MUST be private (a public repo would expose your configuration). The auth token is only used for repository access and is never written into sync files, commit content, or logs.",
	"sync.kind.create": "Create",
	"sync.kind.update": "Update",
	"sync.kind.skip": "Skip",
	"sync.kind.conflict": "Conflict",
	"sync.kind.install": "Install",
	"sync.kind.missingSecret": "Secret",
	"sync.kind.missingDependency": "Dependency",
	"sync.kind.pathMapping": "Path",
	"sync.kind.warning": "Warning",
	"sync.kind.error": "Error",
	"sync.severity.error": "Error",
	"sync.severity.warning": "Warning",
	"sync.severity.info": "Info",
	"sync.pushLabel": "Push to remote",
	"sync.pullLabel": "Pull diff preview",
	"sync.pushing": "Pushing…",
	"sync.pulling": "Pulling…",
	"sync.statusLoading": "Reading sync status…",
	"sync.statusUnconfigured": "No sync repository configured (fill in the repository URL and push once to save the config)",
	"sync.credConfigured": "Credential configured",
	"sync.credMissing": "No credential configured (token is written into DSH credentials on first push/pull)",
	"sync.lastSync": "Last sync: {time}",
	"sync.neverSynced": "Never synced yet",
	"sync.neverSyncedShort": "Never synced",
	"sync.pushFailed": "Push failed",
	"sync.pushOk": "Push succeeded (snapshot {id})",
	"sync.pushPreviewHeadline": "Will push {total} section(s) ({changed} changed)",
	"sync.pushPreviewHint": "Read-only preview above — nothing is written to the remote. Click \"Push\" to actually upload.",
	"sync.pushPreviewEncrypted": "Encrypted snapshot: the payload is encrypted as a whole; per-section changes vs the baseline cannot be compared.",
	"sync.pullFailed": "Pull failed",
	"sync.pullOk": "Remote snapshot {id} diff preview: {count} change(s)",
	"sync.pullEmpty": "Remote snapshot matches local (no changes)",
	"sync.previewHint": "Read-only diff preview above; nothing is imported. One-click import is not supported in this version — use the Import wizard to apply a downloaded backup if needed.",
	"sync.syncTitle": "One-Click Sync",
	"sync.syncButton": "One-click sync",
	"sync.syncing": "Syncing…",
	"sync.syncHeadline": "Remote snapshot {id} diff confirm: {count} item(s)",
	"sync.syncEmpty": "Remote snapshot matches local (no changes)",
	"sync.syncFailed": "Sync failed",
	"sync.confirmAdopt": "Adopt remote",
	"sync.confirmSkip": "Skip",
	"sync.confirmRequired": "Needs decision",
	"sync.needsReviewBadge": "Needs decision",
	"sync.selectSnapshot": "Select snapshot",
	"sync.latestSnapshot": "Latest snapshot",
	"sync.noSnapshots": "No remote snapshots",
	"sync.confirmImport": "Confirm import",
	"sync.cancelConfirm": "Cancel",
	"sync.conflictResolve": "Resolve conflict",
	"sync.conflictUseLocal": "Use local",
	"sync.conflictUseRemote": "Use remote",
	"sync.conflictSkip": "Skip",
	"sync.conflictResolvedLocal": "Chosen: local",
	"sync.conflictResolvedRemote": "Chosen: remote",
	"sync.conflictResolvedSkip": "Chosen: skip",
	"sync.importDone": "Imported {n} section(s)",
	"sync.importSkipped": "Skipped {n} item(s)",
	"sync.importFailed": "Import failed (rolled back)",
	"sync.rollbackButton": "Rollback",
	"sync.rollingBack": "Rolling back…",
	"sync.rollbackDone": "Rolled back",
	"sync.appliedSections": "Written",
	"sync.importWarnings": "Import warnings",
	"sync.autosyncTitle": "Auto Sync",
	"sync.autosyncDesc": "When enabled, DSH will run two-way sync (pull merge + push) on a fixed interval; on startup it also triggers a download-merge (no upload) to keep local up to date. Local writes happen only when there are no conflicts or manual-decision items.",
	"sync.autosyncEnabled": "Enable auto sync",
	"sync.autosyncInterval": "Sync interval",
	"sync.autosyncIntervalHint": "Auto download-merge on DSH startup, no upload.",
	"sync.autosyncNever": "Never run",
	"sync.autosyncLastRun": "Last run: {time}",
	"sync.autosyncNextIn": "Next in ~{time}",
	"sync.autosyncSuccess": "Success",
	"sync.autosyncSkipped": "Skipped",
	"sync.autosyncFailed": "Failed",
	"sync.autosyncPartial": "Partial",
	"sync.autosyncFailCount": "{n} consecutive failure(s)",
	"sync.autosyncSyncing": "Auto sync running…",
	"sync.interval.5m": "5 min",
	"sync.interval.15m": "15 min",
	"sync.interval.30m": "30 min",
	"sync.interval.60m": "60 min",
	"sync.interval.6h": "6 hr",
	"sync.interval.12h": "12 hr",
	"sync.interval.24h": "24 hr",
	"sync.duration.min": "{n} min",
	"sync.duration.hour": "{n} hr",
	"sync.duration.day": "{n} day",
	"sync.hist.autosync": "Auto Sync",
	"sync.hist.directionPull": "Pull",
	"sync.hist.directionPush": "Push",
	"sync.hist.directionBoth": "Both",
	"sync.hist.skipReasonConflict": "Conflict items skipped",
	"sync.hist.skipReasonNoRemote": "No remote snapshot",
	"sync.hist.skipReasonNotConfigured": "No repository configured",
	"sync.hist.skipReasonNetwork": "Network issue",
	"sync.hist.conflictedSections": "Skipped conflict sections: {sections}",
	"sync.hist.appliedSections": "Applied sections: {sections}",
	"sync.hist.failedError": "Error: {error}",
	"sync.hist.notifiedAt": "Notified",
	"sync.github.starting": "Starting GitHub a​u​t​h​o​r​i​z​a​t​i​o​n​…",
	"sync.github.waitingNoCode": "Open the authorization page in your browser and complete the flow…",
	"sync.github.waiting": "Open the authorization page in your browser, enter the one-time code {code} to finish (waiting for confirmation).",
	"sync.github.polling": "Confirming GitHub authorization…",
	"sync.github.success": "GitHub sign-in succeeded: token securely written into DSH credentials — you can push/pull now.",
	"sync.github.failed": "GitHub sign-in failed",
	"sync.github.defaultStatus": "Sign in via the GitHub OAuth device flow; the token is written into DSH credentials automatically (no manual entry).",
	"sync.github.login": "Sign in with GitHub",
	"sync.github.relogin": "Sign in again",
	"sync.github.pollSuccess": "GitHub sign-in succeeded: token securely written into DSH credentials.",
	"sync.github.pollDenied": "GitHub authorization was denied (access_denied). You can re-start the sign-in or use manual token entry below.",
	"sync.github.pollExpired": "GitHub authorization expired (expired_token). Please re-start the sign-in.",
	"sync.github.pollError": "GitHub OAuth error: {detail}",
	"sync.github.unknownError": "Unknown error",
	"market.statusLoading": "Reading market status…",
	"market.statusUnconfigured": "No markets added (enter a public Git repository URL)",
	"market.statusConfigured": "{count} market(s) added",
	"market.supplyUnofficial": "From the public network, not officially reviewed",
	"market.supplySource": "Source repo: {url}",
	"market.supplyDownloadedAt": "Downloaded at: {time}",
	"market.supplyAuthor": "Author: {author}",
	"market.supplyProvenanceSource": "Author-declared source: {source}",
	"market.supplyProvenanceNote": "Author note: {note}",
	"market.detail.sections": "Sections: {sections}",
	"market.detail.sectionsEmpty": "No sections declared",
	"market.detail.statusValid": "Verified",
	"market.detail.statusInvalid": "Failed verification",
	"myConfigs.autoField": "Auto",
	"myConfigs.field.id": "Item ID",
	"myConfigs.field.author": "Author",
	"myConfigs.field.version": "Version",
	"myConfigs.field.updatedAt": "Updated",
	"myConfigs.status.notListed": "Not listed",
	"myConfigs.status.pendingPr": "PR pending review",
	"myConfigs.status.listed": "Listed",
	"myConfigs.form.errorName": "Name is required",
	"consult.dim.compatibility": "Version / platform compatibility",
	"consult.dim.integrity": "Structural integrity",
	"consult.dim.sections": "Section integrity",
	"consult.dim.consistency": "Consistency",
	"consult.dim.sensitive": "Sensitive exposure",
	"consult.dim.migratability": "Migratability",
	"consult.recommendation.proceed": "Recommendation: proceed",
	"consult.recommendation.review": "Recommendation: review",
	"consult.recommendation.block": "Recommendation: block",
	"consult.title": "Migration Pre-flight Consultation",
	"consult.healthScore": "Health score {score}",
	"consult.dryRun": "Read-only analysis",
	"consult.reasons": "Recommendation basis",
	"consult.willApply": "Will apply",
	"consult.sections": "{count} section(s)",
	"consult.items": "{count} item(s)",
	"consult.conflicts": "{count} conflict(s)",
	"consult.risks": "{count} risk(s)",
	"consult.dimensions": "Score dimensions",
	"consult.loading": "Generating consultation report…"
};
/** 构造 翻译函数（zh 源 / en 镜像；缺 key 回退）。 */
function makeUiT(lang) {
	const dict = lang === "en" ? uiEn : uiZh;
	const fallback = lang === "en" ? uiZh : void 0;
	return (key, params) => {
		const template = dict[key] ?? fallback?.[key] ?? key;
		if (params === void 0) return template;
		return String(template).replace(/\{(\w+)\}/g, (match, k) => params[k] === void 0 ? match : String(params[k]));
	};
}
/** 缺省 UI 翻译（zh）：未注入的渲染路径行为与改造前完全一致。 */
const zhUiT = makeUiT("zh");
//#endregion
//#region src/client/api.ts
/** 路由族常量（集中管理，与 Host 半的路由前缀保持一致） */
const CONFIG_MANAGER_API = {
	base: "/api/dsh-config-manager",
	status: "/api/dsh-config-manager/status",
	export: "/api/dsh-config-manager/export",
	exportPreview: "/api/dsh-config-manager/export-preview",
	download: "/api/dsh-config-manager/download",
	upload: "/api/dsh-config-manager/upload",
	analyze: "/api/dsh-config-manager/analyze",
	plan: "/api/dsh-config-manager/plan",
	execute: "/api/dsh-config-manager/execute",
	skipExecute: "/api/dsh-config-manager/execute/skip",
	decryptArchive: "/api/dsh-config-manager/decrypt-archive",
	progress: "/api/dsh-config-manager/progress",
	runs: "/api/dsh-config-manager/runs",
	snapshots: "/api/dsh-config-manager/snapshots",
	restore: "/api/dsh-config-manager/restore",
	snapshotDelete: "/api/dsh-config-manager/snapshots/delete",
	snapshotPin: "/api/dsh-config-manager/snapshots/pin",
	backupSchedule: "/api/dsh-config-manager/backup-schedule",
	backupScheduleRun: "/api/dsh-config-manager/backup-schedule/run",
	backupFiles: "/api/dsh-config-manager/backup-files",
	backupFilesDelete: "/api/dsh-config-manager/backup-files/delete",
	consult: "/api/dsh-config-manager/consult",
	profiles: "/api/dsh-config-manager/profiles",
	profilesSave: "/api/dsh-config-manager/profiles/save",
	profilesDelete: "/api/dsh-config-manager/profiles/delete",
	profilesRename: "/api/dsh-config-manager/profiles/rename",
	profilesAnalyzeSwitch: "/api/dsh-config-manager/profiles/analyze-switch",
	profilesExecuteSwitch: "/api/dsh-config-manager/profiles/execute-switch",
	profilesImport: "/api/dsh-config-manager/profiles/import",
	starPrompt: "/api/dsh-config-manager/star-prompt",
	releaseNotesPrompt: "/api/dsh-config-manager/release-notes-prompt"
};
/** 导出请求超时（ms）：与 Host 半 ROUTE_TIMEOUT_MS 对齐，防止宿主卡死时 UI 无限等待 */
const EXPORT_TIMEOUT_MS = 3e5;
/** 携带路由 JSON error 消息的错误类型 */
var ConfigManagerApiError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "ConfigManagerApiError";
	}
};
/** 解析 JSON 响应；非 2xx 时抛出带路由 error 消息的 ConfigManagerApiError */
async function readJson$5(response, t) {
	const notMountedMessage = t("error.notMounted");
	let body;
	try {
		body = await response.json();
	} catch {
		if (response.status === 404) throw new ConfigManagerApiError(notMountedMessage);
		throw new ConfigManagerApiError(t("error.httpInvalidJson", { status: String(response.status) }));
	}
	if (!response.ok) throw new ConfigManagerApiError(typeof body === "object" && body !== null && typeof body.error === "string" ? body.error : response.status === 404 ? notMountedMessage : `HTTP ${response.status}`);
	return body;
}
/** query-string 辅助（跳过 undefined/空串，与 dsh-ssh 一致） */
function query(params) {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) if (value !== void 0 && value !== "") search.set(key, String(value));
	const text = search.toString();
	return text === "" ? "" : "?" + text;
}
/** 用 Blob URL + <a download> 触发浏览器静默下载到默认下载目录（无需用户手势/另存为对话框）。 */
function triggerBlobDownload(blob, filename) {
	if (typeof document === "undefined" || typeof URL === "undefined") return;
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement("a");
	anchor.href = url;
	anchor.download = filename;
	anchor.style.display = "none";
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	setTimeout(() => {
		URL.revokeObjectURL(url);
	}, 15e3);
}
/**
* Config Manager 浏览器半的唯一数据入口。
* 同时实现 `ExportPort`（export-flow 用）与 `ImportPort`（import-wizard 用）。
*/
var ConfigManagerApi = class {
	/**
	* 加密备份密码（仅内存，默认 null = 普通备份）。
	* ExportView 在 run 前设置；export 请求体携带给 Host 半做 AES-256-GCM 加密。
	* 绝不写入 manifest / 任何 DSH 配置 / localStorage。
	*/
	exportPassword = null;
	/** 客户端展示层翻译器（zh 源 / en 镜像，见 ui/i18n.ts）。 */
	t;
	constructor(t = zhUiT) {
		this.t = t;
	}
	/** 健康/版本检查（主页横幅：插件版本 / DSH 版本 / 平台） */
	async status() {
		return readJson$5(await fetch(CONFIG_MANAGER_API.status), this.t);
	}
	/** Star 引导弹窗状态（进入页面时判定是否展示 / 是否补记首次使用时间）。 */
	async starPromptStatus() {
		return readJson$5(await fetch(CONFIG_MANAGER_API.starPrompt), this.t);
	}
	/** P2-⑫：导出前只读预览（不落盘 ZIP）——「将打包 X 分区 / Y 条目 / 约 Z 大小」。 */
	async exportPreview(only) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.exportPreview, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ only })
		}), this.t);
	}
	/** 保存 Star 引导弹窗状态（局部更新：firstSeenAt / dismissed / clicked）。
	* 纯偏好无 secret；失败由调用方静默降级（本次不弹/不记，下次再判）。 */
	async saveStarPrompt(patch) {
		const body = {};
		if (patch.firstSeenAt !== void 0) body.firstSeenAt = patch.firstSeenAt;
		if (patch.dismissed === true) body.dismissed = true;
		if (patch.clicked === true) body.clicked = true;
		return readJson$5(await fetch(CONFIG_MANAGER_API.starPrompt, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body)
		}), this.t);
	}
	/** 更新内容弹窗状态（进入页面时判定是否展示 / 是否已永不提示）。 */
	async releaseNotesPromptStatus() {
		return readJson$5(await fetch(CONFIG_MANAGER_API.releaseNotesPrompt), this.t);
	}
	/** 保存更新内容弹窗状态（局部更新：lastSeenVersion / dismissed）。 */
	async saveReleaseNotesPrompt(patch) {
		const body = {};
		if (patch.lastSeenVersion !== void 0) body.lastSeenVersion = patch.lastSeenVersion;
		if (patch.dismissed === true) body.dismissed = true;
		return readJson$5(await fetch(CONFIG_MANAGER_API.releaseNotesPrompt, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body)
		}), this.t);
	}
	/** ExportPort.export：调用 Host 侧导出编排（core Exporter）。加密密码随请求体传输（仅内存）。
	* 带 AbortController 超时：宿主若卡死，客户端得到明确错误而不是永远停在进度条。 */
	async export(options) {
		const body = {
			...options,
			password: this.exportPassword ?? void 0
		};
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), EXPORT_TIMEOUT_MS);
		try {
			return await readJson$5(await fetch(CONFIG_MANAGER_API.export, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(body),
				signal: controller.signal
			}), this.t);
		} catch (err) {
			if (controller.signal.aborted) throw new ConfigManagerApiError(this.t("error.exportTimeout", { minutes: String(Math.round(EXPORT_TIMEOUT_MS / 6e4)) }));
			throw err;
		} finally {
			clearTimeout(timer);
		}
	}
	/**
	* 把导出的 ZIP 下载到本机。
	* - 默认（saveDialog 缺省/false）：读取为 Blob 后用 <a download> 触发浏览器
	*   静默下载到「下载」目录，无需用户额外操作（导出完成即可自动调用）；
	* - saveDialog: true：优先 File System Access API 流式落盘（不占整文件内存），
	*   用户可在系统保存对话框中选择位置；不可用/取消时回退 Blob 下载。
	*/
	async download(zipPath, opts, onProgress) {
		const response = await fetch(CONFIG_MANAGER_API.download + query({ path: zipPath }));
		if (!response.ok || response.body === null) {
			const text = await response.text().catch(() => "");
			throw new ConfigManagerApiError(text !== "" ? text : this.t("error.downloadFailed", { status: String(response.status) }));
		}
		const total = Number(response.headers.get("content-length") ?? "0");
		const disposition = response.headers.get("content-disposition") ?? "";
		const filename = /filename="([^"]+)"/.exec(disposition)?.[1] ?? zipPath.split(/[\\/]/).pop() ?? "dsh-config.zip";
		const reader = response.body.getReader();
		const usePicker = opts?.saveDialog === true && typeof window !== "undefined" && window.showSaveFilePicker !== void 0;
		let writable;
		const chunks = [];
		let received = 0;
		if (usePicker) try {
			writable = await (await window.showSaveFilePicker.call(window, { suggestedName: filename })).createWritable();
		} catch {
			writable = void 0;
		}
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;
			if (writable !== void 0) await writable.write(value);
			else chunks.push(value);
			received += value.length;
			onProgress?.(received, total);
		}
		if (writable !== void 0) {
			await writable.close();
			return {
				blob: void 0,
				filename,
				streamed: true,
				bytes: received
			};
		}
		const blob = new Blob(chunks);
		triggerBlobDownload(blob, filename);
		return {
			blob,
			filename,
			streamed: false,
			bytes: received
		};
	}
	/** 上传用户选择的 ZIP 到 Host 受控临时目录，返回可引用的 zipPath（dsh-ssh 同款原始字节上传） */
	async upload(file) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.upload + query({ name: file.name }), {
			method: "POST",
			body: file
		}), this.t);
	}
	/** ImportPort.analyzeImport：零写入分析（校验/兼容性/差异/路径/秘密检测） */
	async analyzeImport(zipPath) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.analyze, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ zipPath })
		}), this.t);
	}
	/** ImportPort.createImportPlan：用用户决策（冲突/路径映射/策略）生成最终计划（Dry Run 零写入） */
	async createImportPlan(zipPath, decisions) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.plan, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				zipPath,
				decisions
			})
		}), this.t);
	}
	/** ImportPort.decryptArchive：解锁整体加密备份容器 → 明文 ZIP 路径 + 解密覆盖的凭据 ref 名 */
	async decryptArchive(zipPath, password) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.decryptArchive, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				zipPath,
				password
			})
		}), this.t);
	}
	/** ImportPort.executeImportPlan：快照→分阶段 apply→validate→commit/rollback */
	async executeImportPlan(zipPath, plan, opts) {
		const payload = {
			zipPath,
			plan,
			opts: {
				confirm: opts.confirm,
				secretInputs: opts.secretInputs ?? {},
				rollbackOnError: opts.rollbackOnError,
				decryptPassword: opts.decryptPassword
			}
		};
		return readJson$5(await fetch(CONFIG_MANAGER_API.execute, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload)
		}), this.t);
	}
	/** m1：查询单个 run 的实时状态（执行中轮询 / 刷新恢复用；404 = 已过保留期或不存在） */
	async progress(runId) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.progress + query({ runId })), this.t);
	}
	/** m1：列出当前活跃（running）的 run（刷新后重新订阅进行中任务的入口） */
	async runs() {
		return readJson$5(await fetch(CONFIG_MANAGER_API.runs), this.t);
	}
	/** 导入中「跳过当前插件」：宿主 abort 当前计划项的中止控制器（kill 子进程 + 清半装状态）。
	* 404 = run 不在执行（已完成/无进行中导入）。 */
	async skipExecute(runId) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.skipExecute, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ runId })
		}), this.t);
	}
	/** 列出全部快照元信息（createdAt 倒序；含 status/条目数/宿主文件数/插件数） */
	async snapshots() {
		return (await readJson$5(await fetch(CONFIG_MANAGER_API.snapshots), this.t)).snapshots;
	}
	/** 快照恢复：dryRun=true 只取动作计划（零写入）；false 执行并返回诚实报告 */
	async restoreSnapshot(snapshotId, dryRun) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.restore, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				snapshotId,
				dryRun
			})
		}), this.t);
	}
	/** P1-⑧：手动删除单个快照（危险操作：该导入前回滚点不可恢复；`removed` 为是否实际删除）。 */
	async deleteSnapshot(snapshotId) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.snapshotDelete, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ snapshotId })
		}), this.t);
	}
	/** P1-⑧：置顶/取消置顶快照（置顶快照豁免自动保留清理，只能手动删除）。 */
	async setSnapshotPinned(snapshotId, pinned) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.snapshotPin, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				snapshotId,
				pinned
			})
		}), this.t);
	}
	/** 列出全部 Profile（name/createdAt/updatedAt/sections/fileCount）。 */
	async profilesList() {
		return (await readJson$5(await fetch(CONFIG_MANAGER_API.profiles), this.t)).profiles;
	}
	/** 保存当前 DSH 配置为新 Profile（天然不含秘密值）。 */
	async profileSave(name, sections) {
		return (await readJson$5(await fetch(CONFIG_MANAGER_API.profilesSave, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name,
				sections
			})
		}), this.t)).profile;
	}
	/** 删除 Profile（危险操作：该组配置快照不可恢复）。 */
	async profileDelete(name) {
		await readJson$5(await fetch(CONFIG_MANAGER_API.profilesDelete, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ name })
		}), this.t);
	}
	/** 重命名 Profile（目录级移动）。 */
	async profileRename(name, newName) {
		return (await readJson$5(await fetch(CONFIG_MANAGER_API.profilesRename, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name,
				newName
			})
		}), this.t)).profile;
	}
	/** 切换前预览（只读，零写入）：分析切换到该 Profile 会产生的计划项。 */
	async profileAnalyzeSwitch(name) {
		return (await readJson$5(await fetch(CONFIG_MANAGER_API.profilesAnalyzeSwitch, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ name })
		}), this.t)).preview;
	}
	/** 执行切换（confirm=true 安全阀；走快照 + 分阶段 apply + 失败回滚；响应含 runId）。 */
	async profileExecuteSwitch(name, opts) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.profilesExecuteSwitch, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				name,
				confirm: true,
				...opts
			})
		}), this.t);
	}
	/** 导入 Profile（content = profile.json 字符串；asName 可选覆盖目标名）。 */
	async profileImport(content, asName) {
		return (await readJson$5(await fetch(CONFIG_MANAGER_API.profilesImport, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({
				content,
				...asName !== void 0 ? { asName } : {}
			})
		}), this.t)).profile;
	}
	/** 读取定时备份配置（enabled / interval / 上次运行状态；无敏感字段）。 */
	async backupSchedule() {
		return (await readJson$5(await fetch(CONFIG_MANAGER_API.backupSchedule), this.t)).schedule;
	}
	/** 保存定时备份设置（enabled + interval）；Host 校验后原子写 + 重排调度器。 */
	async saveBackupSchedule(draft) {
		return (await readJson$5(await fetch(CONFIG_MANAGER_API.backupSchedule, {
			method: "PUT",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(draft)
		}), this.t)).schedule;
	}
	/** 立即执行一次全量备份（复用调度器 runOnce，防重；返回执行结果 + 最新配置）。 */
	async runBackupNow() {
		return readJson$5(await fetch(CONFIG_MANAGER_API.backupScheduleRun, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({})
		}), this.t);
	}
	/** 列出导出目录（exports/*.zip）下的全部备份文件（时间倒序；含来源 auto/manual）。 */
	async listBackupFiles() {
		return (await readJson$5(await fetch(CONFIG_MANAGER_API.backupFiles), this.t)).files;
	}
	/** 删除一个备份文件（危险操作：不可恢复；仅限 exports 目录内 .zip）。 */
	async deleteBackupFile(name) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.backupFilesDelete, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ name })
		}), this.t);
	}
	/** 迁移前咨询（只读健康评分 + 建议）：对 4 种可迁移源生成统一咨询报告。 */
	async consult(input) {
		return readJson$5(await fetch(CONFIG_MANAGER_API.consult, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(input)
		}), this.t);
	}
	/** 「查看备份内容」：对 exports 目录内的备份文件做只读分析（reuse /analyze，零写入）。
	*  返回分析 + 与当前配置的差异计划摘要（"装/导这个备份会动你什么"）。 */
	async inspectBackup(zipPath) {
		return {
			analysis: await this.analyzeImport(zipPath),
			plan: await this.createImportPlan(zipPath, {
				strategy: "merge",
				resolutions: {},
				pathMappings: []
			})
		};
	}
};
//#endregion
//#region src/ui/conflict-view.ts
var ConflictCollector = class {
	plan;
	decisions = /* @__PURE__ */ new Map();
	constructor(plan) {
		this.plan = plan;
	}
	/** 需要用户决策的冲突项（kind === 'Conflict'） */
	get conflicts() {
		return this.plan.items.filter((i) => i.kind === "Conflict");
	}
	/** 设置某项决策；未出现在冲突列表中的 id 忽略并返回 false */
	resolve(itemId, resolution) {
		if (!this.conflicts.some((i) => i.id === itemId)) return false;
		this.decisions.set(itemId, resolution);
		return true;
	}
	/** 批量决策全部冲突项（keepCurrent / useImported）—— P0-③ 批量操作。
	*  返回实际决策的项数（= 当前冲突数）。与逐项 resolve 语义一致：
	*  未出现在冲突列表中的 id 不会进入决策表。 */
	resolveAll(resolution) {
		let applied = 0;
		for (const item of this.conflicts) {
			this.decisions.set(item.id, resolution);
			applied += 1;
		}
		return applied;
	}
	/** 单项当前决策（未决策返回 null） */
	decisionOf(itemId) {
		return this.decisions.get(itemId) ?? null;
	}
	/** 仍未解决（review 或未决策）的冲突项 */
	unresolved() {
		return this.conflicts.filter((i) => {
			const d = this.decisions.get(i.id);
			return d === void 0 || d === "review";
		});
	}
	get hasUnresolved() {
		return this.unresolved().length > 0;
	}
	/** 转 core 决策表（供 createImportPlan / executeImportPlan 使用） */
	toResolutions() {
		const out = {};
		for (const [id, res] of this.decisions) out[id] = res;
		return out;
	}
	/** 构造视图项列表（React 绑定用）：含当前/导入摘要占位 */
	viewItems() {
		return this.conflicts.map((item) => ({
			item,
			currentSummary: item.detail?.split("\n")[0],
			importedSummary: void 0,
			resolution: this.decisionOf(item.id)
		}));
	}
};
//#endregion
//#region src/ui/types.ts
/** Custom Export 分组目录（规范 §1；automation 组 DSH 无对应分区，仅说明） */
const EXPORT_GROUPS = [
	{
		id: "general",
		label: "General"
	},
	{
		id: "ai",
		label: "AI"
	},
	{
		id: "extensions",
		label: "Extensions"
	},
	{
		id: "mcp",
		label: "MCP / Tools"
	},
	{
		id: "customization",
		label: "Customization"
	},
	{
		id: "automation",
		label: "Automation",
		note: "DSH 当前无 Workflows / Commands 配置文件（运行时注册），无迁移内容"
	},
	{
		id: "workspace",
		label: "Workspace"
	},
	{
		id: "ui",
		label: "UI"
	},
	{
		id: "optional",
		label: "Optional Data"
	}
];
/** Quick Export 推荐项 = defaultIncluded 且非 deviceSpecific（设计 §11.1） */
function isQuickRecommended(c) {
	return c.defaultIncluded && c.portability !== "deviceSpecific";
}
//#endregion
//#region src/ui/progress.ts
/** 导出阶段文案（规范 §29 Export 示例） */
const EXPORT_STAGES = [
	"analyzing",
	"exporting-settings",
	"scanning-secrets",
	"exporting-plugins",
	"creating-archive",
	"calculating-checksums",
	"done"
];
/** 导入阶段文案（规范 §29 Import 示例 + 快照/回滚阶段） */
const IMPORT_STAGES = [
	"validating",
	"checking-compatibility",
	"creating-snapshot",
	"restoring-settings",
	"restoring-plugins",
	"restoring-mcp",
	"validating-config",
	"rolling-back",
	"done"
];
/**
* 真实执行阶段（不在 IMPORT_STAGES 序列里，因此 step/total 缺省 → 进度条渲染
* 为不定态动画而非伪造百分比）。execute 是一个单次 HTTP 请求，Host 端串行
* 跑完全部计划项（其中插件安装是 npm 串行，耗时最长）；请求期间没有中间
* 进度事件可回传，旧实现把 restoring-settings / restoring-plugins /
* restoring-mcp / validating-config 在请求前全部预发，导致进度条瞬间跳到
* 78% 后长时间无变化——像卡死。现在统一在请求期间显示 'executing' 不定态，
* 让用户明确知道「仍在执行，请等待」。
*/
const EXECUTING_STAGE = "executing";
const STAGE_KEYS = {
	analyzing: "progress.analyzing",
	"exporting-settings": "progress.exportingSettings",
	"scanning-secrets": "progress.scanningSecrets",
	"exporting-plugins": "progress.exportingPlugins",
	"creating-archive": "progress.creatingArchive",
	"calculating-checksums": "progress.calculatingChecksums",
	exporting: "progress.exporting",
	validating: "progress.validating",
	"checking-compatibility": "progress.checkingCompatibility",
	"creating-snapshot": "progress.creatingSnapshot",
	"restoring-settings": "progress.restoringSettings",
	"restoring-plugins": "progress.restoringPlugins",
	"restoring-mcp": "progress.restoringMcp",
	"validating-config": "progress.validatingConfig",
	"rolling-back": "progress.rollingBack",
	executing: "progress.executing",
	done: "progress.done"
};
/** 阶段 id → 用户可读文案（未知阶段回退 id） */
function stageText(stage, t = zhUiT) {
	const key = STAGE_KEYS[stage];
	return key !== void 0 ? t(key) : stage;
}
/**
* 进度追踪器：按给定阶段序列在回调时附带 step/total 序号。
* 控制器调用 core 前后 emit()，UI 侧渲染进度条/阶段文字。
*/
var ProgressTracker = class {
	listener;
	stages;
	emitted = [];
	constructor(stages, listener) {
		this.stages = stages;
		this.listener = listener;
	}
	/** 发出某阶段事件（可携带 detail）；未在序列中的阶段 step/total 缺省 */
	emit(stage, detail) {
		const idx = this.stages.indexOf(stage);
		const event = {
			stage,
			detail,
			step: idx >= 0 ? idx + 1 : void 0,
			total: idx >= 0 ? this.stages.length : void 0
		};
		this.emitted.push(stage);
		this.listener?.(event);
	}
	/** 已发出阶段的快照（测试与日志用） */
	get events() {
		return [...this.emitted];
	}
};
//#endregion
//#region src/ui/report.ts
function renderExportReport(report, t = zhUiT) {
	const lines = [t("report.backupCreated"), ""];
	lines.push(t("report.included"));
	for (const { section, counts } of report.included) {
		const detail = Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(", ");
		lines.push(`  ✓ ${section}${detail !== "" ? ` (${detail})` : ""}`);
	}
	lines.push("");
	if (report.excluded.length > 0) {
		lines.push(t("report.excluded"));
		for (const s of report.excluded) lines.push(`  ○ ${s}`);
		lines.push("");
	}
	lines.push(t("report.security"));
	lines.push(`  ✓ ${t("report.apiKeysExcluded")} ${report.security.secretsExcluded ? t("report.yes") : t("report.no")}`);
	lines.push(`  ✓ ${t("report.containsSecrets")} ${report.security.containsSecrets ? t("report.yesEncrypted") : t("report.no")}`);
	lines.push(`  ✓ ${t("report.encrypted")} ${report.security.encrypted ? t("report.yes") : t("report.no")}`);
	if (report.security.redactedHits > 0) lines.push(`  ⚠ ${t("report.redacted", { count: String(report.security.redactedHits) })}`);
	lines.push("");
	lines.push(`${t("report.file")} ${report.file.name} (${formatBytes(report.file.sizeBytes)})`);
	for (const w of report.warnings) lines.push(`  ⚠ ${w}`);
	return lines.join("\n");
}
/** 从 itemId 前缀推断所属分区（与 adapters id 规则对齐；未知归 'other'） */
function sectionFromItemId(itemId) {
	if (itemId.startsWith("settings:")) return "settings";
	if (itemId.startsWith("ui:")) return "ui";
	if (itemId.startsWith("provider:")) return "providers";
	if (itemId.startsWith("plugin:") || itemId.startsWith("patch:")) return "plugins";
	if (itemId.startsWith("mcp:")) return "mcp";
	if (itemId.startsWith("prompt:")) return "prompts";
	if (itemId.startsWith("workspace:")) return "workspaces";
	if (itemId.startsWith("secret:")) return "credentialsStatus";
	if (itemId.startsWith("skills:")) return "skills";
	if (itemId.startsWith("agentPresets:")) return "agentPresets";
	if (itemId.startsWith("agentInstructions:")) return "agentInstructions";
	if (itemId.startsWith("pluginFiles:")) return "pluginFiles";
	if (itemId.startsWith("sessions:")) return "sessions";
	return "other";
}
/** 按分区聚合执行结果（统计 + 明细） */
function importSectionStats(executed) {
	const bySection = /* @__PURE__ */ new Map();
	for (const e of executed) {
		const section = sectionFromItemId(e.itemId);
		let stat = bySection.get(section);
		if (!stat) {
			stat = {
				section,
				ok: 0,
				skipped: 0,
				warned: 0,
				failed: 0,
				items: []
			};
			bySection.set(section, stat);
		}
		if (e.status === "ok") stat.ok += 1;
		else if (e.status === "skipped") stat.skipped += 1;
		else if (e.status === "warning") stat.warned += 1;
		else stat.failed += 1;
		stat.items.push(e);
	}
	return [...bySection.values()];
}
/** 导入报告渲染（含回滚状态；§22 动作按钮由 suggestedActions 给出） */
function renderImportReport(result, t = zhUiT) {
	const lines = [result.ok ? t("report.importComplete") : t("report.importFailed"), ""];
	if ((result.skippedTombstoned?.length ?? 0) > 0) {
		lines.push(t("report.tombstonedSkipped", { count: String(result.skippedTombstoned.length) }));
		lines.push("");
	}
	const stats = importSectionStats(result.executed);
	for (const s of stats) {
		const parts = [];
		if (s.ok > 0) parts.push(`✓ ${s.ok} ${t("report.importedRestored")}`);
		if (s.skipped > 0) parts.push(`- ${s.skipped} ${t("report.skipped")}`);
		if (s.warned > 0) parts.push(`⚠ ${s.warned} ${t("report.needAttention")}`);
		if (s.failed > 0) parts.push(`✗ ${s.failed} ${t("report.failed")}`);
		lines.push(`${s.section}: ${parts.join(" ") || t("report.noChanges")}`);
		for (const it of s.items) if (it.status === "failed" || it.status === "warning") lines.push(`  ${it.status === "failed" ? t("report.reason") : t("report.note")}: ${it.message ?? t("report.unknownReason")}`);
	}
	if (result.missingSecrets.length > 0) lines.push(`${t("report.secrets")} ⚠ ${t("report.credentialsNeedEntry", { count: String(result.missingSecrets.length) })}`);
	if (result.needsRestart) lines.push(t("report.restartPluginsMcp"));
	for (const w of result.warnings) lines.push(`⚠ ${w}`);
	if (result.rollback) {
		lines.push("");
		lines.push(renderRollbackReport(result.rollback, t));
	}
	return lines.join("\n");
}
/** 结果页动作按钮（§22）。报告已内联展示全部失败/警告项的原因与回滚详情（§23），
* 不再提供空操作的 Fix Issues / View Details 按钮——仅保留「完成」。 */
function suggestedActions(_result) {
	return ["done"];
}
/** 回滚报告渲染（full / partial + 人工恢复清单） */
function renderRollbackReport(rr, t = zhUiT) {
	if (rr.full) return t("report.rollbackFull");
	const lines = [t("report.rollbackPartial")];
	lines.push(t("report.rollbackManual"));
	for (const f of rr.failed) lines.push(`  - ${f.item}: ${f.reason}${f.manualHint ? ` (${f.manualHint})` : ""}`);
	if (rr.restored.length > 0) lines.push(t("report.restored", { count: String(rr.restored.length) }));
	return lines.join("\n");
}
function formatBytes(n) {
	if (n < 1024) return `${n} B`;
	if (n < 1048576) return `${(n / 1024).toFixed(1)} KB`;
	return `${(n / 1048576).toFixed(1)} MB`;
}
//#endregion
//#region src/ui/export-flow.ts
/**
* 自定义导出文件名的归一化（P0-④ 体验优化）：无需用户手动输入 `.zip`。
* - trim 首尾空白；空串 → ''（宿主自动命名）；
* - 非空且未以 `.zip` 结尾 → 自动补全 `.zip`（大小写不敏感判定，统一补小写后缀）；
* - 已以 `.zip` 结尾 → 原样返回（含首字符为字母数字的校验由调用方/宿主把关）。
*/
function normalizeExportFileName(raw) {
	const trimmed = raw.trim();
	if (trimmed === "") return "";
	return /\.zip$/i.test(trimmed) ? trimmed : `${trimmed}.zip`;
}
/** 内置分类目录（与 src/adapters/* 的 displayName/defaultIncluded/portability 对齐，研究报告 §2.2） */
const DEFAULT_CATEGORIES = [
	{
		id: "settings",
		label: "Settings",
		description: "DSH 全局设置（namespace 分区，redacted）",
		defaultIncluded: true,
		portability: "portable",
		group: "general"
	},
	{
		id: "providers",
		label: "Providers & Models",
		description: "LLM Provider / Model / 默认模型 / BaseURL",
		defaultIncluded: true,
		portability: "portable",
		group: "ai"
	},
	{
		id: "plugins",
		label: "Plugins",
		description: "已安装插件清单与启用状态（不含二进制）",
		defaultIncluded: true,
		portability: "portable",
		group: "extensions"
	},
	{
		id: "pluginFiles",
		label: "Plugin Files",
		description: "插件自有配置文件（白名单 + plugin-config/ 目录，整文件复制）",
		defaultIncluded: false,
		portability: "deviceSpecific",
		group: "extensions"
	},
	{
		id: "self",
		label: "Plugin Self Config",
		description: "本插件自身配置（同步/自动同步/分区选择/UI 偏好/市场；sync-*.json 等，不含凭据值）",
		defaultIncluded: true,
		portability: "portable",
		group: "extensions"
	},
	{
		id: "mcp",
		label: "MCP Servers",
		description: "MCP 服务器组合配置（需重启生效）",
		defaultIncluded: true,
		portability: "platformSpecific",
		group: "mcp"
	},
	{
		id: "prompts",
		label: "Prompts",
		description: "System Prompt / Plan Mode 提示",
		defaultIncluded: true,
		portability: "portable",
		group: "customization"
	},
	{
		id: "skills",
		label: "Skills",
		description: "用户技能文件（~/.dsh/skills）",
		defaultIncluded: true,
		portability: "portable",
		group: "customization"
	},
	{
		id: "agentPresets",
		label: "Agent Presets",
		description: "Agent 预设（~/.dsh/.agent-presets）",
		defaultIncluded: true,
		portability: "portable",
		group: "customization"
	},
	{
		id: "agentInstructions",
		label: "Agent Instructions",
		description: "全局指令文件（~/.dsh/AGENTS.md，注入每个会话）",
		defaultIncluded: true,
		portability: "portable",
		group: "customization"
	},
	{
		id: "workspaces",
		label: "Workspaces",
		description: "工作区记录（含绝对路径，需路径映射）",
		defaultIncluded: true,
		portability: "platformSpecific",
		group: "workspace"
	},
	{
		id: "ui",
		label: "UI Preferences",
		description: "UI 类 settings namespace（localStorage 项仅说明）",
		defaultIncluded: true,
		portability: "portable",
		group: "ui"
	},
	{
		id: "credentialsStatus",
		label: "Credentials Status",
		description: "凭据状态（configured 标记，永不导出值）",
		defaultIncluded: true,
		portability: "deviceSpecific",
		group: "optional",
		sensitive: true
	},
	{
		id: "sessions",
		label: "Sessions",
		description: "历史会话（默认关闭，含敏感内容）",
		defaultIncluded: false,
		portability: "deviceSpecific",
		group: "optional"
	}
];
var ExportFlow = class {
	categories;
	port;
	onProgress;
	t;
	constructor(opts) {
		this.port = opts.port;
		this.categories = opts.categories ?? DEFAULT_CATEGORIES;
		this.onProgress = opts.onProgress;
		this.t = opts.t ?? zhUiT;
	}
	/** Quick Export 推荐分区（defaultIncluded 且非 deviceSpecific） */
	quickSelection() {
		return this.categories.filter(isQuickRecommended).map((c) => c.id);
	}
	/** 按 §1 分组返回分类目录（Custom Export 树） */
	groupedCatalog() {
		return EXPORT_GROUPS.map((g) => ({
			group: g.id,
			label: g.label,
			note: g.note,
			categories: this.categories.filter((c) => c.group === g.id)
		}));
	}
	/** 校验 Custom 勾选：未知分区 = invalid；deviceSpecific 分区给提示警告（仍可继续） */
	validateSelection(selection) {
		const warnings = [];
		let valid = true;
		const known = new Set(this.categories.map((c) => c.id));
		for (const id of selection) if (!known.has(id)) {
			warnings.push(`未知分区：${id}`);
			valid = false;
		}
		for (const c of this.categories) if (selection.includes(c.id) && c.portability === "deviceSpecific") warnings.push(`${c.label} 为设备相关数据（${c.portability}），跨设备导入时可能不适用`);
		return {
			valid,
			warnings
		};
	}
	/** 执行导出：发进度事件 → 调 core → 渲染 §21 报告 */
	async run(mode, selection, opts = {}) {
		const tracker = new ProgressTracker(EXPORT_STAGES, this.onProgress);
		const only = mode === "quick" ? this.quickSelection() : [...selection];
		if (mode === "quick" && opts.includeSecrets === void 0) opts = {
			...opts,
			includeSecrets: false
		};
		tracker.emit("exporting");
		const result = await this.port.export({
			includeSecrets: opts.includeSecrets ?? false,
			only,
			...opts.fileName !== void 0 && opts.fileName !== "" ? { outPath: opts.fileName } : {},
			...opts.note !== void 0 ? { note: opts.note } : {}
		});
		tracker.emit("done");
		return {
			...result,
			text: renderExportReport(result.report, this.t)
		};
	}
};
//#endregion
//#region src/security/secret-scanner.ts
/**
* 敏感字段名单（规范化名：小写、无分隔符）。
* 覆盖规范 §6 原始清单 + 设计 §7.2 + core logger 名单，并保持克制以防误伤
* （不收录 `key`/`session` 等过宽子串——`sessionIds`/`monkey` 不得中招）。
*/
const DEFAULT_SECRET_FIELD_NAMES = [
	"password",
	"passwd",
	"token",
	"accesstoken",
	"refreshtoken",
	"apikey",
	"secret",
	"credential",
	"authorization",
	"cookie",
	"privatekey",
	"clientsecret",
	"pwd",
	"passphrase",
	"authtoken",
	"sessionkey",
	"apisecret",
	"authheader",
	"bearer",
	"webhooksecret"
];
/** 敏感后缀（规范化后以这些结尾 → 命中；`key` 故意不收，避免 monkey/whiskey 误伤） */
const SENSITIVE_SUFFIXES = [
	"token",
	"secret",
	"password",
	"passwd",
	"credential"
];
/** 敏感前缀（规范化后以这些开头 → 命中；token/secret 等过宽词不收入） */
const SENSITIVE_PREFIXES = [
	"apikey",
	"accesstoken",
	"refreshtoken",
	"authtoken",
	"clientsecret",
	"privatekey",
	"authorization",
	"authheader",
	"webhooksecret",
	"apisecret"
];
/** 规范化字段名：小写 + 去 `_-. ` 分隔符（用于名单匹配） */
function normalizeFieldName(name) {
	return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}
/** 字段名是否命中敏感名单（规范化后精确 / 敏感后缀 / 敏感前缀） */
function isSensitiveFieldName(field, extra = []) {
	const norm = normalizeFieldName(field);
	if (norm === "") return false;
	if ([...DEFAULT_SECRET_FIELD_NAMES, ...extra].includes(norm)) return true;
	if (SENSITIVE_SUFFIXES.some((s) => norm.endsWith(s) && norm.length > s.length)) return true;
	return SENSITIVE_PREFIXES.some((p) => norm.startsWith(p));
}
//#endregion
//#region src/security/redaction.ts
/**
* 日志/文本脱敏（规范 §24 / 设计 §9.8 / core utils/logger.ts 的强化层）。
*
* 与 core logger.redact 的分工：core 版按固定字段名单做子串替换（不感知字段边界）；
* 本模块为强化版，两模式：
*  1. **结构化字段形态**：JSON `"field": "value"` / `field=value` / `field: value`，
*     字段名命中敏感名单（复用 secret-scanner 的 `isSensitiveFieldName`，单一来源防漂移）→ 值替换。
*  2. **值形状模式**：与字段名无关，文本任意位置出现 sk- / JWT / AKIA / GitHub PAT /
*     PEM 私钥 / Bearer / URL query 的敏感参数值 → 替换。
*
* 幂等性：替换产物 `***REDACTED***` 不匹配任何模式，重复 redact 结果不变；
* JSON 行的引号结构保留（输出仍是合法 JSON）。
*/
const REDACTED = "***REDACTED***";
const JSON_FIELD_RE = /"([A-Za-z0-9_.\-]+)"\s*:\s*"([^"]*)"/g;
/** kv 值到空白/逗号/分号/&（& 截断：避免吞掉 URL query 的后续参数） */
const KV_FIELD_RE = /([A-Za-z0-9_.\-]+)\s*=\s*([^\s,;&]+)/g;
/** colon 值允许空格（如 `Authorization: Bearer xyz`），到逗号/分号/右大括号截断 */
const COLON_FIELD_RE = /([A-Za-z0-9_.\-]+)\s*:\s*([^,;}]+)/g;
const VALUE_PATTERNS = [
	{
		name: "openai-key",
		re: /sk-[A-Za-z0-9_-]{8,}/g
	},
	{
		name: "jwt",
		re: /eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g
	},
	{
		name: "aws-access-key",
		re: /AKIA[0-9A-Z]{16}/g
	},
	{
		name: "github-token",
		re: /gh[pousr]_[A-Za-z0-9]{20,}/g
	},
	{
		name: "github-pat",
		re: /github_pat_[A-Za-z0-9_]{20,}/g
	},
	{
		name: "pem-private-key",
		re: /-----BEGIN [A-Za-z0-9 ]*PRIVATE KEY-----/g
	},
	{
		name: "bearer-token",
		re: /Bearer [A-Za-z0-9._~+/=-]{8,}/g
	}
];
/** URL query 中的敏感参数值（保留参数名，只替换值） */
const URL_QUERY_RE = /([?&](?:token|api[_-]?key|key|secret|access[_-]?token|password|auth)=)([^&\s"']+)/gi;
function replaceSensitiveField(text, re, blacklist) {
	return text.replace(re, (match, field, value) => {
		if (!isSensitiveFieldName(field, blacklist)) return match;
		if (value === "") return match;
		const idx = match.lastIndexOf(value);
		return match.slice(0, idx) + REDACTED + match.slice(idx + value.length);
	});
}
/**
* 文本脱敏（幂等）。blacklist 为**附加**规范化字段名（小写无分隔符，如 'clientsecret'）。
* 输出仍保留结构化形态（JSON 行合法）。
*/
function redact(text, blacklist = []) {
	let out = text;
	out = replaceSensitiveField(out, JSON_FIELD_RE, blacklist);
	out = replaceSensitiveField(out, KV_FIELD_RE, blacklist);
	out = replaceSensitiveField(out, COLON_FIELD_RE, blacklist);
	for (const { re } of VALUE_PATTERNS) {
		re.lastIndex = 0;
		out = out.replace(re, REDACTED);
	}
	out = out.replace(URL_QUERY_RE, `$1${REDACTED}`);
	return out;
}
//#endregion
//#region src/ui/errors.ts
/**
* 可操作错误模型（规范 §23，m6-ui）。
*
* 绝不只有 "Something went wrong."：
*  - 解析错误 → Reason + Suggested action（可操作）；
*  - 输出前强制脱敏（redact），Secret 永不进入 UI/日志；
*  - 文案经 UiT 注入（zh 源 / en 镜像，见 i18n.ts）。
*/
function buildErrorRules(t) {
	return [
		{
			match: (m) => /SETTINGS_CONFLICT|revision.*conflict/i.test(m),
			title: t("error.settingsConflict.title"),
			suggestedAction: t("error.settingsConflict.action"),
			retryable: true
		},
		{
			match: (m) => /ImportNotConfirmed|未确认/i.test(m),
			title: t("error.notConfirmed.title"),
			suggestedAction: t("error.notConfirmed.action"),
			retryable: true
		},
		{
			match: (m) => /backup integrity|完整性校验失败|checksum/i.test(m),
			title: t("error.integrity.title"),
			suggestedAction: t("error.integrity.action"),
			retryable: false
		},
		{
			match: (m) => /schema.*(不支持|超出)|无法导入|Unsupported|schemaUnsupported|无法导入/i.test(m),
			title: t("error.schema.title"),
			suggestedAction: t("error.schema.action"),
			retryable: false
		},
		{
			match: (m) => /ENOENT|not found|无法读取|不存在|readFailed/i.test(m),
			title: t("error.notFound.title"),
			suggestedAction: t("error.notFound.action"),
			retryable: true
		},
		{
			match: (m) => /EACCES|permission|权限/i.test(m),
			title: t("error.permission.title"),
			suggestedAction: t("error.permission.action"),
			retryable: true
		},
		{
			match: (m) => /install.*(plugin|插件)|needsRestart|重启/i.test(m),
			title: t("error.needsRestart.title"),
			suggestedAction: t("error.needsRestart.action"),
			retryable: false
		}
	];
}
/** 将任意错误转换为可操作错误（消息已脱敏，不泄漏 Secret） */
function toActionableError(err, opts) {
	const t = opts?.t ?? zhUiT;
	const message = redact(err instanceof Error ? err.message : String(err ?? t("commonUnknownError")));
	const rule = buildErrorRules(t).find((r) => r.match(message));
	return {
		title: rule?.title ?? opts?.fallbackTitle ?? t("error.fallback"),
		reason: message,
		suggestedAction: rule?.suggestedAction,
		item: opts?.item !== void 0 ? redact(opts.item) : void 0,
		retryable: rule?.retryable ?? true
	};
}
/** 格式化为用户可读的多行文本（Reason / Suggested action） */
function formatActionableError(e, t = zhUiT) {
	const lines = [e.title];
	lines.push(`${t("error.reason")}: ${e.reason}`);
	if (e.suggestedAction) lines.push(`${t("error.suggestedAction")}: ${e.suggestedAction}`);
	if (e.item) lines.push(`${t("error.item")}: ${e.item}`);
	return lines.join("\n");
}
//#endregion
//#region src/ui/import-wizard.ts
var ImportWizard = class {
	port;
	onProgress;
	tracker;
	step = "select";
	zipPath = null;
	analysis = null;
	plan = null;
	result = null;
	rollbackOnError;
	errors = [];
	decisions = {
		strategy: "merge",
		resolutions: {},
		pathMappings: []
	};
	secretInputs = {};
	/** 加密备份的解密密码（仅内存，绝不持久化；刷新后要求重输） */
	decryptPassword = "";
	/** 整体加密备份容器是否已解锁（upload 探测到 encrypted 容器后为 false；unlockArchive 成功后为 true） */
	archiveUnlocked = false;
	/**
	* 解锁后的明文 ZIP 路径（仅内存，绝不持久化；指向受控临时目录）。
	* decryptArchive 端点解出明文 ZIP 并返回新 zipPath，后续 analyze/plan/execute 都基于它。
	*/
	unlockedZipPath = null;
	constructor(opts) {
		this.port = opts.port;
		this.onProgress = opts.onProgress;
		this.tracker = new ProgressTracker(IMPORT_STAGES, this.onProgress);
		this.rollbackOnError = opts.defaultRollbackOnError ?? true;
	}
	/** 当前状态快照（React 绑定 / 测试断言用） */
	snapshot() {
		return {
			step: this.step,
			zipPath: this.zipPath,
			analysis: this.analysis,
			plan: this.plan,
			result: this.result,
			rollbackOnError: this.rollbackOnError,
			errors: [...this.errors]
		};
	}
	get currentStep() {
		return this.step;
	}
	/**
	* 解析「当前应传给 analyze/plan/execute 的 ZIP 路径」：
	* - 已解锁的整体加密容器 → 用解密后的明文 ZIP 路径；
	* - 否则 → 直接上传/传入的路径。
	*/
	resolvedZipPath() {
		return this.archiveUnlocked && this.unlockedZipPath !== null ? this.unlockedZipPath : this.zipPath;
	}
	/**
	* 设置整体加密备份容器是否为 encrypted（upload 探测结果；仅内存）。
	* 调用方先在解密阶段展示密码输入，成功后调用 unlockArchive。
	* 传入 zipPath 时同步记录容器路径（供 unlockArchive/selectZip 引用，
	* 避免 syncWizard 把 store 中已 patch 的 zipPath 覆盖回 null）。
	*/
	setArchiveEncrypted(encrypted, zipPath) {
		this.archiveUnlocked = !encrypted;
		if (encrypted && zipPath !== void 0) this.zipPath = zipPath;
		this.unlockedZipPath = null;
	}
	/**
	* 解锁整体加密备份容器（只读，零写入）：用备份密码解密上传的容器 → 明文 ZIP。
	* 成功后 archiveUnlocked=true；之后 analyze/plan/execute 基于解密后的 ZIP 路径。
	* 返回明文 ZIP 路径与解密覆盖的凭据 ref 名（导出时容器密码与 secrets.enc 密码
	* 同源，解锁即完成凭据解密验证）——导入全程只需输入这一次密码。
	*/
	async unlockArchive(encryptedPath, password) {
		this.zipPath = encryptedPath;
		const { zipPath, refs } = await this.port.decryptArchive(encryptedPath, password);
		this.unlockedZipPath = zipPath;
		this.archiveUnlocked = true;
		return {
			zipPath,
			refs
		};
	}
	/** 步骤 1-2：选 ZIP → Analyzing → Compatibility（analyzeImport 零写入） */
	async selectZip(path) {
		this.zipPath = path;
		this.step = "analyzing";
		this.tracker.emit("validating");
		this.errors = [];
		try {
			this.analysis = await this.port.analyzeImport(this.resolvedZipPath());
			this.tracker.emit("checking-compatibility");
			if (!this.analysis.valid) {
				this.errors.push(...this.analysis.errors.map((e) => formatActionableError(toActionableError(new Error(e)))));
				throw new Error(this.analysis.errors.join("; ") || "备份分析失败");
			}
			this.step = "compatibility";
			return this.analysis;
		} catch (err) {
			if (this.errors.length === 0) this.errors.push(formatActionableError(toActionableError(err)));
			throw err;
		}
	}
	/** 步骤 3→4：用户确认兼容性后进入 Preview（Dry Run：用当前决策生成计划摘要，零写入） */
	async confirmCompatibility() {
		if (this.analysis === null || this.zipPath === null) throw new Error("尚未完成分析，请先选择备份文件");
		this.plan = await this.port.createImportPlan(this.resolvedZipPath(), this.decisions);
		this.step = "preview";
		return this.plan;
	}
	/** 更新全局冲突策略（merge/replace/skipExisting，规范 §11） */
	setStrategy(strategy) {
		this.decisions = {
			...this.decisions,
			strategy
		};
	}
	/** 设置逐项冲突决策（keepCurrent/useImported/review） */
	setResolutions(resolutions) {
		this.decisions = {
			...this.decisions,
			resolutions
		};
	}
	/** 设置路径映射（§12） */
	setPathMappings(mappings) {
		this.decisions = {
			...this.decisions,
			pathMappings: mappings
		};
	}
	/** 设置秘密补录值（仅内存，绝不持久化） */
	setSecretInputs(inputs) {
		this.secretInputs = inputs;
	}
	/** 设置加密备份的解密密码（仅内存，绝不持久化；导出密码不可复用，无明文存储） */
	setDecryptPassword(password) {
		this.decryptPassword = password;
	}
	/** Preview 摘要（规范 §10 数值化；基于当前 plan 与 analysis） */
	previewSummary() {
		const items = this.plan?.items ?? [];
		const analysis = this.analysis;
		const count = (kinds) => items.filter((i) => kinds.includes(i.kind)).length;
		return {
			willChange: count([
				"Create",
				"Update",
				"Install",
				"Conflict"
			]),
			unchanged: count(["Skip"]),
			settingsUpdates: count(["Create", "Update"]),
			pluginsInstalled: analysis?.pluginSummary.installed ?? 0,
			pluginsToInstall: count(["Install"]),
			mcpAdds: items.filter((i) => i.adapter === "mcp" && i.kind === "Create").length,
			prompts: items.filter((i) => i.adapter === "prompts" && i.kind !== "Skip").length,
			pathMappingsNeeded: analysis?.pathIssues.length ?? 0,
			secretsNeeded: this.plan?.missingSecrets.length ?? analysis?.secretCount ?? 0,
			conflicts: count(["Conflict"]),
			needsRestart: this.plan?.needsRestart ?? false
		};
	}
	/** 冲突项（供 ConflictCollector 使用） */
	conflictItems() {
		return (this.plan?.items ?? []).filter((i) => i.kind === "Conflict");
	}
	/** 设置回滚策略（场景 E 选择；执行前调用） */
	setRollbackOnError(enable) {
		this.rollbackOnError = enable;
	}
	/**
	* 步骤 10-14：确认导入 → 快照 → 执行 → 校验 → 结果。
	* 用最终决策重建计划（与预览一致），显式传 rollbackOnError。
	*/
	async execute(opts) {
		if (this.zipPath === null || this.analysis === null) throw new Error("尚未完成分析，请先选择备份文件");
		if (opts.confirm !== true) throw new Error("导入未确认：必须确认后才允许修改任何数据");
		const rollbackOnError = opts.rollbackOnError ?? this.rollbackOnError;
		this.step = "importing";
		this.tracker.emit("creating-snapshot");
		try {
			this.plan = await this.port.createImportPlan(this.resolvedZipPath(), this.decisions);
			this.tracker.emit(EXECUTING_STAGE);
			this.result = await this.port.executeImportPlan(this.resolvedZipPath(), this.plan, {
				confirm: true,
				secretInputs: this.secretInputs,
				rollbackOnError,
				decryptPassword: this.decryptPassword === "" ? void 0 : this.decryptPassword
			});
			if (!this.result.ok && this.result.rollback) this.tracker.emit("rolling-back");
			this.tracker.emit("done");
			this.step = "result";
			return this.result;
		} catch (err) {
			this.errors.push(formatActionableError(toActionableError(err)));
			throw err;
		}
	}
	/** 可重试项计数：执行失败（failed）或用户跳过（skippedByUser）的项。 */
	retryableCount() {
		return (this.result?.executed ?? []).filter((e) => e.status === "failed" || e.skippedByUser === true).length;
	}
	/** 可重试项 id 集合（与 result.executed 对齐；供 executeRetry 过滤计划）。 */
	retryableIds() {
		return new Set((this.result?.executed ?? []).filter((e) => e.status === "failed" || e.skippedByUser === true).map((e) => e.itemId));
	}
	/**
	* 步骤 10-14（重试版）：只重跑「失败 + 用户跳过」的子集计划（结果页「重试」按钮）。
	* - 复用已解析的最终计划（this.plan，含冲突决策/路径映射），过滤出可重试项；
	* - 仍走 executeImportPlan 全流程：快照 → 子集 apply → 校验 → 结果（幂等）；
	* - 已成功的项不重跑，不重建整体导入；secret 补录值仍沿用仅内存的 secretInputs。
	*/
	async executeRetry(opts) {
		if (this.plan === null || this.result === null) throw new Error("没有可重试的导入结果");
		const retryable = this.retryableIds();
		const subset = this.plan.items.filter((i) => retryable.has(i.id));
		if (subset.length === 0) throw new Error("没有失败或跳过的项需要重试");
		const rollbackOnError = opts.rollbackOnError ?? this.rollbackOnError;
		this.step = "importing";
		this.tracker.emit("creating-snapshot");
		try {
			this.tracker.emit(EXECUTING_STAGE);
			this.result = await this.port.executeImportPlan(this.resolvedZipPath(), {
				...this.plan,
				items: subset
			}, {
				confirm: true,
				secretInputs: this.secretInputs,
				rollbackOnError,
				decryptPassword: this.decryptPassword === "" ? void 0 : this.decryptPassword
			});
			if (!this.result.ok && this.result.rollback) this.tracker.emit("rolling-back");
			this.tracker.emit("done");
			this.step = "result";
			return this.result;
		} catch (err) {
			this.errors.push(formatActionableError(toActionableError(err)));
			throw err;
		}
	}
	/** 重置向导（可复用实例开始新导入） */
	reset() {
		this.step = "select";
		this.zipPath = null;
		this.analysis = null;
		this.plan = null;
		this.result = null;
		this.errors = [];
		this.decisions = {
			strategy: "merge",
			resolutions: {},
			pathMappings: []
		};
		this.secretInputs = {};
		this.decryptPassword = "";
		this.archiveUnlocked = false;
		this.unlockedZipPath = null;
	}
};
//#endregion
//#region src/client/sync/sync-view.ts
/**
* 私有仓库强制提示文案（Settings 区块常驻警示横幅）。
* 安全约束：同步内容为可移植配置，public 仓库会公开配置 → 必须私有；
* token 仅用于认证，绝不写入同步文件/提交内容/日志。
*/
function privateRepoHint(t = zhUiT) {
	return t("sync.privateRepoHint");
}
/** host 目录（SyncSectionInfo[]）→ UI 勾选项（保留 id 顺序）。
*  同步分区必为导出目录（DEFAULT_CATEGORIES）的可移植子集：分组/描述从导出目录
*  补充（单一事实源，与「导出备份·自定义模式」的目录保持一致），未命中 id 兜底。 */
function syncSectionOptions(info) {
	const meta = new Map(DEFAULT_CATEGORIES.map((c) => [c.id, c]));
	return info.map((s) => {
		const cat = meta.get(s.id);
		return {
			id: s.id,
			label: s.displayName,
			description: cat?.description ?? "",
			group: cat?.group ?? "general",
			portability: s.portability,
			defaultIncluded: s.defaultIncluded
		};
	});
}
/** 高级模式勾选目录 → 按导出分组（EXPORT_GROUPS）投影：与「导出备份·自定义模式」同构，
*  空分组省略；UI 直接渲染 groupCard。 */
function syncSectionGroups(options) {
	return EXPORT_GROUPS.map((g) => ({
		group: g.id,
		label: g.label,
		...g.note !== void 0 ? { note: g.note } : {},
		items: options.filter((o) => o.group === g.id)
	})).filter((g) => g.items.length > 0);
}
/** 默认（快速导出）模式的推荐同步分区：可移植且默认包含（与 ExportFlow.quickSelection 同口径）。 */
function recommendedSyncSections(info) {
	return info.filter((s) => s.portability === "portable" && s.defaultIncluded).map((s) => s.id);
}
/** 需要人工决策的 PlanItem 类型（与 SyncEngine.pull 的 needsReview 判定一致）。
* 注意：'Install' 不在此列 —— 插件安装随同步自动采用（product requirement）。 */
const REVIEW_KINDS = /* @__PURE__ */ new Set([
	"Conflict",
	"MissingSecret",
	"MissingDependency",
	"Error"
]);
/** 差异摘要：按 severity 计数 + 需人工决策标记（UI 统计徽章与警示横幅的数据源） */
function summarizePullChanges(changes) {
	let info = 0;
	let warning = 0;
	let error = 0;
	let needsReview = false;
	for (const c of changes) {
		if (c.severity === "error") error += 1;
		else if (c.severity === "warning") warning += 1;
		else info += 1;
		if (REVIEW_KINDS.has(c.kind)) needsReview = true;
	}
	return {
		total: changes.length,
		info,
		warning,
		error,
		needsReview,
		items: [...changes]
	};
}
/** PlanItemKind → 短标签（列表徽章） */
function kindLabel(kind, t = zhUiT) {
	switch (kind) {
		case "Create": return t("sync.kind.create");
		case "Update": return t("sync.kind.update");
		case "Skip": return t("sync.kind.skip");
		case "Conflict": return t("sync.kind.conflict");
		case "Install": return t("sync.kind.install");
		case "MissingSecret": return t("sync.kind.missingSecret");
		case "MissingDependency": return t("sync.kind.missingDependency");
		case "PathMapping": return t("sync.kind.pathMapping");
		case "Warning": return t("sync.kind.warning");
		case "Error": return t("sync.kind.error");
		default: return kind;
	}
}
/** severity → 短标签 */
function severityLabel(severity, t = zhUiT) {
	switch (severity) {
		case "error": return t("sync.severity.error");
		case "warning": return t("sync.severity.warning");
		default: return t("sync.severity.info");
	}
}
/** 缺省每通道状态（未配置时各字段默认值）。 */
function defaultChannelSyncState() {
	return {
		syncMode: "default",
		syncSections: [],
		encrypt: false,
		includeSecrets: false,
		encryptPassword: "",
		encryptPasswordConfirm: "",
		decryptPassword: "",
		selectedSnapshotId: "",
		snapshots: [],
		loadingSnapshots: false,
		autosync: null,
		autosyncEnabled: false,
		autosyncInterval: "30m"
	};
}
/** 通道子 tab 列表：git/webdav 两个 tab；busy 时全部禁用（防并发操作切换）。 */
function channelTabModels(active, busy) {
	return ["git", "webdav"].map((channel) => ({
		channel,
		active: channel === active,
		disabled: busy
	}));
}
/** 记住用户最近选择的通道（localStorage key；跨会话保持在用户上次所在栏）。
*  m-self：磁盘持久化（ui-prefs.json）为权威来源（Host 可读、随 self 分区进备份），
*  localStorage 仅保留为 status 响应未带回填时的同步降级通道（升级前遗留数据兼容）。 */
const SYNC_CHANNEL_STORAGE_KEY = "dsh.configManager.syncChannel";
/** 从 localStorage 读用户记住的通道；无/非法 → null（缺省 git，交由配置回填）。
*  浏览器环境走 globalThis.localStorage；node 测试注入 mock storage 或返回 null。 */
function readStoredChannel(storage) {
	const s = storage ?? browserStorage();
	if (s === null) return null;
	try {
		const v = s.getItem(SYNC_CHANNEL_STORAGE_KEY);
		return v === "webdav" || v === "git" ? v : null;
	} catch {
		return null;
	}
}
/** 把用户选择的通道写入 localStorage（记住，跨进入保持）。 */
function writeStoredChannel(channel, storage) {
	const s = storage ?? browserStorage();
	if (s === null) return;
	try {
		s.setItem(SYNC_CHANNEL_STORAGE_KEY, channel);
	} catch {}
}
/** 浏览器 localStorage；非浏览器（node 测试）→ null */
function browserStorage() {
	return globalThis?.localStorage ?? null;
}
/** 内置常见 WebDAV 服务器（预设下拉数据源；第一项为自定义）。 */
const WEBDAV_PRESETS = [
	{
		id: "custom",
		label: "Custom URL",
		url: "",
		hasPlaceholder: false
	},
	{
		id: "jianguoyun",
		label: "坚果云 (Jianguoyun)",
		url: "https://dav.jianguoyun.com/dav/",
		hasPlaceholder: false
	},
	{
		id: "nextcloud",
		label: "Nextcloud",
		url: "https://<server>/remote.php/dav/files/<user>/",
		hasPlaceholder: true
	},
	{
		id: "owncloud",
		label: "ownCloud",
		url: "https://<server>/remote.php/dav/files/<user>/",
		hasPlaceholder: true
	},
	{
		id: "seafile",
		label: "Seafile",
		url: "https://<server>/seafdav/",
		hasPlaceholder: true
	},
	{
		id: "synology",
		label: "Synology NAS (WebDAV)",
		url: "https://<nas-ip>:5006/",
		hasPlaceholder: true
	},
	{
		id: "box",
		label: "Box",
		url: "https://dav.box.com/dav/",
		hasPlaceholder: false
	}
];
/** 默认预设（自定义）对应的 id。 */
const WEBDAV_CUSTOM_PRESET_ID = "custom";
/** 根据预设 id 取 preset；未知 id → 自定义（缺省）。 */
function presetById(id) {
	return WEBDAV_PRESETS.find((p) => p.id === id) ?? WEBDAV_PRESETS[0];
}
/** 从已填 url 反推最接近的预设 id（用于下拉回显；无匹配 → 自定义）。 */
function presetIdForUrl(url) {
	const trimmed = url.trim();
	if (trimmed === "") return WEBDAV_CUSTOM_PRESET_ID;
	for (const p of WEBDAV_PRESETS) if (!p.hasPlaceholder && p.url !== "" && trimmed.toLowerCase().startsWith(p.url.toLowerCase())) return p.id;
	return WEBDAV_CUSTOM_PRESET_ID;
}
/** 活动通道的远端地址是否就绪（git=repoUrl，webdav=webdavUrl）。 */
function computeRemoteReady(channel, gitUrl, webdavUrl) {
	return (channel === "webdav" ? webdavUrl : gitUrl).trim() !== "";
}
/**
* 按钮可用性与文案：
* - 任一操作进行中（busy）→ 两个按钮都禁用（防并发 push/pull）；
* - 活动通道远端地址未就绪（remoteReady=false）→ 禁用（无从同步）；
* - busy 时按钮文案切换为「正在推送/拉取…」（配 Spinner）。
*/
function computeSyncButtons(busy, remoteReady, t = zhUiT) {
	const enabled = busy === null && remoteReady;
	return {
		canPush: enabled,
		canPull: enabled,
		pushLabel: busy === "push" ? t("sync.pushing") : busy === "sync" ? t("sync.syncing") : t("sync.pushLabel"),
		pullLabel: busy === "pull" ? t("sync.pulling") : busy === "sync" ? t("sync.syncing") : t("sync.pullLabel")
	};
}
/** ISO-8601 → 本地可读时间（YYYY-MM-DD HH:mm；非法输入原样返回） */
function formatDateTime$1(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
/** push 报告 → 渲染模型（ok 头部带快照 id；失败显示引擎 message；分区与告警透传） */
function pushReportView(report, t = zhUiT) {
	if (report === null) return null;
	if (!report.ok) return {
		kind: "error",
		headline: report.message ?? t("sync.pushFailed"),
		sections: report.sections,
		warnings: report.warnings
	};
	return {
		kind: "ok",
		headline: t("sync.pushOk", { id: report.snapshotId }),
		sections: report.sections,
		warnings: report.warnings
	};
}
/** push 预览 → 渲染模型（P0-②）：列分区 + 变更计数 + 远端基线提示。 */
function pushPreviewView(preview, t = zhUiT) {
	if (preview === null) return null;
	if (!preview.ok) return {
		ok: false,
		rows: [],
		changedCount: 0,
		remoteSnapshotCount: preview.remoteSnapshotCount,
		encryptedHint: "",
		previewHint: "",
		headline: "",
		error: preview.message ?? t("sync.pushFailed")
	};
	const rows = preview.sections.map((s) => ({
		section: s.section,
		count: s.count,
		changed: s.changed
	}));
	const changedCount = preview.sections.filter((s) => s.changed).length;
	return {
		ok: true,
		rows,
		changedCount,
		remoteSnapshotCount: preview.remoteSnapshotCount,
		encryptedHint: preview.encrypted ? t("sync.pushPreviewEncrypted") : "",
		previewHint: t("sync.pushPreviewHint"),
		headline: t("sync.pushPreviewHeadline", {
			total: String(preview.sections.length),
			changed: String(changedCount)
		}),
		error: null
	};
}
/** pull 报告 → 渲染模型（差异预览；empty = 无变更；error = 拉取失败） */
function pullReportView(report, t = zhUiT) {
	if (report === null) return null;
	if (!report.ok) return {
		kind: "error",
		headline: report.message ?? t("sync.pullFailed"),
		summary: null,
		previewHint: ""
	};
	if (report.changes.length === 0) return {
		kind: "empty",
		headline: report.message ?? t("sync.pullEmpty"),
		summary: null,
		previewHint: ""
	};
	return {
		kind: "ok",
		headline: t("sync.pullOk", {
			id: report.snapshotId,
			count: String(report.changes.length)
		}),
		summary: summarizePullChanges(report.changes),
		previewHint: t("sync.previewHint")
	};
}
/**
* GitHub 登录区块渲染模型（纯函数，node 可测）：
* - idle → 可发起；starting → 请求设备码中；waiting → 展示设备码等待用户在浏览器授权；
* - polling → 轮询 GitHub 中（仍展示代码区块）；success → 完成；error → 可重试。
*/
function computeGithubLoginView(phase, userCode, verificationUri, error, t = zhUiT) {
	const inFlight = phase === "starting" || phase === "waiting" || phase === "polling";
	let statusText;
	switch (phase) {
		case "starting":
			statusText = t("sync.github.starting");
			break;
		case "waiting":
			statusText = userCode === "" ? t("sync.github.waitingNoCode") : t("sync.github.waiting", { code: userCode });
			break;
		case "polling":
			statusText = t("sync.github.polling");
			break;
		case "success":
			statusText = t("sync.github.success");
			break;
		case "error":
			statusText = error ?? t("sync.github.failed");
			break;
		default: statusText = t("sync.github.defaultStatus");
	}
	return {
		phase,
		userCode,
		verificationUri,
		statusText,
		startLabel: phase === "error" ? t("sync.github.relogin") : t("sync.github.login"),
		canStart: phase === "idle" || phase === "error",
		canCancel: inFlight,
		showCode: phase === "waiting" || phase === "polling",
		error
	};
}
/** 轮询终止态 → 用户可读消息（pending 不是终止态，返回空串；成功/拒绝/过期/错误给出明确文案） */
function githubPollMessage(poll, t = zhUiT) {
	switch (poll.status) {
		case "success": return t("sync.github.pollSuccess");
		case "denied": return t("sync.github.pollDenied");
		case "expired": return t("sync.github.pollExpired");
		case "error": return t("sync.github.pollError", { detail: poll.message ?? poll.errorCode ?? t("sync.github.unknownError") });
		default: return "";
	}
}
/** 需要人工决策的 PlanItemKind（与 Host /sync/sync 的 needsReview 判定对齐）。
* 注意：'Install'（安装插件）不在其中 —— 插件安装默认自动采用（defaultAdopt=true）、
* 不逐项展示、无需手动选择（product requirement）。 */
const CONFIRM_REVIEW_KINDS = /* @__PURE__ */ new Set([
	"Conflict",
	"MissingSecret",
	"MissingDependency",
	"Error",
	"PathMapping"
]);
/**
* 仅保留需人工决策的项（差异确认列表只渲染这些）。
* 统计（summarizeConfirmItems）仍基于全量 items，不受影响。
*/
function reviewItems(items) {
	return items.filter((it) => CONFIRM_REVIEW_KINDS.has(it.kind));
}
/**
* 「全部保留本地」：所有 Conflict 项 → resolution=keepLocal、adopt=false。
* 仅作用于 Conflict 项，非 Conflict 项的 adopt 保持默认。
*/
function keepLocalAll(items) {
	return items.filter((it) => it.kind === "Conflict").map((it) => ({
		itemId: it.itemId,
		resolution: "keepLocal",
		adopt: false
	}));
}
/**
* 「全部采用远端」：所有 Conflict 项 → resolution=useRemote、adopt=true。
* 仅作用于 Conflict 项，非 Conflict 项的 adopt 保持默认。
*/
function useRemoteAll(items) {
	return items.filter((it) => it.kind === "Conflict").map((it) => ({
		itemId: it.itemId,
		resolution: "useRemote",
		adopt: true
	}));
}
/** 差异确认列表摘要（按 severity 计数 + 采用数 + needsReview 徽章数据源）。 */
function summarizeConfirmItems(items) {
	let info = 0;
	let warning = 0;
	let error = 0;
	let adopted = 0;
	let needsReview = false;
	for (const it of items) {
		if (it.severity === "error") error += 1;
		else if (it.severity === "warning") warning += 1;
		else info += 1;
		if (it.adopt) adopted += 1;
		if (CONFIRM_REVIEW_KINDS.has(it.kind)) needsReview = true;
	}
	return {
		total: items.length,
		info,
		warning,
		error,
		adopted,
		needsReview
	};
}
/**
* 收集用户逐项决策 → apply-items 请求体 adoptions[]。
* 仅包含 adopt=true 的项；Conflict 项 adopt=true 且未给 resolution → 抛错（强制先解决）。
* 与导入恢复向导一致：只提供「保留当前 / 使用导入」两项，跳过 = 取消勾选（adopt=false）。
*/
function buildAdoptions(items, adopted, resolutions) {
	const out = [];
	for (const it of items) {
		if (adopted.get(it.itemId) !== true) continue;
		const adoption = {
			itemId: it.itemId,
			adopt: true
		};
		if (it.kind === "Conflict") {
			const resolution = resolutions.get(it.itemId);
			if (resolution === void 0) throw new Error(`冲突项 ${it.itemId} 必须先选择解决方式（保留当前 / 使用导入）`);
			adoption.resolution = resolution;
		}
		out.push(adoption);
	}
	return out;
}
/** AutosyncInterval → ms。 */
function autosyncIntervalMs(interval) {
	switch (interval) {
		case "5m": return 3e5;
		case "15m": return 9e5;
		case "60m": return 36e5;
		case "6h": return 216e5;
		case "12h": return 432e5;
		case "24h": return 864e5;
		default: return 18e5;
	}
}
/** 距下次自动同步剩余 ms（已到期 → 0）。elapsedMs 为 host 计算的「距上次执行已过 ms」。 */
function computeAutosyncCountdown(elapsedMs, intervalMs) {
	if (elapsedMs < 0) return -1;
	return Math.max(0, intervalMs - elapsedMs);
}
/**
* 剩余时长 → 可读文案（向上取整，避免出现「0 分钟」；≤0 视为 1 分钟兜底）。
* 例：4 分钟 →「4 分钟」；90 分钟 →「2 小时」；30 小时 →「2 天」。
*/
function formatIntervalDuration(ms, t = zhUiT) {
	const totalMinutes = Math.max(1, Math.ceil(ms / 6e4));
	if (totalMinutes < 60) return t("sync.duration.min", { n: totalMinutes });
	const totalHours = Math.ceil(totalMinutes / 60);
	if (totalHours < 24) return t("sync.duration.hour", { n: totalHours });
	return t("sync.duration.day", { n: Math.ceil(totalHours / 24) });
}
/** 自动同步状态行的可读文案（未运行 / 上次状态 / 连续失败计数）。 */
function autosyncStatusText(status, t = zhUiT) {
	if (status.lastRunAt === void 0 || status.lastRunAt === "" || status.lastRunStatus === void 0) return t("sync.autosyncNever");
	return `${status.lastRunStatus === "success" ? t("sync.autosyncSuccess") : status.lastRunStatus === "skipped" ? t("sync.autosyncSkipped") : status.lastRunStatus === "partial" ? t("sync.autosyncPartial") : t("sync.autosyncFailed")} · ${t("sync.autosyncLastRun", { time: formatDateTime$1(status.lastRunAt) })}${status.consecutiveFailures > 0 ? ` · ${t("sync.autosyncFailCount", { n: String(status.consecutiveFailures) })}` : ""}`;
}
//#endregion
//#region src/client/run-store.ts
/**
* m2: 模块级 run/UI store —— dsh-config-manager 浏览器半的状态中枢。
*
* 解决的问题（验收 m2-state / m2-refresh / m2-resume）：
*  - 切 tab / 关面板重开：模块级单例存活于当前 JS 上下文，ExportFlow /
*    ImportWizard 控制器实例与 UI 状态**不重建**（m2-state）；
*  - 页面刷新：非敏感状态经 sessionStorage（键 dsh.cfgMgr.state.v1）
*    序列化/反序列化恢复（m2-refresh）；敏感字段
*    password / passwordConfirm / secretInputs **只存在内存**，序列化白名单
*    显式剔除 —— 刷新后自动清空，secrets 阶段要求重输；
*  - 进行中 run：视图挂载时经 GET /runs 找回活跃 runId，轮询 GET /progress
*    直到完成/失败，把 RunState.result 回填到 store（m2-resume）。服务端在
*    刷新/关面板期间继续执行，本 store 只负责重新订阅进度。
*
* 低频面板（Snapshots / Sync / Market / About）同样把非敏感 UI 状态镜像进这里：
*  - ConfigManagerSection 的「当前打开面板」（panel）持久化，刷新后回到原 tab；
*  - SyncSettingsView / MarketPanel / SnapshotsPanel 把自身状态切片（toXxxStoreSlice）
*    镜像进 store —— 模块级单例保证「切 tab 不丢」，sessionStorage 白名单保证
*    「刷新恢复」；同步凭据（token / webdav 密码 / 加密与解密密码）仅内存，
*    由 toPersistedState 硬性剔除，刷新后清空要求重输。
*
* 控制器 rehydrate 说明：ImportWizard 没有公开的 hydrate 入口（m2 约束为只改
* src/client/、不动 src/ui/），刷新恢复需要把持久化的非敏感快照写回控制器
* 私有字段。writeWizardSnapshot() 是唯一的受控访问点：类型层 private 只是
* 编译期约束（运行时是普通属性），所有写入值都来自序列化白名单（已剔除
* 密码/密钥/secretInputs），且只在 load / hydrate / resume-settle 时调用。
*
* 安全约束：
*  - toPersistedState() 用解构白名单剔除敏感字段，即使未来往 LiveState 加字段，
*    未显式放行也不会落入 sessionStorage；
*  - runId 为 32-hex 不可猜标识，可安全持久化（/runs + /progress 的查询键）。
*/
/** sessionStorage 键。 */
const STATE_KEY = "dsh.cfgMgr.state.v1";
/** Custom 模式的初始勾选 = 推荐分区（可再调整） */
function defaultCustomSelection() {
	return DEFAULT_CATEGORIES.filter((c) => c.defaultIncluded).map((c) => c.id);
}
function defaultExportState() {
	return {
		mode: "quick",
		selection: defaultCustomSelection(),
		includeSecrets: false,
		encrypt: false,
		password: "",
		passwordConfirm: "",
		fileName: "",
		note: "",
		running: false,
		progress: null,
		result: null,
		error: null,
		downloaded: false,
		runId: null
	};
}
function defaultImportState() {
	return {
		step: "select",
		zipPath: null,
		selectedFileName: null,
		containerEncrypted: false,
		analysis: null,
		plan: null,
		result: null,
		rollbackOnError: true,
		errors: [],
		phase: "preview",
		conflictStrategy: "merge",
		conflictResolutions: {},
		pathMappings: [],
		secretInputs: {},
		decryptPassword: "",
		decryptRefs: [],
		archiveUnlocked: false,
		uploading: false,
		running: false,
		progress: null,
		error: null,
		runId: null,
		conflictCollector: null,
		skipRequested: false
	};
}
function defaultSyncState() {
	return {
		channel: "git",
		repoUrl: "",
		token: "",
		webdavUrl: "",
		webdavUsername: "",
		webdavPassword: "",
		byChannel: {
			git: defaultChannelSyncState(),
			webdav: defaultChannelSyncState()
		},
		busy: null,
		savingConfig: false,
		pushReport: null,
		pullReport: null,
		pushPreview: {
			preview: null,
			open: false
		},
		confirmSession: null,
		confirmDecisions: null,
		lastRestoreId: null,
		error: null,
		loadError: null
	};
}
function defaultMarketState() {
	return {
		subView: "browse",
		search: "",
		category: "",
		sectionFilter: "",
		source: "all",
		sortKey: "default",
		items: [],
		detail: null,
		approvals: {},
		importResult: null,
		error: null,
		loadError: null,
		myItems: null,
		myItemsError: null,
		myWizard: null,
		myInstall: null,
		myConfirmDeleteId: null
	};
}
function defaultSnapshotsState() {
	return {
		selectedId: null,
		plan: null,
		running: false,
		report: null,
		actionError: null,
		error: null,
		backupDraft: null,
		importBackup: null,
		subTab: "restore"
	};
}
function defaultProfilesState() {
	return {
		profiles: null,
		selectedName: null,
		preview: null,
		switchResult: null,
		error: null,
		loadError: null
	};
}
function defaultRecoveryState() {
	return {
		status: null,
		selectedOperationId: null,
		preview: null,
		verifyResult: null,
		running: false,
		error: null,
		actionError: null
	};
}
function defaultMoreState() {
	return { moreSub: "about" };
}
function defaultState() {
	return {
		v: 1,
		view: "export",
		panel: null,
		export: defaultExportState(),
		import: defaultImportState(),
		sync: defaultSyncState(),
		market: defaultMarketState(),
		snapshots: defaultSnapshotsState(),
		profiles: defaultProfilesState(),
		recovery: defaultRecoveryState(),
		more: defaultMoreState()
	};
}
/**
* 从视图状态提取同步切片（结构兼容：传入 SyncUiState 亦可；只保留切片字段，
* github 流程态/loading 等瞬态不进入切片；busy/savingConfig 为「内存切片」瞬态——
* 切 tab 由模块级单例保留，刷新时被 toPersistedState 白名单剔除）。组件每次状态
* 变化后（含异步回调）调用，把非敏感 + 仅内存字段镜像进 store。
* byChannel 的快照数组复制引用（避免跨切片共享可变数组）。
*/
function toSyncStoreSlice(s) {
	return {
		channel: s.channel,
		repoUrl: s.repoUrl,
		token: s.token,
		webdavUrl: s.webdavUrl,
		webdavUsername: s.webdavUsername,
		webdavPassword: s.webdavPassword,
		byChannel: {
			git: {
				...s.byChannel.git,
				snapshots: [...s.byChannel.git.snapshots]
			},
			webdav: {
				...s.byChannel.webdav,
				snapshots: [...s.byChannel.webdav.snapshots]
			}
		},
		busy: s.busy,
		savingConfig: s.savingConfig,
		pushReport: s.pushReport,
		pullReport: s.pullReport,
		pushPreview: s.pushPreview,
		confirmSession: s.confirmSession,
		confirmDecisions: s.confirmDecisions,
		lastRestoreId: s.lastRestoreId,
		error: s.error,
		loadError: s.loadError
	};
}
/** 从市场视图状态提取切片（结构兼容：传入 MarketUiState 亦可）。 */
function toMarketStoreSlice(s) {
	return {
		subView: s.subView,
		search: s.search,
		category: s.category,
		sectionFilter: s.sectionFilter,
		source: s.source,
		sortKey: s.sortKey,
		items: s.items,
		detail: s.detail,
		approvals: s.approvals,
		importResult: s.importResult,
		error: s.error,
		loadError: s.loadError,
		myItems: s.myItems,
		myItemsError: s.myItemsError,
		myWizard: s.myWizard,
		myInstall: s.myInstall,
		myConfirmDeleteId: s.myConfirmDeleteId
	};
}
/** 从快照面板状态提取切片（结构兼容：传入 PanelState 亦可）。 */
function toSnapshotsStoreSlice(s) {
	return {
		selectedId: s.selectedId,
		plan: s.plan,
		running: s.running,
		report: s.report,
		actionError: s.actionError,
		error: s.error,
		backupDraft: s.backupDraft,
		importBackup: s.importBackup,
		subTab: s.subTab
	};
}
/** 从配置档案面板状态提取切片（结构兼容：传入 PanelState 亦可）。 */
function toProfilesStoreSlice(s) {
	return {
		profiles: s.profiles,
		selectedName: s.selectedName,
		preview: s.preview,
		switchResult: s.switchResult,
		error: s.error,
		loadError: s.loadError
	};
}
/**
* 持久化白名单：解构剔除敏感字段（password/passwordConfirm/secretInputs/decryptPassword）
* 与不可序列化的实例字段（conflictCollector），以及同步面板的凭据字段
* （token/webdavPassword/encryptPassword/encryptPasswordConfirm/decryptPassword ——
* 含 byChannel 内每通道的加密/解密密码）与瞬态字段（busy/savingConfig —— 刷新后
* 回复空闲，不把「进行中」状态带到新页面）；导出面板的结果字段（result/downloaded）
* 与进行中/进度（running/progress/runId）同为内存切片瞬态一并剔除（刷新/关闭 DSH
* 后不残留上次导出报告），其余原样落入 sessionStorage。
* 这是 sessionStorage 的唯一写入路径 —— 敏感值在此被硬性隔离。
*/
function toPersistedState(state) {
	const { password: _password, passwordConfirm: _passwordConfirm, result: _result, downloaded: _downloaded, running: _running, progress: _progress, runId: _runId, ...exportRest } = state.export;
	const { secretInputs: _secretInputs, decryptPassword: _decryptPassword, decryptRefs: _decryptRefs, archiveUnlocked: _archiveUnlocked, conflictCollector: _conflictCollector, skipRequested: _skipRequested, ...importRest } = state.import;
	const { token: _token, webdavPassword: _webdavPassword, busy: _busy, savingConfig: _savingConfig, ...syncRest } = state.sync;
	const stripChannelSensitive = (c) => {
		const { encryptPassword: _ep, encryptPasswordConfirm: _epc, decryptPassword: _dp, ...rest } = c;
		return rest;
	};
	return {
		v: 1,
		view: state.view,
		panel: state.panel,
		export: exportRest,
		import: importRest,
		sync: {
			...syncRest,
			byChannel: {
				git: stripChannelSensitive(state.sync.byChannel.git),
				webdav: stripChannelSensitive(state.sync.byChannel.webdav)
			}
		},
		market: state.market,
		snapshots: {
			...state.snapshots,
			running: false,
			importBackup: null
		},
		profiles: {
			profiles: state.profiles.profiles,
			selectedName: state.profiles.selectedName,
			preview: state.profiles.preview,
			switchResult: state.profiles.switchResult,
			error: state.profiles.error,
			loadError: state.profiles.loadError
		},
		recovery: {
			...state.recovery,
			running: false
		},
		more: state.more
	};
}
/** 解析 + 轻量校验持久化状态；损坏/版本不符返回 null（调用方回退默认并清键）。 */
function parsePersistedState(raw) {
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	if (typeof parsed !== "object" || parsed === null) return null;
	const p = parsed;
	if (p["v"] !== 1) return null;
	const view = p["view"];
	if (view !== "export" && view !== "import") return null;
	const exp = p["export"];
	const imp = p["import"];
	if (typeof exp !== "object" || exp === null || typeof imp !== "object" || imp === null) return null;
	const rawPanel = p["panel"];
	let panel = null;
	let moreSub = "about";
	let snapshotsSubTab = "restore";
	switch (rawPanel) {
		case "snapshots":
		case "sync":
		case "market":
		case "profiles":
		case "more":
			panel = rawPanel;
			break;
		case "about":
			panel = "more";
			moreSub = "about";
			break;
		case "history":
			panel = "more";
			moreSub = "history";
			break;
		case "recovery":
			panel = "snapshots";
			snapshotsSubTab = "recovery";
			break;
		default: panel = null;
	}
	const sync = isRecord(p["sync"]) ? p["sync"] : defaultSyncState();
	const market = isRecord(p["market"]) ? p["market"] : defaultMarketState();
	const snapshots = isRecord(p["snapshots"]) ? p["snapshots"] : defaultSnapshotsState();
	const profiles = isRecord(p["profiles"]) ? p["profiles"] : defaultProfilesState();
	const recovery = isRecord(p["recovery"]) ? p["recovery"] : defaultRecoveryState();
	const migratedSnapshots = rawPanel === "recovery" ? {
		...snapshots,
		subTab: snapshotsSubTab
	} : snapshots;
	const more = isRecord(p["more"]) ? {
		...defaultMoreState(),
		...p["more"]
	} : { moreSub };
	return {
		v: 1,
		view,
		panel,
		export: exp,
		import: imp,
		sync,
		market,
		snapshots: migratedSnapshots,
		profiles,
		recovery,
		more
	};
}
/** 运行时不变量小工具：值为普通对象。 */
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/**
* 把 store 的导入快照写回 ImportWizard 控制器私有字段（受控 rehydrate）。
* - 只写非敏感字段；secretInputs / decryptPassword / archiveUnlocked / unlockedZipPath
*   恒置空 —— 刷新后要求重输密码重新解锁容器；
* - 仅在 load / hydrate / resume-settle 时调用，不参与正常交互路径。
*/
function writeWizardSnapshot(wizard, imp) {
	const internals = wizard;
	internals.step = imp.step;
	internals.zipPath = imp.zipPath;
	internals.analysis = imp.analysis;
	internals.plan = imp.plan;
	internals.result = imp.result;
	internals.rollbackOnError = imp.rollbackOnError;
	internals.errors = [...imp.errors];
	internals.decisions = {
		strategy: imp.conflictStrategy,
		resolutions: { ...imp.conflictResolutions },
		pathMappings: imp.pathMappings.map((m) => ({
			...m,
			appliesTo: [...m.appliesTo]
		}))
	};
	internals.secretInputs = {};
	internals.decryptPassword = "";
	internals.archiveUnlocked = false;
	internals.unlockedZipPath = null;
}
/** 由 plan + 已持久化的决策重建 ConflictCollector（刷新恢复用）。 */
function rebuildConflictCollector(plan, resolutions) {
	const collector = new ConflictCollector(plan);
	for (const [id, resolution] of Object.entries(resolutions)) collector.resolve(id, resolution);
	return collector;
}
/**
* RunState → RunProgress（m3 轮询进度回填）。
* - step/total = 内部计数（百分比条按 item/itemTotal 推进）；
* - section/sectionTotal 与 item/itemTotal 单独保留给分区徽章/内部计数徽章；
* - detail = 当前项名（导出时恒为分区名，ProgressBar 侧会去冗余）。
*/
function mapRunProgress(kind, state) {
	return {
		stage: kind === "export" ? "exporting" : "executing",
		detail: state.detail ?? void 0,
		step: state.item ?? void 0,
		total: state.itemTotal ?? void 0,
		section: state.section,
		sectionTotal: state.sectionTotal,
		item: state.item,
		itemTotal: state.itemTotal,
		log: state.log ?? []
	};
}
function defaultStorage() {
	if (typeof window === "undefined") return null;
	try {
		return window.sessionStorage ?? null;
	} catch {
		return null;
	}
}
/**
* 模块级单例 store：控制器实例 + React UI 状态 + sessionStorage 恢复。
* 最小接口：subscribe / getSnapshot / load / save / patch / syncWizard /
* exportFlow / importWizard / resume / stopResume。
*/
var RunStore = class {
	storage;
	pollIntervalMs;
	listeners = /* @__PURE__ */ new Set();
	state;
	exportFlowInst = null;
	importWizardInst = null;
	apiRef = null;
	/** 正在轮询的 runId 集合（stopResume 清空；防重复订阅） */
	polling = /* @__PURE__ */ new Set();
	/** 每个 runId 至多一个挂起的轮询定时器（fire 后由下一次调度覆盖） */
	timers = /* @__PURE__ */ new Map();
	/** 正在「发现进行中 run」的 kind 集合（watchRunning 活动标记；stopRunWatch/stopResume 清空） */
	watchActive = /* @__PURE__ */ new Set();
	constructor(opts = {}) {
		this.storage = opts.storage !== void 0 ? opts.storage : defaultStorage();
		this.pollIntervalMs = opts.pollIntervalMs ?? 1e3;
		this.state = defaultState();
		this.load();
	}
	/**
	* 订阅 store 变化（useSyncExternalStore 的 subscribe）。
	*
	* 必须为箭头函数类字段：React 以裸引用（`runStore.subscribe`）调用它，
	* 无接收者，若为原型方法则 `this` 为 undefined，`this.listeners` 直接崩溃。
	*/
	subscribe = (listener) => {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};
	/**
	* 当前完整快照（引用稳定：仅在 patch 后替换，适合 useSyncExternalStore）。
	*
	* 必须为箭头函数类字段：React 以裸引用（`runStore.getSnapshot`）调用它，
	* 无接收者，若为原型方法则 `this` 为 undefined，`this.state` 抛 TypeError，
	* 导致整个 settings.section 槽位渲染崩溃（备份与迁移页空白）。
	*/
	getSnapshot = () => this.state;
	notify() {
		for (const listener of this.listeners) listener();
	}
	/** 浅合并补丁并立即持久化（保存走白名单，敏感字段不落盘）。 */
	patch(patchObj) {
		this.state = {
			...this.state,
			view: patchObj.view ?? this.state.view,
			panel: patchObj.panel !== void 0 ? patchObj.panel : this.state.panel,
			export: {
				...this.state.export,
				...patchObj.export
			},
			import: {
				...this.state.import,
				...patchObj.import
			},
			sync: {
				...this.state.sync,
				...patchObj.sync
			},
			market: {
				...this.state.market,
				...patchObj.market
			},
			snapshots: {
				...this.state.snapshots,
				...patchObj.snapshots
			},
			profiles: {
				...this.state.profiles,
				...patchObj.profiles
			},
			recovery: {
				...this.state.recovery,
				...patchObj.recovery
			},
			more: {
				...this.state.more,
				...patchObj.more
			}
		};
		this.notify();
		this.save();
	}
	/** 把 ImportWizard 控制器的 snapshot() 镜像进 store（wizard 动作后调用）。 */
	syncWizard() {
		const wizard = this.importWizardInst;
		if (wizard === null) return;
		const snap = wizard.snapshot();
		this.patch({ import: {
			step: snap.step,
			zipPath: snap.zipPath,
			analysis: snap.analysis,
			plan: snap.plan,
			result: snap.result,
			rollbackOnError: snap.rollbackOnError,
			errors: snap.errors
		} });
	}
	/** 从存储恢复非敏感状态（构造时调用一次；损坏数据回退默认并清键）。 */
	load() {
		if (this.storage === null) return;
		let raw = null;
		try {
			raw = this.storage.getItem(STATE_KEY);
		} catch {
			return;
		}
		if (raw === null || raw === "") {
			this.state = defaultState();
			return;
		}
		const parsed = parsePersistedState(raw);
		if (parsed === null) {
			try {
				this.storage.removeItem(STATE_KEY);
			} catch {}
			this.state = defaultState();
			return;
		}
		this.applyPersisted(parsed);
	}
	/** 把解析后的持久化状态合并进运行时状态；敏感字段强制回到默认（清空）。 */
	applyPersisted(parsed) {
		this.state = {
			v: 1,
			view: parsed.view,
			panel: parsed.panel,
			export: {
				...defaultExportState(),
				...parsed.export,
				password: "",
				passwordConfirm: "",
				result: null,
				downloaded: false,
				running: false,
				progress: null,
				runId: null
			},
			import: {
				...defaultImportState(),
				...parsed.import,
				selectedFileName: parsed.import.selectedFileName ?? null,
				containerEncrypted: parsed.import.containerEncrypted === true,
				secretInputs: {},
				decryptPassword: "",
				decryptRefs: [],
				archiveUnlocked: false,
				conflictCollector: null,
				skipRequested: false
			},
			sync: (() => {
				const legacySync = parsed.sync;
				const legacyGit = typeof legacySync["syncMode"] === "string" || Array.isArray(legacySync["syncSections"]) ? {
					syncMode: legacySync["syncMode"] === "advanced" ? "advanced" : "default",
					syncSections: Array.isArray(legacySync["syncSections"]) ? legacySync["syncSections"] : [],
					encrypt: legacySync["encrypt"] === true,
					includeSecrets: legacySync["includeSecrets"] === true,
					selectedSnapshotId: typeof legacySync["selectedSnapshotId"] === "string" ? legacySync["selectedSnapshotId"] : "",
					snapshots: [],
					autosync: null,
					autosyncEnabled: false,
					autosyncInterval: "30m"
				} : void 0;
				return {
					...defaultSyncState(),
					...parsed.sync,
					token: "",
					webdavPassword: "",
					busy: null,
					savingConfig: false,
					byChannel: {
						git: {
							...defaultChannelSyncState(),
							...legacyGit ?? parsed.sync.byChannel?.git,
							encryptPassword: "",
							encryptPasswordConfirm: "",
							decryptPassword: ""
						},
						webdav: {
							...defaultChannelSyncState(),
							...parsed.sync.byChannel?.webdav,
							encryptPassword: "",
							encryptPasswordConfirm: "",
							decryptPassword: ""
						}
					}
				};
			})(),
			market: {
				...defaultMarketState(),
				...parsed.market
			},
			snapshots: {
				...defaultSnapshotsState(),
				...parsed.snapshots,
				running: false,
				importBackup: null,
				subTab: parsed.snapshots.subTab === "files" ? "files" : parsed.snapshots.subTab === "recovery" ? "recovery" : "restore"
			},
			profiles: {
				...defaultProfilesState(),
				...parsed.profiles
			},
			recovery: {
				...defaultRecoveryState(),
				...parsed.recovery,
				running: false
			},
			more: { moreSub: parsed.more.moreSub === "history" ? "history" : "about" }
		};
		if (this.state.import.containerEncrypted && this.state.import.phase !== "preview" && this.state.import.phase !== "decrypt-archive") this.state.import.phase = "decrypt-archive";
		const missing = this.state.import.plan?.missingSecrets ?? [];
		if (this.state.import.phase === "confirm" && missing.length > 0) this.state.import.phase = "secrets";
		const imp = this.state.import;
		if (imp.phase === "conflicts" && imp.plan !== null) imp.conflictCollector = rebuildConflictCollector(imp.plan, imp.conflictResolutions);
	}
	/** 把非敏感状态写入 sessionStorage（白名单序列化；无存储时为空操作）。 */
	save() {
		if (this.storage === null) return;
		try {
			this.storage.setItem(STATE_KEY, JSON.stringify(toPersistedState(this.state)));
		} catch {}
	}
	/** ExportFlow 控制器实例：懒创建 + 缓存（切 tab/关面板不重建）。 */
	exportFlow(api) {
		if (this.exportFlowInst === null) {
			if (this.apiRef === null) this.apiRef = api;
			this.exportFlowInst = new ExportFlow({
				port: api,
				onProgress: (event) => {
					this.patch({ export: { progress: event } });
				}
			});
		}
		return this.exportFlowInst;
	}
	/** ImportWizard 控制器实例：懒创建 + 缓存；首次创建时从持久化快照 rehydrate。 */
	importWizard(api) {
		if (this.importWizardInst === null) {
			if (this.apiRef === null) this.apiRef = api;
			const wizard = new ImportWizard({
				port: api,
				onProgress: (event) => {
					this.patch({ import: { progress: event } });
				},
				defaultRollbackOnError: true
			});
			writeWizardSnapshot(wizard, this.state.import);
			this.importWizardInst = wizard;
		}
		return this.importWizardInst;
	}
	/**
	* 重新订阅进行中的 run：GET /runs 找回活跃 runId → 轮询 /progress 直到
	* 完成/失败，把 RunState.result 回填 store（导出结果 / 导入结果均可恢复）。
	* 返回是否有 run 被恢复。幂等：同一 runId 不会重复轮询。
	*/
	async resume(api) {
		if (this.apiRef === null) this.apiRef = api;
		let active;
		try {
			active = await api.runs();
		} catch {
			return false;
		}
		let resumed = false;
		const exportRun = active.find((r) => r.kind === "export");
		if (exportRun !== void 0) {
			resumed = true;
			this.patch({ export: {
				running: true,
				runId: exportRun.runId,
				progress: mapRunProgress("export", exportRun)
			} });
			this.pollRun(exportRun.runId, "export");
		} else if (this.state.export.running) this.patch({ export: {
			running: false,
			progress: null,
			runId: null,
			error: "上次导出任务已结束但结果无法恢复，请重新导出"
		} });
		const importRun = active.find((r) => r.kind === "import");
		if (importRun !== void 0) {
			resumed = true;
			this.patch({ import: {
				running: true,
				runId: importRun.runId,
				step: "importing",
				progress: mapRunProgress("import", importRun)
			} });
			this.pollRun(importRun.runId, "import");
		} else if (this.state.import.step === "importing") {
			this.importWizardInst?.reset();
			this.patch({ import: {
				step: "select",
				phase: "preview",
				runId: null,
				running: false,
				progress: null,
				conflictCollector: null,
				selectedFileName: null,
				errors: [],
				error: "上次导入任务已结束或超过保留期，结果无法恢复，请重新导入"
			} });
		}
		const restoreRun = active.find((r) => r.kind === "restore");
		if (restoreRun !== void 0) {
			resumed = true;
			this.patch({ snapshots: {
				running: true,
				actionError: null
			} });
			this.pollRun(restoreRun.runId, "restore");
		} else if (this.state.snapshots.running) this.patch({ snapshots: {
			running: false,
			actionError: "上次恢复任务已结束但结果无法恢复，请重新执行"
		} });
		const recoveryRun = active.find((r) => r.kind === "recovery");
		if (recoveryRun !== void 0) {
			resumed = true;
			this.patch({ recovery: {
				running: true,
				actionError: null
			} });
			this.pollRun(recoveryRun.runId, "recovery");
		} else if (this.state.recovery.running) this.patch({ recovery: {
			running: false,
			actionError: "上次恢复任务已结束但结果无法恢复，请重新执行"
		} });
		return resumed;
	}
	/** 停止全部轮询（视图卸载时调用；服务端执行不受影响，重开面板再 resume）。 */
	stopResume() {
		this.polling.clear();
		this.watchActive.clear();
		for (const timer of this.timers.values()) clearTimeout(timer);
		this.timers.clear();
	}
	/**
	* 本次会话内启动的 run（POST /export 或 /execute 请求进行期间）的实时进度订阅。
	* 请求是同步的、响应到达才知 runId，所以先经 GET /runs 发现进行中的 run（500ms），
	* 发现后转入 /progress 轮询（同一间隔），done/failed 自动停止。
	*
	* 与 m2 resume 的收敛：两者共用 pollRun / polling / timers 同一套轮询器，
	* 只是间隔不同（resume 恢复 1s、本方法实时 500ms）且发现阶段不同
	* （resume 用 /runs 一次性找回 runId；本方法持续 /runs 直到出现活跃 run）。
	* 同一 runId 不会重复轮询（polling 集合防重）。
	*/
	watchRunning(kind, intervalMs) {
		if (this.watchActive.has(kind)) return;
		this.watchActive.add(kind);
		const api = this.apiRef;
		if (api === null) {
			this.watchActive.delete(kind);
			return;
		}
		const interval = intervalMs ?? this.pollIntervalMs;
		const tick = () => {
			if (!this.watchActive.has(kind)) return;
			api.runs().then((active) => {
				if (!this.watchActive.has(kind)) return;
				const run = active.find((r) => r.kind === kind && r.status === "running");
				if (run === void 0) {
					this.scheduleWatch(kind, tick, interval);
					return;
				}
				this.watchActive.delete(kind);
				this.patchProgress(kind, run);
				this.pollRun(run.runId, kind, interval);
			}, () => {
				if (this.watchActive.has(kind)) this.scheduleWatch(kind, tick, interval);
			});
		};
		this.scheduleWatch(kind, tick, interval);
	}
	/** 停止某 kind 的「发现进行中 run」轮询（视图请求结束后调用；/progress 轮询自行结束）。 */
	stopRunWatch(kind) {
		this.watchActive.delete(kind);
	}
	/** 调度下一轮发现；每 kind 只保留一个挂起定时器。 */
	scheduleWatch(kind, tick, intervalMs) {
		const timer = setTimeout(tick, intervalMs);
		this.timers.set(`watch:${kind}`, timer);
	}
	pollRun(runId, kind, intervalMs) {
		if (this.polling.has(runId)) return;
		this.polling.add(runId);
		const api = this.apiRef;
		if (api === null) return;
		const interval = intervalMs ?? this.pollIntervalMs;
		const tick = () => {
			if (!this.polling.has(runId)) return;
			api.progress(runId).then((state) => {
				if (!this.polling.has(runId)) return;
				if (state.status === "running") {
					this.patchProgress(kind, state);
					this.scheduleTick(runId, tick, interval);
				} else {
					this.polling.delete(runId);
					this.applySettled(kind, state);
				}
			}, () => {
				this.polling.delete(runId);
				this.applyGone(kind);
			});
		};
		this.scheduleTick(runId, tick, interval);
	}
	/** 调度下一轮询；每 runId 只保留一个挂起定时器（fire 后由下一次调度覆盖）。 */
	scheduleTick(runId, tick, intervalMs) {
		const timer = setTimeout(tick, intervalMs);
		this.timers.set(runId, timer);
	}
	patchProgress(kind, state) {
		const event = mapRunProgress(kind, state);
		if (kind === "export") this.patch({ export: { progress: event } });
		else if (kind === "restore") this.patch({ snapshots: { running: true } });
		else if (kind === "recovery") this.patch({ recovery: { running: true } });
		else this.patch({ import: {
			progress: event,
			runId: state.runId
		} });
	}
	/** run 完成/失败：把 RunState.result 回填 store（并镜像回控制器）。 */
	applySettled(kind, state) {
		if (kind === "export") {
			const result = state.result;
			if (state.status === "done" && result !== void 0 && typeof result.zipPath === "string") this.patch({ export: {
				running: false,
				progress: {
					stage: "done",
					step: 1,
					total: 1
				},
				result: {
					...result,
					text: renderExportReport(result.report)
				},
				downloaded: false
			} });
			else this.patch({ export: {
				running: false,
				progress: null,
				result: null,
				downloaded: false,
				error: state.error ?? "导出失败（结果不可用）"
			} });
			return;
		}
		if (kind === "restore") {
			const result = state.result;
			if (state.status === "done" && result !== void 0 && typeof result === "object") this.patch({ snapshots: {
				running: false,
				report: result,
				actionError: null
			} });
			else this.patch({ snapshots: {
				running: false,
				actionError: state.error ?? "恢复失败（结果不可用）"
			} });
			return;
		}
		if (kind === "recovery") {
			this.patch({ recovery: {
				running: false,
				actionError: state.error ?? null
			} });
			return;
		}
		const result = state.result;
		if (state.status === "done" && result !== void 0 && typeof result === "object") {
			const wizard = this.importWizardInst;
			if (wizard !== null) writeWizardSnapshot(wizard, {
				...this.state.import,
				step: "result",
				result,
				secretInputs: {},
				decryptPassword: "",
				decryptRefs: [],
				conflictCollector: null
			});
			this.patch({ import: {
				step: "result",
				result,
				running: false,
				progress: {
					stage: "done",
					step: 1,
					total: 1
				},
				error: null
			} });
		} else {
			const wizard = this.importWizardInst;
			if (wizard !== null) {
				const internals = wizard;
				internals.errors = [...internals.errors, state.error ?? "导入失败"];
			}
			this.patch({ import: {
				running: false,
				progress: null,
				error: state.error ?? "导入失败",
				errors: [...this.state.import.errors, state.error ?? "导入失败"]
			} });
		}
	}
	/** run 消失（404/网络错误）：停止轮询并提示不可恢复。 */
	applyGone(kind) {
		if (kind === "export") this.patch({ export: {
			running: false,
			progress: null,
			runId: null,
			error: "任务已结束或超过保留期，进度不可恢复"
		} });
		else if (kind === "restore") this.patch({ snapshots: {
			running: false,
			actionError: "恢复任务已结束或超过保留期，进度不可恢复"
		} });
		else if (kind === "recovery") this.patch({ recovery: {
			running: false,
			actionError: "恢复任务已结束或超过保留期，进度不可恢复"
		} });
		else {
			this.importWizardInst?.reset();
			this.patch({ import: {
				running: false,
				progress: null,
				runId: null,
				step: "select",
				phase: "preview",
				conflictCollector: null,
				selectedFileName: null,
				errors: [],
				error: "任务已结束或超过保留期，进度不可恢复"
			} });
		}
	}
};
/** 模块级单例（浏览器半所有视图共享；构造时自动 load()）。 */
const runStore = new RunStore();
//#endregion
//#region \0config-manager-css:/home/runner/work/dsh-config-manager/dsh-config-manager/src/client/config-manager.module.css.js
const css = "._367UGW_section{height:100%;min-height:0;color:var(--dsw-alias-label-primary);font-family:var(--dsw-font-family);flex-direction:column;gap:10px;font-size:13px;display:flex}._367UGW_sectionHeader{flex:none;align-items:center;gap:10px;display:flex}._367UGW_viewTabs{border-bottom:1px solid var(--dsw-alias-border-l1);flex:1;gap:2px;display:flex}._367UGW_viewTab{color:var(--dsw-alias-label-secondary);cursor:pointer;white-space:nowrap;background:0 0;border:none;border-bottom:2px solid #0000;border-radius:6px 6px 0 0;padding:7px 14px;font-size:13px}._367UGW_viewTab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}._367UGW_viewTab[data-active]{color:var(--dsw-alias-label-primary);border-bottom-color:var(--dsw-alias-state-business-primary);font-weight:600}._367UGW_sectionBody{flex-direction:column;flex:1;min-height:0;display:flex;overflow-y:auto}._367UGW_viewBody{flex-direction:column;gap:12px;padding:4px 2px 16px;display:flex}._367UGW_sectionTitleBlock{flex-direction:column;gap:2px;display:flex}._367UGW_sectionTitle{color:var(--dsw-alias-label-primary);margin:0;font-size:15px;font-weight:700}._367UGW_sectionSubtitle{color:var(--dsw-alias-label-secondary);margin:0;font-size:12px;line-height:1.5}._367UGW_primaryButton{color:var(--dsw-alias-label-primary-foreground);background:var(--dsw-alias-button-info-fill);cursor:pointer;white-space:nowrap;border:none;border-radius:8px;align-items:center;gap:6px;padding:6px 14px;font-size:13px;font-weight:600;display:inline-flex}._367UGW_primaryButton:hover:not(:disabled){background:var(--dsw-alias-button-info-hover)}._367UGW_primaryButton:disabled{opacity:.5;cursor:default}._367UGW_ghostButton{color:var(--dsw-alias-label-primary);border:1px solid var(--dsw-alias-border-l2);cursor:pointer;white-space:nowrap;background:0 0;border-radius:8px;align-items:center;gap:6px;padding:5px 12px;font-size:12px;display:inline-flex}._367UGW_ghostButton:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}._367UGW_ghostButton:disabled{opacity:.45;cursor:default}._367UGW_dangerButton{color:var(--dsw-alias-state-error-primary);border:1px solid var(--dsw-alias-state-error-primary);cursor:pointer;white-space:nowrap;background:0 0;border-radius:8px;padding:5px 12px;font-size:12px}._367UGW_dangerButton:hover:not(:disabled){background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-label-primary-foreground)}._367UGW_dangerButton:disabled{opacity:.45;cursor:default}._367UGW_badge{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:nowrap;border-radius:999px;padding:1px 8px;font-size:11px;line-height:1.6;display:inline-block}._367UGW_badgeInfo{color:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}._367UGW_badgeOk{color:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary)}._367UGW_badgeWarn{color:var(--dsw-alias-state-warn-primary);border-color:var(--dsw-alias-state-warn-primary)}._367UGW_badgeError{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}._367UGW_banner{border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);overflow-wrap:anywhere;border-radius:8px;padding:8px 12px;font-size:12.5px;line-height:1.5}._367UGW_banner[data-kind=ok]{color:var(--dsw-alias-state-success-primary);border-color:var(--dsw-alias-state-success-primary)}._367UGW_banner[data-kind=error]{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}._367UGW_banner[data-kind=info]{color:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}._367UGW_banner[data-kind=warn]{color:var(--dsw-alias-state-warn-primary);border-color:var(--dsw-alias-state-warn-primary)}._367UGW_card{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:10px;flex-direction:column;flex:none;gap:10px;padding:12px;display:flex}._367UGW_wizardCard{gap:14px}._367UGW_wizardCard ._367UGW_field{gap:8px}._367UGW_field{flex-direction:column;gap:5px;display:flex}._367UGW_fieldLabel{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600}._367UGW_input{color:var(--dsw-alias-label-primary);background:var(--dsw-specific-input-major);border:1px solid var(--dsw-alias-border-l2);resize:vertical;border-radius:8px;outline:none;padding:7px 10px;font-family:inherit;font-size:13px}._367UGW_input:focus{border-color:var(--dsw-alias-state-business-primary)}._367UGW_input::placeholder{color:var(--dsw-alias-label-tertiary)}._367UGW_input:disabled{opacity:.55}._367UGW_select{-webkit-appearance:none;appearance:none;color:var(--dsw-alias-label-primary);background-color:var(--dsw-specific-input-major);background-image:linear-gradient(45deg, transparent 50%, var(--dsw-alias-label-secondary) 50%), linear-gradient(135deg, var(--dsw-alias-label-secondary) 50%, transparent 50%);border:1px solid var(--dsw-alias-border-l2);cursor:pointer;background-position:calc(100% - 17px) calc(50% - 1px),calc(100% - 12px) calc(50% - 1px);background-repeat:no-repeat;background-size:5px 5px,5px 5px;border-radius:8px;outline:none;max-width:100%;padding:7px 30px 7px 10px;font-family:inherit;font-size:13px}._367UGW_select:hover:not(:disabled){border-color:var(--dsw-alias-border-l1)}._367UGW_select:focus{border-color:var(--dsw-alias-state-business-primary)}._367UGW_select:disabled{opacity:.55;cursor:default}._367UGW_select option{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2)}._367UGW_hint{color:var(--dsw-alias-label-tertiary);font-size:11.5px;line-height:1.5}._367UGW_formError{color:var(--dsw-alias-state-error-primary);margin:0;font-size:12px}._367UGW_checkboxRow{color:var(--dsw-alias-label-primary);cursor:pointer;align-items:flex-start;gap:8px;font-size:13px;display:flex}._367UGW_checkboxRow input{flex:none;margin-top:2px}._367UGW_radioLabel{color:var(--dsw-alias-label-primary);cursor:pointer;align-items:center;gap:6px;font-size:13px;display:inline-flex}._367UGW_secretFields{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px 12px;padding-top:4px;display:grid}._367UGW_hiddenFile{display:none}._367UGW_modeTabs{border-bottom:1px solid var(--dsw-alias-border-l1);flex:none;gap:2px;display:flex}._367UGW_modeTab{color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-bottom:2px solid #0000;padding:6px 12px;font-size:12.5px}._367UGW_modeTab:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}._367UGW_modeTab[data-active]{color:var(--dsw-alias-label-primary);border-bottom-color:var(--dsw-alias-state-business-primary);font-weight:600}._367UGW_modeHint{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5}._367UGW_groupList{flex-direction:column;gap:10px;display:flex}._367UGW_groupCard{gap:8px}._367UGW_groupHeader{flex-wrap:wrap;align-items:baseline;gap:8px;display:flex}._367UGW_groupLabel{color:var(--dsw-alias-label-primary);font-size:12.5px;font-weight:700}._367UGW_nextStepsGroup{border-top:1px solid var(--dsw-alias-border-l1);margin-top:10px;padding-top:10px}._367UGW_nextStepsGroup ._367UGW_reportList{margin-top:6px}._367UGW_cliCommand{white-space:pre-wrap;word-break:break-all;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;margin-top:8px;padding:8px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.6}._367UGW_cliName{color:var(--dsw-alias-state-business-primary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px}._367UGW_groupNote{color:var(--dsw-alias-label-tertiary);font-size:11.5px}._367UGW_groupItems{flex-direction:column;gap:6px;display:flex}._367UGW_categoryItem{flex-wrap:wrap;align-items:center;gap:8px;display:inline-flex}._367UGW_categoryName{font-weight:500}._367UGW_categoryDesc{color:var(--dsw-alias-label-tertiary);font-size:11.5px}._367UGW_optionsCard{gap:8px}._367UGW_optionsHeader{color:var(--dsw-alias-label-primary);letter-spacing:.02em;margin-bottom:2px;font-size:12px;font-weight:600}._367UGW_warnList{margin:4px 0 0;padding-left:18px}._367UGW_actionRow{flex-wrap:wrap;align-items:center;gap:10px;display:flex}._367UGW_progressBlock{flex-direction:column;flex:none;gap:6px;display:flex}._367UGW_progressMeta{color:var(--dsw-alias-label-secondary);flex-wrap:wrap;gap:12px;font-size:12px;display:flex}._367UGW_progressLabel{font-weight:600}._367UGW_progressDetail{color:var(--dsw-alias-label-tertiary);text-overflow:ellipsis;white-space:nowrap;max-width:320px;overflow:hidden}._367UGW_progressBadge{font-variant-numeric:tabular-nums;white-space:nowrap;border-radius:999px;align-items:center;gap:2px;padding:1px 8px;font-size:11px;line-height:18px;display:inline-flex}._367UGW_progressBadgeSection{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);color:var(--dsw-alias-state-business-primary)}._367UGW_progressBadgeCount{background:color-mix(in srgb, var(--dsw-alias-state-info-primary) 14%, transparent);color:var(--dsw-alias-state-info-primary)}._367UGW_progressPercent{font-variant-numeric:tabular-nums;margin-left:auto}._367UGW_progressTrack{background:var(--dsw-alias-interactive-bg-hover);border-radius:999px;height:8px;overflow:hidden}._367UGW_progressBar{background:var(--dsw-alias-state-business-primary);border-radius:999px;height:100%;transition:width .12s linear}._367UGW_progressBarDone{background:var(--dsw-alias-state-success-primary)}._367UGW_progressIndeterminate{width:40%;animation:1s ease-in-out infinite _367UGW_dshCmIndeterminate}._367UGW_logPanel{flex-direction:column;flex:none;gap:6px;display:flex}._367UGW_logHeader{color:var(--dsw-alias-label-secondary);align-items:center;gap:8px;font-size:12.5px;font-weight:600;display:flex}._367UGW_logJumpButton{font-family:var(--dsw-font-family);color:var(--dsw-alias-label-secondary);border:1px solid var(--dsw-alias-border-l2);cursor:pointer;background:0 0;border-radius:999px;padding:3px 8px;font-size:11px;line-height:1}._367UGW_logJumpButton:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}._367UGW_logScroll{overscroll-behavior:contain;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;max-height:200px;padding:2px 10px 6px;overflow-y:auto}._367UGW_logLine{white-space:pre-wrap;word-break:break-all;color:var(--dsw-alias-label-secondary);padding:1px 0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;line-height:1.6}._367UGW_logEmpty{color:var(--dsw-alias-label-tertiary);padding:6px 0;font-size:11.5px}@keyframes _367UGW_dshCmIndeterminate{0%{margin-left:-40%}to{margin-left:100%}}._367UGW_reportView{flex-direction:column;gap:10px;display:flex}._367UGW_statRow{flex-wrap:wrap;align-items:center;gap:6px;display:flex}._367UGW_reportText{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);white-space:pre-wrap;word-break:break-all;max-height:260px;color:var(--dsw-alias-label-primary);border-radius:8px;margin:0;padding:10px 12px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.6;overflow:auto}._367UGW_reportFooter{justify-content:flex-end;gap:8px;display:flex}._367UGW_rollbackBox{border:1px solid var(--dsw-alias-state-warn-primary);color:var(--dsw-alias-state-warn-primary);border-radius:8px;flex-direction:column;gap:6px;padding:10px 12px;display:flex}._367UGW_rollbackBox ._367UGW_reportText{border-color:var(--dsw-alias-border-l2)}._367UGW_errorBanner{border:1px solid var(--dsw-alias-state-error-primary);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-2);border-radius:8px;flex-direction:column;gap:6px;padding:10px 12px;display:flex}._367UGW_errorTitle{color:var(--dsw-alias-state-error-primary);font-size:13px;font-weight:700}._367UGW_errorReason{white-space:pre-wrap;word-break:break-all;color:var(--dsw-alias-label-secondary);margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px}._367UGW_errorAction{color:var(--dsw-alias-label-secondary);font-size:12.5px}._367UGW_errorActionLabel{color:var(--dsw-alias-state-business-primary)}._367UGW_errorItem{color:var(--dsw-alias-label-tertiary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px}._367UGW_errorFooter{justify-content:flex-end;display:flex}._367UGW_errorList{flex-direction:column;gap:4px;display:flex}._367UGW_errorLine{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);white-space:pre-wrap;word-break:break-all;color:var(--dsw-alias-state-error-primary);border-radius:6px;margin:0;padding:6px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}._367UGW_conflictList{flex-direction:column;gap:10px;display:flex}._367UGW_conflictItem{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;flex-direction:column;gap:6px;padding:10px 12px;display:flex}._367UGW_conflictHead{flex-wrap:wrap;align-items:center;gap:8px;display:flex}._367UGW_conflictId{color:var(--dsw-alias-label-primary);font-size:12.5px;font-weight:600}._367UGW_severityError{color:var(--dsw-alias-state-error-primary);border:1px solid var(--dsw-alias-state-error-primary);border-radius:999px;padding:0 6px;font-size:10.5px}._367UGW_conflictDetail{background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);white-space:pre-wrap;word-break:break-all;color:var(--dsw-alias-label-secondary);border-radius:6px;margin:0;padding:6px 8px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px}._367UGW_conflictOptions{flex-wrap:wrap;gap:14px;display:flex}._367UGW_pathMappingList{flex-direction:column;gap:8px;display:flex}._367UGW_pathRow{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:8px;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px;padding:10px 12px;display:grid}._367UGW_pathOld,._367UGW_pathNew{flex-direction:column;gap:4px;min-width:0;display:flex}._367UGW_pathValue{text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-primary);margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;overflow:hidden}._367UGW_pathIssueKind{color:var(--dsw-alias-state-warn-primary);font-size:10.5px}._367UGW_secretsList{flex-direction:column;gap:10px;display:flex}._367UGW_empty{text-align:center;color:var(--dsw-alias-label-tertiary);padding:22px 12px;font-size:12.5px}._367UGW_spinnerWrap{align-items:center;gap:6px;display:inline-flex}._367UGW_spinner{border:2px solid var(--dsw-alias-state-business-primary);vertical-align:-1px;border-top-color:#0000;border-radius:50%;flex:none;width:11px;height:11px;animation:.8s linear infinite _367UGW_dshCmSpin;display:inline-block}._367UGW_spinnerLabel{color:var(--dsw-alias-label-secondary);font-size:12px}@keyframes _367UGW_dshCmSpin{to{transform:rotate(360deg)}}._367UGW_snapshotList{flex-direction:column;gap:2px;display:flex}._367UGW_snapshotRowHeader,._367UGW_snapshotRowMain{grid-template-columns:minmax(0,1.2fr) minmax(0,1.6fr) minmax(0,90px) minmax(0,56px) minmax(0,56px);align-items:center;gap:8px;padding:6px 10px;font-size:12px;display:grid}._367UGW_snapshotRowHeader{color:var(--dsw-alias-label-tertiary);border-bottom:1px solid var(--dsw-alias-border-l1);grid-template-columns:minmax(0,1.2fr) minmax(0,1.6fr) minmax(0,90px) minmax(0,56px) minmax(0,56px) auto;font-size:11px}._367UGW_snapshotRowHeader>span,._367UGW_snapshotRowMain>span{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}._367UGW_snapshotRow{text-align:left;color:var(--dsw-alias-label-primary);background:0 0;border:1px solid #0000;border-radius:6px;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:4px;padding:4px 8px;display:grid}._367UGW_snapshotRowMain{text-align:left;width:100%;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;grid-template-columns:minmax(0,1.2fr) minmax(0,1.6fr) minmax(0,90px) minmax(0,56px) minmax(0,56px);padding:2px 0;font-size:12px}._367UGW_snapshotRow:hover{background:var(--dsw-alias-interactive-bg-hover)}._367UGW_snapshotRow[data-active]{border-color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent)}._367UGW_snapshotRow ._367UGW_actionRow{justify-content:flex-end;gap:4px}._367UGW_profileRowHeader{color:var(--dsw-alias-label-tertiary);border-bottom:1px solid var(--dsw-alias-border-l1);grid-template-columns:minmax(0,1.4fr) minmax(0,1.6fr) minmax(0,1fr) auto;align-items:center;gap:8px;padding:6px 10px;font-size:11px;display:grid}._367UGW_profileRowHeader>span{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}._367UGW_profileRowHeader>span:last-child{white-space:normal;justify-self:end}._367UGW_profileRow{text-align:left;color:var(--dsw-alias-label-primary);background:0 0;border:1px solid #0000;border-radius:6px;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:4px;padding:4px 8px;display:grid}._367UGW_profileRow:hover{background:var(--dsw-alias-interactive-bg-hover)}._367UGW_profileRow[data-active]{border-color:var(--dsw-alias-state-business-primary);background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 10%, transparent)}._367UGW_profileRow ._367UGW_actionRow{justify-content:flex-end;gap:4px}._367UGW_profileRowMain{text-align:left;width:100%;color:var(--dsw-alias-label-primary);cursor:pointer;background:0 0;border:none;grid-template-columns:minmax(0,1.4fr) minmax(0,1.6fr) minmax(0,1fr);align-items:center;gap:8px;padding:2px 0;font-size:12px;display:grid}._367UGW_profileRowMain>span{text-overflow:ellipsis;white-space:nowrap;min-width:0;overflow:hidden}._367UGW_backupFileList{flex-direction:column;gap:4px;display:flex}._367UGW_backupFileRow{border:1px solid var(--dsw-alias-border-l1);border-radius:6px;flex-wrap:wrap;align-items:center;gap:10px;padding:6px 10px;display:flex}._367UGW_backupFileName{text-overflow:ellipsis;white-space:nowrap;min-width:0;color:var(--dsw-alias-label-primary);flex:180px;font-size:12px;overflow:hidden}._367UGW_backupFileNote{border:1px solid var(--dsw-alias-state-business-primary);min-width:0;color:var(--dsw-alias-state-business-primary);white-space:normal;overflow-wrap:anywhere;word-break:break-all;border-radius:999px;max-width:100%;padding:1px 8px;font-size:11px;line-height:1.6;display:inline-block}._367UGW_backupFileMeta{color:var(--dsw-alias-label-secondary);flex:none;font-size:11px}._367UGW_warnText{color:var(--dsw-alias-state-warn-primary)}._367UGW_reportList{color:var(--dsw-alias-label-primary);flex-direction:column;gap:3px;margin:8px 0 4px;padding-left:18px;font-size:12px;display:flex}._367UGW_kindTag{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-secondary);border-radius:4px;padding:1px 6px;font-size:10.5px;display:inline-block}._367UGW_kindTagError{background:color-mix(in srgb, var(--dsw-alias-state-error-primary) 14%, transparent);color:var(--dsw-alias-state-error-primary)}._367UGW_kindTagWarn{background:color-mix(in srgb, var(--dsw-alias-state-warn-primary) 14%, transparent);color:var(--dsw-alias-state-warn-primary)}._367UGW_kindTagOk{background:color-mix(in srgb, var(--dsw-alias-state-success-primary) 14%, transparent);color:var(--dsw-alias-state-success-primary)}._367UGW_kindTagInfo{background:color-mix(in srgb, var(--dsw-alias-state-business-primary) 14%, transparent);color:var(--dsw-alias-state-business-primary)}._367UGW_inspectGroup{flex-direction:column;gap:4px;padding-top:6px;display:flex}._367UGW_inspectGroup+._367UGW_inspectGroup{border-top:1px solid var(--dsw-alias-border-l1);margin-top:4px;padding-top:8px}._367UGW_inspectGroup ._367UGW_reportList{margin-top:2px}._367UGW_planScroll{overscroll-behavior:contain;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;height:280px;padding:2px 10px 8px;overflow-y:auto}._367UGW_planScroll ._367UGW_reportList{margin-top:6px}._367UGW_reportScroll{overscroll-behavior:contain;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;max-height:220px;padding:2px 10px 6px;overflow-y:auto}._367UGW_reportScroll ._367UGW_reportList{margin-top:4px}._367UGW_confirmScroll{overscroll-behavior:contain;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;max-height:280px;padding:2px 10px 6px;overflow-y:auto}._367UGW_confirmScroll ._367UGW_reportList{margin-top:4px;margin-bottom:0}._367UGW_pullScroll{overscroll-behavior:contain;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;height:280px;padding:2px 10px 6px;overflow-y:auto}._367UGW_pullScroll ._367UGW_reportList{margin-top:4px;margin-bottom:0}._367UGW_rowActions{gap:8px;margin-top:10px;display:flex}._367UGW_diffScroll{overscroll-behavior:contain;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);white-space:pre-wrap;word-break:break-all;max-height:240px;color:var(--dsw-alias-label-primary);border-radius:8px;margin:0;padding:8px 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11.5px;line-height:1.6;overflow:auto}._367UGW_consultScroll{overscroll-behavior:contain;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;max-height:240px;padding:2px 10px 6px;overflow-y:auto}._367UGW_consultDimension{border-bottom:1px solid var(--dsw-alias-border-l1);padding:6px 0}._367UGW_consultDimension:last-child{border-bottom:none}._367UGW_consultDimension ._367UGW_reportList{margin-top:4px}._367UGW_aboutLinkRow{flex-wrap:wrap;align-items:center;gap:10px;display:flex}._367UGW_aboutAuthor{color:var(--dsw-alias-label-primary);cursor:pointer;border-radius:6px;align-items:center;gap:6px;padding:4px 8px;font-size:13px;text-decoration:none;display:inline-flex}._367UGW_aboutAuthor:hover{background:var(--dsw-alias-interactive-bg-hover)}._367UGW_dialogMask{z-index:100;background:color-mix(in srgb, var(--dsw-alias-bg-base) 55%, transparent);justify-content:center;align-items:center;padding:20px;display:flex;position:fixed;inset:0}._367UGW_dialogCard{background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);width:min(420px,100%);max-height:80vh;box-shadow:0 8px 24px color-mix(in srgb, var(--dsw-alias-bg-base) 40%, transparent);border-radius:10px;flex-direction:column;gap:10px;padding:14px;display:flex}._367UGW_dialogHeader{color:var(--dsw-alias-label-primary);font-size:14px;font-weight:600}._367UGW_dialogBody{overscroll-behavior:contain;max-height:240px;color:var(--dsw-alias-label-primary);white-space:pre-wrap;flex-direction:column;gap:10px;font-size:13px;line-height:1.6;display:flex;overflow-y:auto}._367UGW_dialogWide{width:min(560px,100%)}._367UGW_dialogBodyScroll{overscroll-behavior:contain;max-height:70vh;color:var(--dsw-alias-label-primary);white-space:normal;flex-direction:column;gap:10px;font-size:13px;line-height:1.6;display:flex;overflow-y:auto}._367UGW_dialogHeaderRow{justify-content:space-between;align-items:center;gap:10px;display:flex}._367UGW_dialogClose{color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:6px;padding:2px 8px;font-size:16px;line-height:1}._367UGW_dialogClose:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-hover)}._367UGW_historyGroup{flex-direction:column;gap:6px;display:flex}._367UGW_historyGroup+._367UGW_historyGroup{border-top:1px solid var(--dsw-alias-border-l1);margin-top:4px;padding-top:10px}._367UGW_historyScroll{overscroll-behavior:contain;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;flex-direction:column;gap:2px;max-height:240px;padding:2px 4px;display:flex;overflow-y:auto}._367UGW_historyRow{border-radius:6px;grid-template-columns:minmax(0,1.4fr) auto minmax(0,1fr) minmax(0,1.6fr);align-items:center;gap:10px;padding:3px 6px;display:grid}._367UGW_historyRow:hover{background:var(--dsw-alias-interactive-bg-hover)}._367UGW_historyRowMain{display:contents}._367UGW_historyTime{color:var(--dsw-alias-label-tertiary);white-space:nowrap;text-overflow:ellipsis;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;overflow:hidden}._367UGW_historySections{color:var(--dsw-alias-label-secondary);white-space:nowrap;text-overflow:ellipsis;font-size:11px;overflow:hidden}._367UGW_historySummary{color:var(--dsw-alias-label-primary);white-space:nowrap;text-overflow:ellipsis;font-size:12px;overflow:hidden}";
const tagId = "dsh-config-manager/config-manager.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-tag=\"dsh-config-manager/config-manager.module.css\"]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-config-manager";
	tag.dataset.tag = tagId;
	tag.textContent = css;
	document.head.appendChild(tag);
}
var config_manager_module_css_default = {
	"actionRow": "_367UGW_actionRow",
	"progressBarDone": "_367UGW_progressBarDone",
	"select": "_367UGW_select",
	"viewBody": "_367UGW_viewBody",
	"warnText": "_367UGW_warnText",
	"sectionTitleBlock": "_367UGW_sectionTitleBlock",
	"reportFooter": "_367UGW_reportFooter",
	"conflictOptions": "_367UGW_conflictOptions",
	"dshCmIndeterminate": "_367UGW_dshCmIndeterminate",
	"logJumpButton": "_367UGW_logJumpButton",
	"errorAction": "_367UGW_errorAction",
	"dshCmSpin": "_367UGW_dshCmSpin",
	"progressMeta": "_367UGW_progressMeta",
	"backupFileRow": "_367UGW_backupFileRow",
	"errorList": "_367UGW_errorList",
	"dialogBody": "_367UGW_dialogBody",
	"pathIssueKind": "_367UGW_pathIssueKind",
	"errorReason": "_367UGW_errorReason",
	"empty": "_367UGW_empty",
	"modeHint": "_367UGW_modeHint",
	"kindTagOk": "_367UGW_kindTagOk",
	"aboutAuthor": "_367UGW_aboutAuthor",
	"checkboxRow": "_367UGW_checkboxRow",
	"sectionSubtitle": "_367UGW_sectionSubtitle",
	"kindTagWarn": "_367UGW_kindTagWarn",
	"dialogCard": "_367UGW_dialogCard",
	"profileRowHeader": "_367UGW_profileRowHeader",
	"field": "_367UGW_field",
	"spinner": "_367UGW_spinner",
	"historyTime": "_367UGW_historyTime",
	"ghostButton": "_367UGW_ghostButton",
	"progressLabel": "_367UGW_progressLabel",
	"section": "_367UGW_section",
	"reportList": "_367UGW_reportList",
	"conflictHead": "_367UGW_conflictHead",
	"backupFileNote": "_367UGW_backupFileNote",
	"logEmpty": "_367UGW_logEmpty",
	"errorFooter": "_367UGW_errorFooter",
	"errorLine": "_367UGW_errorLine",
	"severityError": "_367UGW_severityError",
	"backupFileList": "_367UGW_backupFileList",
	"dialogBodyScroll": "_367UGW_dialogBodyScroll",
	"logLine": "_367UGW_logLine",
	"progressBadgeCount": "_367UGW_progressBadgeCount",
	"groupItems": "_367UGW_groupItems",
	"cliCommand": "_367UGW_cliCommand",
	"logHeader": "_367UGW_logHeader",
	"errorActionLabel": "_367UGW_errorActionLabel",
	"progressBlock": "_367UGW_progressBlock",
	"optionsCard": "_367UGW_optionsCard",
	"planScroll": "_367UGW_planScroll",
	"consultDimension": "_367UGW_consultDimension",
	"viewTab": "_367UGW_viewTab",
	"logPanel": "_367UGW_logPanel",
	"rollbackBox": "_367UGW_rollbackBox",
	"backupFileMeta": "_367UGW_backupFileMeta",
	"input": "_367UGW_input",
	"badgeWarn": "_367UGW_badgeWarn",
	"dialogMask": "_367UGW_dialogMask",
	"secretsList": "_367UGW_secretsList",
	"nextStepsGroup": "_367UGW_nextStepsGroup",
	"progressPercent": "_367UGW_progressPercent",
	"modeTab": "_367UGW_modeTab",
	"reportView": "_367UGW_reportView",
	"historyScroll": "_367UGW_historyScroll",
	"kindTagError": "_367UGW_kindTagError",
	"categoryItem": "_367UGW_categoryItem",
	"snapshotList": "_367UGW_snapshotList",
	"badge": "_367UGW_badge",
	"dialogWide": "_367UGW_dialogWide",
	"historyGroup": "_367UGW_historyGroup",
	"primaryButton": "_367UGW_primaryButton",
	"groupNote": "_367UGW_groupNote",
	"conflictItem": "_367UGW_conflictItem",
	"reportScroll": "_367UGW_reportScroll",
	"wizardCard": "_367UGW_wizardCard",
	"sectionTitle": "_367UGW_sectionTitle",
	"progressBar": "_367UGW_progressBar",
	"spinnerLabel": "_367UGW_spinnerLabel",
	"progressIndeterminate": "_367UGW_progressIndeterminate",
	"logScroll": "_367UGW_logScroll",
	"pathNew": "_367UGW_pathNew",
	"banner": "_367UGW_banner",
	"consultScroll": "_367UGW_consultScroll",
	"sectionBody": "_367UGW_sectionBody",
	"categoryName": "_367UGW_categoryName",
	"progressTrack": "_367UGW_progressTrack",
	"radioLabel": "_367UGW_radioLabel",
	"profileRowMain": "_367UGW_profileRowMain",
	"kindTagInfo": "_367UGW_kindTagInfo",
	"diffScroll": "_367UGW_diffScroll",
	"dialogHeader": "_367UGW_dialogHeader",
	"modeTabs": "_367UGW_modeTabs",
	"profileRow": "_367UGW_profileRow",
	"errorItem": "_367UGW_errorItem",
	"historyRowMain": "_367UGW_historyRowMain",
	"historySections": "_367UGW_historySections",
	"kindTag": "_367UGW_kindTag",
	"errorTitle": "_367UGW_errorTitle",
	"pathRow": "_367UGW_pathRow",
	"sectionHeader": "_367UGW_sectionHeader",
	"dialogClose": "_367UGW_dialogClose",
	"groupLabel": "_367UGW_groupLabel",
	"confirmScroll": "_367UGW_confirmScroll",
	"dangerButton": "_367UGW_dangerButton",
	"progressBadgeSection": "_367UGW_progressBadgeSection",
	"pathOld": "_367UGW_pathOld",
	"dialogHeaderRow": "_367UGW_dialogHeaderRow",
	"statRow": "_367UGW_statRow",
	"viewTabs": "_367UGW_viewTabs",
	"badgeOk": "_367UGW_badgeOk",
	"secretFields": "_367UGW_secretFields",
	"snapshotRowMain": "_367UGW_snapshotRowMain",
	"pullScroll": "_367UGW_pullScroll",
	"badgeError": "_367UGW_badgeError",
	"optionsHeader": "_367UGW_optionsHeader",
	"conflictId": "_367UGW_conflictId",
	"pathMappingList": "_367UGW_pathMappingList",
	"spinnerWrap": "_367UGW_spinnerWrap",
	"formError": "_367UGW_formError",
	"groupCard": "_367UGW_groupCard",
	"card": "_367UGW_card",
	"hint": "_367UGW_hint",
	"categoryDesc": "_367UGW_categoryDesc",
	"historyRow": "_367UGW_historyRow",
	"hiddenFile": "_367UGW_hiddenFile",
	"groupList": "_367UGW_groupList",
	"historySummary": "_367UGW_historySummary",
	"fieldLabel": "_367UGW_fieldLabel",
	"conflictList": "_367UGW_conflictList",
	"rowActions": "_367UGW_rowActions",
	"badgeInfo": "_367UGW_badgeInfo",
	"progressBadge": "_367UGW_progressBadge",
	"inspectGroup": "_367UGW_inspectGroup",
	"backupFileName": "_367UGW_backupFileName",
	"reportText": "_367UGW_reportText",
	"snapshotRow": "_367UGW_snapshotRow",
	"cliName": "_367UGW_cliName",
	"warnList": "_367UGW_warnList",
	"snapshotRowHeader": "_367UGW_snapshotRowHeader",
	"errorBanner": "_367UGW_errorBanner",
	"groupHeader": "_367UGW_groupHeader",
	"progressDetail": "_367UGW_progressDetail",
	"pathValue": "_367UGW_pathValue",
	"aboutLinkRow": "_367UGW_aboutLinkRow",
	"conflictDetail": "_367UGW_conflictDetail"
};
//#endregion
//#region src/client/common/ui.tsx
/**
* 统一按钮（primary=主操作 / ghost=次操作 / danger=危险操作）。
* 带 href 时渲染同款按钮类的外链 <a>（target=_blank + rel=noreferrer），
* 外观与普通按钮一致，不破坏既有 <button> 调用。
* loading=true 时自动禁用（防重复点击）并标注 aria-busy（无障碍）；
* 视觉 loading（Spinner）由调用方按既有模式放在 children 中。
*/
function Button({ variant = "ghost", disabled, loading = false, onClick, children, title, className, href, newTab = true }) {
	const cls = variant === "primary" ? config_manager_module_css_default.primaryButton : variant === "danger" ? config_manager_module_css_default.dangerButton : config_manager_module_css_default.ghostButton;
	const effectiveDisabled = disabled === true || loading;
	if (href !== void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
		className: className !== void 0 ? `${cls} ${className}` : cls,
		href,
		target: newTab ? "_blank" : void 0,
		rel: newTab ? "noreferrer" : void 0,
		title,
		"aria-busy": loading || void 0,
		onClick,
		style: { textDecoration: "none" },
		children
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
		type: "button",
		className: className !== void 0 ? `${cls} ${className}` : cls,
		disabled: effectiveDisabled,
		title,
		"aria-busy": loading || void 0,
		onClick,
		children
	});
}
/** 状态徽章（info=业务色 / ok=成功 / warn=警告 / error=错误） */
function Badge({ kind = "info", children, title }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
		className: `${config_manager_module_css_default.badge} ${config_manager_module_css_default[`badge${kind[0].toUpperCase()}${kind.slice(1)}`] ?? ""}`,
		title,
		children
	});
}
/** 说明横幅（ok/error/info/warn 四态） */
function Banner({ kind = "info", children }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: config_manager_module_css_default.banner,
		"data-kind": kind,
		children
	});
}
/** 卡片容器（bg-layer-2 + 圆角 + 细边框） */
function Card({ children, className }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: className !== void 0 ? `${config_manager_module_css_default.card} ${className}` : config_manager_module_css_default.card,
		children
	});
}
/** 加载指示（旋转环 + 可选文案） */
function Spinner({ label }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
		className: config_manager_module_css_default.spinnerWrap,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: config_manager_module_css_default.spinner,
			"aria-hidden": "true"
		}), label !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: config_manager_module_css_default.spinnerLabel,
			children: label
		})]
	});
}
/** 表单字段（标签 + 控件 + 说明） */
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
		className: config_manager_module_css_default.field,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: config_manager_module_css_default.fieldLabel,
				children: label
			}),
			children,
			hint !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: config_manager_module_css_default.hint,
				children: hint
			})
		]
	});
}
/** 区块标题（页面内二级标题 + 可选副标题） */
function SectionTitle({ title, subtitle }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.sectionTitleBlock,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
			className: config_manager_module_css_default.sectionTitle,
			children: title
		}), subtitle !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
			className: config_manager_module_css_default.sectionSubtitle,
			children: subtitle
		})]
	});
}
/** 空状态占位 */
function Empty({ children }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: config_manager_module_css_default.empty,
		children
	});
}
/** 复选框行（勾选 + 标签） */
function Checkbox({ checked, onChange, label, disabled }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
		className: config_manager_module_css_default.checkboxRow,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked,
			disabled,
			onChange: (event) => {
				onChange(event.target.checked);
			}
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label })]
	});
}
//#endregion
//#region src/client/common/ErrorBanner.tsx
/**
* 可操作错误展示（规范 §23，绑 src/ui/errors.ts）。
*
* 安全约束：**强制 redact 不泄 Secret** —— 展示前对错误消息、关联项文本
* 统一过 `redact()`（字段名黑名单 + sk-/JWT/PEM/Bearer 等值形状模式），
* 渲染结果只含 Reason / Suggested action / Item，绝不出现密钥原文。
*/
/**
* 错误横幅：toActionableError 解析为标题 + 原因 + 建议动作，
* 文本在渲染前再经 redact() 兜底（双保险），Reason 以等宽块展示。
* 重试按钮：进行中（retrying）时显示 Spinner 并禁用（防重复点击）。
*/
function ErrorBanner({ error, onRetry, retrying, t = zhUiT }) {
	const [actionable] = (0, react.useState)(() => toActionableError(error));
	const reason = redact(actionable.reason);
	const item = actionable.item !== void 0 ? redact(actionable.item) : void 0;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.errorBanner,
		role: "alert",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.errorTitle,
				children: redact(actionable.title)
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
				className: config_manager_module_css_default.errorReason,
				children: reason
			}),
			actionable.suggestedAction !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.errorAction,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.errorActionLabel,
						children: "→"
					}),
					" ",
					redact(actionable.suggestedAction)
				]
			}),
			item !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.errorItem,
				children: item
			}),
			actionable.retryable && onRetry !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.errorFooter,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: onRetry,
					disabled: retrying === true,
					loading: retrying === true,
					children: retrying === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, {}) : t("commonRetry")
				})
			})
		]
	});
}
/** 多行错误文本展示（Wizard.errors 数组用；同样强制 redact） */
function ErrorList({ errors }) {
	if (errors.length === 0) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: config_manager_module_css_default.errorList,
		children: errors.map((line, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
			className: config_manager_module_css_default.errorLine,
			children: redact(line)
		}, i))
	});
}
//#endregion
//#region src/client/common/progress-view.ts
/**
* m3: 进度展示的纯逻辑层（框架无关，node 可测）。
*
* 背景：m1 的 RunState 携带真实进度（section/sectionTotal = 当前分区 3/12、
* item/itemTotal = 内部计数如插件 6/18、detail = 当前项名）；m2 的 store 把
* RunState 映射为 ProgressEvent 并存入 progress 字段。本模块定义客户端的
* RunProgress（ProgressEvent 超集，额外携带分区/内部计数，JSON 可序列化），
* 并提供 computeProgressView() 把进度事件转成渲染模型 —— ProgressBar 只做
* 纯渲染，所有判定逻辑集中在此、可单测。
*
* 兼容路径：无 section/item 的普通 ProgressEvent（控制器 onProgress 发出）
* 走原逻辑 —— 阶段文案 + step/total 百分比，无徽章。
*/
/**
* 把进度事件换算成渲染模型。
* - percent：优先 ProgressEvent.step/total（控制器阶段进度 / 轮询的内部计数）；
* - sectionBadge（当前分区，如 settings · 3/12）：label=分区 id、current=item
*   （1-based 分区序号，见 core exporter onSection）、total=sectionTotal；
* - countBadge（内部计数，如 plugins · 6/18）：label=分区 id、current=item、
*   total=itemTotal；导出时 itemTotal 与 sectionTotal 同值（分区序号即内部计数）
*   → 置 null，避免「3/12 3/12」重复；
* - detail（当前项名）：非空且不等于分区 id（导出时 detail 恒为分区 id，去冗余）。
*/
function computeProgressView(event, t = zhUiT) {
	if (event === null) return {
		label: "",
		percent: null,
		sectionBadge: null,
		countBadge: null,
		detail: null
	};
	const section = event.section ?? null;
	const sectionTotal = event.sectionTotal ?? null;
	const item = event.item ?? null;
	const itemTotal = event.itemTotal ?? null;
	const percent = event.step !== void 0 && event.total !== void 0 && event.total > 0 ? Math.round(event.step / event.total * 100) : item !== null && itemTotal !== null && itemTotal > 0 ? Math.round(item / itemTotal * 100) : null;
	const sectionBadge = section !== null && item !== null && sectionTotal !== null && sectionTotal > 0 ? {
		label: section,
		current: item,
		total: sectionTotal
	} : null;
	let countBadge = section !== null && item !== null && itemTotal !== null && itemTotal > 0 ? {
		label: section,
		current: item,
		total: itemTotal
	} : null;
	if (countBadge !== null && sectionBadge !== null && itemTotal === sectionTotal) countBadge = null;
	const detail = typeof event.detail === "string" && event.detail !== "" && event.detail !== section ? event.detail : null;
	return {
		label: stageText(event.stage, t),
		percent,
		sectionBadge,
		countBadge,
		detail
	};
}
//#endregion
//#region src/client/common/ProgressBar.tsx
/**
* 进度条（规范 §29 + m3 真实进度）。
*
* 数据流：
*  - 控制器（ExportFlow / ImportWizard）onProgress 发出普通 ProgressEvent
*    （阶段文案 + step/total），走兼容路径；
*  - m3：store 经 /runs + /progress 轮询得到的 RunState 映射为 RunProgress
*    （额外携带 section/sectionTotal/item/itemTotal/detail），渲染为
*    「分区徽章（settings · 3/12）+ 内部计数徽章（plugins · 6/18）+ 当前项名」。
*
* 所有换算逻辑在 progress-view.ts 的 computeProgressView()（纯函数，可单测）；
* 本组件只做渲染。未知阶段回退显示 id 本身。
*/
/**
* 进度条：阶段文字 + 分区/内部计数徽章 + 当前项名 + 百分比。
*/
function ProgressBar({ event, active }) {
	const view = computeProgressView(event);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.progressBlock,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.progressMeta,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.progressLabel,
					children: view.label
				}),
				view.sectionBadge !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: `${config_manager_module_css_default.progressBadge} ${config_manager_module_css_default.progressBadgeSection}`,
					children: [
						view.sectionBadge.label,
						" · ",
						view.sectionBadge.current,
						"/",
						view.sectionBadge.total
					]
				}),
				view.countBadge !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: `${config_manager_module_css_default.progressBadge} ${config_manager_module_css_default.progressBadgeCount}`,
					children: [
						view.countBadge.label !== "" ? `${view.countBadge.label} · ` : "",
						view.countBadge.current,
						"/",
						view.countBadge.total
					]
				}),
				view.detail !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.progressDetail,
					children: view.detail
				}),
				view.percent !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: config_manager_module_css_default.progressPercent,
					children: [view.percent, "%"]
				})
			]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.progressTrack,
			children: view.percent !== null ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: `${config_manager_module_css_default.progressBar} ${active ? "" : config_manager_module_css_default.progressBarDone}`,
				style: { width: `${view.percent}%` }
			}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { className: `${config_manager_module_css_default.progressBar} ${config_manager_module_css_default.progressIndeterminate}` })
		})]
	});
}
//#endregion
//#region src/client/common/ReportView.tsx
/** 导入分区的统计徽章（由 report.importSectionStats 计算） */
function SectionStatBadges({ result }) {
	const stats = importSectionStats(result.executed);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: config_manager_module_css_default.statRow,
		children: stats.map((s) => {
			let kind = "ok";
			if (s.failed > 0) kind = "error";
			else if (s.skipped > 0) kind = "warn";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
				kind,
				children: [
					s.section,
					": ",
					s.ok,
					"✓",
					s.skipped > 0 ? ` ${s.skipped}≈` : "",
					s.failed > 0 ? ` ${s.failed}✗` : ""
				]
			}, s.section);
		})
	});
}
/** 导出报告的安全摘要（Included / Excluded / Security 徽章） */
function ExportSummary({ report }) {
	const included = report.included.length;
	const excluded = report.excluded.length;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.statRow,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
				kind: "ok",
				children: [included, " included"]
			}),
			excluded > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
				kind: "warn",
				children: [excluded, " excluded"]
			}),
			report.security.containsSecrets && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
				kind: "warn",
				children: "encrypted"
			}),
			!report.security.containsSecrets && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
				kind: "ok",
				children: "no secrets"
			}),
			report.security.redactedHits > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
				kind: "error",
				children: [report.security.redactedHits, " redacted"]
			})
		]
	});
}
/**
* 结果报告视图。
* 文本详情 = report.ts 渲染器的输出（已脱敏），展示前再过 redact() 双保险；
* 以 <pre> 等宽块呈现保持对齐。
*/
function ReportView({ kind, exportReport, importResult, onAction, onDownload, downloadBusy = false, t = zhUiT }) {
	const actions = kind === "import" && importResult !== void 0 ? suggestedActions(importResult) : [];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.reportView,
		children: [kind === "export" && exportReport !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExportSummary, { report: exportReport }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
				className: config_manager_module_css_default.reportText,
				children: redact(renderExportReport(exportReport))
			}),
			onDownload !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.reportFooter,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: onDownload,
					loading: downloadBusy,
					children: downloadBusy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, {}) : t("export.download")
				})
			})
		] }), kind === "import" && importResult !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionStatBadges, { result: importResult }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
				className: config_manager_module_css_default.reportText,
				children: redact(renderImportReport(importResult))
			}),
			importResult.rollback !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.rollbackBox,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: "Rollback" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
					className: config_manager_module_css_default.reportText,
					children: redact(renderRollbackReport(importResult.rollback))
				})]
			}),
			actions.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.reportFooter,
				children: actions.map((a) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: a === "done" ? "primary" : "ghost",
					onClick: () => onAction?.(a),
					children: a
				}, a))
			})
		] })]
	});
}
//#endregion
//#region src/client/export/ExportView.tsx
/**
* 导出视图（规范 §1 / §21，绑 src/ui/export-flow.ts 的 ExportFlow 控制器）。
*
* - Quick：一键导出推荐分区（ExportFlow.quickSelection()）；
* - Custom：按 §1 分组目录（EXPORT_GROUPS × DEFAULT_CATEGORIES）逐项勾选，
*   ExportFlow.validateSelection() 给出设备相关分区警告；
* - 安全选项（两个独立选项）：
*   - 加密备份：勾选后设置加密密码（AES-256-GCM），备份标记 encrypted、导入需密码；
*     密码仅本次内存使用，经 api.exportPassword 随请求体传给 Host 半，绝不落盘/入
*     manifest，**也绝不进入 sessionStorage** —— m2 白名单剔除，刷新后要求重输；
*   - 导出密钥：把真实凭据值写入备份；勾选时自动联动选中加密（密钥绝不明文存储），
*     取消加密会一并取消导出密钥（core 安全不变量 includeSecrets ⇒ encryption）。
* - 进度：ExportFlow.run 发出 ProgressEvent → ProgressBar；
* - 结果：ReportView(export) + 下载按钮（File System Access API 流式落盘）。
*
* m2：全部 UI 状态由模块级 runStore 持有（切 tab/关面板不重建、刷新恢复），
* 控制器实例（ExportFlow）由 store 缓存复用。
*/
/**
* 导出主视图：Quick/Custom 切换 → 勾选/密码 → 执行 → 进度 → 报告 → 下载。
*/
function ExportView({ api, t }) {
	const exp = (0, react.useSyncExternalStore)(runStore.subscribe, runStore.getSnapshot).export;
	const flow = runStore.exportFlow(api);
	const mode = exp.mode;
	const selection = exp.selection;
	const includeSecrets = exp.includeSecrets;
	const encrypt = exp.encrypt;
	/** P0-④：自定义导出文件名（.zip；空 = 宿主自动命名；仅表单非敏感字段） */
	const fileName = exp.fileName;
	/** P0-④：导出备注（写入备份列表显示；非敏感） */
	const note = exp.note;
	const password = exp.password;
	const passwordConfirm = exp.passwordConfirm;
	const running = exp.running;
	const progress = exp.progress;
	const result = exp.result;
	const error = exp.error;
	const downloaded = exp.downloaded;
	/** 下载进行中（瞬态 UI：下载通常数秒，切 tab 后由 api 层继续，切回显示完成态） */
	const [downloading, setDownloading] = (0, react.useState)(false);
	/** 下载防重入 ref（导出完成自动下载 + 用户手动下载共享；避免双击并发下载同一文件） */
	const downloadingRef = (0, react.useRef)(false);
	/** P2-⑫：导出前预览（null = 未请求；进行中/结果/错误） */
	const [preview, setPreview] = (0, react.useState)(null);
	/** P2-⑫：请求导出前预览（不落盘；按当前模式的分区选择） */
	const runPreview = async () => {
		if (running) return;
		setPreview({
			loading: true,
			result: null,
			error: null
		});
		try {
			const only = mode === "quick" ? flow.quickSelection() : [...selection];
			const result = await api.exportPreview(only);
			setPreview({
				loading: false,
				result,
				error: null
			});
		} catch (err) {
			setPreview({
				loading: false,
				result: null,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	const setMode = (next) => {
		runStore.patch({ export: { mode: next } });
	};
	const setIncludeSecrets = (next) => {
		runStore.patch({ export: {
			includeSecrets: next,
			encrypt: next ? true : exp.encrypt
		} });
	};
	const setEncrypt = (next) => {
		runStore.patch({ export: {
			encrypt: next,
			includeSecrets: next ? includeSecrets : false
		} });
	};
	const setPassword = (value) => {
		runStore.patch({ export: { password: value } });
	};
	const setPasswordConfirm = (value) => {
		runStore.patch({ export: { passwordConfirm: value } });
	};
	const setFileName = (value) => {
		runStore.patch({ export: { fileName: value } });
	};
	const setNote = (value) => {
		runStore.patch({ export: { note: value } });
	};
	const toggleSection = (0, react.useCallback)((id, checked) => {
		const has = selection.includes(id);
		if (checked && !has) runStore.patch({ export: { selection: [...selection, id] } });
		if (!checked && has) runStore.patch({ export: { selection: selection.filter((s) => s !== id) } });
	}, [selection]);
	const passwordInvalid = encrypt && (password === "" || password !== passwordConfirm);
	/** 自定义文件名合法性（P0-④）：留空合法（自动命名）；非空必须合法文件名。
	*  无需手动输入 .zip 后缀 —— 校验只针对「去 .zip 后缀后的基础名」，
	*  提交时经 normalizeExportFileName 自动补全 .zip（host 端 isValidExportFileName 仍兜底）。 */
	const trimmedName = fileName.trim();
	const baseName = trimmedName.replace(/\.zip$/i, "");
	const fileNameInvalid = trimmedName !== "" && !/^[A-Za-z0-9][A-Za-z0-9._ -]{0,127}$/.test(baseName);
	/** 执行导出（Quick 或 Custom）；成功后自动下载到浏览器「下载」目录 */
	const runExport = async () => {
		if (passwordInvalid || fileNameInvalid) return;
		runStore.patch({ export: {
			running: true,
			error: null,
			result: null,
			downloaded: false,
			progress: null,
			runId: null
		} });
		runStore.watchRunning("export", 500);
		try {
			api.exportPassword = encrypt ? password : null;
			const run = await flow.run(mode, selection, {
				includeSecrets: includeSecrets && encrypt,
				fileName: normalizeExportFileName(fileName),
				note: note.trim()
			});
			const runId = run.runId;
			runStore.patch({ export: {
				result: run,
				runId: typeof runId === "string" ? runId : null,
				progress: {
					stage: "done",
					step: 1,
					total: 1
				}
			} });
			await download(run.zipPath);
		} catch (err) {
			runStore.patch({ export: { error: err instanceof Error ? err.message : String(err) } });
		} finally {
			runStore.stopRunWatch("export");
			runStore.patch({ export: { running: false } });
		}
	};
	/** 把导出的 ZIP 下载到浏览器「下载」目录（默认静默下载，不弹另存为对话框）。
	*  防重入：downloadingRef 作锁，进行中忽略重复点击/自动触发；失败后恢复可重试。 */
	const download = async (zipPath) => {
		if (zipPath === "" || downloadingRef.current) return;
		downloadingRef.current = true;
		setDownloading(true);
		try {
			runStore.patch({ export: { error: null } });
			await api.download(zipPath);
			runStore.patch({ export: { downloaded: true } });
		} catch (err) {
			runStore.patch({ export: { error: err instanceof Error ? err.message : String(err) } });
		} finally {
			downloadingRef.current = false;
			setDownloading(false);
		}
	};
	const customWarnings = mode === "custom" ? flow.validateSelection(selection).warnings : [];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("view.export"),
				subtitle: t("section.description")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.modeTabs,
				role: "tablist",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": mode === "quick",
					"data-active": mode === "quick" ? "" : void 0,
					className: config_manager_module_css_default.modeTab,
					onClick: () => {
						setMode("quick");
					},
					children: t("export.mode.quick")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					type: "button",
					role: "tab",
					"aria-selected": mode === "custom",
					"data-active": mode === "custom" ? "" : void 0,
					className: config_manager_module_css_default.modeTab,
					onClick: () => {
						setMode("custom");
					},
					children: t("export.mode.custom")
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.modeHint,
				children: mode === "quick" ? t("export.mode.quickHint") : t("export.mode.customHint")
			}),
			mode === "custom" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupList,
				children: EXPORT_GROUPS.map((group) => {
					const categories = flow.categories.filter((c) => c.group === group.id);
					if (categories.length === 0) return null;
					return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
						className: config_manager_module_css_default.groupCard,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.groupHeader,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.groupLabel,
								children: group.label
							}), group.note !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.groupNote,
								children: group.note
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: config_manager_module_css_default.groupItems,
							children: categories.map((cat) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Checkbox, {
								checked: selection.includes(cat.id),
								onChange: (checked) => {
									toggleSection(cat.id, checked);
								},
								label: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: config_manager_module_css_default.categoryItem,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.categoryName,
											children: cat.label
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.categoryDesc,
											children: cat.description
										}),
										cat.portability !== "portable" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: cat.portability === "deviceSpecific" ? "warn" : "info",
											children: cat.portability
										}),
										cat.sensitive === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "warn",
											children: "secret"
										})
									]
								})
							}, cat.id))
						})]
					}, group.id);
				})
			}),
			customWarnings.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
				kind: "warn",
				children: [t("export.selectionWarnings"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: config_manager_module_css_default.warnList,
					children: customWarnings.map((w, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: w }, i))
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
				className: config_manager_module_css_default.optionsCard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.optionsHeader,
						children: t("export.security")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Checkbox, {
						checked: encrypt,
						onChange: setEncrypt,
						label: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.categoryName,
							children: t("export.encrypt")
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.hint,
						children: t("export.encryptHint")
					}),
					encrypt && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.secretFields,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: config_manager_module_css_default.field,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.fieldLabel,
									children: t("export.password")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "password",
									className: config_manager_module_css_default.input,
									value: password,
									onChange: (e) => {
										setPassword(e.target.value);
									},
									autoComplete: "new-password"
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: config_manager_module_css_default.field,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.fieldLabel,
									children: t("export.passwordConfirm")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "password",
									className: config_manager_module_css_default.input,
									value: passwordConfirm,
									onChange: (e) => {
										setPasswordConfirm(e.target.value);
									},
									autoComplete: "new-password"
								})]
							}),
							password !== "" && password !== passwordConfirm && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.formError,
								children: t("export.passwordMismatch")
							}),
							password === "" && encrypt && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.formError,
								children: t("export.passwordRequired")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Checkbox, {
						checked: includeSecrets,
						onChange: setIncludeSecrets,
						label: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.categoryName,
							children: t("export.includeSecrets")
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.hint,
						children: t("export.includeSecretsHint")
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
				className: config_manager_module_css_default.optionsCard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.optionsHeader,
						children: t("export.naming")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: config_manager_module_css_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.fieldLabel,
								children: t("export.fileName")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "text",
								className: config_manager_module_css_default.input,
								value: fileName,
								placeholder: "dsh-config-2026-08-24",
								onChange: (e) => {
									setFileName(e.target.value);
								},
								onBlur: () => {
									if (fileName.trim() !== "") setFileName(normalizeExportFileName(fileName));
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.hint,
								children: t("export.fileNameHint")
							}),
							fileNameInvalid && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.formError,
								children: t("export.fileNameInvalid")
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: config_manager_module_css_default.field,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.fieldLabel,
								children: t("export.note")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "text",
								className: config_manager_module_css_default.input,
								value: note,
								placeholder: t("export.notePlaceholder"),
								onChange: (e) => {
									setNote(e.target.value);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.hint,
								children: t("export.noteHint")
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					disabled: running,
					onClick: () => {
						runPreview();
					},
					children: preview?.loading === true ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("export.previewing") }) : t("export.preview")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					disabled: running || passwordInvalid || fileNameInvalid,
					onClick: () => {
						runExport();
					},
					children: running ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("export.running") }) : t("export.run")
				})]
			}),
			preview !== null && !preview.loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: preview.error !== null ? "error" : "info",
				children: preview.error !== null ? preview.error : preview.result !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [t("export.previewSummary", {
					sections: String(preview.result.totalSections),
					size: formatBytes(preview.result.totalSizeBytes)
				}), preview.result.sectionsFailed > 0 && ` · ${t("export.previewSkipped", { count: String(preview.result.sectionsFailed) })}`] })
			}),
			running && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProgressBar, {
				event: progress,
				active: true
			}),
			error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
				error,
				onRetry: () => {
					runExport();
				},
				retrying: running,
				t: api.t
			}),
			result !== null && !running && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReportView, {
				kind: "export",
				exportReport: result.report,
				onDownload: () => {
					download(result.zipPath);
				},
				downloadBusy: downloading,
				t: api.t
			}), downloaded && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "ok",
				children: t("export.saved", { name: result.report.file.name })
			})] })
		]
	});
}
//#endregion
//#region src/ui/flow.ts
/**
* 计算下一阶段：在 `list`（适用阶段的有序列表）中取 `from` 的下一项。
* - `from` 不在列表中（如来自 preview 页）→ 取第一项；
* - `from` 已是最后一项（confirm）→ 原地返回；
* - 绝不回退：已完成阶段不会因仍适用而被再次命中。
*/
function nextFlowPhase(list, from) {
	if (list.length === 0) return "confirm";
	const idx = list.indexOf(from);
	return list[Math.min(idx + 1, list.length - 1)] ?? "confirm";
}
//#endregion
//#region src/ui/next-steps.ts
/** 与 analyzer.createImportPlan 的 needsRestart 判定同一事实源（避免两处规则漂移）。
*  plan.needsRestart 由「存在 Install 项 或 mcp 非 skip/warning 变更」推出；这里
*  把实际需要重启的**项**列出来，供 UI 逐项展示（而不只是布尔）。 */
function restartRequiredItems(plan) {
	return plan.items.filter((i) => i.kind === "Install" || i.adapter === "mcp" && i.kind !== "Skip" && i.kind !== "Warning").map((i) => ({
		id: i.id,
		adapter: i.adapter,
		description: i.description
	}));
}
/** 失败 / 用户跳过的项（结果页「重试失败/跳过的子集」的对象；引擎跳过 Skip 不算）。
*  skippedByUser=true 或 status='failed' 才进 unresolved —— 与 ImportWizard.retryableCount
*  的语义一致（failed || skippedByUser），避免 UI 与控制器口径漂移。 */
function unresolvedItems(result) {
	return result.executed.filter((e) => e.status === "failed" || e.skippedByUser === true).map((e) => ({
		id: e.itemId,
		status: e.status === "failed" ? "failed" : "skipped",
		message: e.message
	}));
}
/** 聚合收尾清单：plan（待重启项）+ result（补录凭据 / 失败跳过项）。 */
function importNextSteps(plan, result) {
	const restartItems = restartRequiredItems(plan);
	const missingSecrets = [...result.missingSecrets];
	const unresolved = unresolvedItems(result);
	return {
		restartItems,
		missingSecrets,
		unresolved,
		hasNextSteps: restartItems.length > 0 || missingSecrets.length > 0 || unresolved.length > 0
	};
}
//#endregion
//#region src/client/import/ConflictList.tsx
/**
* 冲突决策列表（规范 §11，绑 src/ui/conflict-view.ts 的 ConflictCollector）。
*
* 渲染 plan 中 kind === 'Conflict' 的项，用户逐项选择
* Keep Current / Use Imported；决策实时写入 collector，
* 完成时父组件调用 collector.toResolutions() → wizard.setResolutions()。
*
* 注意：不提供 "Review（稍后决定）" 选项——Review 会被收集器计为
* unresolved，导致「下一步」永远禁用（死路）。要么决策，要么不进入本步。
*/
const RESOLUTION_OPTIONS = [{
	value: "keepCurrent",
	key: "import.conflicts.keepCurrent"
}, {
	value: "useImported",
	key: "import.conflicts.useImported"
}];
/** 批量决策全部冲突项（keepCurrent / useImported；下沉到 ConflictCollector.resolveAll 纯函数，
*  组件只做装配 + tick/onChanged 通知；与逐项逻辑一致地更新 UI） */
function resolveAll(collector, resolution, setTick, onChanged) {
	collector.resolveAll(resolution);
	setTick((v) => v + 1);
	onChanged();
}
/** 冲突项决策列表 */
function ConflictList({ collector, t, onChanged }) {
	const [tick, setTick] = (0, react.useState)(0);
	const items = collector.viewItems();
	const unresolved = collector.unresolved().length;
	const hasConflicts = items.length > 0;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.conflictList,
		children: [
			unresolved > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "warn",
				children: t("import.conflicts.unresolved", { count: String(unresolved) })
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					disabled: !hasConflicts,
					onClick: () => {
						resolveAll(collector, "keepCurrent", setTick, onChanged);
					},
					children: t("import.conflicts.keepCurrentAll")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					disabled: !hasConflicts,
					onClick: () => {
						resolveAll(collector, "useImported", setTick, onChanged);
					},
					children: t("import.conflicts.useImportedAll")
				})]
			}),
			items.map((view) => {
				const item = view.item;
				return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.conflictItem,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.conflictHead,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: config_manager_module_css_default.conflictId,
								children: [
									item.adapter,
									": ",
									item.description
								]
							}), item.severity === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.severityError,
								children: "error"
							})]
						}),
						item.detail !== void 0 && item.detail !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
							className: config_manager_module_css_default.conflictDetail,
							children: item.detail
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: config_manager_module_css_default.conflictOptions,
							children: RESOLUTION_OPTIONS.map((opt) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: config_manager_module_css_default.radioLabel,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "radio",
									name: `conflict-${item.id}`,
									checked: view.resolution === opt.value,
									onChange: () => {
										collector.resolve(item.id, opt.value);
										setTick((v) => v + 1);
										onChanged();
									}
								}), t(opt.key)]
							}, opt.value))
						})
					]
				}, item.id);
			}),
			items.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.empty,
				children: "No conflicts"
			}),
			void 0
		]
	});
}
//#endregion
//#region src/client/import/PathMappingForm.tsx
/**
* 路径映射表单（规范 §12，绑 src/ui/types.ts 的 PathMappingDraft 形状）。
*
* 注意：src/ui/path-mapping.ts 的 PathMappingEditor 依赖 utils/paths.ts 的
* applyPrefixMappings（node:path）——浏览器 bundle 不可用，故此处做轻量等价实现：
* 输入输出形状与 core 的 PathMapping 完全一致（oldPrefix/newPrefix/appliesTo），
* 实际前缀替换由 Host 侧 core 在 createImportPlan 阶段执行，本组件只负责收集用户输入。
*/
/**
* 路径映射表单：每条 PathIssue 一行（原路径 → 新路径输入框），
* 留空 = 该路径不映射（unresolved）；填写 = 输出 core PathMapping[]。
*/
function PathMappingForm({ issues, initial, t, onChange }) {
	const [drafts, setDrafts] = (0, react.useState)(() => {
		const out = {};
		for (const m of initial ?? []) out[m.oldPrefix] = m.newPrefix;
		return out;
	});
	const setNewPrefix = (oldPrefix, value) => {
		const next = {
			...drafts,
			[oldPrefix]: value
		};
		setDrafts(next);
		onChange(Object.entries(next).filter(([, v]) => v !== "").map(([oldPrefix, newPrefix]) => ({
			oldPrefix,
			newPrefix,
			appliesTo: []
		})));
	};
	const unresolved = (0, react.useMemo)(() => {
		return issues.filter((issue) => (drafts[issue.value] ?? "") === "");
	}, [issues, drafts]);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.pathMappingList,
		children: [
			unresolved.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "warn",
				children: t("import.paths.unresolved", { count: String(unresolved.length) })
			}),
			issues.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.empty,
				children: "No paths to map"
			}),
			issues.map((issue) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.pathRow,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.pathOld,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.fieldLabel,
							children: t("import.paths.old")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
							className: config_manager_module_css_default.pathValue,
							children: issue.value
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.pathIssueKind,
							children: issue.kind
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.pathNew,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.fieldLabel,
						children: t("import.paths.new")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						className: config_manager_module_css_default.input,
						value: drafts[issue.value] ?? "",
						placeholder: issue.mappedTo ?? "",
						onChange: (e) => {
							setNewPrefix(issue.value, e.target.value);
						}
					})]
				})]
			}, issue.value))
		]
	});
}
//#endregion
//#region src/ui/migration-consult-view.ts
/** verdict → Badge kind（语义映射） */
function consultVerdictBadgeKind(v) {
	switch (v) {
		case "healthy": return "ok";
		case "needs-attention": return "warn";
		case "critical": return "error";
	}
}
/** recommendation → Badge kind */
function consultRecommendationBadgeKind(r) {
	switch (r) {
		case "proceed": return "ok";
		case "review": return "warn";
		case "block": return "error";
	}
}
/** 维度 label（i18n key 后缀） */
function consultDimensionLabel(id, t) {
	switch (id) {
		case "compatibility": return t("consult.dim.compatibility");
		case "integrity": return t("consult.dim.integrity");
		case "sections": return t("consult.dim.sections");
		case "consistency": return t("consult.dim.consistency");
		case "sensitive": return t("consult.dim.sensitive");
		case "migratability": return t("consult.dim.migratability");
	}
}
/** 把 ConsultReport 转成视图数据（纯函数） */
function consultView(report, t) {
	const dimensions = report.dimensions.map((d) => ({
		id: d.id,
		label: consultDimensionLabel(d.id, t),
		score: d.score,
		verdict: d.verdict,
		badgeKind: consultVerdictBadgeKind(d.verdict),
		issues: d.issues.map((i) => ({
			severity: i.severity,
			message: i.message
		}))
	}));
	return {
		healthScore: report.healthScore,
		verdict: report.verdict,
		verdictBadgeKind: consultVerdictBadgeKind(report.verdict),
		recommendation: report.recommendation,
		recommendationBadgeKind: consultRecommendationBadgeKind(report.recommendation),
		recommendationLabel: consultRecommendationLabel(report.recommendation, t),
		reasons: report.recommendationReasons,
		dimensions,
		willApply: {
			sections: report.willApply.sections,
			itemCount: report.willApply.itemCount,
			conflicts: report.willApply.conflicts,
			risks: report.willApply.risks,
			overwritten: report.willApply.overwritten,
			dryRun: report.willApply.dryRun
		}
	};
}
/** recommendation 的可读标签 */
function consultRecommendationLabel(r, t) {
	switch (r) {
		case "proceed": return t("consult.recommendation.proceed");
		case "review": return t("consult.recommendation.review");
		case "block": return t("consult.recommendation.block");
	}
}
//#endregion
//#region src/client/consult/ConsultCard.tsx
/** 迁移前咨询卡：健康评分 + 维度明细 + 建议 + 触发项 */
function ConsultCard({ report, t, title }) {
	const view = consultView(report, t);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
		className: config_manager_module_css_default.card,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, { title: title ?? t("consult.title") }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.statRow,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: view.verdictBadgeKind,
						children: t("consult.healthScore", { score: String(view.healthScore) })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: view.recommendationBadgeKind,
						children: view.recommendationLabel
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "info",
						children: t("consult.dryRun")
					})
				]
			}),
			view.reasons.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
				kind: view.verdictBadgeKind === "error" ? "error" : view.verdictBadgeKind === "warn" ? "warn" : "info",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.groupLabel,
					children: t("consult.reasons")
				}), view.reasons.map((r, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: redact(r) }, i))]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("consult.willApply")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.statRow,
				children: [
					view.willApply.sections.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "info",
						children: t("consult.sections", { count: String(view.willApply.sections.length) })
					}),
					view.willApply.itemCount > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "info",
						children: t("consult.items", { count: String(view.willApply.itemCount) })
					}),
					view.willApply.conflicts > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "warn",
						children: t("consult.conflicts", { count: String(view.willApply.conflicts) })
					}),
					view.willApply.risks > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "warn",
						children: t("consult.risks", { count: String(view.willApply.risks) })
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("consult.dimensions")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.consultScroll,
				children: view.dimensions.map((d) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.consultDimension,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.statRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: d.badgeKind,
							children: d.label
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: d.score
						})]
					}), d.issues.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: config_manager_module_css_default.reportList,
						children: d.issues.map((issue, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: redact(issue.message) }, i))
					})]
				}, d.id))
			})
		]
	});
}
//#endregion
//#region src/client/import/import-file-select.ts
/** 由 store 状态推导 select 步骤的展示模型（selectedFileName + uploading）。 */
function fileSelectModel(selectedName, busy) {
	return {
		selectedName,
		busy
	};
}
/**
* 处理文件选择（input onChange 入口）：
* - **恒清空 input 的 value** —— 同一文件再次选择也会触发 onChange（同文件换选）；
* - 返回选中的文件；用户关闭文件对话框（无文件）返回 undefined。
* input 以最小接口 `{ value: string }` 传入，纯逻辑可测；React 侧传真实 e.target。
*/
function consumePickedFile(file, input) {
	if (input !== null) input.value = "";
	return file;
}
/**
* 选中/换选后的状态：以新文件替换旧选择（提交的永远是最新选中的文件）；
* 未选文件（对话框取消）保持原状态不变。
*/
function applyPickedFile(current, file) {
	if (file === void 0) return current;
	return {
		selectedName: file.name,
		busy: true
	};
}
/** 取消选择：清空选择与忙碌态（回 idle；UI 同时清空 input value 保证同文件可重选）。 */
function cancelSelection(current) {
	return {
		selectedName: null,
		busy: false
	};
}
/** 浏览按钮文案键：已选文件 → 重新选择；否则 → 选择 ZIP 文件。 */
function browseLabelKey(hasSelection) {
	return hasSelection ? "import.select.reselect" : "import.select.browse";
}
/**
* select 步骤是否应渲染文件选择页。
*
* decrypt-archive（解锁整体加密容器）阶段发生时，step 仍可能是 'select'
* （上传后尚未 selectZip），此时渲染必须让位给解锁页而非文件选择页——
* 否则用户停在「已选择文件 + 取消/重新选择」页面，看不到密码输入界面，
* 无法继续导入加密快照（import-decrypt-archive-render 回归）。
*
* 入参用 string 而非 ui 类型，避免本纯函数模块引入跨层类型依赖（可 node --test 直测）。
*/
function shouldRenderSelect(step, phase) {
	return step === "select" && phase !== "decrypt-archive";
}
//#endregion
//#region src/client/import/ImportWizardView.tsx
/**
* 导入九步向导（规范 §9 / §10 / §28，绑 src/ui/import-wizard.ts 的 ImportWizard 控制器）。
*
* 步骤（对齐 ui/types.ts 的 ImportStep）：
*   Select ZIP → Analyzing → Compatibility → Preview
*   → Resolve Conflicts（若有）→ Path Mapping（若有）→ Secrets 补录（若有）
*   → Confirm → Importing → Result
*
* 安全/正确性约束（来自 ImportWizard 与 core）：
*   - analyzeImport / createImportPlan 零写入（Dry Run 复用）；
*   - executeImportPlan 必须 confirm=true（core 安全阀）；
*   - 秘密补录值仅内存（secretInputs），经 HTTPS 请求体传给 Host，绝不落日志/落盘，
*     **也绝不进入 sessionStorage**（m2 白名单剔除，刷新后 secrets 阶段要求重输）；
*   - 默认整体回滚（rollbackOnError=true），用户在 Confirm 步可切换；
*   - 整体加密容器（DCA1）密码只输入一次：选完 ZIP 即进入「解锁加密备份」
*     （decrypt-archive）输入密码，Host 解锁时顺带解出内部凭据覆盖清单（refs）；
*     该密码同时作为解密密码交给向导，无第二个密码校验页面（decrypt-archive 回归）。
*
* 数据流：本地文件 → api.upload → zipPath → wizard.selectZip/confirmCompatibility/
*   setResolutions/setPathMappings/setSecretInputs → wizard.execute。
* 中间阶段（conflicts/path-mapping/secrets）是 UI 层流程页，wizard 的 decisions 由
* 对应组件收集后写入。
*
* m2：全部 UI 状态由模块级 runStore 持有（切 tab/关面板不重建、刷新恢复），
* 控制器实例（ImportWizard）由 store 缓存复用；每次 wizard 动作后 syncWizard()
* 把控制器快照镜像进 store（非敏感字段持久化）。
*/
/** 中间流程阶段（wizard.step 之外的 UI 层页面）——定义见 src/ui/flow.ts */
const SCORE_LABEL = {
	excellent: "Excellent",
	good: "Good",
	partial: "Partial",
	unsupported: "Unsupported"
};
/** 密钥补录表单（仅内存收集，值不外泄；onChange 写入 store 的仅内存字段） */
function SecretsForm({ missing, t, onChange }) {
	const [inputs, setInputs] = (0, react.useState)({});
	const setRef = (ref, value) => {
		const next = {
			...inputs,
			[ref]: value
		};
		setInputs(next);
		onChange(next);
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.secretsList,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.hint,
				children: t("import.secrets.hint")
			}),
			missing.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: "No secrets required" }),
			missing.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				className: config_manager_module_css_default.field,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: config_manager_module_css_default.fieldLabel,
					children: [
						s.ref,
						" ",
						s.required ? t("import.secrets.required") : t("import.secrets.optional")
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					type: "password",
					className: config_manager_module_css_default.input,
					autoComplete: "off",
					value: inputs[s.ref] ?? "",
					onChange: (e) => {
						setRef(s.ref, e.target.value);
					}
				})]
			}, s.ref))
		]
	});
}
/**
* 导入执行日志面板（importing 步骤进度条下方）：展示导入过程中执行的命令
* （逐计划项操作 `▶/✓/⚠/✗/–` + 子进程命令行 `$ dsh plugin …`）。
* - 数据来自 Host RunRegistry（经 /progress 轮询回传），行文本仅非敏感内容，
*   渲染前再过 redact() 兜底（安全不变量：UI 展示文本先脱敏）；
* - 限高内滚（logScroll）；**智能自动滚动**：仅当用户贴近底部时跟随最新行；
*   用户向上滚动查看历史时不强制拉回，改显示「↓ 新输出」提示，点击再滚到底部；
* - memo 自定义比较：lines 数组为同一引用被 append（RunState.log push 不换引用），
*   按引用浅比较无法感知新行 —— 比较长度 + t 引用，避免整页轮询反复重渲染整个列表。
*/
function ImportLogPanelBase({ lines, t }) {
	const scrollRef = (0, react.useRef)(null);
	/** 是否贴底（用户上滚置 false；滚动回底部自动恢复） */
	const stickRef = (0, react.useRef)(true);
	/** 用户上滚后是否有新行到达（显示「↓ 新输出」；点击跳到底部清除） */
	const [hasNewOutput, setHasNewOutput] = (0, react.useState)(false);
	/**
	* 上次渲染的数组引用（新输出 = 引用变化）。依赖 appendLog 的**不可变写入**：
	* 每次追加都生成新数组（run-registry.ts）——行数封顶后长度恒定，但引用必变，
	* 以引用判断才能感知截断后的新行（长度比较在 500 行封顶时失效）。
	*/
	const prevLinesRef = (0, react.useRef)(lines);
	(0, react.useEffect)(() => {
		const el = scrollRef.current;
		if (el === null) return;
		const hasNew = lines !== prevLinesRef.current;
		prevLinesRef.current = lines;
		if (stickRef.current) {
			el.scrollTop = el.scrollHeight;
			setHasNewOutput(false);
		} else if (hasNew) setHasNewOutput(true);
	}, [lines]);
	/** 滚动中更新贴底状态（上滚 → 停止跟随；滚回底部 → 恢复跟随并清除提示） */
	const onScroll = () => {
		const el = scrollRef.current;
		if (el === null) return;
		const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
		stickRef.current = nearBottom;
		if (nearBottom) setHasNewOutput(false);
	};
	/** 「↓ 新输出」：跳到底部 + 恢复跟随 */
	const jumpToBottom = () => {
		const el = scrollRef.current;
		if (el !== null) el.scrollTop = el.scrollHeight;
		stickRef.current = true;
		setHasNewOutput(false);
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.logPanel,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.logHeader,
			children: [t("import.log.title"), hasNewOutput && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: config_manager_module_css_default.logJumpButton,
				onClick: jumpToBottom,
				children: ["↓ ", t("import.log.newOutput")]
			})]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.logScroll,
			ref: scrollRef,
			onScroll,
			children: lines.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.logEmpty,
				children: t("import.log.empty")
			}) : lines.map((line, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.logLine,
				children: redact(line)
			}, i))
		})]
	});
}
/** memo：lines 数组经 appendLog **不可变追加**（每次 append 换新引用，run-registry.ts）——
*  自定义比较以「数组引用 + t 引用」为准：引用未变 = 无新输出，跳过整个列表重渲染；
*  引用已变 = 有新行（含 500 行封顶后长度不变的情况），必须重渲染。 */
const ImportLogPanel = (0, react.memo)(ImportLogPanelBase, (prev, next) => prev.lines === next.lines && prev.t === next.t);
/**
* 导入/同步后收尾清单（P0-① / P2-⑪，绑 src/ui/next-steps.ts 的 importNextSteps 纯函数）。
* - 待重启项（Install 插件 / mcp 变更 → 重启 DSH 生效，逐项列出 id + 摘要）；
* - 补录凭据（ref 名清单，非值；无值展示，安全不变量不破）；
* - 失败/跳过项（count 传达「可重试」，明细仍在 ReportView 内联报告里）。
* 三组均无内容 → 显示「全部完成」ok Banner（替代旧版单行 needsRestart 提示）。
*/
function NextStepsCard({ plan, result, t }) {
	if (plan === null) return result.needsRestart ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
		kind: "warn",
		children: t("report.needsRestart")
	}) : null;
	const steps = importNextSteps(plan, result);
	if (!steps.hasNextSteps) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
		kind: "ok",
		children: t("nextSteps.done")
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
		className: config_manager_module_css_default.card,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("nextSteps.title")
			}),
			steps.restartItems.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.nextStepsGroup,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.groupLabel,
						children: t("nextSteps.restart.title", { count: String(steps.restartItems.length) })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.hint,
						children: t("nextSteps.restart.hint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: config_manager_module_css_default.reportList,
						children: steps.restartItems.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
							item.adapter,
							": ",
							item.description
						] }, item.id))
					})
				]
			}),
			steps.missingSecrets.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.nextStepsGroup,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.groupLabel,
						children: t("nextSteps.secrets.title", { count: String(steps.missingSecrets.length) })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.hint,
						children: t("nextSteps.secrets.hint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: config_manager_module_css_default.reportList,
						children: steps.missingSecrets.map((ref) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: ref }, ref))
					})
				]
			}),
			steps.unresolved.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.nextStepsGroup,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.groupLabel,
					children: t("nextSteps.unresolved.title", { count: String(steps.unresolved.length) })
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					children: t("nextSteps.unresolved.hint")
				})]
			})
		]
	});
}
/**
* 导入向导主视图。
*/
function ImportWizardView({ api, t }) {
	const imp = (0, react.useSyncExternalStore)(runStore.subscribe, runStore.getSnapshot).import;
	const wizard = runStore.importWizard(api);
	const step = imp.step;
	const phase = imp.phase;
	const progress = imp.progress;
	const error = imp.error;
	const uploading = imp.uploading;
	const running = imp.running;
	const rollbackOnError = imp.rollbackOnError;
	const conflictCollector = imp.conflictCollector;
	const pathMappings = imp.pathMappings;
	const secretInputs = imp.secretInputs;
	const decryptRefs = imp.decryptRefs;
	const isEncrypted = imp.analysis?.encrypted === true;
	const containerEncrypted = imp.containerEncrypted;
	const archiveUnlocked = imp.archiveUnlocked;
	const fileInput = (0, react.useRef)(null);
	/**
	* 选择代数（取消选择时递增）：作废在途的选择上传/分析，
	* 防止「取消后旧请求仍把向导推进/写错误」的竞态。
	*/
	const pickGeneration = (0, react.useRef)(0);
	/** decrypt-archive 阶段（解锁加密容器）的本地状态（不持久化） */
	const [unlocking, setUnlocking] = (0, react.useState)(false);
	const [archiveUnlockError, setArchiveUnlockError] = (0, react.useState)(null);
	/** 解锁阶段密码输入（本地 state，不上报 store 的敏感持久化键） */
	const [archivePassword, setArchivePassword] = (0, react.useState)("");
	/** Phase 7 迁移前咨询：预览步的咨询报告（本地 state，非敏感） */
	const [consultReport, setConsultReport] = (0, react.useState)(null);
	const [consultLoading, setConsultLoading] = (0, react.useState)(false);
	const setPhase = (next) => {
		runStore.patch({ import: { phase: next } });
	};
	const hasConflicts = (imp.plan?.items ?? []).some((i) => i.kind === "Conflict");
	const hasPathIssues = (imp.analysis?.pathIssues.length ?? 0) > 0;
	const hasSecrets = (imp.plan?.missingSecrets ?? []).some((s) => !decryptRefs.includes(s.ref));
	/**
	* 适用阶段的有序列表（仅含需要用户处理 + 确认页）。
	* hasConflicts/hasPathIssues/hasSecrets 基于原始 analysis/plan（Dry Run 产物），
	* 在流程中不会因已解决而重算——所以导航必须只前进（见 nextFlowPhase），
	* 而不是靠"当前阶段 != X"判定（那会让已完成阶段被重新命中、跳回上一步）。
	* 整体加密容器（containerEncrypted && !archiveUnlocked）恒先插入 decrypt-archive：
	* 不解锁不得分析/继续导入。解密密码只在解锁时输入一次（导出时容器密码与
	* 内部 secrets.enc 密码同源），不再有独立的 decrypt 阶段。
	*/
	const applicablePhases = () => {
		const list = [];
		if (containerEncrypted && !archiveUnlocked) list.push("decrypt-archive");
		if (hasConflicts) list.push("conflicts");
		if (hasPathIssues) list.push("path-mapping");
		if (hasSecrets) list.push("secrets");
		list.push("confirm");
		return list;
	};
	/** 从某阶段完成后进入的下一个阶段：只前进（from 不在列表时取第一项） */
	const nextPhase = (from) => nextFlowPhase(applicablePhases(), from);
	/** 选择并上传 ZIP → wizard.selectZip（analyzing → compatibility）。
	* 换选不变式：每次选择都以最新文件为准（applyPickedFile 替换旧选择）；
	* pickGeneration 守卫作废取消后在途的旧请求。
	* 整体加密容器（upload.containerType === 'encrypted'）：不能直接按 ZIP 分析，
	* 先进入「解锁加密备份」（decrypt-archive）阶段，解锁成功后再走 selectZip。 */
	const onPickFile = async (file) => {
		if (file === void 0) return;
		const generation = pickGeneration.current;
		const next = applyPickedFile(fileSelectModel(imp.selectedFileName, uploading), file);
		runStore.patch({ import: {
			uploading: next.busy,
			error: null,
			selectedFileName: next.selectedName,
			decryptPassword: "",
			decryptRefs: [],
			archiveUnlocked: false,
			containerEncrypted: false
		} });
		try {
			const uploaded = await api.upload(file);
			if (generation !== pickGeneration.current) return;
			if (uploaded.containerType === "encrypted") {
				wizard.setArchiveEncrypted(true, uploaded.zipPath);
				runStore.patch({ import: {
					containerEncrypted: true,
					archiveUnlocked: false,
					zipPath: uploaded.zipPath,
					phase: "decrypt-archive"
				} });
				runStore.syncWizard();
				return;
			}
			await wizard.selectZip(uploaded.zipPath);
			if (generation !== pickGeneration.current) return;
			runStore.syncWizard();
		} catch (err) {
			if (generation !== pickGeneration.current) return;
			runStore.patch({ import: { error: err instanceof Error ? err.message : String(err) } });
			runStore.syncWizard();
		} finally {
			if (generation === pickGeneration.current) runStore.patch({ import: { uploading: false } });
		}
	};
	/** 取消当前选择：回 idle 并清空 input value（同一文件可再次选择触发 onChange）。 */
	const cancelPick = () => {
		pickGeneration.current += 1;
		const idle = cancelSelection(fileSelectModel(imp.selectedFileName, uploading));
		runStore.patch({ import: {
			selectedFileName: idle.selectedName,
			uploading: idle.busy,
			error: null
		} });
		if (fileInput.current !== null) fileInput.current.value = "";
	};
	/**
	* 一键导入（快照面板「备份文件 → 导入」）：消费 runStore.snapshots.importBackup，
	* 跳过上传直接对宿主 exports 目录的 zipPath 执行 selectZip（analyze 零写入）。
	* 一次性瞬态：消费后立即清空，刷新/重挂载不会重放；与 onPickFile 共用
	* pickGeneration 竞态守卫（用户取消选择后晚到的分析结果丢弃）。
	*/
	(0, react.useEffect)(() => {
		const req = runStore.getSnapshot().snapshots.importBackup;
		if (req === null) return;
		runStore.patch({ snapshots: { importBackup: null } });
		const generation = pickGeneration.current;
		runStore.patch({ import: {
			selectedFileName: req.name,
			uploading: true,
			error: null,
			decryptPassword: "",
			decryptRefs: [],
			archiveUnlocked: false,
			containerEncrypted: false
		} });
		wizard.selectZip(req.zipPath).then(() => {
			if (generation !== pickGeneration.current) return;
			runStore.syncWizard();
		}).catch((err) => {
			if (generation !== pickGeneration.current) return;
			runStore.patch({ import: { error: err instanceof Error ? err.message : String(err) } });
			runStore.syncWizard();
		}).finally(() => {
			if (generation === pickGeneration.current) runStore.patch({ import: { uploading: false } });
		});
	}, [api]);
	/** Phase 7 迁移前咨询：预览步对当前 ZIP 生成咨询报告（只读，零写入）。
	*  zipPath 变化 / 进入 preview 步时重新获取；失败静默（咨询是建议性，不阻断导入）。 */
	(0, react.useEffect)(() => {
		if (step !== "preview" || imp.zipPath === null) return;
		let cancelled = false;
		setConsultLoading(true);
		api.consult({
			type: "export-zip",
			id: imp.zipPath
		}).then((report) => {
			if (!cancelled) setConsultReport(report);
		}).catch(() => {
			if (!cancelled) setConsultReport(null);
		}).finally(() => {
			if (!cancelled) setConsultLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		step,
		imp.zipPath,
		api
	]);
	/** Compatibility → Preview */
	const goPreview = async () => {
		runStore.patch({ import: { error: null } });
		try {
			await wizard.confirmCompatibility();
			runStore.syncWizard();
		} catch (err) {
			runStore.patch({ import: { error: err instanceof Error ? err.message : String(err) } });
			runStore.syncWizard();
		}
	};
	/** 进入 conflicts 阶段（先创建 collector） */
	const enterConflicts = () => {
		const plan = imp.plan;
		if (plan !== null && imp.conflictCollector === null) runStore.patch({ import: { conflictCollector: new ConflictCollector(plan) } });
		setPhase("conflicts");
	};
	/** Conflicts 完成：写入决策 → 下一阶段（决策同时持久化，切 tab/刷新可恢复） */
	const finishConflicts = () => {
		if (imp.conflictCollector !== null) {
			const resolutions = imp.conflictCollector.toResolutions();
			wizard.setResolutions(resolutions);
			runStore.patch({ import: { conflictResolutions: resolutions } });
		}
		setPhase(nextPhase("conflicts"));
	};
	/** Path Mapping 完成：写入映射 → 下一阶段 */
	const finishPathMapping = () => {
		wizard.setPathMappings(pathMappings);
		setPhase(nextPhase("path-mapping"));
	};
	/** Secrets 完成：写入补录值（仅内存）→ Confirm */
	const finishSecrets = () => {
		wizard.setSecretInputs(secretInputs);
		setPhase("confirm");
	};
	/** 解锁整体加密备份容器（只读，零写入）：解密 → 明文 ZIP → selectZip 继续分析。
	* 导出时容器密码与备份内 secrets.enc 密码同源（同一 password 派生两层加密）：
	* 解锁请求在 Host 端顺带解出内部凭据覆盖清单（refs）一并返回，此密码直接作为
	* 解密密码交给向导——整个导入只输入这一次密码，没有第二个密码校验页面。 */
	const onUnlockArchive = async () => {
		if (imp.zipPath === null) return;
		const generation = pickGeneration.current;
		setUnlocking(true);
		setArchiveUnlockError(null);
		try {
			const { refs } = await wizard.unlockArchive(imp.zipPath, archivePassword);
			if (generation !== pickGeneration.current) return;
			wizard.setDecryptPassword(archivePassword);
			runStore.patch({ import: {
				archiveUnlocked: true,
				decryptPassword: archivePassword,
				decryptRefs: refs
			} });
			runStore.syncWizard();
			await wizard.selectZip(imp.zipPath);
			if (generation !== pickGeneration.current) return;
			runStore.syncWizard();
			runStore.patch({ import: { phase: "preview" } });
		} catch (err) {
			if (generation !== pickGeneration.current) return;
			setArchiveUnlockError(err instanceof Error ? err.message : String(err));
			runStore.patch({ import: { error: err instanceof Error ? err.message : String(err) } });
			runStore.syncWizard();
		} finally {
			setUnlocking(false);
		}
	};
	/** Confirm 执行：confirm=true（安全阀）+ 用户回滚策略 */
	const execute = async (opts) => {
		runStore.patch({ import: {
			error: null,
			running: true,
			skipRequested: false
		} });
		runStore.watchRunning("import", 500);
		try {
			const promise = opts?.retry === true ? wizard.executeRetry({ rollbackOnError }) : wizard.execute({
				confirm: true,
				rollbackOnError
			});
			runStore.syncWizard();
			const runId = (await promise).runId;
			runStore.patch({ import: {
				runId: typeof runId === "string" ? runId : null,
				skipRequested: false
			} });
			runStore.syncWizard();
		} catch (err) {
			runStore.patch({ import: { error: err instanceof Error ? err.message : String(err) } });
			runStore.syncWizard();
		} finally {
			runStore.stopRunWatch("import");
			runStore.patch({ import: { running: false } });
		}
	};
	/**
	* 跳过当前正在安装的插件（导入中）：通知宿主 abort 当前项子进程 →
	* kill + 清理半装状态 → 该项标记 user-skipped → 导入继续其余项。
	*/
	const skipCurrent = async () => {
		const runId = imp.runId;
		if (runId === null || imp.skipRequested) return;
		runStore.patch({ import: { skipRequested: true } });
		try {
			await api.skipExecute(runId);
		} catch {
			runStore.patch({ import: { skipRequested: false } });
		}
	};
	/** 重置向导（重新导入） */
	const resetWizard = () => {
		pickGeneration.current += 1;
		wizard.reset();
		runStore.syncWizard();
		runStore.patch({ import: {
			phase: "preview",
			uploading: false,
			running: false,
			progress: null,
			error: null,
			runId: null,
			selectedFileName: null,
			conflictCollector: null,
			conflictStrategy: "merge",
			conflictResolutions: {},
			pathMappings: [],
			secretInputs: {},
			decryptPassword: "",
			decryptRefs: [],
			containerEncrypted: false,
			archiveUnlocked: false,
			skipRequested: false
		} });
	};
	if (shouldRenderSelect(step, phase)) {
		const selectModel = fileSelectModel(imp.selectedFileName, uploading);
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.viewBody,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
					title: t("import.select.title"),
					subtitle: t("import.select.hint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					ref: fileInput,
					type: "file",
					accept: ".zip,application/zip",
					className: config_manager_module_css_default.hiddenFile,
					onChange: (e) => {
						const file = consumePickedFile(e.target.files?.[0], e.target);
						onPickFile(file);
					}
				}),
				selectModel.selectedName !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					"data-testid": "import-selected-file",
					children: t("import.select.file", { name: selectModel.selectedName })
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [selectModel.selectedName !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: cancelPick,
						children: t("import.select.cancel")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: uploading,
						onClick: () => {
							fileInput.current?.click();
						},
						children: uploading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("import.analyzing") }) : t(browseLabelKey(selectModel.selectedName !== null))
					})]
				}),
				error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
					error,
					onRetry: resetWizard,
					t: api.t
				})
			]
		});
	}
	if (step === "analyzing") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProgressBar, {
				event: progress,
				active: true
			}),
			error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
				error,
				onRetry: resetWizard,
				t: api.t
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorList, { errors: imp.errors })
		]
	});
	if (step === "compatibility") {
		const analysis = imp.analysis;
		if (analysis === null) return null;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.viewBody,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, { title: t("import.compatibility.title") }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: analysis.compatibility === "unsupported" ? "error" : analysis.compatibility === "partial" ? "warn" : "ok",
							children: t("import.compatibility.score", { score: SCORE_LABEL[analysis.compatibility] ?? analysis.compatibility })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
							kind: "info",
							children: [analysis.sectionsInZip.length, " sections"]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
							kind: "info",
							children: [
								"plugins: ",
								analysis.pluginSummary.installed,
								"✓ / ",
								analysis.pluginSummary.toInstall,
								"✗"
							]
						}),
						analysis.pathIssues.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
							kind: "warn",
							children: [analysis.pathIssues.length, " paths"]
						}),
						analysis.secretCount > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
							kind: "warn",
							children: [analysis.secretCount, " secrets"]
						}),
						analysis.encrypted && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
							kind: "error",
							children: ["🔒 ", t("import.decrypt.badge")]
						})
					]
				}),
				analysis.warnings.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
					kind: "warn",
					children: analysis.warnings.map((w, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: w }, i))
				}),
				error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
					error,
					onRetry: () => {
						goPreview();
					},
					t: api.t
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: resetWizard,
						children: t("import.select.reselect")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: () => {
							goPreview();
						},
						children: t("common.next")
					})]
				})
			]
		});
	}
	if (step === "preview" && phase === "preview") {
		const summary = wizard.previewSummary();
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.viewBody,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, { title: t("import.preview.title") }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: summary.willChange > 0 ? "info" : "ok",
							children: t("import.preview.willChange", { count: String(summary.willChange) })
						}),
						summary.unchanged > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "ok",
							children: t("import.preview.unchanged", { count: String(summary.unchanged) })
						}),
						summary.settingsUpdates > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: t("import.preview.settings", { count: String(summary.settingsUpdates) })
						}),
						summary.pluginsToInstall > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: t("import.preview.plugins", { count: String(summary.pluginsToInstall) })
						}),
						summary.mcpAdds > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: t("import.preview.mcp", { count: String(summary.mcpAdds) })
						}),
						summary.pathMappingsNeeded > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "warn",
							children: t("import.preview.paths", { count: String(summary.pathMappingsNeeded) })
						}),
						summary.secretsNeeded > 0 && !isEncrypted && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "warn",
							children: t("import.preview.secrets", { count: String(summary.secretsNeeded) })
						}),
						summary.conflicts > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "error",
							children: t("import.preview.conflicts", { count: String(summary.conflicts) })
						}),
						isEncrypted && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
							kind: "error",
							children: ["🔒 ", t("import.decrypt.badge")]
						})
					]
				}),
				isEncrypted && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
					kind: "warn",
					children: t("import.decrypt.previewHint")
				}),
				summary.needsRestart && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
					kind: "warn",
					children: t("import.preview.restart")
				}),
				consultLoading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: api.t("consult.loading") }),
				consultReport !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConsultCard, {
					report: consultReport,
					t: api.t
				}),
				error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
					error,
					onRetry: () => {
						goPreview();
					},
					t: api.t
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: resetWizard,
						children: t("import.select.reselect")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: () => {
							const next = nextPhase("preview");
							setPhase(next);
							if (next === "conflicts") enterConflicts();
						},
						children: t("common.next")
					})]
				})
			]
		});
	}
	if (phase === "decrypt-archive") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("import.decryptArchive.title"),
				subtitle: t("import.decryptArchive.hint")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				type: "password",
				className: config_manager_module_css_default.input,
				autoComplete: "off",
				placeholder: t("import.decryptArchive.passwordPlaceholder"),
				value: archivePassword,
				onChange: (e) => {
					setArchivePassword(e.target.value);
					setArchiveUnlockError(null);
				}
			}),
			archiveUnlockError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
				error: archiveUnlockError,
				t: api.t
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: resetWizard,
					children: t("import.select.reselect")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					disabled: archivePassword === "" || unlocking,
					onClick: () => {
						onUnlockArchive();
					},
					children: unlocking ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("import.decryptArchive.unlocking") }) : t("import.decryptArchive.unlock")
				})]
			})
		]
	});
	if (phase === "conflicts" && step === "preview") {
		if (conflictCollector === null || imp.plan === null) return null;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.viewBody,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
					title: t("import.conflicts.title"),
					subtitle: t("import.conflicts.hint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConflictList, {
					collector: conflictCollector,
					t,
					onChanged: () => {
						if (imp.conflictCollector !== null) runStore.patch({ import: { conflictResolutions: imp.conflictCollector.toResolutions() } });
					}
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							setPhase("preview");
						},
						children: t("common.back")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: conflictCollector.hasUnresolved,
						onClick: finishConflicts,
						children: t("common.next")
					})]
				})
			]
		});
	}
	if (phase === "path-mapping" && step === "preview") {
		const issues = imp.analysis?.pathIssues ?? [];
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.viewBody,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
					title: t("import.paths.title"),
					subtitle: t("import.paths.hint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PathMappingForm, {
					issues,
					initial: pathMappings,
					t,
					onChange: (mappings) => {
						runStore.patch({ import: { pathMappings: mappings } });
					}
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							setPhase("preview");
						},
						children: t("common.back")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: finishPathMapping,
						children: t("common.next")
					})]
				})
			]
		});
	}
	if (phase === "secrets" && step === "preview") {
		const missing = (imp.plan?.missingSecrets ?? []).filter((s) => !decryptRefs.includes(s.ref));
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.viewBody,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, { title: t("import.secrets.title") }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SecretsForm, {
					missing,
					t,
					onChange: (inputs) => {
						runStore.patch({ import: { secretInputs: inputs } });
					}
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							setPhase("preview");
						},
						children: t("common.back")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: finishSecrets,
						children: t("common.next")
					})]
				})
			]
		});
	}
	if (phase === "confirm" && step === "preview") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
			className: config_manager_module_css_default.optionsCard,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
					kind: "info",
					children: t("import.confirm.warning")
				}),
				isEncrypted && decryptRefs.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
					kind: "ok",
					children: t("import.confirm.encrypted", { count: String(decryptRefs.length) })
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Checkbox, {
					checked: rollbackOnError,
					onChange: (v) => {
						wizard.setRollbackOnError(v);
						runStore.patch({ import: { rollbackOnError: v } });
					},
					label: t("import.rollbackOnError")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							setPhase("preview");
						},
						children: t("common.back")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: running,
						onClick: () => {
							execute();
						},
						children: t("import.confirm.execute")
					})]
				})
			]
		}), error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
			error,
			onRetry: () => {
				execute();
			},
			t: api.t
		})]
	});
	if (step === "importing") {
		const logLines = progress?.log ?? [];
		const currentItem = progress?.detail ?? "";
		const isPluginInstall = running && currentItem.startsWith("plugin:") && !imp.skipRequested;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.viewBody,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProgressBar, {
					event: progress,
					active: true
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImportLogPanel, {
					lines: logLines,
					t
				}),
				isPluginInstall && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.actionRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							skipCurrent();
						},
						children: t("import.skipCurrent")
					})
				}),
				imp.skipRequested && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					children: t("import.skipPending")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					children: t("import.importing")
				}),
				error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
					error,
					t: api.t
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorList, { errors: imp.errors })
			]
		});
	}
	if (step === "result") {
		const result = imp.result;
		if (result === null) return null;
		const retryable = wizard.retryableCount();
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.viewBody,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, { title: t("report.import.title") }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReportView, {
					kind: "import",
					importResult: result,
					onAction: (action) => {
						if (action === "done") resetWizard();
					}
				}),
				retryable > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.actionRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: running,
						onClick: () => {
							execute({ retry: true });
						},
						children: t("import.retrySkipped", { count: String(retryable) })
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(NextStepsCard, {
					plan: imp.plan,
					result,
					t
				}),
				error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
					error,
					t: api.t
				})
			]
		});
	}
	return null;
}
//#endregion
//#region src/client/common/ConfirmDialog.tsx
/**
* ConfirmDialog —— 确认弹窗（危险/重要操作的二次确认，DESIGN.md §8.11 / §14）。
*
* 背景（2026-08-20）：用户要求「删除按钮需要弹窗弹出二次确认」，替代原先的
* 「行内两步确认」（已从 DESIGN.md §14 移除，见 t8 设计）。本项目此前无任何
* modal / fixed / z-index 元素，本组件是首个浮动层 —— DESIGN.md §15 Anti-pattern #7
* 已登记豁免（z-index 100；浮动层必须先设计进 DESIGN.md 的流程满足）。
*
* 交互约定：
* - 受控组件：open=false 时不渲染；open=true 渲染遮罩 + 居中卡片；
* - 关闭三途径：遮罩点击（仅 e.target === currentTarget）、Esc 键、取消按钮；
*   （可选 backdropClose：遮罩点击 / Esc 走此回调而非 onCancel —— 用于「不再提示」类
*   弹窗，用户点遮罩只是暂时关闭、不算表态；缺省时三途径一致走 onCancel）；
* - busy=true（或 onConfirm 返回 Promise 的自管 busy）时禁用一切关闭途径与确认按钮，
*   防重复提交；
* - 初始焦点在取消按钮（危险确认不默认落破坏性按钮）；关闭后还原焦点到触发按钮
*   （open 前的 document.activeElement）；
* - 不做完整 focus trap（两按钮场景风险可接受，DESIGN.md §8.11 已注明）。
*
* 安全：message 由调用方传入（渲染前已 redact 兜底，与全站一致）；本组件不触碰任何凭据。
* 样式：全部走 --dsw-* token（遮罩 color-mix 半透明、卡片 bg-layer-2 + border-l1），
* 仅新增 dialogMask/dialogCard/dialogHeader/dialogBody 四个类（config-manager.module.css）。
*/
/**
* 确认弹窗：遮罩 + 居中卡片 + 标题/正文/按钮区。
* 自管 busy：onConfirm 返回 Promise 时置 busy 直到 resolve（reject 仍关闭 busy，错误由调用方处理）。
*/
function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel, danger, busy: busyProp, onConfirm, onCancel, backdropClose, children }) {
	const [selfBusy, setSelfBusy] = (0, react.useState)(false);
	const busy = busyProp === true || selfBusy;
	/** open 前的活动元素（关闭后还原焦点） */
	const prevFocus = (0, react.useRef)(null);
	/** 取消按钮 ref（初始焦点） */
	const cancelRef = (0, react.useRef)(null);
	/** 遮罩/Esc 关闭回调（缺省 = 取消按钮同一回调） */
	const handleBackdropClose = backdropClose ?? onCancel;
	(0, react.useEffect)(() => {
		if (open) {
			prevFocus.current = document.activeElement;
			requestAnimationFrame(() => {
				cancelRef.current?.focus();
			});
			return;
		}
		if (prevFocus.current !== null && prevFocus.current instanceof HTMLElement) {
			prevFocus.current.focus();
			prevFocus.current = null;
		}
	}, [open]);
	(0, react.useEffect)(() => {
		if (!open || busy) return;
		const close = backdropClose ?? onCancel;
		const onKey = (e) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKey);
		return () => {
			window.removeEventListener("keydown", onKey);
		};
	}, [
		open,
		busy,
		backdropClose,
		onCancel
	]);
	if (!open) return null;
	const handleConfirm = () => {
		if (busy) return;
		const result = onConfirm();
		if (result instanceof Promise) {
			setSelfBusy(true);
			result.finally(() => {
				setSelfBusy(false);
			});
		}
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: config_manager_module_css_default.dialogMask,
		onMouseDown: (e) => {
			if (e.target === e.currentTarget && !busy) handleBackdropClose();
		},
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.dialogCard,
			role: "dialog",
			"aria-modal": "true",
			"aria-label": title,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.dialogHeader,
					children: title
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.dialogBody,
					children: [message !== void 0 && message !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: message }), children]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: danger === true ? "danger" : "primary",
						disabled: busy,
						loading: busy,
						onClick: () => {
							handleConfirm();
						},
						children: busy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, {}) : confirmLabel ?? ""
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						ref: cancelRef,
						type: "button",
						className: config_manager_module_css_default.ghostButton,
						disabled: busy,
						"aria-busy": busy || void 0,
						onClick: onCancel,
						children: cancelLabel ?? ""
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/client/recovery/recovery-view.ts
/** 把 GET /recovery/status 映射为渲染模型。 */
function toRecoveryView(status) {
	const incidents = status.incidents.map((i) => ({
		operationId: i.operationId,
		operationType: i.operationType,
		state: i.state,
		decision: i.decision,
		snapshotId: i.snapshotId,
		reason: i.reason,
		createdAt: i.createdAt,
		actionable: i.decision !== "needs-attention" && i.snapshotId !== null && i.snapshotId !== "",
		isContinue: i.decision === "rollback-continue"
	}));
	const recoveryRequired = incidents.length > 0;
	let state = "NORMAL";
	if (recoveryRequired) {
		if (incidents.some((i) => i.state === "RECOVERING")) state = "RECOVERING";
		else if (incidents.some((i) => i.decision === "rollback-continue")) state = "ROLLBACK_CONTINUE";
		else if (incidents.some((i) => i.decision === "rollback-recommended")) state = "ROLLBACK_RECOMMENDED";
		else state = "NEEDS_ATTENTION";
	}
	return {
		state,
		recoveryRequired,
		incidents,
		running: status.running
	};
}
/** 把 GET /recovery/:operationId/preview 映射为渲染模型。 */
function toRecoveryPreviewView(p) {
	return {
		operationId: p.operationId,
		operationType: p.operationType,
		state: p.state,
		decision: p.decision,
		snapshotId: p.snapshotId,
		snapshotVerdict: p.snapshotVerdict,
		snapshotMeta: p.snapshotMeta,
		environmentCompatible: p.environmentCompatible,
		reason: p.reason,
		createdAt: p.createdAt,
		actionable: p.decision !== "needs-attention" && p.snapshotId !== null && p.snapshotId !== ""
	};
}
/** verdict → 是否 terminal 成功（MATCH / PARTIAL_MATCH）。 */
function isVerdictSuccess(verdict) {
	return verdict === "MATCH" || verdict === "PARTIAL_MATCH";
}
/** verdict → 是否需人工处理（MISMATCH / VERIFICATION_ERROR）。 */
function isVerdictAttention(verdict) {
	return verdict === "MISMATCH" || verdict === "VERIFICATION_ERROR";
}
/** snapshot verdict → 是否可信（可作 recovery 目标）。 */
function isSnapshotTrusted(verdict) {
	return verdict === "TRUSTED_OPERATION_SNAPSHOT";
}
//#endregion
//#region src/client/recovery/RecoveryPanel.tsx
/**
* Recovery 面板（Phase 5 §10.2）：引导式恢复工作流。
*
* 数据流：recoveryApi.status() 加载未解决 incident → 选择 incident → preview（只读）
* → 显式确认（ConfirmDialog，danger）→ execute（NEEDS_ATTENTION → RECOVERING）
* → verify（post-recovery verification）→ 最终状态（MATCH/PARTIAL_MATCH → 完成；
* MISMATCH/VERIFICATION_ERROR → 需人工处理，可 retry / dismiss）。
*
* 状态组件内自持（useState），同时经 toRecoveryStoreSlice() 镜像进模块级 runStore：
* 模块级单例保证「切 tab 不丢」，sessionStorage 白名单保证「刷新恢复」。
* running 为「内存切片瞬态」：切 tab 由模块级单例保留、刷新时被 toPersistedState
* 白名单剔除 —— 恢复是否仍在执行以宿主 RunRegistry（/runs + /progress）为权威，
* 刷新后经 resume() 重新发现；浏览器持久化绝不作为 destructive operation 的状态源。
*
* UI HARD RULES（§10.4）：绝不自动 execute/rollback、绝不隐藏确认、绝不把
* PARTIAL_MATCH 显示为完全成功、绝不把 NEEDS_ATTENTION 显示为 recovered、
* 绝不在 snapshot 不可信时显示可恢复。流程 = 发生了什么 → 使用哪个 snapshot →
* 将执行什么 → 用户确认 → 执行 → 验证 → 最终状态。
*/
const initial$5 = {
	status: "loading",
	error: null,
	recovery: null,
	selectedOperationId: null,
	preview: null,
	previewLoading: false,
	verifyResult: null,
	running: false,
	actionError: null
};
/** 从 runStore 恢复上次的 recovery 面板状态（切 tab 回 / 刷新后挂载）。 */
function initFromStore$4() {
	const s = runStore.getSnapshot().recovery;
	return {
		...initial$5,
		recovery: s.status,
		selectedOperationId: s.selectedOperationId,
		preview: s.preview,
		verifyResult: s.verifyResult,
		running: s.running,
		error: s.error,
		actionError: s.actionError
	};
}
/** PanelState → RecoveryStoreSlice（镜像进 runStore；status 字段语义不同，需显式映射）。 */
function toSlice(s) {
	return {
		status: s.recovery,
		selectedOperationId: s.selectedOperationId,
		preview: s.preview,
		verifyResult: s.verifyResult,
		running: s.running,
		error: s.error,
		actionError: s.actionError
	};
}
/** decision → 徽章语义。 */
function decisionBadgeKind(decision) {
	switch (decision) {
		case "rollback-recommended": return "warn";
		case "rollback-continue": return "warn";
		case "needs-attention": return "error";
		default: return "info";
	}
}
/** decision → 文案键。 */
function decisionLabel(t, decision) {
	switch (decision) {
		case "rollback-recommended": return t("recovery.rollbackRecommended");
		case "rollback-continue": return t("recovery.rollbackContinue");
		case "needs-attention": return t("recovery.needsAttention");
		default: return t("recovery.decision.unknown");
	}
}
/** verdict → 文案键。 */
function verdictLabel(t, verdict) {
	switch (verdict) {
		case "MATCH": return t("recovery.verified");
		case "PARTIAL_MATCH": return t("recovery.partialMatch");
		case "MISMATCH": return t("recovery.mismatch");
		case "VERIFICATION_ERROR": return t("recovery.verificationError");
		default: return t("recovery.verify.verdict.unknown");
	}
}
/** verdict → 徽章语义。 */
function verdictBadgeKind(verdict) {
	switch (verdict) {
		case "MATCH": return "ok";
		case "PARTIAL_MATCH": return "warn";
		case "MISMATCH": return "error";
		case "VERIFICATION_ERROR": return "error";
		default: return "info";
	}
}
/** snapshot verdict → 文案键。 */
function snapshotVerdictLabel(t, verdict) {
	switch (verdict) {
		case "TRUSTED_OPERATION_SNAPSHOT": return t("recovery.snapshot.verdict.trusted");
		case "TRUSTED_MANUAL_LOCAL": return t("recovery.snapshot.verdict.manual");
		case "LEGACY_REQUIRES_CONFIRMATION": return t("recovery.snapshot.verdict.legacy");
		case "WRONG_ENVIRONMENT": return t("recovery.snapshot.verdict.wrongEnv");
		case "CORRUPT": return t("recovery.snapshot.verdict.corrupt");
		case "INVALID": return t("recovery.snapshot.verdict.invalid");
		case "UNSAFE_PATH": return t("recovery.snapshot.verdict.unsafe");
		default: return t("recovery.snapshot.verdict.unknown");
	}
}
/** incident 原始状态值 → 用户可懂的中文标签（未知名回退 unknown，绝不透出英文原文）。 */
function incidentStateLabel(t, state) {
	switch (state) {
		case "RECOVERING": return t("recovery.incident.state.recovering");
		case "NEEDS_ATTENTION": return t("recovery.incident.state.needsAttention");
		case "ROLLED_BACK": return t("recovery.incident.state.rolledBack");
		case "RECOVERED": return t("recovery.incident.state.recovered");
		case "COMMITTED": return t("recovery.incident.state.committed");
		default: return t("recovery.incident.state.unknown");
	}
}
function RecoveryPanel({ recoveryApi, t }) {
	const [state, setState] = (0, react.useState)(initFromStore$4);
	const stateRef = (0, react.useRef)(state);
	const mountedRef = (0, react.useRef)(true);
	/** 预览请求代数：快速切换 incident 时作废在途旧请求（防晚到响应覆盖新选择） */
	const previewGeneration = (0, react.useRef)(0);
	/** 执行恢复的二次确认弹窗开关（危险操作） */
	const [confirmOpen, setConfirmOpen] = (0, react.useState)(false);
	/** 放弃恢复（dismiss）确认弹窗开关 */
	const [dismissOpen, setDismissOpen] = (0, react.useState)(false);
	/** 重试确认弹窗开关 */
	const [retryOpen, setRetryOpen] = (0, react.useState)(false);
	/** 统一提交入口：更新 stateRef → 挂载时 setState → **总是**镜像进 runStore。 */
	const commit = (next) => {
		stateRef.current = next;
		if (mountedRef.current) setState(next);
		runStore.patch({ recovery: toSlice(next) });
	};
	const patch = (p) => commit({
		...stateRef.current,
		...p
	});
	/** 卸载时置挂载守卫 + 最后镜像一次。 */
	(0, react.useEffect)(() => () => {
		mountedRef.current = false;
		runStore.patch({ recovery: toSlice(stateRef.current) });
	}, []);
	const load = () => {
		patch({
			status: "loading",
			error: null
		});
		recoveryApi.status().then((recovery) => {
			patch({
				status: "ready",
				recovery
			});
		}, (err) => {
			patch({
				status: "error",
				error: err instanceof Error ? err.message : String(err)
			});
		});
	};
	(0, react.useEffect)(load, [recoveryApi]);
	/** 选择 incident → 加载只读 preview。 */
	const select = (operationId) => {
		const generation = previewGeneration.current + 1;
		previewGeneration.current = generation;
		patch({
			selectedOperationId: operationId,
			preview: null,
			previewLoading: true,
			verifyResult: null,
			actionError: null
		});
		recoveryApi.preview(operationId).then((preview) => {
			if (generation !== previewGeneration.current) return;
			patch({
				previewLoading: false,
				preview
			});
		}, (err) => {
			if (generation !== previewGeneration.current) return;
			patch({
				previewLoading: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
		});
	};
	/** 执行恢复（confirm 弹窗确认后）。 */
	const execute = () => {
		const operationId = state.selectedOperationId;
		if (operationId === null || state.running) return;
		patch({
			running: true,
			actionError: null,
			verifyResult: null
		});
		setConfirmOpen(false);
		runStore.watchRunning("recovery", 500);
		recoveryApi.execute(operationId, true).then(() => {
			return recoveryApi.verify(operationId);
		}, (err) => {
			patch({
				running: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
			runStore.stopRunWatch("recovery");
			return null;
		}).then((verifyResult) => {
			if (verifyResult === null) return;
			patch({
				running: false,
				verifyResult
			});
			runStore.stopRunWatch("recovery");
			recoveryApi.status().then((recovery) => {
				patch({
					status: "ready",
					recovery
				});
			}, () => {});
		});
	};
	/** 重试（验证失败后；再次确认）。 */
	const retry = () => {
		const operationId = state.selectedOperationId;
		if (operationId === null || state.running) return;
		patch({
			running: true,
			actionError: null,
			verifyResult: null
		});
		setRetryOpen(false);
		runStore.watchRunning("recovery", 500);
		recoveryApi.retry(operationId, true).then(() => recoveryApi.verify(operationId), (err) => {
			patch({
				running: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
			runStore.stopRunWatch("recovery");
			return null;
		}).then((verifyResult) => {
			if (verifyResult === null) return;
			patch({
				running: false,
				verifyResult
			});
			runStore.stopRunWatch("recovery");
			recoveryApi.status().then((recovery) => {
				patch({
					status: "ready",
					recovery
				});
			}, () => {});
		});
	};
	/** 放弃恢复（dismiss；quarantine，不销毁证据）。 */
	const dismiss = () => {
		const operationId = state.selectedOperationId;
		if (operationId === null || state.running) return;
		patch({
			running: true,
			actionError: null
		});
		setDismissOpen(false);
		recoveryApi.dismiss(operationId, true).then(() => {
			patch({
				running: false,
				selectedOperationId: null,
				preview: null,
				verifyResult: null
			});
			load();
		}, (err) => {
			patch({
				running: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
		});
	};
	const view = state.recovery !== null ? toRecoveryView(state.recovery) : null;
	const selected = state.selectedOperationId !== null && state.recovery !== null ? state.recovery.incidents.find((i) => i.operationId === state.selectedOperationId) : void 0;
	const previewView = state.preview !== null ? toRecoveryPreviewView(state.preview) : null;
	view?.state;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("view.recovery"),
				subtitle: t("recovery.requiredHint")
			}),
			view?.recoveryRequired === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "error",
				children: t("recovery.currentState.safeMode")
			}),
			view?.recoveryRequired === false && state.status === "ready" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "ok",
				children: t("recovery.currentState.safeModeCleared")
			}),
			state.status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("recovery.loading") }),
			state.status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
				kind: "error",
				children: [state.error ?? t("common.unknownError"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: load,
					children: t("common.retry")
				})]
			}),
			state.status === "ready" && (view?.incidents.length ?? 0) === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("recovery.empty") }),
			state.status === "ready" && (view?.incidents.length ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				(view?.running.length ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
					kind: "info",
					children: t("recovery.runningHint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
					className: config_manager_module_css_default.card,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.groupLabel,
						children: t("recovery.incident.title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.snapshotList,
						role: "listbox",
						"aria-label": t("recovery.incident.title"),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.snapshotRowHeader,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("recovery.incident.operationType") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("recovery.incident.createdAt") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("recovery.incident.decision") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("recovery.incident.state") })
							]
						}), view.incidents.map((incident) => {
							const selectedRow = incident.operationId === state.selectedOperationId;
							return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.snapshotRow,
								role: "option",
								"aria-selected": selectedRow,
								"data-active": selectedRow ? "" : void 0,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: config_manager_module_css_default.snapshotRowMain,
									disabled: state.running,
									onClick: () => {
										select(incident.operationId);
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											title: incident.operationId,
											children: incident.operationType
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: new Date(incident.createdAt).toLocaleString() }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: decisionBadgeKind(incident.decision),
											children: decisionLabel(t, incident.decision)
										}) }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: incidentStateLabel(t, incident.state) })
									]
								})
							}, incident.operationId);
						})]
					})]
				}),
				selected !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
					className: config_manager_module_css_default.card,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.groupLabel,
							children: [
								t("recovery.incident.operationId"),
								": ",
								selected.operationId
							]
						}),
						selected.reason !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.hint,
							children: [
								t("recovery.incident.reason"),
								": ",
								selected.reason
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: config_manager_module_css_default.groupLabel,
							children: t("recovery.snapshot.title")
						}),
						selected.snapshotId !== null && selected.snapshotId !== "" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.statRow,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
								kind: "info",
								children: t("recovery.currentState.hasSnapshot")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.hint,
								title: selected.snapshotId,
								children: selected.snapshotId
							})]
						}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: config_manager_module_css_default.statRow,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
								kind: "error",
								children: t("recovery.currentState.noSnapshot")
							})
						}),
						previewView !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.statRow,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.groupLabel,
								children: t("recovery.environment.title")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
								kind: previewView.environmentCompatible ? "ok" : "error",
								children: previewView.environmentCompatible ? t("recovery.environment.compatible") : t("recovery.environment.incompatible")
							})]
						}),
						state.previewLoading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("recovery.preview.loading") }),
						previewView !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.groupLabel,
								children: t("recovery.preview.title")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.hint,
								children: t("recovery.preview.hint")
							}),
							previewView.snapshotVerdict !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.statRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.hint,
									children: t("recovery.snapshot.verdict")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: isSnapshotTrusted(previewView.snapshotVerdict) ? "ok" : "warn",
									children: snapshotVerdictLabel(t, previewView.snapshotVerdict)
								})]
							}),
							previewView.snapshotMeta !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.hint,
								children: [
									t("recovery.snapshot.createdAt"),
									": ",
									new Date(previewView.snapshotMeta.createdAt).toLocaleString()
								]
							})
						] }),
						state.verifyResult !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.groupLabel,
								children: t("recovery.verify.title")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.statRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: verdictBadgeKind(state.verifyResult.verdict),
									children: verdictLabel(t, state.verifyResult.verdict)
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.hint,
									children: t(`recovery.verify.terminal.${state.verifyResult.terminal === "ROLLED_BACK" ? "rolledBack" : state.verifyResult.terminal === "RECOVERED" ? "recovered" : "needsAttention"}`)
								})]
							}),
							state.verifyResult.details.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.reportScroll,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
									className: config_manager_module_css_default.reportList,
									children: state.verifyResult.details.map((d, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: d }, `detail-${i}`))
								})
							}),
							state.verifyResult.manualHints.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
								kind: "warn",
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("recovery.verify.manualHints") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
									className: config_manager_module_css_default.reportList,
									children: state.verifyResult.manualHints.map((h, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: h }, `hint-${i}`))
								})]
							})
						] }),
						state.actionError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
							kind: "error",
							children: state.actionError
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.actionRow,
							children: [
								state.verifyResult === null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "danger",
									disabled: state.running || !(previewView?.actionable ?? false),
									onClick: () => {
										setConfirmOpen(true);
									},
									children: state.running ? t("recovery.executing") : t("recovery.execute")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									disabled: state.running,
									onClick: () => {
										setDismissOpen(true);
									},
									children: t("recovery.dismiss")
								})] }),
								state.verifyResult !== null && isVerdictAttention(state.verifyResult.verdict) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "danger",
									disabled: state.running,
									onClick: () => {
										setRetryOpen(true);
									},
									children: t("recovery.retry")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									disabled: state.running,
									onClick: () => {
										setDismissOpen(true);
									},
									children: t("recovery.dismiss")
								})] }),
								state.verifyResult !== null && isVerdictSuccess(state.verifyResult.verdict) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
									kind: "ok",
									children: t("recovery.completed")
								})
							]
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmOpen,
				title: t("recovery.confirm.title"),
				message: selected?.decision === "rollback-continue" ? t("recovery.confirm.rollbackContinue") : t("recovery.confirm.message"),
				confirmLabel: t("recovery.execute"),
				cancelLabel: t("common.cancel"),
				danger: true,
				busy: state.running,
				onConfirm: execute,
				onCancel: () => {
					setConfirmOpen(false);
				}
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: retryOpen,
				title: t("recovery.confirm.title"),
				message: t("recovery.confirm.retry"),
				confirmLabel: t("recovery.retry"),
				cancelLabel: t("common.cancel"),
				danger: true,
				busy: state.running,
				onConfirm: retry,
				onCancel: () => {
					setRetryOpen(false);
				}
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: dismissOpen,
				title: t("recovery.confirm.dismissTitle"),
				message: t("recovery.confirm.dismiss"),
				confirmLabel: t("recovery.dismiss"),
				cancelLabel: t("common.cancel"),
				danger: true,
				busy: state.running,
				onConfirm: dismiss,
				onCancel: () => {
					setDismissOpen(false);
				}
			})
		]
	});
}
//#endregion
//#region src/ui/backup-inspect.ts
/** 从分析 + 计划构建分区清单（sectionsInZip ↔ estimatedActions 对齐）。 */
function inspectSections(analysis, plan) {
	return analysis.sectionsInZip.map((section) => ({
		section,
		count: plan.estimatedActions[section] ?? 0
	}));
}
/** 从计划构建差异摘要（与导入预览统计口径一致）。 */
function inspectSummary(analysis, plan) {
	const items = plan.items;
	const kind = (kinds) => items.filter((i) => kinds.includes(i.kind)).length;
	return {
		willChange: kind([
			"Create",
			"Update",
			"Install",
			"Conflict"
		]),
		unchanged: kind(["Skip"]),
		conflicts: kind(["Conflict"]),
		secretsNeeded: plan.missingSecrets.length,
		pathMappingsNeeded: analysis.pathIssues.length,
		needsRestart: plan.needsRestart,
		changes: [...items]
	};
}
/** 判断 PlanItem 是否属于「变更」组（Create/Update/Install —— 将实际写入的项）。 */
function isChangeKind(kind) {
	return kind === "Create" || kind === "Update" || kind === "Install";
}
/**
* 把逐项变更列表按用户视角分组并排序（纯函数，接受任意 PlanItem 数组——
* 备份 diff、配置档案切换预览共用同一分组语义）：
* 冲突（需决策，error）→ 变更（将写入，info）→ 路径映射（需处理，warn）
* → 一致跳过（无需处理，ok）→ 其余（MissingSecret/MissingDependency/
* Warning/Error 等，warn）。空组不返回；非冲突类条目全部保留（不丢信息）。
*/
function groupPlanItems(items) {
	const by = (pred) => items.filter(pred);
	const groups = [];
	const conflicts = by((i) => i.kind === "Conflict");
	if (conflicts.length > 0) groups.push({
		key: "conflicts",
		kind: "error",
		items: conflicts
	});
	const changes = by((i) => isChangeKind(i.kind));
	if (changes.length > 0) groups.push({
		key: "changes",
		kind: "info",
		items: changes
	});
	const paths = by((i) => i.kind === "PathMapping");
	if (paths.length > 0) groups.push({
		key: "paths",
		kind: "warn",
		items: paths
	});
	const skipped = by((i) => i.kind === "Skip");
	if (skipped.length > 0) groups.push({
		key: "skipped",
		kind: "ok",
		items: skipped
	});
	const others = items.filter((i) => i.kind !== "Conflict" && !isChangeKind(i.kind) && i.kind !== "PathMapping" && i.kind !== "Skip");
	if (others.length > 0) groups.push({
		key: "others",
		kind: "warn",
		items: others
	});
	return groups;
}
/** 备份 diff 分组入口：从差异摘要取 changes 数组分组（与配置档案预览共用语义）。 */
function inspectGroupedChanges(summary) {
	return groupPlanItems(summary.changes);
}
//#endregion
//#region src/ui/backup-schedule.ts
/** 可选的间隔档位（UI 展示顺序 = 由短到长）。 */
const BACKUP_INTERVAL_OPTIONS = [
	"6h",
	"12h",
	"24h",
	"7d",
	"custom"
];
/** 每周星期选项（0-6 → 展示文案由 locale 提供；本层只给值域） */
const WEEKDAY_OPTIONS = [
	{
		value: 0,
		label: "sunday"
	},
	{
		value: 1,
		label: "monday"
	},
	{
		value: 2,
		label: "tuesday"
	},
	{
		value: 3,
		label: "wednesday"
	},
	{
		value: 4,
		label: "thursday"
	},
	{
		value: 5,
		label: "friday"
	},
	{
		value: 6,
		label: "saturday"
	}
];
/** 校验设置输入（host 侧保存路由与组件提交共用；接受 unknown 防御畸形/空 body）。 */
function validateBackupScheduleDraft(draft) {
	if (draft === null || typeof draft !== "object" || Array.isArray(draft)) return {
		ok: false,
		error: "body must be an object with enabled (boolean) and interval"
	};
	const d = draft;
	if (typeof d["enabled"] !== "boolean") return {
		ok: false,
		error: "enabled must be a boolean"
	};
	if (!BACKUP_INTERVAL_OPTIONS.includes(d["interval"])) return {
		ok: false,
		error: "interval must be one of 6h/12h/24h/7d/custom"
	};
	const interval = d["interval"];
	const value = {
		enabled: d["enabled"],
		interval
	};
	if (interval === "custom") {
		const weekly = typeof d["customSchedule"] === "object" && d["customSchedule"] !== null && !Array.isArray(d["customSchedule"]) ? d["customSchedule"] : void 0;
		const dayOfWeek = weekly?.["dayOfWeek"];
		const hour = weekly?.["hour"];
		const minute = weekly?.["minute"];
		if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6 || !Number.isInteger(hour) || hour < 0 || hour > 23 || !Number.isInteger(minute) || minute < 0 || minute > 59) return {
			ok: false,
			error: "customSchedule must include dayOfWeek (0-6), hour (0-23), minute (0-59)"
		};
		value.customSchedule = {
			dayOfWeek,
			hour,
			minute
		};
	}
	return {
		ok: true,
		value
	};
}
/** 上次运行状态 → Badge kind（success→ok / skipped→info / failed→error / 未知→info）。 */
function backupRunBadgeKind(status) {
	switch (status) {
		case "success": return "ok";
		case "failed": return "error";
		case "skipped": return "info";
		default: return "info";
	}
}
/** 判断草稿相对已保存配置是否有未保存修改（决定「保存设置」按钮可用性）。 */
function backupDraftDirty(draft, saved) {
	if (saved === null) return true;
	if (draft.enabled !== saved.enabled || draft.interval !== saved.interval) return true;
	if (draft.interval === "custom") {
		const a = draft.customSchedule;
		const b = saved.customSchedule;
		if (a === void 0 || b === void 0) return a !== b;
		return a.dayOfWeek !== b.dayOfWeek || a.hour !== b.hour || a.minute !== b.minute;
	}
	return false;
}
const initial$4 = {
	status: "loading",
	error: null,
	metas: [],
	selectedId: null,
	planning: false,
	plan: null,
	running: false,
	report: null,
	actionError: null
};
function statusLabel(t, status) {
	switch (status) {
		case "pending": return t("snapshots.status.pending");
		case "done": return t("snapshots.status.done");
		case "rolled-back": return t("snapshots.status.rolled-back");
		default: return t("snapshots.status.unknown");
	}
}
function statusBadgeKind(status) {
	switch (status) {
		case "pending": return "info";
		case "done": return "ok";
		case "rolled-back": return "warn";
		default: return "error";
	}
}
/** 计划动作的本地化描述前缀（kind 标签 → 字典；未知名回退 unknown，不透出英文原文） */
function actionKindLabel(t, kind) {
	switch (kind) {
		case "hostFileRestore": return t("snapshots.kind.hostFileRestore");
		case "hostFileRemove": return t("snapshots.kind.hostFileRemove");
		case "pluginRemove": return t("snapshots.kind.pluginRemove");
		case "fileRestore": return t("snapshots.kind.fileRestore");
		case "fileRemove": return t("snapshots.kind.fileRemove");
		case "credentialHint": return t("snapshots.kind.credentialHint");
		case "skip": return t("snapshots.kind.skip");
		default: return t("snapshots.kind.unknown");
	}
}
/**
* 从 runStore 恢复上次的快照面板状态（切 tab 回 / 刷新后挂载）。
* 无敏感字段；plan/report 为纯数据，可安全序列化恢复。
* running 来自 store 镜像（刷新后经 runStore.resume() 以宿主 /runs 为权威重新置位——
* 持久化白名单恒为 false，绝不把浏览器陈旧状态当成恢复执行中的依据）。
*/
function initFromStore$3() {
	const s = runStore.getSnapshot().snapshots;
	return {
		...initial$4,
		selectedId: s.selectedId,
		running: s.running,
		plan: s.plan,
		report: s.report,
		actionError: s.actionError,
		error: s.error
	};
}
function SnapshotsPanel({ api, t, recoveryApi, recoveryT }) {
	const [state, setState] = (0, react.useState)(initFromStore$3);
	/** 最新 state 镜像（commit/卸载 flush 读取，避免闭包过期值） */
	const stateRef = (0, react.useRef)(state);
	/** 挂载守卫：卸载后不再 setState（store 镜像仍执行，异步结果照常落库） */
	const mountedRef = (0, react.useRef)(true);
	/** dry-run 计划请求代数：快速切换快照时作废在途旧请求（防晚到响应覆盖新选择） */
	const planGeneration = (0, react.useRef)(0);
	/** 执行恢复的二次确认弹窗开关（危险操作，DESIGN.md §8.11 场景） */
	const [confirmOpen, setConfirmOpen] = (0, react.useState)(false);
	/** P1-⑧：手动删除快照确认目标（null = 无） */
	const [deleteTarget, setDeleteTarget] = (0, react.useState)(null);
	/** P1-⑧：删除/置顶请求进行中（防重复提交） */
	const [managing, setManaging] = (0, react.useState)(false);
	/** 恢复计划预览弹窗开关（瞬态 UI，不持久化：弹窗即会话，关闭即放弃展示；
	*  plan 仍镜像 runStore，切 tab/刷新恢复后可再次打开） */
	const [planOpen, setPlanOpen] = (0, react.useState)(false);
	/** Phase 7 迁移前咨询：恢复计划弹窗内的咨询报告（本地 state，非敏感） */
	const [consultReport, setConsultReport] = (0, react.useState)(null);
	const [consultLoading, setConsultLoading] = (0, react.useState)(false);
	/** 备份文件列表刷新信号：BackupScheduleCard「立即备份」完成后递增触发重载 */
	const [backupFilesTick, setBackupFilesTick] = (0, react.useState)(0);
	/** 二级 tab（备份文件 / 快照恢复）：初始从 store 恢复，切换镜像 runStore（切一级 tab/刷新不丢） */
	const [subTab, setSubTab] = (0, react.useState)(() => runStore.getSnapshot().snapshots.subTab ?? "restore");
	const switchSubTab = (next) => {
		setSubTab(next);
		runStore.patch({ snapshots: { subTab: next } });
	};
	/**
	* 统一提交入口：更新 stateRef → 挂载时 setState → **总是**镜像进 runStore。
	* 关键：镜像不依赖 effect flush —— 异步操作（dry-run 计划/执行恢复）完成回调
	* 在组件已卸载（切走 tab）时也能把结果（plan/report）写进 store，切回恢复。
	* backupDraft 由 BackupScheduleCard 独立管理，此处从 store 读回原值避免覆盖。
	*/
	const commit = (next) => {
		stateRef.current = next;
		if (mountedRef.current) setState(next);
		const store = runStore.getSnapshot().snapshots;
		runStore.patch({ snapshots: toSnapshotsStoreSlice({
			...next,
			backupDraft: store.backupDraft,
			importBackup: store.importBackup,
			subTab: store.subTab
		}) });
	};
	const patch = (p) => commit({
		...stateRef.current,
		...p
	});
	/** 卸载时置挂载守卫 + 最后镜像一次（防止「最后一次改动后立即切 tab」时丢状态）。 */
	(0, react.useEffect)(() => () => {
		mountedRef.current = false;
		const store = runStore.getSnapshot().snapshots;
		runStore.patch({ snapshots: toSnapshotsStoreSlice({
			...stateRef.current,
			backupDraft: store.backupDraft,
			importBackup: store.importBackup,
			subTab: store.subTab
		}) });
	}, []);
	const load = () => {
		patch({
			status: "loading",
			error: null
		});
		api.snapshots().then((metas) => {
			patch({
				status: "ready",
				metas
			});
		}, (err) => {
			patch({
				status: "error",
				error: err instanceof Error ? err.message : String(err)
			});
		});
	};
	(0, react.useEffect)(load, [api]);
	/** Phase 7 迁移前咨询：恢复计划弹窗打开时对选中快照生成咨询报告（只读，零写入）。
	*  失败静默（咨询是建议性，不阻断恢复）。 */
	(0, react.useEffect)(() => {
		if (!planOpen || state.selectedId === null) return;
		let cancelled = false;
		setConsultLoading(true);
		api.consult({
			type: "local-snapshot",
			id: state.selectedId,
			snapshotId: state.selectedId
		}).then((report) => {
			if (!cancelled) setConsultReport(report);
		}).catch(() => {
			if (!cancelled) setConsultReport(null);
		}).finally(() => {
			if (!cancelled) setConsultLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [
		planOpen,
		state.selectedId,
		api
	]);
	const select = (id) => {
		const generation = planGeneration.current + 1;
		planGeneration.current = generation;
		if (id === state.selectedId && state.plan !== null) {
			setPlanOpen(true);
			return;
		}
		patch({
			selectedId: id,
			plan: null,
			report: null,
			actionError: null,
			planning: true
		});
		setPlanOpen(true);
		api.restoreSnapshot(id, true).then((res) => {
			if (generation !== planGeneration.current) return;
			patch({
				planning: false,
				plan: res.plan ?? null
			});
		}, (err) => {
			if (generation !== planGeneration.current) return;
			patch({
				planning: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
		});
	};
	const execute = () => {
		if (state.selectedId === null || state.running) return;
		patch({
			running: true,
			report: null,
			actionError: null
		});
		setConfirmOpen(false);
		runStore.watchRunning("restore", 500);
		api.restoreSnapshot(state.selectedId, false).then((res) => {
			patch({
				running: false,
				report: res.report ?? null
			});
		}, (err) => {
			patch({
				running: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
		}).finally(() => {
			runStore.stopRunWatch("restore");
		});
	};
	/** 从预览弹窗点「执行恢复」：关闭预览弹窗 + 打开二次确认弹窗（危险操作）。 */
	const requestExecute = () => {
		if (state.running || state.plan === null) return;
		setPlanOpen(false);
		setConfirmOpen(true);
	};
	const summary = () => {
		const s = state.plan?.summary;
		if (s === void 0) return "";
		return t("snapshots.summary", {
			hostFileRestores: String(s.hostFileRestores),
			hostFileRemoves: String(s.hostFileRemoves),
			pluginRemoves: String(s.pluginRemoves),
			fileRestores: String(s.fileRestores),
			fileRemoves: String(s.fileRemoves),
			credentialHints: String(s.credentialHints),
			skips: String(s.skips)
		});
	};
	/** P1-⑧：置顶/取消置顶（豁免自动保留清理；操作成功后刷新列表）。 */
	const togglePin = (meta) => {
		if (managing) return;
		setManaging(true);
		api.setSnapshotPinned(meta.id, !meta.pinned).then(() => {
			setManaging(false);
			load();
		}, (err) => {
			setManaging(false);
			patch({ actionError: err instanceof Error ? err.message : String(err) });
		});
	};
	/** P1-⑧：确认删除单个快照（危险操作：该回滚点不可恢复）。 */
	const doDeleteSnapshot = () => {
		const target = deleteTarget;
		if (target === null || managing) return;
		setManaging(true);
		api.deleteSnapshot(target.id).then((res) => {
			setManaging(false);
			setDeleteTarget(null);
			patch({ actionError: null });
			if (state.selectedId === target.id) patch({
				selectedId: null,
				plan: null,
				report: null
			});
			load();
		}, (err) => {
			setManaging(false);
			setDeleteTarget(null);
			patch({ actionError: err instanceof Error ? err.message : String(err) });
		});
	};
	const reportLine = (title, items, warn) => {
		if (items.length === 0) return null;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
			className: config_manager_module_css_default.card,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("strong", {
				className: warn ? config_manager_module_css_default.warnText : void 0,
				children: [
					title,
					"（",
					items.length,
					"）"
				]
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.reportScroll,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: config_manager_module_css_default.reportList,
					children: items.map((item, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: item }, `${title}-${i}`))
				})
			})]
		});
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("snapshots.title"),
				subtitle: t("snapshots.hint")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.modeTabs,
				role: "tablist",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": subTab === "restore",
						"data-active": subTab === "restore" ? "" : void 0,
						className: config_manager_module_css_default.modeTab,
						onClick: () => {
							switchSubTab("restore");
						},
						children: t("snapshots.subTab.restore")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": subTab === "files",
						"data-active": subTab === "files" ? "" : void 0,
						className: config_manager_module_css_default.modeTab,
						onClick: () => {
							switchSubTab("files");
						},
						children: t("snapshots.subTab.files")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": subTab === "recovery",
						"data-active": subTab === "recovery" ? "" : void 0,
						className: config_manager_module_css_default.modeTab,
						onClick: () => {
							switchSubTab("recovery");
						},
						children: t("snapshots.subTab.recovery")
					})
				]
			}),
			subTab === "recovery" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(RecoveryPanel, {
				recoveryApi,
				t: recoveryT
			}) : subTab === "restore" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				state.status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("snapshots.loading") }),
				state.status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
					kind: "error",
					children: [state.error ?? t("common.unknownError"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: load,
						children: t("common.retry")
					})]
				}),
				state.status === "ready" && state.metas.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("snapshots.empty") }),
				state.status === "ready" && state.metas.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.hint,
						children: t("snapshots.retentionHint", { count: String(10) })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.snapshotList,
						role: "listbox",
						"aria-label": t("snapshots.selectHint"),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.snapshotRowHeader,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("snapshots.createdAt") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("snapshots.sourceZip") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("snapshots.status") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("snapshots.entries") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("snapshots.plugins") }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("snapshots.actions") })
							]
						}), state.metas.map((meta) => {
							const selected = meta.id === state.selectedId;
							return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.snapshotRow,
								role: "option",
								"aria-selected": selected,
								"data-active": selected ? "" : void 0,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
									type: "button",
									className: config_manager_module_css_default.snapshotRowMain,
									disabled: state.planning || state.running,
									onClick: () => {
										select(meta.id);
									},
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											title: meta.id,
											children: [meta.pinned === true && "📌 ", new Date(meta.createdAt).toLocaleString()]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											title: meta.sourceZip,
											children: meta.sourceZip
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: statusBadgeKind(meta.status),
											children: statusLabel(t, meta.status)
										}) }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: meta.entryCount }),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: meta.beforePluginCount })
									]
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
									className: config_manager_module_css_default.actionRow,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										disabled: managing,
										onClick: () => {
											togglePin(meta);
										},
										children: meta.pinned === true ? t("snapshots.unpin") : t("snapshots.pin")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										variant: "danger",
										disabled: managing,
										onClick: () => {
											setDeleteTarget({
												id: meta.id,
												createdAt: meta.createdAt
											});
										},
										children: t("snapshots.delete")
									})]
								})]
							}, meta.id);
						})]
					}),
					state.selectedId !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [state.planning && !planOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("common.loading") }), state.plan !== null && !planOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.actionRow,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							onClick: () => {
								setPlanOpen(true);
							},
							children: t("snapshots.viewPlan")
						})
					})] }),
					state.report !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, { title: t("snapshots.reportTitle") }),
						reportLine(t("snapshots.restored"), state.report.restored, false),
						reportLine(t("snapshots.removedPlugins"), state.report.removedPlugins, false),
						reportLine(t("snapshots.manualHints"), state.report.manualHints, true),
						reportLine(t("snapshots.failed"), state.report.failed.map((f) => `${f.item}: ${f.reason}`), true),
						reportLine(t("snapshots.skipped"), state.report.skipped, false)
					] })
				] }),
				planOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.dialogMask,
					onMouseDown: (e) => {
						if (e.target === e.currentTarget && !state.running) setPlanOpen(false);
					},
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
						role: "dialog",
						"aria-modal": "true",
						"aria-label": t("snapshots.planTitle"),
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.dialogHeaderRow,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.dialogHeader,
								children: t("snapshots.planTitle")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: config_manager_module_css_default.dialogClose,
								"aria-label": t("common.close"),
								disabled: state.running,
								onClick: () => {
									setPlanOpen(false);
								},
								children: "×"
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.dialogBodyScroll,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.hint,
									children: t("snapshots.selectHint")
								}),
								state.planning && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("common.loading") }),
								state.plan !== null && summary() !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.hint,
									children: summary()
								}),
								state.plan !== null && state.plan.actions.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("snapshots.noActions") }),
								state.plan !== null && state.plan.actions.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.planScroll,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
										className: config_manager_module_css_default.reportList,
										children: state.plan.actions.map((action, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: config_manager_module_css_default.kindTag,
												children: actionKindLabel(t, action.kind)
											}),
											" ",
											action.description,
											action.detail !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
												className: config_manager_module_css_default.hint,
												children: [
													"（",
													action.detail,
													"）"
												]
											})
										] }, `plan-${i}`))
									})
								}),
								consultLoading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: api.t("consult.loading") }),
								consultReport !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConsultCard, {
									report: consultReport,
									t: api.t
								}),
								state.actionError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
									kind: "error",
									children: state.actionError
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: config_manager_module_css_default.actionRow,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										disabled: state.running,
										onClick: () => {
											setPlanOpen(false);
										},
										children: t("common.cancel")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										variant: "danger",
										disabled: state.running || state.plan === null || state.plan.actions.every((a) => a.kind === "skip"),
										onClick: requestExecute,
										children: state.running ? t("snapshots.executing") : t("snapshots.execute")
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
					open: confirmOpen,
					title: t("snapshots.confirmTitle"),
					message: t("snapshots.confirmRestore"),
					confirmLabel: t("snapshots.execute"),
					cancelLabel: t("common.cancel"),
					danger: true,
					busy: state.running,
					onConfirm: execute,
					onCancel: () => {
						setConfirmOpen(false);
					}
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
					open: deleteTarget !== null,
					title: t("snapshots.deleteConfirmTitle"),
					message: deleteTarget !== null ? t("snapshots.deleteConfirm", { time: new Date(deleteTarget.createdAt).toLocaleString() }) : void 0,
					confirmLabel: t("snapshots.delete"),
					cancelLabel: t("common.cancel"),
					danger: true,
					busy: managing,
					onConfirm: doDeleteSnapshot,
					onCancel: () => {
						setDeleteTarget(null);
					}
				})
			] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(BackupFilesCard, {
				api,
				t,
				refreshTick: backupFilesTick
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BackupScheduleCard, {
				api,
				t,
				onBackupDone: () => {
					setBackupFilesTick((n) => n + 1);
				}
			})] })
		]
	});
}
/** 间隔档位 → 字典键（t 的类型是字面量联合，switch 保持类型安全）。 */
function intervalLabel$1(t, interval) {
	switch (interval) {
		case "6h": return t("backupSchedule.interval.6h");
		case "12h": return t("backupSchedule.interval.12h");
		case "24h": return t("backupSchedule.interval.24h");
		case "7d": return t("backupSchedule.interval.7d");
		case "custom": return t("backupSchedule.interval.custom");
	}
}
/** 星期序号 → 字典键（0-6；switch 保持类型安全）。 */
function weekdayLabel(t, dayOfWeek) {
	switch (dayOfWeek) {
		case 0: return t("backupSchedule.weekday.sunday");
		case 1: return t("backupSchedule.weekday.monday");
		case 2: return t("backupSchedule.weekday.tuesday");
		case 3: return t("backupSchedule.weekday.wednesday");
		case 4: return t("backupSchedule.weekday.thursday");
		case 5: return t("backupSchedule.weekday.friday");
		case 6: return t("backupSchedule.weekday.saturday");
		default: return String(dayOfWeek);
	}
}
/** 上次运行状态 → 字典键。 */
function runStatusLabel(t, status) {
	switch (status) {
		case "success": return t("backupSchedule.status.success");
		case "skipped": return t("backupSchedule.status.skipped");
		case "failed": return t("backupSchedule.status.failed");
		default: return "—";
	}
}
function formatRunTime(iso) {
	if (iso === void 0 || iso === "") return "";
	const d = new Date(iso);
	return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}
/**
* 定时全量备份设置卡：总开关 + 间隔档位 + 上次运行状态 + 保存 / 立即备份。
* 状态自持；草稿镜像 runStore.snapshots.backupDraft（未保存修改切 tab/刷新保留），
* 保存成功清草稿（宿主配置为权威）。
*/
function BackupScheduleCard({ api, t, onBackupDone }) {
	const [status, setStatus] = (0, react.useState)("loading");
	const [error, setError] = (0, react.useState)(null);
	const [draft, setDraft] = (0, react.useState)({
		enabled: false,
		interval: "24h"
	});
	const [saved, setSaved] = (0, react.useState)(null);
	const [saving, setSaving] = (0, react.useState)(false);
	const [running, setRunning] = (0, react.useState)(false);
	const [lastRun, setLastRun] = (0, react.useState)(void 0);
	const [lastRunDetail, setLastRunDetail] = (0, react.useState)(null);
	const [flash, setFlash] = (0, react.useState)(null);
	const [actionError, setActionError] = (0, react.useState)(null);
	/** 挂载守卫：切 tab 卸载后异步回调只更新 store（草稿），不再 setState（React 18 无告警但浪费） */
	const mountedRef = (0, react.useRef)(true);
	(0, react.useEffect)(() => () => {
		mountedRef.current = false;
	}, []);
	const load = () => {
		setStatus("loading");
		setError(null);
		api.backupSchedule().then((schedule) => {
			if (!mountedRef.current) return;
			setSaved(schedule);
			setDraft(runStore.getSnapshot().snapshots.backupDraft ?? {
				enabled: schedule.enabled,
				interval: schedule.interval,
				...schedule.customSchedule !== void 0 ? { customSchedule: schedule.customSchedule } : {}
			});
			setLastRun(schedule.lastRunStatus);
			setLastRunDetail(formatRunTime(schedule.lastRunAt));
			setStatus("ready");
		}, (err) => {
			if (!mountedRef.current) return;
			setStatus("error");
			setError(err instanceof Error ? err.message : String(err));
		});
	};
	(0, react.useEffect)(load, [api]);
	const updateDraft = (next) => {
		setDraft(next);
		runStore.patch({ snapshots: { backupDraft: next } });
	};
	const save = () => {
		if (saving || running) return;
		const parsed = validateBackupScheduleDraft(draft);
		if (!parsed.ok) {
			setActionError(parsed.error);
			return;
		}
		setSaving(true);
		setFlash(null);
		setActionError(null);
		api.saveBackupSchedule(parsed.value).then((schedule) => {
			runStore.patch({ snapshots: { backupDraft: null } });
			if (!mountedRef.current) return;
			setSaved(schedule);
			setDraft({
				enabled: schedule.enabled,
				interval: schedule.interval,
				...schedule.customSchedule !== void 0 ? { customSchedule: schedule.customSchedule } : {}
			});
			setLastRun(schedule.lastRunStatus);
			setLastRunDetail(formatRunTime(schedule.lastRunAt));
			setSaving(false);
			setFlash(t("backupSchedule.saved"));
		}, (err) => {
			if (!mountedRef.current) return;
			setSaving(false);
			setActionError(err instanceof Error ? err.message : String(err));
		});
	};
	const runNow = () => {
		if (running || saving) return;
		setRunning(true);
		setFlash(null);
		setActionError(null);
		api.runBackupNow().then((res) => {
			if (mountedRef.current) {
				setSaved(res.schedule);
				setLastRun(res.run.status);
				setLastRunDetail(res.run.zip !== void 0 && res.run.zip !== "" ? res.run.zip : res.run.skipReason !== void 0 ? res.run.skipReason : formatRunTime(res.schedule.lastRunAt));
				setRunning(false);
			}
			onBackupDone?.();
		}, (err) => {
			if (!mountedRef.current) return;
			setRunning(false);
			setActionError(err instanceof Error ? err.message : String(err));
		});
	};
	const dirty = backupDraftDirty(draft, saved);
	const busy = saving || running;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
		className: config_manager_module_css_default.card,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("backupSchedule.title")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.hint,
				children: t("backupSchedule.hint")
			}),
			status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("backupSchedule.loading") }),
			status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
				kind: "error",
				children: [t("backupSchedule.error"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: load,
					children: t("common.retry")
				})]
			}),
			status === "ready" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
					label: t("backupSchedule.enabled"),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Checkbox, {
						checked: draft.enabled,
						onChange: (checked) => {
							updateDraft({
								...draft,
								enabled: checked
							});
						},
						label: t("backupSchedule.enabledHint"),
						disabled: busy
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
					label: t("backupSchedule.interval"),
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
						className: config_manager_module_css_default.select,
						value: draft.interval,
						disabled: busy,
						onChange: (event) => {
							updateDraft({
								...draft,
								interval: event.target.value
							});
						},
						children: BACKUP_INTERVAL_OPTIONS.map((interval) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
							value: interval,
							children: intervalLabel$1(t, interval)
						}, interval))
					})
				}),
				draft.interval === "custom" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.nextStepsGroup,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.hint,
						children: t("backupSchedule.customHint")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.actionRow,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
								className: config_manager_module_css_default.select,
								value: draft.customSchedule?.dayOfWeek ?? 1,
								disabled: busy,
								onChange: (event) => {
									updateDraft({
										...draft,
										customSchedule: {
											dayOfWeek: Number(event.target.value),
											hour: draft.customSchedule?.hour ?? 3,
											minute: draft.customSchedule?.minute ?? 0
										}
									});
								},
								children: WEEKDAY_OPTIONS.map((w) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: w.value,
									children: weekdayLabel(t, w.value)
								}, w.value))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
								className: config_manager_module_css_default.select,
								value: draft.customSchedule?.hour ?? 3,
								disabled: busy,
								onChange: (event) => {
									updateDraft({
										...draft,
										customSchedule: {
											dayOfWeek: draft.customSchedule?.dayOfWeek ?? 1,
											hour: Number(event.target.value),
											minute: draft.customSchedule?.minute ?? 0
										}
									});
								},
								children: Array.from({ length: 24 }, (_, h) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
									value: h,
									children: [String(h).padStart(2, "0"), ":00"]
								}, h))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
								className: config_manager_module_css_default.select,
								value: draft.customSchedule?.minute ?? 0,
								disabled: busy,
								onChange: (event) => {
									updateDraft({
										...draft,
										customSchedule: {
											dayOfWeek: draft.customSchedule?.dayOfWeek ?? 1,
											hour: draft.customSchedule?.hour ?? 3,
											minute: Number(event.target.value)
										}
									});
								},
								children: [
									0,
									15,
									30,
									45
								].map((m) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: m,
									children: String(m).padStart(2, "0")
								}, m))
							})
						]
					})]
				}),
				lastRun !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.hint,
							children: t("backupSchedule.lastRun")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: backupRunBadgeKind(lastRun),
							children: runStatusLabel(t, lastRun)
						}),
						lastRunDetail !== null && lastRunDetail !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.hint,
							children: lastRunDetail
						})
					]
				}),
				(saved?.consecutiveFailures ?? 0) > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
					kind: "error",
					children: t("backupSchedule.consecutiveFailures", { count: String(saved.consecutiveFailures) })
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: busy || !dirty,
						onClick: save,
						title: dirty ? void 0 : t("backupSchedule.saved"),
						children: saving ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("backupSchedule.save") }) : t("backupSchedule.save")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						disabled: busy || !(saved?.enabled ?? false),
						onClick: runNow,
						children: running ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("backupSchedule.running") }) : t("backupSchedule.runNow")
					})]
				})
			] }),
			flash !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "ok",
				children: flash
			}),
			actionError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "error",
				children: actionError
			})
		]
	});
}
/**
* 备份文件管理卡（m-backup-files）：列出 exports/ 下的导出 ZIP（手动导出 + 定时备份），
* 提供下载（复用 /download）/ 一键导入（切 Import tab + 注入 zipPath，向导直接分析）/
* 删除（危险操作二次确认）。
*
* 状态组件自持（列表可随时重载，不持久化；与快照列表同级）。refreshTick 由父组件在
* 「立即备份」完成后递增触发重载。安全：文件路径来自宿主受控 exports 目录；删除按钮
* 恒走 ConfirmDialog（danger）；导入 = 把 zipPath 交给现有导入向导（analyze 零写入，
* 不经过上传）。
*/
function BackupFilesCard({ api, t, refreshTick }) {
	const [status, setStatus] = (0, react.useState)("loading");
	const [error, setError] = (0, react.useState)(null);
	const [files, setFiles] = (0, react.useState)([]);
	const [deleting, setDeleting] = (0, react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, react.useState)(null);
	const [actionError, setActionError] = (0, react.useState)(null);
	/** P0-④：备份文件名搜索（client 过滤；仅文件名 + 备注匹配） */
	const [search, setSearch] = (0, react.useState)("");
	/** P1-⑦/P2-⑬：查看/对比弹窗状态（非空时渲染；zipPath 为受控 exports 路径） */
	const [inspect, setInspect] = (0, react.useState)(null);
	const mountedRef = (0, react.useRef)(true);
	const initialTick = (0, react.useRef)(refreshTick);
	(0, react.useEffect)(() => () => {
		mountedRef.current = false;
	}, []);
	const load = () => {
		setStatus("loading");
		setError(null);
		api.listBackupFiles().then((list) => {
			if (!mountedRef.current) return;
			setFiles(list);
			setStatus("ready");
		}, (err) => {
			if (!mountedRef.current) return;
			setStatus("error");
			setError(err instanceof Error ? err.message : String(err));
		});
	};
	(0, react.useEffect)(load, [api]);
	(0, react.useEffect)(() => {
		if (refreshTick === initialTick.current) return;
		load();
	}, [refreshTick]);
	/** 搜索过滤（P0-④）：文件名 + 备注子串匹配（大小写不敏感）；空查询不过滤 */
	const visibleFiles = search.trim() === "" ? files : files.filter((f) => {
		const q = search.trim().toLowerCase();
		return f.name.toLowerCase().includes(q) || (f.note ?? "").toLowerCase().includes(q);
	});
	const download = (file) => {
		setActionError(null);
		api.download(file.path, { saveDialog: true }).catch((err) => {
			if (!mountedRef.current) return;
			setActionError(err instanceof Error ? err.message : String(err));
		});
	};
	/** 一键导入：把备份文件 zipPath 交给现有导入向导（切 Import tab；向导挂载即分析） */
	const importBackup = (file) => {
		runStore.patch({
			view: "import",
			panel: null,
			snapshots: { importBackup: {
				zipPath: file.path,
				name: file.name
			} }
		});
	};
	/** P1-⑦/P2-⑬：查看备份内容 + 与此备份的差异（只读，零写入）。
	*  状态组件内自持（弹窗即会话，关闭即放弃；不持久化）。 */
	const inspectBackup = (file) => {
		setActionError(null);
		setInspect({
			name: file.name,
			loading: true,
			error: null,
			result: null
		});
		api.inspectBackup(file.path).then((result) => {
			if (!mountedRef.current) return;
			setInspect({
				name: file.name,
				loading: false,
				error: null,
				result
			});
		}, (err) => {
			if (!mountedRef.current) return;
			setInspect({
				name: file.name,
				loading: false,
				error: err instanceof Error ? err.message : String(err),
				result: null
			});
		});
	};
	const doDelete = () => {
		const file = confirmDelete;
		if (file === null || deleting) return;
		setDeleting(true);
		setActionError(null);
		api.deleteBackupFile(file.name).then(() => {
			setDeleting(false);
			setConfirmDelete(null);
			load();
		}, (err) => {
			setDeleting(false);
			setConfirmDelete(null);
			setActionError(err instanceof Error ? err.message : String(err));
		});
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
		className: config_manager_module_css_default.card,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("backupFiles.title")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.hint,
				children: t("backupFiles.hint")
			}),
			status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("backupFiles.loading") }),
			status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
				kind: "error",
				children: [error ?? t("common.unknownError"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: load,
					children: t("common.retry")
				})]
			}),
			status === "ready" && files.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("backupFiles.empty") }),
			status === "ready" && files.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.field,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					type: "search",
					className: config_manager_module_css_default.input,
					placeholder: t("backupFiles.searchPlaceholder"),
					value: search,
					onChange: (e) => {
						setSearch(e.target.value);
					}
				})
			}),
			status === "ready" && files.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.backupFileList,
				role: "list",
				"aria-label": t("backupFiles.title"),
				children: [visibleFiles.map((file) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.backupFileRow,
					role: "listitem",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.backupFileName,
							title: file.name,
							children: file.name
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: file.source === "auto" ? t("backupFiles.source.auto") : t("backupFiles.source.manual")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.backupFileMeta,
							children: formatBytes(file.sizeBytes)
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.backupFileMeta,
							children: new Date(file.mtimeMs).toLocaleString()
						}),
						file.note !== null && file.note !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: config_manager_module_css_default.backupFileNote,
							title: file.note,
							children: ["💬 ", file.note]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: config_manager_module_css_default.actionRow,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									disabled: deleting,
									onClick: () => {
										download(file);
									},
									children: t("backupFiles.download")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									disabled: deleting,
									onClick: () => {
										importBackup(file);
									},
									children: t("backupFiles.import")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									disabled: deleting,
									onClick: () => {
										inspectBackup(file);
									},
									children: t("backupFiles.inspect")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "danger",
									disabled: deleting,
									onClick: () => {
										setConfirmDelete(file);
									},
									children: t("backupFiles.delete")
								})
							]
						})
					]
				}, file.name)), visibleFiles.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("backupFiles.searchEmpty") })]
			}),
			actionError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "error",
				children: actionError
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmDelete !== null,
				title: t("backupFiles.deleteConfirmTitle"),
				message: confirmDelete !== null ? t("backupFiles.deleteConfirm", { name: confirmDelete.name }) : void 0,
				confirmLabel: t("backupFiles.delete"),
				cancelLabel: t("common.cancel"),
				danger: true,
				busy: deleting,
				onConfirm: doDelete,
				onCancel: () => {
					setConfirmDelete(null);
				}
			}),
			inspect !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.dialogMask,
				onMouseDown: (e) => {
					if (e.target === e.currentTarget) setInspect(null);
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("backupFiles.inspect"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogHeaderRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.dialogHeader,
							children: t("backupFiles.inspect")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: config_manager_module_css_default.dialogClose,
							"aria-label": t("common.close"),
							onClick: () => {
								setInspect(null);
							},
							children: "×"
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogBodyScroll,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.hint,
								"data-testid": "inspect-backup-name",
								children: inspect.name
							}),
							inspect.loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("backupFiles.inspectLoading") }),
							inspect.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: "error",
								children: inspect.error
							}),
							!inspect.loading && inspect.result === null && inspect.error === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("backupFiles.inspectEmpty") }),
							inspect.result !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(BackupInspectView, {
								result: inspect.result,
								t
							})
						]
					})]
				})
			})
		]
	});
}
/**
* 备份内容查看 + 「与此备份 diff」只读视图（P1-⑦ / P2-⑬，绑 src/ui/backup-inspect.ts 纯函数）：
* - 分区清单（含条目计数徽章）；
* - 差异摘要徽章（将变更 / 已一致 / 冲突 / 需补录密钥 / 路径映射 / 需重启）；
* - 逐项变更列表（plan.items 的 kind + description，限高内滚）。
* 只读：编译自 analyze/plan（零写入），不提供任何执行入口。
*/
function BackupInspectView({ result, t }) {
	const sections = inspectSections(result.analysis, result.plan);
	const summary = inspectSummary(result.analysis, result.plan);
	const groupLabelKey = (key) => {
		switch (key) {
			case "conflicts": return "backupFiles.inspectGroup.conflicts";
			case "changes": return "backupFiles.inspectGroup.changes";
			case "paths": return "backupFiles.inspectGroup.paths";
			case "skipped": return "backupFiles.inspectGroup.skipped";
			case "others": return "backupFiles.inspectGroup.others";
		}
	};
	const kindTagClass = (kind) => {
		switch (kind) {
			case "error": return config_manager_module_css_default.kindTagError ?? "";
			case "warn": return config_manager_module_css_default.kindTagWarn ?? "";
			case "ok": return config_manager_module_css_default.kindTagOk ?? "";
			case "info": return config_manager_module_css_default.kindTagInfo ?? "";
		}
	};
	const groups = inspectGroupedChanges(summary);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
			className: config_manager_module_css_default.card,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("backupFiles.inspectSections")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.statRow,
				children: sections.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
					kind: "info",
					children: [
						s.section,
						": ",
						s.count
					]
				}, s.section))
			})]
		}),
		/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
			className: config_manager_module_css_default.card,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("backupFiles.inspectDiff")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.statRow,
				children: [
					summary.willChange > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "info",
						children: t("import.preview.willChange", { count: String(summary.willChange) })
					}),
					summary.unchanged > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "ok",
						children: t("import.preview.unchanged", { count: String(summary.unchanged) })
					}),
					summary.conflicts > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "error",
						children: t("import.preview.conflicts", { count: String(summary.conflicts) })
					}),
					summary.secretsNeeded > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "warn",
						children: t("import.preview.secrets", { count: String(summary.secretsNeeded) })
					}),
					summary.pathMappingsNeeded > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "warn",
						children: t("import.preview.paths", { count: String(summary.pathMappingsNeeded) })
					}),
					summary.needsRestart && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "warn",
						children: t("report.needsRestart")
					})
				]
			})]
		}),
		groups.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
			className: config_manager_module_css_default.card,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("backupFiles.inspectItems")
			}), groups.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.inspectGroup,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.groupLabel,
						children: t(groupLabelKey(group.key))
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: group.kind,
						children: String(group.items.length)
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.reportScroll,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: config_manager_module_css_default.reportList,
						children: group.items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `${config_manager_module_css_default.kindTag} ${kindTagClass(group.kind)}`,
								children: item.kind
							}),
							" ",
							item.adapter,
							": ",
							item.description
						] }, item.id))
					})
				})]
			}, group.key))]
		})
	] });
}
//#endregion
//#region src/client/sync/sync-api.ts
/** 同步端点常量（与 Host 半 src/index.ts API 常量保持一致） */
const SYNC_API = {
	base: "/api/dsh-config-manager/sync",
	status: "/api/dsh-config-manager/sync/status",
	push: "/api/dsh-config-manager/sync/push",
	pull: "/api/dsh-config-manager/sync/pull",
	githubStart: "/api/dsh-config-manager/sync/github/start",
	githubPoll: "/api/dsh-config-manager/sync/github/poll",
	githubCancel: "/api/dsh-config-manager/sync/github/cancel",
	githubValidate: "/api/dsh-config-manager/sync/github/validate",
	history: "/api/dsh-config-manager/sync/history",
	snapshotsList: "/api/dsh-config-manager/sync/snapshots-list",
	sync: "/api/dsh-config-manager/sync/sync",
	applyItems: "/api/dsh-config-manager/sync/apply-items",
	cancel: "/api/dsh-config-manager/sync/cancel",
	autosync: "/api/dsh-config-manager/sync/autosync",
	selection: "/api/dsh-config-manager/sync/selection",
	config: "/api/dsh-config-manager/sync/config",
	uiPrefs: "/api/dsh-config-manager/sync/ui-prefs",
	rollback: "/api/dsh-config-manager/sync/rollback"
};
/** 同步请求超时（ms）：与 Host 半 ROUTE_TIMEOUT_MS 对齐（git 网络操作可能较慢） */
const SYNC_TIMEOUT_MS = 3e5;
/** 解析 JSON 响应；非 2xx 时抛出带路由 error 消息的 ConfigManagerApiError（与 api.ts 同款） */
async function readJson$4(response, t) {
	const notMountedMessage = t("error.notMounted");
	let body;
	try {
		body = await response.json();
	} catch {
		if (response.status === 404) throw new ConfigManagerApiError(notMountedMessage);
		throw new ConfigManagerApiError(t("error.httpInvalidJson", { status: String(response.status) }));
	}
	if (!response.ok) throw new ConfigManagerApiError(typeof body === "object" && body !== null && typeof body.error === "string" ? body.error : response.status === 404 ? notMountedMessage : `HTTP ${response.status}`);
	return body;
}
/** POST JSON 请求（带超时：宿主卡死时 UI 拿到明确错误而不是永远转圈） */
async function postJson$3(path, body, t) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), SYNC_TIMEOUT_MS);
	try {
		return await readJson$4(await fetch(path, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
			signal: controller.signal
		}), t);
	} catch (err) {
		if (controller.signal.aborted) throw new ConfigManagerApiError(t("error.syncTimeout", { minutes: String(Math.round(SYNC_TIMEOUT_MS / 6e4)) }));
		throw err;
	} finally {
		clearTimeout(timer);
	}
}
/** 远程同步浏览器半数据入口（备份与迁移页第 4 个 tab 的注入业务面） */
var SyncApi = class {
	t;
	constructor(t = zhUiT) {
		this.t = t;
	}
	/** 读取同步状态（配置 / 凭据 / 上次同步时间 / 分区数） */
	async status() {
		return readJson$4(await fetch(SYNC_API.status), this.t);
	}
	/** 推送：导出 portable 分区 → 提交到私有 Git 仓库 → 更新 sync-state */
	async push(payload) {
		return postJson$3(SYNC_API.push, payload, this.t);
	}
	/** P0-②：push 前只读预览（「将推送什么」，零写入远端）——body.preview=true 触发 */
	async pushPreview(payload) {
		return postJson$3(SYNC_API.push, {
			...payload,
			preview: true
		}, this.t);
	}
	/** 拉取差异预览：拉取远端最新快照 → 只读分析（绝不执行导入） */
	async pull(payload) {
		return postJson$3(SYNC_API.pull, payload, this.t);
	}
	/** GitHub OAuth device flow：发起登录，返回一次性用户码 + 授权页 URL + flowId */
	async githubStart() {
		return postJson$3(SYNC_API.githubStart, {}, this.t);
	}
	/** GitHub OAuth device flow：凭 flowId 轮询授权结果（成功时 token 已由 Host 写入 credentials） */
	async githubPoll(flowId) {
		return postJson$3(SYNC_API.githubPoll, { flowId }, this.t);
	}
	/** GitHub OAuth device flow：取消（丢弃宿主侧登记，零副作用） */
	async githubCancel(flowId) {
		return postJson$3(SYNC_API.githubCancel, { flowId }, this.t);
	}
	/** GitHub token 有效性校验（判定「是否已登录」：token 存在且 GitHub API 接受；
	*  401 → valid:false 引导重新登录；非 401 错误向上抛，UI 兜底不误判登出） */
	async githubValidate() {
		return postJson$3(SYNC_API.githubValidate, {}, this.t);
	}
	/** 同步历史：列出本地祖先快照 + 自动同步执行记录（按 createdAt 倒序合并）。 */
	async history() {
		return readJson$4(await fetch(SYNC_API.history), this.t);
	}
	/** 远端历史快照列表（供「选择历史快照」下拉）。 */
	async snapshotsList(payload) {
		return postJson$3(SYNC_API.snapshotsList, payload, this.t);
	}
	/** 一键同步第一步：拉取 → 差异确认会话（items 逐项确认，暂不导入）。 */
	async sync(payload) {
		return postJson$3(SYNC_API.sync, payload, this.t);
	}
	/** 一键同步第二步：按用户对差异项的逐项决策执行导入。 */
	async applyItems(payload) {
		return postJson$3(SYNC_API.applyItems, payload, this.t);
	}
	/** 取消/清理差异确认会话（丢弃临时 ZIP，零副作用）。 */
	async cancel(syncSessionId) {
		return postJson$3(SYNC_API.cancel, { syncSessionId }, this.t);
	}
	/** 自动同步状态（GET /sync/autosync 返回全部通道的 { git, webdav }，各自独立）。 */
	async autosyncStatusAll() {
		return readJson$4(await fetch(SYNC_API.autosync), this.t);
	}
	/** 自动同步状态（指定通道；从全部通道状态中取）。 */
	async autosyncStatus(transport = "git") {
		return (await this.autosyncStatusAll())[transport];
	}
	/** 自动同步配置更新（POST /sync/autosync；payload.transport 指定目标通道）。 */
	async autosyncUpdate(payload) {
		return postJson$3(SYNC_API.autosync, payload, this.t);
	}
	/** 保存同步分区选择（POST /sync/selection）：模式 + 勾选分区持久化到 Host。
	*  自动同步调度器与手动 push 共用此配置（刷新/重启后仍然生效）。 */
	async saveSelection(payload) {
		return postJson$3(SYNC_API.selection, payload, this.t);
	}
	/** 保存同步通道配置（POST /sync/config）：url/username/password（git: repoUrl/token）持久化。
	*  password/token 经 Host 写入 DSH credentials（值永不回传）；返回凭据布尔供 UI 刷新徽章。 */
	async saveConfig(payload) {
		return postJson$3(SYNC_API.config, payload, this.t);
	}
	/** 保存插件 UI 偏好（POST /sync/ui-prefs）：当前为上次选择的同步通道（ui-prefs.json，
	*  随 self 分区进导出备份）。纯偏好无 secret；失败由调用方静默降级（localStorage 兜底）。 */
	async saveUiPrefs(payload) {
		return postJson$3(SYNC_API.uiPrefs, payload, this.t);
	}
	/** 一键回滚：按 restoreId 调用 backup→rollback */
	async rollback(payload) {
		return postJson$3(SYNC_API.rollback, payload, this.t);
	}
	/** Phase 7 迁移前咨询（只读健康评分 + 建议）：对远端快照生成咨询报告。 */
	async consult(input) {
		return postJson$3("/api/dsh-config-manager/consult", input, this.t);
	}
};
//#endregion
//#region src/client/sync/history-model.ts
/** 统一历史条目（快照 + 自动同步）按 createdAt 倒序排序。 */
function projectSyncHistoryEntries(entries) {
	return [...entries].sort(byCreatedAtDesc);
}
function byCreatedAtDesc(a, b) {
	return a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0;
}
/** ISO 时间 → 本地可读字符串（短格式） */
function formatDateTime(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (isNaN(d.getTime())) return iso;
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
/** 自动同步执行记录的方向可读标签。 */
function directionLabel(direction) {
	switch (direction) {
		case "pull": return "下载";
		case "push": return "上传";
		default: return "双向";
	}
}
/** 自动同步执行状态可读标签。 */
function autosyncStatusLabel(status) {
	switch (status) {
		case "success": return "成功";
		case "skipped": return "已跳过";
		case "partial": return "部分成功";
		default: return "失败";
	}
}
/** 跳过原因 → 可读描述（host 透传语义；未知原因回退原串）。 */
function describeSkipReason(reason) {
	switch (reason) {
		case "conflict": return "冲突项被跳过";
		case "no-remote": return "远端无快照";
		case "not-configured": return "未配置仓库";
		case "network": return "网络问题";
		case "encrypted": return "远端快照已加密，自动同步跳过（请手动同步）";
		default: return reason ?? "未知";
	}
}
/** 自动同步记录 → 展示行投影。 */
function projectAutosyncEntry(entry) {
	const parts = [directionLabel(entry.direction), autosyncStatusLabel(entry.status)];
	if (entry.skipReason !== void 0) parts.push(describeSkipReason(entry.skipReason));
	return {
		id: entry.createdAt,
		createdAt: entry.createdAt,
		direction: directionLabel(entry.direction),
		status: autosyncStatusLabel(entry.status),
		summary: parts.join(" · "),
		conflictedSections: entry.conflictedSections,
		appliedSections: entry.appliedSections,
		error: entry.error,
		notifiedAt: entry.notifiedAt,
		hasDetail: entry.conflictedSections !== void 0 && entry.conflictedSections.length > 0 || entry.appliedSections !== void 0 && entry.appliedSections.length > 0 || entry.error !== void 0
	};
}
//#endregion
//#region src/client/sync/SyncHistoryView.tsx
/**
* 同步历史视图（方案 A）：列出本地祖先快照目录（kind=apply）+ 自动同步执行记录
* （kind=autosync）。自动同步行显示时间/方向/状态/跳过冲突/应用分区，点开可看被跳过
* 冲突分区明细。
*
* 数据获取：GET /sync/history → { entries: SyncHistoryEntry[] }（按 createdAt 倒序合并）。
* 纯函数投影在 ./history-model.ts（node --test 可测），本组件只做装配。
*/
/** 通道徽章：git → GitHub，webdav → WebDAV；未知/缺失不渲染。 */
function ChannelBadge({ transport, t }) {
	if (transport === "git") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
		kind: "info",
		children: t("history.channelGit")
	});
	if (transport === "webdav") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
		kind: "info",
		children: t("history.channelWebdav")
	});
	return null;
}
function SyncHistoryView(props) {
	const { api, t } = props;
	const [loading, setLoading] = (0, react.useState)(true);
	const [error, setError] = (0, react.useState)(null);
	const [entries, setEntries] = (0, react.useState)([]);
	/** 重试计数（错误态点「重试」递增 → 重新加载） */
	const [reloadKey, setReloadKey] = (0, react.useState)(0);
	(0, react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		(async () => {
			try {
				const data = await api.history();
				if (!cancelled) {
					setEntries(data.entries);
					setError(null);
					setLoading(false);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err.message : String(err));
					setLoading(false);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [api, reloadKey]);
	const rows = (0, react.useMemo)(() => projectSyncHistoryEntries(entries), [entries]);
	const snapshotRows = (0, react.useMemo)(() => rows.filter((r) => r.kind === "apply" || r.kind === "push" || r.kind === "pull" || r.kind === "rollback").map((r) => ({
		id: r.id,
		createdAt: r.createdAt,
		sectionCount: r.sectionCount ?? 0,
		reviewCount: r.reviewCount ?? 0
	})), [rows]);
	if (loading) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("common.loading") });
	if (error) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
		error,
		onRetry: () => {
			setReloadKey((k) => k + 1);
		},
		retrying: loading,
		t: api.t
	});
	if (rows.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("history.empty") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("history.emptyHint") })] });
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, { title: `${t("history.title")}（${rows.length}）` }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("table", {
		className: "sync-history-table",
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { children: t("history.colTime") }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { children: t("history.colKind") }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("th", { children: t("history.colDetail") })
		] }) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("tbody", { children: rows.map((r) => {
			if (r.kind === "autosync" && r.autosync !== void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AutosyncRow, {
				entry: r.autosync,
				t
			}, r.id);
			const snap = snapshotRows.find((s) => s.id === r.id);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", { children: formatDateTime(r.createdAt) }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
					kind: "info",
					children: t("history.kindSnapshot")
				}) }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("td", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChannelBadge, {
						transport: r.transport,
						t
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: r.id }),
					snap !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						" · ",
						snap.sectionCount,
						" ",
						t("history.sectionCount")
					] })
				] })
			] }, r.id);
		}) })]
	})] });
}
function AutosyncRow({ entry, t }) {
	const row = projectAutosyncEntry(entry);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("tr", { children: [
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", { children: formatDateTime(row.createdAt) }),
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
			kind: "info",
			children: t("history.kindAutosync")
		}) }),
		/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChannelBadge, {
				transport: entry.transport,
				t
			}),
			row.summary,
			entry.pushedSnapshotId !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				" · ",
				t("history.autosyncPush"),
				" ",
				entry.pushedSnapshotId
			] }),
			entry.pulledSnapshotId !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				" · ",
				t("history.autosyncPull"),
				" ",
				entry.pulledSnapshotId
			] })
		] }), row.hasDetail && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: t("history.detail") }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.reportList,
			children: [
				row.conflictedSections !== void 0 && row.conflictedSections.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.fieldLabel,
					children: t("history.autosyncConflicted", { sections: "" })
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.statRow,
					children: row.conflictedSections.map((sid) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "warn",
						children: sid
					}, sid))
				})] }),
				row.appliedSections !== void 0 && row.appliedSections.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.fieldLabel,
					children: t("history.autosyncApplied", { sections: "" })
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.statRow,
					children: row.appliedSections.map((sid) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "ok",
						children: sid
					}, sid))
				})] }),
				row.error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.fieldLabel,
					children: t("history.autosyncError", { error: "" })
				}), row.error] })
			]
		})] })] })
	] });
}
//#endregion
//#region src/client/sync/SyncConfirmView.tsx
/**
* 一键同步差异确认视图（方案 A §5 差异确认数据流）。
*
* 消费 POST /sync/sync 返回的 items[]，渲染逐项确认列表：
* - 每项：kindTag + description + severity + 「采用远端」复选框（默认勾选，可取消）；
* - Conflict 项：内联弹窗（用本地 / 用远端 / 跳过）；
* - 底部：「确认导入」（apply-items）+「取消」（cancel）。
*
* 全部渲染模型来自 ./sync-view.ts 纯函数（node 单测覆盖），组件只做装配 + 交互状态。
*/
function SyncConfirmView(props) {
	const { api, syncSessionId, snapshotId, items, needsReview, compatibility, t, decisions, onDecisionsChange, onCancel, onRollbackDone } = props;
	const states = (0, react.useMemo)(() => {
		const base = {};
		for (const it of items) base[it.itemId] = {
			adopted: it.defaultAdopt,
			resolution: void 0
		};
		if (decisions === null) return base;
		for (const [id, d] of Object.entries(decisions)) if (base[id] !== void 0) base[id] = {
			adopted: d.adopted,
			resolution: d.resolution
		};
		return base;
	}, [items, decisions]);
	const [phase, setPhase] = (0, react.useState)("idle");
	const [applyResult, setApplyResult] = (0, react.useState)(null);
	const [error, setError] = (0, react.useState)(null);
	/** Phase 7 迁移前咨询：远端快照咨询报告（本地 state，非敏感） */
	const [consultReport, setConsultReport] = (0, react.useState)(null);
	const [consultLoading, setConsultLoading] = (0, react.useState)(false);
	/** Phase 7 迁移前咨询：对远端快照生成咨询报告（只读，零写入）。失败静默。 */
	(0, react.useEffect)(() => {
		let cancelled = false;
		setConsultLoading(true);
		api.consult({
			type: "remote-snapshot",
			id: snapshotId,
			snapshotId
		}).then((report) => {
			if (!cancelled) setConsultReport(report);
		}).catch(() => {
			if (!cancelled) setConsultReport(null);
		}).finally(() => {
			if (!cancelled) setConsultLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [snapshotId, api]);
	const summary = (0, react.useMemo)(() => summarizeConfirmItems(items.map((it) => ({
		...it,
		adopt: states[it.itemId]?.adopted ?? it.defaultAdopt
	}))), [items, states]);
	const displayItems = (0, react.useMemo)(() => reviewItems(items), [items]);
	const setAdopted = (itemId, adopted) => {
		const existing = states[itemId] ?? {
			adopted: false,
			resolution: void 0
		};
		onDecisionsChange({
			...decisions ?? {},
			[itemId]: {
				adopted,
				resolution: existing.resolution
			}
		});
	};
	const setResolution = (itemId, resolution) => {
		const existing = states[itemId] ?? {
			adopted: false,
			resolution: void 0
		};
		onDecisionsChange({
			...decisions ?? {},
			[itemId]: {
				adopted: existing.adopted,
				resolution
			}
		});
	};
	const applyBulkDecision = (bulk) => {
		if (bulk.length === 0) return;
		const next = { ...decisions ?? {} };
		for (const d of bulk) {
			const existing = states[d.itemId] ?? {
				adopted: false,
				resolution: void 0
			};
			next[d.itemId] = {
				...existing,
				resolution: d.resolution,
				adopted: d.adopt
			};
		}
		onDecisionsChange(next);
	};
	const runApply = async () => {
		const unresolved = items.find((it) => it.kind === "Conflict" && states[it.itemId]?.adopted === true && states[it.itemId]?.resolution === void 0);
		if (unresolved !== void 0) {
			setError(t("syncflow.conflictUnresolved", { itemId: unresolved.itemId }));
			return;
		}
		setPhase("applying");
		setError(null);
		try {
			const adoptedMap = /* @__PURE__ */ new Map();
			for (const it of items) adoptedMap.set(it.itemId, states[it.itemId]?.adopted ?? false);
			const resolutions = /* @__PURE__ */ new Map();
			for (const it of items) {
				const res = states[it.itemId]?.resolution;
				if (res !== void 0) resolutions.set(it.itemId, res);
			}
			const adoptions = buildAdoptions(items, adoptedMap, resolutions);
			const result = await api.applyItems({
				syncSessionId,
				adoptions
			});
			setPhase(result.ok ? "done" : "failed");
			setApplyResult(result);
		} catch (err) {
			setPhase("failed");
			setError(err instanceof Error ? err.message : String(err));
		}
	};
	const runCancel = async () => {
		setPhase("cancelling");
		setError(null);
		try {
			await api.cancel(syncSessionId);
		} catch {}
		onCancel();
	};
	const runRollback = async (restoreId) => {
		setPhase("applying");
		setError(null);
		try {
			await api.rollback({ restoreId });
			setPhase("done");
			setApplyResult(null);
			onRollbackDone?.();
		} catch (err) {
			setPhase("failed");
			setError(err instanceof Error ? err.message : String(err));
		}
	};
	const busy = phase === "applying" || phase === "cancelling";
	if (items.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "12px"
		},
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
			kind: "ok",
			children: t("syncflow.empty")
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.actionRow,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
				disabled: busy,
				onClick: () => {
					runCancel();
				},
				children: t("common.close")
			})
		})]
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "12px"
		},
		children: [
			compatibility !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.statRow,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
					kind: "info",
					children: compatibility
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: needsReview ? "warn" : "info",
				children: needsReview ? t("syncflow.needsReviewBadge") : t("syncflow.diffCount", { count: String(summary.total) })
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.statRow,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "info",
						children: t("syncflow.diffCount", { count: String(summary.total) })
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
						kind: "ok",
						children: [
							t("syncflow.adoptRemote"),
							" ",
							summary.adopted
						]
					}),
					summary.error > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
						kind: "error",
						children: [
							severityLabel("error", api.t),
							" × ",
							summary.error
						]
					}),
					summary.warning > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
						kind: "warn",
						children: [
							severityLabel("warning", api.t),
							" × ",
							summary.warning
						]
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: config_manager_module_css_default.hint,
				children: t("syncflow.adoptHint")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: busy || displayItems.filter((it) => it.kind === "Conflict").length === 0,
						onClick: () => {
							applyBulkDecision(keepLocalAll(items));
						},
						children: t("syncflow.keepLocalAll")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: busy || displayItems.filter((it) => it.kind === "Conflict").length === 0,
						onClick: () => {
							applyBulkDecision(useRemoteAll(items));
						},
						children: t("syncflow.useRemoteAll")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.hint,
						children: t("syncflow.bulkHint")
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.confirmScroll,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.reportList,
					children: displayItems.map((it) => {
						const st = states[it.itemId] ?? { adopted: it.defaultAdopt };
						const isConflict = it.kind === "Conflict";
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.statRow,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: config_manager_module_css_default.checkboxRow,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: st.adopted,
										disabled: busy,
										onChange: (e) => {
											setAdopted(it.itemId, e.target.checked);
										}
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: kindLabel(it.kind, api.t) })]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: it.severity === "error" ? "error" : it.severity === "warning" ? "warn" : "info",
									children: severityLabel(it.severity, api.t)
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: it.description }),
								isConflict && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConflictResolver, {
									item: it,
									resolution: st.resolution,
									busy,
									t,
									onResolve: (r) => {
										setResolution(it.itemId, r);
									}
								})
							]
						}, it.itemId);
					})
				})
			}),
			consultLoading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: api.t("consult.loading") }),
			consultReport !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConsultCard, {
				report: consultReport,
				t: api.t
			}),
			error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "error",
				children: error
			}),
			phase === "idle" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					disabled: busy || summary.adopted === 0,
					onClick: () => {
						runApply();
					},
					children: t("syncflow.confirmImport")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					disabled: busy,
					onClick: () => {
						runCancel();
					},
					children: t("syncflow.cancel")
				})]
			}),
			(phase === "done" || phase === "failed") && applyResult !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ApplyResultCard, {
				result: applyResult,
				busy,
				t,
				onRollback: runRollback
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.actionRow,
				style: { marginTop: "12px" },
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					disabled: busy,
					onClick: () => {
						onCancel();
					},
					children: t("common.close")
				})
			})] }),
			(phase === "done" || phase === "failed") && applyResult === null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "ok",
				children: t("syncflow.rollbackDone")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.actionRow,
				style: { marginTop: "12px" },
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					disabled: busy,
					onClick: () => {
						onCancel();
					},
					children: t("common.close")
				})
			})] })
		]
	});
}
function ConflictResolver({ item, resolution, busy, t, onResolve }) {
	const conflict = item.conflict;
	const options = [{
		value: "keepLocal",
		label: t("syncflow.conflictUseLocal")
	}, {
		value: "useRemote",
		label: t("syncflow.conflictUseRemote")
	}];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.conflictItem,
		children: [
			item.detail !== void 0 && item.detail !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
				className: config_manager_module_css_default.conflictDetail,
				children: item.detail
			}),
			conflict?.diff !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("details", {
				className: config_manager_module_css_default.conflictDetail,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("summary", { children: t("syncflow.diff") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
					className: config_manager_module_css_default.diffScroll,
					children: conflict.diff
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.conflictOptions,
				children: options.map((opt) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: config_manager_module_css_default.radioLabel,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "radio",
						name: `sync-conflict-${item.itemId}`,
						checked: resolution === opt.value,
						disabled: busy,
						onChange: () => {
							onResolve(opt.value);
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: opt.label })]
				}, opt.value))
			})
		]
	});
}
function ApplyResultCard({ result, busy, t, onRollback }) {
	const ok = result.ok;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
			kind: ok ? "ok" : "error",
			children: ok ? t("syncflow.importDone", { n: String(result.applied.length) }) : t("syncflow.importFailed")
		}),
		result.needsRestart && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
			kind: "warn",
			children: t("syncflow.needsRestart")
		}),
		result.applied.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: config_manager_module_css_default.fieldLabel,
			children: t("syncflow.importedSections")
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.statRow,
			children: result.applied.map((sid) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
				kind: "ok",
				children: sid
			}, sid))
		})] }),
		result.warnings.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: config_manager_module_css_default.fieldLabel,
			children: t("syncflow.importWarnings")
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
			className: config_manager_module_css_default.warnList,
			children: result.warnings.map((w, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: w }, i))
		})] }),
		result.restoreId !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
			variant: "danger",
			disabled: busy,
			onClick: () => {
				onRollback(result.restoreId);
			},
			children: busy ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("syncflow.rollingBack") }) : t("syncflow.rollback")
		})
	] });
}
//#endregion
//#region src/client/sync/SyncSettingsView.tsx
/**
* 远程同步面板（备份与迁移页的第 4 个 tab 内容）。
*
* 独立设置页壳（sectionHeader/close/自身 tab）已移除 —— tab 容器由
* ConfigManagerSection 统一渲染，本组件只输出内容体：
* - **同步通道入口卡**：展示当前通道 + 配置状态 + 凭据徽章；点「配置同步通道」
*   → 弹出**通道配置弹窗**（弹窗体系与市场操作弹窗一致，DESIGN.md §8.12：
*   dialogMask + dialogCard dialogWide + dialogHeaderRow + dialogClose +
*   dialogBodyScroll，零新增样式）；
* - **通道配置弹窗**：通道子 tab（GitHub（git）/ WebDAV）切换，两个通道的
*   配置表单、自动同步、同步模式、是否加密、远端快照**各自独立**；关闭弹窗
*   = 放弃本次操作（GitHub 登录流程进行中则一并取消，§8.12 约定）；
* - GitHub 子 tab：repoUrl（必填）+ 认证 token（可选，写入 DSH credentials 的提示）
*   + **GitHub OAuth device flow 登录**（登录块跟随 git 通道配置放在弹窗内：
*   未登录/失效时显示；git 可执行文件固定使用系统 PATH 中的 git）；
* - WebDAV 子 tab：url + username + password（密码写入 DSH credentials）+ 常见服务器预设；
* - 私有仓库强制提示横幅（仅 git 子 tab 常驻）；
* - 推送按钮 → SyncPushReport；拉取按钮 → SyncPullReport.changes 差异摘要；
* - 一键同步主按钮：拉取 → 差异确认会话（SyncConfirmView 逐项确认）→ 确认导入
*   （apply-items）→ 执行结果 + 一键回滚（restoreId）；「选择历史快照」下拉；
* - 自动同步设置（按通道）：总开关 + 间隔下拉 + 状态（上次运行 / 下次倒计时）；
* - 状态行：凭据配置 + 上次同步时间 + 通道（来自 GET /sync/status，组件挂载时加载）。
*
* 全部渲染模型来自 ./sync-view.ts 纯函数（node 单测覆盖），组件只做装配；
* 状态组件内自持（useState），同时经 toSyncStoreSlice() 镜像进模块级 runStore：
* 模块级单例保证「切 tab 不丢」，sessionStorage 白名单保证「刷新恢复」；
* token/webdav 密码/加密与解密密码仅内存（state），成功后清空（已写入 DSH
* credentials），持久化白名单硬性剔除（含 byChannel 内密码类字段），刷新后
* 清空、需要时重新输入。
*/
const initialGithub = {
	phase: "idle",
	flowId: "",
	userCode: "",
	verificationUri: "",
	interval: 5,
	error: null
};
const AUTOSYNC_INTERVAL_OPTIONS = [
	"5m",
	"15m",
	"30m",
	"60m",
	"6h",
	"12h",
	"24h"
];
const initial$3 = {
	loading: true,
	loadError: null,
	statusInfo: null,
	channel: readStoredChannel() ?? "git",
	repoUrl: "",
	token: "",
	webdavUrl: "",
	webdavUsername: "",
	webdavPassword: "",
	byChannel: {
		git: defaultChannelSyncState(),
		webdav: defaultChannelSyncState()
	},
	catalog: [],
	savingConfig: false,
	busy: null,
	pushReport: null,
	pullReport: null,
	pushPreview: {
		preview: null,
		open: false
	},
	confirmSession: null,
	confirmDecisions: null,
	lastRestoreId: null,
	error: null,
	github: initialGithub,
	githubSignedIn: null
};
/**
* 从 runStore 恢复上次的同步 UI 状态（切 tab 回 / 刷新后挂载）。
* 敏感字段（token/webdav 密码/加密与解密密码）只在内存切片里保留：切 tab 保留；
* 刷新后已被持久化白名单清空（applyPersisted 强制归零）→ 需要时重新输入。
* busy/savingConfig 为瞬态：切 tab 由模块级单例保留（切回仍显示进行中）；
* 刷新后白名单剔除 → 回复空闲。
*/
function initFromStore$2() {
	const s = runStore.getSnapshot().sync;
	return {
		...initial$3,
		channel: s.channel !== "git" ? s.channel : initial$3.channel,
		repoUrl: s.repoUrl,
		token: s.token,
		webdavUrl: s.webdavUrl,
		webdavUsername: s.webdavUsername,
		webdavPassword: s.webdavPassword,
		byChannel: {
			git: {
				...defaultChannelSyncState(),
				...s.byChannel.git
			},
			webdav: {
				...defaultChannelSyncState(),
				...s.byChannel.webdav
			}
		},
		busy: s.busy,
		savingConfig: s.savingConfig,
		pushReport: s.pushReport,
		pullReport: s.pullReport,
		pushPreview: s.pushPreview ?? {
			preview: null,
			open: false
		},
		confirmSession: s.confirmSession,
		confirmDecisions: s.confirmDecisions,
		lastRestoreId: s.lastRestoreId,
		error: s.error,
		loadError: s.loadError
	};
}
function SyncSettingsView({ api, t }) {
	const [state, setState] = (0, react.useState)(initFromStore$2);
	const uiT = api.t;
	/** 最新 state 镜像（commit/自动保存 flush 读取，避免闭包过期值） */
	const stateRef = (0, react.useRef)(state);
	/** 挂载守卫：卸载后不再 setState（store 镜像仍执行，异步结果照常落库） */
	const mountedRef = (0, react.useRef)(true);
	/** 通道配置弹窗开关（瞬态 UI：切 tab/刷新不持久化，弹窗不自动重开；DESIGN.md §8.12 约定） */
	const [channelOpen, setChannelOpen] = (0, react.useState)(false);
	/**
	* 统一提交入口：更新 stateRef → 挂载时 setState → **总是**镜像进 runStore。
	* 关键：镜像不依赖 effect flush —— 异步操作（push/pull/sync）完成回调在组件
	* 已卸载（切走 tab）时也能把结果写进 store，切回 tab 时 initFromStore 恢复。
	*/
	const commit = (next) => {
		stateRef.current = next;
		if (mountedRef.current) setState(next);
		runStore.patch({ sync: toSyncStoreSlice(next) });
	};
	const patch = (p) => commit({
		...stateRef.current,
		...p
	});
	/** 更新指定通道的 byChannel 状态（子 tab 切换后 loadSnapshots 等场景用）。 */
	const patchChannelState = (ch, p) => commit({
		...stateRef.current,
		byChannel: {
			...stateRef.current.byChannel,
			[ch]: {
				...stateRef.current.byChannel[ch],
				...p
			}
		}
	});
	/** 更新当前激活通道的 byChannel 状态。 */
	const patchChannel = (p) => patchChannelState(state.channel, p);
	/** 当前激活通道的设置状态（自动同步/模式/加密/快照）。 */
	const chState = state.byChannel[state.channel];
	/** GitHub 流程态（不进 store 切片；commit 的镜像写幂等无害）。 */
	const patchGithub = (p) => commit({
		...stateRef.current,
		github: {
			...stateRef.current.github,
			...p
		}
	});
	/** GitHub 轮询定时器（卸载/取消时清理，防止泄漏与跨流程串扰） */
	const githubPollTimer = (0, react.useRef)(null);
	/** 通道配置自动保存：防抖 timer + 待发 payload（关闭设置页前 flush，不丢输入） */
	const saveTimer = (0, react.useRef)(null);
	const pendingSave = (0, react.useRef)(null);
	/** 保存请求在途（防重入：保存中又排入新改动 → 完成后补发最新 payload） */
	const savingRef = (0, react.useRef)(false);
	/** 正在拉取远端快照列表（按通道独立防抖/防并发） */
	const loadingSnapshotsRef = (0, react.useRef)({
		git: false,
		webdav: false
	});
	/** 挂载时读取同步状态（配置回填 + 上次同步时间 + 凭据状态 + 两通道 autosync/selection） */
	const loadStatus = async () => {
		patch({
			loading: true,
			loadError: null
		});
		try {
			const info = await api.status();
			const savedChannel = info.transport?.type === "webdav" ? "webdav" : "git";
			const remembered = info.lastSyncChannel ?? readStoredChannel();
			const catalog = info.syncSections !== void 0 ? syncSectionOptions(info.syncSections) : [];
			const selByCh = info.syncSelectionByChannel;
			const autoByCh = info.autosyncByChannel;
			const backfill = (ch, cur) => {
				const sel = selByCh?.[ch];
				const auto = autoByCh?.[ch];
				return {
					syncMode: sel?.mode === "advanced" ? "advanced" : "default",
					syncSections: sel !== void 0 ? sel.sections : recommendedSyncSections(info.syncSections ?? []),
					encrypt: sel?.encrypt ?? false,
					includeSecrets: sel?.includeSecrets ?? false,
					autosyncEnabled: auto?.enabled ?? false,
					autosyncInterval: auto?.interval ?? "30m"
				};
			};
			patch({
				loading: false,
				statusInfo: info,
				channel: remembered ?? savedChannel,
				repoUrl: info.repoUrl ?? "",
				webdavUrl: info.webdav?.url ?? "",
				webdavUsername: info.webdav?.username ?? "",
				catalog,
				byChannel: {
					git: {
						...stateRef.current.byChannel.git,
						...backfill("git", stateRef.current.byChannel.git)
					},
					webdav: {
						...stateRef.current.byChannel.webdav,
						...backfill("webdav", stateRef.current.byChannel.webdav)
					}
				}
			});
			if (autoByCh === void 0) loadAutosync();
			const activeCh = remembered ?? savedChannel;
			const preset = activeCh === "webdav" ? info.webdav?.url ?? "" : info.repoUrl ?? "";
			if (info.configured && preset.trim() !== "") loadSnapshots(preset, activeCh);
			validateGithub();
		} catch (err) {
			patch({
				loading: false,
				loadError: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 读取全部通道的自动同步状态（GET /sync/autosync 返回 { git, webdav }）。 */
	const loadAutosync = async () => {
		try {
			const all = await api.autosyncStatusAll();
			patchChannelState("git", {
				autosync: all.git,
				autosyncEnabled: all.git.enabled,
				autosyncInterval: all.git.interval
			});
			patchChannelState("webdav", {
				autosync: all.webdav,
				autosyncEnabled: all.webdav.enabled,
				autosyncInterval: all.webdav.interval
			});
		} catch (err) {
			patch({ error: err instanceof Error ? err.message : String(err) });
		}
	};
	/**
	* 读取指定通道的远端历史快照列表（「选择历史快照」下拉数据源）。
	* urlOverride / channelOverride：挂载时地址刚从 status 回填、state.patch 尚未生效，
	* 直接传 info 的地址与通道避免竞态读旧值；缺省读当前 state。
	* 无远端地址时静默跳过（不发无效请求，下拉留空）。
	*/
	const loadSnapshots = async (urlOverride, channelOverride) => {
		const ch = channelOverride ?? stateRef.current.channel;
		if (loadingSnapshotsRef.current[ch]) return;
		loadingSnapshotsRef.current[ch] = true;
		patchChannelState(ch, { loadingSnapshots: true });
		try {
			const s = stateRef.current;
			if (ch === "webdav") {
				const url = urlOverride ?? s.webdavUrl;
				if (url.trim() === "") return;
				const res = await api.snapshotsList({
					transport: "webdav",
					url: url.trim(),
					username: s.webdavUsername.trim() !== "" ? s.webdavUsername.trim() : void 0,
					password: s.webdavPassword !== "" ? s.webdavPassword : void 0
				});
				patchChannelState("webdav", { snapshots: res.snapshots });
			} else {
				const repo = urlOverride ?? s.repoUrl;
				if (repo.trim() === "") return;
				const res = await api.snapshotsList({
					transport: "git",
					repoUrl: repo.trim(),
					token: s.token.trim() !== "" ? s.token.trim() : void 0
				});
				patchChannelState("git", { snapshots: res.snapshots });
			}
		} catch {} finally {
			loadingSnapshotsRef.current[ch] = false;
			patchChannelState(ch, { loadingSnapshots: false });
		}
	};
	(0, react.useEffect)(() => {
		loadStatus();
	}, []);
	/** 卸载时置挂载守卫 + 清理轮询定时器 + 补发未落盘的通道配置改动 + 最后镜像一次状态
	*  （组件销毁后不得再 setState/发请求；store 镜像为纯内存/白名单写，安全）。
	*  异步操作完成回调仍会走 commit 写 store（见 commit 注释），结果不丢。 */
	(0, react.useEffect)(() => () => {
		mountedRef.current = false;
		if (githubPollTimer.current !== null) clearTimeout(githubPollTimer.current);
		if (saveTimer.current !== null) {
			clearTimeout(saveTimer.current);
			saveTimer.current = null;
		}
		const pending = pendingSave.current;
		if (pending !== null) api.saveConfig(pending).catch(() => {});
		runStore.patch({ sync: toSyncStoreSlice(stateRef.current) });
	}, []);
	/** 表单快照 → 请求体（按当前通道构建；空串不携带；password 仅内存不发回显） */
	const payload = () => {
		if (state.channel === "webdav") return {
			transport: "webdav",
			url: state.webdavUrl.trim() !== "" ? state.webdavUrl.trim() : void 0,
			username: state.webdavUsername.trim() !== "" ? state.webdavUsername.trim() : void 0,
			password: state.webdavPassword !== "" ? state.webdavPassword : void 0
		};
		return {
			transport: "git",
			repoUrl: state.repoUrl.trim(),
			token: state.token.trim() !== "" ? state.token : void 0
		};
	};
	/** 按给定 state 构建「保存配置」请求体；当前通道远端地址未就绪（webdav url / git repoUrl 为空）
	*  → 返回 null（无可保存内容，自动保存跳过）。password/token 仅非空携带（空 = 沿用已保存凭据）。 */
	const buildConfigPayload = (s) => {
		if (s.channel === "webdav") {
			const url = s.webdavUrl.trim();
			if (url === "") return null;
			return {
				transport: "webdav",
				url,
				username: s.webdavUsername.trim() !== "" ? s.webdavUsername.trim() : void 0,
				password: s.webdavPassword !== "" ? s.webdavPassword : void 0
			};
		}
		const repoUrl = s.repoUrl.trim();
		if (repoUrl === "") return null;
		return {
			transport: "git",
			repoUrl,
			token: s.token.trim() !== "" ? s.token.trim() : void 0
		};
	};
	/** 实际发送保存请求：成功清空已入库的 password/token（与 push 一致）并刷新凭据徽章；
	*  失败保留表单值以便重试。防重入：保存中又排入新改动 → 完成后自动补发最新 payload。 */
	const doSaveConfig = async (payloadToSave) => {
		if (savingRef.current) {
			pendingSave.current = payloadToSave;
			return;
		}
		savingRef.current = true;
		patch({
			savingConfig: true,
			error: null
		});
		try {
			const saved = await api.saveConfig(payloadToSave);
			const s = stateRef.current;
			const next = {
				...s,
				savingConfig: false
			};
			next.webdavPassword = s.webdavPassword !== "" && s.webdavPassword !== payloadToSave.password ? s.webdavPassword : "";
			next.token = s.token !== "" && s.token !== payloadToSave.token ? s.token : "";
			if (s.statusInfo !== null) {
				const info = {
					...s.statusInfo,
					configured: true,
					credentialConfigured: saved.credentialConfigured
				};
				if (saved.webdav !== void 0) info.webdav = {
					url: s.statusInfo.webdav?.url,
					username: s.statusInfo.webdav?.username,
					usernameConfigured: saved.webdav.usernameConfigured,
					passwordConfigured: saved.webdav.passwordConfigured
				};
				next.statusInfo = info;
			}
			commit(next);
			if (payloadToSave.transport !== "webdav" && saved.credentialConfigured) validateGithub();
		} catch (err) {
			patch({
				savingConfig: false,
				error: err instanceof Error ? err.message : String(err)
			});
		} finally {
			savingRef.current = false;
			if (pendingSave.current !== null) {
				const p = pendingSave.current;
				pendingSave.current = null;
				doSaveConfig(p);
			}
		}
	};
	/** 表单改动 → 防抖 600ms 自动保存（取最新 state；地址未就绪时跳过）。 */
	const scheduleConfigSave = () => {
		const payloadToSave = buildConfigPayload(stateRef.current);
		pendingSave.current = payloadToSave;
		if (saveTimer.current !== null) clearTimeout(saveTimer.current);
		if (payloadToSave === null) {
			saveTimer.current = null;
			return;
		}
		saveTimer.current = setTimeout(() => {
			saveTimer.current = null;
			flushConfigSave();
		}, 600);
	};
	/** 立即保存（「保存配置」按钮 / 防抖到点）：优先待发改动，否则按当前表单值。 */
	const flushConfigSave = () => {
		if (saveTimer.current !== null) {
			clearTimeout(saveTimer.current);
			saveTimer.current = null;
		}
		const pending = pendingSave.current;
		pendingSave.current = null;
		const payloadToSave = pending ?? buildConfigPayload(stateRef.current);
		if (payloadToSave === null) return;
		doSaveConfig(payloadToSave);
	};
	/** 发起 GitHub 登录：取设备码 → 展示一次性用户码 + 授权页 → 开始轮询 */
	const runGithubStart = async () => {
		patchGithub({
			phase: "starting",
			error: null
		});
		try {
			const info = await api.githubStart();
			patchGithub({
				phase: "waiting",
				flowId: info.flowId,
				userCode: info.userCode,
				verificationUri: info.verificationUri,
				interval: info.interval
			});
			scheduleGithubPoll(info.flowId, Math.max(info.interval, 1) * 1e3);
		} catch (err) {
			patchGithub({
				phase: "error",
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 排定一次 GitHub 轮询（先清旧定时器，避免重复轮询） */
	const scheduleGithubPoll = (flowId, delayMs) => {
		if (githubPollTimer.current !== null) clearTimeout(githubPollTimer.current);
		githubPollTimer.current = setTimeout(() => {
			runGithubPoll(flowId);
		}, delayMs);
	};
	/** 轮询 GitHub 授权结果：pending 继续等；success 刷新凭据状态；终止态展示结果 */
	const runGithubPoll = async (flowId) => {
		patchGithub({ phase: "polling" });
		try {
			const poll = await api.githubPoll(flowId);
			if (poll.status === "pending") {
				patchGithub({ phase: "waiting" });
				scheduleGithubPoll(flowId, poll.pollDelayMs ?? Math.max(state.github.interval, 1) * 1e3);
				return;
			}
			const message = githubPollMessage(poll, uiT);
			if (poll.status === "success") {
				patch({
					githubSignedIn: true,
					github: {
						...stateRef.current.github,
						phase: "success",
						error: null
					}
				});
				loadStatus();
			} else patchGithub({
				phase: "error",
				error: message
			});
		} catch (err) {
			patchGithub({
				phase: "error",
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 取消登录：停轮询 + 通知宿主丢弃设备码登记 + 复位 UI */
	const runGithubCancel = async () => {
		if (githubPollTimer.current !== null) {
			clearTimeout(githubPollTimer.current);
			githubPollTimer.current = null;
		}
		const flowId = state.github.flowId;
		patchGithub(initialGithub);
		if (flowId !== "") try {
			await api.githubCancel(flowId);
		} catch {}
	};
	/**
	* 校验 GitHub token 是否有效（「已登录」判定 → 决定登录块显隐）。
	* 挂载 / 登录成功 / 保存凭据后调用；已确认登录（githubSignedIn===true）时跳过
	* （避免反复网络调用）。401 → 未登录：显示登录块并提示重新登录；网络等其余
	* 错误 → 保持现状（不误判登出，已登录用户不被打扰；下次进入页面会再校验）。
	*/
	const validateGithub = async () => {
		if (stateRef.current.githubSignedIn === true) return;
		try {
			const res = await api.githubValidate();
			patch({ githubSignedIn: res.configured && res.valid });
		} catch {}
	};
	/** 打开通道配置弹窗：登录态尚未校验时补一次校验（决定 Git 子 tab 登录块显隐）。 */
	const openChannelDialog = () => {
		setChannelOpen(true);
		if (stateRef.current.githubSignedIn === null) validateGithub();
	};
	/**
	* 关闭通道配置弹窗 = 放弃本次操作（§8.12 约定）：GitHub 登录流程进行中则取消
	* （停轮询 + 通知宿主丢弃设备码登记），保存中（savingConfig）时禁止关闭。
	*/
	const closeChannelDialog = () => {
		if (stateRef.current.savingConfig) return;
		const phase = stateRef.current.github.phase;
		if (phase === "starting" || phase === "waiting" || phase === "polling") runGithubCancel();
		setChannelOpen(false);
	};
	/** 组装 push/preview 的公共载荷（分区选择 + 加密选项；密码仅内存） */
	const buildPushPayload = () => {
		const selection = chState.syncMode === "advanced" && chState.syncSections.length > 0 ? { sections: chState.syncSections } : {};
		const cryptoOpts = chState.encrypt || chState.includeSecrets ? {
			encrypt: true,
			encryptPassword: chState.encryptPassword,
			includeSecrets: chState.includeSecrets
		} : {};
		return {
			...payload(),
			...selection,
			...cryptoOpts
		};
	};
	/** P0-②：push 前只读预览（弹窗确认流程第一步）——不写远端，只展示「将推送什么」。 */
	const runPushPreview = async () => {
		patch({
			busy: "push",
			error: null,
			pushReport: null,
			pullReport: null
		});
		try {
			const preview = await api.pushPreview(buildPushPayload());
			patch({
				busy: null,
				pushPreview: {
					preview,
					open: true
				}
			});
		} catch (err) {
			patch({
				busy: null,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** P0-②：确认弹窗里点「确认推送」→ 真正推送（复用既有 push 语义）。 */
	const runPush = async () => {
		patch({
			busy: "push",
			error: null,
			pushReport: null,
			pullReport: null
		});
		try {
			const report = await api.push(buildPushPayload());
			patch({
				busy: null,
				pushReport: report,
				pushPreview: {
					preview: null,
					open: false
				},
				...report.ok ? {
					token: "",
					webdavPassword: ""
				} : {}
			});
			if (report.ok) {
				patchChannel({
					encryptPassword: "",
					encryptPasswordConfirm: ""
				});
				loadSnapshots();
			}
		} catch (err) {
			patch({
				busy: null,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	const runPull = async () => {
		patch({
			busy: "pull",
			error: null,
			pullReport: null,
			pushReport: null
		});
		try {
			const decrypt = chState.decryptPassword !== "" ? { decryptPassword: chState.decryptPassword } : {};
			const report = await api.pull({
				...payload(),
				...decrypt
			});
			patch({
				busy: null,
				pullReport: report,
				token: "",
				webdavPassword: ""
			});
			patchChannel({ decryptPassword: "" });
		} catch (err) {
			patch({
				busy: null,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 保存当前通道的分区选择到 Host（持久化；自动同步与手动 push 共用；失败提示但不阻断本地 UI）。
	*  附带持久化加密/密钥开关（密码不持久化）。 */
	const saveSelection = async (mode, sections, encrypt = chState.encrypt, includeSecrets = chState.includeSecrets) => {
		try {
			await api.saveSelection({
				transport: state.channel,
				mode,
				sections,
				encrypt,
				includeSecrets
			});
		} catch (err) {
			patch({ error: err instanceof Error ? err.message : String(err) });
		}
	};
	/** 切换当前通道的同步模式并持久化（高级模式勾选沿用当前勾选，切回时保留）。 */
	const setSyncMode = (mode) => {
		patchChannel({ syncMode: mode });
		saveSelection(mode, state.byChannel[state.channel].syncSections);
	};
	/** 当前通道高级模式勾选分区开关（增删 byChannel 勾选并立即持久化）。 */
	const toggleSyncSection = (id, checked) => {
		const cur = state.byChannel[state.channel].syncSections;
		const next = checked ? cur.includes(id) ? cur : [...cur, id] : cur.filter((s) => s !== id);
		patchChannel({ syncSections: next });
		saveSelection(state.byChannel[state.channel].syncMode, next);
	};
	/** 当前通道加密备份开关（持久化）。取消加密时若勾选着导出密钥 → 一并取消（密钥必须加密，安全底线）。 */
	const setEncrypt = (next) => {
		patchChannel({
			encrypt: next,
			includeSecrets: next ? chState.includeSecrets : false,
			...next ? {} : {
				encryptPassword: "",
				encryptPasswordConfirm: ""
			}
		});
		saveSelection(state.byChannel[state.channel].syncMode, state.byChannel[state.channel].syncSections, next, next ? chState.includeSecrets : false);
	};
	/** 当前通道导出密钥开关（持久化）。勾选时自动联动选中加密（密钥绝不明文进同步通道）。 */
	const setIncludeSecrets = (next) => {
		patchChannel({
			includeSecrets: next,
			encrypt: next ? true : chState.encrypt
		});
		saveSelection(state.byChannel[state.channel].syncMode, state.byChannel[state.channel].syncSections, next ? true : chState.encrypt, next);
	};
	/** 默认（快速导出）模式的推荐分区数（渲染计数用；catalog 已只含 portable）。 */
	const recommendedSectionCount = state.catalog.filter((c) => c.defaultIncluded).length;
	/** 一键同步：拉取 → 差异确认会话（先取消旧会话，再发起新会话）。 */
	const runSync = async (snapshotId) => {
		if (state.confirmSession !== null) try {
			await api.cancel(state.confirmSession.syncSessionId);
		} catch {}
		patch({
			busy: "sync",
			error: null,
			confirmSession: null,
			confirmDecisions: null,
			lastRestoreId: null
		});
		try {
			const decrypt = chState.decryptPassword !== "" ? { decryptPassword: chState.decryptPassword } : {};
			const session = await api.sync({
				...payload(),
				...snapshotId !== void 0 && snapshotId !== "" ? { snapshotId } : {},
				...decrypt
			});
			if (!session.ok) {
				patch({
					busy: null,
					error: session.message ?? t("syncflow.syncFailed")
				});
				return;
			}
			patch({
				busy: null,
				confirmSession: session,
				confirmDecisions: null,
				token: "",
				webdavPassword: ""
			});
			patchChannel({ decryptPassword: "" });
			loadSnapshots();
		} catch (err) {
			patch({
				busy: null,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 用户取消差异确认：清除会话，复位到空闲。 */
	const cancelConfirm = () => {
		patch({
			confirmSession: null,
			confirmDecisions: null
		});
	};
	/** 从 SyncConfirmView 透传的一键回滚完成信号。 */
	const onRollbackApplied = () => {
		patch({ lastRestoreId: null });
	};
	/** 切换通道子 tab：记录偏好 + 拉取目标通道远端快照。busy 时禁用切换（防并发操作）。 */
	const switchChannel = (ch) => {
		if (ch === state.channel || state.busy !== null) return;
		patch({ channel: ch });
		writeStoredChannel(ch);
		api.saveUiPrefs({ lastSyncChannel: ch }).catch(() => {});
		loadSnapshots(void 0, ch);
	};
	const toggleAutosync = async (enabled) => {
		patch({ error: null });
		patchChannel({ autosyncEnabled: enabled });
		try {
			const updated = await api.autosyncUpdate({
				transport: state.channel,
				enabled,
				interval: chState.autosyncInterval
			});
			patchChannel({
				autosync: updated,
				autosyncEnabled: updated.enabled,
				autosyncInterval: updated.interval
			});
		} catch (err) {
			patch({ error: err instanceof Error ? err.message : String(err) });
		}
	};
	const updateAutosyncInterval = async (interval) => {
		patch({ error: null });
		patchChannel({ autosyncInterval: interval });
		try {
			const updated = await api.autosyncUpdate({
				transport: state.channel,
				enabled: chState.autosyncEnabled,
				interval
			});
			patchChannel({
				autosync: updated,
				autosyncEnabled: updated.enabled,
				autosyncInterval: updated.interval
			});
		} catch (err) {
			patch({ error: err instanceof Error ? err.message : String(err) });
		}
	};
	/** 活动通道的远端地址是否就绪（git=repoUrl 非空；webdav=webdavUrl 非空） */
	const remoteReady = computeRemoteReady(state.channel, state.repoUrl, state.webdavUrl);
	const buttons = computeSyncButtons(state.busy, remoteReady, uiT);
	const pushView = pushReportView(state.pushReport, uiT);
	const pullView = pullReportView(state.pullReport, uiT);
	const githubView = computeGithubLoginView(state.github.phase, state.github.userCode, state.github.verificationUri, state.github.error, uiT);
	/** GitHub 流程进行中（请求设备码 / 等待授权 / 轮询）：禁用 push/pull，避免无凭据操作 */
	const githubBusy = state.github.phase === "starting" || state.github.phase === "waiting" || state.github.phase === "polling";
	/** 高级模式勾选为空 → 禁止推送（默认模式不受限）。 */
	const pushSelectionReady = chState.syncMode !== "advanced" || chState.syncSections.length > 0;
	/** 加密推送校验：勾选加密时密码非空且两次一致（密码仅内存）。 */
	const encryptInvalid = (chState.encrypt || chState.includeSecrets) && (chState.encryptPassword === "" || chState.encryptPassword !== chState.encryptPasswordConfirm);
	const autosyncText = chState.autosync !== null ? autosyncStatusText(chState.autosync, uiT) : t("autosync.statusNever");
	/** 距下次自动同步剩余 ms（null = 从未运行；0 = 已到期） */
	const autosyncCountdownMs = chState.autosync !== null && chState.autosync.elapsedMs >= 0 ? computeAutosyncCountdown(chState.autosync.elapsedMs, autosyncIntervalMs(chState.autosync.interval)) : null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("section.label"),
				subtitle: t("section.description")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.groupLabel,
					children: t("channel.title")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.hint,
					children: t("channel.openHint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: state.channel === "webdav" ? t("channel.webdav") : t("channel.git")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: remoteReady ? "ok" : "warn",
							children: remoteReady ? t("channel.configured") : t("channel.notConfigured")
						}),
						state.channel === "git" && state.statusInfo?.credentialConfigured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "ok",
							children: t("config.tokenSaved")
						}),
						state.channel === "webdav" && state.statusInfo?.webdav?.passwordConfigured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "ok",
							children: t("webdav.passwordSaved")
						})
					]
				}),
				remoteReady && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: config_manager_module_css_default.hint,
					children: [
						t("channel.currentUrl"),
						"：",
						state.channel === "webdav" ? state.webdavUrl : state.repoUrl
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.actionRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: openChannelDialog,
						children: t("channel.open")
					})
				})
			] }),
			channelOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.dialogMask,
				onMouseDown: (e) => {
					if (e.target === e.currentTarget && !state.savingConfig) closeChannelDialog();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("channel.title"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogHeaderRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.dialogHeader,
							children: t("channel.title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: config_manager_module_css_default.dialogClose,
							"aria-label": t("common.close"),
							disabled: state.savingConfig,
							onClick: closeChannelDialog,
							children: "×"
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogBodyScroll,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.modeTabs,
								role: "tablist",
								children: channelTabModels(state.channel, state.busy !== null || state.savingConfig).map((tab) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									role: "tab",
									"aria-selected": tab.active,
									"data-active": tab.active ? "" : void 0,
									className: config_manager_module_css_default.modeTab,
									disabled: tab.disabled,
									onClick: () => {
										switchChannel(tab.channel);
									},
									children: tab.channel === "webdav" ? t("channel.webdav") : t("channel.git")
								}, tab.channel))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.modeHint,
								children: t("channel.perChannelHint")
							}),
							state.channel === "git" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: "warn",
								children: privateRepoHint(uiT)
							}),
							state.channel === "git" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.groupLabel,
									children: t("config.title")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: config_manager_module_css_default.field,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.fieldLabel,
											children: t("config.repoUrl")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "text",
											className: config_manager_module_css_default.input,
											value: state.repoUrl,
											placeholder: "https://github.com/user/private-repo.git",
											disabled: state.busy !== null,
											onChange: (e) => {
												patch({ repoUrl: e.target.value });
												scheduleConfigSave();
											}
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.hint,
											children: t("config.repoUrlHint")
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: config_manager_module_css_default.field,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: config_manager_module_css_default.fieldLabel,
											children: [
												t("config.token"),
												" ",
												state.statusInfo?.credentialConfigured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
													kind: "ok",
													children: t("config.tokenSaved")
												})
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "password",
											className: config_manager_module_css_default.input,
											value: state.token,
											autoComplete: "off",
											placeholder: t("config.tokenPlaceholder"),
											disabled: state.busy !== null,
											onChange: (e) => {
												patch({ token: e.target.value });
												scheduleConfigSave();
											}
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.hint,
											children: t("config.tokenHint", { ref: "DSH_CONFIG_MANAGER_SYNC_TOKEN" })
										})
									]
								}),
								state.githubSignedIn === false && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									state.statusInfo?.credentialConfigured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
										kind: "warn",
										children: t("github.tokenInvalid")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: config_manager_module_css_default.groupLabel,
										children: t("github.title")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: config_manager_module_css_default.hint,
										children: t("github.description")
									}),
									githubView.showCode && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: config_manager_module_css_default.statRow,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
											kind: "info",
											children: [
												t("github.userCode"),
												"：",
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: githubView.userCode })
											]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
											className: config_manager_module_css_default.ghostButton,
											href: githubView.verificationUri,
											target: "_blank",
											rel: "noreferrer",
											style: { textDecoration: "none" },
											children: t("github.openAuth")
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: config_manager_module_css_default.actionRow,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
											variant: "primary",
											disabled: !githubView.canStart || state.busy !== null,
											onClick: () => {
												runGithubStart();
											},
											children: githubView.startLabel
										}), githubView.canCancel && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
											disabled: state.busy !== null,
											onClick: () => {
												runGithubCancel();
											},
											children: t("github.cancel")
										})]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: config_manager_module_css_default.statRow,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: githubView.phase === "success" ? "ok" : githubView.phase === "error" ? "error" : "warn",
											children: githubView.statusText
										})
									}),
									githubView.phase === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: config_manager_module_css_default.hint,
										children: t("config.tokenHint", { ref: "DSH_CONFIG_MANAGER_SYNC_TOKEN" })
									})
								] })
							] }),
							state.channel === "webdav" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.groupLabel,
									children: t("webdav.title")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.hint,
									children: t("webdav.presetHint")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
									className: config_manager_module_css_default.select,
									value: presetIdForUrl(state.webdavUrl),
									disabled: state.busy !== null,
									onChange: (e) => {
										const p = presetById(e.target.value);
										patch({ webdavUrl: p.url });
										scheduleConfigSave();
									},
									children: WEBDAV_PRESETS.map((p) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: p.id,
										children: p.label
									}, p.id))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: config_manager_module_css_default.field,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.fieldLabel,
											children: t("webdav.url")
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "text",
											className: config_manager_module_css_default.input,
											value: state.webdavUrl,
											placeholder: "https://dav.example.com/dav/config",
											disabled: state.busy !== null,
											onChange: (e) => {
												patch({ webdavUrl: e.target.value });
												scheduleConfigSave();
											}
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.hint,
											children: t("webdav.urlHint")
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: config_manager_module_css_default.field,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: config_manager_module_css_default.fieldLabel,
											children: [
												t("webdav.username"),
												" ",
												state.statusInfo?.webdav?.usernameConfigured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
													kind: "ok",
													children: t("config.tokenSaved")
												})
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "text",
											className: config_manager_module_css_default.input,
											value: state.webdavUsername,
											autoComplete: "off",
											placeholder: "alice",
											disabled: state.busy !== null,
											onChange: (e) => {
												patch({ webdavUsername: e.target.value });
												scheduleConfigSave();
											}
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.hint,
											children: t("webdav.usernameHint")
										})
									]
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
									className: config_manager_module_css_default.field,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: config_manager_module_css_default.fieldLabel,
											children: [
												t("webdav.password"),
												" ",
												state.statusInfo?.webdav?.passwordConfigured === true && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
													kind: "ok",
													children: t("webdav.passwordSaved")
												})
											]
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "password",
											className: config_manager_module_css_default.input,
											value: state.webdavPassword,
											autoComplete: "off",
											placeholder: t("webdav.passwordPlaceholder"),
											disabled: state.busy !== null,
											onChange: (e) => {
												patch({ webdavPassword: e.target.value });
												scheduleConfigSave();
											}
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.hint,
											children: t("webdav.passwordHint", { ref: "DSH_CONFIG_MANAGER_SYNC_WEBDAV_PASSWORD" })
										})
									]
								})
							] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.actionRow,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "primary",
									disabled: state.busy !== null || state.savingConfig || !remoteReady,
									onClick: () => {
										flushConfigSave();
									},
									children: state.savingConfig ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("config.saving") }) : t("config.save")
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.hint,
								children: t("config.saveHint")
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.groupLabel,
					children: t("mode.title")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.hint,
					children: t("mode.hint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.modeTabs,
					role: "tablist",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": chState.syncMode === "default",
						"data-active": chState.syncMode === "default" ? "" : void 0,
						className: config_manager_module_css_default.modeTab,
						disabled: state.busy !== null,
						onClick: () => {
							setSyncMode("default");
						},
						children: t("mode.default")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": chState.syncMode === "advanced",
						"data-active": chState.syncMode === "advanced" ? "" : void 0,
						className: config_manager_module_css_default.modeTab,
						disabled: state.busy !== null,
						onClick: () => {
							setSyncMode("advanced");
						},
						children: t("mode.advanced")
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.modeHint,
					children: chState.syncMode === "default" ? t("mode.defaultHint") : t("mode.advancedHint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.hint,
					children: t("mode.persistHint")
				}),
				chState.syncMode === "advanced" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.groupLabel,
						children: t("mode.sectionsTitle")
					}),
					state.catalog.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.hint,
						children: t("common.loading")
					}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.groupList,
						children: syncSectionGroups(state.catalog).map((g) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
							className: config_manager_module_css_default.groupCard,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.groupHeader,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.groupLabel,
									children: g.label
								}), g.note !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.groupNote,
									children: g.note
								})]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.groupItems,
								children: g.items.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Checkbox, {
									checked: chState.syncSections.includes(s.id),
									onChange: (checked) => {
										toggleSyncSection(s.id, checked);
									},
									label: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: config_manager_module_css_default.categoryItem,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: config_manager_module_css_default.categoryName,
												children: s.label
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: config_manager_module_css_default.categoryDesc,
												children: s.description
											}),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
												kind: "info",
												children: t("mode.sectionPortable")
											}),
											s.defaultIncluded && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
												kind: "ok",
												children: t("mode.sectionRecommended")
											})
										]
									})
								}, s.id))
							})]
						}, g.group))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.hint,
						children: t("mode.sectionsHint")
					}),
					chState.syncSections.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
						kind: "warn",
						children: t("mode.atLeastOne")
					})
				] }),
				chState.syncMode === "default" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.hint,
					children: state.catalog.length === 0 ? t("common.loading") : t("mode.defaultCount", { n: String(recommendedSectionCount) })
				})
			] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.groupLabel,
					children: t("mode.security")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Checkbox, {
					checked: chState.encrypt,
					onChange: setEncrypt,
					label: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.categoryName,
						children: t("mode.encrypt")
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					children: t("mode.encryptHint")
				}),
				chState.encrypt && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.secretFields,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: config_manager_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.fieldLabel,
								children: t("mode.password")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "password",
								className: config_manager_module_css_default.input,
								value: chState.encryptPassword,
								autoComplete: "new-password",
								onChange: (e) => {
									patchChannel({ encryptPassword: e.target.value });
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: config_manager_module_css_default.field,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.fieldLabel,
								children: t("mode.passwordConfirm")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "password",
								className: config_manager_module_css_default.input,
								value: chState.encryptPasswordConfirm,
								autoComplete: "new-password",
								onChange: (e) => {
									patchChannel({ encryptPasswordConfirm: e.target.value });
								}
							})]
						}),
						chState.encryptPassword !== "" && chState.encryptPassword !== chState.encryptPasswordConfirm && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.formError,
							children: t("mode.passwordMismatch")
						}),
						chState.encryptPassword === "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.formError,
							children: t("mode.passwordRequired")
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Checkbox, {
					checked: chState.includeSecrets,
					onChange: setIncludeSecrets,
					label: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.categoryName,
						children: t("mode.includeSecrets")
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					children: t("mode.includeSecretsHint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.hint,
					children: t("mode.encryptAutosyncNotice")
				})
			] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
				className: config_manager_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.fieldLabel,
						children: t("mode.decryptPassword")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "password",
						className: config_manager_module_css_default.input,
						value: chState.decryptPassword,
						autoComplete: "off",
						onChange: (e) => {
							patchChannel({ decryptPassword: e.target.value });
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.hint,
						children: t("mode.decryptPasswordHint")
					})
				]
			}) }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: state.busy !== null || !remoteReady,
						onClick: () => {
							runSync();
						},
						children: state.busy === "sync" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("syncflow.syncing") }) : t("syncflow.button")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						disabled: !buttons.canPush || githubBusy || !pushSelectionReady || encryptInvalid,
						onClick: () => {
							runPushPreview();
						},
						children: state.busy === "push" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: buttons.pushLabel }) : buttons.pushLabel
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						disabled: !buttons.canPull || githubBusy,
						onClick: () => {
							runPull();
						},
						children: state.busy === "pull" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: buttons.pullLabel }) : buttons.pullLabel
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.statRow,
				style: {
					alignItems: "flex-end",
					gap: "8px"
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: config_manager_module_css_default.field,
					style: {
						flex: 1,
						minWidth: "200px"
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.fieldLabel,
							children: t("syncflow.selectSnapshot")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							className: config_manager_module_css_default.select,
							value: chState.selectedSnapshotId,
							disabled: state.busy !== null,
							onFocus: () => {
								loadSnapshots();
							},
							onMouseDown: () => {
								loadSnapshots();
							},
							onClick: () => {
								loadSnapshots();
							},
							onChange: (e) => {
								const id = e.target.value;
								patchChannel({ selectedSnapshotId: id });
								runSync(id === "" ? void 0 : id);
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "",
								children: t("syncflow.latestSnapshot")
							}), chState.snapshots.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
								value: s.id,
								children: [s.id, t("syncflow.snapshotOption", {
									date: s.createdAt.slice(0, 10),
									count: String(s.sectionCount)
								})]
							}, s.id))]
						}),
						chState.snapshots.length === 0 && !chState.loadingSnapshots && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.hint,
							children: t("syncflow.noSnapshots")
						})
					]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					disabled: state.busy !== null || chState.loadingSnapshots || !remoteReady,
					onClick: () => {
						loadSnapshots();
					},
					title: t("syncflow.refreshSnapshots"),
					children: chState.loadingSnapshots ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("syncflow.refreshingSnapshots") }) : `🔄 ${t("syncflow.refreshSnapshots")}`
				})]
			}),
			state.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, { error: state.error }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.groupLabel,
					children: t("autosync.title")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.hint,
					children: t("autosync.description")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: config_manager_module_css_default.checkboxRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: chState.autosyncEnabled,
						disabled: state.busy !== null,
						onChange: (e) => {
							toggleAutosync(e.target.checked);
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("autosync.enable") })]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: config_manager_module_css_default.field,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.fieldLabel,
							children: t("autosync.interval")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
							className: config_manager_module_css_default.input,
							value: chState.autosyncInterval,
							disabled: state.busy !== null,
							onChange: (e) => {
								updateAutosyncInterval(e.target.value);
							},
							children: AUTOSYNC_INTERVAL_OPTIONS.map((iv) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: iv,
								children: intervalLabel(iv, t)
							}, iv))
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.hint,
							children: t("autosync.intervalHint")
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: chState.autosync?.lastRunStatus === "failed" ? "error" : chState.autosync?.lastRunStatus === "skipped" ? "warn" : "info",
						children: autosyncText
					}), autosyncCountdownMs !== null && chState.autosyncEnabled && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "info",
						children: autosyncCountdownMs <= 0 ? t("autosync.due") : t("autosync.nextRun", { time: formatIntervalDuration(autosyncCountdownMs, uiT) })
					})]
				})
			] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SyncHistoryView, {
				api,
				t
			}),
			state.pushPreview.open && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.dialogMask,
				onMouseDown: (e) => {
					if (e.target === e.currentTarget && state.busy !== "push") patch({ pushPreview: {
						preview: null,
						open: false
					} });
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("syncflow.pushPreviewTitle"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogHeaderRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.dialogHeader,
							children: t("syncflow.pushPreviewTitle")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: config_manager_module_css_default.dialogClose,
							"aria-label": t("common.close"),
							disabled: state.busy === "push",
							onClick: () => {
								patch({ pushPreview: {
									preview: null,
									open: false
								} });
							},
							children: "×"
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogBodyScroll,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(PushPreviewCard, {
							preview: state.pushPreview.preview,
							t,
							uiT
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.actionRow,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								disabled: state.busy === "push",
								onClick: () => {
									patch({ pushPreview: {
										preview: null,
										open: false
									} });
								},
								children: t("syncflow.cancel")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								variant: "primary",
								disabled: state.busy === "push",
								onClick: () => {
									runPush();
								},
								children: state.busy === "push" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("syncflow.pushing") }) : t("syncflow.pushConfirm")
							})]
						})]
					})]
				})
			}),
			state.pushReport !== null && pushView !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.dialogMask,
				onMouseDown: (e) => {
					if (e.target === e.currentTarget) patch({ pushReport: null });
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
					style: {
						width: "min(640px, 100%)",
						maxHeight: "85vh"
					},
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("push.title"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogHeaderRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.dialogHeader,
							children: t("push.title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: config_manager_module_css_default.dialogClose,
							onClick: () => {
								patch({ pushReport: null });
							},
							"aria-label": t("common.close"),
							children: "×"
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogBodyScroll,
						style: { maxHeight: "70vh" },
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: pushView.kind === "ok" ? "ok" : "error",
								children: pushView.headline
							}),
							pushView.sections.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.fieldLabel,
								children: t("sections.title")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.statRow,
								children: pushView.sections.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "info",
									children: s
								}, s))
							})] }),
							pushView.warnings.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.fieldLabel,
								children: t("warnings.title")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
								className: config_manager_module_css_default.warnList,
								children: pushView.warnings.map((w, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: w }, i))
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.actionRow,
								style: { marginTop: "12px" },
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "primary",
									onClick: () => {
										patch({ pushReport: null });
									},
									children: t("common.close")
								})
							})
						]
					})]
				})
			}),
			state.pullReport !== null && pullView !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.dialogMask,
				onMouseDown: (e) => {
					if (e.target === e.currentTarget) patch({ pullReport: null });
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
					style: {
						width: "min(720px, 100%)",
						maxHeight: "85vh"
					},
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("pull.title"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogHeaderRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.dialogHeader,
							children: t("pull.title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: config_manager_module_css_default.dialogClose,
							onClick: () => {
								patch({ pullReport: null });
							},
							"aria-label": t("common.close"),
							children: "×"
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogBodyScroll,
						style: { maxHeight: "70vh" },
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: pullView.kind === "ok" ? "info" : pullView.kind === "empty" ? "ok" : "error",
								children: pullView.headline
							}),
							pullView.summary !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: config_manager_module_css_default.statRow,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "info",
											children: t("change.total", { total: pullView.summary.total })
										}),
										pullView.summary.error > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
											kind: "error",
											children: [
												severityLabel("error", uiT),
												" × ",
												pullView.summary.error
											]
										}),
										pullView.summary.warning > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
											kind: "warn",
											children: [
												severityLabel("warning", uiT),
												" × ",
												pullView.summary.warning
											]
										}),
										pullView.summary.info > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
											kind: "info",
											children: [
												severityLabel("info", uiT),
												" × ",
												pullView.summary.info
											]
										})
									]
								}),
								pullView.summary.needsReview && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
									kind: "warn",
									children: t("pull.needsReview")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.pullScroll,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: config_manager_module_css_default.reportList,
										children: pullView.summary.items.map((c) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
											className: config_manager_module_css_default.statRow,
											children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: config_manager_module_css_default.kindTag,
													children: kindLabel(c.kind, uiT)
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
													kind: c.severity === "error" ? "error" : c.severity === "warning" ? "warn" : "info",
													children: severityLabel(c.severity, uiT)
												}),
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: c.description })
											]
										}, c.id))
									})
								})
							] }),
							pullView.previewHint !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: "info",
								children: pullView.previewHint
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.actionRow,
								style: { marginTop: "12px" },
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "primary",
									onClick: () => {
										patch({ pullReport: null });
									},
									children: t("common.close")
								})
							})
						]
					})]
				})
			}),
			state.confirmSession !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.dialogMask,
				onMouseDown: (e) => {
					if (e.target === e.currentTarget && state.busy !== "sync") cancelConfirm();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
					style: {
						width: "min(820px, 100%)",
						maxHeight: "85vh"
					},
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("syncflow.title"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogHeaderRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.dialogHeader,
							children: t("syncflow.title")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: config_manager_module_css_default.dialogClose,
							onClick: cancelConfirm,
							"aria-label": t("common.close"),
							children: "×"
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.dialogBodyScroll,
						style: { maxHeight: "72vh" },
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SyncConfirmView, {
							api,
							syncSessionId: state.confirmSession.syncSessionId,
							snapshotId: state.confirmSession.snapshotId,
							items: state.confirmSession.items,
							needsReview: state.confirmSession.needsReview,
							compatibility: state.confirmSession.compatibility,
							t,
							decisions: state.confirmDecisions,
							onDecisionsChange: (d) => {
								patch({ confirmDecisions: d });
							},
							onCancel: cancelConfirm,
							onRollbackDone: onRollbackApplied
						})
					})]
				})
			})
		]
	});
}
/** P0-②：push 预览内容（绑 src/ui/i18n.ts 的 UiT 文案；纯展示，无敏感字段）。 */
function PushPreviewCard({ preview, t, uiT }) {
	const view = pushPreviewView(preview, uiT);
	if (view === null) return null;
	if (view.error !== null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
		kind: "error",
		children: view.error
	});
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
			kind: "info",
			children: view.headline
		}),
		view.previewHint !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.hint,
			children: view.previewHint
		}),
		view.remoteSnapshotCount === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
			kind: "warn",
			children: t("syncflow.pushFirstBaseline")
		}),
		view.encryptedHint !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
			kind: "warn",
			children: view.encryptedHint
		}),
		/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
			className: config_manager_module_css_default.card,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("syncflow.pushPreviewSections")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.planScroll,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: config_manager_module_css_default.reportList,
					children: view.rows.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.kindTag,
							children: row.changed ? "changed" : "unchanged"
						}),
						" ",
						row.section,
						" · ",
						row.count
					] }, row.section))
				})
			})]
		})
	] });
}
/** AutosyncInterval → 可读标签（复用 i18n interval 键）。 */
function intervalLabel(iv, t) {
	switch (iv) {
		case "5m": return t("autosync.interval5m");
		case "15m": return t("autosync.interval15m");
		case "30m": return t("autosync.interval30m");
		case "60m": return t("autosync.interval60m");
		case "6h": return t("autosync.interval6h");
		case "12h": return t("autosync.interval12h");
		case "24h": return t("autosync.interval24h");
		default: return iv;
	}
}
//#endregion
//#region src/market/builtin.ts
/**
* m-market：内置（官方）配置市场仓库。
*
* 产品决策（2026-08）：「内置市场 = 由创建者 xiajiajun516 维护的公开 Read-Only 仓库，
* 只绑定、不可编辑」。市场面板不再允许用户手动添加/移除市场仓库；本模块是唯一来源。
*
* 运行时可经 `DSH_CONFIG_MARKET_URL` 覆盖（便于维护者切换/预览其他仓库），默认指向
* 官方公开市场。公开仓库：无需任何凭据（继承 m-market 的“无 secret”硬不变式）。
*
* ⚠️ 浏览器安全：本模块会被 web 端（MarketPanel）直接打包加载，浏览器没有 Node 的
* `process` 全局。因此在模块顶层读取环境变量时必须用 `typeof process !== 'undefined'`
* 防御，否则会抛 `ReferenceError: process is not defined` 导致插件加载失败。
*/
const DEFAULT_MARKET_URL = "https://github.com/xiajiajun516/dsh-config-market.git";
/** 内置市场仓库 URL（host/Node 端可经 `DSH_CONFIG_MARKET_URL` 覆盖；web 端安全回退默认官方地址）。 */
const BUILTIN_MARKET_URL = (typeof process !== "undefined" && process.env?.DSH_CONFIG_MARKET_URL ? process.env.DSH_CONFIG_MARKET_URL : DEFAULT_MARKET_URL).trim();
/** 内置市场是否为默认官方地址（固定默认值比较，不随 env 覆盖变化，保证 UI 判断稳定）。 */
function isOfficialMarket(url) {
	return url.trim() === DEFAULT_MARKET_URL;
}
//#endregion
//#region src/market/github-repos.ts
/**
* 官方收录目标仓库（产品决策 2026-08-20，docs/design/2026-08-20-my-configs-design.md §2.4）：
* 收录 / PR 相关目标**固定**为 xiajiajun516/dsh-config-market，写死常量、界面不提供任何修改入口。
* 与 src/market/builtin.ts 的内置市场为同一仓库（内置市场 URL 可经 env 覆盖仅用于浏览，
* 收录目标不受 env 影响，恒为官方仓库）。
*/
const MARKET_UPSTREAM_OWNER = "xiajiajun516";
/** 官方收录目标仓库名（见 MARKET_UPSTREAM_OWNER） */
const MARKET_UPSTREAM_REPO = "dsh-config-market";
//#endregion
//#region src/client/market/disclaimer.ts
/** localStorage key 前缀（按 key 隔离三个操作） */
const DISCLAIMER_STORAGE_PREFIX = "dsh-cm-market.disclaimer.";
/** 由操作 key 生成 localStorage key。 */
function disclaimerStorageKey(key) {
	return `${DISCLAIMER_STORAGE_PREFIX}${key}`;
}
/** 读取「不再提示」状态（true = 已勾选，该操作以后不再弹免责；任何异常 → false）。 */
function readDisclaimerDismissed(key, storage) {
	try {
		return storage.getItem(disclaimerStorageKey(key)) === "1";
	} catch {
		return false;
	}
}
/** 写入「不再提示」状态（勾选后调用；存储不可用时静默忽略）。 */
function writeDisclaimerDismissed(key, storage) {
	try {
		storage.setItem(disclaimerStorageKey(key), "1");
	} catch {}
}
//#endregion
//#region src/client/market/my-configs-view.ts
/**
* 「我的配置」区块的客户端纯渲染装配层（m-my-configs-view，node 可测）。
*
* 设计纪律（docs/design/2026-08-20-my-configs-design.md §4.5 / §4.6）：
*  - 全部无副作用纯函数，React 壳（MyConfigsView）只装配，不承载业务逻辑；
*  - 输入数据一律由调用方（组件 / api 层）提供 —— 本文件不发起任何请求，不持有凭据；
*  - 录入最小化（§1.2）：表单仅 name（预填 zip 文件名，可改）/ description（可选）/
*    categories（可选）；id / author / version / updatedAt 均为系统自动生成，
*    界面以「系统自动」徽章展示（MY_CONFIG_AUTO_FIELDS）；
*  - 收录状态三态（§4.5）：未收录（本地独有）｜ PR 待审核（带 PR 链接）｜ 已收录
*    （官方 dsh-config-market/index.json 含该 id）；已收录 > PR 待审核 > 未收录
*    （官方已收录时即使存在 open PR 也以收录为准——PR 已合并后不应再显示待审核）；
*  - open PR 匹配按固定分支 `dsh-market-sync/<itemId>`（§2.4 自动 PR 分支约定）；
*  - 文案走 src/ui/i18n.ts 的 UiT（'myConfigs.*' 键，zh 源 / en 镜像），不硬编码中文。
*
* 安全硬约束：本层只做展示推导，不接触 token / 凭据；PR URL 由调用方提供，
* 渲染前仍过 redact() 兜底（与全站一致）。
*/
/**
* 登录状态推导（纯函数）：loading 优先；authError 非空（401 等）→ token 失效；
* 否则按 status.loggedIn 区分已登录 / 未登录。输入由调用方提供。
*/
function deriveLoginState(input) {
	if (input.loading) return { kind: "loading" };
	if (input.authFailed) return { kind: "token-invalid" };
	const s = input.status;
	if (s !== null && s.loggedIn) return {
		kind: "logged-in",
		login: s.login ?? "",
		repoUrl: s.repoUrl ?? "",
		repoExists: s.repoExists ?? false
	};
	return { kind: "logged-out" };
}
/** 空表单初值（React 壳 useState 初始 + 测试用）。 */
const EMPTY_MY_CONFIG_FORM = {
	name: "",
	description: "",
	categories: "",
	id: "",
	publishMode: "migrate"
};
/** 表单校验：名称必填（trim 后非空）。描述/类别可选。 */
function validateMyConfigForm(form, t = zhUiT) {
	return { name: form.name.trim() === "" ? t("myConfigs.form.errorName") : null };
}
/** 表单是否全部合法（上传按钮可用性）。 */
function myConfigFormValid(errors) {
	return errors.name === null;
}
/** 逗号分隔类别文本 → 去空白数组（空结果 = 无类别；与 PublishView 相同语义）。 */
function parseCategories(csv) {
	return csv.split(",").map((c) => c.trim()).filter((c) => c !== "");
}
/** 向导初始状态常量（initialWizard('upload') 语义；调用方应经 initialWizard 获取新对象）。 */
const EMPTY_MY_WIZARD = {
	mode: "upload",
	step: "select",
	zipPath: null,
	fileName: null,
	validating: false,
	validated: false,
	validationError: null,
	form: { ...EMPTY_MY_CONFIG_FORM },
	formErrors: { name: null },
	running: false,
	result: null,
	error: null
};
/** 全量状态 → 持久化切片（忽略 validating/running/formErrors；form 浅拷贝，result 直接引用纯 JSON）。 */
function toMyWizardSlice(w) {
	return {
		mode: w.mode,
		step: w.step,
		zipPath: w.zipPath,
		fileName: w.fileName,
		validated: w.validated,
		validationError: w.validationError,
		form: { ...w.form },
		result: w.result,
		error: w.error
	};
}
/**
* 持久化切片 → 全量状态（null → 全新向导）。瞬态字段归零（validating/running 恒 false），
* formErrors 按 form 经 validateMyConfigForm 重算；form 拷贝新对象（不共享切片引用）。
*/
function restoreMyWizard(slice) {
	if (slice === null) return {
		...EMPTY_MY_WIZARD,
		form: { ...EMPTY_MY_CONFIG_FORM }
	};
	return {
		mode: slice.mode,
		step: slice.step,
		zipPath: slice.zipPath,
		fileName: slice.fileName,
		validating: false,
		validated: slice.validated,
		validationError: slice.validationError,
		form: { ...slice.form },
		formErrors: validateMyConfigForm(slice.form),
		running: false,
		result: slice.result,
		error: slice.error
	};
}
/** 指定模式的向导初始状态（form 全新空表；mode/step 之外同 EMPTY_MY_WIZARD）。 */
function initialWizard(mode) {
	return {
		...EMPTY_MY_WIZARD,
		mode,
		form: { ...EMPTY_MY_CONFIG_FORM }
	};
}
/** 全量状态 → 持久化切片（忽略 importing；detail/approvals/importResult 直接引用纯 JSON/布尔表）。 */
function toMyInstallSlice(s) {
	return {
		itemId: s.itemId,
		detail: s.detail,
		approvals: s.approvals,
		importResult: s.importResult,
		error: s.error
	};
}
/** 持久化切片 → 全量状态（null → 无装回本地会话；importing 恢复后恒 false）。 */
function restoreMyInstall(slice) {
	if (slice === null) return null;
	return {
		itemId: slice.itemId,
		detail: slice.detail,
		approvals: slice.approvals,
		importing: false,
		importResult: slice.importResult,
		error: slice.error
	};
}
/** 系统自动字段徽章列表（id/作者/版本/更新时间 → 「系统自动」徽章）。 */
function autoFieldBadges(t = zhUiT) {
	const autoText = t("myConfigs.autoField");
	return [
		{
			field: "id",
			label: t("myConfigs.field.id")
		},
		{
			field: "author",
			label: t("myConfigs.field.author")
		},
		{
			field: "version",
			label: t("myConfigs.field.version")
		},
		{
			field: "updatedAt",
			label: t("myConfigs.field.updatedAt")
		}
	].map(({ field, label }) => ({
		field,
		label,
		autoText
	}));
}
/**
* Host 侧收录状态桥（§4.5 在 Host 判定）→ 客户端判别联合 ItemStatus：
* my-repo.ts 的 MyItemStatus = 'not-listed' | 'pr-pending' | 'listed'，
* prUrl 在 pr-pending 时由 Host 提供；prNumber 可选（Host 未提供时缺省）。
* 纯映射，无副作用；MyConfigsView 消费 /me/items 条目时经此桥转徽章模型。
*/
function itemStatusFromHost(entry) {
	switch (entry.status) {
		case "listed": return { kind: "listed" };
		case "pr-pending": return {
			kind: "pending-pr",
			prUrl: entry.prUrl ?? "",
			prNumber: entry.prNumber
		};
		default: return { kind: "not-listed" };
	}
}
/** 收录状态 → 徽章模板（ok=已收录 / warn=PR 待审核 / info=未收录）。 */
function itemStatusBadge(status, t = zhUiT) {
	switch (status.kind) {
		case "listed": return {
			kind: "ok",
			text: t("myConfigs.status.listed")
		};
		case "pending-pr": return {
			kind: "warn",
			text: t("myConfigs.status.pendingPr"),
			prUrl: status.prUrl,
			prNumber: status.prNumber
		};
		case "not-listed": return {
			kind: "info",
			text: t("myConfigs.status.notListed")
		};
	}
}
/** 条目投影：缺失字段给默认值（name 缺省回退 id；其余空串/空数组）。 */
function toMyItemView(item, status, t = zhUiT) {
	return {
		id: item.id,
		name: item.name !== void 0 && item.name.trim() !== "" ? item.name : item.id,
		version: item.version ?? "",
		updatedAt: item.updatedAt ?? "",
		categories: item.categories ?? [],
		author: item.author ?? "",
		..."stars" in item && typeof item.stars === "number" ? { stars: item.stars } : {},
		status,
		badge: itemStatusBadge(status, t)
	};
}
/** 列表摘要统计（按 status 分类计数）。 */
function summarizeMyItems(views) {
	let listed = 0;
	let pendingPr = 0;
	let notListed = 0;
	for (const v of views) if (v.status.kind === "listed") listed += 1;
	else if (v.status.kind === "pending-pr") pendingPr += 1;
	else notListed += 1;
	return {
		total: views.length,
		listed,
		pendingPr,
		notListed
	};
}
//#endregion
//#region src/market/view.ts
/** 列表摘要：总条目数 + 缓存徽章计数（供 UI 顶部小结）。无副作用。 */
function marketListSummary(items, _t) {
	const fresh = items.filter((i) => i.cacheState === "fresh").length;
	const cached = items.filter((i) => i.cacheState === "cached").length;
	const none = items.filter((i) => i.cacheState === "none").length;
	return {
		total: items.length,
		fresh,
		cached,
		none
	};
}
/** 条目校验徽章：status 文案 + sections 清单文案。返回 { statusText, sectionsText, valid } */
function computeItemBadge(detail, t) {
	return {
		statusText: detail.status === "valid" ? t("market.detail.statusValid") : t("market.detail.statusInvalid"),
		sectionsText: detail.sections.length > 0 ? t("market.detail.sections", { sections: detail.sections.join(", ") }) : t("market.detail.sectionsEmpty"),
		valid: detail.status === "valid"
	};
}
/**
* 恒生成供应链警示行（硬不变式：任何市场下载条目确认导入前都可见）。
* 传入 L2 manifest + 市场 URL + 下载时间；不依赖任何“来源可信”判定。
*/
function marketItemWarnings(manifest, url, downloadedAt, t) {
	const warnings = [];
	warnings.push(t("market.supplyUnofficial"));
	if (url !== "") warnings.push(t("market.supplySource", { url }));
	if (downloadedAt !== "") warnings.push(t("market.supplyDownloadedAt", { time: downloadedAt }));
	if (manifest?.author) warnings.push(t("market.supplyAuthor", { author: manifest.author }));
	if (manifest?.provenance?.source) warnings.push(t("market.supplyProvenanceSource", { source: manifest.provenance.source }));
	if (manifest?.provenance?.note) warnings.push(t("market.supplyProvenanceNote", { note: manifest.provenance.note }));
	return warnings;
}
//#endregion
//#region src/client/market/market-view.ts
/**
* 配置市场区块的客户端渲染装配层（m-market-ui，node 可测）。
*
* 设计纪律（docs/design/marketplace.md §7.2 / §9 contract 表）：
*  - **共享渲染模型唯一权威 = Host 侧 `src/market/view.ts`**（marketStatusText /
*    marketListSummary / computeItemBadge / marketItemWarnings / needsReview / toMarketListItem）。
*    本文件原样 **re-export** 这些函数（单一来源，消重，避免与后端漂移）；
*  - 本文件只保留**客户端专属**的 UI 装配函数（搜索/类别过滤、详情聚合、时间格式化、
*    供应链警示的 warn/info 着色行、条目来源徽章）——这些不属共享模型，属前端薄层。
*
* 安全硬约束（§1 / §7.2）：供应链警示恒生成、needsReview 恒 true（re-export 自后端权威）。
*/
/**
* 条目来源徽章 kind（阶段 1：条目级来源仓库，docs/design/2026-08-19-market-publish-design.md §3.3）：
* - `'ok'`（官方）：`item.repo` 缺省（条目与市场仓库同仓）或 `item.repo` 为官方默认地址；
* - `'warn'`（第三方）：`item.repo` 存在且非官方默认地址（条目由作者自托管仓库发布）。
* 判定基准复用 `builtin.ts` 的 `isOfficialMarket`（固定官方地址比较）：env 覆盖为预览仓库时，
* 无 repo 条目随市场头部一并显示第三方徽章，语义自洽。纯函数、node 可测；MarketPanel 只装配。
*/
function sourceBadgeKind(item, builtinUrl) {
	return isOfficialMarket(item.repo ?? builtinUrl) ? "ok" : "warn";
}
/** 条目是否为第三方来源（有 repo 且非官方默认地址；无 repo 条目视为官方/市场同仓）。 */
function isThirdPartyItem(item, builtinUrl) {
	return sourceBadgeKind(item, builtinUrl) === "warn";
}
/** 类别过滤：从条目收集全部出现过的类别（用于「全部类别」下拉）。 */
function collectCategories(items) {
	const set = /* @__PURE__ */ new Set();
	for (const it of items) for (const c of it.categories ?? []) set.add(c);
	return [...set];
}
/**
* 来源过滤：'official' 只保留官方条目（非第三方），'personal' 只保留个人条目（第三方），
* 'all' 不过滤。缺省 'all'（向后兼容旧调用方）。
*/
function filterBySource(items, source, builtinUrl) {
	if (source === "all") return [...items];
	const wantOfficial = source === "official";
	return items.filter((it) => isThirdPartyItem(it, builtinUrl) !== wantOfficial);
}
/**
* 排序（纯函数）：按键排序，undefined 值（无 updatedAt / stars）排最后。
* - updatedAt：降序（最新在前）；无 updatedAt 排最后；
* - stars：降序（多在前）；无 stars 排最后；
* - name：升序 A–Z（localeCompare）；
* - default：保持原顺序。
* 稳定性：同值保持原相对顺序（Array.prototype.sort 现代引擎稳定）。
*/
function sortMarketItems(items, sortKey) {
	if (sortKey === "default") return [...items];
	const copy = [...items];
	copy.sort((a, b) => {
		if (sortKey === "name") return a.name.localeCompare(b.name);
		if (sortKey === "stars") {
			const sa = a.stars;
			const sb = b.stars;
			if (sa === void 0 && sb === void 0) return 0;
			if (sa === void 0) return 1;
			if (sb === void 0) return -1;
			return sb - sa;
		}
		const ta = a.updatedAt ?? "";
		const tb = b.updatedAt ?? "";
		if (ta === "" && tb === "") return 0;
		if (ta === "") return 1;
		if (tb === "") return -1;
		return tb.localeCompare(ta);
	});
	return copy;
}
/**
* 搜索 + 类别过滤（纯函数，客户端专属）。
* - query：对 name / author / description / **categories** 做大小写不敏感子串匹配
*   （空白 query 不过滤；P2-⑭ 增强：类别标签也参与搜索命中——搜「模型」能命中
*   带 providers 类别标签的条目，不必精确知道字段名）；
* - category：空串表示不限类别；否则要求 categories 含该值。
* 返回筛选后的条目（保持原始顺序）。
*/
function filterMarketItems(items, query, category) {
	const q = query.trim().toLowerCase();
	return items.filter((it) => {
		if (category !== "" && !(it.categories ?? []).includes(category)) return false;
		if (q === "") return true;
		if (it.name.toLowerCase().includes(q)) return true;
		if ((it.author ?? "").toLowerCase().includes(q)) return true;
		if ((it.description ?? "").toLowerCase().includes(q)) return true;
		if ((it.categories ?? []).some((c) => c.toLowerCase().includes(q))) return true;
		return false;
	});
}
/** P2-⑭：按分区筛选列表（对已缓存条目生效；未缓存条目 sections 未知 → 在筛选时排除）。
*  section 传 '' = 不限分区。返回 { matched, unknown }：unknown 为因「未下载、分区未知」
*  被排除的条目数（UI 提示用）。 */
function filterMarketBySection(items, section) {
	if (section === "") return {
		matched: [...items],
		unknown: 0
	};
	const matched = [];
	let unknown = 0;
	for (const it of items) {
		if (it.sections === void 0) {
			unknown += 1;
			continue;
		}
		if (it.sections.includes(section)) matched.push(it);
	}
	return {
		matched,
		unknown
	};
}
/** 收集列表内已缓存条目的分区并集（分区筛选取值候选；未缓存条目贡献不了分区信息）。 */
function collectCachedSections(items) {
	const set = /* @__PURE__ */ new Set();
	for (const it of items) for (const s of it.sections ?? []) set.add(s);
	return [...set];
}
/**
* 供应链警示 → warn/info 着色行（客户端专属）。**逻辑委托** Host 权威 `marketItemWarnings`
* （恒生成非官方审核 + 来源 URL + 下载时间 + 作者/来源自述），本层只负责给「非官方审核」标 warn、
* 其余标 info，供 UI 列表着色。硬不变式：返回恒非空（至少一条），确认导入前必经。
*/
function marketWarningsLines(detail, url, t = zhUiT) {
	return marketItemWarnings(detail.provenance !== void 0 || detail.author !== void 0 ? {
		name: detail.name,
		author: detail.author,
		provenance: detail.provenance
	} : void 0, url, detail.downloadedAt, t).map((text, i) => ({
		kind: i === 0 ? "warn" : "info",
		text
	}));
}
/**
* 聚合详情视图（客户端专属）：徽章（委托共享 computeItemBadge）+ 供应链警示着色行
* （委托共享 marketItemWarnings）+ 校验错误 + 可否导入。
*/
function marketDetailView(detail, url, showBack, t = zhUiT) {
	const badge = computeItemBadge(detail, t);
	return {
		badge: {
			statusKind: badge.valid ? "ok" : "error",
			statusText: badge.statusText,
			sectionsText: badge.sectionsText,
			valid: badge.valid
		},
		warnings: marketWarningsLines(detail, url, t),
		errors: detail.errors ?? [],
		canImport: detail.status === "valid" && detail.sections.length > 0,
		showBack
	};
}
/**
* 高风险分区（默认不导入，须逐项显式批准）：
*  - pluginFiles        ：把远端文件写进 $DSH_HOME（可覆盖本机插件配置文件）
*  - agentInstructions  ：AGENTS.md 注入每个会话的全局指令（LLM 言行边界）
*  - agentPresets       ：agent 预设（会话 persona / 行为模板）
*  - sessions           ：session 文件（可带历史/敏感上下文）
*  - mcp                ：注册 MCP 服务器（可接入外部工具/执行能力）
*  - plugins            ：安装/更新插件（ExecutePlugin / Install 项，供应链最高风险）
* 其余（settings/ui/providers/prompts/skills/workspaces/credentialsStatus…）默认勾选。
*/
const HIGH_RISK_ADAPTERS = /* @__PURE__ */ new Set([
	"pluginFiles",
	"agentInstructions",
	"agentPresets",
	"sessions",
	"mcp",
	"plugins"
]);
/** 是否为高风险分区（需逐项显式批准，默认不导入）。 */
function isHighRiskAdapter(adapter) {
	return HIGH_RISK_ADAPTERS.has(adapter);
}
/** PlanItemKind 是否需要重启 DSH 生效（Install 及插件级变更）。 */
function itemNeedsRestart(adapter, kind) {
	if (kind === "Install") return true;
	if (adapter === "plugins" || adapter === "mcp" || adapter === "agentPresets" || adapter === "agentInstructions") return true;
	return false;
}
/** 收集计划中出现过的分区（按 APPLY_ORDER 语义排序不重要，去重即可）。 */
function planAdapters(plan) {
	const set = /* @__PURE__ */ new Set();
	for (const item of plan.items) set.add(item.adapter);
	return [...set];
}
/**
* 默认批准表：低风险分区默认勾选（true）；高风险分区默认不勾选（false，须逐项显式批准）。
* 这是严格分层信任的默认 —— 不提供「自动信任高风险来源」的默认。
*/
function defaultApprovals(plan) {
	const out = {};
	for (const adapter of planAdapters(plan)) out[adapter] = !isHighRiskAdapter(adapter);
	return out;
}
/**
* 按批准表过滤计划 → 仅保留已批准分区的项（供 executeImportPlan 执行的子计划，subPlan）。
* - items：仅保留 approved[adapter]===true 的项；
* - needsRestart：按已批准项里是否有需重启者重算（不再沿用整份计划的 needsRestart）；
* - estimatedActions：仅保留已批准分区的计数；
* - globalStrategy / missingSecrets / pathMappings：透传（导入的可选分区子集不改变这些）。
* 返回与入参同形状的 ImportPlan，可直接交 executeImportPlan（analytic 只执行 plan.items）。
*/
function buildApprovedPlan(plan, approvals) {
	const items = plan.items.filter((it) => approvals[it.adapter] === true);
	let needsRestart = false;
	const estimatedActions = {};
	for (const it of items) {
		if (itemNeedsRestart(it.adapter, it.kind)) needsRestart = true;
		estimatedActions[it.adapter] = (estimatedActions[it.adapter] ?? 0) + 1;
	}
	return {
		items,
		globalStrategy: plan.globalStrategy,
		pathMappings: plan.pathMappings,
		missingSecrets: plan.missingSecrets,
		needsRestart,
		estimatedActions
	};
}
/** 批准表摘要（确认按钮可用性 + 提示徽章数据源，纯函数）。 */
function approvedAdapterSummary(plan, approvals) {
	const adapters = planAdapters(plan);
	let selected = 0;
	let highRiskSelected = 0;
	let highRiskTotal = 0;
	for (const a of adapters) {
		if (approvals[a] === true) selected += 1;
		if (isHighRiskAdapter(a)) {
			highRiskTotal += 1;
			if (approvals[a] === true) highRiskSelected += 1;
		}
	}
	const hasItems = plan.items.some((it) => approvals[it.adapter] === true);
	return {
		total: adapters.length,
		selected,
		canImport: hasItems,
		highRiskSelected,
		highRiskTotal
	};
}
/** 计划 → 分区批准列表（供详情视图逐项勾选渲染；纯函数）。 */
function approvalRows(plan, approvals) {
	const byAdapter = /* @__PURE__ */ new Map();
	for (const item of plan.items) {
		const list = byAdapter.get(item.adapter) ?? [];
		list.push(item);
		byAdapter.set(item.adapter, list);
	}
	const rows = [];
	for (const adapter of planAdapters(plan)) {
		const items = byAdapter.get(adapter) ?? [];
		const label = items[0]?.description ?? adapter;
		rows.push({
			adapter,
			itemCount: items.length,
			highRisk: isHighRiskAdapter(adapter),
			approved: approvals[adapter] === true,
			label
		});
	}
	return rows;
}
function marketImpactSummary(plan, analysis) {
	const items = plan.items;
	const count = (kinds) => items.filter((i) => kinds.includes(i.kind)).length;
	const byAdapter = /* @__PURE__ */ new Map();
	for (const item of items) byAdapter.set(item.adapter, (byAdapter.get(item.adapter) ?? 0) + 1);
	return {
		willChange: count([
			"Create",
			"Update",
			"Install",
			"Conflict"
		]),
		unchanged: count(["Skip"]),
		conflicts: count(["Conflict"]),
		secretsNeeded: plan.missingSecrets.length,
		pathMappingsNeeded: analysis?.pathIssues?.length ?? 0,
		needsRestart: plan.needsRestart,
		sections: [...byAdapter.entries()].map(([section, c]) => ({
			section,
			count: c
		}))
	};
}
//#endregion
//#region src/client/market/MyConfigsView.tsx
/**
* 「我的配置」视图（设计文档 docs/design/2026-08-20-my-configs-design.md §4.6）。
*
* 组装「一键上传 / 查看已上传 / 一键更新 / 装回本地」：
* - **登录卡**：未登录 → GitHub device flow 登录（复用 SyncApi.githubStart/Poll/Cancel，
*   交互与 SyncSettingsView 一致：一次性用户码 + 授权页链接 + 轮询 + 取消，定时器卸载清理）；
*   已登录 → @login + 固定目标仓库（xiajiajun516/dsh-config-market，只读展示，无编辑入口）；
*   token 失效（/me/status 401）→ 引导重新登录；
* - **上传向导**：选 zip（复用 ConfigManagerApi.upload 受控临时区）→ analyzeImport 校验
*   （内容合法 + 无密钥，零写入）→ 精简表单（仅 name/description/categories；
*   id/author/version/updatedAt 显示「系统自动」徽章）→ meUpload 一键上传 → 结果卡
*   （PR 链接 / 仓库链接 / sha256 / 分区）；
* - **已上传列表**：条目卡片（字段 + 收录状态徽章：未收录 / PR 待审核[带 PR 链接] / 已收录，
*   状态由 Host 侧判定经 itemStatusFromHost 桥接）+ 行操作：更新（预填信息进向导）/
*   装回本地（复用市场下载 + 逐分区批准 + executeImportPlan 安全管道）/ 打开仓库。
*
* 渲染/校验模型全部来自 my-configs-view.ts + market-view.ts 纯函数（node 已测），本组件只装配；
* 状态组件内自持（useState），非敏感切片（已上传列表 myItems + 错误）为**受控 props**：
* 经 MarketPanel 的 commit/patch 统一镜像进模块级 runStore（market.myItems / myItemsError），
* 切 tab 不丢；刷新后免重拉（与 MarketPanel 浏览态同单店镜像策略）。
* 安全：token 只存宿主凭据槽；密码/表单无敏感字段；所有展示文本渲染前过 redact() 兜底；
* 本文件不 import 任何 node 模块（纯浏览器 bundle）。
*/
const initialGithubFlow = {
	phase: "idle",
	flowId: "",
	userCode: "",
	verificationUri: "",
	interval: 5,
	error: null
};
/**
* 上传/更新向导状态（全量模型在 my-configs-view.ts 的 MyWizardState；本组件持有的是
* 持久化切片 myWizard（受控 props），经 restoreMyWizard 恢复全量、toMyWizardSlice 上抛镜像。
* 瞬态（validating/running/formErrors）由 restore 重建，切 tab/刷新恢复后为初始态。
* 装回本地状态（MyInstallState）同模式：持久化切片 myInstall（受控 props），
* 经 restoreMyInstall 恢复全量（importing 瞬态归零）、toMyInstallSlice 上抛镜像。
*/
function MyConfigsView({ meApi, api, importApi, syncApi, t, myItems, myItemsError, onMyItemsChange, myWizard, onMyWizardChange, myInstall, onMyInstallChange, myConfirmDeleteId, onMyConfirmDeleteChange }) {
	const uiT = meApi.t;
	const [status, setStatus] = (0, react.useState)(null);
	const [statusLoading, setStatusLoading] = (0, react.useState)(true);
	const [statusFailed, setStatusFailed] = (0, react.useState)(false);
	const [github, setGithub] = (0, react.useState)(initialGithubFlow);
	const githubPollTimer = (0, react.useRef)(null);
	const [listLoading, setListLoading] = (0, react.useState)(false);
	const [wizard, setWizard] = (0, react.useState)(() => restoreMyWizard(myWizard));
	/** 最近一次 wizard 全量（commitWizard 读最新值，避免闭包过期） */
	const wizardRef = (0, react.useRef)(wizard);
	/** 收录/下架任务状态（结果卡轮询 /me/listing 的实时结果） */
	const [listingStatus, setListingStatus] = (0, react.useState)(null);
	/** 收录/下架任务轮询定时器 */
	const listingPollTimer = (0, react.useRef)(null);
	/** 删除确认弹窗目标条目 id（受控：MarketPanel 经 runStore 持有，切 tab/刷新不丢；null = 无确认中的删除） */
	const confirmDeleteId = myConfirmDeleteId;
	/** 正在删除的条目 id（行级 spinner + 防重复点击） */
	const [deletingId, setDeletingId] = (0, react.useState)(null);
	/** 装回本地状态（受控：切片来自 runStore；瞬态 importing 本地重建） */
	const [install, setInstall] = (0, react.useState)(() => restoreMyInstall(myInstall));
	/** 最近一次 install 全量（commitInstall 读最新值，避免闭包过期） */
	const installRef = (0, react.useRef)(install);
	const fileInput = (0, react.useRef)(null);
	/** 上传/更新向导弹窗开关（瞬态 UI，不持久化：切 tab 弹窗关闭，数据仍在 runStore） */
	const [uploadOpen, setUploadOpen] = (0, react.useState)(false);
	/** 装回本地弹窗开关（同上） */
	const [installOpen, setInstallOpen] = (0, react.useState)(false);
	/** 当前展示的免责弹窗操作（null = 无；upload/download/install 三操作分开记「不再提示」） */
	const [disclaimerKey, setDisclaimerKey] = (0, react.useState)(null);
	/** 免责弹窗「不再提示」勾选（每次打开重置） */
	const [dontAsk, setDontAsk] = (0, react.useState)(false);
	/** localStorage（浏览器环境；免责「不再提示」跨会话持久化） */
	const storage = window.localStorage;
	/** 打开上传/更新弹窗（更新模式表单已预填）：未勾「不再提示」→ 先弹免责，确认后开弹窗 */
	const openUpload = () => {
		if (readDisclaimerDismissed("upload", storage)) {
			setUploadOpen(true);
			return;
		}
		setDontAsk(false);
		setDisclaimerKey("upload");
	};
	/** 待装回本地的目标条目（免责确认后取用；避免免责流程中闭包过期） */
	const pendingInstallEntry = (0, react.useRef)(null);
	/** 打开装回本地弹窗：未勾「不再提示」→ 先弹免责，确认后开弹窗并启动下载 */
	const openInstall = (entry) => {
		pendingInstallEntry.current = entry;
		if (readDisclaimerDismissed("install", storage)) {
			setInstallOpen(true);
			runDownload(entry);
			return;
		}
		setDontAsk(false);
		setDisclaimerKey("install");
	};
	/** 关闭上传/更新弹窗：重置向导为初始态（弹窗即会话，关闭即放弃本次操作；
	*  更新模式也切回「一键上传」入口，避免入口按钮残留 update 态） */
	const closeUpload = () => {
		setUploadOpen(false);
		commitWizard(initialWizard("upload"));
		setListingStatus(null);
	};
	/** 取消更新：放弃本次更新，向导回到默认「一键上传」初始态（清空预填/暂存/校验态），弹窗保持打开 */
	const cancelUpdate = () => {
		commitWizard(initialWizard("upload"));
		setListingStatus(null);
	};
	/** 关闭装回本地弹窗：清 install 会话 */
	const closeInstall = () => {
		setInstallOpen(false);
		commitInstall(null);
	};
	/** 免责弹窗确认：勾选则记录「不再提示」→ 关闭免责 → 打开对应操作弹窗 */
	const confirmDisclaimer = () => {
		const key = disclaimerKey;
		if (key === null) return;
		if (dontAsk) writeDisclaimerDismissed(key, storage);
		setDisclaimerKey(null);
		if (key === "upload") setUploadOpen(true);
		else if (key === "install") {
			const entry = pendingInstallEntry.current;
			setInstallOpen(true);
			if (entry !== null && entry !== void 0) runDownload(entry);
		}
	};
	/** 取消免责弹窗：关闭，不打开操作弹窗；若向导处于 update 残留态则重置为上传初始态 */
	const cancelDisclaimer = () => {
		setDisclaimerKey(null);
		if (disclaimerKey === "upload" && wizardRef.current.mode === "update") {
			commitWizard(initialWizard("upload"));
			setListingStatus(null);
		}
	};
	/** 免责弹窗文案（MyConfigsView 只触发 upload / install 两种；default 兜底返回空串防误显） */
	const disclaimerText = () => {
		switch (disclaimerKey) {
			case "upload": return t("disclaimer.upload.text");
			case "install": return t("disclaimer.install.text");
			default: return "";
		}
	};
	/**
	* 向导状态统一提交：更新 ref → setState → **总是**镜像切片上抛（MarketPanel 落 runStore）。
	* 镜像不依赖 effect flush：异步回调在组件已卸载（切走 tab）时也能落库，切回恢复。
	* 镜像上抛包 try/catch：镜像失败（store 异常）绝不影响本地 UI 更新（防「点击无反应」）。
	*/
	const commitWizard = (next) => {
		wizardRef.current = next;
		setWizard(next);
		try {
			onMyWizardChange(toMyWizardSlice(next));
		} catch {}
	};
	const patchWizard = (p) => commitWizard({
		...wizardRef.current,
		...p
	});
	/**
	* 装回本地状态统一提交：更新 ref → setState → **总是**镜像切片上抛（MarketPanel 落 runStore）。
	* 镜像不依赖 effect flush：异步回调在组件已卸载（切走 tab）时也能落库，切回恢复。
	*/
	const commitInstall = (next) => {
		installRef.current = next;
		setInstall(next);
		try {
			onMyInstallChange(next === null ? null : toMyInstallSlice(next));
		} catch {}
	};
	const patchInstall = (p) => {
		if (installRef.current === null) return;
		commitInstall({
			...installRef.current,
			...p
		});
	};
	/** 读取登录态（挂载 / 登录成功 / 状态刷新），返回 status 供后续判断 */
	const loadStatus = async () => {
		setStatusLoading(true);
		setStatusFailed(false);
		try {
			const s = await meApi.meStatus();
			setStatus(s);
			return s;
		} catch {
			setStatusFailed(true);
			return null;
		} finally {
			setStatusLoading(false);
		}
	};
	/** 加载已上传列表（状态上抛 MarketPanel 镜像 runStore：切 tab 不丢 / 刷新免重拉） */
	const loadItems = async (opts = {}) => {
		if (!opts.silent) setListLoading(true);
		try {
			onMyItemsChange((await meApi.meItems()).items, null);
		} catch (err) {
			onMyItemsChange(myItems, err instanceof Error ? err.message : String(err));
		} finally {
			if (!opts.silent) setListLoading(false);
		}
	};
	(0, react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const s = await loadStatus();
			if (!cancelled && s !== null && s.loggedIn) loadItems({ silent: true });
		})();
		return () => {
			cancelled = true;
			if (githubPollTimer.current !== null) clearTimeout(githubPollTimer.current);
		};
	}, []);
	const runGithubStart = async () => {
		setGithub((g) => ({
			...g,
			phase: "starting",
			error: null
		}));
		try {
			const info = await syncApi.githubStart();
			setGithub({
				phase: "waiting",
				flowId: info.flowId,
				userCode: info.userCode,
				verificationUri: info.verificationUri,
				interval: info.interval,
				error: null
			});
			scheduleGithubPoll(info.flowId, Math.max(info.interval, 1) * 1e3);
		} catch (err) {
			setGithub((g) => ({
				...g,
				phase: "error",
				error: err instanceof Error ? err.message : String(err)
			}));
		}
	};
	const scheduleGithubPoll = (flowId, delayMs) => {
		if (githubPollTimer.current !== null) clearTimeout(githubPollTimer.current);
		githubPollTimer.current = setTimeout(() => {
			runGithubPoll(flowId);
		}, delayMs);
	};
	const runGithubPoll = async (flowId) => {
		setGithub((g) => ({
			...g,
			phase: "polling"
		}));
		try {
			const poll = await syncApi.githubPoll(flowId);
			if (poll.status === "pending") {
				setGithub((g) => ({
					...g,
					phase: "waiting"
				}));
				scheduleGithubPoll(flowId, poll.pollDelayMs ?? Math.max(github.interval, 1) * 1e3);
				return;
			}
			const message = githubPollMessage(poll, uiT);
			if (poll.status === "success") {
				setGithub(initialGithubFlow);
				const s = await loadStatus();
				if (s !== null && s.loggedIn) loadItems({ silent: true });
			} else setGithub((g) => ({
				...g,
				phase: "error",
				error: message
			}));
		} catch (err) {
			setGithub((g) => ({
				...g,
				phase: "error",
				error: err instanceof Error ? err.message : String(err)
			}));
		}
	};
	const runGithubCancel = async () => {
		if (githubPollTimer.current !== null) {
			clearTimeout(githubPollTimer.current);
			githubPollTimer.current = null;
		}
		const flowId = github.flowId;
		setGithub(initialGithubFlow);
		if (flowId !== "") try {
			await syncApi.githubCancel(flowId);
		} catch {}
	};
	/** 选 zip → upload 受控临时区；upload 模式预填 name 为 zip 文件名（可改）。
	*  两种模式选完 zip 均**自动**跑校验（analyzeImport dry-run）——通过即直接进表单，
	*  用户无需再手动点「校验」按钮；失败留在校验步骤展示错误（可重选 zip）。 */
	const onPickFile = async (file) => {
		if (file === void 0) return;
		patchWizard({
			fileName: file.name,
			error: null,
			validationError: null
		});
		try {
			const uploaded = await importApi.upload(file);
			const base = {
				zipPath: uploaded.zipPath,
				fileName: file.name
			};
			if (wizardRef.current.mode === "update") {
				patchWizard({
					...base,
					validated: false
				});
				await runValidateWith(uploaded.zipPath);
			} else {
				patchWizard({
					...base,
					step: "validate",
					form: {
						...wizardRef.current.form,
						name: file.name.replace(/\.zip$/i, "")
					}
				});
				await runValidateWith(uploaded.zipPath);
			}
		} catch (err) {
			patchWizard({ error: err instanceof Error ? err.message : String(err) });
		}
	};
	/** 校验指定 zipPath（选完 zip 自动调用；任何异常都落到 validationError 展示，不静默） */
	const runValidateWith = async (zipPath) => {
		try {
			patchWizard({
				validating: true,
				validationError: null
			});
		} catch (err) {
			setWizard((w) => ({
				...w,
				validationError: err instanceof Error ? err.message : String(err)
			}));
			return;
		}
		try {
			const analysis = await importApi.analyzeImport(zipPath);
			if (analysis.secretCount > 0) patchWizard({
				validating: false,
				validated: false,
				validationError: t("myconfigs.upload.validateSecrets")
			});
			else if (!analysis.valid) patchWizard({
				validating: false,
				validated: false,
				validationError: t("myconfigs.upload.validateInvalid")
			});
			else patchWizard({
				validating: false,
				validated: true,
				validationError: null,
				step: "form"
			});
		} catch (err) {
			patchWizard({
				validating: false,
				validated: false,
				validationError: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 表单字段更新 + 实时校验（pure 模型） */
	const onFormField = (field, value) => {
		const next = {
			...wizardRef.current.form,
			[field]: value
		};
		patchWizard({
			form: next,
			formErrors: validateMyConfigForm(next, uiT)
		});
	};
	/** 「一键上传 / 一键更新」→ meUpload / meUpdate */
	const runUpload = async () => {
		const w = wizardRef.current;
		const zipPath = w.zipPath;
		if (zipPath === null) return;
		const errs = validateMyConfigForm(w.form, uiT);
		patchWizard({ formErrors: errs });
		if (!myConfigFormValid(errs)) return;
		const categories = parseCategories(w.form.categories);
		const form = {
			name: w.form.name.trim(),
			...w.mode === "update" && w.form.id !== "" ? { id: w.form.id } : {},
			...w.form.description.trim() !== "" ? { description: w.form.description.trim() } : {},
			...categories.length > 0 ? { categories } : {},
			...w.form.publishMode === "share" ? { mode: "share" } : {}
		};
		patchWizard({
			running: true,
			error: null,
			result: null
		});
		try {
			const result = w.mode === "update" ? await meApi.meUpdate({
				zipPath,
				form
			}) : await meApi.meUpload({
				zipPath,
				form
			});
			commitWizard({
				...wizardRef.current,
				running: false,
				result
			});
			setListingStatus(null);
			if (result.ok && result.listing === "pending") startListingPoll(result.itemId);
			loadItems({ silent: true });
		} catch (err) {
			patchWizard({
				running: false,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 行操作：更新 → 打开「更新配置」表单页（step='form'，预填条目信息；表单内选新 zip 自动校验） */
	const startUpdate = (entry) => {
		commitWizard({
			...initialWizard("update"),
			step: "form",
			form: {
				id: entry.id,
				name: entry.name,
				description: entry.description ?? "",
				categories: (entry.categories ?? []).join(", "),
				publishMode: "migrate"
			}
		});
		setListingStatus(null);
	};
	/** 轮询 /me/listing 直到任务终态（done/failed/null）；间隔 3s、最多 40 次（≈2 分钟），
	*  后台 fork 更久时超时停止，用户可稍后手动刷新列表/点「重新收录」 */
	const startListingPoll = (itemId) => {
		if (listingPollTimer.current !== null) clearTimeout(listingPollTimer.current);
		let count = 0;
		const tick = () => {
			(async () => {
				try {
					const s = await meApi.meListing(itemId);
					if (s === null) {
						setListingStatus({
							itemId,
							listing: "done",
							prNumber: null,
							prUrl: null
						});
						return;
					}
					setListingStatus(s);
					if (s.listing !== "pending") return;
				} catch {}
				count += 1;
				if (count >= 40) {
					listingPollTimer.current = null;
					return;
				}
				listingPollTimer.current = setTimeout(tick, 3e3);
			})();
		};
		tick();
	};
	/** 挂载恢复：若持久化的向导结果仍是「收录处理中」（pending），继续轮询（仿 resume 模式，避免刷新后永久 pending 卡死） */
	(0, react.useEffect)(() => {
		const w = wizardRef.current;
		if (w.result !== null && w.result.ok && w.result.listing === "pending") startListingPoll(w.result.itemId);
		return () => {
			if (listingPollTimer.current !== null) clearTimeout(listingPollTimer.current);
		};
	}, []);
	/** 重新提交收录（收录失败 / 进程重启丢失后的一键重试）→ 重新轮询状态 */
	const runRelist = async (itemId) => {
		try {
			const s = await meApi.meRelist(itemId);
			setListingStatus(s);
			startListingPoll(itemId);
		} catch (err) {
			patchWizard({ error: err instanceof Error ? err.message : String(err) });
		}
	};
	/** 删除：调 /me/delete（同步删本地索引+文件；已收录自动后台提下架 PR）→ 刷新列表 */
	const runDelete = async (entry) => {
		if (deletingId !== null) return;
		setDeletingId(entry.id);
		onMyConfirmDeleteChange(null);
		try {
			const result = await meApi.meDelete(entry.id);
			if (result.ok) {
				if (result.delisted) patchWizard({ error: t("myconfigs.delete.delistStarted") });
				else if (result.prNumber !== null) patchWizard({ error: t("myconfigs.delete.prClosed") });
				loadItems({ silent: true });
			} else patchWizard({ error: result.error ?? t("common.unknownError") });
		} catch (err) {
			patchWizard({ error: err instanceof Error ? err.message : String(err) });
		} finally {
			setDeletingId(null);
		}
	};
	/** 装回本地（复用市场下载 + 逐分区批准链路；条目内容在用户自己的公开仓库，必须带 repo 来源）
	*  竞态守卫：下载期间用户可切换装回另一条目（install.itemId 已变），晚到响应一律丢弃，
	*  防止「会话标题是 B、详情是 A」的串扰。 */
	const runDownload = async (entry) => {
		commitInstall({
			itemId: entry.id,
			detail: null,
			approvals: {},
			importing: false,
			importResult: null,
			error: null
		});
		try {
			const detail = await api.download(entry.id, entry.repoUrl);
			if (installRef.current === null || installRef.current.itemId !== entry.id) return;
			commitInstall({
				...installRef.current,
				detail,
				approvals: defaultApprovals(detail.plan)
			});
		} catch (err) {
			if (installRef.current === null || installRef.current.itemId !== entry.id) return;
			patchInstall({ error: err instanceof Error ? err.message : String(err) });
		}
	};
	const runImport = async () => {
		if (install === null || install.detail === null) return;
		const approvedPlan = buildApprovedPlan(install.detail.plan, install.approvals);
		if (approvedPlan.items.length === 0) {
			patchInstall({ error: t("detail.noApproval") });
			return;
		}
		patchInstall({
			importing: true,
			error: null
		});
		try {
			const executed = await importApi.executeImportPlan(install.detail.zipPath, approvedPlan, {
				confirm: true,
				rollbackOnError: true
			});
			patchInstall({
				importing: false,
				importResult: executed
			});
		} catch (err) {
			patchInstall({
				importing: false,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 登录视图（loading / logged-out / logged-in / token-invalid） */
	const loginView = deriveLoginState({
		loading: statusLoading,
		status,
		authFailed: statusFailed
	});
	/** GitHub 登录卡渲染模型（复用 sync-view 纯函数：状态行 / 按钮态 / 展示设备码） */
	const githubView = computeGithubLoginView(github.phase, github.userCode, github.verificationUri, github.error, uiT);
	/** 已上传条目投影（Host 状态 → 徽章模型） */
	const itemViews = (myItems ?? []).map((entry) => {
		const view = toMyItemView(entry, itemStatusFromHost(entry), uiT);
		return {
			entry,
			view,
			badge: view.badge
		};
	});
	const summary = summarizeMyItems(itemViews.map((v) => v.view));
	const autoBadges = autoFieldBadges(uiT);
	const targetRepo = `${MARKET_UPSTREAM_OWNER}/${MARKET_UPSTREAM_REPO}`;
	/** 设备码 + 授权页链接展示（waiting/polling 时） */
	const renderDeviceCode = () => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.statRow,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
			kind: "info",
			children: t("myconfigs.login.userCode", { code: githubView.userCode })
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
			className: config_manager_module_css_default.ghostButton,
			href: githubView.verificationUri,
			target: "_blank",
			rel: "noreferrer",
			style: { textDecoration: "none" },
			children: t("myconfigs.login.openAuth")
		})]
	});
	/** 登录卡（未登录 / token 失效 → device flow；已登录 → @login + 固定目标仓库只读展示） */
	const renderLoginCard = () => {
		if (loginView.kind === "loading") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.statRow,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: config_manager_module_css_default.groupLabel,
				children: t("myconfigs.login.title")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("myconfigs.login.checking") })]
		}) });
		if (loginView.kind === "logged-out" || loginView.kind === "token-invalid") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.groupLabel,
						children: t("myconfigs.login.title")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						disabled: !githubView.canStart,
						onClick: () => {
							runGithubStart();
						},
						children: githubView.startLabel
					}),
					githubView.canCancel && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						disabled: github.phase === "starting",
						onClick: () => {
							runGithubCancel();
						},
						children: t("myconfigs.login.cancel")
					})
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: config_manager_module_css_default.hint,
				children: t("myconfigs.login.hint")
			}),
			loginView.kind === "token-invalid" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "warn",
				children: t("myconfigs.error.loadStatus")
			}),
			githubView.showCode && renderDeviceCode(),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.statRow,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
					kind: githubView.phase === "error" ? "error" : "warn",
					children: githubView.statusText
				})
			}),
			github.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "error",
				children: redact(github.error)
			})
		] });
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.groupLabel,
					children: t("myconfigs.login.title")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
					kind: "ok",
					children: t("myconfigs.login.loggedInAs", { login: loginView.login })
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.statRow,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
					kind: "info",
					children: t("myconfigs.login.targetRepo", { repo: targetRepo })
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.statRow,
				children: loginView.repoExists ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
					kind: "ok",
					children: t("myconfigs.login.repoReady", { repo: loginView.repoUrl })
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
					kind: "warn",
					children: t("myconfigs.login.repoMissing")
				})
			})
		] });
	};
	/** 上传 / 更新向导卡片（选 zip → 校验 → 表单 → 结果） */
	const renderWizard = () => {
		/** PR 链接（优先实时任务状态；收录完成后由轮询补上，或直接取同步结果） */
		const prLink = (() => {
			const live = listingStatus;
			const url = live !== null && live.prUrl !== null && live.prUrl !== "" ? live.prUrl : wizardRef.current.result?.prUrl ?? null;
			if (url === null || url === "") return null;
			const number = live !== null && live.prNumber !== null ? live.prNumber : wizardRef.current.result?.prNumber;
			return {
				url,
				label: number !== null && number !== void 0 ? t("myconfigs.result.pr", { number: String(number) }) : t("myconfigs.result.openPr")
			};
		})();
		/** 重置：update 模式轻量重置（只清 zip/校验，**保留预填表单**）；upload 模式完全重置 */
		const reset = () => {
			const w = wizardRef.current;
			if (w.mode === "update") commitWizard({
				...initialWizard("update"),
				step: "form",
				form: { ...w.form }
			});
			else commitWizard(initialWizard("upload"));
			setListingStatus(null);
		};
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.dialogMask,
			onMouseDown: (e) => {
				if (e.target === e.currentTarget && !wizard.running && !wizard.validating) closeUpload();
			},
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": wizard.mode === "update" ? t("myconfigs.update.title") : t("myconfigs.upload.title"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.dialogHeaderRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: config_manager_module_css_default.dialogHeader,
						children: [wizard.mode === "update" ? t("myconfigs.update.title") : t("myconfigs.upload.title"), wizard.mode === "update" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: t("myconfigs.update.hint")
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: config_manager_module_css_default.dialogClose,
						"aria-label": t("common.close"),
						disabled: wizard.running || wizard.validating,
						onClick: closeUpload,
						children: "×"
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.dialogBodyScroll,
					children: [
						wizard.step === "select" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.hint,
								children: t("myconfigs.upload.selectHint")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								ref: fileInput,
								type: "file",
								accept: ".zip,application/zip",
								className: config_manager_module_css_default.hiddenFile,
								onChange: (e) => {
									const picked = e.target.files?.[0];
									e.target.value = "";
									onPickFile(picked);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.actionRow,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "primary",
									disabled: wizard.running,
									onClick: () => {
										fileInput.current?.click();
									},
									children: t("myconfigs.upload.select")
								})
							})
						] }),
						wizard.step === "validate" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.hint,
								children: t("myconfigs.upload.selectHint")
							}),
							wizard.fileName !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.statRow,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "info",
									children: t("myconfigs.upload.selected", { name: wizard.fileName })
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.actionRow,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "primary",
									disabled: wizard.validating,
									onClick: reset,
									children: wizard.validating ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("myconfigs.upload.validating") }) : t("myconfigs.upload.reselect")
								})
							}),
							wizard.validationError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: "error",
								children: redact(wizard.validationError)
							})
						] }),
						wizard.step === "form" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							wizard.mode === "update" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.hint,
									children: t("myconfigs.update.zipHint")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									ref: fileInput,
									type: "file",
									accept: ".zip,application/zip",
									className: config_manager_module_css_default.hiddenFile,
									onChange: (e) => {
										const picked = e.target.files?.[0];
										e.target.value = "";
										onPickFile(picked);
									}
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: config_manager_module_css_default.actionRow,
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										variant: "primary",
										disabled: wizard.validating || wizard.running,
										onClick: () => {
											fileInput.current?.click();
										},
										children: wizard.fileName !== null && wizard.zipPath !== null ? t("myconfigs.upload.selected", { name: wizard.fileName }) : t("myconfigs.update.selectZip")
									}), wizard.zipPath !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										disabled: wizard.validating || wizard.running,
										onClick: reset,
										children: t("myconfigs.upload.reselect")
									})]
								}),
								wizard.validationError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
									kind: "error",
									children: redact(wizard.validationError)
								})
							] }),
							wizard.validated && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.statRow,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "ok",
									children: t("myconfigs.upload.validateOk")
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Field, {
								label: t("myconfigs.upload.form.name"),
								hint: t("myconfigs.upload.form.nameHint"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									className: config_manager_module_css_default.input,
									value: wizard.form.name,
									onChange: (e) => {
										onFormField("name", e.target.value);
									}
								}), wizard.formErrors.name !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.formError,
									children: redact(wizard.formErrors.name)
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
								label: t("myconfigs.upload.form.description"),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
									className: config_manager_module_css_default.input,
									value: wizard.form.description,
									onChange: (e) => {
										onFormField("description", e.target.value);
									}
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Field, {
								label: t("myconfigs.upload.form.categories"),
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									className: config_manager_module_css_default.input,
									value: wizard.form.categories,
									onChange: (e) => {
										onFormField("categories", e.target.value);
									}
								})
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Field, {
								label: t("myconfigs.upload.mode.title"),
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.conflictOptions,
									children: [["migrate", t("myconfigs.upload.mode.migrate")], ["share", t("myconfigs.upload.mode.share")]].map(([value, label]) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
										className: config_manager_module_css_default.radioLabel,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
											type: "radio",
											name: "my-config-publish-mode",
											checked: wizard.form.publishMode === value,
											disabled: wizard.running || wizard.validating,
											onChange: () => {
												onFormField("publishMode", value);
											}
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: label })]
									}, value))
								}), wizard.form.publishMode === "share" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.hint,
									children: t("myconfigs.upload.mode.shareHint")
								})]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.hint,
								children: t("myconfigs.upload.form.autoHint")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.statRow,
								children: autoBadges.map((b) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
									kind: "info",
									children: [
										b.label,
										"：",
										b.autoText
									]
								}, b.field))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.actionRow,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										variant: "primary",
										disabled: wizard.validated !== true || wizard.running || wizard.zipPath === null || !myConfigFormValid(wizard.formErrors),
										onClick: () => {
											runUpload();
										},
										children: wizard.running ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: wizard.mode === "update" ? t("myconfigs.update.running") : t("myconfigs.upload.running") }) : wizard.mode === "update" ? t("myconfigs.update.run") : t("myconfigs.upload.run")
									}),
									wizard.mode === "update" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										disabled: wizard.running || wizard.validating,
										onClick: cancelUpdate,
										children: t("common.cancel")
									}),
									wizard.mode === "upload" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										disabled: wizard.running,
										onClick: reset,
										children: t("myconfigs.upload.reselect")
									})
								]
							})
						] }),
						wizard.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
							kind: "error",
							children: redact(wizard.error)
						}),
						wizard.result !== null && (wizard.result.ok ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.groupLabel,
								children: t("myconfigs.result.title")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.statRow,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
										kind: "ok",
										children: t("myconfigs.result.version", { version: wizard.result.version })
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
										kind: "info",
										children: t("myconfigs.result.sha256", { hash: wizard.result.sha256 })
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
										kind: "info",
										children: t("myconfigs.result.sections", { sections: wizard.result.sections.join(", ") })
									})
								]
							}),
							wizard.result.listing === "pending" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.statRow,
								children: listingStatus !== null && listingStatus.listing === "failed" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "error",
									children: t("myconfigs.result.listingFailed")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "danger",
									onClick: () => {
										runRelist(wizard.result.itemId);
									},
									children: t("myconfigs.result.relist")
								})] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "info",
									children: t("myconfigs.result.listingPending")
								})
							}),
							listingStatus !== null && listingStatus.listing === "failed" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: "error",
								children: redact(listingStatus.error ?? t("common.unknownError"))
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.actionRow,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
										kind: "info",
										children: t("myconfigs.result.repo")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										href: wizard.result.repoUrl,
										children: t("myconfigs.result.openRepo")
									}),
									prLink !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										href: prLink.url,
										children: prLink.label
									})
								]
							})
						] }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
							kind: "error",
							children: redact(wizard.result.error ?? ((wizard.result.warnings ?? []).join(" · ") || t("common.unknownError")))
						}))
					]
				})]
			})
		});
	};
	/** 已上传列表（条目卡片 + 状态徽章 + 行操作） */
	const renderList = () => {
		return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.groupLabel,
						children: t("myconfigs.list.title")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						disabled: listLoading,
						onClick: () => {
							loadItems();
						},
						children: listLoading ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("myconfigs.list.loading") }) : t("myconfigs.list.refresh")
					}),
					myItems !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "info",
						children: t("myconfigs.list.summary", {
							total: String(summary.total),
							listed: String(summary.listed),
							pending: String(summary.pendingPr),
							none: String(summary.notListed)
						})
					})
				]
			}),
			myItemsError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "error",
				children: redact(myItemsError)
			}),
			listLoading && myItems === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.statRow,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("myconfigs.list.loading") })
			}),
			!listLoading && myItems !== null && myItems.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("myconfigs.list.empty") }),
			!listLoading && itemViews.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.snapshotList,
				children: itemViews.map(({ entry, view, badge }) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					style: { paddingTop: 4 },
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							flex: 1,
							minWidth: 0
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.conflictHead,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: config_manager_module_css_default.conflictId,
								children: view.name
							}), view.version !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
								kind: "info",
								children: view.version
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.statRow,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: badge.kind,
									children: badge.text
								}),
								view.stars !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "info",
									title: t("list.starsHint"),
									children: t("list.stars", { count: String(view.stars) })
								}),
								view.author !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "info",
									children: view.author
								}),
								view.updatedAt !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "info",
									children: view.updatedAt
								}),
								view.categories.map((c) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "info",
									children: c
								}, c))
							]
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.rowActions,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								onClick: () => {
									startUpdate(entry);
									openUpload();
								},
								children: t("myconfigs.item.update")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								disabled: install !== null && install.detail === null,
								onClick: () => {
									openInstall(entry);
								},
								children: t("myconfigs.item.install")
							}),
							entry.repoUrl !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								href: entry.repoUrl,
								children: t("myconfigs.list.openRepo")
							}),
							badge.kind === "warn" && badge.prUrl !== void 0 && badge.prUrl !== "" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								href: badge.prUrl,
								children: t("myconfigs.item.openPr")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								variant: "danger",
								disabled: deletingId !== null,
								onClick: () => {
									onMyConfirmDeleteChange(view.id);
								},
								children: t("myconfigs.delete.run")
							})
						]
					})]
				}, view.id))
			})
		] });
	};
	/** 装回本地：下载 + 逐分区批准 + 执行导入（复用市场安全管道 + market-view 纯模型） */
	const renderInstall = () => {
		if (install === null) return null;
		const { detail } = install;
		const approvalList = detail !== null ? approvalRows(detail.plan, install.approvals) : [];
		const approvalSummary = detail !== null ? approvedAdapterSummary(detail.plan, install.approvals) : null;
		const detailView = detail !== null ? marketDetailView(detail, detail.repo ?? entryRepoUrl(install.itemId), true, uiT) : null;
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.dialogMask,
			onMouseDown: (e) => {
				if (e.target === e.currentTarget && !install.importing) closeInstall();
			},
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
				role: "dialog",
				"aria-modal": "true",
				"aria-label": t("detail.title"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.dialogHeaderRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: config_manager_module_css_default.dialogHeader,
						children: [
							t("detail.title"),
							"：",
							install.itemId
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: config_manager_module_css_default.dialogClose,
						"aria-label": t("common.close"),
						disabled: install.importing,
						onClick: closeInstall,
						children: "×"
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.dialogBodyScroll,
					children: [
						install.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
							kind: "error",
							children: redact(install.error)
						}),
						detail === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: config_manager_module_css_default.statRow,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("list.loading") })
						}),
						detail !== null && detailView !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: "warn",
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("detail.needReview") })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.statRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: detailView.badge.valid ? "ok" : "error",
									children: detailView.badge.statusText
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
									kind: "info",
									children: detailView.badge.sectionsText
								})]
							}),
							approvalList.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.groupLabel,
									children: t("detail.approval.title")
								}),
								approvalSummary !== null && approvalSummary.highRiskTotal > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
									kind: "warn",
									children: t("detail.approval.highRiskHint")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.conflictList,
									children: approvalList.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Checkbox, {
										checked: row.approved,
										onChange: (checked) => {
											if (installRef.current !== null) patchInstall({ approvals: {
												...installRef.current.approvals,
												[row.adapter]: checked
											} });
										},
										label: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: config_manager_module_css_default.conflictId,
												children: row.adapter
											}),
											" ",
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
												kind: row.highRisk ? "warn" : "info",
												children: row.highRisk ? t("detail.approval.requiresApproval") : t("detail.approval.safe")
											}),
											" ",
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
												kind: "info",
												children: row.label
											})
										] })
									}, row.adapter))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.statRow,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
										kind: approvalSummary !== null && approvalSummary.canImport ? "ok" : "warn",
										children: approvalSummary !== null ? t("detail.approval.count", {
											selected: String(approvalSummary.selected),
											total: String(approvalSummary.total)
										}) : ""
									})
								})
							] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.actionRow,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "primary",
									disabled: install.importing || approvalSummary !== null && !approvalSummary.canImport,
									onClick: () => {
										runImport();
									},
									children: install.importing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("common.loading") }) : t("detail.import")
								})
							})
						] }),
						install.importResult !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
							kind: install.importResult.ok ? "ok" : "error",
							children: [install.importResult.ok ? `导入完成：${install.importResult.executed.filter((e) => e.status === "ok").length} 项写入` : `导入失败（${install.importResult.executed.filter((e) => e.status === "failed").length} 项失败）`, install.importResult.needsRestart && " · 部分改动需重启 DSH 后生效"]
						})
					]
				})]
			})
		});
	};
	/** 装回本地详情展示用的仓库 URL（供应链警示来源行；取条目 repoUrl 兜底固定目标仓库） */
	function entryRepoUrl(itemId) {
		return (myItems ?? []).find((e) => e.id === itemId)?.repoUrl ?? `https://github.com/xiajiajun516/dsh-config-market`;
	}
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("myconfigs.tab.myconfigs"),
				subtitle: t("myconfigs.login.hint")
			}),
			renderLoginCard(),
			loginView.kind === "logged-in" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.groupLabel,
						children: t("myconfigs.upload.title")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: openUpload,
						children: t("myconfigs.upload.run")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.hint,
					children: t("myconfigs.upload.selectHint")
				})] }),
				renderList(),
				uploadOpen && renderWizard(),
				installOpen && renderInstall()
			] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: disclaimerKey !== null,
				title: t("disclaimer.title"),
				message: disclaimerText(),
				confirmLabel: t("disclaimer.confirm"),
				cancelLabel: t("common.cancel"),
				onConfirm: confirmDisclaimer,
				onCancel: cancelDisclaimer,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: config_manager_module_css_default.checkboxRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: dontAsk,
						onChange: (e) => {
							setDontAsk(e.target.checked);
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("disclaimer.dontAsk") })]
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: confirmDeleteId !== null,
				title: t("myconfigs.delete.confirmTitle"),
				message: t("myconfigs.delete.confirmText"),
				confirmLabel: t("myconfigs.delete.confirm"),
				cancelLabel: t("common.cancel"),
				danger: true,
				busy: deletingId !== null,
				onConfirm: async () => {
					const entry = (myItems ?? []).find((it) => it.id === confirmDeleteId);
					if (entry !== void 0) await runDelete(entry);
				},
				onCancel: () => {
					onMyConfirmDeleteChange(null);
				}
			})
		]
	});
}
//#endregion
//#region src/client/market/MarketPanel.tsx
/**
* 配置市场面板（备份与迁移页的第 5 个 tab 内容）。
*
* 产品决策：**内置单市场、只读、不可编辑** —— 市场绑定内置公开仓库
* `src/market/builtin.ts` 的 BUILTIN_MARKET_URL（创建者维护），无添加/移除/多市场 UI。
* 独立设置页壳已移除 —— tab 容器由 ConfigManagerSection 统一渲染，本组件只输出内容体：
* - 市场头部卡片：内置市场 URL + 官方徽章（不可编辑）+「拉取最新」；
* - 条目列表：搜索框 + 类别过滤 + 缓存状态徽章；
* - 条目详情：点「查看详情」→ POST /market/download（拉取 + §6 校验 + dry-run 预览）；
*   - **供应链警示恒展示**（来源 URL + 非官方审核 + 下载时间；确认导入前必经）；
*   - **逐分区批准**（安全不变式 (c)）：高风险分区默认不勾选、须逐项显式批准；
*   - 「确认导入」→ 只把已批准分区子计划交给 executeImportPlan（confirm:true 安全阀 + 回滚）。
*
* 全部渲染模型来自 ./market-view.ts 纯函数（node 单测覆盖），本组件只做装配；
* 状态组件内自持（useState），同时经 toMarketStoreSlice() 镜像进模块级 runStore：
* 模块级单例保证「切 tab 不丢」，sessionStorage 白名单保证「刷新恢复」
* （搜索词/类别筛选/条目列表/详情与逐分区批准/导入结果）。
* 安全：市场端点无任何 secret 输入（内置 URL 已由 validateRepoUrl 拒绝 userinfo）；downloaded
* 内容一律视为不可信，确认导入前 supply-chain 警示可见 & needsReview 恒 true（不允许默认信任）。
*/
const initial$2 = {
	subView: "browse",
	myItems: null,
	myItemsError: null,
	myWizard: null,
	myInstall: null,
	myConfirmDeleteId: null,
	loading: true,
	loadError: null,
	refreshing: false,
	browsing: false,
	items: [],
	search: "",
	category: "",
	sectionFilter: "",
	source: "all",
	sortKey: "default",
	downloadingId: null,
	detail: null,
	approvals: {},
	importing: false,
	importResult: null,
	error: null
};
/**
* 从 runStore 恢复上次的市场 UI 状态（切 tab 回 / 刷新后挂载）。
* 无敏感字段；detail.zipPath 为宿主受控临时文件（懒 GC 10 分钟），
* 若已过期，确认导入会得到明确错误 → 重新下载即可。
*/
function initFromStore$1() {
	const s = runStore.getSnapshot().market;
	return {
		...initial$2,
		subView: s.subView,
		myItems: s.myItems,
		myItemsError: s.myItemsError,
		myWizard: s.myWizard,
		myInstall: s.myInstall,
		myConfirmDeleteId: s.myConfirmDeleteId,
		search: s.search,
		category: s.category,
		sectionFilter: s.sectionFilter ?? "",
		source: s.source ?? "all",
		sortKey: s.sortKey ?? "default",
		items: s.items,
		detail: s.detail,
		approvals: s.approvals,
		importResult: s.importResult,
		error: s.error,
		loadError: s.loadError
	};
}
function MarketPanel({ api, myConfigsApi, importApi, syncApi, t }) {
	const uiT = api.t;
	const [state, setState] = (0, react.useState)(initFromStore$1);
	/** 最新 state 镜像（commit/卸载 flush 读取，避免闭包过期值） */
	const stateRef = (0, react.useRef)(state);
	/** 挂载守卫：卸载后不再 setState（store 镜像仍执行，异步结果照常落库） */
	const mountedRef = (0, react.useRef)(true);
	/**
	* 统一提交入口：更新 stateRef → 挂载时 setState → **总是**镜像进 runStore。
	* 关键：镜像不依赖 effect flush —— 异步操作（下载/确认导入）完成回调在组件
	* 已卸载（切走 tab）时也能把结果（detail/importResult）写进 store，切回恢复。
	*/
	const commit = (next) => {
		stateRef.current = next;
		if (mountedRef.current) setState(next);
		runStore.patch({ market: toMarketStoreSlice(next) });
	};
	const patch = (p) => commit({
		...stateRef.current,
		...p
	});
	/** 下载详情弹窗开关（瞬态 UI，不持久化） */
	const [downloadOpen, setDownloadOpen] = (0, react.useState)(false);
	/** 当前展示的免责弹窗操作（null = 无） */
	const [disclaimerKey, setDisclaimerKey] = (0, react.useState)(null);
	/** 免责弹窗「不再提示」勾选（每次打开重置） */
	const [dontAsk, setDontAsk] = (0, react.useState)(false);
	/** localStorage（浏览器环境；免责「不再提示」跨会话持久化） */
	const storage = window.localStorage;
	/** 待下载条目（免责确认后取用；避免免责流程中闭包过期） */
	const pendingDownloadItem = (0, react.useRef)(null);
	/** 点条目「查看详情」：未勾「不再提示」→ 先弹免责，确认后下载并打开详情弹窗 */
	const openDownload = (item) => {
		pendingDownloadItem.current = item;
		if (readDisclaimerDismissed("download", storage)) {
			setDownloadOpen(true);
			runDownload(item);
			return;
		}
		setDontAsk(false);
		setDisclaimerKey("download");
	};
	/** 免责弹窗确认：勾选则记录「不再提示」→ 关闭免责 → 打开下载详情弹窗并启动下载 */
	const confirmDownloadDisclaimer = () => {
		if (disclaimerKey !== "download") return;
		if (dontAsk) writeDisclaimerDismissed("download", storage);
		setDisclaimerKey(null);
		const item = pendingDownloadItem.current;
		setDownloadOpen(true);
		if (item !== null) runDownload(item);
	};
	/** 关闭下载详情弹窗：清 detail（弹窗即会话，关闭即放弃） */
	const closeDownload = () => {
		setDownloadOpen(false);
		patch({
			detail: null,
			importResult: null,
			error: null,
			approvals: {}
		});
	};
	/** 卸载时置挂载守卫 + 最后镜像一次（防止「最后一次改动后立即切 tab」时丢状态）。 */
	(0, react.useEffect)(() => () => {
		mountedRef.current = false;
		runStore.patch({ market: toMarketStoreSlice(stateRef.current) });
	}, []);
	/** 内置市场 URL（单一权威；来自 Host 内置常量；用于条目来源判定与详情供应链警示） */
	const marketUrl = BUILTIN_MARKET_URL;
	/** 挂载时读取内置市场状态；返回响应供「首次打开自动更新」判据（bootAutoRefreshed） */
	const loadStatus = (0, react.useCallback)(async () => {
		patch({
			loading: true,
			loadError: null
		});
		try {
			const info = await api.status();
			patch({ loading: false });
			return info;
		} catch (err) {
			patch({
				loading: false,
				loadError: err instanceof Error ? err.message : String(err)
			});
			return null;
		}
	}, [api]);
	/**
	* 启动后首次打开市场页 → 自动拉取一次最新 index（需求：dsh 启动后第一次打开市场页面自动更新一次市场）。
	* 判据是 Host 侧进程内存标记 bootAutoRefreshed（dsh 重启后归零；refresh 成功后置位），
	* 因此「每次打开都刷新」/「刷新失败后下次打开重试」都自然成立；无需客户端持久化。
	* bootAutoChecked 同步置位防 StrictMode 双执行/竞态重复触发（同一组件实例只自动刷一次）。
	*/
	const bootAutoChecked = (0, react.useRef)(false);
	(0, react.useEffect)(() => {
		if (bootAutoChecked.current) return;
		bootAutoChecked.current = true;
		(async () => {
			const info = await loadStatus();
			if (info !== null && info.bootAutoRefreshed !== true) await runRefresh();
		})();
	}, []);
	/** 拉取内置市场最新 index.json → 重新浏览（缓存状态由 Host 合并） */
	const runRefresh = async () => {
		patch({
			refreshing: true,
			error: null,
			detail: null
		});
		try {
			await api.refresh();
			const res = await api.browse();
			patch({
				refreshing: false,
				browsing: false,
				items: res.items,
				search: "",
				category: ""
			});
			loadStatus();
		} catch (err) {
			patch({
				refreshing: false,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 浏览（不重新拉取）：POST /market/browse 合并 index + 缓存 */
	const runBrowse = async () => {
		patch({
			browsing: true,
			error: null
		});
		try {
			const res = await api.browse();
			patch({
				browsing: false,
				items: res.items,
				search: "",
				category: ""
			});
		} catch (err) {
			patch({
				browsing: false,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 下载 + 校验单条目 → dry-run 详情预览（零写入）。自托管条目（带 repo）必须携带来源仓库。
	*  竞态守卫：下载期间用户可发起另一条目下载（downloadingId 已变），晚到响应一律丢弃，
	*  防止「弹窗标题是 B、详情是 A」的串扰。 */
	const runDownload = async (item) => {
		patch({
			downloadingId: item.id,
			error: null
		});
		try {
			const detail = await api.download(item.id, item.repo);
			if (stateRef.current.downloadingId !== item.id) return;
			patch({
				downloadingId: null,
				detail,
				approvals: defaultApprovals(detail.plan)
			});
		} catch (err) {
			if (stateRef.current.downloadingId !== item.id) return;
			patch({
				downloadingId: null,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	/** 确认导入：只导入用户显式批准的逐分区子集（subPlan 模式，与 sync-engine 同款） */
	const runImport = async () => {
		const detail = state.detail;
		if (detail === null) return;
		const approvedPlan = buildApprovedPlan(detail.plan, state.approvals);
		if (approvedPlan.items.length === 0) {
			patch({ error: t("detail.noApproval") });
			return;
		}
		patch({
			importing: true,
			error: null
		});
		try {
			const executed = await importApi.executeImportPlan(detail.zipPath, approvedPlan, {
				confirm: true,
				rollbackOnError: true
			});
			patch({
				importing: false,
				importResult: executed
			});
		} catch (err) {
			patch({
				importing: false,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	};
	const sectionFiltered = filterMarketBySection(filterMarketItems(state.items, state.search, state.category), state.sectionFilter);
	const filtered = sortMarketItems(filterBySource(sectionFiltered.matched, state.source, marketUrl), state.sortKey);
	const sectionFilterUnknown = sectionFiltered.unknown;
	const summary = marketListSummary(state.items, uiT);
	const categories = collectCategories(state.items);
	const sectionOptions = collectCachedSections(state.items);
	const detailView = state.detail !== null ? marketDetailView(state.detail, state.detail.repo ?? marketUrl, state.items.length > 0 || state.detail.status !== "valid", uiT) : null;
	const approvalList = state.detail !== null ? approvalRows(state.detail.plan, state.approvals) : [];
	const approvalSummary = state.detail !== null ? approvedAdapterSummary(state.detail.plan, state.approvals) : null;
	const impact = state.detail !== null ? marketImpactSummary(state.detail.plan, state.detail.analysis) : null;
	const cacheLabel = (cacheState) => {
		if (cacheState === "cached") return t("list.cacheCached");
		if (cacheState === "fresh") return t("list.cacheFresh");
		return t("list.cacheNone");
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.modeTabs,
			role: "tablist",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				role: "tab",
				"aria-selected": state.subView === "browse",
				"data-active": state.subView === "browse" ? "" : void 0,
				className: config_manager_module_css_default.modeTab,
				onClick: () => {
					patch({ subView: "browse" });
				},
				children: t("myconfigs.tab.browse")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				type: "button",
				role: "tab",
				"aria-selected": state.subView === "myconfigs",
				"data-active": state.subView === "myconfigs" ? "" : void 0,
				className: config_manager_module_css_default.modeTab,
				onClick: () => {
					patch({ subView: "myconfigs" });
				},
				children: t("myconfigs.tab.myconfigs")
			})]
		}), state.subView === "myconfigs" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MyConfigsView, {
			meApi: myConfigsApi,
			api,
			importApi,
			syncApi,
			t,
			myItems: state.myItems,
			myItemsError: state.myItemsError,
			onMyItemsChange: (items, error) => {
				patch({
					myItems: items,
					myItemsError: error
				});
			},
			myWizard: state.myWizard,
			onMyWizardChange: (wizard) => {
				patch({ myWizard: wizard });
			},
			myInstall: state.myInstall,
			onMyInstallChange: (install) => {
				patch({ myInstall: install });
			},
			myConfirmDeleteId: state.myConfirmDeleteId,
			onMyConfirmDeleteChange: (id) => {
				patch({ myConfirmDeleteId: id });
			}
		}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("section.label"),
				subtitle: t("section.description")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: config_manager_module_css_default.groupLabel,
				children: t("config.title")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.actionRow,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					disabled: state.refreshing || state.importing || state.browsing,
					onClick: () => {
						runRefresh();
					},
					children: state.refreshing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("config.refreshing") }) : t("config.refresh")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					disabled: state.browsing || state.refreshing || state.importing,
					onClick: () => {
						runBrowse();
					},
					children: state.browsing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("list.loading") }) : t("list.browse")
				})]
			})] }),
			state.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
				kind: "error",
				children: state.error
			}),
			downloadOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.dialogMask,
				onMouseDown: (e) => {
					if (e.target === e.currentTarget && !state.importing) closeDownload();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("detail.title"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogHeaderRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: config_manager_module_css_default.dialogHeader,
							children: [
								t("detail.title"),
								"：",
								state.detail !== null ? state.detail.name : state.downloadingId ?? ""
							]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: config_manager_module_css_default.dialogClose,
							"aria-label": t("common.close"),
							disabled: state.importing,
							onClick: closeDownload,
							children: "×"
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogBodyScroll,
						children: [
							state.error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: "error",
								children: redact(state.error)
							}),
							state.detail === null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
								className: config_manager_module_css_default.statRow,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("common.loading") })
							}),
							state.detail !== null && detailView !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
									kind: "warn",
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: t("detail.needReview") })
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.warnList,
									children: detailView.warnings.map((w, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
										style: { color: w.kind === "warn" ? "var(--dsw-alias-state-warn-primary)" : void 0 },
										children: w.text
									}, i))
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: config_manager_module_css_default.statRow,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: detailView.badge.statusKind === "ok" ? "ok" : "error",
											children: detailView.badge.statusText
										}),
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "info",
											children: detailView.badge.sectionsText
										}),
										state.detail.version !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "info",
											children: t("detail.version", { version: state.detail.version })
										})
									]
								}),
								detailView.errors.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: config_manager_module_css_default.fieldLabel,
									children: t("detail.errors")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.reportScroll,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
										className: config_manager_module_css_default.warnList,
										children: detailView.errors.map((e, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: e }, i))
									})
								})] }),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
									kind: "info",
									children: t("detail.previewHint")
								}),
								impact !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: config_manager_module_css_default.statRow,
									children: [
										/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "info",
											children: t("detail.impact.willChange", { count: String(impact.willChange) })
										}),
										impact.unchanged > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "ok",
											children: t("detail.impact.unchanged", { count: String(impact.unchanged) })
										}),
										impact.conflicts > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "error",
											children: t("detail.impact.conflicts", { count: String(impact.conflicts) })
										}),
										impact.secretsNeeded > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "warn",
											children: t("detail.impact.secrets", { count: String(impact.secretsNeeded) })
										}),
										impact.pathMappingsNeeded > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "warn",
											children: t("detail.impact.paths", { count: String(impact.pathMappingsNeeded) })
										}),
										impact.needsRestart && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "warn",
											children: t("detail.impact.restart")
										})
									]
								}),
								detailView.canImport && approvalList.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: config_manager_module_css_default.groupLabel,
										children: t("detail.approval.title")
									}),
									approvalSummary !== null && approvalSummary.highRiskTotal > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
										kind: "warn",
										children: t("detail.approval.highRiskHint")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: config_manager_module_css_default.conflictList,
										children: approvalList.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
											className: config_manager_module_css_default.checkboxRow,
											children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: row.approved,
												onChange: (e) => {
													patch({ approvals: {
														...state.approvals,
														[row.adapter]: e.target.checked
													} });
												}
											}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
													className: config_manager_module_css_default.conflictId,
													children: row.adapter
												}),
												" ",
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
													kind: row.highRisk ? "warn" : "info",
													children: row.highRisk ? t("detail.approval.requiresApproval") : t("detail.approval.safe")
												}),
												" ",
												/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
													kind: "info",
													children: row.label
												})
											] })]
										}, row.adapter))
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
										className: config_manager_module_css_default.statRow,
										children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: approvalSummary !== null && approvalSummary.canImport ? "ok" : "warn",
											children: approvalSummary !== null ? t("detail.approval.count", {
												selected: String(approvalSummary.selected),
												total: String(approvalSummary.total)
											}) : ""
										})
									})
								] }),
								detailView.canImport ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									className: config_manager_module_css_default.actionRow,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
										variant: "primary",
										disabled: state.importing || approvalSummary !== null && !approvalSummary.canImport,
										onClick: () => {
											runImport();
										},
										children: state.importing ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("common.loading") }) : t("detail.import")
									})
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
									kind: "error",
									children: t("detail.emptySections")
								}),
								state.importResult !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
									kind: state.importResult.ok ? "ok" : "error",
									children: [state.importResult.ok ? `导入完成：${state.importResult.executed.filter((e) => e.status === "ok").length} 项写入` : `导入失败（${state.importResult.executed.filter((e) => e.status === "failed").length} 项失败）`, state.importResult.needsRestart && " · 部分改动需重启 DSH 后生效"]
								})
							] })
						]
					})]
				})
			}),
			!downloadOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
				state.loadError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("list.empty") }),
				state.loadError === null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "text",
							className: config_manager_module_css_default.input,
							value: state.search,
							placeholder: t("list.searchPlaceholder"),
							onChange: (e) => {
								patch({ search: e.target.value });
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							className: config_manager_module_css_default.select,
							value: state.category,
							onChange: (e) => {
								patch({ category: e.target.value });
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "",
								children: t("list.categoriesAll")
							}), categories.map((c) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							className: config_manager_module_css_default.select,
							value: state.sectionFilter,
							onChange: (e) => {
								patch({ sectionFilter: e.target.value });
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "",
								children: t("list.sectionsAll")
							}), sectionOptions.map((s) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: s,
								children: s
							}, s))]
						}),
						state.sectionFilter !== "" && sectionFilterUnknown > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.hint,
							children: t("list.sectionsUnknown", { count: String(sectionFilterUnknown) })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							className: config_manager_module_css_default.select,
							value: state.source,
							onChange: (e) => {
								patch({ source: e.target.value });
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "all",
									children: t("list.sourceAll")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "official",
									children: t("list.sourceOfficial")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "personal",
									children: t("list.sourcePersonal")
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							className: config_manager_module_css_default.select,
							value: state.sortKey,
							onChange: (e) => {
								patch({ sortKey: e.target.value });
							},
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "default",
									children: t("list.sortDefault")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "updatedAt",
									children: t("list.sortUpdated")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "stars",
									children: t("list.sortStars")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "name",
									children: t("list.sortName")
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: filtered.length > 0 ? filtered.length < summary.total ? `${t("list.count", { count: String(summary.total) })}${t("list.filtered", { count: String(filtered.length) })}` : t("list.count", { count: String(summary.total) }) : t("list.count", { count: String(summary.total) })
						})
					]
				}),
				state.browsing && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.statRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("list.loading") })
				}),
				!state.browsing && state.loadError === null && state.items.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("list.noItems") }),
				!state.browsing && state.loadError === null && filtered.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.snapshotList,
					children: filtered.map((it) => {
						const sourceKind = sourceBadgeKind(it, marketUrl);
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.statRow,
							style: { paddingTop: 4 },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								style: {
									flex: 1,
									minWidth: 0
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: config_manager_module_css_default.conflictHead,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
											className: config_manager_module_css_default.conflictId,
											children: it.name
										}), it.version !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
											kind: "info",
											children: it.version
										})]
									}),
									(it.author !== void 0 || it.description !== void 0) && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
										className: config_manager_module_css_default.hint,
										children: [
											it.author !== void 0 ? `${it.author}` : "",
											it.author !== void 0 && it.description !== void 0 ? " · " : "",
											it.description ?? ""
										]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: config_manager_module_css_default.statRow,
										children: [
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
												kind: sourceKind,
												children: sourceKind === "ok" ? t("list.sourceOfficial") : t("list.sourcePersonal")
											}),
											(it.categories ?? []).map((c) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
												kind: "info",
												children: c
											}, c)),
											/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
												kind: it.cacheState === "cached" ? "ok" : it.cacheState === "fresh" ? "info" : "warn",
												children: cacheLabel(it.cacheState)
											}),
											it.stars !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
												kind: "info",
												title: t("list.starsHint"),
												children: t("list.stars", { count: String(it.stars) })
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								disabled: state.downloadingId !== null,
								onClick: () => {
									openDownload(it);
								},
								children: state.downloadingId === it.id ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("common.loading") }) : t("list.download")
							})]
						}, it.id);
					})
				})
			] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: disclaimerKey === "download",
				title: t("disclaimer.title"),
				message: t("disclaimer.download.text"),
				confirmLabel: t("disclaimer.confirm"),
				cancelLabel: t("common.cancel"),
				onConfirm: confirmDownloadDisclaimer,
				onCancel: () => {
					setDisclaimerKey(null);
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: config_manager_module_css_default.checkboxRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: dontAsk,
						onChange: (e) => {
							setDontAsk(e.target.checked);
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("disclaimer.dontAsk") })]
				})
			})
		] })]
	});
}
//#endregion
//#region src/client/about/about-view.ts
/**
* 由仓库 URL 派生各链接；恒等推导，杜绝拼接错误。
*
* - starUrl = repoUrl（去尾斜杠归一化后原样）；
* - docsUrl = repoUrl + '#readme'；
* - issuesUrl = repoUrl + '/issues'；
* - releasesUrl = repoUrl + '/releases'；
* - 输入尾斜杠（含多个）会被归一化去除，如 'https://…/repo/' → 'https://…/repo'。
*/
function deriveAboutLinks(repoUrl) {
	const base = repoUrl.trim().replace(/\/+$/, "");
	return {
		starUrl: base,
		repoUrl: base,
		docsUrl: `${base}#readme`,
		issuesUrl: `${base}/issues`,
		releasesUrl: `${base}/releases`
	};
}
/**
* 动态状态 → 展示行（版本 / DSH / 平台）。
*
* - version = pluginVersion（原样透传，避免 client 侧重复维护版本号）；
* - dsh = dshVersion（原样透传）；
* - platform = `${platform} · ${arch}`（合并平台与架构，供 Badge 单行展示）。
*/
function aboutStatusRows(status) {
	return {
		version: status.pluginVersion,
		dsh: status.dshVersion,
		platform: `${status.platform} · ${status.arch}`
	};
}
/** 插件公开元数据常量（见设计文档 §3；repoUrl 与 package.json repository 一致） */
const ABOUT_META = {
	name: "DSH Config Manager",
	repoUrl: "https://github.com/xiajiajun516/dsh-config-manager",
	author: "xiajiajun516",
	authorUrl: "https://github.com/xiajiajun516"
};
/** 由 ABOUT_META.repoUrl 派生的外链常量（单一来源，恒与元数据一致） */
const ABOUT_LINKS = deriveAboutLinks(ABOUT_META.repoUrl);
/** CLI 引导卡的展示数据（P1-⑩：GUI 里发现不了 CLI → About 面板给安装/常用命令/文档入口）。
*  CLI 是独立 npm 工具（与插件分开安装：`--omit=peer` 让离线救援端零 DSH 运行时依赖），
*  DSH 挂了也能用；文案与命令见 README.md「CLI — the first line of defense」。 */
const ABOUT_CLI = {
	installCommand: "npm install -g dsh-config-manager@latest --omit=peer",
	commands: [
		{
			command: "dsh-config-manager help",
			description: "列出全部 CLI 命令与用法（离线可用）"
		},
		{
			command: "dsh-config-manager snapshots",
			description: "列出本机回滚快照（无需 DSH 运行）"
		},
		{
			command: "dsh-config-manager restore [--id <id>] [--dry-run]",
			description: "恢复到导入前状态（离线）"
		},
		{
			command: "dsh-config-manager reinstall [--yes] [--wipe-config]",
			description: "一键重装 DSH（救援）"
		}
	],
	docsUrl: "https://github.com/xiajiajun516/dsh-config-manager#-cli--the-first-line-of-defense-when-dsh-is-broken"
};
//#endregion
//#region src/client/about/release-notes-view.ts
/**
* 解析 GitHub 仓库 URL，提取 owner 与 repo。
* 例如 'https://github.com/xiajiajun516/dsh-config-manager' → { owner: 'xiajiajun516', repo: 'dsh-config-manager' }
*/
function parseGitHubRepo(repoUrl) {
	if (typeof repoUrl !== "string") return null;
	const match = repoUrl.trim().replace(/\/+$/, "").match(/^https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/i);
	if (!match || !match[1] || !match[2]) return null;
	return {
		owner: match[1],
		repo: match[2].replace(/\.git$/i, "")
	};
}
/**
* 构造 GitHub Releases API URL。
*/
function buildReleasesApiUrl(repoUrl, page = 1, perPage = 5) {
	const parsed = parseGitHubRepo(repoUrl);
	const safePage = Math.max(1, Math.floor(page));
	const safePerPage = Math.max(1, Math.min(100, Math.floor(perPage)));
	if (!parsed) return `https://api.github.com/repos/xiajiajun516/dsh-config-manager/releases?page=${safePage}&per_page=${safePerPage}`;
	return `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/releases?page=${safePage}&per_page=${safePerPage}`;
}
/**
* 由仓库 URL 派生 Releases 页面 URL。
*/
function deriveReleasesUrl(repoUrl) {
	return `${repoUrl.trim().replace(/\/+$/, "")}/releases`;
}
/**
* 格式化 ISO 日期为可读字符串（YYYY-MM-DD）。
*/
function formatReleaseDate(isoDate) {
	if (!isoDate || typeof isoDate !== "string") return "";
	try {
		const d = new Date(isoDate);
		if (isNaN(d.getTime())) return isoDate;
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
	} catch {
		return isoDate;
	}
}
/**
* 解析单个 GitHub Release 原始对象为规范化 FormattedRelease。
* draft 统一过滤（返回 null）。
*/
function parseReleaseItem(raw) {
	if (typeof raw !== "object" || raw === null) return null;
	const item = raw;
	if (item.draft === true) return null;
	const tag = typeof item.tag_name === "string" && item.tag_name.trim() !== "" ? item.tag_name.trim() : "";
	if (!tag) return null;
	const id = typeof item.id === "number" ? item.id : Math.floor(Math.random() * 1e6);
	const title = typeof item.name === "string" && item.name.trim() !== "" ? item.name.trim() : tag;
	const body = typeof item.body === "string" ? item.body : "";
	const publishedAt = item.published_at || item.created_at || "";
	return {
		id,
		tag,
		title,
		body,
		publishedAt,
		publishedDateStr: formatReleaseDate(publishedAt),
		url: typeof item.html_url === "string" && item.html_url !== "" ? item.html_url : `https://github.com/xiajiajun516/dsh-config-manager/releases/tag/${encodeURIComponent(tag)}`,
		isPrerelease: item.prerelease === true
	};
}
/**
* 解析 API 返回的 Releases 数组。
*/
function parseReleasesResponse(data) {
	if (!Array.isArray(data)) return [];
	const list = [];
	for (const item of data) {
		const parsed = parseReleaseItem(item);
		if (parsed !== null) list.push(parsed);
	}
	return list;
}
/**
* 分页获取 GitHub Releases。
*/
async function fetchReleases(repoUrl, page = 1, perPage = 5, fetcher = globalThis.fetch) {
	const res = await fetcher(buildReleasesApiUrl(repoUrl, page, perPage), { headers: { Accept: "application/vnd.github.v3+json" } });
	if (!res.ok) {
		if (res.status === 403 || res.status === 429) throw new Error("GitHub API 速率限制（Rate limit exceeded），请稍后再试或直接在 GitHub 上查看。");
		if (res.status === 404) return {
			releases: [],
			hasMore: false,
			page
		};
		throw new Error(`GitHub API 请求失败 (${res.status} ${res.statusText})`);
	}
	const json = await res.json();
	return {
		releases: parseReleasesResponse(json),
		hasMore: Array.isArray(json) && json.length >= perPage,
		page
	};
}
/**
* 将 GitHub Release body 纯文本转换为结构化 Markdown 块列表，
* 供 React 纯组件进行安全渲染，不依赖任何第三方 Markdown 库与 innerHTML。
*/
function parseMarkdownBlocks(text) {
	if (!text || typeof text !== "string") return [];
	const lines = text.split(/\r?\n/);
	const blocks = [];
	let inCodeBlock = false;
	let codeLang = "";
	let codeBuffer = [];
	for (let i = 0; i < lines.length; i++) {
		const rawLine = lines[i];
		const trimmed = rawLine.trim();
		if (trimmed.startsWith("```")) {
			if (inCodeBlock) {
				blocks.push({
					type: "code-block",
					code: codeBuffer.join("\n"),
					lang: codeLang || void 0
				});
				codeBuffer = [];
				inCodeBlock = false;
				codeLang = "";
			} else {
				inCodeBlock = true;
				codeLang = trimmed.slice(3).trim();
				codeBuffer = [];
			}
			continue;
		}
		if (inCodeBlock) {
			codeBuffer.push(rawLine);
			continue;
		}
		if (trimmed === "") continue;
		if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
			blocks.push({ type: "hr" });
			continue;
		}
		const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
		if (headingMatch && headingMatch[1] && headingMatch[2]) {
			blocks.push({
				type: "heading",
				level: headingMatch[1].length,
				text: headingMatch[2].trim()
			});
			continue;
		}
		if (trimmed.startsWith(">")) {
			blocks.push({
				type: "quote",
				text: trimmed.replace(/^>\s*/, "").trim()
			});
			continue;
		}
		const unorderedMatch = trimmed.match(/^[-*+]\s+(.+)$/);
		if (unorderedMatch && unorderedMatch[1]) {
			blocks.push({
				type: "list-item",
				text: unorderedMatch[1].trim(),
				ordered: false
			});
			continue;
		}
		const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
		if (orderedMatch && orderedMatch[1] && orderedMatch[2]) {
			blocks.push({
				type: "list-item",
				text: orderedMatch[2].trim(),
				ordered: true,
				index: parseInt(orderedMatch[1], 10)
			});
			continue;
		}
		blocks.push({
			type: "paragraph",
			text: trimmed
		});
	}
	if (inCodeBlock && codeBuffer.length > 0) blocks.push({
		type: "code-block",
		code: codeBuffer.join("\n"),
		lang: codeLang || void 0
	});
	return blocks;
}
//#endregion
//#region src/client/about/ReleaseNotesDialog.tsx
/**
* ReleaseNotesDialog —— GitHub Releases 版本更新内容弹窗。
*
* 特性：
* - 动态拉取 GitHub Releases 真实数据（过滤草稿）
* - 支持向下无限滚动加载更多版本（分页 pagination）
* - 纯安全 Markdown 渲染（不使用 dangerouslySetInnerHTML，杜绝 XSS）
* - 各版本状态徽章（最新 / 预发布）、发布日期与对应 GitHub Release 快速跳转
* - 遵循 --dsw-* token 与 dialog 体系样式（dialogMask / dialogCard / dialogWide）
*/
const PAGE_SIZE = 5;
/**
* 纯 React 安全渲染 Markdown 文本行中的行内格式（粗体、行内代码、链接）。
*/
function renderInlineMarkdown(text) {
	return text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, idx) => {
		if (!part) return null;
		if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
			className: config_manager_module_css_default.cliName,
			children: part.slice(1, -1)
		}, idx);
		if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("strong", { children: part.slice(2, -2) }, idx);
		const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
		if (linkMatch && linkMatch[1] && linkMatch[2]) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
			href: linkMatch[2],
			target: "_blank",
			rel: "noreferrer",
			className: config_manager_module_css_default.aboutAuthor,
			children: linkMatch[1]
		}, idx);
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: part }, idx);
	});
}
/**
* 渲染单个结构化 Markdown 块。
*/
function MarkdownBlockView({ block }) {
	switch (block.type) {
		case "heading": {
			const headingStyle = {
				fontWeight: 600,
				color: "var(--dsw-alias-label-primary)",
				marginTop: block.level === 1 ? "12px" : "8px",
				marginBottom: "4px",
				fontSize: block.level === 1 ? "15px" : block.level === 2 ? "14px" : "13px"
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: headingStyle,
				children: block.text
			});
		}
		case "list-item": return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				gap: "6px",
				alignItems: "flex-start",
				paddingLeft: "4px"
			},
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				style: {
					color: "var(--dsw-alias-label-tertiary)",
					userSelect: "none"
				},
				children: block.ordered ? `${block.index ?? 1}.` : "•"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: { flex: 1 },
				children: renderInlineMarkdown(block.text)
			})]
		});
		case "quote": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			style: {
				borderLeft: "3px solid var(--dsw-alias-border-l1)",
				paddingLeft: "8px",
				color: "var(--dsw-alias-label-secondary)",
				fontStyle: "italic"
			},
			children: renderInlineMarkdown(block.text)
		});
		case "code-block": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
			className: config_manager_module_css_default.cliCommand,
			style: {
				margin: "4px 0",
				padding: "8px",
				fontSize: "12px"
			},
			children: block.code
		});
		case "hr": return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { style: {
			borderBottom: "1px solid var(--dsw-alias-border-l2)",
			margin: "8px 0"
		} });
		default: return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: renderInlineMarkdown(block.text) });
	}
}
/**
* 单个版本的卡片视图。
*/
function ReleaseCardView({ release, isFirst, t }) {
	const blocks = parseMarkdownBlocks(release.body);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			flexDirection: "column",
			gap: "8px",
			padding: "12px",
			background: "var(--dsw-alias-bg-base)",
			border: "1px solid var(--dsw-alias-border-l1)",
			borderRadius: "8px"
		},
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				justifyContent: "space-between",
				alignItems: "flex-start",
				gap: "8px",
				flexWrap: "wrap"
			},
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: "8px",
					flexWrap: "wrap"
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							fontSize: "14px",
							fontWeight: 600,
							color: "var(--dsw-alias-label-primary)"
						},
						children: release.title
					}),
					isFirst && !release.isPrerelease && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "ok",
						children: t("about.releaseNotes.latest")
					}),
					release.isPrerelease && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "warn",
						children: t("about.releaseNotes.prerelease")
					}),
					release.publishedDateStr && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						style: {
							fontSize: "12px",
							color: "var(--dsw-alias-label-tertiary)"
						},
						children: release.publishedDateStr
					})
				]
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Button, {
				href: release.url,
				title: t("about.releaseNotes.viewSingleOnGithub"),
				className: config_manager_module_css_default.dialogClose,
				children: [t("about.releaseNotes.viewSingleOnGithub"), " ↗"]
			})]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			style: {
				display: "flex",
				flexDirection: "column",
				gap: "6px",
				fontSize: "13px",
				lineHeight: "1.6",
				color: "var(--dsw-alias-label-primary)"
			},
			children: blocks.length > 0 ? blocks.map((block, idx) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarkdownBlockView, { block }, idx)) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					color: "var(--dsw-alias-label-tertiary)",
					fontStyle: "italic"
				},
				children: t("about.releaseNotes.noBody")
			})
		})]
	});
}
function ReleaseNotesDialog({ open, onClose, onConfirm, onNeverShow, t, repoUrl = ABOUT_META.repoUrl }) {
	const [releases, setReleases] = (0, react.useState)([]);
	const [page, setPage] = (0, react.useState)(1);
	const [loading, setLoading] = (0, react.useState)(false);
	const [loadingMore, setLoadingMore] = (0, react.useState)(false);
	const [hasMore, setHasMore] = (0, react.useState)(true);
	const [error, setError] = (0, react.useState)(null);
	const bodyRef = (0, react.useRef)(null);
	const isFetchingRef = (0, react.useRef)(false);
	const handleConfirm = () => {
		if (onConfirm) onConfirm();
		else onClose();
	};
	const handleNeverShow = () => {
		if (onNeverShow) onNeverShow();
		else onClose();
	};
	const loadFirstPage = (0, react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		setReleases([]);
		setPage(1);
		setHasMore(true);
		isFetchingRef.current = true;
		try {
			const result = await fetchReleases(repoUrl, 1, PAGE_SIZE);
			setReleases(result.releases);
			setHasMore(result.hasMore);
			setPage(1);
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			setLoading(false);
			isFetchingRef.current = false;
		}
	}, [repoUrl]);
	const loadNextPage = (0, react.useCallback)(async () => {
		if (isFetchingRef.current || !hasMore || loading || loadingMore) return;
		isFetchingRef.current = true;
		setLoadingMore(true);
		const nextPage = page + 1;
		try {
			const result = await fetchReleases(repoUrl, nextPage, PAGE_SIZE);
			setReleases((prev) => [...prev, ...result.releases]);
			setHasMore(result.hasMore);
			setPage(nextPage);
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			setLoadingMore(false);
			isFetchingRef.current = false;
		}
	}, [
		hasMore,
		loading,
		loadingMore,
		page,
		repoUrl
	]);
	(0, react.useEffect)(() => {
		if (open) loadFirstPage();
	}, [open, loadFirstPage]);
	(0, react.useEffect)(() => {
		if (!open) return;
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	const handleScroll = () => {
		const el = bodyRef.current;
		if (!el) return;
		if (el.scrollHeight - el.scrollTop - el.clientHeight < 100 && hasMore && !loading && !loadingMore && !error) loadNextPage();
	};
	if (!open) return null;
	const releasesPageUrl = deriveReleasesUrl(repoUrl);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: config_manager_module_css_default.dialogMask,
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
			style: {
				width: "min(640px, 100%)",
				maxHeight: "85vh"
			},
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.dialogHeaderRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							alignItems: "center",
							gap: "8px"
						},
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.dialogHeader,
							children: t("about.releaseNotes.title")
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						className: config_manager_module_css_default.dialogClose,
						onClick: onClose,
						"aria-label": t("common.close"),
						children: "×"
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					ref: bodyRef,
					className: config_manager_module_css_default.dialogBodyScroll,
					onScroll: handleScroll,
					style: {
						maxHeight: "65vh",
						gap: "12px"
					},
					children: [
						loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								padding: "24px 0",
								display: "flex",
								justifyContent: "center"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("about.releaseNotes.loading") })
						}),
						error !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
							kind: "error",
							children: error
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: config_manager_module_css_default.actionRow,
							style: { marginTop: "8px" },
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								onClick: () => {
									loadFirstPage();
								},
								children: t("about.releaseNotes.retry")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								href: releasesPageUrl,
								children: t("about.releaseNotes.viewOnGithub")
							})]
						})] }),
						!loading && error === null && releases.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								padding: "20px 0",
								textAlign: "center",
								color: "var(--dsw-alias-label-secondary)"
							},
							children: t("about.releaseNotes.empty")
						}),
						!loading && releases.map((release, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReleaseCardView, {
							release,
							isFirst: index === 0,
							t
						}, release.id)),
						loadingMore && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							style: {
								padding: "12px 0",
								display: "flex",
								justifyContent: "center"
							},
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("about.releaseNotes.loadingMore") })
						}),
						!loading && !loadingMore && !hasMore && releases.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							style: {
								textAlign: "center",
								padding: "8px 0",
								fontSize: "12px",
								color: "var(--dsw-alias-label-tertiary)"
							},
							children: [
								"— ",
								t("about.releaseNotes.allLoaded"),
								" —"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					style: {
						justifyContent: "space-between",
						alignItems: "center",
						borderTop: "1px solid var(--dsw-alias-border-l1)",
						paddingTop: "10px",
						flexWrap: "wrap",
						gap: "8px"
					},
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						href: releasesPageUrl,
						children: t("about.releaseNotes.viewOnGithub")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							gap: "8px",
							alignItems: "center"
						},
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							onClick: handleNeverShow,
							children: t("about.releaseNotes.neverShow")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: handleConfirm,
							children: t("about.releaseNotes.confirm")
						})]
					})]
				})
			]
		})
	});
}
//#endregion
//#region src/client/about/AboutPanel.tsx
/**
* 「关于（About）」面板（设置页第 6 个 tab 内容，docs/design/2026-08-19-about-tab-design.md §4）。
*
* 纯静态展示视图 + 外链，无表单 / 无写操作 / 无新增依赖：
* - 项目信息卡：插件名 + 官方 Badge；版本 / DSH / 平台 Badge（运行时信息，经 api.status() 获取）；
* - 相关链接卡：Star 主按钮（外链）+ 仓库 / 文档 / Issues 链接行 + 作者行；
* - 公开元数据（名称 / 仓库 / 作者 / 链接）全部来自 ./about-view.ts 的 ABOUT_META / ABOUT_LINKS
*   （静态常量，单一来源，node 单测覆盖）；
* - 状态行格式化委托 ./about-view.ts 的 aboutStatusRows 纯函数（组件不实现可测试业务逻辑）；
* - 版本号不在此重复维护 —— 展示值一律来自 status()（AGENTS.md §版本号三处同步教训）。
*
* 安全：无任何输入表单（无 secret 泄漏面）；外链一律 target="_blank" + rel="noreferrer"
* （防 tabnabbing）；错误文本渲染前经 redact() 兜底（安全不变量）。
* 状态组件内自持（低频静态视图，同 Snapshots/Sync/Market 策略，不进 sessionStorage）。
*/
const initial$1 = {
	loading: true,
	loadError: null,
	rows: null
};
function AboutPanel({ api, t }) {
	const [state, setState] = (0, react.useState)(initial$1);
	const [releaseNotesOpen, setReleaseNotesOpen] = (0, react.useState)(false);
	const patch = (p) => setState((s) => ({
		...s,
		...p
	}));
	/** 读取运行时版本信息（pluginVersion / dshVersion / platform+arch → 展示行） */
	const loadStatus = (0, react.useCallback)(async () => {
		patch({
			loading: true,
			loadError: null
		});
		try {
			const status = await api.status();
			patch({
				loading: false,
				rows: aboutStatusRows(status)
			});
		} catch (err) {
			patch({
				loading: false,
				loadError: err instanceof Error ? err.message : String(err)
			});
		}
	}, [api]);
	(0, react.useEffect)(() => {
		loadStatus();
	}, []);
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("about.title"),
				subtitle: t("about.subtitle")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.groupLabel,
					children: ABOUT_META.name
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.statRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: "ok",
						children: t("about.official")
					})
				}),
				state.loading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.statRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("about.loading") })
				}),
				state.loadError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
					kind: "error",
					children: redact(state.loadError)
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.actionRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						onClick: () => {
							loadStatus();
						},
						children: t("about.retryStatus")
					})
				})] }),
				state.rows !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					style: {
						flexWrap: "wrap",
						gap: "8px",
						alignItems: "center"
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: t("about.version", { version: state.rows.version })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: t("about.dshVersion", { version: state.rows.dsh })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: state.rows.platform
						})
					]
				})
			] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.groupLabel,
					children: t("about.links")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.actionRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						variant: "primary",
						href: ABOUT_LINKS.starUrl,
						children: t("about.star")
					})
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.aboutLinkRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							href: ABOUT_LINKS.repoUrl,
							children: t("about.repo")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							href: ABOUT_LINKS.docsUrl,
							children: t("about.docs")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							href: ABOUT_LINKS.issuesUrl,
							children: t("about.issues")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							onClick: () => setReleaseNotesOpen(true),
							children: t("about.releaseNotes")
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.groupLabel,
						children: t("about.authorLabel")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("a", {
						className: config_manager_module_css_default.aboutAuthor,
						href: ABOUT_META.authorUrl,
						target: "_blank",
						rel: "noreferrer",
						children: ABOUT_META.author
					})]
				})
			] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.groupLabel,
					children: t("about.cli.title")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					children: t("about.cli.hint")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("pre", {
					className: config_manager_module_css_default.cliCommand,
					children: ABOUT_CLI.installCommand
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: config_manager_module_css_default.reportList,
					children: ABOUT_CLI.commands.map((c) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", {
							className: config_manager_module_css_default.cliName,
							children: c.command
						}),
						" — ",
						c.description
					] }, c.command))
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.actionRow,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
						href: ABOUT_CLI.docsUrl,
						children: t("about.cli.docs")
					})
				})
			] }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReleaseNotesDialog, {
				open: releaseNotesOpen,
				onClose: () => setReleaseNotesOpen(false),
				onConfirm: () => {
					setReleaseNotesOpen(false);
					if (state.rows?.version) api.saveReleaseNotesPrompt({ lastSeenVersion: state.rows.version }).catch(() => {});
				},
				onNeverShow: () => {
					setReleaseNotesOpen(false);
					api.saveReleaseNotesPrompt({
						dismissed: true,
						lastSeenVersion: state.rows?.version
					}).catch(() => {});
				},
				t
			})
		]
	});
}
//#endregion
//#region src/ui/profiles-view.ts
/** 校验 Profile 名输入（与 host/ProfileManager 同规则：拒绝路径穿越/非法字符；空提示）。 */
function validateProfileNameInput(name) {
	const trimmed = name.trim();
	if (trimmed === "") return "name is required";
	if (trimmed.length > 64) return "name must be ≤ 64 characters";
	if (trimmed === "." || trimmed === "..") return "illegal name";
	if (trimmed.includes("/") || trimmed.includes("\\") || trimmed.includes("\0")) return "illegal characters";
	if (trimmed.includes("..")) return "illegal characters";
	return null;
}
function summarizeSwitchPreview(preview) {
	const items = preview.items;
	const count = (kinds) => items.filter((i) => kinds.includes(i.kind)).length;
	return {
		willChange: count([
			"Create",
			"Update",
			"Install",
			"Conflict"
		]),
		unchanged: count(["Skip"]),
		conflicts: count(["Conflict"]),
		secretsNeeded: preview.missingSecrets.length,
		needsRestart: preview.needsRestart,
		sectionsInProfile: preview.sectionsInProfile
	};
}
/** 切换结果 → 语义 kind（ok / failed / rolledBack；与同步 applyItemsReportView 语义一致）。 */
function profileSwitchKind(result) {
	if (result === null) return "ok";
	if (!result.ok && result.rollback !== null) return "rolledBack";
	if (!result.ok) return "failed";
	return "ok";
}
//#endregion
//#region src/client/profiles/ProfilesPanel.tsx
/**
* 配置档案面板（第 7 个 tab「配置文件」；m-profiles）。
*
* Profile = 用户在 DSH 中的一组配置快照（Work / Personal / …），由 src/profiles/
* 的 ProfileManager 管理（save/list/delete/rename/switch）。本视图：
* - **保存当前配置**：输入名 → POST /profiles/save（复用 adapter.export，天然不含秘密值）；
* - **切换**：点「切换预览」→ 只读 preview（零写入）→ 确认弹窗 → executeSwitch
*   （confirm 安全阀 + 自动快照 + 失败整体回滚，与导入同一语义）；
* - **重命名 / 删除**：危险操作删除走 ConfirmDialog；
* - **导入**：上传 profile.json 文本（JSON 字段 content）→ POST /profiles/import。
*
* 状态组件自持（useState），同时镜像 runStore.profiles 切片（切 tab/刷新不丢列表/预览/结果）。
* 安全：Profile 天然不含秘密值（Save 走 adapter.export 脱敏）；重命名/删除/切换均确认。
*/
const initial = {
	status: "loading",
	loadError: null,
	profiles: [],
	saveName: "",
	saving: false,
	previewName: null,
	preview: null,
	previewing: false,
	switching: false,
	switchResult: null,
	renameTarget: null,
	renameValue: "",
	renaming: false,
	deleteTarget: null,
	deleting: false,
	importError: null,
	actionError: null
};
function initFromStore() {
	const s = runStore.getSnapshot().profiles;
	return {
		...initial,
		profiles: s.profiles ?? [],
		previewName: s.selectedName,
		preview: s.preview,
		switchResult: s.switchResult,
		actionError: s.error,
		loadError: s.loadError
	};
}
function ProfilesPanel({ api, t }) {
	const [state, setState] = (0, react.useState)(initFromStore);
	const stateRef = (0, react.useRef)(state);
	const mountedRef = (0, react.useRef)(true);
	/** Phase 7 迁移前咨询：切换预览弹窗内的咨询报告（本地 state，非敏感） */
	const [consultReport, setConsultReport] = (0, react.useState)(null);
	const [consultLoading, setConsultLoading] = (0, react.useState)(false);
	const commit = (next) => {
		stateRef.current = next;
		if (mountedRef.current) setState(next);
		runStore.patch({ profiles: toProfilesStoreSlice({
			profiles: next.profiles,
			selectedName: next.previewName,
			preview: next.preview,
			switchResult: next.switchResult,
			error: next.actionError,
			loadError: next.loadError
		}) });
	};
	const patch = (p) => commit({
		...stateRef.current,
		...p
	});
	(0, react.useEffect)(() => () => {
		mountedRef.current = false;
		runStore.patch({ profiles: toProfilesStoreSlice({
			profiles: stateRef.current.profiles,
			selectedName: stateRef.current.previewName,
			preview: stateRef.current.preview,
			switchResult: stateRef.current.switchResult,
			error: stateRef.current.actionError,
			loadError: stateRef.current.loadError
		}) });
	}, []);
	const load = () => {
		patch({
			status: "loading",
			loadError: null
		});
		api.profilesList().then((profiles) => {
			patch({
				status: "ready",
				profiles
			});
			if (stateRef.current.previewName !== null && !profiles.some((p) => p.name === stateRef.current.previewName)) patch({
				previewName: null,
				preview: null,
				switchResult: null
			});
		}, (err) => {
			patch({
				status: "error",
				loadError: err instanceof Error ? err.message : String(err)
			});
		});
	};
	(0, react.useEffect)(load, [api]);
	/** Phase 7 迁移前咨询：切换预览弹窗打开时对目标 profile 生成咨询报告（只读，零写入）。
	*  失败静默（咨询是建议性，不阻断切换）。 */
	(0, react.useEffect)(() => {
		if (state.previewName === null) return;
		let cancelled = false;
		setConsultLoading(true);
		api.consult({
			type: "profile",
			id: state.previewName
		}).then((report) => {
			if (!cancelled) setConsultReport(report);
		}).catch(() => {
			if (!cancelled) setConsultReport(null);
		}).finally(() => {
			if (!cancelled) setConsultLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [state.previewName, api]);
	/** 保存当前配置为新 Profile（输入名校验；成功后刷新列表并清空输入） */
	const doSave = () => {
		const name = state.saveName.trim();
		const invalid = validateProfileNameInput(name);
		if (invalid !== null) {
			patch({ actionError: invalid });
			return;
		}
		if (state.saving) return;
		patch({
			saving: true,
			actionError: null
		});
		api.profileSave(name).then((meta) => {
			patch({
				saving: false,
				saveName: "",
				actionError: null
			});
			load();
		}, (err) => {
			patch({
				saving: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
		});
	};
	/** 切换预览（只读，零写入）：分析切换到该 Profile 会产生的计划项 */
	const runPreview = (profile) => {
		patch({
			previewName: profile.name,
			previewing: true,
			preview: null,
			switchResult: null,
			actionError: null
		});
		api.profileAnalyzeSwitch(profile.name).then((preview) => {
			patch({
				previewing: false,
				preview
			});
		}, (err) => {
			patch({
				previewing: false,
				previewName: null,
				actionError: err instanceof Error ? err.message : String(err)
			});
		});
	};
	/** 执行切换（confirm 安全阀 + 自动快照 + 失败回滚） */
	const doSwitch = () => {
		const name = state.previewName;
		if (name === null || state.switching) return;
		patch({
			switching: true,
			actionError: null
		});
		api.profileExecuteSwitch(name, { rollbackOnError: true }).then((result) => {
			patch({
				switching: false,
				switchResult: result
			});
		}, (err) => {
			patch({
				switching: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
		}).finally(() => {
			load();
		});
	};
	/** 关闭预览弹窗（放弃本次切换会话） */
	const closePreview = () => {
		if (state.switching) return;
		patch({
			previewName: null,
			preview: null,
			switchResult: null
		});
	};
	/** 重命名（目录级移动） */
	const doRename = () => {
		const target = state.renameTarget;
		if (target === null || state.renaming) return;
		const newName = state.renameValue.trim();
		const invalid = validateProfileNameInput(newName);
		if (invalid !== null) {
			patch({ actionError: invalid });
			return;
		}
		patch({
			renaming: true,
			actionError: null
		});
		api.profileRename(target.name, newName).then(() => {
			patch({
				renaming: false,
				renameTarget: null,
				renameValue: "",
				actionError: null
			});
			load();
		}, (err) => {
			patch({
				renaming: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
		});
	};
	/** 删除 Profile（危险操作：该组配置快照不可恢复） */
	const doDelete = () => {
		const target = state.deleteTarget;
		if (target === null || state.deleting) return;
		patch({
			deleting: true,
			actionError: null
		});
		api.profileDelete(target.name).then(() => {
			patch({
				deleting: false,
				deleteTarget: null,
				actionError: null
			});
			if (stateRef.current.previewName === target.name) patch({
				previewName: null,
				preview: null,
				switchResult: null
			});
			load();
		}, (err) => {
			patch({
				deleting: false,
				actionError: err instanceof Error ? err.message : String(err)
			});
		});
	};
	/** 导入 Profile（读 JSON 文本 → 确认 → import） */
	const importFile = (file) => {
		if (file === void 0) return;
		patch({
			importError: null,
			actionError: null
		});
		file.text().then((content) => {
			const stem = file.name.replace(/\.json$/i, "").trim() || "imported";
			api.profileImport(content, stem).then((meta) => {
				load();
			}, (err) => {
				patch({ importError: err instanceof Error ? err.message : String(err) });
			});
		}, (err) => {
			patch({ importError: err instanceof Error ? err.message : String(err) });
		});
	};
	const saveInvalid = validateProfileNameInput(state.saveName.trim()) !== null && state.saveName.trim() !== "";
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("profiles.title"),
				subtitle: t("profiles.subtitle")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
				className: config_manager_module_css_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.groupLabel,
						children: t("profiles.save.title")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.hint,
						children: t("profiles.save.hint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.actionRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "text",
							className: config_manager_module_css_default.input,
							placeholder: t("profiles.save.placeholder"),
							value: state.saveName,
							onChange: (e) => {
								patch({ saveName: e.target.value });
							}
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							variant: "primary",
							disabled: state.saving || state.saveName.trim() === "",
							onClick: doSave,
							children: state.saving ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("profiles.save.saving") }) : t("profiles.save.action")
						})]
					}),
					saveInvalid && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.formError,
						children: t("profiles.nameInvalid")
					}),
					state.actionError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
						kind: "error",
						children: state.actionError
					})
				]
			}),
			state.status === "loading" && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("profiles.loading") }),
			state.status === "error" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
				kind: "error",
				children: [state.loadError ?? t("common.unknownError"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: load,
					children: t("common.retry")
				})]
			}),
			state.status === "ready" && state.profiles.length === 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("profiles.empty") }),
			state.status === "ready" && state.profiles.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.snapshotList,
				role: "list",
				"aria-label": t("profiles.title"),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.profileRowHeader,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("profiles.name") }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("profiles.sections") }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("profiles.updatedAt") }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: t("snapshots.actions") })
					]
				}), state.profiles.map((profile) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.profileRow,
					role: "listitem",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
						type: "button",
						className: config_manager_module_css_default.profileRowMain,
						onClick: () => {
							runPreview(profile);
						},
						title: t("profiles.previewHint"),
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								title: profile.name,
								children: profile.name
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", { children: [profile.sections.slice(0, 4).join(", "), profile.sections.length > 4 ? ` +${profile.sections.length - 4}` : ""] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: new Date(profile.updatedAt).toLocaleString() })
						]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: config_manager_module_css_default.actionRow,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								onClick: () => {
									runPreview(profile);
								},
								children: t("profiles.switch")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								onClick: () => {
									patch({
										renameTarget: profile,
										renameValue: profile.name,
										actionError: null
									});
								},
								children: t("profiles.rename")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => {
									patch({
										deleteTarget: profile,
										actionError: null
									});
								},
								children: t("profiles.delete")
							})
						]
					})]
				}, profile.name))]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
				className: config_manager_module_css_default.card,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.groupLabel,
						children: t("profiles.import.title")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.hint,
						children: t("profiles.import.hint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "file",
						accept: ".json,application/json",
						className: config_manager_module_css_default.hiddenFile,
						onChange: (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							importFile(file);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: config_manager_module_css_default.actionRow,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							onClick: () => {
								document.querySelector(`input[type="file"][accept=".json,application/json"]`)?.click();
							},
							children: t("profiles.import.choose")
						})
					}),
					state.importError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
						kind: "error",
						children: state.importError
					})
				]
			}),
			state.previewName !== null && (state.preview !== null || state.previewing || state.switchResult !== null) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.dialogMask,
				onMouseDown: (e) => {
					if (e.target === e.currentTarget && !state.switching) closePreview();
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: `${config_manager_module_css_default.dialogCard} ${config_manager_module_css_default.dialogWide}`,
					role: "dialog",
					"aria-modal": "true",
					"aria-label": t("profiles.switch"),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogHeaderRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: config_manager_module_css_default.dialogHeader,
							children: t("profiles.switchPreviewTitle", { name: state.previewName })
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: config_manager_module_css_default.dialogClose,
							"aria-label": t("common.close"),
							disabled: state.switching,
							onClick: closePreview,
							children: "×"
						})]
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: config_manager_module_css_default.dialogBodyScroll,
						children: [
							state.previewing && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("profiles.previewing") }),
							state.preview !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SwitchPreviewCard, {
								preview: state.preview,
								t
							}),
							consultLoading && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: api.t("consult.loading") }),
							consultReport !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConsultCard, {
								report: consultReport,
								t: api.t
							}),
							state.switchResult !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProfileSwitchResultCard, {
								result: state.switchResult,
								t
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: config_manager_module_css_default.actionRow,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									disabled: state.switching,
									onClick: closePreview,
									children: t("common.cancel")
								}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
									variant: "primary",
									disabled: state.switching || state.preview === null || !state.preview.items.some((i) => i.kind !== "Skip"),
									onClick: doSwitch,
									children: state.switching ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Spinner, { label: t("profiles.switching") }) : t("profiles.switchConfirm")
								})]
							}),
							state.actionError !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
								kind: "error",
								children: state.actionError
							})
						]
					})]
				})
			}),
			state.renameTarget !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: true,
				title: t("profiles.renameTitle"),
				message: t("profiles.renameMessage", { name: state.renameTarget.name }),
				confirmLabel: t("profiles.rename"),
				cancelLabel: t("common.cancel"),
				busy: state.renaming,
				onConfirm: doRename,
				onCancel: () => {
					patch({
						renameTarget: null,
						renameValue: ""
					});
				},
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
					type: "text",
					className: config_manager_module_css_default.input,
					value: state.renameValue,
					onChange: (e) => {
						patch({ renameValue: e.target.value });
					}
				})
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: state.deleteTarget !== null,
				title: t("profiles.deleteTitle"),
				message: state.deleteTarget !== null ? t("profiles.deleteMessage", { name: state.deleteTarget.name }) : void 0,
				confirmLabel: t("profiles.delete"),
				cancelLabel: t("common.cancel"),
				danger: true,
				busy: state.deleting,
				onConfirm: doDelete,
				onCancel: () => {
					patch({ deleteTarget: null });
				}
			})
		]
	});
}
/**
* 切换预览内容（与备份文件「查看/对比」预览同构，2026-08-25）：
* 三分区 = 分区清单（Badge 流）→ 差异摘要（将变更/已一致/冲突/需补录/重启）
* → 变更明细分组（冲突→变更→路径映射→已一致→其他，带颜色 kindTag，限高内滚）。
* 渲染模型来自 src/ui/profiles-view.ts 纯函数 + 备份 diff 共用 groupPlanItems 分组。
*/
function SwitchPreviewCard({ preview, t }) {
	const s = summarizeSwitchPreview(preview);
	const groups = groupPlanItems(preview.items);
	const groupLabelKey = (key) => {
		switch (key) {
			case "conflicts": return "backupFiles.inspectGroup.conflicts";
			case "changes": return "backupFiles.inspectGroup.changes";
			case "paths": return "backupFiles.inspectGroup.paths";
			case "skipped": return "backupFiles.inspectGroup.skipped";
			case "others": return "backupFiles.inspectGroup.others";
		}
	};
	const kindTagClass = (kind) => {
		switch (kind) {
			case "error": return config_manager_module_css_default.kindTagError ?? "";
			case "warn": return config_manager_module_css_default.kindTagWarn ?? "";
			case "ok": return config_manager_module_css_default.kindTagOk ?? "";
			case "info": return config_manager_module_css_default.kindTagInfo ?? "";
		}
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
			className: config_manager_module_css_default.card,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.groupLabel,
					children: t("profiles.previewSummary")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "info",
							children: t("profiles.previewWillChange", { count: String(s.willChange) })
						}),
						s.unchanged > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "ok",
							children: t("profiles.previewUnchanged", { count: String(s.unchanged) })
						}),
						s.conflicts > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "error",
							children: t("profiles.previewConflicts", { count: String(s.conflicts) })
						}),
						s.secretsNeeded > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "warn",
							children: t("profiles.previewSecrets", { count: String(s.secretsNeeded) })
						}),
						s.needsRestart && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
							kind: "warn",
							children: t("profiles.previewRestart")
						})
					]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					children: t("profiles.previewNote")
				})
			]
		}),
		s.sectionsInProfile.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
			className: config_manager_module_css_default.card,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("profiles.previewSections")
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.statRow,
				children: s.sectionsInProfile.map((section) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
					kind: "info",
					children: section
				}, section))
			})]
		}),
		groups.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, {
			className: config_manager_module_css_default.card,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.groupLabel,
				children: t("profiles.previewItems")
			}), groups.map((group) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.inspectGroup,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.statRow,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: config_manager_module_css_default.groupLabel,
						children: t(groupLabelKey(group.key))
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
						kind: group.kind,
						children: String(group.items.length)
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.reportScroll,
					children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: config_manager_module_css_default.reportList,
						children: group.items.map((item) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: `${config_manager_module_css_default.kindTag} ${kindTagClass(group.kind)}`,
								children: item.kind
							}),
							" ",
							item.adapter,
							": ",
							item.description,
							item.detail !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: config_manager_module_css_default.hint,
								children: [
									"（",
									item.detail,
									"）"
								]
							})
						] }, item.id))
					})
				})]
			}, group.key))]
		})
	] });
}
/** 切换结果（ok / failed / rolledBack；绑定 profileSwitchKind 语义）。 */
function ProfileSwitchResultCard({ result, t }) {
	const kind = profileSwitchKind(result);
	const okCount = result.executed.filter((e) => e.status === "ok").length;
	const failed = result.executed.filter((e) => e.status === "failed");
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
			kind: kind === "ok" ? "ok" : kind === "rolledBack" ? "error" : "error",
			children: kind === "ok" ? t("profiles.switchDone", { count: String(okCount) }) : kind === "rolledBack" ? t("profiles.switchRolledBack") : t("profiles.switchFailed")
		}),
		result.warnings.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
			kind: "warn",
			children: result.warnings.join("；")
		}),
		failed.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.reportScroll,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
				className: config_manager_module_css_default.reportList,
				children: failed.map((f) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [
					f.itemId,
					": ",
					f.message ?? ""
				] }, f.itemId))
			})
		}),
		result.needsRestart && /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Banner, {
			kind: "warn",
			children: t("report.needsRestart")
		})
	] });
}
//#endregion
//#region src/client/history/history-api.ts
const HISTORY_API = {
	list: "/api/dsh-config-manager/history",
	export: "/api/dsh-config-manager/history/export"
};
/** GET 请求超时（历史读取可能较大；导出走下载）。 */
const HISTORY_TIMEOUT_MS = 6e4;
async function readJson$3(response, t) {
	const notMountedMessage = t("error.notMounted");
	let body;
	try {
		body = await response.json();
	} catch {
		if (response.status === 404) throw new ConfigManagerApiError(notMountedMessage);
		throw new ConfigManagerApiError(t("error.httpInvalidJson", { status: String(response.status) }));
	}
	if (!response.ok) throw new ConfigManagerApiError(typeof body === "object" && body !== null && typeof body.error === "string" ? body.error : response.status === 404 ? notMountedMessage : `HTTP ${response.status}`);
	return body;
}
/** History 浏览器半数据入口。 */
var HistoryApi = class {
	t;
	constructor(t = zhUiT) {
		this.t = t;
	}
	buildListUrl(params) {
		const url = new URL(HISTORY_API.list, window.location.origin);
		for (const [k, v] of Object.entries(params)) if (v !== void 0 && v !== "") url.searchParams.set(k, v);
		return url.toString();
	}
	/** GET /history：按 kind/result/时间/分区 过滤读取历史。 */
	async list(params = {}) {
		const controller = new AbortController();
		const timer = setTimeout(() => controller.abort(), HISTORY_TIMEOUT_MS);
		try {
			const query = {};
			if (params.kind !== void 0) query["kind"] = Array.isArray(params.kind) ? params.kind.join(",") : params.kind;
			if (params.result !== void 0) query["result"] = Array.isArray(params.result) ? params.result.join(",") : params.result;
			if (params.from !== void 0) query["from"] = String(params.from);
			if (params.to !== void 0) query["to"] = String(params.to);
			if (params.sections !== void 0 && params.sections.length > 0) query["sections"] = params.sections.join(",");
			return await readJson$3(await fetch(this.buildListUrl(query), { signal: controller.signal }), this.t);
		} finally {
			clearTimeout(timer);
		}
	}
	/**
	* 导出历史报告（markdown → 下载附件；json → { text }）。
	* 过滤参数与 list 相同。
	*/
	async exportReport(format, params = {}) {
		const query = { format };
		if (params.kind !== void 0) query["kind"] = Array.isArray(params.kind) ? params.kind.join(",") : params.kind;
		if (params.result !== void 0) query["result"] = Array.isArray(params.result) ? params.result.join(",") : params.result;
		const url = this.buildExportUrl(query);
		if (format === "markdown") {
			const response = await fetch(url);
			if (!response.ok) {
				const body = await response.json().catch(() => null);
				throw new ConfigManagerApiError(typeof body === "object" && body !== null && typeof body.error === "string" ? body.error : `HTTP ${response.status}`);
			}
			const blob = await response.blob();
			const objectUrl = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = objectUrl;
			a.download = "migration-history.md";
			document.body.appendChild(a);
			a.click();
			a.remove();
			setTimeout(() => URL.revokeObjectURL(objectUrl), 1e4);
			return { downloaded: true };
		}
		return readJson$3(await fetch(url), this.t);
	}
	buildExportUrl(params) {
		const url = new URL(HISTORY_API.export, window.location.origin);
		for (const [k, v] of Object.entries(params)) if (v !== void 0 && v !== "") url.searchParams.set(k, v);
		return url.toString();
	}
};
//#endregion
//#region src/ui/history-model.ts
/** 结果徽章语义（Badge kind 四态中的三态；skipped 归 warn）。 */
function resultBadgeKind(result) {
	if (result === "success") return "ok";
	if (result === "failed") return "error";
	return "warn";
}
function kindLabelKey(kind) {
	return `history.kind.${kind}`;
}
/** 全量 kind 枚举（UI 过滤下拉用；顺序 = §5 清单顺序）。 */
const HISTORY_KIND_OPTIONS = [
	"import",
	"restore",
	"rollback",
	"profile-switch",
	"profile-delete",
	"profile-rename",
	"profile-save",
	"profile-import",
	"sync-apply",
	"autosync",
	"recovery",
	"backup",
	"snapshot-delete",
	"snapshot-prune"
];
/** 结果过滤选项。 */
const HISTORY_RESULT_OPTIONS = [
	"success",
	"failed",
	"skipped"
];
function summarize(entries) {
	let success = 0;
	let failed = 0;
	let skipped = 0;
	for (const e of entries) if (e.result === "success") success += 1;
	else if (e.result === "failed") failed += 1;
	else skipped += 1;
	return {
		total: entries.length,
		success,
		failed,
		skipped
	};
}
/**
* 按 kind 分组（保持 HISTORY_KIND_OPTIONS 顺序），组内按 at 时间倒序。
* 空组不渲染。纯函数，无 IO。
*/
function groupByKind(entries) {
	const byKind = /* @__PURE__ */ new Map();
	for (const e of entries) {
		const list = byKind.get(e.kind);
		if (list === void 0) byKind.set(e.kind, [e]);
		else list.push(e);
	}
	const groups = [];
	for (const kind of HISTORY_KIND_OPTIONS) {
		const list = byKind.get(kind);
		if (list === void 0) continue;
		list.sort((a, b) => a.at < b.at ? 1 : a.at > b.at ? -1 : 0);
		groups.push({
			kind,
			kindLabelKey: kindLabelKey(kind),
			count: list.length,
			entries: list
		});
	}
	return groups;
}
/**
* 最近 N 条过滤（0 = 全部）。按 at 时间倒序取前 N。
*/
function applyRecent(entries, recent) {
	if (recent <= 0) return entries;
	return [...entries].sort((a, b) => a.at < b.at ? 1 : a.at > b.at ? -1 : 0).slice(0, recent);
}
/** 客户端侧文本子串过滤（补充后端过滤；按 summary/error/kind 匹配，大小写不敏感）。 */
function filterByText(entries, query) {
	const q = query.trim().toLowerCase();
	if (q === "") return entries;
	return entries.filter((e) => e.kind.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q) || (e.error ?? "").toLowerCase().includes(q) || e.sections.some((s) => s.toLowerCase().includes(q)));
}
//#endregion
//#region src/client/history/HistoryPanel.tsx
/**
* 迁移历史面板（Phase 6，Step 7）：展示统一审计史——过滤（kind/结果/时间范围/文本）+ 统计
* + 分组列表 + 导出（JSON/Markdown）。
*
* 数据流：`HistoryApi.list()` 读取（经 Host 侧 sanitizeEntry 已脱敏）；纯函数渲染模型
* `src/ui/history-model.ts`（node 可测）分组/统计/过滤；`HistoryPanel` 只做装配（渲染 + 交互）。
* 状态组件内自持（useState）：低频面板不持久化列表（历史可随时重载）。
*
* 安全：所有 summary/error 文本渲染前过 redact() 兜底（存储已清洗，双保险）；
* kind/result/sections 均为枚举常量，无 secret 承载面。
*/
function HistoryPanel({ historyApi, t }) {
	const [state, setState] = (0, react.useState)({
		status: "loading",
		error: null,
		result: null,
		filter: { query: "" },
		exporting: null,
		exportNote: null
	});
	const mounted = (0, react.useRef)(true);
	(0, react.useEffect)(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);
	const load = async () => {
		setState((s) => ({
			...s,
			status: "loading",
			error: null
		}));
		try {
			const result = await historyApi.list();
			if (mounted.current) setState((s) => ({
				...s,
				status: "ready",
				result
			}));
		} catch (error) {
			if (mounted.current) setState((s) => ({
				...s,
				status: "error",
				error: error instanceof Error ? error.message : String(error)
			}));
		}
	};
	(0, react.useEffect)(() => {
		load();
	}, [historyApi]);
	const setFilter = (patch) => {
		setState((s) => ({
			...s,
			filter: {
				...s.filter,
				...patch
			}
		}));
	};
	const handleExport = async (format) => {
		setState((s) => ({
			...s,
			exporting: format,
			exportNote: null
		}));
		try {
			await historyApi.exportReport(format, {
				kind: state.filter.kind,
				result: state.filter.result
			});
			if (mounted.current) setState((s) => ({
				...s,
				exporting: null,
				exportNote: t("history.exported")
			}));
		} catch (error) {
			if (mounted.current) setState((s) => ({
				...s,
				exporting: null,
				exportNote: `${t("history.exportError")}: ${redact(error instanceof Error ? error.message : String(error))}`
			}));
		}
	};
	if (state.status === "loading") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
			title: t("history.title"),
			subtitle: t("history.subtitle")
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.statRow,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: config_manager_module_css_default.hint,
				children: t("history.loading")
			})
		})]
	});
	if (state.status === "error") return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
			title: t("history.title"),
			subtitle: t("history.subtitle")
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ErrorBanner, {
			error: new Error(redact(state.error ?? "")),
			onRetry: () => void load()
		})]
	});
	let filtered = state.result?.entries ?? [];
	if (state.filter.recent !== void 0 && state.filter.recent > 0) filtered = applyRecent(filtered, state.filter.recent);
	filtered = filterByText(filtered, state.filter.query);
	const summary = summarize(filtered);
	const groups = groupByKind(filtered);
	const corrupted = state.result?.corrupted ?? [];
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.viewBody,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionTitle, {
				title: t("history.title"),
				subtitle: t("history.subtitle")
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: config_manager_module_css_default.statRow,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
						kind: "info",
						children: [
							t("history.stats.total"),
							": ",
							summary.total
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
						kind: "ok",
						children: [
							t("history.stats.success"),
							": ",
							summary.success
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
						kind: "error",
						children: [
							t("history.stats.failed"),
							": ",
							summary.failed
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Badge, {
						kind: "warn",
						children: [
							t("history.stats.skipped"),
							": ",
							summary.skipped
						]
					})
				]
			}),
			corrupted.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
				kind: "warn",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", { children: t("history.corruptedBanner") }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					children: t("history.corruptedCount", { count: String(corrupted.length) })
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Card, { children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.groupLabel,
					children: t("history.filter.title")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.actionRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							className: config_manager_module_css_default.select,
							value: state.filter.kind ?? "",
							onChange: (e) => setFilter({ kind: e.target.value === "" ? void 0 : e.target.value }),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
								value: "",
								children: [t("history.filter.kind"), ": 全部"]
							}), HISTORY_KIND_OPTIONS.map((k) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: k,
								children: t(kindLabelKey(k))
							}, k))]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							className: config_manager_module_css_default.select,
							value: state.filter.result ?? "",
							onChange: (e) => setFilter({ result: e.target.value === "" ? void 0 : e.target.value }),
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("option", {
								value: "",
								children: [t("history.filter.result"), ": 全部"]
							}), HISTORY_RESULT_OPTIONS.map((r) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: r,
								children: t(`history.result.${r}`)
							}, r))]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							className: config_manager_module_css_default.select,
							value: state.filter.recent ?? 0,
							onChange: (e) => setFilter({ recent: Number(e.target.value) }),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "0",
									children: t("history.filter.recent.all")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "50",
									children: t("history.filter.recent.50")
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "200",
									children: t("history.filter.recent.200")
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							className: config_manager_module_css_default.input,
							type: "search",
							placeholder: t("history.search.placeholder"),
							value: state.filter.query,
							onChange: (e) => setFilter({ query: e.target.value })
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							onClick: () => void load(),
							children: t("history.refresh")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							onClick: () => void handleExport("json"),
							disabled: state.exporting !== null || summary.total === 0,
							children: state.exporting === "json" ? t("history.exporting") : t("history.export.json")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
							onClick: () => void handleExport("markdown"),
							disabled: state.exporting !== null || summary.total === 0,
							children: state.exporting === "markdown" ? t("history.exporting") : t("history.export.markdown")
						})
					]
				}),
				state.exportNote !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: config_manager_module_css_default.hint,
					children: state.exportNote
				})
			] }),
			filtered.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Empty, { children: t("history.empty") }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(HistoryList, {
				groups,
				t
			})
		]
	});
}
function HistoryList({ groups, t }) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Card, { children: groups.map((g) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.historyGroup,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.statRow,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
				kind: "info",
				children: t(g.kindLabelKey)
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
				kind: "info",
				children: g.count
			})]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
			className: config_manager_module_css_default.historyScroll,
			children: g.entries.map((e) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(HistoryRow, {
				entry: e,
				t
			}, e.at + e.kind))
		})]
	}, g.kind)) });
}
function HistoryRow({ entry, t }) {
	const result = /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Badge, {
		kind: resultBadgeKind(entry.result),
		children: t(`history.result.${entry.result}`)
	});
	const summary = redact(entry.summary + (entry.error !== void 0 ? ` — ${entry.error}` : ""));
	return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
		className: config_manager_module_css_default.historyRow,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: config_manager_module_css_default.historyRowMain,
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.historyTime,
					children: entry.at
				}),
				result,
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.historySections,
					children: redact(entry.sections.join(", "))
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: config_manager_module_css_default.historySummary,
					children: summary
				})
			]
		})
	});
}
//#endregion
//#region src/ui/star-prompt.ts
/**
* Star 引导弹窗的判定逻辑（框架无关纯函数，node 可测）。
*
* 触发规则（用户需求 + 方案 A）：
*  - 首次进入 dsh-config-manager 页面：只记录「首次使用时间」，不弹窗；
*  - 之后每次进入页面：距首次使用满 3 天（STAR_PROMPT_DELAY_MS）才弹窗；
*  - 用户点过「不再提示」（dismissed）或点过「去点 Star」（clicked，方案 A：
*    引导完成）→ 永久不再弹。
*
* 本模块只做「判定」，不碰存储/网络/React：
*  - 存储（ui-prefs.json）见 src/sync/ui-prefs.ts；
*  - 组件装配（何时调用、如何展示）见 src/client/ConfigManagerSection.tsx。
*/
/** 距首次使用满 3 天才提示（ms）：3 天 × 24 小时 × 60 分 × 60 秒 × 1000 */
const STAR_PROMPT_DELAY_MS = 2592e5;
/**
* 判定本次进入页面是否展示 Star 引导弹窗。
* @param state 持久化状态（undefined 字段 = 未配置）
* @param now 当前时间（ms 时间戳；注入便于测试）
*/
function evaluateStarPrompt(state, now) {
	if (state.dismissed === true || state.clicked === true) return {
		shouldShow: false,
		shouldRecordFirstSeen: false
	};
	if (state.firstSeenAt === void 0) return {
		shouldShow: false,
		shouldRecordFirstSeen: true
	};
	return {
		shouldShow: now - state.firstSeenAt >= STAR_PROMPT_DELAY_MS,
		shouldRecordFirstSeen: false
	};
}
//#endregion
//#region src/ui/release-notes-prompt.ts
/**
* 判定本次进入页面是否自动弹出更新内容弹窗。
* @param state 持久化状态（undefined 字段 = 未配置）
* @param currentVersion 当前运行的插件版本（如 '0.1.54'）
*/
function evaluateReleaseNotesPrompt(state, currentVersion) {
	if (state.dismissed === true) return { shouldShow: false };
	if (state.lastSeenVersion === void 0 || state.lastSeenVersion !== currentVersion) return { shouldShow: true };
	return { shouldShow: false };
}
//#endregion
//#region src/client/ConfigManagerSection.tsx
/**
* Config Manager 设置页（settings.section 入口的主页面容器）。
*
* 业务面（api/syncApi/marketApi）由注册时的 inject face 注入；t 由 locale seat 注入。
* 关闭按钮由 settings shell 自带，本页不再渲染。内部主视图：
* 「导出与导入」一个顶层 tab（子 tab 切换 Export 导出备份 / Import 导入恢复），
* 以及备份与快照/远程同步/配置市场/配置文件/关于 低频面板。
*
* m2：主视图 tab（view）与全部子视图状态统一由模块级 runStore 持有
* （sessionStorage 持久化 + 切 tab/关面板不重建控制器实例）；挂载时
* 经 GET /runs + 轮询 /progress 恢复进行中的 run（刷新/重开面板后）。
* 低频面板的「当前打开面板」（panel）同样存于 runStore：切 tab 不丢、
* 刷新后回到原 tab；面板内部状态由各自视图镜像进 store（见各视图头部注释）。
*/
/**
* 设置页容器：「导出与导入」主视图（子 tab：导出备份 / 导入恢复）+ Snapshots /
* Sync / Market / Profiles / About 五块低频面板。所有 tab（主视图 view + 低频
* 面板 panel）状态都在模块级 store（切 tab/刷新不丢）；面板内部状态由各视图
* 镜像进 store（Sync/Market/Snapshots/Profiles），敏感字段白名单剔除。
*/
function ConfigManagerSection({ api, syncApi, syncT, marketApi, myConfigsApi, marketT, recoveryApi, recoveryT, historyApi, historyT, t }) {
	const state = (0, react.useSyncExternalStore)(runStore.subscribe, runStore.getSnapshot);
	const view = state.view;
	const panel = state.panel;
	const [starPromptOpen, setStarPromptOpen] = (0, react.useState)(false);
	/** 弹窗展示的 GitHub 仓库地址（GET /star-prompt 返回；不落 store） */
	const starRepoUrl = (0, react.useRef)("");
	/** 本次挂载只判定一次（防止 StrictMode/重挂载重复弹） */
	const starPromptChecked = (0, react.useRef)(false);
	(0, react.useEffect)(() => {
		if (starPromptChecked.current) return;
		starPromptChecked.current = true;
		(async () => {
			try {
				const status = await api.starPromptStatus();
				const ev = evaluateStarPrompt({
					firstSeenAt: status.firstSeenAt,
					dismissed: status.dismissed,
					clicked: status.clicked
				}, Date.now());
				if (ev.shouldRecordFirstSeen) api.saveStarPrompt({ firstSeenAt: Date.now() }).catch(() => {});
				if (ev.shouldShow) {
					starRepoUrl.current = status.repoUrl;
					setStarPromptOpen(true);
				}
			} catch {}
		})();
	}, [api]);
	/** 去点 Star（方案 A）：打开仓库页 + 记 clicked（此后不再弹）。 */
	const handleStar = () => {
		setStarPromptOpen(false);
		const url = starRepoUrl.current;
		if (url !== "") {
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.target = "_blank";
			anchor.rel = "noreferrer";
			anchor.click();
		}
		api.saveStarPrompt({ clicked: true }).catch(() => {});
	};
	/** 不再提示：关闭弹窗 + 记 dismissed（永久不再弹）。 */
	const handleDismiss = () => {
		setStarPromptOpen(false);
		api.saveStarPrompt({ dismissed: true }).catch(() => {});
	};
	/** 遮罩点击 / Esc：只是暂时关闭，不记「不再提示」表态（下次进入再判）。 */
	const handleBackdropClose = () => {
		setStarPromptOpen(false);
	};
	const [releaseNotesOpen, setReleaseNotesOpen] = (0, react.useState)(false);
	/** 当前运行的插件版本号（GET /release-notes-prompt 返回） */
	const releaseNotesCurrentVersion = (0, react.useRef)("");
	/** 本次挂载只判定一次（防止 StrictMode/重挂载重复弹） */
	const releaseNotesChecked = (0, react.useRef)(false);
	(0, react.useEffect)(() => {
		if (releaseNotesChecked.current) return;
		releaseNotesChecked.current = true;
		(async () => {
			try {
				const status = await api.releaseNotesPromptStatus();
				const currentVer = status.currentVersion ?? "";
				releaseNotesCurrentVersion.current = currentVer;
				if (evaluateReleaseNotesPrompt({
					lastSeenVersion: status.lastSeenVersion,
					dismissed: status.dismissed
				}, currentVer).shouldShow) setReleaseNotesOpen(true);
			} catch {}
		})();
	}, [api]);
	/** 确认：关闭弹窗 + 记录当前版本已读（下次更新到新版本时仍会提示）。 */
	const handleReleaseNotesConfirm = () => {
		setReleaseNotesOpen(false);
		const ver = releaseNotesCurrentVersion.current;
		api.saveReleaseNotesPrompt({ lastSeenVersion: ver !== "" ? ver : void 0 }).catch(() => {});
	};
	/** 永不提示：关闭弹窗 + 记录 dismissed（后续版本更新不再自动提示）。 */
	const handleReleaseNotesNeverShow = () => {
		setReleaseNotesOpen(false);
		const ver = releaseNotesCurrentVersion.current;
		api.saveReleaseNotesPrompt({
			dismissed: true,
			lastSeenVersion: ver !== "" ? ver : void 0
		}).catch(() => {});
	};
	/** 遮罩 / Esc / 标题栏关闭：按确认关闭，记录当前版本已读（防刷新重复弹同一版本）。 */
	const handleReleaseNotesClose = () => {
		handleReleaseNotesConfirm();
	};
	(0, react.useEffect)(() => {
		runStore.resume(api);
		return () => {
			runStore.stopResume();
		};
	}, [api]);
	const recoveryStatus = state.recovery.status;
	(0, react.useEffect)(() => {
		if (recoveryStatus !== null) return;
		let cancelled = false;
		recoveryApi.status().then((s) => {
			if (!cancelled) runStore.patch({ recovery: { status: s } });
		}, () => {});
		return () => {
			cancelled = true;
		};
	}, [recoveryStatus, recoveryApi]);
	const recoveryRequired = recoveryStatus !== null ? toRecoveryView(recoveryStatus).recoveryRequired === true : false;
	/** 切到主视图（导出与导入）：清空低频面板，记录到 store（刷新恢复）。 */
	const setView = (next) => {
		runStore.patch({
			view: next,
			panel: null
		});
	};
	/** 打开低频面板（snapshots/sync/market/profiles/more）：记录到 store（刷新恢复）。 */
	const openPanel = (next) => {
		runStore.patch({ panel: next });
	};
	/** 打开「更多」下的子视图（迁移历史 / 关于）：记录到 store（刷新恢复）。 */
	const openMoreSub = (moreSub) => {
		runStore.patch({ more: { moreSub } });
	};
	/** 打开「备份与快照」面板并切到「恢复」子 tab（SAFE MODE 横幅入口）。 */
	const openRecovery = () => {
		runStore.patch({
			panel: "snapshots",
			snapshots: { subTab: "recovery" }
		});
	};
	/** 顶层 tab：主视图「导出与导入」激活 = panel 为空（view 是内部子 tab 状态） */
	const transferActive = panel === null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: config_manager_module_css_default.section,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.sectionHeader,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.viewTabs,
					role: "tablist",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": transferActive,
							"data-active": transferActive ? "" : void 0,
							className: config_manager_module_css_default.viewTab,
							onClick: () => {
								setView(view);
							},
							children: t("view.transfer")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": panel === "snapshots",
							"data-active": panel === "snapshots" ? "" : void 0,
							className: config_manager_module_css_default.viewTab,
							onClick: () => {
								openPanel("snapshots");
							},
							children: t("view.snapshots")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": panel === "sync",
							"data-active": panel === "sync" ? "" : void 0,
							className: config_manager_module_css_default.viewTab,
							onClick: () => {
								openPanel("sync");
							},
							children: t("view.sync")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": panel === "market",
							"data-active": panel === "market" ? "" : void 0,
							className: config_manager_module_css_default.viewTab,
							onClick: () => {
								openPanel("market");
							},
							children: t("view.market")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": panel === "profiles",
							"data-active": panel === "profiles" ? "" : void 0,
							className: config_manager_module_css_default.viewTab,
							onClick: () => {
								openPanel("profiles");
							},
							children: t("view.profiles")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": panel === "more",
							"data-active": panel === "more" ? "" : void 0,
							className: config_manager_module_css_default.viewTab,
							onClick: () => {
								openPanel("more");
							},
							children: t("view.more")
						})
					]
				})
			}),
			recoveryRequired && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(Banner, {
				kind: "error",
				children: [recoveryT("recovery.banner"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: openRecovery,
					children: recoveryT("recovery.bannerAction")
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: config_manager_module_css_default.sectionBody,
				children: panel === "more" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.modeTabs,
					role: "tablist",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": state.more.moreSub === "history",
						"data-active": state.more.moreSub === "history" ? "" : void 0,
						className: config_manager_module_css_default.modeTab,
						onClick: () => {
							openMoreSub("history");
						},
						children: historyT("view.history")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": state.more.moreSub === "about",
						"data-active": state.more.moreSub === "about" ? "" : void 0,
						className: config_manager_module_css_default.modeTab,
						onClick: () => {
							openMoreSub("about");
						},
						children: t("view.about")
					})]
				}), state.more.moreSub === "history" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(HistoryPanel, {
					historyApi,
					t: historyT
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(AboutPanel, {
					api,
					t
				})] }) : panel === "snapshots" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SnapshotsPanel, {
					api,
					t,
					recoveryApi,
					recoveryT
				}) : panel === "profiles" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProfilesPanel, {
					api,
					t
				}) : panel === "market" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(MarketPanel, {
					api: marketApi,
					myConfigsApi,
					syncApi,
					importApi: api,
					t: marketT
				}) : panel === "sync" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SyncSettingsView, {
					api: syncApi,
					t: syncT
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: config_manager_module_css_default.modeTabs,
					role: "tablist",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": view === "export",
						"data-active": view === "export" ? "" : void 0,
						className: config_manager_module_css_default.modeTab,
						onClick: () => {
							setView("export");
						},
						children: t("view.export")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						type: "button",
						role: "tab",
						"aria-selected": view === "import",
						"data-active": view === "import" ? "" : void 0,
						className: config_manager_module_css_default.modeTab,
						onClick: () => {
							setView("import");
						},
						children: t("view.import")
					})]
				}), view === "export" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ExportView, {
					api,
					t
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ImportWizardView, {
					api,
					t
				})] })
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ConfirmDialog, {
				open: starPromptOpen,
				title: t("starPrompt.title"),
				message: t("starPrompt.body"),
				confirmLabel: t("starPrompt.star"),
				cancelLabel: t("starPrompt.dismiss"),
				onConfirm: handleStar,
				onCancel: handleDismiss,
				backdropClose: handleBackdropClose
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ReleaseNotesDialog, {
				open: releaseNotesOpen,
				onClose: handleReleaseNotesClose,
				onConfirm: handleReleaseNotesConfirm,
				onNeverShow: handleReleaseNotesNeverShow,
				t
			})
		]
	});
}
//#endregion
//#region src/client/locales.ts
/**
* Config Manager 表面文案：zh 为源语言，en 镜像每个键。
* 字典 namespace 由 client/index.ts 注册（declare module 合并进 LocaleNamespaceMap）。
* 键集合通过 `ConfigManagerKey` 类型在注册处做编译期校验（缺键/多键即编译错误）。
*/
const zh$4 = {
	"section.label": "备份与迁移",
	"section.description": "导出 / 导入 / 迁移 DSH 配置（备份不含密钥，加密备份可选）",
	"view.transfer": "导出与导入",
	"view.export": "导出备份",
	"view.import": "导入恢复",
	"view.snapshots": "备份与快照",
	"view.sync": "远程同步",
	"view.market": "配置市场",
	"view.about": "关于",
	"view.more": "更多",
	"view.profiles": "配置文件",
	"common.close": "关闭",
	"common.cancel": "取消",
	"common.back": "上一步",
	"common.next": "下一步",
	"common.done": "完成",
	"common.retry": "重试",
	"common.confirm": "确认",
	"common.loading": "加载中…",
	"common.unknownError": "未知错误",
	"status.ready": "Config Manager 已就绪（插件 {version} · DSH {dsh} · {platform}）",
	"status.unavailable": "Config Manager 服务未就绪，请确认插件已正确挂载。",
	"export.mode.quick": "快速导出",
	"export.mode.quickHint": "一键导出推荐分区（可迁移、不含设备专属数据），适合常规备份。",
	"export.mode.custom": "自定义导出",
	"export.mode.customHint": "按分组逐项勾选要导出的分区。",
	"export.security": "安全选项",
	"export.encrypt": "加密备份",
	"export.encryptHint": "用密码加密整个备份文件（AES-256-GCM）。密码仅用于本次加密，不会写入备份或任何配置文件；导入时必须输入该密码才能解锁。",
	"export.password": "备份加密密码",
	"export.passwordConfirm": "确认密码",
	"export.passwordMismatch": "两次输入的密码不一致",
	"export.passwordRequired": "加密备份必须设置密码",
	"export.includeSecrets": "导出密钥",
	"export.includeSecretsHint": "把真实密钥（凭据值）写入备份。密钥必须以加密形式保存：勾选时会自动选中「加密备份」；取消「加密备份」会同时取消「导出密钥」。",
	"export.run": "开始导出",
	"export.preview": "预览将导出内容",
	"export.previewing": "正在统计…",
	"export.previewSummary": "将打包 {sections} 个分区，约 {size}（不含密钥）",
	"export.previewSkipped": "{count} 个分区导出失败已跳过",
	"export.running": "正在导出…",
	"export.download": "下载备份文件",
	"export.saved": "已保存到下载目录：{name}",
	"export.selectionWarnings": "以下分区为设备相关数据，跨设备导入时可能不适用：",
	"export.group.unknown": "其他",
	"export.included": "已包含",
	"export.excluded": "未包含",
	"export.naming": "文件名与备注（可选）",
	"export.fileName": "自定义文件名",
	"export.fileNameHint": "留空自动命名（dsh-config-<日期>.zip）；无需手动输入 .zip 后缀，保存时自动补全。仅允许字母数字、空格、- _ .。",
	"export.fileNameInvalid": "文件名不合法：仅允许字母数字、空格、- _ .，不能包含路径分隔符。",
	"export.note": "备注",
	"export.notePlaceholder": "例如：迁移前的完整备份 / 2026-08 存档",
	"export.noteHint": "备注保存在本机备份列表中（随配置备份迁移），便于区分多个导出产物。",
	"import.select.title": "选择备份文件",
	"import.select.hint": "选择本机导出的 dsh-config-*.zip 备份文件开始导入。分析阶段只读，不会修改任何配置。",
	"import.select.browse": "选择 ZIP 文件",
	"import.select.reselect": "重新选择",
	"import.select.cancel": "取消选择",
	"import.select.file": "已选择：{name}",
	"import.analyzing": "正在分析备份…",
	"import.compatibility.title": "兼容性",
	"import.compatibility.score": "兼容性评分：{score}",
	"import.compatibility.ok": "备份可导入",
	"import.compatibility.fail": "备份分析失败：{reason}",
	"import.preview.title": "导入预览",
	"import.preview.willChange": "将变更 {count} 项",
	"import.preview.unchanged": "已一致跳过 {count} 项",
	"import.preview.settings": "设置更新 {count}",
	"import.preview.plugins": "插件待安装 {count}",
	"import.preview.mcp": "MCP 新增 {count}",
	"import.preview.prompts": "提示词 {count}",
	"import.preview.paths": "路径映射 {count}",
	"import.preview.secrets": "密钥待补录 {count}",
	"import.preview.conflicts": "冲突 {count}",
	"import.preview.restart": "导入后需重启 DSH 生效",
	"import.confirm.execute": "确认导入",
	"import.confirm.warning": "导入将修改当前 DSH 配置；执行前会自动创建安全快照，失败时整体回滚。",
	"import.confirm.encrypted": "将用备份密码解密并恢复 {count} 个凭据。",
	"import.rollbackOnError": "失败时整体回滚（推荐）",
	"import.importing": "正在导入…（插件安装较多时可能需要几分钟，请勿关闭页面）",
	"import.log.title": "导入日志",
	"import.log.empty": "等待命令输出…",
	"import.log.newOutput": "↓ 新输出",
	"import.skipCurrent": "跳过当前插件",
	"import.skipPending": "正在跳过…其余项将继续导入",
	"import.retrySkipped": "重试失败/跳过的项 ({count})",
	"import.secrets.title": "补录密钥",
	"import.secrets.hint": "以下凭据未随备份导出（安全设计）。如需在目标 DSH 使用，请手动补录；留空将跳过。",
	"import.secrets.optional": "（可选）",
	"import.secrets.required": "（必需）",
	"import.decrypt.badge": "加密备份",
	"import.decryptArchive.title": "解锁加密备份",
	"import.decryptArchive.hint": "此备份已整体加密（整个文件被密码保护）。输入导出时设置的密码即可解密并继续导入——备份内的加密凭据也会用同一密码自动恢复，全程只需输入这一次密码；密码仅本次使用，绝不落盘。",
	"import.decryptArchive.passwordPlaceholder": "输入备份加密密码",
	"import.decryptArchive.unlock": "解锁并继续",
	"import.decryptArchive.unlocking": "解锁中…",
	"import.decrypt.previewHint": "加密备份：凭据已由解锁密码自动恢复，无需再次输入密码。",
	"import.conflicts.title": "解决冲突",
	"import.conflicts.hint": "以下配置项在目标 DSH 已存在且与备份不同，请逐项决策。",
	"import.conflicts.keepCurrent": "保留当前",
	"import.conflicts.useImported": "使用备份",
	"import.conflicts.review": "稍后决定",
	"import.conflicts.unresolved": "还有 {count} 项未决策",
	"import.conflicts.keepCurrentAll": "全部保留当前配置",
	"import.conflicts.useImportedAll": "全部使用备份配置",
	"import.paths.title": "路径映射",
	"import.paths.hint": "备份中的绝对路径在目标机器可能不存在，请为每条路径指定新位置（留空将跳过该路径）。",
	"import.paths.old": "原路径",
	"import.paths.new": "新路径",
	"import.paths.unresolved": "还有 {count} 条路径未映射",
	"snapshots.title": "备份与快照",
	"snapshots.hint": "导出备份 = 便携 ZIP（下载 / 一键导入 / 删除，含定时全量备份）；快照恢复 = 恢复到导入前状态：整文件还原 settings/patch、卸载导入期间新增插件、补偿被修改文件，执行前会把当前文件备份到一个安全位置。",
	"snapshots.subTab.restore": "快照恢复",
	"snapshots.subTab.files": "备份文件",
	"snapshots.subTab.recovery": "恢复",
	"snapshots.empty": "暂无快照。执行导入时会自动创建安全快照。",
	"snapshots.loading": "加载快照中…",
	"snapshots.selectHint": "选择快照以预览恢复计划（只读预览，不会改动任何设置）：",
	"snapshots.createdAt": "创建时间",
	"snapshots.sourceZip": "来源备份",
	"snapshots.status": "状态",
	"snapshots.entries": "条目",
	"snapshots.plugins": "插件",
	"snapshots.actions": "操作",
	"snapshots.retentionHint": "最多自动保留 {count} 个快照（超出清理最旧的）；置顶的快照不参与自动清理，只能手动删除。",
	"snapshots.pin": "置顶",
	"snapshots.unpin": "取消置顶",
	"snapshots.delete": "删除",
	"snapshots.deleteConfirmTitle": "删除快照",
	"snapshots.deleteConfirm": "确认删除 {time} 创建的快照？该导入前回滚点将被永久删除，不可恢复。",
	"snapshots.status.pending": "进行中",
	"snapshots.status.done": "已完成",
	"snapshots.status.rolled-back": "已回滚",
	"snapshots.status.unknown": "未知",
	"snapshots.planTitle": "恢复计划预览",
	"snapshots.viewPlan": "查看恢复计划",
	"snapshots.noActions": "该快照无可用恢复动作（或全部跳过）。",
	"snapshots.execute": "执行恢复",
	"snapshots.executing": "恢复执行中…",
	"snapshots.confirmTitle": "确认恢复",
	"snapshots.confirmRestore": "确认执行恢复？会先把当前文件备份到一个安全位置，再删除导入期间新增的插件。",
	"snapshots.reportTitle": "恢复报告",
	"snapshots.restored": "已还原",
	"snapshots.removedPlugins": "已卸载插件",
	"snapshots.manualHints": "需人工处理",
	"snapshots.failed": "失败",
	"snapshots.skipped": "跳过",
	"snapshots.kind.hostFileRestore": "整文件还原",
	"snapshots.kind.hostFileRemove": "整文件删除",
	"snapshots.kind.pluginRemove": "卸载插件",
	"snapshots.kind.fileRestore": "还原文件",
	"snapshots.kind.fileRemove": "删除文件",
	"snapshots.kind.credentialHint": "人工提示",
	"snapshots.kind.skip": "跳过",
	"snapshots.kind.unknown": "未知",
	"snapshots.summary": "整文件还原 {hostFileRestores} · 整文件删除 {hostFileRemoves} · 插件卸载 {pluginRemoves} · 文件还原 {fileRestores} · 文件删除 {fileRemoves} · 凭据提示 {credentialHints} · 跳过 {skips}",
	"backupSchedule.title": "定时全量备份",
	"backupSchedule.hint": "按固定间隔在后台自动导出全量备份 ZIP（恒不含 secret、不加密；要加密请手动导出）。配置存 sync/backup-schedule.json，随 self 分区备份 / 远程同步迁移。",
	"backupSchedule.enabled": "启用定时备份",
	"backupSchedule.enabledHint": "开启后 DSH 在后台按间隔自动备份；每次启动时立即执行一次（距上次运行不足 1 小时则跳过启动触发）。",
	"backupSchedule.interval": "备份间隔",
	"backupSchedule.interval.6h": "每 6 小时",
	"backupSchedule.interval.12h": "每 12 小时",
	"backupSchedule.interval.24h": "每 24 小时",
	"backupSchedule.interval.7d": "每 7 天",
	"backupSchedule.interval.custom": "自定义（每周固定时刻）",
	"backupSchedule.customHint": "每周在选定星期与时刻各执行一次全量备份（错过的时间点不补跑）",
	"backupSchedule.weekday.sunday": "周日",
	"backupSchedule.weekday.monday": "周一",
	"backupSchedule.weekday.tuesday": "周二",
	"backupSchedule.weekday.wednesday": "周三",
	"backupSchedule.weekday.thursday": "周四",
	"backupSchedule.weekday.friday": "周五",
	"backupSchedule.weekday.saturday": "周六",
	"backupSchedule.save": "保存设置",
	"backupSchedule.saved": "设置已保存",
	"backupSchedule.runNow": "立即备份",
	"backupSchedule.running": "备份中…",
	"backupSchedule.lastRun": "上次运行",
	"backupSchedule.never": "从未运行",
	"backupSchedule.status.success": "成功",
	"backupSchedule.status.skipped": "已跳过",
	"backupSchedule.status.failed": "失败",
	"backupSchedule.consecutiveFailures": "定时备份连续失败 {count} 次，请检查配置（磁盘空间 / 权限 / 分区导出错误）",
	"backupSchedule.loading": "加载定时备份设置…",
	"backupSchedule.error": "定时备份设置加载失败",
	"backupFiles.title": "备份文件",
	"backupFiles.hint": "导出产物（手动导出与定时备份）统一在此管理：可下载到本机、直接导入恢复，或删除。定时备份自动保留最近 10 个。",
	"backupFiles.empty": "暂无备份文件。手动导出或启用定时备份后此处会列出。",
	"backupFiles.loading": "加载备份文件…",
	"backupFiles.error": "备份文件加载失败",
	"backupFiles.source.auto": "定时备份",
	"backupFiles.source.manual": "手动导出",
	"backupFiles.download": "下载",
	"backupFiles.import": "导入",
	"backupFiles.delete": "删除",
	"backupFiles.deleteConfirmTitle": "删除备份文件",
	"backupFiles.deleteConfirm": "确认删除备份文件「{name}」？此操作不可恢复。",
	"backupFiles.searchPlaceholder": "按文件名或备注搜索…",
	"backupFiles.searchEmpty": "没有匹配的备份文件",
	"backupFiles.inspect": "查看 / 对比",
	"backupFiles.inspectLoading": "正在分析备份内容…",
	"backupFiles.inspectEmpty": "该备份无法分析（文件损坏或格式不支持）",
	"backupFiles.inspectSections": "包含的分区",
	"backupFiles.inspectDiff": "与此备份的差异（只读预览）",
	"backupFiles.inspectItems": "变更明细",
	"backupFiles.inspectGroup.conflicts": "冲突（需决策）",
	"backupFiles.inspectGroup.changes": "变更（将写入）",
	"backupFiles.inspectGroup.paths": "路径映射（需处理）",
	"backupFiles.inspectGroup.skipped": "已一致（无需处理）",
	"backupFiles.inspectGroup.others": "其他",
	"report.export.title": "导出完成",
	"report.import.title": "导入结果",
	"report.rollback.title": "回滚报告",
	"report.action.fixIssues": "查看失败项",
	"report.action.viewDetails": "查看详情",
	"report.action.done": "完成",
	"report.needsRestart": "插件 / MCP 变更将在重启 DSH 后生效。",
	"nextSteps.title": "接下来需要处理",
	"nextSteps.done": "全部完成，无需额外处理",
	"nextSteps.restart.title": "重启 DSH 后生效（{count}）",
	"nextSteps.restart.hint": "以下变更需要重启 DSH 才会生效：",
	"nextSteps.secrets.title": "补录凭据（{count}）",
	"nextSteps.secrets.hint": "以下凭据未随备份导出，需在本机手动补录：",
	"nextSteps.unresolved.title": "失败 / 已跳过（{count}）",
	"nextSteps.unresolved.hint": "以下项未成功应用，可在结果页点击「重试」：",
	"error.title": "操作失败",
	"error.hint": "错误消息已自动脱敏，不会泄露任何密钥信息。",
	"starPrompt.title": "喜欢 Config Manager 吗？",
	"starPrompt.body": "如果你觉得这个插件有用，欢迎到 GitHub 点个 ⭐ Star 支持一下——你的支持是持续维护的最大动力！",
	"starPrompt.star": "去点 Star",
	"starPrompt.dismiss": "不再提示",
	"about.title": "关于 DSH Config Manager",
	"about.subtitle": "插件信息、作者与反馈入口",
	"about.official": "官方",
	"about.version": "版本 {version}",
	"about.dshVersion": "DSH {version}",
	"about.links": "相关链接",
	"about.star": "⭐ 在 GitHub 上点赞",
	"about.repo": "GitHub 仓库",
	"about.docs": "使用文档",
	"about.issues": "反馈问题",
	"about.authorLabel": "作者",
	"about.loading": "正在获取版本信息…",
	"about.retryStatus": "重新获取",
	"about.releaseNotes": "更新内容",
	"about.releaseNotes.title": "版本更新内容",
	"about.releaseNotes.loading": "正在获取更新内容…",
	"about.releaseNotes.loadingMore": "正在加载更多版本…",
	"about.releaseNotes.empty": "暂无版本发布记录。",
	"about.releaseNotes.error": "获取更新内容失败，请检查网络连接或稍后重试。",
	"about.releaseNotes.retry": "重试",
	"about.releaseNotes.viewOnGithub": "在 GitHub 上查看全部 Releases",
	"about.releaseNotes.viewSingleOnGithub": "在 GitHub 上查看此版本",
	"about.releaseNotes.allLoaded": "已加载全部版本记录",
	"about.releaseNotes.prerelease": "预发布",
	"about.releaseNotes.latest": "最新",
	"about.releaseNotes.noBody": "该版本暂无详细更新说明。",
	"about.releaseNotes.confirm": "确认",
	"about.releaseNotes.neverShow": "永不提示",
	"about.cli.title": "CLI 救援工具",
	"about.cli.hint": "GUI 运行在 DSH 内部——DSH 无法启动时，独立安装的 CLI（dsh-config-manager）是第一救援手段：列快照 / 离线恢复 / 一键重装 DSH，全程无需 DSH 运行。安装一次即可在任何机器上用：",
	"about.cli.docs": "CLI 使用文档",
	"profiles.title": "配置档案",
	"profiles.subtitle": "把当前 DSH 配置保存为多套档案（Work / Personal / …），随时切换；切换含预览 + 自动快照 + 失败回滚。",
	"profiles.save.title": "保存当前配置为档案",
	"profiles.save.hint": "输入档案名并保存：内容复用导出管道（不含密钥），文件类分区（技能/预设）一并内嵌。",
	"profiles.save.placeholder": "例如 Work / Personal / Minimal",
	"profiles.save.action": "保存档案",
	"profiles.save.saving": "保存中…",
	"profiles.nameInvalid": "档案名不合法：仅允许字母数字与常见字符，禁止路径分隔符（/ \\）与 ..",
	"profiles.name": "档案名",
	"profiles.sections": "分区",
	"profiles.updatedAt": "更新时间",
	"profiles.loading": "加载档案中…",
	"profiles.empty": "暂无档案。先保存一份当前配置即可开始。",
	"profiles.switch": "切换",
	"profiles.previewHint": "点击查看切换预览（只读）",
	"profiles.rename": "重命名",
	"profiles.delete": "删除",
	"profiles.renameTitle": "重命名档案",
	"profiles.renameMessage": "将档案「{name}」重命名为：",
	"profiles.deleteTitle": "删除档案",
	"profiles.deleteMessage": "确认删除档案「{name}」？该组配置快照将被永久删除，不可恢复。",
	"profiles.import.title": "导入档案",
	"profiles.import.hint": "导入导出的 profile.json 文件（本机或他机导出的档案，含文件类分区内嵌数据）。",
	"profiles.import.choose": "选择 JSON 文件",
	"profiles.switchPreviewTitle": "切换预览：{name}",
	"profiles.previewing": "正在分析切换计划…",
	"profiles.previewSummary": "切换影响",
	"profiles.previewWillChange": "将变更 {count} 项",
	"profiles.previewUnchanged": "已一致 {count} 项",
	"profiles.previewConflicts": "冲突 {count}",
	"profiles.previewSecrets": "需补录密钥 {count}",
	"profiles.previewRestart": "需重启 DSH 生效",
	"profiles.previewNote": "以上为只读预览（零写入）。确认后会自动创建快照并执行，失败时整体回滚。",
	"profiles.previewSections": "档案包含的分区",
	"profiles.previewItems": "变更明细",
	"profiles.switchConfirm": "确认切换",
	"profiles.switching": "切换中…（自动快照 + 分阶段应用）",
	"profiles.switchDone": "切换完成：{count} 项已应用",
	"profiles.switchFailed": "切换失败（部分项未应用）",
	"profiles.switchRolledBack": "切换失败，已整体回滚"
};
const en$4 = {
	"section.label": "Backup & Migration",
	"section.description": "Export / import / migrate DSH configuration (backups exclude secrets; encrypted backups optional)",
	"view.transfer": "Export & Import",
	"view.export": "Export",
	"view.import": "Import",
	"view.snapshots": "Backup & Snapshots",
	"view.sync": "Remote Sync",
	"view.market": "Marketplace",
	"view.about": "About",
	"view.more": "More",
	"view.profiles": "Profiles",
	"common.close": "Close",
	"common.cancel": "Cancel",
	"common.back": "Back",
	"common.next": "Next",
	"common.done": "Done",
	"common.retry": "Retry",
	"common.confirm": "Confirm",
	"common.loading": "Loading…",
	"common.unknownError": "Unknown error",
	"status.ready": "Config Manager ready (plugin {version} · DSH {dsh} · {platform})",
	"status.unavailable": "Config Manager service unavailable — verify the plugin is mounted.",
	"export.mode.quick": "Quick Export",
	"export.mode.quickHint": "One-click export of recommended sections (portable, no device-specific data) for routine backups.",
	"export.mode.custom": "Custom Export",
	"export.mode.customHint": "Select sections per group.",
	"export.security": "Security options",
	"export.encrypt": "Encrypt backup",
	"export.encryptHint": "Encrypt the entire backup file with a password (AES-256-GCM). The password is used once and never written into the backup or any config file; it is required to unlock the backup on import.",
	"export.password": "Backup encryption password",
	"export.passwordConfirm": "Confirm password",
	"export.passwordMismatch": "Passwords do not match",
	"export.passwordRequired": "An encryption password is required when encrypting the backup",
	"export.includeSecrets": "Export secrets",
	"export.includeSecretsHint": "Write the real secrets (credential values) into the backup. Secrets must be stored encrypted: checking this also checks “Encrypt backup”; unchecking “Encrypt backup” unchecks this.",
	"export.run": "Start Export",
	"export.preview": "Preview export contents",
	"export.previewing": "Counting…",
	"export.previewSummary": "Will package {sections} section(s), approx. {size} (no secrets)",
	"export.previewSkipped": "{count} section(s) failed to export and were skipped",
	"export.running": "Exporting…",
	"export.download": "Download backup file",
	"export.saved": "Saved to downloads: {name}",
	"export.selectionWarnings": "Device-specific sections may not apply on another machine:",
	"export.group.unknown": "Other",
	"export.included": "Included",
	"export.excluded": "Excluded",
	"export.naming": "File name & note (optional)",
	"export.fileName": "Custom file name",
	"export.fileNameHint": "Leave empty to auto-name (dsh-config-<date>.zip); no need to type .zip — it is appended automatically. Letters, digits, spaces, - _ . only.",
	"export.fileNameInvalid": "Invalid file name: letters, digits, spaces, - _ . only, no path separators.",
	"export.note": "Note",
	"export.notePlaceholder": "e.g. Full backup before migration / 2026-08 archive",
	"export.noteHint": "The note is shown in the local backup list (and travels with the config backup) so you can tell exports apart.",
	"import.select.title": "Select Backup File",
	"import.select.hint": "Pick a dsh-config-*.zip backup exported from DSH to begin. Analysis is read-only and changes nothing.",
	"import.select.browse": "Choose ZIP file",
	"import.select.reselect": "Reselect",
	"import.select.cancel": "Cancel selection",
	"import.select.file": "Selected: {name}",
	"import.analyzing": "Analyzing backup…",
	"import.compatibility.title": "Compatibility",
	"import.compatibility.score": "Compatibility score: {score}",
	"import.compatibility.ok": "The backup can be imported",
	"import.compatibility.fail": "Backup analysis failed: {reason}",
	"import.preview.title": "Import Preview",
	"import.preview.willChange": "{count} item(s) will change",
	"import.preview.unchanged": "{count} item(s) already identical (skipped)",
	"import.preview.settings": "{count} settings update(s)",
	"import.preview.plugins": "{count} plugin(s) to install",
	"import.preview.mcp": "{count} MCP server(s) added",
	"import.preview.prompts": "{count} prompt(s)",
	"import.preview.paths": "{count} path mapping(s) needed",
	"import.preview.secrets": "{count} secret(s) to re-enter",
	"import.preview.conflicts": "{count} conflict(s)",
	"import.preview.restart": "A DSH restart is required after import",
	"import.confirm.execute": "Confirm Import",
	"import.confirm.warning": "Import modifies the current DSH configuration; a safety snapshot is created first and everything rolls back on failure.",
	"import.confirm.encrypted": "The backup password will decrypt and restore {count} credential(s).",
	"import.rollbackOnError": "Roll back everything on failure (recommended)",
	"import.importing": "Importing… (installing many plugins may take a few minutes; keep this page open)",
	"import.log.title": "Import Log",
	"import.log.empty": "Waiting for command output…",
	"import.log.newOutput": "↓ New output",
	"import.skipCurrent": "Skip current plugin",
	"import.skipPending": "Skipping… the rest of the import continues",
	"import.retrySkipped": "Retry failed/skipped items ({count})",
	"import.secrets.title": "Re-enter Secrets",
	"import.secrets.hint": "These credentials were not exported with the backup (security by design). Enter them manually to use them here; leave blank to skip.",
	"import.secrets.optional": "(optional)",
	"import.secrets.required": "(required)",
	"import.decrypt.badge": "encrypted backup",
	"import.decryptArchive.title": "Unlock Encrypted Backup",
	"import.decryptArchive.hint": "This backup is fully encrypted (the whole file is password-protected). Enter the password set at export time to decrypt and continue — encrypted credentials inside are restored with the same password, so this is the only password prompt. It is used once and never written to disk.",
	"import.decryptArchive.passwordPlaceholder": "Enter backup encryption password",
	"import.decryptArchive.unlock": "Unlock & Continue",
	"import.decryptArchive.unlocking": "Unlocking…",
	"import.decrypt.previewHint": "Encrypted backup: credentials are restored automatically by the unlock password — no further password prompt.",
	"import.conflicts.title": "Resolve Conflicts",
	"import.conflicts.hint": "These items already exist on this machine and differ from the backup. Decide per item.",
	"import.conflicts.keepCurrent": "Keep current",
	"import.conflicts.useImported": "Use backup",
	"import.conflicts.review": "Decide later",
	"import.conflicts.unresolved": "{count} item(s) unresolved",
	"import.conflicts.keepCurrentAll": "Keep all current",
	"import.conflicts.useImportedAll": "Use all backup",
	"import.paths.title": "Path Mapping",
	"import.paths.hint": "Absolute paths in the backup may not exist on this machine. Map each path to a new location (leave blank to skip).",
	"import.paths.old": "Original path",
	"import.paths.new": "New path",
	"import.paths.unresolved": "{count} path(s) unmapped",
	"snapshots.title": "Backup & Snapshots",
	"snapshots.hint": "Export backups = portable ZIPs (download / one-click import / delete, incl. scheduled full backups). Snapshot restore = back to the pre-import state: whole-file restore of settings/patch, uninstall plugins added during import, compensate modified files; current files are backed up to a safe location first.",
	"snapshots.subTab.restore": "Snapshot Restore",
	"snapshots.subTab.files": "Backup Files",
	"snapshots.subTab.recovery": "Recovery",
	"snapshots.empty": "No snapshots yet. A safety snapshot is created automatically on import.",
	"snapshots.loading": "Loading snapshots…",
	"snapshots.selectHint": "Select a snapshot to preview its restore plan (read-only preview, changes nothing):",
	"snapshots.createdAt": "Created",
	"snapshots.sourceZip": "Source",
	"snapshots.status": "Status",
	"snapshots.entries": "Entries",
	"snapshots.plugins": "Plugins",
	"snapshots.actions": "Actions",
	"snapshots.retentionHint": "Up to {count} snapshots are kept automatically (oldest pruned); pinned snapshots are exempt from auto-pruning and can only be deleted manually.",
	"snapshots.pin": "Pin",
	"snapshots.unpin": "Unpin",
	"snapshots.delete": "Delete",
	"snapshots.deleteConfirmTitle": "Delete Snapshot",
	"snapshots.deleteConfirm": "Delete the snapshot created at {time}? This pre-import rollback point will be permanently removed and cannot be recovered.",
	"snapshots.status.pending": "Pending",
	"snapshots.status.done": "Done",
	"snapshots.status.rolled-back": "Rolled back",
	"snapshots.status.unknown": "Unknown",
	"snapshots.planTitle": "Restore Plan Preview",
	"snapshots.viewPlan": "View restore plan",
	"snapshots.noActions": "No restorable actions for this snapshot (or all skipped).",
	"snapshots.execute": "Restore now",
	"snapshots.executing": "Restoring…",
	"snapshots.confirmTitle": "Confirm restore",
	"snapshots.confirmRestore": "Confirm restore? Current files are first backed up to a safe location, then plugins added during the import are removed.",
	"snapshots.reportTitle": "Restore Report",
	"snapshots.restored": "Restored",
	"snapshots.removedPlugins": "Removed plugins",
	"snapshots.manualHints": "Manual action needed",
	"snapshots.failed": "Failed",
	"snapshots.skipped": "Skipped",
	"snapshots.kind.hostFileRestore": "Restore whole file",
	"snapshots.kind.hostFileRemove": "Remove whole file",
	"snapshots.kind.pluginRemove": "Uninstall plugin",
	"snapshots.kind.fileRestore": "Restore file",
	"snapshots.kind.fileRemove": "Remove file",
	"snapshots.kind.credentialHint": "Manual hint",
	"snapshots.kind.skip": "Skip",
	"snapshots.kind.unknown": "Unknown",
	"snapshots.summary": "{hostFileRestores} whole-file restore · {hostFileRemoves} whole-file remove · {pluginRemoves} plugin uninstall · {fileRestores} file restore · {fileRemoves} file remove · {credentialHints} credential hints · {skips} skip",
	"backupSchedule.title": "Scheduled Full Backups",
	"backupSchedule.hint": "Automatically export a full backup ZIP in the background on a fixed cadence (secrets are never included, never encrypted — use manual export for encryption). Config lives in sync/backup-schedule.json and migrates with the self section.",
	"backupSchedule.enabled": "Enable scheduled backups",
	"backupSchedule.enabledHint": "When on, DSH backs up automatically on the cadence below; one run fires on every startup (skipped if less than 1h since the last run).",
	"backupSchedule.interval": "Backup interval",
	"backupSchedule.interval.6h": "Every 6 hours",
	"backupSchedule.interval.12h": "Every 12 hours",
	"backupSchedule.interval.24h": "Every 24 hours",
	"backupSchedule.interval.7d": "Every 7 days",
	"backupSchedule.interval.custom": "Custom (weekly at a fixed time)",
	"backupSchedule.customHint": "Runs a full backup once a week at the selected weekday and time (missed triggers are not backfilled)",
	"backupSchedule.weekday.sunday": "Sunday",
	"backupSchedule.weekday.monday": "Monday",
	"backupSchedule.weekday.tuesday": "Tuesday",
	"backupSchedule.weekday.wednesday": "Wednesday",
	"backupSchedule.weekday.thursday": "Thursday",
	"backupSchedule.weekday.friday": "Friday",
	"backupSchedule.weekday.saturday": "Saturday",
	"backupSchedule.save": "Save settings",
	"backupSchedule.saved": "Settings saved",
	"backupSchedule.runNow": "Back up now",
	"backupSchedule.running": "Backing up…",
	"backupSchedule.lastRun": "Last run",
	"backupSchedule.never": "Never run",
	"backupSchedule.status.success": "Success",
	"backupSchedule.status.skipped": "Skipped",
	"backupSchedule.status.failed": "Failed",
	"backupSchedule.consecutiveFailures": "Scheduled backups failed {count} time(s) in a row — check the configuration (disk space / permissions / section export errors)",
	"backupSchedule.loading": "Loading scheduled backup settings…",
	"backupSchedule.error": "Failed to load scheduled backup settings",
	"backupFiles.title": "Backup Files",
	"backupFiles.hint": "All export artifacts (manual exports and scheduled backups) are managed here: download to your machine, import to restore, or delete. Scheduled backups auto-keep the latest 10.",
	"backupFiles.empty": "No backup files yet. They appear here after a manual export or once scheduled backups are enabled.",
	"backupFiles.loading": "Loading backup files…",
	"backupFiles.error": "Failed to load backup files",
	"backupFiles.source.auto": "Scheduled",
	"backupFiles.source.manual": "Manual",
	"backupFiles.download": "Download",
	"backupFiles.import": "Import",
	"backupFiles.delete": "Delete",
	"backupFiles.deleteConfirmTitle": "Delete backup file",
	"backupFiles.deleteConfirm": "Delete backup file \"{name}\"? This cannot be undone.",
	"backupFiles.searchPlaceholder": "Search by file name or note…",
	"backupFiles.searchEmpty": "No matching backup files",
	"backupFiles.inspect": "Inspect / Compare",
	"backupFiles.inspectLoading": "Analyzing backup contents…",
	"backupFiles.inspectEmpty": "This backup could not be analyzed (corrupt or unsupported format)",
	"backupFiles.inspectSections": "Sections included",
	"backupFiles.inspectDiff": "Diff against this backup (read-only preview)",
	"backupFiles.inspectItems": "Change details",
	"backupFiles.inspectGroup.conflicts": "Conflicts (need decision)",
	"backupFiles.inspectGroup.changes": "Changes (will apply)",
	"backupFiles.inspectGroup.paths": "Path mappings (need handling)",
	"backupFiles.inspectGroup.skipped": "Identical (nothing to do)",
	"backupFiles.inspectGroup.others": "Others",
	"report.export.title": "Export Complete",
	"report.import.title": "Import Result",
	"report.rollback.title": "Rollback Report",
	"report.action.fixIssues": "View failures",
	"report.action.viewDetails": "View details",
	"report.action.done": "Done",
	"report.needsRestart": "Plugin / MCP changes take effect after restarting DSH.",
	"error.title": "Operation failed",
	"error.hint": "Error messages are auto-redacted and never leak secrets.",
	"starPrompt.title": "Enjoying Config Manager?",
	"starPrompt.body": "If you find this plugin useful, please give it a ⭐ on GitHub — your support keeps it maintained!",
	"starPrompt.star": "Star on GitHub",
	"starPrompt.dismiss": "Don't ask again",
	"about.title": "About DSH Config Manager",
	"about.subtitle": "Plugin info, author and feedback links",
	"about.official": "Official",
	"about.version": "Version {version}",
	"about.dshVersion": "DSH {version}",
	"about.links": "Links",
	"about.star": "⭐ Star on GitHub",
	"about.repo": "GitHub Repository",
	"about.docs": "Documentation",
	"about.issues": "Issues",
	"about.authorLabel": "Author",
	"about.loading": "Loading version info…",
	"about.retryStatus": "Retry",
	"about.releaseNotes": "Release Notes",
	"about.releaseNotes.title": "Release Notes",
	"about.releaseNotes.loading": "Loading release notes…",
	"about.releaseNotes.loadingMore": "Loading more releases…",
	"about.releaseNotes.empty": "No releases found.",
	"about.releaseNotes.error": "Failed to load release notes. Please check your network connection or try again later.",
	"about.releaseNotes.retry": "Retry",
	"about.releaseNotes.viewOnGithub": "View all releases on GitHub",
	"about.releaseNotes.viewSingleOnGithub": "View on GitHub",
	"about.releaseNotes.allLoaded": "All releases loaded",
	"about.releaseNotes.prerelease": "Pre-release",
	"about.releaseNotes.latest": "Latest",
	"about.releaseNotes.noBody": "No description provided for this release.",
	"about.releaseNotes.confirm": "Confirm",
	"about.releaseNotes.neverShow": "Don't show again",
	"about.cli.title": "CLI Rescue Tool",
	"about.cli.hint": "The GUI lives inside DSH — when DSH cannot start, the separately installed CLI (dsh-config-manager) is your first rescue tool: list snapshots / offline restore / one-click DSH reinstall, no DSH runtime needed. Install once and use it on any machine:",
	"about.cli.docs": "CLI documentation",
	"profiles.title": "Profiles",
	"profiles.subtitle": "Save your current DSH configuration as multiple switchable profiles (Work / Personal / …); switching includes preview + auto snapshot + rollback on failure.",
	"profiles.save.title": "Save current config as a profile",
	"profiles.save.hint": "Pick a name and save: contents reuse the export pipeline (no secrets), file sections (skills / presets) are embedded too.",
	"profiles.save.placeholder": "e.g. Work / Personal / Minimal",
	"profiles.save.action": "Save profile",
	"profiles.save.saving": "Saving…",
	"profiles.nameInvalid": "Invalid profile name: letters, digits and common characters only; no path separators (/ \\) or \"..\"",
	"profiles.name": "Name",
	"profiles.sections": "Sections",
	"profiles.updatedAt": "Updated",
	"profiles.loading": "Loading profiles…",
	"profiles.empty": "No profiles yet. Save the current configuration to get started.",
	"profiles.switch": "Switch",
	"profiles.previewHint": "Click to preview the switch (read-only)",
	"profiles.rename": "Rename",
	"profiles.delete": "Delete",
	"profiles.renameTitle": "Rename profile",
	"profiles.renameMessage": "Rename profile \"{name}\" to:",
	"profiles.deleteTitle": "Delete profile",
	"profiles.deleteMessage": "Delete profile \"{name}\"? This group of configuration snapshots will be permanently removed.",
	"profiles.import.title": "Import profile",
	"profiles.import.hint": "Import an exported profile.json (from this or another machine; file sections are embedded).",
	"profiles.import.choose": "Choose JSON file",
	"profiles.switchPreviewTitle": "Switch preview: {name}",
	"profiles.previewing": "Analyzing switch plan…",
	"profiles.previewSummary": "Switch impact",
	"profiles.previewWillChange": "{count} item(s) will change",
	"profiles.previewUnchanged": "{count} identical",
	"profiles.previewConflicts": "{count} conflict(s)",
	"profiles.previewSecrets": "{count} secret(s) to re-enter",
	"profiles.previewRestart": "DSH restart required",
	"profiles.previewNote": "Read-only preview above (zero writes). After confirmation a snapshot is created automatically and everything rolls back on failure.",
	"profiles.previewSections": "Sections in this profile",
	"profiles.previewItems": "Change details",
	"profiles.switchConfirm": "Confirm switch",
	"profiles.switching": "Switching… (auto snapshot + staged apply)",
	"profiles.switchDone": "Switch complete: {count} item(s) applied",
	"profiles.switchFailed": "Switch failed (some items not applied)",
	"profiles.switchRolledBack": "Switch failed — fully rolled back",
	"nextSteps.title": "Next steps",
	"nextSteps.done": "All done — nothing else to handle",
	"nextSteps.restart.title": "Restart DSH to apply ({count})",
	"nextSteps.restart.hint": "These changes only take effect after restarting DSH:",
	"nextSteps.secrets.title": "Re-enter credentials ({count})",
	"nextSteps.secrets.hint": "These credentials were not exported with the backup; re-enter them on this machine:",
	"nextSteps.unresolved.title": "Failed / skipped ({count})",
	"nextSteps.unresolved.hint": "These items were not applied; you can retry them from the result page:"
};
//#endregion
//#region src/client/sync/sync-locales.ts
/**
* 远程同步设置区块（config-manager-sync）表面文案：zh 为源语言，en 镜像每个键。
* 独立命名空间、独立文件：不触碰共享的 locales.ts（并行会话已改），零冲突。
* 键集合经 `SyncKey` 类型在 client/index.ts 注册处做编译期校验。
*/
const zh$3 = {
	"section.label": "远程同步",
	"section.description": "通过 Git 私有仓库在设备间同步可移植配置（密钥永不参与同步）",
	"privateRepoHint": "安全要求：同步仓库必须为私有仓库（public 仓库会公开你的配置内容）。认证 token 仅用于仓库访问，绝不写入同步文件、提交内容或日志。",
	"config.title": "仓库配置",
	"config.repoUrl": "仓库地址",
	"config.repoUrlHint": "Git 私有仓库地址（https / ssh / 本地路径）。认证 token 请使用下方凭据字段，不要拼入地址。",
	"config.token": "认证 token",
	"config.tokenHint": "将安全写入 DSH credentials（引用名 {ref}），不会写入同步文件或日志。留空表示沿用已保存的凭据。",
	"config.tokenSaved": "凭据已配置",
	"config.tokenPlaceholder": "ghp_…（可选）",
	"config.save": "保存配置",
	"config.saving": "保存中…",
	"config.saveHint": "表单改动会自动保存（密码/token 安全写入 DSH credentials，不会写入同步文件或日志）；也可点击按钮立即保存。",
	"channel.title": "同步通道",
	"channel.git": "Git 私有仓库",
	"channel.webdav": "WebDAV 服务器",
	"channel.perChannelHint": "GitHub 与 WebDAV 通道的自动同步、同步模式、加密与远端快照各自独立配置。",
	"channel.open": "配置同步通道",
	"channel.openHint": "远程同步通过「同步通道」进行：Git 私有仓库或 WebDAV 服务器。点击按钮在弹窗中配置或修改。",
	"channel.configured": "已配置",
	"channel.notConfigured": "未配置",
	"channel.currentUrl": "当前地址",
	"webdav.title": "WebDAV 配置",
	"webdav.url": "服务器地址",
	"webdav.urlHint": "WebDAV 服务器根地址（https://…）。同步快照与索引存放于该地址的 dsh-config-manager/ 子目录下。请勿在地址中包含用户名/密码。",
	"webdav.username": "用户名",
	"webdav.usernameHint": "HTTP Basic 认证用户名（非敏感，可回显）。",
	"webdav.password": "密码",
	"webdav.passwordHint": "将安全写入 DSH credentials（引用名 {ref}），不会写入同步文件或日志。留空表示沿用已保存的凭据。",
	"webdav.passwordSaved": "凭据已配置",
	"webdav.passwordPlaceholder": "密码（可选）",
	"webdav.presetHint": "选择常见 WebDAV 服务器可快速填入地址；含 <占位符> 的模板请替换为你的真实服务器/用户名。",
	"github.title": "GitHub 登录",
	"github.description": "通过 GitHub OAuth 设备码流程授权：无需手动输入 token，在浏览器中确认授权后，token 自动写入 DSH credentials。",
	"github.login": "使用 GitHub 登录",
	"github.retry": "重新登录",
	"github.cancel": "取消",
	"github.tokenInvalid": "GitHub 登录已失效，请重新登录。",
	"github.userCode": "一次性授权代码",
	"github.openAuth": "打开 GitHub 授权页面",
	"github.clientIdHint": "需要插件配置 githubClientId（GitHub OAuth App 的 client_id）才能使用 GitHub 登录。",
	"status.title": "同步状态",
	"status.never": "从未同步",
	"action.push": "推送到远端",
	"action.pull": "拉取差异预览",
	"action.pushing": "正在推送…",
	"action.pulling": "正在拉取…",
	"push.title": "推送结果",
	"pull.title": "拉取差异预览",
	"pull.previewHint": "以上为只读差异预览，不会执行导入。当前版本暂不支持一键导入；如需应用远端配置，请使用「导入恢复」向导手动导入导出的备份。",
	"pull.needsReview": "包含需要人工决策的项（冲突 / 密钥 / 依赖 / 安装）",
	"pull.empty": "远端快照与本地一致（无变更）",
	"change.total": "共 {total} 项变更",
	"sections.title": "同步分区",
	"warnings.title": "分区告警",
	"syncflow.title": "一键同步",
	"syncflow.button": "一键同步",
	"syncflow.syncing": "正在同步…",
	"syncflow.syncFailed": "同步失败",
	"syncflow.snapshotOption": "（{date} · {count} 分区）",
	"syncflow.selectSnapshot": "选择历史快照",
	"syncflow.refreshSnapshots": "刷新快照列表",
	"syncflow.refreshingSnapshots": "正在获取…",
	"syncflow.latestSnapshot": "最新快照",
	"syncflow.noSnapshots": "远端暂无快照",
	"syncflow.confirmImport": "确认导入",
	"syncflow.cancel": "取消",
	"syncflow.adoptRemote": "采用远端",
	"syncflow.adoptHint": "勾选 = 导入该项；取消 = 跳过",
	"syncflow.needsReviewBadge": "需人工决策",
	"syncflow.empty": "远端快照与本地一致（无变更）",
	"syncflow.diffCount": "共 {count} 项差异",
	"syncflow.keepLocalAll": "全部保留当前配置",
	"syncflow.useRemoteAll": "全部使用备份配置",
	"syncflow.bulkHint": "批量决策仅作用于冲突项；其余差异默认自动采用。",
	"syncflow.conflictTitle": "冲突解决",
	"syncflow.conflictUseLocal": "保留当前",
	"syncflow.conflictUseRemote": "使用备份",
	"syncflow.conflictLocalLabel": "当前",
	"syncflow.conflictRemoteLabel": "备份",
	"syncflow.conflictAncestorLabel": "共同祖先",
	"syncflow.conflictUnresolved": "冲突项 {itemId} 尚未选择解决方式（保留当前 / 使用备份）",
	"syncflow.diff": "差异",
	"syncflow.importDone": "已导入 {n} 个分区",
	"syncflow.importFailed": "导入失败（已整体回滚）",
	"syncflow.importedSections": "已写入",
	"syncflow.importWarnings": "导入告警",
	"syncflow.rollback": "回滚到应用前",
	"syncflow.rollingBack": "正在回滚…",
	"syncflow.rollbackDone": "已回滚到应用前",
	"syncflow.needsRestart": "部分改动需要重启 DSH 后生效",
	"syncflow.pushPreviewTitle": "确认推送",
	"syncflow.pushPreviewSections": "将推送的分区",
	"syncflow.pushConfirm": "确认推送",
	"syncflow.pushing": "正在推送…",
	"syncflow.pushFirstBaseline": "远端暂无快照：本次将创建首个同步基线",
	"mode.title": "同步模式",
	"mode.hint": "选择推送时导出哪些分区：默认 = 推荐分区一键推送（快速导出）；高级 = 自定义勾选（自定义导出）。",
	"mode.default": "默认（快速导出）",
	"mode.defaultHint": "一键推送全部推荐分区（settings、providers、plugins、prompts、skills 等），无需配置。",
	"mode.advanced": "高级（自定义导出）",
	"mode.advancedHint": "手动勾选要推送的分区（等同导出备份的自定义导出）；仅可移植分区可参与同步。",
	"mode.sectionsTitle": "同步分区",
	"mode.sectionsHint": "仅可移植分区可同步：设备相关（插件文件、凭据状态、会话）与平台相关（MCP、工作区）分区不参与远程同步。",
	"mode.atLeastOne": "请至少勾选一个同步分区",
	"mode.defaultCount": "将同步 {n} 个推荐分区",
	"mode.sectionPortable": "可移植",
	"mode.sectionRecommended": "推荐",
	"mode.persistHint": "模式与分区选择已保存到本机：自动同步和手动推送都会使用此配置（重启后仍生效）。",
	"mode.security": "加密与密钥导出（安全选项）",
	"mode.encrypt": "加密备份",
	"mode.encryptHint": "用密码加密同步快照（AES-256-GCM）。密码仅本次推送使用、绝不落盘；自动同步无法解密加密快照，会自动跳过并在同步历史中提示。",
	"mode.password": "加密密码",
	"mode.passwordConfirm": "确认密码",
	"mode.passwordMismatch": "两次输入的密码不一致",
	"mode.passwordRequired": "加密必须设置密码",
	"mode.includeSecrets": "导出密钥",
	"mode.includeSecretsHint": "把真实凭据值写入加密快照（勾选时自动选中加密；密钥绝不进入未加密快照）。",
	"mode.encryptAutosyncNotice": "加密快照仅通过手动推送/拉取使用；自动同步无密码，遇到加密快照会跳过并在历史中提示。",
	"mode.decryptPassword": "解密密码（加密快照拉取/同步用，可选）",
	"mode.decryptPasswordHint": "拉取或一键同步遇到加密快照时输入；不输入则加密快照无法读取（自动同步会跳过并在历史中提示）。",
	"autosync.title": "自动同步",
	"autosync.description": "开启后，DSH 在后台保持配置一致：本地配置有改动时自动上传，检测到远端有新快照时才自动拉取合并；定时器仅作兜底轮询，无变化不重复动作。仅在无冲突且无需人工干预时才自动写入本地。",
	"autosync.enable": "启用自动同步",
	"autosync.interval": "兜底轮询间隔",
	"autosync.intervalHint": "间隔到点 / DSH 启动时检查远端是否有新快照，有才拉取合并（不上传本地）；本地配置改动会触发上传。",
	"autosync.interval5m": "5 分钟",
	"autosync.interval15m": "15 分钟",
	"autosync.interval30m": "30 分钟",
	"autosync.interval60m": "60 分钟",
	"autosync.interval6h": "6 小时",
	"autosync.interval12h": "12 小时",
	"autosync.interval24h": "24 小时",
	"autosync.status": "上次运行：{status}（{time}）",
	"autosync.statusNever": "从未运行",
	"autosync.nextRun": "下次约 {time} 后",
	"autosync.due": "已到同步时间，即将执行",
	"autosync.failCount": "连续失败 {n} 次",
	"autosync.running": "自动同步进行中…",
	"autosync.success": "成功",
	"autosync.skipped": "已跳过",
	"autosync.failed": "失败",
	"autosync.partial": "部分成功",
	"history.title": "同步历史",
	"history.empty": "尚无同步历史",
	"history.emptyHint": "完成首次 push / 一键同步 / 自动同步后，这里会显示记录。",
	"history.colTime": "时间",
	"history.colKind": "类型",
	"history.colDetail": "详情",
	"history.kindSnapshot": "快照",
	"history.kindAutosync": "自动同步",
	"history.sectionCount": "分区",
	"history.detail": "明细",
	"history.autosyncDirection": "方向：{direction}",
	"history.autosyncPull": "下载",
	"history.autosyncPush": "上传",
	"history.autosyncBoth": "双向",
	"history.autosyncSkipReason": "跳过原因：{reason}",
	"history.autosyncReasonConflict": "冲突",
	"history.autosyncReasonNoRemote": "无远端快照",
	"history.autosyncReasonNotConfigured": "未配置仓库",
	"history.autosyncReasonNetwork": "网络问题",
	"history.autosyncConflicted": "跳过冲突分区：{sections}",
	"history.autosyncApplied": "应用分区：{sections}",
	"history.autosyncError": "错误：{error}",
	"history.autosyncNotified": "已通知（连续失败 3 次）",
	"history.column.snapshot": "快照",
	"history.column.autosync": "自动同步",
	"history.channelGit": "GitHub",
	"history.channelWebdav": "WebDAV",
	"common.close": "关闭",
	"common.retry": "重试",
	"common.loading": "加载中…"
};
const en$3 = {
	"section.label": "Remote Sync",
	"section.description": "Sync portable configuration across devices via a private Git repository (secrets never sync)",
	"privateRepoHint": "Security requirement: the sync repository MUST be private (a public repo would expose your configuration). The auth token is only used for repository access and is never written into sync files, commit content, or logs.",
	"config.title": "Repository",
	"config.repoUrl": "Repository URL",
	"config.repoUrlHint": "Private Git repository URL (https / ssh / local path). Use the credential field below for the auth token; never embed it in the URL.",
	"config.token": "Auth token",
	"config.tokenHint": "Securely written into DSH credentials (ref {ref}); never written into sync files or logs. Leave blank to reuse the saved credential.",
	"config.tokenSaved": "Credential configured",
	"config.tokenPlaceholder": "ghp_… (optional)",
	"config.save": "Save config",
	"config.saving": "Saving…",
	"config.saveHint": "Form changes are saved automatically (password/token written securely into DSH credentials, never into sync files or logs); you can also save explicitly with the button.",
	"channel.title": "Sync Channel",
	"channel.git": "Git private repo",
	"channel.webdav": "WebDAV server",
	"channel.perChannelHint": "Auto sync, sync mode, encryption and remote snapshots are configured independently for GitHub and WebDAV channels.",
	"channel.open": "Configure sync channel",
	"channel.openHint": "Remote sync runs through a sync channel: a private Git repository or a WebDAV server. Click the button to configure or change it in the dialog.",
	"channel.configured": "Configured",
	"channel.notConfigured": "Not configured",
	"channel.currentUrl": "Current URL",
	"webdav.title": "WebDAV Configuration",
	"webdav.url": "Server URL",
	"webdav.urlHint": "WebDAV server root URL (https://…). Sync snapshots and the index are stored under a dsh-config-manager/ subdirectory of that URL. Do not include a username/password in the URL.",
	"webdav.username": "Username",
	"webdav.usernameHint": "HTTP Basic auth username (not sensitive, may be shown).",
	"webdav.password": "Password",
	"webdav.passwordHint": "Securely written into DSH credentials (ref {ref}); never written into sync files or logs. Leave blank to reuse the saved credential.",
	"webdav.passwordSaved": "Credential configured",
	"webdav.passwordPlaceholder": "Password (optional)",
	"webdav.presetHint": "Pick a common WebDAV server to prefill the URL; templates containing <placeholders> need to be replaced with your real server/username.",
	"github.title": "GitHub Sign-in",
	"github.description": "Authorize via the GitHub OAuth device flow: no manual token entry — after you approve in the browser, the token is written into DSH credentials automatically.",
	"github.login": "Sign in with GitHub",
	"github.retry": "Sign in again",
	"github.cancel": "Cancel",
	"github.tokenInvalid": "GitHub sign-in is no longer valid — please sign in again.",
	"github.userCode": "One-time code",
	"github.openAuth": "Open GitHub authorization page",
	"github.clientIdHint": "Requires the githubClientId plugin config (the client_id of your GitHub OAuth App).",
	"status.title": "Sync Status",
	"status.never": "Never synced",
	"action.push": "Push to remote",
	"action.pull": "Pull diff preview",
	"action.pushing": "Pushing…",
	"action.pulling": "Pulling…",
	"push.title": "Push Result",
	"pull.title": "Pull Diff Preview",
	"pull.previewHint": "Read-only diff preview above; nothing is imported. One-click import is not supported in this version; use the Import wizard to apply a downloaded backup if needed.",
	"pull.needsReview": "Contains items that need human decisions (conflicts / secrets / dependencies / installs)",
	"pull.empty": "Remote snapshot matches local (no changes)",
	"change.total": "{total} change(s)",
	"sections.title": "Synced Sections",
	"warnings.title": "Section Warnings",
	"syncflow.title": "One-Click Sync",
	"syncflow.button": "One-click sync",
	"syncflow.syncing": "Syncing…",
	"syncflow.syncFailed": "Sync failed",
	"syncflow.snapshotOption": "({date} · {count} sections)",
	"syncflow.selectSnapshot": "Select snapshot",
	"syncflow.refreshSnapshots": "Refresh snapshots",
	"syncflow.refreshingSnapshots": "Fetching…",
	"syncflow.latestSnapshot": "Latest snapshot",
	"syncflow.noSnapshots": "No remote snapshots",
	"syncflow.confirmImport": "Confirm import",
	"syncflow.cancel": "Cancel",
	"syncflow.adoptRemote": "Adopt remote",
	"syncflow.adoptHint": "Check = import item; uncheck = skip",
	"syncflow.needsReviewBadge": "Needs decision",
	"syncflow.empty": "Remote snapshot matches local (no changes)",
	"syncflow.diffCount": "{count} change(s)",
	"syncflow.keepLocalAll": "Keep all current",
	"syncflow.useRemoteAll": "Use all backup",
	"syncflow.bulkHint": "Bulk decisions only apply to conflict items; other changes are adopted by default.",
	"syncflow.conflictTitle": "Resolve conflict",
	"syncflow.conflictUseLocal": "Keep current",
	"syncflow.conflictUseRemote": "Use backup",
	"syncflow.conflictLocalLabel": "Current",
	"syncflow.conflictRemoteLabel": "Backup",
	"syncflow.conflictAncestorLabel": "Common ancestor",
	"syncflow.conflictUnresolved": "Conflict item {itemId} has no resolution yet (keep current / use backup)",
	"syncflow.diff": "Diff",
	"syncflow.importDone": "Imported {n} section(s)",
	"syncflow.importFailed": "Import failed (rolled back)",
	"syncflow.importedSections": "Written",
	"syncflow.importWarnings": "Import warnings",
	"syncflow.rollback": "Rollback",
	"syncflow.rollingBack": "Rolling back…",
	"syncflow.rollbackDone": "Rolled back",
	"syncflow.needsRestart": "Some changes require a DSH restart to take effect",
	"syncflow.pushPreviewTitle": "Confirm Push",
	"syncflow.pushPreviewSections": "Sections to push",
	"syncflow.pushConfirm": "Push",
	"syncflow.pushing": "Pushing…",
	"syncflow.pushFirstBaseline": "No remote snapshots yet: this push creates the first sync baseline",
	"mode.title": "Sync Mode",
	"mode.hint": "Choose which sections to export when pushing: Default = recommended sections in one click (Quick Export); Advanced = custom selection (Custom Export).",
	"mode.default": "Default (Quick Export)",
	"mode.defaultHint": "Push all recommended sections (settings, providers, plugins, prompts, skills, etc.) in one click — no configuration needed.",
	"mode.advanced": "Advanced (Custom Export)",
	"mode.advancedHint": "Manually select the sections to push (same as Custom Export in the Export tab); only portable sections can sync.",
	"mode.sectionsTitle": "Sync Sections",
	"mode.sectionsHint": "Only portable sections can sync: device-specific (plugin files, credentials status, sessions) and platform-specific (MCP, workspaces) sections never participate in remote sync.",
	"mode.atLeastOne": "Select at least one section to sync",
	"mode.defaultCount": "Will sync {n} recommended section(s)",
	"mode.sectionPortable": "Portable",
	"mode.sectionRecommended": "Recommended",
	"mode.persistHint": "The mode and section selection are saved locally: both auto sync and manual push use this configuration (persists across restarts).",
	"mode.security": "Encryption & Secret Export (Security Options)",
	"mode.encrypt": "Encrypt backup",
	"mode.encryptHint": "Encrypt the sync snapshot with a password (AES-256-GCM). The password is memory-only for this push and never persisted; auto sync cannot decrypt encrypted snapshots, so it skips them and reports it in sync history.",
	"mode.password": "Encryption password",
	"mode.passwordConfirm": "Confirm password",
	"mode.passwordMismatch": "Passwords do not match",
	"mode.passwordRequired": "Encryption requires a password",
	"mode.includeSecrets": "Export secrets",
	"mode.includeSecretsHint": "Write real credential values into the encrypted snapshot (auto-selects encryption when checked; secrets never enter a plaintext snapshot).",
	"mode.encryptAutosyncNotice": "Encrypted snapshots are only produced/consumed by manual push/pull; auto sync has no password, so it skips encrypted snapshots and reports them in history.",
	"mode.decryptPassword": "Decryption password (for encrypted snapshot pull/sync, optional)",
	"mode.decryptPasswordHint": "Provide it when pulling or one-click syncing an encrypted snapshot; without it encrypted snapshots cannot be read (auto sync skips and reports them in history).",
	"autosync.title": "Auto Sync",
	"autosync.description": "When enabled, DSH keeps config in sync in the background: uploads locally-changed config automatically, pulls and merges only when it detects a new remote snapshot; the timer is just a fallback poll and no-ops when nothing changed. Local writes happen only when there are no conflicts or manual-decision items.",
	"autosync.enable": "Enable auto sync",
	"autosync.interval": "Fallback poll interval",
	"autosync.intervalHint": "On interval / DSH startup, checks for a new remote snapshot and pulls+merges only if one exists (no upload); local config changes trigger an upload.",
	"autosync.interval5m": "5 min",
	"autosync.interval15m": "15 min",
	"autosync.interval30m": "30 min",
	"autosync.interval60m": "60 min",
	"autosync.interval6h": "6 hr",
	"autosync.interval12h": "12 hr",
	"autosync.interval24h": "24 hr",
	"autosync.status": "Last run: {status} ({time})",
	"autosync.statusNever": "Never run",
	"autosync.nextRun": "Next in ~{time}",
	"autosync.due": "Due — running soon",
	"autosync.failCount": "{n} consecutive failure(s)",
	"autosync.running": "Auto sync running…",
	"autosync.success": "Success",
	"autosync.skipped": "Skipped",
	"autosync.failed": "Failed",
	"autosync.partial": "Partial",
	"history.title": "Sync History",
	"history.empty": "No sync history yet",
	"history.emptyHint": "Records appear here after your first push / one-click sync / auto sync.",
	"history.colTime": "Time",
	"history.colKind": "Kind",
	"history.colDetail": "Detail",
	"history.kindSnapshot": "Snapshot",
	"history.kindAutosync": "Auto Sync",
	"history.sectionCount": "sections",
	"history.detail": "Detail",
	"history.autosyncDirection": "Direction: {direction}",
	"history.autosyncPull": "Pull",
	"history.autosyncPush": "Push",
	"history.autosyncBoth": "Both",
	"history.autosyncSkipReason": "Skip reason: {reason}",
	"history.autosyncReasonConflict": "Conflict",
	"history.autosyncReasonNoRemote": "No remote snapshot",
	"history.autosyncReasonNotConfigured": "No repository configured",
	"history.autosyncReasonNetwork": "Network issue",
	"history.autosyncConflicted": "Skipped conflict sections: {sections}",
	"history.autosyncApplied": "Applied sections: {sections}",
	"history.autosyncError": "Error: {error}",
	"history.autosyncNotified": "Notified (3 consecutive failures)",
	"history.column.snapshot": "Snapshot",
	"history.column.autosync": "Auto Sync",
	"history.channelGit": "GitHub",
	"history.channelWebdav": "WebDAV",
	"common.close": "Close",
	"common.retry": "Retry",
	"common.loading": "Loading…"
};
//#endregion
//#region src/client/market/market-api.ts
/** 市场端点常量（与 Host 半 API 常量保持一致；内置单市场，无 add/remove） */
const MARKET_API = {
	base: "/api/dsh-config-manager/market",
	status: "/api/dsh-config-manager/market/status",
	refresh: "/api/dsh-config-manager/market/refresh",
	browse: "/api/dsh-config-manager/market/browse",
	download: "/api/dsh-config-manager/market/download",
	prepare: "/api/dsh-config-manager/market/prepare",
	/** 受控临时区文件下载端点（发布包 zip 下载复用；GET ?path=，无凭据） */
	fileDownload: "/api/dsh-config-manager/download"
};
/** 市场请求超时（ms）：git 拉取可能较慢，与 Host 半 ROUTE_TIMEOUT_MS 对齐量级 */
const MARKET_TIMEOUT_MS = 3e5;
/** 解析 JSON 响应；非 2xx 时抛出带路由 error 消息的 ConfigManagerApiError（与 api.ts 同款） */
async function readJson$2(response, t) {
	const notMountedMessage = t("error.notMounted");
	let body;
	try {
		body = await response.json();
	} catch {
		if (response.status === 404) throw new ConfigManagerApiError(notMountedMessage);
		throw new ConfigManagerApiError(t("error.httpInvalidJson", { status: String(response.status) }));
	}
	if (!response.ok) throw new ConfigManagerApiError(typeof body === "object" && body !== null && typeof body.error === "string" ? body.error : response.status === 404 ? notMountedMessage : `HTTP ${response.status}`);
	return body;
}
/** POST JSON 请求（带超时：宿主卡死时 UI 拿到明确错误而不是永远转圈） */
async function postJson$2(path, body, t) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), MARKET_TIMEOUT_MS);
	try {
		return await readJson$2(await fetch(path, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
			signal: controller.signal
		}), t);
	} catch (err) {
		if (controller.signal.aborted) throw new ConfigManagerApiError(t("error.syncTimeout", { minutes: String(Math.round(MARKET_TIMEOUT_MS / 6e4)) }));
		throw err;
	} finally {
		clearTimeout(timer);
	}
}
/** 配置市场浏览器半数据入口（备份与迁移页第 5 个 tab 的注入业务面） */
var MarketApi = class {
	t;
	constructor(t = zhUiT) {
		this.t = t;
	}
	/** 读取内置市场摘要（条目数 / 最近拉取时间；无任何凭据） */
	async status() {
		return readJson$2(await fetch(MARKET_API.status), this.t);
	}
	/** 拉取市场最新 index.json（内置单市场；返回目录条目 + 市场缓存摘要） */
	async refresh() {
		return postJson$2(MARKET_API.refresh, {}, this.t);
	}
	/** 浏览内置市场（合并 index + 本地缓存状态 → 条目列表带 cacheState） */
	async browse() {
		return postJson$2(MARKET_API.browse, {}, this.t);
	}
	/** 下载 + 校验单条目（dry-run 预览：拉取 → §6 校验 → analyzeImport → createImportPlan）。
	*  repo 可选：条目来源仓库（作者自托管）。自托管条目（官方 index 带 repo 引用、或「我的配置」
	*  未收录条目）内容文件在作者自己的公开仓库，必须显式传 repo 才能从正确来源拉取；
	*  缺省 = 市场仓库（官方同仓条目）。
	*  真正落盘由用户对预览确认后走现有 executeImportPlan（confirm:true 安全阀 + 回滚）。 */
	async download(itemId, repo) {
		return postJson$2(MARKET_API.download, {
			itemId,
			...repo !== void 0 && repo !== "" ? { repo } : {}
		}, this.t);
	}
	/** 发布向导：由「上传 zip + 用户填写元数据」生成市场条目包（L2 manifest + SHA-256 + sections），
	*  供 UI 展示/复制与引导推送。零写入配置（发布目录在受控临时区）；不含任何凭据字段。 */
	async prepare(payload) {
		return postJson$2(MARKET_API.prepare, payload, this.t);
	}
	/** 发布包下载 URL（受控临时区 zip；经宿主 /download 端点，无凭据、无写操作） */
	downloadPublishUrl(zipPath) {
		return `${MARKET_API.fileDownload}?path=${encodeURIComponent(zipPath)}`;
	}
};
//#endregion
//#region src/client/market/my-configs-api.ts
/** 「我的配置」端点常量（与 Host 半 API 常量保持一致） */
const MY_CONFIGS_API = {
	base: "/api/dsh-config-manager/me",
	status: "/api/dsh-config-manager/me/status",
	upload: "/api/dsh-config-manager/me/upload",
	items: "/api/dsh-config-manager/me/items",
	update: "/api/dsh-config-manager/me/update",
	listing: "/api/dsh-config-manager/me/listing",
	relist: "/api/dsh-config-manager/me/relist",
	delete: "/api/dsh-config-manager/me/delete"
};
/** 「我的配置」请求超时（ms）：上传/更新含 git clone/push/fork/PR，与 market/sync 对齐量级 */
const MY_CONFIGS_TIMEOUT_MS = 3e5;
/** 解析 JSON 响应；非 2xx 时抛出带路由 error 消息的 ConfigManagerApiError（与 api.ts 同款） */
async function readJson$1(response, t) {
	const notMountedMessage = t("error.notMounted");
	let body;
	try {
		body = await response.json();
	} catch {
		if (response.status === 404) throw new ConfigManagerApiError(notMountedMessage);
		throw new ConfigManagerApiError(t("error.httpInvalidJson", { status: String(response.status) }));
	}
	if (!response.ok) throw new ConfigManagerApiError(typeof body === "object" && body !== null && typeof body.error === "string" ? body.error : response.status === 404 ? notMountedMessage : `HTTP ${response.status}`);
	return body;
}
/** POST JSON 请求（带超时：宿主卡死时 UI 拿到明确错误而不是永远转圈） */
async function postJson$1(path, body, t) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), MY_CONFIGS_TIMEOUT_MS);
	try {
		return await readJson$1(await fetch(path, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
			signal: controller.signal
		}), t);
	} catch (err) {
		if (controller.signal.aborted) throw new ConfigManagerApiError(t("error.syncTimeout", { minutes: String(Math.round(MY_CONFIGS_TIMEOUT_MS / 6e4)) }));
		throw err;
	} finally {
		clearTimeout(timer);
	}
}
/**
* 「我的配置」浏览器半数据入口（MarketPanel 的「我的配置」子视图注入业务面）。
* 登录（GitHub device flow）不在此类 —— 复用 SyncApi.githubStart/githubPoll/githubCancel。
*/
var MyConfigsApi = class {
	t;
	constructor(t = zhUiT) {
		this.t = t;
	}
	/** 读取登录态 + 用户配置仓库状态（token 失效 → Host 返回 401/未登录，UI 引导重新登录） */
	async meStatus() {
		return postJson$1(MY_CONFIGS_API.status, {}, this.t);
	}
	/** 一键上传：校验 → 建/复用仓库 → 写入用户仓库 → fork → 改官方 index → 提收录 PR */
	async meUpload(payload) {
		return postJson$1(MY_CONFIGS_API.upload, payload, this.t);
	}
	/** 读取已上传条目列表（用户仓库 index.json；每条目含 Host 侧判定的收录状态） */
	async meItems() {
		return postJson$1(MY_CONFIGS_API.items, {}, this.t);
	}
	/** 一键更新：version 自动 +1，复用/重开收录 PR */
	async meUpdate(payload) {
		return postJson$1(MY_CONFIGS_API.update, payload, this.t);
	}
	/** 查询收录/下架任务状态（结果卡轮询；任务表未命中时 Host 回退 GitHub 实况推导；无任务无实况 → null） */
	async meListing(itemId) {
		return postJson$1(MY_CONFIGS_API.listing, { itemId }, this.t);
	}
	/** 重新提交收录（失败/重启丢失后重试；幂等复用已存在 fork/open PR） */
	async meRelist(itemId) {
		return postJson$1(MY_CONFIGS_API.relist, { itemId }, this.t);
	}
	/** 删除条目（同步删本地索引+文件；已收录自动后台提下架 PR；待审核自动关闭收录 PR） */
	async meDelete(itemId) {
		return postJson$1(MY_CONFIGS_API.delete, { itemId }, this.t);
	}
};
//#endregion
//#region src/client/market/market-locales.ts
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
const zh$2 = {
	"section.label": "配置市场",
	"section.description": "浏览并下载社区共享的配置（公开 Git 仓库；下载内容一律视为不可信，导入前必经校验与确认）",
	"config.title": "市场仓库",
	"config.refresh": "拉取最新",
	"config.refreshing": "拉取中…",
	"list.empty": "内置市场尚未加载。请先「拉取最新」。",
	"list.browse": "浏览",
	"list.loading": "正在读取市场…",
	"list.noItems": "该市场暂无条目。",
	"list.searchPlaceholder": "搜索名称 / 作者 / 描述…",
	"list.categoriesAll": "全部类别",
	"list.sectionsAll": "全部分区",
	"list.sectionsUnknown": "另有 {count} 个条目未下载，无法按分区匹配",
	"list.sourceAll": "全部来源",
	"list.sourceOfficial": "官方配置",
	"list.sourcePersonal": "个人配置",
	"list.sortDefault": "默认排序",
	"list.sortUpdated": "最新更新",
	"list.sortStars": "⭐ 最多",
	"list.sortName": "名称 A–Z",
	"list.stars": "⭐ {count}",
	"list.starsHint": "来源仓库 star 数（仓库级，非本条目）",
	"list.count": "共 {count} 个条目",
	"list.filtered": "（筛选后 {count} 个）",
	"list.cacheCached": "已缓存",
	"list.cacheFresh": "刚刚拉取",
	"list.cacheNone": "未缓存",
	"list.download": "查看详情",
	"detail.title": "条目详情",
	"detail.downloadedAt": "下载时间：{time}",
	"detail.version": "版本 {version}",
	"detail.errors": "校验错误：",
	"detail.emptySections": "该条目未包含任何可导入分区",
	"detail.needReview": "需要人工确认",
	"detail.previewHint": "以下为只读预览（不会改动任何设置）。确认导入将复用现有安全管道（快照 + 校验 + 失败回滚）。",
	"detail.impact.willChange": "将变更 {count} 项",
	"detail.impact.unchanged": "已一致 {count} 项",
	"detail.impact.conflicts": "冲突 {count}",
	"detail.impact.secrets": "需补录密钥 {count}",
	"detail.impact.paths": "路径映射 {count}",
	"detail.impact.restart": "需重启 DSH 生效",
	"detail.import": "确认导入",
	"detail.back": "返回列表",
	"detail.approval.title": "逐分区批准导入",
	"detail.approval.highRiskHint": "以下分区涉及安装插件 / 写入文件 / 注入全局指令 / 注册 MCP / 恢复会话，属高风险变更，默认不导入；如需导入请逐项勾选。",
	"detail.approval.requiresApproval": "需逐项批准",
	"detail.approval.safe": "可导入",
	"detail.approval.count": "已批准 {selected}/{total} 分区",
	"detail.noApproval": "未批准任何分区，无法导入",
	"myconfigs.tab.browse": "浏览市场",
	"myconfigs.tab.myconfigs": "我的配置",
	"myconfigs.back": "返回市场",
	"myconfigs.login.title": "GitHub 登录",
	"myconfigs.login.hint": "登录后即可一键上传配置到你的公开仓库（自动创建 <login>/dsh-configs）并提交官方市场收录（目标仓库固定，不可修改）。",
	"myconfigs.login.checking": "正在检查登录状态…",
	"myconfigs.login.loggedInAs": "已登录：{login}",
	"myconfigs.login.targetRepo": "收录目标（固定）：{repo}",
	"myconfigs.login.repoMissing": "配置仓库尚未创建，首次上传将自动创建（公开）",
	"myconfigs.login.repoReady": "配置仓库：{repo}",
	"myconfigs.login.start": "使用 GitHub 登录",
	"myconfigs.login.relogin": "重新登录",
	"myconfigs.login.cancel": "取消登录",
	"myconfigs.login.userCode": "一次性代码：{code}",
	"myconfigs.login.openAuth": "打开授权页",
	"myconfigs.upload.title": "一键上传",
	"myconfigs.upload.selectHint": "选择导出的配置 zip（先在「导出」tab 生成备份文件，再回到这里选择）。市场通道永不携带秘密——包含密钥的备份将被拒绝。",
	"myconfigs.upload.select": "选择 ZIP…",
	"myconfigs.upload.reselect": "重新选择",
	"myconfigs.upload.selected": "已选择：{name}",
	"myconfigs.upload.validate": "开始校验",
	"myconfigs.upload.validating": "校验中…",
	"myconfigs.upload.validateOk": "校验通过：内容合法、不含密钥",
	"myconfigs.upload.validateSecrets": "包含密钥：市场通道永不携带秘密，拒绝上传",
	"myconfigs.upload.validateInvalid": "内容校验未通过，无法上传",
	"myconfigs.upload.form.title": "条目信息",
	"myconfigs.upload.form.name": "名称",
	"myconfigs.upload.form.nameHint": "预填 zip 文件名，可修改",
	"myconfigs.upload.form.description": "描述（可选）",
	"myconfigs.upload.form.categories": "类别（可选，逗号分隔）",
	"myconfigs.upload.form.autoHint": "以下字段由系统自动生成：",
	"myconfigs.upload.mode.title": "发布模式",
	"myconfigs.upload.mode.migrate": "迁移（保留全部内容）",
	"myconfigs.upload.mode.share": "分享（自动排除敏感内容）",
	"myconfigs.upload.mode.shareHint": "分享模式将自动排除设备/平台相关分区（凭据状态 / 会话 / MCP / 工作区等），并对隐私内容强制拦截——发现任何敏感痕迹将拒绝发布，而不是仅警告。",
	"myconfigs.upload.run": "一键上传",
	"myconfigs.upload.running": "上传中…",
	"myconfigs.update.title": "更新配置",
	"myconfigs.update.hint": "版本将自动 +1，已预填原条目信息（名称可改）。",
	"myconfigs.update.run": "一键更新",
	"myconfigs.update.running": "更新中…",
	"myconfigs.update.zipHint": "更新需要新的配置包：选择新 zip 后自动校验，通过后即可一键更新。",
	"myconfigs.update.selectZip": "选择新 ZIP…",
	"myconfigs.result.title": "上传/更新完成",
	"myconfigs.result.version": "版本 {version}",
	"myconfigs.result.sha256": "SHA-256：{hash}",
	"myconfigs.result.sections": "分区：{sections}",
	"myconfigs.result.repo": "配置仓库",
	"myconfigs.result.openRepo": "打开仓库",
	"myconfigs.result.pr": "收录 PR #{number}",
	"myconfigs.result.openPr": "查看 PR",
	"myconfigs.result.listingPending": "已上传 ✓ 正在后台提交收录（fork + 收录 PR），稍后列表状态自动更新",
	"myconfigs.result.listingFailed": "收录失败",
	"myconfigs.result.relist": "重新提交收录",
	"myconfigs.list.title": "已上传",
	"myconfigs.list.empty": "尚未上传任何配置",
	"myconfigs.list.loading": "正在读取…",
	"myconfigs.list.refresh": "刷新",
	"myconfigs.list.summary": "共 {total} 条 · {listed} 已收录 · {pending} 待审核 · {none} 未收录",
	"myconfigs.list.openRepo": "打开仓库",
	"myconfigs.item.update": "更新",
	"myconfigs.item.install": "装回本地",
	"myconfigs.item.openPr": "查看收录 PR",
	"myconfigs.delete.run": "删除",
	"myconfigs.delete.confirm": "确认删除",
	"myconfigs.delete.confirmTitle": "删除条目",
	"myconfigs.delete.confirmText": "确认删除？该操作会从配置仓库永久删除该条目的索引与文件（不可恢复）",
	"myconfigs.delete.delistStarted": "已删除本地条目，并自动提交「下架 PR」（官方市场移除需人工合并，期间市场可能仍显示该条目）",
	"myconfigs.delete.prClosed": "已删除本地条目，并关闭该条目的待审核收录 PR",
	"disclaimer.title": "免责声明",
	"disclaimer.upload.text": "你即将把配置上传到你的公开仓库（<login>/dsh-configs）并提交官方市场收录申请。\n\n上传后内容将对所有人公开可见，且需经过人工审核才能进入官方市场。请确保：\n· 内容不包含任何真实密钥 / 凭据（环境变量引用如 $VAR 是安全的）；\n· 内容不包含个人隐私或本地环境信息；\n· 你有权分享这些配置。",
	"disclaimer.download.text": "你即将从公共网络市场下载配置并导入本地。\n\n下载内容属于不可信输入：未经官方审核、可能包含风险（安装插件 / 写入文件 / 修改设置）。\n· 导入前会逐项展示并校验，高风险分区默认不导入、需逐项批准；\n· 导入会先自动创建快照，失败可回滚；\n· 请核对来源与内容后再确认导入。",
	"disclaimer.install.text": "你即将把配置从你的公开仓库装回本地。\n\n该内容属于你此前上传的配置，但同样会经过安全校验与逐分区批准：\n· 高风险分区默认不导入、需逐项批准；\n· 导入前自动创建快照，失败可回滚。",
	"disclaimer.confirm": "我已了解，继续",
	"disclaimer.dontAsk": "不再提示（该操作以后不再显示免责声明）",
	"myconfigs.error.loadStatus": "登录状态读取失败",
	"myconfigs.error.loadItems": "已上传列表读取失败",
	"common.cancel": "取消",
	"common.close": "关闭",
	"common.retry": "重试",
	"common.loading": "加载中…",
	"common.unknownError": "未知错误"
};
const en$2 = {
	"section.label": "Config Marketplace",
	"section.description": "Browse and download community-shared configs (public Git repos; downloaded content is always untrusted — validated and confirmed before import)",
	"config.title": "Market Repository",
	"config.refresh": "Refresh",
	"config.refreshing": "Refreshing…",
	"list.empty": "The built-in market has not loaded yet. Click \"Refresh\" first.",
	"list.browse": "Browse",
	"list.loading": "Reading market…",
	"list.noItems": "This market has no items.",
	"list.searchPlaceholder": "Search name / author / description…",
	"list.categoriesAll": "All categories",
	"list.sectionsAll": "All sections",
	"list.sectionsUnknown": "{count} more item(s) not downloaded yet — cannot match by section",
	"list.sourceAll": "All sources",
	"list.sourceOfficial": "Official",
	"list.sourcePersonal": "Community",
	"list.sortDefault": "Default order",
	"list.sortUpdated": "Recently updated",
	"list.sortStars": "Most starred",
	"list.sortName": "Name A–Z",
	"list.stars": "⭐ {count}",
	"list.starsHint": "Stars of the source repo (repo-level, not per item)",
	"list.count": "{count} item(s)",
	"list.filtered": "({count} after filter)",
	"list.cacheCached": "cached",
	"list.cacheFresh": "just fetched",
	"list.cacheNone": "not cached",
	"list.download": "View details",
	"detail.title": "Item Details",
	"detail.downloadedAt": "Downloaded: {time}",
	"detail.version": "version {version}",
	"detail.errors": "Verification errors:",
	"detail.emptySections": "This item contains no importable sections",
	"detail.needReview": "Needs human confirmation",
	"detail.previewHint": "Read-only preview below (changes nothing). Confirming the import reuses the existing safe pipeline (snapshot + validation + rollback on failure).",
	"detail.impact.willChange": "{count} item(s) will change",
	"detail.impact.unchanged": "{count} identical",
	"detail.impact.conflicts": "{count} conflict(s)",
	"detail.impact.secrets": "{count} secret(s) to re-enter",
	"detail.impact.paths": "{count} path mapping(s)",
	"detail.impact.restart": "DSH restart required",
	"detail.import": "Confirm import",
	"detail.back": "Back to list",
	"detail.approval.title": "Approve sections to import",
	"detail.approval.highRiskHint": "These sections install plugins / write files / inject global instructions / register MCP / restore sessions — high-risk changes, not imported by default. Check each one to import it.",
	"detail.approval.requiresApproval": "Requires approval",
	"detail.approval.safe": "Importable",
	"detail.approval.count": "{selected}/{total} section(s) approved",
	"detail.noApproval": "No sections approved — cannot import",
	"myconfigs.tab.browse": "Browse Market",
	"myconfigs.tab.myconfigs": "My Configs",
	"myconfigs.back": "Back to market",
	"myconfigs.login.title": "GitHub sign-in",
	"myconfigs.login.hint": "After signing in you can upload configs to your public repo (auto-created as <login>/dsh-configs) and submit a listing PR to the official market (target repo is fixed and not editable).",
	"myconfigs.login.checking": "Checking sign-in status…",
	"myconfigs.login.loggedInAs": "Signed in as {login}",
	"myconfigs.login.targetRepo": "Listing target (fixed): {repo}",
	"myconfigs.login.repoMissing": "Config repo not created yet — it will be auto-created (public) on first upload",
	"myconfigs.login.repoReady": "Config repo: {repo}",
	"myconfigs.login.start": "Sign in with GitHub",
	"myconfigs.login.relogin": "Sign in again",
	"myconfigs.login.cancel": "Cancel sign-in",
	"myconfigs.login.userCode": "One-time code: {code}",
	"myconfigs.login.openAuth": "Open authorization page",
	"myconfigs.upload.title": "Upload",
	"myconfigs.upload.selectHint": "Pick an exported config zip (create a backup on the \"Export\" tab first, then pick it here). The market channel never carries secrets — backups containing secrets are rejected.",
	"myconfigs.upload.select": "Choose ZIP…",
	"myconfigs.upload.reselect": "Choose again",
	"myconfigs.upload.selected": "Selected: {name}",
	"myconfigs.upload.validate": "Run validation",
	"myconfigs.upload.validating": "Validating…",
	"myconfigs.upload.validateOk": "Validation passed: valid content, no secrets",
	"myconfigs.upload.validateSecrets": "Contains secrets: the market channel never carries secrets — upload rejected",
	"myconfigs.upload.validateInvalid": "Content validation failed — cannot upload",
	"myconfigs.upload.form.title": "Item info",
	"myconfigs.upload.form.name": "Name",
	"myconfigs.upload.form.nameHint": "Prefilled from the zip file name; editable",
	"myconfigs.upload.form.description": "Description (optional)",
	"myconfigs.upload.form.categories": "Categories (optional, comma-separated)",
	"myconfigs.upload.form.autoHint": "These fields are generated automatically:",
	"myconfigs.upload.mode.title": "Publish mode",
	"myconfigs.upload.mode.migrate": "Migrate (keep everything)",
	"myconfigs.upload.mode.share": "Share (auto-exclude sensitive content)",
	"myconfigs.upload.mode.shareHint": "Share mode auto-excludes device/platform-specific sections (credentials status / sessions / MCP / workspaces, etc.) and enforces privacy scanning — any sensitive trace blocks publishing instead of just warning.",
	"myconfigs.upload.run": "Upload",
	"myconfigs.upload.running": "Uploading…",
	"myconfigs.update.title": "Update config",
	"myconfigs.update.hint": "The version will be bumped automatically (+1); item info is prefilled (name editable).",
	"myconfigs.update.run": "Update",
	"myconfigs.update.running": "Updating…",
	"myconfigs.update.zipHint": "Updating needs a new config zip: pick one and it will be validated automatically, then you can update.",
	"myconfigs.update.selectZip": "Choose new ZIP…",
	"myconfigs.result.title": "Upload/update complete",
	"myconfigs.result.version": "version {version}",
	"myconfigs.result.sha256": "SHA-256: {hash}",
	"myconfigs.result.sections": "Sections: {sections}",
	"myconfigs.result.repo": "Config repo",
	"myconfigs.result.openRepo": "Open repo",
	"myconfigs.result.pr": "Listing PR #{number}",
	"myconfigs.result.openPr": "View PR",
	"myconfigs.result.listingPending": "Uploaded ✓ submitting listing in the background (fork + PR) — list status will update shortly",
	"myconfigs.result.listingFailed": "Listing failed",
	"myconfigs.result.relist": "Resubmit listing",
	"myconfigs.list.title": "Uploaded",
	"myconfigs.list.empty": "No configs uploaded yet",
	"myconfigs.list.loading": "Loading…",
	"myconfigs.list.refresh": "Refresh",
	"myconfigs.list.summary": "{total} item(s) · {listed} listed · {pending} pending · {none} not listed",
	"myconfigs.list.openRepo": "Open repo",
	"myconfigs.item.update": "Update",
	"myconfigs.item.install": "Install locally",
	"myconfigs.item.openPr": "View listing PR",
	"myconfigs.delete.run": "Delete",
	"myconfigs.delete.confirm": "Confirm delete",
	"myconfigs.delete.confirmTitle": "Delete item",
	"myconfigs.delete.confirmText": "Delete? This permanently removes the item index and files from your config repo (not recoverable)",
	"myconfigs.delete.delistStarted": "Local item deleted; a \"delist PR\" has been submitted (removal from the official market needs human merge; the item may still appear in the market meanwhile)",
	"myconfigs.delete.prClosed": "Local item deleted; its pending listing PR has been closed",
	"disclaimer.title": "Disclaimer",
	"disclaimer.upload.text": "You are about to upload configs to your public repo (<login>/dsh-configs) and submit a listing request to the official market.\n\nUploaded content becomes publicly visible and requires human review before entering the official market. Please ensure:\n· No real secrets / credentials are included (env-var references like $VAR are safe);\n· No personal privacy or local environment info is included;\n· You have the right to share these configs.",
	"disclaimer.download.text": "You are about to download configs from a public network market and import them locally.\n\nDownloaded content is untrusted input: not officially reviewed and may carry risks (installing plugins / writing files / changing settings).\n· Everything is validated and shown before import; high-risk sections are not imported by default and require individual approval;\n· A snapshot is auto-created before import and rollback is available on failure;\n· Please verify the source and content before confirming the import.",
	"disclaimer.install.text": "You are about to reinstall configs from your public repo to this machine.\n\nThis is content you uploaded before, but it still goes through the same validation and per-section approval:\n· High-risk sections are not imported by default and require individual approval;\n· A snapshot is auto-created before import and rollback is available on failure.",
	"disclaimer.confirm": "I understand, continue",
	"disclaimer.dontAsk": "Don't ask again (no more disclaimers for this action)",
	"myconfigs.error.loadStatus": "Failed to read sign-in status",
	"myconfigs.error.loadItems": "Failed to read uploaded items",
	"common.cancel": "Cancel",
	"common.close": "Close",
	"common.retry": "Retry",
	"common.loading": "Loading…",
	"common.unknownError": "Unknown error"
};
//#endregion
//#region src/client/recovery/recovery-api.ts
/** recovery 端点常量（与 Host 半 src/index.ts API.recovery 前缀保持一致）。 */
const RECOVERY_API = {
	base: "/api/dsh-config-manager/recovery",
	status: "/api/dsh-config-manager/recovery/status"
};
/** recovery 请求超时（ms）：与 Host 半 ROUTE_TIMEOUT_MS 对齐（restore/rollback 可能较慢）。 */
const RECOVERY_TIMEOUT_MS = 3e5;
/** 解析 JSON 响应；非 2xx 时抛出带路由 error 消息的 ConfigManagerApiError（与 api.ts 同款）。 */
async function readJson(response, t) {
	const notMountedMessage = t("error.notMounted");
	let body;
	try {
		body = await response.json();
	} catch {
		if (response.status === 404) throw new ConfigManagerApiError(notMountedMessage);
		throw new ConfigManagerApiError(t("error.httpInvalidJson", { status: String(response.status) }));
	}
	if (!response.ok) throw new ConfigManagerApiError(typeof body === "object" && body !== null && typeof body.error === "string" ? body.error : response.status === 404 ? notMountedMessage : `HTTP ${response.status}`);
	return body;
}
/** POST JSON 请求（带超时：宿主卡死时 UI 拿到明确错误而不是永远转圈）。 */
async function postJson(path, body, t) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), RECOVERY_TIMEOUT_MS);
	try {
		return await readJson(await fetch(path, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
			signal: controller.signal
		}), t);
	} catch (err) {
		if (controller.signal.aborted) throw new ConfigManagerApiError(t("error.recoveryTimeout", { minutes: String(Math.round(RECOVERY_TIMEOUT_MS / 6e4)) }));
		throw err;
	} finally {
		clearTimeout(timer);
	}
}
/** operationId 严格 UUID 校验（与 Host 侧 isValidOperationId 一致；防路径穿越）。 */
const OPERATION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function operationPath(operationId, action) {
	if (!OPERATION_ID_RE.test(operationId)) throw new ConfigManagerApiError("invalid operationId");
	return `${RECOVERY_API.base}/${operationId}/${action}`;
}
/** Recovery 浏览器半数据入口（实现 RecoveryPort 契约）。 */
var RecoveryApi = class {
	t;
	constructor(t = zhUiT) {
		this.t = t;
	}
	/** GET /recovery/status：列出未解决 operation + reconcile decision。 */
	async status() {
		return readJson(await fetch(RECOVERY_API.status), this.t);
	}
	/** GET /recovery/:operationId/preview：只读恢复预览（restore plan + verification plan）。 */
	async preview(operationId) {
		return readJson(await fetch(operationPath(operationId, "preview")), this.t);
	}
	/** POST /recovery/:operationId/confirm：确认恢复（journal 保持 NEEDS_ATTENTION）。 */
	async confirm(operationId, userConfirmed) {
		return postJson(operationPath(operationId, "confirm"), { userConfirmed }, this.t);
	}
	/** POST /recovery/:operationId/execute：执行恢复/回滚（NEEDS_ATTENTION → RECOVERING）。 */
	async execute(operationId, userConfirmed) {
		return postJson(operationPath(operationId, "execute"), { userConfirmed }, this.t);
	}
	/** POST /recovery/:operationId/verify：post-recovery verification（原子写 verification + terminal）。 */
	async verify(operationId) {
		return postJson(operationPath(operationId, "verify"), {}, this.t);
	}
	/** POST /recovery/:operationId/retry：验证失败后重跑 execute + verify。 */
	async retry(operationId, userConfirmed) {
		return postJson(operationPath(operationId, "retry"), { userConfirmed }, this.t);
	}
	/** POST /recovery/:operationId/dismiss：放弃恢复（quarantine，不销毁证据）。 */
	async dismiss(operationId, userConfirmed) {
		return postJson(operationPath(operationId, "dismiss"), { userConfirmed }, this.t);
	}
};
//#endregion
//#region src/client/recovery/recovery-locales.ts
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
const zh$1 = {
	"common.cancel": "取消",
	"common.retry": "重试",
	"common.unknownError": "未知错误",
	"view.recovery": "恢复",
	"recovery.banner": "配置修改已被保护：存在未完成的恢复事项。请先处理后继续。",
	"recovery.bannerAction": "去处理",
	"recovery.required": "需要恢复",
	"recovery.requiredHint": "检测到一次操作未正常完成，为安全起见已暂停所有会修改配置的操作。请处理以下恢复事项以恢复正常。",
	"recovery.rollbackRecommended": "建议回滚",
	"recovery.rollbackContinue": "续跑回滚",
	"recovery.inProgress": "恢复进行中",
	"recovery.verified": "已验证",
	"recovery.partialMatch": "部分匹配",
	"recovery.mismatch": "不匹配",
	"recovery.verificationError": "验证错误",
	"recovery.needsAttention": "需要人工处理",
	"recovery.manualActionRequired": "需要人工处理",
	"recovery.incident.title": "发生了什么",
	"recovery.incident.operationId": "操作 ID",
	"recovery.incident.operationType": "操作类型",
	"recovery.incident.createdAt": "发生时间",
	"recovery.incident.reason": "原因",
	"recovery.incident.decision": "建议",
	"recovery.incident.state": "状态",
	"recovery.incident.state.recovering": "恢复中",
	"recovery.incident.state.needsAttention": "需人工处理",
	"recovery.incident.state.rolledBack": "已回滚",
	"recovery.incident.state.recovered": "已恢复",
	"recovery.incident.state.committed": "已完成",
	"recovery.incident.state.unknown": "未知",
	"recovery.decision.unknown": "未知",
	"recovery.verify.verdict.unknown": "未知",
	"recovery.currentState.title": "当前状态",
	"recovery.currentState.safeMode": "已进入安全模式（会修改配置的操作已暂停）",
	"recovery.currentState.safeModeCleared": "已恢复正常，可继续操作",
	"recovery.currentState.hasSnapshot": "存在可信恢复快照",
	"recovery.currentState.noSnapshot": "无可信恢复快照",
	"recovery.snapshot.title": "恢复快照",
	"recovery.snapshot.id": "快照 ID",
	"recovery.snapshot.createdAt": "快照时间",
	"recovery.snapshot.operationType": "快照操作",
	"recovery.snapshot.verdict": "快照校验",
	"recovery.snapshot.verdict.trusted": "可信（与本次操作绑定）",
	"recovery.snapshot.verdict.manual": "手动/本地快照（本次操作外）",
	"recovery.snapshot.verdict.legacy": "旧快照（需显式确认）",
	"recovery.snapshot.verdict.wrongEnv": "环境不匹配",
	"recovery.snapshot.verdict.corrupt": "损坏",
	"recovery.snapshot.verdict.invalid": "非法",
	"recovery.snapshot.verdict.unsafe": "路径不安全",
	"recovery.snapshot.verdict.unknown": "未知",
	"recovery.environment.title": "环境",
	"recovery.environment.compatible": "环境匹配",
	"recovery.environment.incompatible": "环境不匹配（可能来自其他机器/安装）",
	"recovery.preview.title": "恢复预览",
	"recovery.preview.hint": "以下为只读预览（零写入）。确认后才会执行恢复。",
	"recovery.preview.loading": "正在生成预览…",
	"recovery.preview.empty": "该操作无可用恢复动作（或全部跳过）。",
	"recovery.preview.action": "动作",
	"recovery.preview.detail": "说明",
	"recovery.preview.summary": "将执行 {count} 个动作",
	"recovery.confirm.title": "确认恢复",
	"recovery.confirm.message": "恢复/回滚是危险操作。确认执行？系统会先把当前文件备份到一个安全位置。",
	"recovery.confirm.rollbackContinue": "继续完成刚才中断的撤销（已完成的部分会自动跳过，不重复执行）。",
	"recovery.confirm.retry": "验证失败后重试恢复。确认再次执行？",
	"recovery.confirm.dismiss": "放弃恢复？该操作会被隔离保存，相关快照与操作记录会保留，但不会自动恢复。",
	"recovery.confirm.dismissTitle": "放弃恢复",
	"recovery.execute": "执行恢复",
	"recovery.executing": "恢复执行中…",
	"recovery.retry": "重试",
	"recovery.retrying": "重试中…",
	"recovery.verify": "验证",
	"recovery.verifying": "验证中…",
	"recovery.dismiss": "放弃恢复",
	"recovery.dismissing": "放弃中…",
	"recovery.continue": "续跑",
	"recovery.verify.title": "验证结果",
	"recovery.verify.details": "检查明细",
	"recovery.verify.manualHints": "需人工处理",
	"recovery.verify.verdict.match": "验证通过：目标状态与可信快照匹配",
	"recovery.verify.verdict.partial": "验证通过（部分匹配）：核心状态匹配，但存在无法自动验证的项",
	"recovery.verify.verdict.mismatch": "验证失败：目标状态与可信快照不匹配，恢复未完成",
	"recovery.verify.verdict.error": "验证错误：无法可靠完成验证，恢复未完成",
	"recovery.verify.terminal.rolledBack": "已回滚",
	"recovery.verify.terminal.recovered": "已恢复",
	"recovery.verify.terminal.needsAttention": "需要人工处理",
	"recovery.completed": "恢复完成",
	"recovery.completed.rolledBack": "已回滚并验证通过",
	"recovery.completed.recovered": "已恢复并验证通过",
	"recovery.needsAttention.title": "需要人工处理",
	"recovery.needsAttention.hint": "恢复未能完成或验证失败。请查看原因，可重试或放弃。",
	"recovery.empty": "暂无需要处理的恢复事项。",
	"recovery.loading": "正在检查恢复状态…",
	"recovery.error": "恢复状态加载失败",
	"recovery.actionError": "操作失败",
	"recovery.running": "恢复任务进行中",
	"recovery.runningHint": "恢复/回滚正在执行，请勿关闭页面。"
};
const en$1 = {
	"common.cancel": "Cancel",
	"common.retry": "Retry",
	"common.unknownError": "Unknown error",
	"view.recovery": "Recovery",
	"recovery.banner": "Configuration changes are protected: there is an unfinished recovery item. Resolve it before continuing.",
	"recovery.bannerAction": "Go to recovery",
	"recovery.required": "Recovery Required",
	"recovery.requiredHint": "An operation did not complete normally. To stay safe, all config-modifying operations are paused. Handle the recovery item(s) below to restore normal operation.",
	"recovery.rollbackRecommended": "Rollback recommended",
	"recovery.rollbackContinue": "Continue rollback",
	"recovery.inProgress": "Recovery in progress",
	"recovery.verified": "Verified",
	"recovery.partialMatch": "Partial match",
	"recovery.mismatch": "Mismatch",
	"recovery.verificationError": "Verification error",
	"recovery.needsAttention": "Needs attention",
	"recovery.manualActionRequired": "Manual action required",
	"recovery.incident.title": "What happened",
	"recovery.incident.operationId": "Operation ID",
	"recovery.incident.operationType": "Operation type",
	"recovery.incident.createdAt": "Occurred at",
	"recovery.incident.reason": "Reason",
	"recovery.incident.decision": "Recommendation",
	"recovery.incident.state": "State",
	"recovery.incident.state.recovering": "Recovering",
	"recovery.incident.state.needsAttention": "Manual action needed",
	"recovery.incident.state.rolledBack": "Rolled back",
	"recovery.incident.state.recovered": "Recovered",
	"recovery.incident.state.committed": "Completed",
	"recovery.incident.state.unknown": "Unknown",
	"recovery.decision.unknown": "Unknown",
	"recovery.verify.verdict.unknown": "Unknown",
	"recovery.currentState.title": "Current state",
	"recovery.currentState.safeMode": "Safe mode active (config-modifying operations paused)",
	"recovery.currentState.safeModeCleared": "Restored to normal — you can continue",
	"recovery.currentState.hasSnapshot": "Trusted recovery snapshot available",
	"recovery.currentState.noSnapshot": "No trusted recovery snapshot",
	"recovery.snapshot.title": "Recovery snapshot",
	"recovery.snapshot.id": "Snapshot ID",
	"recovery.snapshot.createdAt": "Snapshot time",
	"recovery.snapshot.operationType": "Snapshot operation",
	"recovery.snapshot.verdict": "Snapshot validation",
	"recovery.snapshot.verdict.trusted": "Trusted (bound to this operation)",
	"recovery.snapshot.verdict.manual": "Manual / local (outside this operation)",
	"recovery.snapshot.verdict.legacy": "Legacy snapshot (explicit confirmation required)",
	"recovery.snapshot.verdict.wrongEnv": "Environment mismatch",
	"recovery.snapshot.verdict.corrupt": "Corrupt",
	"recovery.snapshot.verdict.invalid": "Invalid",
	"recovery.snapshot.verdict.unsafe": "Unsafe path",
	"recovery.snapshot.verdict.unknown": "Unknown",
	"recovery.environment.title": "Environment",
	"recovery.environment.compatible": "Environment matches",
	"recovery.environment.incompatible": "Environment mismatch (may be from another machine / install)",
	"recovery.preview.title": "Recovery preview",
	"recovery.preview.hint": "Read-only preview below (zero writes). Recovery only runs after confirmation.",
	"recovery.preview.loading": "Generating preview…",
	"recovery.preview.empty": "No restorable actions for this operation (or all skipped).",
	"recovery.preview.action": "Action",
	"recovery.preview.detail": "Detail",
	"recovery.preview.summary": "Will execute {count} action(s)",
	"recovery.confirm.title": "Confirm recovery",
	"recovery.confirm.message": "Recovery / rollback is a dangerous operation. Confirm execution? Current files are backed up to a safe location first.",
	"recovery.confirm.rollbackContinue": "Continue the interrupted rollback (already-completed parts are skipped and not redone).",
	"recovery.confirm.retry": "Retry recovery after verification failure. Confirm running it again?",
	"recovery.confirm.dismiss": "Abandon recovery? The operation will be set aside (quarantined), and the related snapshot and operation records are kept, but it will not be auto-recovered.",
	"recovery.confirm.dismissTitle": "Abandon recovery",
	"recovery.execute": "Execute recovery",
	"recovery.executing": "Recovering…",
	"recovery.retry": "Retry",
	"recovery.retrying": "Retrying…",
	"recovery.verify": "Verify",
	"recovery.verifying": "Verifying…",
	"recovery.dismiss": "Abandon recovery",
	"recovery.dismissing": "Abandoning…",
	"recovery.continue": "Continue",
	"recovery.verify.title": "Verification result",
	"recovery.verify.details": "Check details",
	"recovery.verify.manualHints": "Manual action needed",
	"recovery.verify.verdict.match": "Verified: target state matches the trusted snapshot",
	"recovery.verify.verdict.partial": "Verified (partial match): core state matches, but some items could not be auto-verified",
	"recovery.verify.verdict.mismatch": "Verification failed: target state does not match the trusted snapshot; recovery incomplete",
	"recovery.verify.verdict.error": "Verification error: could not reliably complete verification; recovery incomplete",
	"recovery.verify.terminal.rolledBack": "Rolled back",
	"recovery.verify.terminal.recovered": "Recovered",
	"recovery.verify.terminal.needsAttention": "Needs attention",
	"recovery.completed": "Recovery complete",
	"recovery.completed.rolledBack": "Rolled back and verified",
	"recovery.completed.recovered": "Recovered and verified",
	"recovery.needsAttention.title": "Needs attention",
	"recovery.needsAttention.hint": "Recovery could not complete or verification failed. Review the reason, then retry or abandon.",
	"recovery.empty": "No recovery items to handle.",
	"recovery.loading": "Checking recovery status…",
	"recovery.error": "Failed to load recovery status",
	"recovery.actionError": "Operation failed",
	"recovery.running": "Recovery task in progress",
	"recovery.runningHint": "Recovery / rollback is running; keep this page open."
};
//#endregion
//#region src/client/history/history-locales.ts
const zh = {
	"view.history": "迁移历史",
	"history.title": "迁移与审计历史",
	"history.subtitle": "统一记录全部破坏性/迁移操作（导入/恢复/回滚/档案/同步/定时备份/快照操作），只可追加、不可修改或删除，跨重启持久，可查询可导出。",
	"history.empty": "暂无迁移记录。执行导入、恢复、档案切换、同步应用或定时备份后，这里会出现审计记录。",
	"history.loading": "加载迁移历史…",
	"history.corruptedBanner": "检测到无法读取/可能被篡改的历史条目",
	"history.corruptedCount": "{count} 条已被跳过（不计入导出）",
	"history.stats.total": "总数",
	"history.stats.success": "成功",
	"history.stats.failed": "失败",
	"history.stats.skipped": "跳过",
	"history.filter.kind": "操作类型",
	"history.filter.result": "结果",
	"history.filter.recent": "时间范围",
	"history.filter.recent.all": "全部",
	"history.filter.recent.50": "最近 50 条",
	"history.filter.recent.200": "最近 200 条",
	"history.filter.sections": "涉及分区",
	"history.filter.title": "筛选与导出",
	"history.search.placeholder": "搜索摘要 / 错误 / 分区…",
	"history.export.json": "导出 JSON",
	"history.export.markdown": "导出 Markdown",
	"history.exported": "已导出",
	"history.exporting": "导出中…",
	"history.exportError": "导出失败",
	"history.loadError": "加载迁移历史失败",
	"history.reload": "重新加载",
	"history.table.time": "时间",
	"history.table.kind": "操作",
	"history.table.result": "结果",
	"history.table.sections": "涉及分区",
	"history.table.summary": "摘要",
	"history.updatedAt": "更新于",
	"history.refresh": "刷新",
	"history.kind.import": "导入",
	"history.kind.restore": "快照恢复",
	"history.kind.rollback": "回滚",
	"history.kind.profile-switch": "档案切换",
	"history.kind.profile-delete": "档案删除",
	"history.kind.profile-rename": "档案重命名",
	"history.kind.profile-save": "档案保存",
	"history.kind.profile-import": "档案导入",
	"history.kind.sync-apply": "一键同步应用",
	"history.kind.autosync": "自动同步",
	"history.kind.recovery": "恢复/回滚编排",
	"history.kind.backup": "定时备份",
	"history.kind.snapshot-delete": "快照删除",
	"history.kind.snapshot-prune": "快照保留清理",
	"history.result.success": "成功",
	"history.result.failed": "失败",
	"history.result.skipped": "跳过"
};
const en = {
	"view.history": "Migration History",
	"history.title": "Migration & Audit History",
	"history.subtitle": "Unified append-only audit trail of all destructive/migration operations (import/restore/rollback/profile/sync/backup/snapshot), durable across restarts, queryable and exportable.",
	"history.empty": "No migration records yet. Executing an import, restore, profile switch, sync apply, or scheduled backup will create audit entries here.",
	"history.loading": "Loading migration history…",
	"history.corruptedBanner": "Detected unreadable or possibly tampered history entries",
	"history.corruptedCount": "{count} entry(s) were skipped (excluded from export)",
	"history.stats.total": "Total",
	"history.stats.success": "Success",
	"history.stats.failed": "Failed",
	"history.stats.skipped": "Skipped",
	"history.filter.kind": "Operation",
	"history.filter.result": "Result",
	"history.filter.recent": "Time range",
	"history.filter.recent.all": "All",
	"history.filter.recent.50": "Latest 50",
	"history.filter.recent.200": "Latest 200",
	"history.filter.sections": "Sections",
	"history.filter.title": "Filter & export",
	"history.search.placeholder": "Search summary / error / section…",
	"history.export.json": "Export JSON",
	"history.export.markdown": "Export Markdown",
	"history.exported": "Exported",
	"history.exporting": "Exporting…",
	"history.exportError": "Export failed",
	"history.loadError": "Failed to load migration history",
	"history.reload": "Reload",
	"history.table.time": "Time",
	"history.table.kind": "Operation",
	"history.table.result": "Result",
	"history.table.sections": "Sections",
	"history.table.summary": "Summary",
	"history.updatedAt": "Updated",
	"history.refresh": "Refresh",
	"history.kind.import": "Import",
	"history.kind.restore": "Snapshot restore",
	"history.kind.rollback": "Rollback",
	"history.kind.profile-switch": "Profile switch",
	"history.kind.profile-delete": "Profile delete",
	"history.kind.profile-rename": "Profile rename",
	"history.kind.profile-save": "Profile save",
	"history.kind.profile-import": "Profile import",
	"history.kind.sync-apply": "Sync apply",
	"history.kind.autosync": "Autosync",
	"history.kind.recovery": "Recovery/rollback",
	"history.kind.backup": "Scheduled backup",
	"history.kind.snapshot-delete": "Snapshot delete",
	"history.kind.snapshot-prune": "Snapshot retention",
	"history.result.success": "Success",
	"history.result.failed": "Failed",
	"history.result.skipped": "Skipped"
};
//#endregion
//#region src/client/index.ts
/** 本插件拥有的 locale namespace。 */
const NS = "config-manager";
/** 远程同步设置区块的独立 locale namespace（独立字典文件，不与共享 locales.ts 冲突）。 */
const SYNC_NS = "config-manager-sync";
/** 配置市场区块的独立 locale namespace（m-market-ui）。 */
const MARKET_NS = "config-manager-market";
/** Recovery 区块的独立 locale namespace（Phase 5）。 */
const RECOVERY_NS = "config-manager-recovery";
/** Migration History 区块的独立 locale namespace（Phase 6）。 */
const HISTORY_NS = "config-manager-history";
/** 必需服务（fiber inject 等待 —— slots/locale 必须先就绪）。 */
const inject = ["slots", "locale"];
/**
* 注册 Config Manager 设置页。
* @param ctx - client root context（slots + locale 服务）。
*/
function apply(ctx) {
	ctx.effect(() => ctx.locale.register(NS, {
		zh: zh$4,
		en: en$4
	}), "config-manager: dictionaries");
	ctx.effect(() => ctx.locale.register(SYNC_NS, {
		zh: zh$3,
		en: en$3
	}), "config-manager: sync dictionaries");
	ctx.effect(() => ctx.locale.register(MARKET_NS, {
		zh: zh$2,
		en: en$2
	}), "config-manager: market dictionaries");
	ctx.effect(() => ctx.locale.register(RECOVERY_NS, {
		zh: zh$1,
		en: en$1
	}), "config-manager: recovery dictionaries");
	ctx.effect(() => ctx.locale.register(HISTORY_NS, {
		zh,
		en
	}), "config-manager: history dictionaries");
	const t = ctx.locale.bind(NS);
	const uiT = makeUiT(ctx.locale.getLocale().active === "en" ? "en" : "zh");
	const api = new ConfigManagerApi(uiT);
	const syncT = ctx.locale.bind(SYNC_NS);
	const syncApi = new SyncApi(uiT);
	const marketT = ctx.locale.bind(MARKET_NS);
	const marketApi = new MarketApi(uiT);
	const myConfigsApi = new MyConfigsApi(uiT);
	const recoveryT = ctx.locale.bind(RECOVERY_NS);
	const recoveryApi = new RecoveryApi(uiT);
	const historyT = ctx.locale.bind(HISTORY_NS);
	const historyApi = new HistoryApi(uiT);
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "config-manager",
		order: 60,
		label: () => t("section.label"),
		locale: NS,
		inject: () => ({
			api,
			syncApi,
			syncT,
			marketApi,
			marketT,
			myConfigsApi,
			recoveryApi,
			recoveryT,
			historyApi,
			historyT
		})
	}, ConfigManagerSection));
}
//#endregion
exports.apply = apply;
exports.inject = inject;


		return module.exports;
	}
});
//# sourceMappingURL=client.js.map