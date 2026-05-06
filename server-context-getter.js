import {getStorefrontHeaders} from '@shopify/remix-oxygen';
import {
  cartGetIdDefault,
  cartSetIdDefault,
  createCartHandler,
  createStorefrontClient,
  createCustomerAccountClient,
} from '@shopify/hydrogen';

import {AppSession} from '~/lib/session.server';
import {getLocaleFromRequest} from '~/lib/utils';

/** The getLoadContext is used both in server.js, and by Utopia's storyboard.js */
export const getLoadContext =
  (env, executionContext, mockCartID) => async (request) => {
    const waitUntil = executionContext.waitUntil.bind(executionContext);
    const [cache, session] = await Promise.all([
      caches.open('hydrogen'),
      AppSession.init(request, [env.SESSION_SECRET]),
    ]);

    /**
     * Create Hydrogen's Storefront client.
     */
    const {storefront} = createStorefrontClient({
      cache,
      waitUntil,
      i18n: getLocaleFromRequest(request) || {language: 'EN', country: 'US'},
      publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
      storeDomain: env.PUBLIC_STORE_DOMAIN,
      storefrontId: env.PUBLIC_STOREFRONT_ID,
      storefrontHeaders: getStorefrontHeaders(request),
    });

    /**
     * Create a client for Customer Account API.
     */
    const customerAccount = createCustomerAccountClient({
      waitUntil,
      request,
      session,
      customerAccountId: env.PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID,
      shopId: env.SHOP_ID,
    });

    const IS_TEST_ENVIRONMENT = typeof window !== 'undefined';

    const cart = createCartHandler({
      storefront,
      ...(IS_TEST_ENVIRONMENT ? {} : {customerAccount}),
      getCartId:
        mockCartID != null
          ? () => mockCartID
          : cartGetIdDefault(request.headers),
      setCartId: IS_TEST_ENVIRONMENT ? () => {} : cartSetIdDefault(),
      //   cartQueryFragment: CART_QUERY_FRAGMENT,
    });

    return {
      session,
      waitUntil,
      storefront,
      ...(IS_TEST_ENVIRONMENT ? {} : {customerAccount}), // TODO UTOPIA createCustomerAccountClient is unavailable in the hydrogen import in the browser
      cart,
      env,
    };
  };
