/**
 * Food preset index. Each entry corresponds to a `/foods/[slug]` page in
 * Milestone 3, and drives the preset grid on the homepage.
 *
 * Full per-food content (hero photo, copy, FAQs, Recipe schema) is added
 * in Milestone 3; this module stays lean so the homepage grid can render
 * without the full content bundle.
 *
 * Spec reference: CRISPCALC_BUILD_SPEC.md §5 (launch URLs).
 */

import type { FoodType, FryerModel, TempUnit } from "@/lib/converter";
import type { CalculatorState } from "@/components/converter/labels";

export interface FoodPreset {
  /** URL slug — maps to `/foods/{slug}`. */
  slug: string;
  /** Display name used in grid cards and page H1s. */
  name: string;
  /** One-line teaser shown under the name in the preset grid. */
  kicker: string;
  /** Pre-filled calculator state for the preset page + grid teaser. */
  defaults: CalculatorState;
}

const DEFAULT_UNIT: TempUnit = "F";
const DEFAULT_FRYER: FryerModel = "standard";

function preset(
  slug: string,
  name: string,
  kicker: string,
  temp: number,
  time: number,
  food: FoodType,
): FoodPreset {
  return {
    slug,
    name,
    kicker,
    defaults: {
      temp,
      time,
      unit: DEFAULT_UNIT,
      food,
      fryer: DEFAULT_FRYER,
    },
  };
}

export const FOOD_PRESETS: readonly FoodPreset[] = [
  preset(
    "chicken-wings",
    "Chicken wings",
    "Crispy skin, juicy inside",
    400,
    40,
    "raw_meat",
  ),
  preset(
    "french-fries",
    "French fries",
    "From frozen, no oil needed",
    425,
    25,
    "frozen",
  ),
  preset("salmon", "Salmon", "Flaky center, bronzed top", 400, 20, "fish"),
  preset("bacon", "Bacon", "Even crisp without the splatter", 400, 15, "raw_meat"),
  preset(
    "frozen-pizza",
    "Frozen pizza",
    "Crackly crust, melty top",
    425,
    18,
    "frozen",
  ),
  preset(
    "chicken-breast",
    "Chicken breast",
    "Seared edges, tender inside",
    400,
    25,
    "raw_meat",
  ),
  preset(
    "brussels-sprouts",
    "Brussels sprouts",
    "Charred leaves, creamy hearts",
    400,
    20,
    "vegetables",
  ),
  preset(
    "sweet-potato-fries",
    "Sweet potato fries",
    "Caramelised edges, soft middle",
    425,
    22,
    "vegetables",
  ),
  preset(
    "meatballs",
    "Meatballs",
    "Browned outside, moist inside",
    400,
    18,
    "raw_meat",
  ),
  preset(
    "reheated-pizza",
    "Reheated pizza",
    "Crisp again, never rubbery",
    400,
    5,
    "reheating",
  ),
] as const;

export function getFoodPreset(slug: string): FoodPreset | undefined {
  return FOOD_PRESETS.find((p) => p.slug === slug);
}
