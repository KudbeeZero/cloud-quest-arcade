# Active Context: Cloud Quest Arcade

## Current State

**Status**: ✅ Full-featured exam trainer with PWA installability + final polish.

Fully client-side (no backend/DB). Includes 40-question bank with difficulty tiers,
PWA installability (manifest + 192/512 PNG icons in retro arcade style + service
worker), study rhythm features on `/progress` (daily goals, streaks, exam-
readiness checklist), plus multi-page app with Flashcards, Missions, Gotchas,
Leaderboard, shared SiteNav/SiteFooter, run-history progress store, and a
deduped home page discovery grid.

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
- [x] **PWA installability**: `public/manifest.json` (standalone, portrait,
      192 + 512 PNG icons including a maskable variant), generated retro-arcade
      `public/icon-192x192.png` + `public/icon-512x512.png` (navy bg, magenta
      pixel border, yellow "CQ" glyphs) via `scripts/gen-icons.mjs`, `public/sw.js`
      (network-first navigations, cache-first static assets, app-shell precache),
      `ServiceWorkerRegister` (prod-only), manifest/theme-color/apple-touch linked
      in `layout.tsx`. Build, typecheck, and lint all green — PWA is fully
      installable.
- [x] **Home page polish**: removed duplicate bottom "Explore the arcade"
      section; the top grid (StreakCounter + 5 discovery cards) is now the
      single source of truth for home-page discovery.
- [x] **Missions Hub** (`/missions`): split into **Daily Missions** (complete
      a challenge, answer 10 Qs, 80% accuracy, practice all 4 domains) and
      **Weekly Missions** (5 runs, 50 Qs, 7-day streak, 70% weekly accuracy)
      powered by the progress store; surfaces the user's chosen `/progress`
      study-rhythm goal (auto-detected via `cq_dailyGoal` + `arcade_lastRunDate`)
      with a deep-link to tune it. Day/week boundaries captured on mount to
      stay SSR-safe.
- [x] **Exam Readiness Score** (`src/components/ReadinessScore.tsx`): extracted
      into a reusable component + hook (`useReadinessScore`). Exports
      `READINESS_TOPICS`, `computeReadinessScore`, and a `state` prop so callers
      can pass pre-computed values. Full-size gauge on `/progress`, compact
      `Link` teaser on the home page discovery grid.
- [x] **Exam Readiness Checklist** (`src/components/ExamReadinessChecklist.tsx`):
      extracted from `/progress/page.tsx` as a self-contained client component
      that reads/writes `cq_readiness` and renders the 12-topic checklist with
      progress bar. Used inside the `/progress` "Exam Readiness Checklist" card.
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
- [x] **Daily streak counter** on home page (`StreakCounter` component)
- [x] **Branch consolidation**: Merged agent_226025b8 and agent_d13a52a6 into `main`

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home: hero + streak counter + discovery cards + quiz | ✅ Updated |
| `src/app/admin/page.tsx` | PIN-protected admin console | ✅ Ready |
| `src/app/flashcards/page.tsx` | Flip flashcards | ✅ Ready |
| `src/app/missions/page.tsx` | Daily goals | ✅ Ready |
| `src/app/gotchas/page.tsx` | Exam trap scenarios | ✅ Ready |
| `src/app/progress/page.tsx` | Daily goals, readiness, streaks | ✅ New |
| `src/app/leaderboard/page.tsx` | Local top scores + share | ✅ Ready |
| `src/app/layout.tsx` | Root layout: nav, footer, manifest, SW | ✅ Updated |
| `src/components/ArcadeGame.tsx` | Quiz UI + game logic | ✅ Updated |
| `src/components/Flashcards.tsx` | Flip-card study UI | ✅ Ready |
| `src/components/Missions.tsx` | Missions Hub: daily + weekly missions + rhythm-goal tie-in | ✅ Updated |
| `src/components/SiteNav.tsx` | Global bottom nav (6 items) | ✅ Ready |
| `src/components/SiteFooter.tsx` | Site footer | ✅ New |
| `src/components/ContentShell.tsx` | Page chrome wrapper | ✅ Ready |
| `src/components/Prose.tsx` | Long-form text wrapper | ✅ Ready |
| `src/components/ServiceWorkerRegister.tsx` | SW registration (prod) | ✅ New |
| `src/components/ReadinessScore.tsx` | Reusable exam-readiness gauge + `useReadinessScore` hook + `computeReadinessScore` | ✅ Updated |
| `src/components/ExamReadinessChecklist.tsx` | Self-contained 12-topic readiness checklist (reads/writes `cq_readiness`) | ✅ New |
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
| `src/components/StreakCounter.tsx` | Daily streak display for home page | ✅ New |
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
| 2026-07-10 | Consolidated feature branches into `main`; added daily streak counter to home page |
| 2026-07-10 | Final PWA polish: confirmed retro-arcade icons, deduped home page discovery cards, validated typecheck/lint/build all pass |
| 2026-07-10 | Missions Hub: added weekly missions + study-rhythm tie-in to `/missions`; typecheck/lint/build all pass |
| 2026-07-10 | Added `ReadinessScore` component (full + compact teaser), wired into `/progress` and home; typecheck/lint/build all pass |
| 2026-07-10 | Refactored readiness logic: `ReadinessScore` now exports reusable hook/scoring/topic list, `ExamReadinessChecklist` extracted from `/progress`; typecheck/lint/build all pass |

## Constraints

- Minimal dependencies; no backend/DB (state in localStorage).
- Framework: Next.js 16 + React 19 + Tailwind CSS 4.
- Package manager: pnpm (repo default) / bun (agent default). NOTE: `bun install`
  adds a `bun.lock` and may append a `workspaces` field to `package.json` — revert
  that field change; prefer not to commit `bun.lock` while the repo uses pnpm.
- Deploy target: OpenNext (AWS).
