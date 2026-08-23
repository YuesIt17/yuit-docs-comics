import { loadEpisode } from "@/lib/episode-engine/loadEpisode";
import { V2PracticeSession } from "@/components/v2/V2PracticeSession";

export default function V2HrPracticePage() {
  const episode = loadEpisode("hr-intro");
  return <V2PracticeSession episode={episode} trackId="hr" />;
}
