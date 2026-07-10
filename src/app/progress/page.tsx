"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import type { Domain } from "@/lib/types";
import {
  DOMAIN_ORDER,
  getDomainStats,
  masteryLabel,
  type DomainStat,
} from "@/lib/progress";

const SERVER_SNAPSHOT: DomainStat[] = [];

// Cache the computed stats so useSyncExternalStore can return a stable
// reference (and only recompute when the persisted tallies actually change).
let cachedKey = "";
let cachedStats: DomainStat[] = SERVER_SNAPSHOT;

function subscribe() {
  return () => {};
}

function getSnapshot(): DomainStat[] {
  const key =
    typeof window === "undefined"
      ? ""
      : window.localStorage.getItem("arcade_domain_progress") ?? "";
  if (key !== cachedKey) {
    cachedKey = key;
    cachedStats = getDomainStats();
  }
  return cachedStats;
}

const DOMAIN_BADGE: Record<Domain, string> = {
  "Cloud Concepts": "☁️",
  "Security and Compliance": "🛡️",
  "Cloud Technology and Services": "⚙️",
  "Billing, Pricing and Support": "💡",
};

function masteryColor(mastery: number): string {
  if (mastery >= 85) return "from-emerald-400 to-cyan-400";
  if (mastery >= 65) return "from-cyan-400 to-violet-400";
  if (mastery >= 40) return "from-amber-400 to-fuchsia-400";
  if (mastery > 0) return "from-neutral-400 to-neutral-500";
  return "from-neutral-700 to-neutral-700";
}

function MasteryBar({ value }: { value: number }) {
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
        className={`h-full rounded-full bg-gradient-to-r ${masteryColor(pct)} transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function ProgressPage() {
  const stats = useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);

  const hasAttempts = stats.some((s) => s.attempted > 0);
  const overall = hasAttempts
    ? Math.round(
        stats.reduce((sum, s) => sum + s.mastery, 0) / DOMAIN_ORDER.length,
      )
    : 0;

  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12">
      <header className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Cloud Quest Arcade
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          Domain Mastery
        </h1>
        <p className="mt-2 text-sm text-neutral-300">
          Your long-term progress across the four AWS Cloud Practitioner (CLF-C02)
          domains.
        </p>
      </header>

      <div className="mx-auto mt-8 max-w-md">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
                Overall mastery
              </p>
              <p className="mt-1 text-3xl font-black text-white">
                {`${overall}%`}
              </p>
            </div>
            <span
              className={`rounded-xl px-3 py-1 text-xs font-semibold ${
                hasAttempts
                  ? "bg-cyan-400/15 text-cyan-100"
                  : "bg-neutral-800 text-neutral-400"
              }`}
            >
              {masteryLabel(overall)}
            </span>
          </div>
          <MasteryBar value={overall} />
        </div>

        {!hasAttempts && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-center text-sm text-neutral-300">
            No missions logged yet. Play a round to start building your mastery
            profile.
          </div>
        )}

        <div className="mt-4 space-y-3">
          {stats.map((s) => (
            <div
              key={s.domain}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center gap-2">
                <span aria-hidden className="text-lg">
                  {DOMAIN_BADGE[s.domain]}
                </span>
                <h2 className="flex-1 text-sm font-semibold text-white">
                  {s.domain}
                </h2>
                <span
                  className={`rounded-lg px-2 py-0.5 text-xs font-semibold ${
                    s.attempted > 0
                      ? "bg-violet-400/15 text-violet-100"
                      : "bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {masteryLabel(s.mastery)}
                </span>
              </div>

              <div className="mt-3">
                <MasteryBar value={s.mastery} />
                <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
                  <span>Mastery {s.mastery}%</span>
                  <span>
                    {s.attempted > 0
                      ? `${s.accuracy}% accuracy`
                      : "Not attempted"}
                  </span>
                </div>
              </div>

              <p className="mt-2 text-xs text-neutral-400">
                Practiced {Math.min(s.attempted, s.total)}/{s.total} questions
                {s.attempted > s.total ? " (repeats included)" : ""}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link
            href="/"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center text-lg font-black text-white transition hover:border-white/30"
          >
            ◂ Home
          </Link>
          <Link
            href="/"
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 text-center text-lg font-black text-neutral-900 shadow-lg shadow-violet-500/20 transition hover:brightness-110"
          >
            ▸ Play
          </Link>
        </div>

        <footer className="mx-auto mt-8 text-center text-xs text-neutral-500">
          Original practice content. Not affiliated with or endorsed by Amazon
          Web Services.
        </footer>
      </div>
    </main>
  );
}
