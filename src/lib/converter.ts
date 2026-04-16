/**
 * CrispCalc core conversion logic.
 *
 * Given an oven temperature + time + food type + fryer model, produces
 * recommended air fryer temperature and time using the 20/20 rule as a
 * starting point, then applies food- and fryer-specific modifiers.
 *
 * Spec reference: CRISPCALC_BUILD_SPEC.md §6.2.
 */

export type FoodType =
  | "general"
  | "frozen"
  | "raw_meat"
  | "fish"
  | "baked"
  | "vegetables"
  | "reheating";

export type FryerModel =
  | "standard"
  | "ninja"
  | "cosori"
  | "vortex"
  | "philips"
  | "oven_style";

export type TempUnit = "F" | "C";

export interface ConversionInput {
  /** Oven temperature in Fahrenheit (always normalize to °F before calling). */
  ovenTempF: number;
  /** Oven time in whole minutes. */
  ovenTimeMin: number;
  foodType: FoodType;
  fryerModel: FryerModel;
}

export interface ConversionResult {
  /** Air fryer target temperature, rounded DOWN to the nearest 5°F. */
  airFryerTempF: number;
  /** Same temperature in whole °C. */
  airFryerTempC: number;
  /** Air fryer cook time in whole minutes (minimum 2). */
  airFryerTimeMin: number;
  /** Suggested early-check time (75% of cook time, minimum 2). */
  checkAtMin: number;
  /** Human-readable advisories for this conversion. */
  warnings: string[];
}

interface FoodModifier {
  tempReductionF: number;
  timeMultiplier: number;
}

interface FryerModifier {
  tempAdjustmentF: number;
  timeMultiplier: number;
}

/**
 * Per-food modifiers applied on top of the base 20/20 rule.
 * Values sourced from CRISPCALC_BUILD_SPEC.md §6.2.
 */
export const FOOD_MODIFIERS: Record<FoodType, FoodModifier> = {
  general: { tempReductionF: 25, timeMultiplier: 0.8 },
  frozen: { tempReductionF: 30, timeMultiplier: 0.85 },
  raw_meat: { tempReductionF: 25, timeMultiplier: 0.8 },
  fish: { tempReductionF: 30, timeMultiplier: 0.75 },
  baked: { tempReductionF: 35, timeMultiplier: 0.75 },
  vegetables: { tempReductionF: 20, timeMultiplier: 0.75 },
  reheating: { tempReductionF: 25, timeMultiplier: 0.5 },
};

/**
 * Per-fryer-model additional adjustments.
 * Values sourced from CRISPCALC_BUILD_SPEC.md §6.2.
 */
export const FRYER_MODIFIERS: Record<FryerModel, FryerModifier> = {
  standard: { tempAdjustmentF: 0, timeMultiplier: 1.0 },
  ninja: { tempAdjustmentF: -10, timeMultiplier: 0.95 },
  cosori: { tempAdjustmentF: -5, timeMultiplier: 1.0 },
  vortex: { tempAdjustmentF: 0, timeMultiplier: 1.0 },
  philips: { tempAdjustmentF: 0, timeMultiplier: 1.0 },
  oven_style: { tempAdjustmentF: 5, timeMultiplier: 1.05 },
};

/** Round a number down to the nearest multiple of 5. */
export function floorToNearest5(n: number): number {
  return Math.floor(n / 5) * 5;
}

/** Convert Fahrenheit to Celsius, rounded to the nearest whole degree. */
export function fahrenheitToCelsius(f: number): number {
  return Math.round((f - 32) * (5 / 9));
}

/** Convert Celsius to Fahrenheit, rounded to the nearest whole degree. */
export function celsiusToFahrenheit(c: number): number {
  return Math.round(c * (9 / 5) + 32);
}

/**
 * Normalize a temperature input (in its unit) to whole °F, which the
 * converter uses internally.
 */
export function toFahrenheit(value: number, unit: TempUnit): number {
  return unit === "F" ? value : celsiusToFahrenheit(value);
}

/**
 * Convert an oven recipe to air fryer settings.
 *
 * Returns a result even for degenerate inputs (0 or negative numbers) so
 * the UI can render sensibly without throwing. The minimum air fryer time
 * is clamped to 2 minutes.
 */
export function convert(input: ConversionInput): ConversionResult {
  const food = FOOD_MODIFIERS[input.foodType];
  const fryer = FRYER_MODIFIERS[input.fryerModel];

  // Temperature: start from oven temp, reduce by food amount, apply fryer offset.
  const rawTempF =
    input.ovenTempF - food.tempReductionF + fryer.tempAdjustmentF;

  // Time: multiply by food + fryer multipliers.
  const rawTimeMin =
    input.ovenTimeMin * food.timeMultiplier * fryer.timeMultiplier;

  // Spec: round temp DOWN to nearest 5°F (safer to undercook then add time).
  const airFryerTempF = floorToNearest5(rawTempF);
  const airFryerTempC = fahrenheitToCelsius(airFryerTempF);

  // Spec: round time to nearest whole minute, minimum 2.
  const airFryerTimeMin = Math.max(2, Math.round(rawTimeMin));

  // Spec: "check at" = 75% of cook time, minimum 2.
  const checkAtMin = Math.max(2, Math.round(airFryerTimeMin * 0.75));

  const warnings: string[] = [];

  if (input.ovenTempF > 450) {
    warnings.push(
      "Most air fryers max at 400–450°F. Use max temp and add 2–3 minutes.",
    );
  }

  if (input.foodType === "baked" && input.ovenTempF > 350) {
    warnings.push(
      "Baked goods can over-brown. Cover loosely with foil if needed.",
    );
  }

  if (input.foodType === "fish" && airFryerTimeMin > 15) {
    warnings.push("Check fish early — it cooks fast.");
  }

  return {
    airFryerTempF,
    airFryerTempC,
    airFryerTimeMin,
    checkAtMin,
    warnings,
  };
}
