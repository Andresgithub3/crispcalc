import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { FOOD_PRESETS, type FoodPreset } from "@/content/foods";

/**
 * Editorial grid of food preset cards. Links to `/foods/[slug]` pages
 * built in Milestone 3. Each card shows the target air fryer settings
 * as a scannable teaser so users can lock in a conversion without
 * opening the linked page.
 */
export function FoodPresetGrid() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {FOOD_PRESETS.map((preset) => (
        <li key={preset.slug}>
          <PresetCard preset={preset} />
        </li>
      ))}
    </ul>
  );
}

function PresetCard({ preset }: { preset: FoodPreset }) {
  const { slug, name, kicker, defaults } = preset;

  return (
    <Link
      href={`/foods/${slug}`}
      className="group relative flex h-full flex-col justify-between gap-6 rounded-xl border border-border bg-card p-5 ring-1 ring-transparent transition-colors hover:border-primary/40 hover:ring-primary/20"
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            {name}
          </h3>
          <ArrowUpRight
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </div>
        <p className="text-sm text-muted-foreground">{kicker}</p>
      </div>

      <dl className="flex items-baseline gap-4 font-mono text-sm">
        <div className="flex items-baseline gap-1">
          <dt className="sr-only">Air fryer temperature</dt>
          <dd className="text-lg font-medium tabular-nums text-foreground">
            {defaults.temp}°{defaults.unit}
          </dd>
        </div>
        <span aria-hidden className="text-border">
          ·
        </span>
        <div className="flex items-baseline gap-1">
          <dt className="sr-only">Air fryer cook time</dt>
          <dd className="text-lg font-medium tabular-nums text-foreground">
            {defaults.time}
            <span className="ml-1 text-xs font-normal text-muted-foreground">
              min
            </span>
          </dd>
        </div>
      </dl>
    </Link>
  );
}
