/**
 * agentPresets 分区 adapter（设计 §3.3）：
 * 数据源 = ~/.dsh/.agent-presets/（用户可写目录，每预设一个目录：agent.cordis.yml + preset.yml）。
 * system 预设（安装目录）只记引用不复制（本 adapter 只读用户目录）。
 */
import { FileCollectionAdapter } from "./file-collection.js";
export class AgentPresetsAdapter extends FileCollectionAdapter {
    id = 'agentPresets';
    displayName = 'Agent Presets';
    defaultIncluded = true;
    portability = 'portable';
    baseDir = '.agent-presets';
}
//# sourceMappingURL=agent-presets.js.map