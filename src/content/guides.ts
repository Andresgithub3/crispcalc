/**
 * Long-form guide content — drives `/guides` and `/guides/[slug]`.
 *
 * Each guide is a short-form blog article (~1000 words) written for
 * CrispCalc. Structure mirrors `foods.ts` so routes and JSON-LD share
 * one shape:
 *   - Lead-in copy for the hero
 *   - Body sections with H2 + paragraphs
 *   - Internal links to food presets and other guides
 *
 * Per spec §8: each guide links back to the calculator and to ≥2
 * relevant food pages. Per spec §15: original content only.
 *
 * Spec reference: CRISPCALC_BUILD_SPEC.md §5, §8.
 */

/* ======================================================================
 * Types
 * ==================================================================== */

export type GuideSection =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string; id: string }
  | { kind: "h3"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; tone: "info" | "warn"; text: string };

export interface Guide {
  slug: string;
  /** Short title for the header — not the H1, which is in `title`. */
  kicker: string;
  /** Full H1. */
  title: string;
  /** One-sentence meta description / subtitle. */
  description: string;
  /** Lead paragraph under the H1. */
  lead: string;
  /** Approximate reading time, in whole minutes. */
  readingTime: number;
  /** ISO-8601 date. Bump when content is edited. */
  updatedAt: string;
  /** Body content — rendered in order. */
  sections: GuideSection[];
  /** Two or more related food preset slugs (spec §8 internal linking). */
  relatedFoodSlugs: readonly string[];
  /** Slugs of other guides worth reading next. */
  relatedGuideSlugs: readonly string[];
}

/* ======================================================================
 * Content
 * ==================================================================== */

const HOW_AIR_FRYERS_WORK: Guide = {
  slug: "how-air-fryers-actually-work",
  kicker: "The physics",
  title: "How air fryers actually work",
  description:
    "An air fryer is a small convection oven with a loud fan. Understanding that sentence is the difference between soggy dinner and perfect crust.",
  lead: "Strip away the marketing and an air fryer is one of the simplest appliances in your kitchen: a heating element and a fan, pointed at a basket. The interesting part is what that does to food — and what it cannot do, no matter how hot you crank it.",
  readingTime: 6,
  updatedAt: "2026-04-16",
  sections: [
    {
      kind: "h2",
      id: "its-just-convection",
      text: "It's just convection, moving fast",
    },
    {
      kind: "p",
      text: "A convection oven circulates hot air to cook food more evenly than a still-air oven. An air fryer does the same thing in a box one-tenth the size, with a fan sized aggressively for the volume. The hot air moves faster past the food, which means two things: surfaces dehydrate more quickly, and heat transfer to the food's interior speeds up as well.",
    },
    {
      kind: "p",
      text: "That first effect — surface dehydration — is what everyone means when they say air fryers \"crisp.\" The fan strips moisture away from the outside of the food, and a dry, hot surface browns. The Maillard reaction (proteins and sugars reacting at high temperatures) and caramelization (sugars breaking down) both need a dry surface to proceed, so an air fryer naturally hits those reactions faster than a regular oven.",
    },
    {
      kind: "h2",
      id: "there-is-no-oil",
      text: "There is no frying. There never was.",
    },
    {
      kind: "p",
      text: "The name is marketing. Deep frying cooks food by submerging it in oil at 325–375°F, where water inside the food flashes to steam and gets pushed out as oil coats the surface. Air \"frying\" does none of that. It dries and browns the outside via hot air. The textures can be similar — both produce a crisp shell — but they are not the same physical process, and recipes do not translate one-to-one.",
    },
    {
      kind: "p",
      text: "This matters in practice. Battered foods that were designed for the deep fryer will generally not crisp up the same way in an air fryer, because the batter was engineered for oil immersion. Frozen foods that were parfried before freezing (most store-bought fries, mozzarella sticks, breaded chicken) do great, because the fat is already in the coating. Anything that was wet-battered at home is a toss-up.",
    },
    {
      kind: "h2",
      id: "size-changes-the-math",
      text: "Why the 20/20 rule is a starting point, not a promise",
    },
    {
      kind: "p",
      text: "The popular conversion is \"drop 20 degrees, cut time by 20%.\" That works for a lot of food because air fryers are fast and hot, but it assumes a standard-size basket-style fryer and a generic piece of food. The reality is messier:",
    },
    {
      kind: "list",
      items: [
        "Cheaper basket fryers run 10–20°F hotter than their dial says. Premium models run cooler and more accurately.",
        "High-wattage fryers (the Ninja Foodi line, for example) heat up in a minute and cook 10–15% faster than a standard 1500W unit.",
        "Oven-style air fryers behave almost like small convection ovens, so the 20/20 rule barely applies — they need closer to a 15°F drop and 10% less time.",
        "Food matters too: a dense piece of raw chicken cooks differently from a layer of frozen fries, and neither behaves like a tray of cookies.",
      ],
    },
    {
      kind: "p",
      text: "Our calculator builds these modifiers in so you don't have to memorize them. Pick the food type and the fryer model and it adjusts the base conversion automatically.",
    },
    {
      kind: "h2",
      id: "what-this-means-in-the-kitchen",
      text: "What this means when you're cooking",
    },
    {
      kind: "p",
      text: "A few practical takeaways that fall out of the physics:",
    },
    {
      kind: "list",
      items: [
        "Dry the food. Any surface moisture is heat the fryer has to evaporate before it can brown anything. Paper towels matter more than a fancy rub.",
        "Don't crowd the basket. Steam from one piece soaks the next one. Cook in rounds if you have to — the second round is faster because the fryer is already hot.",
        "Preheat if you want a brown outside and a juicy inside. A cold start means the surface spends too long at a moderate temperature, which overcooks the interior before the outside gets dry.",
        "Open the basket. The fan can't circulate around wings if they're glued together; a mid-cook shake is how the second side gets cooked at all.",
      ],
    },
    {
      kind: "callout",
      tone: "info",
      text: "If you remember one thing: the fan is the feature. Anything that interrupts airflow — overcrowding, a wet marinade, a pan with sides that block the draft — is going to compromise the result before the temperature ever matters.",
    },
  ],
  relatedFoodSlugs: ["chicken-wings", "french-fries", "frozen-pizza"],
  relatedGuideSlugs: [
    "air-fryer-vs-convection-oven",
    "common-air-fryer-mistakes",
  ],
};

const AIR_FRYER_VS_CONVECTION: Guide = {
  slug: "air-fryer-vs-convection-oven",
  kicker: "The comparison",
  title: "Air fryer vs. convection oven: the honest comparison",
  description:
    "Both move hot air. Both crisp food. Here's what is actually different, and when each one is the right tool.",
  lead: "Convection ovens have been around for decades. Air fryers are the newer, louder cousin — and they get credit (and blame) for a lot of things their older relatives already did. The differences are real, but they are specific, and knowing them saves you buying both.",
  readingTime: 5,
  updatedAt: "2026-04-16",
  sections: [
    {
      kind: "h2",
      id: "same-idea-different-scale",
      text: "The same idea at a different scale",
    },
    {
      kind: "p",
      text: "Both appliances cook by circulating hot air with a fan. That's the whole trick. The practical differences come from size, airflow speed, and preheat time — not from any magical physics the air fryer added.",
    },
    {
      kind: "p",
      text: "A full-size convection oven holds 5–6 cubic feet of air and has a fan tuned for that volume. A basket air fryer holds under a cubic foot and has a fan that is, proportionally, a small jet engine. The air in an air fryer moves past the food much faster, which is why you get more aggressive browning per minute.",
    },
    {
      kind: "h2",
      id: "where-air-fryers-win",
      text: "Where air fryers are better",
    },
    {
      kind: "list",
      items: [
        "Small batches. Reheating two slices of pizza is trivial in an air fryer and a waste of energy in a full oven.",
        "Crispy surfaces on pre-cooked or frozen foods — fries, nuggets, wings — where speed and airflow matter more than even heat.",
        "Quick snacks. They preheat in 60–90 seconds instead of 8–10 minutes.",
        "Keeping your kitchen cool in summer. They dump a lot less ambient heat than a full oven.",
      ],
    },
    {
      kind: "h2",
      id: "where-convection-wins",
      text: "Where a convection oven still wins",
    },
    {
      kind: "list",
      items: [
        "Anything over about 1.5 pounds. A whole chicken, a sheet pan of vegetables for four people, a lasagna — the air fryer either won't fit it or cooks it unevenly.",
        "Baking. Big ovens stage their heat more gently. Cakes, loaves, and anything with a delicate crumb benefit from the larger, slower thermal environment.",
        "Multiple trays at once. Convection ovens have the height to stack; air fryers usually don't.",
        "Anything that needs a long, steady 300–325°F. Air fryers at low temperatures often run uneven.",
      ],
    },
    {
      kind: "h2",
      id: "the-conversion-still-applies",
      text: "Yes, the 20/20 rule still applies — with caveats",
    },
    {
      kind: "p",
      text: "If your convection oven has a dedicated \"convection\" mode (not just a fan-assisted bake), most recipes already assume you'll knock off 25°F or so from standard oven times. An air fryer compounds that: you're already cooking with a fast fan, so the further reduction to keep things from browning too fast is real.",
    },
    {
      kind: "p",
      text: "Converting between the two is rarely a clean multiplier. If you've been running a recipe in a convection oven at 375°F for 30 minutes, a good air fryer starting point is 350°F for 22–24 minutes, with the understanding that you'll check early on your first try and adjust.",
    },
    {
      kind: "h2",
      id: "the-practical-answer",
      text: "The practical answer",
    },
    {
      kind: "p",
      text: "Most kitchens that already own a decent oven don't strictly need an air fryer, but they probably want one anyway. The appeal is speed and small-batch convenience, not some textural capability the big oven lacks. If you're choosing between them and can only have one — and you regularly cook for more than two people — a convection oven is the better tool. If you cook mostly for one or two, and a lot of what you cook is frozen, pre-breaded, or reheated, an air fryer is genuinely a better fit than keeping a full oven hot for 40 minutes at a time.",
    },
    {
      kind: "callout",
      tone: "info",
      text: "A toaster oven with a decent convection mode splits the difference and costs less than either — worth considering if counter space is tight.",
    },
  ],
  relatedFoodSlugs: ["frozen-pizza", "reheated-pizza", "brussels-sprouts"],
  relatedGuideSlugs: [
    "how-air-fryers-actually-work",
    "converting-baking-recipes-to-air-fryer",
  ],
};

const TEMPS_BY_FOOD_TYPE: Guide = {
  slug: "best-air-fryer-temperatures-by-food-type",
  kicker: "The reference",
  title: "The best air fryer temperatures, by food type",
  description:
    "A food-by-food guide to starting temperatures and cook times that actually work. Print it or bookmark it.",
  lead: "Every food has a temperature range where it cooks well and another where it either burns or goes rubbery. This guide gives you the honest starting point for each category — not a list of defaults that gets averaged into nothing useful.",
  readingTime: 7,
  updatedAt: "2026-04-16",
  sections: [
    {
      kind: "h2",
      id: "proteins",
      text: "Proteins",
    },
    {
      kind: "h3",
      text: "Chicken (raw)",
    },
    {
      kind: "p",
      text: "400°F for wings and thighs, 380°F for breasts. Bone-in pieces want the higher end; boneless breasts dry out above 380°F if they're more than an inch thick. Finish on a meat thermometer, not a timer — 165°F at the thickest point.",
    },
    {
      kind: "h3",
      text: "Beef and pork",
    },
    {
      kind: "p",
      text: "Steaks and thick chops: 400°F, short time, flip once. The goal is a crust before the inside goes past your target doneness. Ground beef patties at 375°F cook through without drying. Pork tenderloin wants 380°F; bacon is happy at 380°F on a rack.",
    },
    {
      kind: "h3",
      text: "Fish",
    },
    {
      kind: "p",
      text: "375–380°F, and watch it. Fish goes from perfectly flaking to dry in 90 seconds. Thinner fillets can even drop to 370°F if you want a gentler cook. Salmon is a good benchmark — check at 7–8 minutes for a 1-inch fillet.",
    },
    {
      kind: "h2",
      id: "starch",
      text: "Starchy sides and frozen foods",
    },
    {
      kind: "h3",
      text: "Fries (fresh-cut)",
    },
    {
      kind: "p",
      text: "A two-stage cook is best: 360°F to cook through, then 400°F for 3–5 minutes to crisp. A single-stage 400°F works if you're OK with slightly softer interiors. Shake the basket twice.",
    },
    {
      kind: "h3",
      text: "Frozen pre-cooked foods (fries, nuggets, tots)",
    },
    {
      kind: "p",
      text: "400°F straight from the freezer. These are already parfried; the air fryer's job is to crisp and reheat the interior, which happens in 10–16 minutes depending on thickness. No oil needed if the package already has fat in the coating.",
    },
    {
      kind: "h3",
      text: "Baked potatoes",
    },
    {
      kind: "p",
      text: "380°F for 35–45 minutes. Poke with a fork. The skin gets dramatically crisper than an oven-baked potato because of the faster airflow — a genuine air-fryer win.",
    },
    {
      kind: "h2",
      id: "vegetables",
      text: "Vegetables",
    },
    {
      kind: "p",
      text: "Almost everything wants 380°F. Hardier vegetables (broccoli, cauliflower, brussels sprouts, carrots) can go to 390°F if you want more char. Leafier or more delicate vegetables (asparagus, snap peas, zucchini) are better at 370°F with a shorter time. Tossing with a teaspoon of oil helps heat reach the surface and prevents dried edges.",
    },
    {
      kind: "h2",
      id: "baked-goods",
      text: "Baked goods",
    },
    {
      kind: "p",
      text: "This is where air fryers punish you for shortcuts. Baked goods were designed for the still, even heat of a regular oven; the fan in an air fryer sets the top too fast.",
    },
    {
      kind: "list",
      items: [
        "Cookies: drop to 325°F and expect the tops to brown before the middles are set. Pull early.",
        "Muffins: 320°F, in paper liners, on the middle rack if your model has one.",
        "Reheating bread: 325°F for 2 minutes works; any longer and the crust goes from crisp to tough.",
        "Pie / pastry: use a regular oven if you have one. The air fryer's fan will lift edges and uneven-bake the filling.",
      ],
    },
    {
      kind: "h2",
      id: "reheating",
      text: "Reheating",
    },
    {
      kind: "p",
      text: "350°F for most savoury reheats, 325°F for anything with a delicate crust (pastries, leftover fried chicken). Reheating is where air fryers outperform microwaves dramatically, because they actually re-crisp — a microwave re-softens. A minute or two shorter than the original cook is almost always right.",
    },
    {
      kind: "callout",
      tone: "info",
      text: "These are starting points. Your fryer runs how it runs — a single 3-minute test cook on familiar food tells you whether yours runs hot or cold, and every future conversion benefits from knowing that.",
    },
  ],
  relatedFoodSlugs: [
    "chicken-breast",
    "salmon",
    "brussels-sprouts",
    "french-fries",
  ],
  relatedGuideSlugs: [
    "common-air-fryer-mistakes",
    "converting-baking-recipes-to-air-fryer",
  ],
};

const COMMON_MISTAKES: Guide = {
  slug: "common-air-fryer-mistakes",
  kicker: "The fixes",
  title: "The air fryer mistakes that ruin dinner",
  description:
    "Ten specific habits that turn a working air fryer into a steamer or a charcoal factory. All avoidable.",
  lead: "Most air fryer complaints — soggy food, burned edges, uneven cooking — trace back to five or six habits. None of them are about the machine. Fix these and the appliance starts to behave.",
  readingTime: 6,
  updatedAt: "2026-04-16",
  sections: [
    {
      kind: "h2",
      id: "overcrowding",
      text: "Crowding the basket",
    },
    {
      kind: "p",
      text: "This is the number one problem. When food pieces touch, the fan can't move air between them, and the sides that are pressed together steam instead of brown. Result: one side is crisp, the other is pale and damp. Fix: cook in a single layer with visible gaps. If the basket can't fit a single layer, cook in two rounds. The second round is faster because the fryer is already hot.",
    },
    {
      kind: "h2",
      id: "skipping-the-dry",
      text: "Skipping the dry-off",
    },
    {
      kind: "p",
      text: "Marinades, brines, and washes all leave surface moisture. Moisture is the enemy of browning — the fryer has to evaporate it before the Maillard reaction can start. Fix: pat food dry with paper towels before it goes in. Especially true for wings, chicken thighs, and any protein that's been marinating.",
    },
    {
      kind: "h2",
      id: "wet-batter",
      text: "Using a wet batter",
    },
    {
      kind: "p",
      text: "Tempura-style or beer batter was engineered for oil immersion, which sets the batter instantly. In an air fryer, wet batter sags, drips through the basket, and either burns on the hot spot it pools in or slides off the food. Fix: use a dry coating — flour, breadcrumbs, panko — bound with egg or buttermilk. If you want a beer-battered texture, fry it in oil.",
    },
    {
      kind: "h2",
      id: "no-preheat",
      text: "Not preheating",
    },
    {
      kind: "p",
      text: "Air fryers preheat in 2–3 minutes. Skipping that is tempting, but starting in a cold unit means the surface of your food spends too long at a moderate temperature, which overcooks the interior before the outside browns. Fix: preheat. The only exception is frozen food that will take 15+ minutes anyway — in that case, cold-start is fine because there's plenty of time to catch up.",
    },
    {
      kind: "h2",
      id: "high-sugar-sauce",
      text: "Adding sugary sauce too early",
    },
    {
      kind: "p",
      text: "Any sauce with sugar — BBQ, teriyaki, honey glaze — will char at air fryer temperatures within 3–4 minutes. Coat the food from the start and you get black, bitter edges. Fix: add sauces in the last 3 minutes of cook time. Use dry rubs up front if you want flavour from the beginning.",
    },
    {
      kind: "h2",
      id: "no-shake",
      text: "Forgetting to shake or flip",
    },
    {
      kind: "p",
      text: "Even with good spacing, the side facing the basket cooks differently than the side facing the heating element. Shaking or flipping halfway through is not optional for most foods. Fix: set a timer at the check-in point (the calculator gives you one) and flip or shake then, even if it seems fine. It saves the bottoms from going mushy.",
    },
    {
      kind: "h2",
      id: "paper-liner",
      text: "Loading the basket before preheat, especially with paper liners",
    },
    {
      kind: "p",
      text: "Paper air fryer liners are fine, but they are light and will blow around in the fan if there's no food weighing them down. A paper liner hitting the heating element is a fire, not a mishap. Fix: weight the liner with food before turning the fryer on, or skip it and use the basket directly with a light oil spray on clean-up-heavy foods.",
    },
    {
      kind: "h2",
      id: "guessing-dial",
      text: "Trusting the temperature dial",
    },
    {
      kind: "p",
      text: "Consumer air fryers have surprisingly loose temperature control. A fryer set to 400°F might actually run anywhere from 375°F to 420°F. Fix: if food is consistently under- or over-cooking for the recipe, adjust the dial 15°F in the right direction and treat that as the new normal. An oven thermometer inside the basket for one test cook tells you the offset.",
    },
    {
      kind: "h2",
      id: "scaling-up",
      text: "Trying to cook for four in a three-quart basket",
    },
    {
      kind: "p",
      text: "An air fryer basket that's \"four quarts\" holds about enough food for two hungry adults. Doubling a recipe doesn't double the basket capacity. Fix: either cook in rounds or use a full oven. Cramming is strictly worse than running the fryer twice.",
    },
    {
      kind: "h2",
      id: "no-rest",
      text: "Eating it straight from the basket",
    },
    {
      kind: "p",
      text: "Meats continue to cook after they come out (carryover heat), and juices redistribute during rest. Going straight from basket to plate gives you slightly overcooked and slightly dry. Fix: rest proteins for 2–3 minutes. Not long. Enough to change the texture.",
    },
    {
      kind: "callout",
      tone: "warn",
      text: "If your fryer keeps under-performing despite all of this — uneven cooking, visible hot spots, long preheat — the unit itself may be the problem. Basket fryers over 18 months old often develop fan-speed issues that never quite recover.",
    },
  ],
  relatedFoodSlugs: ["chicken-wings", "french-fries", "bacon"],
  relatedGuideSlugs: [
    "how-air-fryers-actually-work",
    "best-air-fryer-temperatures-by-food-type",
  ],
};

const CONVERTING_BAKING: Guide = {
  slug: "converting-baking-recipes-to-air-fryer",
  kicker: "The caveats",
  title: "Converting baking recipes to the air fryer (when you should, and shouldn't)",
  description:
    "Some baked goods translate beautifully. Others are a waste of batter. Here's how to tell, and what to change when it's worth trying.",
  lead: "An air fryer is a small, aggressive convection oven, and baking is a gentler process than most of what the fryer does best. Translating a standard recipe over isn't always a disaster — but it isn't always a win either. The honest answer is: some things work, some things don't, and the ones that do need you to change more than just the temperature.",
  readingTime: 6,
  updatedAt: "2026-04-16",
  sections: [
    {
      kind: "h2",
      id: "what-bakes-well",
      text: "What bakes well in an air fryer",
    },
    {
      kind: "list",
      items: [
        "Small batches of cookies (6–10 at a time). The faster heat crisps the edges beautifully.",
        "Individual-size cakes and brownies in a ramekin or 6-inch pan. They cook through fast without drying.",
        "Biscuits and scones with a decent butter content — the fat layers hold up to the fan.",
        "Puff pastry items: turnovers, palmiers, hand pies. The hot air helps them rise aggressively.",
        "Dense, moisture-rich quick breads (banana bread, zucchini bread) in a small loaf pan.",
      ],
    },
    {
      kind: "h2",
      id: "what-doesnt",
      text: "What to never put in the basket",
    },
    {
      kind: "list",
      items: [
        "Anything with a delicate top crust that relies on still heat — soufflés, popovers, meringues.",
        "Layer cakes. Uneven heat ruins the even rise, and you can't level a sunken layer.",
        "Anything larger than about 1 pound of batter. The interior won't set before the outside burns.",
        "Open pies with a custard filling. The fan dimples the surface and the crust won't cook evenly.",
        "Anything with a sugary top that was supposed to set before it browned (crème brûlée, sticky buns with glaze pre-applied).",
      ],
    },
    {
      kind: "h2",
      id: "the-temp-math",
      text: "The temperature math for baking",
    },
    {
      kind: "p",
      text: "Standard air-fryer-conversion advice is \"drop 25°F, cut time by 20%.\" For baked goods specifically, push it further: drop 30–35°F from the oven recipe, and start checking at 70% of the oven time. Baked goods set from the outside in, and the air fryer sets the outside faster than everything else — so the interior has to catch up on a compressed schedule.",
    },
    {
      kind: "p",
      text: "Our calculator has \"Baked Goods\" as its own food type; select it and you'll see larger reductions applied automatically. For a recipe that calls for 375°F / 25 minutes in the oven, the calculator will hand you roughly 335°F / 18 minutes — which is close to what most bakers arrive at by trial and error.",
    },
    {
      kind: "h2",
      id: "pan-choice",
      text: "Pan choice matters more than temperature",
    },
    {
      kind: "p",
      text: "A standard 9-inch cake pan won't fit in most basket fryers, and even when it does, the airflow under it is poor. Use something small and heat-conductive:",
    },
    {
      kind: "list",
      items: [
        "6-inch round metal cake pan for small cakes and cornbread.",
        "Silicone muffin liners (not a muffin tin) for individual cupcakes — they stand up on their own and leave gaps for air.",
        "A ramekin or 4-oz oven-safe glass dish for single-serving lava cakes, fruit crumbles, or baked custards.",
        "Parchment paper cut to fit, not a flat sheet — the edges will blow up into the heating element.",
      ],
    },
    {
      kind: "h2",
      id: "signs-to-pull-it-out",
      text: "Know when to pull it out",
    },
    {
      kind: "p",
      text: "Baked goods look done a minute or two before they are. In an air fryer this gap is shorter — the outside is more aggressively set, so the cue changes. Instead of \"toothpick comes out clean\" or \"top springs back,\" use a combination:",
    },
    {
      kind: "list",
      items: [
        "Toothpick test in the very center, not the edge. Air fryer edges set fastest, so an edge toothpick lies.",
        "Smell. Baked goods release a sweeter, more caramelized aroma in the last 90 seconds of cooking.",
        "Internal temperature: 200–205°F for cake and quick breads, 210°F for loaf breads.",
      ],
    },
    {
      kind: "callout",
      tone: "info",
      text: "If you're serious about baking in the air fryer, do one test batch to calibrate before you make anything you care about. A half-recipe of muffins costs fifteen minutes and saves a birthday cake.",
    },
  ],
  relatedFoodSlugs: ["reheated-pizza", "frozen-pizza"],
  relatedGuideSlugs: [
    "air-fryer-vs-convection-oven",
    "best-air-fryer-temperatures-by-food-type",
  ],
};

const PREHEATING: Guide = {
  slug: "preheating-your-air-fryer",
  kicker: "The debate",
  title: "Do you actually need to preheat your air fryer?",
  description:
    "The answer is 'usually yes, sometimes no.' Here's when preheating matters, when it doesn't, and how long it actually takes.",
  lead: "\"Do I need to preheat?\" is one of the most searched air fryer questions, and the answer most sites give — a flat \"yes\" or \"no\" — is wrong both ways. Preheating matters for some foods and actively hurts others. The distinction isn't complicated once you understand what the preheat actually does to the food's surface.",
  readingTime: 6,
  updatedAt: "2026-04-28",
  sections: [
    {
      kind: "h2",
      id: "what-preheating-does",
      text: "What preheating actually does",
    },
    {
      kind: "p",
      text: "When you preheat an air fryer, the heating element runs for 2–3 minutes until the air inside the basket reaches the target temperature. The metal basket and grate absorb heat too. When food goes in, it immediately hits a hot surface and hot air simultaneously — the outside starts browning within seconds.",
    },
    {
      kind: "p",
      text: "Without a preheat, the food enters a cool basket and warms up alongside the air. The surface spends the first 2–3 minutes at a moderate temperature — warm enough to start cooking the interior, but not hot enough to dehydrate and brown the outside. For food where you want a seared exterior and a juicy interior, those 2–3 minutes of lukewarm surface cooking are the difference between a golden crust and a pale, evenly-cooked piece of protein.",
    },
    {
      kind: "h2",
      id: "when-to-preheat",
      text: "When preheating matters",
    },
    {
      kind: "list",
      items: [
        "Fresh proteins — chicken breasts, steaks, pork chops, shrimp. These benefit most because you want the surface to sear before the interior overcooks. A hot basket gives you the temperature gradient that makes the outside brown while the inside stays pink or juicy.",
        "Anything you want charred — Brussels sprouts, broccoli, asparagus. The initial sizzle against the hot grate is where the restaurant-style char comes from.",
        "Thin items that cook in under 10 minutes. With a short total cook time, the 2–3 minutes spent warming up is a significant percentage of the total. Shrimp cooked without a preheat spend nearly half their cook time below browning temperature.",
        "Reheating. Pizza, leftovers, anything you want to re-crisp. A hot basket crisps the bottom immediately instead of warming it slowly from both sides.",
      ],
    },
    {
      kind: "h2",
      id: "when-to-skip",
      text: "When to skip the preheat",
    },
    {
      kind: "list",
      items: [
        "Frozen foods with a long cook time (15+ minutes). Frozen fries, frozen pizza, frozen chicken patties — these need time to thaw before they can brown anyway. A cold start gives the ice a chance to leave before the surface sets, which actually produces a better result.",
        "Bacon. Starting cold lets the fat render slowly and evenly. A hot basket sears the outside of the bacon before the fat underneath has liquefied, trapping it inside and making the strip chewy in spots.",
        "Delicate baked goods. Muffins, small cakes, and anything with a rising batter benefits from a gradual heat ramp. A preheated basket sets the outside crust before the interior has expanded, giving you a dense, lopsided result.",
        "Large, thick cuts that need long cook times (whole chicken thighs, thick pork chops). The 2–3 minute preheat is a rounding error on a 25-minute cook, and starting cooler gives the heat more time to reach the center.",
      ],
    },
    {
      kind: "h2",
      id: "how-long-it-takes",
      text: "How long preheating actually takes, by model",
    },
    {
      kind: "p",
      text: "Not all air fryers preheat at the same speed. The wattage, basket size, and insulation all affect how fast the air inside reaches temperature. Here's what to expect:",
    },
    {
      kind: "list",
      items: [
        "Compact basket fryers (3–4 qt, 1400–1500W): 2 minutes to 400°F. These are the fastest because the air volume is small and the element is proportionally powerful.",
        "Mid-size basket fryers (5–6 qt, 1700W): 2–3 minutes to 400°F. The Ninja and Cosori models in this range preheat quickly because of their higher wattage.",
        "Oven-style air fryers (Breville, Cuisinart): 4–5 minutes. Larger air volume, more metal to heat. These behave more like a small convection oven and genuinely need the preheat.",
        "Dual-basket fryers (Ninja Foodi DualZone): 2–3 minutes per zone. Each zone preheats independently.",
      ],
    },
    {
      kind: "callout",
      tone: "info",
      text: "Most modern air fryers have a built-in preheat cycle that beeps when ready. If yours doesn't, run it empty at your target temperature for 2–3 minutes before loading food.",
    },
    {
      kind: "h2",
      id: "the-test",
      text: "How to tell if your fryer is actually preheated",
    },
    {
      kind: "p",
      text: "The display says 400°F, but is it really? The air temperature and the basket temperature are two different things. The air might reach target in 90 seconds, but the metal basket and grate take another minute to absorb enough heat to sear on contact. A simple test: hold your hand a few inches above the open basket. If you feel aggressive heat pushing up, both the air and the metal are ready. If it feels warm but not intense, give it another minute.",
    },
    {
      kind: "h2",
      id: "the-practical-rule",
      text: "The practical rule",
    },
    {
      kind: "p",
      text: "If the food is fresh and you want a brown outside, preheat. If the food is frozen and will cook for more than 12 minutes, skip it. If you're unsure, preheat — the downside of preheating when you didn't need to is minimal (slightly faster browning), while the downside of skipping when you should have preheated is real (pale, unevenly cooked food).",
    },
    {
      kind: "p",
      text: "The calculator's \"check at\" time already accounts for preheating. If you cold-start, add 1–2 minutes to the total time and use the check point as your shake-or-flip cue rather than a doneness indicator.",
    },
    {
      kind: "callout",
      tone: "warn",
      text: "Never preheat with parchment paper or air fryer liners in an empty basket. They are light enough for the fan to lift them into the heating element. Always weight liners down with food before starting the cook.",
    },
  ],
  relatedFoodSlugs: ["chicken-wings", "salmon", "french-fries"],
  relatedGuideSlugs: [
    "how-air-fryers-actually-work",
    "common-air-fryer-mistakes",
  ],
};

const BREADING: Guide = {
  slug: "breading-that-sticks-in-an-air-fryer",
  kicker: "The method",
  title: "How to get breading that actually sticks in an air fryer",
  description:
    "The three-step coating method, why your breading falls off, and which coatings hold up in high-speed convection.",
  lead: "Breading that falls off in the air fryer is the second-most-common complaint after soggy food — and they're related problems. The fan that crisps the coating is the same fan that can lift it off the food if the bond isn't right. The fix is a specific sequence of steps that food manufacturers already use on every frozen breaded product you've ever bought. Here's how to do it at home.",
  readingTime: 6,
  updatedAt: "2026-05-04",
  sections: [
    {
      kind: "h2",
      id: "why-breading-falls-off",
      text: "Why breading falls off in an air fryer",
    },
    {
      kind: "p",
      text: "In a deep fryer, hot oil sets the batter or breading within seconds of contact. The coating has no time to slide or separate — it's locked in place almost instantly. In an air fryer, there's no oil bath to set the coating. Instead, dry heat works on the surface over a couple of minutes, and during that window the fan is blowing hard enough to lift anything that isn't firmly attached.",
    },
    {
      kind: "p",
      text: "The three reasons breading detaches, in order of how common they are: the food's surface was wet, the binding layer (egg wash) was too thin or missing, and the breading itself was too light to stay put under airflow. Fix all three and the problem disappears.",
    },
    {
      kind: "h2",
      id: "the-three-step-method",
      text: "The three-step method: flour, egg, crumb",
    },
    {
      kind: "p",
      text: "This isn't a suggestion — it's the only reliable way to get breading to stay on food in an air fryer. Each layer does a specific job:",
    },
    {
      kind: "list",
      items: [
        "Step 1 — Flour. Pat the food dry with paper towels, then dust it in seasoned flour (all-purpose, with salt and pepper). The flour absorbs the last traces of surface moisture and creates a rough, dry surface. Without this step, the egg wash beads up and slides off instead of coating evenly.",
        "Step 2 — Egg wash. Beat an egg with a tablespoon of water or milk. Dip the floured food, making sure every surface is coated. The egg is the glue — it bonds the flour below to the crumbs above. A thin, even coat is better than a thick pool that drips.",
        "Step 3 — Crumbs. Press the food into the crumb coating firmly. Don't just sprinkle — push the crumbs into the egg with your palm so they embed, not just sit on top. Shake off loose crumbs gently. Anything that isn't stuck at this stage won't survive the fan.",
      ],
    },
    {
      kind: "callout",
      tone: "info",
      text: "Use one hand for dry steps (flour, crumbs) and the other hand for wet steps (egg wash). This keeps you from building up a thick paste on your fingers that wastes breading and makes a mess.",
    },
    {
      kind: "h2",
      id: "which-coatings-work",
      text: "Which coatings hold up — and which don't",
    },
    {
      kind: "h3",
      text: "Best performers",
    },
    {
      kind: "list",
      items: [
        "Panko breadcrumbs — the gold standard. The large, jagged flakes lock together and create air pockets that crisp aggressively. They're also heavy enough that the fan doesn't lift them.",
        "Crushed cornflakes — similar to panko but with a slightly sweeter, more toasted flavor. Crush them in a zip-lock bag, not a food processor, so you get irregular shards instead of dust.",
        "Seasoned flour (double-dipped) — for a thinner coating like fried chicken. Flour, egg, flour again. The second flour layer sets into a craggy crust that browns well without added crumbs.",
        "Parmesan crust — finely grated Parmesan mixed with panko at a 1:1 ratio. The cheese melts and fuses the crumbs together into a solid shell. Excellent on chicken and fish.",
      ],
    },
    {
      kind: "h3",
      text: "Poor performers",
    },
    {
      kind: "list",
      items: [
        "Regular breadcrumbs — too fine, too uniform. They form a dense layer that doesn't crisp well and lifts as a single sheet when the bond fails.",
        "Wet batters (tempura, beer batter) — these were designed for oil immersion. In an air fryer, the batter sags, drips through the basket grate, and either burns on the heating element or slides off the food entirely.",
        "Coconut flakes (unsweetened, large) — they toast beautifully but are too light on their own. Mix with panko at a 1:1 ratio to add weight and structure.",
      ],
    },
    {
      kind: "h2",
      id: "the-oil-spray",
      text: "The oil spray is not optional",
    },
    {
      kind: "p",
      text: "After breading and before cooking, give the coated food a light spray of oil on both sides. This does two things: it browns the breading faster (oil conducts heat better than dry air alone), and it helps the outermost crumbs fuse together into a connected sheet rather than a loose collection of individual flakes.",
    },
    {
      kind: "p",
      text: "Use a pump sprayer or an oil mister with avocado or canola oil. Aerosol cooking sprays (like PAM) contain propellants that can damage non-stick coatings over time. Two seconds per side is enough — you want a mist, not a drench.",
    },
    {
      kind: "h2",
      id: "the-rest-step",
      text: "Let it set before cooking",
    },
    {
      kind: "p",
      text: "After breading, let the coated food sit on a wire rack for 10 minutes at room temperature. The egg wash dries slightly and the bond between the layers strengthens. This is the step most home cooks skip, and it's the step that makes the biggest difference. Commercial frozen products get this rest during flash-freezing — it's why store-bought breaded chicken holds its coating better than homemade usually does.",
    },
    {
      kind: "callout",
      tone: "warn",
      text: "If you're in a hurry, refrigerate the breaded food uncovered for 15 minutes instead. The cold air accelerates the drying and gives you most of the benefit in less time.",
    },
    {
      kind: "h2",
      id: "cooking-breaded-food",
      text: "Air fryer settings for breaded food",
    },
    {
      kind: "p",
      text: "Breaded food wants moderate heat — 375–390°F — not the 400°F+ you'd use for plain proteins. Higher temperatures brown the coating before the food inside is cooked, and the breading can go from golden to burnt in under two minutes. The calculator's food-type adjustments account for this when you select the right category.",
    },
    {
      kind: "list",
      items: [
        "Flip once, at the check time. Every flip risks the coating separating, so minimize handling. Use a flat spatula, not tongs — tongs crush breading at the grip point.",
        "Don't shake the basket. Shaking works for fries and wings; it destroys breaded food. The pieces tumble against each other and knock crumbs loose.",
        "Leave space between pieces. Breaded items that touch will fuse together, and pulling them apart tears the coating off both.",
      ],
    },
    {
      kind: "h2",
      id: "troubleshooting",
      text: "Troubleshooting",
    },
    {
      kind: "list",
      items: [
        "Breading slides off in a sheet — the food was too wet when you floured it. Pat drier next time, and make sure the flour step is thorough.",
        "Coating is pale and soft — not enough oil spray, or the temperature was too low. Bump up 10°F and make sure you misted both sides.",
        "Crumbs are burning but the food is raw — temperature too high. Drop to 370°F and add 2–3 minutes. The crumbs need time alongside the protein, not ahead of it.",
        "Breading is perfect on top, bare on the bottom — you forgot to flip. The basket side needs a turn to crisp; it won't brown on its own because it's sitting on a grate, not in oil.",
      ],
    },
  ],
  relatedFoodSlugs: ["chicken-tenders", "shrimp", "chicken-nuggets"],
  relatedGuideSlugs: [
    "common-air-fryer-mistakes",
    "preheating-your-air-fryer",
  ],
};

/* ======================================================================
 * Registry + helpers
 * ==================================================================== */

export const GUIDES: readonly Guide[] = [
  HOW_AIR_FRYERS_WORK,
  AIR_FRYER_VS_CONVECTION,
  TEMPS_BY_FOOD_TYPE,
  COMMON_MISTAKES,
  CONVERTING_BAKING,
  PREHEATING,
  BREADING,
] as const;

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}

export function getRelatedGuides(guide: Guide): readonly Guide[] {
  return guide.relatedGuideSlugs
    .map((slug) => GUIDES.find((g) => g.slug === slug))
    .filter((g): g is Guide => Boolean(g));
}
