/**
 * The dsh-usage host service: folds live session usage into the persistent
 * ledger, probes each configured provider's balance/coding-plan endpoint on
 * a poll cycle, and announces the current provider's status to the pet
 * bubble. Secrets stay in the host process; the browser only ever sees the
 * overview document.
 * @module @linxin666/dsh-usage/host/usage-service
 */
import type { Context } from '@deepseek-ai/cordis';
import type { ProviderSnapshotView, UsageOverviewView } from '../core/types.ts';
/** Source tag the plugin stamps onto pet announcements. */
export declare const USAGE_ANNOUNCE_SOURCE = "dsh-usage";
/** Poll-loop and announce options; re-applied live on settings change. */
export interface UsageServiceOptions {
    pollIntervalSec: number;
    bubbleMode: 'always' | 'change' | 'off';
    retainDays: number;
}
/** Format a balance for display: symbol prefix when known, code suffix otherwise. */
export declare function formatMoney(currency: string, totalBalance: string): string;
/** Map a used percent to the announcement tone. */
export declare function planTone(percent: number): 'ok' | 'warn' | 'low';
/** Announcement context the service computes per poll: today's family spend and the DeepSeek period. */
export interface AnnounceContext {
    /** Today's ledger spend for the announced provider's family (CNY; 0 = unpriced). */
    todayCost?: number;
    /** Whether DeepSeek peak pricing is in effect right now. */
    peak?: boolean;
}
/**
 * Build the raw pet announce payload for one provider snapshot, or
 * undefined when nothing worth announcing exists. Pure: every payload this
 * returns satisfies the pet's `parseAnnouncement` contract — plan
 * announcements require a numeric percent, so percent-less windows never
 * announce (the pet validator would silently drop them). A priced family
 * (DeepSeek) with spend today announces a cost bubble first; balance-only
 * families announce the balance; plan families announce their tightest
 * percent window.
 */
export declare function buildAnnouncement(snapshot: Pick<ProviderSnapshotView, 'displayName' | 'balance' | 'plan'>, context?: AnnounceContext): Record<string, unknown> | undefined;
export declare class UsageService {
    private readonly ctx;
    private options;
    private readonly persistDir;
    private readonly ledgerPath;
    private readonly snapshotsPath;
    private ledger;
    private readonly snapshots;
    /** Per-live-session route attribution (WeakMap: disposed sessions age out). */
    private readonly sessionRoutes;
    /** The most recent route seen this boot; the pet bubble follows it. */
    private current;
    private sessionListenerDisposer;
    private pollTimer;
    private flushTimer;
    private pollInFlight;
    /** The running poll cycle; manual refresh joins it instead of no-oping. */
    private pollPromise;
    /** Serialized ledger flushes: overlapping debounce/stop flushes queue, never interleave. */
    private flushChain;
    /** True once loadPersisted finished; nothing may overwrite the files before that. */
    private loaded;
    private disposed;
    private lastSignature;
    /** Last prune guard: once per local day, and whenever retention shrinks. */
    private lastPrune;
    constructor(ctx: Context, options: UsageServiceOptions);
    /** Start the listeners, load persisted state, and arm the first poll. */
    start(): void;
    /**
     * Stop timers and flush pending ledger writes. The returned promise
     * resolves after the final flush lands, so a successor instance (quick
     * disable → enable) can serialize its first load behind it.
     */
    stop(): Promise<void>;
    /** Re-apply options live (settings change); retention shrink prunes now. */
    applyOptions(options: UsageServiceOptions): void;
    /** Force one poll now (manual refresh route); joins an in-flight cycle. */
    refresh(): Promise<void>;
    /** Assemble the overview document the browser section renders. */
    overview(): UsageOverviewView;
    /** One local day aggregated per provider. */
    private daySummary;
    /** Today's ledger spend for one provider's adapter family (0 when unpriced). */
    private familyCostToday;
    private onSessionEvent;
    /**
     * Normalize a provider TokenUsage into the ledger bucket (one call). The
     * DeepSeek official family is priced at the fold instant (its billing
     * period is time-of-day); other families stay unpriced (cost 0).
     */
    private totalsFrom;
    private loadPersisted;
    private scheduleFlush;
    /**
     * Queue one ledger flush behind the previous one. Debounce and stop-time
     * flushes serialize here, so two `writeJsonAtomic` calls can never run
     * concurrently on the same path.
     */
    private flushLedger;
    private writeLedgerOnce;
    /**
     * Prune days past retention. Runs at most once per local day and whenever
     * `retainDays` shrinks — not only at startup, so long-lived processes and
     * live settings changes both honor retention.
     */
    private pruneIfNeeded;
    private persistSnapshots;
    private rearmPoll;
    /**
     * One poll cycle: enumerate routes, resolve credentials, probe, announce.
     * A call while a cycle is already running joins that cycle instead of
     * returning immediately, so a manual refresh always waits for real probes.
     */
    pollNow(): Promise<void>;
    private listProviderRoutes;
    private probeRoute;
    /**
     * Resolve the credential backing one route: pi-ai credential records
     * first, then the profile's apiKeyEnv reference, then the DeepSeek
     * official adapter's env reference. OAuth grants hand their stored access
     * token to the oauth-aware adapters (Codex plan quota); a stale token
     * fails its probe with a 401 and refreshes the next time the harness
     * itself runs that provider.
     */
    private resolveCredential;
    /** The llm-pi-ai profile object for one provider route, when configured. */
    private piAiProfile;
    /** The DeepSeek official adapter's credential reference name. */
    private deepseekApiKeyEnv;
    /**
     * Announce the current provider's spend, balance, or plan usage to the pet.
     * In `change` mode only meaningful value changes re-announce; `off` skips.
     * The TTL rides the poll interval (bubble_mode `always` re-announces every
     * cycle, so a TTL of two cycles + margin keeps the bubble continuous
     * across polls; the pet contract caps the ceiling). A route id the
     * catalogs spell differently than the snapshot keys falls back to its
     * adapter family's snapshot. Fully guarded: a malformed snapshot or a
     * failing pet service must never break the poll loop, and a disposed
     * service never announces.
     */
    private announceCurrent;
}
