window.__ModuleLoader__.load({
	id: "@linxin666/dsh-usage",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region \0dsh-store-engine
		const platform = ["@deepseek-ai/dsh-client", "-store"].join("");
		const legacy = ["@deepseek-ai/dsh-client-runtime", "/client"].join("");
		let engine;
		try {
			engine = require(platform);
		} catch {
			engine = require(legacy);
		}
		engine.createSnapshotStore;
		const defineStore = engine.defineStore;
		engine.shallowEqual;
		//#endregion
		//#region src/client/usage-store.ts
		/**
		* Browser-side usage store: the overview snapshot polled from the host plus
		* the fetch lifecycle. Section-local: the store lives while the settings
		* section is mounted, so polling only runs while the page is open.
		* @module @linxin666/dsh-usage/client/usage-store
		*/
		/** Create the usage store handle (apply world only; never module-level). */
		function createUsageStore() {
			return defineStore({
				init: () => ({
					snapshot: null,
					status: "loading",
					error: null
				}),
				actions: {
					setSnapshot: (draft, snapshot) => {
						draft.snapshot = snapshot;
						draft.status = "ready";
						draft.error = null;
					},
					setState: (draft, status, error) => {
						draft.status = status;
						draft.error = error;
					}
				}
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/**
		* dsh-usage locale dictionaries (zh/en). The zh dictionary is the key source;
		* `en` mirrors its full key set (packages/AGENTS.md bilingual discipline).
		* @module @linxin666/dsh-usage/client/locales
		*/
		/** Dictionary namespace this package registers. */
		const NS = "dsh-web-ui-usage";
		/** Chinese copy. */
		const zh = {
			"usage.title": "使用统计",
			"usage.tab.usage": "用量",
			"usage.tab.plans": "个人套餐",
			"usage.refresh": "刷新",
			"usage.refreshing": "刷新中…",
			"usage.updated": "更新于 {time}",
			"usage.loading": "正在加载用量数据…",
			"usage.error": "加载失败：{error}",
			"usage.current": "当前",
			"usage.today": "今日用量",
			"usage.today.cost": "今日消费（估算）",
			"usage.peak.on": "DeepSeek 高峰时段：计价 ×2，{time} 结束",
			"usage.peak.off": "DeepSeek 空闲时段：计价为高峰一半，{time} 进入高峰",
			"usage.calls": "{n} 次调用",
			"usage.tokens.total": "总 tokens",
			"usage.tokens.input": "输入",
			"usage.tokens.output": "输出",
			"usage.tokens.cacheRead": "缓存读",
			"usage.tokens.cacheWrite": "缓存写",
			"usage.trend": "近 30 天",
			"usage.noData": "暂无用量数据（统计自插件启用起）",
			"usage.balance": "余额",
			"usage.balance.unsupported": "暂不支持余额查询",
			"usage.balance.noCredential": "未配置凭据",
			"usage.oauth": "OAuth 凭据，不做余额查询",
			"usage.plan.reset": "{date} 重置",
			"usage.plan.noPlan": "未检测到套餐数据",
			"usage.plan.noneConfigured": "没有已配置的套餐类 provider（如 Kimi、GLM、OpenCode Go、MiniMax、Codex 订阅）",
			"usage.plan.windows.5h": "5 小时",
			"usage.plan.windows.week": "每周",
			"usage.plan.windows.month": "每月",
			"usage.provider.error": "查询失败：{error}",
			"usage.errorListSeparator": "；",
			"usage.config.title": "设置",
			"usage.config.enabled": "启用插件",
			"usage.config.pollIntervalSec": "轮询间隔（秒）",
			"usage.config.bubbleMode": "宠物气泡",
			"usage.config.bubbleMode.always": "常驻显示",
			"usage.config.bubbleMode.change": "仅变化时",
			"usage.config.bubbleMode.off": "关闭"
		};
		/** English mirror; every zh key present. */
		const en = {
			"usage.title": "Usage Statistics",
			"usage.tab.usage": "Usage",
			"usage.tab.plans": "Plans",
			"usage.refresh": "Refresh",
			"usage.refreshing": "Refreshing…",
			"usage.updated": "Updated {time}",
			"usage.loading": "Loading usage data…",
			"usage.error": "Failed to load: {error}",
			"usage.current": "Current",
			"usage.today": "Today",
			"usage.today.cost": "Today spend (estimated)",
			"usage.peak.on": "DeepSeek peak hours: 2x pricing, ends {time}",
			"usage.peak.off": "DeepSeek off-peak: half of peak pricing, peak returns {time}",
			"usage.calls": "{n} calls",
			"usage.tokens.total": "Total tokens",
			"usage.tokens.input": "Input",
			"usage.tokens.output": "Output",
			"usage.tokens.cacheRead": "Cache read",
			"usage.tokens.cacheWrite": "Cache write",
			"usage.trend": "Last 30 days",
			"usage.noData": "No usage data yet (counting starts when the plugin is enabled)",
			"usage.balance": "Balance",
			"usage.balance.unsupported": "Balance query not supported",
			"usage.balance.noCredential": "No credential configured",
			"usage.oauth": "OAuth credential, no balance query",
			"usage.plan.reset": "resets {date}",
			"usage.plan.noPlan": "No plan data detected",
			"usage.plan.noneConfigured": "No plan-capable provider configured (such as Kimi, GLM, OpenCode Go, MiniMax, Codex subscription)",
			"usage.plan.windows.5h": "5 hours",
			"usage.plan.windows.week": "Weekly",
			"usage.plan.windows.month": "Monthly",
			"usage.provider.error": "Query failed: {error}",
			"usage.errorListSeparator": "; ",
			"usage.config.title": "Settings",
			"usage.config.enabled": "Enable plugin",
			"usage.config.pollIntervalSec": "Poll interval (seconds)",
			"usage.config.bubbleMode": "Pet bubble",
			"usage.config.bubbleMode.always": "Always visible",
			"usage.config.bubbleMode.change": "On change",
			"usage.config.bubbleMode.off": "Off"
		};
		/**
		* Active dictionary, picked by the document language at call time. The
		* section resolves its copy the same tiny way the pet's DOM-injected surface
		* does (the settings section has no framework locale seat of its own).
		*/
		function dictionary() {
			return (typeof document !== "undefined" ? document.documentElement.lang : "zh").toLowerCase().startsWith("en") ? en : zh;
		}
		/** Translate a key with optional `{name}` template params; missing keys degrade to the key. */
		function t(key, params) {
			let text = dictionary()[key] ?? key;
			if (params !== void 0) for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value));
			return text;
		}
		//#endregion
		//#region \0dsh-css:packages/dsh-usage/src/client/usage.module.css.mjs
		const css = ".cvtkAW_section{color:inherit;flex-direction:column;gap:16px;display:flex}.cvtkAW_header{justify-content:space-between;align-items:center;gap:12px;display:flex}.cvtkAW_currentProvider{opacity:.75;font-size:13px}.cvtkAW_refreshBtn{appearance:none;color:inherit;font:inherit;cursor:pointer;opacity:.85;background:0 0;border:1px solid;border-radius:8px;padding:4px 12px;font-size:12px;transition:opacity .12s,background-color .12s}.cvtkAW_refreshBtn:hover:not(:disabled){opacity:1;background:color-mix(in srgb, currentColor 8%, transparent)}.cvtkAW_refreshBtn:disabled{cursor:default;opacity:.5}.cvtkAW_refreshBtn:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb, currentColor 45%, transparent);outline:none}.cvtkAW_tabs{border-bottom:1px solid color-mix(in srgb, currentColor 14%, transparent);gap:4px;display:flex}.cvtkAW_tab{appearance:none;color:inherit;font:inherit;cursor:pointer;opacity:.65;background:0 0;border:none;border-bottom:2px solid #0000;margin-bottom:-1px;padding:6px 14px;font-size:13px}.cvtkAW_tab:hover{opacity:.9}.cvtkAW_tab:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb, currentColor 45%, transparent);outline:none}.cvtkAW_tabActive{opacity:1;border-bottom-color:currentColor;font-weight:600}.cvtkAW_card{border:1px solid color-mix(in srgb, currentColor 14%, transparent);border-radius:12px;flex-direction:column;gap:10px;padding:14px 16px;display:flex}.cvtkAW_cardTitle{letter-spacing:.04em;text-transform:uppercase;opacity:.6;font-size:12px;font-weight:600}.cvtkAW_statRow{flex-wrap:wrap;gap:18px;display:flex}.cvtkAW_stat{flex-direction:column;gap:2px;display:flex}.cvtkAW_statValue{font-variant-numeric:tabular-nums;font-size:18px;font-weight:600}.cvtkAW_statLabel{opacity:.6;font-size:11px}.cvtkAW_providerRow{border-top:1px solid color-mix(in srgb, currentColor 8%, transparent);justify-content:space-between;align-items:center;gap:12px;padding:6px 0;font-size:13px;display:flex}.cvtkAW_providerRow:first-of-type{border-top:none}.cvtkAW_providerName{align-items:center;gap:8px;min-width:0;display:flex}.cvtkAW_providerTokens{font-variant-numeric:tabular-nums;opacity:.75;white-space:nowrap}.cvtkAW_providerBalance{font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:600}.cvtkAW_currentBadge{border:1px solid color-mix(in srgb, currentColor 35%, transparent);opacity:.8;border-radius:999px;flex:none;padding:1px 7px;font-size:10px;font-weight:600}.cvtkAW_chart{flex-direction:column;gap:12px;display:flex}.cvtkAW_chartProvider{flex-direction:column;gap:4px;display:flex}.cvtkAW_chartHead{justify-content:space-between;align-items:baseline;gap:10px;font-size:13px;display:flex}.cvtkAW_chartTokens{font-variant-numeric:tabular-nums;opacity:.65;white-space:nowrap;font-size:11px}.cvtkAW_chartBar{background:color-mix(in srgb, currentColor 8%, transparent);border-radius:999px;height:8px;display:block;overflow:hidden}.cvtkAW_chartFill{background:color-mix(in srgb, currentColor 55%, transparent);border-radius:999px;height:100%;transition:width .3s;display:block}.cvtkAW_chartModel{opacity:.8;grid-template-columns:minmax(80px,180px) 1fr auto;align-items:center;gap:8px;padding-left:14px;font-size:11px;display:grid}.cvtkAW_chartModelName{text-overflow:ellipsis;white-space:nowrap;opacity:.8;overflow:hidden}.cvtkAW_chartModelBar{background:color-mix(in srgb, currentColor 6%, transparent);border-radius:999px;height:4px;display:block;overflow:hidden}.cvtkAW_chartModelFill{background:color-mix(in srgb, currentColor 35%, transparent);border-radius:999px;height:100%;transition:width .3s;display:block}.cvtkAW_trendAxis{opacity:.5;font-variant-numeric:tabular-nums;justify-content:space-between;font-size:10px;display:flex}.cvtkAW_muted{opacity:.6;font-size:12px}.cvtkAW_errorLine{opacity:.75;font-size:12px}.cvtkAW_planCard{flex-direction:column;gap:8px;display:flex}.cvtkAW_planHead{justify-content:space-between;align-items:baseline;gap:10px;display:flex}.cvtkAW_planName{font-size:14px;font-weight:600}.cvtkAW_windowRow{flex-direction:column;gap:4px;display:flex}.cvtkAW_windowLabel{opacity:.8;font-variant-numeric:tabular-nums;justify-content:space-between;font-size:12px;display:flex}.cvtkAW_bar{background:color-mix(in srgb, currentColor 10%, transparent);border-radius:999px;height:6px;overflow:hidden}.cvtkAW_barFill{background:color-mix(in srgb, currentColor 55%, transparent);border-radius:999px;height:100%;transition:width .3s}.cvtkAW_barWarn{background:#d97706}.cvtkAW_barLow{background:#dc2626}.cvtkAW_resetLine{opacity:.55;font-variant-numeric:tabular-nums;font-size:11px}.cvtkAW_settingsGrid{flex-wrap:wrap;align-items:center;gap:16px;display:flex}.cvtkAW_settingItem{align-items:center;gap:8px;font-size:13px;display:flex}.cvtkAW_settingItem input[type=checkbox]{accent-color:currentColor}.cvtkAW_settingItem input[type=number]{border:1px solid color-mix(in srgb, currentColor 25%, transparent);width:90px;color:inherit;font:inherit;background:0 0;border-radius:6px;padding:3px 8px;font-size:13px}.cvtkAW_settingItem select{border:1px solid color-mix(in srgb, currentColor 25%, transparent);color:inherit;font:inherit;background:0 0;border-radius:6px;padding:3px 8px;font-size:13px}.cvtkAW_settingItem input:focus-visible,.cvtkAW_settingItem select:focus-visible{box-shadow:0 0 0 2px color-mix(in srgb, currentColor 45%, transparent);outline:none}";
		const tagId = "@linxin666/dsh-usage/usage.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@linxin666/dsh-usage";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var usage_module_css_default = {
			"bar": "cvtkAW_bar",
			"barFill": "cvtkAW_barFill",
			"barLow": "cvtkAW_barLow",
			"barWarn": "cvtkAW_barWarn",
			"card": "cvtkAW_card",
			"cardTitle": "cvtkAW_cardTitle",
			"chart": "cvtkAW_chart",
			"chartBar": "cvtkAW_chartBar",
			"chartFill": "cvtkAW_chartFill",
			"chartHead": "cvtkAW_chartHead",
			"chartModel": "cvtkAW_chartModel",
			"chartModelBar": "cvtkAW_chartModelBar",
			"chartModelFill": "cvtkAW_chartModelFill",
			"chartModelName": "cvtkAW_chartModelName",
			"chartProvider": "cvtkAW_chartProvider",
			"chartTokens": "cvtkAW_chartTokens",
			"currentBadge": "cvtkAW_currentBadge",
			"currentProvider": "cvtkAW_currentProvider",
			"errorLine": "cvtkAW_errorLine",
			"header": "cvtkAW_header",
			"muted": "cvtkAW_muted",
			"planCard": "cvtkAW_planCard",
			"planHead": "cvtkAW_planHead",
			"planName": "cvtkAW_planName",
			"providerBalance": "cvtkAW_providerBalance",
			"providerName": "cvtkAW_providerName",
			"providerRow": "cvtkAW_providerRow",
			"providerTokens": "cvtkAW_providerTokens",
			"refreshBtn": "cvtkAW_refreshBtn",
			"resetLine": "cvtkAW_resetLine",
			"section": "cvtkAW_section",
			"settingItem": "cvtkAW_settingItem",
			"settingsGrid": "cvtkAW_settingsGrid",
			"stat": "cvtkAW_stat",
			"statLabel": "cvtkAW_statLabel",
			"statRow": "cvtkAW_statRow",
			"statValue": "cvtkAW_statValue",
			"tab": "cvtkAW_tab",
			"tabActive": "cvtkAW_tabActive",
			"tabs": "cvtkAW_tabs",
			"trendAxis": "cvtkAW_trendAxis",
			"windowLabel": "cvtkAW_windowLabel",
			"windowRow": "cvtkAW_windowRow"
		};
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
		//#endregion
		//#region src/client/UsageSectionCard.tsx
		/**
		* The usage statistics settings section: two tabs (用量: today's usage,
		* balances, trend; 个人套餐: per-provider plan quota windows) plus a compact
		* settings row. Data comes from the host's loopback-fenced
		* /api/dsh-usage/overview document; polling runs only while the section is
		* mounted and the tab is visible.
		* @module @linxin666/dsh-usage/client/UsageSectionCard
		*/
		/** Poll cadence while the section is open. */
		const SECTION_POLL_MS = 1e4;
		/** Compact token count: 12345 -> 12.3k, 1234567 -> 1.23M. */
		function formatTokens(value) {
			if (!Number.isFinite(value) || value <= 0) return "0";
			if (value < 1e3) return String(value);
			if (value < 1e6) return trim(value / 1e3) + "k";
			if (value < 1e9) return trim(value / 1e6) + "M";
			return trim(value / 1e9) + "B";
		}
		function trim(value) {
			return value >= 100 ? String(Math.round(value)) : value.toFixed(value >= 10 ? 1 : 2).replace(/\.?0+$/, "");
		}
		function formatTime(ms) {
			try {
				return new Date(ms).toLocaleTimeString();
			} catch {
				return "";
			}
		}
		function formatClock(ms) {
			try {
				return new Date(ms).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				});
			} catch {
				return "";
			}
		}
		/** Formatted CNY spend estimate (the only priced currency today). */
		function formatCost(cost) {
			return "¥" + cost.toFixed(2);
		}
		function toneClass(percent) {
			if (percent >= 90) return usage_module_css_default.barLow;
			if (percent >= 70) return usage_module_css_default.barWarn;
			return usage_module_css_default.barFill;
		}
		function TotalsRow(props) {
			const { totals } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.statRow,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.inputTokens + totals.cacheReadTokens + totals.cacheWriteTokens + totals.outputTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.total")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.inputTokens + totals.cacheReadTokens + totals.cacheWriteTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.input")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.outputTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.output")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.cacheReadTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.cacheRead")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.cacheWriteTokens)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.tokens.cacheWrite")
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.stat,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statValue,
							children: formatTokens(totals.calls)
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.statLabel,
							children: t("usage.calls", { n: totals.calls })
						})]
					})
				]
			});
		}
		function balanceLine(provider) {
			if (provider.balance !== void 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: usage_module_css_default.providerBalance,
				children: [
					provider.balance.currency.toUpperCase() === "CNY" ? "¥" : provider.balance.currency.toUpperCase() === "USD" ? "$" : "",
					provider.balance.totalBalance,
					provider.balance.currency.toUpperCase() !== "CNY" && provider.balance.currency.toUpperCase() !== "USD" ? " " + provider.balance.currency.toUpperCase() : ""
				]
			});
			if (provider.credential === "oauth") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: usage_module_css_default.muted,
				children: t("usage.oauth")
			});
			if (provider.credential === "none") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: usage_module_css_default.muted,
				children: t("usage.balance.noCredential")
			});
			if (!provider.supported) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: usage_module_css_default.muted,
				children: t("usage.balance.unsupported")
			});
			return null;
		}
		function ProviderRow(props) {
			const { provider, current } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.providerRow,
				"data-dsh-part": "provider-row",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
					className: usage_module_css_default.providerName,
					children: [provider.displayName, current === provider.provider && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.currentBadge,
						children: t("usage.current")
					})]
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.providerTokens,
					children: balanceLine(provider)
				})]
			});
		}
		/** The section component; the slot merges the face into these props. */
		function UsageSectionCard(props) {
			const { store, poll, refresh, settings } = props;
			const ui = (0, react.useSyncExternalStore)(store.subscribe, store.getSnapshot);
			const settingsSnapshot = settings.getSnapshot();
			const settingsValue = settingsSnapshot.value ?? {};
			const [tab, setTab] = (0, react.useState)("usage");
			const [refreshing, setRefreshing] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				poll();
				let timer;
				const start = () => {
					if (timer === void 0 && document.visibilityState === "visible") timer = window.setInterval(poll, SECTION_POLL_MS);
				};
				const onVisibility = () => {
					if (document.visibilityState === "visible") {
						poll();
						start();
					} else if (timer !== void 0) {
						window.clearInterval(timer);
						timer = void 0;
					}
				};
				start();
				document.addEventListener("visibilitychange", onVisibility);
				return () => {
					if (timer !== void 0) window.clearInterval(timer);
					document.removeEventListener("visibilitychange", onVisibility);
				};
			}, [poll]);
			const snapshot = ui.snapshot;
			const onRefresh = () => {
				setRefreshing(true);
				try {
					refresh();
				} finally {
					window.setTimeout(() => setRefreshing(false), 3e3);
				}
			};
			if (ui.status === "error") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: usage_module_css_default.section,
				"data-dsh-plugin": "usage",
				children: t("usage.error", { error: ui.error ?? "" })
			});
			if (snapshot === null) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: usage_module_css_default.section,
				"data-dsh-plugin": "usage",
				children: t("usage.loading")
			});
			const current = snapshot.current;
			const currentProvider = snapshot.providers.find((provider) => provider.provider === current.provider);
			const deepseekPeriod = deepseekPeriodAt(Date.now());
			const deepseekVisible = current.provider !== void 0 && isDeepSeekProviderRoute(current.provider) || snapshot.usage.today.providers.some((row) => isDeepSeekProviderRoute(row.provider));
			const planProviders = snapshot.providers.filter((provider) => provider.planSupported === true || provider.planSupported === void 0 && provider.plan !== void 0);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.section,
				"data-dsh-plugin": "usage",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.header,
						"data-dsh-part": "header",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.currentProvider,
							children: currentProvider !== void 0 ? `${currentProvider.displayName}${current.model !== void 0 && current.model !== "" ? " · " + current.model : ""}` : t("usage.noData")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							style: {
								display: "flex",
								gap: 8,
								alignItems: "center"
							},
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.muted,
								children: t("usage.updated", { time: formatTime(snapshot.updatedAt) })
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: usage_module_css_default.refreshBtn,
								onClick: onRefresh,
								disabled: refreshing,
								children: refreshing ? t("usage.refreshing") : t("usage.refresh")
							})]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.tabs,
						role: "tablist",
						"data-dsh-part": "tabs",
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": tab === "usage",
							className: tab === "usage" ? `${usage_module_css_default.tab} ${usage_module_css_default.tabActive}` : usage_module_css_default.tab,
							onClick: () => setTab("usage"),
							children: t("usage.tab.usage")
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							role: "tab",
							"aria-selected": tab === "plans",
							className: tab === "plans" ? `${usage_module_css_default.tab} ${usage_module_css_default.tabActive}` : usage_module_css_default.tab,
							onClick: () => setTab("plans"),
							children: t("usage.tab.plans")
						})]
					}),
					tab === "usage" && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: usage_module_css_default.card,
							"data-dsh-part": "today-card",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.cardTitle,
									children: t("usage.today")
								}),
								deepseekVisible && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.muted,
									"data-dsh-part": "peak-status",
									children: t(deepseekPeriod.peak ? "usage.peak.on" : "usage.peak.off", { time: formatClock(deepseekPeriod.boundaryMs) })
								}),
								snapshot.usage.today.totals.calls === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.muted,
									children: t("usage.noData")
								}) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(TotalsRow, { totals: snapshot.usage.today.totals }),
								snapshot.usage.today.totals.cost > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
									className: usage_module_css_default.providerRow,
									"data-dsh-part": "today-cost",
									children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.providerName,
										children: t("usage.today.cost")
									}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.providerTokens,
										children: formatCost(snapshot.usage.today.totals.cost)
									})]
								}),
								snapshot.usage.today.providers.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
									"data-dsh-part": "provider-list",
									children: snapshot.usage.today.providers.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
										className: usage_module_css_default.providerRow,
										children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: usage_module_css_default.providerName,
											children: [snapshot.providers.find((provider) => provider.provider === row.provider)?.displayName ?? row.provider, current.provider === row.provider && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
												className: usage_module_css_default.currentBadge,
												children: t("usage.current")
											})]
										}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
											className: usage_module_css_default.providerTokens,
											children: [
												formatTokens(row.totals.inputTokens + row.totals.cacheReadTokens + row.totals.cacheWriteTokens + row.totals.outputTokens),
												" · ",
												t("usage.calls", { n: row.totals.calls }),
												row.totals.cost > 0 ? ` · ${formatCost(row.totals.cost)}` : ""
											]
										})]
									}, row.provider))
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: usage_module_css_default.card,
							"data-dsh-part": "balance-card",
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.cardTitle,
									children: t("usage.balance")
								}),
								(() => {
									const rows = snapshot.providers.filter((provider) => provider.balanceSupported === true || provider.balanceSupported === void 0 && provider.supported);
									if (rows.length === 0) return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.muted,
										children: t("usage.balance.unsupported")
									});
									return rows.map((provider) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ProviderRow, {
										provider,
										current: current.provider
									}, provider.provider));
								})(),
								snapshot.providers.some((provider) => provider.error !== void 0) && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.errorLine,
									children: snapshot.providers.filter((provider) => provider.error !== void 0).map((provider) => `${provider.displayName}: ${t("usage.provider.error", { error: provider.error ?? "" })}`).join(t("usage.errorListSeparator"))
								})
							]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(RangeCard, {
							range: snapshot.usage.range,
							providers: snapshot.providers,
							currentProvider: current.provider
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SettingsRow, {
							settings,
							snapshot: settingsSnapshot.status === "ready" ? settingsSnapshot : void 0,
							value: settingsValue
						})
					] }),
					tab === "plans" && (planProviders.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: usage_module_css_default.card,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.muted,
							children: t("usage.plan.noneConfigured")
						})
					}) : planProviders.map((provider) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(PlanCard, {
						provider,
						current: current.provider
					}, provider.provider)))
				]
			});
		}
		/** How many model sub-bars render under one provider bar. */
		const CHART_MODEL_CAP = 3;
		/**
		* The 近 30 天 card: horizontal bars per provider over the trend window,
		* each with its heaviest models as nested sub-bars. Window totals come from
		* the host's aggregated `usage.range` (an older host without it renders no
		* card instead of a wrong one).
		*/
		function RangeCard(props) {
			const { range, providers, currentProvider } = props;
			if (range === void 0) return null;
			const grandTotal = range.totals.inputTokens + range.totals.outputTokens + range.totals.cacheReadTokens + range.totals.cacheWriteTokens;
			const maxProvider = Math.max(1, ...range.providers.map((row) => totalOf(row.totals)));
			const nameOf = (id) => providers.find((provider) => provider.provider === id)?.displayName ?? id;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.card,
				"data-dsh-part": "trend-card",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.cardTitle,
					children: t("usage.trend")
				}), range.providers.length === 0 || grandTotal === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.muted,
					children: t("usage.noData")
				}) : /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: usage_module_css_default.chart,
					"data-dsh-part": "usage-chart",
					children: [range.providers.map((row) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChartProviderRow, {
						row,
						name: nameOf(row.provider),
						max: maxProvider,
						current: currentProvider === row.provider
					}, row.provider)), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: usage_module_css_default.trendAxis,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: range.from.slice(5) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: range.to.slice(5) })]
					})]
				})]
			});
		}
		function ChartProviderRow(props) {
			const { row, name, max, current } = props;
			const total = totalOf(row.totals);
			const maxModel = Math.max(1, ...row.models.slice(0, CHART_MODEL_CAP).map((model) => totalOf(model.totals)));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.chartProvider,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
						className: usage_module_css_default.chartHead,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.providerName,
							children: [name, current && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.currentBadge,
								children: t("usage.current")
							})]
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.chartTokens,
							children: [
								formatTokens(total),
								" · ",
								t("usage.calls", { n: row.totals.calls })
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.chartBar,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: usage_module_css_default.chartFill,
							style: { width: `${Math.max(2, Math.round(total / max * 100))}%` }
						})
					}),
					row.models.slice(0, CHART_MODEL_CAP).map((model) => {
						const modelTotal = totalOf(model.totals);
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.chartModel,
							title: `${row.provider} · ${model.model}: ${formatTokens(modelTotal)}`,
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.chartModelName,
									children: model.model
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.chartModelBar,
									children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
										className: usage_module_css_default.chartModelFill,
										style: { width: `${Math.max(3, Math.round(modelTotal / maxModel * 100))}%` }
									})
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.chartTokens,
									children: formatTokens(modelTotal)
								})
							]
						}, model.model);
					})
				]
			});
		}
		function totalOf(totals) {
			return totals.inputTokens + totals.cacheReadTokens + totals.cacheWriteTokens + totals.outputTokens;
		}
		function PlanCard(props) {
			const { provider, current } = props;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: `${usage_module_css_default.card} ${usage_module_css_default.planCard}`,
				"data-dsh-part": "plan-card",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: usage_module_css_default.planHead,
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: usage_module_css_default.planName,
							children: [
								provider.displayName,
								current === provider.provider && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: usage_module_css_default.currentBadge,
									children: t("usage.current")
								}),
								provider.plan?.planName !== void 0 ? ` · ${provider.plan.planName}` : ""
							]
						})
					}),
					provider.error !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.errorLine,
						children: t("usage.provider.error", { error: provider.error })
					}),
					provider.credential === "none" && provider.plan === void 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.muted,
						children: t("usage.balance.noCredential")
					}) : provider.plan === void 0 || provider.plan.windows.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: usage_module_css_default.muted,
						children: t("usage.plan.noPlan")
					}) : provider.plan.windows.map((window) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: usage_module_css_default.windowRow,
						"data-dsh-part": "plan-window",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: usage_module_css_default.windowLabel,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: window.name ?? t(`usage.plan.windows.${window.key}`) }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: window.percent !== void 0 ? `${window.percent >= 10 ? Math.round(window.percent) : window.percent.toFixed(1)}%` : "" })]
							}),
							window.percent !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.bar,
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
									className: toneClass(window.percent),
									style: {
										width: `${Math.min(100, Math.max(0, window.percent))}%`,
										display: "block"
									}
								})
							}),
							window.resetsAt !== void 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: usage_module_css_default.resetLine,
								children: t("usage.plan.reset", { date: new Date(window.resetsAt).toLocaleString() })
							})
						]
					}, window.key))
				]
			});
		}
		function SettingsRow(props) {
			const { settings, snapshot, value } = props;
			const disabled = snapshot === void 0 || !snapshot.writable;
			const bubbleMode = typeof value.bubbleMode === "string" && [
				"always",
				"change",
				"off"
			].includes(value.bubbleMode) ? value.bubbleMode : "always";
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: usage_module_css_default.card,
				"data-dsh-part": "settings-row",
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: usage_module_css_default.cardTitle,
					children: t("usage.config.title")
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: usage_module_css_default.settingsGrid,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: usage_module_css_default.settingItem,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "checkbox",
								checked: value.enabled ?? true,
								disabled,
								onChange: (event) => {
									settings.set("enabled", event.target.checked);
								}
							}), t("usage.config.enabled")]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: usage_module_css_default.settingItem,
							children: [t("usage.config.pollIntervalSec"), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "number",
								min: 30,
								max: 3600,
								value: typeof value.pollIntervalSec === "number" ? value.pollIntervalSec : 60,
								disabled,
								onChange: (event) => {
									const parsed = Number(event.target.value);
									if (Number.isFinite(parsed) && parsed >= 30 && parsed <= 3600) settings.set("pollIntervalSec", Math.round(parsed));
								}
							})]
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
							className: usage_module_css_default.settingItem,
							children: [t("usage.config.bubbleMode"), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								value: bubbleMode,
								disabled,
								onChange: (event) => {
									settings.set("bubbleMode", event.target.value);
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "always",
										children: t("usage.config.bubbleMode.always")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "change",
										children: t("usage.config.bubbleMode.change")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "off",
										children: t("usage.config.bubbleMode.off")
									})
								]
							})]
						})
					]
				})]
			});
		}
		//#endregion
		//#region src/client/index.ts
		/** Hard ceiling for one usage API call; a stalled host must not pile up requests. */
		const USAGE_FETCH_TIMEOUT_MS = 2e4;
		async function usageFetch(path, method) {
			const response = await fetch(path, {
				...method === "POST" ? { method: "POST" } : {},
				signal: AbortSignal.timeout(USAGE_FETCH_TIMEOUT_MS)
			});
			if (!response.ok) throw new Error("usage " + path + " failed: " + response.status);
			return await response.json();
		}
		const usageApi = {
			overview: () => usageFetch("/api/dsh-usage/overview", "GET"),
			refresh: () => usageFetch("/api/dsh-usage/refresh", "POST")
		};
		/** Settings namespace the section edits (the host plugin registers it). */
		const USAGE_SETTINGS_NS = "dsh-usage";
		/** First-level nav position: directly below the Workshop section (order 150). */
		const SECTION_ORDER = 151;
		/** Required services. */
		const inject = [
			"slots",
			"locale",
			"connection",
			"settingsScope",
			"remote"
		];
		/**
		* Client plugin body: register dictionaries and seat the settings section.
		* The overview poll loop and the store live with the section component's
		* mount cycle, so no background traffic exists while the page is closed.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => {
				try {
					return ctx.locale.register(NS, {
						zh,
						en
					});
				} catch {
					return () => {};
				}
			}, "dsh-usage: dictionaries");
			const settingsScope = (ctx.get("webUiSettings") ?? ctx.settingsScope).bind({ namespace: USAGE_SETTINGS_NS });
			const store = createUsageStore().create();
			let pollSeq = 0;
			const poll = () => {
				const seq = pollSeq + 1;
				pollSeq = seq;
				usageApi.overview().then((snapshot) => {
					if (seq !== pollSeq) return;
					store.actions.setSnapshot(snapshot);
				}, () => {
					if (seq !== pollSeq) return;
					store.actions.setState("error", "usage.overview transport error");
				});
			};
			const refresh = () => {
				const seq = pollSeq + 1;
				pollSeq = seq;
				usageApi.refresh().then((snapshot) => {
					pollSeq = seq;
					store.actions.setSnapshot(snapshot);
				}, () => {
					if (seq !== pollSeq) return;
					store.actions.setState("error", "usage.refresh transport error");
				});
			};
			const face = () => ({
				store,
				poll,
				refresh,
				settings: settingsScope
			});
			ctx.slots.inject("settings.section", () => {
				try {
					const unregister = ctx.slots.register({
						name: "settings.section",
						id: "dsh-usage",
						order: SECTION_ORDER,
						label: () => ctx.locale.bind(NS)("usage.title"),
						locale: NS,
						inject: face
					}, UsageSectionCard);
					return () => {
						unregister();
					};
				} catch {
					return () => {};
				}
			});
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map