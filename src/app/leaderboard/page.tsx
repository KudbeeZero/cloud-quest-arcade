"use client";

import { useMemo, useState } from "react";
import ContentShell from "@/components/ContentShell";
import { useProgress } from "@/lib/useProgress";
import { rankForAccuracy } from "@/lib/scoring";
import type { RunRecord } from "@/lib/progress";

const MEDALS = ["🥇", "🥈", "🥉"];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeaderboardPage() {
  const { runs, bestScore, loaded } = useProgress();
  const [copied, setCopied] = useState(false);

  const top = useMemo(
    () =>
      [...runs]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10),
    [runs],
  );

  async function shareScore(record: RunRecord) {
    const text = `Cloud Quest Arcade — I scored ${record.score.toLocaleString()} XP (${record.accuracy}% accuracy, ${record.bestStreak} best streak) on the AWS Cloud Practitioner trainer! Can you beat it?`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Cloud Quest Arcade", text });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // user dismissed share / clipboard blocked — ignore
    }
  }

  const shareText = useMemo(() => {
    if (top.length === 0) return "";
    const lines = top
      .map(
        (r, i) =>
          `${i + 1}. ${r.score.toLocaleString()} XP — ${r.accuracy}% accuracy`,
      )
      .join("\n");
    return `Cloud Quest Arcade — Local Leaderboard\nBest score: ${bestScore.toLocaleString()} XP\n\n${lines}`;
  }, [top, bestScore]);

  async function shareBoard() {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Cloud Quest Arcade", text: shareText });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // ignore
    }
  }

  return (
    <ContentShell
      eyebrow="Local High Scores"
      title="Leaderboard"
      description="Your best runs on this device. Share a score to challenge a friend."
    >
      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            Your best
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">
            {bestScore.toLocaleString()}
          </h2>
          <p className="mt-1 text-sm text-neutral-300">arcade XP</p>
        </div>

        <button
          onClick={shareBoard}
          disabled={top.length === 0}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-3 text-sm font-black text-neutral-900 transition hover:brightness-110 disabled:opacity-40"
        >
          {copied ? "Copied to clipboard!" : "⤴ Share leaderboard"}
        </button>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
            Top runs
          </p>
          {top.length === 0 ? (
            <p className="text-sm text-neutral-400">
              No scores yet. Play a challenge to claim the top spot.
            </p>
          ) : (
            <ol className="space-y-2">
              {top.map((r, i) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-neutral-800/60 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-lg">
                      {MEDALS[i] ?? `${i + 1}`}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {r.score.toLocaleString()} XP
                      </p>
                      <p className="text-xs text-neutral-400">
                        {formatDate(r.timestamp)} · {rankForAccuracy(r.accuracy)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-cyan-200">
                        {r.correctCount}/{r.totalQuestions}
                      </p>
                      <p className="text-xs text-neutral-400">{r.accuracy}%</p>
                    </div>
                    <button
                      onClick={() => shareScore(r)}
                      className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-2 py-1 text-xs font-semibold text-cyan-100 transition hover:brightness-110"
                    >
                      Share
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </ContentShell>
  );
}
