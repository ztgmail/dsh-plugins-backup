import { credentialRef, isCredentialRefName } from "@deepseek-ai/dsh-credentials";
import { installSettingsSection, settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";
import { WebError } from "@deepseek-ai/dsh-web";
//#region src/defaults.ts
/**
* The single source of the per-kind constants BOTH halves of the package
* read: the host adapters/config and the browser card. A client bundle must
* not value-import `@deepseek-ai/*` packages (and the host modules pull them
* in), so every constant the two halves share lives in THIS zero-import
* module instead of being mirrored — the browser half bundles it directly.
*
* @module dsh-web-search-aggregation/defaults
*/
/** Provider kinds this package can drive, in the display order the card shows. */
const PROVIDER_KINDS = [
	"anysearch",
	"tinyfish",
	"tavily",
	"brave",
	"exa",
	"firecrawl",
	"jina",
	"serpapi",
	"serper"
];
/**
* The single credential reference each kind reads: its value is the
* provider's keys joined by `,` (a single key is stored bare).
*/
const KIND_CREDENTIAL_REF = {
	anysearch: "ANYSEARCH_API_KEY",
	tinyfish: "TINYFISH_API_KEY",
	tavily: "TAVILY_API_KEY",
	brave: "BRAVE_SEARCH_API_KEY",
	exa: "EXA_API_KEY",
	firecrawl: "FIRECRAWL_API_KEY",
	jina: "JINA_API_KEY",
	serpapi: "SERPAPI_API_KEY",
	serper: "SERPER_API_KEY"
};
/**
* Each provider's default endpoint base — the SAME constants the adapters
* serve as `defaultBaseURL` and the card shows as the Base URL input's
* placeholder when the entry carries no override.
*/
const KIND_DEFAULT_BASE_URL = {
	anysearch: "https://api.anysearch.com",
	tinyfish: "https://api.search.tinyfish.ai",
	tavily: "https://api.tavily.com",
	brave: "https://api.search.brave.com",
	exa: "https://api.exa.ai",
	firecrawl: "https://api.firecrawl.dev",
	jina: "https://s.jina.ai",
	serpapi: "https://serpapi.com",
	serper: "https://google.serper.dev"
};
/** Lower bound for one attempt's timeout: below this, fallback is meaningless. */
const MIN_ATTEMPT_TIMEOUT_MS = 1e3;
/** Upper bound for one attempt's timeout: the tool-level budget is 60 s. */
const MAX_ATTEMPT_TIMEOUT_MS = 6e4;
/** Default per-attempt timeout: leaves room for 5–6 fallbacks inside the tool budget. */
const DEFAULT_ATTEMPT_TIMEOUT_MS = 1e4;
//#endregion
//#region src/config.ts
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
/**
* The shipped default queue: one enabled entry per kind — AnySearch sits
* first only so the queue serves with no keys configured; beyond that the
* order carries no meaning and is the user's to arrange in the card.
*/
const DEFAULT_QUEUE = [
	{
		kind: "anysearch",
		enabled: true
	},
	{
		kind: "firecrawl",
		enabled: true
	},
	{
		kind: "tavily",
		enabled: true
	},
	{
		kind: "tinyfish",
		enabled: true
	},
	{
		kind: "brave",
		enabled: true
	},
	{
		kind: "exa",
		enabled: true
	},
	{
		kind: "jina",
		enabled: true
	},
	{
		kind: "serpapi",
		enabled: true
	},
	{
		kind: "serper",
		enabled: true
	}
];
/** The schemastery schema shared by the composition entry and the settings section. */
const Config = z.object({
	providers: z.array(z.object({
		kind: z.union(PROVIDER_KINDS),
		enabled: z.boolean().default(true),
		baseURL: z.string()
	})).default(DEFAULT_QUEUE.map((entry) => ({
		...entry,
		baseURL: ""
	}))),
	attemptTimeoutMs: z.number().step(1).min(MIN_ATTEMPT_TIMEOUT_MS).max(MAX_ATTEMPT_TIMEOUT_MS).default(DEFAULT_ATTEMPT_TIMEOUT_MS)
});
/**
* Normalize one queue entry: trim the endpoint override and drop it when
* empty. (API keys are not part of the entry — the kind's fixed credential
* carries them; hand-written `apiKeyRefs` rows are simply ignored.)
*
* @param entry - the schema-validated entry.
* @returns the normalized entry.
*/
function normalizeEntry(entry) {
	const baseURL = entry.baseURL?.trim();
	return {
		kind: entry.kind,
		enabled: entry.enabled,
		...baseURL !== void 0 && baseURL.length > 0 ? { baseURL } : {}
	};
}
/**
* Resolve any accepted config input into the fully-defaulted, normalized
* form the provider consumes per request. Later entries whose kind already
* appeared are dropped (one provider can be queued once).
*
* @param config - composition entry or settings-section value.
* @returns the resolved config.
*/
function resolveConfig(config) {
	const resolved = Config(config);
	const seen = /* @__PURE__ */ new Set();
	const providers = [];
	for (const raw of resolved.providers) {
		if (seen.has(raw.kind)) continue;
		seen.add(raw.kind);
		providers.push(normalizeEntry(raw));
	}
	return {
		providers,
		attemptTimeoutMs: resolved.attemptTimeoutMs
	};
}
//#endregion
//#region src/adapters/http.ts
/**
* Shared HTTP plumbing for the search adapters: one JSON request helper with
* the error mapping every adapter shares (network failure, non-2xx with a
* best-effort message, malformed JSON), so adapter modules own only their
* endpoint contract and response mapping.
*
* @module dsh-web-search-aggregation/adapters/http
*/
/** Attribution header sent on every upstream request. Bump with the package version. */
const USER_AGENT = "dsh-web-search-aggregation/0.1.10";
/** Cap on an upstream error body kept for diagnostics. */
const MAX_ERROR_CHARS = 300;
/** Backoff before the one transient-network retry (ms); short — blips are sub-second. */
const TRANSIENT_RETRY_DELAY_MS = 150;
/**
* `errno` codes whose fetch failure is plausibly transient (embedded-DNS
* blips like `EAI_AGAIN`, connection resets, dial timeouts). Only these
* earn the single in-budget retry; deterministic failures never do.
*/
const TRANSIENT_ERRNO = /* @__PURE__ */ new Set([
	"EAI_AGAIN",
	"EAI_FAIL",
	"ENOTFOUND",
	"ECONNRESET",
	"ECONNREFUSED",
	"ETIMEDOUT",
	"EPIPE",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"UND_ERR_SOCKET",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_HEADERS_TIMEOUT"
]);
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
async function jsonRequest(kind, url, init) {
	let response;
	try {
		response = await fetchOnce(url, init, kind);
	} catch (error) {
		if (isTransientNetworkError(error)) {
			await sleep(TRANSIENT_RETRY_DELAY_MS);
			try {
				response = await fetchOnce(url, init, kind);
			} catch (retryError) {
				throw requestFailure(kind, retryError);
			}
		} else throw requestFailure(kind, error);
	}
	let body;
	try {
		body = await response.json();
	} catch (error) {
		if (init.signal?.aborted === true) throw aborted(kind, error);
		if (!response.ok) throw new WebError(`${kind} API error (HTTP ${String(response.status)})`, "WEB_PROVIDER_ERROR");
		throw new WebError(`${kind} returned a non-JSON body: ${String(error)}`, "WEB_PROVIDER_ERROR", { cause: error });
	}
	if (!response.ok) throw new WebError(`${kind} API error (HTTP ${String(response.status)}): ${errorDetail(body)}`, "WEB_PROVIDER_ERROR");
	return body;
}
/** The bare fetch call with this helper's shared init projection. */
async function fetchOnce(url, init, kind) {
	try {
		return await fetch(url, {
			method: init.method,
			redirect: "error",
			headers: {
				"user-agent": USER_AGENT,
				...init.headers
			},
			...init.body === void 0 ? {} : { body: init.body },
			...init.signal === void 0 ? {} : { signal: init.signal }
		});
	} catch (error) {
		if (isAbortError(error)) throw aborted(kind, error);
		throw error;
	}
}
/** Resolve after `ms`, ignoring an abort (the retried fetch reports it). */
function sleep(ms) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}
/** True for a fetch/`AbortSignal` abort, mapped to `WEB_ABORTED`. */
function isAbortError(error) {
	return error instanceof DOMException && error.name === "AbortError";
}
/**
* Whether one thrown fetch failure is a transient network-level problem
* worth one retry: undici rejects with `TypeError: fetch failed` whose
* `cause` carries the errno (DNS, reset, dial timeout) or an undici socket
* error. Anything without a recognized transient cause stays final.
*
* @param error - the error `fetch` rejected with.
*/
function isTransientNetworkError(error) {
	if (isAbortError(error)) return false;
	const cause = error?.cause;
	for (const candidate of [cause, error]) {
		if (typeof candidate !== "object" || candidate === null) continue;
		const code = candidate.code;
		if (typeof code === "string" && TRANSIENT_ERRNO.has(code)) return true;
		const message = candidate.message;
		if (typeof message === "string" && (message.includes("socket hang up") || message.includes("other side closed"))) return true;
	}
	return false;
}
/** Wrap one thrown fetch/parse failure: aborts stay aborts, the rest become provider errors. */
function requestFailure(kind, error) {
	if (isAbortError(error)) return aborted(kind, error);
	return new WebError(`${kind} request failed: ${describeNetworkError(error)}`, "WEB_PROVIDER_ERROR", { cause: error });
}
/**
* Describe a fetch-layer failure for the failure record: the undici
* `TypeError: fetch failed` head is useless on its own, so the underlying
* `cause` (errno code + message: the DNS name that failed, the reset
* socket, …) is unwrapped and appended, bounded to the diagnostic cap.
*
* @param error - the error `fetch` rejected with.
* @returns the head plus the cause, e.g.
*   `TypeError: fetch failed: getaddrinfo EAI_AGAIN api.search.brave.com [EAI_AGAIN]`.
*/
function describeNetworkError(error) {
	const head = String(error);
	const cause = error?.cause;
	if (typeof cause !== "object" || cause === null) return head;
	const message = cause.message;
	const code = cause.code;
	const detail = [typeof message === "string" && message.length > 0 ? message : void 0, typeof code === "string" ? `[${code}]` : void 0].filter((part) => part !== void 0).join(" ");
	if (detail.length === 0) return head;
	return `${head}: ${detail.length <= MAX_ERROR_CHARS ? detail : `${detail.slice(0, 299)}…`}`;
}
/** The `WEB_ABORTED` wrapper for one adapter operation. */
function aborted(kind, cause) {
	return new WebError(`${kind} search aborted`, "WEB_ABORTED", { cause });
}
/**
* Extract a bounded human-readable detail from an upstream error body without
* trusting it: `detail` / `message` / `error` string fields are used when
* present; anything else degrades to a stable placeholder.
*
* @param body - the parsed error body, of unknown shape.
* @returns a short safe detail string.
*/
function errorDetail(body) {
	if (typeof body !== "object" || body === null || Array.isArray(body)) return "no detail";
	for (const field of [
		"detail",
		"message",
		"error"
	]) {
		const value = body[field];
		if (typeof value === "string" && value.trim().length > 0) return value.length <= MAX_ERROR_CHARS ? value : `${value.slice(0, 299)}…`;
	}
	return "no detail";
}
/**
* Read one object field as a non-blank optional string — the adapters'
* narrowing helper for optional upstream text fields.
*
* @param value - the parsed response object.
* @param field - the field to read.
* @returns the trimmed string, or `undefined` when absent or not a string.
*/
function optionalText(value, field) {
	const raw = value[field];
	if (typeof raw !== "string") return void 0;
	const trimmed = raw.trim();
	return trimmed.length > 0 ? trimmed : void 0;
}
//#endregion
//#region src/adapters/anysearch.ts
/**
* `AnySearchAdapter`: `POST {base}/v1/search` with an optional Bearer key
* (AnySearch allows anonymous access). Response shape and envelope semantics
* follow the official `anysearch-dsh` integration: `{code: 0, message,
* data: {results: [{title, url, snippet?}]}}`.
*
* @module dsh-web-search-aggregation/adapters/anysearch
*/
/** Public AnySearch API origin (single source: `defaults.ts`). */
const ANYSEARCH_DEFAULT_BASE_URL = KIND_DEFAULT_BASE_URL.anysearch;
/**
* Map one AnySearch result row to a normalized source; rows without a usable
* URL are dropped (the seam requires a citeable URL and inventing one would lie).
*
* @param row - one `data.results[]` row.
* @returns the normalized source, or `undefined` to drop.
*/
function mapAnySearchRow(row) {
	if (typeof row.url !== "string" || !URL.canParse(row.url)) return void 0;
	const title = typeof row.title === "string" ? row.title.trim() : "";
	const snippet = typeof row.snippet === "string" ? row.snippet.trim() : "";
	return {
		url: row.url,
		...title.length > 0 ? { title } : {},
		...snippet.length > 0 ? { snippet } : {}
	};
}
/** The AnySearch search adapter. */
const anySearchAdapter = {
	kind: "anysearch",
	defaultBaseURL: ANYSEARCH_DEFAULT_BASE_URL,
	anonymousOk: true,
	async search(query, maxResults, apiKey, baseURL, signal) {
		return mapAnySearchResponse(await jsonRequest("AnySearch", `${baseURL.replace(/\/+$/u, "")}/v1/search`, {
			method: "POST",
			headers: {
				"accept": "application/json",
				"content-type": "application/json",
				...apiKey !== void 0 ? { authorization: `Bearer ${apiKey}` } : {}
			},
			body: JSON.stringify({
				query,
				...maxResults === void 0 ? {} : { max_results: maxResults }
			}),
			...signal === void 0 ? {} : { signal }
		}));
	}
};
/**
* Map an AnySearch response envelope to the normalized result.
*
* @param body - the parsed response body.
* @returns the normalized search result.
* @throws WebError `WEB_PROVIDER_ERROR` when the envelope reports a business
*   error (`code !== 0`) or carries no results array.
*/
function mapAnySearchResponse(body) {
	if (typeof body !== "object" || body === null || Array.isArray(body)) throw new WebError("AnySearch returned a non-object response body", "WEB_PROVIDER_ERROR");
	const envelope = body;
	const code = envelope.code;
	if (code !== 0) {
		const message = optionalText(envelope, "message") ?? `business code ${String(code)}`;
		throw new WebError(`AnySearch API error: ${message}`, "WEB_PROVIDER_ERROR");
	}
	const data = envelope.data;
	if (typeof data !== "object" || data === null || Array.isArray(data)) throw new WebError("AnySearch response carries no data object", "WEB_PROVIDER_ERROR");
	const rows = data.results;
	if (!Array.isArray(rows)) throw new WebError("AnySearch response carries no results array", "WEB_PROVIDER_ERROR");
	return {
		sources: rows.map((row) => typeof row === "object" && row !== null && !Array.isArray(row) ? mapAnySearchRow(row) : void 0).filter((source) => source !== void 0),
		truncated: false
	};
}
//#endregion
//#region src/adapters/tinyfish.ts
/**
* `TinyFishAdapter`: `GET {base}?query=…` with the `X-API-Key` header (the
* Search API at `api.search.tinyfish.ai` requires a key; see
* docs.tinyfish.ai/search-api). The API exposes no result-count control, so
* the seam's `maxResults` truncation is the only bound.
*
* @module dsh-web-search-aggregation/adapters/tinyfish
*/
/** Public TinyFish Search API origin (single source: `defaults.ts`). */
const TINYFISH_DEFAULT_BASE_URL = KIND_DEFAULT_BASE_URL.tinyfish;
/**
* Build the TinyFish request URL for one query.
*
* @param baseURL - the endpoint base (already defaulted).
* @param query - the search query text.
* @returns the absolute request URL.
* @throws WebError `WEB_PROVIDER_ERROR` when the base is not an absolute URL.
*/
function tinyfishURL(baseURL, query) {
	let url;
	try {
		url = new URL(baseURL);
	} catch (error) {
		throw new WebError(`TinyFish base URL is invalid: ${baseURL}`, "WEB_PROVIDER_ERROR", { cause: error });
	}
	url.searchParams.set("query", query);
	return url.href;
}
/**
* Map one TinyFish result row to a normalized source; rows without a usable
* URL are dropped.
*
* @param row - one `results[]` row.
* @returns the normalized source, or `undefined` to drop.
*/
function mapTinyFishRow(row) {
	if (typeof row.url !== "string" || !URL.canParse(row.url)) return void 0;
	const title = typeof row.title === "string" ? row.title.trim() : "";
	const snippet = typeof row.snippet === "string" ? row.snippet.trim() : "";
	const date = typeof row.date === "string" ? row.date.trim() : "";
	return {
		url: row.url,
		...title.length > 0 ? { title } : {},
		...snippet.length > 0 ? { snippet } : {},
		...date.length > 0 ? { publishedAt: date } : {}
	};
}
/** The TinyFish search adapter; a key is mandatory. */
const tinyFishAdapter = {
	kind: "tinyfish",
	defaultBaseURL: TINYFISH_DEFAULT_BASE_URL,
	anonymousOk: false,
	async search(query, _maxResults, apiKey, baseURL, signal) {
		if (apiKey === void 0) throw new WebError("TinyFish requires an API key and none resolved", "WEB_PROVIDER_ERROR");
		return mapTinyFishResponse(await jsonRequest("TinyFish", tinyfishURL(baseURL, query), {
			method: "GET",
			headers: {
				accept: "application/json",
				"x-api-key": apiKey
			},
			...signal === void 0 ? {} : { signal }
		}));
	}
};
/**
* Map a TinyFish search response to the normalized result.
*
* @param body - the parsed response body.
* @returns the normalized search result.
* @throws WebError `WEB_PROVIDER_ERROR` when the body carries no results array.
*/
function mapTinyFishResponse(body) {
	if (typeof body !== "object" || body === null || Array.isArray(body)) throw new WebError("TinyFish returned a non-object response body", "WEB_PROVIDER_ERROR");
	const rows = body.results;
	if (!Array.isArray(rows)) throw new WebError("TinyFish response carries no results array", "WEB_PROVIDER_ERROR");
	return {
		sources: rows.map((row) => typeof row === "object" && row !== null && !Array.isArray(row) ? mapTinyFishRow(row) : void 0).filter((source) => source !== void 0),
		truncated: false
	};
}
//#endregion
//#region src/adapters/tavily.ts
/**
* `TavilyAdapter`: `POST {base}/search` with a Bearer key (see
* docs.tavily.com/documentation/api-reference/endpoint/search). Sends
* `max_results` as the request-layer cost control and `include_answer` so the
* optional generated answer rides `WebSearchResult.content`.
*
* @module dsh-web-search-aggregation/adapters/tavily
*/
/** Public Tavily API origin (single source: `defaults.ts`). */
const TAVILY_DEFAULT_BASE_URL = KIND_DEFAULT_BASE_URL.tavily;
/** Result count sent when the request carries no `maxResults` (Tavily's own default is 5). */
const TAVILY_DEFAULT_MAX_RESULTS = 5;
/**
* Map one Tavily result row to a normalized source; rows without a usable URL
* are dropped.
*
* @param row - one `results[]` row.
* @returns the normalized source, or `undefined` to drop.
*/
function mapTavilyRow(row) {
	if (typeof row.url !== "string" || !URL.canParse(row.url)) return void 0;
	const title = typeof row.title === "string" ? row.title.trim() : "";
	const content = typeof row.content === "string" ? row.content.trim() : "";
	const published = typeof row.published_date === "string" ? row.published_date.trim() : "";
	return {
		url: row.url,
		...title.length > 0 ? { title } : {},
		...content.length > 0 ? { snippet: content } : {},
		...published.length > 0 ? { publishedAt: published } : {}
	};
}
/** The Tavily search adapter; a key is mandatory. */
const tavilyAdapter = {
	kind: "tavily",
	defaultBaseURL: TAVILY_DEFAULT_BASE_URL,
	anonymousOk: false,
	async search(query, maxResults, apiKey, baseURL, signal) {
		if (apiKey === void 0) throw new WebError("Tavily requires an API key and none resolved", "WEB_PROVIDER_ERROR");
		return mapTavilyResponse(await jsonRequest("Tavily", `${baseURL.replace(/\/+$/u, "")}/search`, {
			method: "POST",
			headers: {
				"accept": "application/json",
				"content-type": "application/json",
				"authorization": `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				query,
				max_results: maxResults ?? 5,
				search_depth: "basic",
				include_answer: true,
				include_raw_content: false,
				include_images: false
			}),
			...signal === void 0 ? {} : { signal }
		}));
	}
};
/**
* Map a Tavily search response to the normalized result; `answer`, when a
* non-blank string, becomes `content`.
*
* @param body - the parsed response body.
* @returns the normalized search result.
* @throws WebError `WEB_PROVIDER_ERROR` when the body carries no results array.
*/
function mapTavilyResponse(body) {
	if (typeof body !== "object" || body === null || Array.isArray(body)) throw new WebError("Tavily returned a non-object response body", "WEB_PROVIDER_ERROR");
	const rows = body.results;
	if (!Array.isArray(rows)) throw new WebError("Tavily response carries no results array", "WEB_PROVIDER_ERROR");
	const sources = rows.map((row) => typeof row === "object" && row !== null && !Array.isArray(row) ? mapTavilyRow(row) : void 0).filter((source) => source !== void 0);
	const answer = body.answer;
	const content = typeof answer === "string" && answer.trim().length > 0 ? answer.trim() : void 0;
	return {
		sources,
		truncated: false,
		...content === void 0 ? {} : { content }
	};
}
//#endregion
//#region src/adapters/brave.ts
/**
* `BraveAdapter`: `GET {base}/res/v1/web/search?q=…&count=…` with the
* `X-Subscription-Token` header (see
* api-dashboard.search.brave.com/api-reference/web/search/get). `count` is
* clamped to the API's 1–20 window (Brave rejects more with a 422), and
* `text_decorations=false` keeps snippets free of the default
* bold-marker decorations. `page_age` (an ISO datetime string) becomes
* `publishedAt`; the human-readable `age` ("2 days ago") is not a date
* and stays out.
*
* @module dsh-web-search-aggregation/adapters/brave
*/
/** Public Brave Search API origin (single source: `defaults.ts`). */
const BRAVE_DEFAULT_BASE_URL = KIND_DEFAULT_BASE_URL.brave;
/** Brave's documented maximum for `count` (1–20). */
const BRAVE_MAX_COUNT = 20;
/** Result count sent when the request carries no `maxResults` (Brave's own default is 20). */
const BRAVE_DEFAULT_COUNT = 20;
/**
* Clamp one requested result count into Brave's 1–20 `count` window.
*
* @param count - the raw requested count.
* @returns the clamped count.
*/
function braveCount(count) {
	return Math.min(Math.max(Math.trunc(count), 1), 20);
}
/**
* Build the Brave request URL for one query.
*
* @param baseURL - the endpoint base (already defaulted).
* @param query - the search query text.
* @param count - the clamped result count.
* @returns the absolute request URL.
* @throws WebError `WEB_PROVIDER_ERROR` when the base is not an absolute URL.
*/
function braveURL(baseURL, query, count) {
	let url;
	try {
		url = new URL(baseURL);
	} catch (error) {
		throw new WebError(`Brave base URL is invalid: ${baseURL}`, "WEB_PROVIDER_ERROR", { cause: error });
	}
	url.pathname = `${url.pathname.replace(/\/+$/u, "")}/res/v1/web/search`;
	url.searchParams.set("q", query);
	url.searchParams.set("count", String(count));
	url.searchParams.set("text_decorations", "false");
	return url.href;
}
/**
* Map one Brave result row to a normalized source; rows without a usable URL
* are dropped.
*
* @param row - one `web.results[]` row.
* @returns the normalized source, or `undefined` to drop.
*/
function mapBraveRow(row) {
	if (typeof row.url !== "string" || !URL.canParse(row.url)) return void 0;
	const title = typeof row.title === "string" ? row.title.trim() : "";
	const description = typeof row.description === "string" ? row.description.trim() : "";
	const pageAge = typeof row.page_age === "string" ? row.page_age.trim() : "";
	return {
		url: row.url,
		...title.length > 0 ? { title } : {},
		...description.length > 0 ? { snippet: description } : {},
		...pageAge.length > 0 ? { publishedAt: pageAge } : {}
	};
}
/** The Brave search adapter; a key (subscription token) is mandatory. */
const braveAdapter = {
	kind: "brave",
	defaultBaseURL: BRAVE_DEFAULT_BASE_URL,
	anonymousOk: false,
	async search(query, maxResults, apiKey, baseURL, signal) {
		if (apiKey === void 0) throw new WebError("Brave requires an API key and none resolved", "WEB_PROVIDER_ERROR");
		return mapBraveResponse(await jsonRequest("Brave", braveURL(baseURL, query, braveCount(maxResults ?? 20)), {
			method: "GET",
			headers: {
				accept: "application/json",
				"x-subscription-token": apiKey
			},
			...signal === void 0 ? {} : { signal }
		}));
	}
};
/**
* Map a Brave search response to the normalized result.
*
* @param body - the parsed response body.
* @returns the normalized search result.
* @throws WebError `WEB_PROVIDER_ERROR` when the body carries no `web.results`
*   array.
*/
function mapBraveResponse(body) {
	if (typeof body !== "object" || body === null || Array.isArray(body)) throw new WebError("Brave returned a non-object response body", "WEB_PROVIDER_ERROR");
	const web = body.web;
	if (typeof web !== "object" || web === null || Array.isArray(web)) throw new WebError("Brave response carries no web results object", "WEB_PROVIDER_ERROR");
	const rows = web.results;
	if (!Array.isArray(rows)) throw new WebError("Brave response carries no results array", "WEB_PROVIDER_ERROR");
	return {
		sources: rows.map((row) => typeof row === "object" && row !== null && !Array.isArray(row) ? mapBraveRow(row) : void 0).filter((source) => source !== void 0),
		truncated: false
	};
}
//#endregion
//#region src/adapters/exa.ts
/**
* `ExaAdapter`: `POST {base}/search` with a Bearer key (see
* exa.ai/docs/reference/search — current docs authenticate via
* `Authorization: Bearer`). Sends `numResults` (1–100, clamped) and
* `contents: { highlights: true }` — Exa's documented agent-workflow mode,
* which attaches the token-efficient `highlights[]` excerpts each result
* row carries as its snippet. Content parameters MUST nest under
* `contents` on `/search`; the deprecated top-level spellings are not used.
*
* @module dsh-web-search-aggregation/adapters/exa
*/
/** Public Exa API origin (single source: `defaults.ts`). */
const EXA_DEFAULT_BASE_URL = KIND_DEFAULT_BASE_URL.exa;
/** Exa's documented maximum for `numResults` (1–100). */
const EXA_MAX_NUM_RESULTS = 100;
/** Result count sent when the request carries no `maxResults` (Exa's own default is 10). */
const EXA_DEFAULT_NUM_RESULTS = 10;
/**
* Clamp one requested result count into Exa's 1–100 `numResults` window.
*
* @param count - the raw requested count.
* @returns the clamped count.
*/
function exaNumResults(count) {
	return Math.min(Math.max(Math.trunc(count), 1), 100);
}
/**
* Map one Exa result row to a normalized source; rows without a usable URL
* are dropped. The first non-blank highlight becomes the snippet (rows
* requested without `contents.highlights` simply carry none).
*
* @param row - one `results[]` row.
* @returns the normalized source, or `undefined` to drop.
*/
function mapExaRow(row) {
	if (typeof row.url !== "string" || !URL.canParse(row.url)) return void 0;
	const title = typeof row.title === "string" ? row.title.trim() : "";
	const published = typeof row.publishedDate === "string" ? row.publishedDate.trim() : "";
	const snippet = (Array.isArray(row.highlights) ? row.highlights.find((part) => typeof part === "string" && part.trim().length > 0) : void 0)?.trim() ?? "";
	return {
		url: row.url,
		...title.length > 0 ? { title } : {},
		...snippet.length > 0 ? { snippet } : {},
		...published.length > 0 ? { publishedAt: published } : {}
	};
}
/** The Exa search adapter; a key is mandatory. */
const exaAdapter = {
	kind: "exa",
	defaultBaseURL: EXA_DEFAULT_BASE_URL,
	anonymousOk: false,
	async search(query, maxResults, apiKey, baseURL, signal) {
		if (apiKey === void 0) throw new WebError("Exa requires an API key and none resolved", "WEB_PROVIDER_ERROR");
		return mapExaResponse(await jsonRequest("Exa", `${baseURL.replace(/\/+$/u, "")}/search`, {
			method: "POST",
			headers: {
				"accept": "application/json",
				"content-type": "application/json",
				"authorization": `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				query,
				numResults: exaNumResults(maxResults ?? 10),
				contents: { highlights: true }
			}),
			...signal === void 0 ? {} : { signal }
		}));
	}
};
/**
* Map an Exa search response to the normalized result.
*
* @param body - the parsed response body.
* @returns the normalized search result.
* @throws WebError `WEB_PROVIDER_ERROR` when the body carries no results array.
*/
function mapExaResponse(body) {
	if (typeof body !== "object" || body === null || Array.isArray(body)) throw new WebError("Exa returned a non-object response body", "WEB_PROVIDER_ERROR");
	const rows = body.results;
	if (!Array.isArray(rows)) throw new WebError("Exa response carries no results array", "WEB_PROVIDER_ERROR");
	return {
		sources: rows.map((row) => typeof row === "object" && row !== null && !Array.isArray(row) ? mapExaRow(row) : void 0).filter((source) => source !== void 0),
		truncated: false
	};
}
//#endregion
//#region src/adapters/firecrawl.ts
/**
* `FirecrawlAdapter`: `POST {base}/v2/search` with a Bearer key (see
* docs.firecrawl.dev/api-reference/endpoint/search). Sends `limit`
* (1–100, clamped) and deliberately NO `scrapeOptions`: the plain search
* costs 2 credits per 10 results and returns `data.web[]` rows of
* url/title/description — enough for the seam, with no per-page scraping
* cost or latency.
*
* @module dsh-web-search-aggregation/adapters/firecrawl
*/
/** Public Firecrawl API origin (single source: `defaults.ts`). */
const FIRECRAWL_DEFAULT_BASE_URL = KIND_DEFAULT_BASE_URL.firecrawl;
/** Firecrawl's documented maximum for `limit` (1–100). */
const FIRECRAWL_MAX_LIMIT = 100;
/** Result count sent when the request carries no `maxResults` (the docs' default limit is 10). */
const FIRECRAWL_DEFAULT_LIMIT = 10;
/**
* Clamp one requested result count into Firecrawl's 1–100 `limit` window.
*
* @param count - the raw requested count.
* @returns the clamped count.
*/
function firecrawlLimit(count) {
	return Math.min(Math.max(Math.trunc(count), 1), 100);
}
/**
* Map one Firecrawl result row to a normalized source; rows without a usable
* URL are dropped.
*
* @param row - one `data.web[]` row.
* @returns the normalized source, or `undefined` to drop.
*/
function mapFirecrawlRow(row) {
	if (typeof row.url !== "string" || !URL.canParse(row.url)) return void 0;
	const title = typeof row.title === "string" ? row.title.trim() : "";
	const description = typeof row.description === "string" ? row.description.trim() : "";
	return {
		url: row.url,
		...title.length > 0 ? { title } : {},
		...description.length > 0 ? { snippet: description } : {}
	};
}
/** The Firecrawl search adapter; a key is mandatory. */
const firecrawlAdapter = {
	kind: "firecrawl",
	defaultBaseURL: FIRECRAWL_DEFAULT_BASE_URL,
	anonymousOk: false,
	async search(query, maxResults, apiKey, baseURL, signal) {
		if (apiKey === void 0) throw new WebError("Firecrawl requires an API key and none resolved", "WEB_PROVIDER_ERROR");
		return mapFirecrawlResponse(await jsonRequest("Firecrawl", `${baseURL.replace(/\/+$/u, "")}/v2/search`, {
			method: "POST",
			headers: {
				"accept": "application/json",
				"content-type": "application/json",
				"authorization": `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				query,
				limit: firecrawlLimit(maxResults ?? 10)
			}),
			...signal === void 0 ? {} : { signal }
		}));
	}
};
/**
* Map a Firecrawl search response to the normalized result.
*
* @param body - the parsed response body.
* @returns the normalized search result.
* @throws WebError `WEB_PROVIDER_ERROR` when the body reports failure
*   (`success === false`) or carries no `data.web` array.
*/
function mapFirecrawlResponse(body) {
	if (typeof body !== "object" || body === null || Array.isArray(body)) throw new WebError("Firecrawl returned a non-object response body", "WEB_PROVIDER_ERROR");
	const envelope = body;
	if (envelope.success === false) {
		const warning = optionalText(envelope, "warning");
		throw new WebError(`Firecrawl reported a failed search${warning === void 0 ? "" : `: ${warning}`}`, "WEB_PROVIDER_ERROR");
	}
	const data = envelope.data;
	if (typeof data !== "object" || data === null || Array.isArray(data)) throw new WebError("Firecrawl response carries no data object", "WEB_PROVIDER_ERROR");
	const rows = data.web;
	if (!Array.isArray(rows)) throw new WebError("Firecrawl response carries no web results array", "WEB_PROVIDER_ERROR");
	return {
		sources: rows.map((row) => typeof row === "object" && row !== null && !Array.isArray(row) ? mapFirecrawlRow(row) : void 0).filter((source) => source !== void 0),
		truncated: false
	};
}
//#endregion
//#region src/adapters/jina.ts
/**
* `JinaAdapter`: `POST {base}/` with a Bearer key (see docs.jina.ai — Search
* Foundation / Search API, and the live spec at s.jina.ai/openapi.json). The
* current contract takes the query as a JSON body (`{"q": …}`); a key is
* MANDATORY (anonymous calls answer 401 AuthenticationRequiredError). Sends
* `X-Respond-With: no-content` — the documented SERP-only mode, which skips
* visiting every result page: each row then carries the SERP entry itself
* (title / url / description / publishedTime) with no per-page fetch latency
* or token cost. `X-Retain-Images: none` keeps page content image-free. The
* documented `num` (0–20) is sent ONLY when the request carries a result
* count — Jina's own docs warn it can add latency, so an unspecified count
* inherits the API default instead of forcing one. The EU-residency mirror
* (`https://eu.s.jina.ai`) or a proxy base overrides through `baseURL`.
*
* @module dsh-web-search-aggregation/adapters/jina
*/
/** Public Jina Search API origin (single source: `defaults.ts`). */
const JINA_DEFAULT_BASE_URL = KIND_DEFAULT_BASE_URL.jina;
/** Jina's documented maximum for `num` (validated 0–20 upstream). */
const JINA_MAX_NUM = 20;
/**
* Clamp one requested result count into Jina's 1–20 `num` window. Only used
* when the request actually carries a count; otherwise `num` is omitted so
* the API default applies.
*
* @param count - the raw requested count.
* @returns the clamped count.
*/
function jinaNum(count) {
	return Math.min(Math.max(Math.trunc(count), 1), 20);
}
/**
* Map one Jina result row to a normalized source; rows without a usable URL
* are dropped. The SERP snippet rides `description` (with
* `X-Respond-With: no-content` the rows carry no page `content`).
*
* @param row - one `data[]` row.
* @returns the normalized source, or `undefined` to drop.
*/
function mapJinaRow(row) {
	if (typeof row.url !== "string" || !URL.canParse(row.url)) return void 0;
	const title = typeof row.title === "string" ? row.title.trim() : "";
	const description = typeof row.description === "string" ? row.description.trim() : "";
	const published = typeof row.publishedTime === "string" ? row.publishedTime.trim() : "";
	return {
		url: row.url,
		...title.length > 0 ? { title } : {},
		...description.length > 0 ? { snippet: description } : {},
		...published.length > 0 ? { publishedAt: published } : {}
	};
}
/** The Jina search adapter; a key is mandatory. */
const jinaAdapter = {
	kind: "jina",
	defaultBaseURL: JINA_DEFAULT_BASE_URL,
	anonymousOk: false,
	async search(query, maxResults, apiKey, baseURL, signal) {
		if (apiKey === void 0) throw new WebError("Jina requires an API key and none resolved", "WEB_PROVIDER_ERROR");
		return mapJinaResponse(await jsonRequest("Jina", `${baseURL.replace(/\/+$/u, "")}/`, {
			method: "POST",
			headers: {
				"accept": "application/json",
				"content-type": "application/json",
				"authorization": `Bearer ${apiKey}`,
				"x-respond-with": "no-content",
				"x-retain-images": "none"
			},
			body: JSON.stringify({
				q: query,
				...maxResults === void 0 ? {} : { num: jinaNum(maxResults) }
			}),
			...signal === void 0 ? {} : { signal }
		}));
	}
};
/**
* Map a Jina search response to the normalized result: the JSON envelope
* (`Accept: application/json`) is `{code, status, data: […]}` with one
* FormattedPage row per result; a bare array is accepted too, so an envelope
* drift does not break the adapter.
*
* @param body - the parsed response body.
* @returns the normalized search result.
* @throws WebError `WEB_PROVIDER_ERROR` when neither shape carries a results
*   array.
*/
function mapJinaResponse(body) {
	if (typeof body !== "object" || body === null) throw new WebError("Jina returned a non-object response body", "WEB_PROVIDER_ERROR");
	const rows = Array.isArray(body) ? body : body.data;
	if (!Array.isArray(rows)) throw new WebError("Jina response carries no results array", "WEB_PROVIDER_ERROR");
	return {
		sources: rows.map((row) => typeof row === "object" && row !== null && !Array.isArray(row) ? mapJinaRow(row) : void 0).filter((source) => source !== void 0),
		truncated: false
	};
}
//#endregion
//#region src/adapters/serpapi.ts
/**
* `SerpApiAdapter`: `GET {base}/search.json?engine=google&q=…&api_key=…`
* (see serpapi.com/search-api and serpapi.com/organic-results). The API key
* MUST ride the URL as the `api_key` query parameter — SerpApi's docs state
* it "should not be in HTTP headers, form data, or anywhere else" — so no
* Authorization header is sent. The documented `num` (default 10, up to 100)
* is sent ONLY when the request carries a result count: SerpApi notes calls
* with `num` are historically more CAPTCHA-prone, so an unspecified count
* inherits the API default instead of forcing one. Failures — including
* HTTP 200 bodies whose only payload is a top-level `error` string (e.g.
* Google returning nothing) — map to `WEB_PROVIDER_ERROR` so the queue
* falls through. `link` → url, `title` → title, `snippet` → snippet, and
* `date` (Google's displayed date string, not normalized ISO) →
* `publishedAt`.
*
* @module dsh-web-search-aggregation/adapters/serpapi
*/
/** Public SerpApi API origin (single source: `defaults.ts`). */
const SERPAPI_DEFAULT_BASE_URL = KIND_DEFAULT_BASE_URL.serpapi;
/** SerpApi's documented maximum for `num` (default 10, up to 100). */
const SERPAPI_MAX_NUM = 100;
/**
* Clamp one requested result count into SerpApi's 1–100 `num` window. Only
* used when the request actually carries a count; otherwise `num` is omitted
* so the API default (10) applies.
*
* @param count - the raw requested count.
* @returns the clamped count.
*/
function serpapiNum(count) {
	return Math.min(Math.max(Math.trunc(count), 1), 100);
}
/**
* Build the SerpApi request URL for one query.
*
* @param baseURL - the endpoint base (already defaulted).
* @param query - the search query text.
* @param apiKey - the SerpApi key literal; it rides the URL because the API
*   rejects keys placed in headers or bodies.
* @param num - the clamped result count, or `undefined` to inherit the API
*   default (then the parameter is not sent at all).
* @returns the absolute request URL.
* @throws WebError `WEB_PROVIDER_ERROR` when the base is not an absolute URL.
*/
function serpapiURL(baseURL, query, apiKey, num) {
	let url;
	try {
		url = new URL(baseURL);
	} catch (error) {
		throw new WebError(`SerpApi base URL is invalid: ${baseURL}`, "WEB_PROVIDER_ERROR", { cause: error });
	}
	url.pathname = `${url.pathname.replace(/\/+$/u, "")}/search.json`;
	url.searchParams.set("engine", "google");
	url.searchParams.set("q", query);
	url.searchParams.set("api_key", apiKey);
	if (num !== void 0) url.searchParams.set("num", String(num));
	return url.href;
}
/**
* Map one SerpApi result row to a normalized source; rows without a usable
* link are dropped.
*
* @param row - one `organic_results[]` row.
* @returns the normalized source, or `undefined` to drop.
*/
function mapSerpApiRow(row) {
	if (typeof row.link !== "string" || !URL.canParse(row.link)) return void 0;
	const title = typeof row.title === "string" ? row.title.trim() : "";
	const snippet = typeof row.snippet === "string" ? row.snippet.trim() : "";
	const date = typeof row.date === "string" ? row.date.trim() : "";
	return {
		url: row.link,
		...title.length > 0 ? { title } : {},
		...snippet.length > 0 ? { snippet } : {},
		...date.length > 0 ? { publishedAt: date } : {}
	};
}
/** The SerpApi search adapter; a key is mandatory. */
const serpApiAdapter = {
	kind: "serpapi",
	defaultBaseURL: SERPAPI_DEFAULT_BASE_URL,
	anonymousOk: false,
	async search(query, maxResults, apiKey, baseURL, signal) {
		if (apiKey === void 0) throw new WebError("SerpApi requires an API key and none resolved", "WEB_PROVIDER_ERROR");
		return mapSerpApiResponse(await jsonRequest("SerpApi", serpapiURL(baseURL, query, apiKey, maxResults === void 0 ? void 0 : serpapiNum(maxResults)), {
			method: "GET",
			headers: { accept: "application/json" },
			...signal === void 0 ? {} : { signal }
		}));
	}
};
/**
* Map a SerpApi search response to the normalized result. A body whose only
* payload is a non-blank top-level `error` string is a failure — SerpApi
* reports errors that way even with HTTP 200 (e.g. `status: "Success"` plus
* `"Google hasn't returned any results for this query."` when Google found
* nothing) — so it throws and the queue falls through.
*
* @param body - the parsed response body.
* @returns the normalized search result.
* @throws WebError `WEB_PROVIDER_ERROR` when the body carries an `error`
*   string or no `organic_results` array.
*/
function mapSerpApiResponse(body) {
	if (typeof body !== "object" || body === null || Array.isArray(body)) throw new WebError("SerpApi returned a non-object response body", "WEB_PROVIDER_ERROR");
	const envelope = body;
	if (typeof envelope.error === "string" && envelope.error.trim().length > 0) throw new WebError(`SerpApi search failed: ${envelope.error.trim()}`, "WEB_PROVIDER_ERROR");
	const rows = envelope.organic_results;
	if (!Array.isArray(rows)) throw new WebError("SerpApi response carries no results array", "WEB_PROVIDER_ERROR");
	return {
		sources: rows.map((row) => typeof row === "object" && row !== null && !Array.isArray(row) ? mapSerpApiRow(row) : void 0).filter((source) => source !== void 0),
		truncated: false
	};
}
//#endregion
//#region src/adapters/serper.ts
/**
* `SerperAdapter`: `POST {base}/search` with the key in the `X-API-KEY`
* header (see serper.dev — the API playground documents the endpoint; a
* faithful OpenAPI mirror lives at openapisearch.com/openapi/serper). The
* body carries the query as `{"q": …}` plus `num` — documented as "Amount
* of results 10-100 (default 10)" — ONLY when the request carries a result
* count, clamped into that 10–100 window; an unspecified count inherits the
* API default and the parameter is not sent at all. Clamping UP to 10 never
* over-delivers: the web seam truncates `sources[]` to the request's
* `maxResults` after the provider returns. `organic[]` maps `link` → url,
* `title` → title, `snippet` → snippet, and `date` (Google's displayed date
* string, not normalized ISO) → `publishedAt`. Failures — including non-2xx
* bodies of the API's `{"message": …, "statusCode": …}` shape (e.g. HTTP
* 403 `Unauthorized. Sign up for a free account.`) — map to
* `WEB_PROVIDER_ERROR` so the queue falls through.
*
* @module dsh-web-search-aggregation/adapters/serper
*/
/** Public Serper API origin (single source: `defaults.ts`). */
const SERPER_DEFAULT_BASE_URL = KIND_DEFAULT_BASE_URL.serper;
/** Serper's documented minimum for `num` ("Amount of results 10-100"). */
const SERPER_MIN_NUM = 10;
/** Serper's documented maximum for `num` ("Amount of results 10-100"). */
const SERPER_MAX_NUM = 100;
/**
* Clamp one requested result count into Serper's 10–100 `num` window. Only
* used when the request actually carries a count; otherwise `num` is omitted
* so the API default (10) applies. A count below 10 clamps UP to the window
* floor — safe, because the seam truncates the returned sources to the
* request's `maxResults`.
*
* @param count - the raw requested count.
* @returns the clamped count.
*/
function serperNum(count) {
	return Math.min(Math.max(Math.trunc(count), 10), 100);
}
/**
* Map one Serper result row to a normalized source; rows without a usable
* link are dropped.
*
* @param row - one `organic[]` row.
* @returns the normalized source, or `undefined` to drop.
*/
function mapSerperRow(row) {
	if (typeof row.link !== "string" || !URL.canParse(row.link)) return void 0;
	const title = typeof row.title === "string" ? row.title.trim() : "";
	const snippet = typeof row.snippet === "string" ? row.snippet.trim() : "";
	const date = typeof row.date === "string" ? row.date.trim() : "";
	return {
		url: row.link,
		...title.length > 0 ? { title } : {},
		...snippet.length > 0 ? { snippet } : {},
		...date.length > 0 ? { publishedAt: date } : {}
	};
}
/** The Serper search adapter; a key is mandatory. */
const serperAdapter = {
	kind: "serper",
	defaultBaseURL: SERPER_DEFAULT_BASE_URL,
	anonymousOk: false,
	async search(query, maxResults, apiKey, baseURL, signal) {
		if (apiKey === void 0) throw new WebError("Serper requires an API key and none resolved", "WEB_PROVIDER_ERROR");
		return mapSerperResponse(await jsonRequest("Serper", `${baseURL.replace(/\/+$/u, "")}/search`, {
			method: "POST",
			headers: {
				"accept": "application/json",
				"content-type": "application/json",
				"x-api-key": apiKey
			},
			body: JSON.stringify({
				q: query,
				...maxResults === void 0 ? {} : { num: serperNum(maxResults) }
			}),
			...signal === void 0 ? {} : { signal }
		}));
	}
};
/**
* Map a Serper search response to the normalized result. A body without an
* `organic` array is a failure (the API's degenerate bodies are covered by
* the non-2xx path, which throws earlier), so it throws and the queue falls
* through.
*
* @param body - the parsed response body.
* @returns the normalized search result.
* @throws WebError `WEB_PROVIDER_ERROR` when the body is not an object or
*   carries no `organic` array.
*/
function mapSerperResponse(body) {
	if (typeof body !== "object" || body === null || Array.isArray(body)) throw new WebError("Serper returned a non-object response body", "WEB_PROVIDER_ERROR");
	const rows = body.organic;
	if (!Array.isArray(rows)) throw new WebError("Serper response carries no results array", "WEB_PROVIDER_ERROR");
	return {
		sources: rows.map((row) => typeof row === "object" && row !== null && !Array.isArray(row) ? mapSerperRow(row) : void 0).filter((source) => source !== void 0),
		truncated: false
	};
}
//#endregion
//#region src/adapters/index.ts
/** Every adapter this build carries, keyed by its provider kind. */
const ADAPTERS = {
	anysearch: anySearchAdapter,
	tinyfish: tinyFishAdapter,
	tavily: tavilyAdapter,
	brave: braveAdapter,
	exa: exaAdapter,
	firecrawl: firecrawlAdapter,
	jina: jinaAdapter,
	serpapi: serpApiAdapter,
	serper: serperAdapter
};
//#endregion
//#region src/keys.ts
/**
* The single-kv key-pool vocabulary: one provider kind stores all its API
* keys in ONE credential (`TAVILY_API_KEY`, …) whose value is the keys
* joined by `,` — a single key is stored bare, with no separator. These
* helpers convert between that wire/storage format and the key list the
* provider rotates over. Pure functions, zero imports (host-side use).
*
* Assumption: an API-key literal never contains `,` (no known provider
* issues keys with commas).
*
* @module dsh-web-search-aggregation/keys
*/
/**
* Split one credential value into its key list: split on `,`, trim each
* part, drop empty parts. A value that is empty, blank, or only separators
* parses to `[]` (the credential counts as unresolved).
*
* @param value - the raw credential value (comma-joined keys).
* @returns the non-empty key literals in stored order.
*/
function parseApiKeys(value) {
	return value.split(",").map((part) => part.trim()).filter((part) => part.length > 0);
}
/**
* Join key literals into one credential value: trim each key, drop empty
* ones, join with `,`. A single key produces the bare literal with no
* separator; an empty list produces `''`.
*
* @param keys - the key literals to store.
* @returns the comma-joined credential value.
*/
function formatApiKeys(keys) {
	return keys.map((key) => key.trim()).filter((key) => key.length > 0).join(",");
}
/**
* The display identity of one key inside a provider's pool, used in logs
* and failure records (never the literal itself): the plain reference when
* the pool holds one key, `REF#N` (1-based) when it holds several.
*
* @param ref - the provider's fixed credential reference.
* @param index - the key's 0-based position in the parsed pool.
* @param total - how many keys the pool holds.
* @returns the per-key display reference.
*/
function keyRefLabel(ref, index, total) {
	return total <= 1 ? ref : `${ref}#${String(index + 1)}`;
}
/**
* Mask one key literal for on-screen tags: head 12 + `…` + tail 2. Keys too
* short to hide a middle (≤ 14 chars) degrade to the tail window only, so a
* short key is never revealed in full.
*
* @param key - the key literal to mask.
* @returns the masked display string.
*/
function maskApiKey(key) {
	if (key.length > 14) return `${key.slice(0, 12)}…${key.slice(-2)}`;
	return key.length > 2 ? `…${key.slice(-2)}` : "…";
}
//#endregion
//#region src/provider.ts
/**
* `AggregatedSearchProvider`: one `WebSearchProvider` whose backend is a
* prioritized queue of upstream entries. Per request it walks enabled entries
* in configured order; within an entry it walks the keys parsed from the
* kind's single credential (a `,`-joined pool) starting at a rotating cursor;
* the first attempt that returns wins and every failure is recorded, so an
* all-failed call can report each attempt. Caller cancellation stops the walk
* immediately; the per-attempt timeout bounds one hung upstream.
*
* @module dsh-web-search-aggregation/provider
*/
/** Stable id this provider registers under. */
const AGGREGATED_PROVIDER_ID = "aggregated";
/**
* The queue-backed search provider registered as `ctx.web`'s `aggregated`
* provider. Config is projected per request, so a committed settings change
* reaches the next search with no re-registration.
*/
var AggregatedSearchProvider = class {
	options;
	id = AGGREGATED_PROVIDER_ID;
	/**
	* Rotation cursors keyed by entry signature (kind + endpoint): the
	* resolved-key index the next request for that entry starts at. A signature
	* change (edited endpoint) intentionally resets the rotation.
	*/
	cursors = /* @__PURE__ */ new Map();
	constructor(options) {
		this.options = options;
	}
	/** Cheap local check: at least one enabled entry is configured. */
	available() {
		return this.options.config().providers.some((entry) => entry.enabled);
	}
	/**
	* Run one search through the queue: entries in order, keys in rotation
	* order per entry, first success returned.
	*
	* @param request - the query and optional result limit.
	* @param signal - caller cancellation; aborts the walk immediately.
	* @returns the first successful attempt's normalized result.
	* @throws WebError `WEB_ABORTED` when the caller cancelled, `WEB_PROVIDER_UNAVAILABLE`
	*   when no enabled entry exists, `WEB_PROVIDER_ERROR` with the per-attempt
	*   summary when every attempt failed.
	*/
	async search(request, signal) {
		const { providers, attemptTimeoutMs } = this.options.config();
		const entries = providers.filter((entry) => entry.enabled);
		if (entries.length === 0) throw new WebError("aggregated search queue is empty: enable or add a provider in Settings → Plugins → Plugin configuration", "WEB_PROVIDER_UNAVAILABLE");
		const failures = [];
		for (let position = 0; position < entries.length; position++) {
			const entry = entries[position];
			const adapter = ADAPTERS[entry.kind];
			const keys = await this.resolveKeys(entry, position, failures);
			const attempts = keys.length > 0 ? keys : adapter.anonymousOk ? [{
				ref: "anonymous",
				value: void 0
			}] : [];
			if (attempts.length === 0) {
				failures.push({
					position,
					kind: entry.kind,
					keyRef: "none",
					reason: "no usable API key (credential empty or unresolved, and the API requires a key)"
				});
				continue;
			}
			const ordered = rotation(attempts, this.cursorOf(entry));
			for (const key of ordered) {
				if (signal?.aborted === true) throw callerAborted();
				const outcome = await this.attempt(entry, position, key, adapter, request, signal, attemptTimeoutMs);
				if (outcome === void 0) throw callerAborted();
				if (outcome.ok) {
					this.advanceCursor(entry, ordered.length);
					this.options.logger.info("aggregated search: query served by %s via %s (position %d)", entry.kind, key.ref, position + 1);
					return outcome.result;
				}
				failures.push(outcome.failure);
			}
		}
		const summary = failures.map((failure) => describeFailure(failure)).join("; ");
		throw new WebError(`aggregated search: all ${String(failures.length)} attempts failed — ${summary}`, "WEB_PROVIDER_ERROR");
	}
	/**
	* Resolve an entry's key pool: read the kind's single fixed credential and
	* split its `,`-joined value into key literals. A missing/empty credential
	* records one failure (visibility for the all-failed summary; the entry
	* may still proceed anonymously when the adapter allows it).
	*/
	async resolveKeys(entry, position, failures) {
		const ref = KIND_CREDENTIAL_REF[entry.kind];
		let value;
		try {
			value = await this.options.resolveKey(ref);
		} catch (error) {
			failures.push({
				position,
				kind: entry.kind,
				keyRef: ref,
				reason: `credential resolution failed: ${String(error instanceof Error ? error.message : error)}`
			});
			return [];
		}
		const literals = value === void 0 ? [] : parseApiKeys(value);
		if (literals.length === 0) {
			this.options.logger.info("aggregated search: credential %s resolved to nothing", ref);
			failures.push({
				position,
				kind: entry.kind,
				keyRef: ref,
				reason: "credential resolved to nothing"
			});
			return [];
		}
		return literals.map((literal, index) => ({
			ref: keyRefLabel(ref, index, literals.length),
			value: literal
		}));
	}
	/**
	* Run one attempt under its own timeout budget. A caller abort propagates
	* (the walk stops — `undefined`); every other failure is returned for
	* recording.
	*/
	async attempt(entry, position, key, adapter, request, signal, attemptTimeoutMs) {
		const timeout = new AbortController();
		const timer = setTimeout(() => {
			timeout.abort(new DOMException("aggregated search attempt timed out", "TimeoutError"));
		}, attemptTimeoutMs);
		const attemptSignal = signal === void 0 ? timeout.signal : AbortSignal.any([signal, timeout.signal]);
		const baseURL = entry.baseURL ?? adapter.defaultBaseURL;
		const startedAt = Date.now();
		try {
			return {
				ok: true,
				result: await adapter.search(request.query, request.maxResults, key.value, baseURL, attemptSignal)
			};
		} catch (error) {
			if (signal?.aborted === true) return void 0;
			const reason = timeout.signal.aborted ? `attempt timed out after ${String(attemptTimeoutMs)} ms` : error instanceof WebError ? error.message : String(error);
			this.options.logger.warn("aggregated search: %s attempt via %s failed in %d ms: %s", entry.kind, key.ref, Date.now() - startedAt, reason);
			return {
				ok: false,
				failure: {
					position,
					kind: entry.kind,
					keyRef: key.ref,
					reason
				}
			};
		} finally {
			clearTimeout(timer);
		}
	}
	/** The rotation-start cursor stored for one entry signature. */
	cursorOf(entry) {
		return this.cursors.get(signatureOf(entry)) ?? 0;
	}
	/** Advance one entry's rotation cursor by one request. */
	advanceCursor(entry, length) {
		if (length <= 1) return;
		const signature = signatureOf(entry);
		this.cursors.set(signature, ((this.cursors.get(signature) ?? 0) + 1) % length);
	}
};
/**
* Reorder one key list so it starts at `cursor` and wraps once — the
* round-robin attempt order for one entry.
*
* @param keys - the resolved keys in stored order.
* @param cursor - the rotation start index.
* @returns the keys in attempt order.
*/
function rotation(items, cursor) {
	if (items.length <= 1) return [...items];
	const start = (cursor % items.length + items.length) % items.length;
	return [...items.slice(start), ...items.slice(0, start)];
}
/** The stable identity of one queue entry: kind and endpoint. */
function signatureOf(entry) {
	return [entry.kind, entry.baseURL ?? ""].join("|");
}
/** One failure as the summary renders it. */
function describeFailure(failure) {
	return `[${String(failure.position + 1)}] ${failure.kind}/${failure.keyRef}: ${failure.reason}`;
}
/** The `WEB_ABORTED` error for caller cancellation. */
function callerAborted() {
	return new WebError("aggregated search aborted", "WEB_ABORTED");
}
//#endregion
//#region src/index.ts
/** Cordis plugin name used by loader diagnostics. */
const name = "dsh-web-search-aggregation";
/** The capability seams this plugin registers into. */
const inject = ["web", "credentials"];
/** Settings namespace carrying this provider's configuration card. */
const WEB_SEARCH_AGGREGATION_SETTINGS_NAMESPACE = settingsNamespace("web-search-aggregation");
/**
* Register the aggregated search provider with `ctx.web`.
*
* @param ctx - plugin context supplying the web seam and the credentials domain.
* @param config - the composition entry config; also the settings section's base layer.
*/
function apply(ctx, config = {}) {
	let current = () => config;
	installSettingsSection(ctx, WEB_SEARCH_AGGREGATION_SETTINGS_NAMESPACE, Config, config, {
		setSource: (source) => {
			current = source;
		},
		onChange: () => {}
	});
	ctx.web.registerSearchProvider(new AggregatedSearchProvider({
		config: () => resolveConfig(current()),
		resolveKey: async (ref) => {
			if (!isCredentialRefName(ref)) return void 0;
			return (await ctx.credentials.resolve(credentialRef(ref)))?.value;
		},
		logger: ctx.logger
	}));
}
//#endregion
export { ADAPTERS, AGGREGATED_PROVIDER_ID, ANYSEARCH_DEFAULT_BASE_URL, AggregatedSearchProvider, BRAVE_DEFAULT_BASE_URL, BRAVE_DEFAULT_COUNT, BRAVE_MAX_COUNT, Config, DEFAULT_ATTEMPT_TIMEOUT_MS, KIND_CREDENTIAL_REF as DEFAULT_KEY_REF, DEFAULT_QUEUE, EXA_DEFAULT_BASE_URL, EXA_DEFAULT_NUM_RESULTS, EXA_MAX_NUM_RESULTS, FIRECRAWL_DEFAULT_BASE_URL, FIRECRAWL_DEFAULT_LIMIT, FIRECRAWL_MAX_LIMIT, JINA_DEFAULT_BASE_URL, JINA_MAX_NUM, MAX_ATTEMPT_TIMEOUT_MS, MIN_ATTEMPT_TIMEOUT_MS, SERPAPI_DEFAULT_BASE_URL, SERPAPI_MAX_NUM, SERPER_DEFAULT_BASE_URL, SERPER_MAX_NUM, SERPER_MIN_NUM, TAVILY_DEFAULT_BASE_URL, TAVILY_DEFAULT_MAX_RESULTS, TINYFISH_DEFAULT_BASE_URL, WEB_SEARCH_AGGREGATION_SETTINGS_NAMESPACE, apply, braveCount, braveURL, exaNumResults, firecrawlLimit, formatApiKeys, inject, jinaNum, keyRefLabel, mapBraveResponse, mapBraveRow, mapExaResponse, mapExaRow, mapFirecrawlResponse, mapFirecrawlRow, mapJinaResponse, mapJinaRow, mapSerpApiResponse, mapSerpApiRow, mapSerperResponse, mapSerperRow, maskApiKey, name, parseApiKeys, resolveConfig, serpapiNum, serpapiURL, serperNum };
