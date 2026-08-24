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
import { V2ResetSessionControl } from "@/components/v2/V2ResetSessionControl";
import { V2VoiceSettings } from "@/components/v2/V2VoiceSettings";
import { V2TargetProfileSelector } from "@/components/v2/V2TargetProfileSelector";
import {
  canAdvance,
  getCurrentScene,
  isEpisodeComplete,
} from "@/lib/episode-engine/sceneResolver";
import { isMockingEnabled } from "@/mocks";
import { basePath, withBasePath } from "@/lib/basePath";
import { buildMockTraceAnalysis } from "@/lib/trace/mock";
import {
  getTargetProfileLabel,
  type TargetProfileId,
} from "@/lib/interview/resumeProfiles";
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

export function V2PracticeSession({
  episode,
  trackId = "hr",
}: V2PracticeSessionProps) {
  const {
    userName,
    userBackground,
    targetProfileId,
    setTargetProfileId,
  } = useSettingsStore();
  const { analysis, isLoading, setAnalysis, setLoading, setError, clear } =
    useTraceStore();
  const {
    setCurrentScene,
    markQuestionComplete,
    addPracticeMinutes,
    tracks,
    resetTrack,
  } = useV2ProgressStore();

  // New sessions always start at question 1 — no silent stale resume.
  const [sceneIndex, setSceneIndex] = useState(() => {
    useV2ProgressStore.getState().initTrack(trackId, episode.scenes.length);
    useV2ProgressStore.getState().setCurrentScene(trackId, 0);
    return 0;
  });
  const [sessionProfileId, setSessionProfileId] =
    useState<TargetProfileId>(targetProfileId);
  const [phase, setPhase] = useState<SessionPhase>("question");
  const [submittedAnswer, setSubmittedAnswer] =
    useState<SubmittedAnswer | null>(null);
  const [composerSeed, setComposerSeed] = useState("");
  const [composerKey, setComposerKey] = useState(0);
  const [showCompression, setShowCompression] = useState(false);
  const [followUpText, setFollowUpText] = useState<string | null>(null);
  const [listeningMode, setListeningMode] = useState(false);
  const [transcriptVisible, setTranscriptVisible] = useState(true);

  const scene = getCurrentScene(episode, sceneIndex);
  const track = tracks[trackId];

  const clearTransientSession = useCallback(() => {
    setSubmittedAnswer(null);
    setComposerSeed("");
    setComposerKey((k) => k + 1);
    setShowCompression(false);
    setFollowUpText(null);
    setTranscriptVisible(!listeningMode);
    clear();
    setPhase("question");
  }, [clear, listeningMode]);

  const goToScene = useCallback(
    (next: number) => {
      setSceneIndex(next);
      setCurrentScene(trackId, next);
      clearTransientSession();
    },
    [clearTransientSession, setCurrentScene, trackId]
  );

  const handleResetSession = useCallback(() => {
    clearTransientSession();
    setSceneIndex(0);
    setCurrentScene(trackId, 0);
  }, [clearTransientSession, setCurrentScene, trackId]);

  const handleProfileChange = (next: TargetProfileId) => {
    if (next === sessionProfileId) return;

    const hasProgress =
      sceneIndex > 0 ||
      Boolean(submittedAnswer) ||
      Boolean(followUpText) ||
      Boolean(analysis) ||
      phase !== "question";

    if (hasProgress) {
      const ok = window.confirm(
        "Switching target profile starts a new practice session from question 1. Continue?"
      );
      if (!ok) return;
    }

    setTargetProfileId(next);
    setSessionProfileId(next);
    clearTransientSession();
    setSceneIndex(0);
    setCurrentScene(trackId, 0);
  };

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
            targetProfileId: sessionProfileId,
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
              targetProfileId: sessionProfileId,
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
      sessionProfileId,
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
    setSessionProfileId(targetProfileId);
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
  const profileLabel = getTargetProfileLabel(sessionProfileId);

  return (
    <V2PracticeLayout
      title={`HR Interview · ${profileLabel}`}
      subtitle={`Question ${sceneIndex + 1} / ${episode.scenes.length} · ${episode.difficulty}`}
      actions={
        <>
          <V2TargetProfileSelector
            value={sessionProfileId}
            onChange={handleProfileChange}
          />
          <V2VoiceSettings />
          <V2ResetSessionControl onConfirmReset={handleResetSession} />
        </>
      }
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
        listeningMode={listeningMode}
        transcriptVisible={transcriptVisible}
        onShowTranscript={() => setTranscriptVisible(true)}
        onToggleListeningMode={() => {
          setListeningMode((on) => {
            const next = !on;
            setTranscriptVisible(!next);
            return next;
          });
        }}
        autoPlayKey={listeningMode ? scene.id : undefined}
      />

      {showComposer && (
        <>
          <V2AnswerComposer
            key={`${scene.id}-${composerKey}-${sessionProfileId}`}
            sceneId={scene.id}
            hints={scene.interaction.hints}
            starEnabled={scene.interaction.starEnabled}
            questionText={questionText}
            traceContext={scene.interaction.traceContext}
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
          userAnswerText={submittedAnswer?.text ?? ""}
          onTryAgain={handleTryAgain}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={isLastQuestion}
        />
      )}
    </V2PracticeLayout>
  );
}
