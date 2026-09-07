/**
 * skills 分区 adapter（设计 §3.3）：
 * 数据源 = ~/.dsh/skills/（flat .md + 目录 bundle；dsh-skill-filesystem 发现）。
 * 仅迁移用户主目录技能；~/.agents/skills、项目级技能默认不迁（研究报告 §2.2）。
 */
import { FileCollectionAdapter } from "./file-collection.js";
export class SkillsAdapter extends FileCollectionAdapter {
    id = 'skills';
    displayName = 'Skills';
    defaultIncluded = true;
    portability = 'portable';
    baseDir = 'skills';
}
//# sourceMappingURL=skills.js.map