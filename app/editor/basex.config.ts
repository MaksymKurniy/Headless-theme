/**
 * Which origins are allowed to drive this storefront's design mode.
 *
 * This list is the only authentication in the editor protocol. Being inside an
 * iframe proves that *some* page embedded this storefront — not that the page
 * is BaseXEdit — so without it, any site that frames this storefront could ask
 * it for the whole page layout with a single `get-tree`. Both
 * `DesignModeLayer` and `useThemeBridge` take it, and the SDK drops every
 * message from an origin that isn't here.
 *
 * Keep this in step with `frameAncestors` in `app/entry.server.tsx`: this list
 * decides who the theme will *talk to*, that one decides who the browser will
 * let *frame* it at all. Both have to name the editor or design mode won't
 * work.
 */
export const BASEX_EDITOR_ORIGINS = [
  // BaseXEdit's Vite dev server (frontend/vite.config.ts).
  'http://localhost:5173',
  // Add the deployed editor's origin(s) here before shipping, e.g.
  // 'https://app.basexedit.com'.
];
