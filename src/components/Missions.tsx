"use client";

/* eslint-disable react-hooks/set-state-in-effect */
// The page reads persisted rhythm-goal state from localStorage after mount;
// the initial state is a safe SSR placeholder, and the post-mount setState is
// intentional hydration, not a derived-state anti-pattern.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { DOMAIN_ORDER } from "@/lib/domains";
import type { Domain } from "@/lib/types";
import { GOAL_LABELS, computeStreak, todayKey, type DailyGoal } from "@/lib/study";

const GOAL_KEY = "cq_dailyGoal";
const LAST_RUN_KEY = "arcade_lastRunDate";

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function startOfThisWeek(now: number): number {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  // Treat Monday as the start of the week.
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = (day + 6) % 7; // days since Monday
  d.setDate(d.getDate() - diff);
  return d.getTime();
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

interface Mission {
  id: string;
  label: string;
  goal: number;
  current: number;
  done: boolean;
  unit?: string;
}

export default function Missions() {
  const { runs, bestScore, loaded } = useProgress();

  // Capture "now" on the client so the day/week boundaries are stable for the
  // lifetime of the mount. Initial value is null until hydration runs.
  const [now, setNow] = useState<number | null>(null);

  // Hydrate the rhythm-goal tie-in from localStorage after mount so SSR
  // matches the first client render.
  const [goal, setGoal] = useState<DailyGoal>({
    type: "run",
    completedDates: [],
  });
  useEffect(() => {
    setNow(Date.now());
    setGoal(loadJSON<DailyGoal>(GOAL_KEY, { type: "run", completedDates: [] }));
  }, []);

  const todays = useMemo(
    () => (now === null ? [] : runs.filter((r) => r.timestamp >= startOfDay(now))),
    [runs, now],
  );

  const thisWeeks = useMemo(
    () => (now === null ? [] : runs.filter((r) => r.timestamp >= startOfThisWeek(now))),
    [runs, now],
  );

  const stats = useMemo(() => {
    const questionsToday = todays.reduce((n, r) => n + r.totalQuestions, 0);
    const correctToday = todays.reduce((n, r) => n + r.correctCount, 0);
    const answeredToday = todays.reduce((n, r) => n + r.answers.length, 0);
    const explored = new Set<Domain>(
      todays.flatMap((r) => r.answers.map((a) => a.domain)),
    );
    const questionsWeek = thisWeeks.reduce((n, r) => n + r.answers.length, 0);
    const correctWeek = thisWeeks.reduce(
      (n, r) => n + r.answers.filter((a) => a.correct).length,
      0,
    );
    return {
      questionsToday,
      correctToday,
      answeredToday,
      explored,
      questionsWeek,
      correctWeek,
      runCountWeek: thisWeeks.length,
    };
  }, [todays, thisWeeks]);

  const dailyMissions: Mission[] = useMemo(
    () => [
      {
        id: "play",
        label: "Complete a challenge",
        goal: 1,
        current: todays.length,
        done: todays.length >= 1,
      },
      {
        id: "answer",
        label: "Answer 10 questions today",
        goal: 10,
        current: stats.answeredToday,
        done: stats.answeredToday >= 10,
      },
      {
        id: "accuracy",
        label: "Hit 80% accuracy today",
        goal: 80,
        unit: "%",
        current:
          stats.questionsToday > 0
            ? Math.round((stats.correctToday / stats.questionsToday) * 100)
            : 0,
        done:
          stats.questionsToday > 0 &&
          stats.correctToday / stats.questionsToday >= 0.8,
      },
      {
        id: "domains",
        label: "Practice all 4 domains",
        goal: 4,
        current: stats.explored.size,
        done: stats.explored.size >= 4,
      },
    ],
    [todays, stats],
  );

  const weeklyMissions: Mission[] = useMemo(() => {
    const today = todayKey();
    const streak = computeStreak(goal.completedDates, today);
    const weekAccuracy =
      stats.questionsWeek > 0
        ? Math.round((stats.correctWeek / stats.questionsWeek) * 100)
        : 0;
    return [
      {
        id: "runs-week",
        label: "Play 5 challenges this week",
        goal: 5,
        current: stats.runCountWeek,
        done: stats.runCountWeek >= 5,
      },
      {
        id: "questions-week",
        label: "Answer 50 questions this week",
        goal: 50,
        current: stats.questionsWeek,
        done: stats.questionsWeek >= 50,
      },
      {
        id: "streak-7",
        label: "Keep a 7-day streak alive",
        goal: 7,
        current: streak,
        unit: streak === 1 ? "day" : "days",
        done: streak >= 7,
      },
      {
        id: "week-accuracy",
        label: "Hit 70% accuracy this week",
        goal: 70,
        unit: "%",
        current: weekAccuracy,
        done: stats.questionsWeek >= 20 && weekAccuracy >= 70,
      },
    ];
  }, [stats, goal.completedDates]);

  if (!loaded) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-neutral-300">
        Loading missions…
      </div>
    );
  }

  const dailyDone = dailyMissions.filter((m) => m.done).length;
  const weeklyDone = weeklyMissions.filter((m) => m.done).length;

  // Study-rhythm tie-in: surface the user's chosen `/progress` daily goal
  // and whether it has been auto-completed (a run was logged today) or
  // manually marked done.
  const today = todayKey();
  const lastRun = loadJSON<string | null>(LAST_RUN_KEY, null);
  const rhythmAutoDone = goal.type === "run" && lastRun === today;
  const rhythmManuallyDone = goal.completedDates.includes(today);
  const rhythmDone = rhythmAutoDone || rhythmManuallyDone;
  const rhythmLabel = GOAL_LABELS[goal.type];

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Missions Hub
        </p>
        <h2 className="mt-2 text-xl font-black text-white">
          {dailyDone + weeklyDone}/{dailyMissions.length + weeklyMissions.length} complete
        </h2>
        <p className="mt-1 text-sm text-neutral-300">
          Clear today&apos;s goals to keep your streak alive. Build weekly reps to
          lock in the cert.
        </p>
      </div>

      <MissionSection
        title="Daily Missions"
        accent="cyan"
        done={dailyDone}
        total={dailyMissions.length}
      >
        <MissionList missions={dailyMissions} />
      </MissionSection>

      <MissionSection
        title="Weekly Missions"
        accent="violet"
        done={weeklyDone}
        total={weeklyMissions.length}
      >
        <MissionList missions={weeklyMissions} />
      </MissionSection>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-300">
          Today&apos;s Study Rhythm
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-neutral-800/60 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">{rhythmLabel}</p>
            <p className="text-xs text-neutral-400">
              Chosen on the Progress page · resets at midnight
            </p>
          </div>
          {rhythmDone ? (
            <span className="rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-200">
              {rhythmAutoDone ? "✓ Logged" : "✓ Done"}
            </span>
          ) : (
            <span className="rounded-lg bg-amber-500/20 px-3 py-2 text-xs font-bold text-amber-200">
              In progress
            </span>
          )}
        </div>
        <Link
          href="/progress"
          className="mt-3 block text-center text-xs font-semibold text-cyan-300 underline-offset-2 hover:underline"
        >
          ▸ Tune your daily goal on /progress
        </Link>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
          Domains practiced today
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {DOMAIN_ORDER.map((d) => {
            const done = stats.explored.has(d);
            return (
              <div
                key={d}
                className={`rounded-xl border px-3 py-2 text-xs ${
                  done
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100"
                    : "border-white/10 bg-neutral-800/60 text-neutral-400"
                }`}
              >
                {done ? "✓ " : "○ "}
                {d}
              </div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-neutral-400">
          {stats.answeredToday} questions answered today · {todays.length}{" "}
          challenge{todays.length === 1 ? "" : "s"} played ·{" "}
          {stats.runCountWeek} this week.
        </p>
      </div>
    </div>
  );
}

function MissionSection({
  title,
  accent,
  done,
  total,
  children,
}: {
  title: string;
  accent: "cyan" | "violet";
  done: number;
  total: number;
  children: React.ReactNode;
}) {
  const accentText = accent === "cyan" ? "text-cyan-300" : "text-violet-300";
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`text-xs font-semibold uppercase tracking-wide ${accentText}`}>
          {title}
        </h3>
        <span className="text-xs text-neutral-400">
          {done}/{total} complete
        </span>
      </div>
      {children}
    </section>
  );
}

function MissionList({ missions }: { missions: Mission[] }) {
  return (
    <ul className="space-y-2">
      {missions.map((m) => {
        const pct = Math.min(100, Math.round((m.current / m.goal) * 100));
        const display = m.unit
          ? `${m.current}${m.unit} / ${m.goal}${m.unit}`
          : `${m.current} / ${m.goal}`;
        return (
          <li
            key={m.id}
            className={`rounded-xl border p-3 ${
              m.done
                ? "border-emerald-400/40 bg-emerald-500/10"
                : "border-white/10 bg-neutral-800/60"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                {m.done ? "✓ " : ""}
                {m.label}
              </span>
              <span className="text-xs text-neutral-400">{display}</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-900">
              <div
                className={`h-full rounded-full transition-all ${
                  m.done
                    ? "bg-emerald-400"
                    : "bg-gradient-to-r from-cyan-400 to-violet-400"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
