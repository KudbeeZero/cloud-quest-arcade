# Cloud Quest Arcade

A retro-flavored practice **arcade** for the **AWS Certified Cloud Practitioner
(CLF-C02)** exam. Answer bite-sized questions, build streaks, and rack up a high
score while you learn core cloud concepts.

This repository is the **first playable foundation**: a single-player quiz loop
with original sample questions, arcade scoring, and instant explanations. It is
front-end only — there is no backend, auth, database, payments, AI generation,
or AWS API integration yet.

## Features (foundation)

- **Playable quiz loop** — start screen, one-question-at-a-time play, and a
  results screen with a "play again" option.
- **Original sample questions** — hand-authored practice items across all four
  Cloud Practitioner domains. Not copied from any official or third-party exam.
- **Arcade scoring** — points for correct answers, a **streak bonus** for
  consecutive correct answers, and a **speed bonus** for answering quickly.
- **Instant feedback** — every answer reveals the correct option plus a short
  plain-language explanation.
- **Playful ranks** — end-of-run rank based on accuracy (Cadet → Cloud
  Architect).

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) + React + TypeScript
- Tailwind CSS
- No external state, data, or API dependencies

> Note: the mission brief referenced a Vite setup, but this repository is a
> Next.js template, so the foundation was built on Next.js to match the existing
> codebase.

## Getting started

Install dependencies and start the dev server:

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

### Useful scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `pnpm dev`        | Start the local dev server           |
| `pnpm build`      | Production build                     |
| `pnpm start`      | Serve the production build           |
| `pnpm typecheck`  | Type-check with `tsc --noEmit`       |
| `pnpm lint`       | Run ESLint                           |

## Project structure

```
src/
  app/
    layout.tsx        App shell + metadata
    page.tsx          Home page (renders the arcade)
    globals.css       Tailwind entry
  components/
    ArcadeGame.tsx    Client component: the quiz game loop
  data/
    questions.ts      Original sample question bank
  lib/
    types.ts          Domain types (Question, RunResult, ...)
    scoring.ts        Scoring, streak/speed bonuses, ranks
docs/
  PRODUCT_SPEC.md     Product spec and roadmap
```

## Extending the question bank

Add new entries to `src/data/questions.ts` following the `Question` type in
`src/lib/types.ts`. Each question needs a unique `id`, a `domain`, a `prompt`,
2–4 `options`, the `correctOptionId`, and a short `explanation`.

## Disclaimer

This is an independent study aid with original practice content. It is **not
affiliated with, endorsed by, or sponsored by Amazon Web Services**. "AWS" and
related marks belong to Amazon.
