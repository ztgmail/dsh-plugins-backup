import type { Manifest, SectionId } from '../schema/types.ts';
import type { MarketItemManifest } from './types.ts';
export interface MarketItemValidationResult {
    status: 'valid' | 'invalid';
    /** 校验失败原因（invalid 时非空；valid 时为空） */
    errors: string[];
    /** 供应链警示（恒生成，URCE/时间/非官方审核）—— 由调用方投影为 MarketItemDetail.warnings */
    warnings: string[];
    /** 校验通过的清单（L2；valid 时非空） */
    manifest: MarketItemManifest | null;
    /** 从 config.zip 内部解析出的标准 Manifest（valid 时非空） */
    internalManifest: Manifest | null;
    /** L2 声明与 zip 内部 sections 的交集（valid 时非空） */
    sections: SectionId[];
    /** 内部 checksums.json 校验是否通过 */
    checksumsOk: boolean;
}
/**
 * 校验市场条目（§6 全管线，零写入）。
 *
 * @param itemId   请求的条目 id（与目录名一致）
 * @param manifestRaw items/<id>/manifest.json 原文（L2）
 * @param zipBytes   items/<id>/config.zip 字节（L3）
 * @returns MarketItemValidationResult（恒不抛错；异常全部收敛进 errors）
 */
export declare function validateMarketItem(itemId: string, manifestRaw: string, zipBytes: Uint8Array): MarketItemValidationResult;
/**
 * 恒生成供应链警示（UI 确认前恒展示；文档 §6.7 硬不变式）。
 * 不依赖任何具体 manifest 字段 —— 只要是从市场网络下载的条目即生成。
 */
export declare function generateSupplyChainWarnings(itemId: string): string[];
