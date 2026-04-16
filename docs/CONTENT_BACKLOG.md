# CrispCalc content backlog

Post-launch pipeline (spec §12.8). Food pages and guides we intend
to publish after the initial 10 + 5, plus a rough six-month calendar
from launch (April 2026) through September 2026.

This doc is a planning artifact, not a contract. Ship the ones that
read well when drafted; skip any that feel thin; rearrange freely as
Search Console shows which existing pages actually pull traffic.

## How to use this list

1. Pick the next item by current week in the calendar below.
2. Add it to `src/content/foods.ts` or `src/content/guides.ts` in the
   same shape as existing entries — full `intro`, `tips`, `variations`
   (foods) or `sections` (guides), plus FAQs.
3. Update the `updatedAt` field and bump its sibling entries if the
   content touches them.
4. Commit with `feat: add <slug> preset` / `feat: add <slug> guide`.
5. In GSC, request indexing for the new URL once it's live.

Content rules inherited from spec §7 and §15 apply to every item
below — original writing, no stock "In today's fast-paced world…"
intros, linked to at least 3 siblings + the calculator, no AI fluff.

---

## Food preset backlog (next 20)

Ordered roughly by search volume × calculator-fit. "Calc fit" means
the preset has a clean oven analogue the 20/20 rule actually models
well; a few items (hard-boiled eggs, bagels) are *not* great fits and
are deliberately excluded until we extend the engine.

| # | Slug | Why | Notes |
|---|---|---|---|
| 1 | `chicken-tenders` | High volume, pairs naturally with `chicken-breast`. | Cover fresh breaded + frozen as two variations. |
| 2 | `chicken-thighs` | Top-3 search term; bone-in vs boneless is its own FAQ. | Variations: bone-in skin-on (default), boneless, Thai-marinated. |
| 3 | `chicken-nuggets` | Frozen-nugget queries are massive. | Frozen-only. Emphasize shake at 6 min. |
| 4 | `pork-chops` | Under-served by existing sites; calc works well here. | Variations: bone-in 1″, boneless 1″, thin-cut. |
| 5 | `steak` | High intent, big traffic. | Cover ribeye + sirloin; warn on well-done. |
| 6 | `hamburger-patties` | Summer search spike. | Fresh 80/20, frozen, turkey variations. |
| 7 | `shrimp` | Fast cook, huge query volume, great teaser for calc accuracy. | Variations: raw peeled, frozen peeled, breaded. |
| 8 | `hot-dogs` | Cheap but massive volume. Pair with `hamburger-patties`. | Variations: regular, brat, foot-long. |
| 9 | `fish-fillets` | Family weeknight staple. | Cod, tilapia, frozen breaded. |
| 10 | `tofu` | Vegetarian keyword; easy to do well. | Variations: cubed, strips, pressed vs unpressed. |
| 11 | `mozzarella-sticks` | Frozen appetizer traffic. | Frozen-only; warn about overflow. |
| 12 | `onion-rings` | Frozen appetizer bundle. | Frozen battered + fresh homemade. |
| 13 | `tater-tots` | Side-dish staple, pairs with many mains. | Frozen-only. |
| 14 | `broccoli` | Veg query volume + pairs with proteins. | Fresh florets, frozen florets. |
| 15 | `cauliflower` | Same rationale as broccoli; plus "buffalo cauliflower". | Florets, whole-steak, buffalo-style. |
| 16 | `asparagus` | Seasonal spike April–June. | Thin + thick spears. |
| 17 | `zucchini` | Summer veg query. | Rounds + fries cut. |
| 18 | `baked-potato` | Long tail, high dwell time. | Russet, red, sweet (cross-link existing sweet-potato-fries). |
| 19 | `corn-on-the-cob` | July 4th spike. | Fresh shucked, frozen cobettes. |
| 20 | `pork-tenderloin` | Sunday-dinner keyword; under-served. | Plain + herb-crusted variations. |

### Deliberately *not* in this batch

- **Hard-boiled eggs** — the calculator's 20/20 model doesn't fit
  water-boil analogues well. Revisit once we add a "no oven equivalent"
  preset type.
- **Bagels, croissants, frozen waffles** — reheating is the real
  query; fold them into a single "Reheating breakfast pastries"
  article in a later guide batch instead of 3 preset pages.
- **Whole chicken** — long cook times push calc error outside our
  "check at X" confidence. Defer.
- **Ribs** — same reason as whole chicken; also very subjective.
- **Bacon** — already shipped.

---

## Guide backlog (next 10)

| # | Slug | Type | Why |
|---|---|---|---|
| 1 | `preheating-your-air-fryer` | Explainer | "Do I need to preheat?" is searched constantly; the real answer is nuanced. |
| 2 | `how-to-clean-your-air-fryer` | How-to | Unblocks the #1 post-purchase frustration. |
| 3 | `parchment-foil-silicone-liners-in-an-air-fryer` | Reference | Safety + performance answer in one article. Big SEO prize. |
| 4 | `basket-vs-oven-air-fryer` | Buying guide | Top-of-funnel keyword that leads into our preset library. |
| 5 | `reheating-leftovers-in-an-air-fryer` | Cheat sheet | Table of temps + times by food category. Pair with `reheated-pizza`. |
| 6 | `breading-that-sticks-in-an-air-fryer` | How-to | The second-most-common air fryer complaint. |
| 7 | `oil-in-an-air-fryer` | How-to | Spray vs pump, which oils, how much. Kills the "use PAM" myth. |
| 8 | `cooking-from-frozen-in-an-air-fryer` | Reference | Cross-references most frozen food presets. |
| 9 | `air-fryer-safety-what-not-to-use` | Reference | Non-negotiable safety info (light items, glass bowls, etc.). |
| 10 | `crispy-chicken-skin-method` | How-to | Funnel article — cross-links every chicken preset. |

Each of these should be 800–1,200 words, link to the calculator and
at least two related food presets, and include a clear "method"
section with numbered steps.

---

## Six-month content calendar (April–September 2026)

Cadence assumption: ~1 new page per week on average, front-loaded
into Friday publishes. Grouping keeps us topical with the seasonal
search curve. A week with no bullet is a rest week — use it to
update an existing preset with new data or to respond to Search
Console surprises.

### April 2026 (weeks 3–4, post-launch ramp)

Focus: staple proteins + most common frozen items. These carry the
most search volume per unit of writing effort.

- **Week of Apr 20** — Food: `chicken-tenders`. Guide: `preheating-your-air-fryer`.
- **Week of Apr 27** — Food: `shrimp`. Food: `chicken-nuggets`.

### May 2026

Focus: grilling-season proteins ahead of Memorial Day.

- **Week of May 4** — Food: `hamburger-patties`. Guide: `breading-that-sticks-in-an-air-fryer`.
- **Week of May 11** — Food: `hot-dogs`.
- **Week of May 18** — Food: `steak`. Guide: `oil-in-an-air-fryer`.
- **Week of May 25** — Food: `chicken-thighs` (publish before Memorial Day weekend).

### June 2026

Focus: summer vegetables and seafood. Publish veg content ahead of
the May/June farmer's market peak.

- **Week of Jun 1** — Food: `asparagus`.
- **Week of Jun 8** — Food: `broccoli`. Guide: `how-to-clean-your-air-fryer`.
- **Week of Jun 15** — Food: `zucchini`. Food: `cauliflower`.
- **Week of Jun 22** — Food: `fish-fillets`. Guide: `cooking-from-frozen-in-an-air-fryer`.
- **Week of Jun 29** — Food: `corn-on-the-cob` (primes July 4 traffic).

### July 2026

Focus: July 4th-adjacent entertaining, then a light second half.

- **Week of Jul 6** — Food: `baked-potato`. Guide: `parchment-foil-silicone-liners-in-an-air-fryer`.
- **Week of Jul 13** — Food: `tater-tots`.
- **Week of Jul 20** — Food: `mozzarella-sticks`. Guide: `crispy-chicken-skin-method`.
- **Week of Jul 27** — Food: `onion-rings`.

### August 2026

Focus: back-to-school weeknight cooking. Promote reheating content.

- **Week of Aug 3** — Guide: `reheating-leftovers-in-an-air-fryer`.
- **Week of Aug 10** — Food: `tofu`. Guide: `basket-vs-oven-air-fryer`.
- **Week of Aug 17** — Food: `pork-chops`.
- **Week of Aug 24** — Food: `pork-tenderloin`.
- **Week of Aug 31** — Guide: `air-fryer-safety-what-not-to-use`.

### September 2026

Focus: data refresh + consolidation, not new SKUs. By now the
original 10 presets will have Search Console data; use it.

- **Week of Sep 7** — Update top-performing existing preset with
  reader-question FAQs and a new variation.
- **Week of Sep 14** — Audit internal linking across all food pages;
  ensure every preset links to ≥3 siblings + ≥1 guide per spec §8.
- **Week of Sep 21** — Publish a listicle: "10 air fryer recipes we
  actually cook every week" (linking the 10 original presets) —
  seasonal pivot piece to catch fall comfort-food traffic.
- **Week of Sep 28** — Review the two new charts. Consider a third
  chart (e.g., "convection oven to air fryer" specifically, or a
  weight-based cook-time table) if GSC shows chart pages pulling.

---

## Seasonal callouts worth watching

- **April–May**: asparagus, artichokes, lamb (Easter).
- **May–June**: shrimp, grilling proteins (Memorial Day).
- **July**: burgers, hot dogs, corn (July 4).
- **August**: back-to-school quick dinners, frozen foods.
- **September–October**: squash, brussels sprouts (already shipped),
  apples, pork (fall comfort food).
- **November–December**: outside our 6-month window, but prepare
  turkey, ham, cookies, and reheating content in October for
  pre-Thanksgiving ranking.

---

## Metrics to watch before expanding further

Before committing to a v2 batch of 20 more presets, confirm these
are true in Search Console + GA4 around the end of September:

- Average page impressions ≥ 50/day across the food library.
- At least three preset pages ranking in the top 10 for their
  primary keyword (e.g. `air fryer <food>`).
- Calculator conversion events (`conversion_calculated`) firing on
  ≥ 60% of preset-page sessions — indicates the pre-filled calculator
  is doing its job.
- Bounce rate on preset pages < 65%.

If those thresholds aren't met, the lever is *quality*, not
*quantity*: revisit the 10 original presets before adding more.
