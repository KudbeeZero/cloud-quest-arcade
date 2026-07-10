"use client";

/* eslint-disable react-hooks/set-state-in-effect */
// SSR-safe hydration: the first client render returns the empty/zero state
// so the server and client trees match, then the post-mount effect pulls the
// real values from localStorage and triggers a single re-render.

import { useEffect, useState } from "react";
import { READINESS_TOPICS } from "./ReadinessScore";

const READINESS_KEY = "cq_readiness";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable; state stays in-memory for the session
  }
}

export default function ExamReadinessChecklist() {
  const [readiness, setReadiness] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setReadiness(loadJSON<Record<string, boolean>>(READINESS_KEY, {}));
    setHydrated(true);
  }, []);

  function toggleTopic(id: string) {
    const updated = { ...readiness, [id]: !readiness[id] };
    setReadiness(updated);
    saveJSON(READINESS_KEY, updated);
  }

  const readyCount = READINESS_TOPICS.filter((t) => readiness[t.id]).length;
  const readinessPct =
    READINESS_TOPICS.length > 0
      ? Math.round((readyCount / READINESS_TOPICS.length) * 100)
      : 0;

  if (!hydrated) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="text-sm text-neutral-300">Loading checklist…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="mb-3 text-sm text-neutral-300">
        Tick off the CLF-C02 areas you feel confident explaining out loud.
      </p>
      <ProgressBar value={readinessPct} sublabel={`${readyCount}/${READINESS_TOPICS.length}`} />
      <ul className="mt-4 space-y-2">
        {READINESS_TOPICS.map((t) => {
          const checked = !!readiness[t.id];
          return (
            <li key={t.id}>
              <button
                role="checkbox"
                aria-checked={checked}
                onClick={() => toggleTopic(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                  checked
                    ? "border-cyan-400/40 bg-cyan-400/10"
                    : "border-white/10 bg-neutral-800/60 hover:border-white/30"
                }`}
              >
                <span
                  aria-hidden
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border text-xs font-black ${
                    checked
                      ? "border-cyan-300 bg-cyan-400 text-neutral-900"
                      : "border-white/20 text-transparent"
                  }`}
                >
                  ✓
                </span>
                <span className="flex-1">
                  <span
                    className={`block text-sm font-semibold ${
                      checked ? "text-cyan-100" : "text-white"
                    }`}
                  >
                    {t.label}
                  </span>
                  <span className="block text-xs text-neutral-400">{t.hint}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ProgressBar({ value, sublabel }: { value: number; sublabel?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      {sublabel && (
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wide text-cyan-300">Progress</span>
          <span className="text-neutral-400">{sublabel}</span>
        </div>
      )}
      <div
        className="h-3 w-full overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
