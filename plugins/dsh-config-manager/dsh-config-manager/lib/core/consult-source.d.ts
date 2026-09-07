import type { SectionId } from '../schema/types.ts';
import type { ConsultSourceData, ConsultSourceRef, MigratabilityResult } from './migration-consult.ts';
export interface ConsultSourceReaderOptions {
    /** 计算可迁移性（宿主注入；缺省 null = 不评估） */
    computeMigratability?: (zipPath: string) => Promise<MigratabilityResult>;
    /** 高熵扫描开关（固定 true 保证确定性；缺省 true） */
    highEntropy?: boolean;
}
/** 从导出 ZIP 读取并归一化源数据（只读） */
export declare function readExportZipSource(ref: ConsultSourceRef, zipPath: string, opts?: ConsultSourceReaderOptions): Promise<ConsultSourceData>;
export interface LocalSnapshotSourceInput {
    /** 快照捕获的分区数据（按 adapter 分组；best-effort） */
    sections: Map<SectionId, unknown>;
    /** 快照完整性校验结果（verifySnapshot） */
    verify: {
        ok: boolean;
        reason?: string;
    };
    /** 恢复计划（planRestore）→ 可迁移性 */
    restorePlan: {
        itemCount: number;
        conflicts: number;
        warnings: number;
        sections: SectionId[];
        errors: string[];
    };
    /** 合成 manifest 的源信息（宿主 dshVersion/platform） */
    sourceDsh: string;
    sourcePlatform: string;
}
/**
 * 从本地快照（rollback 点）构建 ConsultSourceData。
 * 快照无导出 manifest → 用合成 manifest（schemaVersion=1，sections 来自捕获分区），
 * 避免「无导出 manifest」被误判为 compatibility/integrity critical。
 * 完整性 = verifySnapshot（blob hashes / metadataHash）；可迁移性 = planRestore。
 */
export declare function buildLocalSnapshotSource(ref: ConsultSourceRef, input: LocalSnapshotSourceInput): ConsultSourceData;
export interface ProfileSourceInput {
    /** profile 的分区数据（decodeSections） */
    sections: Map<SectionId, unknown>;
    /** 切换预览（analyzeSwitch）→ 可迁移性 */
    switchPreview: {
        itemCount: number;
        conflicts: number;
        warnings: number;
        sections: SectionId[];
        errors: string[];
    };
    /** 合成 manifest 的源信息（宿主 dshVersion/platform） */
    sourceDsh: string;
    sourcePlatform: string;
}
/**
 * 从配置档案（profile.json）构建 ConsultSourceData。
 * profile 无导出 manifest → 用合成 manifest（sections 来自 profile 分区）。
 * 可迁移性 = analyzeSwitch（切换预览计划项）。
 */
export declare function buildProfileSource(ref: ConsultSourceRef, input: ProfileSourceInput): ConsultSourceData;
