import { create } from "zustand";
import type { DialogueEntry } from "@/lib/episode-engine/types";

interface EpisodeState {
  episodeId: string | null;
  sceneIndex: number;
  dialogueLog: DialogueEntry[];
  showHint: boolean;
  setEpisode: (episodeId: string) => void;
  setSceneIndex: (index: number) => void;
  addDialogue: (entry: DialogueEntry) => void;
  clearDialogue: () => void;
  setShowHint: (show: boolean) => void;
  resetEpisode: (episodeId: string) => void;
}

export const useEpisodeStore = create<EpisodeState>((set) => ({
  episodeId: null,
  sceneIndex: 0,
  dialogueLog: [],
  showHint: false,
  setEpisode: (episodeId) => set({ episodeId }),
  setSceneIndex: (sceneIndex) => set({ sceneIndex }),
  addDialogue: (entry) =>
    set((state) => ({ dialogueLog: [...state.dialogueLog, entry] })),
  clearDialogue: () => set({ dialogueLog: [] }),
  setShowHint: (showHint) => set({ showHint }),
  resetEpisode: (episodeId) =>
    set({ episodeId, sceneIndex: 0, dialogueLog: [], showHint: false }),
}));
