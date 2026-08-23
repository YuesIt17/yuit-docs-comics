import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

export type V2TrackId = "hr" | "behavioral" | "leadership" | "technical";

export interface V2TrackProgress {
  completedQuestions: number;
  totalQuestions: number;
  currentSceneIndex: number;
  lastScore?: number;
  scores: number[];
}

interface V2ProgressState {
  tracks: Record<V2TrackId, V2TrackProgress>;
  minutesToday: number;
  streak: number;
  lastSessionDate?: string;
  initTrack: (trackId: V2TrackId, totalQuestions: number) => void;
  setCurrentScene: (trackId: V2TrackId, sceneIndex: number) => void;
  markQuestionComplete: (
    trackId: V2TrackId,
    sceneIndex: number,
    score: number
  ) => void;
  addPracticeMinutes: (minutes: number) => void;
  getSpeakingReadiness: () => number;
  resetTrack: (trackId: V2TrackId) => void;
  resetAll: () => void;
}

const DAILY_GOAL_MINUTES = 20;

function defaultTrackProgress(totalQuestions: number): V2TrackProgress {
  return {
    completedQuestions: 0,
    totalQuestions,
    currentSceneIndex: 0,
    scores: [],
  };
}

function defaultTracks(): Record<V2TrackId, V2TrackProgress> {
  return {
    hr: defaultTrackProgress(8),
    behavioral: defaultTrackProgress(0),
    leadership: defaultTrackProgress(0),
    technical: defaultTrackProgress(0),
  };
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useV2ProgressStore = create<V2ProgressState>()(
  persist(
    (set, get) => ({
      tracks: defaultTracks(),
      minutesToday: 0,
      streak: 0,
      lastSessionDate: undefined,

      initTrack: (trackId, totalQuestions) =>
        set((state) => {
          const existing = state.tracks[trackId];
          if (existing && existing.totalQuestions === totalQuestions) {
            return state;
          }
          return {
            tracks: {
              ...state.tracks,
              [trackId]: existing
                ? { ...existing, totalQuestions }
                : defaultTrackProgress(totalQuestions),
            },
          };
        }),

      setCurrentScene: (trackId, sceneIndex) =>
        set((state) => {
          const track =
            state.tracks[trackId] ?? defaultTrackProgress(8);
          return {
            tracks: {
              ...state.tracks,
              [trackId]: { ...track, currentSceneIndex: sceneIndex },
            },
          };
        }),

      markQuestionComplete: (trackId, sceneIndex, score) =>
        set((state) => {
          const track =
            state.tracks[trackId] ?? defaultTrackProgress(8);
          const completedQuestions = Math.max(
            track.completedQuestions,
            sceneIndex + 1
          );
          const scores = [...track.scores, score];
          return {
            tracks: {
              ...state.tracks,
              [trackId]: {
                ...track,
                completedQuestions,
                currentSceneIndex: sceneIndex,
                lastScore: score,
                scores,
              },
            },
          };
        }),

      addPracticeMinutes: (minutes) =>
        set((state) => {
          const today = todayKey();
          const isNewDay = state.lastSessionDate !== today;
          return {
            minutesToday: isNewDay ? minutes : state.minutesToday + minutes,
            lastSessionDate: today,
          };
        }),

      getSpeakingReadiness: () => {
        const { tracks } = get();
        const hrScores = tracks.hr.scores;
        if (hrScores.length === 0) return 68;
        const avg =
          hrScores.reduce((sum, s) => sum + s, 0) / hrScores.length;
        return Math.round(Math.min(100, Math.max(40, avg)));
      },

      resetTrack: (trackId) =>
        set((state) => ({
          tracks: {
            ...state.tracks,
            [trackId]: defaultTrackProgress(
              state.tracks[trackId]?.totalQuestions ?? 8
            ),
          },
        })),

      resetAll: () =>
        set({
          tracks: defaultTracks(),
          minutesToday: 0,
          streak: 0,
          lastSessionDate: undefined,
        }),
    }),
    {
      name: "set-progress-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export { DAILY_GOAL_MINUTES };
