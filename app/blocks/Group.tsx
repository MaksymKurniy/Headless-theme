import {
  createSchema,
  type PaddingsValue,
  type Position,
  type SizeValue,
} from '@basexedit/theme-sdk';
import type {CSSProperties, ReactNode} from 'react';
import {useRouteLoaderData} from 'react-router';
import {cssOf, positionToFlex} from '~/lib/layout';
import type {RootLoader} from '~/root';

// A box that lays its blocks out: direction, alignment, gap, size, padding, a
// border, a background and an optional link over the whole box. A value that
// was never set adds no CSS, so a group saved before it had settings renders as
// the plain container it was.
//
// Direction, alignment, gap and padding are published as custom properties
// (`--group-*`) that `.block-group` in app.css reads. A group can have its own
// set for mobile (`--group-m-*`), which a media query in app.css switches to —
// inline `flex-direction` and friends could not be overridden from a stylesheet.

type Direction = 'row' | 'column';
type BorderStyle = 'solid' | 'dashed' | 'dotted';
type BackgroundSize = 'cover' | 'contain';

// What the editor shows for a setting nothing is stored for — the schema's
// `default`s and the fallbacks below come from here, so they cannot drift apart.
const DEFAULTS = {
  direction: 'column',
  position: 'top left',
  spaceBetween: false,
  borderStyle: 'solid',
  borderColor: '#000000',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
} as const satisfies {
  direction: Direction;
  position: Position;
  spaceBetween: boolean;
  borderStyle: BorderStyle;
  borderColor: string;
  backgroundSize: BackgroundSize;
  backgroundPosition: Position;
};

const DIRECTION_OPTIONS = [
  {value: 'column', label: 'Vertical'},
  {value: 'row', label: 'Horizontal'},
];

// The same range for the desktop and the mobile gap, and the same for padding.
const GAP = {min: 0, max: 120, step: 4, unit: 'px', default: 0} as const;
const PADDINGS = {
  min: 0,
  max: 200,
  default: {top: 0, right: 0, bottom: 0, left: 0},
} as const;

export interface GroupProps {
  direction?: Direction;
  position?: Position;
  gap?: number;
  spaceBetween?: boolean;
  width?: SizeValue;
  height?: SizeValue;
  paddings?: PaddingsValue;
  mobileLayout?: boolean;
  mobileDirection?: Direction;
  mobilePosition?: Position;
  mobileGap?: number;
  mobileSpaceBetween?: boolean;
  mobilePaddingsOn?: boolean;
  mobilePaddings?: PaddingsValue;
  borderWidth?: number;
  borderStyle?: BorderStyle;
  borderColor?: string;
  borderRadius?: number;
  background?: string;
  backgroundImage?: string;
  backgroundSize?: BackgroundSize;
  backgroundPosition?: Position;
  link?: string;
  openInNewTab?: boolean;
  linkLabel?: string;
  children?: ReactNode;
}

interface FlexLayout {
  direction: Direction;
  position: Position;
  spaceBetween: boolean;
  gap: string | undefined;
}

/**
 * The flex layout as custom properties: `--group-direction`, `-align`,
 * `-justify` and `-gap` for the `group` prefix, `--group-m-*` for `group-m`.
 * Space between spreads the blocks along the direction, so the position then
 * only aligns them across it.
 */
function layoutVars(
  prefix: 'group' | 'group-m',
  {direction, position, spaceBetween, gap}: FlexLayout,
): Record<string, string> {
  const flex = positionToFlex(position, direction);
  return {
    [`--${prefix}-direction`]: direction,
    [`--${prefix}-align`]: flex.alignItems,
    [`--${prefix}-justify`]: spaceBetween ? 'space-between' : flex.justifyContent,
    [`--${prefix}-gap`]: gap ?? '0',
  };
}

/**
 * Every desktop property is always set, so a group inside another one never
 * inherits the outer one's. The mobile ones are only set when that override is
 * on, and the class that makes app.css read them is only added then too.
 */
function groupVars(props: GroupProps): Record<string, string> {
  return {
    ...layoutVars('group', {
      direction: props.direction ?? DEFAULTS.direction,
      position: props.position ?? DEFAULTS.position,
      spaceBetween: props.spaceBetween ?? DEFAULTS.spaceBetween,
      gap: cssOf(schema, 'gap', props.gap),
    }),
    '--group-padding': cssOf(schema, 'paddings', props.paddings) ?? '0',
    ...(props.mobileLayout
      ? layoutVars('group-m', {
          direction: props.mobileDirection ?? DEFAULTS.direction,
          position: props.mobilePosition ?? DEFAULTS.position,
          spaceBetween: props.mobileSpaceBetween ?? DEFAULTS.spaceBetween,
          gap: cssOf(schema, 'mobileGap', props.mobileGap),
        })
      : {}),
    ...(props.mobilePaddingsOn
      ? {
          '--group-m-padding':
            cssOf(schema, 'mobilePaddings', props.mobilePaddings) ?? '0',
        }
      : {}),
  };
}

const GRADIENT = /gradient\(/i;

/**
 * `background` is a colour or a gradient (a gradient is an image to CSS). The
 * picked image goes on top of it. Longhands only: a `background` shorthand
 * would reset the image whenever React re-applies the style.
 */
function backgroundCss({
  background,
  backgroundImage,
  backgroundSize = DEFAULTS.backgroundSize,
  backgroundPosition = DEFAULTS.backgroundPosition,
}: GroupProps): CSSProperties {
  const isGradient = background !== undefined && GRADIENT.test(background);
  const layers = [
    backgroundImage ? `url(${JSON.stringify(backgroundImage)})` : '',
    isGradient ? background : '',
  ].filter(Boolean);

  return {
    backgroundColor: background && !isGradient ? background : undefined,
    backgroundImage: layers.length > 0 ? layers.join(', ') : undefined,
    ...(backgroundImage
      ? {
          backgroundPosition,
          backgroundRepeat: 'no-repeat',
          backgroundSize,
        }
      : {}),
  };
}

function borderCss({
  borderWidth,
  borderStyle: style = DEFAULTS.borderStyle,
  borderColor = DEFAULTS.borderColor,
}: GroupProps): CSSProperties {
  const width = cssOf(schema, 'borderWidth', borderWidth);
  return borderWidth && width ? {border: `${width} ${style} ${borderColor}`} : {};
}

export default function Group(props: GroupProps) {
  const {link, openInNewTab, linkLabel, children} = props;

  // In the editor a click selects a block and never follows a link, and the
  // link below covers the whole group — so the blocks inside could not be
  // picked with the mouse. It is left out there. The flag comes from the root
  // loader, which reads the URL on the server, so both renders agree.
  const designMode = useRouteLoaderData<RootLoader>('root')?.designMode ?? false;
  const linked = Boolean(link) && !designMode;

  const className = [
    'block-group',
    linked && 'block-group--linked',
    props.mobileLayout && 'block-group--mobile-layout',
    props.mobilePaddingsOn && 'block-group--mobile-padding',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      style={{
        ...groupVars(props),
        width: cssOf(schema, 'width', props.width),
        height: cssOf(schema, 'height', props.height),
        borderRadius: cssOf(schema, 'borderRadius', props.borderRadius),
        ...borderCss(props),
        ...backgroundCss(props),
      }}
    >
      {linked ? (
        <a
          className="block-group__link"
          href={link}
          aria-label={linkLabel || link}
          {...(openInNewTab ? {target: '_blank', rel: 'noopener noreferrer'} : {})}
        />
      ) : null}
      {children}
    </div>
  );
}

export const schema = createSchema({
  name: 'Group',
  settings: [
    {type: 'header', content: 'Layout', collapsible: true},
    {
      type: 'select',
      id: 'direction',
      label: 'Direction',
      options: DIRECTION_OPTIONS,
      default: DEFAULTS.direction,
    },
    {
      type: 'position',
      id: 'position',
      label: 'Content position',
      default: DEFAULTS.position,
    },
    {type: 'range', id: 'gap', label: 'Gap', ...GAP},
    {
      type: 'checkbox',
      id: 'spaceBetween',
      label: 'Space between',
      helpText:
        'Spreads the blocks along the direction, first to last edge. The position then only aligns them across it.',
      default: DEFAULTS.spaceBetween,
    },
    {type: 'header', content: 'Size', collapsible: true},
    {type: 'size', id: 'width', label: 'Width', default: {mode: 'auto'}},
    {type: 'size', id: 'height', label: 'Height', default: {mode: 'auto'}},
    {type: 'header', content: 'Spacing', collapsible: true},
    {type: 'paddings', id: 'paddings', label: 'Padding', ...PADDINGS},
    {type: 'header', content: 'Mobile', collapsible: true},
    {
      type: 'checkbox',
      id: 'mobileLayout',
      label: 'Different layout on mobile',
      helpText:
        'Applies on screens up to 720px wide. Set the layout below once it is on.',
      default: false,
    },
    {
      type: 'select',
      id: 'mobileDirection',
      label: 'Mobile direction',
      options: DIRECTION_OPTIONS,
      default: DEFAULTS.direction,
      visibleIf: 'mobileLayout',
    },
    {
      type: 'position',
      id: 'mobilePosition',
      label: 'Mobile content position',
      default: DEFAULTS.position,
      visibleIf: 'mobileLayout',
    },
    {
      type: 'range',
      id: 'mobileGap',
      label: 'Mobile gap',
      ...GAP,
      visibleIf: 'mobileLayout',
    },
    {
      type: 'checkbox',
      id: 'mobileSpaceBetween',
      label: 'Mobile space between',
      default: DEFAULTS.spaceBetween,
      visibleIf: 'mobileLayout',
    },
    {
      type: 'checkbox',
      id: 'mobilePaddingsOn',
      label: 'Different padding on mobile',
      default: false,
    },
    {
      type: 'paddings',
      id: 'mobilePaddings',
      label: 'Mobile padding',
      ...PADDINGS,
      visibleIf: 'mobilePaddingsOn',
    },
    {type: 'header', content: 'Border', collapsible: true},
    {
      type: 'range',
      id: 'borderWidth',
      label: 'Border width',
      min: 0,
      max: 16,
      unit: 'px',
      default: 0,
    },
    {
      type: 'select',
      id: 'borderStyle',
      label: 'Border style',
      options: [
        {value: 'solid', label: 'Solid'},
        {value: 'dashed', label: 'Dashed'},
        {value: 'dotted', label: 'Dotted'},
      ],
      default: DEFAULTS.borderStyle,
      visibleIf: 'borderWidth > 0',
    },
    {
      type: 'color',
      id: 'borderColor',
      label: 'Border colour',
      default: DEFAULTS.borderColor,
      visibleIf: 'borderWidth > 0',
    },
    {
      type: 'range',
      id: 'borderRadius',
      label: 'Corner radius',
      min: 0,
      max: 64,
      unit: 'px',
      default: 0,
    },
    {type: 'header', content: 'Background', collapsible: true},
    {type: 'color_background', id: 'background', label: 'Background'},
    {type: 'image_picker', id: 'backgroundImage', label: 'Background image'},
    {
      type: 'select',
      id: 'backgroundSize',
      label: 'Image size',
      options: [
        {value: 'cover', label: 'Cover'},
        {value: 'contain', label: 'Contain'},
      ],
      default: DEFAULTS.backgroundSize,
      visibleIf: 'backgroundImage',
    },
    {
      type: 'position',
      id: 'backgroundPosition',
      label: 'Image position',
      default: DEFAULTS.backgroundPosition,
      visibleIf: 'backgroundImage',
    },
    {type: 'header', content: 'Link', collapsible: true},
    {
      type: 'link',
      id: 'link',
      label: 'Link',
      helpText: 'Leave empty for a group that is not clickable.',
    },
    {
      type: 'checkbox',
      id: 'openInNewTab',
      label: 'Open in a new tab',
      visibleIf: 'link',
    },
    {
      type: 'text',
      id: 'linkLabel',
      label: 'Accessible label',
      helpText: 'Read out by screen readers. The link address is used when empty.',
      visibleIf: 'link',
    },
  ],
  blocks: [{type: '@theme'}],
});
