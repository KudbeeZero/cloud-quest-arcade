"use client";

import { useMemo, useState } from "react";
import ArcadeGame from "@/components/ArcadeGame";
import Flashcards from "@/components/Flashcards";
import Missions from "@/components/Missions";
import {
  getActivityWindow,
  masteredCount,
  useProgress,
} from "@/lib/progress";

type Mode = "quiz" | "flashcards" | "missions";

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: "quiz", label: "Quiz", icon: "🎮" },
  { id: "flashcards", label: "Flashcards", icon: "🃏" },
  { id: "missions", label: "Missions", icon: "🎯" },
];

export default function Home() {
  const [mode, setMode] = useState<Mode>("quiz");
  const progress = useProgress();

  const badges = useMemo(() => {
    const today = progress.activity[localDateKey()] ?? {
      quizzesCompleted: 0,
      flashcardsReviewed: 0,
      bestAccuracy: 0,
    };
    const week = getActivityWindow(7);
    const mastered = masteredCount();
    const daily = [
      today.quizzesCompleted >= 1,
      today.flashcardsReviewed >= 5,
      mastered >= 3,
    ].filter(Boolean).length;
    const weekly = [
      week.quizzesCompleted >= 3,
      week.flashcardsReviewed >= 20,
      week.bestAccuracy >= 80,
      mastered >= 10,
    ].filter(Boolean).length;
    return { daily, weekly };
  }, [progress]);

  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12">
      <header className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Cloud Quest Arcade
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">
          AWS Cloud Practitioner Trainer
        </h1>
        <p className="mt-2 text-sm text-neutral-300">
          A mobile-first arcade command center for the AWS Certified Cloud
          Practitioner (CLF-C02) exam.
        </p>
      </header>

      <div className="mx-auto mt-6 max-w-md">
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              aria-current={mode === m.id ? "page" : undefined}
              className={`rounded-2xl border px-2 py-3 text-sm font-semibold transition ${
                mode === m.id
                  ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100"
                  : "border-white/10 bg-white/5 text-neutral-300 hover:border-white/30"
              }`}
            >
              <span aria-hidden className="mr-1">
                {m.icon}
              </span>
              {m.label}
            </button>
          ))}
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 text-xs">
          <span className="rounded-full bg-neutral-800 px-3 py-1 font-semibold text-amber-300">
            🎯 Daily {badges.daily}/3
          </span>
          <span className="rounded-full bg-neutral-800 px-3 py-1 font-semibold text-violet-300">
            🗓️ Weekly {badges.weekly}/4
          </span>
        </div>
      </div>

      <div className="mt-6">
        {mode === "quiz" && <ArcadeGame />}
        {mode === "flashcards" && <Flashcards />}
        {mode === "missions" && <Missions />}
      </div>

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Original practice content. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>
    </main>
  );
}

function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
