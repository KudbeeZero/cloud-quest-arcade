# PR Memory Layer — Cloud Quest Arcade

This file defines the repo-native memory layer used by agents to track lanes,
PRs, and closeout. It is the convention source of truth that complements
`docs/PR_LEDGER.md` (history) and `docs/HANDOFF.md` (current state).

## Identity model

Each piece of work has two identifiers:

- **GitHub PR number** — the official, immutable number assigned by GitHub.
  Never reuse or recycle a number; it is the canonical reference.
- **Kudbee lane ID** — a human-readable project memory ID used in commit
  messages, docs, and agent handoffs.

### Kudbee lane ID format

Lane IDs follow the pattern `CQ-NNN-kebab-slug`:

- `CQ-001-foundation`
- `CQ-002-deploy-gates`
- `CQ-003-pr-memory-layer`
- `CQ-004-player-progress-v1`

Higher numbers are later lanes. The slug is short and descriptive so a reader
can infer the lane's purpose without opening the PR.

## Status values

A lane passes through these statuses over its lifetime:

- `planned` — identified, not yet started.
- `active` — branch created, work in progress.
- `open` — PR opened, awaiting review/CI.
- `green` — PR open but CI checks passing.
- `merged` — PR merged into `main`.
- `deployed` — changes live in production/preview after merge.
- `parked` — intentionally paused, not abandoned; can be resumed.
- `blocked` — cannot proceed due to an external dependency.

## Required closeout

Every lane is closed out with three sections:

- **Asked** — what the owner/lane requested.
- **Done** — what was actually delivered.
- **Needs you** — what the owner must do next (review, click merge, verify,
  etc.).

## Required verification

For a lane to be considered complete, record:

- **branch** — the feature branch name.
- **PR URL** — the GitHub PR link.
- **files changed** — the meaningful files touched.
- **CI result** — build / typecheck / lint outcome.
- **deploy result** — preview/prod result if relevant.
- **owner action** — the explicit next owner step.
- **next bigger/better lane** — the suggested follow-up lane.

## Ground rules

- One lane = one PR where practical.
- Never push directly to `main`.
- Do not mix branch-protection/settings work with gameplay work.
- Keep all content original and educational; no copied exam questions.
- Docs/lane work is allowed to ship alongside its owning PR.
