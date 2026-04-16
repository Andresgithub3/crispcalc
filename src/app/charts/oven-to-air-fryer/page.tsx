import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import {
  convert,
  fahrenheitToCelsius,
  type FoodType,
} from "@/lib/converter";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

/**
 * `/charts/oven-to-air-fryer` — reference page showing common oven
 * temperatures converted to air fryer settings across food types.
 *
 * Per spec §5: highly linkable. The intent is that this page earns
 * backlinks on its own merit as a kitchen-wall reference.
 */

export const metadata: Metadata = {
  title: "Oven to Air Fryer Conversion Chart",
  description:
    "Complete oven-to-air-fryer temperature chart. Every common oven temperature from 250°F to 475°F, converted for each food type — proteins, frozen, baked, and more.",
  alternates: { canonical: `${SITE_URL}/charts/oven-to-air-fryer` },
};

const OVEN_TEMPS_F = [
  250, 275, 300, 325, 350, 375, 400, 425, 450, 475,
] as const;

const FOOD_COLUMNS: Array<{ type: FoodType; label: string }> = [
  { type: "general", label: "General" },
  { type: "raw_meat", label: "Raw meat" },
  { type: "frozen", label: "Frozen" },
  { type: "fish", label: "Fish" },
  { type: "vegetables", label: "Vegetables" },
  { type: "baked", label: "Baked goods" },
  { type: "reheating", label: "Reheating" },
];

function convertTemp(ovenTempF: number, foodType: FoodType) {
  // Time isn't meaningful without knowing what you're cooking — the
  // chart focuses on the temperature side only. Use a placeholder
  // time of 20 min so convert() returns a valid result.
  return convert({
    ovenTempF,
    ovenTimeMin: 20,
    foodType,
    fryerModel: "standard",
  });
}

export default function OvenToAirFryerChartPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Charts",
        item: `${SITE_URL}/charts/oven-to-air-fryer`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Oven to air fryer",
        item: `${SITE_URL}/charts/oven-to-air-fryer`,
      },
    ],
  };

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Breadcrumb />

        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-accent/15 blur-3xl"
          />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-14">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Reference chart
            </p>
            <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3rem]">
              Oven-to-air-fryer{" "}
              <span className="text-primary">temperature chart</span>
            </h1>
            <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Common oven temperatures converted to air fryer settings for
              every food type we support. Temperatures round down to the
              nearest 5°F for safety. For exact times, use the{" "}
              <Link
                href="/"
                className="underline decoration-primary/40 underline-offset-4 hover:text-foreground hover:decoration-primary"
              >
                calculator
              </Link>{" "}
              with your recipe&rsquo;s oven time.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="chart-heading"
          className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-20"
        >
          <h2 id="chart-heading" className="sr-only">
            Air fryer temperature by oven temperature and food type
          </h2>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  <th scope="col" className="sticky left-0 z-10 bg-card px-5 py-4">
                    Oven
                  </th>
                  {FOOD_COLUMNS.map((col) => (
                    <th key={col.type} scope="col" className="px-5 py-4">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {OVEN_TEMPS_F.map((ovenF, i) => {
                  const ovenC = Math.round(fahrenheitToCelsius(ovenF));
                  return (
                    <tr
                      key={ovenF}
                      className={
                        i !== OVEN_TEMPS_F.length - 1
                          ? "border-b border-border/70"
                          : undefined
                      }
                    >
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-card px-5 py-4 text-left font-mono text-base font-medium tabular-nums text-foreground"
                      >
                        {ovenF}°F
                        <span className="block text-xs font-normal text-muted-foreground">
                          {ovenC}°C
                        </span>
                      </th>
                      {FOOD_COLUMNS.map((col) => {
                        const result = convertTemp(ovenF, col.type);
                        return (
                          <td
                            key={col.type}
                            className="px-5 py-4 font-mono tabular-nums"
                          >
                            <span className="text-foreground">
                              {result.airFryerTempF}°F
                            </span>
                            <span className="ml-2 text-xs text-muted-foreground">
                              {result.airFryerTempC}°C
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Source: CrispCalc&rsquo;s{" "}
            <Link
              href="/guides/how-air-fryers-actually-work"
              className="underline decoration-muted-foreground/40 underline-offset-4 hover:text-foreground hover:decoration-foreground"
            >
              20/20-with-modifiers method
            </Link>
            . Temperatures are starting points; fryers vary.
          </p>
        </section>

        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-14 sm:px-6 sm:flex-row sm:items-center sm:justify-between sm:py-16">
            <div className="flex max-w-xl flex-col gap-2">
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Need the time, too?
              </h2>
              <p className="text-sm text-muted-foreground">
                The chart gives you temperature. Time depends on the cut,
                the thickness, and the fryer model — the calculator
                handles all three.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Open the calculator
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-foreground hover:underline underline-offset-4"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Home
          </Link>
        </li>
        <ChevronRight aria-hidden className="size-3.5" />
        <li aria-current="page" className="text-foreground">
          Oven-to-air-fryer chart
        </li>
      </ol>
    </nav>
  );
}
