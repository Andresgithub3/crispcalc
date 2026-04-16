import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

export const metadata: Metadata = {
  title: "About CrispCalc",
  description:
    "CrispCalc is a focused air fryer conversion calculator. This is how the method works, why we built it, and what we won't do.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-accent/15 blur-3xl"
          />

          <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to calculator
            </Link>
            <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
              About
            </p>
            <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3rem]">
              A single job, done honestly.
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              CrispCalc converts oven recipes into air fryer settings.
              That is all it does. It does it better than the ad-stuffed
              alternatives, and without pretending to know more than it
              does.
            </p>
          </div>
        </section>

        <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20">
          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Why this site exists
            </h2>
            <p className="text-pretty text-base leading-relaxed text-foreground/90">
              Every &ldquo;air fryer conversion calculator&rdquo; on page one of
              Google does roughly the same thing: drop the oven
              temperature 25°F and cut the time by 20%. That generic
              rule works for enough foods to seem correct and fails on
              enough others to be frustrating. Wings at that conversion
              come out fine. Fish comes out dry. Baked goods come out
              with set tops and raw middles. Frozen foods come out
              under-crisped.
            </p>
            <p className="text-pretty text-base leading-relaxed text-foreground/90">
              The fix isn&rsquo;t complicated &mdash; different foods and different
              fryers need different adjustments. CrispCalc applies those
              adjustments automatically, so the number you get back is
              the one you&rsquo;d arrive at after three attempts of your own.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              How the method works
            </h2>
            <p className="text-pretty text-base leading-relaxed text-foreground/90">
              The calculator starts from the 20/20 rule as a baseline
              and then applies two modifiers: one for the food type
              (proteins, frozen, baked goods, etc.) and one for the air
              fryer model (standard, high-wattage, oven-style, etc.).
              Final temperatures round down to the nearest 5°F on the
              side of food safety. Final times include an early check
              point so you can shake, flip, or pull the basket before
              anything overcooks.
            </p>
            <p className="text-pretty text-base leading-relaxed text-foreground/90">
              The exact modifier values are visible in our open-source
              logic and explained in the guides. We are not hiding a
              formula — we are just running it for you.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What we won&rsquo;t do
            </h2>
            <ul className="flex flex-col gap-2 pl-5 text-base leading-relaxed text-foreground/90">
              <li className="list-disc marker:text-primary">
                We will not pad recipe pages with a 1,500-word life
                story before the actual number. The calculator is at
                the top of every page.
              </li>
              <li className="list-disc marker:text-primary">
                We will not make up recipes we haven&rsquo;t tested or
                claim precision we don&rsquo;t have. The output is a
                well-informed starting point, not a promise.
              </li>
              <li className="list-disc marker:text-primary">
                We will not run invasive tracking. Standard analytics
                to know which pages get read, and ads to keep the
                site free. That&rsquo;s it.
              </li>
              <li className="list-disc marker:text-primary">
                We will not pretend an air fryer can do things it
                can&rsquo;t. The{" "}
                <Link
                  href="/guides"
                  className="underline decoration-primary/40 underline-offset-4 hover:text-foreground hover:decoration-primary"
                >
                  guides
                </Link>{" "}
                are honest about the appliance&rsquo;s limits.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Who&rsquo;s behind it
            </h2>
            <p className="text-pretty text-base leading-relaxed text-foreground/90">
              CrispCalc is an independent project — a small, single-purpose
              tool rather than a food-content empire. The conversion math
              is based on published air fryer physics, manufacturer
              specifications for the popular home models, and a lot of
              test cooks. Corrections are welcome — see the{" "}
              <Link
                href="/contact"
                className="underline decoration-primary/40 underline-offset-4 hover:text-foreground hover:decoration-primary"
              >
                contact page
              </Link>
              .
            </p>
          </section>
        </article>

        <section className="border-t border-border bg-muted/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-14 sm:px-6 sm:flex-row sm:items-center sm:justify-between sm:py-16">
            <div className="flex max-w-xl flex-col gap-2">
              <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Ready to convert something?
              </h2>
              <p className="text-sm text-muted-foreground">
                Start with any oven recipe. The calculator&rsquo;s the only
                thing you need.
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
    </>
  );
}
