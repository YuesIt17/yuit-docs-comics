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

/** Timed compression: ~2.5 min → 90s → 60s (same story, more concise). */
const ROUNDS = [
  {
    round: 1 as const,
    durationSeconds: 150,
    durationMinutes: 2.5,
    label: "Full story",
    color: "purple" as const,
  },
  {
    round: 2 as const,
    durationSeconds: 90,
    durationMinutes: 1.5,
    label: "Tighten it",
    color: "green" as const,
  },
  {
    round: 3 as const,
    durationSeconds: 60,
    durationMinutes: 1,
    label: "60-second pitch",
    color: "orange" as const,
  },
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
        Compression practice
      </h3>
      <p className="text-[11px] text-slate-500 mb-3">
        Retell the same story shorter each round.
      </p>
      <div className="flex flex-wrap gap-3 items-start">
        {ROUNDS.map((r) => (
          <TimerRound
            key={r.round}
            round={r.round}
            durationSeconds={r.durationSeconds}
            label={r.label}
            color={r.color}
            isActive={activeRound === r.round}
            onStart={() => setActiveRound(r.round)}
            onStop={() => setActiveRound(null)}
            onSave={(answer) => {
              onSaveRound({
                round: r.round,
                durationMinutes: r.durationMinutes,
                answer,
                completedAt: Date.now(),
              });
              setActiveRound(null);
            }}
            saved={savedRounds.find((s) => s.round === r.round)}
            hint={
              r.round === 3 && staffHint
                ? `Strong version: ${staffHint}`
                : r.round === 2
                  ? "Remove filler, keep structure"
                  : undefined
            }
          />
        ))}
        <RecordButtonStub />
      </div>
    </div>
  );
}
