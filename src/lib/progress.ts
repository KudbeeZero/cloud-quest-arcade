import type { Domain } from "./types";

export interface DomainStats {
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  flashcardsMastered: number;
}

export interface ProgressData {
  domains: Record<Domain, DomainStats>;
  lastUpdated: number;
}

const STORAGE_KEY = "arcade_progress";

const DEFAULT_STATS: DomainStats = {
  questionsAnswered: 0,
  correctAnswers: 0,
  accuracy: 0,
  flashcardsMastered: 0,
};

const DOMAINS: Domain[] = [
  "Cloud Concepts",
  "Security and Compliance",
  "Cloud Technology and Services",
  "Billing, Pricing and Support",
];

function createEmpty(): ProgressData {
  const domains: Record<Domain, DomainStats> = {
    "Cloud Concepts": { ...DEFAULT_STATS },
    "Security and Compliance": { ...DEFAULT_STATS },
    "Cloud Technology and Services": { ...DEFAULT_STATS },
    "Billing, Pricing and Support": { ...DEFAULT_STATS },
  };
  return { domains, lastUpdated: Date.now() };
}

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmpty();
    const parsed = JSON.parse(raw) as ProgressData;
    if (!parsed || typeof parsed !== "object") return createEmpty();
    const empty = createEmpty();
    for (const d of DOMAINS) {
      empty.domains[d] = { ...empty.domains[d], ...(parsed.domains?.[d] ?? {}) };
    }
    empty.lastUpdated = parsed.lastUpdated ?? Date.now();
    return empty;
  } catch {
    return createEmpty();
  }
}

export function saveProgress(data: ProgressData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

export function recordRunAnswers(
  answers: Array<{
    questionId: string;
    correct: boolean;
  }>,
  domainForQuestion: Map<string, Domain>,
): void {
  if (answers.length === 0) return;
  const progress = loadProgress();
  for (const a of answers) {
    const domain = domainForQuestion.get(a.questionId);
    if (!domain) continue;
    const stats = progress.domains[domain];
    stats.questionsAnswered += 1;
    if (a.correct) stats.correctAnswers += 1;
    stats.accuracy =
      stats.questionsAnswered > 0
        ? Math.round((stats.correctAnswers / stats.questionsAnswered) * 100)
        : 0;
  }
  progress.lastUpdated = Date.now();
  saveProgress(progress);
}

export function recordFlashcardMastered(domain: Domain): void {
  const progress = loadProgress();
  progress.domains[domain] = {
    ...progress.domains[domain],
    flashcardsMastered: progress.domains[domain].flashcardsMastered + 1,
  };
  progress.lastUpdated = Date.now();
  saveProgress(progress);
}

export type MasteryLevel =
  | "none"
  | "beginner"
  | "intermediate"
  | "advanced"
  | "master";

export function masteryLevelForAccuracy(accuracy: number, answered: number): MasteryLevel {
  if (answered === 0) return "none";
  if (accuracy >= 90) return "master";
  if (accuracy >= 75) return "advanced";
  if (accuracy >= 50) return "intermediate";
  return "beginner";
}

export const MASTERY_LABEL: Record<MasteryLevel, string> = {
  none: "Not Started",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  master: "Master",
};

export const MASTERY_COLOR: Record<MasteryLevel, string> = {
  none: "text-neutral-500",
  beginner: "text-amber-300",
  intermediate: "text-cyan-300",
  advanced: "text-violet-300",
  master: "text-emerald-300",
};
