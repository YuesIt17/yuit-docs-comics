"use client";

import { cn } from "@/lib/utils";
import {
  DESIGN_TEMPLATE_SRC,
  getHeroCrop,
  HERO_PORTRAIT_DIMENSIONS,
  type HeroPortraitSize,
} from "@/lib/assets/scene-art";

interface HeroPortraitProps {
  characterId: string;
  size?: HeroPortraitSize;
  className?: string;
  alt?: string;
  /** Extra zoom for small overlays (Trace robot) */
  zoom?: number;
  showBorder?: boolean;
}

export function HeroPortrait({
  characterId,
  size = "md",
  className,
  alt,
  zoom = 1,
  showBorder = false,
}: HeroPortraitProps) {
  const crop = getHeroCrop(characterId);
  const dims = HERO_PORTRAIT_DIMENSIONS[size];
  const label = alt ?? characterId;

  const sizeParts = crop.size.split(" ");
  const baseW = parseFloat(sizeParts[0]) || 600;
  const scaledSize =
    zoom !== 1 ? `${baseW * zoom}% ${sizeParts[1] ?? "auto"}` : crop.size;

  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative overflow-hidden bg-slate-950 shrink-0",
        dims.className,
        dims.rounded,
        showBorder && "border-2 border-white/20 shadow-lg",
        characterId === "trace" && "trace-scan border-cyan-400/40",
        className
      )}
      style={{
        backgroundImage: `url(${DESIGN_TEMPLATE_SRC})`,
        backgroundSize: scaledSize,
        backgroundPosition: crop.position,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}
