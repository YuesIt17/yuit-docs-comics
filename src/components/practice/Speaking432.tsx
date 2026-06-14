"use client";

import { useState } from "react";
import { TimerRound } from "./TimerRound";
import { RecordButtonStub } from "./RecordButtonStub";
import type { Round432Data } from "@/lib/episode-engine/types";

interface Speaking432Props {
  enabled?: boolean;
  staffHint?: string;
  onSaveRound: (round: Round432Data) => void;
  savedRounds?: Round432Data[];
}

const ROUNDS = [
  { round: 1 as const, minutes: 4, label: "Full explanation", color: "purple" as const },
  { round: 2 as const, minutes: 3, label: "Go deeper", color: "green" as const },
  { round: 3 as const, minutes: 2, label: "Summarise", color: "orange" as const },
];

export function Speaking432({
  enabled = true,
  staffHint,
  onSaveRound,
  savedRounds = [],
}: Speaking432Props) {
  const [activeRound, setActiveRound] = useState<1 | 2 | 3 | null>(null);

  if (!enabled) return null;

  return (
    <div className="border-t border-panel-border pt-4 mt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        4-3-2 Speaking Practice
      </h3>
      <div className="flex flex-wrap gap-3 items-start">
        {ROUNDS.map((r) => (
          <TimerRound
            key={r.round}
            round={r.round}
            durationMinutes={r.minutes}
            label={r.label}
            color={r.color}
            isActive={activeRound === r.round}
            onStart={() => setActiveRound(r.round)}
            onStop={() => setActiveRound(null)}
            onSave={(answer) => {
              onSaveRound({
                round: r.round,
                durationMinutes: r.minutes,
                answer,
                completedAt: Date.now(),
              });
              setActiveRound(null);
            }}
            saved={savedRounds.find((s) => s.round === r.round)}
            hint={
              r.round === 3 && staffHint
                ? `Staff hint: ${staffHint}`
                : r.round === 2
                  ? "Remove filler, add structure"
                  : undefined
            }
          />
        ))}
        <RecordButtonStub />
      </div>
    </div>
  );
}
