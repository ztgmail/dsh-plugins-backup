import { zhUiT } from "./i18n.js";
/** 导出阶段文案（规范 §29 Export 示例） */
export const EXPORT_STAGES = [
    'analyzing', // Analyzing configuration...
    'exporting-settings', // Exporting settings...
    'scanning-secrets', // Scanning secrets...
    'exporting-plugins', // Exporting plugins...
    'creating-archive', // Creating archive...
    'calculating-checksums', // Calculating checksums...
    'done',
];
/** 导入阶段文案（规范 §29 Import 示例 + 快照/回滚阶段） */
export const IMPORT_STAGES = [
    'validating', // Validating backup...
    'checking-compatibility', // Checking compatibility...
    'creating-snapshot', // Creating safety snapshot...
    'restoring-settings', // Restoring settings...
    'restoring-plugins', // Restoring plugins...
    'restoring-mcp', // Restoring MCP...
    'validating-config', // Validating configuration...
    'rolling-back', // Rolling back...（仅失败回滚时）
    'done',
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
export const EXECUTING_STAGE = 'executing';
const STAGE_KEYS = {
    analyzing: 'progress.analyzing',
    'exporting-settings': 'progress.exportingSettings',
    'scanning-secrets': 'progress.scanningSecrets',
    'exporting-plugins': 'progress.exportingPlugins',
    'creating-archive': 'progress.creatingArchive',
    'calculating-checksums': 'progress.calculatingChecksums',
    exporting: 'progress.exporting',
    validating: 'progress.validating',
    'checking-compatibility': 'progress.checkingCompatibility',
    'creating-snapshot': 'progress.creatingSnapshot',
    'restoring-settings': 'progress.restoringSettings',
    'restoring-plugins': 'progress.restoringPlugins',
    'restoring-mcp': 'progress.restoringMcp',
    'validating-config': 'progress.validatingConfig',
    'rolling-back': 'progress.rollingBack',
    executing: 'progress.executing',
    done: 'progress.done',
};
/** 阶段 id → 用户可读文案（未知阶段回退 id） */
export function stageText(stage, t = zhUiT) {
    const key = STAGE_KEYS[stage];
    return key !== undefined ? t(key) : stage;
}
/**
 * 进度追踪器：按给定阶段序列在回调时附带 step/total 序号。
 * 控制器调用 core 前后 emit()，UI 侧渲染进度条/阶段文字。
 */
export class ProgressTracker {
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
            step: idx >= 0 ? idx + 1 : undefined,
            total: idx >= 0 ? this.stages.length : undefined,
        };
        this.emitted.push(stage);
        this.listener?.(event);
    }
    /** 已发出阶段的快照（测试与日志用） */
    get events() {
        return [...this.emitted];
    }
}
//# sourceMappingURL=progress.js.map