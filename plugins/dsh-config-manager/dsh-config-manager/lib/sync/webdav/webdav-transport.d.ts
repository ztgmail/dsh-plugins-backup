import type { MsgFunc } from '../../core/messages.ts';
import type { SyncSnapshot, SyncSnapshotMeta, SyncTransport } from '../transport.ts';
/** 请求选项：headers / body / 覆盖默认超时（ms；0 = 不超时） */
export interface WebDavRequestOptions {
    headers?: Record<string, string>;
    body?: string;
    timeoutMs?: number;
}
/** 请求响应最小形状（兼容 fetch Response 的 status/ok/text()；headers 供重定向读 Location） */
export interface WebDavResponse {
    readonly status: number;
    readonly ok: boolean;
    /** 响应头（可选：注入的 mock 可省略，默认 request 总会带上，重定向跟随需要 location） */
    readonly headers?: Record<string, string>;
    text(): Promise<string>;
}
/** 可注入的请求函数（测试 mock 用）；method/url/options */
export type WebDavRequestFn = (method: string, url: string, options?: WebDavRequestOptions) => Promise<WebDavResponse>;
/** 凭据提供者：password 只从这里读取，绝不落盘/进日志 */
export interface WebDavCredentialProvider {
    getPassword(): Promise<string>;
}
export interface WebDavTransportOptions {
    /** WebDAV 远端根 URL（http/https），如 https://dav.example.com/dav/config */
    baseUrl: string;
    /** HTTP Basic 认证用户名 */
    username: string;
    /** 密码提供者（HTTP Basic 密码） */
    credentials: WebDavCredentialProvider;
    /** 可注入 request（测试 mock 用）；缺省 = 全局 fetch + AbortController 超时 */
    request?: WebDavRequestFn;
    /** 单请求超时 ms，默认 120000（慢速 WebDAV 上传大快照需要宽裕窗口；0 = 不超时） */
    timeoutMs?: number;
    /** 消息翻译器（缺省 zh） */
    msg?: MsgFunc;
}
export declare class WebDavTransportError extends Error {
    constructor(message: string);
}
/** 实现 SyncTransport 的 WebDAV 通道。所有网络操作经 request 注入（缺省 defaultRequest，自动跟随重定向）。 */
export declare class WebDavTransport implements SyncTransport {
    readonly type = "webdav";
    private readonly o;
    constructor(options: WebDavTransportOptions);
    /** 列出远端已有快照（按 createdAt 升序）。index.json 缺失视为空。 */
    list(): Promise<SyncSnapshotMeta[]>;
    /** 上传快照：幂等 MKCOL → 快照级跳过判定（同 id 且内容全等则免上传）→ PUT <id>.json
     *  → 合并写回 index.json；返回远端 meta（跳过时）或 computeSnapshotMeta。
     *  序列化经 snapshot-json：文件类分区字节以 base64 传输（JSON 无法直传 Uint8Array）。 */
    upload(snapshot: SyncSnapshot): Promise<SyncSnapshotMeta>;
    /** 下载快照完整载荷。不存在的 id 必须抛错（契约）。 */
    download(id: string): Promise<SyncSnapshot>;
    /** 删除远端快照并从 index 摘除（写回合并后的 index）；文件不存在视为成功。 */
    delete(id: string): Promise<void>;
    private validateOptions;
    private assertSafeId;
    private snapshotsBase;
    private snapshotsColUrl;
    private snapshotUrl;
    private indexUrl;
    /** 读取一次 password（错误脱敏用） */
    private passwordOnce;
    /** 幂等创建 snapshots 集合：MKCOL；已存在（405/2xx/3xx）视为成功。 */
    private ensureCollection;
    /** 读 index（缺失 → []；非法 → 抛错）。 */
    private readIndex;
    private parseIndex;
    private parseSnapshot;
    /** 发送请求：注入 Basic 认证头 + 调用 request；网络错误/超时归一 */
    private send;
    /** 构造 HTTP 非 2xx 失败消息：附上脱敏后的响应体片段（截断） */
    private failText;
    /** 识别超时错误（AbortController 抛出的 AbortError / DOMException timeout / TimeoutError） */
    private isTimeout;
    /** 错误消息脱敏：password（原文与 URL 编码形态）一律替换 */
    private mask;
}
