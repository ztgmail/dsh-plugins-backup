/**
 * `TinyFishAdapter`: `GET {base}?query=…` with the `X-API-Key` header (the
 * Search API at `api.search.tinyfish.ai` requires a key; see
 * docs.tinyfish.ai/search-api). The API exposes no result-count control, so
 * the seam's `maxResults` truncation is the only bound.
 *
 * @module dsh-web-search-aggregation/adapters/tinyfish
 */
import type { WebSearchResult, WebSearchSource } from '@deepseek-ai/dsh-web';
import type { SearchAdapter } from './adapter.ts';
/** Public TinyFish Search API origin (single source: `defaults.ts`). */
export declare const TINYFISH_DEFAULT_BASE_URL: string;
/** One result row of TinyFish's `results[]`, as far as this adapter reads it. */
interface TinyFishRow {
    title?: unknown;
    url?: unknown;
    snippet?: unknown;
    date?: unknown;
}
/**
 * Build the TinyFish request URL for one query.
 *
 * @param baseURL - the endpoint base (already defaulted).
 * @param query - the search query text.
 * @returns the absolute request URL.
 * @throws WebError `WEB_PROVIDER_ERROR` when the base is not an absolute URL.
 */
export declare function tinyfishURL(baseURL: string, query: string): string;
/**
 * Map one TinyFish result row to a normalized source; rows without a usable
 * URL are dropped.
 *
 * @param row - one `results[]` row.
 * @returns the normalized source, or `undefined` to drop.
 */
export declare function mapTinyFishRow(row: TinyFishRow): WebSearchSource | undefined;
/** The TinyFish search adapter; a key is mandatory. */
export declare const tinyFishAdapter: SearchAdapter;
/**
 * Map a TinyFish search response to the normalized result.
 *
 * @param body - the parsed response body.
 * @returns the normalized search result.
 * @throws WebError `WEB_PROVIDER_ERROR` when the body carries no results array.
 */
export declare function mapTinyFishResponse(body: unknown): WebSearchResult;
export {};
