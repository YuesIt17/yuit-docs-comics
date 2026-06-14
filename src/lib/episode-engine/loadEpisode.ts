import hrIntro from "@/content/episodes/hr-intro.json";
import { EpisodeSchema, type Episode } from "./types";

const EPISODES: Record<string, Episode> = {
  "hr-intro": EpisodeSchema.parse(hrIntro),
};

export function loadEpisode(episodeId: string): Episode {
  const episode = EPISODES[episodeId];
  if (!episode) {
    throw new Error(`Episode not found: ${episodeId}`);
  }
  return episode;
}

export function listEpisodes(): Episode[] {
  return Object.values(EPISODES);
}

export function getEpisodeIds(): string[] {
  return Object.keys(EPISODES);
}
