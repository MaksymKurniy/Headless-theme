import {createSchema} from '@basexedit/theme-sdk';

export interface TextProps {
  text?: string;
}

// `richtext` stores HTML (see the Hero's subheading), so this is markup to
// render. A value saved before it was rich text is a plain string, which is
// fine here too.
export default function Text({text}: TextProps) {
  if (!text) return null;
  return (
    <div className="block-text" dangerouslySetInnerHTML={{__html: text}} />
  );
}

export const schema = createSchema({
  name: 'Text',
  settings: [
    {type: 'richtext', id: 'text', label: 'Text', default: 'Some text'},
  ],
});
