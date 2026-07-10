import { NextResponse } from "next/server";

export interface GeneratedQuestion {
  domain: string;
  question: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
}

interface AgentPayload {
  source: string;
  generatedAt: string;
  questions: GeneratedQuestion[];
}

export async function POST(request: Request) {
  let count = 5;
  try {
    const body = (await request.json()) as { count?: number };
    if (typeof body.count === "number" && body.count > 0 && body.count <= 20) {
      count = body.count;
    }
  } catch {
    // use default count
  }

  // Stub: in production this would shell out to `python agents/study_agent.py`
  // or call a deployed Lightning AI Studio endpoint. Returning mock data keeps
  // the dashboard button functional without runtime Python dependencies.
  const payload: AgentPayload = {
    source: "lightning-ai-stub",
    generatedAt: new Date().toISOString(),
    questions: Array.from({ length: count }, (_, i) => ({
      domain: "Cloud Concepts",
      question: `Stub question ${i + 1}: Which AWS benefit describes the ability to quickly add or remove compute capacity?`,
      options: {
        A: "Elasticity",
        B: "High availability",
        C: "Economies of scale",
        D: "Agility",
      },
      correct: "A",
      explanation:
        "Elasticity is the ability to automatically scale resources up and down based on demand.",
    })),
  };

  return NextResponse.json(payload);
}
