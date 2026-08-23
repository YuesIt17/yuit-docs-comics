"use client";

import { useCallback, useEffect, useState } from "react";
import { EpisodeLayout } from "@/components/episode/EpisodeLayout";
import { SceneRenderer } from "@/components/scene/SceneRenderer";
import { DialoguePanel } from "@/components/episode/DialoguePanel";
import { SpeakingPracticeCard } from "@/components/practice/SpeakingPracticeCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  canAdvance,
  getCharacterDisplayName,
  getCurrentScene,
  isEpisodeComplete,
  resolvePlaceholders,
} from "@/lib/episode-engine/sceneResolver";
import { layersToPlacements } from "@/lib/scene/mapLayers";
import { getCollocationPack } from "@/lib/content";
import { resolveHrDialogFixture } from "@/mocks/fixtures/hr-dialogs";
import { useClientMock } from "@/mocks";
import { withBasePath } from "@/lib/basePath";
import { buildMockTraceAnalysis } from "@/lib/trace/mock";
import { useEpisodeStore } from "@/store/episodeStore";
import { useProgressStore } from "@/store/progressStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTraceStore } from "@/store/traceStore";
import type { Episode } from "@/lib/episode-engine/types";

interface EpisodePlayerProps {
  episode: Episode;
}

export function EpisodePlayer({ episode }: EpisodePlayerProps) {
  const { userName, userBackground } = useSettingsStore();
  const {
    sceneIndex,
    dialogueLog,
    showHint,
    setSceneIndex,
    addDialogue,
    setShowHint,
    resetEpisode,
  } = useEpisodeStore();
  const {
    initEpisode,
    setCurrentScene,
    markSceneSubmitted,
    setNotes,
    save432Round,
    completeEpisode,
    getEpisodeProgress,
  } = useProgressStore();
  const { analysis, isLoading, setAnalysis, setLoading, setError, lastSceneId } =
    useTraceStore();

  const [showComplete, setShowComplete] = useState(false);
  const [scriptLineIndex, setScriptLineIndex] = useState(0);
  const [answerDraft, setAnswerDraft] = useState("");

  const scene = getCurrentScene(episode, sceneIndex);
  const progress = getEpisodeProgress(episode.id);
  const collocationPack = getCollocationPack(episode.collocationPackId);
  const collocationItems = collocationPack?.items ?? [];
  const allCollocations = collocationItems.map((c) => c.phrase);

  const scriptedLineCount = scene?.dialogue.length ?? 0;
  const scriptComplete = scriptLineIndex >= scriptedLineCount - 1;
  const showInput = scriptComplete;

  useEffect(() => {
    resetEpisode(episode.id);
    initEpisode(episode.id);
    const saved = getEpisodeProgress(episode.id);
    if (saved?.currentSceneIndex) {
      setSceneIndex(saved.currentSceneIndex);
    }
  }, [episode.id]);

  useEffect(() => {
    setScriptLineIndex(0);
    setAnswerDraft("");
  }, [scene?.id]);

  useEffect(() => {
    if (!scene || scriptLineIndex < 0) return;
    const line = scene.dialogue[scriptLineIndex];
    if (!line) return;
    const vars = { protagonistName: userName };
    const text = resolvePlaceholders(line.text, vars);
    const exists = dialogueLog.some((d) => d.text === text && !d.isUser);
    if (!exists) {
      addDialogue({
        speakerId: line.speakerId,
        speakerName: getCharacterDisplayName(line.speakerId, userName),
        text,
        timestamp: Date.now(),
      });
    }
  }, [scene?.id, scriptLineIndex, userName]);

  const handleNextLine = () => {
    if (!scene) return;
    if (scriptLineIndex < scriptedLineCount - 1) {
      setScriptLineIndex((i) => i + 1);
    }
  };

  const handleSubmitAnswer = useCallback(
    async (answer: string) => {
      if (!scene) return;

      const fixture = resolveHrDialogFixture(answer, scene.id);
      const resolvedAnswer = fixture?.userAnswer ?? answer;

      addDialogue({
        speakerId: "protagonist",
        speakerName: userName,
        text: resolvedAnswer,
        timestamp: Date.now(),
        isUser: true,
      });

      setLoading(true);
      setError(null);

      try {
        let data;
        if (useClientMock()) {
          await new Promise((r) => setTimeout(r, 600));
          data = buildMockTraceAnalysis({
            userAnswer: answer,
            sceneId: scene.id,
            episodeId: episode.id,
            collocations: scene.interaction.requiredCollocations,
            promptContext: scene.interaction.traceContext,
          });
        } else {
          const res = await fetch(withBasePath("/api/trace/analyze"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              episodeId: episode.id,
              sceneId: scene.id,
              promptContext: scene.interaction.traceContext,
              userAnswer: answer,
              collocations: scene.interaction.requiredCollocations,
              userBackground,
            }),
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error ?? "Analysis failed");
          }

          data = await res.json();
        }
        setAnalysis(data, scene.id);
        markSceneSubmitted(episode.id, scene.id, {
          bestAnswer: resolvedAnswer,
          bestStaffVersion: data.staffVersion,
          score: data.score,
        });

        if (data.recruiterFollowUp) {
          addDialogue({
            speakerId: "sophia",
            speakerName: "Sophia",
            text: data.recruiterFollowUp,
            timestamp: Date.now(),
          });
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Analysis failed");
      } finally {
        setLoading(false);
      }
    },
    [scene, episode.id, userName, userBackground]
  );

  const hasSubmittedForScene =
    lastSceneId === scene?.id && analysis !== null;

  const lastUserAnswer = [...dialogueLog]
    .reverse()
    .find((d) => d.isUser && d.speakerId === "protagonist")?.text;

  const protagonistBubbleText =
    answerDraft.trim() ||
    (hasSubmittedForScene ? (lastUserAnswer ?? "") : "");

  const handleContinue = () => {
    if (!scene || !hasSubmittedForScene) return;

    if (isEpisodeComplete(sceneIndex, episode.scenes.length, true)) {
      completeEpisode(episode.id);
      setShowComplete(true);
      return;
    }

    if (canAdvance(sceneIndex, episode.scenes.length, hasSubmittedForScene)) {
      const next = sceneIndex + 1;
      setSceneIndex(next);
      setCurrentScene(episode.id, next);
      setAnalysis(null);
    }
  };

  if (showComplete) {
    const learnedCount = progress?.completedScenes.length ?? episode.scenes.length;
    return (
      <EpisodeLayout
        collocations={allCollocations}
        collocationItems={collocationItems}
        currentStep={episode.scenes.length}
        totalSteps={episode.scenes.length}
      >
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg text-center space-y-6">
            <h1 className="text-2xl font-bold text-white">
              {episode.completion.title}
            </h1>
            <p className="text-slate-400">
              {episode.completion.summaryTemplate
                .replace("{sceneCount}", String(learnedCount))
                .replace("{colocationCount}", String(allCollocations.length))}
            </p>
            <Badge variant="purple">{episode.completion.rewardLabel}</Badge>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => {
                  setShowComplete(false);
                  setSceneIndex(0);
                  setAnalysis(null);
                }}
              >
                Replay Episode
              </Button>
              <Button variant="secondary" onClick={() => (window.location.href = "/heroes")}>
                Meet the Heroes
              </Button>
            </div>
          </div>
        </div>
      </EpisodeLayout>
    );
  }

  if (!scene) return null;

  const sceneProgress = Math.round(
    ((sceneIndex + (hasSubmittedForScene ? 1 : 0)) / episode.scenes.length) * 100
  );

  const visualMetaphors = scene.interaction.requiredCollocations.flatMap((phrase) => {
    const item = collocationItems.find((c) => c.phrase === phrase);
    return item ? [{ phrase, metaphor: item.visualMetaphor }] : [];
  });

  return (
    <EpisodeLayout
      uncleEugeneTip={showHint ? scene.uncleEugeneTip : undefined}
      episodeProgress={sceneProgress}
      currentStep={sceneIndex + 1}
      totalSteps={episode.scenes.length}
      rewardLabel={episode.completion.rewardLabel}
      collocations={
        scene.interaction.requiredCollocations.length > 0
          ? scene.interaction.requiredCollocations
          : allCollocations.slice(0, 6)
      }
      collocationItems={collocationItems}
      starEnabled={scene.interaction.starEnabled}
    >
      <div className="flex flex-col min-h-0">
        <div className="p-4 shrink-0">
          <SceneRenderer
            backgroundId={scene.background}
            characters={layersToPlacements(scene.layers, scene.background)}
            dialogueLines={scene.dialogue}
            visibleLineIndex={scriptLineIndex}
            protagonistName={userName}
            showUserAnswerBubble={showInput}
            userAnswerText={protagonistBubbleText}
            meta={{
              episodeTitle: episode.title,
              sceneIndex: scene.index,
              sceneCount: episode.meta.sceneCount,
              difficulty: episode.difficulty,
            }}
            visualMetaphors={visualMetaphors}
          />

          <div className="flex flex-wrap gap-2 mt-3">
            {!scriptComplete && (
              <Button onClick={handleNextLine}>
                Next line →
              </Button>
            )}
            {scriptComplete && !hasSubmittedForScene && (
              <span className="text-xs text-purple-300 self-center">
                Dialogue complete — respond below
              </span>
            )}
            <Button variant="secondary" onClick={() => setShowHint(true)}>
              I need a hint
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!hasSubmittedForScene}
              variant={hasSubmittedForScene ? "primary" : "secondary"}
            >
              Continue episode →
            </Button>
          </div>
        </div>

        <DialoguePanel
          scene={scene}
          dialogueLog={dialogueLog}
          notes={progress?.notes ?? ""}
          onNotesChange={(n) => setNotes(episode.id, n)}
          onSubmitAnswer={handleSubmitAnswer}
          onAnswerDraftChange={setAnswerDraft}
          isSubmitting={isLoading}
          showInput={showInput}
        />

        {scene.interaction.practice432Enabled && (
          <div className="px-4 pb-6 shrink-0">
            <SpeakingPracticeCard
              enabled
              staffHint={analysis?.staffVersion}
              onSaveRound={(round) => save432Round(episode.id, scene.id, round)}
              savedRounds={progress?.sceneProgress[scene.id]?.rounds432 ?? []}
            />
          </div>
        )}
      </div>
    </EpisodeLayout>
  );
}
