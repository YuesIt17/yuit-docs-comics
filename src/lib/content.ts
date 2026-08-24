import roster from "@/content/characters/roster.json";
import collocationPack from "@/content/collocations/hr-pack-01.json";
import tips from "@/content/tips/uncle-eugene.json";
import meStories from "@/content/me/stories.json";
import meProfile from "@/content/me/profile.json";
import meCareer from "@/content/me/career.json";
import meHrContext from "@/content/me/hr-context.json";
import hrCoreBank from "@/content/interviews/hr-core-bank.json";
import type { Character, CollocationPack } from "@/lib/episode-engine/types";

export interface MyStory {
  id: string;
  title: string;
  tags: string[];
  cue: string;
}

export interface MeProfile {
  status: string;
  preferredName: string;
  positioning: string;
  experienceYearsOverall: number;
  experienceYearsIt: number;
  targetRoles: string[];
  targetMarket: string;
  englishTarget: string;
  notes: string[];
}

export interface InterviewTopic {
  id: string;
  phase: string;
  provenance: "CORE" | "REAL_INTERVIEW" | "REAL_APPLICATION" | "PREDICTED";
  sophiaPrompt: string;
  intent: string;
}

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

export function getMyStories(): MyStory[] {
  return (meStories.stories ?? []) as MyStory[];
}

export function getMyStoryById(id: string): MyStory | undefined {
  return getMyStories().find((s) => s.id === id);
}

export function getMeProfile(): MeProfile {
  return meProfile as MeProfile;
}

export function getMeCareer() {
  return meCareer;
}

export function getMeHrContext() {
  return meHrContext;
}

/** Safe recruiter-facing claims only — never invent beyond this list. */
export function getRecruiterSafeClaims(): string[] {
  return (meHrContext as { recruiterSafeClaims?: string[] }).recruiterSafeClaims ?? [];
}

export function getHrCoreTopics(): InterviewTopic[] {
  return hrCoreBank.topics as InterviewTopic[];
}
