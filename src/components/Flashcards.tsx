"use client";

import { useMemo, useState } from "react";
import questions from "@/data/questions";
import type { Difficulty, Domain } from "@/lib/types";

const DOMAINS: (Domain | "all")[] = [
  "all",
  "Cloud Concepts",
  "Security and Compliance",
  "Cloud Technology and Services",
  "Billing, Pricing and Support",
];

const DIFFICULTIES: (Difficulty | "all")[] = ["all", "easy", "medium", "hard"];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Flashcards() {
  const [domain, setDomain] = useState<Domain | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [deck, setDeck] = useState(() => shuffle(questions));

  const visible = useMemo(
    () =>
      deck.filter(
        (q) =>
          (domain === "all" || q.domain === domain) &&
          (difficulty === "all" || q.difficulty === difficulty),
      ),
    [deck, domain, difficulty],
  );

  const card = visible[index];
  const safeIndex = Math.min(index, Math.max(0, visible.length - 1));

  function reshuffle() {
    setDeck(shuffle(questions));
    setIndex(0);
    setFlipped(false);
  }

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => Math.min(Math.max(0, i + delta), visible.length - 1));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-violet-300">
          Domain
        </p>
        <div className="flex flex-wrap gap-2">
          {DOMAINS.map((d) => (
            <button
              key={d}
              onClick={() => {
                setDomain(d);
                setIndex(0);
                setFlipped(false);
              }}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                domain === d
                  ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100"
                  : "border-white/10 bg-neutral-800 text-neutral-300 hover:border-white/30"
              }`}
            >
              {d === "all" ? "All" : d}
            </button>
          ))}
        </div>
        <p className="mb-2 mt-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
          Difficulty
        </p>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <button
              key={d}
              onClick={() => {
                setDifficulty(d);
                setIndex(0);
                setFlipped(false);
              }}
              className={`rounded-xl border px-3 py-1.5 text-xs font-semibold capitalize transition ${
                difficulty === d
                  ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100"
                  : "border-white/10 bg-neutral-800 text-neutral-300 hover:border-white/30"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {!card ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-neutral-300">
          No cards match this filter. Try a different combo.
        </div>
      ) : (
        <button
          onClick={() => setFlipped((f) => !f)}
          className="group block w-full text-left"
          aria-pressed={flipped}
        >
          <div className="relative min-h-[16rem] [perspective:1200px]">
            <div
              className={`absolute inset-0 flex flex-col rounded-2xl border p-5 transition-transform duration-500 [transform-style:preserve-3d] ${
                flipped ? "[transform:rotateY(180deg)]" : ""
              } ${flipped ? "border-emerald-400/50 bg-emerald-500/10" : "border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80"}`}
            >
              <div className="[backface-visibility:hidden]">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  {card.domain} · {card.difficulty}
                </p>
                <p className="mt-3 text-base font-semibold text-white">
                  {card.prompt}
                </p>
                <p className="mt-auto text-xs text-neutral-400">
                  Tap to reveal the answer
                </p>
              </div>
            </div>
            <div
              className={`absolute inset-0 flex flex-col rounded-2xl border border-emerald-400/50 bg-emerald-500/10 p-5 transition-transform duration-500 [transform-style:preserve-3d] [transform:rotateY(180deg)] ${
                flipped ? "[transform:rotateY(0deg)]" : ""
              }`}
            >
              <div className="[backface-visibility:hidden]">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
                  Answer
                </p>
                <p className="mt-2 text-base font-semibold text-white">
                  {
                    card.options.find((o) => o.id === card.correctOptionId)
                      ?.text
                  }
                </p>
                <p className="mt-3 text-sm text-neutral-200">
                  {card.explanation}
                </p>
              </div>
            </div>
          </div>
        </button>
      )}

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={() => go(-1)}
          disabled={safeIndex === 0}
          className="flex-1 rounded-xl border border-white/10 bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-white/30 disabled:opacity-40"
        >
          ← Prev
        </button>
        <span className="text-xs text-neutral-400">
          {visible.length === 0 ? 0 : safeIndex + 1} / {visible.length}
        </span>
        <button
          onClick={() => go(1)}
          disabled={safeIndex >= visible.length - 1}
          className="flex-1 rounded-xl border border-white/10 bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-white/30 disabled:opacity-40"
        >
          Next →
        </button>
      </div>

      <button
        onClick={reshuffle}
        className="w-full rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:brightness-110"
      >
        ↻ Shuffle deck
      </button>
    </div>
  );
}
