# HANDOFF — Cloud Quest Arcade

This document is the source of truth for agents picking up work on this
repository. Read it before assuming anything about the stack or scope.

## Current repo status

- **Repo:** `KudbeeZero/cloud-quest-arcade`
- **Live branch for active work:** `feat/cq-009-retry-missed-keep-learned`
- **Package manager:** `pnpm` (lockfile: `pnpm-lock.yaml`; `bun.lock` removed)
- **State:** Front-end only, fully client-side, no server runtime.

## Merged lanes (history)

- **PR #1** "feat: create arcade AWS practitioner trainer foundation" — MERGED.
- **PR #7** "feat: expand question bank and progress UI" — MERGED. Added 40
  original questions (10/domain), difficulty tiers + scoring multipliers,
  difficulty filter/HUD/results breakdown, `/admin` demo review page, and
  `localStorage` bestScore/XP. next + eslint-config-next pinned at 16.2.6.
- **PR #8** "feat(CQ-008): study mode — review missed and retry only missed"
  — MERGED. After results, "Review Missed Questions" opens Study Mode (player's
  answer + correct answer + explanation per missed question) and "Retry Missed
  Only" starts a session using just those questions.

## Active lane: CQ-009 Retry Missed — keep learned — IN PROGRESS

- **PR:** #9 (target) "feat(CQ-009): retry missed keeps learned questions"
- **State:** Implemented on `feat/cq-009-retry-missed-keep-learned`, based on
  `main` after PR #8 merged. Awaiting owner review/merge.
- **Scope (frontend only):** After a "Retry Missed Only" session ends, remember
  which missed questions the player now answered correctly and persist them in
  `localStorage` (key `arcade_studyMastered`). On the next "Retry Missed Only"
  pass, automatically drop those mastered questions from the study set so the
  list shrinks over time. Reuses the existing session-set engine; Study Mode and
  normal quizzes unchanged.
- **Out of scope:** backend/auth/DB/CMS, server progress, real exam content,
  new question creation, changes to normal (non-study) quizzes.

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
- 40 original questions (10/domain) with easy/medium/hard tiers
- Arcade scoring: base + streak bonus + speed bonus + difficulty multiplier
  (see `src/lib/scoring.ts`)
- Accuracy-based rank, instant explanations
- Difficulty filter (+ HUD label + per-difficulty results breakdown)
- `localStorage` bestScore/XP persistence (key `arcade_bestScore`)
- `/admin` demo review page (PIN `arcade2024`, not real auth)
- **Study Mode (CQ-008, shipped in PR #8):** review missed questions after a
  run, then "Retry Missed Only" to replay just those questions.
- **Retry Missed keeps learned (CQ-009, PR #9):** after a "Retry Missed Only"
  pass, questions answered correctly are marked mastered and persisted in
  `localStorage` (`arcade_studyMastered`); later "Retry Missed Only" passes drop
  those so the study set shrinks. Scoring/HUD/bestScore/XP behavior unchanged.

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
2. **Larger question bank** — more original items per domain.
3. **Timed "blitz" mode** — countdown arcade mode with survival scoring.
4. **Domain progress** — per-domain accuracy and mastery tracking.
5. **Accessibility pass** — keyboard nav, screen-reader labels, focus states.
6. **CQ-009 (IN PROGRESS, see Active lane above):** "Retry Missed — keep
   learned" — implemented on `feat/cq-009-retry-missed-keep-learned`.

## Agent workflow notes

- **Inspect the repo before assuming the stack.** Verify `package.json`,
  lockfile, and existing files. Do not trust a mission brief over ground truth.
- **Commit after verified chunks.** Run `pnpm run build && pnpm run typecheck
  && pnpm run lint` before committing.
- **Update PR #1 only.** Never open a second PR for the same lane.
- **Keep changes small and reviewable.** One logical change per commit message.
- After meaningful changes, update this HANDOFF and `docs/` as needed.
