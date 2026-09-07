/**
 * JSON 深度保护：解析/序列化/克隆带嵌套深度上限（防 JSON 深度攻击，规范 §19.5）。
 * 解析分两段：JSON.parse 可能因引擎栈限制抛 RangeError（捕获并归一），
 * 再对结果做显式栈 walk 检查深度（避免 walk 自身递归爆栈）。
 */
export declare const DEFAULT_MAX_JSON_DEPTH = 64;
export declare const DEFAULT_MAX_JSON_BYTES: number;
export declare class JsonDepthError extends Error {
    constructor(message?: string);
}
/** 测量对象/数组的嵌套深度（迭代式显式栈，不会递归爆栈；二进制视为叶子） */
export declare function measureDepth(value: unknown): number;
/** 深度保护解析：超限抛 JsonDepthError，非法 JSON 抛 SyntaxError */
export declare function parseJsonSafe(text: string, opts?: {
    maxDepth?: number;
    maxBytes?: number;
}): unknown;
/** 深度保护序列化：先测深度再 stringify（默认不缩进） */
export declare function stringifyJsonSafe(value: unknown, opts?: {
    maxDepth?: number;
    space?: number;
}): string;
/** 深度保护深拷贝（迭代式，安全） */
export declare function deepClone<T>(value: T, maxDepth?: number): T;
