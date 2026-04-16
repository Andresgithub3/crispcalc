/**
 * Analytics helpers — thin, typed wrapper over `sendGAEvent` so callers
 * don't have to remember event names or parameter shapes.
 *
 * Events (spec §10):
 *  - `conversion_calculated` — fired from the calculator after debounce.
 *  - `result_copied` — user clicks "Copy result".
 *  - `food_preset_clicked` — link click from a preset grid tile.
 *  - `guide_clicked` — link click from the guides index or footer.
 *
 * The helpers no-op when `window` / `dataLayer` are missing, so call
 * sites don't need to guard for dev / SSR / consent-denied states.
 */

import { sendGAEvent } from "@next/third-parties/google";

import type { FoodType, FryerModel } from "./converter";

function hasDataLayer(): boolean {
  if (typeof window === "undefined") return false;
  return Array.isArray(
    (window as unknown as { dataLayer?: unknown[] }).dataLayer,
  );
}

export interface ConversionEventPayload {
  ovenTempF: number;
  ovenTimeMin: number;
  airFryerTempF: number;
  airFryerTimeMin: number;
  foodType: FoodType;
  fryerModel: FryerModel;
}

export function trackConversion(p: ConversionEventPayload): void {
  if (!hasDataLayer()) return;
  sendGAEvent("event", "conversion_calculated", {
    oven_temp_f: p.ovenTempF,
    oven_time_min: p.ovenTimeMin,
    air_fryer_temp_f: p.airFryerTempF,
    air_fryer_time_min: p.airFryerTimeMin,
    food_type: p.foodType,
    fryer_model: p.fryerModel,
  });
}

export function trackResultCopied(foodType: FoodType): void {
  if (!hasDataLayer()) return;
  sendGAEvent("event", "result_copied", { food_type: foodType });
}

export function trackFoodPresetClick(slug: string): void {
  if (!hasDataLayer()) return;
  sendGAEvent("event", "food_preset_clicked", { preset_slug: slug });
}

export function trackGuideClick(slug: string): void {
  if (!hasDataLayer()) return;
  sendGAEvent("event", "guide_clicked", { guide_slug: slug });
}
