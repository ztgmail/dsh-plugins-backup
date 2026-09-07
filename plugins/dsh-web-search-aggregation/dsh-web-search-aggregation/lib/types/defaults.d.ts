/**
 * The single source of the per-kind constants BOTH halves of the package
 * read: the host adapters/config and the browser card. A client bundle must
 * not value-import `@deepseek-ai/*` packages (and the host modules pull them
 * in), so every constant the two halves share lives in THIS zero-import
 * module instead of being mirrored — the browser half bundles it directly.
 *
 * @module dsh-web-search-aggregation/defaults
 */
/** Provider kinds this package can drive, in the display order the card shows. */
export declare const PROVIDER_KINDS: readonly ["anysearch", "tinyfish", "tavily", "brave", "exa", "firecrawl", "jina", "serpapi", "serper"];
/** One provider kind. */
export type ProviderKind = typeof PROVIDER_KINDS[number];
/**
 * The single credential reference each kind reads: its value is the
 * provider's keys joined by `,` (a single key is stored bare).
 */
export declare const KIND_CREDENTIAL_REF: Readonly<Record<ProviderKind, string>>;
/**
 * Each provider's API-key format, shown as the add-key input's placeholder
 * (the providers' documented key prefixes).
 */
export declare const KIND_KEY_PLACEHOLDER: Readonly<Record<ProviderKind, string>>;
/**
 * Each provider's default endpoint base — the SAME constants the adapters
 * serve as `defaultBaseURL` and the card shows as the Base URL input's
 * placeholder when the entry carries no override.
 */
export declare const KIND_DEFAULT_BASE_URL: Readonly<Record<ProviderKind, string>>;
/** Lower bound for one attempt's timeout: below this, fallback is meaningless. */
export declare const MIN_ATTEMPT_TIMEOUT_MS = 1000;
/** Upper bound for one attempt's timeout: the tool-level budget is 60 s. */
export declare const MAX_ATTEMPT_TIMEOUT_MS = 60000;
/** Default per-attempt timeout: leaves room for 5–6 fallbacks inside the tool budget. */
export declare const DEFAULT_ATTEMPT_TIMEOUT_MS = 10000;
