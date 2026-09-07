import { type UiT } from './i18n.ts';
/** 可操作错误（UI 渲染为 Reason / Suggested action 两段） */
export interface ActionableError {
    title: string;
    reason: string;
    suggestedAction?: string;
    /** 相关项（如 MCP 服务器名 / 插件包名）；可空 */
    item?: string;
    /** 是否可重试（true 显示重试按钮） */
    retryable: boolean;
}
/** 将任意错误转换为可操作错误（消息已脱敏，不泄漏 Secret） */
export declare function toActionableError(err: unknown, opts?: {
    item?: string;
    fallbackTitle?: string;
    t?: UiT;
}): ActionableError;
/** 格式化为用户可读的多行文本（Reason / Suggested action） */
export declare function formatActionableError(e: ActionableError, t?: UiT): string;
