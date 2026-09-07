/**
 * dsh-delete-conversation — client half.
 *
 * Injects a "Delete conversation" action into the conversation header actions
 * seat (`conversation.session.header.actions`). Clicking it removes the
 * current session from the session list — non-destructively: the archive
 * capability keeps the session files on disk. Running sessions are protected
 * (the button is disabled while the session is busy).
 *
 * Styling follows the DSH design system: theme tokens (--dsw-*) for colors,
 * the content-font-size scale for type, 6px radii like DSH's inline text
 * controls, a tinted hover, and the standard focus ring — no icon, just a
 * quiet text action that turns destructive-red on hover.
 *
 * The confirmation surface is rendered through a React portal pinned to the
 * viewport at the button's location (DSH-style floating menu), so it can
 * never be clipped or covered by the session header.
 */
window.__ModuleLoader__.load({
  id: 'dsh-delete-conversation',
  factory: (require) => {
    'use strict';
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });

    var React = require('react');
    var ReactDOM = require('react-dom');

    var inject = ['slots', 'workspaces'];

    var CSS_ID = 'dsh-delete-conversation/css';

    var CSS = [
      // Inline "text action" in the session header — matches DSH's quiet
      // secondary controls (transparent, tinted hover, focus ring).
      '.dsdc-wrap{position:relative;display:inline-flex;align-items:center}',
      '.dsdc-btn{display:inline-flex;align-items:center;height:calc(24px + var(--dsh-content-font-delta,0px));padding:0 8px;border:1px solid transparent;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary,#8b93a7);font:inherit;font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(20px + var(--dsh-content-font-delta-secondary,0px));cursor:pointer;white-space:nowrap;transition:background 100ms,color 100ms}',
      '.dsdc-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(128,136,148,.12));color:var(--dsw-alias-label-primary,#f4f6f8)}',
      '.dsdc-btn:focus-visible{outline:2px solid var(--dsw-alias-label-tertiary,#6b7280);outline-offset:-2px}',
      '.dsdc-btn[data-danger="true"]:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-state-error-primary,#e5484d) 12%,transparent);color:var(--dsw-alias-state-error-primary,#e5484d)}',
      '.dsdc-btn:disabled{opacity:.45;cursor:default}',
      // Floating confirmation menu (portal, fixed to the viewport).
      '.dsdc-pop{position:fixed;z-index:2147483000;box-sizing:border-box;width:300px;max-width:calc(100vw - 24px);padding:10px;border:1px solid var(--dsw-alias-border-l1,#3a3f4a);background:var(--dsw-alias-bg-overlay,#1c1e22);color:var(--dsw-alias-label-primary,#f4f6f8);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.3);font-size:var(--dsh-content-font-size-secondary,13px);line-height:calc(20px + var(--dsh-content-font-delta-secondary,0px));overflow-y:auto}',
      '.dsdc-pop-title{font-weight:500;color:var(--dsw-alias-label-primary,#f4f6f8)}',
      '.dsdc-pop-desc{color:var(--dsw-alias-label-tertiary,#9aa2b1);margin-top:4px;font-size:12px;line-height:18px}',
      '.dsdc-pop-error{color:var(--dsw-alias-state-error-primary,#e5484d);margin-top:6px;word-break:break-all;font-size:12px;line-height:18px}',
      '.dsdc-pop-row{display:flex;gap:8px;margin-top:10px;justify-content:flex-end}',
      '.dsdc-btn-pop{border-radius:8px;padding:0 12px;height:calc(26px + var(--dsh-content-font-delta,0px));font:inherit;font-size:var(--dsh-content-font-size-secondary,13px);cursor:pointer;white-space:nowrap}',
      '.dsdc-btn-pop:focus-visible{outline:2px solid var(--dsw-alias-label-tertiary,#6b7280);outline-offset:-2px}',
      '.dsdc-cancel{border:1px solid var(--dsw-alias-border-l1,#3a3f4a);background:transparent;color:var(--dsw-alias-label-secondary,#8b93a7)}',
      '.dsdc-cancel:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover,rgba(128,136,148,.12));color:var(--dsw-alias-label-primary,#f4f6f8)}',
      '.dsdc-ok{border:1px solid transparent;background:var(--dsw-alias-state-error-primary,#e5484d);color:#fff}',
      '.dsdc-ok:hover:not(:disabled){filter:brightness(1.06)}',
      '.dsdc-btn-pop:disabled{opacity:.55;cursor:default}',
    ].join('\n');

    function injectStyle() {
      if (typeof document === 'undefined') return;
      if (document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_ID) + ']') !== null) return;
      var tag = document.createElement('style');
      tag.dataset.plugin = 'dsh-delete-conversation';
      tag.dataset.pluginCss = CSS_ID;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    function removeStyle() {
      if (typeof document === 'undefined') return;
      var tag = document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_ID) + ']');
      if (tag !== null) tag.remove();
    }

    /** Pick a fixed position for the popup next to the button, clamped to the viewport. */
    function popupPosition(buttonRect) {
      if (!buttonRect) return null;
      var viewportW = typeof window !== 'undefined' ? window.innerWidth : 1200;
      var viewportH = typeof window !== 'undefined' ? window.innerHeight : 800;
      var gap = 6;
      var width = Math.min(300, viewportW - 24);
      // Right-align with the button; never overflow horizontally.
      var left = buttonRect.right - width;
      if (left < 8) left = 8;
      if (left + width > viewportW - 8) left = viewportW - 8 - width;
      // Below the button when there is room, otherwise above.
      var below = buttonRect.bottom + gap;
      var guessH = 196;
      var top = below;
      var maxHeight = viewportH - below - 8;
      if (maxHeight < guessH && buttonRect.top - gap > guessH) {
        top = Math.max(8, buttonRect.top - gap - guessH);
        maxHeight = buttonRect.top - gap - 8;
      }
      if (maxHeight < 120) maxHeight = 120;
      if (top + maxHeight > viewportH - 8) maxHeight = viewportH - 8 - top;
      if (maxHeight < 80) maxHeight = 80;
      return { left: Math.round(left), top: Math.round(top), width: Math.round(width), maxHeight: Math.round(maxHeight) };
    }

    /**
     * The header action cell. Uses only the documented standard props
     * (sessionId + session-scope hooks) plus the injected `workspaces` model.
     */
    function DeleteConversationAction(props) {
      // --- session facts (defensive reads: never take the page down) ---
      var useSession = props && props.useSession;
      var sessionId = props && props.sessionId;
      var workspaces = props && props.workspaces;

      var running = false;
      var blank = false;
      if (typeof useSession === 'function') {
        try {
          running = useSession(function (s) { return !!(s && s.running); }) === true;
        } catch (e) { /* older harness: degrade to idle */ }
        try {
          blank = useSession(function (s) { return !!(s && s.blank); }) === true;
        } catch (e) { /* no blank flag */ }
      }

      var wrapRef = React.useRef(null);
      var popRef = React.useRef(null);

      var openState = React.useState(null); // null | {left, top, width, maxHeight}
      var open = openState[0];
      var setOpen = openState[1];
      var busyState = React.useState(false);
      var busy = busyState[0];
      var setBusy = busyState[1];
      var errorState = React.useState(null);
      var error = errorState[0];
      var setError = errorState[1];

      var close = function () { setOpen(null); setError(null); };

      // Close on outside pointer-down, Escape, or window changes while open.
      React.useEffect(function () {
        if (open === null) return undefined;
        if (typeof document === 'undefined') return undefined;
        var onPointer = function (ev) {
          var t = ev.target;
          var inside = false;
          if (popRef.current !== null && popRef.current.contains(t)) inside = true;
          if (wrapRef.current !== null && wrapRef.current.contains(t)) inside = true;
          if (!inside) close();
        };
        var onKey = function (ev) {
          if (ev && ev.key === 'Escape') close();
        };
        var onWindowChange = function () { close(); };
        document.addEventListener('pointerdown', onPointer, true);
        document.addEventListener('keydown', onKey, true);
        window.addEventListener('resize', onWindowChange);
        window.addEventListener('scroll', onWindowChange, true);
        return function () {
          document.removeEventListener('pointerdown', onPointer, true);
          document.removeEventListener('keydown', onKey, true);
          window.removeEventListener('resize', onWindowChange);
          window.removeEventListener('scroll', onWindowChange, true);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [open === null]);

      if (!sessionId || blank) return null;
      var disabled = running || busy;

      var label = '\u5220\u9664\u4F1A\u8BDD'; // 删除会话

      var openPopover = function () {
        if (disabled) return;
        setError(null);
        if (open !== null) { setOpen(null); return; }
        var r = wrapRef.current === null ? null : wrapRef.current.getBoundingClientRect();
        setOpen(popupPosition(r));
      };

      var confirm = function () {
        if (disabled) return;
        setError(null);
        setBusy(true);
        Promise.resolve()
          .then(function () {
            if (!workspaces || typeof workspaces.archiveSession !== 'function') {
              throw new Error('workspaces \u670D\u52A1\u4E0D\u53EF\u7528\uFF08archiveSession \u7F3A\u5931\uFF09');
            }
            return workspaces.archiveSession(sessionId);
          })
          .then(function () {
            setOpen(null);
          })
          .catch(function (err) {
            setError((err && err.message) ? err.message : String(err));
          })
          .then(function () {
            setBusy(false);
          });
      };

      var btn = React.createElement('button', {
        key: 'btn',
        type: 'button',
        className: 'dsdc-btn',
        'data-danger': 'true',
        'aria-label': label,
        'aria-haspopup': 'dialog',
        'aria-expanded': open !== null,
        disabled: disabled,
        onClick: openPopover,
      }, label);

      var wrap = React.createElement('div', { ref: wrapRef, className: 'dsdc-wrap' }, btn);

      if (open === null || typeof document === 'undefined' || typeof ReactDOM === 'undefined'
        || typeof ReactDOM.createPortal !== 'function') {
        return wrap;
      }

      var popup = React.createElement('div', {
        ref: popRef,
        className: 'dsdc-pop',
        role: 'alertdialog',
        'aria-label': label,
        'aria-modal': 'false',
        style: {
          left: open.left,
          top: open.top,
          width: open.width,
          maxHeight: open.maxHeight,
        },
      }, [
        React.createElement('div', { key: 't', className: 'dsdc-pop-title' }, '\u79FB\u9664\u8FD9\u4E2A\u4F1A\u8BDD\uFF1F'),
        React.createElement('div', { key: 'd', className: 'dsdc-pop-desc' },
          '\u4EC5\u4ECE\u5217\u8868\u4E2D\u79FB\u9664\uFF0C\u4F1A\u8BDD\u5386\u53F2\u6587\u4EF6\u4FDD\u7559\u5728\u672C\u5730\uFF0C\u672A\u6765\u53EF\u4EE5\u91CD\u65B0\u5BFC\u5165\u3002\u8FD9\u4E2A\u64CD\u4F5C\u4E0D\u4F1A\u5220\u9664\u6587\u4EF6\u3002'),
        error ? React.createElement('div', { key: 'e', className: 'dsdc-pop-error' }, error) : null,
        React.createElement('div', { key: 'r', className: 'dsdc-pop-row' }, [
          React.createElement('button', {
            key: 'cancel', type: 'button', className: 'dsdc-btn-pop dsdc-cancel', disabled: busy,
            onClick: close,
          }, '\u53D6\u6D88'),
          React.createElement('button', {
            key: 'ok', type: 'button', className: 'dsdc-btn-pop dsdc-ok', disabled: busy,
            onClick: confirm,
          }, busy ? '\u79FB\u9664\u4E2D\u2026' : '\u4ECD\u8981\u79FB\u9664'),
        ]),
      ]);

      return React.createElement(React.Fragment, null, wrap, ReactDOM.createPortal(popup, document.body));
    }

    /**
     * Client plugin body: resolve the workspace model and register the header
     * action cell.
     */
    function apply(ctx) {
      var workspaces = null;
      try {
        workspaces = ctx.get('workspaces');
      } catch (e) { /* degrade: action will report unavailable on click */ }

      injectStyle();

      ctx.slots.inject('conversation.session.header.actions', function () {
        return ctx.slots.register({
          name: 'conversation.session.header.actions',
          id: 'dsh-delete-conversation',
          order: 30,
          label: '\u5220\u9664\u4F1A\u8BDD',
          inject: function () {
            return { workspaces: workspaces };
          },
        }, DeleteConversationAction);
      });

      ctx.effect(function () {
        return function () { removeStyle(); };
      }, 'dsh-delete-conversation: style cleanup');
    }

    module.exports = { apply: apply, inject: inject };
    return module.exports;
  },
});
