export declare function sha256Hex(data: Uint8Array | string): string;
export declare function hashFile(filePath: string): Promise<string>;
/** 生成一组 ZIP 相对路径 → SHA-256 的校验表（路径必须为 ZIP 内正斜杠相对路径） */
export declare function buildChecksums(entries: {
    name: string;
    data: Uint8Array;
}[]): Record<string, string>;
export interface ChecksumVerifyResult {
    ok: boolean;
    mismatches: string[];
    missing: string[];
}
/**
 * 校验：checksums 表内每个相对路径必须在 entries 中存在且 SHA-256 一致。
 * entries 中多余的文件（如 manifest.json / checksums.json 自身）不参与校验。
 */
export declare function verifyChecksums(entries: ReadonlyMap<string, Uint8Array>, checksums: Record<string, string>): ChecksumVerifyResult;
