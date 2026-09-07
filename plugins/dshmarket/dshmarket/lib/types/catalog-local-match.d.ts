/**
 * Catalog matching for locally linked / file: installs. Shared by the host
 * restore route and the Market client so both refuse the same wrong guesses.
 */
/**
 * The catalog entry a locally linked / file: install should restore to.
 * Exact `#path:` identities win, then collection-root identities against
 * root-only catalog rows, then a unique name/npm match when nothing
 * contradicts it. A bare repo identity never selects a root row while
 * `/tree/` siblings exist for that repo — the checkout did not say which
 * package it is, and guessing wrong installs a different plugin.
 * Same-named forks without identities or a matching hint stay unmatched
 * rather than guessing; declared repo evidence that matches nothing in the
 * catalog must not fall back to a coincidental unique name.
 */
export declare function findCatalogEntryForLocal<T extends {
    name: string;
    npm?: string | null;
    url: string;
}>(plugins: readonly T[], name: string, identities?: readonly string[], hints?: readonly string[]): T | null;
export type CatalogRestoreReason = 'no-catalog' | 'repo-mismatch';
/** Why a local restore was blocked, when findCatalogEntryForLocal returned null. */
export declare function resolveCatalogRestore<T extends {
    name: string;
    npm?: string | null;
    url: string;
}>(plugins: readonly T[], name: string, identities?: readonly string[], hints?: readonly string[]): {
    ok: true;
    entry: T;
} | {
    ok: false;
    reason: CatalogRestoreReason;
};
