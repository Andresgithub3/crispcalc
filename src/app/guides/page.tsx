import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { GUIDES } from "@/content/guides";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

export const metadata: Metadata = {
  title: "Air Fryer Guides",
  description:
    "Short, honest guides on how air fryers actually work, what to cook in them, and which recipes don't translate.",
  alternates: { canonical: `${SITE_URL}/guides` },
};

export default function GuidesIndexPage() {
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
                Guides · {GUIDES.length} articles
              </p>
              <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3.25rem]">
                Short reads for cooks who want to understand the machine.
              </h1>
              <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                No clickbait, no 2,000-word intros. Each guide is one
                question, answered well — the science, the trade-offs,
                and the one or two habits that actually matter.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {GUIDES.map((guide) => (
              <li key={guide.slug}>
                <Link
                  href={`/guides/${guide.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
                        {guide.kicker}
                      </p>
                      <ArrowUpRight
                        aria-hidden
                        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </div>
                    <h2 className="text-balance text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                      {guide.title}
                    </h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {guide.description}
                    </p>
                  </div>
                  <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" aria-hidden />
                    {guide.readingTime} min read
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
