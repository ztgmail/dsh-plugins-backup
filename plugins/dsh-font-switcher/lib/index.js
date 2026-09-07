/**
 * dsh-font-switcher — host half.
 *
 * Registers the durable `dsh-font-switcher` settings namespace (two font
 * strings) so the browser settingsScope can read/write them. Values persist
 * in the user-settings document (`~/.dsh/settings.yaml`). An empty string
 * means "keep the DSH default".
 */
import { settingsNamespace } from "@deepseek-ai/dsh-settings";
import z from "@deepseek-ai/schemastery";

/** Settings namespace owned by the dsh-font-switcher plugin. */
export const SETTINGS_NAMESPACE = "dsh-font-switcher";
/** Whole-interface (UI text) font-family override; "" = default. */
export const UI_FONT_FIELD = "uiFont";
/** Monospace / code font-family override; "" = default. */
export const CODE_FONT_FIELD = "codeFont";
/** Suppress the browser spellcheck on the composer (red wavy underlines). */
export const SPELLCHECK_FIELD = "spellcheckOff";

/**
 * Durable dsh-font-switcher schema; also the wire envelope the browser scope
 * validates against. Keep field keys in sync with the client half.
 */
export const FontSwitcherSettingsSchema = z.object({
  [UI_FONT_FIELD]: z.string().default(""),
  [CODE_FONT_FIELD]: z.string().default(""),
  [SPELLCHECK_FIELD]: z.boolean().default(false),
});

/** Cordis plugin identity (used by the loader/composition). */
export const name = "dsh-font-switcher";
/** Node half waits for the settings service before registering the namespace. */
export const inject = ["settings"];

/**
 * Host half of the plugin: register the durable settings namespace.
 * @param ctx - Host cordis context.
 */
export function apply(ctx) {
  ctx.inject(["settings"], (settingsCtx) => {
    settingsCtx.settings.register(settingsNamespace(SETTINGS_NAMESPACE), FontSwitcherSettingsSchema);
  });
}
