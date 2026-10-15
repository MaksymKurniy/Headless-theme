import {createSchema} from '@basexedit/theme-sdk';
import type {ReactNode} from 'react';

export interface GroupProps {
  children?: ReactNode;
}

export default function Group({children}: GroupProps) {
  return <div className="block-group">{children}</div>;
}

export const schema = createSchema({
  name: 'Group',
  settings: [],
  blocks: [{type: '@theme'}],
});
