# HANDOFF — Cloud Quest Arcade

This document is the source of truth for agents picking up work on this
repository. Read it before assuming anything about the stack or scope.

## Current repo status

- **Repo:** `KudbeeZero/cloud-quest-arcade`
- **Live branch for active work:** `feat/arcade-learning-foundation`
- **Package manager:** `pnpm` (lockfile: `pnpm-lock.yaml`; `bun.lock` removed)
- **State:** Front-end only, fully client-side, no server runtime.

## PR #1 status

- **PR:** #1 "feat: create arcade AWS practitioner trainer foundation"
- **State:** OPEN
- **Base:** `main` ← **Head:** `feat/arcade-learning-foundation`
- **Mergeable:** yes (verify with `gh pr view 1` before pushing)
- **CI:** GitHub Actions added (`.github/workflows/ci.yml`)
- **Dependabot:** enabled (`.github/dependabot.yml`, weekly, npm, minor/patch grouped)

> All changes for this lane land on PR #1 only. Do NOT open a second PR.

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
- Original sample questions (40) across the four CLF-C02 domains
- Arcade scoring: base + streak bonus + speed bonus (see `src/lib/scoring.ts`)
- Accuracy-based rank, instant explanations
- Difficulty tiers + filter (easy/medium/hard)
- Flashcards mode (`/flashcards`): flip/review, mastery tracking
- Missions: daily/weekly study goals (`src/components/Missions.tsx`)
- Progress page (`/progress`): Exam Readiness Score, daily/weekly goals,
  readiness checklist, and study streaks
- Shared client-side progress store (`src/lib/progress.ts`, localStorage +
  `useSyncExternalStore`) tracking flashcards, daily activity, "gotchas"
  studied, and lifetime quiz runs
- The quiz auto-completes the "1 run" daily goal via `recordQuizCompleted`,
  and each revealed explanation is recorded as a "gotcha studied"

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
