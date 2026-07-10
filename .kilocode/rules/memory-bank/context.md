# Active Context: Cloud Quest Arcade

## Current State

**Status**: ✅ Full-featured exam trainer with PWA support.

Fully client-side (no backend/DB). Includes 40-question bank with difficulty tiers,
PWA installability (manifest + icons + service worker), study rhythm features on
`/progress` (daily goals, streaks, exam-readiness checklist), plus multi-page app
with Flashcards, Missions, Gotchas, Leaderboard, shared SiteNav/SiteFooter, and
run-history progress store.

> **Working Notes for future agents**: Build new features against the *actual*
> files below. The app is a multi-page arcade trainer with 40 questions (not 72
> yet). PWA + study rhythm features are the most recent additions on top of the
> shared shell + progress store.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript strict + Tailwind CSS 4 + ESLint
- [x] Memory bank + recipe system
- [x] 40-question bank (10/domain), difficulty tiers, scoring multipliers
- [x] PIN-protected `/admin` console, localStorage best-score/XP persistence
- [x] **PWA installability**: `public/manifest.json`, generated `public/icon-192x192.png`
      + `public/icon-512x512.png`, `public/sw.js`, `ServiceWorkerRegister` (prod-only),
      manifest/theme-color/apple-touch linked in `layout.tsx`.
- [x] **Study rhythm features** on `/progress`: daily goal tracker (3 presets,
      auto-credit when a run is logged), consecutive-day streak, 12-topic
      "Exam Readiness" checklist, blended "Cert Progress" bar. State in localStorage
      (`cq_dailyGoal`, `cq_readiness`); helpers in `src/lib/study.ts`.
- [x] **Shared chrome**: `SiteNav` (Home/Flashcards/Missions/Gotchas/Progress/Leaderboard)
      + `SiteFooter` wired into `layout.tsx`; home page discovery cards link to new
      sections. `ArcadeGame` stamps `arcade_lastRunDate` on run completion.
- [x] **Core secondary pages**: Flashcards, Missions, Gotchas, Progress, Leaderboard
- [x] **Shared shell components**: SiteNav, ContentShell, Prose
- [x] **Run-history progress store**: `src/lib/progress.ts`, `useProgress.ts`, `domains.ts`

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home: hero + discovery cards + quiz | ✅ Ready |
| `src/app/admin/page.tsx` | PIN-protected admin console | ✅ Ready |
| `src/app/flashcards/page.tsx` | Flip flashcards | ✅ Ready |
| `src/app/missions/page.tsx` | Daily goals | ✅ Ready |
| `src/app/gotchas/page.tsx` | Exam trap scenarios | ✅ Ready |
| `src/app/progress/page.tsx` | Daily goals, readiness, streaks | ✅ New |
| `src/app/leaderboard/page.tsx` | Local top scores + share | ✅ Ready |
| `src/app/layout.tsx` | Root layout: nav, footer, manifest, SW | ✅ Updated |
| `src/components/ArcadeGame.tsx` | Quiz UI + game logic | ✅ Updated |
| `src/components/Flashcards.tsx` | Flip-card study UI | ✅ Ready |
| `src/components/Missions.tsx` | Daily mission logic | ✅ Ready |
| `src/components/SiteNav.tsx` | Global bottom nav (6 items) | ✅ Ready |
| `src/components/SiteFooter.tsx` | Site footer | ✅ New |
| `src/components/ContentShell.tsx` | Page chrome wrapper | ✅ Ready |
| `src/components/Prose.tsx` | Long-form text wrapper | ✅ Ready |
| `src/components/ServiceWorkerRegister.tsx` | SW registration (prod) | ✅ New |
| `src/components/ReadinessScore.tsx` | Exam readiness visualization | ✅ Ready |
| `src/components/ExamReadinessChecklist.tsx` | Milestone checklist | ✅ Ready |
| `src/components/StudyTips.tsx` | Contextual study advice | ✅ Ready |
| `src/data/questions.ts` | 40-question bank | ✅ Ready |
| `src/lib/types.ts` | Domain types | ✅ Ready |
| `src/lib/scoring.ts` | Scoring + difficulty multipliers | ✅ Ready |
| `src/lib/clock.ts` | Monotonic time helper | ✅ Ready |
| `src/lib/progress.ts` | Run-history store + domain accuracy | ✅ Ready |
| `src/lib/useProgress.ts` | Client hook over progress store | ✅ Ready |
| `src/lib/domains.ts` | Shared DOMAIN_ORDER / DOMAIN_BADGE | ✅ Ready |
| `src/lib/study.ts` | Date/streak/goal helpers | ✅ New |
| `public/` | PWA manifest, service worker, icons | ✅ New |
| `scripts/gen-icons.mjs` | PNG icon generator | ✅ New |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

PWA + rhythm features + multi-page shell shipped. Possible next steps:
1. Expand question bank beyond 40.
2. Further UI/UX refinements (animations, sounds, themes).
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
| 2026-07-10 | Added Flashcards, Missions, Gotchas, Progress, Leaderboard pages; shared SiteNav/ContentShell/Prose shell; run-history progress store wired into ArcadeGame |
| 2026-07-10 | PWA installability (icons/manifest/SW) + `/progress` study rhythm features (daily goals, streaks, readiness checklist) + SiteFooter + study helpers |

## Constraints

- Minimal dependencies; no backend/DB (state in localStorage).
- Framework: Next.js 16 + React 19 + Tailwind CSS 4.
- Package manager: pnpm (repo default) / bun (agent default). NOTE: `bun install`
  adds a `bun.lock` and may append a `workspaces` field to `package.json` — revert
  that field change; prefer not to commit `bun.lock` while the repo uses pnpm.
- Deploy target: OpenNext (AWS).
