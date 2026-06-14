"use client";

import { useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ComicStage } from "@/components/comic/ComicStage";
import { DialogueTabs } from "@/components/dialogue/DialogueTabs";
import { Speaking432 } from "@/components/practice/Speaking432";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  canAdvance,
  getCharacterDisplayName,
  getCurrentScene,
  isEpisodeComplete,
  resolvePlaceholders,
} from "@/lib/episode-engine/sceneResolver";
import { getCollocationPack } from "@/lib/content";
import { resolveHrDialogFixture } from "@/mocks/fixtures/hr-dialogs";
import { useEpisodeStore } from "@/store/episodeStore";
import { useProgressStore } from "@/store/progressStore";
import { useSettingsStore } from "@/store/settingsStore";
import { useTraceStore } from "@/store/traceStore";
import type { Episode } from "@/lib/episode-engine/types";

interface EpisodePlayerProps {
  episode: Episode;
}

export function EpisodePlayer({ episode }: EpisodePlayerProps) {
  const { userName, avatarKey, userBackground } = useSettingsStore();
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

  const scene = getCurrentScene(episode, sceneIndex);
  const progress = getEpisodeProgress(episode.id);
  const collocationPack = getCollocationPack(episode.collocationPackId);
  const collocationItems = collocationPack?.items ?? [];
  const allCollocations = collocationItems.map((c) => c.phrase);

  useEffect(() => {
    resetEpisode(episode.id);
    initEpisode(episode.id);
    const saved = getEpisodeProgress(episode.id);
    if (saved?.currentSceneIndex) {
      setSceneIndex(saved.currentSceneIndex);
    }
  }, [episode.id]);

  useEffect(() => {
    if (!scene) return;
    const vars = { protagonistName: userName };
    scene.dialogue.forEach((line) => {
      const exists = dialogueLog.some(
        (d) => d.text === resolvePlaceholders(line.text, vars) && !d.isUser
      );
      if (!exists) {
        addDialogue({
          speakerId: line.speakerId,
          speakerName: getCharacterDisplayName(line.speakerId, userName),
          text: resolvePlaceholders(line.text, vars),
          timestamp: Date.now(),
        });
      }
    });
  }, [scene?.id, userName]);

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
        const res = await fetch("/api/trace/analyze", {
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

        const data = await res.json();
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
      <AppShell
        collocations={allCollocations}
        collocationItems={collocationItems}
        currentStep={episode.scenes.length}
        totalSteps={episode.scenes.length}
      >
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-lg text-center space-y-6">
            <div className="text-6xl">🎉</div>
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
              <Button onClick={() => { setShowComplete(false); setSceneIndex(0); setAnalysis(null); }}>
                Replay Episode
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = "/heroes"}>
                Meet the Heroes
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!scene) return null;

  const sceneProgress = Math.round(
    ((sceneIndex + (hasSubmittedForScene ? 1 : 0)) / episode.scenes.length) * 100
  );

  return (
    <AppShell
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
        <div className="px-4 py-3 border-b border-panel-border flex items-center gap-3 flex-wrap shrink-0">
          <Badge variant="purple">Episode 01</Badge>
          <span className="text-sm font-semibold text-white">
            {episode.title.toUpperCase()}
          </span>
          <Badge variant="cyan">{episode.difficulty}</Badge>
          <span className="text-xs text-slate-500 ml-auto">
            SCENE {scene.index} / {episode.meta.sceneCount}
          </span>
        </div>

        <div className="p-4 border-b border-panel-border shrink-0">
          <ComicStage
            scene={scene}
            protagonistName={userName}
            avatarKey={avatarKey}
          />
        </div>

        {!hasSubmittedForScene && (
          <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-purple-950/40 border border-purple-800/50 text-xs text-purple-200 shrink-0">
            <strong className="text-purple-100">Your turn.</strong> Scroll down —
            pick an HR mock answer or type your response, then Submit to Trace.
          </div>
        )}

        <div className="flex flex-col min-h-[320px]">
          <DialogueTabs
            scene={scene}
            dialogueLog={dialogueLog}
            notes={progress?.notes ?? ""}
            onNotesChange={(n) => setNotes(episode.id, n)}
            onSubmitAnswer={handleSubmitAnswer}
            isSubmitting={isLoading}
          />
        </div>

        <div className="px-4 py-3 flex gap-2 shrink-0 border-t border-panel-border bg-background/80 sticky bottom-0">
          <Button
            onClick={handleContinue}
            disabled={!hasSubmittedForScene}
          >
            Continue →
          </Button>
          <Button variant="secondary" onClick={() => setShowHint(true)}>
            I need a hint
          </Button>
        </div>

        {scene.interaction.practice432Enabled && (
          <div className="px-4 pb-6 shrink-0">
            <Speaking432
              enabled
              staffHint={analysis?.staffVersion}
              onSaveRound={(round) => save432Round(episode.id, scene.id, round)}
              savedRounds={
                progress?.sceneProgress[scene.id]?.rounds432 ?? []
              }
            />
          </div>
        )}
      </div>
    </AppShell>
  );
}
