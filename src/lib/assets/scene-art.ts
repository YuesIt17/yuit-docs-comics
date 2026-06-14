/** Hero portraits cropped from public/images/design-template.png */

export const DESIGN_TEMPLATE_SRC = "/images/design-template.png";

export interface HeroCrop {
  /** background-size, e.g. "600% auto" for 6-column hero row */
  size: string;
  /** background-position, e.g. "40% 10%" */
  position: string;
}

export interface SceneArtConfig {
  size: string;
  position: string;
  illustrated: boolean;
}

/** Top-row hero cards — 6 equal columns */
export const HERO_CROPS: Record<string, HeroCrop> = {
  uncle_eugene: { size: "600% auto", position: "0% 9%" },
  trace: { size: "600% auto", position: "20% 9%" },
  protagonist: { size: "600% auto", position: "40% 9%" },
  sophia: { size: "600% auto", position: "60% 9%" },
  archi: { size: "600% auto", position: "80% 9%" },
  reli: { size: "600% auto", position: "100% 9%" },
};

export const SCENE_ART: Record<string, SceneArtConfig> = {
  startup_office_night: {
    size: "200% auto",
    position: "50% 88%",
    illustrated: true,
  },
};

export type HeroPortraitSize = "xs" | "sm" | "md" | "lg" | "card";

export const HERO_PORTRAIT_DIMENSIONS: Record<
  HeroPortraitSize,
  { className: string; rounded: string }
> = {
  xs: { className: "w-8 h-8", rounded: "rounded-full" },
  sm: { className: "w-10 h-10", rounded: "rounded-full" },
  md: { className: "w-14 h-14", rounded: "rounded-xl" },
  lg: { className: "w-20 h-24", rounded: "rounded-2xl" },
  card: { className: "w-full h-full", rounded: "rounded-none" },
};

export function getHeroCrop(characterId: string): HeroCrop {
  return HERO_CROPS[characterId] ?? HERO_CROPS.protagonist;
}

export function getSceneArt(backgroundId: string): SceneArtConfig | undefined {
  return SCENE_ART[backgroundId];
}

export function isIllustratedScene(backgroundId: string): boolean {
  return SCENE_ART[backgroundId]?.illustrated ?? false;
}

/** @deprecated use getHeroCrop */
export function getHeroArt(characterId: string) {
  const crop = getHeroCrop(characterId);
  return { src: DESIGN_TEMPLATE_SRC, objectPosition: crop.position };
}
