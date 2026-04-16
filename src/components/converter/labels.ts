/**
 * Static label maps and defaults for the CrispCalc converter UI.
 *
 * Kept separate from the client component so server components (food
 * preset pages in Milestone 3) can import the same maps for SSR content
 * without needing to pull in the calculator bundle.
 */

import type { FoodType, FryerModel, TempUnit } from "@/lib/converter";

export const FOOD_TYPES: readonly FoodType[] = [
  "general",
  "frozen",
  "raw_meat",
  "fish",
  "baked",
  "vegetables",
  "reheating",
] as const;

export const FRYER_MODELS: readonly FryerModel[] = [
  "standard",
  "ninja",
  "cosori",
  "vortex",
  "philips",
  "oven_style",
] as const;

export const FOOD_LABELS: Record<FoodType, string> = {
  general: "General",
  frozen: "Frozen Food",
  raw_meat: "Raw Meat (Chicken, Pork, Beef)",
  fish: "Fish",
  baked: "Baked Goods",
  vegetables: "Vegetables",
  reheating: "Reheating",
};

export const FRYER_LABELS: Record<FryerModel, string> = {
  standard: "Standard Basket",
  ninja: "Ninja (high-wattage)",
  cosori: "Cosori",
  vortex: "Instant Vortex",
  philips: "Philips",
  oven_style: "Oven-style / Toaster",
};

export interface CalculatorState {
  temp: number;
  time: number;
  unit: TempUnit;
  food: FoodType;
  fryer: FryerModel;
}

export const DEFAULT_CALCULATOR_STATE: CalculatorState = {
  temp: 400,
  time: 25,
  unit: "F",
  food: "general",
  fryer: "standard",
};

export function isFoodType(value: string | null | undefined): value is FoodType {
  return !!value && (FOOD_TYPES as readonly string[]).includes(value);
}

export function isFryerModel(
  value: string | null | undefined,
): value is FryerModel {
  return !!value && (FRYER_MODELS as readonly string[]).includes(value);
}

export function isTempUnit(value: string | null | undefined): value is TempUnit {
  return value === "F" || value === "C";
}

/**
 * Parse a URLSearchParams-like object into a CalculatorState, falling
 * back to the provided defaults for any field that is missing or invalid.
 */
export function readCalculatorStateFromParams(
  params: URLSearchParams,
  fallback: CalculatorState,
): CalculatorState {
  const rawTemp = Number(params.get("temp"));
  const rawTime = Number(params.get("time"));
  const unit = params.get("unit");
  const food = params.get("food");
  const fryer = params.get("fryer");

  return {
    temp:
      Number.isFinite(rawTemp) && rawTemp > 0 ? Math.round(rawTemp) : fallback.temp,
    time:
      Number.isFinite(rawTime) && rawTime > 0 ? Math.round(rawTime) : fallback.time,
    unit: isTempUnit(unit) ? unit : fallback.unit,
    food: isFoodType(food) ? food : fallback.food,
    fryer: isFryerModel(fryer) ? fryer : fallback.fryer,
  };
}

/**
 * Serialize a CalculatorState to a query string (no leading `?`).
 * Deterministic key order so URL diffs are stable.
 */
export function calculatorStateToQueryString(state: CalculatorState): string {
  const params = new URLSearchParams();
  params.set("temp", String(state.temp));
  params.set("time", String(state.time));
  params.set("unit", state.unit);
  params.set("food", state.food);
  params.set("fryer", state.fryer);
  return params.toString();
}
