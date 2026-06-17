"use client";

import { Speaking432 } from "@/components/practice/Speaking432";
import type { Round432Data } from "@/lib/episode-engine/types";

interface SpeakingPracticeCardProps {
  enabled?: boolean;
  staffHint?: string;
  onSaveRound: (round: Round432Data) => void;
  savedRounds?: Round432Data[];
}

export function SpeakingPracticeCard(props: SpeakingPracticeCardProps) {
  return <Speaking432 {...props} />;
}
