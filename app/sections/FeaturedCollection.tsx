import {
  createSchema,
  type SectionComponentProps,
  type SectionLoader,
} from '@basexedit/theme-sdk';
import type {HydrogenRouterContextProvider} from '@shopify/hydrogen';
import type {FeaturedCollectionSectionQuery} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

// A section that needs store data: the products of one collection. Placed any
// number of times, on any page, each instance with its own collection — the
// page's route loader never changes, because `loader` below runs once per
// instance, with that instance's settings (see loadSectionData in
// @basexedit/theme-sdk).

export interface FeaturedCollectionSettings {
  heading?: string;
  /** Collection handle, as stored by a `collection` setting. */
  collection?: string;
  productsCount?: number;
}

/** Null when no collection is chosen yet. */
export type FeaturedCollectionData = FeaturedCollectionSectionQuery | null;

const DEFAULT_PRODUCTS_COUNT = 4;
const MAX_PRODUCTS_COUNT = 12;

// Runs on the server only — during the page's SSR, and in the editor through
// the /basex-section-data.json route whenever this section's settings change.
// It is bundled for the browser too (it lives next to the component), so it
// must only reach server things through `context`, never by import.
export const loader: SectionLoader<
  FeaturedCollectionSettings,
  FeaturedCollectionData,
  HydrogenRouterContextProvider
> = async ({settings, context}) => {
  const handle = settings.collection?.trim();
  if (!handle) return null;

  return context.storefront.query(FEATURED_COLLECTION_SECTION_QUERY, {
    variables: {handle, first: productsCount(settings.productsCount)},
  });
};

export function FeaturedCollection({
  heading,
  collection: handle,
  loaderData,
}: SectionComponentProps<FeaturedCollectionSettings, FeaturedCollectionData>) {
  const collection = loaderData?.collection;
  const title = heading || collection?.title;

  return (
    <section className="featured-collection-section">
      {title ? <h2>{title}</h2> : null}
      {collection ? (
        <div className="recommended-products-grid">
          {collection.products.nodes.map((product) => (
            <ProductItem key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <EmptyState handle={handle} loaderData={loaderData} />
      )}
    </section>
  );
}

function EmptyState({
  handle,
  loaderData,
}: {
  handle: string | undefined;
  loaderData: FeaturedCollectionData | undefined;
}) {
  if (!handle?.trim()) return <p>Choose a collection for this section.</p>;
  // undefined means the loader failed (the server log says why) or, in the
  // editor, that it is still running for a section just added — neither is
  // worth a message on the storefront.
  if (loaderData === undefined) return null;
  return <p>Collection “{handle}” was not found.</p>;
}

function productsCount(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return DEFAULT_PRODUCTS_COUNT;
  }
  return Math.min(Math.max(Math.round(value), 1), MAX_PRODUCTS_COUNT);
}

export const schema = createSchema({
  name: 'Featured collection',
  settings: [
    {type: 'text', id: 'heading', label: 'Heading'},
    {type: 'collection', id: 'collection', label: 'Collection'},
    {
      type: 'range',
      id: 'productsCount',
      label: 'Products to show',
      min: 2,
      max: MAX_PRODUCTS_COUNT,
      step: 1,
      default: DEFAULT_PRODUCTS_COUNT,
    },
  ],
  presets: [
    {
      name: 'Featured collection',
      settings: {
        heading: 'Featured collection',
        productsCount: DEFAULT_PRODUCTS_COUNT,
      },
    },
  ],
});

const FEATURED_COLLECTION_SECTION_QUERY = `#graphql
  fragment FeaturedCollectionSectionProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query FeaturedCollectionSection(
    $handle: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      products(first: $first) {
        nodes {
          ...FeaturedCollectionSectionProduct
        }
      }
    }
  }
` as const;
