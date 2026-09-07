/**
 * Host 端 run 注册表（m1）：记录导出/导入任务的运行状态与真实进度。
 *
 * 浏览器侧通过 `/api/dsh-config-manager/progress?runId=…` 与
 * `/api/dsh-config-manager/runs` 轮询/恢复进度（m2 store 刷新恢复、m3 进度 UI
 * 消费）；本模块是 Host 侧的单一事实源，不依赖任何 DSH 运行时服务。
 *
 * 安全纪律：
 *  - runId 由 crypto.randomBytes(16) 生成（32 hex 字符），不可猜测；
 *  - RunState 只存非敏感摘要（分区/计数/详情文案），绝不写入密钥、密码、
 *    秘密补录值或任何敏感内容；
 *  - result 只存可 JSON 序列化的业务结果（导出为 { zipPath, manifest, report }，
 *    导入为 ImportResult），不含秘密值。
 *
 * 生命周期：register（running）→ update（进度）→ finish（done+result）/
 * fail（failed+error）；超过保留期（默认 30 分钟）的 run 在任意读操作时惰性清理。
 * 并发纪律：同一 kind 已有 running 的 run 时，register 抛 RunConflictError
 * （宿主路由以 409 拒绝新任务，防止重复导出/导入）。
 */
import { randomBytes } from 'node:crypto';
import { zhMsg } from "./messages.js";
/** 单个 run 执行日志的行数上限（防无限增长；截断时保留最新行）。 */
export const MAX_RUN_LOG_LINES = 500;
/** 进行中同 kind 已有 run 时注册被拒（宿主路由 → 409）。 */
export class RunConflictError extends Error {
    /** 已在进行中的 run id（供客户端定位既有任务）。 */
    runId;
    constructor(runId, kind, msg = zhMsg) {
        super(kind === 'export'
            ? msg('run.conflict.export', { runId })
            : kind === 'autosync'
                ? '自动同步已在进行中'
                : kind === 'sync-apply'
                    ? '一键同步已在进行中'
                    : kind === 'backup-schedule'
                        ? '定时备份已在进行中'
                        : kind === 'restore'
                            ? '快照恢复已在进行中（请等待当前恢复完成）'
                            : kind === 'recovery'
                                ? '恢复/回滚已在进行中（请等待当前恢复完成）'
                                : msg('run.conflict.import', { runId }));
        this.name = 'RunConflictError';
        this.runId = runId;
    }
}
/** 完成/失败后的默认保留时长（30 分钟）。 */
export const DEFAULT_RUN_RETENTION_MS = 30 * 60 * 1000;
/**
 * 内存 run 注册表。Node 单线程 + 同步 Map 读写，无并发竞争；
 * 所有公开读方法返回状态副本，防止外部直接篡改内部状态。
 */
export class RunRegistry {
    runs = new Map();
    retentionMs;
    now;
    msg;
    constructor(opts = {}) {
        this.retentionMs = opts.retentionMs ?? DEFAULT_RUN_RETENTION_MS;
        this.now = opts.now ?? (() => Date.now());
        this.msg = opts.msg ?? zhMsg;
    }
    /** 注册新 run；同 kind 已有 running 时抛 RunConflictError。 */
    register(kind) {
        this.prune();
        for (const run of this.runs.values()) {
            if (run.kind === kind && run.status === 'running')
                throw new RunConflictError(run.runId, kind, this.msg);
        }
        const now = this.now();
        const state = {
            runId: randomBytes(16).toString('hex'),
            kind,
            status: 'running',
            section: null,
            sectionTotal: null,
            item: null,
            itemTotal: null,
            detail: null,
            log: [],
            createdAt: now,
            updatedAt: now,
        };
        this.runs.set(state.runId, state);
        return { ...state };
    }
    /** 更新进度；run 不存在返回 undefined；已完成/失败后的晚到更新被忽略（防御异步回调竞态）。 */
    update(runId, patch) {
        const run = this.runs.get(runId);
        if (run === undefined)
            return undefined;
        if (run.status !== 'running')
            return { ...run };
        Object.assign(run, patch, { updatedAt: this.now() });
        return { ...run };
    }
    /**
     * 追加一行执行日志（导入逐计划项操作 / 子进程命令）；run 不存在返回 undefined，
     * 已完成/失败后的晚到追加被忽略（防御异步回调竞态）。行数封顶 MAX_RUN_LOG_LINES，
     * 超限时截断保留最新行。
     *
     * **不可变写入（性能正确性关键）**：每次 append 生成新数组（push + splice 会原地
     * mutation —— /progress 轮询返回的 RunState.log 与浏览器侧 store 共享同一引用，
     * 行数封顶后长度恒定，React memo 按引用/长度比较将无法感知新行，日志面板冻结）。
     * 调用方（mapRunProgress → ImportLogPanel）据此以「数组引用变化」判断有新输出。
     */
    appendLog(runId, line) {
        const run = this.runs.get(runId);
        if (run === undefined)
            return undefined;
        if (run.status !== 'running')
            return { ...run };
        // 不可变追加：保留最新 MAX_RUN_LOG_LINES 行（slice(-(MAX-1)) 在长度不足时取全量）
        run.log = [...run.log.slice(-(MAX_RUN_LOG_LINES - 1)), line];
        run.updatedAt = this.now();
        return { ...run };
    }
    /** 读单个 run；超过保留期或不存在返回 undefined。 */
    get(runId) {
        this.prune();
        const run = this.runs.get(runId);
        return run === undefined ? undefined : { ...run };
    }
    /** 列出活跃（running）run（刷新恢复时经 /runs 重订阅用）。 */
    listActive() {
        this.prune();
        return [...this.runs.values()].filter((r) => r.status === 'running').map((r) => ({ ...r }));
    }
    /** 标记完成并写入业务结果；run 不存在返回 undefined。 */
    finish(runId, result) {
        const run = this.runs.get(runId);
        if (run === undefined)
            return undefined;
        run.status = 'done';
        run.result = result;
        run.updatedAt = this.now();
        return { ...run };
    }
    /** 标记失败并写入错误消息；run 不存在返回 undefined。 */
    fail(runId, error) {
        const run = this.runs.get(runId);
        if (run === undefined)
            return undefined;
        run.status = 'failed';
        run.error = error;
        run.updatedAt = this.now();
        return { ...run };
    }
    /** 惰性清理：超过保留期的 run（含长期 running 的僵死任务）全部移除。 */
    prune() {
        const cutoff = this.now() - this.retentionMs;
        for (const [id, run] of this.runs) {
            if (run.updatedAt < cutoff)
                this.runs.delete(id);
        }
    }
}
//# sourceMappingURL=run-registry.js.map