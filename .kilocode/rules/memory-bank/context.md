# Active Context: Cloud Quest Arcade

## Current State

**Template Status**: ✅ Actively developed — professional buildout in progress.

Cloud Quest Arcade is a client-side retro "arcade" quiz app for the AWS
Certified Cloud Practitioner (CLF-C02) exam. As of July 2026 it has a strong
foundation plus a first pass at trust/SEO/content pages. No backend, database,
accounts, or analytics — everything is local-first (localStorage). No leaderboard,
progress dashboard, PWA, or 70-question bank exist in this repo yet (those were
described in upstream planning but are not present here).

## Recently Completed

- [x] Base Next.js 16 + React 19 + Tailwind CSS 4 setup (App Router, strict TS)
- [x] 40 original CLF-C02 questions (10/domain), easy/medium/hard tiers
- [x] Difficulty-aware scoring (1x / 1.5x / 2x) + streak/speed bonuses
- [x] PIN-protected client-side `/admin` console (no backend/DB)
- [x] localStorage persistence for bestScore/XP + difficulty filter
- [x] **Legal pages**: `/privacy`, `/terms`, `/disclaimer` (local-first data, not affiliated with AWS, no exam-success guarantee)
- [x] **Content pages**: `/study-tips`, `/domain-guide` (4 CLF-C02 domains + weightings), `/resources` (curated free official + community links)
- [x] **Navigation & footer**: `SiteNav` (top, active-link aware) + `SiteFooter` (legal + study + play links, AWS trademark disclaimer)
- [x] **SEO/Trust polish**: root `metadata` with `metadataBase` + title template + keywords + OpenGraph/Twitter; per-page `metadata` (title/description/canonical); JSON-LD on content + legal pages; shared `ContentShell` + `Prose` for consistent retro-arcade typography
- [x] Replaced placeholder in-game bottom nav with functional `ArcadeNav` (Home / Domains / Tips / Legal)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/lib/site.ts` | Central site config (name, url, nav, legal links) | ✅ New |
| `src/components/SiteNav.tsx` | Sticky top nav (client, active link) | ✅ New |
| `src/components/SiteFooter.tsx` | Site-wide footer | ✅ New |
| `src/components/ArcadeNav.tsx` | In-game bottom nav | ✅ New |
| `src/components/ContentShell.tsx` | Shared content-page layout + CTA | ✅ New |
| `src/components/Prose.tsx` | Consistent long-form typography | ✅ New |
| `src/components/JsonLd.tsx` | JSON-LD structured-data helper | ✅ New |
| `src/app/layout.tsx` | Root layout: nav + footer + metadata | ✅ Updated |
| `src/app/page.tsx` | Home (arcade) | ✅ Updated (removed dup footer) |
| `src/app/privacy/page.tsx` | Privacy Policy | ✅ New |
| `src/app/terms/page.tsx` | Terms of Use | ✅ New |
| `src/app/disclaimer/page.tsx` | Disclaimer | ✅ New |
| `src/app/study-tips/page.tsx` | Study strategies | ✅ New |
| `src/app/domain-guide/page.tsx` | 4 CLF-C02 domains | ✅ New |
| `src/app/resources/page.tsx` | Curated links | ✅ New |
| `src/components/ArcadeGame.tsx` | Quiz UI + game logic | ✅ Updated (ArcadeNav) |
| `src/data/questions.ts` | 40-question bank | ✅ Ready |
| `src/lib/types.ts` | Domain/scoring types | ✅ Ready |
| `src/lib/scoring.ts` | Scoring + difficulty multipliers | ✅ Ready |

## Professional Website Buildout Research (July 2026)

Notes from the broader "professional + trustworthy production" lift:

- **Trust > features.** Legal/readability pages and a real footer materially
  increase perceived legitimacy for an exam-prep product. Keep the "not
  affiliated with AWS" disclaimer prominent and consistent everywhere.
- **localStorage-only is a strong privacy story** — lead with it in /privacy.
- **SEO basics that paid off:** `metadataBase` + title template, per-page
  canonical, and JSON-LD (`Article` for content, `WebPage` for legal). No extra
  deps needed.
- **Design system reuse:** `ContentShell` + `Prose` (Tailwind arbitrary
  descendant variants) kept new pages on-brand without a typography plugin.
- **Friction:** Task brief assumed a leaderboard/PWA/70-question state that does
  not exist in this repo — built against the actual 40-question foundation
  instead. External resource URLs must be real/confident before linking.

## Current Focus

Solidify the professional foundation. Candidate next steps:
1. Expand question bank toward 70 (per upstream plan).
2. Add Progress Dashboard + Leaderboard + share (would unlock the "integration"
   bullet from the buildout brief that is currently partial).
3. PWA / offline support.
4. i18n + deeper accessibility pass.

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-07-09 | Expanded to AWS practitioner quiz app: 40 questions, difficulty tiers, admin, localStorage |
| 2026-07-10 | Legal + content pages, SiteNav/SiteFooter, SEO metadata + JSON-LD, professional nav/footer, consistent typography |

## Constraints

- Minimal dependencies by default (no typography/SEO libraries added).
- Framework: Next.js 16 + React 19 + Tailwind CSS 4.
- Package manager: bun (agent default); repo also has pnpm-lock.
- Fully client-side; no backend/DB/accounts/analytics.
- Deploy target: OpenNext (AWS).
