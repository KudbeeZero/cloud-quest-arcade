"use client";

// Lightweight stub for a future Algorand-based streak attestation.
// All "transactions" are simulated client-side and persisted in localStorage.
// Replace commitStreak with an actual Algorand SDK call when ready.

/* eslint-disable react-hooks/set-state-in-effect */
// The hook hydrates the persisted chain record from localStorage after mount
// so the first render is SSR-safe; the post-mount setState is intentional.

import { useEffect, useState } from "react";

export type ChainStatus = "idle" | "pending" | "confirmed" | "error";

export interface StreakChainRecord {
  streak: number;
  txId: string;
  committedAt: number;
  date: string;
}

export interface StreakChainState {
  status: ChainStatus;
  txId: string | null;
  committedAt: number | null;
  committedStreak: number;
  committedToday: boolean;
  loading: boolean;
  commitStreak: (streak: number) => Promise<void>;
  reset: () => void;
}

const STORAGE_KEY = "cq_streakChain";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable; state stays in-memory for the session
  }
}

function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function fakeAlgorandTxId(): string {
  // Algorand transaction IDs are 52-character base32 strings.
  // This stub produces a recognizably fake but plausible-looking ID.
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let id = "CQ";
  for (let i = 0; i < 50; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export function useStreakChain(): StreakChainState {
  const [record, setRecord] = useState<StreakChainRecord | null>(null);
  const [status, setStatus] = useState<ChainStatus>("idle");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = loadJSON<StreakChainRecord | null>(STORAGE_KEY, null);
    if (stored && stored.date === todayKey()) {
      setRecord(stored);
      setStatus("confirmed");
    }
  }, []);

  async function commitStreak(streak: number) {
    if (record && record.date === todayKey()) return;
    setStatus("pending");
    setLoading(true);

    // Simulate network / block confirmation latency.
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const next: StreakChainRecord = {
      streak,
      txId: fakeAlgorandTxId(),
      committedAt: Date.now(),
      date: todayKey(),
    };

    setRecord(next);
    setStatus("confirmed");
    setLoading(false);
    saveJSON(STORAGE_KEY, next);
  }

  function reset() {
    setRecord(null);
    setStatus("idle");
    setLoading(false);
    saveJSON(STORAGE_KEY, null);
  }

  return {
    status,
    txId: record?.txId ?? null,
    committedAt: record?.committedAt ?? null,
    committedStreak: record?.streak ?? 0,
    committedToday: record?.date === todayKey(),
    loading,
    commitStreak,
    reset,
  };
}

/** Pure helper: format an Algorand-style tx ID for display. */
export function formatTxId(txId: string | null): string {
  if (!txId) return "—";
  return `${txId.slice(0, 8)}…${txId.slice(-8)}`;
}
