"use client";

import { useSyncExternalStore } from "react";

/**
 * Client-side learning-progress store for Cloud Quest Arcade.
 *
 * Tracks flashcard mastery, daily/weekly activity, "gotchas" (explanations)
 * studied, and lifetime quiz runs entirely in `localStorage`. No backend, no
 * auth, no database. Components read this via `useProgress()` and react to
 * changes through a custom event, so the Quiz, Flashcard, Missions, and
 * Progress views always stay in sync without prop drilling.
 */

export type CardStatus = "new" | "learning" | "mastered";

export interface FlashcardRecord {
  status: CardStatus;
  /** How many times this card has been reviewed. */
  seen: number;
  lastSeen: number;
}

export interface DailyActivity {
  /** Local calendar date, `YYYY-MM-DD`. */
  date: string;
  quizzesCompleted: number;
  /** Distinct cards reviewed (counted once per card per day). */
  flashcardsReviewed: number;
  /** Best single-run accuracy recorded that day (0-100). */
  bestAccuracy: number;
  /** Distinct "gotcha" explanations studied that day. */
  gotchasStudied: number;
}

export interface ProgressSnapshot {
  flashcards: Record<string, FlashcardRecord>;
  activity: Record<string, DailyActivity>;
  /** Distinct question ids whose explanation ("gotcha") has been studied. */
  gotchas: Record<string, true>;
  /** Lifetime number of completed quiz runs. */
  totalRuns: number;
}

const FLASHCARDS_KEY = "cqa_flashcards";
const ACTIVITY_KEY = "cqa_activity";
const GOTCHAS_KEY = "cqa_gotchas";
const RUNS_KEY = "cqa_runs";
const EVENT_NAME = "cloudquest:progress";

function localDateString(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage may be unavailable (private mode, quota) — ignore.
  }
}

function emptyActivity(date: string): DailyActivity {
  return {
    date,
    quizzesCompleted: 0,
    flashcardsReviewed: 0,
    bestAccuracy: 0,
    gotchasStudied: 0,
  };
}

// In-memory cache so `getSnapshot` returns a fresh reference on each mutation.
// Hydrated lazily on first client read.
let snapshot: ProgressSnapshot | null = null;
let hydrated = false;

function hydrate(): ProgressSnapshot {
  if (hydrated) return snapshot as ProgressSnapshot;
  snapshot = {
    flashcards: readJSON<Record<string, FlashcardRecord>>(FLASHCARDS_KEY, {}),
    activity: readJSON<Record<string, DailyActivity>>(ACTIVITY_KEY, {}),
    gotchas: readJSON<Record<string, true>>(GOTCHAS_KEY, {}),
    totalRuns: readJSON<number>(RUNS_KEY, 0),
  };
  hydrated = true;
  return snapshot;
}

/** Persist every slice and notify subscribers with a fresh object. */
function persist(next: ProgressSnapshot): void {
  snapshot = next;
  writeJSON(FLASHCARDS_KEY, next.flashcards);
  writeJSON(ACTIVITY_KEY, next.activity);
  writeJSON(GOTCHAS_KEY, next.gotchas);
  writeJSON(RUNS_KEY, next.totalRuns);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

function ensure(): ProgressSnapshot {
  if (!snapshot) hydrate();
  return snapshot as ProgressSnapshot;
}

function todayActivity(state: ProgressSnapshot): DailyActivity {
  const date = localDateString();
  return state.activity[date] ?? emptyActivity(date);
}

/** Record that a quiz run finished, updating today's activity + lifetime runs. */
export function recordQuizCompleted(accuracy: number): void {
  const state = ensure();
  const day = { ...todayActivity(state) };
  day.quizzesCompleted += 1;
  day.bestAccuracy = Math.max(day.bestAccuracy, accuracy);

  const activity = { ...state.activity, [day.date]: day };
  persist({
    ...state,
    activity,
    totalRuns: state.totalRuns + 1,
  });
}

/** Record that a flashcard was reviewed (flipped + rated). */
export function recordFlashcardReview(cardId: string, mastered: boolean): void {
  const state = ensure();
  const prev =
    state.flashcards[cardId] ??
    ({ status: "new" as CardStatus, seen: 0, lastSeen: 0 } as FlashcardRecord);
  const flashcards = {
    ...state.flashcards,
    [cardId]: {
      status: mastered ? "mastered" : "learning",
      seen: prev.seen + 1,
      lastSeen: Date.now(),
    } as FlashcardRecord,
  };

  const date = localDateString();
  const day = { ...(state.activity[date] ?? emptyActivity(date)) };
  day.flashcardsReviewed += 1;

  // Reviewing a card reveals its explanation — that's a "gotcha" studied.
  const gotchas = { ...state.gotchas };
  if (!gotchas[cardId]) {
    gotchas[cardId] = true;
    day.gotchasStudied += 1;
  }

  persist({
    ...state,
    flashcards,
    activity: { ...state.activity, [date]: day },
    gotchas,
  });
}

/** Record that a question explanation ("gotcha") was studied. */
export function recordGotchaStudied(questionId: string): void {
  const state = ensure();
  if (state.gotchas[questionId]) return;

  const date = localDateString();
  const day = { ...(state.activity[date] ?? emptyActivity(date)) };
  day.gotchasStudied += 1;

  persist({
    ...state,
    activity: { ...state.activity, [date]: day },
    gotchas: { ...state.gotchas, [questionId]: true },
  });
}

/** All flashcard records (used for mastery counts). */
export function getFlashcardRecords(): Record<string, FlashcardRecord> {
  return ensure().flashcards;
}

/** Sum a day's activity across the last `days` calendar days (inclusive). */
export function getActivityWindow(days: number): DailyActivity {
  const state = ensure();
  const total: DailyActivity = {
    date: "window",
    quizzesCompleted: 0,
    flashcardsReviewed: 0,
    bestAccuracy: 0,
    gotchasStudied: 0,
  };
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = localDateString(new Date(now.getTime() - i * 86_400_000));
    const day = state.activity[date];
    if (!day) continue;
    total.quizzesCompleted += day.quizzesCompleted;
    total.flashcardsReviewed += day.flashcardsReviewed;
    total.bestAccuracy = Math.max(total.bestAccuracy, day.bestAccuracy);
    total.gotchasStudied += day.gotchasStudied;
  }
  return total;
}

export function masteredCount(): number {
  const records = getFlashcardRecords();
  return Object.values(records).filter((r) => r.status === "mastered").length;
}

/** Lifetime number of completed quiz runs. */
export function totalRunsCompleted(): number {
  return ensure().totalRuns;
}

/** Distinct "gotchas" (explanations) studied across all time. */
export function gotchasStudiedCount(): number {
  return Object.keys(ensure().gotchas).length;
}

/**
 * Current daily streak: consecutive calendar days (ending today or
 * yesterday) with at least one recorded activity (quiz, flashcard, or gotcha).
 */
export function getCurrentStreak(): number {
  const state = ensure();
  const today = new Date();
  // Allow the streak to count from today; if today is empty, start at yesterday.
  let cursor = new Date(today);
  if (!dayHadActivity(state, cursor)) {
    cursor = new Date(today.getTime() - 86_400_000);
    if (!dayHadActivity(state, cursor)) return 0;
  }

  let streak = 0;
  while (dayHadActivity(state, cursor)) {
    streak += 1;
    cursor = new Date(cursor.getTime() - 86_400_000);
  }
  return streak;
}

function dayHadActivity(
  state: ProgressSnapshot,
  d: Date,
): boolean {
  const day = state.activity[localDateString(d)];
  if (!day) return false;
  return (
    day.quizzesCompleted > 0 ||
    day.flashcardsReviewed > 0 ||
    day.gotchasStudied > 0
  );
}

export interface ReadinessBreakdown {
  /** 0-100 overall readiness. */
  score: number;
  runs: number;
  flashcardsMastered: number;
  gotchasStudied: number;
}

/**
 * Simple Exam Readiness Score (0-100): weighted blend of completed runs,
 * flashcards mastered, and gotchas studied. Each input saturates at a target
 * so early progress is rewarded but full marks require real practice.
 */
export function getReadinessScore(): ReadinessBreakdown {
  const runs = totalRunsCompleted();
  const flashcardsMastered = masteredCount();
  const gotchasStudied = gotchasStudiedCount();

  const runsScore = Math.min(runs / 5, 1); // 5 runs = full
  const flashScore = Math.min(flashcardsMastered / 10, 1); // 10 mastered = full
  const gotchaScore = Math.min(gotchasStudied / 20, 1); // 20 gotchas = full

  const score = Math.round(
    (runsScore * 0.4 + flashScore * 0.3 + gotchaScore * 0.3) * 100,
  );

  return { score, runs, flashcardsMastered, gotchasStudied };
}

// ---- React binding -------------------------------------------------------

function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onEvent = () => listener();
  const onStorage = (e: StorageEvent) => {
    if (
      e.key === FLASHCARDS_KEY ||
      e.key === ACTIVITY_KEY ||
      e.key === GOTCHAS_KEY ||
      e.key === RUNS_KEY
    ) {
      listener();
    }
  };
  window.addEventListener(EVENT_NAME, onEvent);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT_NAME, onEvent);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot(): ProgressSnapshot {
  return ensure();
}

/** Subscribe a component to the shared progress store. */
export function useProgress(): ProgressSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Returns `false` during SSR and the first client render, then `true` after
 * mount. Use it to defer `localStorage`-derived numbers so server and client
 * first render match (avoids hydration mismatches). Implemented with
 * `useSyncExternalStore` so it needs no effect and no `setState`.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

const EMPTY_SNAPSHOT: ProgressSnapshot = {
  flashcards: {},
  activity: {},
  gotchas: {},
  totalRuns: 0,
};

function getServerSnapshot(): ProgressSnapshot {
  return EMPTY_SNAPSHOT;
}
