import type { FileSystemFacade } from '../core/types.ts';
/**
 * 默认敏感文件清单（相对 $DSH_HOME）：当前 DSH 唯一「整文件即秘密」的文件
 * （.credentials.yaml = 凭据明文 token/password/密钥）。
 * 宿主可传入扩展清单（如 profiles/<p>/secrets.yaml、.env 等），默认清单保持最小。
 */
export declare const DEFAULT_SENSITIVE_RELS: readonly string[];
/** vault 根目录 = <dataDir>/vault */
export declare function vaultRootOf(dataDir: string): string;
/** refreshVault 结果 */
export interface VaultRefreshResult {
    /** 本次实际镜像入库的敏感文件（相对 $DSH_HOME） */
    mirrored: string[];
    /** 因源文件已不存在 / rel 不再属于清单而被清理的旧镜像（相对 $DSH_HOME） */
    cleaned: string[];
    /** 单个文件镜像失败（非致命：读源 / 写镜像异常），reason 为错误消息 */
    skipped: {
        rel: string;
        reason: string;
    }[];
}
/** restoreVaultFiles 结果 */
export interface VaultRestoreResult {
    /** 已从 vault 回填到 $DSH_HOME 的文件（相对 $DSH_HOME） */
    restored: string[];
    /** vault 中缺失、需要用户重填的文件（跨机恢复 vault 为空 → 全部缺失） */
    missing: string[];
    /** 跳过项：reason 为 'targetExists'（目标已存在不覆盖）或错误消息（拷贝失败） */
    skipped: {
        rel: string;
        reason: string;
    }[];
}
/** listVault 条目 */
export interface VaultEntry {
    /** 原始敏感文件路径（相对 $DSH_HOME） */
    rel: string;
    /** vault 内镜像的绝对路径 */
    vaultPath: string;
}
/**
 * 刷新 vault：把 $DSH_HOME 下现存敏感文件镜像到 <dataDir>/vault/<rel>。
 * 幂等：重复调用结果一致（同字节覆盖写，不产生重复条目）。
 * 清理：源文件已不存在、或 rel 不再属于传入清单的旧镜像会被删除。
 * 返回实际入库清单（供报告 / 提示「已镜像到本机 vault」）。
 */
export declare function refreshVault(fs: FileSystemFacade, dataDir: string, dshHome: string, rels: readonly string[]): Promise<VaultRefreshResult>;
/**
 * 从 vault 回填敏感文件到 $DSH_HOME（跨机恢复 / 本机误删后的恢复）。
 * 不覆盖已存在的目标文件（安全：避免覆盖目标机更新后的凭据）；
 * vault 无对应文件（跨机恢复、从未镜像过）记入 missing，由调用方提示用户重填。
 */
export declare function restoreVaultFiles(fs: FileSystemFacade, dataDir: string, dshHome: string, rels: readonly string[]): Promise<VaultRestoreResult>;
/**
 * 列出 vault 内容（镜像结构 = 相对 $DSH_HOME 的 rel 平铺在 vault 根下，
 * 例如 vault/.credentials.yaml 即 $DSH_HOME/.credentials.yaml 的镜像）。
 * vault 不存在 / 为空时返回空数组。
 */
export declare function listVault(fs: FileSystemFacade, dataDir: string, dshHome: string): Promise<VaultEntry[]>;
