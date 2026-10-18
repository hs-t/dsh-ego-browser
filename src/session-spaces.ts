/**
 * Session-scoped default task-space mapping.
 *
 * A DSH tool call carries the calling agent's session id structurally
 * (`exec.agent.session.id`), never as a model-supplied argument. This module
 * turns that identity into a stable default space so two conversations (or a
 * conversation and its subagents) do not silently share one tab set:
 *
 *   - the first tool call of a session derives `sess-<short id>`;
 *   - `ego_space_open` rewrites the mapping to the explicitly opened name;
 *   - an explicit `space` argument always wins and updates the mapping.
 *
 * The map is process-local and unbounded only by the number of sessions the
 * host has seen; entries are tiny strings. The cast-server reads it to tell
 * the right-Sidebar panel which space a session currently owns.
 */

const sessionSpaces = new Map<string, string>()

/** Short, filesystem/YAML-safe suffix derived from a session id. */
export function shortSessionSpace(sessionId: string | undefined): string | undefined {
  if (sessionId === undefined || sessionId === '') return undefined
  const clean = sessionId.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 12)
  return clean === '' ? undefined : `sess-${clean}`
}

export function getSessionSpace(sessionId: string | undefined): string | undefined {
  if (sessionId === undefined || sessionId === '') return undefined
  return sessionSpaces.get(sessionId)
}

export function setSessionSpace(sessionId: string | undefined, space: unknown): void {
  if (sessionId === undefined || sessionId === '') return
  if (space === undefined || space === null || space === '') return
  sessionSpaces.set(sessionId, String(space))
}

/**
 * Resolve the space a call should use when it does not pass one explicitly.
 * Falls back to the configured default for callers without a session id.
 */
export function defaultSpaceForSession(
  sessionId: string | undefined,
  fallback: string | number,
): string | number {
  if (sessionId === undefined || sessionId === '') return fallback
  return sessionSpaces.get(sessionId) ?? shortSessionSpace(sessionId) ?? fallback
}
