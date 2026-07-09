import type { AnsweredQuestion, Domain, Question, RunResult } from "./types";
import { rankForAccuracy } from "./scoring";

/** A single domain's running correct/total counts. */
export interface DomainStat {
  correct: number;
  total: number;
}

/** A missed question captured for later review. */
export interface MissedItem {
  questionId: string;
  prompt: string;
  correctText: string;
  domain: Domain;
  explanation: string;
}

/** A completed quiz session, stored in history and as `lastSession`. */
export interface SessionRecord {
  /** ISO timestamp of when the session finished. */
  date: string;
  score: number;
  accuracy: number;
  rank: string;
  bestStreak: number;
  domainBreakdown: Record<Domain, DomainStat>;
  missed: MissedItem[];
}

/** All persisted player progress (frontend-only, stored in localStorage). */
export interface ProgressState {
  bestScore: number;
  bestStreak: number;
  bestRank: string;
  /** Internal: the accuracy that produced `bestRank` (higher is better). */
  bestAccuracy: number;
  lastSession: SessionRecord | null;
  /** Most-recent-first, capped at `MAX_HISTORY`. */
  history: SessionRecord[];
  /** Cumulative correct/total across every recorded session. */
  domainTotals: Record<Domain, DomainStat>;
}

/** Max number of completed sessions kept in history. */
export const MAX_HISTORY = 5;

const STORAGE_KEY = "cqa:progress:v1";

const EMPTY_DOMAIN_TOTALS: Record<Domain, DomainStat> = {
  "Cloud Concepts": { correct: 0, total: 0 },
  "Security and Compliance": { correct: 0, total: 0 },
  "Cloud Technology and Services": { correct: 0, total: 0 },
  "Billing, Pricing and Support": { correct: 0, total: 0 },
};

/** Safe default state with no localStorage access. */
export function emptyProgress(): ProgressState {
  return {
    bestScore: 0,
    bestStreak: 0,
    bestRank: "Cadet",
    bestAccuracy: 0,
    lastSession: null,
    history: [],
    domainTotals: structuredCloneSafe(EMPTY_DOMAIN_TOTALS),
  };
}

function structuredCloneSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Read persisted progress, falling back to defaults on any failure. */
export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return emptyProgress();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...emptyProgress(), ...parsed };
  } catch {
    return emptyProgress();
  }
}

/** Persist progress to localStorage. No-ops outside the browser. */
export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private mode / quota). Fail soft.
  }
}

/** Percentage 0-100, or 0 when there are no attempts yet. */
export function accuracyPct(stat: DomainStat): number {
  return stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
}

function emptyDomainStat(): Record<Domain, DomainStat> {
  return structuredCloneSafe(EMPTY_DOMAIN_TOTALS);
}

/**
 * Build a SessionRecord from the answered questions and the question bank.
 * All content is sourced from the app's own original questions.
 */
export function buildSessionRecord(
  answers: AnsweredQuestion[],
  questions: Question[],
  result: RunResult,
  nowMs: number,
): SessionRecord {
  const byId = new Map(questions.map((q) => [q.id, q]));
  const breakdown: Record<Domain, DomainStat> = emptyDomainStat();
  const missed: MissedItem[] = [];

  for (const answer of answers) {
    const question = byId.get(answer.questionId);
    if (!question) continue;

    const stat = breakdown[question.domain];
    stat.total += 1;
    if (answer.correct) stat.correct += 1;
    else {
      const correctText =
        question.options.find((o) => o.id === question.correctOptionId)?.text ??
        "";
      missed.push({
        questionId: question.id,
        prompt: question.prompt,
        correctText,
        domain: question.domain,
        explanation: question.explanation,
      });
    }
  }

  return {
    date: new Date(nowMs).toISOString(),
    score: result.score,
    accuracy: result.accuracy,
    rank: rankForAccuracy(result.accuracy),
    bestStreak: result.bestStreak,
    domainBreakdown: breakdown,
    missed,
  };
}

/**
 * Merge a finished session into the previous progress, returning a new state.
 * Updates bests, appends to history, and accumulates domain totals.
 */
export function recordSession(
  prev: ProgressState,
  session: SessionRecord,
): ProgressState {
  const history = [session, ...prev.history].slice(0, MAX_HISTORY);

  const domainTotals = emptyDomainStat();
  for (const domain of Object.keys(domainTotals) as Domain[]) {
    const before = prev.domainTotals[domain];
    const justNow = session.domainBreakdown[domain];
    domainTotals[domain] = {
      correct: before.correct + justNow.correct,
      total: before.total + justNow.total,
    };
  }

  const improvedRank =
    session.accuracy >= prev.bestAccuracy || prev.bestAccuracy === 0;

  return {
    bestScore: Math.max(prev.bestScore, session.score),
    bestStreak: Math.max(prev.bestStreak, session.bestStreak),
    bestRank: improvedRank ? session.rank : prev.bestRank,
    bestAccuracy: Math.max(prev.bestAccuracy, session.accuracy),
    lastSession: session,
    history,
    domainTotals,
  };
}

/** Clear all progress (used by the reset action). */
export function resetProgress(): ProgressState {
  const cleared = emptyProgress();
  saveProgress(cleared);
  return cleared;
}

// ---------------------------------------------------------------------------
// Store-backed access via useSyncExternalStore.
//
// Reading persisted progress through a store (instead of setState-in-effect)
// keeps the initial render stable for SSR/hydration and lets updates flow
// through React's subscription model without cascading renders.
// ---------------------------------------------------------------------------

type Listener = () => void;

let clientSnapshot: ProgressState | null = null;
let serverSnapshot: ProgressState | null = null;
const listeners = new Set<Listener>();

function getSnapshot(): ProgressState {
  if (clientSnapshot === null) clientSnapshot = loadProgress();
  return clientSnapshot;
}

function getServerSnapshot(): ProgressState {
  if (serverSnapshot === null) serverSnapshot = emptyProgress();
  return serverSnapshot;
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  listeners.forEach((listener) => listener());
}

/** Replace the current progress and persist it. */
export function setProgressState(next: ProgressState): void {
  clientSnapshot = next;
  saveProgress(next);
  emit();
}

/** React external-store bindings for `useSyncExternalStore`. */
export const progressStore = {
  subscribe,
  getSnapshot,
  getServerSnapshot,
};
