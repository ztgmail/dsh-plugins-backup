/** GitHub device flow 第一步：请求设备码 */
export declare const GITHUB_DEVICE_CODE_URL = "https://github.com/login/device/code";
/** GitHub device flow 第三步：轮询换取 access token */
export declare const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
/** 缺省 scope：repo（读写私有仓库，同步通道需要） */
export declare const GITHUB_DEVICE_FLOW_SCOPE = "repo";
/** GitHub 缺省轮询间隔（秒） */
export declare const GITHUB_DEFAULT_INTERVAL = 5;
/** slow_down 时按 RFC 8628 额外增加的等待秒数 */
export declare const SLOW_DOWN_EXTRA_SECONDS = 5;
export interface GitHubAuthOptions {
    /** 可注入 fetcher（测试 mock 用）；缺省 = global fetch */
    fetcher?: typeof fetch;
    /** 可注入时钟（epoch ms；测试过期清理用）；缺省 = Date.now */
    now?: () => number;
}
/** startDeviceFlow 产出：UI 展示用户码 + 授权页，宿主侧登记设备码 */
export interface DeviceFlowStartResult {
    deviceCode: string;
    userCode: string;
    verificationUri: string;
    /** 设备码过期秒数（GitHub 默认 900） */
    expiresIn: number;
    /** GitHub 建议的轮询间隔秒数（缺省 5） */
    interval: number;
}
/** 轮询结果状态：success 携带 token（宿主立即入库）；pending 继续等；其余为终止态 */
export type DeviceFlowPollStatus = 'pending' | 'success' | 'denied' | 'expired' | 'error';
export interface DeviceFlowPollResult {
    status: DeviceFlowPollStatus;
    /** status=success 时：access token（调用方负责立即写入 credentials，绝不落日志/回传 UI） */
    accessToken?: string;
    /** status=pending 时：下次轮询应等待的毫秒数（按 GitHub interval；slow_down 额外 +5s） */
    pollDelayMs?: number;
    /** status=error 时：GitHub 返回的 error code */
    errorCode?: string;
    /** 可展示的错误描述（来自 GitHub error_description，不含 token） */
    message?: string;
}
/** GitHub OAuth 可预期错误：code = GitHub error / 固定内部码，status = HTTP 状态（网络层无） */
export declare class GitHubAuthError extends Error {
    readonly code: string;
    readonly status: number | undefined;
    constructor(message: string, code: string, status?: number);
}
/** exchangeDeviceCode 入参（client_secret 仅 confidential OAuth app 需要，缺省不发送） */
export interface ExchangeDeviceCodeParams {
    clientId: string;
    deviceCode: string;
    clientSecret?: string;
    /** 轮询间隔秒数（pollForToken 计算下次延迟用；缺省 5） */
    interval?: number;
}
/** 单次 token 交换结果：成功 = access token；失败 = GitHub error code + 描述 */
export type ExchangeDeviceCodeResult = {
    ok: true;
    accessToken: string;
} | {
    ok: false;
    error: string;
    errorDescription?: string;
};
/**
 * GitHub OAuth device flow 客户端。
 * 无状态（设备码登记由宿主侧的 DeviceFlowStore 负责），fetch 可注入。
 */
export declare class GitHubAuthClient {
    private readonly fetcher;
    private readonly now;
    constructor(options?: GitHubAuthOptions);
    /**
     * 第一步：请求设备码。产出一次性 user_code + 授权页 URL + device_code
     * （device_code 由宿主登记，只在本模块与宿主间流转，绝不发给浏览器）。
     */
    startDeviceFlow(clientId: string, scope?: string): Promise<DeviceFlowStartResult>;
    /**
     * 单次 token 交换（device flow 第三步的原子操作）。
     * 返回类型化结果：成功 = access token；失败 = GitHub error code（pending/slow_down
     * 等由 pollForToken 归并为轮询状态）。
     */
    exchangeDeviceCode(params: ExchangeDeviceCodeParams): Promise<ExchangeDeviceCodeResult>;
    /**
     * 轮询换取 access token，把 GitHub 错误码归并为 UI 可消费的轮询状态：
     * - authorization_pending → pending（按 interval 继续等）
     * - slow_down → pending（interval + 5s，RFC 8628）
     * - expired_token → expired（终止，重新开始）
     * - access_denied → denied（终止）
     * - 其他 error → error（终止，携带 errorCode + 描述）
     */
    pollForToken(params: ExchangeDeviceCodeParams): Promise<DeviceFlowPollResult>;
}
/** DeviceFlowStore 登记的条目（device_code 只存宿主内存，绝不发往浏览器） */
export interface DeviceFlowEntry {
    deviceCode: string;
    clientId: string;
    clientSecret?: string;
    /** 轮询间隔秒数（来自 start 响应，pollForToken 计算下次延迟用） */
    interval: number;
    /** 过期时刻（epoch ms）：now > expiresAt 视为已过期，get 返回 undefined 并清理 */
    expiresAt: number;
}
/**
 * 宿主内存设备码登记表（进程生命周期，跨请求共享 —— 与 RunRegistry 同模式）。
 * device_code 的持有者是宿主：UI 只拿 flowId（随机 id），轮询时宿主凭 flowId 取回
 * device_code 去 GitHub 换 token。过期条目惰性清理，防止无限增长。
 */
export declare class DeviceFlowStore {
    private readonly flows;
    private readonly now;
    constructor(now?: () => number);
    get size(): number;
    /** 登记一个设备码流；flowId 由调用方生成（随机，不可猜） */
    set(flowId: string, entry: DeviceFlowEntry): void;
    /** 取回设备码流；过期条目视为不存在并立即清理 */
    get(flowId: string): DeviceFlowEntry | undefined;
    /** 主动移除（取消/完成后清理） */
    delete(flowId: string): void;
    /** 生成不可猜的 flowId（路由层用） */
    static newFlowId(): string;
}
