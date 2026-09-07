/**
 * `SerpApiAdapter`: `GET {base}/search.json?engine=google&q=…&api_key=…`
 * (see serpapi.com/search-api and serpapi.com/organic-results). The API key
 * MUST ride the URL as the `api_key` query parameter — SerpApi's docs state
 * it "should not be in HTTP headers, form data, or anywhere else" — so no
 * Authorization header is sent. The documented `num` (default 10, up to 100)
 * is sent ONLY when the request carries a result count: SerpApi notes calls
 * with `num` are historically more CAPTCHA-prone, so an unspecified count
 * inherits the API default instead of forcing one. Failures — including
 * HTTP 200 bodies whose only payload is a top-level `error` string (e.g.
 * Google returning nothing) — map to `WEB_PROVIDER_ERROR` so the queue
 * falls through. `link` → url, `title` → title, `snippet` → snippet, and
 * `date` (Google's displayed date string, not normalized ISO) →
 * `publishedAt`.
 *
 * @module dsh-web-search-aggregation/adapters/serpapi
 */
import type { WebSearchResult, WebSearchSource } from '@deepseek-ai/dsh-web';
import type { SearchAdapter } from './adapter.ts';
/** Public SerpApi API origin (single source: `defaults.ts`). */
export declare const SERPAPI_DEFAULT_BASE_URL: string;
/** SerpApi's documented maximum for `num` (default 10, up to 100). */
export declare const SERPAPI_MAX_NUM = 100;
/**
 * Clamp one requested result count into SerpApi's 1–100 `num` window. Only
 * used when the request actually carries a count; otherwise `num` is omitted
 * so the API default (10) applies.
 *
 * @param count - the raw requested count.
 * @returns the clamped count.
 */
export declare function serpapiNum(count: number): number;
/**
 * Build the SerpApi request URL for one query.
 *
 * @param baseURL - the endpoint base (already defaulted).
 * @param query - the search query text.
 * @param apiKey - the SerpApi key literal; it rides the URL because the API
 *   rejects keys placed in headers or bodies.
 * @param num - the clamped result count, or `undefined` to inherit the API
 *   default (then the parameter is not sent at all).
 * @returns the absolute request URL.
 * @throws WebError `WEB_PROVIDER_ERROR` when the base is not an absolute URL.
 */
export declare function serpapiURL(baseURL: string, query: string, apiKey: string, num: number | undefined): string;
/** One result row of SerpApi's `organic_results[]`, as far as this adapter reads it. */
interface SerpApiRow {
    title?: unknown;
    link?: unknown;
    snippet?: unknown;
    /** Google's displayed date ("Sep 20, 2018", "5 days ago"); mapped as-is. */
    date?: unknown;
    /** Result rank on the page; present on the row, deliberately not mapped. */
    position?: unknown;
}
/**
 * Map one SerpApi result row to a normalized source; rows without a usable
 * link are dropped.
 *
 * @param row - one `organic_results[]` row.
 * @returns the normalized source, or `undefined` to drop.
 */
export declare function mapSerpApiRow(row: SerpApiRow): WebSearchSource | undefined;
/** The SerpApi search adapter; a key is mandatory. */
export declare const serpApiAdapter: SearchAdapter;
/**
 * Map a SerpApi search response to the normalized result. A body whose only
 * payload is a non-blank top-level `error` string is a failure — SerpApi
 * reports errors that way even with HTTP 200 (e.g. `status: "Success"` plus
 * `"Google hasn't returned any results for this query."` when Google found
 * nothing) — so it throws and the queue falls through.
 *
 * @param body - the parsed response body.
 * @returns the normalized search result.
 * @throws WebError `WEB_PROVIDER_ERROR` when the body carries an `error`
 *   string or no `organic_results` array.
 */
export declare function mapSerpApiResponse(body: unknown): WebSearchResult;
export {};
