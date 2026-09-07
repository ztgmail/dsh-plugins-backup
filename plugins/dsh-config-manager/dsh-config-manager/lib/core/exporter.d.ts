import type { MsgFunc } from './messages.ts';
import type { Manifest } from '../schema/types.ts';
import type { ConfigAdapter, EncryptionProvider, ExportOptions, ExportReport, HostContext, SecretScanner } from './types.ts';
/** m1：每导出一个分区前的进度回调信息（Host 侧 run 状态更新用；section = adapter id） */
export interface SectionProgress {
    section: string;
    /** 当前分区序号（1 起） */
    index: number;
    /** 选中分区总数 */
    total: number;
}
export interface ExporterOptions {
    ctx: HostContext;
    adapters: ConfigAdapter[];
    /** Secret 扫描器；缺省用字段名黑名单剥离（m4 可注入强化版） */
    scanner?: SecretScanner;
    /** 加密提供者（m4 用 node:crypto 实现）；includeSecrets 时必填；提供时备份标记 encrypted=true */
    encryption?: EncryptionProvider | null;
    /** 插件自身版本（manifest.exporter.version） */
    exporterVersion?: string;
    now?: () => Date;
    /** 消息翻译器（缺省 ctx.msg ?? zh） */
    msg?: MsgFunc;
    /** m1：每导出一个分区前调用（真实进度埋点；不传则无埋点） */
    onSection?: (info: SectionProgress) => void;
    /**
     * 插件数据目录（文件级 vault 位于 <vaultDataDir>/vault，缺省 <homeDir>/dsh-config-manager）。
     * includeSecrets=false 时导出会自动刷新 vault；宿主自定义 dataDir 时应注入实际值
     * （HostContext 不携带 dataDir，故经选项注入）。
     */
    vaultDataDir?: string;
}
/** 缺省 SecretScanner：递归黑名单字段剥离（字段名大小写不敏感；二进制/Uint8Array 原样跳过） */
export declare function defaultSecretScanner(): SecretScanner;
export declare class Exporter {
    private readonly ctx;
    private readonly adapters;
    private readonly scanner;
    private readonly encryption;
    private readonly exporterVersion;
    private readonly now;
    private readonly msg;
    private readonly onSection;
    private readonly vaultDataDir;
    constructor(opts: ExporterOptions);
    /**
     * 导出：收集 → 过滤 → checksum → manifest → ZIP。
     * 返回 zipPath（含文件名）、manifest、报告。
     */
    export(options: ExportOptions): Promise<{
        zipPath: string;
        manifest: Manifest;
        report: ExportReport;
    }>;
}
/** 供报告使用：导出器身份（避免与 manifest 常量重复维护） */
export declare const EXPORTER_INFO: {
    name: string;
};
