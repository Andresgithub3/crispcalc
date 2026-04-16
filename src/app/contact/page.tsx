import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";
const CONTACT_EMAIL = "hello@crispcalc.com";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Corrections, feedback, and collaboration requests for CrispCalc.",
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
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
              Contact
            </p>
            <h1 className="text-balance font-sans text-[2.25rem] leading-[1.08] font-semibold tracking-tight text-foreground sm:text-5xl md:text-[3rem]">
              Found a bug? Got a better number?
            </h1>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              CrispCalc is one email address. Corrections, questions,
              partnerships, and cooking disputes all land in the same
              inbox.
            </p>
          </div>
        </section>

        <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-20">
          <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
            <div className="flex items-center gap-3 text-primary">
              <Mail className="size-5" aria-hidden />
              <p className="text-xs font-semibold tracking-[0.2em] uppercase">
                Email
              </p>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono text-2xl font-medium tracking-tight text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary sm:text-3xl"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="text-sm leading-relaxed text-muted-foreground">
              We read every message. We reply to the ones that need a
              reply.
            </p>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What to include
            </h2>
            <ul className="flex flex-col gap-2 pl-5 text-base leading-relaxed text-foreground/90">
              <li className="list-disc marker:text-primary">
                For corrections: the food, the fryer, the settings you
                used, and what actually happened.
              </li>
              <li className="list-disc marker:text-primary">
                For feature requests: one specific thing, in one
                sentence if you can.
              </li>
              <li className="list-disc marker:text-primary">
                For press or partnerships: who you are and what you
                have in mind.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Response time
            </h2>
            <p className="text-pretty text-base leading-relaxed text-foreground/90">
              Most emails get a reply within a few days. Corrections to
              cooking data get checked against our test notes and
              either merged into the next update or replied to with
              the reasoning if we disagree.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
