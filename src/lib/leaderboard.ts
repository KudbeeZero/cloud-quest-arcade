import type { RunResult } from "./types";

/** A single persisted run on the local high-score leaderboard. */
export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  accuracy: number;
  bestStreak: number;
  correctCount: number;
  totalQuestions: number;
  difficulty: string;
  date: number;
}

const BOARD_KEY = "arcade_leaderboard";
const NAME_KEY = "arcade_playerName";
const MAX_ENTRIES = 10;

function safeParse(raw: string | null): LeaderboardEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e): e is LeaderboardEntry =>
        e && typeof e.score === "number" && typeof e.id === "string",
    );
  } catch {
    return [];
  }
}

/** Read the top runs, sorted by score descending. */
export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    return safeParse(localStorage.getItem(BOARD_KEY)).sort(
      (a, b) => b.score - a.score,
    );
  } catch {
    return [];
  }
}

/** Read the persisted player display name (defaults to "Commander"). */
export function loadPlayerName(): string {
  try {
    return localStorage.getItem(NAME_KEY) || "Commander";
  } catch {
    return "Commander";
  }
}

export function savePlayerName(name: string): void {
  try {
    localStorage.setItem(NAME_KEY, name.trim() || "Commander");
  } catch {
    // ignore
  }
}

/**
 * Persist a finished run and return the updated top-10 board.
 * Only the highest-scoring runs are kept.
 */
export function saveScore(
  result: RunResult,
  difficulty: string,
  name = "Commander",
): LeaderboardEntry[] {
  const entry: LeaderboardEntry = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now() + Math.random()),
    name,
    score: result.score,
    accuracy: result.accuracy,
    bestStreak: result.bestStreak,
    correctCount: result.correctCount,
    totalQuestions: result.totalQuestions,
    difficulty,
    date: Date.now(),
  };

  const next = [...loadLeaderboard(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);

  try {
    localStorage.setItem(BOARD_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

/** Wipe the local leaderboard. */
export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(BOARD_KEY);
  } catch {
    // ignore
  }
}
