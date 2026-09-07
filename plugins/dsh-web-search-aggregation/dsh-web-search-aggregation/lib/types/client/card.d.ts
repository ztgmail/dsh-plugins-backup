/**
 * The aggregated-search plugin-configuration card: the prioritized provider
 * queue (one entry block per provider — kind, enabled, the single API-key
 * credential, endpoint), the per-attempt timeout, and the queue-level reset —
 * staged and saved through the controller like the built-in plugin cards.
 * Each provider kind can be queued once; its one credential holds all its
 * keys joined by `,`.
 *
 * @module dsh-web-search-aggregation/client/card
 */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { AggregatedCardFace } from './controller.ts';
/** Props the renderer binds for the aggregated-search card. */
export type AggregatedCardProps = PropsRuntime<'settings.plugin.item'> & PropsLocale<'web-search-aggregation'> & InjectFace<AggregatedCardFace>;
/**
 * Render the aggregated-search card.
 * @param props - locale copy, the card snapshot, and its form actions.
 * @returns the card.
 */
export declare function AggregatedCard(props: AggregatedCardProps): import("react").JSX.Element;
