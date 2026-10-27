import {createSchema, type TextAlignment} from '@basexedit/theme-sdk';
import {ShowcaseValues} from '~/components/ShowcaseValues';

// One of the three "Settings showcase" blocks: it exists to try every setting
// type the editor offers and to show what each one stores. This one holds the
// text-like and single-value types; SettingsLayout the composite ones;
// SettingsStore the files, links and store resources.

export interface SettingsTextProps {
  title?: string;
  notes?: string;
  body?: string;
  tagline?: string;
  embed?: string;
  link?: string;
  count?: number;
  opacity?: number;
  emphasis?: boolean;
  tone?: string;
  accent?: string;
  align?: TextAlignment;
}

export default function SettingsText(props: SettingsTextProps) {
  const {title, notes, body, tagline, embed, link, count, opacity, emphasis} =
    props;
  return (
    <div
      className="showcase-block"
      style={{
        textAlign: props.align,
        borderColor: props.accent,
        opacity: opacity === undefined ? undefined : opacity / 100,
        fontWeight: emphasis ? 700 : undefined,
      }}
    >
      <h3 className="showcase-block__title">{title || 'Text and values'}</h3>
      {tagline ? (
        <p dangerouslySetInnerHTML={{__html: tagline}} />
      ) : null}
      {body ? (
        <div className="showcase-block__rich" dangerouslySetInnerHTML={{__html: body}} />
      ) : null}
      {embed ? (
        <div className="showcase-block__embed" dangerouslySetInnerHTML={{__html: embed}} />
      ) : null}
      {link ? <a href={link}>{link}</a> : null}
      <ShowcaseValues
        values={[
          ['text', title],
          ['textarea', notes],
          ['richtext', body],
          ['inline_richtext', tagline],
          ['html', embed],
          ['url', link],
          ['number', count],
          ['range (opacity %)', opacity],
          ['checkbox', emphasis],
          ['select', props.tone],
          ['color', props.accent],
          ['text_alignment', props.align],
        ]}
      />
    </div>
  );
}

export const schema = createSchema({
  name: 'Settings: text and values',
  settings: [
    {type: 'header', content: 'Text', collapsible: true},
    {type: 'text', id: 'title', label: 'Title', default: 'Text and values'},
    {type: 'textarea', id: 'notes', label: 'Notes (several lines)'},
    {type: 'richtext', id: 'body', label: 'Body (rich text)'},
    {type: 'inline_richtext', id: 'tagline', label: 'Tagline (one line)'},
    {type: 'html', id: 'embed', label: 'HTML embed'},
    {type: 'link', id: 'link', label: 'Link'},
    {type: 'header', content: 'Values', collapsible: true},
    {type: 'number', id: 'count', label: 'Count', min: 0, max: 99, default: 3},
    {
      type: 'range',
      id: 'opacity',
      label: 'Opacity',
      min: 20,
      max: 100,
      step: 5,
      unit: '%',
      default: 100,
    },
    {type: 'checkbox', id: 'emphasis', label: 'Bold'},
    {
      type: 'select',
      id: 'tone',
      label: 'Tone',
      default: 'calm',
      options: [
        {value: 'calm', label: 'Calm'},
        {value: 'loud', label: 'Loud'},
      ],
    },
    {type: 'color', id: 'accent', label: 'Accent colour', default: '#2563eb'},
    {
      type: 'text_alignment',
      id: 'align',
      label: 'Text alignment',
      default: 'left',
    },
  ],
});
