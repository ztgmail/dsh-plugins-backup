/**
 * The aggregated-search card's controller: the staged queue over the
 * `web-search-aggregation` settings namespace, projected into one snapshot
 * the card's slot entry injects.
 *
 * The queue is ONE structured section field (`providers`), staged whole: the
 * draft lives here until the card's save writes it in one `scope.set`. A
 * provider kind appears at most once, and each entry owns exactly one
 * credential — the kind's fixed `XXX_API_KEY` reference — whose value holds
 * all the provider's keys joined by `,`. Keys are added one at a time through
 * the card's input (+ or Enter); each becomes a masked, closable tag, and the
 * tag order IS the order a save writes and the runtime reads. Key literals
 * never enter the section, and the credentials API is value-free on read
 * (presence facts only), so stored literals are never echoed back — a save
 * REPLACES the credential's whole value, and removing every tag clears it.
 *
 * @module dsh-web-search-aggregation/client/controller
 */
import type { IApiClient } from '@deepseek-ai/dsh-client-connection/client';
import type { SettingsScope } from '@deepseek-ai/dsh-client-runtime/client';
import { KIND_CREDENTIAL_REF, KIND_DEFAULT_BASE_URL, KIND_KEY_PLACEHOLDER, PROVIDER_KINDS } from '../defaults.ts';
import type { ProviderKind } from '../defaults.ts';
import type { CardFieldState, CardShell, SnapshotStore } from './form.ts';
export { KIND_CREDENTIAL_REF, KIND_DEFAULT_BASE_URL, KIND_KEY_PLACEHOLDER, PROVIDER_KINDS };
export type { ProviderKind };
/**
 * Settings namespace this card edits. Spelled here rather than imported: a
 * client package must not depend on a Host package.
 */
export declare const WEB_SEARCH_AGGREGATION_NS = "web-search-aggregation";
/** The section fields this card edits (mirrors the Host schema). */
export interface AggregatedSettingsSection {
    /** The prioritized queue; the resolved section always carries it. */
    providers?: Array<{
        kind: ProviderKind;
        enabled: boolean;
        baseURL?: string;
    }>;
    /** Per-attempt timeout (ms). */
    attemptTimeoutMs?: number;
}
/** The editable form of one queue entry while staged. */
export interface EntryDraft {
    kind: ProviderKind;
    enabled: boolean;
    /** Endpoint override; empty = the adapter default. */
    baseURL: string;
    /**
     * The staged key list for the kind's credential, in the exact order a save
     * writes and the runtime reads, or `undefined` while untouched (the stored
     * credential stays as-is). `[]` means "clear the stored keys".
     */
    keysDraft: string[] | undefined;
}
/** What the card renders for one entry. */
export interface EntryView {
    /** Queue position (1-based) as shown in the entry header. */
    position: number;
    kind: ProviderKind;
    enabled: boolean;
    baseURL: string;
    /** The entry's one credential control: fixed ref, masked key tags, presence. */
    keys: {
        /** The kind's fixed credential reference (`TAVILY_API_KEY`, …). */
        ref: string;
        /** The staged keys as masked tags, in storage order. */
        tags: string[];
        /** Whether a save would write the credential. */
        staged: boolean;
        /** Whether any layer supplies a value for the reference. */
        configured: boolean | undefined;
    };
    /** Why this entry blocks saving, when it does. */
    invalidReason: string | undefined;
}
/** What the aggregated card renders. */
export interface AggregatedCardState extends CardShell {
    /** Per-attempt timeout control. */
    timeout: CardFieldState;
    /** The staged queue, in priority order. */
    entries: EntryView[];
    /** Whether the user layer overrides the whole queue (enables the reset). */
    queueOverridden: boolean;
}
/** The card's mutation and form actions, injected by the slot entry. */
export interface AggregatedCardActions {
    /** Stage a timeout draft; empty re-inherits the default. */
    editTimeout: (text: string) => void;
    /** Clear the timeout's user-layer entry. */
    resetTimeout: () => void;
    /** Move one entry one slot up (-1) or down (+1). */
    moveEntry: (index: number, direction: -1 | 1) => void;
    /** Remove one entry from the queue. */
    removeEntry: (index: number) => void;
    /** Append one entry of `kind` at the queue's end (no-op when already queued). */
    addEntry: (kind: ProviderKind) => void;
    /** Change one entry's provider kind (no-op when another entry already uses it). */
    setKind: (index: number, kind: ProviderKind) => void;
    /** Toggle one entry's enabled flag. */
    setEnabled: (index: number, enabled: boolean) => void;
    /** Stage one entry's endpoint override (empty = default). */
    setBaseURL: (index: number, text: string) => void;
    /**
     * Append one key (or a comma-joined batch pasted into the input) to the
     * entry's staged list: trimmed, split on `,`, empties and keys already
     * staged dropped. The tag order IS the stored and runtime order.
     */
    addKey: (index: number, literal: string) => void;
    /** Remove the staged key at `keyIndex`; removing the last one stages a clear. */
    removeKey: (index: number, keyIndex: number) => void;
    /** Drop the entry's staged key list, leaving the stored credential as-is. */
    resetKeys: (index: number) => void;
    /** Clear the queue's user-layer entry, re-inheriting the shipped default. */
    resetQueue: () => void;
    /** Write every staged edit, then re-seed from what the Host accepted. */
    save: () => void;
    /** Drop every staged edit. */
    discard: () => void;
}
/** The registration-side face the card's slot entry injects. */
export interface AggregatedCardFace extends AggregatedCardActions {
    hooks: {
        /** Card snapshot bound by the renderer as useAggregatedCard. */
        aggregatedCard: SnapshotStore<AggregatedCardState>;
    };
}
/**
 * Bridges the `web-search-aggregation` scope and the credentials domain onto
 * the card. The staged queue and the committed section are compared through
 * one normalization so reformatting-only edits never read dirty.
 */
export declare class AggregatedCardController {
    private readonly scope;
    private readonly api;
    private entries;
    private entriesDrafted;
    private timeoutDraft;
    /** Staged resets, applied by the save like every other edit. */
    private timeoutReset;
    private queueReset;
    private saving;
    private failed;
    private credentials;
    private readonly listeners;
    /**
     * @param scope - the bound settings scope for the `web-search-aggregation` namespace.
     * @param api - wire face used for the key values the entries write.
     */
    constructor(scope: SettingsScope<AggregatedSettingsSection>, api: Pick<IApiClient, 'credentials'>);
    /** Bind one projection of this controller as a snapshot store. */
    bind(): SnapshotStore<AggregatedCardState>;
    /** The card's actions. */
    actions(): AggregatedCardActions;
    /**
     * Re-read presence facts after the Host reports a change to a reference
     * this card shows (a key written from another surface, e.g. the Models page).
     * @param ref - the reference the Host reports as changed.
     */
    refreshCredential(ref: string): void;
    /** Build the face the card's slot registration injects. */
    inject(): AggregatedCardFace;
    /**
     * Write the staged queue: each entry's staged key value through the
     * credentials domain first (so the reference the section implies already
     * resolves), then the section fields, staged resets included. A failure
     * keeps every draft for correcting.
     */
    private save;
    /** The section's current committed value. */
    private section;
    /** Re-seed the staged queue from the section unless edits are in flight. */
    private reseed;
    /** Seed drafts from one scope snapshot; `fromBase` reads the base layer (a staged queue reset). */
    private seed;
    /** Record a whole-queue replacement as a draft. */
    private assign;
    /** Record one entry's replacement as a draft. */
    private mutate;
    /** The entries as a save writes them: trimmed, defaulted, credential-free. */
    private committedEntries;
    /** The staged timeout as a save writes it; `undefined` re-inherits the default. */
    private timeoutValue;
    /** Whether the staged timeout draft is present but not acceptable. */
    private timeoutInvalid;
    /** The first reason the staged queue blocks a save, or undefined. */
    private invalidReason;
    /** Whether anything staged differs from the committed section. */
    private dirty;
    /** The section's queue normalized exactly like {@link committedEntries}. */
    private normalizedSection;
    /** Whether any staged entry still holds an unwritten key value. */
    private pendingKeys;
    /** The controller's projection; `dirty` also honors staged key values. */
    private projection;
    /**
     * Read presence facts for every reference the drafts or the section name.
     * Failures keep the last known badges — the card stays usable and a save
     * still reaches the Host.
     */
    private readCredentials;
    /** Notify every bound stores. */
    private publish;
}
