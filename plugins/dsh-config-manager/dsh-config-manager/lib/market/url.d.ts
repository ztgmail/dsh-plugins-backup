/** 校验市场仓库地址；合法返回 null，非法返回错误消息。仅接受 http(s)，拒绝 git@/ssh/空白/含 userinfo。 */
export declare function validateMarketRepoUrl(repoUrl: string): string | null;
