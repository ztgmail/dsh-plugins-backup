/**
 * 结构化日志（规范 §24）：LEVEL / 消息 / 可选元数据，带 redact 钩子。
 * Secret 值永不入日志：sink 前对 msg 做文本级掩码、对 meta 做字段名级掩码。
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
/** 敏感字段名黑名单（大小写不敏感；命中即掩码值，规范 §6 清单） */
export declare const SENSITIVE_FIELD_BLACKLIST: string[];
/** 字段名是否命中敏感黑名单（大小写不敏感，子串匹配） */
export declare function isSensitiveField(field: string): boolean;
/** 对象级掩码：字段名命中黑名单 → 值替换（返回新对象，不改原对象） */
export declare function redactValue(value: unknown, blacklist?: string[]): unknown;
/** 文本级掩码：JSON 片段 `"field": "value"`、`field=value`、`field: value` 形态 */
export declare function redact(text: string, blacklist?: string[]): string;
export interface LogMeta {
    [key: string]: unknown;
}
export interface LogSink {
    (level: LogLevel, message: string, meta?: LogMeta): void;
}
export interface Logger {
    level: LogLevel;
    debug(message: string, meta?: LogMeta): void;
    info(message: string, meta?: LogMeta): void;
    warn(message: string, meta?: LogMeta): void;
    error(message: string, meta?: LogMeta): void;
}
export interface LoggerOptions {
    level?: LogLevel;
    /** 输出目标；缺省写 console（单行 JSON）。测试可注入内存 sink。 */
    sink?: LogSink;
    /** 额外敏感字段黑名单 */
    extraBlacklist?: string[];
    /** 是否带时间戳前缀 */
    timestamp?: boolean;
}
/** 创建结构化日志器（默认 console JSON 行，全部输出过 redact） */
export declare function createLogger(opts?: LoggerOptions): Logger;
/** 静默日志器（测试用） */
export declare function nullLogger(): Logger;
