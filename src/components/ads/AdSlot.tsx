"use client";

/**
 * AdSense placement slots (spec §9).
 *
 * Three variants — `InArticle`, `Sidebar`, `Footer` — plus a
 * `NoAdsForCalculator` wrapper that marks an editorial region as
 * off-limits for both Auto Ads and AI snippets.
 *
 * Slots only render in production with a configured client ID and a
 * per-slot ad slot ID pasted from the AdSense dashboard. In dev (or
 * when IDs are missing) we render a minimal placeholder so the layout
 * stays stable. Consent Mode v2 (set up in the root layout) controls
 * ad personalization, so we don't gate the `<ins>` itself on the
 * consent cookie — AdSense still serves non-personalized ads when
 * consent is denied, which is the intended GDPR behavior.
 */

import { useEffect } from "react";

import { cn } from "@/lib/utils";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
const IS_PROD = process.env.NODE_ENV === "production";

type AdSlotProps = {
  slotId?: string;
  className?: string;
};

function AdSlotBase({
  slotId,
  className,
  layout,
  format = "auto",
  fullWidthResponsive = true,
  label,
}: AdSlotProps & {
  layout?: string;
  format?: string;
  fullWidthResponsive?: boolean;
  label: string;
}) {
  const canLoad = IS_PROD && Boolean(CLIENT_ID) && Boolean(slotId);

  useEffect(() => {
    if (!canLoad) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      if (!Array.isArray(w.adsbygoogle)) w.adsbygoogle = [];
      w.adsbygoogle.push({});
    } catch {
      // AdSense occasionally throws on double-push during fast-refresh.
    }
  }, [canLoad]);

  if (!canLoad) {
    return (
      <div
        aria-hidden
        className={cn(
          "flex min-h-24 items-center justify-center rounded-lg border border-dashed border-border/60 bg-muted/30 text-xs text-muted-foreground",
          className,
        )}
      >
        {label}
      </div>
    );
  }

  return (
    <ins
      className={cn("adsbygoogle block", className)}
      style={{ display: "block" }}
      data-ad-client={CLIENT_ID}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-ad-layout={layout}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}

export function AdSlotInArticle({ slotId, className }: AdSlotProps) {
  return (
    <AdSlotBase
      slotId={slotId}
      className={className}
      layout="in-article"
      format="fluid"
      label="In-article ad"
    />
  );
}

export function AdSlotSidebar({ slotId, className }: AdSlotProps) {
  return (
    <AdSlotBase
      slotId={slotId}
      className={cn("min-h-[600px] w-full", className)}
      label="Sidebar ad"
    />
  );
}

export function AdSlotFooter({ slotId, className }: AdSlotProps) {
  return (
    <AdSlotBase
      slotId={slotId}
      className={cn("min-h-24 w-full", className)}
      label="Footer ad"
    />
  );
}

/**
 * Marks a subtree as off-limits for ads. `data-nosnippet` keeps LLM
 * summarisers out of the calculator UI; the `data-no-ads` hook pairs
 * with AdSense page-level exclusion rules.
 */
export function NoAdsForCalculator({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-no-ads="true" data-nosnippet className={className}>
      {children}
    </div>
  );
}
