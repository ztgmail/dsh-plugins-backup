import type { EncryptionInfo, SectionData, SectionId } from '../schema/types.ts';
import type { EncryptedSections } from './transport.ts';
/**
 * 加密整个明文 sections Record → 密文载荷（info 进 manifest 非秘密参数；data 为 base64 密文）。
 * 序列化经 snapshot-json：文件类分区字节以 base64 进入载荷，解密后还原 Uint8Array
 * （JSON 无法直传 TypedArray，否则解密回来的文件分区被破坏成普通对象）。
 */
export declare function encryptSectionsPayload(sections: Partial<Record<SectionId, SectionData>>, password: string): Promise<EncryptedSections>;
/** 解密密文载荷 → 明文 sections Record（密码错误 / 密文被篡改 → SecurityError）。 */
export declare function decryptSectionsPayload(payload: EncryptedSections['encrypted'], password: string): Promise<Partial<Record<SectionId, SectionData>>>;
/** 从加密载荷提取非秘密的加密参数（展示/诊断用；不含密码）。 */
export declare function encryptionInfoOf(payload: EncryptedSections['encrypted']): EncryptionInfo;
