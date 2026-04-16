"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import {
  trackFoodPresetClick,
  trackGuideClick,
} from "@/lib/analytics";

type Kind = "food" | "guide";

type TrackedLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    kind: Kind;
    slug: string;
    children: ReactNode;
  };

/**
 * Drop-in replacement for `next/link` that fires a GA4 event before
 * navigation. Use for food-preset and guide links so we can see which
 * editorial pulls traffic back into the calculator.
 */
export function TrackedLink({
  kind,
  slug,
  onClick,
  children,
  ...rest
}: TrackedLinkProps) {
  return (
    <Link
      {...rest}
      onClick={(event) => {
        if (kind === "food") trackFoodPresetClick(slug);
        else trackGuideClick(slug);
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
