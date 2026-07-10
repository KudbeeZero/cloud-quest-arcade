import type { AnsweredQuestion, Domain } from "./types";
import questions from "@/data/questions";

/**
 * Per-domain progress tracking for Cloud Quest Arcade.
 *
 * Progress is persisted to localStorage only (no backend). Each answered
 * question contributes to its domain's running tallies, which drive the
 * mastery overview shown on the /progress page.
 */

export type MasteryLevel = "locked" | "novice" | "skilled" | "mastered";

export const DOMAIN_ORDER: Domain[] = [
  "Cloud Concepts",
  "Security and Compliance",
  "Cloud Technology and Services",
  "Billing, Pricing and Support",
];

export const DOMAIN_BADGE: Record<Domain, string> = {
  "Cloud Concepts": "☁️",
  "Security and Compliance": "🛡️",
  "Cloud Technology and Services": "⚙️",
  "Billing, Pricing and Support": "💡",
};

export const PROGRESS_STORAGE_KEY = "arcade_progress";

/** Running tallies for a single domain. */
interface DomainTally {
  answered: number;
  correct: number;
}

/** The full persisted progress shape. */
export interface ProgressData {
  domains: Record<Domain, DomainTally>;
  bestStreak: number;
}

/** Minimum answered count before a domain can reach "mastered". */
const MASTERY_MIN_ANSWERED = 3;

export function emptyProgress(): ProgressData {
  return {
    domains: DOMAIN_ORDER.reduce(
      (acc, domain) => {
        acc[domain] = { answered: 0, correct: 0 };
        return acc;
      },
      {} as Record<Domain, DomainTally>,
    ),
    bestStreak: 0,
  };
}

/**
 * Coerce arbitrary parsed JSON into a valid ProgressData, merging with the
 * empty shape so older or partial payloads stay safe to use.
 */
function normalize(raw: unknown): ProgressData {
  const base = emptyProgress();
  if (!raw || typeof raw !== "object") return base;

  const candidate = raw as Partial<ProgressData>;
  if (typeof candidate.bestStreak === "number" && candidate.bestStreak >= 0) {
    base.bestStreak = Math.floor(candidate.bestStreak);
  }

  if (candidate.domains && typeof candidate.domains === "object") {
    for (const domain of DOMAIN_ORDER) {
      const entry = candidate.domains[domain] as DomainTally | undefined;
      if (entry && typeof entry === "object") {
        const answered = Number(entry.answered);
        const correct = Number(entry.correct);
        base.domains[domain] = {
          answered:
            Number.isFinite(answered) && answered >= 0 ? Math.floor(answered) : 0,
          correct:
            Number.isFinite(correct) && correct >= 0 ? Math.floor(correct) : 0,
        };
      }
    }
  }

  return base;
}

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return emptyProgress();
    return normalize(JSON.parse(raw));
  } catch {
    // Corrupt or unavailable storage falls back to a clean slate.
    return emptyProgress();
  }
}

export function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore write failures (private mode, quota, SSR, etc.).
  }
}

/**
 * Merge a finished run's answers into stored progress, persist it, and
 * return the updated data.
 */
export function recordRun(
  answers: AnsweredQuestion[],
  bestStreak: number,
): ProgressData {
  const data = loadProgress();

  for (const answer of answers) {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) continue;
    const tally = data.domains[question.domain];
    tally.answered += 1;
    if (answer.correct) tally.correct += 1;
  }

  data.bestStreak = Math.max(data.bestStreak, bestStreak || 0);
  saveProgress(data);
  return data;
}

export function resetProgress(): ProgressData {
  const empty = emptyProgress();
  saveProgress(empty);
  return empty;
}

/** Derived, display-ready stats for one domain. */
export interface DomainProgress {
  domain: Domain;
  answered: number;
  correct: number;
  /** 0-100 accuracy percentage (0 when unanswered). */
  accuracy: number;
  mastery: MasteryLevel;
}

export function masteryFor(answered: number, accuracy: number): MasteryLevel {
  if (answered === 0) return "locked";
  if (accuracy >= 80 && answered >= MASTERY_MIN_ANSWERED) return "mastered";
  if (accuracy >= 50) return "skilled";
  return "novice";
}

export function getDomainProgress(data: ProgressData): DomainProgress[] {
  return DOMAIN_ORDER.map((domain) => {
    const { answered, correct } = data.domains[domain];
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return {
      domain,
      answered,
      correct,
      accuracy,
      mastery: masteryFor(answered, accuracy),
    };
  });
}

export interface OverallProgress {
  totalAnswered: number;
  totalCorrect: number;
  accuracy: number;
  bestStreak: number;
  masteredCount: number;
}

export function getOverallProgress(data: ProgressData): OverallProgress {
  let totalAnswered = 0;
  let totalCorrect = 0;
  let masteredCount = 0;

  for (const domain of DOMAIN_ORDER) {
    const { answered, correct } = data.domains[domain];
    totalAnswered += answered;
    totalCorrect += correct;
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    if (masteryFor(answered, accuracy) === "mastered") masteredCount += 1;
  }

  const accuracy =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return {
    totalAnswered,
    totalCorrect,
    accuracy,
    bestStreak: data.bestStreak,
    masteredCount,
  };
}
