import roster from "@/content/characters/roster.json";
import collocationPack from "@/content/collocations/hr-pack-01.json";
import tips from "@/content/tips/uncle-eugene.json";
import type { Character, CollocationPack } from "@/lib/episode-engine/types";

export function getCharacters(): Character[] {
  return roster.characters as Character[];
}

export function getCharacterById(id: string): Character | undefined {
  return getCharacters().find((c) => c.id === id);
}

export function getCollocationPack(packId: string): CollocationPack | undefined {
  if (packId === "hr-pack-01") return collocationPack as CollocationPack;
  return undefined;
}

export function getRandomTip(): string {
  const list = tips.tips;
  return list[Math.floor(Math.random() * list.length)];
}

export function getAllTips(): string[] {
  return tips.tips;
}
