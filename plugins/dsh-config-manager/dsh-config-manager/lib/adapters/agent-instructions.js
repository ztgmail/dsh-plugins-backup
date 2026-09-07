/**
 * agentInstructions 分区 adapter（设计 §3.3 / dsh-agent-instructions 插件）：
 * 数据源 = ~/.dsh/AGENTS.md（用户全局指令文件，dsh-agent-instructions 固定读取 $DSH_HOME/AGENTS.md，
 * 注入每个会话的基线指令）。
 *
 * 与 skills/agentPresets 的差异：AGENTS.md 位于 $DSH_HOME 根目录，不能对 homeDir 整目录递归枚举，
 * 因此不复用 FileCollectionAdapter 的目录扫描，而是白名单固定收集单文件 AGENTS.md。
 * 仅迁移全局文件；项目级 AGENTS.md / CLAUDE.md 属于各项目仓库，默认不迁（研究报告 §2.2 同策略）。
 * baseDir = ''（homeDir 根），与 core/backup.ts FILE_BASES 的 '' 基准一致，保证通用快照/回滚路径正确。
 */
import { sha256Hex } from "../utils/hashing.js";
import { msgOf } from "../core/messages.js";
import { FileCollectionAdapter } from "./file-collection.js";
export class AgentInstructionsAdapter extends FileCollectionAdapter {
    id = 'agentInstructions';
    displayName = 'Agent Instructions';
    defaultIncluded = true;
    portability = 'portable';
    baseDir = '';
    /** 用户全局指令文件（相对 homeDir；同时是 schema 端该分区唯一的文件） */
    static FILE = 'AGENTS.md';
    async export(ctx, _options) {
        const files = [];
        try {
            const data = await ctx.fs.readFile(AgentInstructionsAdapter.FILE);
            files.push({
                relativePath: AgentInstructionsAdapter.FILE,
                data,
                contentHash: sha256Hex(data),
            });
        }
        catch {
            // 文件不存在 → 空分区（与 skills 目录不存在视为空一致），下方归档 dirEmpty 提示
        }
        const warnings = [];
        if (files.length === 0)
            warnings.push(msgOf(ctx)('adapter.dirEmpty', { type: this.displayName }));
        return {
            sectionId: this.id,
            data: { version: 1, files },
            counts: { files: files.length },
            warnings,
        };
    }
}
//# sourceMappingURL=agent-instructions.js.map