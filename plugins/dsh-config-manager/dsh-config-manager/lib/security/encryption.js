/**
 * 凭据加密（规范 §7 / 设计 §7.3 / core `EncryptionProvider` 契约实现，零依赖 node:crypto）。
 *
 * 方案：scrypt（KDF）+ AES-256-GCM（AEAD），每次导出 salt/iv 全随机，密码绝不落盘。
 * secrets.enc 二进制布局（设计 §7.3 细化）：
 *
 *   magic "DSC1"(4B) + version(1B) + salt(16B) + iv(12B) + authTag(16B) + ciphertext
 *
 * - magic/version 不符 → `UNSUPPORTED_FORMAT`（不是本插件产物 / 版本过新）
 * - blob 内嵌参数与 manifest 的 EncryptionInfo 不一致 → `TAMPERED`（元数据被篡改）
 * - GCM 认证失败（密码错误或密文被改） → `BAD_PASSWORD`（提示重输密码或核对备份来源）
 *
 * 与 core 契约的关系：
 * - `createEncryptionProvider(password)` 返回 core `EncryptionProvider`（encrypt 无密码参数，
 *   闭包持有导出密码；decrypt 用调用方传入的密码 → 支持「换密码解密」）。
 * - 底层纯函数 encryptCredentials/decryptCredentials 对齐设计 §13.4，供直接调用与测试。
 * - plaintext 语义：`.credentials.yaml` 文件原文（m5 经 HostContext.fs 文件级读取提供；
 *   ctx.credentials 永不回读值——研究报告 §3.2 硬约束），本模块只做字节级加解密。
 */
import crypto from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(crypto.scrypt);
export const SCHEMA_MAGIC = 'DSC1';
export const SCHEMA_VERSION = 1;
/** 整体加密备份容器的 magic（D C A rchive）：头部布局同 secrets.enc，kdf 参数用默认常量 */
export const ARCHIVE_MAGIC = 'DCA1';
export const ARCHIVE_VERSION = 1;
/** 探测字节是否为整体加密备份容器（上传/下载时判定 containerType） */
export function isArchiveBlob(buf) {
    return Buffer.from(buf.subarray(0, 4)).toString('ascii') === ARCHIVE_MAGIC;
}
export const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1, keyLength: 32 };
export const SALT_LENGTH = 16;
export const IV_LENGTH = 12;
export const TAG_LENGTH = 16;
/** magic(4) + version(1) + salt(16) + iv(12) + authTag(16) */
export const HEADER_LENGTH = 4 + 1 + SALT_LENGTH + IV_LENGTH + TAG_LENGTH;
export class SecurityError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.name = 'SecurityError';
        this.code = code;
    }
}
/** KDF 参数值域校验（防 manifest 被篡改成超大 N 导致 DoS；非法即拒绝） */
export function validateKdfParams(params) {
    if (params === null || typeof params !== 'object')
        return false;
    const p = params;
    if (typeof p['N'] !== 'number' || p['N'] < 2 ** 14 || p['N'] > 2 ** 20)
        return false;
    if (typeof p['r'] !== 'number' || p['r'] < 1 || p['r'] > 32)
        return false;
    if (typeof p['p'] !== 'number' || p['p'] < 1 || p['p'] > 32)
        return false;
    return typeof p['keyLength'] === 'number' && p['keyLength'] === 32;
}
/** 派生密钥（scrypt，参数可来自 manifest；默认常量） */
export async function deriveKey(password, salt, params = SCRYPT_PARAMS) {
    return scryptAsync(password, salt, params.keyLength, { N: params.N, r: params.r, p: params.p });
}
/** 加密 .credentials.yaml 原文 → { blob, info }（info 直接进 manifest.security.encryption） */
export async function encryptCredentials(plaintext, password) {
    if (password === '')
        throw new SecurityError('BAD_PASSWORD', '加密密码不能为空');
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = await deriveKey(password, salt);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const header = Buffer.alloc(HEADER_LENGTH);
    header.write(SCHEMA_MAGIC, 0, 'ascii');
    header[4] = SCHEMA_VERSION;
    salt.copy(header, 5);
    iv.copy(header, 5 + SALT_LENGTH);
    authTag.copy(header, 5 + SALT_LENGTH + IV_LENGTH);
    const info = {
        algorithm: 'aes-256-gcm',
        kdf: 'scrypt',
        kdfParams: { ...SCRYPT_PARAMS },
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        version: SCHEMA_VERSION,
    };
    return { blob: Buffer.concat([header, encrypted]), info };
}
/** 解密 secrets.enc（authTag 校验失败抛 BAD_PASSWORD；元数据不一致抛 TAMPERED） */
export async function decryptCredentials(blob, info, password) {
    if (blob.length < HEADER_LENGTH) {
        throw new SecurityError('TAMPERED', 'secrets.enc 体积过小（截断或损坏）');
    }
    const magic = Buffer.from(blob.subarray(0, 4)).toString('ascii');
    if (magic !== SCHEMA_MAGIC) {
        throw new SecurityError('UNSUPPORTED_FORMAT', `未知文件格式 magic "${magic}"，不是本插件产物`);
    }
    const version = blob[4];
    if (version !== SCHEMA_VERSION) {
        throw new SecurityError('UNSUPPORTED_FORMAT', `不支持的 secrets.enc 版本 ${version}`);
    }
    if (info.algorithm !== 'aes-256-gcm' || info.kdf !== 'scrypt' || !validateKdfParams(info.kdfParams)) {
        throw new SecurityError('UNSUPPORTED_FORMAT', 'manifest 加密参数非法或不受支持');
    }
    const blobSalt = blob.subarray(5, 5 + SALT_LENGTH);
    const blobIv = blob.subarray(5 + SALT_LENGTH, 5 + SALT_LENGTH + IV_LENGTH);
    const blobTag = blob.subarray(5 + SALT_LENGTH + IV_LENGTH, HEADER_LENGTH);
    if (info.salt !== Buffer.from(blobSalt).toString('base64') ||
        info.iv !== Buffer.from(blobIv).toString('base64') ||
        info.authTag !== Buffer.from(blobTag).toString('base64')) {
        throw new SecurityError('TAMPERED', 'secrets.enc 与 manifest 加密参数不一致（可能被篡改）');
    }
    let key;
    try {
        key = await deriveKey(password, blobSalt, info.kdfParams);
    }
    catch (err) {
        throw new SecurityError('BAD_PASSWORD', `密钥派生失败: ${err instanceof Error ? err.message : String(err)}`);
    }
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, blobIv);
    decipher.setAuthTag(blobTag);
    try {
        const decrypted = Buffer.concat([
            decipher.update(blob.subarray(HEADER_LENGTH)),
            decipher.final(),
        ]);
        return decrypted.toString('utf8');
    }
    catch {
        throw new SecurityError('BAD_PASSWORD', '解密认证失败：密码错误或密文被篡改');
    }
}
/** 密码强度校验（导出 UI 用；≥8 字符，建议 12+ 混合） */
export function validatePasswordStrength(password) {
    if (password.length < 8) {
        return { ok: false, message: '密码至少 8 个字符（建议 12+ 且含大小写与数字）' };
    }
    const variety = /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password);
    if (password.length < 12 && !variety) {
        return { ok: true, message: '密码强度偏弱：建议 12+ 字符且混合大小写与数字' };
    }
    return { ok: true, message: '' };
}
/**
 * 创建 core `EncryptionProvider`（对齐 core/types.ts 契约）。
 * encrypt 使用闭包持有密码；decrypt 使用调用方传入的密码（支持换密码解密）。
 */
export function createEncryptionProvider(password) {
    return {
        async encrypt(plaintext) {
            return encryptCredentials(plaintext, password);
        },
        async decrypt(blob, info, pw) {
            return decryptCredentials(blob, info, pw);
        },
    };
}
/* ---------------- 整体备份容器加密（§7.4：加密整个 ZIP，而非仅 secrets） ---------------- */
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
export async function encryptArchive(plainZip, password) {
    if (password === '')
        throw new SecurityError('BAD_PASSWORD', '加密密码不能为空');
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = await deriveKey(password, salt);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plainZip), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const header = Buffer.alloc(HEADER_LENGTH);
    header.write(ARCHIVE_MAGIC, 0, 'ascii');
    header[4] = ARCHIVE_VERSION;
    salt.copy(header, 5);
    iv.copy(header, 5 + SALT_LENGTH);
    authTag.copy(header, 5 + SALT_LENGTH + IV_LENGTH);
    const info = {
        algorithm: 'aes-256-gcm',
        kdf: 'scrypt',
        kdfParams: { ...SCRYPT_PARAMS },
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        version: ARCHIVE_VERSION,
    };
    return { blob: Buffer.concat([header, encrypted]), info, kdf: { salt, iv } };
}
/** 容器版解密：用「先验真实参数」校验密码并解密（—— 调用方必须先用 verifyEncryptedBlob 拿到 info/kdf） */
export async function decryptArchive(blob, info, kdfParam, password) {
    if (blob.length < HEADER_LENGTH) {
        throw new SecurityError('TAMPERED', '加密备份容器体积过小（截断或损坏）');
    }
    const magic = Buffer.from(blob.subarray(0, 4)).toString('ascii');
    if (magic !== ARCHIVE_MAGIC) {
        throw new SecurityError('UNSUPPORTED_FORMAT', `未知文件格式 magic "${magic}"，不是本插件产物`);
    }
    const version = blob[4];
    if (version !== ARCHIVE_VERSION) {
        throw new SecurityError('UNSUPPORTED_FORMAT', `不支持的加密备份版本 ${version}`);
    }
    const blobSalt = Buffer.from(blob.subarray(5, 5 + SALT_LENGTH));
    const blobIv = Buffer.from(blob.subarray(5 + SALT_LENGTH, 5 + SALT_LENGTH + IV_LENGTH));
    const blobTag = Buffer.from(blob.subarray(5 + SALT_LENGTH + IV_LENGTH, HEADER_LENGTH));
    const paramSalt = Buffer.isBuffer(kdfParam.salt) ? kdfParam.salt : Buffer.from(kdfParam.salt);
    const paramIv = Buffer.isBuffer(kdfParam.iv) ? kdfParam.iv : Buffer.from(kdfParam.iv);
    // 与此时真实的随机参数对齐（参数来自 verify 阶段读取，防调用方换参数）
    if (!blobSalt.equals(paramSalt) ||
        !blobIv.equals(paramIv)) {
        throw new SecurityError('TAMPERED', '加密备份参数不一致（可能被篡改）');
    }
    let key;
    try {
        key = await deriveKey(password, blobSalt, info.kdfParams);
    }
    catch (err) {
        throw new SecurityError('BAD_PASSWORD', `密钥派生失败: ${err instanceof Error ? err.message : String(err)}`);
    }
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, blobIv);
    decipher.setAuthTag(blobTag);
    try {
        return Buffer.concat([
            decipher.update(blob.subarray(HEADER_LENGTH)),
            decipher.final(),
        ]);
    }
    catch {
        throw new SecurityError('BAD_PASSWORD', '解密认证失败：密码错误或密文被篡改');
    }
}
/**
 * 校验加密备份容器并验证密码（只读，零解密返回内容）。
 * - 容器不合法（非 DCA1 / 截断 / 参数异常）→ valid=false + code
 * - 密码正确 → ok=true + 返回随机参数（后续 decryptArchive 用之）
 * - 密码错误 → ok=false + code=BAD_PASSWORD
 */
export async function verifyEncryptedBlob(blob, password) {
    if (blob.length < HEADER_LENGTH) {
        return { valid: false, ok: false, info: null, kdf: null, code: 'TAMPERED' };
    }
    const magic = Buffer.from(blob.subarray(0, 4)).toString('ascii');
    if (magic !== ARCHIVE_MAGIC) {
        return { valid: false, ok: false, info: null, kdf: null, code: 'UNSUPPORTED_FORMAT' };
    }
    const version = blob[4];
    if (version !== ARCHIVE_VERSION) {
        return { valid: false, ok: false, info: null, kdf: null, code: 'UNSUPPORTED_FORMAT' };
    }
    const salt = Buffer.from(blob.subarray(5, 5 + SALT_LENGTH));
    const iv = Buffer.from(blob.subarray(5 + SALT_LENGTH, 5 + SALT_LENGTH + IV_LENGTH));
    const tag = Buffer.from(blob.subarray(5 + SALT_LENGTH + IV_LENGTH, HEADER_LENGTH));
    const info = {
        algorithm: 'aes-256-gcm',
        kdf: 'scrypt',
        kdfParams: { ...SCRYPT_PARAMS },
        salt: salt.toString('base64'),
        iv: iv.toString('base64'),
        authTag: tag.toString('base64'),
        version: ARCHIVE_VERSION,
    };
    let key;
    try {
        key = await deriveKey(password, salt, info.kdfParams);
    }
    catch (err) {
        return { valid: true, ok: false, info, kdf: { salt, iv }, code: 'BAD_PASSWORD' };
    }
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    try {
        decipher.update(blob.subarray(HEADER_LENGTH));
        decipher.final();
    }
    catch {
        return { valid: true, ok: false, info, kdf: { salt, iv }, code: 'BAD_PASSWORD' };
    }
    return { valid: true, ok: true, info, kdf: { salt, iv }, code: null };
}
//# sourceMappingURL=encryption.js.map