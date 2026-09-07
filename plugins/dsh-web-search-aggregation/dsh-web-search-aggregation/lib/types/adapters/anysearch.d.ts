/**
 * `AnySearchAdapter`: `POST {base}/v1/search` with an optional Bearer key
 * (AnySearch allows anonymous access). Response shape and envelope semantics
 * follow the official `anysearch-dsh` integration: `{code: 0, message,
 * data: {results: [{title, url, snippet?}]}}`.
 *
 * @module dsh-web-search-aggregation/adapters/anysearch
 */
import type { WebSearchResult, WebSearchSource } from '@deepseek-ai/dsh-web';
import type { SearchAdapter } from './adapter.ts';
/** Public AnySearch API origin (single source: `defaults.ts`). */
export declare const ANYSEARCH_DEFAULT_BASE_URL: string;
/** One result row of AnySearch's `data.results[]`, as far as this adapter reads it. */
interface AnySearchRow {
    title?: unknown;
    url?: unknown;
    snippet?: unknown;
}
/**
 * Map one AnySearch result row to a normalized source; rows without a usable
 * URL are dropped (the seam requires a citeable URL and inventing one would lie).
 *
 * @param row - one `data.results[]` row.
 * @returns the normalized source, or `undefined` to drop.
 */
export declare function mapAnySearchRow(row: AnySearchRow): WebSearchSource | undefined;
/** The AnySearch search adapter. */
export declare const anySearchAdapter: SearchAdapter;
/**
 * Map an AnySearch response envelope to the normalized result.
 *
 * @param body - the parsed response body.
 * @returns the normalized search result.
 * @throws WebError `WEB_PROVIDER_ERROR` when the envelope reports a business
 *   error (`code !== 0`) or carries no results array.
 */
export declare function mapAnySearchResponse(body: unknown): WebSearchResult;
export {};
