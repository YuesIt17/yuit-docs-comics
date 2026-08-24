"use client";

import { create } from "zustand";
import {
  advanceOrFollowUp,
  createMockInterviewSession,
  recordAnswer,
} from "@/lib/interview/engine";
import type { TargetProfileId } from "@/lib/interview/resumeProfiles";
import type { InterviewSessionState } from "@/lib/interview/types";

interface InterviewSessionStore {
  session: InterviewSessionState | null;
  startMock: (targetProfileId?: TargetProfileId) => void;
  submitAnswer: (text: string, source: "typed" | "voice" | "mock") => void;
  reset: () => void;
}

export const useInterviewSessionStore = create<InterviewSessionStore>(
  (set, get) => ({
    session: null,

    startMock: (targetProfileId = "engineering-manager") => {
      set({ session: createMockInterviewSession(targetProfileId) });
    },

    submitAnswer: (text, source) => {
      const current = get().session;
      if (!current || current.status !== "in_progress") return;
      const withAnswer = recordAnswer(current, text, source);
      const next = advanceOrFollowUp(withAnswer, text);
      set({ session: next });
    },

    reset: () => set({ session: null }),
  })
);
