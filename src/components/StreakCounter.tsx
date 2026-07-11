"use client";

import { useSyncExternalStore } from "react";
import { computeStreak, type DailyGoal } from "@/lib/study";

const GOAL_KEY = "cq_dailyGoal";

// getSnapshot MUST return a referentially-stable value on unchanged data.
// Returning a fresh array/object from JSON.parse breaks useSyncExternalStore
// and causes an infinite render loop (React compares snapshots with Object.is).
// Returning the raw localStorage string is stable — it's the same string
// reference until something explicitly writes new data to that key.
function readGoalRaw(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(GOAL_KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export default function StreakCounter() {
  const raw = useSyncExternalStore(subscribe, readGoalRaw, () => "");

  let dates: string[] = [];
  if (raw) {
    try {
      const goal = JSON.parse(raw) as DailyGoal;
      dates = goal.completedDates ?? [];
    } catch {
      dates = [];
    }
  }

  const streak = computeStreak(dates);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-neutral-400">Daily streak</p>
      <p className="mt-1 text-2xl font-black text-amber-300">{streak}🔥</p>
    </div>
  );
}
