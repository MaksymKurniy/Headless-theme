import {createRegistry, type RegistryModule} from '@basexedit/theme-sdk';

// The folder decides what a file is: `sections/*.tsx` are sections, `blocks/*.tsx`
// are blocks. The file name is the registry key (Hero.tsx -> "hero",
// FeaturedCollection.tsx -> "featured-collection") — the string a saved page
// stores as `node.type`, so renaming a file renames the type. A block whose
// file starts with `_` is private: a schema's `blocks` accepts it only when it
// names it explicitly (`@theme` covers public blocks only).
//
// Each file exports its component as default, `schema`, and optionally `loader`.
// Globs are relative on purpose: Vite resolves `~` through tsconfig paths, not
// through its own alias table, which `import.meta.glob` uses.
export const sectionsRegistry = createRegistry({
  sections: import.meta.glob<RegistryModule>('../sections/*.tsx', {eager: true}),
  blocks: import.meta.glob<RegistryModule>('../blocks/*.tsx', {eager: true}),
});
