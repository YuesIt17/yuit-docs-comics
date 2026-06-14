"use client";

import { motion } from "framer-motion";
import { HeroPortrait } from "@/components/heroes/HeroPortrait";
import { getCharacterById } from "@/lib/content";
import type { Layer } from "@/lib/episode-engine/types";

interface CharacterLayerProps {
  layer: Layer;
  protagonistName: string;
  avatarKey: string;
  hidden?: boolean;
}

export function CharacterLayer({
  layer,
  protagonistName,
  hidden = false,
}: CharacterLayerProps) {
  if (hidden) return null;

  const character = getCharacterById(layer.characterId);
  const displayName =
    layer.characterId === "protagonist"
      ? protagonistName
      : (character?.name ?? layer.characterId);

  const { x, y, scale } = layer.position;
  const isTrace = layer.characterId === "trace";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.15 }}
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale}) ${layer.flip ? "scaleX(-1)" : ""}`,
        zIndex: isTrace ? 30 : 20,
      }}
    >
      <div className="flex flex-col items-center gap-1">
        <HeroPortrait
          characterId={layer.characterId}
          size={isTrace ? "sm" : "lg"}
          alt={displayName}
          showBorder
          zoom={isTrace ? 1.2 : 1}
        />
        {isTrace && (
          <span className="text-[10px] font-medium text-cyan-300 bg-black/50 px-2 py-0.5 rounded-full">
            {displayName}
          </span>
        )}
      </div>
    </motion.div>
  );
}
