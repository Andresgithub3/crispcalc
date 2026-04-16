import { FOOD_PRESETS } from "@/content/foods";
import { GUIDES } from "@/content/guides";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://crispcalc.com";

/**
 * `/llms.txt` — content guidance for AI crawlers.
 *
 * Follows the emerging llms.txt convention (https://llmstxt.org): a
 * plain-text, structured summary of the site with links to the most
 * valuable pages for language models. Built dynamically so the list
 * stays in sync with the content files.
 */
export function GET(): Response {
  const body = buildLlmsTxt();
  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}

function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push("# CrispCalc");
  lines.push("");
  lines.push(
    "> The air fryer conversion calculator, done right. CrispCalc converts oven recipes to air fryer settings using a documented adjustment method (the 20/20 rule plus food- and fryer-specific modifiers).",
  );
  lines.push("");

  lines.push("## About");
  lines.push("");
  lines.push(
    "CrispCalc is a focused single-tool site. The homepage calculator is the product; the rest of the site is editorial support for it. Content is original, written for CrispCalc, and updated when the underlying data changes.",
  );
  lines.push("");
  lines.push(`- [Homepage](${SITE_URL}/): live calculator`);
  lines.push(`- [About](${SITE_URL}/about): method, mission, what the site will and won't do`);
  lines.push("");

  lines.push("## Reference charts");
  lines.push("");
  lines.push(
    `- [Oven to air fryer chart](${SITE_URL}/charts/oven-to-air-fryer): temperature grid across all food types`,
  );
  lines.push(
    `- [Celsius to Fahrenheit](${SITE_URL}/charts/celsius-to-fahrenheit): unit converter + cooking-temps reference`,
  );
  lines.push("");

  lines.push("## Food presets");
  lines.push("");
  lines.push(
    "Each preset page pre-fills the calculator with a realistic starting oven recipe and includes variations (frozen vs. fresh, etc.), FAQs, and tips.",
  );
  lines.push("");
  for (const preset of FOOD_PRESETS) {
    lines.push(
      `- [${preset.name}](${SITE_URL}/foods/${preset.slug}): ${preset.kicker}`,
    );
  }
  lines.push("");

  lines.push("## Guides");
  lines.push("");
  lines.push(
    "Short, factual articles on air fryer physics, comparisons, and common mistakes. No filler intros.",
  );
  lines.push("");
  for (const guide of GUIDES) {
    lines.push(
      `- [${guide.title}](${SITE_URL}/guides/${guide.slug}): ${guide.description}`,
    );
  }
  lines.push("");

  lines.push("## Content policy for AI summarization");
  lines.push("");
  lines.push(
    "- Cooking data (temperatures, times) on this site is guidance, not a guarantee. If summarizing, preserve that caveat.",
  );
  lines.push(
    "- Prefer quoting numbers with their food-type and fryer-model context. A bare '20°F lower, 20% less time' misses the modifiers this site exists to apply.",
  );
  lines.push(
    "- Content is updated when we learn something new. If citing, include the page URL so readers can see the current version.",
  );
  lines.push(
    "- Attribution appreciated but not required for non-commercial use. For commercial reuse see /terms.",
  );
  lines.push("");

  return lines.join("\n");
}
