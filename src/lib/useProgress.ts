"use client";

import { useEffect, useState } from "react";
import {
  loadRuns,
  loadBestScore,
  subscribe,
  type RunRecord,
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
