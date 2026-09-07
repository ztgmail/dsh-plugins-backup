/** 校验 Profile 名输入（与 host/ProfileManager 同规则：拒绝路径穿越/非法字符；空提示）。 */
export function validateProfileNameInput(name) {
    const trimmed = name.trim();
    if (trimmed === '')
        return 'name is required';
    if (trimmed.length > 64)
        return 'name must be ≤ 64 characters';
    if (trimmed === '.' || trimmed === '..')
        return 'illegal name';
    if (trimmed.includes('/') || trimmed.includes('\\') || trimmed.includes('\0'))
        return 'illegal characters';
    if (trimmed.includes('..'))
        return 'illegal characters';
    return null;
}
export function summarizeSwitchPreview(preview) {
    const items = preview.items;
    const count = (kinds) => items.filter((i) => kinds.includes(i.kind)).length;
    return {
        willChange: count(['Create', 'Update', 'Install', 'Conflict']),
        unchanged: count(['Skip']),
        conflicts: count(['Conflict']),
        secretsNeeded: preview.missingSecrets.length,
        needsRestart: preview.needsRestart,
        sectionsInProfile: preview.sectionsInProfile,
    };
}
/** 切换结果 → 语义 kind（ok / failed / rolledBack；与同步 applyItemsReportView 语义一致）。 */
export function profileSwitchKind(result) {
    if (result === null)
        return 'ok';
    if (!result.ok && result.rollback !== null)
        return 'rolledBack';
    if (!result.ok)
        return 'failed';
    return 'ok';
}
//# sourceMappingURL=profiles-view.js.map