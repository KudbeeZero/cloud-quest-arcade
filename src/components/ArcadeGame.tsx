"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import questions from "@/data/questions";
import type { AnswerOption, AnsweredQuestion, Domain, Difficulty } from "@/lib/types";
import {
  computeRunResult,
  pointsForAnswer,
  rankForAccuracy,
} from "@/lib/scoring";
import {
  clearSavedRun,
  recordRun,
  saveRun,
  type SavedRun,
} from "@/lib/progress";
import { useSavedRun } from "@/lib/useProgress";
import { now } from "@/lib/clock";

type Phase = "start" | "playing" | "results";

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

// --- Persisted best-score store (localStorage) ---------------------------------
// Read via useSyncExternalStore so SSR markup matches the client's first render
// (server snapshot = 0), and writes are observed across tabs and within the same
// tab via a custom event.
const BEST_SCORE_KEY = "arcade_bestScore";
const BEST_SCORE_EVENT = "cq_bestScore";

function readBestScore(): number {
  try {
    const saved = localStorage.getItem(BEST_SCORE_KEY);
    if (saved === null) return 0;
    const parsed = parseInt(saved, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

function writeBestScore(next: number) {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(next));
  } catch {
    // ignore quota / disabled storage
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(BEST_SCORE_EVENT));
  }
}

function subscribeBestScore(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(BEST_SCORE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(BEST_SCORE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
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
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<AnsweredQuestion[]>([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionStart, setQuestionStart] = useState(0);
  // bestScore is read from localStorage via useSyncExternalStore; the SSR
  // snapshot is 0 to avoid hydration mismatches, and the client picks up the
  // persisted value after hydration. setBestScore is a thin alias over the
  // localStorage writer (which also dispatches the same-tab event).
  const bestScore = useSyncExternalStore(
    subscribeBestScore,
    readBestScore,
    () => 0,
  );
  const setBestScore = (next: number) => writeBestScore(next);
  const [difficultyFilter, setDifficultyFilter] =
    useState<DifficultyFilter>("all");

  // Snapshot of any in-flight saved run from a previous session/tab. We use
  // it to show a "Resume Mission" affordance on the start screen and to
  // rehydrate state when the player picks up where they left off.
  const savedRun = useSavedRun();
  // Guard against offering a resume for a saved run whose question set no
  // longer matches the current difficulty filter — switching filters should
  // not silently mutate an in-progress run.
  const savedRunMatchesFilter =
    savedRun !== null && savedRun.difficulty === difficultyFilter;
  const resumableRun = savedRunMatchesFilter ? savedRun : null;

  const filteredQuestions = useMemo(() => {
    if (difficultyFilter === "all") return questions;
    return questions.filter((q) => q.difficulty === difficultyFilter);
  }, [difficultyFilter]);

  const activeQuestion =
    phase === "playing" ? filteredQuestions[order[current]] : undefined;

  const result = useMemo(
    () =>
      phase === "results"
        ? computeRunResult(answers, filteredQuestions.length, filteredQuestions)
        : null,
    [phase, answers, filteredQuestions],
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

  // Persist in-flight progress so the player can close the tab and resume
  // from the same question. We only write while a run is actively `playing`;
  // the slot is cleared explicitly by `startGame` (fresh run) and `next()`
  // (run complete). We deliberately do NOT clear on mount/start, so the
  // existing saved run stays available for the "Resume" affordance.
  useEffect(() => {
    if (phase !== "playing" || order.length === 0) return;
    const snapshot: SavedRun = {
      order,
      current,
      answers,
      score,
      streak,
      difficulty: difficultyFilter,
      questionStartedAt: questionStart,
      savedAt: Date.now(),
    };
    saveRun(snapshot);
  }, [phase, order, current, answers, score, streak, difficultyFilter, questionStart]);

  function startGame() {
    clearSavedRun();
    setOrder(shuffle(filteredQuestions.map((_, i) => i)));
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setScore(0);
    setStreak(0);
    setQuestionStart(now());
    setPhase("playing");
  }

  function resumeGame() {
    if (!resumableRun) return;
    // Defensive: if the question bank has shrunk since the run was saved,
    // clamp the current index and drop any out-of-range entries from the
    // order. This keeps the resume from crashing on stale data.
    const safeOrder = resumableRun.order
      .filter((i) => i >= 0 && i < questions.length)
      .slice(0, questions.length);
    const safeCurrent = Math.min(
      Math.max(0, resumableRun.current),
      Math.max(0, safeOrder.length - 1),
    );
    setOrder(safeOrder);
    setCurrent(safeCurrent);
    setSelected(null);
    setAnswers(resumableRun.answers);
    setScore(resumableRun.score);
    setStreak(resumableRun.streak);
    setDifficultyFilter(resumableRun.difficulty);
    // Preserve the original question start so the speed bonus doesn't reset
    // every time the player resumes.
    setQuestionStart(resumableRun.questionStartedAt);
    setPhase("playing");
  }

  function discardSavedRun() {
    clearSavedRun();
  }

  function shuffleRemaining() {
    if (order.length === 0) return;
    const head = order.slice(0, current + 1);
    const tail = shuffle(order.slice(current + 1));
    setOrder([...head, ...tail]);
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
      const finalResult = computeRunResult(
        answers,
        filteredQuestions.length,
        filteredQuestions,
      );
      recordRun(finalResult, difficultyFilter, filteredQuestions);
      setBestScore(Math.max(readBestScore(), score));
      clearSavedRun();
      try {
        localStorage.setItem("arcade_lastRunDate", new Date().toISOString().slice(0, 10));
      } catch {
        // ignore storage failures
      }
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

          {resumableRun && (
            <div className="rounded-2xl border border-amber-300/40 bg-amber-400/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">
                Mission in progress
              </p>
              <p className="mt-1 text-sm text-amber-50">
                Question {resumableRun.current + 1} of {resumableRun.order.length}{" "}
                · score {resumableRun.score.toLocaleString()} · streak{" "}
                {resumableRun.streak}
              </p>
              <p className="mt-1 text-[11px] text-amber-100/80">
                Saved {new Date(resumableRun.savedAt).toLocaleString()}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={resumeGame}
                  className="rounded-xl bg-gradient-to-r from-amber-300 to-amber-500 px-4 py-2 text-sm font-black text-neutral-900 shadow transition hover:brightness-110 active:scale-[0.99]"
                >
                  ▸ Resume
                </button>
                <button
                  onClick={discardSavedRun}
                  className="rounded-xl border border-amber-200/40 bg-neutral-900/50 px-4 py-2 text-sm font-semibold text-amber-100 transition hover:border-amber-200"
                >
                  Discard
                </button>
              </div>
            </div>
          )}

          <button
            onClick={startGame}
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 text-lg font-black text-neutral-900 shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.99]"
          >
            {resumableRun ? "▸ Start New Challenge" : "▸ Start Challenge"}
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
            <div className="mt-3 flex items-center justify-between gap-2 text-xs text-neutral-300">
              <span>
                Score{" "}
                <strong className="text-amber-300">{score}</strong>
              </span>
              <span className="flex items-center gap-2">
                <span
                  className={DIFFICULTY_LABEL[activeQuestion.difficulty].color}
                >
                  {activeQuestion.difficulty.toUpperCase()}
                </span>{" "}
                <strong className="text-amber-300">{streak}</strong> streak
                <button
                  type="button"
                  onClick={shuffleRemaining}
                  disabled={order.length - current - 1 < 2}
                  title="Re-randomize the order of the remaining questions"
                  className="ml-1 rounded-full border border-white/10 bg-neutral-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-200 transition hover:border-cyan-300/60 hover:text-cyan-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  🔀 Shuffle
                </button>
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
