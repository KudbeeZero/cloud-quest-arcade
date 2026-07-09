"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import questions from "@/data/questions";
import type { AnswerOption, AnsweredQuestion, Domain } from "@/lib/types";
import {
  computeRunResult,
  pointsForAnswer,
  rankForAccuracy,
} from "@/lib/scoring";
import { now } from "@/lib/clock";
import {
  accuracyPct,
  buildSessionRecord,
  progressStore,
  resetProgress,
  recordSession,
  setProgressState,
  type MissedItem,
  type ProgressState,
} from "@/lib/progress";

type Phase = "start" | "playing" | "results";

const LEVEL_XP = 500;

/** Per-domain question counts, derived from the bank. */
const DOMAIN_COUNTS: Record<Domain, number> = questions.reduce(
  (acc, q) => {
    acc[q.domain] = (acc[q.domain] ?? 0) + 1;
    return acc;
  },
  {} as Record<Domain, number>,
);

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

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Linear progress bar used for XP and mission progress. */
function ProgressBar({
  value,
  label,
  sublabel,
}: {
  value: number;
  label: string;
  sublabel?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-semibold uppercase tracking-wide text-cyan-300">
          {label}
        </span>
        {sublabel && <span className="text-neutral-400">{sublabel}</span>}
      </div>
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

/** Per-domain mastery summary across all recorded sessions. */
function domainSummary(totals: ProgressState["domainTotals"]) {
  const explored = DOMAIN_ORDER.filter((d) => totals[d].total > 0);
  if (explored.length === 0) return { strongest: null, weakest: null };

  let strongest = explored[0];
  let weakest = explored[0];
  for (const d of explored) {
    if (accuracyPct(totals[d]) > accuracyPct(totals[strongest])) strongest = d;
    if (accuracyPct(totals[d]) < accuracyPct(totals[weakest])) weakest = d;
  }
  return { strongest, weakest };
}

export default function ArcadeGame() {
  const [phase, setPhase] = useState<Phase>("start");
  const [order, setOrder] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionStart, setQuestionStart] = useState(0);
  const progress = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.getSnapshot,
    progressStore.getServerSnapshot,
  );

  const activeQuestion =
    phase === "playing" ? questions[order[current]] : undefined;

  const result = useMemo(
    () =>
      phase === "results"
        ? computeRunResult(answers, questions.length)
        : null,
    [phase, answers],
  );

  const level = Math.floor(progress.bestScore / LEVEL_XP) + 1;
  const xpIntoLevel = progress.bestScore % LEVEL_XP;
  const xpPct = (xpIntoLevel / LEVEL_XP) * 100;

  const { strongest, weakest } = useMemo(
    () => domainSummary(progress.domainTotals),
    [progress.domainTotals],
  );

  function startGame() {
    setOrder(shuffle(questions.map((_, i) => i)));
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setScore(0);
    setStreak(0);
    setQuestionStart(now());
    setPhase("playing");
  }

  function selectOption(optionId: string) {
    if (selected || !activeQuestion) return;

    const elapsedMs = now() - questionStart;
    const correct = optionId === activeQuestion.correctOptionId;
    const earned = pointsForAnswer(correct, streak, elapsedMs);

    setSelected(optionId);
    setScore((s) => s + earned);
    setStreak((s) => (correct ? s + 1 : 0));
    setAnswers((prev) => [
      ...prev,
      {
        questionId: activeQuestion.id,
        selectedOptionId: optionId,
        correct,
        elapsedMs,
      },
    ]);
  }

  function finishRun() {
    const runResult = computeRunResult(answers, questions.length);
    const session = buildSessionRecord(answers, questions, runResult, now());
    setProgressState(recordSession(progress, session));
    setPhase("results");
  }

  function next() {
    if (current + 1 >= order.length) {
      finishRun();
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setQuestionStart(now());
  }

  function handleReset() {
    if (
      window.confirm(
        "Reset all progress? This clears your saved scores, history, and domain mastery on this device.",
      )
    ) {
      setProgressState(resetProgress());
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {phase === "start" && (
        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Cloud Quest Arcade
            </p>
            <h2 className="mt-2 text-xl font-black text-white">
              Commander, mission ready
            </h2>
            <p className="mt-1 text-sm text-neutral-300">
              {questions.length} cloud-practitioner missions in the bank. Earn
              XP, keep your streak alive, and climb the ranks.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <ProgressBar
              value={xpPct}
              label={`Cloud XP · Level ${level}`}
              sublabel={`${xpIntoLevel}/${LEVEL_XP}`}
            />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
              Domain mastery
            </p>
            <div className="space-y-3">
              {DOMAIN_ORDER.map((domain) => {
                const stat = progress.domainTotals[domain];
                const pct = accuracyPct(stat);
                const explored = stat.total > 0;
                return (
                  <div key={domain}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-neutral-200">
                        <span aria-hidden className="text-base">
                          {DOMAIN_BADGE[domain]}
                        </span>
                        {domain}
                      </span>
                      <span className="text-neutral-400">
                        {explored ? `${pct}%` : "—"}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400 transition-all duration-500"
                        style={{ width: `${explored ? pct : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Best streak
              </p>
              <p className="mt-1 text-2xl font-black text-amber-300">
                {progress.bestStreak}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Best score
              </p>
              <p className="mt-1 text-2xl font-black text-fuchsia-300">
                {progress.bestScore.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 text-lg font-black text-neutral-900 shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.99]"
          >
            ▸ Start Challenge
          </button>

          <button
            onClick={handleReset}
            className="self-center text-xs text-neutral-500 underline-offset-2 transition hover:text-rose-300 hover:underline"
            type="button"
          >
            Reset progress
          </button>
        </section>
      )}

      {phase === "results" && result && (
        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Mission complete
            </p>
            <h2 className="mt-2 text-2xl font-black text-white">
              Rank: {rankForAccuracy(result.accuracy)}
            </h2>
            <p className="mt-1 text-sm text-neutral-300">
              Earned {result.score.toLocaleString()} XP · best streak{" "}
              {result.bestStreak}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat label="Score" value={result.score.toLocaleString()} />
            <Stat
              label="Best score"
              value={progress.bestScore.toLocaleString()}
            />
            <Stat label="Accuracy" value={`${result.accuracy}%`} />
            <Stat
              label="Rank"
              value={rankForAccuracy(result.accuracy)}
            />
            <Stat label="Best rank" value={progress.bestRank} />
            <Stat label="Best streak" value={String(progress.bestStreak)} />
          </div>

          {(strongest || weakest) && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
                Domain progress
              </p>
              <div className="space-y-2 text-sm">
                {strongest && (
                  <p className="flex items-center justify-between">
                    <span className="text-neutral-300">Strongest</span>
                    <span className="flex items-center gap-2 font-semibold text-emerald-300">
                      <span aria-hidden>{DOMAIN_BADGE[strongest]}</span>
                      {strongest} · {accuracyPct(progress.domainTotals[strongest])}%
                    </span>
                  </p>
                )}
                {weakest && (
                  <p className="flex items-center justify-between">
                    <span className="text-neutral-300">Weakest</span>
                    <span className="flex items-center gap-2 font-semibold text-rose-300">
                      <span aria-hidden>{DOMAIN_BADGE[weakest]}</span>
                      {weakest} · {accuracyPct(progress.domainTotals[weakest])}%
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {progress.lastSession && progress.lastSession.missed.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-rose-300">
                Review missed ({progress.lastSession.missed.length})
              </p>
              <ul className="space-y-3">
                {progress.lastSession.missed.map((item: MissedItem) => (
                  <li
                    key={item.questionId}
                    className="rounded-xl border border-rose-400/20 bg-rose-500/5 p-3"
                  >
                    <p className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
                      <span aria-hidden>{DOMAIN_BADGE[item.domain]}</span>
                      {item.domain}
                    </p>
                    <p className="mt-1 text-sm text-white">{item.prompt}</p>
                    <p className="mt-1 text-sm text-emerald-300">
                      ✓ {item.correctText}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {item.explanation}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={startGame}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 text-lg font-black text-neutral-900 shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.99]"
          >
            ▸ Next Mission
          </button>
        </section>
      )}

      {phase === "playing" && activeQuestion && (
        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <ProgressBar
              value={((current + (selected ? 1 : 0)) / order.length) * 100}
              label="Mission progress"
              sublabel={`${current + 1} / ${order.length}`}
            />
            <div className="mt-3 flex items-center justify-between text-xs text-neutral-300">
              <span>
                Score{" "}
                <strong className="text-amber-300">{score}</strong>
              </span>
              <span>
                Streak{" "}
                <strong className="text-amber-300">{streak}</strong>
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
              {activeQuestion.domain}
            </p>
            <h2 className="mt-2 text-base font-semibold text-white">
              {activeQuestion.prompt}
            </h2>

            <ul className="mt-4 space-y-2">
              {activeQuestion.options.map((opt: AnswerOption) => {
                const isCorrect = opt.id === activeQuestion.correctOptionId;
                const isChosen = opt.id === selected;
                const answered = selected !== null;

                let cls =
                  "w-full rounded-xl border px-4 py-3 text-left text-sm transition ";
                if (!answered) {
                  cls +=
                    "border-white/10 bg-neutral-800 text-neutral-100 hover:border-cyan-300/60";
                } else if (isCorrect) {
                  cls += "border-emerald-400 bg-emerald-500/15 text-emerald-100";
                } else if (isChosen) {
                  cls += "border-rose-400 bg-rose-500/15 text-rose-100";
                } else {
                  cls += "border-white/10 bg-neutral-800/50 text-neutral-400";
                }

                return (
                  <li key={opt.id}>
                    <button
                      className={cls}
                      onClick={() => selectOption(opt.id)}
                      disabled={answered}
                    >
                      {opt.text}
                    </button>
                  </li>
                );
              })}
            </ul>

            {selected !== null && (
              <div className="mt-4 rounded-xl bg-neutral-800/70 p-4 text-sm text-neutral-200">
                <p className="font-semibold text-white">
                  {selected === activeQuestion.correctOptionId
                    ? "Correct! ✓"
                    : "Not quite."}
                </p>
                <p className="mt-1">{activeQuestion.explanation}</p>
                <button
                  onClick={next}
                  className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2 font-semibold text-neutral-900 transition hover:brightness-110"
                >
                  {current + 1 >= order.length ? "See results" : "Next question"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      <nav
        aria-label="Primary"
        className="sticky bottom-0 mt-6 grid grid-cols-4 gap-1 rounded-2xl border border-white/10 bg-neutral-900/90 p-2 backdrop-blur"
      >
        {(["Home", "Missions", "Badges", "Review"] as const).map((item, i) => (
          <span
            key={item}
            aria-current={i === 0 ? "page" : undefined}
            className={`rounded-xl py-2 text-center text-xs font-semibold ${
              i === 0
                ? "bg-white/10 text-cyan-200"
                : "text-neutral-500"
            }`}
          >
            {item}
          </span>
        ))}
      </nav>
    </div>
  );
}
