export interface ZipEntryMeta {
    name: string;
    method: number;
    compressedSize: number;
    uncompressedSize: number;
    crc32: number;
    isDirectory: boolean;
    /** 本地文件头在 ZIP 字节流中的偏移 */
    localOffset: number;
}
export interface ZipSafetyLimits {
    maxEntries?: number;
    maxTotalBytes?: number;
    maxCompressedBytes?: number;
    maxSingleBytes?: number;
    maxRatio?: number;
}
export declare const DEFAULT_ZIP_SAFETY_LIMITS: Required<ZipSafetyLimits>;
export declare class ZipSafetyError extends Error {
    constructor(message: string);
}
export declare function crc32(data: Uint8Array): number;
export interface ZipWriteEntry {
    name: string;
    data: Uint8Array;
}
/** 组装 ZIP 字节（全部条目 method=8 deflate，UTF-8 文件名，含中央目录与 EOCD） */
export declare function zipToBuffer(entries: ZipWriteEntry[]): Uint8Array;
/** 写出 ZIP 文件（原子写，避免半写 zip） */
export declare function writeZip(zipPath: string, entries: ZipWriteEntry[]): Promise<void>;
/** 内存 ZIP 归档：构造时校验全部条目名与上限；读取时逐条解压 + CRC/尺寸/比预算校验 */
export declare class ZipArchive {
    private readonly buf;
    private readonly metas;
    readonly limits: Required<ZipSafetyLimits>;
    private totalUncompressed;
    constructor(buf: Uint8Array, metas: ZipEntryMeta[], limits: Required<ZipSafetyLimits>);
    names(): string[];
    entries(): ZipEntryMeta[];
    has(name: string): boolean;
    /** 读取并解压单条目（带 CRC32 / 尺寸 / 体积预算 / 压缩比校验） */
    readEntry(name: string): Uint8Array;
    readEntryText(name: string): string;
    /** 读取并深度保护解析 JSON 条目 */
    readEntryJson(name: string): unknown;
}
/** 解析 ZIP（含安全校验：条目名 / 条目数 / 压缩体积） */
export declare function parseZip(buf: Uint8Array, limits?: ZipSafetyLimits): ZipArchive;
/**
 * 安全解压到受控目录（对齐设计 §13.4 safeExtract 签名）。
 * 返回条目相对路径列表；任何越界/损坏即整体拒绝（不部分落盘）。
 * m4 的 zip-security 可替换/强化本实现。
 */
export declare function safeExtract(zipPath: string, destDir: string, limits?: ZipSafetyLimits): Promise<string[]>;
