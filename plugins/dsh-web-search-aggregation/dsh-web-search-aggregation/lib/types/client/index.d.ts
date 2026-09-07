/**
 * Browser half of `dsh-web-search-aggregation`: registers the locale
 * dictionary and the plugin-configuration card keyed by the
 * `web-search-aggregation` settings namespace, so the card pairs with the
 * Host section the plugin half registers — the shipped configurable-plugins
 * tab dispatches it with no changes.
 *
 * @module dsh-web-search-aggregation/client
 */
import type { Context } from 'cordis';
/** Required services (cordis fiber inject). */
export declare const inject: string[];
/**
 * Mount the aggregated-search plugin-configuration card.
 * @param ctx - the browser plugin context.
 */
export declare function apply(ctx: Context): void;
