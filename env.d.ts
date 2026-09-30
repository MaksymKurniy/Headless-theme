/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    /**
     * Shared secret for the ephemeral preview-session store the BaseXEdit
     * editor writes drafts to — see
     * docs/adr/0011-preview-session-ssr-hydration.md in the BaseXEdit repo.
     * Unset in an environment with no BaseXEdit editor attached; routes that
     * read it fall back to their normal default-content behavior when it's
     * missing, same as before this existed.
     */
    BASEX_PREVIEW_SESSIONS_TOKEN?: string;
    /** Defaults to http://localhost:3001 (backend/.env's PORT) when unset. */
    BASEX_PREVIEW_SESSIONS_URL?: string;
  }
}
