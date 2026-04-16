import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How CrispCalc handles data: analytics, advertising cookies, and user rights.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

const UPDATED = "2026-04-16";

export default function PrivacyPage() {
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
              Privacy policy
            </p>
            <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3rem]">
              What we collect, and why.
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              CrispCalc is a conversion calculator. It does not require
              an account. This page explains the small amount of data
              that is collected automatically when you visit.
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
          <Section title="What we collect">
            <p>
              We use Google Analytics to understand which pages are
              visited, for how long, and from where. Analytics cookies
              record anonymous usage data: the pages you view, your
              approximate geographic region, your device type, and
              whether you arrived from a search engine, another site,
              or directly.
            </p>
            <p>
              We do not collect names, email addresses, or any other
              personal identifiers through analytics. We do not build
              profiles of individual users. We do not sell or share
              analytics data with third parties other than Google, which
              processes it on our behalf under its own{" "}
              <a
                href="https://policies.google.com/privacy"
                rel="noopener noreferrer"
                className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                privacy policy
              </a>
              .
            </p>
          </Section>

          <Section title="Advertising cookies">
            <p>
              CrispCalc displays ads through Google AdSense to keep the
              site free. AdSense uses cookies to serve ads based on
              general interest categories and your prior visits to this
              or other websites.
            </p>
            <p>
              You can opt out of personalized advertising at any time
              via{" "}
              <a
                href="https://adssettings.google.com/"
                rel="noopener noreferrer"
                className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                Google&rsquo;s Ad Settings
              </a>
              . You can also opt out of many third-party ad networks at{" "}
              <a
                href="https://optout.aboutads.info/"
                rel="noopener noreferrer"
                className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                aboutads.info
              </a>
              .
            </p>
          </Section>

          <Section title="Cookies and local storage">
            <p>
              Beyond the analytics and advertising cookies described
              above, CrispCalc does not set its own tracking cookies.
              The calculator keeps your inputs in the URL (so you can
              share a link to a specific conversion), not in persistent
              storage.
            </p>
            <p>
              The one exception is a single local-storage entry named{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm">
                crispcalc-consent
              </code>{" "}
              that remembers whether you accepted or rejected
              non-essential cookies so we don&rsquo;t prompt you on every
              page. Clearing your browser storage resets the banner.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              If you are in the European Economic Area, the United
              Kingdom, or California, applicable data protection laws
              (GDPR, UK GDPR, CCPA) give you the right to access,
              correct, or delete personal data held about you, and to
              opt out of its sale.
            </p>
            <p>
              Because CrispCalc does not collect personally identifying
              data directly, most of these rights are exercised through
              Google&rsquo;s tools linked above. If you have a specific
              concern you cannot address through them, email us at the
              address on the{" "}
              <Link
                href="/contact"
                className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                contact page
              </Link>
              .
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              We update this policy when the site&rsquo;s actual practices
              change. The &ldquo;last updated&rdquo; date at the top reflects
              the most recent substantive edit. Significant changes will
              be highlighted on the homepage for at least two weeks
              after they take effect.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Privacy questions can be sent to the email on our{" "}
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
