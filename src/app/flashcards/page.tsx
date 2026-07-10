"use client";

import { useMemo, useState } from "react";
import questions from "@/data/questions";

export default function FlashcardsPage() {
  const [revealed, setRevealed] = useState(false);
  const [idx, setIdx] = useState(0);

  const list = useMemo(() => questions, []);
  const current = list[idx];

  if (!current) {
    return (
      <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-xl font-black text-white">No flashcards</h1>
          <p className="mt-2 text-sm text-neutral-300">
            The question bank is empty.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Flashcard
        </p>
        <h1 className="mt-2 text-xl font-black text-white">
          Review: {current.domain}
        </h1>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Question
          </p>
          <p className="mt-2 text-sm font-semibold text-white">
            {current.prompt}
          </p>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-neutral-800/60 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Answer
          </p>
          {revealed ? (
            <>
              <p className="mt-2 text-sm text-white">
                {
                  current.options.find((o) => o.id === current.correctOptionId)
                    ?.text
                }
              </p>
              <p className="mt-2 text-xs text-neutral-300">
                {current.explanation}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-neutral-400">
              Tap reveal to see the answer
            </p>
          )}
          <button
            onClick={() => setRevealed((r) => !r)}
            className="mt-4 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm font-semibold text-neutral-200 transition hover:border-white/30"
          >
            {revealed ? "Hide answer" : "Reveal answer"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setIdx((i) => (i - 1 + list.length) % list.length);
              setRevealed(false);
            }}
            className="w-full rounded-2xl border border-white/10 bg-neutral-800 px-4 py-3 text-sm font-semibold text-neutral-200 transition hover:border-white/30"
          >
            ← Previous
          </button>
          <button
            onClick={() => {
              setIdx((i) => (i + 1) % list.length);
              setRevealed(false);
            }}
            className="w-full rounded-2xl border border-white/10 bg-neutral-800 px-4 py-3 text-sm font-semibold text-neutral-200 transition hover:border-white/30"
          >
            Next →
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-neutral-500">
          {idx + 1} / {list.length}
        </p>
      </div>
    </main>
  );
}
