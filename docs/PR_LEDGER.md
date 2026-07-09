# PR Ledger — Cloud Quest Arcade

Append-only-ish history of lanes and their GitHub PRs. Newest lanes at the
bottom. See `docs/PR_MEMORY_LAYER.md` for ID/status conventions.

---

## CQ-001-foundation

- **Kudbee Lane ID:** CQ-001-foundation
- **PR:** #1 — "feat: create arcade AWS practitioner trainer foundation"
- **Status:** merged / deployed
- **Branch:** `feat/arcade-learning-foundation`
- **Result:** App working on `main` (Next.js 16.2.6, arcade trainer foundation).
- **Owner action:** none — done.

---

## CQ-002-deploy-gates

- **Kudbee Lane ID:** CQ-002-deploy-gates
- **PR:** #5 — "docs: define deploy gates and branch protection plan"
- **Status:** merged
- **Branch:** `chore/deploy-preview-branch-protection`
- **Files changed:** `docs/DEPLOYMENT_GATES.md` (docs only)
- **CI result:** green (Build, typecheck, lint passed)
- **Merge action:** squash-merged 2026-07-09; branch deleted.
- **Owner action:** none — docs plan recorded for future deploy-preview work.

---

## CQ-003-pr-memory-layer

- **Kudbee Lane ID:** CQ-003-pr-memory-layer
- **PR:** shipped alongside CQ-004 (this PR)
- **Status:** active
- **Branch:** `feat/player-progress-v1`
- **Files changed:** `docs/PR_MEMORY_LAYER.md` (new), `docs/PR_LEDGER.md`
  (new), `.github/PULL_REQUEST_TEMPLATE.md` (new), `docs/HANDOFF.md` (updated)
- **Purpose:** Establish the repo-native PR memory layer so future lanes are
  tracked by immutable GitHub PR number + Kudbee lane ID.
- **Owner action:** review that the memory conventions are acceptable.

---

## CQ-004-player-progress-v1

- **Kudbee Lane ID:** CQ-004-player-progress-v1
- **PR:** (created in this lane) — "feat: add player progress tracking"
- **Status:** active / open (after PR created)
- **Branch:** `feat/player-progress-v1`
- **Purpose:** Frontend-only player progress: localStorage high scores, session
  history, domain progress tracking, missed-question review, result-screen
  improvements, and a reset-progress action.
- **Owner action:** review PR after CI green, then merge.

### Verification

- **build:** `pnpm run build`
- **typecheck:** `pnpm run typecheck`
- **lint:** `pnpm run lint`

### Next bigger / better lane

- Timed "blitz" mode (countdown survival scoring).
- Expanded original question bank with difficulty tiers.
- Badges / achievements layer.
- Deploy preview + branch protection wiring (from CQ-002 plan) if not applied.
