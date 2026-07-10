# Active Context: Cloud Quest Arcade

## Current State

**Template Status**: ✅ Ready for development

The template has been expanded into an AWS Certified Cloud Practitioner (CLF-C02) practice quiz app branded as a retro "arcade." It is fully client-side with no backend or database.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] Original 12-question starter bank
- [x] Expanded to 40 original questions (10 per domain) with easy/medium/hard tiers
- [x] Difficulty-aware scoring multipliers (1x / 1.5x / 2x)
- [x] Difficulty filter on start screen and difficulty breakdown on results
- [x] Lightweight client-side admin panel at /admin (PIN-protected, no backend/DB)
- [x] localStorage persistence for bestScore/XP across sessions
- [x] **PWA support added**: `public/manifest.json`, `public/sw.js` (app-shell + runtime caching), `public/offline.html` fallback
- [x] **PWA icons created**: `public/icon-192x192.png` and `public/icon-512x512.png` (retro arcade invader sprite, generated procedurally)
- [x] **Service worker registration** via `src/components/ServiceWorkerRegister.tsx`, registered only in production, wired into `src/app/layout.tsx`
- [x] **Home page rebalanced**: discovery card grid (Arcade/Flashcards/Missions/Gotchas/Progress/Leaderboard) added above the `ArcadeGame`; manifest + theme color wired into layout

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/admin/page.tsx` | Client-side admin console | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ArcadeGame.tsx` | Quiz UI + game logic | ✅ Ready |
| `src/components/ServiceWorkerRegister.tsx` | Prod-only SW registration | ✅ Ready |
| `src/data/questions.ts` | 40-question bank | ✅ Ready |
| `src/lib/types.ts` | Domain types | ✅ Ready |
| `src/lib/scoring.ts` | Scoring + difficulty multipliers | ✅ Ready |
| `public/manifest.json` | PWA manifest (icons + offline) | ✅ Ready |
| `public/sw.js` | Service worker (app shell + runtime cache) | ✅ Ready |
| `public/offline.html` | Offline fallback page | ✅ Ready |
| `public/icon-192x192.png`, `public/icon-512x512.png` | Retro arcade PWA icons | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The app is functional with 40 questions and difficulty tiers, and is now installable as a PWA. The home page surfaces six learning modes (Arcade, Flashcards, Missions, Gotchas, Progress, Leaderboard) as discovery cards.

**Known gap**: The five secondary mode pages (`/flashcards`, `/missions`, `/gotchas`, `/progress`, `/leaderboard`) are linked from the home page but **do not yet exist** — they currently 404. They were intentionally out of scope for the PWA/home-page task. Next steps:
1. Build the Flashcards, Missions, Gotchas, Progress, and Leaderboard pages
2. Add SiteNav + SiteFooter shell and align navigation
3. Expand question bank toward 72 questions

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-07-09 | Expanded to AWS practitioner quiz app with 40 questions, difficulty tiers, admin panel, and localStorage persistence |
| 2026-07-10 | Added PWA (manifest, sw.js, offline.html, retro arcade icons), prod-only SW registration in layout, and rebalanced home page with discovery cards (Arcade/Flashcards/Missions/Gotchas/Progress/Leaderboard) |

## Constraints

- Minimal dependencies by default
- Framework: Next.js 16 + React 19 + Tailwind CSS 4
- Package manager: pnpm (repo default) / bun (agent default)
- Deploy target: OpenNext (AWS)
