"use client";

/**
 * Lazy-loaded AdSense script (spec §9).
 *
 *   - Only loads in production (gated by caller) and only when a
 *     client ID is configured.
 *   - Uses `next/script` with `strategy="lazyOnload"` so the page is
 *     interactive before the ~200kB AdSense loader arrives. That keeps
 *     Core Web Vitals honest.
 *   - Waits for the user's explicit consent; if they rejected cookies
 *     we never load AdSense at all.
 *
 * Auto Ads are enabled by default — placement of individual slots is
 * handled by the `<AdSlot* />` components. You can toggle Auto Ads in
 * the AdSense dashboard without changing code.
 */

import Script from "next/script";

import { useConsentValue } from "@/components/site/ConsentBanner";

export const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";

export interface AdSenseScriptProps {
  clientId: string;
}

export function AdSenseScript({ clientId }: AdSenseScriptProps) {
  const consent = useConsentValue();
  if (consent !== "granted") return null;

  return (
    <Script
      id="adsbygoogle-init"
      strategy="lazyOnload"
      src={`${ADSENSE_SRC}?client=${encodeURIComponent(clientId)}`}
      crossOrigin="anonymous"
    />
  );
}
