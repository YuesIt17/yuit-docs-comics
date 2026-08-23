"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MockAnswerPicker } from "@/components/dialogue/MockAnswerPicker";
import { features } from "@/config/features";
import { isMockingEnabled } from "@/mocks";
import { useSpeechTranscription } from "@/hooks/useSpeechTranscription";
import type { AnswerSource, SubmittedAnswer } from "@/lib/v2/answer";

interface V2AnswerComposerProps {
  sceneId: string;
  hints: string[];
  hintTip?: string;
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
  hintTip,
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
  const [showHint, setShowHint] = useState(false);
  const [baseBeforeListen, setBaseBeforeListen] = useState("");

  const speech = useSpeechTranscription("en-US");
  const showMock = isMockingEnabled();
  const voiceEnabled = features.voiceInput;

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

      {showHint && hintTip && (
        <div className="rounded-lg border border-amber-800/40 bg-amber-950/30 px-4 py-3 text-sm text-amber-100/90">
          {hintTip}
        </div>
      )}

      {showHint && hints.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {hints.map((hint) => (
            <span
              key={hint}
              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400"
            >
              {hint}
            </span>
          ))}
        </div>
      )}

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

        <Button
          onClick={handleSubmit}
          disabled={!displayValue.trim() || isSubmitting}
          size="lg"
          className="min-w-[140px]"
        >
          {isSubmitting ? "Analyzing..." : "Submit Answer"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowHint((v) => !v)}
          disabled={isSubmitting}
        >
          Hint
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
