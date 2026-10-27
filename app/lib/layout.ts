import {
  listSettings,
  settingToCss,
  type ComponentSchema,
  type Position,
} from '@basexedit/theme-sdk';

// Helpers for blocks that turn layout settings (`position`, `paddings`, `size`)
// into CSS: the Group block and the Settings showcase blocks.

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

/**
 * A `position` setting (`top left`, `center center`, …) as flexbox alignment.
 * The position reads vertical-then-horizontal whatever the direction is, so in a
 * `column` the two axes swap: the vertical part is the main axis.
 */
export function positionToFlex(
  position: Position | undefined,
  direction: 'row' | 'column' = 'row',
): {
  alignItems: string;
  justifyContent: string;
} {
  const [vertical, horizontal] = (position ?? 'center center').split(' ') as [
    keyof typeof FLEX,
    keyof typeof FLEX,
  ];
  return direction === 'row'
    ? {alignItems: FLEX[vertical], justifyContent: FLEX[horizontal]}
    : {alignItems: FLEX[horizontal], justifyContent: FLEX[vertical]};
}
