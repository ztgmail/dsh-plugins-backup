/** 同步层所需的文件系统操作最小集（路径均为宿主文件系统绝对路径） */
export interface SnapshotFs {
    readFile(p: string): Promise<Uint8Array>;
    writeFile(p: string, data: Uint8Array): Promise<void>;
    /** 递归创建目录（已存在则成功） */
    mkdir(p: string): Promise<void>;
    /** 直接子项名字（含目录名）；目录不存在 → [] */
    readdir(p: string): Promise<string[]>;
    isDir(p: string): Promise<boolean>;
    exists(p: string): Promise<boolean>;
    /** 递归删除（不存在则成功） */
    remove(p: string): Promise<void>;
}
/** 目录 + 正斜杠相对路径 → 宿主路径（正斜杠连接，Windows 下 Node fs 同样接受；
 * 两侧多余斜杠一律清除，避免产生 '//' 段与空路径段） */
export declare function joinFs(dir: string, rel: string): string;
/** 默认 node:fs/promises 适配器 */
export declare function createSnapshotFs(): SnapshotFs;
