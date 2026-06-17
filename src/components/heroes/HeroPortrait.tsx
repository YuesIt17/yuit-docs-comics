"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { resolveCharacterAsset } from "@/lib/assets/registry";

interface HeroPortraitProps {
  characterId: string;
  size?: "xs" | "sm" | "md" | "lg" | "card";
  className?: string;
  alt?: string;
  showBorder?: boolean;
}

const SIZE: Record<string, string> = {
  xs: "w-8 h-8",
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-24",
  card: "w-full h-full",
};

export function HeroPortrait({
  characterId,
  size = "md",
  className,
  alt,
  showBorder = false,
}: HeroPortraitProps) {
  const src = resolveCharacterAsset(characterId);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-slate-900 shrink-0 rounded-xl",
        SIZE[size],
        showBorder && "border-2 border-white/20 shadow-lg",
        characterId === "trace" && "trace-scan border-cyan-400/40 rounded-full",
        className
      )}
    >
      <Image
        src={src}
        alt={alt ?? characterId}
        fill
        className="object-contain object-bottom"
        sizes="80px"
      />
    </div>
  );
}
