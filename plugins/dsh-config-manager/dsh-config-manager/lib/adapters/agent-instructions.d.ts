import { FileCollectionAdapter } from './file-collection.ts';
import type { FilesSection } from '../schema/types.ts';
import type { ExportOptions, ExportSection, HostContext } from '../core/types.ts';
export declare class AgentInstructionsAdapter extends FileCollectionAdapter {
    readonly id: "agentInstructions";
    readonly displayName = "Agent Instructions";
    readonly defaultIncluded = true;
    readonly portability: "portable";
    readonly baseDir = "";
    /** 用户全局指令文件（相对 homeDir；同时是 schema 端该分区唯一的文件） */
    static readonly FILE = "AGENTS.md";
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<FilesSection>>;
}
