"use client";

import { useState } from "react";
import {
  usePlayerProgress,
  claimMission,
  missionView,
} from "@/lib/progress";
import ParticleBurst from "./ParticleBurst";

/**
 * Daily mission card: shows today's answer goal progress and a Claim button
 * once it's met. Claiming fires a celebratory particle burst.
 *
 * Backed by `useSyncExternalStore`, so the server render and first client
 * render both use the safe default and re-render with the persisted value
 * after mount — no hydration mismatch.
 */
export default function DailyMission() {
  const progress = usePlayerProgress();
  const [fireKey, setFireKey] = useState(0);

  const view = missionView(progress);

  const pct = view.goal > 0 ? (view.progress / view.goal) * 100 : 0;

  function handleClaim() {
    const next = claimMission();
    if (missionView(next).claimed) {
      setFireKey((k) => k + 1);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
      <ParticleBurst fireKey={fireKey} />

      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
          Daily Mission
        </p>
        {view.claimed ? (
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-300">
            Claimed ✓
          </span>
        ) : view.complete ? (
          <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-300">
            Ready
          </span>
        ) : (
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-neutral-400">
            {view.progress}/{view.goal}
          </span>
        )}
      </div>

      <p className="mt-2 text-sm text-neutral-300">
        Answer <strong className="text-white">{view.goal}</strong> questions
        today to keep your streak alive.
      </p>

      <div
        className="mt-3 h-3 w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={view.goal}
        aria-valuenow={view.progress}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            view.complete
              ? "bg-gradient-to-r from-emerald-400 to-teal-400"
              : "bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {view.claimable && (
        <button
          onClick={handleClaim}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 px-5 py-3 text-sm font-black text-neutral-900 shadow-lg shadow-emerald-500/20 transition hover:brightness-110 active:scale-[0.99]"
        >
          🎉 Claim Mission Reward
        </button>
      )}
    </div>
  );
}
