import type { Episode, Scene } from "./types";

export function getCurrentScene(
  episode: Episode,
  sceneIndex: number
): Scene | null {
  if (sceneIndex < 0 || sceneIndex >= episode.scenes.length) {
    return null;
  }
  return episode.scenes[sceneIndex];
}

export function advanceScene(
  episode: Episode,
  currentIndex: number
): number {
  return Math.min(currentIndex + 1, episode.scenes.length - 1);
}

export function canAdvance(
  currentIndex: number,
  totalScenes: number,
  hasSubmittedAnalysis: boolean
): boolean {
  if (!hasSubmittedAnalysis) return false;
  return currentIndex < totalScenes - 1;
}

export function isEpisodeComplete(
  currentIndex: number,
  totalScenes: number,
  hasSubmittedAnalysis: boolean
): boolean {
  return currentIndex === totalScenes - 1 && hasSubmittedAnalysis;
}

export function resolvePlaceholders(
  text: string,
  vars: Record<string, string>
): string {
  return text.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? `{${key}}`);
}

export function getCharacterDisplayName(
  characterId: string,
  protagonistName: string
): string {
  if (characterId === "protagonist") return protagonistName;
  const names: Record<string, string> = {
    sophia: "Sophia",
    trace: "Trace",
    uncle_eugene: "Uncle Eugene",
    archi: "Archi",
    reli: "Reli",
  };
  return names[characterId] ?? characterId;
}
