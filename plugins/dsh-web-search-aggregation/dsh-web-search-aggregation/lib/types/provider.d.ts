/**
 * `AggregatedSearchProvider`: one `WebSearchProvider` whose backend is a
 * prioritized queue of upstream entries. Per request it walks enabled entries
 * in configured order; within an entry it walks the keys parsed from the
 * kind's single credential (a `,`-joined pool) starting at a rotating cursor;
 * the first attempt that returns wins and every failure is recorded, so an
 * all-failed call can report each attempt. Caller cancellation stops the walk
 * immediately; the per-attempt timeout bounds one hung upstream.
 *
 * @module dsh-web-search-aggregation/provider
 */
import type { WebSearchProvider, WebSearchRequest, WebSearchResult } from '@deepseek-ai/dsh-web';
import type { AggregatedSearchConfig } from './types.ts';
/** Stable id this provider registers under. */
export declare const AGGREGATED_PROVIDER_ID = "aggregated";
/** The minimal logger face the provider needs (cordis loggers satisfy it). */
export interface ProviderLogger {
    /** Routine attempt outcomes. */
    info: (format: string, ...args: unknown[]) => void;
    /** Failed attempts worth operator attention. */
    warn: (format: string, ...args: unknown[]) => void;
}
/** Options the plugin's `apply` supplies; both thunks are read per request. */
export interface AggregatedSearchProviderOptions {
    /** The currently authoritative resolved config. */
    config: () => AggregatedSearchConfig;
    /** Resolve one credential reference; `undefined` when no layer supplies it. */
    resolveKey: (ref: string) => Promise<string | undefined>;
    /** Logger for attempt outcomes; secrets never reach it. */
    logger: ProviderLogger;
}
/**
 * The queue-backed search provider registered as `ctx.web`'s `aggregated`
 * provider. Config is projected per request, so a committed settings change
 * reaches the next search with no re-registration.
 */
export declare class AggregatedSearchProvider implements WebSearchProvider {
    private readonly options;
    readonly id = "aggregated";
    /**
     * Rotation cursors keyed by entry signature (kind + endpoint): the
     * resolved-key index the next request for that entry starts at. A signature
     * change (edited endpoint) intentionally resets the rotation.
     */
    private readonly cursors;
    constructor(options: AggregatedSearchProviderOptions);
    /** Cheap local check: at least one enabled entry is configured. */
    available(): boolean;
    /**
     * Run one search through the queue: entries in order, keys in rotation
     * order per entry, first success returned.
     *
     * @param request - the query and optional result limit.
     * @param signal - caller cancellation; aborts the walk immediately.
     * @returns the first successful attempt's normalized result.
     * @throws WebError `WEB_ABORTED` when the caller cancelled, `WEB_PROVIDER_UNAVAILABLE`
     *   when no enabled entry exists, `WEB_PROVIDER_ERROR` with the per-attempt
     *   summary when every attempt failed.
     */
    search(request: WebSearchRequest, signal?: AbortSignal): Promise<WebSearchResult>;
    /**
     * Resolve an entry's key pool: read the kind's single fixed credential and
     * split its `,`-joined value into key literals. A missing/empty credential
     * records one failure (visibility for the all-failed summary; the entry
     * may still proceed anonymously when the adapter allows it).
     */
    private resolveKeys;
    /**
     * Run one attempt under its own timeout budget. A caller abort propagates
     * (the walk stops — `undefined`); every other failure is returned for
     * recording.
     */
    private attempt;
    /** The rotation-start cursor stored for one entry signature. */
    private cursorOf;
    /** Advance one entry's rotation cursor by one request. */
    private advanceCursor;
}
/**
 * Reorder one key list so it starts at `cursor` and wraps once — the
 * round-robin attempt order for one entry.
 *
 * @param keys - the resolved keys in stored order.
 * @param cursor - the rotation start index.
 * @returns the keys in attempt order.
 */
export declare function rotation<T>(items: readonly T[], cursor: number): T[];
