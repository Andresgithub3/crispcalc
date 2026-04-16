/**
 * AdSense loader (spec §9).
 *
 *   - Rendered only in production with a configured client ID (gated
 *     in the root layout), so dev/preview builds stay script-free.
 *   - Uses a plain `<script async>` JSX element rather than
 *     `next/script`. React 19 hoists async script tags into the
 *     document `<head>` as real `<script async src>` markup, which
 *     is what the AdSense verification crawler looks for. Every
 *     `next/script` strategy on App Router either defers the tag
 *     behind a client-side loader (`afterInteractive`/`lazyOnload`)
 *     or emits a `<link rel="preload">` + `self.__next_s.push(...)`
 *     pair (`beforeInteractive`) — both are invisible to a
 *     no-JavaScript crawler and cause "Couldn't verify your site".
 *   - Consent Mode v2 (initialised in the root layout to `denied`
 *     by default) controls whether AdSense serves personalized or
 *     non-personalized ads. We intentionally do *not* gate the
 *     script tag itself on the consent cookie: AdSense's crawler
 *     has no cookie, and gating the tag would fail site review.
 */

export const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

export interface AdSenseScriptProps {
  clientId: string;
}

export function AdSenseScript({ clientId }: AdSenseScriptProps) {
  return (
    <script
      async
      src={`${ADSENSE_SRC}?client=${encodeURIComponent(clientId)}`}
      crossOrigin="anonymous"
    />
  );
}
