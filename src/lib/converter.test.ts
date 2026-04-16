import { describe, it, expect } from "vitest";

import {
  celsiusToFahrenheit,
  convert,
  fahrenheitToCelsius,
  floorToNearest5,
  toFahrenheit,
  type ConversionInput,
} from "./converter";

/**
 * Unit tests for the CrispCalc converter.
 * Numbers below are hand-derived from the modifier tables in
 * CRISPCALC_BUILD_SPEC.md §6.2.
 */

describe("floorToNearest5", () => {
  it("leaves multiples of 5 unchanged", () => {
    expect(floorToNearest5(375)).toBe(375);
    expect(floorToNearest5(0)).toBe(0);
    expect(floorToNearest5(400)).toBe(400);
  });

  it("rounds down to the nearest multiple of 5", () => {
    expect(floorToNearest5(377)).toBe(375);
    expect(floorToNearest5(379)).toBe(375);
    expect(floorToNearest5(402)).toBe(400);
    expect(floorToNearest5(404)).toBe(400);
  });
});

describe("fahrenheitToCelsius", () => {
  it("converts freezing and boiling correctly", () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(fahrenheitToCelsius(212)).toBe(100);
  });

  it("rounds to the nearest whole degree", () => {
    // 375°F = 190.555...°C → 191
    expect(fahrenheitToCelsius(375)).toBe(191);
    // 365°F = 185.0°C → 185
    expect(fahrenheitToCelsius(365)).toBe(185);
  });
});

describe("celsiusToFahrenheit", () => {
  it("converts freezing and boiling correctly", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it("rounds to the nearest whole degree", () => {
    // 180°C = 356°F
    expect(celsiusToFahrenheit(180)).toBe(356);
    // 200°C = 392°F
    expect(celsiusToFahrenheit(200)).toBe(392);
  });
});

describe("toFahrenheit", () => {
  it("returns the value unchanged when unit is F", () => {
    expect(toFahrenheit(400, "F")).toBe(400);
  });

  it("converts when unit is C", () => {
    expect(toFahrenheit(200, "C")).toBe(392);
  });
});

describe("convert — baseline cases", () => {
  it("applies the basic 20/20 rule for general food on a standard fryer", () => {
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 30,
      foodType: "general",
      fryerModel: "standard",
    });

    // 400 - 25 = 375°F, 30 * 0.80 = 24 min, check at 18, no warnings.
    expect(result.airFryerTempF).toBe(375);
    expect(result.airFryerTempC).toBe(191);
    expect(result.airFryerTimeMin).toBe(24);
    expect(result.checkAtMin).toBe(18);
    expect(result.warnings).toEqual([]);
  });

  it("applies Ninja fryer extra temp and time reduction", () => {
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 40,
      foodType: "raw_meat",
      fryerModel: "ninja",
    });

    // 400 - 25 - 10 = 365°F, 40 * 0.80 * 0.95 = 30.4 → 30 min.
    expect(result.airFryerTempF).toBe(365);
    expect(result.airFryerTempC).toBe(185);
    expect(result.airFryerTimeMin).toBe(30);
    // round(30 * 0.75) = round(22.5) → 23
    expect(result.checkAtMin).toBe(23);
    expect(result.warnings).toEqual([]);
  });

  it("applies oven_style fryer positive temp offset and slower time", () => {
    const result = convert({
      ovenTempF: 350,
      ovenTimeMin: 20,
      foodType: "general",
      fryerModel: "oven_style",
    });

    // 350 - 25 + 5 = 330°F, 20 * 0.80 * 1.05 = 16.8 → 17 min.
    expect(result.airFryerTempF).toBe(330);
    expect(result.airFryerTimeMin).toBe(17);
    // round(17 * 0.75) = round(12.75) → 13
    expect(result.checkAtMin).toBe(13);
    expect(result.warnings).toEqual([]);
  });

  it("handles frozen food with larger temp reduction and smaller time cut", () => {
    const result = convert({
      ovenTempF: 425,
      ovenTimeMin: 20,
      foodType: "frozen",
      fryerModel: "standard",
    });

    // 425 - 30 = 395°F, 20 * 0.85 = 17 min.
    expect(result.airFryerTempF).toBe(395);
    expect(result.airFryerTimeMin).toBe(17);
    expect(result.warnings).toEqual([]);
  });

  it("reheats pizza quickly (50% of oven time)", () => {
    const result = convert({
      ovenTempF: 425,
      ovenTimeMin: 10,
      foodType: "reheating",
      fryerModel: "standard",
    });

    // 425 - 25 = 400°F, 10 * 0.50 = 5 min.
    expect(result.airFryerTempF).toBe(400);
    expect(result.airFryerTimeMin).toBe(5);
    expect(result.checkAtMin).toBe(4);
    expect(result.warnings).toEqual([]);
  });

  it("applies a smaller temp cut for vegetables", () => {
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 20,
      foodType: "vegetables",
      fryerModel: "standard",
    });

    // 400 - 20 = 380°F, 20 * 0.75 = 15 min.
    expect(result.airFryerTempF).toBe(380);
    expect(result.airFryerTimeMin).toBe(15);
  });
});

describe("convert — rounding rules", () => {
  it("rounds temp DOWN to the nearest 5°F, never up", () => {
    // 427 - 25 = 402 → floor to 400
    const result = convert({
      ovenTempF: 427,
      ovenTimeMin: 10,
      foodType: "general",
      fryerModel: "standard",
    });

    expect(result.airFryerTempF).toBe(400);
  });

  it("enforces a minimum air fryer time of 2 minutes", () => {
    // 2 * 0.50 = 1 → clamped to 2
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 2,
      foodType: "reheating",
      fryerModel: "standard",
    });

    expect(result.airFryerTimeMin).toBe(2);
    expect(result.checkAtMin).toBe(2);
  });

  it("enforces a minimum checkAt of 2 minutes even for very short cooks", () => {
    // 3 * 0.50 = 1.5 → clamped to 2, checkAt = round(1.5) → clamped to 2
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 3,
      foodType: "reheating",
      fryerModel: "standard",
    });

    expect(result.airFryerTimeMin).toBe(2);
    expect(result.checkAtMin).toBe(2);
  });
});

describe("convert — warnings", () => {
  it("warns when oven temp exceeds 450°F", () => {
    const result = convert({
      ovenTempF: 500,
      ovenTimeMin: 10,
      foodType: "general",
      fryerModel: "standard",
    });

    expect(result.warnings).toContain(
      "Most air fryers max at 400–450°F. Use max temp and add 2–3 minutes.",
    );
  });

  it("does NOT warn when oven temp is exactly 450°F", () => {
    const result = convert({
      ovenTempF: 450,
      ovenTimeMin: 10,
      foodType: "general",
      fryerModel: "standard",
    });

    expect(result.warnings).not.toContain(
      "Most air fryers max at 400–450°F. Use max temp and add 2–3 minutes.",
    );
  });

  it("warns about over-browning for baked goods above 350°F", () => {
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 30,
      foodType: "baked",
      fryerModel: "standard",
    });

    expect(result.warnings).toContain(
      "Baked goods can over-brown. Cover loosely with foil if needed.",
    );
  });

  it("does not warn about over-browning for baked goods at or below 350°F", () => {
    const result = convert({
      ovenTempF: 350,
      ovenTimeMin: 30,
      foodType: "baked",
      fryerModel: "standard",
    });

    expect(result.warnings).not.toContain(
      "Baked goods can over-brown. Cover loosely with foil if needed.",
    );
  });

  it("warns to check fish early when its cook time exceeds 15 min", () => {
    // 400 - 30 = 370°F, 30 * 0.75 = 22.5 → 23 min > 15
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 30,
      foodType: "fish",
      fryerModel: "standard",
    });

    expect(result.airFryerTimeMin).toBeGreaterThan(15);
    expect(result.warnings).toContain("Check fish early — it cooks fast.");
  });

  it("does NOT warn about fish when cook time is 15 min or less", () => {
    // 400 - 30 = 370°F, 15 * 0.75 = 11.25 → 11 min (≤ 15)
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 15,
      foodType: "fish",
      fryerModel: "standard",
    });

    expect(result.airFryerTimeMin).toBeLessThanOrEqual(15);
    expect(result.warnings).not.toContain("Check fish early — it cooks fast.");
  });

  it("can emit multiple warnings simultaneously", () => {
    // Baked at 475°F: over 450 AND over 350 while baked.
    const result = convert({
      ovenTempF: 475,
      ovenTimeMin: 20,
      foodType: "baked",
      fryerModel: "standard",
    });

    expect(result.warnings).toHaveLength(2);
    expect(result.warnings).toContain(
      "Most air fryers max at 400–450°F. Use max temp and add 2–3 minutes.",
    );
    expect(result.warnings).toContain(
      "Baked goods can over-brown. Cover loosely with foil if needed.",
    );
  });
});

describe("convert — real-world scenarios", () => {
  it("chicken wings on a standard basket (400°F / 40 min oven)", () => {
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 40,
      foodType: "raw_meat",
      fryerModel: "standard",
    });

    // 400 - 25 = 375°F, 40 * 0.80 = 32 min.
    expect(result.airFryerTempF).toBe(375);
    expect(result.airFryerTimeMin).toBe(32);
    expect(result.checkAtMin).toBe(24);
  });

  it("salmon on a Cosori (400°F / 20 min oven)", () => {
    const result = convert({
      ovenTempF: 400,
      ovenTimeMin: 20,
      foodType: "fish",
      fryerModel: "cosori",
    });

    // 400 - 30 - 5 = 365°F, 20 * 0.75 * 1.00 = 15 min.
    expect(result.airFryerTempF).toBe(365);
    expect(result.airFryerTimeMin).toBe(15);
    // time is exactly 15, not >15, so no fish warning
    expect(result.warnings).toEqual([]);
  });

  it("frozen french fries on a Ninja (450°F / 25 min oven)", () => {
    const result = convert({
      ovenTempF: 450,
      ovenTimeMin: 25,
      foodType: "frozen",
      fryerModel: "ninja",
    });

    // 450 - 30 - 10 = 410°F, 25 * 0.85 * 0.95 = 20.1875 → 20 min.
    expect(result.airFryerTempF).toBe(410);
    expect(result.airFryerTimeMin).toBe(20);
    expect(result.warnings).toEqual([]);
  });

  it("returns a ConversionInput-shaped object every time", () => {
    // Smoke test across all food/fryer combos to guarantee the function
    // never throws for valid enum inputs.
    const foods: ConversionInput["foodType"][] = [
      "general",
      "frozen",
      "raw_meat",
      "fish",
      "baked",
      "vegetables",
      "reheating",
    ];
    const fryers: ConversionInput["fryerModel"][] = [
      "standard",
      "ninja",
      "cosori",
      "vortex",
      "philips",
      "oven_style",
    ];

    for (const foodType of foods) {
      for (const fryerModel of fryers) {
        const result = convert({
          ovenTempF: 400,
          ovenTimeMin: 20,
          foodType,
          fryerModel,
        });

        expect(result.airFryerTempF % 5).toBe(0);
        expect(result.airFryerTimeMin).toBeGreaterThanOrEqual(2);
        expect(result.checkAtMin).toBeGreaterThanOrEqual(2);
        expect(result.checkAtMin).toBeLessThanOrEqual(result.airFryerTimeMin);
      }
    }
  });
});
