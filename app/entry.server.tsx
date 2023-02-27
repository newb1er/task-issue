import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import createEmotionServer from "@emotion/server/create-instance";
import { renderToString } from "react-dom/server";

import { ServerStyleContext } from "./context";
import createEmotionCache from "./emotionCache";
import { CacheProvider } from "@emotion/react";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const html = renderToString(
    <ServerStyleContext.Provider value={null}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>
  );

  const chunk = extractCriticalToChunks(html);

  const markup = renderToString(
    <ServerStyleContext.Provider value={chunk.styles}>
      <CacheProvider value={cache}>
        <RemixServer context={remixContext} url={request.url} />
      </CacheProvider>
    </ServerStyleContext.Provider>
  );

  responseHeaders.set("Content-Type", "text/html");

  return new Response("<!DOCTYPE html>" + markup, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
