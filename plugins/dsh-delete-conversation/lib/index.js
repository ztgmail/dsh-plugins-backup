/**
 * dsh-delete-conversation — host half (no-op identity).
 *
 * The whole feature lives in the client half: it registers a
 * "Delete conversation" action on the conversation header that removes the
 * session from the list (non-destructive — session files are kept). No host
 * service is required because the removal reuses the workspace archive
 * capability already composed by the harness.
 */
/** Cordis plugin identity (used by the loader/composition). */
export const name = "dsh-delete-conversation";
/** No host services are injected; apply stays a no-op. */
export const inject = [];
/** Cordis apply: nothing to do on the host side. */
export function apply() {
  /* client-side only */
}
