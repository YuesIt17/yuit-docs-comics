"use client";

import type { TraceAnalysis } from "@/lib/episode-engine/types";
import { Button } from "@/components/ui/Button";
import { HeroPortrait } from "@/components/heroes/HeroPortrait";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import {
  STRONG_B2_UNAVAILABLE,
  isMeaningfulCorrection,
} from "@/lib/trace/answerTransform";

interface V2TraceDebriefProps {
  analysis: TraceAnalysis;
  userAnswerText: string;
  onTryAgain: () => void;
  onNextQuestion: () => void;
  isLastQuestion?: boolean;
}

function toTenScale(value: number): number {
  return Math.round(value / 10);
}

const AXIS_LABELS: { key: keyof TraceAnalysis["breakdown"]; label: string }[] =
  [
    { key: "clarity", label: "Content" },
    { key: "structure", label: "Structure" },
    { key: "impact", label: "Seniority" },
    { key: "vocabulary", label: "English" },
    { key: "fluency", label: "Naturalness" },
  ];

function ListenRow({
  label,
  text,
  isSupported,
  isSpeaking,
  activeText,
  onPlay,
  onStop,
  emptyMessage,
}: {
  label: string;
  text: string;
  isSupported: boolean;
  isSpeaking: boolean;
  activeText: string | null;
  onPlay: (text: string) => void;
  onStop: () => void;
  emptyMessage?: string;
}) {
  if (!text.trim()) {
    if (!emptyMessage) return null;
    return (
      <div className="space-y-1.5">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">
          {label}
        </p>
        <p className="text-sm text-slate-400 leading-relaxed">{emptyMessage}</p>
      </div>
    );
  }

  const isThisPlaying = isSpeaking && activeText === text;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">
          {label}
        </p>
        {isSupported && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => (isThisPlaying ? onStop() : onPlay(text))}
            aria-label={
              isThisPlaying ? `Stop ${label}` : `Listen to ${label}`
            }
          >
            {isThisPlaying ? "Stop" : "Listen"}
          </Button>
        )}
      </div>
      <p className="text-sm text-slate-200 leading-relaxed">{text}</p>
    </div>
  );
}

export function V2TraceDebrief({
  analysis,
  userAnswerText,
  onTryAgain,
  onNextQuestion,
  isLastQuestion = false,
}: V2TraceDebriefProps) {
  const tts = useSpeechSynthesis();
  const insufficient = analysis.evaluationGate === "insufficient_content";
  const meaningfulMinimal = isMeaningfulCorrection(
    userAnswerText,
    analysis.naturalVersion
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <HeroPortrait characterId="trace" size="md" alt="Trace" showBorder />
        <div>
          <p className="text-xs uppercase tracking-widest text-accent-cyan">
            {insufficient ? "Trace · More context needed" : "Trace · Answer Review"}
          </p>
          {!insufficient && (
            <p className="text-sm text-slate-400">
              Overall score: {analysis.score}/100
            </p>
          )}
        </div>
      </div>

      {insufficient ? (
        <section className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 space-y-3">
          <p className="text-sm text-slate-200 leading-relaxed">
            {analysis.feedback}
          </p>
          <ul className="space-y-1.5 text-sm text-slate-400">
            <li>Answer completeness: insufficient</li>
            <li>English correction: limited</li>
            <li>Interview evaluation: not enough evidence</li>
          </ul>
          {analysis.improvements[0] && (
            <p className="text-sm text-amber-200/90">
              Try: {analysis.improvements[0]}
            </p>
          )}
        </section>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {AXIS_LABELS.map(({ key, label }) => (
            <div
              key={key}
              className="rounded-lg border border-panel-border bg-panel/40 px-3 py-2 text-center"
            >
              <p className="text-[10px] uppercase text-slate-500">{label}</p>
              <p className="text-lg font-semibold text-white">
                {toTenScale(analysis.breakdown[key])}/10
              </p>
            </div>
          ))}
        </div>
      )}

      {!insufficient && analysis.strengths.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Good
          </h3>
          <ul className="space-y-1.5 text-sm text-slate-300">
            {analysis.strengths.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-emerald-500 shrink-0">+</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!insufficient && analysis.improvements.length > 0 && (
        <section className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Improve
          </h3>
          <ul className="space-y-1.5 text-sm text-slate-300">
            {analysis.improvements.slice(0, 3).map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-amber-500 shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="space-y-4 rounded-xl border border-panel-border bg-slate-900/40 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
          Listen & compare
        </h3>
        {tts.error && (
          <p className="text-xs text-amber-300/90" role="alert">
            {tts.error}
          </p>
        )}
        <ListenRow
          label="My version"
          text={userAnswerText}
          isSupported={tts.isSupported}
          isSpeaking={tts.isSpeaking}
          activeText={tts.lastText}
          onPlay={tts.play}
          onStop={tts.stop}
        />

        {meaningfulMinimal ? (
          <ListenRow
            label="Minimal correction"
            text={analysis.naturalVersion}
            isSupported={tts.isSupported}
            isSpeaking={tts.isSpeaking}
            activeText={tts.lastText}
            onPlay={tts.play}
            onStop={tts.stop}
          />
        ) : (
          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Minimal correction
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              No meaningful correction needed.
            </p>
            <p className="text-xs text-slate-500">
              Only capitalization/punctuation changed.
            </p>
          </div>
        )}

        <ListenRow
          label="Strong B2 version"
          text={analysis.staffVersion}
          isSupported={tts.isSupported}
          isSpeaking={tts.isSpeaking}
          activeText={tts.lastText}
          onPlay={tts.play}
          onStop={tts.stop}
          emptyMessage={
            insufficient ? STRONG_B2_UNAVAILABLE : undefined
          }
        />
      </section>

      {!insufficient && analysis.detectedCollocations.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {analysis.detectedCollocations.map((phrase) => (
            <span
              key={phrase}
              className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950/50 text-cyan-300 border border-cyan-800/30"
            >
              {phrase}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <Button variant="secondary" onClick={onTryAgain} size="lg">
          Try Again
        </Button>
        <Button onClick={onNextQuestion} size="lg">
          {isLastQuestion ? "Finish Session" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
