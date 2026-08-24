"use client";

import { HeroPortrait } from "@/components/heroes/HeroPortrait";
import type { ProgressiveHintLevel } from "@/lib/v2/progressiveHints";

interface V2MentorHintCardProps {
  visibleLevels: ProgressiveHintLevel[];
}

export function V2MentorHintCard({ visibleLevels }: V2MentorHintCardProps) {
  if (visibleLevels.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-800/40 bg-amber-950/20 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <HeroPortrait
          characterId="uncle_eugene"
          size="sm"
          alt="Uncle Eugene"
          showBorder
        />
        <div>
          <p className="text-xs font-semibold text-amber-200">Uncle Eugene</p>
          <p className="text-[10px] text-slate-500">Mentor hint</p>
        </div>
      </div>
      <ul className="space-y-2">
        {visibleLevels.map((level) => (
          <li key={level.level} className="text-sm text-amber-50/90 leading-relaxed">
            <span className="text-[10px] uppercase tracking-wider text-amber-400/80 mr-2">
              {level.label}
            </span>
            {level.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
