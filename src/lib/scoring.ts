import type { AnsweredQuestion, RunResult } from "./types";

/** Base points awarded for a correct answer. */
export const BASE_POINTS = 100;

/** Extra points per level of the current streak (rewards momentum). */
export const STREAK_BONUS = 25;

/**
 * Speed bonus: answering quickly earns up to SPEED_BONUS_MAX extra points,
 * decaying linearly to zero at SPEED_BONUS_WINDOW_MS.
 */
export const SPEED_BONUS_MAX = 50;
export const SPEED_BONUS_WINDOW_MS = 10_000;

/**
 * Points for a single answer given the streak *before* this answer.
 * Wrong answers score nothing and break the streak.
 */
export function pointsForAnswer(
  correct: boolean,
  streakBefore: number,
  elapsedMs: number,
): number {
  if (!correct) return 0;

  const streakBonus = streakBefore * STREAK_BONUS;

  const clampedElapsed = Math.max(0, Math.min(elapsedMs, SPEED_BONUS_WINDOW_MS));
  const speedBonus = Math.round(
    SPEED_BONUS_MAX * (1 - clampedElapsed / SPEED_BONUS_WINDOW_MS),
  );

  return BASE_POINTS + streakBonus + speedBonus;
}

/** Aggregate a list of answers into a final RunResult. */
export function computeRunResult(
  answers: AnsweredQuestion[],
  totalQuestions: number,
): RunResult {
  let score = 0;
  let streak = 0;
  let bestStreak = 0;
  let correctCount = 0;

  for (const answer of answers) {
    if (answer.correct) {
      score += pointsForAnswer(true, streak, answer.elapsedMs);
      streak += 1;
      bestStreak = Math.max(bestStreak, streak);
      correctCount += 1;
    } else {
      streak = 0;
    }
  }

  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  return {
    answers,
    totalQuestions,
    correctCount,
    accuracy,
    score,
    bestStreak,
  };
}

/** Playful rank label based on accuracy. */
export function rankForAccuracy(accuracy: number): string {
  if (accuracy >= 90) return "Cloud Architect";
  if (accuracy >= 75) return "Solutions Pro";
  if (accuracy >= 50) return "Cloud Explorer";
  return "Cadet";
}
