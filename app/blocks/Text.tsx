import {createSchema} from '@basexedit/theme-sdk';

export interface TextProps {
  text?: string;
}

export default function Text({text}: TextProps) {
  if (!text) return null;
  return <p className="block-text">{text}</p>;
}

export const schema = createSchema({
  name: 'Text',
  settings: [{type: 'richtext', id: 'text', label: 'Text', default: 'Some text'}],
});
