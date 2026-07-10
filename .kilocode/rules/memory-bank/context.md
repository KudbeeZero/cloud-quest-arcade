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
- [x] CQ-008 Study Mode V1: review missed questions + "Retry Missed Only" (PR #8, merged)
- [x] CQ-009 Retry Missed keeps learned: persist mastered study ids in localStorage (`arcade_studyMastered`) and drop them from later retry sets (PR #9, in progress)

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page | ✅ Ready |
| `src/app/admin/page.tsx` | Client-side admin console | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ArcadeGame.tsx` | Quiz UI + game logic | ✅ Ready |
| `src/data/questions.ts` | 40-question bank | ✅ Ready |
| `src/lib/types.ts` | Domain types | ✅ Ready |
| `src/lib/scoring.ts` | Scoring + difficulty multipliers | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

CQ-008 Study Mode (PR #8) is **merged**. After a quiz, players can review missed
questions (their answer vs correct + explanation) and retry only the missed set.

**CQ-009 "Retry Missed — keep learned" is in progress** on branch
`feat/cq-009-retry-missed-keep-learned`, based on `main` after PR #8 merged.
When a "Retry Missed Only" session ends, questions answered correctly are added
to a persisted `masteredStudyIds` set (`localStorage` key `arcade_studyMastered`).
The next "Retry Missed Only" pass filters those out so the study set shrinks.
Scoring, HUD, bestScore/XP, and normal quizzes are unchanged. Verification
(`pnpm typecheck/lint/build`) passes.

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-07-09 | Expanded to AWS practitioner quiz app with 40 questions, difficulty tiers, admin panel, and localStorage persistence |
| 2026-07-09 | CQ-008 Study Mode: review missed questions + "Retry Missed Only" |
| 2026-07-10 | CQ-008 finalized for merge: PR #8 open, CI green, mergeable; docs handoff updated |
| 2026-07-10 | CQ-009 implemented: persist mastered study ids (`arcade_studyMastered`) and drop them from later "Retry Missed Only" sets; typecheck/lint/build pass |

## Constraints

- Minimal dependencies by default
- Framework: Next.js 16 + React 19 + Tailwind CSS 4
- Package manager: pnpm (repo default) / bun (agent default)
- Deploy target: OpenNext (AWS)
