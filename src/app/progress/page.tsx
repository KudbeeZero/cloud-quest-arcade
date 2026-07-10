"use client";

import { useMemo, useState } from "react";
import { loadProgress, masteryLevelForAccuracy, MASTERY_LABEL, MASTERY_COLOR } from "@/lib/progress";
import type { Domain } from "@/lib/types";
import type { DomainStats } from "@/lib/progress";

const DOMAIN_ORDER: Domain[] = [
  "Cloud Concepts",
  "Security and Compliance",
  "Cloud Technology and Services",
  "Billing, Pricing and Support",
];

const DOMAIN_BADGE: Record<Domain, string> = {
  "Cloud Concepts": "☁️",
  "Security and Compliance": "🛡️",
  "Cloud Technology and Services": "⚙️",
  "Billing, Pricing and Support": "💡",
};

export default function ProgressPage() {
  const [progress] = useState(() => loadProgress());
  const [now] = useState(() => Date.now());

  const overall = useMemo(() => {
    let totalAnswered = 0;
    let totalCorrect = 0;
    for (const d of DOMAIN_ORDER) {
      const s = progress.domains[d];
      totalAnswered += s.questionsAnswered;
      totalCorrect += s.correctAnswers;
    }
    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const level = masteryLevelForAccuracy(accuracy, totalAnswered);
    return { totalAnswered, totalCorrect, accuracy, level };
  }, [progress]);

  const DomainCard = ({ domain, stats }: { domain: Domain; stats: DomainStats }) => {
    const pct = stats.questionsAnswered > 0 ? stats.accuracy : 0;
    const level = masteryLevelForAccuracy(stats.accuracy, stats.questionsAnswered);
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{DOMAIN_BADGE[domain]}</span>
            <p className="text-sm font-semibold text-white">{domain}</p>
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wide ${MASTERY_COLOR[level]}`}>
            {MASTERY_LABEL[level]}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <p className="text-neutral-400">Answered</p>
            <p className="mt-1 text-lg font-black text-white">{stats.questionsAnswered}</p>
          </div>
          <div>
            <p className="text-neutral-400">Accuracy</p>
            <p className="mt-1 text-lg font-black text-cyan-300">{stats.accuracy}%</p>
          </div>
          <div>
            <p className="text-neutral-400">Memorised</p>
            <p className="mt-1 text-lg font-black text-fuchsia-300">{stats.flashcardsMastered}</p>
          </div>
        </div>

        <div className="mt-3">
          <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-1 text-right text-[10px] text-neutral-500">
            {stats.correctAnswers}/{stats.questionsAnswered} correct
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Progress
        </p>
        <h2 className="mt-2 text-xl font-black text-white">
          Mission Control
        </h2>
        <p className="mt-1 text-sm text-neutral-300">
          Track your mastery across the four Cloud Practitioner domains.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
          Overall Mastery
        </p>
        <div className="mt-2 flex items-baseline justify-between">
          <p className="text-2xl font-black text-white">{overall.accuracy}%</p>
          <span className={`text-sm font-semibold ${MASTERY_COLOR[overall.level]}`}>
            {MASTERY_LABEL[overall.level]}
          </span>
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          {overall.totalAnswered} answered · {overall.totalCorrect} correct
        </p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 transition-all duration-500"
            style={{ width: `${overall.accuracy}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {DOMAIN_ORDER.map((domain) => (
          <DomainCard
            key={domain}
            domain={domain}
            stats={progress.domains[domain]}
          />
        ))}
      </div>

      <nav
        aria-label="Primary"
        className="sticky bottom-0 mt-6 grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-neutral-900/90 p-2 backdrop-blur"
      >
        {(["Home", "Missions", "Badges", "Progress"] as const).map((item, i) => (
          <a
            key={item}
            href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
            aria-current={item === "Progress" ? "page" : undefined}
            className={`rounded-xl py-2 text-center text-xs font-semibold transition ${
              item === "Progress"
                ? "bg-white/10 text-cyan-200"
                : "text-neutral-500 hover:text-neutral-300"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
}
