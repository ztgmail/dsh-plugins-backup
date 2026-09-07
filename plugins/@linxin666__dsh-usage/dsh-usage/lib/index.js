import z from "schemastery";
import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import { dirname, isAbsolute, join } from "node:path";
import "@deepseek-ai/cordis";
import { homedir } from "node:os";
import { isAbsolute as isAbsolute$1, join as join$1 } from "node:path/posix";
//#region src/mount-once.ts
/**
* Host single-instance guard shared by the plugin family. The family bundle
* (dsh-web-all / dsh-skins) namespaces every child row id (web-ui-*), so
* the loader accepts a standalone install of the same package side by side;
* without this guard the second instance would still re-register the same
* webserver routes, tools, settings namespaces, and system-prompt sections
* and fail the boot. mountOnce makes the second host apply a no-op for the
* lifetime of the first instance (the browser half is already deduped by
* package name in the client module host).
*
* The registry rides a global symbol so two module instances of the same
* package (npm copy vs repository link) still share one verdict. cordis
* `ctx.effect` runs its callback immediately and treats the callback's
* return value as the fiber disposer, so the unmarker is returned, not run.
*/
const MOUNTED = Symbol.for("dsh-web.mounted-plugins");
function mountedSet() {
	const registry = globalThis;
	return registry[MOUNTED] ??= /* @__PURE__ */ new Set();
}
/**
* Wrap a cordis plugin apply so the package runs at most once per process.
* The first mount registers normally and unmarks when its fiber disposes;
* any later mount of the same package name is a no-op.
* @param packageName - npm package identity shared by every install source.
* @param fn - the original plugin apply.
* @returns an apply of the same shape.
*/
function mountOnce(packageName, fn) {
	return ((...args) => {
		const mounted = mountedSet();
		if (mounted.has(packageName)) return;
		mounted.add(packageName);
		args[0]?.effect?.(() => () => {
			mounted.delete(packageName);
		});
		return fn(...args);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@deepseek-ai+dsh-brand@0.1.2-alpha.2_@deepseek-ai+cordis@4.0.2_@deepseek-ai+dsh-invaria_1a52edab8cda52d70d5ed37d8a2ca6fd/node_modules/@deepseek-ai/dsh-brand/lib/index.js
/**
* Duplicate-install-safe nominal string helpers.
*
* A brand makes structurally-identical strings non-interchangeable at the type
* level: a `SessionId` cannot be passed where a `ToolCallId` is expected, even
* though both are plain strings at runtime. Comparison, logging, and
* serialization all behave as ordinary strings.
*
* This package owns no concrete id and keeps no runtime identity or mutable
* state, so independently installed copies produce interchangeable values.
*
* @module @deepseek-ai/dsh-brand
*/
/**
* Apply a compile-time string brand without changing the value.
* @param value - string admitted by the domain that owns the target brand.
* @returns the same string with the requested compile-time brand.
*/
function brandString(value) {
	return value;
}
//#endregion
//#region ../../node_modules/.pnpm/@deepseek-ai+dsh-credentials@0.1.2-alpha.2_@deepseek-ai+cordis@4.0.2_@deepseek-ai+dsh-i_2732fefa2ea8a51d5123e14b95af2051/node_modules/@deepseek-ai/dsh-credentials/lib/index.js
/**
* Service Definition for the credential-reference capability seam (`ctx.credentials`). Settings and composition files carry
* *references* to secrets — environment-variable names — while providers own
* the actual values and their storage. Consumers resolve a reference once per
* operation, so a changed credential reaches the next operation without any
* plugin restart, and configuration surfaces describe a reference without
* ever seeing its value.
* @module @deepseek-ai/dsh-credentials
*/
const REF_PATTERN = /^[A-Za-z_][A-Za-z0-9_]*$/;
/** Both halves of a {@link CredentialKey}; the `/` between them is what keeps it out of {@link REF_PATTERN}. */
const KEY_SEGMENT_PATTERN = /^[a-z][a-z0-9-]*$/;
/**
* Brand a raw string as a {@link CredentialRef}.
* @param value - candidate reference; a POSIX shell identifier such as `DEEPSEEK_API_KEY`.
* @returns the branded reference.
*/
function credentialRef(value) {
	if (!isCredentialRefName(value)) throw new TypeError(`credential ref "${value}" must match ${String(REF_PATTERN)}`);
	return brandString(value);
}
/**
* Whether a raw string could name a reference at all. Consumers that receive
* environment-variable names from somewhere else — a provider library's own
* ambient discovery, a hook payload — ask this before resolving, because a name
* outside the grammar has no reference to miss and should read as "not set"
* rather than as a thrown error.
* @param value - candidate reference.
* @returns true when {@link credentialRef} would accept it.
*/
function isCredentialRefName(value) {
	return REF_PATTERN.test(value);
}
/**
* Brand a scope and an id as a {@link CredentialKey}.
* @param scope - the owning plugin's registered name, such as `llm-pi-ai`.
* @param id - that plugin's own addressing unit, such as a provider route key.
* @returns the branded key.
* @throws TypeError when either segment is not a lowercase hyphenated identifier.
*/
function credentialKey(scope, id) {
	for (const segment of [scope, id]) if (!KEY_SEGMENT_PATTERN.test(segment)) throw new TypeError(`credential key segment "${segment}" must match ${String(KEY_SEGMENT_PATTERN)}`);
	return brandString(`${scope}/${id}`);
}
//#endregion
//#region src/dsh-home.ts
/**
* DSH_HOME resolution shared by the plugin family's Host halves: the
* environment override wins, the platform home fallback follows. Mirrors
* what dsh-pet and dsh-liangshen each used to implement locally.
*/
/** Expand a leading ~ (or ~user) in a path, platform-style. */
function expandHome(path, home = homedir()) {
	const j = home.startsWith("/") ? join$1 : join;
	if (path === "~") return home;
	if (path.startsWith("~/") || path.startsWith("~\\")) return j(home, path.slice(2));
	return path;
}
/**
* Resolve the DSH home directory.
* @param env - process environment to read DSH_HOME from.
* @param home - platform home directory fallback (test seam).
* @returns the absolute DSH home path.
*/
function resolveDshHome(env = process.env, home = homedir()) {
	const isPosix = home.startsWith("/");
	const j = isPosix ? join$1 : join;
	const isAbs = isPosix ? isAbsolute$1 : isAbsolute;
	const raw = env.DSH_HOME;
	if (raw !== void 0 && raw.trim() !== "") {
		const expanded = expandHome(raw.trim(), home);
		return isAbs(expanded) ? expanded : j(process.cwd(), expanded);
	}
	return j(home, ".dsh");
}
/** Resolve the DSH home directory from the live environment. */
function dshHome() {
	return resolveDshHome();
}
//#endregion
//#region src/core/adapters.ts
/** Parse a string/number into a finite number, else undefined. */
function toNum(value) {
	if (typeof value === "number") return Number.isFinite(value) ? value : void 0;
	if (typeof value === "string" && value.trim() !== "") {
		const parsed = Number(value);
		return Number.isFinite(parsed) ? parsed : void 0;
	}
}
/** Read a string field that must be a non-empty string. */
function str(value) {
	return typeof value === "string" && value.trim() !== "" ? value.trim() : void 0;
}
/** Format a number to a fixed 2-decimal display string. */
function money(value) {
	return value.toFixed(2);
}
/** Millisecond epoch or ISO string → normalized ISO 8601, else undefined. */
function toIso(value) {
	if (typeof value === "number" && Number.isFinite(value) && value > 0) {
		const ms = value < 0xe8d4a51000 ? value * 1e3 : value;
		const date = new Date(ms);
		return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
	}
	const text = str(value);
	if (text === void 0) return void 0;
	if (/^\d+$/.test(text)) return toIso(Number(text));
	const date = new Date(text);
	return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
}
/** Used-percent helper guarding zero/absent limits. */
function usedPercent(used, limit) {
	const usedNum = toNum(used);
	const limitNum = toNum(limit);
	if (usedNum === void 0 || limitNum === void 0 || limitNum <= 0) return void 0;
	return Math.max(0, Math.min(100, usedNum / limitNum * 100));
}
function bearer(apiKey) {
	return { authorization: `Bearer ${apiKey}` };
}
/**
* The official pay-as-you-go balance. `deepseek` is the configurable-catalog
* route key; `deepseek-official` is the live provider route the llm-deepseek
* adapter registers (sessions and agent-default-model carry it), so both ids
* must resolve here or the current provider would never be probed.
*/
const DEEPSEEK = {
	ids: ["deepseek", "deepseek-official"],
	displayName: "DeepSeek",
	balance: {
		build: ({ apiKey }) => ({
			url: "https://api.deepseek.com/user/balance",
			headers: bearer(apiKey)
		}),
		parse: (status, body) => {
			if (status !== 200 || typeof body !== "object" || body === null) return void 0;
			const infos = body.balance_infos;
			if (!Array.isArray(infos) || infos.length === 0) return void 0;
			const first = infos[0];
			if (typeof first !== "object" || first === null) return void 0;
			const currency = str(first.currency);
			const total = str(first.total_balance);
			if (currency === void 0 || total === void 0) return void 0;
			return {
				currency,
				totalBalance: total
			};
		}
	}
};
/** Moonshot pay-as-you-go balance; CN bills in CNY, international in USD. */
function moonshotBalance(host, currency, ids) {
	return {
		ids,
		displayName: "Moonshot AI",
		balance: {
			build: ({ apiKey }) => ({
				url: `https://${host}/v1/users/me/balance`,
				headers: bearer(apiKey)
			}),
			parse: (status, body) => {
				if (status !== 200 || typeof body !== "object" || body === null) return void 0;
				const data = body.data;
				if (typeof data !== "object" || data === null) return void 0;
				const available = toNum(data.available_balance);
				if (available === void 0) return void 0;
				return {
					currency,
					totalBalance: money(available)
				};
			}
		}
	};
}
/** Kimi For Coding quota: top-level `usage` is the weekly summary, `limits[]` the per-window rows. */
const KIMI_CODING = {
	ids: ["kimi-coding"],
	displayName: "Kimi For Coding",
	plan: {
		build: ({ apiKey }) => ({
			url: "https://api.kimi.com/coding/v1/usages",
			headers: bearer(apiKey)
		}),
		parse: (status, body) => {
			if (status !== 200 || typeof body !== "object" || body === null) return void 0;
			const root = body;
			const windows = [];
			const limits = root.limits;
			if (Array.isArray(limits)) for (const entry of limits) {
				if (typeof entry !== "object" || entry === null) continue;
				const detail = entry.detail;
				const window = entry.window;
				if (typeof detail !== "object" || detail === null) continue;
				const row = detail;
				const duration = typeof window === "object" && window !== null ? toNum(window.duration) : void 0;
				const unit = typeof window === "object" && window !== null ? str(window.timeUnit) : void 0;
				const key = duration === 300 && unit === "TIME_UNIT_MINUTE" ? "5h" : duration !== void 0 ? `w-${duration}` : "window";
				const percent = usedPercent(row.used, row.limit);
				windows.push({
					key,
					name: str(row.name),
					percent,
					resetsAt: toIso(row.resetTime)
				});
			}
			const usage = root.usage;
			if (typeof usage === "object" && usage !== null) {
				const weekly = usage;
				windows.push({
					key: "week",
					name: "Weekly",
					percent: usedPercent(weekly.used, weekly.limit),
					resetsAt: toIso(weekly.resetTime)
				});
			}
			if (windows.length === 0) return void 0;
			const user = root.user;
			const membership = typeof user === "object" && user !== null ? user.membership : void 0;
			return {
				planName: typeof membership === "object" && membership !== null ? str(membership.level) : void 0,
				windows
			};
		}
	}
};
/** GLM Coding Plan quota; auth is the RAW key without a Bearer prefix. */
function glmPlan(host, ids) {
	return {
		ids,
		displayName: "GLM Coding Plan",
		plan: {
			build: ({ apiKey }) => ({
				url: `https://${host}/api/monitor/usage/quota/limit`,
				headers: {
					authorization: apiKey,
					"accept-language": "en-US,en"
				}
			}),
			parse: (status, body) => {
				if (status !== 200 || typeof body !== "object" || body === null) return void 0;
				const root = body;
				if (root.success !== true) return void 0;
				const data = root.data;
				if (typeof data !== "object" || data === null) return void 0;
				const limits = data.limits;
				if (!Array.isArray(limits)) return void 0;
				const windows = [];
				for (const entry of limits) {
					if (typeof entry !== "object" || entry === null) continue;
					const row = entry;
					const unit = toNum(row.unit);
					const percent = toNum(row.percentage);
					windows.push({
						key: unit === 3 ? "5h" : unit === 6 ? "week" : unit !== void 0 ? `unit-${unit}` : "window",
						percent: percent === void 0 ? void 0 : Math.max(0, Math.min(100, percent)),
						resetsAt: toIso(row.nextResetTime)
					});
				}
				if (windows.length === 0) return void 0;
				return {
					planName: str(data.level),
					windows
				};
			}
		}
	};
}
/** OpenCode Go quota: percent-only rolling/weekly/monthly windows. */
const OPENCODE_GO = {
	ids: ["opencode-go"],
	displayName: "OpenCode Go",
	plan: {
		build: ({ apiKey }) => ({
			url: "https://opencode.ai/zen/go/v1/usage",
			headers: bearer(apiKey)
		}),
		parse: (status, body) => {
			if (status !== 200 || typeof body !== "object" || body === null) return void 0;
			const usage = body.usage;
			if (typeof usage !== "object" || usage === null) return void 0;
			const windows = [];
			for (const [field, key] of [
				["rolling", "5h"],
				["weekly", "week"],
				["monthly", "month"]
			]) {
				const entry = usage[field];
				if (typeof entry !== "object" || entry === null) continue;
				const row = entry;
				const percent = toNum(row.percent);
				windows.push({
					key,
					percent: percent === void 0 ? void 0 : Math.max(0, Math.min(100, percent)),
					resetsAt: percent === 0 ? void 0 : toIso(row.resetsAt)
				});
			}
			if (windows.length === 0) return void 0;
			return { windows };
		}
	}
};
/** MiniMax coding-plan remains: remaining-percent semantics, `general` model entry. */
function minimaxPlan(host, ids) {
	return {
		ids,
		displayName: "MiniMax Coding Plan",
		plan: {
			build: ({ apiKey }) => ({
				url: `https://${host}/v1/api/openplatform/coding_plan/remains`,
				headers: bearer(apiKey)
			}),
			parse: (status, body) => {
				if (status !== 200 || typeof body !== "object" || body === null) return void 0;
				const remains = body.model_remains;
				if (!Array.isArray(remains)) return void 0;
				const general = remains.find((entry) => typeof entry === "object" && entry !== null && entry.model_name === "general");
				if (typeof general !== "object" || general === null) return void 0;
				const row = general;
				const windows = [];
				const intervalRemaining = toNum(row.current_interval_remaining_percent);
				if (intervalRemaining !== void 0) windows.push({
					key: "5h",
					percent: Math.max(0, Math.min(100, 100 - intervalRemaining)),
					resetsAt: toIso(row.end_time)
				});
				if (row.current_weekly_status === 1) {
					const weeklyRemaining = toNum(row.current_weekly_remaining_percent);
					if (weeklyRemaining !== void 0) windows.push({
						key: "week",
						percent: Math.max(0, Math.min(100, 100 - weeklyRemaining)),
						resetsAt: toIso(row.weekly_end_time)
					});
				}
				if (windows.length === 0) return void 0;
				return { windows };
			}
		}
	};
}
const OPENROUTER = {
	ids: ["openrouter"],
	displayName: "OpenRouter",
	balance: {
		build: ({ apiKey }) => ({
			url: "https://openrouter.ai/api/v1/credits",
			headers: bearer(apiKey)
		}),
		parse: (status, body) => {
			if (status !== 200 || typeof body !== "object" || body === null) return void 0;
			const data = body.data;
			if (typeof data !== "object" || data === null) return void 0;
			const credits = toNum(data.total_credits);
			const used = toNum(data.total_usage) ?? 0;
			if (credits === void 0) return void 0;
			return {
				currency: "USD",
				totalBalance: money(credits - used)
			};
		}
	}
};
function siliconFlow(host, ids, currency) {
	return {
		ids,
		displayName: "SiliconFlow",
		balance: {
			build: ({ apiKey }) => ({
				url: `https://${host}/v1/user/info`,
				headers: bearer(apiKey)
			}),
			parse: (status, body) => {
				if (status !== 200 || typeof body !== "object" || body === null) return void 0;
				const data = body.data;
				if (typeof data !== "object" || data === null) return void 0;
				const total = str(data.totalBalance);
				if (total === void 0) return void 0;
				return {
					currency,
					totalBalance: total
				};
			}
		}
	};
}
const ZENMUX = {
	ids: ["zenmux"],
	displayName: "ZenMux",
	balance: {
		build: ({ apiKey }) => ({
			url: "https://zenmux.ai/api/v1/management/payg/balance",
			headers: bearer(apiKey)
		}),
		parse: (status, body) => {
			if (status !== 200 || typeof body !== "object" || body === null) return void 0;
			const data = body.data;
			if (typeof data !== "object" || data === null) return void 0;
			const credits = toNum(data.total_credits);
			if (credits === void 0) return void 0;
			return {
				currency: "USD",
				totalBalance: money(credits)
			};
		}
	}
};
/**
* OpenAI Codex (ChatGPT subscription) quota over the OAuth access token the
* pi-ai grant stores — the one plan adapter whose credential is an OAuth
* token rather than an API key. A 401 here means the stored access token has
* expired; it refreshes when the harness next runs a Codex request, so the
* error line tells the user to use Codex once and refresh.
*/
const OPENAI_CODEX = {
	ids: ["openai-codex"],
	displayName: "Codex (ChatGPT 订阅)",
	plan: {
		build: ({ apiKey, accountId }) => ({
			url: "https://chatgpt.com/backend-api/wham/usage",
			headers: {
				authorization: `Bearer ${apiKey}`,
				"user-agent": "codex-cli",
				accept: "application/json",
				...accountId !== void 0 ? { "chatgpt-account-id": accountId } : {}
			}
		}),
		parse: (status, body) => {
			if (status !== 200 || typeof body !== "object" || body === null) return void 0;
			const rateLimit = body.rate_limit;
			if (typeof rateLimit !== "object" || rateLimit === null) return void 0;
			const windows = [];
			const rows = rateLimit.primary_window !== void 0 || rateLimit.secondary_window !== void 0 ? [rateLimit.primary_window, rateLimit.secondary_window] : [];
			for (const entry of rows) {
				if (typeof entry !== "object" || entry === null) continue;
				const row = entry;
				const percent = toNum(row.used_percent);
				if (percent === void 0) continue;
				const seconds = toNum(row.limit_window_seconds);
				windows.push({
					key: codexWindowKey(seconds),
					percent: Math.max(0, Math.min(100, percent)),
					resetsAt: toIso(row.reset_at)
				});
			}
			if (windows.length === 0) return void 0;
			return { windows };
		}
	}
};
/** Map a Codex window length in seconds onto the shared window key vocabulary. */
function codexWindowKey(seconds) {
	if (seconds === void 0) return "window";
	if (seconds === 18e3) return "5h";
	if (seconds === 604800) return "week";
	if (seconds === 2592e3) return "month";
	const hours = seconds / 3600;
	return hours >= 24 ? `${Math.round(hours / 24)}_day` : `${Math.round(hours)}_hour`;
}
/**
* The adapter registry, in no particular order. Route keys come from the
* pi-ai provider catalog plus the routes this deployment observed in user
* configuration (`zenmux`).
*/
const PROVIDER_ADAPTERS = [
	DEEPSEEK,
	moonshotBalance("api.moonshot.cn", "CNY", ["moonshotai-cn"]),
	moonshotBalance("api.moonshot.ai", "USD", ["moonshotai"]),
	KIMI_CODING,
	glmPlan("open.bigmodel.cn", ["zai-coding-cn"]),
	glmPlan("api.z.ai", ["zai-coding"]),
	OPENCODE_GO,
	minimaxPlan("api.minimaxi.com", ["minimax-cn"]),
	minimaxPlan("api.minimax.io", ["minimax"]),
	OPENAI_CODEX,
	OPENROUTER,
	siliconFlow("api.siliconflow.cn", ["siliconflow", "siliconflow-cn"], "CNY"),
	siliconFlow("api.siliconflow.com", ["siliconflow-intl"], "USD"),
	ZENMUX
];
/** Find the adapter serving a provider route key, if any. */
function adapterFor(provider) {
	return PROVIDER_ADAPTERS.find((adapter) => adapter.ids.includes(provider));
}
/**
* Whether a provider route belongs to the official DeepSeek family: the only
* family with a spend price book and a settings-section-owned env credential
* (llm-deepseek) rather than a pi-ai profile. Drives the env fallback in
* credential resolution and the fold-time cost stamping.
*/
function isDeepSeekProviderRoute(provider) {
	return adapterFor(provider) === DEEPSEEK;
}
/**
* Best-effort human message from a provider error body, for the per-provider
* error line. Never throws; truncated to one short sentence.
*/
function providerErrorMessage(status, body) {
	let message;
	if (typeof body === "object" && body !== null) {
		const root = body;
		const nested = typeof root.error === "object" && root.error !== null ? root.error : void 0;
		message = str(root.message) ?? str(root.msg) ?? (nested !== void 0 ? str(nested.message) : void 0);
	}
	return `HTTP ${status}${message === void 0 ? "" : `: ${message.slice(0, 120)}`}`;
}
//#endregion
//#region src/core/pricing.ts
/** The published peak windows: weekday 09:00-12:00 and 14:00-18:00. */
const PEAK_WINDOWS = [{
	from: 540,
	to: 720
}, {
	from: 840,
	to: 1080
}];
/** Beijing is UTC+8 year-round (no DST), so a fixed shift is exact. */
const BEIJING_UTC_OFFSET_MS = 8 * 36e5;
/** deepseek-v4-flash (and the flash-class vision experiment). */
const FLASH_PRICE = {
	cacheHit: {
		offPeak: .05,
		peak: .1
	},
	inputMiss: {
		offPeak: 1.5,
		peak: 3
	},
	output: {
		offPeak: 4.5,
		peak: 9
	}
};
/** deepseek-v4-pro. */
const PRO_PRICE = {
	cacheHit: {
		offPeak: .15,
		peak: .3
	},
	inputMiss: {
		offPeak: 4.5,
		peak: 9
	},
	output: {
		offPeak: 13.5,
		peak: 27
	}
};
function withinWindow(minuteOfDay) {
	return PEAK_WINDOWS.find((window) => minuteOfDay >= window.from && minuteOfDay < window.to);
}
/**
* The DeepSeek billing period at `ms`, plus when it next flips. The clock is
* Beijing time regardless of the host timezone (UTC+8 has no DST, so a fixed
* shift is exact). `boundaryMs` is the instant the current period ends — the
* window's close while peaking, the next window's open otherwise.
*/
function deepseekPeriodAt(ms) {
	const shifted = new Date(ms + BEIJING_UTC_OFFSET_MS);
	const weekday = shifted.getUTCDay();
	const minuteOfDay = shifted.getUTCHours() * 60 + shifted.getUTCMinutes();
	const current = weekday >= 1 && weekday <= 5 ? withinWindow(minuteOfDay) : void 0;
	if (current !== void 0) return {
		peak: true,
		boundaryMs: ms + (current.to - minuteOfDay) * 6e4 - shifted.getUTCSeconds() * 1e3 - shifted.getUTCMilliseconds()
	};
	for (let dayOffset = 0; dayOffset < 8; dayOffset += 1) {
		const day = new Date(ms + BEIJING_UTC_OFFSET_MS + dayOffset * 864e5);
		if (day.getUTCDay() < 1 || day.getUTCDay() > 5) continue;
		const realDayStart = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()) - BEIJING_UTC_OFFSET_MS;
		for (const window of PEAK_WINDOWS) {
			if (dayOffset === 0 && window.from <= minuteOfDay) continue;
			return {
				peak: false,
				boundaryMs: realDayStart + window.from * 6e4
			};
		}
	}
	return {
		peak: false,
		boundaryMs: ms + 864e5
	};
}
/** The price row for a model id; unknown ids take the flash-class row (documented estimate). */
function priceFor(model) {
	return model.includes("v4-pro") ? PRO_PRICE : FLASH_PRICE;
}
/**
* Estimate one call's DeepSeek spend in CNY from its token totals, priced in
* the billing period at `atMs`. Uncatalogued model ids take the flash-class
* row; ids from other providers never reach this function (the service gates
* by route family). Rounded to micro-CNY so the ledger stays readable.
*/
function deepseekModelSpend(model, totals, atMs) {
	const price = priceFor(model);
	const column = deepseekPeriodAt(atMs).peak ? "peak" : "offPeak";
	const spend = (totals.cacheReadTokens * price.cacheHit[column] + (totals.inputTokens + totals.cacheWriteTokens) * price.inputMiss[column] + totals.outputTokens * price.output[column]) / 1e6;
	return Math.round(spend * 1e6) / 1e6;
}
//#endregion
//#region src/core/types.ts
/** A zeroed totals bucket. */
function emptyTotals() {
	return {
		inputTokens: 0,
		outputTokens: 0,
		cacheReadTokens: 0,
		cacheWriteTokens: 0,
		reasoningTokens: 0,
		calls: 0,
		cost: 0
	};
}
/** Add `right` into `left` in place. */
function addTotals(left, right) {
	left.inputTokens += right.inputTokens;
	left.outputTokens += right.outputTokens;
	left.cacheReadTokens += right.cacheReadTokens;
	left.cacheWriteTokens += right.cacheWriteTokens;
	left.reasoningTokens += right.reasoningTokens;
	left.calls += right.calls;
	left.cost += right.cost;
	return left;
}
//#endregion
//#region src/core/ledger.ts
/**
* The usage ledger: a pure fold from session usage facts into a per-day,
* per-provider, per-model totals document, plus its JSON serialization.
* Host-side state lives only in the document; the service owns persistence.
* @module @linxin666/dsh-usage/core/ledger
*/
/** Local-date key (`YYYY-MM-DD`) for an epoch ms timestamp. */
function localDateKey(ms) {
	const date = new Date(ms);
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}
/** An empty ledger document. */
function createLedgerDocument() {
	return {
		version: 1,
		days: {}
	};
}
/**
* Bucket keys come from untrusted directions (persisted JSON, provider and
* model ids out of session events), so they must never collide with
* `Object.prototype` plumbing: assigning `day['__proto__']` or reading
* `day['constructor']` would pollute every object in the host process.
*/
function isSafeBucketKey(key) {
	return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}
/**
* Fold one usage report into the ledger in place. `provider` is the route key
* and `model` the provider-owned model id the step ran under. Reports keyed
* by prototype-plumbing names are dropped.
*/
function foldUsage(doc, atMs, provider, model, usage) {
	if (!isSafeBucketKey(provider) || !isSafeBucketKey(model)) return;
	if (usage.calls <= 0 && usage.inputTokens + usage.outputTokens + usage.cacheReadTokens + usage.cacheWriteTokens <= 0) return;
	const dayKey = localDateKey(atMs);
	const day = doc.days[dayKey] ?? {};
	const models = day[provider] ?? {};
	const totals = models[model] ?? emptyTotals();
	addTotals(totals, usage);
	models[model] = totals;
	day[provider] = models;
	doc.days[dayKey] = day;
}
/** Total tokens of a bucket (billed input + output; reasoning is inside output). */
function totalTokens(totals) {
	return totals.inputTokens + totals.cacheReadTokens + totals.cacheWriteTokens + totals.outputTokens;
}
/**
* Aggregate whole per-day maps (each `provider -> model -> totals`) into the
* per-provider/per-model summary the overview serves for one day or a range:
* disjoint bucket sums per provider, per-model rows heaviest first, and the
* grand total. Pure: reads its inputs, allocates fresh buckets.
*/
function summarizeDays(days) {
	const merged = /* @__PURE__ */ new Map();
	for (const day of days) for (const [provider, models] of Object.entries(day)) {
		if (!isSafeBucketKey(provider) || typeof models !== "object" || models === null) continue;
		let modelMap = merged.get(provider);
		if (modelMap === void 0) {
			modelMap = /* @__PURE__ */ new Map();
			merged.set(provider, modelMap);
		}
		for (const [model, totals] of Object.entries(models)) {
			if (typeof totals !== "object" || totals === null) continue;
			const bucket = modelMap.get(model) ?? emptyTotals();
			addTotals(bucket, totals);
			modelMap.set(model, bucket);
		}
	}
	const providers = [];
	const totals = emptyTotals();
	for (const [provider, modelMap] of merged) {
		const providerTotals = emptyTotals();
		const modelRows = [...modelMap].map(([model, modelTotals]) => ({
			model,
			totals: modelTotals
		}));
		for (const row of modelRows) addTotals(providerTotals, row.totals);
		modelRows.sort((a, b) => totalTokens(b.totals) - totalTokens(a.totals));
		providers.push({
			provider,
			totals: providerTotals,
			models: modelRows.slice(0, 12)
		});
	}
	providers.sort((a, b) => totalTokens(b.totals) - totalTokens(a.totals));
	for (const row of providers) addTotals(totals, row.totals);
	return {
		totals,
		providers
	};
}
/** All local-date keys in the ledger, ascending. */
function ledgerDayKeys(doc) {
	return Object.keys(doc.days).sort();
}
/**
* Drop every day older than `retainDays` local days before `todayKey`, in
* place. Returns the number of pruned days.
*/
function pruneLedger(doc, todayKey, retainDays) {
	const cutoff = /* @__PURE__ */ new Date(todayKey + "T00:00:00");
	cutoff.setDate(cutoff.getDate() - retainDays);
	const cutoffKey = localDateKey(cutoff.getTime());
	let pruned = 0;
	for (const key of Object.keys(doc.days)) if (key < cutoffKey) {
		delete doc.days[key];
		pruned += 1;
	}
	return pruned;
}
function reviveTotals(value) {
	if (typeof value !== "object" || value === null) return void 0;
	const source = value;
	const num = (key) => typeof source[key] === "number" && Number.isFinite(source[key]) ? source[key] : 0;
	return {
		inputTokens: num("inputTokens"),
		outputTokens: num("outputTokens"),
		cacheReadTokens: num("cacheReadTokens"),
		cacheWriteTokens: num("cacheWriteTokens"),
		reasoningTokens: num("reasoningTokens"),
		calls: num("calls"),
		cost: num("cost")
	};
}
/**
* Parse a ledger document from untrusted JSON: unknown shapes resolve to an
* empty document, malformed entries are dropped, numbers are coerced to
* finite values. Never throws.
*/
function deserializeLedger(value) {
	const doc = createLedgerDocument();
	if (typeof value !== "object" || value === null) return doc;
	const days = value.days;
	if (typeof days !== "object" || days === null) return doc;
	for (const [dateKey, providers] of Object.entries(days)) {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || typeof providers !== "object" || providers === null) continue;
		const atMs = (/* @__PURE__ */ new Date(dateKey + "T12:00:00")).getTime();
		if (!Number.isFinite(atMs) || localDateKey(atMs) !== dateKey) continue;
		for (const [provider, models] of Object.entries(providers)) {
			if (typeof models !== "object" || models === null) continue;
			for (const [model, totals] of Object.entries(models)) {
				const revived = reviveTotals(totals);
				if (revived !== void 0) foldUsage(doc, atMs, provider, model, revived);
			}
		}
	}
	return doc;
}
//#endregion
//#region src/host/usage-service.ts
/**
* The dsh-usage host service: folds live session usage into the persistent
* ledger, probes each configured provider's balance/coding-plan endpoint on
* a poll cycle, and announces the current provider's status to the pet
* bubble. Secrets stay in the host process; the browser only ever sees the
* overview document.
* @module @linxin666/dsh-usage/host/usage-service
*/
/** Source tag the plugin stamps onto pet announcements. */
const USAGE_ANNOUNCE_SOURCE = "dsh-usage";
/** Probe timeout per HTTP call. */
const PROBE_TIMEOUT_MS = 1e4;
/** Ledger flush debounce. */
const FLUSH_DEBOUNCE_MS = 3e3;
/** Currency symbols the bubble and section render inline; other codes render as `12.00 EUR`. */
const CURRENCY_SYMBOLS = {
	CNY: "¥",
	USD: "$",
	EUR: "€",
	GBP: "£"
};
/** Format a balance for display: symbol prefix when known, code suffix otherwise. */
function formatMoney(currency, totalBalance) {
	const symbol = CURRENCY_SYMBOLS[currency.toUpperCase()];
	if (symbol !== void 0) return symbol + totalBalance;
	return `${totalBalance} ${currency.toUpperCase()}`;
}
/** Map a used percent to the announcement tone. */
function planTone(percent) {
	if (percent >= 90) return "low";
	if (percent >= 70) return "warn";
	return "ok";
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
function buildAnnouncement(snapshot, context) {
	const todayCost = context?.todayCost ?? 0;
	if (todayCost > 0) {
		const peak = context?.peak ?? false;
		const noteParts = [peak ? "高峰时段 计价×2" : "空闲时段 计价减半", ...snapshot.balance !== void 0 ? [`余额 ${formatMoney(snapshot.balance.currency, snapshot.balance.totalBalance)}`] : []];
		return {
			kind: "cost",
			title: snapshot.displayName,
			amount: `今日 ${formatMoney("CNY", todayCost.toFixed(2))}`,
			...noteParts.length > 0 ? { note: noteParts.join(" · ") } : {},
			tone: peak ? "warn" : "ok"
		};
	}
	if (snapshot.balance !== void 0) return {
		kind: "balance",
		title: snapshot.displayName,
		amount: formatMoney(snapshot.balance.currency, snapshot.balance.totalBalance),
		tone: "ok"
	};
	if (snapshot.plan === void 0) return void 0;
	const window = snapshot.plan.windows.filter((entry) => typeof entry.percent === "number").sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))[0];
	if (window === void 0 || window.percent === void 0) return void 0;
	return {
		kind: "plan",
		title: snapshot.displayName,
		percent: window.percent,
		...window.resetsAt !== void 0 ? { resetAt: window.resetsAt } : {},
		...snapshot.plan.planName !== void 0 ? { note: snapshot.plan.planName } : {},
		tone: planTone(window.percent)
	};
}
/** Best-effort typed service read: absent services resolve to undefined at runtime. */
function service(ctx, name) {
	try {
		return ctx.get(name);
	} catch {
		return;
	}
}
/**
* Atomic JSON write through a unique temp file + fsync + rename. The temp
* name is per-call so two overlapping flushes can never interleave into one
* temp file, and the fsync closes the rename-lands-but-bytes-are-not-durable
* window.
*/
async function writeJsonAtomic(path, value) {
	const temp = `${path}.${process.pid}.${Date.now()}.tmp`;
	try {
		const handle = await open(temp, "w");
		try {
			await handle.writeFile(JSON.stringify(value, null, 1), "utf8");
			await handle.sync();
		} finally {
			await handle.close();
		}
		await rename(temp, path);
	} catch (error) {
		await unlink(temp).catch(() => {});
		throw error;
	}
}
/**
* Read a foreign settings namespace's resolved value (the llm adapter
* profiles, the agent default model). Unregistered namespaces read as
* undefined; nothing here throws into the poll loop.
*/
function readNamespace(ctx, ns) {
	try {
		const settings = service(ctx, "settings");
		if (settings === void 0) return void 0;
		return settings.get(ns);
	} catch {
		return;
	}
}
var UsageService = class {
	ctx;
	options;
	persistDir;
	ledgerPath;
	snapshotsPath;
	ledger = createLedgerDocument();
	snapshots = /* @__PURE__ */ new Map();
	/** Per-live-session route attribution (WeakMap: disposed sessions age out). */
	sessionRoutes = /* @__PURE__ */ new WeakMap();
	/** The most recent route seen this boot; the pet bubble follows it. */
	current = { source: "default" };
	sessionListenerDisposer;
	pollTimer;
	flushTimer;
	pollInFlight = false;
	/** The running poll cycle; manual refresh joins it instead of no-oping. */
	pollPromise;
	/** Serialized ledger flushes: overlapping debounce/stop flushes queue, never interleave. */
	flushChain = Promise.resolve();
	/** True once loadPersisted finished; nothing may overwrite the files before that. */
	loaded = false;
	disposed = false;
	lastSignature;
	/** Last prune guard: once per local day, and whenever retention shrinks. */
	lastPrune;
	constructor(ctx, options) {
		this.ctx = ctx;
		this.options = options;
		this.persistDir = join(dshHome(), "dsh-usage");
		this.ledgerPath = join(this.persistDir, "usage-ledger.json");
		this.snapshotsPath = join(this.persistDir, "provider-snapshots.json");
	}
	/** Start the listeners, load persisted state, and arm the first poll. */
	start() {
		this.sessionListenerDisposer = this.ctx.on("session/event", (session, event) => this.onSessionEvent(session, event));
		this.loadPersisted();
		this.rearmPoll(2e3);
	}
	/**
	* Stop timers and flush pending ledger writes. The returned promise
	* resolves after the final flush lands, so a successor instance (quick
	* disable → enable) can serialize its first load behind it.
	*/
	stop() {
		this.disposed = true;
		if (this.pollTimer !== void 0) clearTimeout(this.pollTimer);
		if (this.flushTimer !== void 0) clearTimeout(this.flushTimer);
		this.sessionListenerDisposer?.();
		return this.flushLedger();
	}
	/** Re-apply options live (settings change); retention shrink prunes now. */
	applyOptions(options) {
		this.options = options;
		this.pruneIfNeeded();
	}
	/** Force one poll now (manual refresh route); joins an in-flight cycle. */
	async refresh() {
		await this.pollNow();
	}
	/** Assemble the overview document the browser section renders. */
	overview() {
		const todayKey = localDateKey(Date.now());
		const routes = this.listProviderRoutes();
		const providers = [];
		for (const route of routes) {
			const adapter = adapterFor(route.id);
			const snapshot = this.snapshots.get(route.id);
			const error = snapshot?.balanceError ?? snapshot?.planError;
			providers.push({
				provider: route.id,
				displayName: route.displayName || adapter?.displayName || route.id,
				credential: snapshot?.credential ?? "none",
				supported: adapter !== void 0 && (adapter.balance !== void 0 || adapter.plan !== void 0),
				...adapter?.balance !== void 0 ? { balanceSupported: true } : {},
				...adapter?.plan !== void 0 ? { planSupported: true } : {},
				...snapshot?.balance !== void 0 ? { balance: snapshot.balance } : {},
				...snapshot?.plan !== void 0 ? { plan: snapshot.plan } : {},
				...error !== void 0 ? { error } : {},
				...snapshot?.updatedAt !== void 0 ? { updatedAt: snapshot.updatedAt } : {}
			});
		}
		providers.sort((a, b) => Number(b.supported) - Number(a.supported) || a.displayName.localeCompare(b.displayName));
		const days = ledgerDayKeys(this.ledger).slice(-30);
		const range = summarizeDays(days.map((key) => this.ledger.days[key] ?? {}));
		return {
			updatedAt: Date.now(),
			providers,
			current: { ...this.current },
			usage: {
				today: this.daySummary(todayKey),
				days: days.map((date) => {
					return {
						date,
						totals: this.daySummary(date).totals
					};
				}),
				range: {
					from: days[0] ?? todayKey,
					to: days[days.length - 1] ?? todayKey,
					totals: range.totals,
					providers: range.providers
				}
			}
		};
	}
	/** One local day aggregated per provider. */
	daySummary(dateKey) {
		const { totals, providers } = summarizeDays([this.ledger.days[dateKey] ?? {}]);
		return {
			date: dateKey,
			totals,
			providers
		};
	}
	/** Today's ledger spend for one provider's adapter family (0 when unpriced). */
	familyCostToday(provider) {
		const family = adapterFor(provider);
		if (family === void 0) return 0;
		let cost = 0;
		for (const row of this.daySummary(localDateKey(Date.now())).providers) if (adapterFor(row.provider) === family) cost += row.totals.cost;
		return cost;
	}
	onSessionEvent(session, event) {
		try {
			if (event.type === "request/header") {
				const config = event.data.header?.config;
				if (config?.provider !== void 0) {
					this.sessionRoutes.set(session, {
						provider: config.provider,
						model: config.model ?? ""
					});
					this.current = {
						provider: config.provider,
						model: config.model,
						source: "live"
					};
				}
			} else if (event.type === "request/context") {
				const data = event.data;
				if (data.provider !== void 0) {
					this.sessionRoutes.set(session, {
						provider: data.provider,
						model: data.model ?? ""
					});
					this.current = {
						provider: data.provider,
						model: data.model,
						source: "live"
					};
				}
			} else if (event.type === "assistant/message") {
				const usage = event.data.usage;
				if (usage === void 0) return;
				const route = this.sessionRoutes.get(session);
				if (route === void 0 || route.provider === "") return;
				foldUsage(this.ledger, Date.now(), route.provider, route.model || "unknown", this.totalsFrom(usage, route.provider, route.model || "unknown", Date.now()));
				this.scheduleFlush();
			}
		} catch {}
	}
	/**
	* Normalize a provider TokenUsage into the ledger bucket (one call). The
	* DeepSeek official family is priced at the fold instant (its billing
	* period is time-of-day); other families stay unpriced (cost 0).
	*/
	totalsFrom(usage, provider, model, atMs) {
		const totals = emptyTotals();
		totals.inputTokens = usage.inputTokens;
		totals.outputTokens = usage.outputTokens;
		totals.cacheReadTokens = usage.cacheReadTokens ?? 0;
		totals.cacheWriteTokens = usage.cacheWriteTokens ?? 0;
		totals.reasoningTokens = usage.reasoningTokens ?? 0;
		totals.calls = 1;
		if (isDeepSeekProviderRoute(provider)) totals.cost = deepseekModelSpend(model, totals, atMs);
		return totals;
	}
	async loadPersisted() {
		try {
			const [rawLedger, rawSnapshots] = await Promise.all([readFile(this.ledgerPath, "utf8").catch(() => void 0), readFile(this.snapshotsPath, "utf8").catch(() => void 0)]);
			if (rawLedger !== void 0) {
				const loaded = deserializeLedger(JSON.parse(rawLedger));
				for (const [dayKey, providers] of Object.entries(loaded.days)) {
					const atMs = (/* @__PURE__ */ new Date(dayKey + "T12:00:00")).getTime();
					for (const [provider, models] of Object.entries(providers)) for (const [model, totals] of Object.entries(models)) foldUsage(this.ledger, atMs, provider, model, totals);
				}
				pruneLedger(this.ledger, localDateKey(Date.now()), this.options.retainDays);
				this.lastPrune = {
					dayKey: localDateKey(Date.now()),
					retainDays: this.options.retainDays
				};
			}
			if (rawSnapshots !== void 0) {
				const parsed = JSON.parse(rawSnapshots);
				if (typeof parsed === "object" && parsed !== null && typeof parsed.providers === "object" && parsed.providers !== null) {
					for (const [provider, snapshot] of Object.entries(parsed.providers)) if (typeof snapshot === "object" && snapshot !== null && typeof snapshot.provider === "string") this.snapshots.set(provider, snapshot);
				}
			}
		} catch {} finally {
			this.loaded = true;
		}
	}
	scheduleFlush() {
		if (this.flushTimer !== void 0 || this.disposed) return;
		this.flushTimer = setTimeout(() => {
			this.flushTimer = void 0;
			this.flushLedger();
		}, FLUSH_DEBOUNCE_MS);
	}
	/**
	* Queue one ledger flush behind the previous one. Debounce and stop-time
	* flushes serialize here, so two `writeJsonAtomic` calls can never run
	* concurrently on the same path.
	*/
	flushLedger() {
		const next = this.flushChain.then(() => this.writeLedgerOnce());
		this.flushChain = next.catch(() => {});
		return next;
	}
	async writeLedgerOnce() {
		if (!this.loaded) return;
		try {
			await mkdir(dirname(this.ledgerPath), { recursive: true });
			await writeJsonAtomic(this.ledgerPath, this.ledger);
		} catch {}
	}
	/**
	* Prune days past retention. Runs at most once per local day and whenever
	* `retainDays` shrinks — not only at startup, so long-lived processes and
	* live settings changes both honor retention.
	*/
	pruneIfNeeded() {
		const todayKey = localDateKey(Date.now());
		if (this.lastPrune?.dayKey === todayKey && this.lastPrune.retainDays === this.options.retainDays) return;
		const pruned = pruneLedger(this.ledger, todayKey, this.options.retainDays);
		this.lastPrune = {
			dayKey: todayKey,
			retainDays: this.options.retainDays
		};
		if (pruned > 0) this.scheduleFlush();
	}
	async persistSnapshots() {
		if (!this.loaded) return;
		try {
			await mkdir(dirname(this.snapshotsPath), { recursive: true });
			await writeJsonAtomic(this.snapshotsPath, {
				version: 1,
				providers: Object.fromEntries(this.snapshots)
			});
		} catch {}
	}
	rearmPoll(delayMs) {
		if (this.disposed) return;
		if (this.pollTimer !== void 0) clearTimeout(this.pollTimer);
		this.pollTimer = setTimeout(() => {
			this.pollTimer = void 0;
			this.pollNow().finally(() => this.rearmPoll(Math.max(30, this.options.pollIntervalSec) * 1e3));
		}, delayMs);
	}
	/**
	* One poll cycle: enumerate routes, resolve credentials, probe, announce.
	* A call while a cycle is already running joins that cycle instead of
	* returning immediately, so a manual refresh always waits for real probes.
	*/
	pollNow() {
		if (this.pollInFlight) return this.pollPromise ?? Promise.resolve();
		if (this.disposed) return Promise.resolve();
		this.pollInFlight = true;
		const cycle = (async () => {
			try {
				this.pruneIfNeeded();
				const routes = this.listProviderRoutes();
				const seen = /* @__PURE__ */ new Set();
				for (const route of routes) {
					if (this.disposed) return;
					seen.add(route.id);
					const adapter = adapterFor(route.id);
					if (adapter === void 0 || adapter.balance === void 0 && adapter.plan === void 0) continue;
					await this.probeRoute(route, adapter);
				}
				for (const id of [...this.snapshots.keys()]) if (!seen.has(id)) this.snapshots.delete(id);
				if (this.disposed) return;
				await this.persistSnapshots();
				this.announceCurrent();
			} finally {
				this.pollInFlight = false;
				this.pollPromise = void 0;
			}
		})();
		this.pollPromise = cycle;
		return cycle;
	}
	listProviderRoutes() {
		const routes = /* @__PURE__ */ new Map();
		const runtime = service(this.ctx, "llm");
		if (runtime !== void 0) try {
			for (const provider of runtime.listProviders()) if (provider.id !== "") routes.set(provider.id, provider.name);
			for (const provider of runtime.listConfigurableProviders()) if (!routes.has(provider.provider)) routes.set(provider.provider, provider.displayName);
		} catch {}
		return [...routes].map(([id, displayName]) => ({
			id,
			displayName
		}));
	}
	async probeRoute(route, adapter) {
		const credential = await this.resolveCredential(route.id);
		const previous = this.snapshots.get(route.id);
		if (credential.key === void 0) {
			this.snapshots.set(route.id, {
				provider: route.id,
				displayName: route.displayName || adapter.displayName,
				credential: credential.kind,
				supported: true,
				updatedAt: Date.now()
			});
			return;
		}
		const snapshot = {
			provider: route.id,
			displayName: route.displayName || adapter.displayName,
			credential: credential.kind,
			supported: true,
			updatedAt: Date.now()
		};
		const runProbe = async (kind) => {
			const half = adapter[kind];
			if (half === void 0) return void 0;
			try {
				const spec = half.build({
					apiKey: credential.key,
					...credential.accountId !== void 0 ? { accountId: credential.accountId } : {}
				});
				const response = await fetch(spec.url, {
					headers: spec.headers,
					signal: AbortSignal.timeout(PROBE_TIMEOUT_MS)
				});
				const body = await response.json().catch(() => void 0);
				if (!response.ok) throw new Error(providerErrorMessage(response.status, body));
				const parsed = half.parse(response.status, body);
				if (parsed === void 0) throw new Error("unrecognized response shape");
				const updatedAt = Date.now();
				if (kind === "balance") {
					const fact = parsed;
					return {
						currency: fact.currency,
						totalBalance: fact.totalBalance,
						updatedAt
					};
				}
				const plan = parsed;
				return {
					planName: plan.planName,
					windows: plan.windows,
					updatedAt
				};
			} catch (error) {
				const message = error instanceof Error ? error.message.slice(0, 200) : String(error);
				if (kind === "balance") snapshot.balanceError = message;
				else snapshot.planError = message;
				return;
			}
		};
		const balance = await runProbe("balance");
		if (balance !== void 0) snapshot.balance = balance;
		else if (previous?.balance !== void 0) snapshot.balance = previous.balance;
		const plan = await runProbe("plan");
		if (plan !== void 0) snapshot.plan = plan;
		else if (previous?.plan !== void 0) snapshot.plan = previous.plan;
		this.snapshots.set(route.id, snapshot);
	}
	/**
	* Resolve the credential backing one route: pi-ai credential records
	* first, then the profile's apiKeyEnv reference, then the DeepSeek
	* official adapter's env reference. OAuth grants hand their stored access
	* token to the oauth-aware adapters (Codex plan quota); a stale token
	* fails its probe with a 401 and refreshes the next time the harness
	* itself runs that provider.
	*/
	async resolveCredential(provider) {
		const credentials = service(this.ctx, "credentials");
		if (credentials === void 0) return { kind: "none" };
		try {
			const record = await credentials.readRecord(credentialKey("llm-pi-ai", provider));
			if (record?.kind === "api-key" && typeof record.key === "string" && record.key !== "") return {
				kind: "api-key",
				key: record.key
			};
			if (record?.kind === "grant" && typeof record.payload === "object" && record.payload !== null) {
				const payload = record.payload;
				const access = typeof payload.access === "string" && payload.access !== "" ? payload.access : void 0;
				const accountId = typeof payload.chatgpt_account_id === "string" && payload.chatgpt_account_id !== "" ? payload.chatgpt_account_id : void 0;
				if (access !== void 0) return {
					kind: "oauth",
					key: access,
					...accountId !== void 0 ? { accountId } : {}
				};
				return { kind: "oauth" };
			}
		} catch {}
		try {
			const envName = this.piAiProfile(provider)?.apiKeyEnv ?? (isDeepSeekProviderRoute(provider) ? this.deepseekApiKeyEnv() : void 0);
			if (typeof envName === "string" && envName !== "") {
				const resolved = await credentials.resolve(credentialRef(envName));
				if (resolved?.value !== void 0 && resolved.value !== "") return {
					kind: "env",
					key: resolved.value
				};
			}
		} catch {}
		return { kind: "none" };
	}
	/** The llm-pi-ai profile object for one provider route, when configured. */
	piAiProfile(provider) {
		return readNamespace(this.ctx, "llm-pi-ai")?.providers?.[provider];
	}
	/** The DeepSeek official adapter's credential reference name. */
	deepseekApiKeyEnv() {
		return readNamespace(this.ctx, "llm-deepseek")?.apiKeyEnv ?? "DEEPSEEK_API_KEY";
	}
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
	announceCurrent() {
		if (this.disposed || this.options.bubbleMode === "off") return;
		try {
			let provider = this.current.provider;
			if (provider === void 0) {
				const fallback = readNamespace(this.ctx, "agent-default-model");
				if (fallback?.provider !== void 0) {
					provider = fallback.provider;
					this.current = {
						provider: fallback.provider,
						model: fallback.model,
						source: "default"
					};
				} else return;
			}
			let snapshot = this.snapshots.get(provider);
			if (snapshot === void 0) {
				const family = adapterFor(provider);
				if (family !== void 0) {
					for (const [id, candidate] of this.snapshots) if (adapterFor(id) === family) {
						snapshot = candidate;
						break;
					}
				}
			}
			if (snapshot === void 0) return;
			const announcement = buildAnnouncement(snapshot, {
				todayCost: this.familyCostToday(provider),
				peak: deepseekPeriodAt(Date.now()).peak
			});
			if (announcement === void 0) return;
			const signature = JSON.stringify(announcement);
			if (this.options.bubbleMode === "change" && signature === this.lastSignature) return;
			this.lastSignature = signature;
			const ttlMs = Math.min(72e5, this.options.pollIntervalSec * 2e3 + 3e4);
			service(this.ctx, "pet")?.announce({
				source: USAGE_ANNOUNCE_SOURCE,
				ttlMs,
				...announcement
			});
		} catch {}
	}
};
//#endregion
//#region src/host/loopback.ts
/** IPv4 127/8 predicate (four decimal octets, first == 127). */
function isIPv4Loopback(v4) {
	const parts = v4.split(".");
	return parts.length === 4 && parts[0] === "127" && parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
}
/** Whether a socket remote address names the loopback range (127/8, ::1, IPv4-mapped). */
function isLoopbackAddress(address) {
	if (address === void 0) return false;
	const normalized = address.toLowerCase();
	if (normalized === "::1") return true;
	if (normalized.startsWith("::ffff:")) return isIPv4Loopback(normalized.slice(7));
	return isIPv4Loopback(normalized);
}
/** Whether a normalized URL hostname names the loopback authority (localhost, [::1], 127/8). */
function isLoopbackHostname(hostname) {
	if (hostname === "localhost" || hostname === "[::1]") return true;
	return isIPv4Loopback(hostname);
}
/**
* Request-level trust fence: a loopback socket address AND a loopback Host
* header, plus browser same-origin markers. The socket address is
* authoritative; X-Forwarded-For is never trusted.
*/
function isLoopbackRequest(request) {
	if (!isLoopbackAddress(request.socket.remoteAddress)) return false;
	const host = request.headers.host;
	if (typeof host !== "string") return false;
	let hostUrl;
	try {
		hostUrl = new URL("http://" + host);
	} catch {
		return false;
	}
	if (!isLoopbackHostname(hostUrl.hostname)) return false;
	if (request.headers["sec-fetch-site"] === "cross-site") return false;
	const origin = request.headers.origin;
	if (origin === void 0) return true;
	try {
		return new URL(origin).host === hostUrl.host;
	} catch {
		return false;
	}
}
//#endregion
//#region src/host/http.ts
/** Family-default JSON response headers; callers may append or override. */
const JSON_HEADERS = {
	"content-type": "application/json; charset=utf-8",
	"referrer-policy": "no-referrer"
};
/**
* Write one JSON response. Default headers are the family defaults
* (content-type and referrer-policy); caller headers are appended or
* override them.
*/
function writeJson(res, status, body, headers = {}) {
	const payload = JSON.stringify(body);
	res.writeHead(status, {
		...JSON_HEADERS,
		...headers
	});
	res.end(payload);
}
//#endregion
//#region src/host/routes.ts
/**
* Loopback-fenced overview route: provider balances, plan quotas, and token
* usage totals. Personal account data, so the loopback fence mirrors
* dsh-perf's stats surface; the browser runs on the same machine.
*/
function makeUsageOverviewRoute(service) {
	return {
		kind: "exact",
		path: "/api/dsh-usage/overview",
		handler: async (req, res) => {
			if (!isLoopbackRequest(req)) {
				writeJson(res, 403, {
					ok: false,
					error: "forbidden: loopback-only"
				});
				return;
			}
			writeJson(res, 200, service.overview(), { "cache-control": "no-store" });
		}
	};
}
/**
* Loopback-fenced manual refresh: forces one probe cycle now and answers
* with the fresh overview.
*/
function makeUsageRefreshRoute(service) {
	return {
		kind: "exact",
		path: "/api/dsh-usage/refresh",
		handler: async (req, res) => {
			if (!isLoopbackRequest(req)) {
				writeJson(res, 403, {
					ok: false,
					error: "forbidden: loopback-only"
				});
				return;
			}
			if (req.method !== "POST") {
				writeJson(res, 405, {
					ok: false,
					error: "method not allowed"
				});
				return;
			}
			try {
				await service.refresh();
			} catch (error) {
				writeJson(res, 500, {
					ok: false,
					error: error instanceof Error ? error.message : "refresh failed"
				});
				return;
			}
			writeJson(res, 200, service.overview(), { "cache-control": "no-store" });
		}
	};
}
//#endregion
//#region src/index.ts
const name = "dsh-usage";
const inject = ["webServer"];
const USAGE_SETTINGS_NAMESPACE = "dsh-usage";
const Config = z.object({
	enabled: z.boolean().default(true),
	pollIntervalSec: z.number().min(30).max(3600).default(60),
	bubbleMode: z.string().default("always"),
	retainDays: z.number().min(7).max(730).default(180)
});
function resolveConfig(config) {
	const bubbleMode = config?.bubbleMode === "change" || config?.bubbleMode === "off" ? config.bubbleMode : "always";
	return {
		enabled: config?.enabled ?? true,
		pollIntervalSec: typeof config?.pollIntervalSec === "number" ? config.pollIntervalSec : 60,
		bubbleMode,
		retainDays: typeof config?.retainDays === "number" ? config.retainDays : 180
	};
}
const apply = mountOnce("@linxin666/dsh-usage", (ctx, config) => {
	let source = () => config ?? {};
	let service;
	let pendingStop;
	let disposeRoutes;
	const rearm = () => {
		const value = resolveConfig(source());
		if (!value.enabled) {
			pendingStop = service?.stop();
			service = void 0;
			disposeRoutes?.();
			disposeRoutes = void 0;
			return;
		}
		if (service === void 0) {
			const next = new UsageService(ctx, value);
			service = next;
			const begin = () => {
				if (service !== next) return;
				next.start();
				const disposers = [makeUsageOverviewRoute(next), makeUsageRefreshRoute(next)].map((route) => ctx.webServer.register(route));
				disposeRoutes = () => {
					for (const dispose of disposers) try {
						dispose();
					} catch {}
				};
			};
			if (pendingStop !== void 0) pendingStop.then(begin, begin);
			else begin();
		} else service.applyOptions(value);
	};
	ctx.inject(["settings"], (settingsCtx) => {
		settingsCtx.settings.installSection(ctx, USAGE_SETTINGS_NAMESPACE, Config, config ?? {}, {
			setSource: (next) => {
				source = next;
				rearm();
			},
			onChange: rearm
		});
	});
	ctx.effect(() => {
		rearm();
		return () => {
			disposeRoutes?.();
			service?.stop();
			service = void 0;
		};
	}, "dsh-usage: runtime");
});
//#endregion
export { Config, USAGE_SETTINGS_NAMESPACE, apply, inject, name, resolveConfig };
