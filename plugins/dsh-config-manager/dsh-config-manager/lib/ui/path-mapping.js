import { applyPrefixMappings } from "../utils/paths.js";
export class PathMappingEditor {
    issues;
    drafts = new Map();
    constructor(opts = {}) {
        this.issues = opts.issues ?? [];
        for (const issue of this.issues) {
            this.drafts.set(issue.value, {
                oldPrefix: issue.value,
                newPrefix: issue.mappedTo ?? '',
                issue,
                appliesTo: [],
            });
        }
        // 批量映射按 oldPrefix 聚合（一个 oldPrefix 一条 draft）
        for (const m of opts.existing ?? []) {
            const prev = this.drafts.get(m.oldPrefix);
            this.drafts.set(m.oldPrefix, {
                oldPrefix: m.oldPrefix,
                newPrefix: m.newPrefix,
                appliesTo: [...m.appliesTo],
            });
            void prev;
        }
    }
    /** 全部草稿（含未解析） */
    get all() {
        return [...this.drafts.values()];
    }
    /** 已解析（newPrefix 非空）的草稿 */
    get resolved() {
        return this.all.filter((d) => d.newPrefix !== '');
    }
    /** 未解析的问题（UI 需提示用户选择文件夹；按「是否被已解析映射覆盖」判断，批量前缀映射一次覆盖多条） */
    get unresolved() {
        const mappings = this.toPathMappings();
        return (this.issues ?? []).filter((issue) => {
            const mapped = applyPrefixMappings(issue.value, mappings);
            return mapped === issue.value;
        });
    }
    /** 单项/批量设置映射（oldPrefix 已存在则更新；否则新建批量映射） */
    setMapping(oldPrefix, newPrefix, appliesTo = []) {
        const existing = this.drafts.get(oldPrefix);
        this.drafts.set(oldPrefix, {
            oldPrefix,
            newPrefix,
            appliesTo,
            issue: existing?.issue,
        });
    }
    /** 对某个具体值应用当前映射，返回替换结果（预览用；无映射则原样返回） */
    preview(value) {
        const resolved = this.resolved.map((d) => ({
            oldPrefix: d.oldPrefix,
            newPrefix: d.newPrefix,
            appliesTo: d.appliesTo,
        }));
        const mapped = applyPrefixMappings(value, resolved);
        return typeof mapped === 'string' ? mapped : value;
    }
    /** 未解析项是否可进入执行（false = 有路径问题未解决） */
    get isComplete() {
        return this.unresolved.length === 0;
    }
    /** 输出 core PathMapping[]（仅已解析项） */
    toPathMappings() {
        return this.resolved.map((d) => ({
            oldPrefix: d.oldPrefix,
            newPrefix: d.newPrefix,
            appliesTo: d.appliesTo,
        }));
    }
}
//# sourceMappingURL=path-mapping.js.map