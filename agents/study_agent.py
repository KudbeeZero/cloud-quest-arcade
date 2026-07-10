#!/usr/bin/env python3
"""
Lightning AI Study Agent — lightweight question-generation stub.

Run locally or inside a Lightning AI Studio. The script generates CLF-C02
practice questions via an OpenAI-compatible chat endpoint (DeepSeek, OpenAI,
or a model served through Lightning AI).

Usage:
    python agents/study_agent.py --count 5
    python agents/study_agent.py --count 3 --output questions.json

Environment:
    STUDY_AGENT_API_KEY    API key for the chat endpoint.
    STUDY_AGENT_BASE_URL   Endpoint base URL (default: https://api.deepseek.com/v1).
    STUDY_AGENT_MODEL      Model name (default: deepseek-chat).
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from typing import Any

import requests

DEFAULT_BASE_URL = "https://api.deepseek.com/v1"
DEFAULT_MODEL = "deepseek-chat"

SYSTEM_PROMPT = """You are an AWS Certified Cloud Practitioner (CLF-C02) exam writer.
Generate realistic multiple-choice study questions in valid JSON.

Rules:
- Each question must map to one of these four domains: "Cloud Concepts", "Security and Compliance", "Cloud Technology and Services", "Billing, Pricing and Support".
- Provide exactly 4 options labeled A, B, C, D.
- Include one correct answer letter and a brief explanation.
- Return ONLY valid JSON in this exact shape, with no markdown fences:

{"questions":[{"domain":"...","question":"...","options":{"A":"...","B":"...","C":"...","D":"..."},"correct":"A","explanation":"..."}, ...]}
"""


def generate_stub(count: int) -> dict[str, Any]:
    """Return a mock payload when no API key is configured."""
    return {
        "source": "stub",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "questions": [
            {
                "domain": "Cloud Concepts",
                "question": "Which AWS benefit describes the ability to quickly add or remove compute capacity?",
                "options": {
                    "A": "Elasticity",
                    "B": "High availability",
                    "C": "Economies of scale",
                    "D": "Agility",
                },
                "correct": "A",
                "explanation": "Elasticity is the ability to automatically scale resources up and down based on demand.",
            }
            for _ in range(count)
        ],
    }


def generate_questions(count: int) -> dict[str, Any]:
    api_key = os.environ.get("STUDY_AGENT_API_KEY")
    base_url = os.environ.get("STUDY_AGENT_BASE_URL", DEFAULT_BASE_URL).rstrip("/")
    model = os.environ.get("STUDY_AGENT_MODEL", DEFAULT_MODEL)

    if not api_key:
        print("STUDY_AGENT_API_KEY not set; returning stub output.", file=sys.stderr)
        return generate_stub(count)

    response = requests.post(
        f"{base_url}/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": f"Generate {count} new CLF-C02 questions as JSON."},
            ],
            "temperature": 0.7,
            "max_tokens": 2000,
        },
        timeout=60,
    )
    response.raise_for_status()
    data = response.json()
    raw = data["choices"][0]["message"]["content"]

    # Extract JSON even if the model wraps it in markdown fences.
    start = raw.find("{")
    end = raw.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError(f"Could not parse JSON from model response:\n{raw}")
    parsed = json.loads(raw[start : end + 1])

    return {
        "source": model,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "questions": parsed.get("questions", []),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate CLF-C02 study questions")
    parser.add_argument("--count", type=int, default=5, help="Number of questions to generate")
    parser.add_argument("--output", type=str, help="Optional JSON file to write results to")
    args = parser.parse_args()

    payload = generate_questions(args.count)
    output = json.dumps(payload, indent=2)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"Wrote {len(payload['questions'])} questions to {args.output}")
    else:
        print(output)

    return 0


if __name__ == "__main__":
    sys.exit(main())
