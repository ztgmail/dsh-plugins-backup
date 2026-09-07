/**
 * agentPresets 分区 adapter（设计 §3.3）：
 * 数据源 = ~/.dsh/.agent-presets/（用户可写目录，每预设一个目录：agent.cordis.yml + preset.yml）。
 * system 预设（安装目录）只记引用不复制（本 adapter 只读用户目录）。
 */
import { FileCollectionAdapter } from './file-collection.ts';
export declare class AgentPresetsAdapter extends FileCollectionAdapter {
    readonly id: "agentPresets";
    readonly displayName = "Agent Presets";
    readonly defaultIncluded = true;
    readonly portability: "portable";
    readonly baseDir = ".agent-presets";
}
