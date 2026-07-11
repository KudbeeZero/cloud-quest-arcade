"use client";

/* eslint-disable react-hooks/set-state-in-effect */
// The page reads persisted study state from localStorage after mount; the
// "Loading…" guard keeps the server and first client render identical, so the
// post-mount setState is intentional hydration, not a derived-state anti-pattern.

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  computeLongestStreak,
  computeStreak,
  GOAL_LABELS,
  todayKey,
  type DailyGoal,
  type DailyGoalType,
} from "@/lib/study";
import {
  GOTCHAS,
  countReviewed,
  getGotchasServerSnapshot,
  getGotchasSnapshot,
  loadGotchaProgress,
  reviewedPct,
  subscribeGotchas,
  type GotchaTopicId,
} from "@/lib/gotchas";

const GOAL_TYPES: DailyGoalType[] = ["run", "flashcards", "study"];

const READINESS_TOPICS: { id: GotchaTopicId; label: string; hint: string }[] = [
  { id: "shared", label: "Shared Responsibility Model", hint: "What AWS vs. you secure" },
  { id: "regions", label: "Regions vs. AZs vs. Edge", hint: "Global infrastructure" },
  { id: "wellarch", label: "Well-Architected Pillars", hint: "6 pillars overview" },
  { id: "pricing", label: "Pricing Models", hint: "On-demand, Savings Plans, Spot, Reserved" },
  { id: "compute", label: "Compute Services", hint: "EC2, Lambda, Elastic Beanstalk" },
  { id: "storage", label: "Storage Services", hint: "S3, EBS, Glacier, EFS" },
  { id: "databases", label: "Database Services", hint: "RDS, DynamoDB, Aurora" },
  { id: "network", label: "Networking & VPC", hint: "VPC, subnets, security groups, Route 53" },
  { id: "security", label: "Security & Compliance", hint: "IAM, KMS, Shield, Artifact" },
  { id: "monitor", label: "Monitoring & Logging", hint: "CloudWatch, CloudTrail" },
  { id: "ha", label: "High Availability & Elasticity", hint: "Auto Scaling, Load Balancing" },
  { id: "cost", label: "Cost Management", hint: "Cost Explorer, Budgets, Calculator" },
];

const GOAL_KEY = "cq_dailyGoal";
const READINESS_KEY = "cq_readiness";
const LAST_RUN_KEY = "arcade_lastRunDate";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable; state stays in-memory for the session
  }
}

export default function ProgressPage() {
  const [goal, setGoal] = useState<DailyGoal>({
    type: "run",
    completedDates: [],
  });
  const [readiness, setReadiness] = useState<Record<string, boolean>>({});
  const [hydrationDone, setHydrationDone] = useState(false);
  // `getSnapshot` returns the raw localStorage STRING (a stable primitive) so
  // React's Object.is comparison doesn't fire on every render — see the
  // `useSyncExternalStore` rule in context.md. Parsing happens in render.
  const gotchasRaw = useSyncExternalStore(
    subscribeGotchas,
    getGotchasSnapshot,
    getGotchasServerSnapshot,
  );
  const [gotchas, setGotchas] = useState<Record<string, boolean>>({});

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  // The "Loading…" guard keeps server and first client render identical.
  useEffect(() => {
    setGoal(loadJSON<DailyGoal>(GOAL_KEY, { type: "run", completedDates: [] }));
    setReadiness(loadJSON<Record<string, boolean>>(READINESS_KEY, {}));
    setGotchas(loadGotchaProgress());
    setHydrationDone(true);
  }, [gotchasRaw]);

  function setGoalType(type: DailyGoalType) {
    const updated = { ...goal, type };
    setGoal(updated);
    saveJSON(GOAL_KEY, updated);
  }

  function toggleTopic(id: string) {
    const updated = { ...readiness, [id]: !readiness[id] };
    setReadiness(updated);
    saveJSON(READINESS_KEY, updated);
  }

  const today = todayKey();

  // A "run" goal is auto-credited when the game recorded a run today.
  const lastRun = loadJSON<string | null>(LAST_RUN_KEY, null);
  const runDoneToday = goal.type === "run" && lastRun === today;

  const doneToday = useMemo(() => {
    if (runDoneToday) return true;
    return goal.completedDates.includes(today);
  }, [goal, today, runDoneToday]);

  function markDoneToday() {
    if (goal.completedDates.includes(today)) return;
    const updated = {
      ...goal,
      completedDates: [...goal.completedDates, today],
    };
    setGoal(updated);
    saveJSON(GOAL_KEY, updated);
  }

  const streak = computeStreak(goal.completedDates, today);
  const bestStreak = computeLongestStreak(goal.completedDates);

  // --- Gotcha mastery + per-topic mastery counts ----------------------------
  const reviewedGotchaCount = countReviewed(gotchas);
  const gotchasPct = reviewedPct(gotchas);
  const gotchasByTopic = useMemo(() => {
    const map: Record<string, { total: number; reviewed: number }> = {};
    for (const g of GOTCHAS) {
      const slot = (map[g.topicId] ??= { total: 0, reviewed: 0 });
      slot.total += 1;
      if (gotchas[g.id]) slot.reviewed += 1;
    }
    return map;
  }, [gotchas]);

  // A topic counts as ready if the user has ticked it OR every gotcha tagged
  // for that topic has been reviewed. This is how the gotchas page feeds into
  // the Exam Readiness score.
  const readyCount = READINESS_TOPICS.filter((t) => {
    if (readiness[t.id]) return true;
    const slot = gotchasByTopic[t.id];
    return !!slot && slot.total > 0 && slot.reviewed === slot.total;
  }).length;
  const readinessPct = Math.round(
    (readyCount / READINESS_TOPICS.length) * 100,
  );

  // Overall cert progress blends topic readiness, gotcha mastery, and study
  // consistency. 50% topic readiness / 25% gotcha mastery / 25% streak cap.
  const certPct = Math.round(
    readinessPct * 0.5 +
      gotchasPct * 0.25 +
      Math.min(streak, 7) * (100 / 7) * 0.25,
  );

  if (!hydrationDone) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm text-neutral-400">Loading your progress…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Commander Dashboard
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">Build Your Rhythm</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Small daily reps add up. Track a goal, keep the streak alive, and march
          toward the cert.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-4">
        <MiniStat label="Daily streak" value={`${streak}🔥`} />
        <MiniStat label="Best streak" value={`${bestStreak}🔥`} />
        <MiniStat label="Gotchas mastered" value={`${reviewedGotchaCount}/${GOTCHAS.length}`} />
        <MiniStat label="Exam readiness" value={`${readinessPct}%`} />
      </section>

      <Card title="Cert Progress" accent="fuchsia">
        <ProgressBar value={certPct} sublabel={`${certPct}% to exam-ready`} />
        <p className="mt-3 text-xs text-neutral-400">
          Blends topic coverage ({readinessPct}%), gotcha mastery (
          {gotchasPct}%), and a 7-day streak cap. Reviewing gotchas on{" "}
          <Link href="/gotchas" className="text-cyan-300 underline-offset-2 hover:underline">
            /gotchas
          </Link>{" "}
          auto-ticks any topic whose gotchas you&apos;ve fully reviewed.
        </p>
      </Card>

      <Card title="Daily Goal" accent="cyan">
        <p className="mb-3 text-sm text-neutral-300">
          Pick one focus for today. Keep it tiny so you actually ship it.
        </p>
        <div className="grid grid-cols-3 gap-2">
          {GOAL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setGoalType(t)}
              className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                goal.type === t
                  ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100"
                  : "border-white/10 bg-neutral-800 text-neutral-300 hover:border-white/30"
              }`}
            >
              {GOAL_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-neutral-800/60 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">
              {GOAL_LABELS[goal.type]}
            </p>
            <p className="text-xs text-neutral-400">
              {doneToday ? "Done for today — nice work!" : "Not done yet today"}
            </p>
          </div>
          {runDoneToday ? (
            <span className="rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-200">
              ✓ Logged
            </span>
          ) : doneToday ? (
            <span className="rounded-lg bg-emerald-500/20 px-3 py-2 text-xs font-bold text-emerald-200">
              ✓ Done
            </span>
          ) : (
            <button
              onClick={markDoneToday}
              className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-2 text-xs font-bold text-neutral-900 transition hover:brightness-110"
            >
              Mark done
            </button>
          )}
        </div>

        {goal.type === "run" && !runDoneToday && (
          <Link
            href="/"
            className="mt-3 block text-center text-xs font-semibold text-cyan-300 underline-offset-2 hover:underline"
          >
            ▸ Start a challenge run to auto-complete this goal
          </Link>
        )}
      </Card>

      <Card title="Exam Readiness Checklist" accent="violet">
        <p className="mb-3 text-sm text-neutral-300">
          Tick off the CLF-C02 areas you feel confident explaining out loud.
        </p>
        <ProgressBar value={readinessPct} sublabel={`${readyCount}/${READINESS_TOPICS.length}`} />
        <ul className="mt-4 space-y-2">
          {READINESS_TOPICS.map((t) => {
            const manual = !!readiness[t.id];
            const slot = gotchasByTopic[t.id] ?? { total: 0, reviewed: 0 };
            const gotchasCover = slot.total > 0 && slot.reviewed === slot.total;
            const checked = manual || gotchasCover;
            return (
              <li key={t.id}>
                <button
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggleTopic(t.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                    checked
                      ? "border-cyan-400/40 bg-cyan-400/10"
                      : "border-white/10 bg-neutral-800/60 hover:border-white/30"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-xs font-black ${
                      checked
                        ? "border-cyan-300 bg-cyan-400 text-neutral-900"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                  <span className="flex-1">
                    <span
                      className={`block text-sm font-semibold ${
                        checked ? "text-cyan-100" : "text-white"
                      }`}
                    >
                      {t.label}
                    </span>
                    <span className="block text-xs text-neutral-400">{t.hint}</span>
                  </span>
                  {slot.total > 0 && (
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        gotchasCover
                          ? "bg-cyan-400/20 text-cyan-100"
                          : "bg-neutral-700/60 text-neutral-300"
                      }`}
                      title={`${slot.reviewed} of ${slot.total} gotchas reviewed for this topic`}
                    >
                      ⚠ {slot.reviewed}/{slot.total}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </Card>

      <p className="mt-6 text-center text-xs text-neutral-500">
        Tip: a 15-minute rep every day beats a 5-hour cram the night before. 🎮
      </p>
    </main>
  );
}

function Card({
  title,
  accent,
  children,
}: {
  title: string;
  accent: "cyan" | "violet" | "fuchsia";
  children: React.ReactNode;
}) {
  const accentText =
    accent === "cyan"
      ? "text-cyan-300"
      : accent === "violet"
        ? "text-violet-300"
        : "text-fuchsia-300";
  return (
    <section className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className={`mb-3 text-xs font-semibold uppercase tracking-wide ${accentText}`}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-neutral-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function ProgressBar({ value, sublabel }: { value: number; sublabel?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      {sublabel && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide text-cyan-300">
            Progress
          </span>
          <span className="text-neutral-400">{sublabel}</span>
        </div>
      )}
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
