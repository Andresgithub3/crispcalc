import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AffiliateInline } from "@/components/affiliate/AffiliateInline";
import { ContentWithSidebar } from "@/components/affiliate/ContentWithSidebar";
import { ConverterCalculator } from "@/components/converter/ConverterCalculator";
import { FoodPresetGrid } from "@/components/site/FoodPresetGrid";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

/**
 * CrispCalc homepage — hero + calculator + preset grid + brief explainer.
 *
 * The calculator is the product (spec §14), so it renders directly in
 * the hero, above the fold on desktop, without a "Get Started" click
 * gate. Everything else is server-rendered.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <ContentWithSidebar>
          <Hero />
          <Presets />
          <AffiliateInline />
          <HowItWorks />
          <GuidesTeaser />
        </ContentWithSidebar>
      </main>

      <SiteFooter />
    </>
  );
}

/* -----------------------------------------------------------------------
 * Sections
 * --------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Single quiet accent — a soft amber halo at the top-right corner.
          Spec §4.2: "one subtle accent only", no gradient-stack backgrounds. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 right-[-10%] size-[520px] rounded-full bg-accent/15 blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pt-12 pb-20 sm:px-6 sm:pt-16 md:pt-20 lg:pt-24">
        <div className="flex max-w-3xl flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-3 text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            <span className="h-px w-8 bg-border" aria-hidden />
            CrispCalc · Air fryer converter
            <span className="h-px w-8 bg-border" aria-hidden />
          </div>

          <h1 className="text-balance font-sans text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            The air fryer conversion calculator,{" "}
            <span className="text-primary">done right.</span>
          </h1>

          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Convert any oven recipe to perfect air fryer settings in seconds —
            backed by the science of how air fryers actually cook.
          </p>
        </div>

        <ConverterCalculator />
      </div>
    </section>
  );
}

function Presets() {
  return (
    <section
      aria-labelledby="presets-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <header className="mb-8 flex flex-col gap-2 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Jump to a food
          </p>
          <h2
            id="presets-heading"
            className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Presets, not guesswork.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          Each food page pre-fills the calculator with the settings that
          actually work — not a generic 20/20 guess.
        </p>
      </header>

      <FoodPresetGrid />

      <div className="mt-8 flex justify-center">
        <Link
          href="/foods"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          Browse all foods
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps: Array<{ n: string; title: string; body: string }> = [
    {
      n: "01",
      title: "Start with the oven recipe.",
      body: "Any temp, any time. Fahrenheit or Celsius — we handle both and keep the source honest.",
    },
    {
      n: "02",
      title: "Pick the food and the fryer.",
      body: "A frozen pizza in a Ninja cooks very differently from fish in a Philips. The math accounts for both.",
    },
    {
      n: "03",
      title: "Cook with a number you trust.",
      body: "Temperatures round down for safety. The “check at” time tells you when to open the basket for a shake or a flip.",
    },
  ];

  return (
    <section
      aria-labelledby="how-heading"
      className="border-y border-border bg-muted/40"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-10 flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            How it works
          </p>
          <h2
            id="how-heading"
            className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Not the 20/20 rule. A 20/20 rule with modifiers.
          </h2>
        </div>

        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.n} className="flex flex-col gap-3">
              <span className="font-mono text-sm font-medium text-primary">
                {step.n}
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function GuidesTeaser() {
  return (
    <section
      aria-labelledby="guides-heading"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-2">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Reading list
          </p>
          <h2
            id="guides-heading"
            className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Short guides to cook better, not just faster.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Why air fryers aren&apos;t magic, which foods punish you for shortcuts,
            and how to tell when a recipe won&apos;t translate at all.
          </p>
        </div>

        <Link
          href="/guides"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
        >
          All guides
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
