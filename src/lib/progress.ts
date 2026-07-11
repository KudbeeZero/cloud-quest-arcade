import type { AnsweredQuestion, Difficulty, Domain, RunResult } from "./types";

/**
 * Lightweight, localStorage-backed progress store.
 *
 * The arcade only persists a single `bestScore` today. This module adds a run
 * history (used by /progress and /leaderboard) and a tiny subscription model so
 * client pages can react to changes. It also stores a single in-flight run
 * (`arcade_savedRun`) so a mid-test session can be resumed across page loads,
 * tab closes, or browser restarts. Everything is SSR-safe: storage access is
 * guarded and reads happen inside effects.
 */

export type RunDifficulty = "all" | Difficulty;

export interface RunRecord {
  id: string;
  timestamp: number;
  difficulty: RunDifficulty;
  totalQuestions: number;
  correctCount: number;
  accuracy: number;
  score: number;
  bestStreak: number;
  /** Per-answer correctness enriched with the domain for accuracy breakdowns. */
  answers: { questionId: string; correct: boolean; domain: Domain }[];
}

/**
 * Snapshot of an in-flight run that can be resumed later. The `order` array is
 * a permutation of indices into the active question set, so the resume flow
 * can reconstruct the exact same sequence even if the user changed difficulty
 * filter in the meantime.
 */
export interface SavedRun {
  order: number[];
  current: number;
  answers: AnsweredQuestion[];
  score: number;
  streak: number;
  difficulty: RunDifficulty;
  /** Wall-clock ms when the current question was first shown. */
  questionStartedAt: number;
  /** Wall-clock ms when this state was last persisted. */
  savedAt: number;
}

const RUNS_KEY = "arcade_runs";
const BEST_KEY = "arcade_bestScore";
const SAVED_RUN_KEY = "arcade_savedRun";
const SAVED_RUN_EVENT = "cq_savedRun";

function storage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadRuns(): RunRecord[] {
  const ls = storage();
  if (!ls) return [];
  try {
    const raw = ls.getItem(RUNS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as RunRecord[];
  } catch {
    return [];
  }
}

export function recordRun(
  result: RunResult,
  difficulty: RunDifficulty,
  questions: { id: string; domain: Domain }[],
): RunRecord {
  const domainById = new Map(questions.map((q) => [q.id, q.domain]));
  const record: RunRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
    difficulty,
    totalQuestions: result.totalQuestions,
    correctCount: result.correctCount,
    accuracy: result.accuracy,
    score: result.score,
    bestStreak: result.bestStreak,
    answers: result.answers.map((a) => ({
      questionId: a.questionId,
      correct: a.correct,
      domain: domainById.get(a.questionId) ?? "Cloud Concepts",
    })),
  };

  const runs = [record, ...loadRuns()].slice(0, 50);
  const ls = storage();
  if (ls) {
    try {
      ls.setItem(RUNS_KEY, JSON.stringify(runs));
      ls.setItem(BEST_KEY, String(Math.max(loadBestScore(), record.score)));
    } catch {
      // ignore quota / unavailable storage
    }
  }
  notify();
  return record;
}

export function loadBestScore(): number {
  const ls = storage();
  if (!ls) return 0;
  try {
    const raw = ls.getItem(BEST_KEY);
    const parsed = raw !== null ? parseInt(raw, 10) : 0;
    return Number.isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

export function clearRuns(): void {
  const ls = storage();
  if (ls) {
    try {
      ls.removeItem(RUNS_KEY);
    } catch {
      // ignore
    }
  }
  notify();
}

export interface DomainAccuracy {
  domain: Domain;
  correct: number;
  total: number;
  pct: number;
}

export function domainAccuracy(runs: RunRecord[]): DomainAccuracy[] {
  const order: Domain[] = [
    "Cloud Concepts",
    "Security and Compliance",
    "Cloud Technology and Services",
    "Billing, Pricing and Support",
  ];
  const acc: Record<Domain, { correct: number; total: number }> = {
    "Cloud Concepts": { correct: 0, total: 0 },
    "Security and Compliance": { correct: 0, total: 0 },
    "Cloud Technology and Services": { correct: 0, total: 0 },
    "Billing, Pricing and Support": { correct: 0, total: 0 },
  };
  for (const run of runs) {
    for (const a of run.answers) {
      acc[a.domain].total += 1;
      if (a.correct) acc[a.domain].correct += 1;
    }
  }
  return order.map((domain) => {
    const { correct, total } = acc[domain];
    return { domain, correct, total, pct: total > 0 ? Math.round((correct / total) * 100) : 0 };
  });
}

// --- Minimal subscription model for client components ---

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// --- In-flight (mid-test) run store -----------------------------------------
// Persists the active run so the player can close the tab and resume from the
// same question. A single slot is kept; starting a new run overwrites it.

function readSavedRunRaw(): string | null {
  const ls = storage();
  if (!ls) return null;
  try {
    return ls.getItem(SAVED_RUN_KEY);
  } catch {
    return null;
  }
}

export function loadSavedRun(): SavedRun | null {
  const raw = readSavedRunRaw();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SavedRun;
    if (!parsed || !Array.isArray(parsed.order) || !Array.isArray(parsed.answers)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function saveRun(run: SavedRun): void {
  const ls = storage();
  if (!ls) return;
  try {
    ls.setItem(SAVED_RUN_KEY, JSON.stringify(run));
  } catch {
    // ignore quota / unavailable storage
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SAVED_RUN_EVENT));
  }
}

export function clearSavedRun(): void {
  const ls = storage();
  if (!ls) return;
  try {
    ls.removeItem(SAVED_RUN_KEY);
  } catch {
    // ignore
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SAVED_RUN_EVENT));
  }
}

/**
 * `useSyncExternalStore`-friendly subscription for the saved-run slot.
 * `getSnapshot` returns the raw localStorage string (a stable primitive on
 * unchanged data) so React doesn't loop on a fresh parsed object every call —
 * see the rule in `.kilocode/rules/memory-bank/context.md`.
 */
export function subscribeSavedRun(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(SAVED_RUN_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(SAVED_RUN_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function getSavedRunSnapshot(): string | null {
  return readSavedRunRaw();
}

export function getSavedRunServerSnapshot(): string | null {
  return null;
}
