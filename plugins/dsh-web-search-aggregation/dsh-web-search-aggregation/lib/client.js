window.__ModuleLoader__.load({
	id: "dsh-web-search-aggregation",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
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
		* Each provider's API-key format, shown as the add-key input's placeholder
		* (the providers' documented key prefixes).
		*/
		const KIND_KEY_PLACEHOLDER = {
			anysearch: "as_sk_xxxx...",
			tinyfish: "sk-tinyfish-xxxx...",
			tavily: "tvly-xxxx...",
			brave: "BSA_xxxx...",
			exa: "xxxx...",
			firecrawl: "fc-xxxx...",
			jina: "jina_xxxx...",
			serpapi: "xxxx...",
			serper: "xxxx..."
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
		/** Default per-attempt timeout: leaves room for 5–6 fallbacks inside the tool budget. */
		const DEFAULT_ATTEMPT_TIMEOUT_MS = 1e4;
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
		//#region \0@oxc-project+runtime@0.146.0/helpers/esm/typeof.js
		function _typeof(o) {
			"@babel/helpers - typeof";
			return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
				return typeof o;
			} : function(o) {
				return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
			}, _typeof(o);
		}
		//#endregion
		//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPrimitive.js
		function toPrimitive(t, r) {
			if ("object" != _typeof(t) || !t) return t;
			var e = t[Symbol.toPrimitive];
			if (void 0 !== e) {
				var i = e.call(t, r || "default");
				if ("object" != _typeof(i)) return i;
				throw new TypeError("@@toPrimitive must return a primitive value.");
			}
			return ("string" === r ? String : Number)(t);
		}
		//#endregion
		//#region \0@oxc-project+runtime@0.146.0/helpers/esm/toPropertyKey.js
		function toPropertyKey(t) {
			var i = toPrimitive(t, "string");
			return "symbol" == _typeof(i) ? i : i + "";
		}
		//#endregion
		//#region \0@oxc-project+runtime@0.146.0/helpers/esm/defineProperty.js
		function _defineProperty(e, r, t) {
			return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
				value: t,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : e[r] = t, e;
		}
		//#endregion
		//#region src/client/controller.ts
		/**
		* Settings namespace this card edits. Spelled here rather than imported: a
		* client package must not depend on a Host package.
		*/
		const WEB_SEARCH_AGGREGATION_NS = "web-search-aggregation";
		/**
		* Bridges the `web-search-aggregation` scope and the credentials domain onto
		* the card. The staged queue and the committed section are compared through
		* one normalization so reformatting-only edits never read dirty.
		*/
		var AggregatedCardController = class {
			/**
			* @param scope - the bound settings scope for the `web-search-aggregation` namespace.
			* @param api - wire face used for the key values the entries write.
			*/
			constructor(scope, api) {
				this.scope = scope;
				this.api = api;
				_defineProperty(this, "entries", void 0);
				_defineProperty(this, "entriesDrafted", false);
				_defineProperty(this, "timeoutDraft", void 0);
				_defineProperty(this, "timeoutReset", false);
				_defineProperty(this, "queueReset", false);
				_defineProperty(this, "saving", false);
				_defineProperty(this, "failed", false);
				_defineProperty(this, "credentials", /* @__PURE__ */ new Map());
				_defineProperty(this, "listeners", /* @__PURE__ */ new Set());
				this.entries = this.seed(this.scope.getSnapshot());
				this.scope.subscribe(() => {
					if (this.saving || this.entriesDrafted || this.queueReset) return;
					this.reseed();
					this.readCredentials();
				});
				this.readCredentials();
			}
			/** Bind one projection of this controller as a snapshot store. */
			bind() {
				let last = this.projection();
				const listeners = /* @__PURE__ */ new Set();
				const store = {
					getSnapshot: () => last,
					subscribe: (listener) => {
						listeners.add(listener);
						return () => {
							listeners.delete(listener);
						};
					},
					set: (next) => {
						last = next;
						for (const listener of listeners) listener();
					}
				};
				this.listeners.add(() => {
					store.set(this.projection());
				});
				return store;
			}
			/** The card's actions. */
			actions() {
				return {
					editTimeout: (text) => {
						this.timeoutDraft = text;
						this.timeoutReset = false;
						this.failed = false;
						this.publish();
					},
					resetTimeout: () => {
						this.timeoutReset = true;
						this.timeoutDraft = void 0;
						this.failed = false;
						this.publish();
					},
					moveEntry: (index, direction) => {
						const target = index + direction;
						if (index < 0 || target < 0 || target >= this.entries.length) return;
						const next = [...this.entries];
						const [moved] = next.splice(index, 1);
						if (moved === void 0) return;
						next.splice(target, 0, moved);
						this.assign(next);
					},
					removeEntry: (index) => {
						this.assign(this.entries.filter((_, position) => position !== index));
					},
					addEntry: (kind) => {
						if (this.entries.some((entry) => entry.kind === kind)) return;
						this.assign([...this.entries, {
							kind,
							enabled: true,
							baseURL: "",
							keysDraft: void 0
						}]);
					},
					setKind: (index, kind) => {
						if (this.entries.some((entry, position) => position !== index && entry.kind === kind)) return;
						this.mutate(index, (entry) => ({
							...entry,
							kind
						}));
					},
					setEnabled: (index, enabled) => {
						this.mutate(index, (entry) => ({
							...entry,
							enabled
						}));
					},
					setBaseURL: (index, text) => {
						this.mutate(index, (entry) => ({
							...entry,
							baseURL: text
						}));
					},
					addKey: (index, literal) => {
						this.mutate(index, (entry) => {
							const additions = parseApiKeys(literal);
							if (additions.length === 0) return entry;
							const next = [...entry.keysDraft ?? []];
							for (const key of additions) if (!next.includes(key)) next.push(key);
							return {
								...entry,
								keysDraft: next
							};
						});
					},
					removeKey: (index, keyIndex) => {
						this.mutate(index, (entry) => {
							if (entry.keysDraft === void 0) return entry;
							return {
								...entry,
								keysDraft: entry.keysDraft.filter((_, position) => position !== keyIndex)
							};
						});
					},
					resetKeys: (index) => {
						this.mutate(index, (entry) => entry.keysDraft === void 0 ? entry : {
							...entry,
							keysDraft: void 0
						});
					},
					resetQueue: () => {
						this.queueReset = true;
						this.entriesDrafted = false;
						this.entries = this.seed(this.scope.getSnapshot(), true);
						this.failed = false;
						this.publish();
					},
					save: () => {
						this.save();
					},
					discard: () => {
						this.entriesDrafted = false;
						this.queueReset = false;
						this.timeoutDraft = void 0;
						this.timeoutReset = false;
						this.reseed();
						this.failed = false;
						this.publish();
					}
				};
			}
			/**
			* Re-read presence facts after the Host reports a change to a reference
			* this card shows (a key written from another surface, e.g. the Models page).
			* @param ref - the reference the Host reports as changed.
			*/
			refreshCredential(ref) {
				if (this.credentials.has(ref)) this.readCredentials();
			}
			/** Build the face the card's slot registration injects. */
			inject() {
				return {
					hooks: { aggregatedCard: this.bind() },
					...this.actions()
				};
			}
			/**
			* Write the staged queue: each entry's staged key value through the
			* credentials domain first (so the reference the section implies already
			* resolves), then the section fields, staged resets included. A failure
			* keeps every draft for correcting.
			*/
			async save() {
				if (this.saving || !this.dirty() && !this.pendingKeys() || this.invalidReason() !== void 0) return;
				this.saving = true;
				this.failed = false;
				this.publish();
				const stagedTimeoutReset = this.timeoutReset;
				const stagedTimeoutDraft = this.timeoutDraft;
				let landed = true;
				for (const entry of this.entries) {
					if (entry.keysDraft === void 0) continue;
					const ref = KIND_CREDENTIAL_REF[entry.kind];
					try {
						const joined = formatApiKeys(entry.keysDraft);
						if (joined.length > 0) await this.api.credentials.set({
							ref,
							value: joined
						});
						else await this.api.credentials.unset({ ref });
					} catch (_credentialWriteFailure) {
						landed = false;
					}
				}
				if (landed) {
					for (const entry of this.entries) entry.keysDraft = void 0;
					if (this.queueReset) {
						try {
							await this.scope.unset("providers");
						} catch (_queueResetFailure) {
							landed = false;
						}
						if (landed) {
							const userLayer = this.scope.getSnapshot().user;
							landed = userLayer === void 0 || !Object.hasOwn(userLayer, "providers");
						}
					} else {
						const value = this.committedEntries();
						try {
							await this.scope.set("providers", value);
						} catch (_queueWriteFailure) {
							landed = false;
						}
						if (landed) {
							const userLayer = this.scope.getSnapshot().user;
							landed = JSON.stringify(userLayer?.providers) === JSON.stringify(value);
						}
					}
					if (landed && stagedTimeoutReset) await this.scope.unset("attemptTimeoutMs");
					else if (landed && stagedTimeoutDraft !== void 0) {
						const trimmed = stagedTimeoutDraft.trim();
						const parsed = /^\d+$/.test(trimmed) ? Number(trimmed) : void 0;
						const timeout = parsed !== void 0 && parsed >= 1e3 && parsed <= 6e4 ? parsed : void 0;
						if (timeout === void 0) await this.scope.unset("attemptTimeoutMs");
						else await this.scope.set("attemptTimeoutMs", timeout);
					}
				}
				if (landed) {
					this.entriesDrafted = false;
					this.queueReset = false;
					this.timeoutDraft = void 0;
					this.timeoutReset = false;
				} else this.failed = true;
				this.saving = false;
				this.publish();
				this.readCredentials();
			}
			/** The section's current committed value. */
			section() {
				return this.scope.getSnapshot().value ?? {};
			}
			/** Re-seed the staged queue from the section unless edits are in flight. */
			reseed() {
				this.entries = this.seed(this.scope.getSnapshot());
				this.timeoutDraft = void 0;
				this.timeoutReset = false;
			}
			/** Seed drafts from one scope snapshot; `fromBase` reads the base layer (a staged queue reset). */
			seed(snapshot, fromBase = false) {
				return ((fromBase ? snapshot.base?.providers : snapshot.value?.providers) ?? []).map((entry) => ({
					kind: entry.kind,
					enabled: entry.enabled,
					baseURL: entry.baseURL ?? "",
					keysDraft: void 0
				}));
			}
			/** Record a whole-queue replacement as a draft. */
			assign(entries) {
				this.entries = entries;
				this.entriesDrafted = true;
				this.queueReset = false;
				this.failed = false;
				this.publish();
			}
			/** Record one entry's replacement as a draft. */
			mutate(index, replace) {
				if (index < 0 || index >= this.entries.length) return;
				const next = [...this.entries];
				const current = next[index];
				if (current === void 0) return;
				next[index] = replace(current);
				this.assign(next);
			}
			/** The entries as a save writes them: trimmed, defaulted, credential-free. */
			committedEntries() {
				return this.entries.map((entry) => {
					const baseURL = entry.baseURL.trim();
					return {
						kind: entry.kind,
						enabled: entry.enabled,
						...baseURL.length > 0 ? { baseURL } : {}
					};
				});
			}
			/** The staged timeout as a save writes it; `undefined` re-inherits the default. */
			timeoutValue() {
				if (this.timeoutDraft === void 0) return void 0;
				const trimmed = this.timeoutDraft.trim();
				if (trimmed.length === 0) return void 0;
				if (!/^\d+$/.test(trimmed)) return void 0;
				const value = Number(trimmed);
				return value >= 1e3 && value <= 6e4 ? value : void 0;
			}
			/** Whether the staged timeout draft is present but not acceptable. */
			timeoutInvalid() {
				if (this.timeoutDraft === void 0) return false;
				const trimmed = this.timeoutDraft.trim();
				if (trimmed.length === 0) return false;
				if (!/^\d+$/.test(trimmed)) return true;
				const value = Number(trimmed);
				return value < 1e3 || value > 6e4;
			}
			/** The first reason the staged queue blocks a save, or undefined. */
			invalidReason() {
				if (this.timeoutInvalid()) return "attemptTimeoutMs";
				const kinds = /* @__PURE__ */ new Set();
				for (const entry of this.entries) {
					if (kinds.has(entry.kind)) return `duplicate provider kind ${entry.kind}`;
					kinds.add(entry.kind);
				}
			}
			/** Whether anything staged differs from the committed section. */
			dirty() {
				if (this.queueReset) return true;
				if (this.timeoutReset) return true;
				if (this.timeoutDraft !== void 0 && this.timeoutValue() !== this.section().attemptTimeoutMs) return true;
				return JSON.stringify(this.committedEntries()) !== JSON.stringify(this.normalizedSection());
			}
			/** The section's queue normalized exactly like {@link committedEntries}. */
			normalizedSection() {
				return (this.section().providers ?? []).map((entry) => {
					const baseURL = entry.baseURL?.trim();
					return {
						kind: entry.kind,
						enabled: entry.enabled,
						...baseURL !== void 0 && baseURL.length > 0 ? { baseURL } : {}
					};
				});
			}
			/** Whether any staged entry still holds an unwritten key value. */
			pendingKeys() {
				return this.entries.some((entry) => entry.keysDraft !== void 0);
			}
			/** The controller's projection; `dirty` also honors staged key values. */
			projection() {
				const snapshot = this.scope.getSnapshot();
				const invalid = this.invalidReason();
				const committed = this.section().attemptTimeoutMs;
				const baseTimeout = snapshot.base?.attemptTimeoutMs ?? 1e4;
				const timeoutText = this.timeoutReset ? String(baseTimeout) : this.timeoutDraft !== void 0 ? this.timeoutDraft : committed === void 0 ? String(DEFAULT_ATTEMPT_TIMEOUT_MS) : String(committed);
				return {
					available: snapshot.status === "ready",
					writable: snapshot.writable,
					dirty: this.dirty() || this.pendingKeys(),
					invalid: invalid !== void 0,
					saving: this.saving,
					failed: this.failed,
					timeout: {
						text: timeoutText,
						overridden: this.timeoutReset || Object.hasOwn(snapshot.user ?? {}, "attemptTimeoutMs"),
						invalid: this.timeoutInvalid()
					},
					entries: this.entries.map((entry, index) => ({
						position: index + 1,
						kind: entry.kind,
						enabled: entry.enabled,
						baseURL: entry.baseURL,
						keys: {
							ref: KIND_CREDENTIAL_REF[entry.kind],
							tags: (entry.keysDraft ?? []).map((key) => maskApiKey(key)),
							staged: entry.keysDraft !== void 0,
							configured: this.credentials.get(KIND_CREDENTIAL_REF[entry.kind])?.configured
						},
						invalidReason: this.entries.some((other, position) => position < index && other.kind === entry.kind) ? "duplicate-kind" : void 0
					})),
					queueOverridden: this.queueReset || Object.hasOwn(snapshot.user ?? {}, "providers")
				};
			}
			/**
			* Read presence facts for every reference the drafts or the section name.
			* Failures keep the last known badges — the card stays usable and a save
			* still reaches the Host.
			*/
			async readCredentials() {
				const refs = [.../* @__PURE__ */ new Set([...this.entries.map((entry) => KIND_CREDENTIAL_REF[entry.kind]), ...(this.section().providers ?? []).map((entry) => KIND_CREDENTIAL_REF[entry.kind])])];
				if (refs.length === 0) return;
				let response;
				try {
					response = await this.api.credentials.describe({ refs });
				} catch (_credentialReadFailure) {
					return;
				}
				if (!response.result.ok) return;
				for (const ref of refs) {
					const view = response.result.value.credentials[ref];
					this.credentials.set(ref, {
						configured: view?.configured ?? false,
						writable: view?.writable ?? true
					});
				}
				this.publish();
			}
			/** Notify every bound stores. */
			publish() {
				for (const listener of this.listeners) listener();
			}
		};
		//#endregion
		//#region \0dsh-web-search-aggregation-css:/opt/dsh/plugins/dsh-web-search-aggregation/src/client/PluginCard.module.css.mjs
		const css$1 = ".Gt293a_card{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:12px;list-style:none;transition:border-color .16s,background .16s}.Gt293a_card:hover{border-color:var(--dsw-alias-label-dimmed)}.Gt293a_cardOpen{background:var(--dsw-alias-bg-layer-2);border-color:var(--dsw-alias-label-dimmed)}.Gt293a_header{appearance:none;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:12px;align-items:center;gap:12px;padding:14px 16px;display:flex}.Gt293a_header:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:-2px}.Gt293a_headText{flex-direction:column;flex:1;gap:4px;min-width:0;display:flex}.Gt293a_name{color:var(--dsw-alias-label-primary);font-size:15px;font-weight:600;line-height:1.4}.Gt293a_description{color:var(--dsw-alias-label-tertiary);font-size:13px;line-height:1.5}.Gt293a_chevron{color:var(--dsw-alias-label-tertiary);flex:none;transition:transform .16s}.Gt293a_chevronOpen{transform:rotate(180deg)}.Gt293a_body{border-top:1px solid var(--dsw-alias-border-l2);margin:0 16px;padding-bottom:8px}.Gt293a_readOnly{color:var(--dsw-alias-label-tertiary);margin:12px 0 0;font-size:12px;line-height:1.5}.Gt293a_pending{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.Gt293a_footer{border-top:1px solid var(--dsw-alias-border-l2);justify-content:flex-end;align-items:center;gap:8px;padding:12px 0 4px;display:flex}.Gt293a_failed{min-width:0;color:var(--dsw-alias-label-error);flex:1;margin:0;font-size:12px;line-height:1.5}.Gt293a_discard,.Gt293a_save{appearance:none;font:inherit;cursor:pointer;border:1px solid #0000;border-radius:8px;padding:5px 14px;font-size:13px;line-height:1.5}.Gt293a_discard{border-color:var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);background:0 0}.Gt293a_discard:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-label-dimmed)}.Gt293a_save{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-3)}.Gt293a_discard:disabled,.Gt293a_save:disabled{opacity:.4;cursor:default}.Gt293a_discard:focus-visible,.Gt293a_save:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}";
		const tagId$1 = "dsh-web-search-aggregation/PluginCard.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-web-search-aggregation";
			tag.dataset.pluginCss = tagId$1;
			tag.textContent = css$1;
			document.head.appendChild(tag);
		}
		var PluginCard_module_css_default = {
			"failed": "Gt293a_failed",
			"cardOpen": "Gt293a_cardOpen",
			"header": "Gt293a_header",
			"description": "Gt293a_description",
			"pending": "Gt293a_pending",
			"readOnly": "Gt293a_readOnly",
			"footer": "Gt293a_footer",
			"headText": "Gt293a_headText",
			"chevron": "Gt293a_chevron",
			"card": "Gt293a_card",
			"name": "Gt293a_name",
			"body": "Gt293a_body",
			"chevronOpen": "Gt293a_chevronOpen",
			"discard": "Gt293a_discard",
			"save": "Gt293a_save"
		};
		//#endregion
		//#region src/client/PluginCard.tsx
		/**
		* The card chrome — a faithful local copy of the shipped `ui-settings-plugins`
		* PluginCard (disclosure header, unsaved marker, save/discard footer), with
		* the chevron inlined so the bundle stays self-contained.
		*
		* @module dsh-web-search-aggregation/client/PluginCard
		*/
		function cx(...parts) {
			return parts.filter((part) => typeof part === "string").join(" ");
		}
		function ChevronDown({ className }) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
				className,
				width: "14",
				height: "14",
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
					d: "M4 6l4 4 4-4",
					stroke: "currentColor",
					strokeWidth: "1.5",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				})
			});
		}
		/**
		* Render the aggregated-search card's chrome.
		* @param props - the card's copy, name, form state, and controls.
		* @returns the card, or nothing when the namespace is unavailable.
		*/
		function PluginCard(props) {
			const [open, setOpen] = (0, react.useState)(false);
			const { state, copy } = props;
			if (!state.available) return null;
			const blocked = !state.dirty || state.invalid || state.saving;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: cx(PluginCard_module_css_default.card, open && PluginCard_module_css_default.cardOpen),
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: PluginCard_module_css_default.header,
					"aria-expanded": open,
					"aria-label": `${open ? copy.collapse : copy.expand}: ${props.title}`,
					onClick: () => {
						setOpen(!open);
					},
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: PluginCard_module_css_default.headText,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: PluginCard_module_css_default.name,
								children: props.title
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: PluginCard_module_css_default.description,
								children: props.description
							})]
						}),
						state.dirty ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: PluginCard_module_css_default.pending,
							children: copy.unsaved
						}) : null,
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ChevronDown, { className: cx(PluginCard_module_css_default.chevron, open && PluginCard_module_css_default.chevronOpen) })
					]
				}), open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: PluginCard_module_css_default.body,
					children: [
						!state.writable ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
							className: PluginCard_module_css_default.readOnly,
							role: "status",
							children: copy.readOnly
						}) : null,
						props.children,
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: PluginCard_module_css_default.footer,
							children: [
								state.failed ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
									className: PluginCard_module_css_default.failed,
									role: "status",
									children: copy.saveFailed
								}) : null,
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: PluginCard_module_css_default.discard,
									disabled: !state.dirty || state.saving,
									onClick: props.onDiscard,
									children: copy.discard
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
									type: "button",
									className: PluginCard_module_css_default.save,
									disabled: blocked,
									onClick: props.onSave,
									children: state.saving ? copy.saving : copy.save
								})
							]
						})
					]
				}) : null]
			});
		}
		//#endregion
		//#region \0dsh-web-search-aggregation-css:/opt/dsh/plugins/dsh-web-search-aggregation/src/client/fields.module.css.mjs
		const css = ".RcXL8G_field{border:0;border-top:1px solid var(--dsw-alias-border-l2);flex-direction:column;gap:6px;margin:0;padding:12px 0;display:flex}.RcXL8G_field:first-child{border-top:0}.RcXL8G_fieldEmbedded{border:0;flex-direction:column;gap:6px;margin:0;padding:0;display:flex}.RcXL8G_head{align-items:center;gap:8px;display:flex}.RcXL8G_label{min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:13px;font-weight:500;line-height:1.5}.RcXL8G_badges{align-items:center;gap:8px;display:inline-flex}.RcXL8G_badge{white-space:nowrap;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary);border-radius:999px;padding:1px 8px;font-size:11px;font-weight:500;line-height:17px}.RcXL8G_reset{font:inherit;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;padding:0;font-size:12px;line-height:1.5}.RcXL8G_reset:hover:not(:disabled){color:var(--dsw-alias-label-primary)}.RcXL8G_reset:disabled{cursor:default}.RcXL8G_input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5}.RcXL8G_input:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.RcXL8G_input:disabled{color:var(--dsw-alias-label-tertiary);cursor:default}.RcXL8G_inputInvalid{border:1px solid var(--dsw-alias-label-error);background:var(--dsw-alias-bg-layer-3);height:34px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 12px;font-size:13px;line-height:1.5}.RcXL8G_invalid{color:var(--dsw-alias-label-error);margin:0;font-size:12px;line-height:1.5}.RcXL8G_hint{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}.RcXL8G_radioGroup{flex-direction:column;gap:8px;display:flex}.RcXL8G_radioOption{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;flex-direction:column;gap:8px;padding:10px 12px;display:flex}.RcXL8G_radioOption:has(input[type=radio]:checked){border-color:var(--dsw-alias-brand-primary)}.RcXL8G_radioPick{cursor:pointer;align-items:flex-start;gap:10px;display:flex}.RcXL8G_radioPick input[type=radio]{width:14px;height:14px;accent-color:var(--dsw-alias-brand-primary);flex:none;margin-top:2px}.RcXL8G_radioPick input[type=radio]:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}.RcXL8G_radioText{flex-direction:column;gap:2px;min-width:0;display:flex}.RcXL8G_radioLabel{color:var(--dsw-alias-label-primary);font-size:13px;font-weight:500;line-height:1.5}.RcXL8G_radioHint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.5}.RcXL8G_radioContent{margin-left:24px}.RcXL8G_radioContent input[type=text]:enabled{cursor:text}.RcXL8G_checkboxRow{align-items:center;gap:10px;display:flex}.RcXL8G_checkboxRow input[type=checkbox]{width:16px;height:16px;accent-color:var(--dsw-alias-brand-primary);flex:none;margin:0}.RcXL8G_checkboxRow input[type=checkbox]:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}.RcXL8G_checkboxRow .RcXL8G_label{flex:none}.RcXL8G_checkboxHint{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:1.5}.RcXL8G_queue{flex-direction:column;gap:10px;margin:8px 0 12px;display:flex}.RcXL8G_entryBox{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);border-radius:8px;flex-direction:column;gap:10px;padding:12px;display:flex}.RcXL8G_entryBoxDisabled{opacity:.6}.RcXL8G_entryHead{align-items:center;gap:8px;display:flex}.RcXL8G_entryIndex{background:var(--dsw-alias-bg-module-platform);min-width:20px;height:20px;color:var(--dsw-alias-label-secondary);border-radius:999px;flex:none;justify-content:center;align-items:center;padding:0 6px;font-size:11px;font-weight:600;display:inline-flex}.RcXL8G_select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:30px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 8px;font-size:13px}.RcXL8G_select:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.RcXL8G_entryControls{align-items:center;gap:4px;margin-left:auto;display:flex}.RcXL8G_iconButton{width:26px;height:26px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;border-radius:6px;justify-content:center;align-items:center;font-size:13px;display:inline-flex}.RcXL8G_iconButton:hover:not(:disabled){background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-primary)}.RcXL8G_iconButton:disabled{opacity:.4;cursor:default}.RcXL8G_iconButtonDanger:hover:not(:disabled){color:var(--dsw-alias-label-error)}.RcXL8G_chips{flex-wrap:wrap;gap:6px;display:flex}.RcXL8G_addRow{margin:0 0 12px}.RcXL8G_chip{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-primary);border-radius:999px;align-items:center;gap:6px;padding:2px 4px 2px 10px;font-size:12px;line-height:18px;display:inline-flex}.RcXL8G_chipState{color:var(--dsw-alias-label-tertiary);font-size:11px}.RcXL8G_chipKey{color:var(--dsw-alias-label-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,Liberation Mono,monospace}.RcXL8G_keyAddRow{grid-template-columns:1fr auto;align-items:center;gap:8px;display:grid}.RcXL8G_chipConfigured{color:var(--dsw-alias-label-secondary);font-weight:500}.RcXL8G_chipRemove{width:18px;height:18px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:999px;justify-content:center;align-items:center;font-size:12px;line-height:1;display:inline-flex}.RcXL8G_chipRemove:hover{background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-error)}.RcXL8G_keyForm{grid-template-columns:minmax(120px,1fr) minmax(120px,1fr) auto;align-items:center;gap:8px;display:grid}.RcXL8G_keyFormInput{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-3);height:30px;font:inherit;color:var(--dsw-alias-label-primary);border-radius:8px;padding:0 10px;font-size:12px}.RcXL8G_keyFormInput:focus-visible{border-color:var(--dsw-alias-brand-primary);outline:none}.RcXL8G_keyFormInputInvalid{border-color:var(--dsw-alias-label-error)}.RcXL8G_ghostButton{border:1px dashed var(--dsw-alias-border-l2);height:30px;font:inherit;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border-radius:8px;padding:0 12px;font-size:12px}.RcXL8G_ghostButton:hover:not(:disabled){color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-brand-primary)}.RcXL8G_ghostButton:disabled{opacity:.5;cursor:default}.RcXL8G_queueHead{align-items:center;gap:8px;display:flex}.RcXL8G_queueNote{color:var(--dsw-alias-label-tertiary);margin:0;font-size:12px;line-height:1.5}.RcXL8G_visuallyHidden{clip:rect(0 0 0 0);white-space:nowrap;border:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}";
		const tagId = "dsh-web-search-aggregation/fields.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "dsh-web-search-aggregation";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var fields_module_css_default = {
			"entryBoxDisabled": "RcXL8G_entryBoxDisabled",
			"radioPick": "RcXL8G_radioPick",
			"addRow": "RcXL8G_addRow",
			"field": "RcXL8G_field",
			"queueNote": "RcXL8G_queueNote",
			"ghostButton": "RcXL8G_ghostButton",
			"fieldEmbedded": "RcXL8G_fieldEmbedded",
			"radioText": "RcXL8G_radioText",
			"badge": "RcXL8G_badge",
			"reset": "RcXL8G_reset",
			"input": "RcXL8G_input",
			"inputInvalid": "RcXL8G_inputInvalid",
			"checkboxHint": "RcXL8G_checkboxHint",
			"chip": "RcXL8G_chip",
			"chipRemove": "RcXL8G_chipRemove",
			"keyFormInput": "RcXL8G_keyFormInput",
			"entryHead": "RcXL8G_entryHead",
			"chipState": "RcXL8G_chipState",
			"hint": "RcXL8G_hint",
			"queue": "RcXL8G_queue",
			"iconButton": "RcXL8G_iconButton",
			"head": "RcXL8G_head",
			"label": "RcXL8G_label",
			"radioOption": "RcXL8G_radioOption",
			"radioHint": "RcXL8G_radioHint",
			"entryIndex": "RcXL8G_entryIndex",
			"select": "RcXL8G_select",
			"keyForm": "RcXL8G_keyForm",
			"queueHead": "RcXL8G_queueHead",
			"radioGroup": "RcXL8G_radioGroup",
			"checkboxRow": "RcXL8G_checkboxRow",
			"visuallyHidden": "RcXL8G_visuallyHidden",
			"keyFormInputInvalid": "RcXL8G_keyFormInputInvalid",
			"radioLabel": "RcXL8G_radioLabel",
			"invalid": "RcXL8G_invalid",
			"badges": "RcXL8G_badges",
			"entryControls": "RcXL8G_entryControls",
			"iconButtonDanger": "RcXL8G_iconButtonDanger",
			"radioContent": "RcXL8G_radioContent",
			"chips": "RcXL8G_chips",
			"keyAddRow": "RcXL8G_keyAddRow",
			"chipKey": "RcXL8G_chipKey",
			"chipConfigured": "RcXL8G_chipConfigured",
			"entryBox": "RcXL8G_entryBox"
		};
		//#endregion
		//#region src/client/fields.tsx
		/**
		* The aggregated-search card's controls: the shipped ValueField and
		* CheckboxField (faithful local copies), a select for the provider kind, and
		* the per-entry API-key editor (one fixed credential per provider; its keys
		* staged as masked, closable tags in storage order) — all styled on the same
		* tokens and rhythm as the built-in plugin-configuration fields.
		*
		* @module dsh-web-search-aggregation/client/fields
		*/
		/** A staged text field (copy of the shipped ValueField). */
		function ValueField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: fields_module_css_default.field,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: fields_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: fields_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}), props.overridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: fields_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: fields_module_css_default.badge,
								children: props.overriddenLabel
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: fields_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: props.resetLabel
							})]
						}) : null]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						id: props.id,
						className: props.invalid ? fields_module_css_default.inputInvalid : fields_module_css_default.input,
						type: "text",
						...props.invalid ? { "aria-invalid": true } : {},
						value: props.text,
						placeholder: props.placeholder ?? "",
						disabled: props.disabled,
						spellCheck: false,
						onChange: (event) => {
							props.onEdit(event.target.value);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: props.invalid ? fields_module_css_default.invalid : fields_module_css_default.hint,
						children: props.invalid ? props.invalidLabel : props.hint
					})
				]
			});
		}
		/** A staged checkbox: one entry's enabled toggle (hint inline after the label). */
		function CheckboxField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: fields_module_css_default.fieldEmbedded,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: fields_module_css_default.checkboxRow,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							id: props.id,
							type: "checkbox",
							checked: props.checked,
							disabled: props.disabled,
							onChange: (event) => {
								props.onEdit(event.target.checked);
							}
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: fields_module_css_default.label,
							htmlFor: props.id,
							children: props.label
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: fields_module_css_default.checkboxHint,
							children: props.hint
						})
					]
				})
			});
		}
		/** A staged select: the provider-kind picker inside one entry. */
		function SelectField(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
				className: fields_module_css_default.visuallyHidden,
				children: props.label
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("select", {
				id: props.id,
				className: fields_module_css_default.select,
				value: props.value,
				disabled: props.disabled,
				onChange: (event) => {
					props.onEdit(event.target.value);
				},
				children: props.options.map((option) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
					value: option.value,
					children: option.label
				}, option.value))
			})] }) });
		}
		/**
		* One entry's API-key editor: the kind's single fixed credential (shown as
		* a ref badge with its presence), the staged keys as masked closable tags,
		* and an input with a `+` button (Enter works too). Tag order is the order
		* a save writes and the runtime reads. The credentials API is value-free on
		* read, so stored literals are never echoed back — a save REPLACES the whole
		* stored value, and closing every tag makes it clear the credential.
		*/
		function KeysField(props) {
			const [text, setText] = (0, react.useState)("");
			const { view } = props;
			const add = () => {
				if (text.trim().length === 0) return;
				props.onAdd(text);
				setText("");
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: fields_module_css_default.fieldEmbedded,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: fields_module_css_default.head,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
							className: fields_module_css_default.label,
							children: props.label
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: fields_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: fields_module_css_default.badge,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("code", { children: view.ref }),
									" ",
									view.staged ? props.stagedLabel : view.configured === void 0 ? "" : view.configured ? props.configuredLabel : props.unsetLabel
								]
							}), view.staged ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: fields_module_css_default.reset,
								disabled: props.disabled,
								onClick: props.onReset,
								children: "×"
							}) : null]
						})]
					}),
					view.tags.length === 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: fields_module_css_default.chips,
						children: view.tags.map((masked, keyIndex) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: fields_module_css_default.chip,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: fields_module_css_default.chipKey,
								children: masked
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: fields_module_css_default.chipRemove,
								"aria-label": `${props.removeLabel} ${String(keyIndex + 1)}`,
								disabled: props.disabled,
								onClick: () => {
									props.onRemove(keyIndex);
								},
								children: "×"
							})]
						}, String(keyIndex)))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: fields_module_css_default.keyAddRow,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							className: fields_module_css_default.keyFormInput,
							type: "password",
							placeholder: props.placeholder,
							value: text,
							disabled: props.disabled,
							spellCheck: false,
							autoComplete: "off",
							onChange: (event) => {
								setText(event.target.value);
							},
							onKeyDown: (event) => {
								if (event.key !== "Enter") return;
								event.preventDefault();
								add();
							}
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: fields_module_css_default.ghostButton,
							"aria-label": props.addLabel,
							title: props.addLabel,
							disabled: props.disabled || text.trim().length === 0,
							onClick: add,
							children: "+"
						})]
					})
				]
			});
		}
		/** A generic small header row with trailing content (used by the queue section). */
		function SectionHead(props) {
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: fields_module_css_default.queueHead,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: fields_module_css_default.label,
					children: props.label
				}), props.children]
			});
		}
		//#endregion
		//#region src/client/card.tsx
		/** Locale key naming one provider kind. */
		const KIND_KEY = {
			anysearch: "kindAnysearch",
			tinyfish: "kindTinyfish",
			tavily: "kindTavily",
			brave: "kindBrave",
			exa: "kindExa",
			firecrawl: "kindFirecrawl",
			jina: "kindJina",
			serpapi: "kindSerpapi",
			serper: "kindSerper"
		};
		/** One queue entry's block. */
		function EntryBlock(props) {
			const { t, entry, index, total, disabled, face } = props;
			const kindLabel = t(KIND_KEY[entry.kind]);
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: entry.enabled ? fields_module_css_default.entryBox : `${fields_module_css_default.entryBox} ${fields_module_css_default.entryBoxDisabled}`,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: fields_module_css_default.entryHead,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: fields_module_css_default.entryIndex,
								"aria-hidden": "true",
								children: String(entry.position)
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SelectField, {
								id: `agg-entry-kind-${String(index)}`,
								label: t("providerKind"),
								value: entry.kind,
								options: props.availableKinds.map((kind) => ({
									value: kind,
									label: t(KIND_KEY[kind])
								})),
								disabled,
								onEdit: (value) => {
									face.setKind(index, value);
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
								className: fields_module_css_default.entryControls,
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: fields_module_css_default.iconButton,
										"aria-label": `${t("moveUp")}: ${kindLabel}`,
										disabled: disabled || index === 0,
										onClick: () => {
											face.moveEntry(index, -1);
										},
										children: "↑"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: fields_module_css_default.iconButton,
										"aria-label": `${t("moveDown")}: ${kindLabel}`,
										disabled: disabled || index === total - 1,
										onClick: () => {
											face.moveEntry(index, 1);
										},
										children: "↓"
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
										type: "button",
										className: `${fields_module_css_default.iconButton} ${fields_module_css_default.iconButtonDanger}`,
										"aria-label": `${t("removeEntry")}: ${kindLabel}`,
										disabled,
										onClick: () => {
											face.removeEntry(index);
										},
										children: "✕"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(CheckboxField, {
						id: `agg-entry-enabled-${String(index)}`,
						label: t("entryEnabled"),
						hint: t("entryEnabledHint"),
						checked: entry.enabled,
						disabled,
						onEdit: (checked) => {
							face.setEnabled(index, checked);
						}
					}),
					entry.invalidReason === void 0 ? null : /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: fields_module_css_default.invalid,
						children: t("duplicateKind")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(KeysField, {
						view: entry.keys,
						label: t("keysLabel"),
						placeholder: KIND_KEY_PLACEHOLDER[entry.kind],
						configuredLabel: t("keyConfigured"),
						unsetLabel: t("keyUnset"),
						stagedLabel: t("keyStaged"),
						addLabel: t("addKey"),
						removeLabel: t("removeKey"),
						disabled,
						onAdd: (literal) => {
							face.addKey(index, literal);
						},
						onRemove: (keyIndex) => {
							face.removeKey(index, keyIndex);
						},
						onReset: () => {
							face.resetKeys(index);
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: fields_module_css_default.fieldEmbedded,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
							className: fields_module_css_default.head,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("label", {
								className: fields_module_css_default.label,
								htmlFor: `agg-entry-baseurl-${String(index)}`,
								children: t("baseURL")
							})
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							id: `agg-entry-baseurl-${String(index)}`,
							className: fields_module_css_default.keyFormInput,
							type: "text",
							placeholder: KIND_DEFAULT_BASE_URL[entry.kind],
							value: entry.baseURL,
							disabled,
							spellCheck: false,
							onChange: (event) => {
								face.setBaseURL(index, event.target.value);
							}
						})]
					})
				]
			});
		}
		/**
		* Render the aggregated-search card.
		* @param props - locale copy, the card snapshot, and its form actions.
		* @returns the card.
		*/
		function AggregatedCard(props) {
			const { t } = props;
			const state = props.useAggregatedCard((snapshot) => snapshot);
			const disabled = !state.writable;
			const queuedKinds = new Set(state.entries.map((entry) => entry.kind));
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(PluginCard, {
				copy: {
					expand: t("expand"),
					collapse: t("collapse"),
					unsaved: t("unsaved"),
					readOnly: t("readOnly"),
					saveFailed: t("saveFailed"),
					discard: t("discard"),
					save: t("save"),
					saving: t("saving")
				},
				title: t("title"),
				description: t("description"),
				state,
				onSave: props.save,
				onDiscard: props.discard,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(ValueField, {
						id: "plugin-config-aggregated-timeout",
						label: t("attemptTimeout"),
						hint: t("attemptTimeoutHint"),
						overriddenLabel: t("overridden"),
						resetLabel: t("reset"),
						invalidLabel: t("invalidNumber"),
						disabled,
						text: state.timeout.text,
						overridden: state.timeout.overridden,
						invalid: state.timeout.invalid,
						onEdit: (text) => {
							props.editTimeout(text);
						},
						onReset: () => {
							props.resetTimeout();
						}
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(SectionHead, {
						label: t("queueLabel"),
						children: state.queueOverridden ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
							className: fields_module_css_default.badges,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								className: fields_module_css_default.badge,
								children: t("overridden")
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								type: "button",
								className: fields_module_css_default.reset,
								disabled,
								onClick: props.resetQueue,
								children: t("reset")
							})]
						}) : null
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: fields_module_css_default.hint,
						children: t("queueHint")
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: fields_module_css_default.queue,
						children: state.entries.map((entry, index) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)(EntryBlock, {
							t,
							entry,
							availableKinds: PROVIDER_KINDS.filter((kind) => kind === entry.kind || !queuedKinds.has(kind)),
							total: state.entries.length,
							index,
							disabled,
							face: props
						}, `${String(index)}-${entry.kind}`))
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: `${fields_module_css_default.chips} ${fields_module_css_default.addRow}`,
						children: PROVIDER_KINDS.map((kind) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							type: "button",
							className: fields_module_css_default.ghostButton,
							disabled: disabled || queuedKinds.has(kind),
							title: queuedKinds.has(kind) ? t("kindAlreadyQueued") : KIND_CREDENTIAL_REF[kind],
							onClick: () => {
								props.addEntry(kind);
							},
							children: ["+ ", t(KIND_KEY[kind])]
						}, kind))
					})
				]
			});
		}
		//#endregion
		//#region src/client/locales.ts
		/** English copy. */
		const en = {
			title: "Aggregated web search",
			description: "Serves web search through a prioritized queue of AnySearch / TinyFish / Tavily / Brave / Exa / Firecrawl / Jina / SerpApi / Serper.",
			attemptTimeout: "Per-provider attempt timeout (ms)",
			attemptTimeoutHint: "One attempt is cut off after this long and the queue moves to the next provider or key. 1000–60000.",
			queueLabel: "Provider queue",
			queueHint: "A web search tries the entries top-down: the first one that returns wins, a failed entry falls through to the next. Keys within one provider rotate and fall through the same way. Each provider can be queued once.",
			kindAnysearch: "AnySearch",
			kindTinyfish: "TinyFish",
			kindTavily: "Tavily",
			kindBrave: "Brave Search",
			kindExa: "Exa",
			kindFirecrawl: "Firecrawl",
			kindJina: "Jina Search",
			kindSerpapi: "SerpApi",
			kindSerper: "Serper",
			providerKind: "Provider",
			entryEnabled: "Enabled",
			entryEnabledHint: "A disabled entry stays configured but is skipped.",
			moveUp: "Move up",
			moveDown: "Move down",
			removeEntry: "Remove entry",
			keysLabel: "API keys",
			keyConfigured: "configured",
			keyUnset: "not set",
			keyStaged: "pending save",
			addKey: "Add key",
			removeKey: "Remove key",
			kindAlreadyQueued: "Already queued",
			duplicateKind: "This provider is already queued; each provider can appear once.",
			baseURL: "Endpoint base URL",
			overridden: "overridden",
			reset: "Reset",
			invalidText: "Not a valid value.",
			invalidNumber: "Enter a number.",
			expand: "Expand",
			collapse: "Collapse",
			unsaved: "Unsaved",
			readOnly: "Read-only",
			saveFailed: "Saving failed; the edits are kept.",
			discard: "Discard",
			save: "Save",
			saving: "Saving…"
		};
		/** 中文文案。 */
		const zh = {
			title: "聚合网页搜索",
			description: "按优先级队列依次调用 AnySearch / TinyFish / Tavily / Brave / Exa / Firecrawl / Jina / SerpApi / Serper 完成网页搜索",
			attemptTimeout: "单个提供商尝试超时（毫秒）",
			attemptTimeoutHint: "一次调用超过该时长即被切断，队列转向下一个 key 或下一个提供商。范围 1000–60000。",
			queueLabel: "提供商队列",
			queueHint: "网页搜索按自上而下的顺序逐个尝试：第一个返回结果的生效，失败的自动落到下一个。同一提供商的多个 key 同样轮转回退。每个提供商只能加入一次。",
			kindAnysearch: "AnySearch",
			kindTinyfish: "TinyFish",
			kindTavily: "Tavily",
			kindBrave: "Brave Search",
			kindExa: "Exa",
			kindFirecrawl: "Firecrawl",
			kindJina: "Jina Search",
			kindSerpapi: "SerpApi",
			kindSerper: "Serper",
			providerKind: "提供商",
			entryEnabled: "启用",
			entryEnabledHint: "停用的条目保留配置但会被跳过。",
			moveUp: "上移",
			moveDown: "下移",
			removeEntry: "删除条目",
			keysLabel: "API keys",
			keyConfigured: "已配置",
			keyUnset: "未设置",
			keyStaged: "待保存",
			addKey: "添加 key",
			removeKey: "移除 key",
			kindAlreadyQueued: "已在队列中",
			duplicateKind: "该提供商已在队列中，每个提供商只能出现一次。",
			baseURL: "接口地址（Base URL）",
			overridden: "已覆盖",
			reset: "重置",
			invalidText: "不是有效值。",
			invalidNumber: "请输入数字。",
			expand: "展开",
			collapse: "收起",
			unsaved: "未保存",
			readOnly: "只读",
			saveFailed: "保存失败，编辑内容已保留。",
			discard: "放弃",
			save: "保存",
			saving: "保存中…"
		};
		//#endregion
		//#region src/client/index.ts
		/** Dictionary namespace owned by this plugin. */
		const NS = "web-search-aggregation";
		/** Required services (cordis fiber inject). */
		const inject = [
			"slots",
			"locale",
			"settingsScope",
			"connection",
			"remote"
		];
		/**
		* Mount the aggregated-search plugin-configuration card.
		* @param ctx - the browser plugin context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "web-search-aggregation: card dictionary");
			const { api } = ctx.get("connection");
			const controller = new AggregatedCardController(ctx.settingsScope.bind({ namespace: WEB_SEARCH_AGGREGATION_NS }), api);
			ctx.effect(() => ctx.remote.$on("credentials/reference-updated", (ref) => {
				controller.refreshCredential(ref);
			}), "web-search-aggregation: credential invalidations");
			ctx.slots.inject("settings.plugin.item", () => ctx.slots.register({
				name: "settings.plugin.item",
				key: WEB_SEARCH_AGGREGATION_NS,
				locale: NS,
				inject: () => controller.inject()
			}, AggregatedCard));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map