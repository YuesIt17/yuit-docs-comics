import { create } from "zustand";
import type { TraceAnalysis } from "@/lib/episode-engine/types";

interface TraceState {
  analysis: TraceAnalysis | null;
  isLoading: boolean;
  error: string | null;
  lastSceneId: string | null;
  setAnalysis: (analysis: TraceAnalysis | null, sceneId?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clear: () => void;
}

export const useTraceStore = create<TraceState>((set) => ({
  analysis: null,
  isLoading: false,
  error: null,
  lastSceneId: null,
  setAnalysis: (analysis, sceneId) =>
    set({ analysis, lastSceneId: sceneId ?? null, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
  clear: () =>
    set({ analysis: null, isLoading: false, error: null, lastSceneId: null }),
}));
