"use client";

import { useState } from "react";
import Link from "next/link";
import { useReadinessScore } from "@/components/ReadinessScore";

type AgentStatus = "online" | "idle" | "offline";

interface AgentCard {
  id: string;
  name: string;
  emoji: string;
  status: AgentStatus;
  description: string;
  lastSeen: string;
}

const AGENTS: AgentCard[] = [
  {
    id: "growpod",
    name: "GrowPod Monitor",
    emoji: "🌱",
    status: "online",
    description: "Tracks daily study reps and economy balance across quests.",
    lastSeen: "Now",
  },
  {
    id: "coach",
    name: "Study Coach",
    emoji: "🎓",
    status: "online",
    description: "Adapts missions and suggests weak-domain review.",
    lastSeen: "Now",
  },
  {
    id: "hermes",
    name: "HERMES",
    emoji: "📡",
    status: "idle",
    description: "Syncs readiness scores and distributes alerts.",
    lastSeen: "2m ago",
  },
];

const STUDY_AGENTS: AgentCard[] = [
  {
    id: "aws-exam-coach",
    name: "AWS Exam Coach",
    emoji: "☁️",
    status: "online",
    description: "Delivers CLF-C02 coaching and topic-specific drills.",
    lastSeen: "Now",
  },
  {
    id: "readiness-sync",
    name: "Readiness Sync",
    emoji: "🔄",
    status: "online",
    description: "Mirrors the local exam-readiness score to the agent swarm.",
    lastSeen: "Now",
  },
];

export default function AgentHub() {
  const { score, loaded } = useReadinessScore();
  const [auditMessage, setAuditMessage] = useState<string | null>(null);
  const [gotchaMessage, setGotchaMessage] = useState<string | null>(null);

  function triggerAudit() {
    setAuditMessage("Queued GrowPod economy audit. Result will land in your run feed.");
    setTimeout(() => setAuditMessage(null), 4000);
  }

  function generateGotchas() {
    setGotchaMessage("Queued DeepSeek gotcha-generation job. New traps will appear on /gotchas when ready.");
    setTimeout(() => setGotchaMessage(null), 4000);
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
            Core Agents
          </h2>
          <span className="text-xs text-neutral-400">3 agents registered</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {AGENTS.map((agent) => (
            <AgentStatusCard key={agent.id} agent={agent} />
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-neutral-300">
            Run a one-off economy check on the GrowPod monitor.
          </p>
          <button
            onClick={triggerAudit}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-4 py-2 text-xs font-black text-neutral-900 transition hover:brightness-110 sm:w-auto"
          >
            ▶ Trigger Audit
          </button>
          {auditMessage && (
            <p className="mt-3 text-xs text-emerald-300">{auditMessage}</p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-violet-300">
            Study Agents
          </h2>
          <span className="text-xs text-neutral-400">2 agents registered</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {STUDY_AGENTS.map((agent) => (
            <AgentStatusCard key={agent.id} agent={agent} />
          ))}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <span className="text-2xl">📊</span>
            <p className="mt-2 text-sm font-bold text-white">Readiness Sync</p>
            <p className="text-xs text-neutral-400">Local exam score</p>
            <p className="mt-2 text-xl font-black text-cyan-300">
              {loaded ? `${score}%` : "…"}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-neutral-300">
            Ask the AWS Exam Coach to generate fresh CLF-C02 gotchas.
          </p>
          <button
            onClick={generateGotchas}
            className="mt-3 w-full rounded-xl bg-gradient-to-r from-violet-400 to-fuchsia-500 px-4 py-2 text-xs font-black text-neutral-900 transition hover:brightness-110 sm:w-auto"
          >
            ✨ Generate New Gotchas
          </button>
          {gotchaMessage && (
            <p className="mt-3 text-xs text-violet-300">{gotchaMessage}</p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs text-neutral-400">
          Agent Hub is a stub dashboard. Audit and gotcha jobs are queued in the
          UI only; wire them to a backend endpoint when you are ready to go live.
        </p>
        <Link
          href="/progress"
          className="mt-2 inline-block text-xs font-semibold text-cyan-300 underline-offset-2 hover:underline"
        >
          ▸ Back to Progress
        </Link>
      </section>
    </div>
  );
}

function AgentStatusCard({ agent }: { agent: AgentCard }) {
  const statusColor =
    agent.status === "online"
      ? "bg-emerald-400"
      : agent.status === "idle"
        ? "bg-amber-400"
        : "bg-rose-400";
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{agent.emoji}</span>
        <span
          className={`inline-flex h-2 w-2 rounded-full ${statusColor}`}
          aria-hidden
        />
      </div>
      <p className="mt-2 text-sm font-bold text-white">{agent.name}</p>
      <p className="mt-1 text-xs text-neutral-400">{agent.description}</p>
      <p className="mt-2 text-[10px] uppercase tracking-wide text-neutral-500">
        {agent.status} · {agent.lastSeen}
      </p>
    </div>
  );
}
