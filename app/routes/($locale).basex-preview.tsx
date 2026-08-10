import type {Route} from './+types/basex-preview';
import {SectionRenderer, isDesignMode, useThemeBridge, type BasexTree} from '@basexedit/theme-sdk';
import {sectionsRegistry} from '~/editor/sections.config';
import homeConfig from '~/editor/pages/home.json';

// Standalone pilot route for wiring up @basexedit/theme-sdk: no Header/Footer/
// PageLayout, no storefront queries — just the section tree. The design-mode
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
export function loader({request}: Route.LoaderArgs) {
  return {designMode: isDesignMode(new URL(request.url).search)};
}

export default function BasexPreview({loaderData}: Route.ComponentProps) {
  const {tree, resolved} = useThemeBridge({
    registry: sectionsRegistry,
    initialTree: homeConfig as BasexTree,
    designMode: loaderData.designMode,
  });

  // While waiting to hear from the editor host what to show (see
  // useThemeBridge's `resolved`), don't render the theme's default content at
  // all — that used to be exactly the "content updates in front of your
  // eyes" flash. A real shopper never sees this: designMode is false for
  // them, so `resolved` is already true on this very first render, server and
  // client alike.
  if (!resolved) {
    return null;
  }

  return <SectionRenderer nodes={tree.nodes} registry={sectionsRegistry} />;
}
