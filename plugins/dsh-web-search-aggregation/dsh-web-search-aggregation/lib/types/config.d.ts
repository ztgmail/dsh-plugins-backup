/**
 * Config schema, defaults, and normalization for the aggregated search
 * plugin. The schema resolves both the composition entry and the
 * `web-search-aggregation` settings section, so a queue a user writes by
 * hand into `settings.yaml` is validated at the same boundary.
 *
 * One provider kind appears at most once in the queue (normalization keeps
 * the first entry per kind), and each kind reads exactly one fixed
 * credential — `DEFAULT_KEY_REF[kind]` — whose value holds all its API keys
 * joined by `,` (a single key is stored bare; see `keys.ts`).
 *
 * @module dsh-web-search-aggregation/config
 */
import z from '@deepseek-ai/schemastery';
import { DEFAULT_ATTEMPT_TIMEOUT_MS, KIND_CREDENTIAL_REF, MAX_ATTEMPT_TIMEOUT_MS, MIN_ATTEMPT_TIMEOUT_MS } from './defaults.ts';
import type { AggregatedSearchConfig, QueueEntry } from './types.ts';
export { DEFAULT_ATTEMPT_TIMEOUT_MS, MAX_ATTEMPT_TIMEOUT_MS, MIN_ATTEMPT_TIMEOUT_MS, };
/**
 * The single credential reference each kind reads — the conventional
 * environment name. Its value is the provider's keys joined by `,`
 * (single source `KIND_CREDENTIAL_REF` in `defaults.ts`).
 */
export { KIND_CREDENTIAL_REF as DEFAULT_KEY_REF };
/**
 * The shipped default queue: one enabled entry per kind — AnySearch sits
 * first only so the queue serves with no keys configured; beyond that the
 * order carries no meaning and is the user's to arrange in the card.
 */
export declare const DEFAULT_QUEUE: readonly QueueEntry[];
/** Plugin config (all optional — the schema fills constant defaults). */
export type ConfigInput = Partial<AggregatedSearchConfig>;
/** The schemastery schema shared by the composition entry and the settings section. */
export declare const Config: z<AggregatedSearchConfig>;
/**
 * Normalize one queue entry: trim the endpoint override and drop it when
 * empty. (API keys are not part of the entry — the kind's fixed credential
 * carries them; hand-written `apiKeyRefs` rows are simply ignored.)
 *
 * @param entry - the schema-validated entry.
 * @returns the normalized entry.
 */
export declare function normalizeEntry(entry: QueueEntry): QueueEntry;
/**
 * Resolve any accepted config input into the fully-defaulted, normalized
 * form the provider consumes per request. Later entries whose kind already
 * appeared are dropped (one provider can be queued once).
 *
 * @param config - composition entry or settings-section value.
 * @returns the resolved config.
 */
export declare function resolveConfig(config: ConfigInput): AggregatedSearchConfig;
