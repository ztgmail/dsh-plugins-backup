/**
 * 版本更新内容弹窗（ReleaseNotesDialog）的自动触发判定逻辑（框架无关纯函数，node 可测）。
 *
 * 触发规则：
 *  - 用户点过「永不提示」（dismissed === true）→ 永久不再自动弹出；
 *  - 首次进入或检测到插件版本更新（lastSeenVersion === undefined 或 lastSeenVersion !== currentVersion）→ 自动弹窗；
 *  - 当前版本已展示/确认过（lastSeenVersion === currentVersion）→ 不再自动弹出。
 *
 * 本模块只做「判定」，不碰存储/网络/React：
 *  - 持久化（ui-prefs.json）见 src/sync/ui-prefs.ts；
 *  - 组件装配（何时调用、如何展示）见 src/client/ConfigManagerSection.tsx。
 */
/** 版本更新内容弹窗的持久化状态（来自 ui-prefs.json；全部可选）。 */
export interface ReleaseNotesPromptState {
    /** 上次已记录/已向用户展示过的插件版本号（如 '0.1.54'）；undefined = 尚未记录过任何版本 */
    lastSeenVersion?: string;
    /** 用户点过「永不提示」（永久不再自动弹出） */
    dismissed?: boolean;
}
/** 判定结果。 */
export interface ReleaseNotesPromptEvaluation {
    /** 本次进入页面是否自动弹出更新内容弹窗 */
    shouldShow: boolean;
}
/**
 * 判定本次进入页面是否自动弹出更新内容弹窗。
 * @param state 持久化状态（undefined 字段 = 未配置）
 * @param currentVersion 当前运行的插件版本（如 '0.1.54'）
 */
export declare function evaluateReleaseNotesPrompt(state: ReleaseNotesPromptState, currentVersion: string): ReleaseNotesPromptEvaluation;
