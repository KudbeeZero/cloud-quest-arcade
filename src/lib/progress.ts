import type { AnsweredQuestion, Domain, Question } from "./types";
import questions from "@/data/questions";

/** A per-domain rollup of the player's cumulative quiz performance. */
export interface DomainStat {
  domain: Domain;
  /** Total questions available in this domain within the bank. */
  total: number;
  /** Cumulative number of questions the player has answered in this domain. */
  attempted: number;
  /** How many of those attempts were correct. */
  correct: number;
  /** Rolling accuracy (0-100) across all attempts in this domain. */
  accuracy: number;
  /**
   * Mastery (0-100): blends rolling accuracy (70%) with how much of the
   * domain's bank the player has actually practiced (30%). This rewards both
   * getting things right and covering the whole domain.
   */
  mastery: number;
}

const STORAGE_KEY = "arcade_domain_progress";

type StoredDomain = { attempted: number; correct: number };
type StoredProgress = Partial<Record<Domain, StoredDomain>>;

export const DOMAIN_ORDER: Domain[] = [
  "Cloud Concepts",
  "Security and Compliance",
  "Cloud Technology and Services",
  "Billing, Pricing and Support",
];

const EMPTY: StoredProgress = {};

/** Read the persisted per-domain tallies (SSR / private-mode safe). */
export function loadProgress(): StoredProgress {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as StoredProgress) : EMPTY;
  } catch {
    return EMPTY;
  }
}

/**
 * Fold a finished run into the cumulative per-domain tallies. Calling this for
 * every completed run is what builds the long-term mastery picture shown on
 * the /progress overview.
 */
export function recordRun(
  answers: AnsweredQuestion[],
  source: Question[] = questions,
): void {
  if (typeof window === "undefined") return;

  const current = loadProgress();
  const byId = new Map(source.map((q) => [q.id, q]));

  for (const answer of answers) {
    const question = byId.get(answer.questionId);
    if (!question) continue;
    const entry = current[question.domain] ?? { attempted: 0, correct: 0 };
    entry.attempted += 1;
    if (answer.correct) entry.correct += 1;
    current[question.domain] = entry;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Persistence is best-effort; ignore unavailable storage.
  }
}

/** Compute the per-domain overview from the bank and persisted tallies. */
export function getDomainStats(source: Question[] = questions): DomainStat[] {
  const stored = loadProgress();
  const counts = source.reduce<Record<Domain, number>>((acc, q) => {
    acc[q.domain] = (acc[q.domain] ?? 0) + 1;
    return acc;
  }, {} as Record<Domain, number>);

  return DOMAIN_ORDER.map((domain) => {
    const entry = stored[domain] ?? { attempted: 0, correct: 0 };
    const total = counts[domain] ?? 0;
    const accuracy =
      entry.attempted > 0
        ? Math.round((entry.correct / entry.attempted) * 100)
        : 0;
    const coverage = total > 0 ? Math.min(entry.attempted, total) / total : 0;
    const mastery = Math.round(accuracy * 0.7 + coverage * 100 * 0.3);
    return { domain, total, attempted: entry.attempted, correct: entry.correct, accuracy, mastery };
  });
}

/** Playful mastery label derived from the blended mastery score. */
export function masteryLabel(mastery: number): string {
  if (mastery >= 85) return "Mastered";
  if (mastery >= 65) return "Proficient";
  if (mastery >= 40) return "Developing";
  if (mastery > 0) return "Novice";
  return "Untouched";
}
