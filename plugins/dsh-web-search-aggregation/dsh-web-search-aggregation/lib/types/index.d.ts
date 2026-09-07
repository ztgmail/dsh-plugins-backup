/**
 * `dsh-web-search-aggregation`: registers the queue-backed
 * {@link AggregatedSearchProvider} with `ctx.web` and exposes its settings
 * section ('web-search-aggregation') so the web client's plugin-configuration
 * card can edit the queue live — a committed change reaches the next search
 * without a restart.
 *
 * A function plugin (NOT a default-export service): like the shipped search
 * providers, it registers INTO the web seam's search registry.
 *
 * @module dsh-web-search-aggregation
 */
import type { Context } from '@deepseek-ai/cordis';
import type { ConfigInput } from './config.ts';
export { Config, DEFAULT_QUEUE, resolveConfig } from './config.ts';
export { DEFAULT_ATTEMPT_TIMEOUT_MS, DEFAULT_KEY_REF, MAX_ATTEMPT_TIMEOUT_MS, MIN_ATTEMPT_TIMEOUT_MS, } from './config.ts';
export { formatApiKeys, keyRefLabel, maskApiKey, parseApiKeys } from './keys.ts';
export type { AggregatedSearchConfig, AttemptFailure, QueueEntry, SearchProviderKind, } from './types.ts';
export type { ConfigInput } from './config.ts';
export { ADAPTERS, ANYSEARCH_DEFAULT_BASE_URL, BRAVE_DEFAULT_BASE_URL, BRAVE_DEFAULT_COUNT, BRAVE_MAX_COUNT, EXA_DEFAULT_BASE_URL, EXA_DEFAULT_NUM_RESULTS, EXA_MAX_NUM_RESULTS, FIRECRAWL_DEFAULT_BASE_URL, FIRECRAWL_DEFAULT_LIMIT, FIRECRAWL_MAX_LIMIT, JINA_DEFAULT_BASE_URL, JINA_MAX_NUM, SERPAPI_DEFAULT_BASE_URL, SERPAPI_MAX_NUM, SERPER_DEFAULT_BASE_URL, SERPER_MAX_NUM, SERPER_MIN_NUM, TAVILY_DEFAULT_BASE_URL, TAVILY_DEFAULT_MAX_RESULTS, TINYFISH_DEFAULT_BASE_URL, braveCount, braveURL, exaNumResults, firecrawlLimit, jinaNum, mapBraveResponse, mapBraveRow, mapExaResponse, mapExaRow, mapFirecrawlResponse, mapFirecrawlRow, mapJinaResponse, mapJinaRow, mapSerpApiResponse, mapSerpApiRow, serpapiNum, serpapiURL, mapSerperResponse, mapSerperRow, serperNum, } from './adapters/index.ts';
export { AggregatedSearchProvider, AGGREGATED_PROVIDER_ID } from './provider.ts';
export type { AggregatedSearchProviderOptions, ProviderLogger, } from './provider.ts';
/** Cordis plugin name used by loader diagnostics. */
export declare const name = "dsh-web-search-aggregation";
/** The capability seams this plugin registers into. */
export declare const inject: string[];
/** Settings namespace carrying this provider's configuration card. */
export declare const WEB_SEARCH_AGGREGATION_SETTINGS_NAMESPACE: import("@deepseek-ai/dsh-settings").SettingsNamespace;
/**
 * Register the aggregated search provider with `ctx.web`.
 *
 * @param ctx - plugin context supplying the web seam and the credentials domain.
 * @param config - the composition entry config; also the settings section's base layer.
 */
export declare function apply(ctx: Context, config?: ConfigInput): void;
