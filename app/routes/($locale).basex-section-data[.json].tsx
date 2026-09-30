import type {Route} from './+types/basex-section-data[.json]';
import {handleSectionDataRequest} from '@basexedit/theme-sdk';
import {sectionsRegistry} from '~/editor/sections.config';

// Resource route (no page component) the editor preview posts to when a
// section's settings change — e.g. a different collection picked in the
// inspector — so that section's loader runs again with the new settings. See
// useSectionData / handleSectionDataRequest in @basexedit/theme-sdk and
// docs/adr/0012-section-data-loaders.md in the BaseXEdit repo.
//
// Same-origin only (the preview iframe is this storefront), so unlike
// basex-pages.json it sends no CORS headers. It answers 404 outside design
// mode. The `[.json]` suffix keeps it out of the editor's page list, like
// basex-pages.json. Before any section loader reads private data (Admin API,
// unpublished resources), pass `authorize` here — see the SDK's docs on it.
export async function action({request, context}: Route.ActionArgs) {
  return handleSectionDataRequest({
    request,
    context,
    registry: sectionsRegistry,
  });
}

// GET gets the handler's own 405 (404 outside design mode) instead of React
// Router's "no loader" error for a resource route that only has an action.
export async function loader({request, context}: Route.LoaderArgs) {
  return handleSectionDataRequest({
    request,
    context,
    registry: sectionsRegistry,
  });
}
