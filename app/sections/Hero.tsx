import {
  createSchema,
  type PaddingsValue,
  type TextAlignment,
} from '@basexedit/theme-sdk';
import type {ReactNode} from 'react';

export interface HeroProps {
  heading: string;
  subheading?: string;
  image?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  align?: TextAlignment;
  padding?: PaddingsValue;
  children?: ReactNode;
}

export default function Hero({
  heading,
  subheading,
  image,
  ctaLabel,
  ctaUrl,
  align,
  padding,
  children,
}: HeroProps) {
  return (
    <section
      className="hero"
      style={{
        textAlign: align,
        padding: padding
          ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
          : undefined,
      }}
    >
      {image ? <img src={image} alt="" className="hero__image" /> : null}
      <div className="hero__content">
        <h1>{heading}</h1>
        {subheading ? <p className="hero__subheading">{subheading}</p> : null}
        {ctaLabel && ctaUrl ? (
          <a href={ctaUrl} className="hero__cta">
            {ctaLabel}
          </a>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export const schema = createSchema({
  name: 'Hero',
  settings: [
    {type: 'text', id: 'heading', label: 'Heading', default: 'Welcome'},
    {type: 'richtext', id: 'subheading', label: 'Subheading'},
    {type: 'image_picker', id: 'image', label: 'Background image'},
    {type: 'text', id: 'ctaLabel', label: 'Button label', default: 'Shop now'},
    {type: 'url', id: 'ctaUrl', label: 'Button link'},
    {type: 'header', content: 'Layout', collapsible: true, collapsed: true},
    {type: 'text_alignment', id: 'align', label: 'Text alignment', default: 'left'},
    {type: 'paddings', id: 'padding', label: 'Padding'},
  ],
  blocks: [{type: '@theme'}, {type: '_badge', limit: 1}],
  presets: [
    {
      name: 'Default hero',
      settings: {heading: 'New season, new looks', ctaUrl: '/collections/all', ctaLabel: 'Shop now'},
    },
  ],
});
