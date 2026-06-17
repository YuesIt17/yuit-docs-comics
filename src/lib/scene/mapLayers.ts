import type { Layer } from "@/lib/episode-engine/types";
import type { CharacterPlacement } from "@/lib/assets/registry";
import {
  INTERVIEW_TRACE_SEAT,
  usesComposedRoom,
} from "@/lib/scene/sceneLayout";

const DEFAULT_Y: Record<string, string> = {
  trace: "32%",
  uncle_eugene: "0%",
};

function interviewPlacement(layer: Layer): CharacterPlacement["position"] {
  if (layer.characterId === "trace") {
    return {
      x: INTERVIEW_TRACE_SEAT.x,
      y: INTERVIEW_TRACE_SEAT.y,
      scale: layer.position.scale ?? INTERVIEW_TRACE_SEAT.scale,
      zIndex: layer.position.zIndex ?? 25,
    };
  }
  return {
    x: "50%",
    y: "0%",
    scale: layer.position.scale ?? 1,
    zIndex: layer.position.zIndex ?? 10,
  };
}

/** Map episode JSON layers → scene renderer placements. */
export function layersToPlacements(
  layers: Layer[],
  backgroundId?: string
): CharacterPlacement[] {
  const interview = backgroundId ? usesComposedRoom(backgroundId) : false;

  return layers.map((layer) => ({
    characterId: layer.characterId,
    position: interview
      ? interviewPlacement(layer)
      : {
          x: layer.position.x,
          y: layer.position.y ?? DEFAULT_Y[layer.characterId] ?? "0%",
          scale: layer.position.scale,
          zIndex:
            layer.position.zIndex ??
            (layer.characterId === "trace"
              ? 25
              : layer.characterId === "protagonist"
                ? 11
                : 10),
        },
    flip:
      interview && layer.characterId === "protagonist"
        ? true
        : layer.flip,
  }));
}
