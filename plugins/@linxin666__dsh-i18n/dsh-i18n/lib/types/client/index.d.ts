/**
 * Browser-half entry for the dsh-i18n language pack — runs inside the dsh web
 * GUI. Registers the Русский language into the shared locale catalog and then
 * registers one ru dictionary per family plugin namespace (single-locale
 * untyped overload — language-pack contributions; no LocaleNamespaceMap merge
 * is declared, so nothing collides with the packages' own zh/en typed
 * registrations).
 *
 * Ordering and failure semantics (verified against
 * @deepseek-ai/dsh-client-locale 0.1.2-alpha.2):
 *   - `addLanguage` throws when the id is occupied (e.g. the user installed
 *     another ru provider) or the fallback chain is broken. A throw only means
 *     the DEFINITION was not added; dictionary registration is independent —
 *     lookup resolves the fallback chain at call time. So a failed
 *     addLanguage does not abort the dictionary loop: if another pack already
 *     defined ru, our dictionaries still feed it; if none ever defines ru,
 *     the extra dictionaries are inert.
 *   - `register(ns, 'ru', dict)` throws on a duplicate (ns, locale) — another
 *     owner already contributes that ns — and the existing owner's dictionary
 *     must keep working, so a failed ns registration skips just that ns.
 *   - Every disposer is idempotent; the combined teardown releases only what
 *     actually registered.
 * @module @linxin666/dsh-i18n/client
 */
import type { Context as ClientContext } from '@deepseek-ai/cordis';
/** The language this pack adds: id, self-described label, English fallback. */
export declare const RU_LANGUAGE: {
    readonly id: "ru";
    readonly label: "Русский";
    readonly fallback: "en";
};
/** Services required by the browser half. */
export declare const inject: string[];
/**
 * Register the ru language and every covered namespace's ru dictionary.
 * @param ctx - client root context.
 */
export declare function apply(ctx: ClientContext): void;
