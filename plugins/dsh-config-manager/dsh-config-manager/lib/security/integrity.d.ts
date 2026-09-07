import type { ChecksumVerifyResult } from '../utils/hashing.ts';
export declare const CHECKSUMS_ALGORITHM: "sha256";
export declare const SHA256_HEX_RE: RegExp;
/** 与 core ZIP 条目数上限一致的默认表大小上限 */
export declare const DEFAULT_MAX_CHECKSUM_ENTRIES = 10000;
export interface ChecksumsTableOptions {
    maxEntries?: number;
}
/**
 * 生成 checksums 表（对齐 core 扁平格式；内部复用 core buildChecksums）。
 * entries.name 必须是 ZIP 内正斜杠相对路径。
 */
export declare function buildChecksums(entries: {
    name: string;
    data: Uint8Array;
}[]): Record<string, string>;
/**
 * 解析并结构校验 checksums.json 原文。
 * 非法结构 / 危险键 / 值非 SHA-256 hex / 条目数超限 → 抛错（不可信输入，宁可拒绝）。
 */
export declare function parseChecksumsTable(raw: string, opts?: ChecksumsTableOptions): Record<string, string>;
/**
 * 校验：表内每个路径必须在 entries 中存在且 SHA-256 一致；entries 多余文件（manifest/自身）不参与。
 * 返回 { ok, mismatches, missing }（缺失与不符统一列入 mismatches 的展开视图，mismatches 只含不符）。
 */
export declare function verifyChecksums(entries: ReadonlyMap<string, Uint8Array>, table: Record<string, string>): ChecksumVerifyResult;
/** 一步到位：解析 checksums.json 原文并校验（解析失败抛错；不符返回 {ok:false,...}） */
export declare function verifyChecksumsJson(entries: ReadonlyMap<string, Uint8Array>, raw: string, opts?: ChecksumsTableOptions): ChecksumVerifyResult;
/** 人类可读的不匹配摘要（给「Backup integrity check failed」错误消息用） */
export declare function describeMismatches(result: ChecksumVerifyResult): string;
