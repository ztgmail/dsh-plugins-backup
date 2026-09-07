/**
 * m-market：纯渲染模型（docs/design/marketplace.md §7.2）。
 * 仿 src/ui/progress.ts / sync-view.ts 模式：全部无副作用纯函数、node 可测，
 * 供 frontend 的 MarketPanel 直接复用。
 *
 * 硬不变式：供应链警示恒生成（marketItemWarnings 不论 status 都返回警示行，
 * 因为任何市场下载内容都视为不可信）；needsReview 恒 true（不提供「自动信任该来源」的默认）。
 */
import type { UiT } from '../ui/i18n.ts';
import type { MarketIndexItem, MarketItemDetail, MarketItemManifest, MarketListItem, MarketSummary } from './types.ts';
/** 市场状态行文案（status 区块顶部一行）。count<=0 → 未添加提示 */
export declare function marketStatusText(config: {
    count: number;
} | MarketSummary[], t: UiT): string;
/** 列表摘要：总条目数 + 缓存徽章计数（供 UI 顶部小结）。无副作用。 */
export declare function marketListSummary(items: MarketListItem[], _t: UiT): {
    total: number;
    fresh: number;
    cached: number;
    none: number;
};
/** 条目校验徽章：status 文案 + sections 清单文案。返回 { statusText, sectionsText, valid } */
export declare function computeItemBadge(detail: MarketItemDetail, t: UiT): {
    statusText: string;
    sectionsText: string;
    valid: boolean;
};
/**
 * 恒生成供应链警示行（硬不变式：任何市场下载条目确认导入前都可见）。
 * 传入 L2 manifest + 市场 URL + 下载时间；不依赖任何“来源可信”判定。
 */
export declare function marketItemWarnings(manifest: Pick<MarketItemManifest, 'name' | 'author' | 'provenance'> | undefined, url: string, downloadedAt: string, t: UiT): string[];
/**
 * 是否需要人工决策（供应链警示模型层恒 true —— 不让默认信任来源，须逐项确认）。
 */
export declare function needsReview(_detail: MarketItemDetail): boolean;
/** 从 MarketIndexItem 投影浏览列表项（cacheState 由调用方按缓存状态计算；repo 透出供来源徽章） */
export declare function toMarketListItem(item: MarketIndexItem, cacheState: MarketListItem['cacheState']): MarketListItem;
