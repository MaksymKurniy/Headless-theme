import {createSchema} from '@basexedit/theme-sdk';

export interface BadgeProps {
  text?: string;
}

export default function Badge({text}: BadgeProps) {
  if (!text) return null;
  return <span className="block-badge">{text}</span>;
}

export const schema = createSchema({
  name: 'Badge',
  settings: [{type: 'text', id: 'text', label: 'Text', default: 'New'}],
});
