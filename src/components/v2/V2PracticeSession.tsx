"use client";

import { useCallback, useState } from "react";
import { V2PracticeLayout } from "@/components/v2/V2PracticeLayout";
import { V2ConversationExchange } from "@/components/v2/V2ConversationExchange";
import { V2AnswerComposer } from "@/components/v2/V2AnswerComposer";
import { V2TraceDebrief } from "@/components/v2/V2TraceDebrief";
import { V2CompletionScreen } from "@/components/v2/V2CompletionScreen";
import {
  V2ScenePreview,
  getInterviewerQuestion,
} from "@/components/v2/V2ScenePreview";
import { SpeakingPracticeCard } from "@/components/practice/SpeakingPracticeCard";
import {
  canAdvance,
  getCurrentScene,
  isEpisodeComplete,
} from "@/lib/episode-engine/sceneResolver";
import { isMockingEnabled } from "@/mocks";
import { basePath, withBasePath } from "@/lib/basePath";
import { buildMockTraceAnalysis } from "@/lib/trace/mock";
import { useSettingsStore } from "@/store/settingsStore";
import { useTraceStore } from "@/store/traceStore";
import { useV2ProgressStore } from "@/store/v2ProgressStore";
import type { SubmittedAnswer } from "@/lib/v2/answer";
import type { Episode } from "@/lib/episode-engine/types";

type SessionPhase = "question" | "analyzing" | "debrief" | "complete";

interface V2PracticeSessionProps {
  episode: Episode;
  trackId?: "hr";
}

function shouldUseClientMock(): boolean {
  return isMockingEnabled() && Boolean(basePath);
}

function getInitialSceneIndex(trackId: "hr", sceneCount: number): number {
  const saved =
    useV2ProgressStore.getState().tracks[trackId]?.currentSceneIndex ?? 0;
  return saved > 0 && saved < sceneCount ? saved : 0;
}

export function V2PracticeSession({
  episode,
  trackId = "hr",
}: V2PracticeSessionProps) {
  const { userName, userBackground } = useSettingsStore();
  const { analysis, isLoading, setAnalysis, setLoading, setError, clear } =
    useTraceStore();
  const {
    setCurrentScene,
    markQuestionComplete,
    addPracticeMinutes,
    tracks,
    resetTrack,
  } = useV2ProgressStore();

  const [sceneIndex, setSceneIndex] = useState(() => {
    useV2ProgressStore.getState().initTrack(trackId, episode.scenes.length);
    return getInitialSceneIndex(trackId, episode.scenes.length);
  });
  const [phase, setPhase] = useState<SessionPhase>("question");
  const [submittedAnswer, setSubmittedAnswer] =
    useState<SubmittedAnswer | null>(null);
  const [composerSeed, setComposerSeed] = useState("");
  const [composerKey, setComposerKey] = useState(0);
  const [showCompression, setShowCompression] = useState(false);
  const [followUpText, setFollowUpText] = useState<string | null>(null);

  const scene = getCurrentScene(episode, sceneIndex);
  const track = tracks[trackId];

  const goToScene = useCallback(
    (next: number) => {
      setSceneIndex(next);
      setCurrentScene(trackId, next);
      setSubmittedAnswer(null);
      setComposerSeed("");
      setComposerKey((k) => k + 1);
      setShowCompression(false);
      setFollowUpText(null);
      clear();
      setPhase("question");
    },
    [clear, setCurrentScene, trackId]
  );

  const handleSubmitAnswer = useCallback(
    async (answer: SubmittedAnswer) => {
      if (!scene) return;

      setSubmittedAnswer(answer);
      setFollowUpText(null);
      setPhase("analyzing");
      setLoading(true);
      setError(null);

      try {
        let data;
        if (shouldUseClientMock()) {
          await new Promise((r) => setTimeout(r, 600));
          data = buildMockTraceAnalysis({
            userAnswer: answer.text,
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
              userAnswer: answer.text,
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
        markQuestionComplete(trackId, sceneIndex, data.score);
        addPracticeMinutes(2);
        setPhase("debrief");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Analysis failed");
        setPhase("question");
        setSubmittedAnswer(null);
      } finally {
        setLoading(false);
      }
    },
    [
      scene,
      episode.id,
      userBackground,
      sceneIndex,
      trackId,
      setAnalysis,
      markQuestionComplete,
      addPracticeMinutes,
      setLoading,
      setError,
    ]
  );

  const handleTryAgain = () => {
    setComposerSeed(submittedAnswer?.text ?? "");
    setComposerKey((k) => k + 1);
    setSubmittedAnswer(null);
    setFollowUpText(null);
    clear();
    setPhase("question");
  };

  const handleNextQuestion = () => {
    if (!scene || !analysis) return;

    const followUp = analysis.recruiterFollowUp?.trim();
    if (followUp && !followUpText) {
      setFollowUpText(followUp);
      return;
    }

    if (isEpisodeComplete(sceneIndex, episode.scenes.length, true)) {
      setPhase("complete");
      return;
    }

    if (canAdvance(sceneIndex, episode.scenes.length, true)) {
      goToScene(sceneIndex + 1);
    }
  };

  const handleSkip = () => {
    if (!scene) return;

    if (sceneIndex >= episode.scenes.length - 1) {
      setPhase("complete");
      return;
    }

    goToScene(sceneIndex + 1);
  };

  const handleReplay = () => {
    resetTrack(trackId);
    goToScene(0);
  };

  if (phase === "complete") {
    const learnedCount = track?.completedQuestions ?? episode.scenes.length;
    return (
      <V2CompletionScreen
        title={episode.completion.title.replace("Staff Engineer ", "")}
        summary={episode.completion.summaryTemplate
          .replace("{sceneCount}", String(learnedCount))
          .replace("{colocationCount}", "key phrases")}
        onReplay={handleReplay}
      />
    );
  }

  if (!scene) return null;

  const questionText = getInterviewerQuestion(scene, userName);
  const isLastQuestion = sceneIndex === episode.scenes.length - 1;
  const showComposer = phase === "question";
  const showDebrief = phase === "debrief" && analysis;

  return (
    <V2PracticeLayout
      title="HR Interview"
      subtitle={`Question ${sceneIndex + 1} / ${episode.scenes.length} · ${episode.difficulty}`}
    >
      <V2ScenePreview
        scene={scene}
        protagonistName={userName}
        episodeTitle={episode.title}
        sceneCount={episode.meta.sceneCount}
        difficulty={episode.difficulty}
      />

      <V2ConversationExchange
        questionText={questionText}
        protagonistName={userName}
        submittedAnswerText={submittedAnswer?.text}
        followUpText={followUpText}
      />

      {showComposer && (
        <>
          <V2AnswerComposer
            key={`${scene.id}-${composerKey}`}
            sceneId={scene.id}
            hints={scene.interaction.hints}
            hintTip={scene.uncleEugeneTip}
            seedAnswer={composerSeed}
            isSubmitting={isLoading}
            onSubmit={handleSubmitAnswer}
            onSkip={handleSkip}
            showCompressionToggle={scene.interaction.practice432Enabled}
            compressionOpen={showCompression}
            onToggleCompression={() => setShowCompression((v) => !v)}
          />

          {scene.interaction.practice432Enabled && showCompression && (
            <div className="max-w-3xl mx-auto px-4 pb-8">
              <SpeakingPracticeCard
                enabled
                onSaveRound={() => {}}
                savedRounds={[]}
              />
            </div>
          )}
        </>
      )}

      {phase === "analyzing" && (
        <p className="max-w-3xl mx-auto px-4 pb-6 text-sm text-slate-400">
          Trace is reviewing your answer...
        </p>
      )}

      {showDebrief && (
        <V2TraceDebrief
          analysis={analysis}
          onTryAgain={handleTryAgain}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={isLastQuestion}
        />
      )}
    </V2PracticeLayout>
  );
}
