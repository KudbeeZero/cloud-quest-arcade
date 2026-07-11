"use client";

/* eslint-disable react-hooks/set-state-in-effect */
// The page reads persisted gotcha-progress state from localStorage after
// mount; the "Loading…" guard keeps the server and first client render
// identical, so the post-mount setState is intentional hydration, not a
// derived-state anti-pattern.

import { useEffect, useState, useSyncExternalStore } from "react";
import ContentShell from "@/components/ContentShell";
import Prose from "@/components/Prose";
import {
  GOTCHAS,
  countReviewed,
  getGotchasServerSnapshot,
  getGotchasSnapshot,
  loadGotchaProgress,
  reviewedPct,
  saveGotchaProgress,
  subscribeGotchas,
} from "@/lib/gotchas";

export default function GotchasPage() {
  // `getSnapshot` returns the raw localStorage STRING (a stable primitive) so
  // React's Object.is comparison doesn't fire on every render — see the
  // `useSyncExternalStore` rule in context.md. Parsing happens in render.
  const raw = useSyncExternalStore(
    subscribeGotchas,
    getGotchasSnapshot,
    getGotchasServerSnapshot,
  );
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [hydrationDone, setHydrationDone] = useState(false);

  useEffect(() => {
    setProgress(loadGotchaProgress());
    setHydrationDone(true);
  }, [raw]);

  function toggle(id: string) {
    const next = { ...progress, [id]: !progress[id] };
    setProgress(next);
    saveGotchaProgress(next);
  }

  function resetAll() {
    const next: Record<string, boolean> = {};
    setProgress(next);
    saveGotchaProgress(next);
  }

  const reviewed = countReviewed(progress);
  const total = GOTCHAS.length;
  const pct = reviewedPct(progress);

  return (
    <ContentShell
      eyebrow="Exam Traps"
      title="Gotchas"
      description="Common CLF-C02 traps that trip up test-takers. Tap a card to reveal why the tempting answer is wrong, then tick it once you've reviewed it — your ticks feed the Exam Readiness score on /progress."
    >
      <section className="mb-4 rounded-2xl border border-cyan-300/30 bg-cyan-400/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
              Gotchas mastered
            </p>
            <p className="mt-1 text-2xl font-black text-white">
              {reviewed}
              <span className="text-base font-semibold text-neutral-400">
                {" "}
                / {total}
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="h-2 w-32 overflow-hidden rounded-full bg-neutral-800 ring-1 ring-inset ring-white/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
            {hydrationDone && reviewed > 0 && (
              <button
                onClick={resetAll}
                className="rounded-lg border border-white/10 bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-300 transition hover:border-rose-300/40 hover:text-rose-200"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        {GOTCHAS.map((g, i) => {
          const isReviewed = !!progress[g.id];
          return (
            <details
              key={g.id}
              className={`group rounded-2xl border p-4 transition [&_summary::-webkit-details-marker]:hidden ${
                isReviewed
                  ? "border-cyan-300/40 bg-cyan-400/5"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <summary className="cursor-pointer list-none">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                      {g.domain}
                    </span>
                    <p
                      className={`mt-1 text-sm font-semibold ${
                        isReviewed ? "text-cyan-50" : "text-white"
                      }`}
                    >
                      <span className="mr-2 text-neutral-500">{i + 1}.</span>
                      {g.trap}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isReviewed}
                      aria-label={
                        isReviewed ? "Mark as not reviewed" : "Mark as reviewed"
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        toggle(g.id);
                      }}
                      className={`grid h-7 w-7 place-items-center rounded-md border text-xs font-black transition ${
                        isReviewed
                          ? "border-cyan-300 bg-cyan-400 text-neutral-900"
                          : "border-white/20 bg-neutral-800 text-transparent hover:border-cyan-300/60"
                      }`}
                    >
                      ✓
                    </button>
                    <span className="text-cyan-300 transition group-open:rotate-45">
                      +
                    </span>
                  </div>
                </div>
              </summary>
              <Prose>
                <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-amber-100">
                  {g.why}
                </p>
              </Prose>
            </details>
          );
        })}
      </div>
    </ContentShell>
  );
}
