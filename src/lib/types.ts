// Core domain types for Cloud Quest Arcade.
// Everything here is intentionally simple and dependency-free so the
// foundation stays easy to extend later.

/** The four AWS Cloud Practitioner (CLF-C02) exam domains. */
export type Domain =
  | "Cloud Concepts"
  | "Security and Compliance"
  | "Cloud Technology and Services"
  | "Billing, Pricing and Support";

export type Difficulty = "easy" | "medium" | "hard";

export interface AnswerOption {
  /** Stable identifier, e.g. "a", "b", "c", "d". */
  id: string;
  text: string;
}

export interface Question {
  id: string;
  domain: Domain;
  difficulty: "easy" | "medium" | "hard";
  prompt: string;
  options: AnswerOption[];
  /** The `id` of the correct AnswerOption. */
  correctOptionId: string;
  /** Short plain-language explanation shown after answering. */
  explanation: string;
}

/** A single answered question during a run. */
export interface AnsweredQuestion {
  questionId: string;
  selectedOptionId: string;
  correct: boolean;
  /** Milliseconds the player took to answer. */
  elapsedMs: number;
}

export interface RunResult {
  answers: AnsweredQuestion[];
  totalQuestions: number;
  correctCount: number;
  /** 0-100 accuracy percentage. */
  accuracy: number;
  /** Arcade-style points earned. */
  score: number;
  /** Best consecutive-correct streak in the run. */
  bestStreak: number;
}
