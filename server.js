// @ts-ignore
// Virtual entry point for the app
import * as remixBuild from 'virtual:remix/server-build';
import {createRequestHandler} from '@shopify/remix-oxygen';
import {storefrontRedirect} from '@shopify/hydrogen';
import {getLoadContext} from 'server-context-getter';

/**
 * Export a fetch handler in module format.
 */
export default {
  /**
   * @param {Request} request
   * @param {Env} env
   * @param {ExecutionContext} executionContext
   * @return {Promise<Response>}
   */
  async fetch(request, env, executionContext) {
    try {
      /**
       * Open a cache instance in the worker and a custom session instance.
       */
      if (!env?.SESSION_SECRET) {
        throw new Error('SESSION_SECRET environment variable is not set');
      }

      // this is pretty ugly but we need to pre-create the Remix Context to have access to the storefront later in this function
      const {session, storefront, customerAccount, cart, waitUntil} =
        await getLoadContext(env, executionContext)(request);

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          session,
          waitUntil,
          storefront,
          ...(customerAccount && {customerAccount}),
          cart,
          env,
        }),
      });

      const response = await handleRequest(request);

      if (session.isPending) {
        response.headers.set('Set-Cookie', await session.commit());
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

/** @typedef {import('@shopify/remix-oxygen').AppLoadContext} AppLoadContext */
