"use client";

import { useEffect, useRef } from "react";
import { HeroPortrait } from "@/components/heroes/HeroPortrait";
import { Button } from "@/components/ui/Button";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { cn } from "@/lib/utils";

interface V2ConversationExchangeProps {
  questionText: string;
  interviewerName?: string;
  interviewerRole?: string;
  protagonistName: string;
  submittedAnswerText?: string | null;
  followUpText?: string | null;
  listeningMode?: boolean;
  transcriptVisible?: boolean;
  onShowTranscript?: () => void;
  onToggleListeningMode?: () => void;
  autoPlayKey?: string;
}

export function V2ConversationExchange({
  questionText,
  interviewerName = "Sophia",
  interviewerRole = "Recruiter / Talent Partner",
  protagonistName,
  submittedAnswerText,
  followUpText,
  listeningMode = false,
  transcriptVisible = true,
  onShowTranscript,
  onToggleListeningMode,
  autoPlayKey,
}: V2ConversationExchangeProps) {
  const tts = useSpeechSynthesis();
  const autoPlayedKey = useRef<string | null>(null);

  useEffect(() => {
    if (!listeningMode || !tts.isSupported || !autoPlayKey) return;
    if (autoPlayedKey.current === autoPlayKey) return;
    autoPlayedKey.current = autoPlayKey;
    tts.play(questionText);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- play once per scene key
  }, [listeningMode, autoPlayKey, questionText, tts.isSupported]);

  const showQuestionText = !listeningMode || transcriptVisible;

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
      {onToggleListeningMode && (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={listeningMode ? "outline" : "ghost"}
            size="sm"
            onClick={onToggleListeningMode}
            aria-pressed={listeningMode}
          >
            Listening Mode {listeningMode ? "on" : "off"}
          </Button>
          {listeningMode && !transcriptVisible && onShowTranscript && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onShowTranscript}
            >
              Show transcript
            </Button>
          )}
        </div>
      )}

      {/* Sophia — left */}
      <div className="flex items-start gap-3 sm:gap-4 sm:max-w-[85%]">
        <HeroPortrait
          characterId="sophia"
          size="md"
          alt={interviewerName}
          showBorder
          className="shrink-0"
        />
        <div className="min-w-0 space-y-2 flex-1">
          <div>
            <p className="text-xs font-semibold text-pink-300">{interviewerName}</p>
            <p className="text-[10px] text-slate-500">{interviewerRole}</p>
          </div>
          {showQuestionText ? (
            <div
              className={cn(
                "rounded-2xl rounded-tl-md border border-pink-900/40 bg-pink-950/30",
                "px-4 py-3 text-sm sm:text-base text-white leading-relaxed"
              )}
            >
              {questionText}
            </div>
          ) : (
            <div className="rounded-2xl rounded-tl-md border border-dashed border-pink-900/40 bg-pink-950/10 px-4 py-3 text-sm text-slate-400">
              Listen to the question…
            </div>
          )}

          {tts.isSupported && (
            <div className="flex flex-wrap gap-1.5">
              {!tts.isSpeaking ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => tts.play(questionText)}
                  aria-label="Listen to interviewer question"
                >
                  Listen
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={tts.stop}
                  aria-label="Stop playback"
                >
                  Stop
                </Button>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (tts.lastText) tts.replay();
                  else tts.play(questionText);
                }}
                disabled={tts.isSpeaking && !tts.lastText}
                aria-label="Replay question"
              >
                Replay
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const nextRate = tts.cycleSlower();
                  const text = tts.lastText ?? questionText;
                  tts.stop();
                  tts.play(text, nextRate);
                }}
                aria-label={`Slower speech rate, currently ${tts.rate}`}
              >
                Slower ({tts.rate.toFixed(2)}×)
              </Button>
            </div>
          )}
          {tts.error && (
            <p className="text-xs text-amber-300/90" role="alert">
              {tts.error}
            </p>
          )}
        </div>
      </div>

      {submittedAnswerText && (
        <div className="flex items-start gap-3 sm:gap-4 sm:max-w-[85%] sm:ml-auto flex-row-reverse">
          <HeroPortrait
            characterId="protagonist"
            size="md"
            alt={protagonistName}
            showBorder
            className="shrink-0"
          />
          <div className="min-w-0 space-y-1 text-right">
            <p className="text-xs font-semibold text-indigo-300">
              {protagonistName}
            </p>
            <div
              className={cn(
                "rounded-2xl rounded-tr-md border border-indigo-900/40 bg-indigo-950/30",
                "px-4 py-3 text-sm sm:text-base text-slate-100 leading-relaxed text-left"
              )}
            >
              {submittedAnswerText}
            </div>
          </div>
        </div>
      )}

      {followUpText && (
        <div className="flex items-start gap-3 sm:gap-4 sm:max-w-[85%]">
          <HeroPortrait
            characterId="sophia"
            size="sm"
            alt={interviewerName}
            showBorder
            className="shrink-0"
          />
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold text-pink-300">{interviewerName}</p>
            <div className="rounded-2xl rounded-tl-md border border-panel-border bg-panel/40 px-4 py-3 text-sm text-slate-200 leading-relaxed">
              {followUpText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
