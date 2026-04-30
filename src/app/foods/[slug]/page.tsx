import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight, TriangleAlert } from "lucide-react";

// import { AffiliateInline } from "@/components/affiliate/AffiliateInline";
import { ContentWithSidebar } from "@/components/affiliate/ContentWithSidebar";
import { ConverterCalculator } from "@/components/converter/ConverterCalculator";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FOOD_PRESETS,
  getFoodPreset,
  getPresetResult,
  getRelatedPresets,
  minutesToIso,
  type FoodPreset,
} from "@/content/foods";
import type { ConversionResult } from "@/lib/converter";

/**
 * Food preset page — the SEO backbone of CrispCalc (spec §7).
 *
 * Structure: breadcrumb → hero with quick reference → pre-filled
 * calculator → editorial content (intro + tips) → variations table →
 * FAQ → related foods → last updated.
 *
 * JSON-LD (HowTo, FAQPage, BreadcrumbList) is rendered inline after
 * the main content for Google to pick up.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

interface RouteParams {
  slug: string;
}

export function generateStaticParams(): Array<RouteParams> {
  return FOOD_PRESETS.map((preset) => ({ slug: preset.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const preset = getFoodPreset(slug);
  if (!preset) return {};

  const title = `Air Fryer ${preset.name}: Perfect Time & Temperature`;
  const url = `${SITE_URL}/foods/${preset.slug}`;

  return {
    title,
    description: preset.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: preset.metaDescription,
      url,
      type: "article",
      modifiedTime: preset.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: preset.metaDescription,
    },
  };
}

export default async function FoodPresetPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const preset = getFoodPreset(slug);
  if (!preset) notFound();

  const result = getPresetResult(preset);
  const related = getRelatedPresets(preset);
  const jsonLd = buildJsonLd(preset, result);

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <ContentWithSidebar>
          <Breadcrumb name={preset.name} />
          <Hero preset={preset} result={result} />
          <Article preset={preset} result={result} />
          {/* <AffiliateInline /> */}
          <Variations preset={preset} />
          <FAQs preset={preset} />
          <Related presets={related} />
          <UpdatedStamp updatedAt={preset.updatedAt} />
        </ContentWithSidebar>
      </main>

      <SiteFooter />

      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}

/* -----------------------------------------------------------------------
 * Sections
 * --------------------------------------------------------------------- */

function Breadcrumb({ name }: { name: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8"
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            href="/"
            className="hover:text-foreground hover:underline underline-offset-4"
          >
            Home
          </Link>
        </li>
        <ChevronRight aria-hidden className="size-3.5" />
        <li>
          <Link
            href="/foods"
            className="hover:text-foreground hover:underline underline-offset-4"
          >
            Foods
          </Link>
        </li>
        <ChevronRight aria-hidden className="size-3.5" />
        <li aria-current="page" className="text-foreground">
          {name}
        </li>
      </ol>
    </nav>
  );
}

function Hero({
  preset,
  result,
}: {
  preset: FoodPreset;
  result: ConversionResult;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-8 pb-14 sm:px-6 sm:pt-12 sm:pb-20">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Air fryer preset
          </p>

          <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3.5rem]">
            Air Fryer {preset.name}:{" "}
            <span className="text-primary">Perfect Time & Temperature</span>
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {preset.kicker}. The calculator below is pre-filled with the
            oven recipe most cooks start from — tweak anything and the air
            fryer settings update live.
          </p>
        </div>

        <QuickReference
          result={result}
          unit={preset.defaults.unit}
          yield_={preset.yield}
        />

        <ConverterCalculator initialState={preset.defaults} />
      </div>
    </section>
  );
}

function QuickReference({
  result,
  unit,
  yield_,
}: {
  result: ConversionResult;
  unit: "F" | "C";
  yield_: string;
}) {
  const tempDisplay =
    unit === "C"
      ? `${result.airFryerTempC}°C`
      : `${result.airFryerTempF}°F`;

  return (
    <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4 sm:gap-5 sm:p-6">
      <QuickCell label="Temperature" value={tempDisplay} />
      <QuickCell
        label="Total time"
        value={`${result.airFryerTimeMin} min`}
      />
      <QuickCell
        label="Check at"
        value={`${result.checkAtMin} min`}
      />
      <QuickCell label="Yields" value={yield_} />
    </dl>
  );
}

function QuickCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="font-mono text-2xl font-medium tabular-nums tracking-tight text-foreground sm:text-3xl">
        {value}
      </dd>
    </div>
  );
}

function Article({
  preset,
  result,
}: {
  preset: FoodPreset;
  result: ConversionResult;
}) {
  return (
    <section
      aria-labelledby="how-heading"
      className="border-y border-border bg-muted/40"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            How to cook it
          </p>
          <h2
            id="how-heading"
            className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            What actually makes it work.
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          <p className="text-pretty text-base leading-relaxed text-foreground/90 sm:text-lg">
            {preset.intro}
          </p>

          {result.warnings.length > 0 && (
            <div className="flex flex-col gap-2">
              {result.warnings.map((warning) => (
                <Alert
                  key={warning}
                  className="rounded-xl border-accent/40 bg-accent/15"
                >
                  <TriangleAlert className="size-4 text-accent-foreground" />
                  <AlertDescription className="text-foreground/90">
                    {warning}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {preset.tips.map((tip, i) => (
              <li
                key={tip.heading}
                className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5"
              >
                <span className="font-mono text-xs font-medium text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {tip.heading}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {tip.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Variations({ preset }: { preset: FoodPreset }) {
  const { variations } = preset;
  return (
    <section
      aria-labelledby="variations-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Variations
        </p>
        <h2
          id="variations-heading"
          className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          {variations.title}
        </h2>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              <th scope="col" className="px-5 py-3">
                Variant
              </th>
              <th scope="col" className="px-5 py-3">
                Temperature
              </th>
              <th scope="col" className="px-5 py-3">
                Time
              </th>
              <th scope="col" className="px-5 py-3">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {variations.rows.map((row, i) => (
              <tr
                key={row.label}
                className={
                  i !== variations.rows.length - 1
                    ? "border-b border-border/70"
                    : undefined
                }
              >
                <th
                  scope="row"
                  className="px-5 py-4 text-left font-medium text-foreground"
                >
                  {row.label}
                </th>
                <td className="px-5 py-4 font-mono tabular-nums text-foreground">
                  {row.temp}°{row.unit ?? "F"}
                </td>
                <td className="px-5 py-4 font-mono tabular-nums text-foreground">
                  {row.time} min
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {row.note ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FAQs({ preset }: { preset: FoodPreset }) {
  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-border bg-muted/40"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Questions cooks actually ask.
          </h2>
        </div>

        <dl className="divide-y divide-border border-y border-border">
          {preset.faqs.map((faq) => (
            <div key={faq.q} className="grid gap-3 py-6 md:grid-cols-[1fr_2fr] md:gap-10">
              <dt className="text-base font-semibold tracking-tight text-foreground">
                {faq.q}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {faq.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Related({ presets }: { presets: readonly FoodPreset[] }) {
  if (presets.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Related foods
        </p>
        <h2
          id="related-heading"
          className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Cooks who looked up this also looked up these.
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {presets.map((related) => {
          const relResult = getPresetResult(related);
          return (
            <li key={related.slug}>
              <Link
                href={`/foods/${related.slug}`}
                className="group flex h-full flex-col justify-between gap-6 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {related.name}
                  </h3>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </div>
                <p className="font-mono text-sm tabular-nums text-muted-foreground">
                  {relResult.airFryerTempF}°F · {relResult.airFryerTimeMin} min
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function UpdatedStamp({ updatedAt }: { updatedAt: string }) {
  const formatted = new Date(updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <p className="text-xs text-muted-foreground">
        Last updated{" "}
        <time dateTime={updatedAt} className="font-medium text-foreground/80">
          {formatted}
        </time>
        . Cooking times are guidance — taste and a thermometer win.
      </p>
    </div>
  );
}

/* -----------------------------------------------------------------------
 * JSON-LD
 * --------------------------------------------------------------------- */

function buildJsonLd(
  preset: FoodPreset,
  result: ConversionResult,
): Array<Record<string, unknown>> {
  const url = `${SITE_URL}/foods/${preset.slug}`;

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Air Fryer ${preset.name}`,
    description: preset.metaDescription,
    totalTime: minutesToIso(result.airFryerTimeMin),
    yield: preset.yield,
    dateModified: preset.updatedAt,
    step: [
      {
        "@type": "HowToStep",
        name: "Preheat",
        text: `Preheat your air fryer to ${result.airFryerTempF}°F (${result.airFryerTempC}°C) for 2–3 minutes.`,
      },
      {
        "@type": "HowToStep",
        name: "Cook",
        text: `Cook for ${result.airFryerTimeMin} minutes total. Open the basket at ${result.checkAtMin} minutes to shake or flip.`,
      },
      {
        "@type": "HowToStep",
        name: "Check and serve",
        text: `Verify doneness — internal temperature for proteins, colour and texture for everything else — then serve immediately.`,
      },
    ],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preset.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Foods",
        item: `${SITE_URL}/foods`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: preset.name,
        item: url,
      },
    ],
  };

  return [howTo, faqPage, breadcrumb];
}
