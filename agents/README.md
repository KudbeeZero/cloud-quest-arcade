# Lightning AI Study Agent

This folder contains a lightweight Python stub for generating AWS CLF-C02 study questions. It is designed to run locally or inside a Lightning AI Studio.

## Files

- `study_agent.py` — generates multiple-choice questions via an OpenAI-compatible chat endpoint.

## Setup

```bash
cd agents
pip install requests
export STUDY_AGENT_API_KEY="your-api-key"
# Optional overrides:
export STUDY_AGENT_BASE_URL="https://api.deepseek.com/v1"
export STUDY_AGENT_MODEL="deepseek-chat"
```

## Usage

```bash
python agents/study_agent.py --count 5
python agents/study_agent.py --count 3 --output questions.json
```

If `STUDY_AGENT_API_KEY` is not set, the script returns a stub payload so the integration can be tested without credentials.

## Dashboard integration

The Next.js dashboard exposes a **Run Lightning AI Agent** button that calls `/api/agents/study`. That endpoint is also a stub and returns the same shape as `study_agent.py`, keeping the UI and CLI aligned.
