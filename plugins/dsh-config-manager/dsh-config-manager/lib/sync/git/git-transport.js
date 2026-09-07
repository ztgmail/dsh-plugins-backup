/**
 * m-git-channel：Git 私有仓库通道（SyncTransport 的 git 实现）。
 *
 * 设计：
 * - 明文快照以「散文件目录」提交到 git 仓库：工作副本 <workDir>/snapshots/<id>/ 即 t2 layout 布局
 *   （manifest.json + 平铺 JSON 分区 + 文件类分区目录），每次 sync 一次 commit + push；
 * - 加密快照（EncryptedSections 密文载荷，无法平铺为明文 JSON 分区）走「密文单文件」布局：
 *   整个快照 JSON 提交到 <workDir>/snapshots-encrypted/<id>.json（远端已存密文；
 *   本地工作副本即远端镜像，不产生额外明文审计副本）。
 * - 命令执行走 node:child_process execFile（promise 封装，数组参数无 shell 注入），
 *   始终使用系统 PATH 中的 git（固定命令 'git'），可注入 exec 便于测试。
 * - 认证：token 仅从注入的 credentials provider 读取（每次网络操作时 getToken()），
 *   经 git credential helper（store --file=<临时文件>）传给 git —— token 不进入 argv、
 *   不进入 repoUrl、不写入任何同步内容/commit message/日志；临时凭据文件用后即删。
 * - 私有仓库判定：checkIsPrivate() 先匿名 ls-remote（成功=公开），失败再用凭据探测
 *   （成功=私有），isPrivateHint 缓存最近结果供 UI 提示（私有仓库为推荐使用场景）。
 * - 契约：同 id 重复 upload = 覆盖（幂等友好：内容无变化时不产生 commit）；download 不存在抛错；
 *   delete 不存在视为成功。
 */
import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { createSnapshotFs, joinFs } from "../fs.js";
import { readSnapshotFromDir, SNAPSHOT_KEEP_CONTENT, SNAPSHOT_KEEP_FILE, SNAPSHOT_MANIFEST_FILE, writeSnapshotToDir } from "../layout.js";
import { deserializeSnapshot, serializeSnapshot } from "../snapshot-json.js";
import { computeSnapshotMeta, isEncryptedSections } from "../transport.js";
import { parseJsonSafe } from "../../utils/json.js";
import { atomicWriteFile } from "../../utils/atomic-write.js";
import { SECTION_FILE_PREFIXES } from "../../schema/config.js";
import { zhMsg } from "../../core/messages.js";
const execFileAsync = promisify(execFile);
export class GitTransportError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GitTransportError';
    }
}
const SNAPSHOTS_REL = 'snapshots';
/** 加密快照的「密文单文件」目录：整个快照 JSON（含密文载荷）以 <id>.json 提交。
 *  加密快照不写散文件目录（密文无法平铺为明文 JSON 分区；远端已存密文）。 */
const SNAPSHOTS_ENCRYPTED_REL = 'snapshots-encrypted';
const DEFAULT_TIMEOUT_MS = 60_000;
const DEFAULT_AUTHOR = { name: 'DSH Config Sync', email: 'sync@dsh.local' };
const DEFAULT_CREDENTIAL_USERNAME = 'oauth2';
/** 快照 id 安全字符集：字母数字开头，仅 . _ -；防路径穿越与 commit message 注入 */
const SAFE_ID_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;
const defaultExec = async (cmd, args, opts) => {
    try {
        const { stdout, stderr } = await execFileAsync(cmd, args, {
            cwd: opts.cwd,
            timeout: opts.timeoutMs,
            maxBuffer: 16 * 1024 * 1024,
            windowsHide: true,
            encoding: 'utf8',
        });
        return { stdout: String(stdout), stderr: String(stderr), code: 0 };
    }
    catch (err) {
        const e = err;
        return {
            stdout: String(e.stdout ?? ''),
            stderr: String(e.stderr ?? (err instanceof Error ? err.message : String(err))),
            code: typeof e.code === 'number' ? e.code : 1,
        };
    }
};
/** git config 值里的路径转义：含空白/引号时用引号包裹（Windows 路径转正斜杠） */
function quoteGitValue(value) {
    return /[\s"']/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;
}
/** 实现 SyncTransport 的 git 通道。所有操作前 ensureRepo() 保证工作副本就绪，网络命令带凭据。 */
export class GitTransport {
    type = 'git';
    o;
    repoReady = false;
    privateHint = null;
    msg;
    constructor(options) {
        if (typeof options.repoUrl !== 'string' || options.repoUrl.length === 0) {
            throw new GitTransportError(zhMsg('sync.git.repoUrlRequired'));
        }
        if (typeof options.workDir !== 'string' || options.workDir.length === 0) {
            throw new GitTransportError(zhMsg('sync.git.workDirRequired'));
        }
        if (options.credentials === null || typeof options.credentials !== 'object'
            || typeof options.credentials.getToken !== 'function') {
            throw new GitTransportError(zhMsg('sync.git.credentialsRequired'));
        }
        this.msg = options.msg ?? zhMsg;
        this.o = {
            repoUrl: options.repoUrl,
            workDir: options.workDir,
            credentials: options.credentials,
            gitBin: 'git',
            timeoutMs: options.timeoutMs ?? DEFAULT_TIMEOUT_MS,
            exec: options.exec ?? defaultExec,
            author: options.author ?? DEFAULT_AUTHOR,
            credentialUsername: options.credentialUsername ?? DEFAULT_CREDENTIAL_USERNAME,
        };
    }
    /** 最近一次 checkIsPrivate() 的结果；null = 尚未检查 */
    get isPrivateHint() {
        return this.privateHint;
    }
    /** 列出远端已有快照（按 createdAt 升序）。读取工作副本 snapshots/（明文散文件）
     *  与 snapshots-encrypted/（密文单文件）两个目录（先 pull 同步远端）。 */
    async list() {
        await this.ensureRepo();
        await this.pullFromRemote();
        const fsx = createSnapshotFs();
        const metas = [];
        // 明文散文件目录
        const snapsAbs = this.snapshotsDir();
        const names = await fsx.readdir(snapsAbs);
        for (const name of names) {
            if (name === '' || name === '.' || name === '..')
                continue;
            const dirAbs = joinFs(snapsAbs, name);
            if (!(await fsx.isDir(dirAbs)))
                continue;
            const m = await this.readDirManifest(dirAbs);
            if (m === null)
                continue; // 损坏/不完整 → 跳过（防御工作副本污染，不静默失败整体 list）
            metas.push({
                id: m.id,
                createdAt: m.createdAt,
                sections: m.sectionHashes,
                manifest: m.manifest,
            });
        }
        // 密文单文件目录（snapshots-encrypted/<id>.json）：整体 JSON 快照
        const encAbs = this.encryptedSnapshotsDir();
        const encNames = await fsx.readdir(encAbs);
        for (const name of encNames) {
            if (!name.endsWith('.json'))
                continue;
            const id = name.slice(0, -'.json'.length);
            if (id === '' || id === '.' || id === '..' || id.includes('/') || id.includes('\\'))
                continue;
            const snap = await this.readEncryptedSnapshotFile(joinFs(encAbs, name));
            if (snap === null)
                continue; // 损坏/解析失败 → 跳过
            metas.push({ id: snap.id, createdAt: snap.createdAt, sections: {}, manifest: snap.manifest });
        }
        metas.sort((a, b) => (a.createdAt < b.createdAt ? -1 : a.createdAt > b.createdAt ? 1 : 0));
        return metas;
    }
    /**
     * 上传快照：写散文件目录（明文）或密文单文件（加密）→ add → commit → push；
     * 同 id 覆盖；内容无变化时幂等（不产生 commit）。
     * 双形态互斥：同 id 从一种形态切到另一种时先清掉旧形态残留，保证工作副本/远端布局自洽。
     */
    async upload(snapshot) {
        this.assertSafeId(snapshot.id);
        await this.ensureRepo();
        await this.pullFromRemote();
        const fsx = createSnapshotFs();
        const encrypted = isEncryptedSections(snapshot.sections);
        // 覆盖判定：任一种旧形态（散文件目录 / 密文单文件）已存在 → update
        const existed = await fsx.exists(this.snapshotDir(snapshot.id))
            || await fsx.exists(this.encryptedSnapshotFile(snapshot.id));
        let rel;
        if (encrypted) {
            // 密文单文件：整个快照 JSON（sections 为 EncryptedSections，纯字符串 JSON 安全）
            const file = this.encryptedSnapshotFile(snapshot.id);
            await fsx.remove(file); // 覆盖语义：先删旧文件
            await fsx.mkdir(this.encryptedSnapshotsDir());
            await fsx.writeFile(file, new TextEncoder().encode(serializeSnapshot(snapshot)));
            // 同 id 旧散文件目录残留 → 一并清理（形态切换不残留）
            await fsx.remove(this.snapshotDir(snapshot.id));
            rel = `${SNAPSHOTS_ENCRYPTED_REL}/${snapshot.id}.json`;
        }
        else {
            const dir = this.snapshotDir(snapshot.id);
            if (await fsx.exists(dir))
                await fsx.remove(dir); // 覆盖语义：先清旧目录，避免残留旧文件
            await writeSnapshotToDir(snapshot, dir, fsx);
            // git 不跟踪空目录：为空文件类分区目录写占位文件，保证远端保留目录。
            // 占位文件不参与 manifest.sectionHashes（基于传入数据计算）；读回时按名+内容过滤。
            // 否则空分区（如未安装 skills）上传后目录在远端丢失，B 机全新 clone 下载即失败。
            const plain = snapshot.sections;
            for (const [sid, prefix] of Object.entries(SECTION_FILE_PREFIXES)) {
                const data = plain[sid];
                if (data === undefined || data.files.length > 0)
                    continue;
                // joinFs 只接受两个参数，占位路径拼进 prefix 一起传
                await fsx.writeFile(joinFs(dir, `${prefix}${SNAPSHOT_KEEP_FILE}`), new TextEncoder().encode(SNAPSHOT_KEEP_CONTENT));
            }
            // 同 id 旧密文单文件残留 → 一并清理（形态切换不残留）
            await fsx.remove(this.encryptedSnapshotFile(snapshot.id));
            rel = `${SNAPSHOTS_REL}/${snapshot.id}`;
        }
        await this.runGit(['add', '--', rel]);
        const diff = await this.runGit(['diff', '--cached', '--quiet'], { allowNonZero: true });
        if (diff.code !== 0) {
            const verb = existed ? 'update' : 'add';
            await this.runGit(['commit', '-m', `sync: ${verb} snapshot ${snapshot.id}`]);
            await this.runGit(['push', '-u', 'origin', 'HEAD'], { withCredential: true });
        }
        return computeSnapshotMeta(snapshot);
    }
    /** 下载快照完整载荷。明文 → 读回散文件目录；加密 → 读回密文单文件。不存在的 id 必须抛错（契约）。 */
    async download(id) {
        this.assertSafeId(id);
        await this.ensureRepo();
        await this.pullFromRemote();
        const fsx = createSnapshotFs();
        // 优先散文件目录（明文布局）；其次密文单文件（加密布局）
        // missingFileDir='empty'：git 不跟踪空目录 → 目录缺失 = 空文件分区（非损坏；
        // 提交原子性保证非空目录不会缺失），兼容旧版插件上传的无占位快照
        if (await fsx.isDir(this.snapshotDir(id))) {
            return readSnapshotFromDir(this.snapshotDir(id), fsx, { missingFileDir: 'empty' });
        }
        const encFile = this.encryptedSnapshotFile(id);
        if (await fsx.exists(encFile)) {
            const raw = Buffer.from(await fsx.readFile(encFile)).toString('utf8');
            try {
                return deserializeSnapshot(raw);
            }
            catch (err) {
                throw new GitTransportError(this.msg('sync.git.snapshotCorrupt', {
                    id, dir: encFile, err: this.mask(String(err?.message ?? ''), null),
                }));
            }
        }
        throw new GitTransportError(this.msg('sync.git.snapshotMissing', { id, dir: this.snapshotDir(id) }));
    }
    /** 删除远端快照（明文散文件目录或密文单文件；不存在视为成功，契约）。 */
    async delete(id) {
        this.assertSafeId(id);
        await this.ensureRepo();
        await this.pullFromRemote();
        const fsx = createSnapshotFs();
        const plainDir = this.snapshotDir(id);
        const encFile = this.encryptedSnapshotFile(id);
        const plainExists = await fsx.exists(plainDir);
        const encExists = await fsx.exists(encFile);
        if (!plainExists && !encExists)
            return; // 不存在视为成功
        let rel;
        if (plainExists) {
            await fsx.remove(plainDir);
            rel = `${SNAPSHOTS_REL}/${id}`;
        }
        else {
            await fsx.remove(encFile);
            rel = `${SNAPSHOTS_ENCRYPTED_REL}/${id}.json`;
        }
        await this.runGit(['add', '-A', '--', rel]);
        const diff = await this.runGit(['diff', '--cached', '--quiet'], { allowNonZero: true });
        if (diff.code !== 0) {
            await this.runGit(['commit', '-m', `sync: delete snapshot ${id}`]);
            await this.runGit(['push', '-u', 'origin', 'HEAD'], { withCredential: true });
        }
    }
    /**
     * 私有仓库可见性探测（结果缓存于 isPrivateHint）：
     * 匿名 ls-remote 成功 → 公开；匿名失败 + 凭据探测成功 → 私有；两者都失败 → 抛错。
     * UI 层可用 isPrivateHint 提示「私有仓库推荐」；公开仓库也可用（内容需自行评估）。
     */
    async checkIsPrivate() {
        if (this.privateHint !== null)
            return this.privateHint;
        const anon = await this.runGit(['ls-remote', this.o.repoUrl], { allowNonZero: true, cwd: undefined });
        if (anon.code === 0) {
            this.privateHint = false;
            return false;
        }
        const authed = await this.runGit(['ls-remote', this.o.repoUrl], { allowNonZero: true, cwd: undefined, withCredential: true });
        if (authed.code === 0) {
            this.privateHint = true;
            return true;
        }
        throw new GitTransportError(this.msg('sync.git.repoUnreachable', { url: this.mask(this.o.repoUrl, null) }));
    }
    /* ---------------- 内部实现 ---------------- */
    async ensureRepo() {
        if (this.repoReady)
            return;
        const fsx = createSnapshotFs();
        await fsx.mkdir(this.o.workDir); // 不存在则创建
        if (await fsx.exists(path.join(this.o.workDir, '.git'))) {
            this.repoReady = true;
            return;
        }
        const entries = await fsx.readdir(this.o.workDir);
        if (entries.length > 0) {
            throw new GitTransportError(this.msg('sync.git.workDirNotRepo', { dir: this.o.workDir }));
        }
        await this.runGit(['clone', this.o.repoUrl, '.'], { cwd: this.o.workDir, withCredential: true });
        // 仓库级提交身份（写入远端历史，可经 author 选项覆盖；不改全局配置）
        await this.runGit(['config', 'user.name', this.o.author.name]);
        await this.runGit(['config', 'user.email', this.o.author.email]);
        this.repoReady = true;
    }
    /** pull --ff-only 同步远端；无本地提交（全新仓库）或无 upstream 时静默跳过 */
    async pullFromRemote() {
        const head = await this.runGit(['rev-parse', '--verify', '--quiet', 'HEAD'], { allowNonZero: true });
        if (head.code !== 0)
            return; // 无本地提交 → 无可 pull
        const res = await this.runGit(['pull', '--ff-only'], { withCredential: true, allowNonZero: true });
        if (res.code === 0)
            return;
        if (/no tracking information/i.test(res.stderr))
            return; // 无 upstream（初始状态）→ 跳过
        throw new GitTransportError(this.msg('sync.git.pullFailed', { err: this.mask(res.stderr, await this.readTokenOnce()) }));
    }
    /** 执行 git 命令；withCredential=true 时注入 credential helper（token 不进 argv），失败时错误消息脱敏 */
    async runGit(args, opts = {}) {
        const cwd = opts.cwd === undefined ? this.o.workDir : opts.cwd;
        let extra = [];
        let token = null;
        let cleanup = null;
        if (opts.withCredential) {
            const cred = await this.buildCredentialArgs();
            extra = cred.extraArgs;
            token = cred.token;
            cleanup = cred.cleanup;
        }
        try {
            const result = await this.o.exec(this.o.gitBin, [...extra, ...args], { cwd, timeoutMs: this.o.timeoutMs });
            if (result.code !== 0 && !opts.allowNonZero) {
                throw new GitTransportError(this.msg('sync.git.cmdFailed', { args: args.join(' '), code: String(result.code), err: this.mask(result.stderr, token) }));
            }
            return result;
        }
        finally {
            if (cleanup)
                await cleanup();
        }
    }
    /**
     * 为网络命令构造 credential helper 参数：
     * 仅 http(s) 远端需要 token；本地路径 / ssh 走 git 原生认证（密钥），不调用 provider。
     * token 写入 os.tmpdir() 下临时 store 文件（权限 0600），命令后立即删除 —— 永不落工作副本/远端。
     */
    async buildCredentialArgs() {
        if (!/^https?:\/\//i.test(this.o.repoUrl)) {
            return { extraArgs: [], token: '', cleanup: async () => { } };
        }
        const token = await this.o.credentials.getToken();
        const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dsh-git-cred-'));
        const credFile = path.join(tmpDir, 'credential');
        const host = this.repoHost();
        const fileArg = quoteGitValue(credFile.replace(/\\/g, '/'));
        await atomicWriteFile(credFile, `https://${this.o.credentialUsername}:${token}@${host}\n`, { mode: 0o600, symlink: 'reject' });
        return {
            extraArgs: ['-c', 'credential.helper=', '-c', `credential.helper=store --file=${fileArg}`],
            token,
            cleanup: async () => { await fs.rm(tmpDir, { recursive: true, force: true }); },
        };
    }
    /** 从 repoUrl 提取 credential 匹配用的 host[:port] */
    repoHost() {
        try {
            const u = new URL(this.o.repoUrl);
            return u.port ? `${u.hostname}:${u.port}` : u.hostname;
        }
        catch {
            throw new GitTransportError(this.msg('sync.git.repoUrlInvalid', { url: this.o.repoUrl }));
        }
    }
    /** 读取一次 token（错误消息脱敏用）；非 http(s) 场景返回空 */
    async readTokenOnce() {
        if (!/^https?:\/\//i.test(this.o.repoUrl))
            return null;
        try {
            return await this.o.credentials.getToken();
        }
        catch {
            return null;
        }
    }
    /** 错误/日志脱敏：token（原文与 URL 编码两种形态）与 repoUrl 一律替换 */
    mask(text, token) {
        let out = text.split(this.o.repoUrl).join('[REPO_URL]');
        if (token && token.length >= 4) {
            out = out.split(token).join('[REDACTED]').split(encodeURIComponent(token)).join('[REDACTED]');
        }
        return out;
    }
    assertSafeId(id) {
        if (typeof id !== 'string' || !SAFE_ID_RE.test(id)) {
            throw new GitTransportError(this.msg('sync.git.invalidSnapshotId', { id: JSON.stringify(id) }));
        }
    }
    snapshotDir(id) {
        return joinFs(this.snapshotsDir(), id);
    }
    snapshotsDir() {
        return joinFs(this.o.workDir, SNAPSHOTS_REL);
    }
    /** 加密快照密文单文件目录（<workDir>/snapshots-encrypted/） */
    encryptedSnapshotsDir() {
        return joinFs(this.o.workDir, SNAPSHOTS_ENCRYPTED_REL);
    }
    /** 加密快照密文单文件路径（<id>.json） */
    encryptedSnapshotFile(id) {
        return joinFs(this.encryptedSnapshotsDir(), `${id}.json`);
    }
    /** 读密文单文件快照（解析失败 → null，调用方跳过，不静默失败整体 list）。 */
    async readEncryptedSnapshotFile(file) {
        try {
            const raw = Buffer.from(await createSnapshotFs().readFile(file)).toString('utf8');
            return deserializeSnapshot(raw);
        }
        catch {
            return null;
        }
    }
    /** 读快照目录 manifest.json（结构不合法 → null，调用方跳过） */
    async readDirManifest(dir) {
        const fsx = createSnapshotFs();
        try {
            const abs = joinFs(dir, SNAPSHOT_MANIFEST_FILE);
            if (!(await fsx.exists(abs)))
                return null;
            const raw = Buffer.from(await fsx.readFile(abs)).toString('utf8');
            const parsed = parseJsonSafe(raw);
            if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed))
                return null;
            const m = parsed;
            if (typeof m['id'] !== 'string' || typeof m['createdAt'] !== 'string'
                || m['manifest'] === null || typeof m['manifest'] !== 'object'
                || m['sectionHashes'] === null || typeof m['sectionHashes'] !== 'object') {
                return null;
            }
            return parsed;
        }
        catch {
            return null;
        }
    }
}
//# sourceMappingURL=git-transport.js.map