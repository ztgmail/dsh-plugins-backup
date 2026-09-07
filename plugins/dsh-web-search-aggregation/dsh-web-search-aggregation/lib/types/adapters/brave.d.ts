/**
 * `BraveAdapter`: `GET {base}/res/v1/web/search?q=…&count=…` with the
 * `X-Subscription-Token` header (see
 * api-dashboard.search.brave.com/api-reference/web/search/get). `count` is
 * clamped to the API's 1–20 window (Brave rejects more with a 422), and
 * `text_decorations=false` keeps snippets free of the default
 * bold-marker decorations. `page_age` (an ISO datetime string) becomes
 * `publishedAt`; the human-readable `age` ("2 days ago") is not a date
 * and stays out.
 *
 * @module dsh-web-search-aggregation/adapters/brave
 */
import type { WebSearchResult, WebSearchSource } from '@deepseek-ai/dsh-web';
import type { SearchAdapter } from './adapter.ts';
/** Public Brave Search API origin (single source: `defaults.ts`). */
export declare const BRAVE_DEFAULT_BASE_URL: string;
/** Brave's documented maximum for `count` (1–20). */
export declare const BRAVE_MAX_COUNT = 20;
/** Result count sent when the request carries no `maxResults` (Brave's own default is 20). */
export declare const BRAVE_DEFAULT_COUNT = 20;
/**
 * Clamp one requested result count into Brave's 1–20 `count` window.
 *
 * @param count - the raw requested count.
 * @returns the clamped count.
 */
export declare function braveCount(count: number): number;
/**
 * Build the Brave request URL for one query.
 *
 * @param baseURL - the endpoint base (already defaulted).
 * @param query - the search query text.
 * @param count - the clamped result count.
 * @returns the absolute request URL.
 * @throws WebError `WEB_PROVIDER_ERROR` when the base is not an absolute URL.
 */
export declare function braveURL(baseURL: string, query: string, count: number): string;
/** One result row of Brave's `web.results[]`, as far as this adapter reads it. */
interface BraveRow {
    title?: unknown;
    url?: unknown;
    description?: unknown;
    page_age?: unknown;
    /** Human-readable age ("2 days ago"); present on the row, deliberately not mapped. */
    age?: unknown;
}
/**
 * Map one Brave result row to a normalized source; rows without a usable URL
 * are dropped.
 *
 * @param row - one `web.results[]` row.
 * @returns the normalized source, or `undefined` to drop.
 */
export declare function mapBraveRow(row: BraveRow): WebSearchSource | undefined;
/** The Brave search adapter; a key (subscription token) is mandatory. */
export declare const braveAdapter: SearchAdapter;
/**
 * Map a Brave search response to the normalized result.
 *
 * @param body - the parsed response body.
 * @returns the normalized search result.
 * @throws WebError `WEB_PROVIDER_ERROR` when the body carries no `web.results`
 *   array.
 */
export declare function mapBraveResponse(body: unknown): WebSearchResult;
export {};
