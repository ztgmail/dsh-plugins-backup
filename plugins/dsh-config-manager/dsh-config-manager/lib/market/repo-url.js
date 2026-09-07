/** owner/repo 安全字符（与 SAFE_ITEM_ID_RE 同构：字母数字开头，仅 . _ -） */
const GITHUB_REPO_SEG_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
/**
 * 解析 GitHub 仓库 URL → { owner, repo }；非 GitHub 仓库（域名不符 / 路径不是两段 /
 * 段名非法）→ null。
 */
export function parseGitHubRepoUrl(url) {
    if (typeof url !== 'string' || url.trim() === '')
        return null;
    let parsed;
    try {
        parsed = new URL(url.trim());
    }
    catch {
        return null;
    }
    const host = parsed.hostname.toLowerCase();
    if (host !== 'github.com' && host !== 'www.github.com')
        return null;
    const segments = parsed.pathname.split('/').filter((s) => s !== '');
    if (segments.length !== 2)
        return null;
    const owner = segments[0];
    const repoRaw = segments[1];
    const repo = repoRaw.endsWith('.git') ? repoRaw.slice(0, -4) : repoRaw;
    if (!GITHUB_REPO_SEG_RE.test(owner) || !GITHUB_REPO_SEG_RE.test(repo))
        return null;
    return { owner, repo };
}
//# sourceMappingURL=repo-url.js.map