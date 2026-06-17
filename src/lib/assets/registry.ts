/** Static asset paths — replace PNGs in /public without code changes */

export const CHARACTER_ASSETS = {
  uncle_eugene: "/characters/uncle-eugene.png",
  trace: "/characters/trace.png",
  sophia: "/characters/hr-recruiter.png",
  protagonist: "/characters/young-founder.png",
  archi: "/characters/architect.png",
  reli: "/characters/reliability-guardian.png",
} as const;

export type CharacterAssetKey = keyof typeof CHARACTER_ASSETS;

export const BACKGROUND_ASSETS = {
  startup_office_night: "/backgrounds/startup-office.png",
  startup_office: "/backgrounds/startup-office.png",
  architecture_room: "/backgrounds/architecture-room.png",
  incident_room: "/backgrounds/incident-room.png",
} as const;

export type BackgroundAssetKey = keyof typeof BACKGROUND_ASSETS;

export const UI_ASSETS = {
  mockupReference: "/ui/mockup-reference.png",
} as const;

/** Map episode characterId → asset key */
export function resolveCharacterAsset(characterId: string): string {
  const key = characterId as CharacterAssetKey;
  return CHARACTER_ASSETS[key] ?? CHARACTER_ASSETS.protagonist;
}

export function resolveBackgroundAsset(backgroundId: string): string {
  const key = backgroundId as BackgroundAssetKey;
  return (
    BACKGROUND_ASSETS[key] ??
    BACKGROUND_ASSETS.startup_office_night
  );
}

/** Map JSON characterId to display role name */
export const CHARACTER_ID_TO_ASSET: Record<string, CharacterAssetKey> = {
  uncle_eugene: "uncle_eugene",
  trace: "trace",
  sophia: "sophia",
  protagonist: "protagonist",
  archi: "archi",
  reli: "reli",
};

export interface CharacterPlacement {
  characterId: string;
  position: { x: string; y: string; scale: number; zIndex?: number };
  flip?: boolean;
}

export interface SceneDialogueLine {
  speakerId: string;
  text: string;
  emotion?: string;
}

export interface SceneMeta {
  episodeTitle: string;
  sceneIndex: number;
  sceneCount: number;
  difficulty?: string;
  subtitle?: string;
}
