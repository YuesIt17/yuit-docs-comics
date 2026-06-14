"use client";

import { BackgroundLayer } from "./BackgroundLayer";
import { CharacterLayer } from "./CharacterLayer";
import { SceneTransition } from "./SceneTransition";
import { SpeechBubble } from "./SpeechBubble";
import { isIllustratedScene } from "@/lib/assets/scene-art";
import {
  getCharacterDisplayName,
  resolvePlaceholders,
} from "@/lib/episode-engine/sceneResolver";
import type { Scene } from "@/lib/episode-engine/types";

interface ComicStageProps {
  scene: Scene;
  protagonistName: string;
  avatarKey: string;
}

export function ComicStage({ scene, protagonistName, avatarKey }: ComicStageProps) {
  const vars = { protagonistName };
  const firstDialogue = scene.dialogue[0];
  const illustrated = isIllustratedScene(scene.background);

  return (
    <SceneTransition sceneKey={scene.id}>
      <div className="relative w-full aspect-[16/9] min-h-[200px] max-h-[320px] rounded-2xl overflow-hidden border border-panel-border shadow-2xl">
        <BackgroundLayer backgroundId={scene.background} />
        {scene.layers.map((layer) => (
          <CharacterLayer
            key={`${scene.id}-${layer.characterId}`}
            layer={layer}
            protagonistName={protagonistName}
            avatarKey={avatarKey}
            hidden={illustrated && layer.characterId !== "trace"}
          />
        ))}
        {firstDialogue && (
          <SpeechBubble
            speakerName={getCharacterDisplayName(
              firstDialogue.speakerId,
              protagonistName
            )}
            text={resolvePlaceholders(firstDialogue.text, vars)}
            position={illustrated ? "left" : firstDialogue.speakerId === "sophia" ? "left" : "right"}
            delay={0.3}
          />
        )}
      </div>
    </SceneTransition>
  );
}
