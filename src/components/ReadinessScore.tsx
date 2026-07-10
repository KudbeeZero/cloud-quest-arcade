"use client";

/* eslint-disable react-hooks/set-state-in-effect */
// SSR-safe hydration: the first client render returns the empty/zero state
// so the server and client trees match, then the post-mount effect pulls the
// real values from localStorage and triggers a single re-render.

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/useProgress";
import { computeStreak, todayKey, type DailyGoal } from "@/lib/study";

export const READINESS_TOPICS: { id: string; label: string; hint: string }[] = [
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

const READINESS_KEY = "cq_readiness";
const GOAL_KEY = "cq_dailyGoal";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export interface ReadinessInputs {
  /** 0-100 from the 12-topic exam-readiness checklist. */
  topicsPct: number;
  /** Current consecutive-day streak (0-N). */
  streak: number;
  /** 0-100 from rolling run accuracy. */
  accuracyPct: number;
  /** Number of runs in the history (proxy for "practice volume"). */
  runCount: number;
}

export function computeReadinessScore(inputs: ReadinessInputs): number {
  const { topicsPct, streak, accuracyPct, runCount } = inputs;
  const topicScore = topicsPct * 0.5;
  const accuracyScore = accuracyPct * 0.3;
  const streakScore = Math.min(streak, 7) * (10 / 7) * 10 * 0.15;
  const volumeBonus = Math.min(runCount, 20) * (100 / 20) * 0.05;
  return Math.round(topicScore + accuracyScore + streakScore + volumeBonus);
}

function pctFromRuns(runs: { accuracy: number }[]): number {
  if (runs.length === 0) return 0;
  const sum = runs.reduce((n, r) => n + r.accuracy, 0);
  return Math.round(sum / runs.length);
}

export interface ReadinessState {
  score: number;
  topicsPct: number;
  readyCount: number;
  totalTopics: number;
  streak: number;
  accuracyPct: number;
  runCount: number;
  loaded: boolean;
}

export function useReadinessScore(): ReadinessState {
  const { runs, loaded: runsLoaded } = useProgress();
  const [topicsPct, setTopicsPct] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const readiness = loadJSON<Record<string, boolean>>(READINESS_KEY, {});
    const ticked = Object.values(readiness).filter(Boolean).length;
    setTopicsPct(READINESS_TOPICS.length > 0 ? Math.round((ticked / READINESS_TOPICS.length) * 100) : 0);

    const goal = loadJSON<DailyGoal>(GOAL_KEY, { type: "run", completedDates: [] });
    setStreak(computeStreak(goal.completedDates, todayKey()));

    setHydrated(true);
  }, []);

  const accuracyPct = pctFromRuns(runs);
  const score = computeReadinessScore({
    topicsPct,
    streak,
    accuracyPct,
    runCount: runs.length,
  });

  return {
    score,
    topicsPct,
    readyCount: Math.round((topicsPct / 100) * READINESS_TOPICS.length),
    totalTopics: READINESS_TOPICS.length,
    streak,
    accuracyPct,
    runCount: runs.length,
    loaded: runsLoaded && hydrated,
  };
}

export interface ReadinessScoreProps {
  compact?: boolean;
  /** Optional pre-computed state. If omitted, the component hydrates from the store itself. */
  state?: Partial<ReadinessState>;
}

export default function ReadinessScore({ compact = false, state }: ReadinessScoreProps) {
  const hookState = useReadinessScore();
  const { score, readyCount, totalTopics, streak, accuracyPct, runCount, loaded } = {
    ...hookState,
    ...state,
  };

  if (compact) {
    return (
      <Link
        href="/progress"
        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-cyan-400/50 hover:bg-white/10"
        aria-label={`Exam readiness: ${score} percent. Open the Progress page to tune your plan.`}
      >
        <ScoreRing value={score} size={48} stroke={5} loaded={loaded} />
        <span className="flex-1">
          <span className="block text-sm font-bold text-white">Exam Readiness</span>
          <span className="block text-xs text-neutral-400">
            {loaded
              ? `${score}% to cert-ready · tap to tune`
              : "Calculating your readiness…"}
          </span>
        </span>
        <span aria-hidden className="text-cyan-300">›</span>
      </Link>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
        Exam Readiness Score
      </p>
      <div className="mt-3 flex items-center gap-5">
        <ScoreRing value={score} size={96} stroke={9} loaded={loaded} />
        <div className="flex-1">
          <p className="text-3xl font-black text-white">
            {loaded ? `${score}%` : "…"}
          </p>
          <p className="mt-1 text-sm text-neutral-300">
            Blends topic coverage ({readyCount}/{totalTopics}), run accuracy
            ({accuracyPct}%), and study streak ({streak} days).
          </p>
          <Link
            href="/progress"
            className="mt-2 inline-block text-xs font-semibold text-cyan-300 underline-offset-2 hover:underline"
          >
            ▸ Tune your plan on /progress
          </Link>
        </div>
      </div>
    </div>
  );
}

function ScoreRing({
  value,
  size,
  stroke,
  loaded,
}: {
  value: number;
  size: number;
  stroke: number;
  loaded: boolean;
}) {
  const gradientId = `cq-readiness-gradient-${useId().replace(/:/g, "")}`;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const display = loaded ? Math.max(0, Math.min(100, value)) : 0;
  const dash = (display / 100) * circumference;
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Exam readiness ${display} percent`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          style={{ transition: "stroke-dasharray 500ms ease" }}
        />
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#a78bfa" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-xs font-black text-white">
        {loaded ? `${display}` : "…"}
      </div>
    </div>
  );
}
