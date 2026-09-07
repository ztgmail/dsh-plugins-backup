export declare const MARKET_CONFIG_FILE = "market-config.json";
export declare const MARKET_CONFIG_SCHEMA_VERSION = 1;
/** 已添加市场条目（持久化；只含 url + addedAt） */
export interface MarketConfigEntry {
    url: string;
    addedAt: string;
}
/** market-config.json 顶层形状 */
export interface MarketConfig {
    schemaVersion: number;
    markets: MarketConfigEntry[];
}
/** 构造空配置（schemaVersion=1，markets=[]） */
export declare function emptyMarketConfig(): MarketConfig;
/**
 * 读取市场配置；文件不存在/损坏/不支持 schema → 返回空配置（不抛错，UI 显示空列表）。
 */
export declare function readMarketConfig(dir: string): Promise<MarketConfig>;
/**
 * 保存市场配置（自动创建目录；覆盖旧值；恒写 schemaVersion=1）。
 */
export declare function writeMarketConfig(dir: string, cfg: MarketConfig): Promise<void>;
/**
 * 添加市场（幂等：同 url 已存在则不变更，返回新增与否）。url 非法（含 userinfo）抛错。
 */
export declare function addMarket(dir: string, url: string): Promise<{
    cfg: MarketConfig;
    added: boolean;
}>;
/**
 * 移除市场（不存在视为成功；返回移除后配置）。
 */
export declare function removeMarket(dir: string, url: string): Promise<MarketConfig>;
