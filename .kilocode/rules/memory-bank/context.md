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
- [x] Core secondary pages: Flashcards, Missions, Gotchas, Progress, Leaderboard
- [x] Shared shell components (SiteNav, ContentShell, Prose) + run-history progress store

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Home page + discovery cards | ✅ Ready |
| `src/app/admin/page.tsx` | Client-side admin console | ✅ Ready |
| `src/app/flashcards/page.tsx` | Flip flashcards | ✅ Ready |
| `src/app/missions/page.tsx` | Daily goals | ✅ Ready |
| `src/app/gotchas/page.tsx` | Exam trap scenarios | ✅ Ready |
| `src/app/progress/page.tsx` | Run history + stats | ✅ Ready |
| `src/app/leaderboard/page.tsx` | Local top scores + share | ✅ Ready |
| `src/app/layout.tsx` | Root layout | ✅ Ready |
| `src/app/globals.css` | Global styles | ✅ Ready |
| `src/components/ArcadeGame.tsx` | Quiz UI + game logic | ✅ Ready |
| `src/components/Flashcards.tsx` | Flip-card study UI | ✅ Ready |
| `src/components/Missions.tsx` | Daily mission logic | ✅ Ready |
| `src/components/SiteNav.tsx` | Global bottom nav | ✅ Ready |
| `src/components/ContentShell.tsx` | Page chrome wrapper | ✅ Ready |
| `src/components/Prose.tsx` | Long-form text wrapper | ✅ Ready |
| `src/data/questions.ts` | 40-question bank | ✅ Ready |
| `src/lib/types.ts` | Domain types | ✅ Ready |
| `src/lib/scoring.ts` | Scoring + difficulty multipliers | ✅ Ready |
| `src/lib/progress.ts` | Run-history store + domain accuracy | ✅ Ready |
| `src/lib/useProgress.ts` | Client hook over progress store | ✅ Ready |
| `src/lib/domains.ts` | Shared DOMAIN_ORDER / DOMAIN_BADGE | ✅ Ready |
| `.kilocode/` | AI context & recipes | ✅ Ready |

## Current Focus

The app is functional with 40 questions and difficulty tiers. Next steps depend on user requirements:
1. More question expansions
2. Additional admin features
3. Further UI/UX refinements

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-07-09 | Expanded to AWS practitioner quiz app with 40 questions, difficulty tiers, admin panel, and localStorage persistence |
| 2026-07-10 | Added Flashcards, Missions, Gotchas (10 traps), Progress, and Leaderboard pages; shared SiteNav/ContentShell/Prose shell; run-history progress store wired into ArcadeGame |

## Constraints

- Minimal dependencies by default
- Framework: Next.js 16 + React 19 + Tailwind CSS 4
- Package manager: pnpm (repo default) / bun (agent default)
- Deploy target: OpenNext (AWS)
