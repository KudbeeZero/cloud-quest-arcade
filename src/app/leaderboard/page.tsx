"use client";

import { useState } from "react";
import Link from "next/link";
import {
  clearLeaderboard,
  loadLeaderboard,
  loadPlayerName,
  savePlayerName,
  type LeaderboardEntry,
} from "@/lib/leaderboard";

const MEDAL = ["🥇", "🥈", "🥉"];

function formatDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() =>
    loadLeaderboard(),
  );
  const [name, setName] = useState<string>(() => loadPlayerName());

  function commitName(value: string) {
    setName(value);
    savePlayerName(value);
  }

  function handleClear() {
    clearLeaderboard();
    setEntries([]);
  }

  return (
    <main className="min-h-screen bg-neutral-900 px-4 py-8 text-white sm:py-12">
      <header className="mx-auto max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
          Cloud Quest Arcade
        </p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl">🏆 Leaderboard</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Your top 10 runs are saved on this device. Climb the ranks, Commander.
        </p>
      </header>

      <div className="mx-auto mt-6 max-w-md">
        <label className="block text-xs font-semibold uppercase tracking-wide text-violet-300">
          Your call sign
        </label>
        <input
          value={name}
          onChange={(e) => commitName(e.target.value)}
          maxLength={16}
          className="mt-1 w-full rounded-xl border border-white/10 bg-neutral-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400/60"
          placeholder="Commander"
        />
      </div>

      <div className="mx-auto mt-4 max-w-md">
        {entries.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-sm text-neutral-400">
            No runs yet. Finish a mission on the home screen to set your first
            score!
          </div>
        ) : (
          <ol className="space-y-2">
            {entries.map((e, i) => (
              <li
                key={e.id}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3"
              >
                <span className="w-7 text-center text-lg font-black">
                  {MEDAL[i] ?? i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{e.name}</p>
                  <p className="text-xs text-neutral-400">
                    {e.accuracy}% · {e.correctCount}/{e.totalQuestions} · streak{" "}
                    {e.bestStreak} · {e.difficulty}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-amber-300">
                    {e.score.toLocaleString()}
                  </p>
                  <p className="text-[10px] uppercase tracking-wide text-neutral-500">
                    {formatDate(e.date)}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-200 transition hover:border-white/30"
          >
            ◂ Back to arcade
          </Link>
          {entries.length > 0 && (
            <button
              onClick={handleClear}
              className="rounded-xl border border-rose-400/40 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10"
            >
              Clear board
            </button>
          )}
        </div>
      </div>

      <footer className="mx-auto mt-8 max-w-md text-center text-xs text-neutral-500">
        Local-only scores. Not affiliated with or endorsed by Amazon Web
        Services.
      </footer>
    </main>
  );
}
