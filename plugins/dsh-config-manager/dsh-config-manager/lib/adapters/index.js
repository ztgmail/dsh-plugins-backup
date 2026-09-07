import { SettingsAdapter } from "./settings.js";
import { UiAdapter } from "./ui.js";
import { ProvidersAdapter } from "./providers.js";
import { PluginsAdapter } from "./plugins.js";
import { McpAdapter } from "./mcp.js";
import { PromptsAdapter } from "./prompts.js";
import { SkillsAdapter } from "./skills.js";
import { AgentPresetsAdapter } from "./agent-presets.js";
import { AgentInstructionsAdapter } from "./agent-instructions.js";
import { WorkspacesAdapter } from "./workspaces.js";
import { CredentialsAdapter } from "./credentials.js";
import { PluginFilesAdapter } from "./plugin-files.js";
import { SessionsAdapter } from "./sessions.js";
import { SelfAdapter } from "./self.js";
/** 组装默认 adapter 列表（pluginFiles/sessions 恒挂载但 defaultIncluded=false，用户勾选才导出） */
export function createAdapters(options = {}) {
    const namespaces = options.namespaces ?? [];
    const adapters = [
        new SettingsAdapter(namespaces),
        new UiAdapter(namespaces),
        new ProvidersAdapter(),
        new PluginsAdapter(options.selfPluginName),
        new McpAdapter(),
        new PromptsAdapter(),
        new SkillsAdapter(),
        new AgentPresetsAdapter(),
        new AgentInstructionsAdapter(),
        new WorkspacesAdapter(),
        new CredentialsAdapter({ namespaces, refs: options.credentialsRefs }),
        new PluginFilesAdapter(options.pluginFiles, options.pluginFilesDir),
    ];
    // self 分区：插件自身配置（同步/市场/偏好），portable 默认包含；'' = 不挂载
    if (options.selfDir !== '') {
        adapters.push(new SelfAdapter(options.selfDir ?? 'dsh-config-manager'));
    }
    if (options.includeSessions)
        adapters.push(new SessionsAdapter());
    return adapters;
}
export { SettingsAdapter } from "./settings.js";
export { UiAdapter, isUiNamespace, KNOWN_UI_NAMESPACE_PREFIXES, UI_MIGRATION_NOTES } from "./ui.js";
export { ProvidersAdapter, DEFAULT_PROVIDER_NAMESPACES } from "./providers.js";
export { PluginsAdapter, USER_PATCH_FILE } from "./plugins.js";
export { McpAdapter, extractMcpServers, buildMcpPatchLine } from "./mcp.js";
export { PromptsAdapter, extractPrompts, mergePromptIntoLine, buildPromptLine } from "./prompts.js";
export { SkillsAdapter } from "./skills.js";
export { AgentPresetsAdapter } from "./agent-presets.js";
export { AgentInstructionsAdapter } from "./agent-instructions.js";
export { WorkspacesAdapter } from "./workspaces.js";
export { CredentialsAdapter, defaultCredentialRefs } from "./credentials.js";
export { PluginFilesAdapter, DEFAULT_PLUGIN_FILE_WHITELIST } from "./plugin-files.js";
export { SessionsAdapter } from "./sessions.js";
export { SelfAdapter, SELF_CONFIG_FILES } from "./self.js";
export { FileCollectionAdapter } from "./file-collection.js";
//# sourceMappingURL=index.js.map