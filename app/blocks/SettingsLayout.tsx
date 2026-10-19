import {
  createSchema,
  type PaddingsValue,
  type Position,
  type SizeValue,
  type TextAlignment,
} from '@basexedit/theme-sdk';
import {ShowcaseValues} from '~/components/ShowcaseValues';
import {cssOf, positionToFlex} from '~/lib/showcase';

// The composite setting types: position, paddings, size, a background and a
// palette. The box below uses each one the way a theme would — through the CSS
// the SDK gives for the value (`settingToCss`).

export interface SettingsLayoutProps {
  position?: Position;
  paddings?: PaddingsValue;
  width?: SizeValue;
  height?: SizeValue;
  background?: string;
  align?: TextAlignment;
  palette?: Record<string, string>;
}

export default function SettingsLayout(props: SettingsLayoutProps) {
  const {palette} = props;
  return (
    <div className="showcase-block">
      <h3 className="showcase-block__title">Layout</h3>
      <div
        className="showcase-layout"
        style={{
          display: 'flex',
          ...positionToFlex(props.position),
          background: cssOf(schema, 'background', props.background),
          padding: cssOf(schema, 'paddings', props.paddings),
          width: cssOf(schema, 'width', props.width),
          minHeight: cssOf(schema, 'height', props.height),
          textAlign: props.align,
        }}
      >
        <div
          className="showcase-layout__box"
          style={{
            background: palette?.surface,
            color: palette?.text,
            borderColor: palette?.accent,
          }}
        >
          Box
        </div>
      </div>
      <ShowcaseValues
        values={[
          ['position', props.position],
          ['paddings', props.paddings],
          ['size (width)', props.width],
          ['size (height)', props.height],
          ['color_background', props.background],
          ['text_alignment', props.align],
          ['color_palette', props.palette],
        ]}
      />
    </div>
  );
}

export const schema = createSchema({
  name: 'Settings: layout',
  settings: [
    {type: 'header', content: 'Box', collapsible: true},
    {
      type: 'position',
      id: 'position',
      label: 'Box position',
      default: 'center center',
    },
    {type: 'text_alignment', id: 'align', label: 'Text alignment'},
    {type: 'size', id: 'width', label: 'Width', default: {mode: 'full'}},
    {type: 'size', id: 'height', label: 'Height', default: {mode: 'auto'}},
    {
      type: 'paddings',
      id: 'paddings',
      label: 'Padding',
      min: 0,
      max: 120,
      default: {top: 16, right: 16, bottom: 16, left: 16},
    },
    {type: 'header', content: 'Colours', collapsible: true},
    {
      type: 'color_background',
      id: 'background',
      label: 'Background',
      default: '#f3f4f6',
    },
    {
      type: 'color_palette',
      id: 'palette',
      label: 'Box colours',
      colors: [
        {id: 'text', label: 'Text'},
        {id: 'surface', label: 'Surface'},
        {id: 'accent', label: 'Border'},
      ],
      default: {text: '#111827', surface: '#ffffff', accent: '#2563eb'},
    },
  ],
});
