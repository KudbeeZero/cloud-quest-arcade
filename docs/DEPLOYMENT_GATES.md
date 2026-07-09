# Deployment Gates & Branch Protection

This document defines the deploy source, framework version gate, runtime, required
CI checks, and recommended branch protection for **Cloud Quest Arcade**.

## Deploy source

- **Current deploy source:** `main`
- Deployments are triggered from `main` only. PR branches are not deployed to
  production automatically.

## Framework

- **Framework:** Next.js
- **Build output:** OpenNext (AWS-targeted build)
- **Pinned `next`:** `16.2.6`
- **Pinned `eslint-config-next`:** `16.2.6`

## OpenNext / Next.js support window

OpenNext supports the following Next.js versions for the current runtime:

- `Next >= 15.5.18 < 16` **OR** `Next >= 16.2.6`

Versions in the gap (`>= 16.0.0 < 16.2.6`) are NOT supported and will fail the
OpenNext version gate. The previous production deploy failed because `main`
carried `next: ^16.1.3` (resolved inside the unsupported gap). After the
foundation merge, `main` carries `next: 16.2.6`, which satisfies the gate.

## Node runtime

- **Node:** `22` (see `.node-version`)
- `package.json` `engines.node`: `>=22 <23`

## Required pre-merge gates

All of the following must pass before a PR can be merged to `main`:

- `build` (Next.js production build)
- `typecheck` (`tsc --noEmit`)
- `lint` (`eslint`)
- `deploy preview check` **when configured** (see below)

## Branch protection target

- **Protected branch:** `main`

### Recommended branch protection settings

Apply the following to `main` once the deploy platform and permissions allow:

- Require a pull request before merging (no direct pushes).
- Require status checks to pass:
  - `Build`
  - `typecheck`
  - `lint`
- Require branches to be up to date before merging (if the platform supports it).
- Block force pushes.
- Block branch deletion.

## Deploy preview

- Deploy preview (per-PR preview environments) can be **connected later** once
  the deploy platform supports it.
- When available, add a `deploy preview` required status check to the branch
  protection rules above.
- Do NOT change GitHub branch protection until admin permission is confirmed and
  the change is safe and reversible.

## Optional later improvements

- Add a `deploy preview required` status check once previews are live.
- Add a dependency policy enforcing Next.js / OpenNext supported version windows.
- Add Dependabot grouping for the Next.js ecosystem (Next, React, eslint-config-next)
  to keep version bumps aligned with the support window.
