"use client";

import { useSyncExternalStore } from "react";

/**
 * Cross-session player progress, persisted to localStorage.
 *
 * No external state library — we expose a tiny store built on
 * `useSyncExternalStore` so any client component can subscribe to live
 * updates. All mutation goes through the exported functions below, which
 * read the current cached value, compute the next one, persist it, and
 * notify subscribers.
 */
export interface PlayerProgress {
  /** Consecutive days with a completed run. */
  streak: number;
  /** Best streak ever reached. */
  longestStreak: number;
  /** Last day a run was completed, as "YYYY-MM-DD". */
  lastActiveDate: string | null;
  /** Questions answered today (resets each calendar day). */
  todayAnswers: number;
  /** Today's daily mission, or null if none has been generated yet. */
  mission: {
    date: string; // "YYYY-MM-DD"
    goal: number; // default 10
    claimed: boolean;
  } | null;
}

const STORAGE_KEY = "cloud-quest:progress";
const DEFAULT_GOAL = 10;

const defaultProgress: PlayerProgress = {
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  todayAnswers: 0,
  mission: null,
};

export function todayStr(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** "YYYY-MM-DD" for the day immediately before the given date string. */
function dayBefore(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  d.setDate(d.getDate() - 1);
  return todayStr(d);
}

// --- Store internals -------------------------------------------------------

let cache: PlayerProgress | null = null;
const listeners = new Set<() => void>();

function read(): PlayerProgress {
  if (cache) return cache;
  if (typeof window === "undefined") {
    cache = defaultProgress;
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
      cache = { ...defaultProgress, ...parsed, mission: parsed.mission ?? null };
      return cache;
    }
  } catch {
    // Corrupt or unavailable storage — fall back to defaults.
  }
  cache = defaultProgress;
  return cache;
}

function write(next: PlayerProgress): void {
  cache = next;
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Ignore write failures (private mode, quota, etc.).
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): PlayerProgress {
  return read();
}

export function getServerSnapshot(): PlayerProgress {
  return defaultProgress;
}

export function usePlayerProgress(): PlayerProgress {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// --- Mutations -------------------------------------------------------------

/**
 * Make sure today's mission exists. If the stored mission is from a previous
 * day (or missing) a fresh, unclaimed one is created and today's answer count
 * is reset.
 */
export function ensureTodayMission(today: string = todayStr()): PlayerProgress {
  const current = read();
  if (current.mission && current.mission.date === today) return current;
  const next: PlayerProgress = {
    ...current,
    todayAnswers: 0,
    mission: { date: today, goal: DEFAULT_GOAL, claimed: false },
  };
  write(next);
  return next;
}

/**
 * Record a completed run: bumps today's answer count, extends the streak when
 * this is a new active day, and refreshes the daily mission if the date rolled
 * over.
 */
export function recordRun(answeredCount: number, today: string = todayStr()): PlayerProgress {
  const current = read();

  let next: PlayerProgress = current;
  if (!current.mission || current.mission.date !== today) {
    next = {
      ...current,
      todayAnswers: 0,
      mission: { date: today, goal: DEFAULT_GOAL, claimed: false },
    };
  }

  const prev = current.lastActiveDate;
  let streak = current.streak;
  if (prev === today) {
    // Already counted today — streak unchanged.
  } else if (prev === dayBefore(today)) {
    streak = current.streak + 1;
  } else {
    streak = 1;
  }

  next = {
    ...next,
    streak,
    longestStreak: Math.max(current.longestStreak, streak),
    lastActiveDate: today,
    todayAnswers: next.todayAnswers + answeredCount,
  };

  write(next);
  return next;
}

/**
 * Claim today's mission once its goal is met. No-op if there is no mission, it
 * is from another day, already claimed, or the goal is unmet.
 */
export function claimMission(today: string = todayStr()): PlayerProgress {
  const current = read();
  if (!current.mission || current.mission.date !== today) return current;
  if (current.mission.claimed) return current;
  if (current.todayAnswers < current.mission.goal) return current;

  const next: PlayerProgress = {
    ...current,
    mission: { ...current.mission, claimed: true },
  };
  write(next);
  return next;
}

/** Derived view of the current mission for UI rendering. */
export interface MissionView {
  exists: boolean;
  date: string;
  goal: number;
  progress: number;
  complete: boolean;
  claimed: boolean;
  claimable: boolean;
}

export function missionView(
  progress: PlayerProgress,
  today: string = todayStr(),
): MissionView {
  const mission = progress.mission;
  if (!mission || mission.date !== today) {
    return {
      exists: false,
      date: today,
      goal: DEFAULT_GOAL,
      progress: 0,
      complete: false,
      claimed: false,
      claimable: false,
    };
  }
  const progressCount = Math.min(progress.todayAnswers, mission.goal);
  const complete = progress.todayAnswers >= mission.goal;
  return {
    exists: true,
    date: mission.date,
    goal: mission.goal,
    progress: progressCount,
    complete,
    claimed: mission.claimed,
    claimable: complete && !mission.claimed,
  };
}
