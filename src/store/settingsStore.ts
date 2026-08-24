import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

interface SettingsState {
  userName: string;
  avatarKey: "eugene" | "alex";
  userBackground: string;
  speechVoiceURI: string;
  speechVoiceName: string;
  speechVoiceLang: string;
  speechRate: number;
  targetProfileId: "engineering-manager" | "architecture";
  setUserName: (name: string) => void;
  setAvatarKey: (key: "eugene" | "alex") => void;
  setUserBackground: (bg: string) => void;
  setSpeechVoice: (prefs: {
    voiceURI: string;
    voiceName: string;
    voiceLang: string;
  }) => void;
  setSpeechRate: (rate: number) => void;
  setTargetProfileId: (
    id: "engineering-manager" | "architecture"
  ) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userName: "Eugene",
      avatarKey: "eugene",
      userBackground: "",
      speechVoiceURI: "",
      speechVoiceName: "",
      speechVoiceLang: "en-US",
      speechRate: 1,
      targetProfileId: "engineering-manager",
      setUserName: (userName) => set({ userName }),
      setAvatarKey: (avatarKey) => set({ avatarKey }),
      setUserBackground: (userBackground) => set({ userBackground }),
      setSpeechVoice: ({ voiceURI, voiceName, voiceLang }) =>
        set({
          speechVoiceURI: voiceURI,
          speechVoiceName: voiceName,
          speechVoiceLang: voiceLang,
        }),
      setSpeechRate: (speechRate) => set({ speechRate }),
      setTargetProfileId: (targetProfileId) => set({ targetProfileId }),
    }),
    {
      name: "set-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
