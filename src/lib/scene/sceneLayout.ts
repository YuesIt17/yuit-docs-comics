/** Background IDs that use CSS-composed rooms instead of raster images. */
const COMPOSED_ROOM_IDS = new Set([
  "startup_office_night",
  "startup_office",
]);

export function usesComposedRoom(backgroundId: string): boolean {
  return COMPOSED_ROOM_IDS.has(backgroundId);
}

export type CharacterFraming = "full" | "waist" | "coach";

export function framingForCharacter(
  characterId: string,
  interviewLayout: boolean
): CharacterFraming {
  if (!interviewLayout) return "full";
  if (characterId === "trace") return "coach";
  return "waist";
}

/** Coach avatar — fixed corner position in interview scenes. */
export const INTERVIEW_TRACE_SEAT = { x: "92%", y: "28%", scale: 1 } as const;

/** Speech bubble placement beside each speaker in interview layout. */
export type InterviewBubblePlacement = "beside-left" | "beside-right" | "above";

export function interviewBubblePlacement(
  speakerId: string
): InterviewBubblePlacement {
  if (speakerId === "sophia") return "beside-left";
  if (speakerId === "protagonist") return "beside-right";
  return "above";
}
