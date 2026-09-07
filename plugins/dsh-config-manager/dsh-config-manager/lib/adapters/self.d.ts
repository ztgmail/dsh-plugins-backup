import type { ExportOptions, ExportSection, HostContext } from '../core/types.ts';
import type { FilesSection } from '../schema/types.ts';
import { FileCollectionAdapter } from './file-collection.ts';
/** self 分区白名单文件（相对 baseDir，即 $DSH_HOME/dsh-config-manager/）。 */
export declare const SELF_CONFIG_FILES: readonly string[];
export declare class SelfAdapter extends FileCollectionAdapter {
    readonly id: "self";
    readonly displayName = "Plugin Self Config";
    readonly defaultIncluded = true;
    readonly portability: "portable";
    /** 插件自身配置目录（相对 homeDir；宿主按 dataDir 解析注入，缺省 dsh-config-manager） */
    readonly baseDir: string;
    constructor(baseDir?: string);
    /** 白名单收集：只导出配置类文件（存在才收），不递归（排除快照/历史/缓存/临时产物）。
     *  relativePath 产出相对 baseDir 的路径（与 analyzeImport/applyItem 的 path.join(baseDir, ref) 匹配）。 */
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<FilesSection>>;
}
