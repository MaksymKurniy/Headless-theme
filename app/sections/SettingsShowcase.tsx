import {createSchema, type PaddingsValue} from '@basexedit/theme-sdk';
import type {ReactNode} from 'react';
import {cssOf} from '~/lib/showcase';

// A section for trying every setting type: its own few settings, and room for
// the three Settings* blocks, which between them use all the others. Put it on
// a page, select it and its blocks in the editor, change a value and watch it
// change here.

export interface SettingsShowcaseProps {
  heading?: string;
  background?: string;
  paddings?: PaddingsValue;
  children?: ReactNode;
}

export default function SettingsShowcase({
  heading,
  background,
  paddings,
  children,
}: SettingsShowcaseProps) {
  return (
    <section
      className="showcase"
      style={{
        background: cssOf(schema, 'background', background),
        padding: cssOf(schema, 'paddings', paddings),
      }}
    >
      <h2
        className="showcase__heading"
        dangerouslySetInnerHTML={{__html: heading || 'Settings showcase'}}
      />
      <div className="showcase__blocks">{children}</div>
    </section>
  );
}

export const schema = createSchema({
  name: 'Settings showcase',
  settings: [
    {
      type: 'inline_richtext',
      id: 'heading',
      label: 'Heading',
      default: 'Settings <em>showcase</em>',
    },
    {type: 'color_background', id: 'background', label: 'Background'},
    {
      type: 'paddings',
      id: 'paddings',
      label: 'Padding',
      default: {top: 24, right: 16, bottom: 24, left: 16},
    },
  ],
  blocks: [{type: '@theme'}],
  presets: [
    {
      name: 'Settings showcase',
      blocks: [
        {type: 'settings-text'},
        {type: 'settings-layout'},
        {type: 'settings-store'},
      ],
    },
  ],
});
