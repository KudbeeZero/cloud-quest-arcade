"use client";

import {
  getReadinessScore,
  useProgress,
  useHydrated,
  masteredCount,
  getCurrentStreak,
} from "@/lib/progress";

function scoreColor(score: number): string {
  if (score >= 80) return "from-emerald-400 to-cyan-400";
  if (score >= 50) return "from-cyan-400 via-violet-400 to-fuchsia-400";
  return "from-amber-400 to-rose-400";
}

function scoreLabel(score: number): string {
  if (score >= 90) return "Exam-ready";
  if (score >= 70) return "Almost there";
  if (score >= 40) return "Building momentum";
  if (score > 0) return "Just getting started";
  return "No data yet";
}

export default function ReadinessScore({ compact = false }: { compact?: boolean }) {
  // Subscribe so the widget updates live as progress changes.
  useProgress();
  const hydrated = useHydrated();
  const { score, runs, flashcardsMastered, gotchasStudied } = hydrated
    ? getReadinessScore()
    : { score: 0, runs: 0, flashcardsMastered: 0, gotchasStudied: 0 };
  const streak = hydrated ? getCurrentStreak() : 0;
  const mastered = hydrated ? masteredCount() : 0;

  if (compact) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
              Exam Readiness
            </p>
            <p className="mt-1 text-xs text-neutral-400">{scoreLabel(score)}</p>
          </div>
          <p className="text-3xl font-black text-white">{score}</p>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${scoreColor(score)} transition-all duration-500`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  }

  const rows = [
    { label: "Quiz runs completed", value: runs, goal: 5 },
    { label: "Flashcards mastered", value: flashcardsMastered, goal: 10 },
    { label: "Gotchas studied", value: gotchasStudied, goal: 20 },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Exam Readiness
          </p>
          <h2 className="mt-2 text-4xl font-black text-white">{score}/100</h2>
          <p className="mt-1 text-sm font-semibold text-emerald-300">
            {scoreLabel(score)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-neutral-400">
            Streak
          </p>
          <p className="text-2xl font-black text-amber-300">
            {streak}🔥
          </p>
        </div>
      </div>

      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${scoreColor(score)} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>

      <ul className="mt-4 space-y-2 text-xs">
        {rows.map((r) => {
          const pct = Math.min(100, Math.round((r.value / r.goal) * 100));
          return (
            <li key={r.label} className="flex items-center gap-3">
              <span className="w-40 shrink-0 text-neutral-300">{r.label}</span>
              <span className="flex-1">
                <span className="block h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                    style={{ width: `${pct}%` }}
                  />
                </span>
              </span>
              <span className="w-16 shrink-0 text-right font-semibold text-neutral-200">
                {r.value}/{r.goal}
              </span>
            </li>
          );
        })}
        <li className="flex items-center gap-3">
          <span className="w-40 shrink-0 text-neutral-300">Cards mastered</span>
          <span className="flex-1">
            <span className="block h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
              <span
                className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                style={{ width: `${Math.min(100, mastered * 10)}%` }}
              />
            </span>
          </span>
          <span className="w-16 shrink-0 text-right font-semibold text-neutral-200">
            {mastered}
          </span>
        </li>
      </ul>
    </div>
  );
}
