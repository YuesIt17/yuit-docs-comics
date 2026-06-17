"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { resolveCharacterAsset } from "@/lib/assets/registry";
import type { CharacterFraming } from "@/lib/scene/sceneLayout";
import { cn } from "@/lib/utils";

export interface CharacterSpriteProps {
  characterId: string;
  alt: string;
  position: { x: string; y: string; scale: number; zIndex?: number };
  flip?: boolean;
  framing?: CharacterFraming;
  /** Inline sprites sit in a flex row; absolute sprites use scene coordinates. */
  layout?: "absolute" | "inline";
  className?: string;
  priority?: boolean;
}

/** Focus point on full-scene hero PNGs for waist-up framing. */
const WAIST_FOCUS: Record<string, string> = {
  sophia: "52% 4%",
  protagonist: "48% 3%",
  default: "50% 4%",
};

const FRAMING: Record<CharacterFraming, { box: string; sizes: string }> = {
  full: {
    box: "relative w-[min(34vw,280px)] h-[min(50vw,420px)]",
    sizes: "280px",
  },
  waist: {
    box: "relative w-[min(18vw,130px)] h-[min(24vw,175px)]",
    sizes: "130px",
  },
  coach: {
    box: "relative w-[min(13vw,80px)] h-[min(13vw,80px)] rounded-full overflow-hidden",
    sizes: "80px",
  },
};

export function CharacterSprite({
  characterId,
  alt,
  position,
  flip = false,
  framing = "full",
  layout = "absolute",
  className,
  priority = false,
}: CharacterSpriteProps) {
  const src = resolveCharacterAsset(characterId);
  const frame = FRAMING[framing];
  const waistUp = framing === "waist" || framing === "coach";

  const sprite = (
    <div className={cn(frame.box, "overflow-hidden shrink-0 rounded-t-2xl")}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn(
          waistUp ? "object-cover" : "object-contain object-bottom",
          flip && "scale-x-[-1]"
        )}
        style={waistUp ? { objectPosition: WAIST_FOCUS[characterId] ?? WAIST_FOCUS.default } : undefined}
        sizes={frame.sizes}
      />
      {framing === "coach" && (
        <div
          className="absolute inset-0 rounded-full border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.2)] pointer-events-none"
          aria-hidden
        />
      )}
    </div>
  );

  if (layout === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={cn("pointer-events-none select-none", className)}
        style={{ zIndex: position.zIndex ?? 10 }}
      >
        {sprite}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: framing === "coach" ? 8 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn("absolute pointer-events-none select-none", className)}
      style={{
        left: position.x,
        bottom: position.y,
        zIndex: position.zIndex ?? 10,
        transform: `translateX(-50%) scale(${position.scale})`,
        transformOrigin: "bottom center",
      }}
    >
      {sprite}
    </motion.div>
  );
}
