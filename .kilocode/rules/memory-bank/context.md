# Active Context: Cloud Quest Arcade

## Current State

**Status**: ✅ Full-featured exam trainer with PWA support. Deployed and verified.

Fully client-side (no backend/DB). Includes 40-question bank with difficulty tiers,
PWA installability (manifest + icons + service worker), study rhythm features on
`/progress` (daily goals, streaks, exam-readiness checklist), plus multi-page app
with Flashcards, Missions, Gotchas, Leaderboard, shared SiteNav/SiteFooter, and
run-history progress store. ArcadeGame now supports **mid-test save/resume**
(closes-the-tab safe via `arcade_savedRun` localStorage slot) and a **mid-run
shuffle button** (re-randomizes the remaining upcoming questions).

> **Working Notes for future agents**: Build new features against the *actual*
> files below. The app is a multi-page arcade trainer with 40 questions (not 72
> yet). PWA + study rhythm features are the most recent additions on top of the
> shared shell + progress store. **Global navigation lives in the root layout
> (`SiteNav` in `src/app/layout.tsx`); do not add a second `SiteNav` inside
> individual pages.** **useSyncExternalStore rule**: `getSnapshot` MUST return
> a referentially-stable value on unchanged data (primitives, or memoized
> refs). Returning a fresh object/array from JSON.parse on every call causes
> an infinite render loop ("Maximum update depth exceeded") and a blank page.
> For localStorage-backed state, return the raw stored string and parse it
> when deriving values in the render body.

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
- [x] **Daily streak counter** on home page (`StreakCounter` component)
- [x] **Branch consolidation**: Merged agent_226025b8 and agent_d13a52a6 into `main`
- [x] **Homepage diagnostic + fix**: removed duplicate `<SiteNav />` and duplicate
      "Explore the arcade" discovery block from `src/app/page.tsx` (the layout
      already owns global nav). Converted `ArcadeGame`'s `arcade_bestScore`
      localStorage read from `useEffect`+`setState` to `useSyncExternalStore`
      with a same-tab custom event — eliminates the
      `react-hooks/set-state-in-effect` lint error and unblocks CI.
- [x] **Blank-page root cause fix**: `StreakCounter` `useSyncExternalStore`
      `getSnapshot` returned a fresh array ref on every call → infinite render
      loop → React bailed out ("Maximum update depth exceeded") → blank page.
      Now returns raw localStorage string (stable primitive); parsing deferred
      to render. Merged as `cadf6f3`.
- [x] **Mid-test save/resume**: `src/lib/progress.ts` adds a `SavedRun` slot
      (`arcade_savedRun` localStorage key) with `loadSavedRun` / `saveRun` /
      `clearSavedRun` + a `useSyncExternalStore`-friendly raw-string
      subscription. `src/lib/useProgress.ts` adds a `useSavedRun()` hook.
      `ArcadeGame` persists the active run (order, current, answers, score,
      streak, difficulty, questionStartedAt) on every relevant state change
      while `phase === "playing"`, and shows a "Resume / Discard" card on
      the start screen when a matching saved run exists. The original
      `questionStart` is preserved across resumes so the speed bonus doesn't
      reset on tab close/reopen. `startGame()` and the final branch of
      `next()` explicitly clear the slot. The persist `useEffect` is
      deliberately a pure writer (no auto-clear) so the saved run survives
      remount while waiting for the user to click Resume.
- [x] **Shuffle button**: small `🔀 Shuffle` button in the playing header
      reshuffles the tail of the current `order` (everything after the
      current question), preserving the active question and already-answered
      ones. Disabled when fewer than 2 questions remain.

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
| 2026-07-11 | Homepage diagnostic + fix: removed duplicate `SiteNav` and duplicate discovery block from `page.tsx`; migrated `ArcadeGame` best-score read to `useSyncExternalStore` to clear `react-hooks/set-state-in-effect` lint error. `bun typecheck` / `bun lint` / `bun build` all pass (10/10 static pages). |
| 2026-07-11 | Merged session branch into `main` with `--no-ff` (merge commit `f4711e4`) and pushed to `origin/main`. Re-verified `bun typecheck` / `bun lint` / `bun build` on `main` post-merge — all pass. Deploy pipeline (OpenNext) will pick up the fix from the new `main` HEAD. |
| 2026-07-11 | **Root cause of blank deployed homepage** found and fixed: `StreakCounter`'s `useSyncExternalStore` `getSnapshot` returned `getGoal().completedDates` — a fresh array reference every call. `Object.is` comparison in React saw every read as "changed" → infinite render loop → "Maximum update depth exceeded" → tree unmounted → blank page. Fix: `readGoalRaw()` returns the raw localStorage *string* (stable primitive); parsing happens when deriving the streak. Merged into `main` (`cadf6f3`) and pushed. |
| 2026-07-11 | **Mid-test save/resume + shuffle button** added to `ArcadeGame`. New `SavedRun` store (`arcade_savedRun`) persists order, current question, answers, score, streak, difficulty, and original `questionStart` so speed bonus is preserved across resumes. `useSyncExternalStore` snapshot returns the raw localStorage string (stable primitive) — follows the rule above. Start screen shows a "Resume / Discard" card when a matching saved run exists. "🔀 Shuffle" button in the playing header reshuffles remaining questions. `bun typecheck` / `bun lint` / `bun build` all pass. Changes uncommitted on `session/agent_f5bba937...` awaiting review/commit. |

## Constraints

- Minimal dependencies; no backend/DB (state in localStorage).
- Framework: Next.js 16 + React 19 + Tailwind CSS 4.
- Package manager: pnpm (repo default) / bun (agent default). NOTE: `bun install`
  adds a `bun.lock` and may append a `workspaces` field to `package.json` — revert
  that field change; prefer not to commit `bun.lock` while the repo uses pnpm.
- Deploy target: OpenNext (AWS).
