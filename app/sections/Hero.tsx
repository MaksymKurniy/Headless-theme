import {createSchema} from '@basexedit/theme-sdk';
import type {ReactNode} from 'react';

export interface HeroProps {
  heading: string;
  subheading?: string;
  image?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  children?: ReactNode;
}

export function Hero({heading, subheading, image, ctaLabel, ctaUrl, children}: HeroProps) {
  return (
    <section className="hero">
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
  ],
  presets: [
    {
      name: 'Default hero',
      settings: {heading: 'New season, new looks', ctaUrl: '/collections/all', ctaLabel: 'Shop now'},
    },
  ],
});
