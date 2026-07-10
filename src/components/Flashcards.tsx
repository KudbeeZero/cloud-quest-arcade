"use client";

import { useRef, useState } from "react";
import questions from "@/data/questions";
import type { Domain } from "@/lib/types";
import {
  masteredCount,
  recordFlashcardReview,
  useProgress,
} from "@/lib/progress";

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

export default function Flashcards() {
  useProgress();
  const mastered = masteredCount();
  const total = questions.length;

  const [queue, setQueue] = useState<string[]>(() =>
    shuffle(questions.map((q) => q.id)),
  );
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const ratedIds = useRef<Set<string>>(new Set());

  const current = questions.find((q) => q.id === queue[index]);
  const done = index >= queue.length;

  function startDeck() {
    setQueue(shuffle(questions.map((q) => q.id)));
    setIndex(0);
    setFlipped(false);
    ratedIds.current = new Set();
  }

  function rate(mastered: boolean) {
    if (!current) return;
    if (!ratedIds.current.has(current.id)) {
      recordFlashcardReview(current.id, mastered);
      ratedIds.current.add(current.id);
    }
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <section className="flex flex-col gap-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Deck complete
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            {mastered}/{total} mastered
          </h2>
          <p className="mt-1 text-sm text-neutral-300">
            Keep reviewing to lock in the concepts you marked as known.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-300">
            This session
          </p>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-xl bg-neutral-800/60 p-3">
              <p className="text-lg font-black text-cyan-200">{total}</p>
              <p className="text-neutral-400">cards reviewed</p>
            </div>
            <div className="rounded-xl bg-neutral-800/60 p-3">
              <p className="text-lg font-black text-emerald-300">{mastered}</p>
              <p className="text-neutral-400">mastered overall</p>
            </div>
          </div>
        </div>

        <button
          onClick={startDeck}
          className="w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-4 text-lg font-black text-neutral-900 shadow-lg shadow-violet-500/20 transition hover:brightness-110 active:scale-[0.99]"
        >
          ▸ Shuffle &amp; review again
        </button>
      </section>
    );
  }

  if (!current) return null;

  const correct = current.options.find(
    (o) => o.id === current.correctOptionId,
  );
  const pct = Math.round(((index + (flipped ? 1 : 0)) / total) * 100);

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide text-cyan-300">
            Flashcard {index + 1} / {total}
          </span>
          <span className="text-neutral-400">{mastered} mastered</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition hover:border-cyan-300/40"
        aria-expanded={flipped}
      >
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-violet-300">
          <span aria-hidden>{DOMAIN_BADGE[current.domain]}</span>
          {current.domain}
        </p>
        <h2 className="mt-3 text-base font-semibold text-white">
          {current.prompt}
        </h2>

        {!flipped ? (
          <p className="mt-4 text-sm text-cyan-300">Tap to reveal the answer ▸</p>
        ) : (
          <div className="mt-4 space-y-3 text-sm">
            <p className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 font-semibold text-emerald-100">
              {correct?.text}
            </p>
            <p className="text-neutral-200">{current.explanation}</p>
          </div>
        )}
      </button>

      {flipped && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => rate(false)}
            className="rounded-2xl border border-amber-400/50 bg-amber-500/15 px-4 py-4 text-base font-black text-amber-100 transition hover:brightness-110 active:scale-[0.99]"
          >
            Still learning
          </button>
          <button
            onClick={() => rate(true)}
            className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-4 text-base font-black text-neutral-900 transition hover:brightness-110 active:scale-[0.99]"
          >
            Know it ✓
          </button>
        </div>
      )}

      <button
        onClick={startDeck}
        className="w-full rounded-xl border border-white/10 bg-neutral-800/60 px-4 py-3 text-sm font-semibold text-neutral-200 transition hover:border-white/30"
      >
        Restart deck
      </button>
    </section>
  );
}
