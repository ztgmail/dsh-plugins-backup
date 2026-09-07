/**
 * `FirecrawlAdapter`: `POST {base}/v2/search` with a Bearer key (see
 * docs.firecrawl.dev/api-reference/endpoint/search). Sends `limit`
 * (1–100, clamped) and deliberately NO `scrapeOptions`: the plain search
 * costs 2 credits per 10 results and returns `data.web[]` rows of
 * url/title/description — enough for the seam, with no per-page scraping
 * cost or latency.
 *
 * @module dsh-web-search-aggregation/adapters/firecrawl
 */
import type { WebSearchResult, WebSearchSource } from '@deepseek-ai/dsh-web';
import type { SearchAdapter } from './adapter.ts';
/** Public Firecrawl API origin (single source: `defaults.ts`). */
export declare const FIRECRAWL_DEFAULT_BASE_URL: string;
/** Firecrawl's documented maximum for `limit` (1–100). */
export declare const FIRECRAWL_MAX_LIMIT = 100;
/** Result count sent when the request carries no `maxResults` (the docs' default limit is 10). */
export declare const FIRECRAWL_DEFAULT_LIMIT = 10;
/**
 * Clamp one requested result count into Firecrawl's 1–100 `limit` window.
 *
 * @param count - the raw requested count.
 * @returns the clamped count.
 */
export declare function firecrawlLimit(count: number): number;
/** One result row of Firecrawl's `data.web[]`, as far as this adapter reads it. */
interface FirecrawlRow {
    title?: unknown;
    url?: unknown;
    description?: unknown;
}
/**
 * Map one Firecrawl result row to a normalized source; rows without a usable
 * URL are dropped.
 *
 * @param row - one `data.web[]` row.
 * @returns the normalized source, or `undefined` to drop.
 */
export declare function mapFirecrawlRow(row: FirecrawlRow): WebSearchSource | undefined;
/** The Firecrawl search adapter; a key is mandatory. */
export declare const firecrawlAdapter: SearchAdapter;
/**
 * Map a Firecrawl search response to the normalized result.
 *
 * @param body - the parsed response body.
 * @returns the normalized search result.
 * @throws WebError `WEB_PROVIDER_ERROR` when the body reports failure
 *   (`success === false`) or carries no `data.web` array.
 */
export declare function mapFirecrawlResponse(body: unknown): WebSearchResult;
export {};
