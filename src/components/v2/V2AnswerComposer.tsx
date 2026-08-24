"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { MockAnswerPicker } from "@/components/dialogue/MockAnswerPicker";
import { V2MentorHintCard } from "@/components/v2/V2MentorHintCard";
import { features } from "@/config/features";
import { isMockingEnabled } from "@/mocks";
import { useSpeechTranscription } from "@/hooks/useSpeechTranscription";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { buildProgressiveHints } from "@/lib/v2/progressiveHints";
import type { AnswerSource, SubmittedAnswer } from "@/lib/v2/answer";

interface V2AnswerComposerProps {
  sceneId: string;
  hints: string[];
  starEnabled?: boolean;
  questionText?: string;
  traceContext?: string;
  seedAnswer?: string;
  isSubmitting: boolean;
  onSubmit: (answer: SubmittedAnswer) => void;
  onSkip: () => void;
  showCompressionToggle?: boolean;
  compressionOpen?: boolean;
  onToggleCompression?: () => void;
}

function appendSpeech(base: string, spoken: string): string {
  const piece = spoken.trim();
  if (!piece) return base;
  const trimmed = base.trimEnd();
  if (!trimmed) return piece;
  return `${trimmed} ${piece}`;
}

export function V2AnswerComposer({
  sceneId,
  hints,
  starEnabled = false,
  questionText = "",
  traceContext = "",
  seedAnswer = "",
  isSubmitting,
  onSubmit,
  onSkip,
  showCompressionToggle = false,
  compressionOpen = false,
  onToggleCompression,
}: V2AnswerComposerProps) {
  const [draft, setDraft] = useState(seedAnswer);
  const [source, setSource] = useState<AnswerSource>("typed");
  const [hintLevel, setHintLevel] = useState(0);
  const [baseBeforeListen, setBaseBeforeListen] = useState("");

  const speech = useSpeechTranscription("en-US");
  const tts = useSpeechSynthesis();
  const showMock = isMockingEnabled();
  const voiceEnabled = features.voiceInput;

  const hintLadder = useMemo(
    () =>
      buildProgressiveHints({
        starEnabled,
        hints,
        questionText,
        traceContext,
      }),
    [starEnabled, hints, questionText, traceContext]
  );

  const visibleHints = hintLadder.slice(0, hintLevel);

  const spokenWhileListening = speech.isListening
    ? [speech.transcript, speech.interimTranscript].filter(Boolean).join(" ")
    : "";
  const displayValue = speech.isListening
    ? appendSpeech(baseBeforeListen, spokenWhileListening)
    : draft;

  const commitListeningDraft = () => {
    if (!speech.isListening) return displayValue;
    const next = appendSpeech(
      baseBeforeListen,
      [speech.transcript, speech.interimTranscript].filter(Boolean).join(" ")
    );
    speech.stop();
    setDraft(next);
    if (spokenWhileListening.trim()) setSource("voice");
    return next;
  };

  const handleDraftChange = (value: string) => {
    if (speech.isListening) speech.stop();
    setDraft(value);
    if (source !== "mock") setSource("typed");
  };

  const handleMockSelect = (answer: string) => {
    if (speech.isListening) speech.stop();
    setDraft(answer);
    setSource("mock");
  };

  const handleStartSpeaking = () => {
    if (speech.isListening) {
      commitListeningDraft();
      return;
    }
    speech.clearError();
    setBaseBeforeListen(draft);
    speech.start();
  };

  const handleHint = () => {
    setHintLevel((n) => Math.min(n + 1, hintLadder.length));
  };

  const handleSubmit = () => {
    let text = draft;
    let finalSource: AnswerSource = source;

    if (speech.isListening) {
      text = appendSpeech(
        baseBeforeListen,
        [speech.transcript, speech.interimTranscript].filter(Boolean).join(" ")
      );
      speech.stop();
      setDraft(text);
      if (spokenWhileListening.trim()) {
        finalSource = "voice";
        setSource("voice");
      }
    }

    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    tts.stop();
    onSubmit({
      text: trimmed,
      source:
        finalSource === "mock"
          ? "mock"
          : finalSource === "voice"
            ? "voice"
            : "typed",
    });
  };

  const handleListenToAnswer = () => {
    const text = speech.isListening ? commitListeningDraft() : displayValue;
    const trimmed = text.trim();
    if (!trimmed || isSubmitting) return;
    if (tts.isSpeaking && tts.lastText === trimmed) {
      tts.stop();
      return;
    }
    tts.play(trimmed);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-6 space-y-3">
      {showMock && (
        <MockAnswerPicker sceneId={sceneId} onSelect={handleMockSelect} />
      )}

      <div className="relative">
        <textarea
          value={displayValue}
          onChange={(e) => handleDraftChange(e.target.value)}
          placeholder="Type your answer..."
          rows={4}
          disabled={isSubmitting}
          className="w-full bg-slate-900/60 border border-panel-border rounded-xl p-4 text-sm text-slate-100 resize-none focus:outline-none focus:border-accent-cyan/50 disabled:opacity-60"
          aria-label="Your interview answer"
        />
        {speech.isListening && (
          <p className="absolute bottom-3 left-4 text-xs text-red-300 flex items-center gap-1.5 pointer-events-none">
            <span
              className="inline-block w-2 h-2 rounded-full bg-red-400 animate-pulse"
              aria-hidden
            />
            Listening...
          </p>
        )}
      </div>

      {speech.error && (
        <p className="text-xs text-amber-300/90" role="alert">
          {speech.error.message}
        </p>
      )}

      {hintLevel > 0 && <V2MentorHintCard visibleLevels={visibleHints} />}

      <div className="flex flex-wrap items-center gap-2">
        {voiceEnabled && speech.isSupported && (
          <Button
            type="button"
            variant={speech.isListening ? "outline" : "secondary"}
            onClick={handleStartSpeaking}
            disabled={isSubmitting}
            aria-pressed={speech.isListening}
            aria-label={
              speech.isListening
                ? "Stop voice transcription"
                : "Start voice transcription"
            }
          >
            {speech.isListening ? "Stop" : "Start speaking"}
          </Button>
        )}

        {voiceEnabled && !speech.isSupported && (
          <p className="text-[11px] text-slate-500">
            Voice transcription unavailable — type your answer.
          </p>
        )}

        {tts.isSupported && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleListenToAnswer}
            disabled={!displayValue.trim() || isSubmitting}
            aria-label={
              tts.isSpeaking && tts.lastText === displayValue.trim()
                ? "Stop listening to answer"
                : "Listen to my answer"
            }
          >
            {tts.isSpeaking && tts.lastText === displayValue.trim()
              ? "Stop"
              : "🔊 Listen to my answer"}
          </Button>
        )}

        <Button
          onClick={handleSubmit}
          disabled={!displayValue.trim() || isSubmitting}
          size="lg"
          className="min-w-[140px]"
        >
          {isSubmitting ? "Analyzing..." : "Submit Answer"}
        </Button>
      </div>

      {tts.error && (
        <p className="text-xs text-amber-300/90" role="alert">
          {tts.error}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleHint}
          disabled={isSubmitting || hintLevel >= hintLadder.length}
        >
          {hintLevel === 0
            ? "Hint"
            : hintLevel >= hintLadder.length
              ? "Hints complete"
              : "Another hint"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (speech.isListening) speech.stop();
            onSkip();
          }}
          disabled={isSubmitting}
        >
          Skip
        </Button>
        {showCompressionToggle && onToggleCompression && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCompression}
            disabled={isSubmitting}
          >
            {compressionOpen ? "Hide compression" : "Practice compression"}
          </Button>
        )}
      </div>
    </div>
  );
}
