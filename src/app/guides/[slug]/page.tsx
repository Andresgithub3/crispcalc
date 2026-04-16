import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ChevronRight,
  Clock,
  Info,
  TriangleAlert,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { FOOD_PRESETS } from "@/content/foods";
import {
  GUIDES,
  getGuide,
  getRelatedGuides,
  type Guide,
  type GuideSection,
} from "@/content/guides";

/**
 * `/guides/[slug]` — long-form article layout.
 *
 * Structure: breadcrumb → hero → body → related guides + food pages →
 * last updated. Inline JSON-LD for Article + BreadcrumbList.
 */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

interface RouteParams {
  slug: string;
}

export function generateStaticParams(): Array<RouteParams> {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  const url = `${SITE_URL}/guides/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url,
      type: "article",
      modifiedTime: guide.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const relatedGuides = getRelatedGuides(guide);
  const relatedFoods = guide.relatedFoodSlugs
    .map((s) => FOOD_PRESETS.find((p) => p.slug === s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const jsonLd = buildJsonLd(guide);

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <Breadcrumb name={guide.title} />
        <Hero guide={guide} />
        <Body sections={guide.sections} />
        <RelatedFoods foods={relatedFoods} />
        <RelatedGuides guides={relatedGuides} />
        <UpdatedStamp updatedAt={guide.updatedAt} />
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
      className="mx-auto w-full max-w-3xl px-4 pt-6 sm:px-6 sm:pt-8"
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
            href="/guides"
            className="hover:text-foreground hover:underline underline-offset-4"
          >
            Guides
          </Link>
        </li>
        <ChevronRight aria-hidden className="size-3.5" />
        <li aria-current="page" className="line-clamp-1 text-foreground">
          {name}
        </li>
      </ol>
    </nav>
  );
}

function Hero({ guide }: { guide: Guide }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pt-8 pb-10 sm:px-6 sm:pt-12 sm:pb-14">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          {guide.kicker}
        </p>
        <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3rem]">
          {guide.title}
        </h1>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
          {guide.lead}
        </p>
        <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" aria-hidden />
          {guide.readingTime} min read
        </p>
      </div>
    </section>
  );
}

function Body({ sections }: { sections: GuideSection[] }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6 sm:pb-20">
      <div className="flex flex-col gap-6">
        {sections.map((section, i) => (
          <SectionRenderer key={i} section={section} />
        ))}
      </div>
    </article>
  );
}

function SectionRenderer({ section }: { section: GuideSection }) {
  switch (section.kind) {
    case "h2":
      return (
        <h2
          id={section.id}
          className="mt-6 scroll-mt-24 text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p className="text-pretty text-base leading-relaxed text-foreground/90">
          {section.text}
        </p>
      );
    case "list":
      return (
        <ul className="flex flex-col gap-2 pl-5 text-base leading-relaxed text-foreground/90">
          {section.items.map((item) => (
            <li key={item} className="list-disc marker:text-primary">
              {item}
            </li>
          ))}
        </ul>
      );
    case "callout":
      return (
        <Alert
          className={
            section.tone === "warn"
              ? "rounded-xl border-accent/40 bg-accent/15"
              : "rounded-xl border-primary/30 bg-primary/10"
          }
        >
          {section.tone === "warn" ? (
            <TriangleAlert className="size-4 text-accent-foreground" />
          ) : (
            <Info className="size-4 text-primary" />
          )}
          <AlertDescription className="text-foreground/90">
            {section.text}
          </AlertDescription>
        </Alert>
      );
  }
}

function RelatedFoods({
  foods,
}: {
  foods: readonly (typeof FOOD_PRESETS)[number][];
}) {
  if (foods.length === 0) return null;

  return (
    <section
      aria-labelledby="food-links-heading"
      className="border-y border-border bg-muted/40"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Put it to use
          </p>
          <h2
            id="food-links-heading"
            className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
          >
            Food presets this guide refers to.
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {foods.map((food) => (
            <li key={food.slug}>
              <Link
                href={`/foods/${food.slug}`}
                className="group flex h-full flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {food.name}
                  </h3>
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                  />
                </div>
                <p className="text-sm text-muted-foreground">{food.kicker}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function RelatedGuides({ guides }: { guides: readonly Guide[] }) {
  if (guides.length === 0) return null;

  return (
    <section
      aria-labelledby="more-reading"
      className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mb-8 flex flex-col gap-2">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
          Keep reading
        </p>
        <h2
          id="more-reading"
          className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
        >
          Related guides.
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {guides.map((related) => (
          <li key={related.slug}>
            <Link
              href={`/guides/${related.slug}`}
              className="group flex h-full flex-col justify-between gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {related.title}
                </h3>
                <ArrowUpRight
                  aria-hidden
                  className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {related.description}
              </p>
            </Link>
          </li>
        ))}
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
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6">
      <p className="text-xs text-muted-foreground">
        Last updated{" "}
        <time dateTime={updatedAt} className="font-medium text-foreground/80">
          {formatted}
        </time>
        .
      </p>
    </div>
  );
}

/* -----------------------------------------------------------------------
 * JSON-LD
 * --------------------------------------------------------------------- */

function buildJsonLd(guide: Guide): Array<Record<string, unknown>> {
  const url = `${SITE_URL}/guides/${guide.slug}`;

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updatedAt,
    url,
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: "CrispCalc",
      url: SITE_URL,
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: `${SITE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: guide.title,
        item: url,
      },
    ],
  };

  return [article, breadcrumb];
}
