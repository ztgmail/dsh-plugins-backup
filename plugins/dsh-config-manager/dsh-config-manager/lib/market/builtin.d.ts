/** 内置市场仓库 URL（host/Node 端可经 `DSH_CONFIG_MARKET_URL` 覆盖；web 端安全回退默认官方地址）。 */
export declare const BUILTIN_MARKET_URL: string;
/** 内置市场是否为默认官方地址（固定默认值比较，不随 env 覆盖变化，保证 UI 判断稳定）。 */
export declare function isOfficialMarket(url: string): boolean;
