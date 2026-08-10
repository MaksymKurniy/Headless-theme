import type {Registry} from '@basexedit/theme-sdk';
import {Hero, schema as heroSchema} from '~/sections/Hero';

// Registry key -> component + schema. Sections and blocks are registered the
// same way here; a "block" is just a node type another node's schema is
// allowed to nest as a child (see Hero.schema's `blocks`, once it has any).
export const sectionsRegistry: Registry = {
  hero: {component: Hero, schema: heroSchema},
};
