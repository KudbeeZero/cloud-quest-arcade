"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DOMAIN_BADGE,
  DOMAIN_ORDER,
  getDomainProgress,
  getOverallProgress,
  loadProgress,
  resetProgress,
  type MasteryLevel,
  type ProgressData,
} from "@/lib/progress";

const MASTERY_META: Record<
  MasteryLevel,
  { label: string; text: string; bar: string; ring: string }
> = {
  locked: {
    label: "Locked",
    text: "text-neutral-400",
    bar: "bg-neutral-600",
    ring: "border-white/10 bg-neutral-800/60",
  },
  novice: {
    label: "Novice",
    text: "text-rose-300",
    bar: "bg-rose-400",
    ring: "border-rose-400/40 bg-rose-400/10",
  },
  skilled: {
    label: "Skilled",
    text: "text-amber-300",
    bar: "bg-amber-400",
    ring: "border-amber-400/40 bg-amber-400/10",
  },
  mastered: {
    label: "Mastered",
    text: "text-emerald-300",
    bar: "bg-emerald-400",
    ring: "border-emerald-400/40 bg-emerald-400/10",
  },
};

function DomainBar({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
    >
      <div
        className={`h-full rounded-full ${color} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData>(() =>
    loadProgress(),
  );

  function handleReset() {
    if (
      progress &&
      progress.bestStreak > 0 &&
      !window.confirm("Reset all domain progress? This cannot be undone.")
    ) {
      return;
    }
    setProgress(resetProgress());
  }

  const domainProgress = progress ? getDomainProgress(progress) : [];
  const overall = progress ? getOverallProgress(progress) : null;

  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12">
      <header className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Command Center
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          Domain Mastery
        </h1>
        <p className="mt-2 text-sm text-neutral-300">
          Track your per-domain accuracy across the four CLF-C02 domains.
          Progress is saved on this device only.
        </p>
      </header>

      <div className="mx-auto mt-8 w-full max-w-md">
        {overall && (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Accuracy" value={`${overall.accuracy}%`} />
            <Stat
              label="Answered"
              value={overall.totalAnswered.toLocaleString()}
            />
            <Stat label="Best streak" value={String(overall.bestStreak)} />
            <Stat
              label="Mastered"
              value={`${overall.masteredCount}/${DOMAIN_ORDER.length}`}
            />
          </section>
        )}

        <section className="mt-6 flex flex-col gap-3">
          {domainProgress.map((d) => {
            const meta = MASTERY_META[d.mastery];
            return (
              <div
                key={d.domain}
                className={`rounded-2xl border p-4 ${meta.ring}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span aria-hidden className="text-lg">
                      {DOMAIN_BADGE[d.domain]}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {d.domain}
                    </span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${meta.text}`}
                  >
                    {meta.label}
                  </span>
                </div>

                <div className="mt-3">
                  <DomainBar value={d.accuracy} color={meta.bar} />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                  <span>{d.accuracy}% accuracy</span>
                  <span>
                    {d.correct}/{d.answered} correct
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {overall && overall.totalAnswered === 0 && (
          <p className="mt-6 text-center text-sm text-neutral-400">
            No missions logged yet. Play a round to start building mastery.
          </p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/50"
          >
            ◂ Back to Arcade
          </Link>
          <button
            onClick={handleReset}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-neutral-300 transition hover:border-rose-400/40 hover:text-rose-200"
          >
            ⟲ Reset Progress
          </button>
        </div>
      </div>

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>
    </main>
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
