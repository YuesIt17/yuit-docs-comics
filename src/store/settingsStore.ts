import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";

interface SettingsState {
  userName: string;
  avatarKey: "eugene" | "alex";
  userBackground: string;
  setUserName: (name: string) => void;
  setAvatarKey: (key: "eugene" | "alex") => void;
  setUserBackground: (bg: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      userName: "Eugene",
      avatarKey: "eugene",
      userBackground: "",
      setUserName: (userName) => set({ userName }),
      setAvatarKey: (avatarKey) => set({ avatarKey }),
      setUserBackground: (userBackground) => set({ userBackground }),
    }),
    {
      name: "set-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
