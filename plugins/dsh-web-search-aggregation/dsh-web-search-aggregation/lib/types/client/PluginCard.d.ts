/**
 * The card chrome — a faithful local copy of the shipped `ui-settings-plugins`
 * PluginCard (disclosure header, unsaved marker, save/discard footer), with
 * the chevron inlined so the bundle stays self-contained.
 *
 * @module dsh-web-search-aggregation/client/PluginCard
 */
import { type ReactNode } from 'react';
import type { CardShell } from './form.ts';
/** Copy keys the chrome itself renders (the card's dictionary supplies them). */
export interface CardChromeCopy {
    expand: string;
    collapse: string;
    unsaved: string;
    readOnly: string;
    saveFailed: string;
    discard: string;
    save: string;
    saving: string;
}
/** Card chrome props. */
export interface PluginCardProps {
    /** Chrome copy (a subset of the card's locale keys). */
    copy: CardChromeCopy;
    /** The plugin's display name. */
    title: string;
    /** The line describing what this plugin's settings govern. */
    description: string;
    /** The card's form state: availability, writability, and what a save would do. */
    state: CardShell;
    /** Write every staged edit. */
    onSave: () => void;
    /** Drop every staged edit. */
    onDiscard: () => void;
    /** The plugin's controls. */
    children: ReactNode;
}
/**
 * Render the aggregated-search card's chrome.
 * @param props - the card's copy, name, form state, and controls.
 * @returns the card, or nothing when the namespace is unavailable.
 */
export declare function PluginCard(props: PluginCardProps): import("react").JSX.Element | null;
