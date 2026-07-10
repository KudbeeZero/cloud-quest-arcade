"use client";

import { useSyncExternalStore } from "react";
import { computeStreak, type DailyGoal } from "@/lib/study";

const GOAL_KEY = "cq_dailyGoal";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function getGoal(): DailyGoal {
  return loadJSON<DailyGoal>(GOAL_KEY, { type: "run", completedDates: [] });
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return getGoal().completedDates;
}

export default function StreakCounter() {
  const completedDates = useSyncExternalStore(subscribe, getSnapshot);
  const streak = computeStreak(completedDates);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-neutral-400">Daily streak</p>
      <p className="mt-1 text-2xl font-black text-amber-300">
        {streak}🔥
      </p>
    </div>
  );
}
