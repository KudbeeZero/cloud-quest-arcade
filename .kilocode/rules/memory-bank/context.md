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
- [x] Flashcards mode (`/flashcards`) + Missions (daily/weekly goals)
- [x] Shared client-side progress store (`src/lib/progress.ts`): flashcards, activity, gotchas, lifetime runs
- [x] **Progress page (`/progress`)** integrating daily/weekly goals, Exam Readiness checklist, and streaks
- [x] **Exam Readiness Score** (0-100) derived from completed runs, flashcards mastered, and gotchas studied — shown compact on home and full on Progress
- [x] Quiz auto-completes the "1 run" daily goal via `recordQuizCompleted` on run finish; explanations auto-record as "gotchas studied"
- [x] Study Tips teaser on home; consistent `NavBar` across all pages

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home: quiz + compact readiness + study tips | ✅ Ready |
| `src/app/progress/page.tsx` | Study Progress: readiness, goals, checklist, streak | ✅ Ready |
| `src/app/flashcards/page.tsx` | Flashcards mode | ✅ Ready |
| `src/app/admin/page.tsx` | Client-side admin console | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ArcadeGame.tsx` | Quiz UI + game logic (records progress on finish) | ✅ Ready |
| `src/components/Flashcards.tsx` | Flashcard review + mastery | ✅ Ready |
| `src/components/Missions.tsx` | Daily/weekly study goals | ✅ Ready |
| `src/components/NavBar.tsx` | Shared bottom navigation | ✅ Ready |
| `src/components/ReadinessScore.tsx` | Exam Readiness Score widget | ✅ Ready |
| `src/components/ExamReadinessChecklist.tsx` | Readiness milestone checklist | ✅ Ready |
| `src/components/StudyTips.tsx` | Home study-tip teaser | ✅ Ready |
| `src/lib/progress.ts` | Client progress store (localStorage, useSyncExternalStore) | ✅ Ready |
| `src/data/questions.ts` | 40-question bank | ✅ Ready |
| `src/lib/types.ts` | Domain types | ✅ Ready |
| `src/lib/scoring.ts` | Scoring + difficulty multipliers | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The app is a full study arcade: quiz loop, flashcards, missions, and a Progress
page with an Exam Readiness Score and streak tracking. All state is client-side
(localStorage only). Next steps depend on user requirements:
1. Spaced-repetition scheduling for flashcards
2. Domain-level mastery breakdown on Progress
3. Optional accounts / cloud sync (out of scope for now)

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-07-09 | Expanded to AWS practitioner quiz app with 40 questions, difficulty tiers, admin panel, and localStorage persistence |
| 2026-07-10 | Study rhythm integration: Flashcards + Missions, Progress page with daily goals / readiness checklist / streaks, Exam Readiness Score, quiz→goal auto-complete, Study Tips teaser, shared NavBar |

## Constraints

- Minimal dependencies by default
- Framework: Next.js 16 + React 19 + Tailwind CSS 4
- Package manager: pnpm (repo default) / bun (agent default)
- Deploy target: OpenNext (AWS)
