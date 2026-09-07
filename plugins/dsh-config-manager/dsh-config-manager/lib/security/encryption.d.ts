import type { EncryptionInfo } from '../schema/types.ts';
import type { EncryptionProvider } from '../core/types.ts';
export declare const SCHEMA_MAGIC = "DSC1";
export declare const SCHEMA_VERSION = 1;
/** 整体加密备份容器的 magic（D C A rchive）：头部布局同 secrets.enc，kdf 参数用默认常量 */
export declare const ARCHIVE_MAGIC = "DCA1";
export declare const ARCHIVE_VERSION = 1;
/** 探测字节是否为整体加密备份容器（上传/下载时判定 containerType） */
export declare function isArchiveBlob(buf: Uint8Array): boolean;
export declare const SCRYPT_PARAMS: {
    readonly N: 16384;
    readonly r: 8;
    readonly p: 1;
    readonly keyLength: 32;
};
export declare const SALT_LENGTH = 16;
export declare const IV_LENGTH = 12;
export declare const TAG_LENGTH = 16;
/** magic(4) + version(1) + salt(16) + iv(12) + authTag(16) */
export declare const HEADER_LENGTH: number;
export type SecurityErrorCode = 'BAD_PASSWORD' | 'TAMPERED' | 'UNSUPPORTED_FORMAT';
export declare class SecurityError extends Error {
    readonly code: SecurityErrorCode;
    constructor(code: SecurityErrorCode, message: string);
}
/** KDF 参数值域校验（防 manifest 被篡改成超大 N 导致 DoS；非法即拒绝） */
export declare function validateKdfParams(params: unknown): params is EncryptionInfo['kdfParams'];
/** 派生密钥（scrypt，参数可来自 manifest；默认常量） */
export declare function deriveKey(password: string, salt: Uint8Array, params?: EncryptionInfo['kdfParams']): Promise<Buffer>;
/** 加密 .credentials.yaml 原文 → { blob, info }（info 直接进 manifest.security.encryption） */
export declare function encryptCredentials(plaintext: string, password: string): Promise<{
    blob: Uint8Array;
    info: EncryptionInfo;
}>;
/** 解密 secrets.enc（authTag 校验失败抛 BAD_PASSWORD；元数据不一致抛 TAMPERED） */
export declare function decryptCredentials(blob: Uint8Array, info: EncryptionInfo, password: string): Promise<string>;
/** 密码强度校验（导出 UI 用；≥8 字符，建议 12+ 混合） */
export declare function validatePasswordStrength(password: string): {
    ok: boolean;
    message: string;
};
/**
 * 创建 core `EncryptionProvider`（对齐 core/types.ts 契约）。
 * encrypt 使用闭包持有密码；decrypt 使用调用方传入的密码（支持换密码解密）。
 */
export declare function createEncryptionProvider(password: string): EncryptionProvider;
/**
 * 加密完整 ZIP 字节 → 加密容器 blob。
 *
 * 布局（DCA1，与 secrets.enc 同构，kdf 参数用默认常量）：
 *   magic "DCA1"(4B) + version(1B) + salt(16B) + iv(12B) + authTag(16B) + ciphertext(plainZIP)
 *
 * 语义：整个备份（manifest / 各分区 JSON / sessions / 插件文件 / secrets.enc……）
 * 全部进入 ciphertext，磁盘上无法看到任何明文内容。verifyEncryptedBlob 用于
 * 校验密码正确（GCM authTag 通过）且返回真实解密用的随机参数。
 */
export declare function encryptArchive(plainZip: Uint8Array, password: string): Promise<{
    blob: Uint8Array;
    info: EncryptionInfo;
    kdf: {
        salt: Buffer;
        iv: Buffer;
    };
}>;
/** 容器版解密：用「先验真实参数」校验密码并解密（—— 调用方必须先用 verifyEncryptedBlob 拿到 info/kdf） */
export declare function decryptArchive(blob: Uint8Array, info: EncryptionInfo, kdfParam: {
    salt: Buffer;
    iv: Buffer;
}, password: string): Promise<Uint8Array>;
export interface EncryptedBlobInfo {
    /** 容器是否合法（magic/version/header 校验通过） */
    valid: boolean;
    /** 密码是否正确（GCM authTag 认证通过）；valid=false 时恒 false */
    ok: boolean;
    /** 解密所需参数（valid && ok 时有效；用默认常量派生 key） */
    info: EncryptionInfo | null;
    kdf: {
        salt: Buffer;
        iv: Buffer;
    } | null;
    /** 错误码（供上层转用户可读错误）：BAD_PASSWORD / TAMPERED / UNSUPPORTED_FORMAT */
    code: SecurityErrorCode | null;
}
/**
 * 校验加密备份容器并验证密码（只读，零解密返回内容）。
 * - 容器不合法（非 DCA1 / 截断 / 参数异常）→ valid=false + code
 * - 密码正确 → ok=true + 返回随机参数（后续 decryptArchive 用之）
 * - 密码错误 → ok=false + code=BAD_PASSWORD
 */
export declare function verifyEncryptedBlob(blob: Uint8Array, password: string): Promise<EncryptedBlobInfo>;
