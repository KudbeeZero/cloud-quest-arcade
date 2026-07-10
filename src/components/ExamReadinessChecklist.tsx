"use client";

import {
  useProgress,
  useHydrated,
  getActivityWindow,
  masteredCount,
  totalRunsCompleted,
  gotchasStudiedCount,
  getCurrentStreak,
} from "@/lib/progress";

interface ChecklistItem {
  label: string;
  done: boolean;
}

export default function ExamReadinessChecklist() {
  // Subscribe to live updates.
  useProgress();
  const hydrated = useHydrated();

  const week = hydrated ? getActivityWindow(7) : {
    date: "window",
    quizzesCompleted: 0,
    flashcardsReviewed: 0,
    bestAccuracy: 0,
    gotchasStudied: 0,
  };
  const runs = hydrated ? totalRunsCompleted() : 0;
  const mastered = hydrated ? masteredCount() : 0;
  const gotchas = hydrated ? gotchasStudiedCount() : 0;
  const streak = hydrated ? getCurrentStreak() : 0;

  const items: ChecklistItem[] = [
    { label: "Complete your first quiz run", done: runs >= 1 },
    { label: "Finish 3 quiz runs", done: runs >= 3 },
    { label: "Review 10 flashcards this week", done: week.flashcardsReviewed >= 10 },
    { label: "Master 5 cards", done: mastered >= 5 },
    { label: "Study 15 explanation 'gotchas'", done: gotchas >= 15 },
    { label: "Hit a 3-day study streak", done: streak >= 3 },
    { label: "Score 80%+ on a quiz", done: week.bestAccuracy >= 80 },
  ];

  const done = items.filter((i) => i.done).length;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Exam readiness checklist
          </p>
          <p className="text-xs text-neutral-400">
            Milestones toward sitting the CLF-C02
          </p>
        </div>
        <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-cyan-200">
          {done}/{items.length}
        </span>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-sm">
            <span
              aria-hidden
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-black ${
                item.done
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-neutral-800 text-neutral-500"
              }`}
            >
              {item.done ? "✓" : ""}
            </span>
            <span
              className={
                item.done
                  ? "font-semibold text-emerald-300"
                  : "text-neutral-300"
              }
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
