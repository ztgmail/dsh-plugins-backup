/** 可选的间隔档位（UI 展示顺序 = 由短到长）。 */
export const BACKUP_INTERVAL_OPTIONS = ['6h', '12h', '24h', '7d', 'custom'];
/** 每周星期选项（0-6 → 展示文案由 locale 提供；本层只给值域） */
export const WEEKDAY_OPTIONS = [
    { value: 0, label: 'sunday' },
    { value: 1, label: 'monday' },
    { value: 2, label: 'tuesday' },
    { value: 3, label: 'wednesday' },
    { value: 4, label: 'thursday' },
    { value: 5, label: 'friday' },
    { value: 6, label: 'saturday' },
];
/** 校验设置输入（host 侧保存路由与组件提交共用；接受 unknown 防御畸形/空 body）。 */
export function validateBackupScheduleDraft(draft) {
    if (draft === null || typeof draft !== 'object' || Array.isArray(draft)) {
        return { ok: false, error: 'body must be an object with enabled (boolean) and interval' };
    }
    const d = draft;
    if (typeof d['enabled'] !== 'boolean') {
        return { ok: false, error: 'enabled must be a boolean' };
    }
    if (!BACKUP_INTERVAL_OPTIONS.includes(d['interval'])) {
        return { ok: false, error: 'interval must be one of 6h/12h/24h/7d/custom' };
    }
    const interval = d['interval'];
    const value = { enabled: d['enabled'], interval };
    if (interval === 'custom') {
        const weekly = typeof d['customSchedule'] === 'object' && d['customSchedule'] !== null && !Array.isArray(d['customSchedule'])
            ? d['customSchedule']
            : undefined;
        const dayOfWeek = weekly?.['dayOfWeek'];
        const hour = weekly?.['hour'];
        const minute = weekly?.['minute'];
        if (!Number.isInteger(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 6
            || !Number.isInteger(hour) || hour < 0 || hour > 23
            || !Number.isInteger(minute) || minute < 0 || minute > 59) {
            return { ok: false, error: 'customSchedule must include dayOfWeek (0-6), hour (0-23), minute (0-59)' };
        }
        value.customSchedule = { dayOfWeek: dayOfWeek, hour: hour, minute: minute };
    }
    return { ok: true, value };
}
/** 上次运行状态 → Badge kind（success→ok / skipped→info / failed→error / 未知→info）。 */
export function backupRunBadgeKind(status) {
    switch (status) {
        case 'success': return 'ok';
        case 'failed': return 'error';
        case 'skipped': return 'info';
        default: return 'info';
    }
}
/** 判断草稿相对已保存配置是否有未保存修改（决定「保存设置」按钮可用性）。 */
export function backupDraftDirty(draft, saved) {
    if (saved === null)
        return true;
    if (draft.enabled !== saved.enabled || draft.interval !== saved.interval)
        return true;
    if (draft.interval === 'custom') {
        const a = draft.customSchedule;
        const b = saved.customSchedule;
        if (a === undefined || b === undefined)
            return a !== b;
        return a.dayOfWeek !== b.dayOfWeek || a.hour !== b.hour || a.minute !== b.minute;
    }
    return false;
}
/** 立即备份结果摘要（供 UI 展示；不含 secret）。 */
export function backupRunSummary(run) {
    return {
        status: run.status,
        zip: run.zip ?? null,
        sizeBytes: run.sizeBytes ?? null,
        skipReason: run.skipReason ?? null,
        error: run.error ?? null,
    };
}
//# sourceMappingURL=backup-schedule.js.map