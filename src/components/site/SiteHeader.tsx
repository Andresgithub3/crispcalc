import Link from "next/link";
import { Flame } from "lucide-react";

/**
 * Minimal site header. Brand mark left, a slim set of nav links right.
 * Server component — renders inline HTML with no client interactivity.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
        >
          <span
            aria-hidden
            className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            <Flame className="size-4" />
          </span>
          <span className="text-base">CrispCalc</span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex items-center gap-5 text-sm text-muted-foreground"
        >
          <Link
            href="/foods"
            className="hidden transition-colors hover:text-foreground sm:inline"
          >
            Foods
          </Link>
          <Link
            href="/guides"
            className="hidden transition-colors hover:text-foreground sm:inline"
          >
            Guides
          </Link>
          <Link
            href="/charts/oven-to-air-fryer"
            className="hidden transition-colors hover:text-foreground md:inline"
          >
            Charts
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
