import Script from "next/script";

/**
 * AdSense loader (spec §9).
 *
 *   - Rendered only in production with a configured client ID (gated
 *     in the root layout), so dev/preview builds stay script-free.
 *   - `afterInteractive` defers loading until hydration has run —
 *     keeps Core Web Vitals honest without being so late that
 *     AdSense's verification crawler misses the script.
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
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src={`${ADSENSE_SRC}?client=${encodeURIComponent(clientId)}`}
      crossOrigin="anonymous"
    />
  );
}
