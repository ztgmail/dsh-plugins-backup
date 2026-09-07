import type { SectionId } from '../schema/types.ts';
import type { MarketPublishMode } from './types.ts';
export declare class MarketPrepareError extends Error {
    constructor(message: string);
}
/** 发布输入：用户填写的条目元数据 + 配置 zip 字节。 */
export interface MarketPrepareInput {
    itemId: string;
    name: string;
    /** 条目版本（缺省 '1.0.0'） */
    version?: string;
    description?: string;
    author?: string;
    categories?: string[];
    /** 作者托管仓库 URL（可选；留空表示未来与官方市场同仓，provenance.source 省略） */
    repoUrl?: string;
    /** 发布模式：'migrate'（缺省，迁移全带）| 'share'（分享：排除设备/平台分区 + 强制隐私拦截） */
    mode?: MarketPublishMode;
    /** 用户配置 zip 的字节（来自受控临时区） */
    zipBytes: Uint8Array;
    /** 测试可注入固定时间（updatedAt）；缺省 now */
    now?: string;
}
/** 发布产物：manifest 文本 + 校验摘要（供 UI 展示/复制）。 */
export interface MarketPrepareResult {
    /** items/<id>/manifest.json 内容（pretty JSON，可直接写入发布目录） */
    manifestText: string;
    /** config.zip 的 SHA-256（与 manifest.checksums.zip 一致，供 UI 展示） */
    sha256: string;
    /** zip 内启用的分区（与 manifest.sections 一致） */
    sections: SectionId[];
    /** 供应链警示（恒生成：发布即公开，未审核） */
    warnings: string[];
}
/**
 * 由用户配置 zip 生成市场条目包（纯函数，零写入；异常一律抛 MarketPrepareError）。
 */
export declare function prepareMarketItem(input: MarketPrepareInput): MarketPrepareResult;
