/**
 * 原子写 / 原子拷贝 primitive（Phase 1：单文件一致性层）。
 *
 * 目标：任何关键配置写入，目标文件在任意时刻要么是「旧完整版」、要么是「新完整版」，
 * 绝无「半个新文件」。实现：同目录唯一 tmp → 写 + fsync → rename(tmp, target)。
 *
 * 设计要点（见 ATOMIC_WRITE_DESIGN.md v3 + ATOMIC_WRITE_DESIGN_REVIEW.md）：
 *   - 无 `.bak` 多步 fallback（Phase 1 `atomicity > forced success`）：目标被占用时
 *     有界重试后**不改写原 target、返回明确错误**；绝不暂时移走 target。
 *   - sensitive 调用先 `open('wx', 0o600)` 再写（禁 default→write→chmod）。
 *   - symlink 默认 follow（realpath 写真实目标，保留用户符号链接结构）；sensitive 用 'reject'。
 *   - tmp 名清洗（sanitizeTmpBase）+ 强制同目录，防恶意 base 路径逃逸。
 *   - Atomicity / Durability 分离：本层保证 process-crash atomicity；POSIX 额外 fsync 父目录
 *     提供 strong power-loss durability；Windows 目录 fsync 不可用（自动跳过）——不宣称绝对保证。
 *   - 通过可注入 `AtomicIo` 支持故障注入测试（不 monkey-patch 全局 fs）。
 *
 * 零 DSH 依赖（仅 node:fs / node:path / node:crypto），CLI 离线引擎可复用。
 */
import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
// ---------- 常量 ----------
/** 目录 fsync 在 Windows 不被 Node 支持：打开目录会抛错 → 平台跳过 */
const WINDOWS = process.platform === 'win32';
/** 新文件默认 mode（open 时叠加进程 umask） */
const DEFAULT_FILE_MODE = 0o666;
/** tmp 名前缀（专属，用于 orphan 识别，不误删其他程序文件） */
const TMP_PREFIX = '.dshcm.';
/** 异步 io 默认实现 */
const defaultIo = {
    async mkdir(d, o) { await fs.mkdir(d, o); },
    async lstat(p) {
        try {
            return await fs.lstat(p);
        }
        catch (e) {
            if (isENOENT(e))
                return null;
            throw e;
        }
    },
    async stat(p) {
        try {
            return await fs.stat(p);
        }
        catch (e) {
            if (isENOENT(e))
                return null;
            throw e;
        }
    },
    async realpath(p) { return fs.realpath(p); },
    async open(p, f, m) { return fs.open(p, f, m); },
    async rename(a, b) { return fs.rename(a, b); },
    async unlink(p) { return fs.unlink(p); },
    async copyFile(a, b) { return fs.copyFile(a, b); },
    async chmod(p, mode) { return fs.chmod(p, mode); },
    async fsyncDir(p) { await fsyncDirAsync(p); },
    async sleep(ms) { await new Promise((r) => setTimeout(r, ms)); },
};
/** 同步 io 默认实现 */
const defaultSyncIo = {
    mkdir(d, o) { fssync.mkdirSync(d, o); },
    lstat(p) {
        try {
            return fssync.lstatSync(p);
        }
        catch (e) {
            if (isENOENT(e))
                return null;
            throw e;
        }
    },
    realpath(p) { return fssync.realpathSync(p); },
    open(p, f, m) { return fssync.openSync(p, f, m); },
    writeFd(fd, buf) { fssync.writeSync(fd, buf, 0, buf.byteLength, 0); },
    fsyncFd(fd) { fssync.fsyncSync(fd); },
    closeFd(fd) { fssync.closeSync(fd); },
    rename(a, b) { fssync.renameSync(a, b); },
    unlink(p) { fssync.unlinkSync(p); },
    fsyncDir(p) { fsyncDirSyncSafe(p); },
};
/** POSIX：fs.open(dir,'r') + sync（Windows 不可用 → 静默跳过） */
async function fsyncDirAsync(p) {
    if (WINDOWS)
        return;
    let h = null;
    try {
        h = await fs.open(p, 'r');
        await h.sync();
    }
    catch {
        // 目录 fsync 是 best-effort：某些平台/文件系统不支持，忽略（不抛致命）
    }
    finally {
        if (h)
            try {
                await h.close();
            }
            catch { /* ignore */ }
    }
}
function fsyncDirSyncSafe(p) {
    if (WINDOWS)
        return;
    let fd = null;
    try {
        fd = fssync.openSync(p, 'r');
        fssync.fsyncSync(fd);
    }
    catch {
        // best-effort
    }
    finally {
        if (fd !== null)
            try {
                fssync.closeSync(fd);
            }
            catch { /* ignore */ }
    }
}
function isENOENT(e) {
    return typeof e === 'object' && e !== null && e.code === 'ENOENT';
}
function isRetryableLockCode(code) {
    return code === 'EPERM' || code === 'EBUSY' || code === 'EACCES' || code === 'EEXIST' || code === 'ENOTEMPTY';
}
function randomHex(nBytes) {
    return crypto.randomBytes(nBytes).toString('hex');
}
/** 错误上下文（透传原始 code，便于上层识别占用/权限等） */
function withContext(e, target, op) {
    const err = e instanceof Error ? e : new Error(String(e));
    err.atomicTarget = target;
    err.atomicOp = op;
    return err;
}
/**
 * tmp 名中 base 片段清洗：拒绝含 路径分隔符 / .. / 反斜杠 / 控制字符 / Windows 非法字符 的
 * 目标 basename，防止恶意 base 把 tmp 引出目标目录。返回安全 base。
 */
export function sanitizeTmpBase(base) {
    if (base === '' || base === '.' || base === '..')
        throw new Error(`原子写：非法目标文件名「${base}」`);
    if (/[\\/:*?"<>|]/.test(base))
        throw new Error(`原子写：目标文件名含非法字符「${base}」`);
    for (let i = 0; i < base.length; i++) {
        const c = base.charCodeAt(i);
        if (c < 0x20 || c === 0x7f)
            throw new Error(`原子写：目标文件名含控制字符「${base}」`);
    }
    return base;
}
/** 解析最终写入目标：symlink 'follow' → realpath；'reject' → 拒绝 */
async function resolveTarget(i, target, symlink) {
    const l = await i.lstat(target);
    if (l && l.isSymbolicLink()) {
        if (symlink === 'reject') {
            throw new Error(`原子写：目标为符号链接且策略为 reject，拒绝写入「${target}」`);
        }
        // follow：解析真实路径写真实文件（保留用户符号链接结构）
        return i.realpath(target);
    }
    return target;
}
async function resolveModeAsync(i, existing, opts) {
    if (opts.mode !== undefined)
        return opts.mode;
    if (opts.preserveMode !== false && existing)
        return existing.mode;
    return DEFAULT_FILE_MODE;
}
function tmpPath(dir, base) {
    return path.join(dir, `${TMP_PREFIX}${base}.${process.pid}.${randomHex(8)}.tmp`);
}
async function cleanupTmp(i, tmp, opts) {
    try {
        await i.unlink(tmp);
    }
    catch (e) {
        opts.onCleanupFailure?.(tmp, e);
    }
}
/** 有界重试 rename：瞬时占用（杀软/句柄）退避重试；仍失败不改写 target，尽力清理 tmp，抛错。
 *  绝不 rm(target) 或移走 target。 */
async function renameWithRetry(i, tmp, target, rc, cleanupOnFail) {
    let delay = rc.retryDelayMs;
    for (let attempt = 0;; attempt++) {
        try {
            await i.rename(tmp, target);
            return;
        }
        catch (e) {
            const code = e.code;
            if (isRetryableLockCode(code) && attempt < rc.retries) {
                await i.sleep(delay);
                delay *= 2;
                continue;
            }
            if (cleanupOnFail)
                await cleanupOnFail();
            throw withContext(e, target, 'rename');
        }
    }
}
/**
 * 原子写文件：同目录唯一 tmp → 写完整内容 → fsync(tmp) → rename(tmp, target)。
 * 失败时不改写原 target（目标要么旧完整、要么新完整）。
 */
export async function atomicWriteFile(target, data, rawOpts = {}) {
    const opts = {
        retries: rawOpts.retries ?? 3,
        retryDelayMs: rawOpts.retryDelayMs ?? 25,
        fsyncDir: rawOpts.fsyncDir ?? true,
        preserveMode: rawOpts.preserveMode ?? true,
        symlink: rawOpts.symlink ?? 'follow',
        ...rawOpts,
    };
    const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
    const i = opts.io ?? defaultIo;
    const dst = await resolveTarget(i, target, opts.symlink);
    const dir = path.dirname(dst);
    const safeBase = sanitizeTmpBase(path.basename(dst));
    await i.mkdir(dir, { recursive: true });
    // —— 1. tmp 完整落盘 + fsync（失败点：mkdir/write/sync） —
    const existing = await i.stat(dst); // 跟随 symlink 已 resolve；存在则继承 mode
    const mode = await resolveModeAsync(i, existing, opts);
    const tmp = tmpPath(dir, safeBase);
    let handle = null;
    try {
        handle = await i.open(tmp, 'wx', mode); // 独占创建，先定权限再写（sensitive 传 0o600）
        await handle.writeFile(bytes);
        await handle.sync();
        await handle.close();
        handle = null;
    }
    catch (e) {
        if (handle)
            try {
                await handle.close();
            }
            catch { /* ignore */ }
        await cleanupTmp(i, tmp, opts);
        throw withContext(e, dst, 'atomicWriteFile');
    }
    // —— 2. rename（失败点：rename；不改写原 target；失败尽力清理 tmp） —
    await renameWithRetry(i, tmp, dst, { retries: opts.retries, retryDelayMs: opts.retryDelayMs }, () => cleanupTmp(i, tmp, opts));
    // —— 3. 父目录 fsync（POSIX strong durability；Windows 跳过；失败不致命） —
    if (opts.fsyncDir && !WINDOWS) {
        try {
            await i.fsyncDir(dir);
        }
        catch { /* best-effort */ }
    }
}
/**
 * 原子拷贝：copyFile(src→tmp) + fsync(tmp) + rename(tmp, dst)。
 * 不整文件读内存（大 snapshot/session 避免双内存）。失败不改写 dst。
 */
export async function atomicCopyFile(src, dst, rawOpts = {}) {
    const opts = { retries: 3, retryDelayMs: 25, fsyncDir: true, preserveMode: true, symlink: 'follow', ...rawOpts };
    const i = opts.io ?? defaultIo;
    const resolved = await resolveTarget(i, dst, opts.symlink);
    const dir = path.dirname(resolved);
    const safeBase = sanitizeTmpBase(path.basename(resolved));
    await i.mkdir(dir, { recursive: true });
    const srcStat = await i.stat(src);
    const dstStat = await i.stat(resolved);
    let mode = opts.mode;
    if (mode === undefined) {
        // 存在→继承 dst mode；否则继承 src mode；否则默认
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        mode = dstStat ? dstStat.mode : (srcStat ? srcStat.mode : DEFAULT_FILE_MODE);
    }
    const tmp = tmpPath(dir, safeBase);
    try {
        // node fs.copyFile 的第三参是 COPYFILE_* 标志位，不是权限位 → 先 copy 再 chmod 设置权限
        await i.copyFile(src, tmp);
        if (mode !== undefined)
            await i.chmod(tmp, mode);
        // 用 'a'（append）打开后 fsync：'r' 只读句柄在 Windows 上 fsync 报 EPERM
        const h = await i.open(tmp, 'a');
        try {
            await h.sync();
        }
        finally {
            await h.close();
        }
    }
    catch (e) {
        await cleanupTmp(i, tmp, opts);
        throw withContext(e, resolved, 'atomicCopyFile');
    }
    await renameWithRetry(i, tmp, resolved, { retries: opts.retries, retryDelayMs: opts.retryDelayMs }, () => cleanupTmp(i, tmp, opts));
    if (opts.fsyncDir && !WINDOWS) {
        try {
            await i.fsyncDir(dir);
        }
        catch { /* best-effort */ }
    }
}
/** 同步版原子写（plugin-cli 等同步路径）。语义与 atomicWriteFile 一致。 */
export function atomicWriteFileSync(target, data, rawOpts = {}) {
    const opts = {
        retries: rawOpts.retries ?? 3,
        retryDelayMs: rawOpts.retryDelayMs ?? 25,
        fsyncDir: rawOpts.fsyncDir ?? true,
        preserveMode: rawOpts.preserveMode ?? true,
        symlink: rawOpts.symlink ?? 'follow',
        ...rawOpts,
    };
    const i = opts.syncIo ?? defaultSyncIo;
    const resolveTargetSync = () => {
        const l = i.lstat(target);
        if (l && l.isSymbolicLink()) {
            if (opts.symlink === 'reject')
                throw new Error(`原子写（同步）：目标为符号链接且策略为 reject，拒绝写入「${target}」`);
            return i.realpath(target);
        }
        return target;
    };
    const dst = resolveTargetSync();
    const dir = path.dirname(dst);
    const safeBase = sanitizeTmpBase(path.basename(dst));
    i.mkdir(dir, { recursive: true });
    const existing = statSyncSafe(i.lstat(dst));
    let mode = opts.mode;
    if (mode === undefined) {
        if (opts.preserveMode !== false && existing !== null)
            mode = existing;
        else
            mode = DEFAULT_FILE_MODE;
    }
    const tmp = tmpPath(dir, safeBase);
    let fd = null;
    try {
        fd = i.open(tmp, 'wx', mode);
        i.writeFd(fd, typeof data === 'string' ? new TextEncoder().encode(data) : data);
        i.fsyncFd(fd);
        i.closeFd(fd);
        fd = null;
    }
    catch (e) {
        if (fd !== null)
            try {
                i.closeFd(fd);
            }
            catch { /* ignore */ }
        try {
            i.unlink(tmp);
        }
        catch {
            rawOpts.onCleanupFailure?.(tmp, e);
        }
        throw withContext(e, dst, 'atomicWriteFileSync');
    }
    let delay = opts.retryDelayMs;
    for (let attempt = 0;; attempt++) {
        try {
            i.rename(tmp, dst);
            break;
        }
        catch (e) {
            const code = e.code;
            if (isRetryableLockCode(code) && attempt < opts.retries) {
                // 同步版退避：用 Atomics.wait 避免占用事件循环太久的自旋；小退避足够
                busyWait(delay);
                delay *= 2;
                continue;
            }
            try {
                i.unlink(tmp);
            }
            catch {
                rawOpts.onCleanupFailure?.(tmp, e);
            }
            throw withContext(e, dst, 'rename');
        }
    }
    if (opts.fsyncDir && !WINDOWS)
        i.fsyncDir(dir);
}
function statSyncSafe(l) {
    return l ? l.mode : null;
}
function busyWait(ms) {
    if (ms <= 0)
        return;
    const sab = new SharedArrayBuffer(4);
    const ia = new Int32Array(sab);
    try {
        Atomics.wait(ia, 0, 0, ms);
    }
    catch {
        /* SharedArrayBuffer 不可用时退化为无退避（少见） */
    }
}
//# sourceMappingURL=atomic-write.js.map