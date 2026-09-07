/**
 * m-sync-flow：待审队列持久化（独立文件 sync-review-queue.json）。
 *
 * 与 sync-state.json 分文件存放：sync-state 是机器可读同步元数据，
 * 待审队列是用户可见/可决策的工作队列；混在一起会让同步引擎误读。
 *
 * 设计：
 *  - 只存差异摘要（items 数组），不存全量 payload——避免双写；
 *    UI 需要完整数据时回拉远端或复用运行时 MergePlan。
 *  - 写入用 writeFile + rename 原子提交：半成品文件不会污染读侧。
 *  - 损坏 JSON 严格拒绝（不静默降级到空队列）。
 */
import fs from 'node:fs/promises';
export declare const REVIEW_QUEUE_FILE = "sync-review-queue.json";
/** 单条待审项（决策前 description/local/remote/ancestor 必填；decision 可选） */
export interface ReviewQueueItem {
    id: string;
    /** 分区 id（settings / providers / workspaces / plugins / mcp 等） */
    sectionId: string;
    /** 'key' | 'file' | 'section'：冲突粒度（来自 MergeConflict.kind 或整分区冲突） */
    kind: 'key' | 'file' | 'section';
    description: string;
    local?: unknown;
    remote?: unknown;
    ancestor?: unknown;
    /** 用户决策（resolve 后写入） */
    decision?: 'useRemote' | 'keepLocal' | 'skip';
    decidedAt?: string;
    /** 关联的远端快照 id（追溯来源） */
    snapshotId?: string;
}
export interface ReviewQueue {
    items: ReviewQueueItem[];
    updatedAt: string;
}
export declare const EMPTY_REVIEW_QUEUE: ReviewQueue;
/** 读取待审队列；文件不存在 → 返回空队列；损坏 JSON 抛错。 */
export declare function readReviewQueue(stateDir: string, fsx?: Pick<typeof fs, 'readFile' | 'writeFile' | 'rename' | 'stat' | 'mkdir'>): Promise<ReviewQueue>;
/**
 * 原子写入：先写临时文件 + rename 到目标文件（POSIX/Windows 均支持 rename 原子替换）。
 * 同一 stateDir 下并发调用不会产生半成品文件（写完临时再 rename）。
 */
export declare function writeReviewQueue(stateDir: string, queue: ReviewQueue, fsx?: Pick<typeof fs, 'readFile' | 'writeFile' | 'rename' | 'stat' | 'mkdir'>): Promise<void>;
/** 把多 item 追加到队列（同 id 视为同一项，不重复追加） */
export declare function enqueueItems(stateDir: string, items: Omit<ReviewQueueItem, 'id' | 'decidedAt' | 'decision'>[], now?: () => Date, fsx?: Pick<typeof fs, 'readFile' | 'writeFile' | 'rename' | 'stat' | 'mkdir'>): Promise<ReviewQueue>;
/** 把整组合并后的 autoApply 项（失败回滚后）入队 */
export declare function enqueueAutoAppliedOnFailure(stateDir: string, items: Omit<ReviewQueueItem, 'id' | 'decidedAt' | 'decision'>[], fsx?: Pick<typeof fs, 'readFile' | 'writeFile' | 'rename' | 'stat' | 'mkdir'>): Promise<ReviewQueue>;
/** 用户对某条 item 做了决策（keepLocal / useRemote / skip）；未找到抛错。 */
export declare function resolveItem(stateDir: string, itemId: string, decision: 'useRemote' | 'keepLocal' | 'skip', now?: () => Date, fsx?: Pick<typeof fs, 'readFile' | 'writeFile' | 'rename' | 'stat' | 'mkdir'>): Promise<ReviewQueue>;
/** 工具：在临时目录构造 stateDir 的便捷工厂（测试用） */
export declare function tmpStateDir(prefix: string): Promise<string>;
