"use client";

import { useMemo, useState } from "react";
import questions from "@/data/questions";
import type { Domain, Difficulty } from "@/lib/types";
import NavBar from "@/components/NavBar";

const ADMIN_PIN = "arcade2024";

const DOMAIN_ORDER: Domain[] = [
  "Cloud Concepts",
  "Security and Compliance",
  "Cloud Technology and Services",
  "Billing, Pricing and Support",
];

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const stats = useMemo(() => {
    const byDomain: Record<Domain, number> = {} as Record<Domain, number>;
    const byDifficulty: Record<Difficulty, number> = {
      easy: 0,
      medium: 0,
      hard: 0,
    };
    for (const q of questions) {
      byDomain[q.domain] = (byDomain[q.domain] ?? 0) + 1;
      byDifficulty[q.difficulty] += 1;
    }
    return { total: questions.length, byDomain, byDifficulty };
  }, []);

  function unlock() {
    if (pin === ADMIN_PIN) {
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-neutral-900/90 p-6">
          <h1 className="text-xl font-black text-white">Admin Access</h1>
          <p className="mt-2 text-sm text-neutral-300">
            Enter the PIN to view the question bank.
          </p>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && unlock()}
            placeholder="PIN"
            className="mt-4 w-full rounded-xl border border-white/10 bg-neutral-800 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-cyan-400"
          />
          {error && (
            <p className="mt-2 text-xs text-rose-400">Incorrect PIN.</p>
          )}
          <button
            onClick={unlock}
            className="mt-4 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-neutral-900 transition hover:brightness-110"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-800/80 to-neutral-900/80 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Admin Console
        </p>
        <h1 className="mt-2 text-xl font-black text-white">
          Question Bank: {stats.total} items
        </h1>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
          By Domain
        </p>
        <div className="grid grid-cols-2 gap-2">
          {DOMAIN_ORDER.map((domain) => (
            <div
              key={domain}
              className="rounded-xl border border-white/10 bg-neutral-800/60 px-3 py-2 text-xs text-neutral-300"
            >
              <span className="font-semibold text-white">{domain}</span>
              <span className="float-right font-semibold text-cyan-300">
                {stats.byDomain[domain]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
          By Difficulty
        </p>
        <div className="grid grid-cols-3 gap-2 text-center">
          {DIFFICULTIES.map((d) => (
            <div key={d} className="rounded-xl border border-white/10 bg-neutral-800/60 p-3">
              <p className="text-xs uppercase tracking-wide text-neutral-400">
                {d}
              </p>
              <p className="mt-1 text-xl font-black text-white">
                {stats.byDifficulty[d]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-violet-300">
          All Questions
        </p>
        <ul className="space-y-2 text-xs">
          {questions.map((q) => (
            <li
              key={q.id}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-neutral-800/60 px-3 py-2"
            >
              <div className="flex-1">
                <span className="font-mono text-neutral-400">{q.id}</span>
                <span className="ml-2 text-neutral-200">{q.prompt.slice(0, 80)}...</span>
              </div>
              <span className="ml-2 font-semibold text-neutral-400">
                {q.difficulty[0].toUpperCase()}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <NavBar />
    </div>
  );
}
