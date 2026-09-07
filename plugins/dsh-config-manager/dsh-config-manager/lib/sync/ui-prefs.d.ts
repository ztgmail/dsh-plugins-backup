export declare const UI_PREFS_FILE = "ui-prefs.json";
export declare const UI_PREFS_SCHEMA_VERSION = 1;
/** 同步通道类型（与 sync-selection / sync-config 共享语义；避免循环 import 自行声明） */
export type UiPrefsChannel = 'git' | 'webdav';
/** 插件自身 UI 偏好（持久化面）。 */
export interface UiPrefs {
    schemaVersion: number;
    /** 用户上次选择的同步通道；未配置为 undefined */
    lastSyncChannel?: UiPrefsChannel;
    /** Star 引导弹窗：首次进入页面时间（ms 时间戳）；未配置 = 尚未进入过页面 */
    starPromptFirstSeenAt?: number;
    /** Star 引导弹窗：用户点过「不再提示」（永久不再弹） */
    starPromptDismissed?: boolean;
    /** Star 引导弹窗：用户点过「去点 Star」（方案 A：引导完成，不再弹） */
    starPromptClicked?: boolean;
    /** 更新内容弹窗：上次已记录/展示过的插件版本号（如 '0.1.54'） */
    releaseNotesLastSeenVersion?: string;
    /** 更新内容弹窗：用户点过「永不提示」（永久不再自动弹出） */
    releaseNotesDismissed?: boolean;
}
/** 缺省配置（首次无文件 / 损坏 / 不支持 schema 时回退） */
export declare function defaultUiPrefs(): UiPrefs;
/** 读取 UI 偏好；文件不存在 / 损坏 / 不支持 schema → 缺省值（不抛错）。 */
export declare function readUiPrefs(dir: string): Promise<UiPrefs>;
/** 写入 UI 偏好（原子写：临时文件 + rename；自动创建目录）。 */
export declare function writeUiPrefs(dir: string, prefs: UiPrefs): Promise<void>;
/**
 * 局部原子更新：read → merge → write。
 * 多端点共写 ui-prefs.json 时（sync/ui-prefs 与 star-prompt），任一端点写全量对象
 * 都会丢掉另一端点刚写入的字段；统一走本函数按补丁合并，杜绝互相覆盖。
 */
export declare function updateUiPrefs(dir: string, patch: UiPrefsPatch): Promise<UiPrefs>;
/** updateUiPrefs 的补丁类型（UiPrefs 全部可选字段，schemaVersion 不可补丁）。 */
export type UiPrefsPatch = Partial<Omit<UiPrefs, 'schemaVersion'>>;
