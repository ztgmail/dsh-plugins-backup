/** 文件句柄最小面（node fs/promises FileHandle 的子集） */
export interface AtomicHandle {
    writeFile(data: Uint8Array): Promise<void>;
    sync(): Promise<void>;
    close(): Promise<void>;
}
/** 可注入异步文件系统门面（默认实现包 node:fs/promises；测试注入失败点） */
export interface AtomicIo {
    mkdir(dir: string, opts: {
        recursive: boolean;
    }): Promise<void>;
    /** 目标不存在返回 null */
    lstat(p: string): Promise<{
        isSymbolicLink(): boolean;
    } | null>;
    /** 目标不存在返回 null */
    stat(p: string): Promise<{
        mode: number;
    } | null>;
    realpath(p: string): Promise<string>;
    open(p: string, flags: string, mode?: number): Promise<AtomicHandle>;
    rename(src: string, dst: string): Promise<void>;
    unlink(p: string): Promise<void>;
    copyFile(src: string, dst: string, mode?: number): Promise<void>;
    chmod(p: string, mode: number): Promise<void>;
    /** 父目录 fsync（POSIX strong durability）；Windows/不支持时静默 no-op */
    fsyncDir(p: string): Promise<void>;
    /** 重试退避（可注入便于测试） */
    sleep(ms: number): Promise<void>;
}
/** 同步版注入面（atomicWriteFileSync 用；仅 plugin-cli 等同步路径） */
export interface AtomicIoSync {
    mkdir(dir: string, opts: {
        recursive: boolean;
    }): void;
    lstat(p: string): {
        isSymbolicLink(): boolean;
        mode: number;
    } | null;
    realpath(p: string): string;
    open(p: string, flags: string, mode?: number): number;
    writeFd(fd: number, buf: Uint8Array): void;
    fsyncFd(fd: number): void;
    closeFd(fd: number): void;
    rename(src: string, dst: string): void;
    unlink(p: string): void;
    /** 目录 fsync（POSIX）；Windows/不支持时 no-op */
    fsyncDir(p: string): void;
}
export type SymlinkPolicy = 'follow' | 'reject';
export interface AtomicWriteOptions {
    /** 新文件权限；sensitive 调用显式 0o600 */
    mode?: number;
    /** 默认 true：目标存在则继承其 mode */
    preserveMode?: boolean;
    /** Windows / 目标被占用瞬时错误重试次数（默认 3） */
    retries?: number;
    /** 重试退避基数 ms（默认 25，翻倍递增：25→50→100） */
    retryDelayMs?: number;
    /** POSIX 是否 fsync 父目录（默认 true；Windows 自动跳过） */
    fsyncDir?: boolean;
    /** symlink 策略：默认 'follow'；sensitive 调用传 'reject' */
    symlink?: SymlinkPolicy;
    /** 测试注入的异步 io */
    io?: AtomicIo;
    /** tmp 清理失败回调（调用方接线日志，满足「清理失败留痕」要求） */
    onCleanupFailure?: (tmp: string, err: unknown) => void;
}
export interface AtomicWriteSyncOptions extends Omit<AtomicWriteOptions, 'io'> {
    syncIo?: AtomicIoSync;
}
/**
 * tmp 名中 base 片段清洗：拒绝含 路径分隔符 / .. / 反斜杠 / 控制字符 / Windows 非法字符 的
 * 目标 basename，防止恶意 base 把 tmp 引出目标目录。返回安全 base。
 */
export declare function sanitizeTmpBase(base: string): string;
/**
 * 原子写文件：同目录唯一 tmp → 写完整内容 → fsync(tmp) → rename(tmp, target)。
 * 失败时不改写原 target（目标要么旧完整、要么新完整）。
 */
export declare function atomicWriteFile(target: string, data: string | Uint8Array, rawOpts?: AtomicWriteOptions): Promise<void>;
/**
 * 原子拷贝：copyFile(src→tmp) + fsync(tmp) + rename(tmp, dst)。
 * 不整文件读内存（大 snapshot/session 避免双内存）。失败不改写 dst。
 */
export declare function atomicCopyFile(src: string, dst: string, rawOpts?: AtomicWriteOptions): Promise<void>;
/** 同步版原子写（plugin-cli 等同步路径）。语义与 atomicWriteFile 一致。 */
export declare function atomicWriteFileSync(target: string, data: string | Uint8Array, rawOpts?: AtomicWriteSyncOptions): void;
