/**
 * Shared HTTP plumbing for the search adapters: one JSON request helper with
 * the error mapping every adapter shares (network failure, non-2xx with a
 * best-effort message, malformed JSON), so adapter modules own only their
 * endpoint contract and response mapping.
 *
 * @module dsh-web-search-aggregation/adapters/http
 */
/**
 * Issue one JSON HTTP request and parse a JSON response body. A
 * network-level failure that looks transient (DNS blip, reset) is retried
 * once after a short backoff, inside the SAME attempt budget — the caller's
 * signal still bounds the whole loop, so worst-case timing is unchanged.
 *
 * @param kind - provider kind, used to prefix error messages.
 * @param url - the absolute request URL.
 * @param init - method, headers, body; the signal rides here.
 * @returns the parsed response body.
 * @throws WebError `WEB_ABORTED` when the caller's signal aborted the fetch,
 *   `WEB_PROVIDER_ERROR` for network failures, non-2xx statuses, and bodies
 *   that are not valid JSON.
 */
export declare function jsonRequest(kind: string, url: string, init: {
    method: 'GET' | 'POST';
    headers: Record<string, string>;
    body?: string;
    signal?: AbortSignal;
}): Promise<unknown>;
/**
 * Read one object field as a non-blank optional string — the adapters'
 * narrowing helper for optional upstream text fields.
 *
 * @param value - the parsed response object.
 * @param field - the field to read.
 * @returns the trimmed string, or `undefined` when absent or not a string.
 */
export declare function optionalText(value: Record<string, unknown>, field: string): string | undefined;
