import {createThemeSettingsSchema} from '@basexedit/theme-sdk';

// The storefront-wide settings the editor shows under "Theme settings". Each
// one that names a `cssVar` is published on `:root` by <ThemeSettingsProvider>
// (see root.tsx), so styles read it as `var(--name)`; the rest (the logo) are
// read in components with `useThemeSetting('id')`. The defaults here are what
// the theme looked like before it had any settings, and the fallbacks in
// styles/app.css repeat them, so a missing value never breaks the layout.
//
// What the user picked is saved to `theme-settings.json` next to this file.

const FONT_OPTIONS = [
  {value: 'system-ui, sans-serif', label: 'System'},
  {value: 'Georgia, serif', label: 'Georgia'},
  {value: '"Times New Roman", Times, serif', label: 'Times'},
  {value: '"Courier New", monospace', label: 'Courier'},
];

export const themeSettingsSchema = createThemeSettingsSchema({
  groups: [
    {
      id: 'logo',
      name: 'Logo',
      settings: [
        {type: 'image_picker', id: 'logo', label: 'Logo'},
        {
          type: 'range',
          id: 'logo_width',
          label: 'Logo width',
          min: 40,
          max: 240,
          step: 4,
          unit: 'px',
          default: 120,
          cssVar: '--logo-width',
        },
      ],
    },
    {
      id: 'colors',
      name: 'Colors',
      settings: [
        {
          type: 'color',
          id: 'color_background',
          label: 'Background',
          default: '#ffffff',
          cssVar: '--color-light',
        },
        {
          type: 'color',
          id: 'color_text',
          label: 'Text',
          default: '#000000',
          cssVar: '--color-dark',
        },
        {
          type: 'color',
          id: 'color_accent',
          label: 'Accent',
          default: '#2563eb',
          cssVar: '--color-accent',
        },
      ],
    },
    {
      id: 'typography',
      name: 'Typography',
      settings: [
        {
          type: 'select',
          id: 'font_heading',
          label: 'Heading font',
          default: 'system-ui, sans-serif',
          options: FONT_OPTIONS,
          cssVar: '--font-heading',
        },
        {
          type: 'select',
          id: 'font_body',
          label: 'Body font',
          default: 'system-ui, sans-serif',
          options: FONT_OPTIONS,
          cssVar: '--font-body',
        },
        {
          type: 'range',
          id: 'font_size_base',
          label: 'Base font size',
          min: 12,
          max: 20,
          unit: 'px',
          default: 16,
          cssVar: '--font-size-base',
        },
      ],
    },
    {
      id: 'layout',
      name: 'Layout',
      settings: [
        {
          type: 'range',
          id: 'container_width',
          label: 'Page width',
          min: 960,
          max: 1600,
          step: 20,
          unit: 'px',
          default: 1280,
          cssVar: '--container-width',
        },
        {
          type: 'range',
          id: 'corner_radius',
          label: 'Corner radius',
          min: 0,
          max: 24,
          unit: 'px',
          default: 4,
          cssVar: '--radius',
        },
      ],
    },
  ],
});
