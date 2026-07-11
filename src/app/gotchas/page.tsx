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
import {
  appendAIGotchas,
  clearAIGotchas,
  generateGotchas,
  getAIGotchasServerSnapshot,
  getAIGotchasSnapshot,
  loadAIGotchas,
  subscribeAIGotchas,
  type GeneratedGotcha,
} from "@/lib/deepseek";

type GenStatus = "idle" | "loading" | "success" | "error";

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

  // AI-generated gotchas (separate localStorage slot, separate subscription).
  const aiRaw = useSyncExternalStore(
    subscribeAIGotchas,
    getAIGotchasSnapshot,
    getAIGotchasServerSnapshot,
  );
  const [aiGotchas, setAIGotchas] = useState<GeneratedGotcha[]>([]);

  // --- Generate-button state machine -----------------------------------------
  const [genStatus, setGenStatus] = useState<GenStatus>("idle");
  const [genError, setGenError] = useState<string | null>(null);
  const [lastCount, setLastCount] = useState(0);

  useEffect(() => {
    setProgress(loadGotchaProgress());
    setAIGotchas(loadAIGotchas());
    setHydrationDone(true);
  }, [raw, aiRaw]);

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

  async function handleGenerate() {
    if (genStatus === "loading") return;
    setGenStatus("loading");
    setGenError(null);
    try {
      const fresh = await generateGotchas();
      const updated = appendAIGotchas(fresh);
      setAIGotchas(updated);
      setLastCount(fresh.length);
      setGenStatus("success");
      // Auto-dismiss the success banner after a few seconds so the next click
      // starts from a clean slate.
      window.setTimeout(() => {
        setGenStatus((s) => (s === "success" ? "idle" : s));
      }, 4000);
    } catch (err) {
      const message =
        err instanceof Error && err.message === "network"
          ? "DeepSeek request failed (network). Try again."
          : "Something went wrong. Try again.";
      setGenError(message);
      setGenStatus("error");
    }
  }

  function handleClearAI() {
    if (aiGotchas.length === 0) return;
    clearAIGotchas();
    setAIGotchas([]);
    // Drop reviews for AI items so the mastery count stays honest.
    const pruned: Record<string, boolean> = {};
    for (const [k, v] of Object.entries(progress)) {
      if (k.startsWith("ai-")) continue;
      pruned[k] = v;
    }
    setProgress(pruned);
    saveGotchaProgress(pruned);
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

      <section className="mb-4 rounded-2xl border border-violet-300/30 bg-violet-400/5 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">
              ✨ AI Gotcha Generator
            </p>
            <p className="mt-1 text-sm text-neutral-300">
              Pull 3 fresh CLF-C02 traps from DeepSeek. Generated items are
              added below and can be reviewed just like the curated set.
            </p>
          </div>
          <GenerateButton
            status={genStatus}
            onClick={handleGenerate}
            errorMessage={genError}
            successCount={lastCount}
            aiCount={aiGotchas.length}
          />
        </div>

        {genStatus === "error" && genError && (
          <p
            role="alert"
            className="mt-3 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200"
          >
            ⚠ {genError}
          </p>
        )}
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

      {aiGotchas.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-violet-300">
              ✨ AI-Generated ({aiGotchas.length})
            </h2>
            <button
              type="button"
              onClick={handleClearAI}
              className="rounded-lg border border-white/10 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-300 transition hover:border-rose-300/40 hover:text-rose-200"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {aiGotchas.map((g, i) => {
              const isReviewed = !!progress[g.id];
              return (
                <details
                  key={g.id}
                  className={`group rounded-2xl border p-4 transition [&_summary::-webkit-details-marker]:hidden ${
                    isReviewed
                      ? "border-violet-300/40 bg-violet-400/5"
                      : "border-violet-300/20 bg-violet-400/5"
                  }`}
                >
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-xs font-semibold uppercase tracking-wide text-violet-300">
                          {g.domain} · AI
                        </span>
                        <p
                          className={`mt-1 text-sm font-semibold ${
                            isReviewed ? "text-violet-50" : "text-white"
                          }`}
                        >
                          <span className="mr-2 text-neutral-500">
                            A{i + 1}.
                          </span>
                          {g.trap}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isReviewed}
                          aria-label={
                            isReviewed
                              ? "Mark as not reviewed"
                              : "Mark as reviewed"
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            toggle(g.id);
                          }}
                          className={`grid h-7 w-7 place-items-center rounded-md border text-xs font-black transition ${
                            isReviewed
                              ? "border-violet-300 bg-violet-400 text-neutral-900"
                              : "border-white/20 bg-neutral-800 text-transparent hover:border-violet-300/60"
                          }`}
                        >
                          ✓
                        </button>
                        <span className="text-violet-300 transition group-open:rotate-45">
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
        </section>
      )}
    </ContentShell>
  );
}

/**
 * The "Generate Gotchas" CTA. Renders four visual states:
 *  - idle:     gradient "✨ Generate" button (or a one-time "Generated 3!
 *              new gotchas" success badge that auto-dismisses)
 *  - loading:  disabled button with a CSS spinner + "Generating..." label
 *  - success:  emerald "✓ Generated N new gotchas!" badge for ~4s, then
 *              returns to idle
 *  - error:    rose-tinted button label (the actual error message is
 *              surfaced in a separate alert line above the button)
 */
function GenerateButton({
  status,
  onClick,
  errorMessage,
  successCount,
  aiCount,
}: {
  status: GenStatus;
  onClick: () => void;
  errorMessage: string | null;
  successCount: number;
  aiCount: number;
}) {
  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 rounded-xl border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-100"
      >
        <span aria-hidden>✓</span>
        <span>
          Generated {successCount} new {successCount === 1 ? "gotcha" : "gotchas"}!
        </span>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <button
        type="button"
        disabled
        aria-busy="true"
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-neutral-800 px-4 py-2 text-sm font-semibold text-neutral-300"
      >
        <span
          aria-hidden
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-violet-300/40 border-t-violet-300"
        />
        Generating…
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        errorMessage ? "Retry generating gotchas" : "Generate gotchas with AI"
      }
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black shadow transition active:scale-[0.99] ${
        status === "error"
          ? "border border-rose-300/50 bg-rose-500/15 text-rose-100 hover:brightness-110"
          : "bg-gradient-to-r from-violet-400 to-fuchsia-500 text-neutral-900 shadow-violet-500/20 hover:brightness-110"
      }`}
    >
      <span aria-hidden>
        {status === "error" ? "↻" : "✨"}
      </span>
      <span>
        {status === "error"
          ? "Retry"
          : aiCount > 0
            ? "Generate more"
            : "Generate"}
      </span>
    </button>
  );
}
