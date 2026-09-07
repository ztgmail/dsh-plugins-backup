/**
 * workspaces 分区 adapter（设计 §3.3/§11）：
 * 数据源 = ~/.dsh/storages/workspace.json 的 tables.workspaces（经 ctx.workspace 门面）。
 * workspace.path 为绝对路径 → 跨设备必须 PathMapping（analyzeImport 生成 PathMapping 项，
 * 映射由引擎 PathMapper 先行应用到 sections，applyItem 拿到的已是映射后数据）。
 */
import { isDeepStrictEqual } from 'node:util';
import { zhMsg } from "../core/messages.js";
export class WorkspacesAdapter {
    id = 'workspaces';
    displayName = 'Workspaces';
    defaultIncluded = true;
    portability = 'platformSpecific';
    async export(ctx, _options) {
        const records = await ctx.workspace.listRecords();
        return {
            sectionId: 'workspaces',
            data: { version: 1, workspaces: records },
            counts: { workspaces: records.length },
            warnings: [],
        };
    }
    async analyzeImport(data, ctx) {
        const msg = ctx.msg;
        const items = [];
        for (const rec of data.workspaces) {
            const id = `workspace:${rec.id}`;
            const existing = (await ctx.target.workspace.listRecords()).find((r) => r.id === rec.id);
            if (!existing) {
                items.push({
                    id, kind: 'Create', adapter: 'workspaces',
                    description: msg('adapter.workspaceCreate', { title: rec.title ?? rec.id, path: rec.path }), severity: 'info',
                    target: { adapter: 'workspaces', ref: rec.id },
                });
            }
            else if (isDeepStrictEqual(existing, rec)) {
                items.push({ id, kind: 'Skip', adapter: 'workspaces', description: msg('adapter.workspaceSame', { id: rec.id }), severity: 'info' });
            }
            else {
                items.push({
                    id, kind: 'Conflict', adapter: 'workspaces',
                    description: msg('adapter.workspaceDiff', { id: rec.id }),
                    detail: `current=${JSON.stringify(existing)} imported=${JSON.stringify(rec)}`.slice(0, 200),
                    severity: 'warning', target: { adapter: 'workspaces', ref: rec.id },
                });
            }
            // 绝对路径 → 路径映射提示（oldPrefix 先用整条路径占位，newPrefix 由 UI 确认）
            if (rec.path.startsWith('/') || /^[a-zA-Z]:[\\/]/.test(rec.path)) {
                items.push({
                    id: `${id}:path`, kind: 'PathMapping', adapter: 'workspaces',
                    description: msg('adapter.workspacePathMapping', { path: rec.path }), severity: 'warning',
                    pathMapping: { oldPrefix: rec.path, newPrefix: '', appliesTo: ['workspaces'] },
                    target: { adapter: 'workspaces', ref: rec.id },
                });
            }
        }
        return items;
    }
    async applyItem(item, ctx) {
        // PathMapping 项：数据已由 PathMapper 应用到 sections，无需额外写入
        if (item.kind === 'PathMapping')
            return { ok: true };
        const ref = item.target?.ref;
        if (!ref)
            return { ok: false, message: ctx.msg('adapter.missingTargetRef') };
        const data = ctx.sections.get('workspaces');
        const rec = data?.workspaces.find((r) => r.id === ref);
        if (!rec)
            return { ok: false, message: ctx.msg('adapter.workspaceMissing', { ref }) };
        try {
            await ctx.target.workspace.writeRecord(rec);
            return { ok: true };
        }
        catch (err) {
            // 目标端无法写入（如路径 realpath 失败/目录不存在）→ 非致命警告（§34.17），
            // 不触发整体回滚——否则一个失效路径会拖垮已成功导入的其余配置。
            const reason = err instanceof Error ? err.message : String(err);
            return {
                ok: false,
                warning: true,
                message: ctx.msg('adapter.workspaceWriteFailed', { ref, msg: reason }),
            };
        }
    }
    async validate(data, msg = zhMsg) {
        const issues = [];
        if (data === null || typeof data !== 'object') {
            return { valid: false, issues: [{ path: '$', message: msg('adapter.validate.object', { subject: 'workspaces' }), severity: 'error' }] };
        }
        if (data.version !== 1) {
            issues.push({ path: 'version', message: msg('adapter.validate.version', { value: String(data.version) }), severity: 'error' });
        }
        if (!Array.isArray(data.workspaces)) {
            issues.push({ path: 'workspaces', message: msg('adapter.validate.array', { subject: 'workspaces' }), severity: 'error' });
        }
        else {
            for (const w of data.workspaces) {
                if (w === null || typeof w !== 'object' || typeof w.id !== 'string' || typeof w.path !== 'string') {
                    issues.push({ path: 'workspaces[]', message: msg('adapter.validate.workspaceIdentity'), severity: 'error' });
                }
            }
        }
        return { valid: issues.filter((i) => i.severity === 'error').length === 0, issues };
    }
}
//# sourceMappingURL=workspaces.js.map