"use client";

import { useMemo, useState, useEffect } from "react";
import questions from "@/data/questions";
import type {
  AnswerOption,
  AnsweredQuestion,
  Domain,
  Difficulty,
  Question,
} from "@/lib/types";
import {
  computeRunResult,
  pointsForAnswer,
  rankForAccuracy,
} from "@/lib/scoring";
import { now } from "@/lib/clock";

type Phase = "start" | "playing" | "results" | "review";

/** A missed question paired with the player's chosen answer, for review. */
interface MissedItem {
  question: Question;
  chosen: AnswerOption | undefined;
  correct: AnswerOption | undefined;
}

const LEVEL_XP = 500;

type DifficultyFilter = "all" | Difficulty;

const DIFFICULTY_LABEL: Record<Difficulty, { label: string; color: string }> = {
  easy: { label: "Easy", color: "text-emerald-300" },
  medium: { label: "Medium", color: "text-amber-300" },
  hard: { label: "Hard", color: "text-rose-300" },
};

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

export default function ArcadeGame() {
  const [phase, setPhase] = useState<Phase>("start");
  const [order, setOrder] = useState<number[]>([]);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionStart, setQuestionStart] = useState(0);
  const [bestScore, setBestScore] = useState(() => {
    try {
      const saved = localStorage.getItem("arcade_bestScore");
      if (saved !== null) {
        const parsed = parseInt(saved, 10);
        if (!Number.isNaN(parsed)) return parsed;
      }
    } catch {
      // localStorage may be unavailable in some environments
    }
    return 0;
  });
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");

  const filteredQuestions = useMemo(() => {
    if (difficultyFilter === "all") return questions;
    return questions.filter((q) => q.difficulty === difficultyFilter);
  }, [difficultyFilter]);

  const activeQuestion =
    phase === "playing" ? sessionQuestions[order[current]] : undefined;

  const result = useMemo(
    () =>
      phase === "results" || phase === "review"
        ? computeRunResult(answers, sessionQuestions.length, sessionQuestions)
        : null,
    [phase, answers, sessionQuestions],
  );

  /** Questions the player answered incorrectly in the last run, in answer order. */
  const missed = useMemo<MissedItem[]>(() => {
    return answers
      .filter((a) => !a.correct)
      .map((a) => {
        const question = questions.find((q) => q.id === a.questionId);
        if (!question) return null;
        return {
          question,
          chosen: question.options.find((o) => o.id === a.selectedOptionId),
          correct: question.options.find(
            (o) => o.id === question.correctOptionId,
          ),
        };
      })
      .filter((m): m is MissedItem => m !== null);
  }, [answers]);

  const missedQuestions = useMemo(
    () => missed.map((m) => m.question),
    [missed],
  );

  const level = Math.floor(bestScore / LEVEL_XP) + 1;
  const xpIntoLevel = bestScore % LEVEL_XP;
  const xpPct = (xpIntoLevel / LEVEL_XP) * 100;

  const exploredDomains = useMemo(() => {
    const ids = new Set(answers.map((a) => a.questionId));
    return new Set(
      filteredQuestions.filter((q) => ids.has(q.id)).map((q) => q.domain),
    );
  }, [answers, filteredQuestions]);

  useEffect(() => {
    try {
      localStorage.setItem("arcade_bestScore", String(bestScore));
    } catch {
      // ignore
    }
  }, [bestScore]);

  function startGame(sessionSet: Question[]) {
    if (sessionSet.length === 0) return;
    setSessionQuestions(sessionSet);
    setOrder(shuffle(sessionSet.map((_, i) => i)));
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
    const earned = pointsForAnswer(correct, streak, elapsedMs, activeQuestion.difficulty);

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

  function next() {
    if (current + 1 >= order.length) {
      setBestScore((b) => Math.max(b, score));
      setPhase("results");
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setQuestionStart(now());
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
              {filteredQuestions.length} cloud-practitioner missions in the bank. Earn
              XP, keep your streak alive, and climb the ranks.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-300">
              Difficulty
            </p>
            <div className="grid grid-cols-4 gap-2">
              {(["all", "easy", "medium", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                    difficultyFilter === d
                      ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100"
                      : "border-white/10 bg-neutral-800 text-neutral-300 hover:border-white/30"
                  }`}
                >
                  {d === "all" ? "All" : DIFFICULTY_LABEL[d].label}
                </button>
              ))}
            </div>
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
              Domain badges
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DOMAIN_ORDER.map((domain) => {
                const explored = exploredDomains.has(domain);
                const count = DOMAIN_COUNTS[domain];
                return (
                  <div
                    key={domain}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs ${
                      explored
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100"
                        : "border-white/10 bg-neutral-800/60 text-neutral-300"
                    }`}
                    title={domain}
                  >
                    <span aria-hidden className="text-base">
                      {DOMAIN_BADGE[domain]}
                    </span>
                    <span className="flex-1 leading-tight">{domain}</span>
                    <span className="font-semibold text-neutral-400">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Streak
              </p>
              <p className="mt-1 text-2xl font-black text-amber-300">
                {streak}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                Best score
              </p>
              <p className="mt-1 text-2xl font-black text-fuchsia-300">
                {bestScore.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            onClick={() => startGame(filteredQuestions)}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 text-lg font-black text-neutral-900 shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.99]"
          >
            ▸ Start Challenge
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

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Score" value={result.score.toLocaleString()} />
            <Stat
              label="Correct"
              value={`${result.correctCount}/${result.totalQuestions}`}
            />
            <Stat label="Accuracy" value={`${result.accuracy}%`} />
            <Stat label="Best streak" value={String(result.bestStreak)} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-300">
              Breakdown
            </p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {(["easy", "medium", "hard"] as const).map((d) => {
                const total = answers.filter(
                  (a) =>
                    questions.find((q) => q.id === a.questionId)?.difficulty === d
                ).length;
                const correct = answers.filter((a) => {
                  const q = questions.find((q) => q.id === a.questionId);
                  return q?.difficulty === d && a.correct;
                }).length;
                return (
                  <div key={d} className="rounded-xl bg-neutral-800/60 p-2">
                    <p className={`font-semibold ${DIFFICULTY_LABEL[d].color}`}>
                      {DIFFICULTY_LABEL[d].label}
                    </p>
                    <p className="mt-1 text-lg font-black text-white">
                      {total > 0 ? Math.round((correct / total) * 100) : 0}%
                    </p>
                    <p className="text-neutral-400">
                      {correct}/{total}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {missed.length > 0 && (
            <button
              onClick={() => setPhase("review")}
              className="w-full rounded-2xl border border-amber-300/50 bg-amber-400/10 px-6 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-400/20 active:scale-[0.99]"
            >
              ✎ Review {missed.length} Missed{" "}
              {missed.length === 1 ? "Question" : "Questions"}
            </button>
          )}

          <button
            onClick={() => startGame(filteredQuestions)}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 text-lg font-black text-neutral-900 shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.99]"
          >
            ▸ Next Mission
          </button>
        </section>
      )}

      {phase === "review" && (
        <section className="flex flex-col gap-4">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
              Study Mode
            </p>
            <h2 className="mt-2 text-xl font-black text-white">
              Review missed questions
            </h2>
            <p className="mt-1 text-sm text-neutral-300">
              {missed.length} to review. Read the explanation, then retry only
              these to lock them in.
            </p>
          </div>

          {missed.length === 0 ? (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-center text-sm text-emerald-100">
              Perfect run — nothing to review. 🎉
            </div>
          ) : (
            <ol className="flex flex-col gap-3">
              {missed.map((m, i) => (
                <li
                  key={m.question.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                      {m.question.domain}
                    </p>
                    <span
                      className={`text-xs font-semibold ${
                        DIFFICULTY_LABEL[m.question.difficulty].color
                      }`}
                    >
                      {DIFFICULTY_LABEL[m.question.difficulty].label}
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-semibold text-white">
                    <span className="text-neutral-500">{i + 1}. </span>
                    {m.question.prompt}
                  </h3>

                  <div className="mt-3 space-y-2 text-sm">
                    <div className="rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-rose-100">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-rose-300">
                        Your answer
                      </span>
                      <p>{m.chosen?.text ?? "No answer"}</p>
                    </div>
                    <div className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-emerald-100">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                        Correct answer
                      </span>
                      <p>{m.correct?.text ?? "—"}</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl bg-neutral-800/70 p-3 text-sm text-neutral-200">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-300">
                      Why
                    </span>
                    <p className="mt-0.5">{m.question.explanation}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}

          {missed.length > 0 && (
            <button
              onClick={() => startGame(missedQuestions)}
              className="w-full rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 text-lg font-black text-neutral-900 shadow-lg shadow-amber-500/20 transition hover:brightness-110 active:scale-[0.99]"
            >
              ↻ Retry Missed Only
            </button>
          )}

          <button
            onClick={() => setPhase("results")}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-neutral-200 transition hover:border-white/30"
          >
            ← Back to results
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
                <span
                  className={DIFFICULTY_LABEL[activeQuestion.difficulty].color}
                >
                  {activeQuestion.difficulty.toUpperCase()}
                </span>{" "}
                <strong className="text-amber-300">{streak}</strong> streak
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
