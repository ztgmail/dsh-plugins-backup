import { zhMsg } from "./messages.js";
/* ---------------- 错误类型 ---------------- */
/** 导入被确认前拒绝执行（安全阀） */
export class ImportNotConfirmedError extends Error {
    constructor(msg) {
        super((msg ?? zhMsg)('import.notConfirmed'));
        this.name = 'ImportNotConfirmedError';
    }
}
/** 导入失败：触发回滚后抛出，携带结果供 UI 展示 */
export class ImportFailedError extends Error {
    result;
    constructor(message, result) {
        super(message);
        this.name = 'ImportFailedError';
        this.result = result;
    }
}
/** 当前计划项被用户跳过（导入中点击「跳过当前插件」中止子进程）。
 * 宿主 install 中止时抛出；引擎在 applyOne 捕获并记为 skipped + skippedByUser。 */
export class ImportUserSkippedError extends Error {
    constructor(msg) {
        super((msg ?? zhMsg)('import.userSkipped'));
        this.name = 'ImportUserSkippedError';
    }
}
//# sourceMappingURL=types.js.map