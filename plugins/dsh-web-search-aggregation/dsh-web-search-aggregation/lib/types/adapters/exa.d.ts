/**
 * `ExaAdapter`: `POST {base}/search` with a Bearer key (see
 * exa.ai/docs/reference/search — current docs authenticate via
 * `Authorization: Bearer`). Sends `numResults` (1–100, clamped) and
 * `contents: { highlights: true }` — Exa's documented agent-workflow mode,
 * which attaches the token-efficient `highlights[]` excerpts each result
 * row carries as its snippet. Content parameters MUST nest under
 * `contents` on `/search`; the deprecated top-level spellings are not used.
 *
 * @module dsh-web-search-aggregation/adapters/exa
 */
import type { WebSearchResult, WebSearchSource } from '@deepseek-ai/dsh-web';
import type { SearchAdapter } from './adapter.ts';
/** Public Exa API origin (single source: `defaults.ts`). */
export declare const EXA_DEFAULT_BASE_URL: string;
/** Exa's documented maximum for `numResults` (1–100). */
export declare const EXA_MAX_NUM_RESULTS = 100;
/** Result count sent when the request carries no `maxResults` (Exa's own default is 10). */
export declare const EXA_DEFAULT_NUM_RESULTS = 10;
/**
 * Clamp one requested result count into Exa's 1–100 `numResults` window.
 *
 * @param count - the raw requested count.
 * @returns the clamped count.
 */
export declare function exaNumResults(count: number): number;
/** One result row of Exa's `results[]`, as far as this adapter reads it. */
interface ExaRow {
    title?: unknown;
    url?: unknown;
    publishedDate?: unknown;
    highlights?: unknown;
}
/**
 * Map one Exa result row to a normalized source; rows without a usable URL
 * are dropped. The first non-blank highlight becomes the snippet (rows
 * requested without `contents.highlights` simply carry none).
 *
 * @param row - one `results[]` row.
 * @returns the normalized source, or `undefined` to drop.
 */
export declare function mapExaRow(row: ExaRow): WebSearchSource | undefined;
/** The Exa search adapter; a key is mandatory. */
export declare const exaAdapter: SearchAdapter;
/**
 * Map an Exa search response to the normalized result.
 *
 * @param body - the parsed response body.
 * @returns the normalized search result.
 * @throws WebError `WEB_PROVIDER_ERROR` when the body carries no results array.
 */
export declare function mapExaResponse(body: unknown): WebSearchResult;
export {};
