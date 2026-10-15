import {createSchema} from '@basexedit/theme-sdk';

export interface ButtonProps {
  label?: string;
  url?: string;
}

export default function Button({label, url}: ButtonProps) {
  if (!label) return null;
  return (
    <a href={url || '#'} className="block-button">
      {label}
    </a>
  );
}

export const schema = createSchema({
  name: 'Button',
  settings: [
    {type: 'text', id: 'label', label: 'Label', default: 'Shop now'},
    {type: 'url', id: 'url', label: 'Link'},
  ],
  presets: [{name: 'Button'}],
});
