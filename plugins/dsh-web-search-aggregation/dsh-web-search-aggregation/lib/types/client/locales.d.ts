/**
 * Locale bundles for the aggregated-search card (the plugin's own dictionary
 * namespace, registered with the client locale service).
 *
 * @module dsh-web-search-aggregation/client/locales
 */
/** Locale keys this card renders. */
export type AggregationLocaleKey = 'title' | 'description' | 'attemptTimeout' | 'attemptTimeoutHint' | 'queueLabel' | 'queueHint' | 'kindAnysearch' | 'kindTinyfish' | 'kindTavily' | 'kindBrave' | 'kindExa' | 'kindFirecrawl' | 'kindJina' | 'kindSerpapi' | 'kindSerper' | 'providerKind' | 'entryEnabled' | 'entryEnabledHint' | 'moveUp' | 'moveDown' | 'removeEntry' | 'keysLabel' | 'keyConfigured' | 'keyUnset' | 'keyStaged' | 'addKey' | 'removeKey' | 'kindAlreadyQueued' | 'duplicateKind' | 'baseURL' | 'overridden' | 'reset' | 'invalidText' | 'invalidNumber' | 'expand' | 'collapse' | 'unsaved' | 'readOnly' | 'saveFailed' | 'discard' | 'save' | 'saving';
/** This plugin's dictionary namespace, merged into the locale key map. */
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        'web-search-aggregation': AggregationLocaleKey;
    }
}
/** English copy. */
export declare const en: Record<AggregationLocaleKey, string>;
/** 中文文案。 */
export declare const zh: Record<AggregationLocaleKey, string>;
