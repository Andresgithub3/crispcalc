import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Card } from "@/components/ui/card";
import { TempConverter } from "@/components/charts/TempConverter";
import { fahrenheitToCelsius } from "@/lib/converter";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

export const metadata: Metadata = {
  title: "Celsius to Fahrenheit Converter",
  description:
    "Live °C ↔ °F converter plus a reference chart covering every common cooking temperature from 200°F to 500°F.",
  alternates: { canonical: `${SITE_URL}/charts/celsius-to-fahrenheit` },
};

/** Common cooking temps in °F with named equivalents, for the chart. */
const TEMP_ROWS: Array<{ f: number; note?: string }> = [
  { f: 200, note: "Dehydrate" },
  { f: 225, note: "Low smoke" },
  { f: 250 },
  { f: 275 },
  { f: 300, note: "Low roast" },
  { f: 325 },
  { f: 350, note: "Standard bake" },
  { f: 375 },
  { f: 400, note: "Air fryer default" },
  { f: 425 },
  { f: 450, note: "High roast" },
  { f: 475 },
  { f: 500, note: "Pizza / max" },
];

export default function CelsiusToFahrenheitChartPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "°C ↔ °F converter",
        item: `${SITE_URL}/charts/celsius-to-fahrenheit`,
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

          <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-12">
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              Converter
            </p>
            <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3rem]">
              Celsius{" "}
              <span className="text-primary">↔</span>{" "}
              Fahrenheit
            </h1>
            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Type in either unit and the other updates live. Below, a
              reference chart covering the temperatures you actually use
              when cooking.
            </p>

            <Card className="rounded-2xl p-6 sm:p-8">
              <TempConverter />
            </Card>
          </div>
        </section>

        <section
          aria-labelledby="chart-heading"
          className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20"
        >
          <h2
            id="chart-heading"
            className="mb-6 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Common cooking temperatures
          </h2>

          <div className="overflow-x-auto rounded-xl border border-border bg-card">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  <th scope="col" className="px-5 py-3">
                    Fahrenheit
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Celsius
                  </th>
                  <th scope="col" className="px-5 py-3">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {TEMP_ROWS.map((row, i) => {
                  const c = Math.round(fahrenheitToCelsius(row.f));
                  return (
                    <tr
                      key={row.f}
                      className={
                        i !== TEMP_ROWS.length - 1
                          ? "border-b border-border/70"
                          : undefined
                      }
                    >
                      <th
                        scope="row"
                        className="px-5 py-4 text-left font-mono tabular-nums text-foreground"
                      >
                        {row.f}°F
                      </th>
                      <td className="px-5 py-4 font-mono tabular-nums text-foreground">
                        {c}°C
                      </td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {row.note ?? "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Rounded to the nearest whole degree. Exact formula:{" "}
            <code className="font-mono text-foreground">
              °C = (°F − 32) × 5 / 9
            </code>
            .
          </p>
        </section>

        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-14 sm:px-6 sm:flex-row sm:items-center sm:justify-between sm:py-16">
            <div className="flex max-w-xl flex-col gap-2">
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Converting a whole recipe?
              </h2>
              <p className="text-sm text-muted-foreground">
                The main calculator handles oven temperature, time, food
                type, and fryer model together. Unit toggle built in.
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
      className="mx-auto w-full max-w-3xl px-4 pt-6 sm:px-6 sm:pt-8"
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
          °C ↔ °F converter
        </li>
      </ol>
    </nav>
  );
}
