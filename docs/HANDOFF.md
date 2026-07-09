# HANDOFF — Cloud Quest Arcade

This document is the source of truth for agents picking up work on this
repository. Read it before assuming anything about the stack or scope.

## Current repo status

- **Repo:** `KudbeeZero/cloud-quest-arcade`
- **Live branch for active work:** `feat/player-progress-v1`
- **Package manager:** `pnpm` (lockfile: `pnpm-lock.yaml`; `bun.lock` removed)
- **State:** Front-end only, fully client-side, no server runtime.

## PR lane status

- **PR #1** "feat: create arcade AWS practitioner trainer foundation" —
  **MERGED / deployed** (CQ-001-foundation). App working on `main`.
- **PR #5** "docs: define deploy gates and branch protection plan" —
  **MERGED** (CQ-002-deploy-gates), squash-merged 2026-07-09; branch deleted.
  Docs-only (`docs/DEPLOYMENT_GATES.md`).
- **Active lane:** CQ-004-player-progress-v1 on branch `feat/player-progress-v1`.
  The PR-memory-layer docs (CQ-003) ship in the same PR as supporting artifacts.

> Each lane has a Kudbee lane ID and an immutable GitHub PR number. See
> `docs/PR_MEMORY_LAYER.md` and `docs/PR_LEDGER.md`.

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
- Original sample questions (12) across the four CLF-C02 domains
- Arcade scoring: base + streak bonus + speed bonus (see `src/lib/scoring.ts`)
- Accuracy-based rank, instant explanations
- Mobile-first arcade rewards dashboard polish (see Phase 5)

Explicitly out of scope — do NOT add:

- Backend / server-side logic
- Authentication / user accounts / profiles
- Database or persistence beyond in-memory + (future) `localStorage`
- Payments / monetization
- AI-generated questions
- Live AWS API integration
- Copied official exam content

## Current active lane (CQ-004-player-progress-v1)

Branch `feat/player-progress-v1`. Frontend-only player progress:

- localStorage high scores (best score, best rank, best streak, last session)
- Session history (last 5 sessions: date, score, accuracy, rank, domain breakdown, missed prompts)
- Domain progress tracking (per-domain accuracy / mastery)
- Missed-question review on the results screen
- Result-screen improvements (score vs best, strengths, weakest domain, CTA)
- Reset-progress action (confirm before clearing localStorage)

## Next lanes (ideas, not commitments)

1. **CI / deploy preview** — wire CI to a preview deploy (e.g. Vercel preview).
   (Plan in `docs/DEPLOYMENT_GATES.md`, CQ-002.)
2. **Larger question bank** — more original items per domain, difficulty tiers.
3. **Timed "blitz" mode** — countdown arcade mode with survival scoring.
4. **Accessibility pass** — keyboard nav, screen-reader labels, focus states.
5. **Badges / achievements** — gamified milestone layer on top of progress.

## Agent workflow notes

- **Inspect the repo before assuming the stack.** Verify `package.json`,
  lockfile, and existing files. Do not trust a mission brief over ground truth.
- **Commit after verified chunks.** Run `pnpm run build && pnpm run typecheck
  && pnpm run lint` before committing.
- **Update PR #1 only.** Never open a second PR for the same lane.
- **Keep changes small and reviewable.** One logical change per commit message.
- After meaningful changes, update this HANDOFF and `docs/` as needed.
