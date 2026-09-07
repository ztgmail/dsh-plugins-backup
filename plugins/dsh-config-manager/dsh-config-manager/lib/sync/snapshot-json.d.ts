import type { SyncSnapshot } from './transport.ts';
/** sections 整体 JSON 化（加密密文载荷原样透传）。 */
export declare function sectionsToJsonSafe(sections: SyncSnapshot['sections']): SyncSnapshot['sections'];
/** sections 从 JSON 还原（加密密文载荷原样透传）。 */
export declare function sectionsFromJsonSafe(sections: unknown): SyncSnapshot['sections'];
/** 整份快照序列化为 JSON 字符串（本地不落盘，仅用于传输/加密载荷）。 */
export declare function serializeSnapshot(snapshot: SyncSnapshot): string;
/** 从 JSON 字符串还原快照（形状非法抛错；调用方负责包装成通道错误）。 */
export declare function deserializeSnapshot(raw: string): SyncSnapshot;
