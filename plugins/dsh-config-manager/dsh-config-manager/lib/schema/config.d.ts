import type { CredentialsSection, FilesSection, McpSection, PluginsSection, PromptsSection, ProvidersSection, SectionData, SectionId, SettingsSection, UiSection, WorkspacesSection } from './types.ts';
/** 全部分区 id（manifest 校验与 adapter registry 共用） */
export declare const SECTION_IDS: readonly SectionId[];
/** JSON 分区在 ZIP 内的相对路径；文件类分区（skills 等）走目录前缀，不在此表 */
export declare const SECTION_JSON_PATHS: Partial<Record<SectionId, string>>;
/** 文件类分区在 ZIP 内的目录前缀 */
export declare const SECTION_FILE_PREFIXES: Partial<Record<SectionId, string>>;
/** 该分区是否是「文件类」分区（ZIP 内以真实文件存放而非 JSON） */
export declare function isFileSection(sectionId: SectionId): boolean;
/** 从 ZIP 内 JSON 解析分区数据（深度保护 + 结构校验） */
export declare function parseSectionJson<T extends SectionData>(sectionId: SectionId, raw: string): T;
export interface SectionIssue {
    path: string;
    message: string;
    severity: 'error' | 'warning';
}
/** 分区数据结构基础校验（version 字段 + 顶层形状） */
export declare function validateSectionData(sectionId: SectionId, data: unknown): SectionIssue[];
/** 分区 JSON 载荷的类型收窄（供 adapter / analyzer 使用） */
export declare function asSettingsSection(data: unknown): SettingsSection;
export declare function asUiSection(data: unknown): UiSection;
export declare function asProvidersSection(data: unknown): ProvidersSection;
export declare function asPluginsSection(data: unknown): PluginsSection;
export declare function asMcpSection(data: unknown): McpSection;
export declare function asPromptsSection(data: unknown): PromptsSection;
export declare function asWorkspacesSection(data: unknown): WorkspacesSection;
export declare function asCredentialsSection(data: unknown): CredentialsSection;
export declare function asFilesSection(data: unknown): FilesSection;
