import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { FoodPresetGrid } from "@/components/site/FoodPresetGrid";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { FOOD_PRESETS } from "@/content/foods";

/**
 * `/foods` — editorial index of every food preset page.
 *
 * Acts as the hub for internal linking: every `/foods/[slug]` page
 * breadcrumbs back here. Lists all presets in the same card grid the
 * homepage uses, so the two surfaces stay visually consistent.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

export const metadata: Metadata = {
  title: "Air Fryer Food Presets",
  description:
    "Every food preset in CrispCalc — wings, fries, salmon, pizza and more. Each page pre-fills the calculator with the settings that actually work.",
  alternates: { canonical: `${SITE_URL}/foods` },
};

export default function FoodsIndexPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-accent/15 blur-3xl"
          />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-10 pb-14 sm:px-6 sm:pt-14 sm:pb-16">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to calculator
            </Link>

            <div className="flex max-w-3xl flex-col gap-4">
              <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Food presets · {FOOD_PRESETS.length} recipes
              </p>
              <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3.25rem]">
                Every food, the settings that work.
              </h1>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                Each preset is a full write-up: the pre-filled calculator,
                the variations that matter (frozen, thick-cut, sauced), and
                the handful of details that decide whether dinner crisps
                or sogs.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <FoodPresetGrid />
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
