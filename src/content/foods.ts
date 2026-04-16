/**
 * Food preset index — drives `/foods`, `/foods/[slug]`, and the
 * homepage preset grid.
 *
 * Each preset carries:
 *   1. UI data the homepage needs (slug/name/kicker/defaults)
 *   2. Long-form content the preset page renders (intro, tips,
 *      variations, FAQs, related links)
 *   3. SEO data (updatedAt, yield) consumed by JSON-LD.
 *
 * Content is original — written for CrispCalc, not scraped from
 * other air fryer sites. Defaults reflect realistic *oven* recipes
 * that the calculator converts via spec §6.2.
 *
 * Spec reference: CRISPCALC_BUILD_SPEC.md §5, §7, §8.
 */

import {
  convert,
  type ConversionResult,
  type FoodType,
  type FryerModel,
  type TempUnit,
} from "@/lib/converter";
import type { CalculatorState } from "@/components/converter/labels";

/* ======================================================================
 * Types
 * ==================================================================== */

export interface FoodPresetTip {
  /** Short imperative heading — "Pat them bone dry." */
  heading: string;
  /** One- or two-sentence body. */
  body: string;
}

export interface FoodPresetVariation {
  /** Row label, e.g. "Frozen" or "Thick-cut". */
  label: string;
  /** Air fryer temperature for this variant, in the row's unit. */
  temp: number;
  /** Air fryer cook time in minutes for this variant. */
  time: number;
  /** Unit of temp. Defaults to F. */
  unit?: TempUnit;
  /** Short note — flip timing, seasoning cue, etc. */
  note?: string;
}

export interface FoodPresetFAQ {
  q: string;
  a: string;
}

export interface FoodPreset {
  /* ── Basic metadata ─────────────────────────────────────────────── */
  slug: string;
  name: string;
  kicker: string;
  defaults: CalculatorState;

  /* ── Preset-page content ────────────────────────────────────────── */
  metaDescription: string;
  intro: string;
  tips: FoodPresetTip[];
  variations: {
    title: string;
    rows: FoodPresetVariation[];
  };
  relatedSlugs: readonly [string, string, string];
  faqs: FoodPresetFAQ[];

  /* ── SEO / schema ───────────────────────────────────────────────── */
  /** HowTo schema `yield` field. e.g. "Serves 2–3". */
  yield: string;
  /** ISO-8601 date. Bump when content is edited. */
  updatedAt: string;
}

/* ======================================================================
 * Helpers
 * ==================================================================== */

const DEFAULT_UNIT: TempUnit = "F";
const DEFAULT_FRYER: FryerModel = "standard";

function buildDefaults(
  temp: number,
  time: number,
  food: FoodType,
): CalculatorState {
  return { temp, time, unit: DEFAULT_UNIT, food, fryer: DEFAULT_FRYER };
}

/** Derived air fryer result for a preset's default oven recipe. */
export function getPresetResult(preset: FoodPreset): ConversionResult {
  return convert({
    ovenTempF: preset.defaults.temp,
    ovenTimeMin: preset.defaults.time,
    foodType: preset.defaults.food,
    fryerModel: preset.defaults.fryer,
  });
}

/**
 * ISO-8601 duration for a minute count — used inside JSON-LD HowTo
 * `totalTime`. Example: 32 → "PT32M".
 */
export function minutesToIso(minutes: number): string {
  return `PT${Math.max(1, Math.round(minutes))}M`;
}

/* ======================================================================
 * Content
 * ==================================================================== */

const CHICKEN_WINGS: FoodPreset = {
  slug: "chicken-wings",
  name: "Chicken wings",
  kicker: "Crispy skin, juicy inside",
  defaults: buildDefaults(400, 40, "raw_meat"),

  metaDescription:
    "Convert oven chicken wings to air fryer time and temperature. Exact settings for fresh, frozen, and sauced wings — plus the one trick that makes skin actually shatter.",

  intro:
    "Wings are the food air fryers were practically invented for. Convection pulls surface moisture while hot air circulates around every piece, so the skin dehydrates and browns without the fat ever pooling. Start from a standard 400°F / 40-minute oven recipe and the calculator drops you into the range most cooks land at by trial and error — just tighter, and without flipping a baking sheet halfway through.",

  tips: [
    {
      heading: "Pat them bone-dry.",
      body: "Surface moisture is the single biggest reason wings come out soft. Blot hard with paper towels, then dust with aluminum-free baking powder — about ½ teaspoon per pound — if you want the extra crackle. Salt after the powder, not before.",
    },
    {
      heading: "Single layer, real space.",
      body: "Wings stacked on wings will steam. If your basket is 4 quarts or under, cook in two rounds; the second batch takes a minute less because the fryer is already hot. Keep round one warm on a wire rack over a sheet pan.",
    },
    {
      heading: "Shake at the check mark.",
      body: "The calculator's check time is your flip point. Shake the basket, or turn each wing skin-down to skin-up, then finish. This is also when to add any dry rub that contains sugar so it doesn't scorch.",
    },
    {
      heading: "Sauce last, or not at all.",
      body: "Wet sauce on raw wings traps steam and prevents browning. Toss after cooking, or paint on glaze for the last 3–4 minutes only. Dry rubs with salt, smoke, and spice are fine from the start.",
    },
  ],

  variations: {
    title: "Fresh, frozen, sauced — what to change",
    rows: [
      { label: "Fresh, plain", temp: 380, time: 25, note: "Flip at 15." },
      {
        label: "Frozen",
        temp: 380,
        time: 30,
        note: "No baking powder — steam gets in the way.",
      },
      {
        label: "Sauced (wet rub)",
        temp: 375,
        time: 28,
        note: "Sauce only the last 5 minutes.",
      },
      {
        label: "Drumettes + flats separated",
        temp: 400,
        time: 22,
        note: "Smaller pieces cook faster.",
      },
    ],
  },

  relatedSlugs: ["chicken-breast", "bacon", "meatballs"],

  faqs: [
    {
      q: "Does baking powder really help?",
      a: "Yes, if it's aluminum-free. It raises the skin's pH slightly and helps moisture leave faster, which means a drier, crackier surface. Use about a half-teaspoon per pound and don't confuse it with baking soda — that will taste metallic.",
    },
    {
      q: "Do I need to preheat?",
      a: "Most compact basket fryers recover in 2–3 minutes. Cosori and Ninja models barely need a preheat at all; oven-style units benefit from one. When in doubt, give it a two-minute run at your target temp.",
    },
    {
      q: "Can I cook wings straight from frozen?",
      a: "Yes. Add 4–5 minutes to the converted time and start at 380°F so the ice has room to leave before the skin starts browning. Skip the baking powder — it needs a dry surface to work.",
    },
    {
      q: "Why aren't my wings crispy?",
      a: "Almost always overcrowding. Wings need clear airflow on every side. The second-most-common reason is skipping the pat-dry step. Sauce applied too early is a distant third.",
    },
    {
      q: "What internal temperature should I pull them at?",
      a: "Aim for 185°F in the meatiest part, higher than you'd take breast meat. You want the collagen in the dark meat to render, which is what gives wings that pull-off-the-bone texture.",
    },
    {
      q: "Can I stack them if I shake a lot?",
      a: "No amount of shaking fixes a double layer. Stacked wings steam the pieces below them, and you'll end up with half-crispy, half-pale wings no matter what.",
    },
  ],

  yield: "Serves 3–4 as an appetizer",
  updatedAt: "2026-04-16",
};

const FRENCH_FRIES: FoodPreset = {
  slug: "french-fries",
  name: "French fries",
  kicker: "From frozen, no oil needed",
  defaults: buildDefaults(425, 25, "frozen"),

  metaDescription:
    "Frozen French fries in the air fryer: exact time and temperature from any oven recipe. Shoestring, crinkle, and fresh-cut — how the settings differ and why.",

  intro:
    "Most frozen fries were engineered for a home oven, which means the bag instructions assume slow, indirect heat. An air fryer delivers the same browning faster because the air is moving. The calculator takes a typical 425°F / 25-minute oven recipe and cuts both — you'll be eating fries in under 20 minutes with less oil clinging to the basket than a pan would leave.",

  tips: [
    {
      heading: "Single layer, always.",
      body: "Stack fries and the bottom layer turns to wet starch. A 4-quart basket holds about half a pound in one go. For a family of four, cook in two rounds or upgrade to a 6-quart.",
    },
    {
      heading: "Shake twice, not once.",
      body: "Halfway through, give the basket a hard shake. At the check mark, shake again and pull any that are already golden. Uneven shapes cook unevenly — that's normal, don't fight it.",
    },
    {
      heading: "Salt after, never before.",
      body: "Salt pulls moisture to the surface of a still-soft fry and delays browning. Wait until they're out of the basket, then season while they're still hot so it sticks.",
    },
    {
      heading: "Fresh-cut? Soak and oil.",
      body: "Hand-cut fries need a 30-minute cold-water soak to pull starch, a thorough dry, and 1–2 teaspoons of neutral oil per pound. Then cook a little cooler — around 380°F — for a little longer.",
    },
  ],

  variations: {
    title: "Cut and style",
    rows: [
      { label: "Frozen shoestring", temp: 400, time: 15, note: "Shake at 8." },
      {
        label: "Frozen crinkle / steak",
        temp: 400,
        time: 20,
        note: "Thicker = longer, same temp.",
      },
      {
        label: "Fresh-cut",
        temp: 380,
        time: 18,
        note: "Soak + dry + 2 tsp oil per pound.",
      },
      {
        label: "Curly / waffle",
        temp: 400,
        time: 14,
        note: "More surface area, faster crisp.",
      },
    ],
  },

  relatedSlugs: ["sweet-potato-fries", "frozen-pizza", "brussels-sprouts"],

  faqs: [
    {
      q: "Do I need to add oil to frozen fries?",
      a: "No. Commercial frozen fries are already coated — that's why they crisp up. Adding more oil is the fastest way to get soggy fries in an air fryer because the excess pools under the basket instead of evaporating.",
    },
    {
      q: "Why are mine limp in the middle?",
      a: "Either they were stacked, or they went in before the fryer was at temp. Give compact basket models a one-minute preheat and spread the fries in a single layer with gaps between them.",
    },
    {
      q: "Can I double-stack if I shake aggressively?",
      a: "Not really. Shaking only helps if there's airflow to rotate them into. A loose double layer in a large 6-quart basket can work at a lower temp and longer time, but the result is always a step down from single-layer.",
    },
    {
      q: "Should I preheat for fresh-cut fries?",
      a: "Yes, for fresh-cut only. A hot basket helps the outside set before the interior collapses, which is what you want for a real shoestring texture.",
    },
    {
      q: "How do I reheat leftover fries?",
      a: "The air fryer is the only way. Five minutes at 380°F brings them back — microwaves make them rubbery, and ovens take too long. Don't add oil; there's enough left from the first cook.",
    },
    {
      q: "Can I season before cooking?",
      a: "Dry seasonings like paprika or garlic powder, yes. Salt and anything sugary, no — salt draws moisture and sugar burns. Add those at the end.",
    },
  ],

  yield: "Serves 2 as a side",
  updatedAt: "2026-04-16",
};

const SALMON: FoodPreset = {
  slug: "salmon",
  name: "Salmon",
  kicker: "Flaky center, bronzed top",
  defaults: buildDefaults(400, 15, "fish"),

  metaDescription:
    "Air fryer salmon time and temperature, converted from any oven recipe. Skin-on, skinless, frozen, and whole-side settings with a doneness guide.",

  intro:
    "Salmon is the easiest big win in an air fryer. It cooks in under half the time an oven takes, the top browns without the interior drying out, and the kitchen doesn't smell like a fish market for three days. The calculator starts from a standard 400°F / 15-minute oven recipe for a one-inch fillet and pulls both temp and time back the way fish wants.",

  tips: [
    {
      heading: "Oil the skin, not the basket.",
      body: "A light brush of neutral oil on the skin side keeps it from sticking and helps it crisp into something you'll actually eat. Salt both sides; pepper after cooking so it doesn't scorch.",
    },
    {
      heading: "Thickness is the only variable that matters.",
      body: "A thin tail-end fillet cooks in seven minutes; a center-cut inch-thick piece takes eleven. Use the converter as a starting point for a 1-inch fillet and add a minute per extra half-inch.",
    },
    {
      heading: "Pull at 120°F for medium.",
      body: "A digital probe is worth the $15 it costs. 120°F in the thickest part gives you the glassy, just-flaking texture most recipes describe as medium. 130°F is medium-well. Past 140°F the fish chalks.",
    },
    {
      heading: "Rest it like steak.",
      body: "Two minutes on a plate lets the heat finish the center. If you cut in immediately you'll see raw-looking flesh that was actually done — it just hadn't relaxed yet.",
    },
  ],

  variations: {
    title: "By cut and starting state",
    rows: [
      {
        label: "Skin-on fillet (1 inch)",
        temp: 400,
        time: 10,
        note: "Skin-side down the whole time.",
      },
      {
        label: "Skinless fillet",
        temp: 400,
        time: 9,
        note: "Oil both sides.",
      },
      {
        label: "From frozen",
        temp: 380,
        time: 15,
        note: "First 5 min thaws, next 10 cook.",
      },
      {
        label: "Whole side (1.5–2 lb)",
        temp: 380,
        time: 16,
        note: "Check at 12 min, tent if browning.",
      },
    ],
  },

  relatedSlugs: ["chicken-breast", "brussels-sprouts", "bacon"],

  faqs: [
    {
      q: "Can I cook salmon from frozen?",
      a: "Yes, and in many ways it's better — the interior stays cooler longer, which gives you more margin before the outside overcooks. Use 380°F for 15 minutes on a one-inch fillet and check at 11 minutes.",
    },
    {
      q: "How thick should the fillet be?",
      a: "The calculator defaults assume a one-inch fillet, which is the most common grocery cut. Thinner tail ends need 2–3 minutes less. A 1.5-inch center cut needs 3–4 minutes more.",
    },
    {
      q: "How do I know it's done without a thermometer?",
      a: "Press the top gently. If it flakes into distinct layers with a spatula, it's done. If it springs back and holds shape, give it another minute. A fully opaque top usually means overcooked.",
    },
    {
      q: "Should I use parchment in the basket?",
      a: "Only if your basket is not non-stick or if you're cooking something delicate like miso-glazed salmon that would cement itself to the grate. Parchment slightly reduces airflow, so add a minute if you use it.",
    },
    {
      q: "Does the skin need to be on?",
      a: "No, but it protects the fillet from drying out and gives you a second texture. If you don't want to eat it, leave it on through cooking and lift the meat off the skin with a spatula at the end.",
    },
    {
      q: "Can I marinate salmon first?",
      a: "Yes, but briefly. Anything acidic — citrus, vinegar — starts cooking the fish after 20 minutes and can make it mealy. Soy, miso, and oil-based marinades are fine for up to an hour.",
    },
  ],

  yield: "Serves 2",
  updatedAt: "2026-04-16",
};

const BACON: FoodPreset = {
  slug: "bacon",
  name: "Bacon",
  kicker: "Even crisp without the splatter",
  defaults: buildDefaults(400, 15, "raw_meat"),

  metaDescription:
    "Air fryer bacon time and temperature. How to get even, splatter-free bacon every time — thin-cut, thick-cut, and what to do with the rendered fat.",

  intro:
    "Air fryer bacon is the cleanest way to cook it. No grease on the stovetop, no warped sheet pan, no standing there with tongs. The strips render slowly at first and then crisp fast in the last two minutes as the fat leaves. Start from a 400°F / 15-minute oven recipe — the calculator pulls that back the right amount for what is, technically, a very fatty piece of raw meat.",

  tips: [
    {
      heading: "Single layer, no overlap.",
      body: "Bacon that touches sticks together, rendered fat and all. In a 4-quart basket that's usually 4–5 strips. For more, cook in rounds and keep finished strips warm on a wire rack — paper towels make them steam and soften.",
    },
    {
      heading: "Drain the fat partway.",
      body: "About halfway through, pull the basket out and pour the rendered fat from the drip tray. Too much pooled fat smokes and can coat the strips in a way that blocks crisping.",
    },
    {
      heading: "Thick-cut needs a head start.",
      body: "Thick-cut bacon wants a lower temp for longer — 360°F for 16 minutes beats 400°F for 12 because the fat has time to render before the exterior hardens.",
    },
    {
      heading: "Save the fat.",
      body: "The drippings from air-fried bacon are cleaner than pan-fried because nothing burned. Strain into a jar and use for eggs, potatoes, or whatever you'd normally use bacon fat for.",
    },
  ],

  variations: {
    title: "By cut",
    rows: [
      {
        label: "Thin-cut (supermarket standard)",
        temp: 400,
        time: 9,
        note: "Check at 7 for soft-crisp.",
      },
      {
        label: "Thick-cut",
        temp: 360,
        time: 16,
        note: "Lower and slower renders better.",
      },
      {
        label: "Center-cut",
        temp: 380,
        time: 10,
        note: "Less fat, cook a hair shorter.",
      },
      {
        label: "Turkey bacon",
        temp: 360,
        time: 8,
        note: "Flip at 4 — it won't render.",
      },
    ],
  },

  relatedSlugs: ["chicken-wings", "salmon", "chicken-breast"],

  faqs: [
    {
      q: "Do I need to preheat?",
      a: "No. Bacon goes in cold; starting from a cold basket actually helps the fat render evenly instead of searing too fast. If your fryer has a specific bacon setting, ignore it — the default temp is usually too high.",
    },
    {
      q: "How do I dispose of the fat?",
      a: "Strain the warm fat into a heat-safe jar and keep it in the fridge — it's a cooking ingredient, not waste. If you really don't want it, let it solidify and scrape into the trash; never pour warm fat down a drain.",
    },
    {
      q: "Why does my fryer smoke with bacon?",
      a: "Fat pooled at the bottom of the drawer is hitting the heating element. Pause the cook halfway through and pour the fat off. A piece of bread in the drip tray absorbs splatter if your model can fit one.",
    },
    {
      q: "Why are some strips crispy and others soft?",
      a: "Uneven cuts cook unevenly. Bacon also has variable fat content along its length — the fatty end crisps faster than the meaty end. Pull early-done strips and finish the rest for an extra minute.",
    },
    {
      q: "Can I stack bacon if I flip it?",
      a: "No. Unlike fries, bacon stuck to itself won't separate mid-cook because the fat glues the strips together. Always cook in a single layer.",
    },
    {
      q: "Is air fryer bacon healthier?",
      a: "Slightly — less fat remains in the strip because the drippings drain away. The calorie difference is real but small. The bigger win is the cleaner kitchen.",
    },
  ],

  yield: "Serves 2",
  updatedAt: "2026-04-16",
};

const FROZEN_PIZZA: FoodPreset = {
  slug: "frozen-pizza",
  name: "Frozen pizza",
  kicker: "Crackly crust, melty top",
  defaults: buildDefaults(425, 18, "frozen"),

  metaDescription:
    "How to cook frozen pizza in the air fryer — exact time and temperature, which sizes fit, and why it beats the oven for crust texture.",

  intro:
    "Air fryer frozen pizza isn't a compromise — for the kind of pizza that comes frozen, it's usually the right tool. The underside gets genuinely crisp instead of the mushy bottom a home oven leaves, the cheese browns in spots instead of oozing flat, and the whole thing is done while an oven would still be preheating. The only catch is size: you need a basket big enough.",

  tips: [
    {
      heading: "Measure the basket first.",
      body: "Most 4-quart baskets fit a 7-inch pizza. 5.5-quart baskets fit up to 8 inches. Larger oven-style fryers can take a 10-inch. If the pizza doesn't lie flat, it cooks flat — and then doesn't.",
    },
    {
      heading: "Parchment underneath, never on top.",
      body: "A piece of parchment cut to basket size prevents the crust from sticking and catches cheese drips. Don't cover the pizza — parchment on top blocks the very thing that crisps the cheese.",
    },
    {
      heading: "Check at two-thirds.",
      body: "At the calculator's check time, peek. If the cheese is bubbling but not browning, give it another two minutes. If it's already browned, pull immediately — carryover heat keeps cooking the center.",
    },
    {
      heading: "Don't stack toppings.",
      body: "Extra fresh toppings on a frozen pizza — pepperoni on a cheese pizza, for instance — need to go on before cooking, not partway through. Stacking cold things on a half-cooked pizza doesn't save time and cools the whole thing down.",
    },
  ],

  variations: {
    title: "By crust style",
    rows: [
      {
        label: "Thin-crust (7–8 in)",
        temp: 380,
        time: 9,
        note: "Crispest under; check at 7.",
      },
      {
        label: "Rising crust / deep-dish",
        temp: 360,
        time: 14,
        note: "Lower temp lets the dough rise.",
      },
      {
        label: "Stuffed-crust",
        temp: 380,
        time: 12,
        note: "Watch the edges — cheese escapes.",
      },
      {
        label: "Flatbread / naan pizza",
        temp: 380,
        time: 7,
        note: "Already thin; 6 min may be enough.",
      },
    ],
  },

  relatedSlugs: ["reheated-pizza", "french-fries", "meatballs"],

  faqs: [
    {
      q: "How big a pizza will actually fit?",
      a: "Measure the basket interior at its narrowest point — the insert usually tapers. A 7-inch pizza fits almost everywhere; 8 inches needs a 5.5-quart or larger; 10 inches requires an oven-style unit. Don't force a bigger one in; the edges will burn against the walls.",
    },
    {
      q: "Do I really need parchment?",
      a: "If your basket is well-seasoned non-stick, no. If the pizza has a rough, seeded, or cornmeal-heavy bottom, yes — those tend to stick. Pre-cut basket parchment liners with holes work better than flat parchment because they preserve airflow.",
    },
    {
      q: "Why is my cheese melted but the crust is still doughy?",
      a: "Basket too small, pizza cooking upward but not downward. Try a lower temperature for longer; the heat has time to reach the bottom before the top over-browns.",
    },
    {
      q: "Can I reheat leftover frozen pizza in the air fryer?",
      a: "Yes — see the reheated-pizza page for settings. Cold slices go at 400°F for 4 minutes with no preheat. Fresh-from-freezer follows the settings above.",
    },
    {
      q: "Will toppings fly around?",
      a: "Light toppings like fresh basil will. Wait and add them after cooking. Everything else — pepperoni, veggies — is fine because the convection isn't as aggressive as it looks.",
    },
    {
      q: "Is it better than the oven?",
      a: "For frozen pizza under 10 inches, almost always yes. The bottom crisps, the oven stays unused, and it takes half the time. For a 14-inch pizza, you'd need an oven anyway.",
    },
  ],

  yield: "Serves 1–2",
  updatedAt: "2026-04-16",
};

const CHICKEN_BREAST: FoodPreset = {
  slug: "chicken-breast",
  name: "Chicken breast",
  kicker: "Seared edges, tender inside",
  defaults: buildDefaults(400, 25, "raw_meat"),

  metaDescription:
    "Air fryer chicken breast time and temperature, converted from any oven recipe. How to avoid dry chicken breast with the right temp, pull point, and rest.",

  intro:
    "Dry chicken breast is almost always a time problem, not a temperature problem. The air fryer fixes it by cooking fast at higher heat — the outside browns before the inside has time to dry out. Start from a 400°F / 25-minute oven recipe and the calculator gets you into the range for a 6- to 8-ounce boneless breast, pulled at 160°F and rested to 165°F off-heat.",

  tips: [
    {
      heading: "Pound to even thickness.",
      body: "A breast that's an inch at one end and half an inch at the other will always give you a dry tip and a pink middle. Plastic-wrap it and pound with the flat side of a meat mallet to a uniform ¾ inch. Ten seconds per breast saves ten minutes of frustration.",
    },
    {
      heading: "Oil lightly and salt early.",
      body: "A thin coat of neutral oil — olive is fine — helps seasoning stick and speeds browning. Salt at least 15 minutes before cooking if you have the time; 40 minutes is better. The salt travels and the breast holds onto more moisture.",
    },
    {
      heading: "Pull at 160°F, rest to 165°F.",
      body: "USDA safe is 165°F, but carryover heat will take 160°F breast to 165°F in a three-minute rest. Pulling at 165°F means eating 170°F chicken, and at that temp the muscle fibers have wrung themselves dry.",
    },
    {
      heading: "Rest cut-side down.",
      body: "If you're slicing into it, rest with the cut side on the cutting board for a minute or two first. The juices redistribute instead of pooling on the plate.",
    },
  ],

  variations: {
    title: "By cut and starting state",
    rows: [
      {
        label: "Boneless, skinless (7 oz)",
        temp: 375,
        time: 18,
        note: "Flip at 10.",
      },
      {
        label: "Bone-in, skin-on",
        temp: 375,
        time: 28,
        note: "Longer for bone conduction.",
      },
      {
        label: "From frozen (boneless)",
        temp: 360,
        time: 24,
        note: "No thaw; pull at 160°F.",
      },
      {
        label: "Stuffed (with cheese or spinach)",
        temp: 365,
        time: 22,
        note: "Check stuffing temp, not just meat.",
      },
    ],
  },

  relatedSlugs: ["chicken-wings", "meatballs", "salmon"],

  faqs: [
    {
      q: "Do I need to thaw frozen chicken?",
      a: "No. Air fryers cook frozen boneless breasts well — add about 5 minutes to the converted time, start a bit cooler at 360°F, and use a thermometer. Bone-in frozen is harder and we recommend thawing.",
    },
    {
      q: "Should I brine first?",
      a: "For dry brine (just salt, 40 minutes minimum, uncovered in the fridge): yes, it helps. For wet brine: it's fine but unnecessary for the short cook times air fryers deliver. The gains are small compared to a good dry brine.",
    },
    {
      q: "How do I know it's done without a thermometer?",
      a: "Honestly, buy a thermometer. The $15 Thermapen-style ones are worth it. If you're thermometer-less, press the thickest part with a finger — fully cooked chicken feels firm and springs back; underdone feels soft like raw.",
    },
    {
      q: "Can I cook breaded chicken breast in the air fryer?",
      a: "Absolutely — that's one of the air fryer's best tricks. Spray the breading with a light oil coating before cooking. The breading browns like it was fried in oil.",
    },
    {
      q: "How long do leftovers last?",
      a: "Sealed in the fridge, 3–4 days. Reheat at 350°F for 3–4 minutes in the air fryer — enough to warm through without re-cooking. Microwaves turn chicken breast rubbery.",
    },
    {
      q: "Why is mine stringy?",
      a: "Overcooked. Stringy texture means the muscle fibers have contracted and squeezed their water out. Pull earlier; trust the thermometer over the clock.",
    },
  ],

  yield: "Serves 2–3",
  updatedAt: "2026-04-16",
};

const BRUSSELS_SPROUTS: FoodPreset = {
  slug: "brussels-sprouts",
  name: "Brussels sprouts",
  kicker: "Charred leaves, creamy hearts",
  defaults: buildDefaults(400, 20, "vegetables"),

  metaDescription:
    "Air fryer Brussels sprouts: the exact time and temperature to get restaurant-style char. How much oil, why cut-side down matters, and what to do with the loose leaves.",

  intro:
    "The restaurant Brussels sprouts you've had — the ones with papery, burnt leaves and a buttery interior — are doing two things a home oven can't easily: hitting a very hot, very dry surface and cooking fast enough that the inside stays creamy. The air fryer does both without much effort. Start from a 400°F / 20-minute oven recipe and the calculator pulls the temp back just enough to keep the outside from turning to ash.",

  tips: [
    {
      heading: "Halve them, cut-side down.",
      body: "The cut face is where the char happens. Halve each sprout through the stem, toss with oil, and arrange cut-side down for the first two-thirds of the cook. A loose leaf or two will fall off — that's fine, they turn into chips.",
    },
    {
      heading: "One tablespoon of oil per pound.",
      body: "Less than that and they dry out; more than that and they steam. Neutral oil, olive oil, or rendered bacon fat all work. Toss thoroughly so every cut surface has a thin sheen.",
    },
    {
      heading: "Shake at the check mark.",
      body: "At the check time, shake hard. The sprouts rotate, some loose leaves come free and crisp separately, and the ones that were already charred move out of the hot spots.",
    },
    {
      heading: "Finish with acid.",
      body: "Sprouts take to acid the way potatoes take to salt. A squeeze of lemon, a drizzle of balsamic, or a splash of sherry vinegar after cooking turns them from side dish into something you want seconds of.",
    },
  ],

  variations: {
    title: "By size and style",
    rows: [
      {
        label: "Fresh, halved",
        temp: 380,
        time: 15,
        note: "Standard — shake at 10.",
      },
      {
        label: "Quartered large sprouts",
        temp: 380,
        time: 13,
        note: "More surface = faster char.",
      },
      {
        label: "With bacon or pancetta",
        temp: 375,
        time: 18,
        note: "Render fat first, then add sprouts.",
      },
      {
        label: "Shaved / shredded",
        temp: 380,
        time: 7,
        note: "Closer to hash browns than sprouts.",
      },
    ],
  },

  relatedSlugs: ["sweet-potato-fries", "french-fries", "salmon"],

  faqs: [
    {
      q: "Fresh or frozen?",
      a: "Fresh, almost always. Frozen sprouts release water as they thaw and end up steamed instead of charred. If you only have frozen, cook them 2 extra minutes at 400°F and accept that the char will be less dramatic.",
    },
    {
      q: "How much oil is too much?",
      a: "Anything over 2 tablespoons per pound is too much. Excess oil pools at the bottom of the basket, smokes at air fryer temperatures, and coats the sprouts in a way that blocks browning.",
    },
    {
      q: "Why are my leaves burning but the sprouts are raw inside?",
      a: "Your fryer is running hot — try 370°F instead of 400°F — or the sprouts are too big. Halve any that are larger than a ping-pong ball.",
    },
    {
      q: "When do I add balsamic or honey?",
      a: "In the last two minutes, not before. Sugar-heavy glazes burn at air fryer temperatures. Toss cooked sprouts with the glaze on a plate or finish in a skillet for 30 seconds if you want real glazing.",
    },
    {
      q: "Can I cook them whole?",
      a: "You can, but the outside leaves burn before the heart cooks through. If you need to cook them whole for a presentation, drop the temp to 360°F and go for 20 minutes, shaking twice.",
    },
    {
      q: "How do I reheat leftovers?",
      a: "The air fryer, again, is your friend. Four minutes at 380°F brings back the crisp. Microwaves turn them sad and green.",
    },
  ],

  yield: "Serves 3 as a side",
  updatedAt: "2026-04-16",
};

const SWEET_POTATO_FRIES: FoodPreset = {
  slug: "sweet-potato-fries",
  name: "Sweet potato fries",
  kicker: "Caramelised edges, soft middle",
  defaults: buildDefaults(425, 22, "vegetables"),

  metaDescription:
    "Air fryer sweet potato fries that actually get crisp. Time, temperature, the cornstarch trick, and why they're harder than regular fries.",

  intro:
    "Sweet potato fries are harder than regular fries for a simple reason: their sugar caramelizes faster than the starch can crisp. Hit them too hot and you get black edges around a still-wet middle. The calculator pulls your oven recipe back the right amount — you're aiming for the texture people describe as 'restaurant-crisp' but which is really just a controlled surface dehydration before the sugar takes over.",

  tips: [
    {
      heading: "Uniform cuts, thick side.",
      body: "Aim for ½-inch thick, whatever length. Thinner fries burn before they crisp. A mandoline is overkill; a sharp knife and twenty seconds of effort is enough.",
    },
    {
      heading: "Cornstarch dust for real crisp.",
      body: "After tossing with oil, add a tablespoon of cornstarch per pound and toss again until the fries look matte. This is the trick restaurants use. Not flour — cornstarch specifically crisps into a thin shell.",
    },
    {
      heading: "Moderate temp, patient.",
      body: "Go 380°F, not 400°F. The extra 20°F you'd use for regular fries is what makes sweet potato fries char. A cooler cook for a few extra minutes gets you caramel instead of carbon.",
    },
    {
      heading: "Flip at the check mark.",
      body: "These fries are heavier than regular fries and sit on their surface longer. At the check mark, shake and also manually turn any that are flat-side-down — the tongs-and-thirty-seconds of effort is worth it.",
    },
  ],

  variations: {
    title: "By cut",
    rows: [
      { label: "Hand-cut, ½ inch thick", temp: 380, time: 18, note: "Cornstarch dust." },
      {
        label: "Frozen",
        temp: 400,
        time: 15,
        note: "No oil, no cornstarch — just cook.",
      },
      {
        label: "Wedges (¾ inch)",
        temp: 370,
        time: 22,
        note: "Longer, cooler — interior needs to cook.",
      },
      {
        label: "Spiralized",
        temp: 380,
        time: 12,
        note: "Shake every 3 min; they tangle.",
      },
    ],
  },

  relatedSlugs: ["french-fries", "brussels-sprouts", "meatballs"],

  faqs: [
    {
      q: "Why cornstarch, not flour?",
      a: "Flour makes a gummy coating. Cornstarch — without protein — dehydrates into a thin glass-like shell when it hits hot air. The result is the same texture you'd get from a double-fry in oil.",
    },
    {
      q: "Why are mine soft in the middle?",
      a: "Too hot, too short. Sweet potato fries need time for the interior starches to cook. Drop the temp 20°F and add 3 minutes — the outside will look ready sooner, but trust the process.",
    },
    {
      q: "Can I skip the cornstarch?",
      a: "You can, and you'll get a decent soft-outside fry. If you want restaurant-style crisp, the cornstarch is non-negotiable. It's about a dollar's worth and it's in your pantry already.",
    },
    {
      q: "Sweet seasoning or savory?",
      a: "Both work. Cinnamon-sugar goes on at the end (sugar burns). Smoked paprika, cumin, and chipotle go on before cooking with the oil. Salt after, always.",
    },
    {
      q: "What oil is best?",
      a: "Neutral with a high smoke point — avocado, canola, or refined olive. Butter will burn. Extra-virgin olive oil is fine for flavor but not the crispest result.",
    },
    {
      q: "Can I dip them in anything besides ketchup?",
      a: "Chipotle mayo, garlic aioli, maple mustard, or — if you want to be talked about — a honey-sriracha crema. Ketchup's fine too.",
    },
  ],

  yield: "Serves 2 as a side",
  updatedAt: "2026-04-16",
};

const MEATBALLS: FoodPreset = {
  slug: "meatballs",
  name: "Meatballs",
  kicker: "Browned outside, moist inside",
  defaults: buildDefaults(400, 18, "raw_meat"),

  metaDescription:
    "Air fryer meatballs: exact time and temperature for fresh, frozen, and oversized. Why they don't fall apart and when to add sauce.",

  intro:
    "Meatballs are one of the foods where the air fryer outright beats the pan. You get even browning on every side instead of only two, no babysitting, no worrying about breaking them when you flip. The calculator starts from a typical 400°F / 18-minute oven recipe for 1.5-inch beef meatballs — the size most people actually make — and gives you the air fryer equivalent.",

  tips: [
    {
      heading: "Consistent size, consistent doneness.",
      body: "An ice cream scoop is the difference between meatballs that all finish together and meatballs where half are perfect and half are dry. A 1.5-inch scoop gets you 2-ounce meatballs, which is the sweet spot.",
    },
    {
      heading: "Oil the basket or use parchment.",
      body: "Meatballs stick to hot metal. A spritz of oil or a parchment liner with holes punched in it fixes this. Non-stick basket coating doesn't always survive meatball cooks.",
    },
    {
      heading: "Don't crowd.",
      body: "Leave a meatball's worth of space between each one. Stacked meatballs steam where they touch and you get pale spots. For big batches, cook in rounds — they reheat beautifully.",
    },
    {
      heading: "Sauce after, not during.",
      body: "Add sauce to cooked meatballs, not raw ones. The air fryer can't brown a sauced surface, and you'll end up with wet, pale meatballs. Transfer to a pan of simmering sauce for the last two minutes if you want them coated.",
    },
  ],

  variations: {
    title: "By meat and size",
    rows: [
      { label: "Beef, 1.5 inch", temp: 375, time: 14, note: "Classic size." },
      {
        label: "Turkey or chicken",
        temp: 375,
        time: 13,
        note: "Pull at 165°F internal.",
      },
      {
        label: "Frozen (pre-cooked)",
        temp: 380,
        time: 8,
        note: "Reheat only — don't overcook.",
      },
      {
        label: "Oversized (2.5 inch)",
        temp: 360,
        time: 20,
        note: "Lower temp so center cooks.",
      },
    ],
  },

  relatedSlugs: ["chicken-wings", "chicken-breast", "frozen-pizza"],

  faqs: [
    {
      q: "Can I cook frozen meatballs?",
      a: "Yes — if they're pre-cooked (most store-bought are), you're just reheating. 380°F for 8 minutes warms them through without drying them out. Raw frozen meatballs need the full cook time plus 3–4 minutes.",
    },
    {
      q: "Why are mine falling apart?",
      a: "Usually not enough binder. A standard ratio is 1 egg and a half-cup of breadcrumbs per pound of meat. If the mix feels wet and loose before cooking, it'll fall apart in the fryer too.",
    },
    {
      q: "Can I stack or double-layer?",
      a: "Not really. Meatballs need airflow on all sides to brown evenly. A loose scatter is better than a tight grid even if you have to cook in batches.",
    },
    {
      q: "Should I sear before or skip that step?",
      a: "Skip it. The air fryer browns every side at once, which is what searing accomplishes. You'd be doing the same work twice.",
    },
    {
      q: "How do I keep them warm for a crowd?",
      a: "A 200°F oven or warming drawer for up to 30 minutes. Don't hold them in sauce — they'll keep absorbing liquid and turn mushy.",
    },
    {
      q: "Can I make them ahead?",
      a: "Yes — form meatballs the night before and refrigerate covered. Cook straight from the fridge; add 1–2 minutes to the time. Fully cooked meatballs freeze well for three months.",
    },
  ],

  yield: "Serves 4 (makes about 16 meatballs)",
  updatedAt: "2026-04-16",
};

const REHEATED_PIZZA: FoodPreset = {
  slug: "reheated-pizza",
  name: "Reheated pizza",
  kicker: "Crisp again, never rubbery",
  defaults: buildDefaults(400, 8, "reheating"),

  metaDescription:
    "How to reheat pizza in the air fryer — exact time and temperature. Bottom stays crisp, cheese stays melty, no microwave sadness.",

  intro:
    "There's a short list of foods the microwave actively ruins, and pizza is at the top of it. The air fryer is the only home reheating method that restores the crust — hot air crisps the bottom again while the cheese melts evenly above it. The calculator takes what would be a short oven reheat and gives you the air fryer version, which runs cooler and shorter than most people think.",

  tips: [
    {
      heading: "Don't preheat.",
      body: "Reheating is one of the few cases where a cold basket helps. The pizza has more time to warm through before the cheese starts bubbling. Preheated fryers can cook the top before the bottom crisps.",
    },
    {
      heading: "One or two slices at a time.",
      body: "Stacked slices don't work; slices leaning against each other steam where they touch. The air fryer's job here is airflow — let it do that.",
    },
    {
      heading: "Cold from the fridge, nothing else.",
      body: "Don't microwave first and then 'finish' in the air fryer — the microwave turns the crust rubbery before the air fryer gets a chance. Straight-from-cold works because the crust hasn't had a chance to hydrate yet.",
    },
    {
      heading: "Pull when the cheese bubbles.",
      body: "That's your doneness cue. The bottom will be crisp by then; the top is hot because the cheese just finished melting. Waiting past the bubble phase dries it out.",
    },
  ],

  variations: {
    title: "By pizza style",
    rows: [
      {
        label: "Thin-crust",
        temp: 400,
        time: 3,
        note: "Thin dough needs less heat time.",
      },
      {
        label: "Deep-dish / Detroit",
        temp: 380,
        time: 6,
        note: "Slow heat-through for thick crust.",
      },
      {
        label: "Stuffed-crust",
        temp: 380,
        time: 5,
        note: "Watch the edges — cheese pouch can leak.",
      },
      {
        label: "Day-3 pizza (or older)",
        temp: 400,
        time: 4,
        note: "Spritz of water on crust before — it helps.",
      },
    ],
  },

  relatedSlugs: ["frozen-pizza", "french-fries", "chicken-wings"],

  faqs: [
    {
      q: "Can I reheat from cold, or should I let it come to room temp first?",
      a: "Cold is better. Room-temp slices re-absorb moisture from the air and the cheese gets rubbery. Pull from the fridge, straight to the basket.",
    },
    {
      q: "Can I reheat multiple slices?",
      a: "In a 4-quart basket, one to two slices max. In a 5.5-quart, up to three. Larger oven-style air fryers can handle a whole reheated pie. Overfilling means steaming, and steaming means rubbery crust.",
    },
    {
      q: "Why is my bottom still soggy?",
      a: "Either the basket was preheated (don't) or the slice had too much moisture on the bottom to start. Spritz the crust — not the toppings — with water before the cook, which sounds wrong but actually helps by creating a quick steam layer that then evaporates into crisp.",
    },
    {
      q: "Can I reheat frozen pizza slices the same way?",
      a: "No — frozen slices need the frozen-pizza settings (longer, cooler, more like a cook than a reheat). The reheat settings here assume the pizza was already cooked and is just cold.",
    },
    {
      q: "Will the toppings slide off?",
      a: "Vegetables and pepperoni stay put. Piled-on fresh toppings like arugula or basil will blow around — remove them before reheating and replace after.",
    },
    {
      q: "What about pan pizza?",
      a: "Same temperature, slightly longer — add 1–2 minutes. Deep-dish slices benefit from going in on their side so the cheese reheats from two directions instead of only above.",
    },
  ],

  yield: "Serves 1",
  updatedAt: "2026-04-16",
};

/* ======================================================================
 * Exported array + lookups
 * ==================================================================== */

export const FOOD_PRESETS: readonly FoodPreset[] = [
  CHICKEN_WINGS,
  FRENCH_FRIES,
  SALMON,
  BACON,
  FROZEN_PIZZA,
  CHICKEN_BREAST,
  BRUSSELS_SPROUTS,
  SWEET_POTATO_FRIES,
  MEATBALLS,
  REHEATED_PIZZA,
] as const;

export function getFoodPreset(slug: string): FoodPreset | undefined {
  return FOOD_PRESETS.find((p) => p.slug === slug);
}

export function getRelatedPresets(
  preset: FoodPreset,
): readonly FoodPreset[] {
  return preset.relatedSlugs
    .map((slug) => FOOD_PRESETS.find((p) => p.slug === slug))
    .filter((p): p is FoodPreset => Boolean(p));
}
