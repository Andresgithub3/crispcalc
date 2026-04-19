# CrispCalc Build Spec — for Claude Code

You are helping me (Andres) maintain and grow **CrispCalc**, a fast, modern, SEO-optimized air fryer conversion calculator website. This document is the single source of truth for the project. Read it fully before writing any code.

> **Status as of April 2026:** The site is **live at crispcalc.com**. All initial-launch milestones (M1–M8) are shipped and deployed. The remaining work is content publishing (see `docs/CONTENT_BACKLOG.md`), wiring AdSense ad-slot IDs once Google approves the application, and registering the Amazon Associates affiliate tag.

---

## 0. How You Should Operate

- **Do not invent secrets.** Never hardcode API keys, AdSense publisher IDs, or analytics IDs. Use `.env.local` and `.env.example` with placeholders.
- **Test the math.** The conversion formula has 28 unit tests in `src/lib/converter.test.ts`. Run `npm run test` before declaring features complete.
- **Commit logically.** Conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:`, `test:`). Co-author line: `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`.
- **Build before merging.** All four quality gates must pass: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`.
- **Pause for manual steps.** When Andres needs to do something outside the codebase (create an account, paste an API key, configure DNS, etc.), STOP, output a clearly-labeled `MANUAL STEP REQUIRED` block with exact instructions, and wait for confirmation before continuing.

---

## 1. Project Identity

| Field | Value |
|---|---|
| **Name** | CrispCalc |
| **Domain** | `crispcalc.com` |
| **Tagline** | "The air fryer conversion calculator, done right." |
| **One-liner** | "Convert any oven recipe to perfect air fryer settings in seconds — backed by the science of how air fryers actually cook." |
| **Voice** | Confident, clean, helpful. Not cutesy. Not corporate. Think: a friend who happens to be a food scientist. |
| **Audience** | Home cooks who own an air fryer (Ninja, Cosori, Instant Pot Vortex, Philips, Cuisinart, Breville). Skews 25–55, North America + UK + AU primary markets. Mobile-first — most use their phone in the kitchen. |

---

## 2. Strategic Context (Why This Site Exists)

CrispCalc is the first build in a portfolio of utility sites targeting low-competition, high-intent keywords with display ad + affiliate monetization. Goals:

1. **Reach 25,000 monthly pageviews within 6–9 months** to qualify for Raptive (the new threshold as of Oct 2025, down from 100K).
2. **Earn $50–$300/month via Google AdSense + Amazon affiliates** during the ramp, replaced by Raptive at scale.
3. **Build domain authority** for organic growth and a future expansion into a broader CrispCalc kitchen-tools brand (CrispCalc Recipes, Temperature Guides, etc.).

**Competitive landscape:** Existing competitors (`airfryerconverter.com`, `airfryerconversion.com`, `oventoairfryerconverter.com`, `airfryer-calculator.com`, `airfryercalculator.com`) are well-ranked but design-dated. Our edge is **modern UX, mobile speed, scientific credibility, and depth of content per food**.

---

## 3. Tech Stack (Actual — as deployed)

- **Framework:** Next.js 16.2.4 (App Router, Server Components by default, Turbopack)
- **React:** 19.2.4
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (PostCSS plugin, no config file — tokens in `src/app/globals.css`)
- **Components:** shadcn/ui base-nova variant (`@base-ui/react` under the hood, not Radix)
- **Icons:** lucide-react
- **Fonts:** Geist Sans + Geist Mono (via `next/font/google`)
- **Analytics:** Google Analytics 4 (`@next/third-parties/google`) + Vercel Analytics + Vercel Speed Insights
- **Search:** Google Search Console (verified, sitemap submitted)
- **Ads:** Google AdSense (site verification complete, application under review)
- **Affiliates:** Amazon Associates (product links with `crispcalc-20` tag — tag not yet registered)
- **Testing:** Vitest 4 (28 tests, converter engine only)
- **Hosting:** Vercel (production deploys from `main` branch)
- **Domain DNS:** Cloudflare DNS-only (grey cloud, no proxy) — apex A record `76.76.21.21`, `www` CNAME `cname.vercel-dns.com`
- **Repo:** GitHub (`Andresgithub3/crispcalc`)
- **Package manager:** npm

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
- **Hero:** Bold typographic headline, the calculator visible above the fold on desktop. Text-only hero (no stock images).
- **Calculator:** Card-based, big inputs with clear labels, result appears with a subtle animation, large monospace numbers for the result so it's scannable from across the kitchen.
- **No emojis in UI chrome.** Food preset cards may use a single small icon (lucide-react), not emoji.
- **Avoid:** gradients on backgrounds (one subtle accent only), drop-shadow stacks, bouncy animations, glassmorphism, "AI-generated" hero illustrations.

---

## 5. Information Architecture & Routes

All routes below are **live and deployed**:

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
/sitemap.xml                          Auto-generated (25 URLs)
/robots.txt                           Allow all, point to sitemap
/llms.txt                             AI-crawler manifest (dynamic route)
```

**Live food preset pages (10):**
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

**Live guides (5):**
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

Implemented as a pure TypeScript function in `src/lib/converter.ts` with 28 unit tests in `src/lib/converter.test.ts`.

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
- Calculator state stored in URL query params (`?temp=400&time=25&food=chicken-wings&fryer=ninja`) so users can share/bookmark conversions. Only non-default params are included in the URL.

### 6.4 Reusable Calculator Component

The calculator is rendered on:
- Homepage (`/`)
- Each food preset page (`/foods/[slug]`) — pre-filled with that food's defaults

Built as `<ConverterCalculator initialState={...} />` in `src/components/converter/`. Uses `'use client'` only for the calculator itself; everything else server-rendered.

---

## 7. Food Preset Pages — Content Template

Each `/foods/[slug]` page includes:

1. **H1**: "Air Fryer [Food Name]: Perfect Time & Temperature" (exact format for SEO)
2. **The calculator pre-filled** with default values for this food
3. **Quick reference card**: Temperature, Total time, Check at, Yields — above the fold
4. **300–500 words of original content**: cooking tips specific to this food, oil/seasoning suggestions, when to flip/shake, doneness indicators
5. **Variations table**: e.g., for chicken wings — fresh vs frozen, sauced vs dry, sizes
6. **FAQ section** (5+ Q&As) — wraps as JSON-LD FAQPage schema
7. **Related foods** section (3 internal links to other preset pages)
8. **HowTo schema markup** (JSON-LD) — qualifies for rich results in Google
9. **Last updated** date at bottom (freshness signals)

Content is stored as structured TypeScript data in `src/content/foods.ts` (pure data, no MDX). To add a new food, add an entry to the `FOOD_PRESETS` array matching the `FoodPreset` interface.

---

## 8. SEO Requirements

All implemented and live:

- **Metadata** on every page using Next.js `generateMetadata`. Title format: `[Page Title] | CrispCalc`. Dynamic OG images for food pages (Satori/`next/og`).
- **Schema markup** (JSON-LD):
  - `Organization` and `WebSite` schema on root layout
  - `HowTo` schema on each food page
  - `FAQPage` schema on pages with FAQs
  - `BreadcrumbList` schema where breadcrumbs exist
  - `Article` schema on guide pages
- **Sitemap**: auto-generated at `/sitemap.xml` (25 URLs) with `lastModified`.
- **Robots.txt**: allow all, link sitemap.
- **Canonical URLs** on every page.
- **Open Graph + Twitter Card** meta on every page.
- **llms.txt** at the root with site purpose, key pages, and content guidelines for AI crawlers.
- **Internal linking**: each food page links to ≥3 other food pages. Each guide links to relevant food pages.
- **Mobile-first**: Lighthouse mobile score target ≥95 for Performance, Accessibility, Best Practices, SEO.

---

## 9. Monetization

### 9.1 Google AdSense

- **Status:** Site verification complete. Application under Google review (typical window: a few days to a couple of weeks).
- AdSense publisher ID stored in `.env.local` as `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (value: `ca-pub-9681069917942148`).
- AdSense loader script (`src/components/ads/AdSenseScript.tsx`) uses a plain `<script async>` element — NOT `next/script` — because React 19 hoists it to `<head>` as real markup that the AdSense verification crawler can see.
- The loader is **not gated on consent**. Consent Mode v2 handles GDPR at the gtag layer (default `ad_storage: denied`), so the script loads for everyone but only serves personalized ads to opted-in users.
- Ad slot components exist (`src/components/ads/AdSlot.tsx`) and render a stable placeholder when slot IDs aren't set.
- **On AdSense approval:** Google provides slot IDs. Wire them as env vars (`NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE`, `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`, `NEXT_PUBLIC_ADSENSE_SLOT_FOOTER`) and place the existing slot components into pages.
- `public/ads.txt` contains the authorized sellers record.
- **Do not show ads in development.** Gated with `process.env.NODE_ENV === 'production'`.
- Never place ads inside or directly above the calculator.

### 9.2 Amazon Affiliates

- **Status:** Affiliate tag `crispcalc-20` is in the code but not yet registered in Amazon Associates. Links work (go to real product pages) but don't earn commission until the tag is registered.
- Product data: `src/lib/affiliateProducts.ts` — 6 products (3 air fryers, 3 accessories) with `AffiliateProduct` interface.
- **Desktop (xl: / 1280px+):** Sticky 280px sidebar on the right side of all content pages. Rendered by `ContentWithSidebar` layout wrapper → `AffiliateSidebar` (shows 4 products).
- **Mobile/tablet (< 1280px):** Horizontal snap-scroll row of all 6 products, placed inline between content sections. Rendered by `AffiliateInline` (hidden at xl:).
- All affiliate links use `rel="nofollow sponsored noopener"` and open in a new tab.
- FTC disclosure text ("As an Amazon Associate we earn from qualifying purchases.") appears at the bottom of both sidebar and inline blocks.
- Product images loaded from `m.media-amazon.com` via `next/image` (configured in `next.config.ts` `images.remotePatterns`).

**Affiliate component files:**
- `src/lib/affiliateProducts.ts` — product data + types
- `src/components/affiliate/AffiliateProductCard.tsx` — single product card
- `src/components/affiliate/AffiliateSidebar.tsx` — desktop sidebar (4 cards)
- `src/components/affiliate/AffiliateInline.tsx` — mobile inline scroll row
- `src/components/affiliate/ContentWithSidebar.tsx` — layout wrapper (content + 280px sidebar grid at xl:)

**Pages using the affiliate layout:**
- `src/app/page.tsx` — homepage (inline between Presets and HowItWorks)
- `src/app/foods/[slug]/page.tsx` — food pages (inline between Article and Variations)
- `src/app/guides/[slug]/page.tsx` — guide pages (inline between Body and RelatedFoods)

---

## 10. Analytics & Tracking

All implemented and live:

- **Google Analytics 4** via `@next/third-parties/google`. ID in `.env.local` as `NEXT_PUBLIC_GA_ID` (value: `G-Z4SWCQQSSB`).
- **Vercel Analytics + Speed Insights** packages installed and active.
- Custom events tracked on the calculator:
  - `conversion_calculated` (with temp, time, food type, fryer model as params)
  - `result_copied`
  - `food_preset_clicked`
  - `guide_clicked`
- Analytics, AdSense, and Speed Insights are all gated on `NODE_ENV === "production"` AND the env var being set — dev + preview builds stay script-free.
- **No PII**. Anonymize IPs.

---

## 11. Legal/Compliance

All implemented and live:

- **Privacy policy** (`/privacy`) — mentions Google AdSense, Google Analytics, cookies, data retention, and Amazon affiliate links.
- **Terms of use** (`/terms`) — includes "informational purposes only — cooking results may vary."
- **Cookie consent banner** — custom `ConsentBanner` component (`src/components/site/ConsentBanner.tsx`). Consent stored as a first-party cookie named `crispcalc_consent` (`granted` | `denied`, 1-year Max-Age, `SameSite=Lax`, `Secure`). Uses `useSyncExternalStore` pattern for React 19 compatibility — NOT `useEffect` → `useState`.
- **Consent Mode v2** — default `ad_storage: denied` + `ads_data_redaction: true`. Updated to `granted` when user accepts.

---

## 12. Build Milestones — All Shipped

All initial-launch milestones are complete and deployed:

| # | Milestone | Status | Key Commit |
|---|---|---|---|
| M1 | Design system (brand tokens, fonts, env scaffold) | Shipped | `9b1d43f` |
| M2 | Homepage + live converter calculator | Shipped | `b88206e` |
| M3 | 10 food preset pages + JSON-LD schema | Shipped | `52f1548` |
| M4 | 5 guides + 2 charts + static pages (about/privacy/terms/contact) | Shipped | `b2e06bb` |
| M5 | SEO metadata, sitemap, robots, llms.txt, OG images | Shipped | `17bb899` |
| M6 | GA4, Vercel Analytics, Speed Insights, Consent Mode v2, AdSense loader | Shipped | `b8a2410` |
| M7 | Production deploy (Vercel + Cloudflare DNS + verified on Search Console/Bing/AdSense) | Shipped | — |
| M8 | Content backlog doc (`docs/CONTENT_BACKLOG.md`) | Shipped | `183ea35` |

Follow-on work shipped after initial launch:
- Consent stored as first-party cookie, not localStorage (`b8fcd6a`)
- Google Search Console verification meta tag (`a53092c`)
- AdSense loader decoupled from consent gate + `public/ads.txt` (`ab2ad69`)
- AdSense loader refactor for crawler visibility (`76bc1c2`, `cfe2569`)
- Calculator UX: clear temp/time inputs without sticky 0 (`f76ebc5`)
- Calculator: only include non-default params in URL (`0978ede`)
- CrispCalc favicon brand mark (`83e330a`)
- Amazon affiliate sidebar + inline product cards (`bb576e3`)

---

## 13. What to Work on Next

### 1. Wire AdSense ad slots (blocked on Google approval)

When Google emails approval, they'll provide slot IDs in the AdSense dashboard.

1. Add three env vars to `.env.example` and Vercel production env: `NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE`, `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`, `NEXT_PUBLIC_ADSENSE_SLOT_FOOTER`.
2. Place `<AdSlotInArticle>` mid-article on food and guide pages.
3. Place `<AdSlotSidebar>` in the right rail (note: the affiliate sidebar now occupies the right rail — decide whether ads go above/below affiliate products or replace some).
4. Place `<AdSlotFooter>` above the site footer.
5. Never place ads inside or directly above the calculator.

### 2. Register Amazon Associates tag

Register `crispcalc-20` at https://affiliate-program.amazon.com/. The existing affiliate links will start earning immediately with no code changes.

### 3. Publish content from the backlog

`docs/CONTENT_BACKLOG.md` has a 6-month calendar (Apr–Sep 2026). Add new foods to `src/content/foods.ts` and new guides to `src/content/guides.ts` in the same shape as existing entries. Content rules from §7 apply — original writing, link to ≥3 siblings + the calculator, no AI filler.

After adding content, bump `updatedAt` on affected entries and request indexing in Search Console for the new URL.

### 4. Lower priority / optional

- **Third chart** — consider once Search Console shows the existing two pulling traffic.
- **Data refresh** — once real user data arrives via GA4, revisit the 10 original food presets with new FAQ questions harvested from Search Console queries.
- **Newsletter signup** — planned for v2, not yet implemented.

---

## 14. Repo Layout

```
src/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout — fonts, metadata, GA4,
│   │                           AdSense, Consent Mode v2, JSON-LD
│   ├── page.tsx              # Homepage
│   ├── foods/[slug]/         # Per-food preset pages (generateStaticParams)
│   ├── guides/[slug]/        # Per-guide pages
│   ├── charts/               # 2 reference charts
│   ├── about|privacy|terms|contact/
│   ├── opengraph-image.tsx   # Dynamic OG images (Satori)
│   ├── sitemap.ts            # 25 URLs
│   ├── robots.ts
│   └── llms.txt/route.ts     # AI-crawler manifest
├── components/
│   ├── ads/                  # AdSense loader + <AdSlot*> components
│   ├── affiliate/            # Amazon affiliate sidebar + inline cards
│   ├── charts/               # Chart rendering primitives
│   ├── converter/            # <ConverterCalculator> + engine glue
│   ├── site/                 # ConsentBanner, TrackedLink, nav, footer
│   └── ui/                   # shadcn base-nova primitives
├── content/
│   ├── foods.ts              # 10 food presets (pure data)
│   └── guides.ts             # 5 guide documents (pure data)
└── lib/
    ├── affiliateProducts.ts  # Amazon affiliate product data
    ├── analytics.ts          # sendGAEvent wrappers
    ├── converter.ts          # 20/20 rule engine (pure, tested)
    └── utils.ts              # cn() helper

docs/
└── CONTENT_BACKLOG.md        # Next 20 foods, 10 guides, Apr–Sep calendar

public/
└── ads.txt                   # AdSense authorized sellers record

CRISPCALC_BUILD_SPEC.md       # This file — source of truth
AGENTS.md                     # Next.js 16 breaking-changes reminder
CLAUDE.md                     # Agent instructions (re-exports AGENTS.md)
```

---

## 15. Environment Variables

See `.env.example`. In Vercel production:

| Var | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://crispcalc.com` | Used for canonical URLs, OG images, JSON-LD |
| `NEXT_PUBLIC_GA_ID` | `G-Z4SWCQQSSB` | Google Analytics 4 Measurement ID |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | `ca-pub-9681069917942148` | AdSense publisher ID |

Analytics, AdSense, and Speed Insights are all gated on `NODE_ENV === "production"` AND the var being set, so dev + preview builds stay script-free.

---

## 16. Quality Gates (Definition of Done)

A feature is not done until:
- [ ] TypeScript compiles with no errors (`npm run typecheck`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Unit tests pass (`npm run test`)
- [ ] Mobile (375px), tablet (768px), desktop (1440px) all look correct
- [ ] Lighthouse mobile ≥95 across all categories on the page
- [ ] No console errors or warnings in dev or build
- [ ] Build succeeds (`npm run build`)
- [ ] Committed with conventional message

---

## 17. Gotchas & Lessons Learned

These cost real time during the initial build. Don't re-learn them.

### Consent storage must be a cookie, not localStorage

Spec §15 (now this doc) forbids `localStorage`/`sessionStorage` for user preferences — cookies are server-readable, which matters for SSR personalization and for Consent Mode v2 to work across navigation. The consent value lives in a first-party cookie named `crispcalc_consent` (`granted` | `denied`, 1-year Max-Age, `SameSite=Lax`, `Secure`). See `ConsentBanner.tsx`.

### AdSense verification requires a literal `<script async src>` tag

`next/script`, regardless of strategy, does **not** emit a literal `<script async src="...adsbygoogle.js">` tag in the initial HTML:

- `afterInteractive` / `lazyOnload` → injected client-side after hydration (crawler doesn't execute JS, can't see it).
- `beforeInteractive` → emits `<link rel="preload">` plus a `self.__next_s.push([...])` runtime queue. AdSense's regex-based crawler doesn't find the script tag pattern, verification fails with "Couldn't verify your site".

**Fix:** use a plain `<script async src={...} crossOrigin="anonymous" />` JSX element. React 19 hoists async script tags to `<head>` as real markup. See `src/components/ads/AdSenseScript.tsx`.

### The AdSense loader must not be consent-gated

Googlebot has no consent cookie. Gating the `<script>` tag itself on consent means the verification crawler sees nothing and review fails. **Consent Mode v2** handles GDPR at the gtag layer (default `ad_storage: denied` + `ads_data_redaction: true`), which makes AdSense serve non-personalized ads to users who haven't opted in. The loader itself loads for everyone.

### React 19 strict `set-state-in-effect` rule

You can't call `setState` inside `useEffect` to mirror an external data source. Use `useSyncExternalStore` with a `subscribe` function that listens to a custom event. The consent system uses this pattern and can be copied for similar client-side-state-from-DOM needs.

### Next.js 16 breaking changes

Next.js 16 has breaking changes vs older training data. Before writing any Next-specific code, read the relevant doc in `node_modules/next/dist/docs/`. See `AGENTS.md`.

---

## 18. What NOT to Do

- Do NOT use `localStorage` or `sessionStorage` for user preferences — use URL params or cookies (server-readable).
- Do NOT add a login system. There are no accounts.
- Do NOT add a database. Content is static TypeScript data files.
- Do NOT add AI features ("ask AI about your recipe") — adds cost and complexity, users want speed.
- Do NOT use `<form>` tags with default submit behavior — handle with onClick/onChange.
- Do NOT bloat the homepage with 20 sections. The calculator is the hero.
- Do NOT make the calculator hidden behind a "Get Started" button. It's the product — show it immediately.
- Do NOT plagiarize content from competitor sites. All copy must be original.
- Do NOT use `next/script` for the AdSense loader — use a plain `<script async>` element (see §17).
- Do NOT gate the AdSense loader on consent — Consent Mode v2 handles it (see §17).
- Do NOT use `useEffect` → `useState` for external data sources — use `useSyncExternalStore` (see §17).
