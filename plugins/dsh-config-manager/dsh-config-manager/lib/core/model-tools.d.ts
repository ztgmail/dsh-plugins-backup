/**
 * dsh-config-manager — Agent 可调用的模型工具（P0-1）。
 *
 * 在 host 半注册 5 个 Cordis 模型工具，让 Agent 能自主驱动配置运维：
 *   config_backup           全量备份到 exports 目录（默认不含 secret；可选加密）
 *   config_list_snapshots   列出本地回滚快照
 *   config_restore          预览 / 执行恢复到某快照（默认只预览，confirm:true 才写入）
 *   config_sync_push        手动推送同步（写远端）
 *   config_sync_pull        拉取差异预览（零写入）
 *
 * 设计遵循 AGENTS.md 铁律：
 *   - 所有业务逻辑为可独立测试的纯编排函数（createModelTools），
 *     复用 src/core 已解耦引擎（Exporter / restore / SyncEngine），不重复实现；
 *   - React / HTTP 壳不参与；本文件是「引擎侧编排」，不放浏览器 src/ui/；
 *   - ctx.tools 服务用可选读取（ctx.get）守卫：未组合 tools 的部署不注册、不崩溃。
 *
 * 安全不变量（硬约束，勿破坏）：
 *   - secret 值永不进入工具入参/出参/render/日志；加密密码仅内存；
 *   - config_restore 是最危险写操作：缺省只 planRestore（零写入），真实执行必须 confirm:true；
 *   - config_sync_pull 零写入（只 analyze+plan 出差异）；落地需另走确认导入管道；
 *   - 分区/路径走既有白名单（SECTION_IDS 过滤；同步引擎 portable + FORBIDDEN_SECTIONS 双保险）。
 */
import type { Context } from '@deepseek-ai/cordis';
import type { JsonValue } from '@deepseek-ai/dsh-tools';
import type { SyncEngine } from '../sync/sync-engine.ts';
import type { SectionId } from '../schema/types.ts';
import type { SyncConfig, SyncTransportType } from '../sync/sync-config.ts';
import type { ConfigAdapter, HostContext } from './types.ts';
/** 模型工具所需依赖（与 host 路由同一来源闭包）。 */
export interface ModelToolsDeps {
    /** HostContext 门面（homeDir / profile / msg / log） */
    host: HostContext;
    /** 全部分区适配器 */
    adapters: ConfigAdapter[];
    /** 导出 ZIP 落盘目录（$DSH_HOME/dsh-config-manager/exports） */
    exportsDir: string;
    /** 回滚快照目录（$DSH_HOME/dsh-config-manager/snapshots） */
    snapshotsDir: string;
    /** 同步状态目录（$DSH_HOME/dsh-config-manager/sync） */
    syncDir: string;
    /** SyncEngine 工厂（git/webdav 按配置分支构造传输；与 host 路由同一来源） */
    makeSyncEngine: (cfg: SyncConfig) => SyncEngine;
    /** 插件版本（manifest.exporter.version） */
    exporterVersion?: string;
}
/** 5 个工具的纯编排实现（可独立测试，不依赖 Cordis ctx）。所有返回均为 JsonValue（可序列化、无 undefined）。 */
export declare function createModelTools(deps: ModelToolsDeps): {
    /** 全量备份到 exports 目录（默认不含 secret；password 可选加密，仅内存）。 */
    backup(input: {
        only?: SectionId[];
        password?: string;
    }): Promise<JsonValue>;
    /** 列出本地回滚快照（非敏感 meta，按 createdAt 倒序）。 */
    listSnapshots(): Promise<JsonValue>;
    /**
     * 恢复到指定快照。缺省只 planRestore（零写入）预览；
     * confirm:true 才真实执行 restore（覆盖/删除 $DSH_HOME 文件并卸载导入期间新增插件）。
     */
    restore(input: {
        snapshotId: string;
        confirm?: boolean;
    }): Promise<JsonValue>;
    /** 手动推送同步（写远端）。encrypt/includeSecrets 由引擎强制约束（密钥绝不明文进通道）。 */
    syncPush(input: {
        channel?: SyncTransportType;
        sections?: SectionId[];
        encrypt?: boolean;
        includeSecrets?: boolean;
        password?: string;
    }): Promise<JsonValue>;
    /** 拉取差异预览（零写入：只下载 + analyze + plan 出差异报告）。 */
    syncPull(input: {
        channel?: SyncTransportType;
        snapshotId?: string;
        strategy?: "merge" | "replace" | "skipExisting";
        password?: string;
    }): Promise<JsonValue>;
};
/** 把 5 个模型工具注册进 ctx.tools；tools 服务未组合时静默跳过（不崩溃）。 */
export declare function registerModelTools(ctx: Context, deps: ModelToolsDeps): void;
