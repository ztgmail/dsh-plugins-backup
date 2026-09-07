/**
 * Reconciler（Phase 3：startup reconciliation）。
 *
 * 职责：扫描 active journals → parse/schema 校验（corrupt 隔离）→ 验 environment fingerprint
 * → 验 Journal→Lock 绑定 → 验快照 → 验 step 指纹 → 外部探测 → 选择推荐 recovery outcome
 * → 执行（需用户确认的破坏性动作才执行）→ recovery-history → 幂等。
 *
 * **Reconciler 不拥有 Environment Lock primitive 实现** —— 通过 Coordinator/port 使用
 * （release、active≤1、recover 显式流程由宿主/Coordinator 编排）。
 *
 * **Startup（Rev 3 P1-NEW-2）不自动 recover stale lock**：
 *  - 若发现 stale lock + incomplete journal → RECOVERY_REQUIRED / SAFE MODE，不自动 recoverStaleLock；
 *  - 用户显式确认后才 prove stale → recover → acquire → reconcile。
 */
import { JournalStore, isTerminalState, transitionJournalState, JOURNAL_SCHEMA_VERSION, } from "./journal.js";
// ---------- Reconcile ----------
/**
 * 分析 active/ 下的所有 journal，返回每个 op 的决策 + 是否需 SAFE MODE。
 * 只读（除 corrupt quarantine 与 terminal organize / recovery-history 外，不做 data mutation）。
 */
export async function reconcileActive(store, hooks, env, opts = {}) {
    const decisions = [];
    const unresolved = [];
    let safeModeRequired = false;
    const activeIds = await store.scanActive();
    for (const operationId of activeIds) {
        const outcome = await reconcileOne(store, hooks, env, opts, operationId);
        decisions.push(outcome.decision);
        if (outcome.safeMode)
            safeModeRequired = true;
        if (outcome.unresolved)
            unresolved.push(operationId);
    }
    return { decisions, safeModeRequired, unresolved };
}
async function reconcileOne(store, hooks, env, opts, operationId) {
    const j = await store.loadActive(operationId);
    if (j === null) {
        // 存在但 parse/校验失败 → corrupt → quarantine
        const reason = `journal ${operationId} 无法解析或 schema 非法（隔离处理）`;
        if (opts.autoQuarantine !== false) {
            try {
                await store.quarantine(operationId, reason);
            }
            catch { /* 隔离失败由上层诊断 */ }
        }
        await store.writeSafeMode(true).catch(() => undefined);
        return { decision: { operationId, kind: 'corrupt', reason, snapshotId: null }, safeMode: true, unresolved: true };
    }
    // live owner 检查
    if (await env.isLiveOwner(j)) {
        return { decision: { operationId, kind: 'live', reason: 'owner 存活，live operation 进行中', snapshotId: j.snapshotId }, safeMode: false, unresolved: false };
    }
    // P1-A：ownership binding 强制校验（显式 recovery 捕获的 crashed ownership 证据）。
    // journal.ownerInstanceId/lockId 必须匹配期望的 crashed ownership instanceId，否则不作 trusted 恢复。
    if (env.expectedOwnershipInstanceId !== undefined && env.expectedOwnershipInstanceId !== '') {
        const bindingOk = j.ownerInstanceId === env.expectedOwnershipInstanceId
            && j.lockId === env.expectedOwnershipInstanceId; // lockId = 同 epoch identity（ownerInstanceId）
        if (!bindingOk) {
            const reason = `ownership binding 不匹配（journal.ownerInstanceId/lockId 非 crashed ownership ${env.expectedOwnershipInstanceId}），不作 trusted 恢复`;
            await store.writeSafeMode(true).catch(() => undefined);
            await store.appendRecoveryHistory('binding-mismatch', { operationId, at: new Date().toISOString(), reason }).catch(() => undefined);
            return { decision: { operationId, kind: 'needs-attention', reason, snapshotId: j.snapshotId }, safeMode: true, unresolved: true };
        }
    }
    // env fingerprint
    if (env.environmentFingerprint && j.environmentFingerprint && env.environmentFingerprint !== j.environmentFingerprint) {
        const reason = `environment fingerprint 不匹配（跨机/环境变化），不自动恢复`;
        await store.writeSafeMode(true).catch(() => undefined);
        return { decision: { operationId, kind: 'env-mismatch', reason, snapshotId: j.snapshotId }, safeMode: true, unresolved: true };
    }
    // terminal 遗留 active → 规整到 completed（无实质 recovery）
    if (isTerminalState(j.state)) {
        if (j.state === 'NEEDS_ATTENTION') {
            // NEEDS_ATTENTION 是「待用户确认」状态，保持 active 可见（不静默规整），SAFE MODE
            await store.writeSafeMode(true).catch(() => undefined);
            return { decision: { operationId, kind: 'needs-attention', reason: 'NEEDS_ATTENTION 待用户确认', snapshotId: j.snapshotId }, safeMode: true, unresolved: true };
        }
        // COMMITTED / ROLLED_BACK / RECOVERED 遗留 → 规整
        if (opts.organizeTerminal !== false) {
            try {
                await store.moveToCompleted(operationId);
            }
            catch { /* move 失败不影响 */ }
        }
        return { decision: { operationId, kind: 'organized', reason: `terminal(${j.state}) journal 规整到 completed`, snapshotId: j.snapshotId }, safeMode: false, unresolved: false };
    }
    // 回滚进行中（ROLLING_BACK）或已部分补偿（entryDone 非空）：**绝不判 RECOVERED**
    // （P0-B：崩溃在回滚中 = 半回滚态，判 recovered 会把破坏状态误报为成功）。
    if (j.state === 'ROLLING_BACK' || Object.keys(j.rollback.entryDone ?? {}).length > 0) {
        const reason = `回滚中断（${j.state === 'ROLLING_BACK' ? 'ROLLING_BACK' : `entryDone ${Object.keys(j.rollback.entryDone).join(',')}`}），需显式续跑回滚（用户确认）`;
        await store.writeSafeMode(true).catch(() => undefined);
        await store.appendRecoveryHistory('rollback-interrupted', { operationId, at: new Date().toISOString(), reason }).catch(() => undefined);
        return { decision: { operationId, kind: 'rollback-continue', reason, snapshotId: j.snapshotId }, safeMode: true, unresolved: true };
    }
    // §6.5 recovery hard gate（Reviewer A P0 + 第三轮 P2 收紧）：
    // 置于 entryDone/回滚中断检查（:180）之后、step 指纹判定（:187）之前。
    // RECOVERING +（无 recoveryVerification 或 verdict 非 MATCH/PARTIAL_MATCH）→ needs-attention，
    // **绝不自动判 RECOVERED**（VERIFIED 不变量：恢复未验证不得视为完成）。
    // 只有 recoveryVerification.verdict === 'MATCH' | 'PARTIAL_MATCH' 的 RECOVERING journal
    // 才可转 ROLLED_BACK / RECOVERED（该终态迁移由 verify 路由以单次原子 journal update 完成）。
    if (j.state === 'RECOVERING') {
        const v = j.recoveryVerification;
        const verified = v !== undefined && (v.verdict === 'MATCH' || v.verdict === 'PARTIAL_MATCH');
        if (!verified) {
            const reason = 'RECOVERING 且 recovery 未验证（无 recoveryVerification 或 verdict 非 MATCH/PARTIAL_MATCH），绝不自动 RECOVERED';
            await store.writeSafeMode(true).catch(() => undefined);
            await store.update(operationId, (cur) => {
                let next = transitionJournalState(cur, 'NEEDS_ATTENTION');
                next = { ...next, error: next.error || reason, recovery: { ...next.recovery, reason, attempts: next.recovery.attempts + 1 } };
                return next;
            }).catch(() => undefined);
            await store.appendRecoveryHistory('recovery-unverified', { operationId, at: new Date().toISOString(), reason }).catch(() => undefined);
            return { decision: { operationId, kind: 'needs-attention', reason, snapshotId: j.snapshotId }, safeMode: true, unresolved: true };
        }
    }
    // incomplete：判定 steps
    const stepIds = [...new Set([...j.plannedSteps, ...Object.keys(j.steps)])];
    let anyApplied = false;
    let allDoneConfirmed = true;
    let anyUnprovable = false;
    let anyExternalUnknown = false;
    const details = [];
    for (const stepId of stepIds) {
        const step = j.steps[stepId];
        const plannedExternal = step?.external === true;
        if (step === undefined) {
            // Review D P2：plannedSteps 引用悬空（steps 缺条目）→ 不可证明，绝不能经 noop 判 RECOVERED。
            anyUnprovable = true;
            allDoneConfirmed = false;
            details.push(`planned step ${stepId} 缺少 steps 条目（损坏/篡改 journal）`);
            continue;
        }
        if (plannedExternal) {
            // 外部 step：probe 判定
            const probe = await hooks.probeExternal(step);
            if (probe === 'installed') {
                anyApplied = true;
                continue;
            }
            if (probe === 'not-installed') {
                continue;
            } // 未装，无副作用
            // half-installed / reverse-residue / unknown → 不可证明
            anyExternalUnknown = true;
            anyUnprovable = true;
            allDoneConfirmed = false;
            details.push(`external ${step.kind} ${step.ref}: ${probe}`);
            continue;
        }
        // 本地 step：指纹判定
        if (step.status === 'done') {
            // 即使 done 也重验 afterFp（Windows rename 顺序失效）
            let verdict;
            try {
                verdict = await hooks.verifyStepFingerprint(step);
            }
            catch {
                verdict = 'unable';
            }
            if (verdict === 'after-match') {
                anyApplied = true;
                continue;
            }
            if (verdict === 'before-match') {
                anyApplied = false;
                details.push(`step ${step.ref} 未可靠完成（磁盘==before）`);
                allDoneConfirmed = false;
                anyUnprovable = true;
                continue;
            }
            anyUnprovable = true;
            allDoneConfirmed = false;
            details.push(`step ${step.ref} 指纹 ${verdict}`);
        }
        else {
            // planned/attention/failed → 未完成
            allDoneConfirmed = false;
            if (step.status === 'attention' || step.status === 'failed') {
                anyUnprovable = true;
                details.push(`step ${step.ref} ${step.status}`);
            }
            else { // planned：指纹判定 side effect 是否发生
                let verdict;
                try {
                    verdict = await hooks.verifyStepFingerprint(step);
                }
                catch {
                    verdict = 'unable';
                }
                if (verdict === 'after-match') {
                    anyApplied = true;
                }
                else if (verdict === 'before-match') { /* 未应用，安全 */ }
                else {
                    anyUnprovable = true;
                    anyApplied = anyApplied || verdict === 'none';
                    details.push(`step ${step.ref} ${verdict}`);
                }
            }
        }
    }
    const snapshotExists = await hooks.snapshotExists(j.snapshotId, {
        operationId: j.operationId,
        ownerInstanceId: j.ownerInstanceId,
        environmentFingerprint: j.environmentFingerprint,
    });
    // F20 修复：空 steps（opaque intent journal）不得因 [].every() 真空真而判 RECOVERED。
    // 若 mutation 是否执行无法证明 → NEEDS_ATTENTION；若有 trusted bound snapshot → rollback-recommended。
    if (stepIds.length === 0) {
        // CREATED / SNAPSHOT_CREATED：mutation 尚未开始 → 安全 no-op
        if (j.state === 'CREATED' || j.state === 'SNAPSHOT_CREATED') {
            await store.update(operationId, (cur) => {
                let next = transitionJournalState(cur, 'RECOVERED');
                next = { ...next, recovery: { ...next.recovery, attemptedAt: new Date().toISOString(), outcome: 'RECOVERED', reason: 'no mutation started (empty steps, pre-APPLYING)', attempts: next.recovery.attempts + 1 } };
                return next;
            });
            await store.moveToCompleted(operationId).catch(() => undefined);
            await store.appendRecoveryHistory('noop', { operationId, at: new Date().toISOString(), reason: 'no mutation started' }).catch(() => undefined);
            return { decision: { operationId, kind: 'noop', reason: 'mutation 未开始，安全完成', snapshotId: j.snapshotId }, safeMode: false, unresolved: false };
        }
        // APPLYING（或其它非 terminal）：mutation 可能已开始，无法证明
        if (j.snapshotId !== null && snapshotExists) {
            // 有 trusted bound snapshot → rollback-recommended（需用户确认）
            await store.writeSafeMode(true).catch(() => undefined);
            const reason = 'opaque APPLYING（空 steps）且 mutation 可能已开始，有 trusted snapshot 可回滚（需用户确认）';
            await store.update(operationId, (cur) => {
                let next = transitionJournalState(cur, 'NEEDS_ATTENTION');
                next = { ...next, error: next.error || reason, recovery: { ...next.recovery, reason, attempts: next.recovery.attempts + 1 } };
                return next;
            }).catch(() => undefined);
            await store.appendRecoveryHistory('needs-attention', { operationId, at: new Date().toISOString(), reason }).catch(() => undefined);
            return { decision: { operationId, kind: 'rollback-recommended', reason, snapshotId: j.snapshotId }, safeMode: true, unresolved: true };
        }
        // 无 trusted snapshot → NEEDS_ATTENTION（SAFE MODE）
        await store.writeSafeMode(true).catch(() => undefined);
        const reason = 'opaque APPLYING（空 steps）且 mutation 可能已开始，无 trusted snapshot 可回滚';
        await store.update(operationId, (cur) => {
            let next = transitionJournalState(cur, 'NEEDS_ATTENTION');
            next = { ...next, error: next.error || reason, recovery: { ...next.recovery, reason, attempts: next.recovery.attempts + 1 } };
            return next;
        }).catch(() => undefined);
        await store.appendRecoveryHistory('needs-attention', { operationId, at: new Date().toISOString(), reason }).catch(() => undefined);
        return { decision: { operationId, kind: 'needs-attention', reason, snapshotId: j.snapshotId }, safeMode: true, unresolved: true };
    }
    // 决策
    if (allDoneConfirmed && !anyUnprovable) {
        // 所有 step 已 prove done → resume（RECOVERED），不重做
        await store.update(operationId, (cur) => {
            let next = transitionJournalState(cur, 'RECOVERED');
            next = { ...next, recovery: { ...next.recovery, attemptedAt: new Date().toISOString(), outcome: 'RECOVERED', reason: 'all steps confirmed done', attempts: next.recovery.attempts + 1 } };
            return next;
        });
        await store.moveToCompleted(operationId).catch(() => undefined);
        await store.appendRecoveryHistory('recovered', { operationId, at: new Date().toISOString(), reason: 'all steps proven done' }).catch(() => undefined);
        return { decision: { operationId, kind: 'recovered', reason: 'all steps proven applied', snapshotId: j.snapshotId }, safeMode: false, unresolved: false };
    }
    if (!anyApplied && !anyUnprovable) {
        // 无任何 step 应用（全 beforeFp / all planned）＋ 无外部/不可指纹 → no-op 安全丢弃
        await store.update(operationId, (cur) => {
            let next = transitionJournalState(cur, 'RECOVERED');
            next = { ...next, recovery: { ...next.recovery, attemptedAt: new Date().toISOString(), outcome: 'RECOVERED', reason: 'no step applied', attempts: next.recovery.attempts + 1 } };
            return next;
        });
        await store.moveToCompleted(operationId).catch(() => undefined);
        await store.appendRecoveryHistory('noop', { operationId, at: new Date().toISOString(), reason: 'no step applied' }).catch(() => undefined);
        return { decision: { operationId, kind: 'noop', reason: '无副作用可恢复，安全完成', snapshotId: j.snapshotId }, safeMode: false, unresolved: false };
    }
    if (anyUnprovable || anyExternalUnknown || !snapshotExists) {
        // 不可证明 / 外部未知 / 快照缺失 → NEEDS_ATTENTION（SAFE MODE）
        await store.writeSafeMode(true).catch(() => undefined);
        const reason = `不可证明步骤: ${details.join('; ') || '外部副作用未知'}` + (snapshotExists ? '' : '；快照缺失');
        await store.update(operationId, (cur) => {
            let next = transitionJournalState(cur, 'NEEDS_ATTENTION');
            next = { ...next, error: next.error || reason, recovery: { ...next.recovery, reason, attempts: next.recovery.attempts + 1 } };
            return next;
        }).catch(() => undefined);
        await store.appendRecoveryHistory('needs-attention', { operationId, at: new Date().toISOString(), reason }).catch(() => undefined);
        return { decision: { operationId, kind: 'needs-attention', reason, snapshotId: j.snapshotId }, safeMode: true, unresolved: true };
    }
    // 快照有效 + 已应用部分 + 无不可证明 → rollback 可安全执行（需用户确认）
    await store.writeSafeMode(true).catch(() => undefined);
    const reason = '部分 step 已应用，可安全回滚（需用户确认）';
    return { decision: { operationId, kind: 'rollback-recommended', reason, snapshotId: j.snapshotId }, safeMode: true, unresolved: true };
}
export async function executeRecovery(store, input, userConfirmed) {
    const j = await store.loadActive(input.operationId);
    if (j === null)
        return 'failed'; // 不再 active（已处理/隔离）
    if (input.action === 'resume') {
        // resume 不重做已完成副作用：标记 RECOVERED + move
        await store.update(input.operationId, (cur) => {
            let next = cur.state === 'RECOVERED' ? cur : transitionJournalState(cur, 'RECOVERED');
            next = { ...next, recovery: { ...next.recovery, attemptedAt: new Date().toISOString(), outcome: 'RECOVERED', reason: 'user resume' } };
            return next;
        });
        await store.moveToCompleted(input.operationId).catch(() => undefined);
        return 'done';
    }
    if (input.action === 'rollback') {
        if (!userConfirmed)
            return 'needs-confirmation'; // 普通 metadata 不是 destructive 授权
        if (input.snapshotId === null)
            return 'failed'; // 无有效快照不可回滚
        // §11.2：execute 仅接受 NEEDS_ATTENTION（confirm 后）或 RECOVERING（retry 续跑）；terminal 拒绝 replay。
        if (j.state !== 'NEEDS_ATTENTION' && j.state !== 'RECOVERING')
            return 'failed';
        // §5.2 引擎映射：rollback-recommended → restore executor；rollback-continue → rollback executor。
        // 不混用两套引擎；缺省 decision 走 rollback executor（兼容旧调用）。
        const executor = input.decision === 'rollback-recommended' ? input.performRestore : input.performRollback;
        if (executor === undefined)
            return 'failed';
        // 真正开始时：NEEDS_ATTENTION → RECOVERING（§4.2/§7.1）。recovery 全程保持 RECOVERING，
        // **不引入 ROLLING_BACK**（ALLOWED_TRANSITIONS['RECOVERING'] 不含 ROLLING_BACK）。
        // retry 续跑时 journal 已 RECOVERING → 幂等保持。
        await store.update(input.operationId, (cur) => {
            if (cur.state === 'RECOVERING')
                return cur;
            if (cur.state === 'NEEDS_ATTENTION')
                return transitionJournalState(cur, 'RECOVERING');
            return cur; // 其它状态（terminal 等）不迁移
        }).catch(() => undefined);
        const report = await executor(input.snapshotId);
        // 执行完成：保持 RECOVERING（记录 rollback 报告；终态迁移 + verification 写入由 verify 路由
        // 以单次原子 journal update 完成，见 §6.5）。此处绝不自行转 ROLLED_BACK。
        await store.update(input.operationId, (cur) => {
            return { ...cur, rollback: { ...cur.rollback, full: report.full, failed: report.failed } };
        }).catch(() => undefined);
        return 'done';
    }
    // dismiss（quarantine & dismiss）：移出 active，不视为恢复（用户显式放弃）
    if (!userConfirmed)
        return 'needs-confirmation';
    await store.quarantine(input.operationId, 'user dismissed').catch(() => undefined);
    return 'done';
}
// ---------- recovery decision 重算（§5.4） ----------
/**
 * 对 terminal `NEEDS_ATTENTION` journal 重算 recovery 决策（§5.4，Reviewer A 第二轮 P1-2）。
 *
 * `reconcileActive` 对 terminal `NEEDS_ATTENTION` journal 恒返回 `needs-attention`
 * （`NEEDS_ATTENTION` 是 terminal，`rollback-recommended`/`rollback-continue` 只在转换进
 * NEEDS_ATTENTION 的当次 pass 出现一次）。`GET /recovery/status` 用本函数重算，区分
 * `rollback-recommended` / `rollback-continue` / `needs-attention`。
 *
 * **只读**：不修改 journal，不写 SAFE MODE，不写 recovery-history。
 */
export async function recomputeRecoveryDecision(j, hooks) {
    // 回滚中断（entryDone 非空）→ 续跑中断回滚
    if (Object.keys(j.rollback.entryDone ?? {}).length > 0)
        return 'rollback-continue';
    // 有合法且存在的 trusted bound snapshot → 可恢复到快照
    if (j.snapshotId !== null && j.snapshotId !== '') {
        const exists = await hooks.snapshotExists(j.snapshotId, {
            operationId: j.operationId,
            ownerInstanceId: j.ownerInstanceId,
            environmentFingerprint: j.environmentFingerprint,
        });
        if (exists)
            return 'rollback-recommended';
    }
    return 'needs-attention';
}
/**
 * Startup 只读事务状态 + 锁状态扫描（Rev 3 P1-NEW-2）：
 * 只检测、只读；**不自动 recoverStaleLock、不自动 create journal**。
 * lockState: 'LOCKED' | 'STALE_LOCK_DETECTED' | 'UNKNOWN_STATE' | 'FREE'
 */
export async function inspectStartup(store, hooks, env, opts, lockState) {
    // 锁为 LOCKED（fresh heartbeat，活跃 owner）→ 任何 incomplete journal 皆视为 live op，不 reconcile/quarantine/move；
    // 仅 STALE / UNKNOWN / FREE 时才对 journal 做 recover 判定（修 isLiveOwner 并发误判，§18）。
    // 注意：此处用 `||`（不能 `&&`——env.isLiveOwner 在保守 hooks 下恒 false，`LOCKED && false` 会让 live 分支永不到达）。
    const envWithLive = {
        ...env,
        isLiveOwner: async (j) => lockState === 'LOCKED' || (await env.isLiveOwner(j)),
    };
    const outcome = await reconcileActive(store, hooks, envWithLive, { ...opts, organizeTerminal: true });
    const hasIncomplete = outcome.unresolved.length > 0;
    let recoveryRequired = false;
    if (hasIncomplete && (lockState === 'STALE_LOCK_DETECTED' || lockState === 'UNKNOWN_STATE')) {
        recoveryRequired = true;
        await store.writeSafeMode(true).catch(() => undefined);
    }
    // 读 durable SAFE MODE 标记（跨重启保持阻断）：即使 active 已规整，标记在则仍须阻断
    const durableSafe = await store.readSafeMode().catch(() => false);
    const safeModeRequired = outcome.safeModeRequired || recoveryRequired || durableSafe;
    return { safeModeRequired, recoveryRequired, decisions: outcome.decisions, unresolved: outcome.unresolved };
}
//# sourceMappingURL=reconcile.js.map