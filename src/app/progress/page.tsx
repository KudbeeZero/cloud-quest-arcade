"use client";

import Link from "next/link";
import ContentShell from "@/components/ContentShell";
import type { DifficultyFilter } from "@/components/ArcadeGame";

type RunSummary = {
  id: string;
  date: number;
  score: number;
  accuracy: number;
  streak: number;
  questionCount: number;
  difficulty: DifficultyFilter;
};

function loadRuns(): RunSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("arcade_runHistory");
    if (saved) {
      const parsed = JSON.parse(saved) as RunSummary[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export default function ProgressPage() {
  const runs = loadRuns();

  const totalRuns = runs.length;
  const avgScore =
    totalRuns > 0
      ? Math.round(runs.reduce((sum, r) => sum + r.score, 0) / totalRuns)
      : 0;
  const bestAccuracy =
    totalRuns > 0 ? Math.max(...runs.map((r) => r.accuracy)) : 0;
  const bestStreak =
    totalRuns > 0 ? Math.max(...runs.map((r) => r.streak)) : 0;
  const recentRuns = runs.slice(0, 20);

  return (
    <ContentShell title="Progress" backLabel="Home" backHref="/">
      <div className="cq-prose">
        <p className="text-sm text-neutral-400">
          Your last {Math.min(runs.length, 20)} runs.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Runs" value={String(totalRuns)} />
          <StatCard label="Avg Score" value={avgScore.toLocaleString()} />
          <StatCard label="Best Accuracy" value={`${bestAccuracy}%`} />
          <StatCard label="Best Streak" value={String(bestStreak)} />
        </div>
        {recentRuns.length > 0 ? (
          <div className="mt-8 overflow-x-auto">
            <h2>Recent runs</h2>
            <table className="mt-4 w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400">
                  <th className="pb-2 pr-4">Date</th>
                  <th className="pb-2 pr-4">Score</th>
                  <th className="pb-2 pr-4">Accuracy</th>
                  <th className="pb-2 pr-4">Streak</th>
                  <th className="pb-2 pr-4">Questions</th>
                  <th className="pb-2">Mode</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr key={run.id} className="border-b border-white/5">
                    <td className="py-2 pr-4 text-neutral-300">
                      {new Date(run.date).toLocaleDateString()}{" "}
                      {new Date(run.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-2 pr-4 text-amber-300">
                      {run.score.toLocaleString()}
                    </td>
                    <td className="py-2 pr-4">{`${run.accuracy}%`}</td>
                    <td className="py-2 pr-4 text-fuchsia-300">
                      {run.streak}
                    </td>
                    <td className="py-2 pr-4">{run.questionCount}</td>
                    <td className="py-2 capitalize text-neutral-400">
                      {run.difficulty === "all" ? "All" : run.difficulty}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-8 text-sm text-neutral-500">No runs yet. Play the arcade to build history.</p>
        )}
      </div>
    </ContentShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
      <dt className="text-[10px] uppercase tracking-wide text-neutral-400">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-black text-white">{value}</dd>
    </div>
  );
}
