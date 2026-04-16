import Script from "next/script";

/**
 * AdSense loader (spec §9).
 *
 *   - Rendered only in production with a configured client ID (gated
 *     in the root layout), so dev/preview builds stay script-free.
 *   - `beforeInteractive` is required so the `<script>` tag is
 *     emitted into the initial server HTML (inside `<head>`). The
 *     AdSense verification crawler does not execute JavaScript, so
 *     `afterInteractive` — which injects the tag client-side after
 *     hydration — is invisible to it and fails site review.
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
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document -- Rule is Pages Router-only; App Router requires beforeInteractive to live in app/layout.tsx (which is where we render this component).
    <Script
      id="adsbygoogle-init"
      strategy="beforeInteractive"
      src={`${ADSENSE_SRC}?client=${encodeURIComponent(clientId)}`}
      crossOrigin="anonymous"
    />
  );
}
