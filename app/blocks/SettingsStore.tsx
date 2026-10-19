import {createSchema, parseVideoUrl} from '@basexedit/theme-sdk';
import {ShowcaseValues} from '~/components/ShowcaseValues';

// Files, links, store resources and lists of them. Resource settings store a
// handle (an article, `<blog>/<article>`; a file, its URL), which is all this
// block prints — a real section would look it up in a `loader`, as
// FeaturedCollection does.

export interface SettingsStoreProps {
  image?: string;
  video?: string;
  videoUrl?: string;
  collection?: string;
  product?: string;
  blog?: string;
  article?: string;
  page?: string;
  menu?: string;
  author?: string;
  featured?: string[];
  tags?: string[];
  gallery?: string[];
  numbers?: number[];
}

export default function SettingsStore(props: SettingsStoreProps) {
  const embed = props.videoUrl ? parseVideoUrl(props.videoUrl) : null;
  return (
    <div className="showcase-block">
      <h3 className="showcase-block__title">Files, links and store data</h3>
      {props.image ? (
        <img className="showcase-block__image" src={props.image} alt="" />
      ) : null}
      {props.video ? (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video className="showcase-block__video" src={props.video} controls />
      ) : null}
      {embed ? (
        <iframe
          className="showcase-block__video"
          src={embed.embedUrl}
          title={`${embed.provider} video`}
          allowFullScreen
        />
      ) : null}
      {props.tags?.length ? (
        <ul className="showcase-block__tags">
          {props.tags.map((tag, index) => (
            <li key={`${tag}-${index}`}>{tag}</li>
          ))}
        </ul>
      ) : null}
      {props.gallery?.length ? (
        <div className="showcase-block__gallery">
          {props.gallery.map((src, index) => (
            <img key={`${src}-${index}`} src={src} alt="" />
          ))}
        </div>
      ) : null}
      <ShowcaseValues
        values={[
          ['image_picker', props.image],
          ['video', props.video],
          ['video_url', props.videoUrl],
          ['video_url (parsed)', embed ? `${embed.provider}: ${embed.id}` : null],
          ['collection', props.collection],
          ['product', props.product],
          ['blog', props.blog],
          ['article', props.article],
          ['page', props.page],
          ['link_list', props.menu],
          ['metaobject (author)', props.author],
          ['array of product', props.featured],
          ['array of text', props.tags],
          ['array of image_picker', props.gallery],
          ['array of number', props.numbers],
        ]}
      />
    </div>
  );
}

export const schema = createSchema({
  name: 'Settings: files, links and store data',
  settings: [
    {type: 'header', content: 'Media', collapsible: true},
    {type: 'image_picker', id: 'image', label: 'Image'},
    {type: 'video', id: 'video', label: 'Video file'},
    {type: 'video_url', id: 'videoUrl', label: 'Video link (YouTube or Vimeo)'},
    {type: 'header', content: 'Store', collapsible: true, collapsed: true},
    {type: 'collection', id: 'collection', label: 'Collection'},
    {type: 'product', id: 'product', label: 'Product'},
    {type: 'blog', id: 'blog', label: 'Blog'},
    {type: 'article', id: 'article', label: 'Article'},
    {type: 'page', id: 'page', label: 'Page'},
    {type: 'link_list', id: 'menu', label: 'Menu'},
    {
      type: 'metaobject',
      id: 'author',
      label: 'Author',
      metaobjectType: 'author',
    },
    {type: 'header', content: 'Lists', collapsible: true, collapsed: true},
    {
      type: 'array',
      id: 'featured',
      label: 'Featured products',
      itemLabel: 'Product',
      of: {type: 'product'},
      limit: 4,
    },
    {
      type: 'array',
      id: 'tags',
      label: 'Tags',
      itemLabel: 'Tag',
      of: {type: 'text'},
    },
    {
      type: 'array',
      id: 'gallery',
      label: 'Gallery',
      itemLabel: 'Picture',
      of: {type: 'image_picker'},
      limit: 6,
    },
    {
      type: 'array',
      id: 'numbers',
      label: 'Numbers',
      itemLabel: 'Number',
      of: {type: 'number', min: 0},
    },
  ],
});
