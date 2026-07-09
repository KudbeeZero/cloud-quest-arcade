"use client";

import { useMemo, useState } from "react";
import questions from "@/data/questions";
import type { AnswerOption, AnsweredQuestion } from "@/lib/types";
import {
  computeRunResult,
  pointsForAnswer,
  rankForAccuracy,
} from "@/lib/scoring";
import { now } from "@/lib/clock";

type Phase = "start" | "playing" | "results";

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

  const activeQuestion =
    phase === "playing" ? questions[order[current]] : undefined;

  const result = useMemo(
    () =>
      phase === "results"
        ? computeRunResult(answers, questions.length)
        : null,
    [phase, answers],
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

  function next() {
    if (current + 1 >= order.length) {
      setPhase("results");
      return;
    }
    setCurrent((c) => c + 1);
    setSelected(null);
    setQuestionStart(now());
  }

  if (phase === "start") {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Ready to play?</h2>
        <p className="mt-3 text-neutral-300">
          Answer {questions.length} AWS Cloud Practitioner questions. Score more
          by answering correctly, quickly, and building streaks.
        </p>
        <button
          onClick={startGame}
          className="mt-6 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-neutral-900 transition hover:bg-amber-300"
        >
          Insert Coin ▸ Start
        </button>
      </section>
    );
  }

  if (phase === "results" && result) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Run complete!</h2>
        <p className="mt-2 text-amber-300 text-lg font-semibold">
          Rank: {rankForAccuracy(result.accuracy)}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
          <Stat label="Score" value={result.score.toLocaleString()} />
          <Stat
            label="Correct"
            value={`${result.correctCount}/${result.totalQuestions}`}
          />
          <Stat label="Accuracy" value={`${result.accuracy}%`} />
          <Stat label="Best streak" value={String(result.bestStreak)} />
        </dl>
        <button
          onClick={startGame}
          className="mt-8 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-neutral-900 transition hover:bg-amber-300"
        >
          Play again
        </button>
      </section>
    );
  }

  if (!activeQuestion) return null;

  const answered = selected !== null;

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-sm text-neutral-300">
        <span>
          Question {current + 1} / {order.length}
        </span>
        <span className="flex gap-4">
          <span>
            Score <strong className="text-amber-300">{score}</strong>
          </span>
          <span>
            Streak <strong className="text-amber-300">{streak}</strong>
          </span>
        </span>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
          {activeQuestion.domain}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-white">
          {activeQuestion.prompt}
        </h2>

        <ul className="mt-5 space-y-3">
          {activeQuestion.options.map((opt: AnswerOption) => {
            const isCorrect = opt.id === activeQuestion.correctOptionId;
            const isChosen = opt.id === selected;

            let cls =
              "w-full rounded-xl border px-4 py-3 text-left transition ";
            if (!answered) {
              cls +=
                "border-white/10 bg-neutral-800 text-neutral-100 hover:border-amber-300/60";
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

        {answered && (
          <div className="mt-5 rounded-xl bg-neutral-800/70 p-4 text-sm text-neutral-200">
            <p className="font-semibold text-white">
              {selected === activeQuestion.correctOptionId
                ? "Correct! ✓"
                : "Not quite."}
            </p>
            <p className="mt-1">{activeQuestion.explanation}</p>
            <button
              onClick={next}
              className="mt-4 rounded-lg bg-amber-400 px-5 py-2 font-semibold text-neutral-900 transition hover:bg-amber-300"
            >
              {current + 1 >= order.length ? "See results" : "Next question"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-neutral-800/70 p-4 text-center">
      <dt className="text-xs uppercase tracking-wide text-neutral-400">
        {label}
      </dt>
      <dd className="mt-1 text-xl font-bold text-white">{value}</dd>
    </div>
  );
}
