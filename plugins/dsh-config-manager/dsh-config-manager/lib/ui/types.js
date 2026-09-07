/** Custom Export 分组目录（规范 §1；automation 组 DSH 无对应分区，仅说明） */
export const EXPORT_GROUPS = [
    { id: 'general', label: 'General' },
    { id: 'ai', label: 'AI' },
    { id: 'extensions', label: 'Extensions' },
    { id: 'mcp', label: 'MCP / Tools' },
    { id: 'customization', label: 'Customization' },
    { id: 'automation', label: 'Automation', note: 'DSH 当前无 Workflows / Commands 配置文件（运行时注册），无迁移内容' },
    { id: 'workspace', label: 'Workspace' },
    { id: 'ui', label: 'UI' },
    { id: 'optional', label: 'Optional Data' },
];
/** Quick Export 推荐项 = defaultIncluded 且非 deviceSpecific（设计 §11.1） */
export function isQuickRecommended(c) {
    return c.defaultIncluded && c.portability !== 'deviceSpecific';
}
/** 选项构造辅助：从 PlanItem 提取稳定决策键（与 core analyzer.applyItemResolution 的 id 语义一致） */
export function itemDecisionKey(item) {
    return item.id;
}
//# sourceMappingURL=types.js.map