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
- [x] **Agent Hub** (`/agent-hub`): Lightning AI agent dashboard stub with
      status cards for GrowPod Monitor, Study Coach, HERMES, AWS Exam Coach,
      and Readiness Sync. Includes "Trigger Audit" (GrowPod economy check) and
      "Generate New Gotchas" stub buttons. Uses `useReadinessScore` to mirror
      the local score. UI-only stubs; backend wiring not yet implemented.
- [x] **Study Dashboard** (`/dashboard`): lightweight command center with
      readiness score, daily streak, runs-today stat cards, quick links to
      Flashcards/Missions/Gotchas, and a **DeepSeek-powered "Generate New
      Gotchas"** button. Calls `/api/deepseek/gotchas`, which proxies to the
      DeepSeek API (`deepseek-chat`) with a JSON prompt and displays the
      returned gotchas in an expandable list. Requires `DEEPSEEK_API_KEY` in
      `.env.local`.
- [x] **DeepSeek API proxy** (`src/app/api/deepseek/gotchas/route.ts`): thin
      server-side route that keeps the API key out of the client, validates the
      response shape, and returns an array of `{id,domain,trap,why}` gotchas.
      `.env.example` included for local setup.
- [x] **Exam Readiness Score** (`src/components/ReadinessScore.tsx`): extracted
      into a reusable component + hook (`useReadinessScore`). Exports
      `READINESS_TOPICS`, `computeReadinessScore`, and a `state` prop so callers
      can pass pre-computed values. Full-size gauge on `/progress`, compact
      `Link` teaser on the home page discovery grid.
- [x] **Lightning AI Study Agent** (`agents/study_agent.py`): self-contained
      Python stub for generating CLF-C02 multiple-choice questions. Supports an
      OpenAI-compatible endpoint (DeepSeek by default) with env vars
      `STUDY_AGENT_API_KEY`, `STUDY_AGENT_BASE_URL`, `STUDY_AGENT_MODEL`.
      Falls back to a stub payload when no key is set. Includes `agents/README.md`
      with setup and usage notes.
- [x] **Agent API route** (`src/app/api/agents/study/route.ts`): dashboard-facing
      stub that returns the same question shape as `agents/study_agent.py` so
      the UI can be exercised without runtime Python.
- [x] **Dashboard button**: added a "⚡ Run Lightning AI Agent" button to
      `/dashboard` that calls `/api/agents/study` and renders returned
      questions with options, correct answer, and explanation.
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
| `src/app/agent-hub/page.tsx` | Lightning AI agent dashboard route | ✅ New |
| `src/components/AgentHub.tsx` | Agent status cards + stub action buttons | ✅ New |
| `src/app/dashboard/page.tsx` | Study Dashboard route | ✅ New |
| `src/app/api/deepseek/gotchas/route.ts` | DeepSeek API proxy for generating CLF-C02 gotchas | ✅ New |
| `.env.example` | DeepSeek API key placeholder | ✅ New |
| `src/components/StudyTips.tsx` | Contextual study advice | ✅ Ready |
| `src/data/questions.ts` | 40-question bank | ✅ Ready |
| `src/lib/types.ts` | Domain types | ✅ Ready |
| `src/lib/scoring.ts` | Scoring + difficulty multipliers | ✅ Ready |
| `src/lib/clock.ts` | Monotonic time helper | ✅ Ready |
| `src/lib/progress.ts` | Run-history store + domain accuracy | ✅ Ready |
| `src/lib/useProgress.ts` | Client hook over progress store | ✅ Ready |
| `src/lib/domains.ts` | Shared DOMAIN_ORDER / DOMAIN_BADGE | ✅ Ready |
| `agents/study_agent.py` | Lightning AI Study Agent stub for CLF-C02 question generation | ✅ New |
| `agents/README.md` | Study agent setup and usage notes | ✅ New |
| `src/app/api/agents/study/route.ts` | Dashboard-facing stub for the Lightning AI Study Agent | ✅ New |
| `src/lib/streak.ts` | Streak blockchain hook stub (`useStreakChain`) for future Algorand integration | ✅ New |
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
| 2026-07-10 | Added `/agent-hub` (Lightning AI agent dashboard) and `/dashboard` (Study Dashboard) with stub action buttons; typecheck/lint/build all pass |
| 2026-07-10 | Wired Dashboard "Generate New Gotchas" button to DeepSeek via `/api/deepseek/gotchas`; displays returned gotchas; typecheck/lint/build all pass |
| 2026-07-10 | Added `src/lib/streak.ts` blockchain hook stub, integrated into `/progress` and `/dashboard`; typecheck/lint/build all pass |
| 2026-07-10 | Added Lightning AI Study Agent stub (`agents/study_agent.py`), dashboard API route, and "Run Lightning AI Agent" button; typecheck/lint/build all pass |

## Constraints

- Minimal dependencies; no backend/DB (state in localStorage).
- Framework: Next.js 16 + React 19 + Tailwind CSS 4.
- Package manager: pnpm (repo default) / bun (agent default). NOTE: `bun install`
  adds a `bun.lock` and may append a `workspaces` field to `package.json` — revert
  that field change; prefer not to commit `bun.lock` while the repo uses pnpm.
- Deploy target: OpenNext (AWS).
