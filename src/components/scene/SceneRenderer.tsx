"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CharacterSprite } from "./CharacterSprite";
import { InterviewRoomBackground } from "./InterviewRoomBackground";
import { InterviewTable } from "./InterviewTable";
import { SpeechBubble, type BubbleSide } from "./SpeechBubble";
import {
  resolveBackgroundAsset,
  type CharacterPlacement,
  type SceneDialogueLine,
  type SceneMeta,
} from "@/lib/assets/registry";
import {
  framingForCharacter,
  interviewBubblePlacement,
  usesComposedRoom,
} from "@/lib/scene/sceneLayout";
import {
  getCharacterDisplayName,
  resolvePlaceholders,
} from "@/lib/episode-engine/sceneResolver";

const METAPHOR_ICONS: Record<string, string> = {
  bottleneck: "⚡",
  scalability: "📈",
  reliability: "🛡️",
  observability: "📡",
  tradeoff: "⚖️",
  alignment: "🎯",
  complexity: "🕸️",
  maintainability: "🧩",
};

export interface SceneRendererProps {
  backgroundId: string;
  characters: CharacterPlacement[];
  dialogueLines: SceneDialogueLine[];
  /** 0-based index of last visible dialogue line (inclusive) */
  visibleLineIndex: number;
  protagonistName: string;
  /** Show protagonist bubble while user composes an answer */
  showUserAnswerBubble?: boolean;
  userAnswerText?: string;
  meta?: SceneMeta;
  visualMetaphors?: string[];
}

function bubbleSide(speakerId: string): BubbleSide {
  if (speakerId === "sophia") return "left";
  if (speakerId === "protagonist") return "right";
  return "top";
}

export function SceneRenderer({
  backgroundId,
  characters,
  dialogueLines,
  visibleLineIndex,
  protagonistName,
  showUserAnswerBubble = false,
  userAnswerText = "",
  meta,
  visualMetaphors = [],
}: SceneRendererProps) {
  const interviewLayout = usesComposedRoom(backgroundId);
  const bgSrc = resolveBackgroundAsset(backgroundId);
  const vars = { protagonistName };
  const activeLine = dialogueLines[visibleLineIndex];
  const interviewCharacters = characters.filter((c) => c.characterId !== "trace");
  const traceCharacter = characters.find((c) => c.characterId === "trace");

  const sophiaLine =
    activeLine?.speakerId === "sophia" ? activeLine : undefined;
  const showProtagonistBubble =
    interviewLayout && showUserAnswerBubble && userAnswerText.length > 0;

  return (
    <div className="relative w-full aspect-[16/10] min-h-[240px] max-h-[min(52vh,480px)] rounded-2xl overflow-hidden border border-panel-border shadow-2xl bg-slate-950">
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          {interviewLayout ? (
            <InterviewRoomBackground />
          ) : (
            <>
              <Image
                src={bgSrc}
                alt="Scene background"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width:1200px) 100vw, 70vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-slate-950/30" />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {meta && (
        <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/90 bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
            Episode 01 · {meta.episodeTitle}
          </span>
          {meta.difficulty && (
            <span className="text-[10px] text-cyan-200 bg-cyan-950/60 px-2 py-1 rounded-md border border-cyan-800/40 backdrop-blur-sm">
              {meta.difficulty}
            </span>
          )}
          <span className="text-[10px] text-slate-300 ml-auto bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm">
            Scene {meta.sceneIndex} / {meta.sceneCount}
          </span>
        </div>
      )}

      {interviewLayout ? (
        <>
          <div className="absolute inset-x-0 bottom-[22%] z-10 flex items-end justify-center gap-8 px-4 pointer-events-none sm:gap-12 sm:px-6">
            {interviewCharacters.map((c) => (
              <CharacterSprite
                key={c.characterId}
                characterId={c.characterId}
                alt={getCharacterDisplayName(c.characterId, protagonistName)}
                position={{
                  x: c.position.x,
                  y: c.position.y,
                  scale: c.position.scale,
                  zIndex: c.position.zIndex,
                }}
                flip={c.flip}
                framing={framingForCharacter(c.characterId, interviewLayout)}
                layout="inline"
                priority={c.characterId === "sophia"}
              />
            ))}
          </div>
          {traceCharacter && (
            <CharacterSprite
              characterId={traceCharacter.characterId}
              alt={getCharacterDisplayName(
                traceCharacter.characterId,
                protagonistName
              )}
              position={{
                x: traceCharacter.position.x,
                y: traceCharacter.position.y,
                scale: traceCharacter.position.scale,
                zIndex: traceCharacter.position.zIndex,
              }}
              flip={traceCharacter.flip}
              framing={framingForCharacter(
                traceCharacter.characterId,
                interviewLayout
              )}
            />
          )}
          <InterviewTable />
        </>
      ) : (
        characters.map((c) => (
          <CharacterSprite
            key={c.characterId}
            characterId={c.characterId}
            alt={getCharacterDisplayName(c.characterId, protagonistName)}
            position={{
              x: c.position.x,
              y: c.position.y,
              scale: c.position.scale,
              zIndex: c.position.zIndex,
            }}
            flip={c.flip}
            framing={framingForCharacter(c.characterId, interviewLayout)}
            priority={c.characterId === "sophia"}
          />
        ))
      )}

      {visualMetaphors.length > 0 && (
        <div className="absolute bottom-[24%] left-3 z-20 flex flex-wrap gap-1 max-w-[50%]">
          {visualMetaphors.map((m) => (
            <span
              key={m}
              className="text-[10px] px-2 py-0.5 rounded-full bg-black/50 text-cyan-200 border border-cyan-800/40 backdrop-blur-sm"
            >
              {METAPHOR_ICONS[m] ?? "💡"} {m}
            </span>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {interviewLayout && sophiaLine && (
          <SpeechBubble
            key={`sophia-${visibleLineIndex}`}
            speakerName={getCharacterDisplayName("sophia", protagonistName)}
            text={resolvePlaceholders(sophiaLine.text, vars)}
            placement="beside-left"
          />
        )}
        {showProtagonistBubble && (
          <SpeechBubble
            key={`protagonist-${userAnswerText}`}
            speakerName={protagonistName}
            text={userAnswerText}
            placement="beside-right"
          />
        )}
        {!interviewLayout && activeLine && (
          <SpeechBubble
            key={`${visibleLineIndex}-${activeLine.speakerId}`}
            speakerName={getCharacterDisplayName(
              activeLine.speakerId,
              protagonistName
            )}
            text={resolvePlaceholders(activeLine.text, vars)}
            side={bubbleSide(activeLine.speakerId)}
          />
        )}
        {interviewLayout && activeLine?.speakerId === "trace" && (
          <SpeechBubble
            key={`${visibleLineIndex}-trace`}
            speakerName={getCharacterDisplayName("trace", protagonistName)}
            text={resolvePlaceholders(activeLine.text, vars)}
            placement={interviewBubblePlacement("trace")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
