/**
 * 可注入的最小 fs 门面（同步层核心逻辑经此访问磁盘）。
 * 默认实现包 node:fs/promises；测试/内存场景可注入自定义实现（零副作用、纯接口）。
 */
import fs from 'node:fs/promises';
import { atomicWriteFile } from "../utils/atomic-write.js";
/** 目录 + 正斜杠相对路径 → 宿主路径（正斜杠连接，Windows 下 Node fs 同样接受；
 * 两侧多余斜杠一律清除，避免产生 '//' 段与空路径段） */
export function joinFs(dir, rel) {
    const base = dir.replace(/[\\/]+$/, '');
    const cleanRel = rel.replace(/^[\\/]+/, '').replace(/[\\/]+$/, '');
    return cleanRel === '' ? base : `${base}/${cleanRel}`;
}
/** 默认 node:fs/promises 适配器 */
export function createSnapshotFs() {
    return {
        async readFile(p) { return fs.readFile(p); },
        /** 原子写：同目录 tmp + fsync + rename（同步快照文件不半写；注入的 mem-fs 天然原子） */
        async writeFile(p, data) { await atomicWriteFile(p, data); },
        async mkdir(p) { await fs.mkdir(p, { recursive: true }); },
        async readdir(p) {
            try {
                return (await fs.readdir(p)).sort();
            }
            catch {
                return [];
            }
        },
        async isDir(p) {
            try {
                return (await fs.stat(p)).isDirectory();
            }
            catch {
                return false;
            }
        },
        async exists(p) {
            try {
                await fs.access(p);
                return true;
            }
            catch {
                return false;
            }
        },
        async remove(p) { await fs.rm(p, { recursive: true, force: true }); },
    };
}
//# sourceMappingURL=fs.js.map