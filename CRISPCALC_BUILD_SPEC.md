# CrispCalc Build Spec — for Claude Code

You are helping me (Andres) build and ship **CrispCalc**, a fast, modern, SEO-optimized air fryer conversion calculator website. This document is your single source of truth for the build. Read it fully before writing any code.

---

## 0. How You Should Operate

- **Use TodoWrite** to break this spec into tracked tasks. Update status as you go.
- **Use available skills proactively.** Before writing UI code, read `frontend-design` skill (`/mnt/skills/public/frontend-design/SKILL.md` or wherever it lives in your skill registry). Before any deployment or product-self-knowledge questions, check `product-self-knowledge`.
- **Use MCPs I have configured.** I have **Google Stitch MCP** set up for React UI generation — use it for component design exploration when relevant. If you see other MCPs configured (shadcn, Vercel, Supabase, GitHub), use them as appropriate.
- **Pause for manual steps.** When I need to do something outside the codebase (register a domain, create an account, paste an API key, configure DNS, sign up for AdSense, etc.), STOP, output a clearly-labeled `MANUAL STEP REQUIRED` block with exact instructions, and wait for me to confirm before continuing.
- **Do not invent secrets.** Never hardcode API keys, AdSense publisher IDs, or analytics IDs. Use `.env.local` and provide a `.env.example` with placeholders.
- **Test the math.** The conversion formula has unit tests. Run them before declaring features complete.
- **Commit logically.** Commit after each major milestone with conventional commit messages (`feat:`, `chore:`, `docs:`, `test:`).

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Name** | CrispCalc |
| **Domain** | `crispcalc.com` (primary). Fallback: `crispcalc.io` or `getcrispcalc.com` |
| **Tagline** | "The air fryer conversion calculator, done right." |
| **One-liner** | "Convert any oven recipe to perfect air fryer settings in seconds — backed by the science of how air fryers actually cook." |
| **Voice** | Confident, clean, helpful. Not cutesy. Not corporate. Think: a friend who happens to be a food scientist. |
| **Audience** | Home cooks who own an air fryer (Ninja, Cosori, Instant Pot Vortex, Philips, Cuisinart, Breville). Skews 25–55, North America + UK + AU primary markets. Mobile-first — most use their phone in the kitchen. |

---

## 2. Strategic Context (Why This Site Exists)

CrispCalc is the first build in a portfolio of utility sites targeting low-competition, high-intent keywords with display ad monetization. Goals:

1. **Reach 25,000 monthly pageviews within 6–9 months** to qualify for Raptive (the new threshold as of Oct 2025, down from 100K).
2. **Earn $50–$300/month via Google AdSense** during the ramp, replaced by Raptive at scale.
3. **Build domain authority** for organic growth and a future expansion into a broader CrispCalc kitchen-tools brand (CrispCalc Recipes, Temperature Guides, etc.).

**Competitive landscape:** Existing competitors (`airfryerconverter.com`, `airfryerconversion.com`, `oventoairfryerconverter.com`, `airfryer-calculator.com`, `airfryercalculator.com`) are well-ranked but design-dated. Our edge is **modern UX, mobile speed, scientific credibility, and depth of content per food**.

---

## 3. Tech Stack (Locked)

- **Framework:** Next.js 15 (App Router, Server Components by default, Turbopack)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui (install with `npx shadcn@latest init`)
- **Icons:** lucide-react
- **Fonts:** Geist Sans + Geist Mono (via `next/font/google`)
- **Analytics:** Google Analytics 4 + Vercel Analytics
- **Search:** Google Search Console
- **Ads:** Google AdSense (Auto Ads + manually placed slots)
- **Hosting:** Vercel (production) — connect GitHub repo for CI/CD
- **Domain DNS:** Cloudflare (proxied) or Vercel DNS
- **Repo:** GitHub, public or private — I'll decide
- **Package manager:** pnpm

---

## 4. Design System

### 4.1 Brand Tokens

```
COLORS (light mode)
- background:        #FAFAF7 (warm off-white)
- foreground:        #1A1A1A (near-black)
- primary:           #E85D2C (CrispCalc orange — evokes heat/crispness)
- primary-foreground:#FFFFFF
- accent:            #F5B82E (amber/yellow — secondary heat color)
- muted:             #F0EDE5
- muted-foreground:  #6B6B6B
- border:            #E5E2DA
- success:           #2D7A3E
- destructive:       #C73E1D

COLORS (dark mode)
- background:        #0F0E0C
- foreground:        #F5F5F0
- primary:           #FF7A4A
- accent:            #FFC857
- muted:             #1F1D1A
- muted-foreground:  #A8A296
- border:            #2A2724

TYPOGRAPHY
- Display/H1:        Geist Sans, 600, tight tracking, 2.5–4rem
- Headings H2-H4:    Geist Sans, 600
- Body:              Geist Sans, 400, 1rem, 1.65 line-height
- Numbers/results:   Geist Mono, 500 (for the result display only)

SPACING
- Use Tailwind defaults. Generous whitespace. Min 1.5rem section padding mobile, 4rem desktop.

RADIUS
- sm: 0.5rem | md: 0.75rem | lg: 1rem | full: 9999px
- Calculator card and result card: lg

SHADOWS
- Subtle. shadow-sm for cards, shadow-md only on hover-elevated CTAs.
```

### 4.2 Visual Direction

- **Not** a generic AdSense-farm site. Not stock-photo collage. Not a Canva template.
- **Reference vibe:** Linear's marketing site meets a Bon Appétit editorial layout meets Stripe Docs' clarity.
- **Hero:** Bold typographic headline, the calculator visible above the fold on desktop, single high-quality food photo (NOT a stock-image collage). Photo should feel editorial — golden hour lighting, single subject (e.g., one perfectly crisped chicken wing or fries on parchment).
- **Calculator:** Card-based, big inputs with clear labels, result appears with a subtle animation, large monospace numbers for the result so it's scannable from across the kitchen.
- **No emojis in UI chrome.** Food preset cards may use a single small icon (lucide-react), not emoji.
- **Avoid:** gradients on backgrounds (one subtle accent only), drop-shadow stacks, bouncy animations, glassmorphism, "AI-generated" hero illustrations.
- **Consult the `frontend-design` skill before building any UI.** It has design tokens, component patterns, and constraints specific to this environment.

### 4.3 Imagery

- Use **Unsplash** API or curated free photography. Source 5–8 hero/preset food images: chicken wings, french fries, salmon, vegetables, frozen foods, baked goods, bacon, steak.
- All images: WebP format, served via `next/image`, with proper width/height attributes. No layout shift.
- Add proper alt text describing the food and cooking method (good for SEO + accessibility).

---

## 5. Information Architecture & Routes

```
/                                     Landing + main converter (the workhorse page)
/foods                                Index of all food preset pages
/foods/[slug]                         Per-food preset page (e.g., /foods/chicken-wings)
/guides                               Index of long-form guides
/guides/[slug]                        Individual guide article
/charts/oven-to-air-fryer             Static conversion chart page (highly linkable)
/charts/celsius-to-fahrenheit         Temperature unit converter
/about                                Brief about + author/expertise (E-E-A-T)
/contact                              Simple contact form
/privacy                              Privacy policy (required for AdSense)
/terms                                Terms of use
/sitemap.xml                          Auto-generated
/robots.txt                           Allow all, point to sitemap
/llms.txt                             For AI crawler guidance (modern best practice)
```

**Initial food preset pages (10 launch URLs, each its own indexable page):**
1. `/foods/chicken-wings`
2. `/foods/french-fries`
3. `/foods/salmon`
4. `/foods/bacon`
5. `/foods/frozen-pizza`
6. `/foods/chicken-breast`
7. `/foods/brussels-sprouts`
8. `/foods/sweet-potato-fries`
9. `/foods/meatballs`
10. `/foods/reheated-pizza`

**Initial guides (5 launch articles, blog-ready structure):**
1. `/guides/how-air-fryers-actually-work`
2. `/guides/air-fryer-vs-convection-oven`
3. `/guides/best-air-fryer-temperatures-by-food-type`
4. `/guides/common-air-fryer-mistakes`
5. `/guides/converting-baking-recipes-to-air-fryer`

---

## 6. The Calculator (Core Feature)

### 6.1 Inputs

- **Oven Temperature** (number input + unit toggle °F/°C, default °F)
- **Oven Time** (number input, in minutes, default empty)
- **Food Type** (select dropdown, optional, default "General")
  - General, Frozen Food, Raw Meat (chicken/pork/beef), Fish, Baked Goods, Vegetables, Reheating
- **Air Fryer Model** (select dropdown, optional, default "Standard Basket")
  - Standard Basket, Ninja (high-wattage), Cosori, Instant Vortex, Philips, Oven-style/Toaster (Breville/Cuisinart)

### 6.2 Conversion Logic

Base rule (the "20/20 rule"): reduce temp by 25°F (≈14°C) and reduce time by 20%.

**But apply modifiers per the table below.** Implement as a pure TypeScript function in `/lib/converter.ts` with full unit tests in `/lib/converter.test.ts`.

```typescript
type FoodType = 'general' | 'frozen' | 'raw_meat' | 'fish' | 'baked' | 'vegetables' | 'reheating';
type FryerModel = 'standard' | 'ninja' | 'cosori' | 'vortex' | 'philips' | 'oven_style';

interface ConversionInput {
  ovenTempF: number;          // always normalize input to Fahrenheit internally
  ovenTimeMin: number;
  foodType: FoodType;
  fryerModel: FryerModel;
}

interface ConversionResult {
  airFryerTempF: number;      // rounded to nearest 5°F
  airFryerTempC: number;      // rounded to nearest whole °C
  airFryerTimeMin: number;    // rounded to nearest whole minute
  checkAtMin: number;         // 75% of converted time, for "check at" warning
  warnings: string[];
}
```

**Modifier table (apply multiplicatively to base 20/20 rule):**

| Food Type | Temp reduction (°F) | Time multiplier |
|---|---|---|
| general | 25 | 0.80 |
| frozen | 30 | 0.85 (less reduction — needs to thaw + cook) |
| raw_meat | 25 | 0.80 |
| fish | 30 | 0.75 (delicate) |
| baked | 35 | 0.75 (avoid over-browning) |
| vegetables | 20 | 0.75 |
| reheating | 25 | 0.50 (much faster reheat) |

| Fryer Model | Additional temp adjustment (°F) | Additional time multiplier |
|---|---|---|
| standard | 0 | 1.00 |
| ninja | -10 (runs hot) | 0.95 |
| cosori | -5 | 1.00 |
| vortex | 0 | 1.00 |
| philips | 0 | 1.00 |
| oven_style | +5 (slower air velocity) | 1.05 |

**Always:**
- Round final temp DOWN to the nearest 5°F (safer to undercook then add time).
- Round time to the nearest whole minute, minimum 2 minutes.
- Generate `checkAtMin = Math.max(2, Math.round(airFryerTimeMin * 0.75))`.
- Add warnings:
  - If oven temp > 450°F: "Most air fryers max at 400–450°F. Use max temp and add 2–3 minutes."
  - If foodType is `baked` and oven temp > 350°F: "Baked goods can over-brown. Cover loosely with foil if needed."
  - If foodType is `fish` and time > 15 min: "Check fish early — it cooks fast."

### 6.3 Calculator UX

- Result updates **live** as user types (debounced 200ms). No "Calculate" button.
- Result card shows: large temp + time, smaller "check at" sub-line, warnings (if any) as small alerts, a "Copy result" button (uses Clipboard API).
- Below the calculator, show a "Want to convert a specific food?" section that links to the 10 food preset pages.
- Calculator state stored in URL query params (`?temp=400&time=25&food=chicken-wings&fryer=ninja`) so users can share/bookmark conversions.

### 6.4 Reusable Calculator Component

The calculator is rendered on:
- Homepage (`/`)
- Each food preset page (`/foods/[slug]`) — pre-filled with that food's defaults
- Each guide page where relevant (embedded inline)

Build it as `<ConverterCalculator initialState={...} />` in `/components/converter/`. Use `'use client'` only for the calculator itself; everything else server-rendered.

---

## 7. Food Preset Pages — Content Template

Each `/foods/[slug]` page must include:

1. **H1**: "Air Fryer [Food Name]: Perfect Time & Temperature" (exact format for SEO)
2. **Hero photo** of the cooked food (editorial style)
3. **The calculator pre-filled** with default values for this food (e.g., chicken wings → 400°F / 40 min)
4. **Quick reference card**: "Recommended: XX°F for XX min" (the answer above the fold)
5. **300–500 words of original content**: cooking tips specific to this food, oil/seasoning suggestions, when to flip/shake, doneness indicators
6. **Variations table**: e.g., for chicken wings — fresh vs frozen, sauced vs dry, sizes
7. **Related foods** section (3 internal links to other preset pages)
8. **FAQ section** (5+ Q&As) — wraps as JSON-LD FAQ schema
9. **Recipe schema markup** (JSON-LD) — qualifies for rich results in Google
10. **Last updated** date at bottom (helps with freshness signals)

Use MDX or a structured data file (`/content/foods/*.json` or `*.mdx`) so content is easy to add later without touching React code.

---

## 8. SEO Requirements

- **Metadata** on every page using Next.js `generateMetadata`. Title format: `[Page Title] | CrispCalc`. Custom OG images for each food page (use `next/og` to dynamically generate).
- **Schema markup** (JSON-LD):
  - `Organization` and `WebSite` schema on root layout
  - `Recipe` or `HowTo` schema on each food page
  - `FAQPage` schema on pages with FAQs
  - `BreadcrumbList` schema where breadcrumbs exist
- **Sitemap**: auto-generated at `/sitemap.xml`. Include all food and guide pages with `lastModified`.
- **Robots.txt**: allow all, link sitemap.
- **Canonical URLs** on every page.
- **Open Graph + Twitter Card** meta on every page.
- **llms.txt** at the root with site purpose, key pages, and content guidelines for AI crawlers.
- **Internal linking**: each food page links to ≥3 other food pages and ≥1 guide. Each guide links back to the calculator and to ≥2 relevant food pages.
- **Image alt text**: descriptive, includes food name where relevant.
- **Mobile-first**: Lighthouse mobile score must be ≥95 for Performance, Accessibility, Best Practices, SEO.

---

## 9. Monetization (AdSense)

- AdSense publisher ID stored in `.env.local` as `NEXT_PUBLIC_ADSENSE_CLIENT_ID`.
- Use **Auto Ads** initially for simplicity, but also create three manually-placed slot components: `<AdSlotInArticle />`, `<AdSlotSidebar />`, `<AdSlotFooter />` so we can switch to manual placement later for higher RPM.
- Lazy-load the AdSense script (load after main content) to protect Core Web Vitals.
- **Do not show ads in development.** Gate with `process.env.NODE_ENV === 'production'`.
- Provide a `<NoAdsForCalculator />` zone — never place ads inside or directly above the calculator (kills UX, lowers trust).
- Add a brief "Why we show ads" line in the footer to build user trust.

---

## 10. Analytics & Tracking

- **Google Analytics 4** via `@next/third-parties/google`. ID in `.env.local` as `NEXT_PUBLIC_GA_ID`.
- **Vercel Analytics + Speed Insights** packages installed.
- Track these custom events on the calculator:
  - `conversion_calculated` (with temp, time, food type, fryer model as params)
  - `result_copied`
  - `food_preset_clicked`
  - `guide_clicked`
- **No PII**. Anonymize IPs.

---

## 11. Legal/Compliance Pages

Generate boilerplate but flag for my review:
- Privacy policy mentioning Google AdSense, Google Analytics, cookies, and data retention.
- Terms of use including "informational purposes only — cooking results may vary."
- Cookie consent banner (use `vanilla-cookieconsent` or a simple custom one). Required for EU/UK visitors and AdSense compliance.

---

## 12. Build Order & Milestones

Use TodoWrite to track these. Each milestone = a commit + a checkpoint where you confirm with me before proceeding.

### Milestone 1: Scaffold + Design System
- `npx create-next-app@latest crispcalc --typescript --tailwind --app --src-dir --turbopack`
- Install shadcn, configure tokens from §4.1
- Set up `/lib/converter.ts` with full implementation + tests (vitest)
- Verify tests pass
- **Checkpoint:** show me the converter test results

### Milestone 2: Core Calculator + Homepage
- Build `<ConverterCalculator>` component
- Build homepage with hero, calculator, food preset grid, footer
- Mobile-responsive
- **Checkpoint:** I review the homepage locally (`pnpm dev`)

### Milestone 3: Food Preset Pages
- Build dynamic `[slug]` route + content schema
- Populate all 10 food JSON/MDX files with researched content (use web_search or web_fetch to find typical air fryer settings for each food)
- Each page renders calculator with pre-filled defaults
- **Checkpoint:** I review 2–3 food pages

### Milestone 4: Guides + Static Pages
- Build `/guides/[slug]` route
- Write 5 launch guide articles (you draft, I review/edit)
- Build About, Contact, Privacy, Terms, Charts pages
- **Checkpoint:** review all static pages

### Milestone 5: SEO + Schema
- Add all metadata, JSON-LD schema, sitemap, robots, llms.txt
- Run Lighthouse audit, fix anything <95
- **Checkpoint:** Lighthouse report shared

### Milestone 6: Analytics + Ads
- Wire up GA4, Vercel Analytics, AdSense (placeholder ID until I provide real one)
- Add cookie consent banner
- **Checkpoint:** I review consent flow

### Milestone 7: Deploy
- Manual step: I create GitHub repo, push code
- Manual step: I deploy to Vercel, connect domain
- Manual step: I configure DNS in Cloudflare/Vercel
- Manual step: I submit sitemap to Google Search Console
- Manual step: I apply for Google AdSense
- **Checkpoint:** site is live at crispcalc.com

### Milestone 8: Post-Launch Backlog
- Document next 20 food pages and 10 guide topics in `/docs/CONTENT_BACKLOG.md`
- Document a 6-month SEO content calendar

---

## 13. Manual Steps I Will Need to Do

When you reach each of these, output a `MANUAL STEP REQUIRED` block with the exact instructions. Do not proceed until I confirm.

1. **Register domain** at Namecheap or Cloudflare Registrar (~$10/year)
2. **Create GitHub repo** and push initial commit
3. **Create Vercel account/project** and link the GitHub repo
4. **Configure DNS** to point domain to Vercel
5. **Create Google Analytics 4 property**, get Measurement ID
6. **Create Google Search Console property**, verify ownership, submit sitemap
7. **Apply for Google AdSense** (typically takes 1–4 weeks for approval; need site to have content + privacy policy + meaningful traffic, even if small)
8. **Set up Vercel Analytics** (1-click in Vercel dashboard)
9. **Add environment variables** in Vercel dashboard once I have IDs

For each manual step, give me:
- Exact URL to go to
- Exact fields to fill in
- What to copy back to you (e.g., "paste the GA4 Measurement ID here")

---

## 14. Quality Gates (Definition of Done)

A feature is not done until:
- [ ] TypeScript compiles with no errors (strict mode)
- [ ] No ESLint warnings
- [ ] Unit tests pass for any logic
- [ ] Mobile (375px), tablet (768px), desktop (1440px) all look correct
- [ ] Lighthouse mobile ≥95 across all categories on the page
- [ ] No console errors or warnings in dev or build
- [ ] Build succeeds (`pnpm build`)
- [ ] Committed with conventional message

---

## 15. What NOT to Do

- Do NOT use `localStorage` or `sessionStorage` for user preferences — use URL params or cookies (server-readable).
- Do NOT add a login system. There are no accounts.
- Do NOT add a database in v1. Content is static (MDX/JSON).
- Do NOT add AI features ("ask AI about your recipe") — adds cost and complexity, users want speed.
- Do NOT add a newsletter signup at launch (we'll add this later, in Milestone 8 or v2).
- Do NOT use `<form>` tags with default submit behavior — handle with onClick/onChange.
- Do NOT bloat the homepage with 20 sections. The calculator is the hero. Below it: food presets, brief explainer, link to guides, footer.
- Do NOT make the calculator hidden behind a "Get Started" button. It's the product — show it immediately.
- Do NOT plagiarize content from competitor sites. All copy must be original. Use research, then write fresh.

---

## Acknowledgement

Before you start building, confirm:
1. You've read this entire spec.
2. You've checked which skills are available and which are relevant.
3. You've checked which MCPs I have configured and which are relevant.
4. You will use TodoWrite to track milestones.
5. You will pause for manual steps and not assume.

Then proceed with **Milestone 1: Scaffold + Design System**.
