/**
 * `JinaAdapter`: `POST {base}/` with a Bearer key (see docs.jina.ai — Search
 * Foundation / Search API, and the live spec at s.jina.ai/openapi.json). The
 * current contract takes the query as a JSON body (`{"q": …}`); a key is
 * MANDATORY (anonymous calls answer 401 AuthenticationRequiredError). Sends
 * `X-Respond-With: no-content` — the documented SERP-only mode, which skips
 * visiting every result page: each row then carries the SERP entry itself
 * (title / url / description / publishedTime) with no per-page fetch latency
 * or token cost. `X-Retain-Images: none` keeps page content image-free. The
 * documented `num` (0–20) is sent ONLY when the request carries a result
 * count — Jina's own docs warn it can add latency, so an unspecified count
 * inherits the API default instead of forcing one. The EU-residency mirror
 * (`https://eu.s.jina.ai`) or a proxy base overrides through `baseURL`.
 *
 * @module dsh-web-search-aggregation/adapters/jina
 */
import type { WebSearchResult, WebSearchSource } from '@deepseek-ai/dsh-web';
import type { SearchAdapter } from './adapter.ts';
/** Public Jina Search API origin (single source: `defaults.ts`). */
export declare const JINA_DEFAULT_BASE_URL: string;
/** Jina's documented maximum for `num` (validated 0–20 upstream). */
export declare const JINA_MAX_NUM = 20;
/**
 * Clamp one requested result count into Jina's 1–20 `num` window. Only used
 * when the request actually carries a count; otherwise `num` is omitted so
 * the API default applies.
 *
 * @param count - the raw requested count.
 * @returns the clamped count.
 */
export declare function jinaNum(count: number): number;
/**
 * One result row of Jina's search response (`data[]`, a FormattedPage as the
 * reader codebase shapes it), as far as this adapter reads it.
 */
interface JinaRow {
    title?: unknown;
    url?: unknown;
    description?: unknown;
    publishedTime?: unknown;
}
/**
 * Map one Jina result row to a normalized source; rows without a usable URL
 * are dropped. The SERP snippet rides `description` (with
 * `X-Respond-With: no-content` the rows carry no page `content`).
 *
 * @param row - one `data[]` row.
 * @returns the normalized source, or `undefined` to drop.
 */
export declare function mapJinaRow(row: JinaRow): WebSearchSource | undefined;
/** The Jina search adapter; a key is mandatory. */
export declare const jinaAdapter: SearchAdapter;
/**
 * Map a Jina search response to the normalized result: the JSON envelope
 * (`Accept: application/json`) is `{code, status, data: […]}` with one
 * FormattedPage row per result; a bare array is accepted too, so an envelope
 * drift does not break the adapter.
 *
 * @param body - the parsed response body.
 * @returns the normalized search result.
 * @throws WebError `WEB_PROVIDER_ERROR` when neither shape carries a results
 *   array.
 */
export declare function mapJinaResponse(body: unknown): WebSearchResult;
export {};
