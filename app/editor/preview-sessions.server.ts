import type {BasexTree} from '@basexedit/theme-sdk';

/**
 * Server-side reader for the ephemeral preview-session store the BaseXEdit
 * editor writes drafts to — see
 * docs/adr/0011-preview-session-ssr-hydration.md in the BaseXEdit repo.
 *
 * The `.server.ts` suffix isn't this repo's usual convention (only
 * entry.server.tsx uses it), but it's deliberate here: this needs
 * BASEX_PREVIEW_SESSIONS_TOKEN, a server-only secret, and the whole point of
 * ADR-0011 is resolving the draft *before* anything reaches the browser — the
 * suffix guarantees this never ends up in the client bundle even if some
 * future refactor imports it somewhere it shouldn't.
 */
export interface PreviewSessionSnapshot {
  tree: BasexTree;
  rev: number;
}

/**
 * Fetches `{tree, rev}` for a session id, or null if the store isn't
 * configured (no token set — most environments) or the session doesn't
 * exist/expired/isn't reachable. Every caller treats null the same way:
 * fall back to the route's own default content, exactly as if this never
 * existed.
 */
export async function readPreviewSession(
  env: Env,
  sessionId: string,
): Promise<PreviewSessionSnapshot | null> {
  const token = env.BASEX_PREVIEW_SESSIONS_TOKEN;
  if (!token) return null;

  const baseUrl = env.BASEX_PREVIEW_SESSIONS_URL ?? 'http://localhost:3001';

  try {
    const response = await fetch(`${baseUrl}/preview-sessions/${sessionId}`, {
      headers: {Authorization: `Bearer ${token}`},
    });
    if (!response.ok) return null;
    return (await response.json()) as PreviewSessionSnapshot;
  } catch (error) {
    console.error('[basex] failed to read preview session', error);
    return null;
  }
}
