import type {Route} from './+types/basex-preview';
import {
  PREVIEW_SESSION_PARAM,
  SectionRenderer,
  isDesignMode,
  loadSectionData,
  useSectionData,
  useThemeBridge,
  type BasexTree,
} from '@basexedit/theme-sdk';
import {sectionsRegistry} from '~/editor/sections.config';
import {BASEX_EDITOR_ORIGINS} from '~/editor/basex.config';
import {readPreviewSession} from '~/editor/preview-sessions.server';
import {getLocaleFromRequest} from '~/lib/i18n';
import homeConfig from '~/editor/pages/home.json';

// Standalone pilot route for wiring up @basexedit/theme-sdk: no Header/Footer/
// PageLayout, no route-level storefront queries — just the section tree, plus
// whatever its sections' own loaders fetch. The design-mode
// overlay itself is mounted globally in root.tsx (DesignModeLayer), so this
// route only needs to render the tagged `[data-basex-id]` markup for it to
// find; visit /basex-preview?basex_design=1 to see it highlight the Hero.
export const meta: Route.MetaFunction = () => {
  return [{title: 'BaseXEdit Preview | Home'}];
};

// Read design-mode straight off the request URL, on the server — not
// `window.location`, which doesn't exist yet at this point and would
// disagree with what the client sees on its very first render (a hydration
// mismatch). Passing this same value into useThemeBridge below is what keeps
// server and client in agreement.
//
// Also resolves `?basexPreview=<id>` here, server-side, against the
// ephemeral preview-session store (docs/adr/0011-preview-session-ssr-hydration.md
// in the BaseXEdit repo) — when it's present and the session is still alive,
// this route renders the editor's current draft on the very first frame
// instead of booting with `homeConfig` and waiting for the editor to correct
// it over postMessage. Anything that isn't a hit (no param, expired session,
// store unreachable) falls back to the theme's own `home.json`.
//
// Then every section on the page loads its own data, here, in one call —
// whatever sections the tree holds and however many of each (see
// loadSectionData in @basexedit/theme-sdk). Nothing in this loader knows which
// sections need what: that lives in each section's `loader`, next to it.
export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const designMode = isDesignMode(url.search);

  const previewSessionId = url.searchParams.get(PREVIEW_SESSION_PARAM);
  const session = previewSessionId
    ? await readPreviewSession(context.env, previewSessionId)
    : null;
  const tree = session?.tree ?? (homeConfig as BasexTree);

  const sectionData = await loadSectionData({
    nodes: tree.nodes,
    registry: sectionsRegistry,
    context,
    request,
  });

  return {
    designMode,
    initialTree: tree,
    initialRev: session?.rev ?? null,
    sectionData,
    // Where the editor preview asks for fresh section data when a section's
    // settings change. Keeps the locale prefix, so the refreshed data is in
    // the same market (language, currency) as the page.
    sectionDataEndpoint: `${getLocaleFromRequest(request).pathPrefix}/basex-section-data.json`,
  };
}

export default function BasexPreview({loaderData}: Route.ComponentProps) {
  const {tree, resolved} = useThemeBridge({
    registry: sectionsRegistry,
    initialTree: loaderData.initialTree,
    allowedOrigins: BASEX_EDITOR_ORIGINS,
    designMode: loaderData.designMode,
    initialRev: loaderData.initialRev ?? undefined,
  });

  // On the storefront this is just `loaderData.sectionData`. In the editor it
  // follows the tree: a section whose settings change (another collection, a
  // section inserted or un-hidden) gets its loader re-run through
  // /basex-section-data.json, while the rest of the page is left alone.
  const sectionData = useSectionData({
    nodes: tree.nodes,
    registry: sectionsRegistry,
    initialData: loaderData.sectionData,
    endpoint: loaderData.sectionDataEndpoint,
    designMode: loaderData.designMode,
  });

  // While waiting to hear from the editor host what to show (see
  // useThemeBridge's `resolved`), don't render the theme's default content at
  // all — that used to be exactly the "content updates in front of your
  // eyes" flash. A real shopper never sees this: designMode is false for
  // them, so `resolved` is already true on this very first render, server and
  // client alike. Same when `initialRev` resolved above — there is nothing
  // left to wait for either way.
  if (!resolved) {
    return null;
  }

  return (
    <SectionRenderer
      nodes={tree.nodes}
      registry={sectionsRegistry}
      sectionData={sectionData}
    />
  );
}
