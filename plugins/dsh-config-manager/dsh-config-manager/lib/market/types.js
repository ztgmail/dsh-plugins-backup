/** index.json schema 版本（本版恒 1） */
export const MARKET_INDEX_SCHEMA_VERSION = 1;
/** items/<id>/manifest.json schema 版本（本版恒 1） */
export const MARKET_ITEM_SCHEMA_VERSION = 1;
/**
 * 单条目 config.zip 体积上限（64 MB，对齐现有上传上限量级）—— zip bomb 首道闸。
 */
export const MAX_MARKET_ZIP_BYTES = 64 * 1024 * 1024;
/**
 * 市场条目禁止携带的分区（产品决策 2026-08-19，guide docs/design/2026-08-19-market-repo-setup-guide.md）：
 *  - sessions：历史会话，含个人交互记录/上下文；
 *  - pluginFiles：任意文件直通（目录放啥带啥），无内容过滤，最易泄漏 token/密钥文件；
 *  - self：本地环境专属（sync 通道 URL / WebDAV 地址 / 市场配置 / UI 偏好），无分享价值且泄漏环境信息。
 * 发布（prepare）与下载（validateMarketItem）两端强制拒绝。
 */
export const BANNED_MARKET_SECTIONS = ['sessions', 'pluginFiles', 'self'];
/**
 * itemId / 仓库 url-hash 的安全字符集（防路径穿越 + 用作目录名）：
 * 字母数字开头，仅 . _ -，最长 128。与 sync GitTransport 的 SAFE_ID_RE 同构。
 */
export const SAFE_ITEM_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
/** 校验 itemId 是否合法；不合法抛错（防 items/<id>/ 越界）。 */
export function assertSafeItemId(id) {
    if (typeof id !== 'string' || !SAFE_ITEM_ID_RE.test(id)) {
        throw new Error(`非法市场条目 id: ${JSON.stringify(id)}（仅允许字母数字开头，字符限 . _ -）`);
    }
}
//# sourceMappingURL=types.js.map