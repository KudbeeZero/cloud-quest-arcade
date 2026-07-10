"use client";

import { useState, useEffect, useCallback } from "react";
import ContentShell from "@/components/ContentShell";
import type { DifficultyFilter } from "@/components/ArcadeGame";

type RunSummary = {
  id: string;
  date: number;
  score: number;
  accuracy: number;
  streak: number;
  questionCount: number;
  difficulty: DifficultyFilter;
};

function loadRuns(): RunSummary[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem("arcade_runHistory");
    if (saved) {
      const parsed = JSON.parse(saved) as RunSummary[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return [];
}

export default function LeaderboardPage() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setRuns(loadRuns());
    setMounted(true);
  }, []);

  const bestRun = runs.length > 0 ? [...runs].sort((a, b) => b.score - a.score)[0] : null;
  const recentTop3 = runs.slice(0, 3);

  const shareText = bestRun
    ? `Cloud Quest Arcade — best score: ${bestRun.score.toLocaleString()} (${bestRun.accuracy}% accuracy, ${bestRun.streak} streak)`
    : "No runs yet. Play the arcade to set a score!";

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Cloud Quest Arcade",
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // ignore user cancel
    }
  }, [shareText]);

  if (!mounted) {
    return (
      <ContentShell title="Leaderboard" backLabel="Home" backHref="/">
        <p className="text-sm text-neutral-400">Loading scores...</p>
      </ContentShell>
    );
  }

  return (
    <ContentShell title="Leaderboard" backLabel="Home" backHref="/">
      <div className="cq-prose">
        <p className="text-sm text-neutral-400">
          Your top local results from the arcade.
        </p>
        {bestRun ? (
          <div className="mt-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/5 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Personal Best
            </p>
            <p className="mt-2 text-4xl font-black text-white">
              {bestRun.score.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-neutral-300">
              {bestRun.accuracy}% accuracy · {bestRun.streak} streak
            </p>
            <div className="mt-4">
              <button
                onClick={handleShare}
                className="rounded-xl bg-white/10 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
              >
                {copied ? "Copied!" : "Share Result"}
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm text-neutral-500">No runs yet. Complete a challenge to see your best score.</p>
        )}
        {recentTop3.length > 0 && (
          <div className="mt-8">
            <h2>Recent top 3</h2>
            <ul className="mt-4 space-y-2">
              {recentTop3.map((run, idx) => (
                <li
                  key={run.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-neutral-800/60 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {run.score.toLocaleString()} pts
                      </p>
                      <p className="text-xs text-neutral-400">
                        {run.accuracy}% · {run.streak} streak
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {new Date(run.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ContentShell>
  );
}
