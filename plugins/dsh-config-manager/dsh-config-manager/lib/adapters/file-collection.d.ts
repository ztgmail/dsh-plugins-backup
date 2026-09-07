import type { MsgFunc } from '../core/messages.ts';
import type { FilesSection, SectionId } from '../schema/types.ts';
import type { ApplyResult, ConfigAdapter, ExportOptions, ExportSection, HostContext, ImportContext, PlanItem, Portability, ValidationResult } from '../core/types.ts';
export declare abstract class FileCollectionAdapter implements ConfigAdapter<FilesSection> {
    abstract readonly id: SectionId;
    abstract readonly displayName: string;
    abstract readonly defaultIncluded: boolean;
    abstract readonly portability: Portability;
    /** 相对 homeDir 的基准目录（与 core/backup.ts FILE_BASES 一致） */
    abstract readonly baseDir: string;
    export(ctx: HostContext, _options: ExportOptions): Promise<ExportSection<FilesSection>>;
    analyzeImport(data: FilesSection, ctx: ImportContext): Promise<PlanItem[]>;
    applyItem(item: PlanItem, ctx: ImportContext): Promise<ApplyResult>;
    validate(data: FilesSection, msg?: MsgFunc): Promise<ValidationResult>;
}
