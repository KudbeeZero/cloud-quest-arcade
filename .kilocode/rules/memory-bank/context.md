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
- [x] **CQ-010 Flashcards:** flip-card active recall reusing the 40-question bank, "Know it"/"Still learning" rating, per-card mastery in localStorage
- [x] **CQ-010 Missions:** daily + weekly goals (quiz / flashcard review / mastery / accuracy) tracked in localStorage with a top-bar progress indicator
- [x] **CQ-010 `src/lib/progress.ts`:** shared `localStorage` store + `useProgress()` hook for flashcard mastery and daily/weekly activity

> **Note:** The CQ-010 brief assumed PR #8 (Study Mode) and PR #9 (Retry Missed)
> were merged before this lane. They were still OPEN, so CQ-010 branched from
> `main` at CQ-007 and is fully additive/compatible.

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page + Quiz/Flashcards/Missions mode switcher | ✅ CQ-010 updated |
| `src/app/admin/page.tsx` | Client-side admin console | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ArcadeGame.tsx` | Quiz UI + game logic | ✅ Ready (additive `recordQuizCompleted` hook) |
| `src/components/Flashcards.tsx` | CQ-010 flip-card UI | ✅ New |
| `src/components/Missions.tsx` | CQ-010 daily/weekly missions | ✅ New |
| `src/data/questions.ts` | 40-question bank | ✅ Ready |
| `src/lib/types.ts` | Domain types | ✅ Ready |
| `src/lib/scoring.ts` | Scoring + difficulty multipliers | ✅ Ready |
| `src/lib/progress.ts` | CQ-010 localStorage progress store | ✅ New |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

CQ-010 (Flashcards + Missions) is implemented and verified (typecheck/lint/build
all pass) on branch `feat/cq-010-flashcards-missions`. All prior quiz/study/admin
functionality is untouched. Awaiting owner merge of PRs #8/#9 before this lane's
own PR is opened if coordination is desired.

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-07-09 | Expanded to AWS practitioner quiz app with 40 questions, difficulty tiers, admin panel, and localStorage persistence |
| 2026-07-10 | CQ-010: added Flashcards + Missions (V1) with localStorage progress store, top-bar indicator, and Quiz/Flashcards/Missions mode switcher |

## Constraints

- Minimal dependencies by default (no new deps added in CQ-010)
- Framework: Next.js 16 + React 19 + Tailwind CSS 4
- Package manager: pnpm (repo default) / bun (agent default)
- Deploy target: OpenNext (AWS)
- CQ-010: frontend-only, no backend/auth/database; additive to existing quiz engine
