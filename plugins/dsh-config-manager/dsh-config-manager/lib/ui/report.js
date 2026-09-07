import { zhUiT } from "./i18n.js";
/* ---------------- §21 导出报告 ---------------- */
export function renderExportReport(report, t = zhUiT) {
    const lines = [t('report.backupCreated'), ''];
    lines.push(t('report.included'));
    for (const { section, counts } of report.included) {
        const detail = Object.entries(counts)
            .map(([k, v]) => `${v} ${k}`)
            .join(', ');
        lines.push(`  ✓ ${section}${detail !== '' ? ` (${detail})` : ''}`);
    }
    lines.push('');
    if (report.excluded.length > 0) {
        lines.push(t('report.excluded'));
        for (const s of report.excluded)
            lines.push(`  ○ ${s}`);
        lines.push('');
    }
    lines.push(t('report.security'));
    lines.push(`  ✓ ${t('report.apiKeysExcluded')} ${report.security.secretsExcluded ? t('report.yes') : t('report.no')}`);
    lines.push(`  ✓ ${t('report.containsSecrets')} ${report.security.containsSecrets ? t('report.yesEncrypted') : t('report.no')}`);
    lines.push(`  ✓ ${t('report.encrypted')} ${report.security.encrypted ? t('report.yes') : t('report.no')}`);
    if (report.security.redactedHits > 0)
        lines.push(`  ⚠ ${t('report.redacted', { count: String(report.security.redactedHits) })}`);
    lines.push('');
    lines.push(`${t('report.file')} ${report.file.name} (${formatBytes(report.file.sizeBytes)})`);
    for (const w of report.warnings)
        lines.push(`  ⚠ ${w}`);
    return lines.join('\n');
}
/* ---------------- §22 导入报告 ---------------- */
/** 从 itemId 前缀推断所属分区（与 adapters id 规则对齐；未知归 'other'） */
export function sectionFromItemId(itemId) {
    if (itemId.startsWith('settings:'))
        return 'settings';
    if (itemId.startsWith('ui:'))
        return 'ui';
    if (itemId.startsWith('provider:'))
        return 'providers';
    if (itemId.startsWith('plugin:') || itemId.startsWith('patch:'))
        return 'plugins';
    if (itemId.startsWith('mcp:'))
        return 'mcp';
    if (itemId.startsWith('prompt:'))
        return 'prompts';
    if (itemId.startsWith('workspace:'))
        return 'workspaces';
    if (itemId.startsWith('secret:'))
        return 'credentialsStatus';
    if (itemId.startsWith('skills:'))
        return 'skills';
    if (itemId.startsWith('agentPresets:'))
        return 'agentPresets';
    if (itemId.startsWith('agentInstructions:'))
        return 'agentInstructions';
    if (itemId.startsWith('pluginFiles:'))
        return 'pluginFiles';
    if (itemId.startsWith('sessions:'))
        return 'sessions';
    return 'other';
}
/** 按分区聚合执行结果（统计 + 明细） */
export function importSectionStats(executed) {
    const bySection = new Map();
    for (const e of executed) {
        const section = sectionFromItemId(e.itemId);
        let stat = bySection.get(section);
        if (!stat) {
            stat = { section: section, ok: 0, skipped: 0, warned: 0, failed: 0, items: [] };
            bySection.set(section, stat);
        }
        if (e.status === 'ok')
            stat.ok += 1;
        else if (e.status === 'skipped')
            stat.skipped += 1;
        else if (e.status === 'warning')
            stat.warned += 1;
        else
            stat.failed += 1;
        stat.items.push(e);
    }
    return [...bySection.values()];
}
/** 导入报告渲染（含回滚状态；§22 动作按钮由 suggestedActions 给出） */
export function renderImportReport(result, t = zhUiT) {
    const lines = [result.ok ? t('report.importComplete') : t('report.importFailed'), ''];
    // F4：被删除墓碑过滤的条目提示（用户明确删过、不复活）
    if ((result.skippedTombstoned?.length ?? 0) > 0) {
        lines.push(t('report.tombstonedSkipped', { count: String(result.skippedTombstoned.length) }));
        lines.push('');
    }
    const stats = importSectionStats(result.executed);
    for (const s of stats) {
        const parts = [];
        if (s.ok > 0)
            parts.push(`✓ ${s.ok} ${t('report.importedRestored')}`);
        if (s.skipped > 0)
            parts.push(`- ${s.skipped} ${t('report.skipped')}`);
        if (s.warned > 0)
            parts.push(`⚠ ${s.warned} ${t('report.needAttention')}`);
        if (s.failed > 0)
            parts.push(`✗ ${s.failed} ${t('report.failed')}`);
        lines.push(`${s.section}: ${parts.join(' ') || t('report.noChanges')}`);
        // 失败/警告项给出可操作原因（§23）
        for (const it of s.items) {
            if (it.status === 'failed' || it.status === 'warning') {
                lines.push(`  ${it.status === 'failed' ? t('report.reason') : t('report.note')}: ${it.message ?? t('report.unknownReason')}`);
            }
        }
    }
    if (result.missingSecrets.length > 0) {
        lines.push(`${t('report.secrets')} ⚠ ${t('report.credentialsNeedEntry', { count: String(result.missingSecrets.length) })}`);
    }
    if (result.needsRestart) {
        lines.push(t('report.restartPluginsMcp'));
    }
    for (const w of result.warnings)
        lines.push(`⚠ ${w}`);
    if (result.rollback) {
        lines.push('');
        lines.push(renderRollbackReport(result.rollback, t));
    }
    return lines.join('\n');
}
/** 结果页动作按钮（§22）。报告已内联展示全部失败/警告项的原因与回滚详情（§23），
 * 不再提供空操作的 Fix Issues / View Details 按钮——仅保留「完成」。 */
export function suggestedActions(_result) {
    return ['done'];
}
/* ---------------- §17 回滚报告 ---------------- */
/** 回滚报告渲染（full / partial + 人工恢复清单） */
export function renderRollbackReport(rr, t = zhUiT) {
    if (rr.full) {
        return t('report.rollbackFull');
    }
    const lines = [t('report.rollbackPartial')];
    lines.push(t('report.rollbackManual'));
    for (const f of rr.failed) {
        lines.push(`  - ${f.item}: ${f.reason}${f.manualHint ? ` (${f.manualHint})` : ''}`);
    }
    if (rr.restored.length > 0)
        lines.push(t('report.restored', { count: String(rr.restored.length) }));
    return lines.join('\n');
}
/* ---------------- 工具 ---------------- */
export function formatBytes(n) {
    if (n < 1024)
        return `${n} B`;
    if (n < 1024 * 1024)
        return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
//# sourceMappingURL=report.js.map