/**
 * `TavilyAdapter`: `POST {base}/search` with a Bearer key (see
 * docs.tavily.com/documentation/api-reference/endpoint/search). Sends
 * `max_results` as the request-layer cost control and `include_answer` so the
 * optional generated answer rides `WebSearchResult.content`.
 *
 * @module dsh-web-search-aggregation/adapters/tavily
 */
import type { WebSearchResult, WebSearchSource } from '@deepseek-ai/dsh-web';
import type { SearchAdapter } from './adapter.ts';
/** Public Tavily API origin (single source: `defaults.ts`). */
export declare const TAVILY_DEFAULT_BASE_URL: string;
/** Result count sent when the request carries no `maxResults` (Tavily's own default is 5). */
export declare const TAVILY_DEFAULT_MAX_RESULTS = 5;
/** One result row of Tavily's `results[]`, as far as this adapter reads it. */
interface TavilyRow {
    title?: unknown;
    url?: unknown;
    content?: unknown;
    published_date?: unknown;
}
/**
 * Map one Tavily result row to a normalized source; rows without a usable URL
 * are dropped.
 *
 * @param row - one `results[]` row.
 * @returns the normalized source, or `undefined` to drop.
 */
export declare function mapTavilyRow(row: TavilyRow): WebSearchSource | undefined;
/** The Tavily search adapter; a key is mandatory. */
export declare const tavilyAdapter: SearchAdapter;
/**
 * Map a Tavily search response to the normalized result; `answer`, when a
 * non-blank string, becomes `content`.
 *
 * @param body - the parsed response body.
 * @returns the normalized search result.
 * @throws WebError `WEB_PROVIDER_ERROR` when the body carries no results array.
 */
export declare function mapTavilyResponse(body: unknown): WebSearchResult;
export {};
