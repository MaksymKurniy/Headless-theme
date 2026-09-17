import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';
import {BASEX_EDITOR_ORIGINS} from '~/editor/basex.config';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    // Hydrogen defaults `frame-ancestors` to 'none', which is the right
    // default for a storefront and fatal for a visual editor: the moment the
    // header below stops being -Report-Only, the browser refuses to render
    // this page inside BaseXEdit's iframe and the editor shows a blank frame
    // with no error anyone can act on. Naming the editor's origins here is
    // what keeps that from happening — and it stays a closed list, so this is
    // not a licence for anyone else to frame the storefront.
    frameAncestors: ["'self'", ...BASEX_EDITOR_ORIGINS],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  // TODO: Remove -Report-Only before publishing to production. This is only for testing CSP in production.
  responseHeaders.set('Content-Security-Policy-Report-Only', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
