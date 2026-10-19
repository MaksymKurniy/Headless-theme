import {
  listSettings,
  settingToCss,
  type ComponentSchema,
  type Position,
} from '@basexedit/theme-sdk';

// Helpers for the Settings showcase blocks (app/blocks/Settings*.tsx), which
// exist to try every setting type the editor offers and show what each one
// stores.

/**
 * The CSS a setting of `schema` produces for `value`: what a theme would put in
 * a `style` attribute. `undefined` when the value has no CSS form (or none was
 * chosen yet).
 */
export function cssOf(
  schema: ComponentSchema,
  id: string,
  value: unknown,
): string | undefined {
  const setting = listSettings(schema.settings).find(
    (candidate) => candidate.id === id,
  );
  return setting ? settingToCss(setting, value)?.[''] : undefined;
}

const FLEX = {top: 'flex-start', left: 'flex-start', center: 'center', bottom: 'flex-end', right: 'flex-end'} as const;

/** A `position` setting (`top left`, `center center`, …) as flexbox alignment. */
export function positionToFlex(position: Position | undefined): {
  alignItems: string;
  justifyContent: string;
} {
  const [vertical, horizontal] = (position ?? 'center center').split(' ') as [
    keyof typeof FLEX,
    keyof typeof FLEX,
  ];
  return {alignItems: FLEX[vertical], justifyContent: FLEX[horizontal]};
}
