import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "The terms under which CrispCalc is made available — plus the cooking disclaimer that should probably go without saying.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

const UPDATED = "2026-04-16";

export default function TermsPage() {
  const formatted = new Date(UPDATED).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
              Terms of use
            </p>
            <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3rem]">
              The fine print, kept short.
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              By using CrispCalc you agree to these terms. We have tried
              to write them in plain language. The legal effect is the
              same as a longer version.
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated{" "}
              <time
                dateTime={UPDATED}
                className="font-medium text-foreground/80"
              >
                {formatted}
              </time>
              .
            </p>
          </div>
        </section>

        <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20">
          <Section title="What the site is">
            <p>
              CrispCalc is a free calculator and reference site about
              cooking with air fryers. It is made available as-is. It is
              not a substitute for following safe food handling practices
              or the instructions that came with your appliance.
            </p>
          </Section>

          <Section title="Cooking disclaimer">
            <p>
              Cooking times and temperatures on this site are
              well-researched starting points, not guarantees. Real
              cooking outcomes depend on the food, the appliance, the
              altitude, and things we cannot model. Always cook proteins
              to a safe internal temperature, verified with a
              thermometer. Always follow the safety instructions that
              came with your air fryer. If a recipe converts to
              something that feels wrong, trust your judgment over the
              number.
            </p>
            <p>
              CrispCalc, its authors, and its contributors are not
              liable for any loss, injury, or damage arising from use of
              the conversions or guidance on this site.
            </p>
          </Section>

          <Section title="Acceptable use">
            <p>
              You may use the calculator and read the site freely,
              including for commercial purposes. You may quote short
              passages with attribution and a link back.
            </p>
            <p>
              You may not scrape the site in bulk to repackage its
              content elsewhere, nor may you misrepresent the site&rsquo;s
              output as authoritative advice in a context where it
              isn&rsquo;t (a cookbook, a food-safety document, etc.).
            </p>
          </Section>

          <Section title="Intellectual property">
            <p>
              The text on CrispCalc is original work, copyright by the
              site&rsquo;s authors, unless otherwise noted. The calculator
              logic itself is open in the sense that the modifiers are
              documented in the guides; the specific implementation and
              content are not in the public domain.
            </p>
          </Section>

          <Section title="Changes to the site">
            <p>
              We edit recipe data and guides when we learn something new
              or realize we got something wrong. The &ldquo;last updated&rdquo;
              date on each page reflects when it last changed. We may
              also change, pause, or retire the site at any time,
              without notice.
            </p>
          </Section>

          <Section title="Advertising">
            <p>
              CrispCalc is supported by advertising. Ads are clearly
              labelled and served by Google AdSense. The presence of an
              ad on the site is not an endorsement of the advertiser. We
              don&rsquo;t review every ad before it shows; Google&rsquo;s policies
              govern what runs.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              These terms are governed by the laws of the jurisdiction
              in which CrispCalc&rsquo;s operator is based. Disputes that
              can&rsquo;t be resolved informally will be handled in the
              courts of that jurisdiction.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Terms questions can be sent to the email on our{" "}
              <Link
                href="/contact"
                className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                contact page
              </Link>
              .
            </p>
          </Section>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <div className="flex flex-col gap-3 text-base leading-relaxed text-foreground/90">
        {children}
      </div>
    </section>
  );
}
