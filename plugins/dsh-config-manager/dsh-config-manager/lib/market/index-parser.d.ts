import type { ParseIndexResult, ParseItemManifestResult } from './types.ts';
/**
 * 解析市场目录 index.json（L1）。未知字段/越界字段一律进 errors（拒绝，不忽略）。
 * 深度保护 + 字段白名单 + schemaVersion===1 + items 每项 id 过 SAFE_ITEM_ID_RE。
 */
export declare function parseMarketIndex(raw: string): ParseIndexResult;
/**
 * 解析单条目清单 items/<id>/manifest.json（L2）。
 * 未知字段/越界字段一律进 errors；id 必须过 SAFE_ITEM_ID_RE；
 * sections 每项必须 ∈ SECTION_IDS；checksums.zip 必须为非空字符串。
 */
export declare function parseMarketItemManifest(raw: string): ParseItemManifestResult;
