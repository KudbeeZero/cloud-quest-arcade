"use client";

import { useState } from "react";
import Link from "next/link";
import { useReadinessScore } from "@/components/ReadinessScore";
import { useProgress } from "@/lib/useProgress";
import { computeStreak, todayKey, type DailyGoal } from "@/lib/study";
import type { GeneratedGotcha } from "@/app/api/deepseek/gotchas/route";

const GOAL_KEY = "cq_dailyGoal";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const QUICK_LINKS = [
  { href: "/flashcards", icon: "🃏", title: "Flashcards", desc: "Flip and memorize" },
  { href: "/missions", icon: "🎯", title: "Missions", desc: "Daily + weekly goals" },
  { href: "/gotchas", icon: "⚠️", title: "Gotchas", desc: "Exam traps to avoid" },
];

export default function StudyDashboard() {
  const { score, loaded: readinessLoaded } = useReadinessScore();
  const { runs, loaded: progressLoaded } = useProgress();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [gotchas, setGotchas] = useState<GeneratedGotcha[]>([]);

  const goal = loadJSON<DailyGoal>(GOAL_KEY, { type: "run", completedDates: [] });
  const streak = computeStreak(goal.completedDates, todayKey());

  const runsToday = runs.filter((r) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return r.timestamp >= d.getTime();
  }).length;

  async function generateQuestions() {
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/deepseek/gotchas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 5 }),
      });
      const data = (await res.json()) as { gotchas?: GeneratedGotcha[]; error?: string };
      if (!res.ok || data.error) {
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      const fresh = data.gotchas ?? [];
      setGotchas(fresh);
      setMessage(`Generated ${fresh.length} new gotchas. Review them below.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard
          label="Exam Readiness"
          value={readinessLoaded ? `${score}%` : "…"}
          hint={readinessLoaded ? `${score}% to cert-ready` : "Calculating…"}
          accent="cyan"
        />
        <StatCard
          label="Daily Streak"
          value={progressLoaded ? `${streak}🔥` : "…"}
          hint={streak > 0 ? "Keep the chain alive" : "Start a rep today"}
          accent="amber"
        />
        <StatCard
          label="Runs Today"
          value={progressLoaded ? String(runsToday) : "…"}
          hint={runsToday === 1 ? "1 challenge completed" : `${runsToday} challenges completed`}
          accent="emerald"
        />
      </div>

      <section>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
          Quick Links
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/50 hover:bg-white/10"
            >
              <span className="text-2xl">{link.icon}</span>
              <p className="mt-2 text-sm font-bold text-white">{link.title}</p>
              <p className="text-xs text-neutral-400">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-neutral-300">
          Generate fresh CLF-C02 practice gotchas via DeepSeek.
        </p>
        <button
          onClick={generateQuestions}
          disabled={loading}
          className="mt-3 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-xs font-black text-neutral-900 transition hover:brightness-110 disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Generating…" : "✨ Generate New Gotchas"}
        </button>
        {message && <p className="mt-3 text-xs text-cyan-300">{message}</p>}
        {error && <p className="mt-3 text-xs text-rose-300">{error}</p>}
      </div>

      {gotchas.length > 0 && (
        <section className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Generated Gotchas
          </p>
          {gotchas.map((g) => (
            <details
              key={g.id}
              className="group rounded-2xl border border-white/10 bg-white/5 p-4 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                      {g.domain}
                    </span>
                    <p className="mt-1 text-sm font-semibold text-white">{g.trap}</p>
                  </div>
                  <span className="mt-1 shrink-0 text-cyan-300 transition group-open:rotate-45">
                    +
                  </span>
                </div>
              </summary>
              <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
                {g.why}
              </p>
            </details>
          ))}
        </section>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "cyan" | "amber" | "emerald";
}) {
  const text =
    accent === "cyan"
      ? "text-cyan-300"
      : accent === "amber"
        ? "text-amber-300"
        : "text-emerald-300";
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-neutral-400">{label}</p>
      <p className={`mt-1 text-2xl font-black ${text}`}>{value}</p>
      <p className="mt-1 text-xs text-neutral-500">{hint}</p>
    </div>
  );
}
