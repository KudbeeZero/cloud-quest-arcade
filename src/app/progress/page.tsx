"use client";

import { useMemo } from "react";
import ContentShell from "@/components/ContentShell";
import { useProgress } from "@/lib/useProgress";
import { domainAccuracy, clearRuns } from "@/lib/progress";
import { DOMAIN_BADGE } from "@/lib/domains";
import { rankForAccuracy } from "@/lib/scoring";
import type { Domain } from "@/lib/types";

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ProgressPage() {
  const { runs, bestScore, loaded } = useProgress();

  const stats = useMemo(() => {
    const totalQuestions = runs.reduce((n, r) => n + r.totalQuestions, 0);
    const totalCorrect = runs.reduce((n, r) => n + r.correctCount, 0);
    const avgAccuracy =
      runs.length > 0
        ? Math.round(
            runs.reduce((n, r) => n + r.accuracy, 0) / runs.length,
          )
        : 0;
    const bestStreak = runs.reduce((m, r) => Math.max(m, r.bestStreak), 0);
    return {
      totalQuestions,
      totalCorrect,
      avgAccuracy,
      bestStreak,
      overallAccuracy:
        totalQuestions > 0
          ? Math.round((totalCorrect / totalQuestions) * 100)
          : 0,
    };
  }, [runs]);

  const accuracy = useMemo(() => domainAccuracy(runs), [runs]);

  if (!loaded) {
    return (
      <ContentShell eyebrow="Your Stats" title="Progress">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-neutral-300">
          Loading progress…
        </div>
      </ContentShell>
    );
  }

  return (
    <ContentShell
      eyebrow="Your Stats"
      title="Progress"
      description="A snapshot of every challenge you've played, stored locally on this device."
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Best Score
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">
            {bestScore.toLocaleString()}
          </h2>
          <p className="mt-1 text-sm text-neutral-300">
            {runs.length > 0
              ? `Rank: ${rankForAccuracy(stats.overallAccuracy)} · ${runs.length} challenges played`
              : "Play a challenge to start tracking progress."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Played" value={String(runs.length)} />
          <Stat label="Questions" value={String(stats.totalQuestions)} />
          <Stat label="Avg accuracy" value={`${stats.avgAccuracy}%`} />
          <Stat label="Best streak" value={String(stats.bestStreak)} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
            Domain accuracy
          </p>
          <div className="space-y-3">
            {accuracy.map((a) => (
              <div key={a.domain}>
                <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-neutral-200">
                      <span aria-hidden className="mr-1">
                        {DOMAIN_BADGE[a.domain as Domain]}
                      </span>
                      {a.domain}
                    </span>
                  <span className="text-neutral-400">
                    {a.correct}/{a.total} · {a.pct}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                    style={{ width: `${a.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
            Run history
          </p>
          {runs.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No runs yet. Finish a challenge to see it here.
            </p>
          ) : (
            <ul className="space-y-2">
              {runs.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-neutral-800/60 px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {r.score.toLocaleString()} XP
                    </p>
                    <p className="text-neutral-400">{formatDate(r.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-200">
                      {r.correctCount}/{r.totalQuestions}
                    </p>
                    <p className="text-neutral-400">
                      {r.difficulty === "all" ? "Mixed" : r.difficulty} ·{" "}
                      {r.accuracy}%
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {runs.length > 0 && (
          <button
            onClick={() => clearRuns()}
            className="w-full rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:brightness-110"
          >
            Clear run history
          </button>
        )}
      </div>
    </ContentShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-800/70 p-3 text-center">
      <dt className="text-[10px] uppercase tracking-wide text-neutral-400">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-bold text-white">{value}</dd>
    </div>
  );
}
