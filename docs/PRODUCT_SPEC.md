# Cloud Quest Arcade — Product Spec

## 1. Vision

Make studying for the **AWS Certified Cloud Practitioner (CLF-C02)** exam feel
like playing a quick arcade game. Short sessions, immediate feedback, and a
score to beat keep learners coming back and reinforce recall through repetition.

## 2. Target user

- Career switchers and students preparing for their first AWS certification.
- Busy professionals who want 3–5 minute study bursts.
- Anyone who learns better through gamified, low-pressure practice.

## 3. Scope of this foundation (v0)

**In scope**

- Single-player quiz loop: start → play → results → replay.
- Original, hand-authored sample questions across the four exam domains:
  - Cloud Concepts
  - Security and Compliance
  - Cloud Technology and Services
  - Billing, Pricing and Support
- Arcade scoring: base points, streak bonus, speed bonus.
- Instant per-question explanations.
- Accuracy-based rank at the end of a run.

**Explicitly out of scope (for now)**

- Backend / server-side logic.
- User accounts, authentication, or profiles.
- Database or any persistence beyond in-memory session state.
- Payments or monetization.
- AI-generated questions.
- Live AWS API integration.

These are deliberately excluded to keep the foundation small, reviewable, and
fully client-side.

## 4. Core experience

1. **Start screen** — explains the rules and starts a run.
2. **Play** — one question at a time with 2–4 options. Selecting an option
   locks in the answer and reveals the correct choice plus an explanation.
3. **Scoring** (see below) updates live: running score and current streak.
4. **Results** — final score, correct count, accuracy %, best streak, and a
   playful rank. Player can replay with a freshly shuffled order.

## 5. Scoring model

For each correct answer:

```
points = BASE_POINTS (100)
       + streakBefore * STREAK_BONUS (25 per level)
       + speedBonus (up to 50, decaying to 0 over a 10s window)
```

- Wrong answers score 0 and reset the streak.
- `bestStreak` tracks the longest consecutive-correct run.
- Rank thresholds by accuracy: Cadet (<50%), Cloud Explorer (≥50%),
  Solutions Pro (≥75%), Cloud Architect (≥90%).

The scoring logic lives in `src/lib/scoring.ts` and is pure/testable, decoupled
from the UI.

## 6. Content principles

- All questions are **original** and paraphrase general knowledge. No official
  or third-party exam content is reproduced.
- Every question includes a short, plain-language explanation to teach, not just
  test.
- Questions are tagged by domain so future features can filter or weight by
  domain.

## 7. Roadmap (post-foundation ideas)

Not committed — future lanes to consider:

- Domain-focused modes and difficulty tiers.
- Timed "blitz" and "survival" arcade modes.
- Local high-score persistence (localStorage), then optional accounts.
- Expanded question bank with images/diagrams.
- Progress tracking and spaced-repetition review.
- Accessibility pass (keyboard nav, screen-reader labels) and i18n.

## 8. Non-goals

Cloud Quest Arcade is a **study aid**, not a braindump or a guarantee of passing
the exam. It is independent and not affiliated with AWS.
