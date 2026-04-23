# CrispCalc

**The air fryer conversion calculator, done right.** Converts oven
recipes to air fryer settings using the 20/20 rule, with 10 hand-tuned
food presets, 5 educational guides, and two reference charts.

Live: **https://crispcalc.com**

---

## Project status

All initial-launch milestones (M1–M8) per `CRISPCALC_BUILD_SPEC.md`
are shipped and deployed. The site is live on Vercel at
crispcalc.com, GA4 + Vercel Analytics + Speed Insights are recording
traffic, Search Console and Bing have it indexed, and **AdSense site
verification is complete — application is under Google review**.

The remaining work is post-launch content publishing per
`docs/CONTENT_BACKLOG.md` and, once AdSense approves, wiring real
ad-slot IDs into the existing `<AdSlot*>` components.

### Milestones

| # | Milestone | Status | Commit |
|---|---|---|---|
| M1 | Design system (brand tokens, fonts, env scaffold) | Shipped | `9b1d43f` |
| M2 | Homepage + live converter calculator | Shipped | `b88206e` |
| M3 | 10 food preset pages + JSON-LD schema | Shipped | `52f1548` |
| M4 | 5 guides + 2 charts + static pages (about/privacy/terms/contact) | Shipped | `b2e06bb` |
| M5 | SEO metadata, sitemap, robots, llms.txt, OG images | Shipped | `17bb899` |
| M6 | GA4, Vercel Analytics, Speed Insights, Consent Mode v2, AdSense loader | Shipped | `b8a2410` |
| M7 | Production deploy (Vercel + Cloudflare DNS-only + verified on Search Console/Bing/AdSense) | Shipped | — |
| M8 | Content backlog doc | Shipped | `183ea35` |

Follow-on fixes shipped on top of M6/M7:
- `b8fcd6a` consent stored as first-party cookie, not localStorage (spec §15 compliance)
- `a53092c` Google Search Console verification meta tag
- `ab2ad69` AdSense loader decoupled from consent gate + `public/ads.txt`
- `76bc1c2`, `cfe2569` AdSense loader refactor so crawler sees the script (see "AdSense verification" below)

### Waiting on external services

- **AdSense review** — Google emails when approved. Typical window
  is a few days to a couple of weeks. On approval, they provide three
  ad-slot IDs (in-article / sidebar / footer).
- **Search Console indexing** — URLs submitted via sitemap;
  impressions start flowing within a few days of verification.

---

## Pick up where we left off

The two obvious next moves, in priority order:

### 1. Wire ad slots once AdSense approves

When Google emails approval, they'll provide slot IDs in the AdSense
dashboard. Wire them as env vars and drop the existing slot
components into pages. The components are ready (`src/components/ads/AdSlot.tsx`)
and already render a stable placeholder when slot IDs aren't set, so
layout doesn't shift when you toggle them on.

Implementation steps:

1. Add three vars to `.env.example` and to Vercel's production env:
   `NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE`, `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`,
   `NEXT_PUBLIC_ADSENSE_SLOT_FOOTER`.
2. Place `<AdSlotInArticle slotId={...} />` mid-article on
   `src/app/foods/[slug]/page.tsx` and `src/app/guides/[slug]/page.tsx`.
3. Place `<AdSlotSidebar slotId={...} />` in the right rail on pages
   that have one (food/guide pages, if the design calls for it).
4. Place `<AdSlotFooter slotId={...} />` above the site footer in
   `layout.tsx` (or a dedicated footer component).
5. Wrap the `<ConverterCalculator>` region on the homepage in
   `<NoAdsForCalculator>` — spec §9 forbids ads next to the
   calculator itself.

### 2. Publish content from the backlog

`docs/CONTENT_BACKLOG.md` has a 6-month calendar (Apr–Sep 2026),
starting with:

- **Week of Apr 20**: `chicken-tenders` food preset +
  `preheating-your-air-fryer` guide.
- **Week of Apr 27**: `shrimp` + `chicken-nuggets` food presets.

Add new foods to `src/content/foods.ts` and new guides to
`src/content/guides.ts` in the same shape as existing entries.
Content rules from spec §7 and §15 apply — original writing, link to
≥3 siblings + the calculator, no AI filler.

After adding content, bump `updatedAt` on affected entries and
request indexing in Search Console for the new URL.

### 3. Lower priority / optional

- **Third chart** — spec §12 suggests considering a third chart once
  Search Console shows the existing two pulling traffic.
- **Data refresh** — once real user data arrives via GA4, revisit the
  10 original food presets with new FAQ questions harvested from
  `site:crispcalc.com` Search Console queries.

---

## Tech stack

- **Next.js 16.2.4** (App Router, Turbopack default, React 19)
  - ⚠️ **Important:** Next.js 16 has breaking changes vs. older
    training data. Before writing any Next-specific code, read the
    relevant doc in `node_modules/next/dist/docs/`. See `AGENTS.md`.
- **React 19.2.4** — note the `set-state-in-effect` rule; use
  `useSyncExternalStore` instead of `useEffect` → `useState` for
  external data sources. The consent system in
  `src/components/site/ConsentBanner.tsx` is the reference pattern.
- **TypeScript** strict mode
- **Tailwind CSS v4** (PostCSS plugin, no config file)
- **shadcn/ui base-nova variant** (`@base-ui/react` under the hood,
  not Radix)
- **Vitest 4** for unit tests (engine math only)
- **`@next/third-parties/google`** for GA4
- **`@vercel/analytics`**, **`@vercel/speed-insights`** for Vercel
  telemetry

### Hosting & DNS

- **Vercel** (production deploys from `main` branch)
- **Cloudflare DNS-only** (no proxy, grey cloud) — apex A record
  `76.76.21.21`, `www` CNAME `cname.vercel-dns.com`

---

## Development

```bash
npm install
cp .env.example .env.local   # fill in GA + AdSense IDs if testing

npm run dev                  # http://localhost:3000
npm run build                # production build (Turbopack)
npm run typecheck            # tsc --noEmit
npm run lint                 # ESLint
npm run test                 # Vitest (converter engine only)
```

All four quality gates (`typecheck`, `lint`, `test`, `build`) must
pass before committing. Tests are ≤50ms; no test coverage gate, but
engine math changes must be covered.

### Environment variables

See `.env.example`. In Vercel production:

| Var | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://crispcalc.com` |
| `NEXT_PUBLIC_GA_ID` | `G-Z4SWCQQSSB` |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | `ca-pub-9681069917942148` |

Analytics, AdSense, and Speed Insights are all gated on
`NODE_ENV === "production"` AND the var being set, so dev + preview
builds stay script-free.

---

## Repo layout

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
│   ├── charts/               # Chart rendering primitives
│   ├── converter/            # <ConverterCalculator> + engine glue
│   ├── site/                 # ConsentBanner, TrackedLink, nav, footer
│   └── ui/                   # shadcn base-nova primitives
├── content/
│   ├── foods.ts              # 10 food presets (pure data)
│   └── guides.ts             # 5 guide documents (pure data)
└── lib/
    ├── analytics.ts          # sendGAEvent wrappers
    ├── converter.ts          # 20/20 rule engine (pure, tested)
    └── utils.ts              # cn() helper

docs/
└── CONTENT_BACKLOG.md        # Next 20 foods, 10 guides, Apr–Sep calendar

public/
└── ads.txt                   # AdSense authorized sellers record

CRISPCALC_BUILD_SPEC.md       # Canonical spec — source of truth
AGENTS.md                     # Next.js 16 breaking-changes reminder
CLAUDE.md                     # Agent instructions (re-exports AGENTS.md)
```

---

## Gotchas learned during the build

These cost real time; don't re-learn them.

### Consent storage must be a cookie, not localStorage

Spec §15 forbids `localStorage`/`sessionStorage` for user
preferences — cookies are server-readable, which matters for SSR
personalization and for Consent Mode v2 to work across navigation.
The consent value lives in a first-party cookie named
`crispcalc_consent` (`granted` | `denied`, 1-year Max-Age,
`SameSite=Lax`, `Secure`). See `ConsentBanner.tsx`.

### AdSense verification requires a literal `<script async src>` tag

`next/script`, regardless of strategy, does **not** emit a literal
`<script async src="...adsbygoogle.js">` tag in the initial HTML:

- `afterInteractive` / `lazyOnload` → injected client-side after
  hydration (crawler doesn't execute JS, can't see it).
- `beforeInteractive` → emits `<link rel="preload">` plus a
  `self.__next_s.push([...])` runtime queue. AdSense's regex-based
  crawler doesn't find the script tag pattern, verification fails
  with "Couldn't verify your site".

**Fix:** use a plain `<script async src={...} crossOrigin="anonymous" />`
JSX element. React 19 hoists async script tags to `<head>` as real
markup. See `src/components/ads/AdSenseScript.tsx`.

### The AdSense loader must not be consent-gated

Googlebot has no consent cookie. Gating the `<script>` tag itself on
consent means the verification crawler sees nothing and review
fails. **Consent Mode v2** handles GDPR at the gtag layer (default
`ad_storage: denied` + `ads_data_redaction: true`), which makes
AdSense serve non-personalized ads to users who haven't opted in.
The loader itself loads for everyone.

### React 19 strict `set-state-in-effect` rule

You can't call `setState` inside `useEffect` to mirror an external
data source. Use `useSyncExternalStore` with a `subscribe` function
that listens to a custom event. The consent system uses this pattern
and can be copied for similar client-side-state-from-DOM needs.

### Next.js 16 eslint rule is stale about `beforeInteractive`

The `@next/next/no-before-interactive-script-outside-document` rule
is from the Pages Router era. App Router requires `beforeInteractive`
scripts to live in `app/layout.tsx` (where we render them). Doesn't
apply to us anyway now that we use a plain `<script async>`, but
worth knowing if the rule flags something later.

---

## Commit conventions

Conventional Commits, lowercase scope:

- `feat(scope): ...` — new user-visible functionality
- `fix(scope): ...` — bug fix
- `chore: ...` — tooling, config, deps
- `docs: ...` — markdown-only changes

Every commit co-authored with `Claude Opus 4.6 <noreply@anthropic.com>`
(see existing history).
