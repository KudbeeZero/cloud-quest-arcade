"use client";

import { useSyncExternalStore } from "react";

/**
 * Client-side learning-progress store for Cloud Quest Arcade.
 *
 * Tracks flashcard mastery and daily/weekly activity entirely in
 * `localStorage`. No backend, no auth, no database. Other components read
 * this via `useProgress()` and react to changes through a custom
 * `storage`-style event, so the Quiz, Flashcard, and Missions views always
 * stay in sync without prop drilling.
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
}

export interface ProgressSnapshot {
  flashcards: Record<string, FlashcardRecord>;
  activity: Record<string, DailyActivity>;
}

const FLASHCARDS_KEY = "cqa_flashcards";
const ACTIVITY_KEY = "cqa_activity";
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

// In-memory cache so `getSnapshot` returns a stable reference between
// mutations. It is hydrated lazily on first client read.
let snapshot: ProgressSnapshot | null = null;
let hydrated = false;

function hydrate(): ProgressSnapshot {
  if (hydrated) return snapshot as ProgressSnapshot;
  snapshot = {
    flashcards: readJSON<Record<string, FlashcardRecord>>(FLASHCARDS_KEY, {}),
    activity: readJSON<Record<string, DailyActivity>>(ACTIVITY_KEY, {}),
  };
  hydrated = true;
  return snapshot;
}

function persist(): void {
  if (!snapshot) return;
  writeJSON(FLASHCARDS_KEY, snapshot.flashcards);
  writeJSON(ACTIVITY_KEY, snapshot.activity);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_NAME));
  }
}

function ensure(): ProgressSnapshot {
  if (!snapshot) hydrate();
  return snapshot as ProgressSnapshot;
}

function today(): DailyActivity {
  const date = localDateString();
  return ensure().activity[date] ?? {
    date,
    quizzesCompleted: 0,
    flashcardsReviewed: 0,
    bestAccuracy: 0,
  };
}

/** Record that a quiz run finished, updating today's activity. */
export function recordQuizCompleted(accuracy: number): void {
  const state = ensure();
  const day = today();
  day.quizzesCompleted += 1;
  day.bestAccuracy = Math.max(day.bestAccuracy, accuracy);
  state.activity[day.date] = day;
  persist();
}

/** Record that a flashcard was reviewed (flipped + rated). */
export function recordFlashcardReview(cardId: string, mastered: boolean): void {
  const state = ensure();
  const prev = state.flashcards[cardId] ?? {
    status: "new" as CardStatus,
    seen: 0,
    lastSeen: 0,
  };
  state.flashcards[cardId] = {
    status: mastered ? "mastered" : "learning",
    seen: prev.seen + 1,
    lastSeen: Date.now(),
  };

  const date = localDateString();
  const day = state.activity[date] ?? {
    date,
    quizzesCompleted: 0,
    flashcardsReviewed: 0,
    bestAccuracy: 0,
  };
  day.flashcardsReviewed += 1;
  state.activity[date] = day;

  persist();
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
  };
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const date = localDateString(new Date(now.getTime() - i * 86_400_000));
    const day = state.activity[date];
    if (!day) continue;
    total.quizzesCompleted += day.quizzesCompleted;
    total.flashcardsReviewed += day.flashcardsReviewed;
    total.bestAccuracy = Math.max(total.bestAccuracy, day.bestAccuracy);
  }
  return total;
}

export function masteredCount(): number {
  const records = getFlashcardRecords();
  return Object.values(records).filter((r) => r.status === "mastered").length;
}

// ---- React binding -------------------------------------------------------

function subscribe(listener: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onEvent = () => listener();
  const onStorage = (e: StorageEvent) => {
    if (e.key === FLASHCARDS_KEY || e.key === ACTIVITY_KEY) listener();
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
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
