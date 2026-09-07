import type { SectionId } from '../schema/types.ts';
import type { SnapshotFs } from './fs.ts';
import type { SyncSnapshot } from './transport.ts';
export declare const SNAPSHOT_MANIFEST_FILE = "manifest.json";
/**
 * 空文件类分区的 git 占位文件（git 不跟踪空目录）：
 * 上传方（GitTransport.upload）给 files 为空的文件类分区目录写入本占位文件，
 * 保证远端仓库保留该目录；读回时仅当「文件名 + 内容」同时匹配才过滤，
 * 避免吞掉用户真实同名文件。占位文件不参与 sectionHashes（基于传入数据计算）。
 * 注意：占位内容不得含换行 —— Windows core.autocrlf 会把 LF 转 CRLF，内容校验会失败。
 */
export declare const SNAPSHOT_KEEP_FILE = ".gitkeep";
export declare const SNAPSHOT_KEEP_CONTENT = "DSH Config Manager sync placeholder (keep empty section dir)";
/** 快照根目录下的 manifest.json 结构 */
export interface SnapshotDirManifest {
    id: string;
    createdAt: string;
    manifest: SyncSnapshot['manifest'];
    /** 各分区内容 hash（写入时由 hashSection 计算） */
    sectionHashes: Partial<Record<SectionId, string>>;
}
/**
 * 文件相对路径安全检查：拒绝空/'.'/'..'、绝对路径、Windows 盘符、反斜杠、
 * 含 '..' 或 '.' 片段（防穿越快照根目录）。
 */
export declare function isSafeRelPath(rel: string): boolean;
/** 递归列出 dir 下的全部文件（相对 dir 的正斜杠路径，字典序）；目录不存在 → [] */
export declare function listSnapshotFiles(fsx: SnapshotFs, dir: string): Promise<string[]>;
/**
 * 将快照写入散文件目录。
 * 非法输入（不支持的子分区 / 穿越路径）在任何写入发生前抛错，不留半成品目录。
 */
export declare function writeSnapshotToDir(snapshot: SyncSnapshot, dir: string, fsx?: SnapshotFs): Promise<SnapshotDirManifest>;
/**
 * 从散文件目录读回快照。
 * manifest 声明的分区必须可解析：JSON 分区文件缺失 / 文件分区目录缺失 → 抛错（不静默降级），
 * 但 opts.missingFileDir='empty' 时文件分区目录缺失降级为空分区
 * （git 通道专用：git 不跟踪空目录，目录缺失 = 空文件分区；提交原子性保证非空目录不会缺失）。
 * 读回时过滤 git 占位文件（SNAPSHOT_KEEP_FILE），使 files 与上传方数据一致。
 */
export declare function readSnapshotFromDir(dir: string, fsx?: SnapshotFs, opts?: {
    missingFileDir?: 'throw' | 'empty';
}): Promise<SyncSnapshot>;
