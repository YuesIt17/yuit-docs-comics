import { loadEpisode, getEpisodeIds } from "@/lib/episode-engine/loadEpisode";
import { EpisodePlayer } from "@/components/episode/EpisodePlayer";
import { notFound } from "next/navigation";

interface EpisodePageProps {
  params: Promise<{ episodeId: string }>;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { episodeId } = await params;

  if (!getEpisodeIds().includes(episodeId)) {
    notFound();
  }

  const episode = loadEpisode(episodeId);
  return <EpisodePlayer episode={episode} />;
}

export async function generateStaticParams() {
  return [{ episodeId: "hr-intro" }];
}
