// Lightweight, dependency-free helpers for the study-rhythm features.
// All state lives in localStorage; these are pure helpers kept tiny on purpose.

export type DailyGoalType = "run" | "flashcards" | "study";

export interface DailyGoal {
  type: DailyGoalType;
  /** ISO date strings (YYYY-MM-DD, local) the goal was completed. */
  completedDates: string[];
}

export const GOAL_LABELS: Record<DailyGoalType, string> = {
  run: "Complete 1 challenge run",
  flashcards: "Review 10 flashcards",
  study: "Study for 15 minutes",
};

/** Local-date key, e.g. "2026-07-10". */
export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayBefore(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return todayKey(dt);
}

/** Consecutive days (ending today or yesterday) present in the date list. */
export function computeStreak(dates: string[], today = todayKey()): number {
  const set = new Set(dates);
  if (!set.has(today)) {
    if (!set.has(dayBefore(today))) return 0;
    // Streak continues from yesterday but today isn't done yet.
    today = dayBefore(today);
  }
  let streak = 0;
  let cursor = today;
  while (set.has(cursor)) {
    streak += 1;
    cursor = dayBefore(cursor);
  }
  return streak;
}

/** Longest run of consecutive days anywhere in the date list. */
export function computeLongestStreak(dates: string[]): number {
  const sorted = [...new Set(dates)].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    if (prev !== null && dayBefore(prev) === d) {
      run += 1;
    } else {
      run = 1;
    }
    best = Math.max(best, run);
    prev = d;
  }
  return best;
}
