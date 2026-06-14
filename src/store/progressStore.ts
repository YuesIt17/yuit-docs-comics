import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import type {
  EpisodeProgress,
  Round432Data,
  SceneProgress,
} from "@/lib/episode-engine/types";

interface ProgressState {
  episodes: Record<string, EpisodeProgress>;
  streak: number;
  xp: number;
  level: number;
  initEpisode: (episodeId: string) => void;
  setCurrentScene: (episodeId: string, index: number) => void;
  markSceneSubmitted: (
    episodeId: string,
    sceneId: string,
    data: Partial<SceneProgress>
  ) => void;
  setNotes: (episodeId: string, notes: string) => void;
  save432Round: (
    episodeId: string,
    sceneId: string,
    round: Round432Data
  ) => void;
  completeEpisode: (episodeId: string) => void;
  getEpisodeProgress: (episodeId: string) => EpisodeProgress | undefined;
}

function defaultEpisodeProgress(episodeId: string): EpisodeProgress {
  return {
    episodeId,
    currentSceneIndex: 0,
    completedScenes: [],
    sceneProgress: {},
    notes: "",
  };
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      episodes: {},
      streak: 7,
      xp: 2340,
      level: 4,
      initEpisode: (episodeId) =>
        set((state) => {
          if (state.episodes[episodeId]) return state;
          return {
            episodes: {
              ...state.episodes,
              [episodeId]: defaultEpisodeProgress(episodeId),
            },
          };
        }),
      setCurrentScene: (episodeId, index) =>
        set((state) => {
          const ep =
            state.episodes[episodeId] ?? defaultEpisodeProgress(episodeId);
          return {
            episodes: {
              ...state.episodes,
              [episodeId]: { ...ep, currentSceneIndex: index },
            },
          };
        }),
      markSceneSubmitted: (episodeId, sceneId, data) =>
        set((state) => {
          const ep =
            state.episodes[episodeId] ?? defaultEpisodeProgress(episodeId);
          const existing = ep.sceneProgress[sceneId] ?? { sceneId, submitted: false };
          const updated: SceneProgress = { ...existing, ...data, submitted: true };
          const completedScenes = ep.completedScenes.includes(sceneId)
            ? ep.completedScenes
            : [...ep.completedScenes, sceneId];
          return {
            episodes: {
              ...state.episodes,
              [episodeId]: {
                ...ep,
                sceneProgress: { ...ep.sceneProgress, [sceneId]: updated },
                completedScenes,
              },
            },
            xp: state.xp + 25,
          };
        }),
      setNotes: (episodeId, notes) =>
        set((state) => {
          const ep =
            state.episodes[episodeId] ?? defaultEpisodeProgress(episodeId);
          return {
            episodes: {
              ...state.episodes,
              [episodeId]: { ...ep, notes },
            },
          };
        }),
      save432Round: (episodeId, sceneId, round) =>
        set((state) => {
          const ep =
            state.episodes[episodeId] ?? defaultEpisodeProgress(episodeId);
          const existing = ep.sceneProgress[sceneId] ?? {
            sceneId,
            submitted: false,
          };
          const rounds = existing.rounds432 ?? [];
          const filtered = rounds.filter((r) => r.round !== round.round);
          return {
            episodes: {
              ...state.episodes,
              [episodeId]: {
                ...ep,
                sceneProgress: {
                  ...ep.sceneProgress,
                  [sceneId]: {
                    ...existing,
                    rounds432: [...filtered, round],
                  },
                },
              },
            },
          };
        }),
      completeEpisode: (episodeId) =>
        set((state) => {
          const ep =
            state.episodes[episodeId] ?? defaultEpisodeProgress(episodeId);
          return {
            episodes: {
              ...state.episodes,
              [episodeId]: { ...ep, completedAt: Date.now() },
            },
            xp: state.xp + 150,
          };
        }),
      getEpisodeProgress: (episodeId) => get().episodes[episodeId],
    }),
    {
      name: "set-progress",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
