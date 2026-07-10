/**
 * Persistent player progress: daily streak + daily mission.
 *
 * All reads/writes are wrapped so the app keeps working in private/incognito
 * mode (where `localStorage` can throw). A per-session memory fallback is used
 * when storage is unavailable.
 *
 * Stored data shape (what "current progress" looks like):
 *
 *   PlayerProgress {
 *     streak: number;          // consecutive days with a completed run
 *     longestStreak: number;   // best streak ever reached
 *     lastActiveDate: string | null; // "YYYY-MM-DD" of last completed run
 *     todayAnswers: number;    // questions answered on the mission's date
 *     mission: {
 *       date: string;          // "YYYY-MM-DD" this mission is for
 *       goal: number;          // questions required to complete it
 *       claimed: boolean;      // reward already collected
 *     } | null;
 *   }
 *
 * Daily mission eligibility is derived (never ambiguous):
 *   - eligible  = mission exists, its date is today, todayAnswers >= goal,
 *                 and it has not been claimed yet.
 *
 * The store is consumed via `useSyncExternalStore` (see `subscribe`,
 * `getSnapshot`, `getServerSnapshot`) so the start screen hydrates cleanly
 * and re-renders automatically whenever progress changes.
 */

export interface DailyMission {
  /** "YYYY-MM-DD" this mission is for. */
  date: string;
  /** Number of questions required to complete it. */
  goal: number;
  /** Whether the reward has already been collected. */
  claimed: boolean;
}

export interface PlayerProgress {
  /** Consecutive days with at least one completed run. */
  streak: number;
  /** Best consecutive-day streak ever reached. */
  longestStreak: number;
  /** "YYYY-MM-DD" of the last day a run was completed. */
  lastActiveDate: string | null;
  /** Questions answered on the current mission's date. */
  todayAnswers: number;
  /** Today's daily mission, or null if not yet initialized. */
  mission: DailyMission | null;
}

export interface MissionView {
  current: number;
  goal: number;
  claimed: boolean;
  /** True only when the reward can actually be claimed right now. */
  eligible: boolean;
  hasMission: boolean;
}

export const MISSION_GOAL = 10;

const STORAGE_KEY = "cq_progress_v1";

const EMPTY: PlayerProgress = {
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  todayAnswers: 0,
  mission: null,
};

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return dateKey(new Date());
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateKey(d);
}

function createEmpty(): PlayerProgress {
  return { ...EMPTY, mission: null };
}

/** A streak is "alive" if the player was active today or yesterday. */
export function effectiveStreak(p: PlayerProgress | null): number {
  if (!p || !p.lastActiveDate) return 0;
  const today = todayKey();
  if (p.lastActiveDate === today || p.lastActiveDate === yesterdayKey()) {
    return p.streak;
  }
  return 0;
}

type Listener = () => void;
const listeners = new Set<Listener>();
let cache: PlayerProgress | null = null;
let memoryFallback: PlayerProgress | null = null;

function emit() {
  for (const l of listeners) l();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Stable snapshot for `useSyncExternalStore`; lazily reads storage once. */
export function getSnapshot(): PlayerProgress {
  if (!cache) cache = readStorage();
  return cache;
}

/** Stable empty snapshot used during SSR / hydration. */
export function getServerSnapshot(): PlayerProgress {
  return EMPTY;
}

function readStorage(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmpty();
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    if (!parsed || typeof parsed !== "object") return createEmpty();
    const base: PlayerProgress = {
      streak: typeof parsed.streak === "number" ? parsed.streak : 0,
      longestStreak:
        typeof parsed.longestStreak === "number" ? parsed.longestStreak : 0,
      lastActiveDate:
        typeof parsed.lastActiveDate === "string" ? parsed.lastActiveDate : null,
      todayAnswers:
        typeof parsed.todayAnswers === "number" ? parsed.todayAnswers : 0,
      mission:
        parsed.mission && typeof parsed.mission === "object"
          ? {
              date: String(parsed.mission.date ?? todayKey()),
              goal:
                typeof parsed.mission.goal === "number"
                  ? parsed.mission.goal
                  : MISSION_GOAL,
              claimed: Boolean(parsed.mission.claimed),
            }
          : null,
    };
    return normalizeDay(base);
  } catch {
    return memoryFallback ?? createEmpty();
  }
}

function writeStorage(p: PlayerProgress): void {
  cache = p;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    memoryFallback = p;
  }
  emit();
}

/** Roll the day-specific fields forward when the calendar day changes. */
function normalizeDay(p: PlayerProgress): PlayerProgress {
  const today = todayKey();
  if (p.mission?.date !== today) {
    return {
      ...p,
      todayAnswers: 0,
      mission: { date: today, goal: MISSION_GOAL, claimed: false },
    };
  }
  return p;
}

export interface RunRecordResult {
  progress: PlayerProgress;
  /** True if this run increased the consecutive-day streak. */
  streakExtended: boolean;
}

/** Record a finished run; updates streak, today's answers, and the mission. */
export function recordRun(answersCount: number): RunRecordResult {
  const p = normalizeDay(getSnapshot());
  const today = todayKey();

  p.todayAnswers += answersCount;

  let streakExtended = false;
  if (p.lastActiveDate !== today) {
    const before = effectiveStreak(p);
    p.streak = p.lastActiveDate === yesterdayKey() ? p.streak + 1 : 1;
    p.lastActiveDate = today;
    streakExtended = p.streak > before;
  }
  p.longestStreak = Math.max(p.longestStreak, p.streak);

  writeStorage(p);
  return { progress: p, streakExtended };
}

/** Derived daily-mission view + eligibility for the UI. */
export function getMissionView(p: PlayerProgress | null): MissionView {
  const empty: MissionView = {
    current: 0,
    goal: MISSION_GOAL,
    claimed: false,
    eligible: false,
    hasMission: false,
  };
  if (!p || !p.mission) return empty;

  const current = Math.min(p.todayAnswers, p.mission.goal);
  const claimed = p.mission.claimed;
  const eligible =
    p.mission.date === todayKey() &&
    p.todayAnswers >= p.mission.goal &&
    !claimed;

  return {
    current,
    goal: p.mission.goal,
    claimed,
    eligible,
    hasMission: true,
  };
}

/** Mark today's mission as claimed (UI gates this on eligibility). */
export function claimMission(): PlayerProgress {
  const p = normalizeDay(getSnapshot());
  if (!p.mission) {
    p.mission = { date: todayKey(), goal: MISSION_GOAL, claimed: true };
  } else {
    p.mission.claimed = true;
  }
  writeStorage(p);
  return p;
}
