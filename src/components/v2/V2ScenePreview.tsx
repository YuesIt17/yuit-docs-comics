"use client";

import { useState } from "react";
import { SceneRenderer } from "@/components/scene/SceneRenderer";
import { layersToPlacements } from "@/lib/scene/mapLayers";
import { resolvePlaceholders } from "@/lib/episode-engine/sceneResolver";
import type { Scene } from "@/lib/episode-engine/types";

interface V2ScenePreviewProps {
  scene: Scene;
  protagonistName: string;
  episodeTitle: string;
  sceneCount: number;
  difficulty: string;
}

/** Optional comic scene — collapsed by default so the conversation stays primary. */
export function V2ScenePreview({
  scene,
  protagonistName,
  episodeTitle,
  sceneCount,
  difficulty,
}: V2ScenePreviewProps) {
  const [expanded, setExpanded] = useState(false);
  const lastLineIndex = Math.max(0, scene.dialogue.length - 1);

  return (
    <div className="border-b border-panel-border/60 bg-panel/5">
      <div className="max-w-3xl mx-auto px-4 py-2">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between gap-3 text-left text-xs text-slate-500 hover:text-slate-300"
          aria-expanded={expanded}
        >
          <span>{expanded ? "Hide interview scene" : "Show interview scene"}</span>
          <span aria-hidden>{expanded ? "▲" : "▼"}</span>
        </button>

        {expanded && (
          <div className="mt-3">
            <SceneRenderer
              backgroundId={scene.background}
              characters={layersToPlacements(scene.layers, scene.background)}
              dialogueLines={scene.dialogue}
              visibleLineIndex={lastLineIndex}
              protagonistName={protagonistName}
              meta={{
                episodeTitle,
                sceneIndex: scene.index,
                sceneCount,
                difficulty,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function getInterviewerQuestion(
  scene: Scene,
  protagonistName: string
): string {
  const npcLines = scene.dialogue.filter(
    (line) => line.speakerId !== "protagonist"
  );
  // Prefer the opening NPC question — not scripted mid-scene follow-ups.
  const questionLine = npcLines[0] ?? scene.dialogue[0];
  if (!questionLine) return scene.interaction.prompt;
  return resolvePlaceholders(questionLine.text, { protagonistName });
}
