"use client";

/**
 * Cookie consent banner — spec §11.
 *
 * Google Consent Mode v2 is initialised to `denied` in the root layout
 * inline script. This component flips consent to `granted` on Accept
 * and keeps it `denied` on Reject. Either choice is persisted in
 * localStorage so the banner shows at most once per browser.
 *
 * On change we emit `crispcalc:consent` on `window` so the AdSense
 * loader and ad slots can mount after the user has accepted.
 */

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const CONSENT_STORAGE_KEY = "crispcalc-consent";
export const CONSENT_EVENT = "crispcalc:consent";

export type ConsentValue = "granted" | "denied";

type Gtag = (
  command: "consent",
  action: "update",
  params: Record<string, ConsentValue>,
) => void;

/* -----------------------------------------------------------------------
 * External-store hook for the consent value. Shared by the banner, the
 * AdSense loader, and the ad slot components via `useSyncExternalStore`
 * so React stays in sync with localStorage + the consent event without
 * the set-state-in-effect anti-pattern.
 * --------------------------------------------------------------------- */

function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

function subscribeConsent(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const serverConsent: () => ConsentValue | null = () => null;

export function useConsentValue(): ConsentValue | null {
  return useSyncExternalStore(subscribeConsent, readConsent, serverConsent);
}

function applyConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;

  const w = window as unknown as { gtag?: Gtag };
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", {
      ad_storage: value,
      ad_user_data: value,
      ad_personalization: value,
      analytics_storage: value,
    });
  }

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Private mode / storage disabled — choice will just re-prompt.
  }

  window.dispatchEvent(
    new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }),
  );
}

export function ConsentBanner() {
  const consent = useConsentValue();

  const handleAccept = useCallback(() => {
    applyConsent("granted");
  }, []);

  const handleReject = useCallback(() => {
    applyConsent("denied");
  }, []);

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-sm sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md sm:p-5"
    >
      <div className="flex flex-col gap-3">
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-foreground">
            Cookies, briefly.
          </p>
          <p className="text-sm text-muted-foreground">
            CrispCalc uses cookies for basic analytics and, in production,
            Google ads. You can keep those off — the calculator still works.
            See our{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReject}
          >
            Reject non-essential
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
