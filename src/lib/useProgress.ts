"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  loadRuns,
  loadBestScore,
  subscribe,
  loadSavedRun,
  subscribeSavedRun,
  getSavedRunSnapshot,
  getSavedRunServerSnapshot,
  type RunRecord,
  type SavedRun,
} from "./progress";

export interface ProgressState {
  runs: RunRecord[];
  bestScore: number;
  loaded: boolean;
}

/** Re-reads the progress store on mount and whenever it changes. */
export function useProgress(): ProgressState {
  const [state, setState] = useState<ProgressState>({
    runs: [],
    bestScore: 0,
    loaded: false,
  });

  useEffect(() => {
    function refresh() {
      setState({ runs: loadRuns(), bestScore: loadBestScore(), loaded: true });
    }
    refresh();
    return subscribe(refresh);
  }, []);

  return state;
}

/**
 * Subscribes to the in-flight (mid-test) saved run. The snapshot is the raw
 * localStorage string so `getSnapshot` returns a stable primitive on unchanged
 * data; we parse it in the render body (see the
 * `useSyncExternalStore` rule in context.md).
 */
export function useSavedRun(): SavedRun | null {
  const raw = useSyncExternalStore(
    subscribeSavedRun,
    getSavedRunSnapshot,
    getSavedRunServerSnapshot,
  );
  if (raw === null) return null;
  try {
    const parsed = JSON.parse(raw) as SavedRun;
    if (!parsed || !Array.isArray(parsed.order) || !Array.isArray(parsed.answers)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
