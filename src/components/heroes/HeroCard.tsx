"use client";

import { Badge } from "@/components/ui/Badge";
import { HeroPortrait } from "@/components/heroes/HeroPortrait";
import type { Character } from "@/lib/episode-engine/types";
import { useSettingsStore } from "@/store/settingsStore";

interface HeroCardProps {
  character: Character;
}

export function HeroCard({ character }: HeroCardProps) {
  const { userName } = useSettingsStore();

  const displayName =
    character.id === "protagonist" ? userName : character.name;

  return (
    <div className="rounded-2xl border border-panel-border bg-panel/60 overflow-hidden hover:border-purple-700/50 transition-colors group">
      <div className="h-56 relative overflow-hidden bg-slate-950">
        <HeroPortrait
          characterId={character.id}
          size="card"
          alt={displayName}
          className="absolute inset-0 scale-110 group-hover:scale-[1.15] transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/30 to-transparent pointer-events-none" />
      </div>
      <div className="p-4 space-y-2 relative">
        <div>
          <h3 className="font-bold text-white">{displayName}</h3>
          <p className="text-xs text-accent-cyan">{character.title}</p>
        </div>
        {character.bio && (
          <p className="text-[11px] text-slate-400 leading-relaxed">{character.bio}</p>
        )}
        <div className="flex flex-wrap gap-1">
          {character.traits.map((trait) => (
            <Badge key={trait} variant="default">
              {trait}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
