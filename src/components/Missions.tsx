"use client";

import { getActivityWindow, masteredCount, useProgress } from "@/lib/progress";

interface Mission {
  id: string;
  label: string;
  current: number;
  goal: number;
}

function pct(current: number, goal: number): number {
  if (goal <= 0) return 100;
  return Math.max(0, Math.min(100, Math.round((current / goal) * 100)));
}

export default function Missions() {
  const progress = useProgress();

  const today = progress.activity[localDateKey()] ?? {
    date: localDateKey(),
    quizzesCompleted: 0,
    flashcardsReviewed: 0,
    bestAccuracy: 0,
  };
  const week = getActivityWindow(7);
  const mastered = masteredCount();

  const daily: Mission[] = [
    {
      id: "d-quiz",
      label: "Complete 1 full quiz",
      current: today.quizzesCompleted,
      goal: 1,
    },
    {
      id: "d-review",
      label: "Review 5 flashcards",
      current: today.flashcardsReviewed,
      goal: 5,
    },
    {
      id: "d-master",
      label: "Master 3 cards",
      current: mastered,
      goal: 3,
    },
  ];

  const weekly: Mission[] = [
    {
      id: "w-quiz",
      label: "Complete 3 full quizzes",
      current: week.quizzesCompleted,
      goal: 3,
    },
    {
      id: "w-review",
      label: "Review 20 flashcards",
      current: week.flashcardsReviewed,
      goal: 20,
    },
    {
      id: "w-accuracy",
      label: "Score 80%+ on a quiz",
      current: week.bestAccuracy >= 80 ? 1 : 0,
      goal: 1,
    },
    {
      id: "w-master",
      label: "Master 10 cards",
      current: mastered,
      goal: 10,
    },
  ];

  const dailyDone = daily.filter((m) => m.current >= m.goal).length;
  const weeklyDone = weekly.filter((m) => m.current >= m.goal).length;

  return (
    <section className="flex flex-col gap-5">
      <MissionGroup
        title="Daily missions"
        subtitle="Reset every day"
        done={dailyDone}
        total={daily.length}
        missions={daily}
      />
      <MissionGroup
        title="Weekly missions"
        subtitle="Rolling 7-day window"
        done={weeklyDone}
        total={weekly.length}
        missions={weekly}
      />
    </section>
  );
}

function MissionGroup({
  title,
  subtitle,
  done,
  total,
  missions,
}: {
  title: string;
  subtitle: string;
  done: number;
  total: number;
  missions: Mission[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            {title}
          </p>
          <p className="text-xs text-neutral-400">{subtitle}</p>
        </div>
        <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-cyan-200">
          {done}/{total}
        </span>
      </div>
      <ul className="space-y-3">
        {missions.map((m) => {
          const complete = m.current >= m.goal;
          const shown = Math.min(m.current, m.goal);
          return (
            <li key={m.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span
                  className={complete ? "font-semibold text-emerald-300" : "text-neutral-200"}
                >
                  <span aria-hidden className="mr-1">
                    {complete ? "✓" : "○"}
                  </span>
                  {m.label}
                </span>
                <span className="text-xs text-neutral-400">
                  {shown}/{m.goal}
                </span>
              </div>
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={pct(m.current, m.goal)}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    complete
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                      : "bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"
                  }`}
                  style={{ width: `${pct(m.current, m.goal)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
