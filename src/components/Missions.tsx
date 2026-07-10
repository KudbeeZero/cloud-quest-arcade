"use client";

import { useMemo } from "react";
import { useProgress } from "@/lib/useProgress";
import { DOMAIN_ORDER } from "@/lib/domains";
import type { Domain } from "@/lib/types";

function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

interface Mission {
  id: string;
  label: string;
  goal: number;
  current: number;
  done: boolean;
}

export default function Missions() {
  const { runs, bestScore, loaded } = useProgress();

  const todays = useMemo(
    () => runs.filter((r) => r.timestamp >= startOfToday()),
    [runs],
  );

  const { missions, domainsToday, totalAnswered } = useMemo(() => {
    const questionsToday = todays.reduce((n, r) => n + r.totalQuestions, 0);
    const correctToday = todays.reduce((n, r) => n + r.correctCount, 0);
    const answeredToday = todays.reduce((n, r) => n + r.answers.length, 0);
    const explored = new Set<Domain>(
      todays.flatMap((r) => r.answers.map((a) => a.domain)),
    );

    const list: Mission[] = [
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
        current: answeredToday,
        done: answeredToday >= 10,
      },
      {
        id: "accuracy",
        label: "Hit 80% accuracy today",
        goal: 80,
        current:
          questionsToday > 0 ? Math.round((correctToday / questionsToday) * 100) : 0,
        done: questionsToday > 0 && correctToday / questionsToday >= 0.8,
      },
      {
        id: "domains",
        label: "Practice all 4 domains",
        goal: 4,
        current: explored.size,
        done: explored.size >= 4,
      },
      {
        id: "best",
        label: "Beat 1,000 best score",
        goal: 1000,
        current: bestScore,
        done: bestScore >= 1000,
      },
    ];

    return { missions: list, domainsToday: explored, totalAnswered: answeredToday };
  }, [todays, bestScore]);

  if (!loaded) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-neutral-300">
        Loading missions…
      </div>
    );
  }

  const completed = missions.filter((m) => m.done).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Daily Missions
        </p>
        <h2 className="mt-2 text-xl font-black text-white">
          {completed}/{missions.length} complete
        </h2>
        <p className="mt-1 text-sm text-neutral-300">
          {completed === missions.length
            ? "All missions cleared — nice work, commander!"
            : "Clear today's goals to keep your streak alive."}
        </p>
      </div>

      <ul className="space-y-2">
        {missions.map((m) => {
          const pct = Math.min(100, Math.round((m.current / m.goal) * 100));
          return (
            <li
              key={m.id}
              className={`rounded-2xl border p-4 ${
                m.done
                  ? "border-emerald-400/40 bg-emerald-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  {m.done ? "✓ " : ""}
                  {m.label}
                </span>
                <span className="text-xs text-neutral-400">
                  {m.current}/{m.goal}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
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

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
          Domains practiced today
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {DOMAIN_ORDER.map((d) => {
            const done = domainsToday.has(d);
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
          {totalAnswered} questions answered today · {todays.length} challenge
          {todays.length === 1 ? "" : "s"} played.
        </p>
      </div>
    </div>
  );
}
