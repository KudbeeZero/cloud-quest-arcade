# HANDOFF — Cloud Quest Arcade

This document is the source of truth for agents picking up work on this
repository. Read it before assuming anything about the stack or scope.

## Current repo status

- **Repo:** `KudbeeZero/cloud-quest-arcade`
- **Package manager:** `pnpm` (lockfile: `pnpm-lock.yaml`; `bun.lock` removed)
- **State:** Front-end only, fully client-side, no server runtime.
- **`main` HEAD:** CQ-007 — 40 questions, difficulty tiers, admin panel, localStorage best-score/XP.

### Lane / PR history (as of 2026-07-10)

| Lane | PR | Status | Notes |
|------|----|--------|-------|
| CQ-001 foundation | #1 | merged | base template |
| CQ-007 question bank + admin | #7 | merged | current `main` |
| CQ-008 Study Mode | #8 | OPEN (not merged) | branch `feat/study-mode-results-review` |
| CQ-009 Retry Missed / keep learned | #9 | OPEN (not merged) | branch `feat/cq-009-retry-missed-keep-learned` |
| CQ-006 Player Progress | #6 | OPEN (not merged) | branch `feat/player-progress-v1` |
| **CQ-010 Flashcards & Missions V1** | (this lane) | branch `feat/cq-010-flashcards-missions` | built on `main` (CQ-007) — see note below |

> **CQ-010 build note:** The CQ-010 brief assumed PR #8 (Study Mode) and
> PR #9 (Retry Missed) were merged into `main` before this lane started.
> At implementation time they were still OPEN, so CQ-010 was branched from
> `main` at CQ-007 and does NOT depend on Study Mode / Retry Missed. When
> those PRs merge, CQ-010 features remain additive and compatible.

## Actual stack

- **Framework:** Next.js (App Router)
- **UI:** React 19
- **Language:** TypeScript 5.9+
- **Styling:** Tailwind CSS v4 (PostCSS plugin)
- **Tooling:** pnpm, ESLint (`eslint-config-next`), `tsc --noEmit`
- **Node:** 22 (CI uses Node 22)

Do not rewrite this to Vite. Do not re-add `bun` unless the owner explicitly
asks. The repo ground truth is a Next.js template, not Vite.

## Product

**Cloud Quest Arcade** — a retro/arcade-flavored practice app for the
**AWS Certified Cloud Practitioner (CLF-C02)** exam. Short, gamified quiz
sessions with streak + speed scoring and instant explanations.

Reference docs:
- `README.md` — quick start and project structure
- `docs/PRODUCT_SPEC.md` — vision, scope, scoring model, roadmap

## Safety rules (hard)

- **Not affiliated with, endorsed by, or sponsored by Amazon Web Services.**
- **Original practice questions only.** No official or third-party exam
  questions are reproduced, copied, paraphrased-from-source, or screenshotted.
- The Dunkin "rewards dashboard" reference is **structure inspiration only**
  (XP bar, badges, challenge CTA). Do not copy Dunkin branding, colors,
  fonts, logos, text, or product imagery. Cloud Quest Arcade has its own
  original "cloud command center / arcade neon" look.

## Current scope

In scope (front-end only):

- Quiz loop: start → play → results → replay
- Original sample questions (40, 10 per domain) across the four CLF-C02 domains
- Arcade scoring: base + streak bonus + speed bonus (see `src/lib/scoring.ts`)
- Accuracy-based rank, instant explanations
- Difficulty tiers (easy/medium/hard) + difficulty filter on start screen
- localStorage persistence for bestScore/XP
- **Flashcards (CQ-010):** active-recall flip cards reusing the question bank;
  "Know it" / "Still learning" rating; per-card mastery tracked in localStorage.
- **Missions (CQ-010):** daily + weekly goals (quiz, flashcard review, mastery,
  accuracy) tracked in localStorage; progress indicator in the top bar.

### CQ-010 — Learning Missions & Flashcards V1

- **Branch:** `feat/cq-010-flashcards-missions` (from `main` / CQ-007)
- **Mode switcher:** `src/app/page.tsx` now switches between Quiz / Flashcards /
  Missions and shows a compact Daily/Weekly mission indicator under the title.
- **New files:**
  - `src/lib/progress.ts` — `localStorage` store (flashcard mastery + daily/weekly
    activity) with a `useProgress()` hook and cross-component sync via a custom event.
  - `src/components/Flashcards.tsx` — flip-card UI; writes mastery + review counts.
  - `src/components/Missions.tsx` — daily/weekly mission lists with progress bars.
- **Touched (additive, non-behavioral):** `src/components/ArcadeGame.tsx` now calls
  `recordQuizCompleted(accuracy)` once when a run finishes (no UI/logic change).
- **Out of scope for CQ-010:** spaced-repetition algorithm, real notifications/
  streaks, question-creation UI, core quiz-engine changes.
- **Verification:** `pnpm run typecheck && pnpm run lint && pnpm run build` all pass.
- **Owner action:** update the FigJam board (`FWgyTpkA1K7HD5VBcx4aH`) — new CQ-010
  lane status + merge owner. No code action needed.

Explicitly out of scope — do NOT add:

- Backend / server-side logic
- Authentication / user accounts / profiles
- Database or persistence beyond in-memory + (future) `localStorage`
- Payments / monetization
- AI-generated questions
- Live AWS API integration
- Copied official exam content

## Next lanes (ideas, not commitments)

1. **CI / deploy preview** — wire CI to a preview deploy (e.g. Vercel preview).
2. **Larger question bank** — more original items per domain, difficulty tiers.
3. **Timed "blitz" mode** — countdown arcade mode with survival scoring.
4. **Domain progress** — per-domain accuracy and mastery tracking.
5. **Local high-score persistence** — `localStorage` best score / streak.
6. **Accessibility pass** — keyboard nav, screen-reader labels, focus states.
7. **Review mode** — revisit questions answered incorrectly.

## Agent workflow notes

- **Inspect the repo before assuming the stack.** Verify `package.json`,
  lockfile, and existing files. Do not trust a mission brief over ground truth.
- **Commit after verified chunks.** Run `pnpm run build && pnpm run typecheck
  && pnpm run lint` before committing.
- **Update PR #1 only.** Never open a second PR for the same lane.
- **Keep changes small and reviewable.** One logical change per commit message.
- After meaningful changes, update this HANDOFF and `docs/` as needed.
