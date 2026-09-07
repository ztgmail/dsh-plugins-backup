/**
 * The aggregated-search card's controls: the shipped ValueField and
 * CheckboxField (faithful local copies), a select for the provider kind, and
 * the per-entry API-key editor (one fixed credential per provider; its keys
 * staged as masked, closable tags in storage order) — all styled on the same
 * tokens and rhythm as the built-in plugin-configuration fields.
 *
 * @module dsh-web-search-aggregation/client/fields
 */
import { type ReactNode } from 'react';
/** A staged text field (copy of the shipped ValueField). */
export declare function ValueField(props: {
    id: string;
    label: string;
    hint: string;
    text: string;
    overridden: boolean;
    invalid: boolean;
    overriddenLabel: string;
    resetLabel: string;
    invalidLabel: string;
    disabled: boolean;
    placeholder?: string;
    onEdit: (text: string) => void;
    onReset: () => void;
}): import("react").JSX.Element;
/** A staged checkbox: one entry's enabled toggle (hint inline after the label). */
export declare function CheckboxField(props: {
    id: string;
    label: string;
    hint: string;
    checked: boolean;
    disabled: boolean;
    onEdit: (checked: boolean) => void;
}): import("react").JSX.Element;
/** One option of the provider-kind select. */
export interface SelectOption {
    /** The stored value (`anysearch` | `tinyfish` | `tavily`). */
    value: string;
    /** Option label. */
    label: string;
}
/** A staged select: the provider-kind picker inside one entry. */
export declare function SelectField(props: {
    id: string;
    label: string;
    value: string;
    options: readonly SelectOption[];
    disabled: boolean;
    onEdit: (value: string) => void;
}): import("react").JSX.Element;
/** The per-entry API-key control's view: one fixed credential per provider. */
export interface KeysFieldView {
    /** The kind's fixed credential reference (`TAVILY_API_KEY`, …). */
    ref: string;
    /** The staged keys as masked tags, in storage order. */
    tags: string[];
    /** Whether a save would write the credential. */
    staged: boolean;
    /** Whether any layer supplies a value for the reference. */
    configured: boolean | undefined;
}
/**
 * One entry's API-key editor: the kind's single fixed credential (shown as
 * a ref badge with its presence), the staged keys as masked closable tags,
 * and an input with a `+` button (Enter works too). Tag order is the order
 * a save writes and the runtime reads. The credentials API is value-free on
 * read, so stored literals are never echoed back — a save REPLACES the whole
 * stored value, and closing every tag makes it clear the credential.
 */
export declare function KeysField(props: {
    view: KeysFieldView;
    label: string;
    placeholder: string;
    configuredLabel: string;
    unsetLabel: string;
    stagedLabel: string;
    addLabel: string;
    removeLabel: string;
    disabled: boolean;
    onAdd: (literal: string) => void;
    onRemove: (keyIndex: number) => void;
    onReset: () => void;
}): import("react").JSX.Element;
/** A generic small header row with trailing content (used by the queue section). */
export declare function SectionHead(props: {
    label: string;
    children?: ReactNode;
}): import("react").JSX.Element;
