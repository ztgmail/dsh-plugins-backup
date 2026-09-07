/**
 * dsh-session-state — client half (local fork v2).
 *
 * Fork additions over upstream v1.0.2:
 *   1. Activity accounting split into "current/last user run" vs cumulative
 *      totals, plus an "other" bucket for every tool that is not Think/Edit/
 *      Bash/Read — chip tooltips show both numbers.
 *   2. A gear menu on the status bar toggles the fold switches live (and the
 *      run/total count mode) through the persisted settings scope.
 *   3. Clicking an expanded-panel item temporarily reveals + scrolls to the
 *      matching chat row (fold rules exempt rows carrying data-dsm-reveal),
 *      then auto re-hides after a few seconds or on a second click.
 *   4. Hygiene: fold subscription is cleaned up on dispose.
 *
 * Upstream behavior is preserved otherwise:
 *   - folds thinking rows (collapseThinking) and tool rows (collapseTools,
 *     collapseOther) via CSS scoped to [data-chat-flow],
 *   - registers a collapsible session-activity status bar on the
 *     conversation.input.dock seat above the composer.
 */
window.__ModuleLoader__.load({
  id: 'dsh-session-state',
  factory: (require) => {
    'use strict';
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    var React = require('react');

    // ---------------------------------------------------------------------
    // Constants (keep in sync with lib/index.js and dsh.plugin.json)
    // ---------------------------------------------------------------------
    var NS = 'dsh-session-state';
    var COLLAPSE_THINKING = 'collapseThinking';
    var COLLAPSE_TOOLS = 'collapseTools';
    var COLLAPSE_OTHER = 'collapseOther';
    var STATUS_BAR = 'statusBar';
    var COUNT_RUN_MODE = 'countRunMode';
    // Keep a row visible (native one-line collapsed form) while it is still
    // running and only fold it once it settles — avoids the perceived "blank
    // screen" during a long working phase while history stays clean.
    var LIVE_RUNNING = 'liveRunning';

    var BAR_CSS_ID = 'dsh-session-state/statusbar';
    var FOLD_CSS_ID = 'dsh-session-state/fold';

    // ---------------------------------------------------------------------
    // Tool classification (mirrors the native tool-row variants)
    // ---------------------------------------------------------------------
    var BASH_TOOLS = { bash: true, pwsh: true };
    var EDIT_TOOLS = { edit: true, write: true };
    var READ_TOOLS = {
      read: true,
      web_fetch: true,
      web_search: true,
      grep: true,
      glob: true,
      fs_search: true,
      cordis_package_inspect: true,
      cordis_runtime_inspect: true,
    };

    /**
     * Classify a wire tool name into one of the status-bar buckets. Everything
     * unknown (mcp_*, subagent, workflow, …) lands in the "other" bucket so
     * the totals are complete instead of silently dropping activities.
     * @param name - wire tool name (may be null/undefined for a windowless result).
     * @returns 'bash' | 'edit' | 'read' | 'other' | null.
     */
    function classifyTool(name) {
      if (!name) return null;
      if (BASH_TOOLS[name]) return 'bash';
      if (EDIT_TOOLS[name]) return 'edit';
      if (READ_TOOLS[name]) return 'read';
      return 'other';
    }

    /** Fold-row DOM variant for a tool name (mirrors foldCss) or null when the
     *  row variant is unknown (such items cannot be revealed by click). */
    var FOLD_VARIANTS = {
      think: 'think',
      bash: 'bash',
      pwsh: 'bash',
      edit: 'edit',
      write: 'write',
      read: 'read',
      web_fetch: 'read',
      web_search: 'read',
      grep: 'read',
      glob: 'read',
      fs_search: 'read',
      cordis_package_inspect: 'read',
      cordis_runtime_inspect: 'read',
      search: 'search',
      code: 'code',
    };
    function foldVariantOf(name) {
      return FOLD_VARIANTS[name] || null;
    }

    // ---------------------------------------------------------------------
    // Content summaries (for the expanded panel)
    // ---------------------------------------------------------------------
    function firstLine(text) {
      var s = String(text == null ? '' : text);
      var nl = s.indexOf('\n');
      return nl === -1 ? s : s.slice(0, nl);
    }

    /** One-line preview of a text blob (used for reasoning blocks). */
    function summarizeText(text) {
      var s = String(text == null ? '' : text).trim();
      if (s === '') return '';
      var first = firstLine(s).trim() || s;
      if (first.length > 140) first = first.slice(0, 137) + '\u2026';
      return first;
    }

    /** Preferred arg keys for a tool's one-line summary (mirrors the native tool UI). */
    var SUMMARY_KEYS = {
      bash: ['command', 'description'],
      pwsh: ['command', 'description'],
      edit: ['path', 'file_path'],
      write: ['path', 'file_path'],
      read: ['path', 'file_path', 'url'],
      web_fetch: ['url'],
      web_search: ['query', 'url'],
      grep: ['pattern', 'query'],
      glob: ['pattern'],
      cordis_package_inspect: ['name'],
      cordis_runtime_inspect: ['name'],
    };

    /** One-line preview of a tool call from its raw JSON args. */
    function summarizeToolArgs(name, argsRaw) {
      var raw = String(argsRaw == null ? '' : argsRaw);
      var parsed = null;
      try { parsed = JSON.parse(raw); } catch (e) { parsed = null; }
      if (parsed && typeof parsed === 'object') {
        var keys = SUMMARY_KEYS[name] || null;
        if (keys) {
          for (var i = 0; i < keys.length; i++) {
            var v = parsed[keys[i]];
            if (typeof v === 'string' && v !== '') return summarizeText(v);
          }
        }
        for (var k in parsed) {
          var val = parsed[k];
          if (typeof val === 'string' && val !== '') return summarizeText(val);
        }
      }
      return summarizeText(raw);
    }

    // ---------------------------------------------------------------------
    // CSS
    // ---------------------------------------------------------------------
    var BAR_CSS = [
      // Expanded state spans the input box's full box (JS-measured margin-left
      // + width pin the bar to the card's box; the toggle and panel are flush
      // with both edges). COLLAPSED state is a compact pill (natural width,
      // no full-width empty strip) so the session content has no scroll
      // whitespace. `--dsh-composer-card-max-width` cannot be trusted here
      // because other plugins (e.g. dsh-width) override it.
      '.dsm-bar{box-sizing:border-box;width:100%;margin-left:0;margin-right:auto;display:flex;flex-direction:column;align-items:stretch;flex:none}',
      '.dsm-top{display:flex;align-items:center;gap:4px;min-width:0}',
      '.dsm-toggle{display:flex;align-items:center;justify-content:flex-start;gap:6px;width:auto;align-self:flex-start;min-height:24px;padding:2px 10px;border:1px solid transparent;border-radius:999px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;cursor:pointer;text-align:left}',
      '.dsm-bar[data-expanded="true"] .dsm-top{width:100%}',
      '.dsm-bar[data-expanded="true"] .dsm-top .dsm-toggle{width:auto;flex:1 1 auto;justify-content:space-between;border-radius:10px}',
      '.dsm-toggle:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dsm-toggle:focus-visible{outline:2px solid var(--dsw-alias-label-tertiary);outline-offset:-2px}',
      '.dsm-left{display:inline-flex;align-items:center;gap:6px;min-width:0}',
      '.dsm-run{width:7px;height:7px;border-radius:50%;background:var(--dsw-static-deepseek-500);flex:none;animation:1.4s ease-in-out infinite dsm-pulse}',
      '.dsm-chips{display:inline-flex;align-items:center;gap:2px;flex-wrap:wrap;min-width:0}',
      '.dsm-chip{display:inline-flex;align-items:center;gap:4px;padding:0 6px;border-radius:999px;white-space:nowrap}',
      '.dsm-chip-label{font-weight:500;color:var(--dsw-alias-label-primary)}',
      '.dsm-chip-count{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary)}',
      '.dsm-chip-zero{opacity:.45}',
      '.dsm-dot{width:6px;height:6px;border-radius:50%;background:var(--dsw-alias-label-caption);flex:none}',
      '.dsm-chip-think .dsm-dot{background:var(--dsw-static-deepseek-500)}',
      '.dsm-chip-edit .dsm-dot{background:var(--dsw-alias-state-success-primary)}',
      '.dsm-chip-bash .dsm-dot{background:var(--dsw-alias-state-warn-primary)}',
      '.dsm-chip-read .dsm-dot{background:var(--dsw-alias-state-business-primary)}',
      '.dsm-chip-other .dsm-dot{background:var(--dsw-alias-state-info-primary,#8b93a7)}',
      '.dsm-chip-active .dsm-dot{animation:1s ease-in-out infinite dsm-pulse}',
      '@keyframes dsm-pulse{0%,100%{opacity:.35;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}',
      '@media (prefers-reduced-motion:reduce){.dsm-run,.dsm-chip-active .dsm-dot,.dsm-item-running .dsm-item-dot{animation:none}}',
      '.dsm-chevron{width:0;height:0;border-left:3px solid transparent;border-right:3px solid transparent;border-top:4px solid var(--dsw-alias-label-secondary);transition:transform .15s;flex:none}',
      '.dsm-chevron-open{transform:rotate(180deg)}',
      // Gear settings menu (fold toggles + run/total count mode).
      '.dsm-gear{position:relative;flex:none;display:flex;align-items:center}',
      '.dsm-gear-btn{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border:1px solid transparent;border-radius:999px;background:transparent;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1;cursor:pointer}',
      '.dsm-gear-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dsm-gear-btn:focus-visible{outline:2px solid var(--dsw-alias-label-tertiary);outline-offset:-2px}',
      '.dsm-menu{position:absolute;right:0;bottom:calc(100% + 6px);z-index:40;min-width:200px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-overlay,#1c1e22);color:var(--dsw-alias-label-primary,#f4f6f8);border-radius:10px;padding:4px;box-shadow:0 8px 24px rgba(0,0,0,.25)}',
      '.dsm-menu-row{display:flex;gap:8px;align-items:center;width:100%;padding:6px 8px;border:none;background:transparent;color:var(--dsw-alias-label-primary,#f4f6f8);font-size:12px;cursor:pointer;text-align:left;border-radius:6px}',
      '.dsm-menu-row:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dsm-menu-check{width:14px;flex:none;color:var(--dsw-static-deepseek-500,#4d6bfe);font-weight:700}',
      '.dsm-menu-sep{height:1px;margin:4px 6px;background:var(--dsw-alias-border-l1)}',
      // Expanded panel: content sections, whole panel scrolls.
      '.dsm-panel{margin-top:2px;padding:4px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);border-radius:12px;display:flex;flex-direction:column;gap:4px;max-height:300px;overflow-y:auto}',
      '.dsm-section{border:1px solid var(--dsw-alias-border-l1);border-radius:10px;background:var(--dsw-alias-bg-base);overflow:hidden;flex:none}',
      '.dsm-section-head{display:flex;align-items:center;gap:8px;width:100%;padding:4px 8px;border:none;background:transparent;cursor:pointer;text-align:left;font-size:12px;line-height:18px;color:var(--dsw-alias-label-primary)}',
      '.dsm-section-head:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dsm-section-head:focus-visible{outline:2px solid var(--dsw-alias-label-tertiary);outline-offset:-2px}',
      '.dsm-section-label{font-weight:500;flex:1;min-width:0}',
      '.dsm-section-count{font-variant-numeric:tabular-nums;color:var(--dsw-alias-label-secondary)}',
      '.dsm-section-state{font-size:11px;color:var(--dsw-alias-state-business-primary)}',
      '.dsm-section-chevron{width:0;height:0;border-left:3px solid transparent;border-right:3px solid transparent;border-top:4px solid var(--dsw-alias-label-secondary);transition:transform .15s;flex:none}',
      '.dsm-section-chevron-open{transform:rotate(180deg)}',
      '.dsm-section-body{display:flex;flex-direction:column;gap:1px;border-top:1px solid var(--dsw-alias-border-l1);padding:4px 8px 6px}',
      '.dsm-item{display:flex;gap:6px;align-items:center;min-width:0;padding:2px 2px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary)}',
      '.dsm-item-running{color:var(--dsw-alias-label-primary)}',
      '.dsm-item-btn{cursor:pointer;border-radius:6px}',
      '.dsm-item-btn:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dsm-item-btn:focus-visible{outline:2px solid var(--dsw-alias-label-tertiary);outline-offset:-2px}',
      '.dsm-item-dot{width:5px;height:5px;border-radius:50%;background:var(--dsw-alias-label-caption);flex:none}',
      '.dsm-item-running .dsm-item-dot{background:var(--dsw-alias-state-business-primary);animation:1s ease-in-out infinite dsm-pulse}',
      '.dsm-item-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dsm-dot-think{background:var(--dsw-static-deepseek-500)}',
      '.dsm-dot-edit{background:var(--dsw-alias-state-success-primary)}',
      '.dsm-dot-bash{background:var(--dsw-alias-state-warn-primary)}',
      '.dsm-dot-read{background:var(--dsw-alias-state-business-primary)}',
      '.dsm-dot-other{background:var(--dsw-alias-state-info-primary,#8b93a7)}',
      // Reveal highlight (fold rules exempt [data-dsm-reveal] rows, see foldCss).
      '[data-chat-flow] [data-dsm-reveal]{outline:2px solid var(--dsw-static-deepseek-500,#4d6bfe)!important;outline-offset:2px;border-radius:8px;box-shadow:0 0 0 4px color-mix(in srgb,var(--dsw-static-deepseek-500,#4d6bfe) 16%,transparent)}',
    ].join('\n');

    // ---------------------------------------------------------------------
    // Style tag helpers
    // ---------------------------------------------------------------------
    function getStyle(id) {
      if (typeof document === 'undefined') return null;
      return document.querySelector('style[data-plugin-css=' + JSON.stringify(id) + ']');
    }
    function injectStyle(id, css) {
      if (typeof document === 'undefined') return;
      if (getStyle(id) !== null) return;
      var tag = document.createElement('style');
      tag.dataset.plugin = 'dsh-session-state';
      tag.dataset.pluginCss = id;
      tag.textContent = css;
      document.head.appendChild(tag);
    }
    function setStyleText(id, css) {
      if (typeof document === 'undefined') return;
      var tag = getStyle(id);
      if (tag === null) {
        injectStyle(id, css);
        return;
      }
      tag.textContent = css;
    }
    function removeStyle(id) {
      var tag = getStyle(id);
      if (tag !== null) tag.remove();
    }

    /**
     * CSS that folds the process rows inside the chat flow; empty string means
     * "leave them native". Scoped to `[data-chat-flow]` so the details panel
     * and other surfaces that reuse the same variant markers are untouched.
     * Every selector is extended with `:not([data-dsm-reveal])` so a row
     * carrying the reveal marker stays visible (click-to-peek support). When
     * `liveRunning` is on, rows that are still running (`data-state="running"`)
     * are exempt from folding, so the working phase keeps a live one-line
     * activity row instead of an empty stretch.
     */
    function foldCss(collapseThinking, collapseTools, collapseOther, liveRunning) {
      var parts = [];
      var liveGuard = liveRunning ? ':not([data-state="running"])' : '';
      if (collapseThinking) parts.push('[data-chat-flow] [data-variant="think"]');
      if (collapseTools) {
        parts.push(
          '[data-chat-flow] [data-variant="bash"]',
          '[data-chat-flow] [data-variant="edit"]',
          '[data-chat-flow] [data-variant="write"]',
          '[data-chat-flow] [data-variant="read"]',
          '[data-chat-flow] [data-variant="search"]',
          '[data-chat-flow] [data-variant="code"]',
        );
      }
      // Fold every other variant besides Think/Edit/Bash/Read(+writes/search/code).
      if (collapseOther) {
        parts.push(
          '[data-chat-flow] [data-variant]:not([data-variant="think"]):not([data-variant="edit"]):not([data-variant="bash"]):not([data-variant="read"]):not([data-variant="write"]):not([data-variant="search"]):not([data-variant="code"])',
        );
      }
      if (parts.length === 0) return '';
      var selectors = [];
      for (var i = 0; i < parts.length; i++) {
        selectors.push(parts[i] + liveGuard + ':not([data-dsm-reveal])');
      }
      return selectors.join(',') + '{display:none!important}';
    }

    // ---------------------------------------------------------------------
    // Fold hygiene: fold switches collapse the inner rows, but the chat flow
    // lays out one flow item per node, and each flow item still pays its
    // inter-item margin even when its only content has been folded away. A run
    // of folded tool-call/assistant-step nodes between two real messages then
    // stacks N×16px of blank space ("big empty bands"). Hygiene hides those
    // visually-empty flow items themselves (hidden attribute, which the native
    // margin rule excludes), collapsing the gaps while history stays clean.
    // ---------------------------------------------------------------------
    var hygieneState = { interval: 0, observer: null, rAF: 0 };

    function unhideOwnedFlowItems(root) {
      var kids = root.children;
      for (var i = 0; i < kids.length; i++) {
        var it = kids[i];
        if (it.hasAttribute && it.hasAttribute('hidden') && it.getAttribute('hidden') === '') it.removeAttribute('hidden');
        if (it.hasAttribute) it.removeAttribute('data-dsf-sig');
      }
    }

    /**
     * Short content signature of a flow item: inner rows' variants/states plus
     * the total text length. Used to detect "new content arrived into an item
     * that hygiene already hid" (a streamed answer landing in a previously
     * empty-looking assistant-step item would otherwise stay invisible
     * forever, because a hidden item always measures 0px and height alone can
     * never un-hide it).
     */
    function flowItemSig(it) {
      var sig = '';
      var nodes = it.querySelectorAll('[data-variant],[data-state]');
      for (var i = 0; i < nodes.length; i++) {
        sig += (nodes[i].getAttribute('data-variant') || '') + '|' + (nodes[i].getAttribute('data-state') || '') + ';';
      }
      sig += '#' + (it.textContent ? it.textContent.length : 0);
      return sig;
    }
    function unhideItem(it) {
      if (it.hasAttribute && it.hasAttribute('hidden') && it.getAttribute('hidden') === '') it.removeAttribute('hidden');
      if (it.hasAttribute) it.removeAttribute('data-dsf-sig');
    }
    function hideItem(it) {
      it.setAttribute('hidden', '');
      it.setAttribute('data-dsf-sig', flowItemSig(it));
    }

    function sweepFlowItems() {
      hygieneState.rAF = 0;
      var col = typeof document === 'undefined' ? null : document.querySelector('[data-chat-flow]');
      if (col === null) return;
      var kids = col.children;
      for (var i = 0; i < kids.length; i++) {
        var it = kids[i];
        if (!it.hasAttribute || !it.hasAttribute('data-chat-flow-key')) continue;
        var kind = it.getAttribute('data-chat-flow-kind') || '';
        if (kind !== 'tool-call' && kind !== 'assistant-step') continue;
        // NEVER hide assistant steps: they carry (or will soon carry) the AI
        // answer text. A momentarily 0-height step (e.g. folded think only)
        // must keep its space — a hidden answer is far worse than a blank gap.
        if (kind === 'assistant-step') {
          unhideItem(it);
          continue;
        }
        // A revealed row must stay visible even inside an empty item.
        var reveal = it.querySelector('[data-dsm-reveal]');
        if (reveal !== null) {
          unhideItem(it);
          continue;
        }
        // Rows still running are never hidden (liveRunning semantics).
        if (it.querySelector('[data-state="running"]') !== null) {
          unhideItem(it);
          continue;
        }
        if (it.hasAttribute('hidden') && it.getAttribute('hidden') === '') {
          // Sticky-content guard: if the item's content changed since we hid
          // it (e.g. a result started streaming into this item), reveal it.
          var kept = it.getAttribute('data-dsf-sig');
          var sig = flowItemSig(it);
          if (kept === null || kept !== sig) unhideItem(it);
        }
        if (it.offsetHeight <= 1) {
          if (!it.hasAttribute('hidden')) hideItem(it);
        } else if (it.hasAttribute('hidden') && it.getAttribute('hidden') === '') {
          unhideItem(it);
        }
      }
    }

    function scheduleSweep() {
      if (hygieneState.rAF !== 0) return;
      if (typeof requestAnimationFrame !== 'function') { try { sweepFlowItems(); } catch (e) { /* noop */ } return; }
      hygieneState.rAF = requestAnimationFrame(function () {
        try { sweepFlowItems(); } catch (e) { /* never break the chat for hygiene */ }
      });
    }

    function startHygiene() {
      if (hygieneState.interval !== 0) return;
      try { sweepFlowItems(); } catch (e) { /* noop */ }
      if (hygieneState.observer === null && typeof MutationObserver === 'function') {
        try {
          var rootNode = typeof document !== 'undefined' ? document.body || document.documentElement : null;
          if (rootNode !== null) {
            var observer = new MutationObserver(function () { scheduleSweep(); });
            observer.observe(rootNode, {
              childList: true,
              subtree: true,
              characterData: true,
              attributes: true,
              attributeFilter: ['data-state', 'data-variant', 'hidden', 'data-dsm-reveal', 'data-chat-flow-kind'],
            });
            hygieneState.observer = observer;
          }
        } catch (e) { /* observer unsupported */ }
      }
      // Cheap belt-and-braces while the conversation is live and streaming.
      hygieneState.interval = setInterval(function () {
        if (typeof document === 'undefined' || document.visibilityState === 'hidden') return;
        scheduleSweep();
      }, 300);
    }

    function stopHygiene() {
      if (hygieneState.interval !== 0) {
        clearInterval(hygieneState.interval);
        hygieneState.interval = 0;
      }
      if (hygieneState.observer !== null) {
        try { hygieneState.observer.disconnect(); } catch (e) { /* noop */ }
        hygieneState.observer = null;
      }
      if (hygieneState.rAF !== 0) {
        try { cancelAnimationFrame(hygieneState.rAF); } catch (e) { /* noop */ }
        hygieneState.rAF = 0;
      }
      var col = typeof document === 'undefined' ? null : document.querySelector('[data-chat-flow]');
      if (col !== null) unhideOwnedFlowItems(col);
    }

    // ---------------------------------------------------------------------
    // Activity accounting (counts + per-item content)
    // ---------------------------------------------------------------------
    var BUCKETS = ['think', 'edit', 'bash', 'read', 'other'];

    function emptyBuckets() {
      return { think: 0, edit: 0, bash: 0, read: 0, other: 0 };
    }
    function emptyBucketLists() {
      return { think: [], edit: [], bash: [], read: [], other: [] };
    }

    /**
     * Fold the session's finalized nodes, the streaming partial assistant, and
     * the in-flight tool calls into run/total counts, active flags and the
     * current-run item list for the five buckets.
     *
     * - countsRun  : only nodes after the last user node (plus streaming
     *                partial / running calls). When no user node exists in the
     *                projection, falls back to the whole session.
     * - countsTotal: the whole session.
     * - items      : current-run items only (the expanded panel never lists
     *                thousands of historical rows). Each item carries a
     *                variant + ordinal so a click can reveal the matching DOM
     *                row; ordinals are counted over the WHOLE session, since
     *                the chat DOM renders the full history.
     * - active     : running flags (partial reasoning / in-flight calls).
     */
    function computeActivity(nodes, partial, runningCalls) {
      var countsRun = emptyBuckets();
      var countsTotal = emptyBuckets();
      var active = { think: false, edit: false, bash: false, read: false, other: false };
      var items = emptyBucketLists();
      var ordByVariant = { think: 0, bash: 0, edit: 0, write: 0, read: 0, search: 0, code: 0 };
      var i, j, node, block, name, cls, variant, ordinal, inRun;

      var list = nodes || [];
      var lastUser = -1;
      for (i = 0; i < list.length; i++) {
        if (list[i] && list[i].kind === 'user') lastUser = i;
      }

      for (i = 0; i < list.length; i++) {
        node = list[i];
        if (!node) continue;
        inRun = i > lastUser;
        if (node.kind === 'assistant' && node.blocks) {
          for (j = 0; j < node.blocks.length; j++) {
            block = node.blocks[j];
            if (block && block.kind === 'reasoning') {
              countsTotal.think += 1;
              ordinal = ++ordByVariant.think;
              if (inRun) {
                countsRun.think += 1;
                items.think.push({ text: summarizeText(block.text), running: false, bucket: 'think', variant: 'think', ordinal: ordinal });
              }
            }
          }
        } else if (node.kind === 'tool-result') {
          name = node.call ? node.call.name : null;
          cls = classifyTool(name);
          if (!cls) continue;
          countsTotal[cls] += 1;
          variant = foldVariantOf(name);
          ordinal = variant ? ++ordByVariant[variant] : -1;
          if (inRun) {
            countsRun[cls] += 1;
            items[cls].push({ text: summarizeToolArgs(name, node.call ? node.call.argsRaw : null), running: false, bucket: cls, variant: variant, ordinal: ordinal });
          }
        }
      }

      // Streaming reasoning always belongs to the current run.
      if (partial && partial.blocks) {
        for (j = 0; j < partial.blocks.length; j++) {
          block = partial.blocks[j];
          if (block && block.kind === 'reasoning') {
            countsRun.think += 1;
            countsTotal.think += 1;
            active.think = true;
            items.think.push({ text: summarizeText(block.text), running: true, bucket: 'think', variant: 'think', ordinal: -1 });
          }
        }
      }

      var calls = runningCalls || [];
      for (j = 0; j < calls.length; j++) {
        var call = calls[j];
        name = call ? call.name : null;
        cls = classifyTool(name);
        if (!cls) continue;
        countsRun[cls] += 1;
        countsTotal[cls] += 1;
        active[cls] = true;
        items[cls].push({ text: summarizeToolArgs(name, call ? call.argsRaw : null), running: true, bucket: cls, variant: foldVariantOf(name), ordinal: -1 });
      }

      return {
        countsRun: countsRun,
        countsTotal: countsTotal,
        active: active,
        items: items,
      };
    }

    var CHIP_ORDER = ['think', 'edit', 'bash', 'read', 'other'];
    var CHIP_META = {
      think: { label: 'Think' },
      edit: { label: 'Edit' },
      bash: { label: 'Bash' },
      read: { label: 'Read' },
      other: { label: 'Other' },
    };
    var EMPTY_ITEMS = emptyBucketLists();

    // ---------------------------------------------------------------------
    // Reveal-to-chat helpers (click a panel item -> show the DOM row briefly)
    // ---------------------------------------------------------------------
    var revealState = { el: null, timer: null };

    function clearReveal() {
      if (revealState.el !== null) {
        revealState.el.removeAttribute('data-dsm-reveal');
        revealState.el.removeAttribute('data-dsm-variant');
        revealState.el.removeAttribute('data-dsm-ordinal');
        revealState.el = null;
      }
      if (revealState.timer !== null) {
        clearTimeout(revealState.timer);
        revealState.timer = null;
      }
    }

    function findRow(variant, ordinal) {
      if (!variant || !ordinal || ordinal < 1) return null;
      var rows = document.querySelectorAll('[data-chat-flow] [data-variant="' + variant + '"]');
      return rows[ordinal - 1] || null;
    }

    /** Reveal+scroll a chat row; calling again on the same row hides it early. */
    function toggleReveal(variant, ordinal) {
      if (!variant || !ordinal || ordinal < 1) return false;
      if (revealState.el !== null) {
        var el = revealState.el;
        var same = el.getAttribute('data-dsm-variant') === String(variant) && el.getAttribute('data-dsm-ordinal') === String(ordinal);
        clearReveal();
        if (same) return true;
      }
      var row = findRow(variant, ordinal);
      if (row === null) return false;
      row.setAttribute('data-dsm-variant', String(variant));
      row.setAttribute('data-dsm-ordinal', String(ordinal));
      row.setAttribute('data-dsm-reveal', '1');
      // Hygiene may have hidden the whole flow item; reveal must un-hide it.
      var ancestor = row.parentElement;
      while (ancestor !== null && !ancestor.hasAttribute('data-chat-flow-key')) ancestor = ancestor.parentElement;
      if (ancestor !== null && ancestor.hasAttribute('hidden')) ancestor.removeAttribute('hidden');
      try { row.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { /* older engines */ }
      revealState.el = row;
      revealState.timer = setTimeout(clearReveal, 5000);
      return true;
    }

    // ---------------------------------------------------------------------
    // Status bar component
    // ---------------------------------------------------------------------
    function SessionStatusBar(props) {
      var useSession = props.useSession;
      var scope = props.scope;

      var settingsSnapshot = React.useSyncExternalStore(
        function (listener) { return scope.subscribe(listener); },
        function () { return scope.getSnapshot(); },
      );
      var settingsValue = settingsSnapshot.value || {};
      var enabled = settingsValue[STATUS_BAR] !== false;
      var runMode = settingsValue[COUNT_RUN_MODE] !== false;
      var liveRunning = settingsValue[LIVE_RUNNING] !== false;

      var nodes = useSession(function (s) { return s.nodes; });
      var partial = useSession(function (s) { return s.partial; });
      var runningCalls = useSession(function (s) { return s.runningCalls; });
      var running = useSession(function (s) { return s.running; });

      var activity = React.useMemo(function () {
        return computeActivity(nodes, partial, runningCalls);
      }, [nodes, partial, runningCalls]);

      var expandedState = React.useState(false);
      var expanded = expandedState[0];
      var setExpanded = expandedState[1];

      var foldedState = React.useState({ think: false, edit: false, bash: false, read: false, other: false });
      var folded = foldedState[0];
      var setFolded = foldedState[1];

      var menuState = React.useState(false);
      var menuOpen = menuState[0];
      var setMenuOpen = menuState[1];

      var counts = runMode ? activity.countsRun : activity.countsTotal;
      var countsTotal = activity.countsTotal;
      var items = activity.items || EMPTY_ITEMS;
      var totalShown = 0;
      var totalAll = 0;
      for (var b = 0; b < BUCKETS.length; b++) {
        totalShown += counts[BUCKETS[b]];
        totalAll += countsTotal[BUCKETS[b]];
      }

      // Keep the toolbar's left edge (and width) aligned with the actual input
      // box ([data-composer-card]). See upstream notes: measure against
      // [data-composer-seat], never bar.parentElement (display:contents).
      var visible = enabled && (totalShown > 0 || running);
      var barRef = React.useRef(null);
      React.useLayoutEffect(function () {
        if (!visible) {
          clearReveal();
          return undefined;
        }
        var bar = barRef.current;
        if (bar === null) return undefined;
        if (typeof document === 'undefined') return undefined;
        var seat = bar.closest('[data-composer-seat]');
        var card = seat === null ? null : seat.querySelector('[data-composer-card]');
        if (card === null || seat === null) return undefined;

        var align = function () {
          var cardRect = card.getBoundingClientRect();
          var seatRect = seat.getBoundingClientRect();
          var left = Math.max(0, Math.round(cardRect.left - seatRect.left));
          var width = Math.round(cardRect.width);
          if (bar.style.marginLeft !== left + 'px') bar.style.marginLeft = left + 'px';
          if (bar.style.width !== width + 'px') bar.style.width = width + 'px';
        };
        align();

        var disposers = [];
        var retry = typeof setTimeout !== 'undefined' ? setTimeout(align, 80) : 0;
        disposers.push(function () { if (retry !== 0) clearTimeout(retry); });
        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
          window.addEventListener('resize', align);
          disposers.push(function () { window.removeEventListener('resize', align); });
        }
        if (typeof ResizeObserver !== 'undefined') {
          var observer = new ResizeObserver(align);
          observer.observe(card);
          observer.observe(seat);
          disposers.push(function () { observer.disconnect(); });
        }
        return function () {
          for (var d = 0; d < disposers.length; d++) disposers[d]();
        };
      }, [visible]);

      // Unmount cleanup: remove any active reveal and cancel its timer.
      React.useEffect(function () {
        return function () { clearReveal(); };
      }, []);

      if (!enabled) return null;
      if (totalShown === 0 && !running) return null;

      var setSetting = function (field, value) {
        try { scope.set(field, value); } catch (e) { /* mirror will recover */ }
      };

      var toggleSection = function (key) {
        setFolded(function (prev) {
          var next = {};
          for (var k in prev) next[k] = prev[k];
          next[key] = !prev[key];
          return next;
        });
      };

      var modeTag = runMode ? '\u672C\u8F6E' : '\u7D2F\u8BA1';
      var chips = CHIP_ORDER.map(function (key) {
        var count = counts[key];
        var cum = countsTotal[key];
        var isActive = activity.active[key];
        var label = CHIP_META[key].label;
        return React.createElement('span', {
          key: key,
          className: 'dsm-chip dsm-chip-' + key + (isActive ? ' dsm-chip-active' : '') + (count === 0 ? ' dsm-chip-zero' : ''),
          'data-dsm-cat': key,
        }, [
          React.createElement('span', { key: 'dot', className: 'dsm-dot', 'aria-hidden': true }),
          React.createElement('span', { key: 'label', className: 'dsm-chip-label' }, label),
          React.createElement('span', { key: 'count', className: 'dsm-chip-count' }, String(count)),
        ]);
      });

      var runDot = running
        ? React.createElement('span', { key: 'run', className: 'dsm-run', 'aria-hidden': true })
        : null;

      var gear = React.createElement('div', { key: 'gear', className: 'dsm-gear' }, [
        React.createElement('button', {
          key: 'btn',
          type: 'button',
          className: 'dsm-gear-btn',
          'aria-label': '\u8BBE\u7F6E',
          onClick: function () { setMenuOpen(!menuOpen); },
        }, '\u2699'),
        menuOpen ? React.createElement('div', { key: 'menu', className: 'dsm-menu', role: 'menu' }, [
          React.createElement('button', {
            key: 'think-row', type: 'button', role: 'menuitem', className: 'dsm-menu-row',
            onClick: function () { setSetting(COLLAPSE_THINKING, !(settingsValue[COLLAPSE_THINKING] !== false)); },
          }, [
            React.createElement('span', { key: 'c', className: 'dsm-menu-check' }, settingsValue[COLLAPSE_THINKING] !== false ? '\u2713' : ''),
            React.createElement('span', { key: 't', className: 'dsm-menu-label' }, '\u6298\u53E0\u601D\u8003\uFF08Think\uFF09'),
          ]),
          React.createElement('button', {
            key: 'tools-row', type: 'button', role: 'menuitem', className: 'dsm-menu-row',
            onClick: function () { setSetting(COLLAPSE_TOOLS, !(settingsValue[COLLAPSE_TOOLS] !== false)); },
          }, [
            React.createElement('span', { key: 'c', className: 'dsm-menu-check' }, settingsValue[COLLAPSE_TOOLS] !== false ? '\u2713' : ''),
            React.createElement('span', { key: 't', className: 'dsm-menu-label' }, '\u6298\u53E0\u5DE5\u5177\u8C03\u7528'),
          ]),
          React.createElement('button', {
            key: 'other-row', type: 'button', role: 'menuitem', className: 'dsm-menu-row',
            onClick: function () { setSetting(COLLAPSE_OTHER, settingsValue[COLLAPSE_OTHER] === true ? false : true); },
          }, [
            React.createElement('span', { key: 'c', className: 'dsm-menu-check' }, settingsValue[COLLAPSE_OTHER] === true ? '\u2713' : ''),
            React.createElement('span', { key: 't', className: 'dsm-menu-label' }, '\u6298\u53E0\u5176\u5B83\u72B6\u6001'),
          ]),
          React.createElement('button', {
            key: 'live-row', type: 'button', role: 'menuitem', className: 'dsm-menu-row',
            onClick: function () { setSetting(LIVE_RUNNING, liveRunning ? false : true); },
          }, [
            React.createElement('span', { key: 'c', className: 'dsm-menu-check' }, liveRunning ? '\u2713' : ''),
            React.createElement('span', { key: 't', className: 'dsm-menu-label' }, '\u8FD0\u884C\u4E2D\u4FDD\u7559\u6D3B\u52A8\u884C\uFF08\u5B8C\u6210\u5373\u6536\u8D77\uFF09'),
          ]),
          React.createElement('div', { key: 'sep1', className: 'dsm-menu-sep' }),
          React.createElement('button', {
            key: 'mode-row', type: 'button', role: 'menuitem', className: 'dsm-menu-row',
            onClick: function () { setSetting(COUNT_RUN_MODE, runMode ? false : true); },
          }, [
            React.createElement('span', { key: 'c', className: 'dsm-menu-check' }, runMode ? '\u2713' : ''),
            React.createElement('span', { key: 't', className: 'dsm-menu-label' }, '\u4EC5\u8BA1\u672C\u8F6E\uFF08\u60AC\u505C\u770B\u7D2F\u8BA1\uFF09'),
          ]),
        ]) : null,
      ]);

      var panel = expanded
        ? React.createElement('div', { key: 'panel', className: 'dsm-panel', role: 'region' },
            CHIP_ORDER.map(function (key) {
              var label = CHIP_META[key].label;
              var count = counts[key];
              var isActive = activity.active[key];
              var list = items[key] || [];
              var isFolded = folded[key] === true;

              var body = null;
              if (!isFolded) {
                var rows = list.length === 0
                  ? [React.createElement('div', { key: 'empty', className: 'dsm-item' }, [
                      React.createElement('span', { key: 'dot', className: 'dsm-item-dot', 'aria-hidden': true }),
                      React.createElement('span', { key: 'text', className: 'dsm-item-text' }, '\u2014'),
                    ])]
                  : list.map(function (item, idx) {
                      var clickable = !item.running && item.variant && item.ordinal > 0;
                      var itemProps = {
                        key: idx,
                        className: 'dsm-item' + (item.running ? ' dsm-item-running' : '') + (clickable ? ' dsm-item-btn' : ''),
                      };
                      if (clickable) {
                        itemProps.role = 'button';
                        itemProps.tabIndex = 0;
                        itemProps.onClick = function () { toggleReveal(item.variant, item.ordinal); };
                        itemProps.onKeyDown = function (ev) {
                          if (ev && (ev.key === 'Enter' || ev.key === ' ')) {
                            ev.preventDefault();
                            toggleReveal(item.variant, item.ordinal);
                          }
                        };
                      }
                      return React.createElement('div', itemProps, [
                        React.createElement('span', { key: 'dot', className: 'dsm-item-dot', 'aria-hidden': true }),
                        React.createElement('span', { key: 'text', className: 'dsm-item-text' }, item.text || '\u2014'),
                      ]);
                    });
                body = React.createElement('div', { key: 'body', className: 'dsm-section-body' }, rows);
              }

              return React.createElement('div', { key: key, className: 'dsm-section' }, [
                React.createElement('button', {
                  key: 'head',
                  type: 'button',
                  className: 'dsm-section-head',
                  'aria-expanded': !isFolded,
                  onClick: function () { toggleSection(key); },
                }, [
                  React.createElement('span', { key: 'dot', className: 'dsm-dot dsm-dot-' + key, 'aria-hidden': true }),
                  React.createElement('span', { key: 'label', className: 'dsm-section-label' }, label),
                  React.createElement('span', { key: 'count', className: 'dsm-section-count' }, String(count)),
                  isActive ? React.createElement('span', { key: 'state', className: 'dsm-section-state' }, 'running') : null,
                  React.createElement('span', {
                    key: 'chevron',
                    className: 'dsm-section-chevron' + (isFolded ? '' : ' dsm-section-chevron-open'),
                    'aria-hidden': true,
                  }),
                ]),
                body,
              ]);
            }))
        : null;

      return React.createElement('div', { ref: barRef, className: 'dsm-bar', 'data-dsm-statusbar': '', 'data-expanded': expanded }, [
        React.createElement('div', { key: 'top', className: 'dsm-top' }, [
          React.createElement('button', {
            key: 'toggle',
            type: 'button',
            className: 'dsm-toggle',
            'aria-expanded': expanded,
            'aria-label': expanded ? '\u6536\u8D77\u6D3B\u52A8\u72B6\u6001' : '\u5C55\u5F00\u6D3B\u52A8\u72B6\u6001',
            onClick: function () { setExpanded(!expanded); },
          }, [React.createElement('span', { key: 'left', className: 'dsm-left' }, [runDot, React.createElement('span', { key: 'chips', className: 'dsm-chips' }, chips)]), React.createElement('span', {
            key: 'chevron',
            className: 'dsm-chevron' + (expanded ? ' dsm-chevron-open' : ''),
            'aria-hidden': true,
          })]),
          gear,
        ]),
        panel,
      ]);
    }

    // ---------------------------------------------------------------------
    // Plugin body
    // ---------------------------------------------------------------------
    var inject = ['slots', 'settingsScope'];

    function apply(ctx) {
      // Durable settings scope (namespace registered by the node half).
      var scope = ctx.settingsScope.bind({ namespace: NS });

      // Inject the status-bar styles once.
      injectStyle(BAR_CSS_ID, BAR_CSS);

      // Follow the settings scope: fold/unfold thinking + tool rows on every
      // change, and once immediately so the defaults hold while loading.
      var applyFold = function () {
        var snap = scope.getSnapshot();
        var v = snap.value || {};
        var think = v[COLLAPSE_THINKING] !== false;
        var tools = v[COLLAPSE_TOOLS] !== false;
        var collapseOther = v[COLLAPSE_OTHER] === true;
        var liveRunning = v[LIVE_RUNNING] !== false;
        var css = foldCss(think, tools, collapseOther, liveRunning);
        if (css) {
          setStyleText(FOLD_CSS_ID, css);
          startHygiene();
        } else {
          removeStyle(FOLD_CSS_ID);
          stopHygiene();
        }
      };
      var unsubscribeFold = scope.subscribe(applyFold);
      applyFold();

      // Register the collapsible status bar above the composer.
      ctx.slots.inject('conversation.input.dock', function () {
        return ctx.slots.register(
          {
            name: 'conversation.input.dock',
            id: 'dsh-session-state',
            order: 15,
            inject: function () { return { scope: scope }; },
          },
          SessionStatusBar,
        );
      });

      // Remove injected styles on dispose (and drop the fold subscription).
      ctx.effect(function () {
        return function () {
          if (typeof unsubscribeFold === 'function') {
            try { unsubscribeFold(); } catch (e) { /* already gone */ }
          }
          clearReveal();
          stopHygiene();
          removeStyle(BAR_CSS_ID);
          removeStyle(FOLD_CSS_ID);
        };
      }, 'dsh-session-state: style + fold-subscription cleanup');
    }

    module.exports = { apply: apply, inject: inject };
    return module.exports;
  },
});
