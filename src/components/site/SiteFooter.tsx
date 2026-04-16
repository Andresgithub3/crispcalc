import Link from "next/link";
import { Flame } from "lucide-react";

/**
 * Global footer. Includes navigation, the "why we show ads" trust line
 * (spec §9), and the copyright.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span
              aria-hidden
              className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
            >
              <Flame className="size-4" />
            </span>
            <span>CrispCalc</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            The air fryer conversion calculator, done right.
          </p>
        </div>

        <FooterColumn title="Convert">
          <FooterLink href="/">Calculator</FooterLink>
          <FooterLink href="/foods">All foods</FooterLink>
          <FooterLink href="/charts/oven-to-air-fryer">
            Oven → air fryer chart
          </FooterLink>
          <FooterLink href="/charts/celsius-to-fahrenheit">
            °C ↔ °F
          </FooterLink>
        </FooterColumn>

        <FooterColumn title="Learn">
          <FooterLink href="/guides">Guides</FooterLink>
          <FooterLink href="/guides/how-air-fryers-actually-work">
            How air fryers work
          </FooterLink>
          <FooterLink href="/guides/common-air-fryer-mistakes">
            Common mistakes
          </FooterLink>
        </FooterColumn>

        <FooterColumn title="Site">
          <FooterLink href="/about">About</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
          <FooterLink href="/privacy">Privacy</FooterLink>
          <FooterLink href="/terms">Terms</FooterLink>
        </FooterColumn>
      </div>

      <div className="border-t border-border/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} CrispCalc. Cooking times are guidance — taste and a thermometer win.</p>
          <p>
            We show ads to keep this site free. No account, no tracking beyond
            standard analytics.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold tracking-[0.18em] text-foreground uppercase">
        {title}
      </h2>
      <ul className="flex flex-col gap-2 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </Link>
    </li>
  );
}
