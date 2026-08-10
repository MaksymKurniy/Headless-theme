import pagesManifest from '~/editor/pages.generated.json';

// Resource route (no page component) returning the generated, real list of
// statically-navigable routes this theme currently has — see
// scripts/generate-pages-manifest.mjs, which regenerates
// app/editor/pages.generated.json from app/routes/* on every `predev`/
// `prebuild`. Fetched cross-origin by the BaseXEdit host to populate its
// "Pages" quick-nav, so that list can never drift from what actually exists.
export async function loader() {
  return Response.json(pagesManifest, {
    headers: {
      // Public, non-sensitive data (just route paths) — the host reads this
      // cross-origin from a different dev/staging domain.
      'Access-Control-Allow-Origin': '*',
    },
  });
}
