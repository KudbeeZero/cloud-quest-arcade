import { NextResponse } from "next/server";

export interface GeneratedGotcha {
  id: string;
  domain: string;
  trap: string;
  why: string;
}

interface DeepSeekMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface DeepSeekResponse {
  choices?: { message: DeepSeekMessage }[];
  error?: { message: string };
}

const SYSTEM_PROMPT = `You are an AWS Certified Cloud Practitioner (CLF-C02) exam writer. Generate fresh, realistic "gotchas" — common traps that trip up test-takers.

Rules:
- Each gotcha must map to one of these four domains: "Cloud Concepts", "Security and Compliance", "Cloud Technology and Services", "Billing, Pricing and Support".
- The "trap" should be a short, tempting misconception.
- The "why" should explain why it is wrong and what the correct thinking is.
- Return ONLY valid JSON in this exact shape, with no markdown fences:

{"gotchas":[{"domain":"...","trap":"...","why":"..."}, ...]}
`;

function extractJson(text: string): string {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return text;
  return text.slice(firstBrace, lastBrace + 1);
}

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "DEEPSEEK_API_KEY is not configured. Add it to .env.local to enable gotcha generation." },
      { status: 500 },
    );
  }

  let count = 5;
  try {
    const body = (await request.json()) as { count?: number };
    if (typeof body.count === "number" && body.count > 0 && body.count <= 20) {
      count = body.count;
    }
  } catch {
    // use default count
  }

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Generate ${count} new CLF-C02 gotchas as JSON.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown DeepSeek error");
      return NextResponse.json(
        { error: `DeepSeek API error (${response.status}): ${errorText}` },
        { status: 502 },
      );
    }

    const data = (await response.json()) as DeepSeekResponse;
    const raw = data.choices?.[0]?.message?.content ?? "";
    const cleaned = extractJson(raw);

    let parsed: { gotchas?: Omit<GeneratedGotcha, "id">[] };
    try {
      parsed = JSON.parse(cleaned) as { gotchas?: Omit<GeneratedGotcha, "id">[] };
    } catch (parseError) {
      return NextResponse.json(
        { error: "Failed to parse DeepSeek response as JSON.", raw },
        { status: 502 },
      );
    }

    const gotchas = (parsed.gotchas ?? []).map((g, i) => ({
      id: `ai-${Date.now()}-${i}`,
      domain: g.domain,
      trap: g.trap,
      why: g.why,
    }));

    return NextResponse.json({ gotchas });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Network request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
