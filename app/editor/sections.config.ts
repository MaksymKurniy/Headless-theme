import type {Registry} from '@basexedit/theme-sdk';
import {
  FeaturedCollection,
  loader as featuredCollectionLoader,
  schema as featuredCollectionSchema,
} from '~/sections/FeaturedCollection';
import {Hero, schema as heroSchema} from '~/sections/Hero';

// Registry key -> component + schema (+ loader, for a section that needs store
// data). Sections and blocks are registered the same way here; a "block" is
// just a node type another node's schema is allowed to nest as a child (see
// Hero.schema's `blocks`, once it has any).
//
// A section's `loader` is run by loadSectionData() in the route that renders
// the page, once per instance of the section, with that instance's settings —
// so a new data-driven section is one entry here, never a route change.
export const sectionsRegistry: Registry = {
  hero: {component: Hero, schema: heroSchema},
  'featured-collection': {
    component: FeaturedCollection,
    schema: featuredCollectionSchema,
    loader: featuredCollectionLoader,
  },
};
