# Active Context: Cloud Quest Arcade

## Current State

**Status**: ✅ Functional client-side PWA — AWS Certified Cloud Practitioner (CLF-C02) retro arcade trainer.

Fully client-side (no backend/DB). Recent work added real PWA installability
(manifest + generated icons + service worker) and the first "study rhythm"
features (daily goal tracker, exam-readiness checklist, streaks, cert progress)
on a new `/progress` page, plus a shared `SiteNav`/`SiteFooter`.

> **Working Notes for future agents**: The codebase is the starter template
> expanded into the quiz app — it is NOT yet the multi-page app described in
> some hand-offs (no Flashcards/Missions/Gotchas/Leaderboard pages, 40 questions
> not 72). Build new features against the *actual* files below, not assumptions.
> PWA + rhythm features are the most recent additions.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript strict + Tailwind CSS 4 + ESLint
- [x] Memory bank + recipe system
- [x] 40-question bank (10/domain), difficulty tiers, scoring multipliers
- [x] PIN-protected `/admin` console, localStorage best-score/XP persistence
- [x] **PWA installability**: `public/manifest.json`, generated `public/icon-192x192.png`
      + `public/icon-512x512.png` (retro "CQ" monogram, pure-JS PNG encoder at
      `scripts/gen-icons.mjs`), `public/sw.js` (network-first nav, cache-first
      assets), `ServiceWorkerRegister` (prod-only), manifest/theme-color/apple-touch
      linked in `layout.tsx`. Verified: valid PNGs (192/512), build serves manifest.
- [x] **Study rhythm features** on `/progress`: daily goal tracker (3 presets,
      auto-credit when a run is logged), consecutive-day streak, 12-topic
      "Exam Readiness" checklist, blended "Cert Progress" bar. State in localStorage
      (`cq_dailyGoal`, `cq_readiness`); helpers in `src/lib/study.ts`.
- [x] **Shared chrome**: `SiteNav` (Home/Progress/Admin) + `SiteFooter` wired into
      `layout.tsx`; home page discovery cards link to new sections; removed the
      dead fake bottom-nav from `ArcadeGame`. `ArcadeGame` now stamps
      `arcade_lastRunDate` on run completion (feeds the daily goal).

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home: hero + discovery cards + quiz | ✅ Updated |
| `src/app/progress/page.tsx` | Daily goals, readiness, streaks | ✅ New |
| `src/app/admin/page.tsx` | PIN-protected question bank stats | ✅ Ready |
| `src/app/layout.tsx` | Root layout: nav, footer, manifest, SW | ✅ Updated |
| `src/components/ArcadeGame.tsx` | Quiz UI + game logic | ✅ Updated |
| `src/components/SiteNav.tsx` | Top navigation | ✅ New |
| `src/components/SiteFooter.tsx` | Site footer | ✅ New |
| `src/components/ServiceWorkerRegister.tsx` | SW registration (prod) | ✅ New |
| `src/lib/study.ts` | Date/streak/goal helpers | ✅ New |
| `src/data/questions.ts` | 40-question bank | ✅ Ready |
| `public/manifest.json`, `icon-*.png`, `sw.js` | PWA assets | ✅ New |
| `scripts/gen-icons.mjs` | PNG icon generator | ✅ New |

## Current Focus

PWA + rhythm features shipped. Possible next steps:
1. Expand question bank toward 72 (more per domain).
2. Build the remaining described pages (Flashcards, Missions, Gotchas, Leaderboard).
3. Offline-first polish / periodic SW cache updates.

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-07-09 | Expanded to AWS practitioner quiz app (40 Qs, difficulty, admin, localStorage) |
| 2026-07-10 | PWA installability (icons/manifest/SW) + `/progress` study rhythm features + shared nav/footer |

## Constraints

- Minimal dependencies; no backend/DB (state in localStorage).
- Framework: Next.js 16 + React 19 + Tailwind CSS 4.
- Package manager: pnpm (repo default) / bun (agent default). NOTE: `bun install`
  adds a `bun.lock` and may append a `workspaces` field to `package.json` — revert
  that field change; prefer not to commit `bun.lock` while the repo uses pnpm.
- Deploy target: OpenNext (AWS).
