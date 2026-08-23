"use client";

import { useState } from "react";
import { HeroPortrait } from "@/components/heroes/HeroPortrait";
import { Button } from "@/components/ui/Button";
import { MockAnswerPicker } from "@/components/dialogue/MockAnswerPicker";

interface V2QuestionPanelProps {
  sceneId: string;
  questionNumber: number;
  totalQuestions: number;
  difficulty: string;
  interviewerName: string;
  interviewerRole: string;
  questionText: string;
  coachingPrompt?: string;
  hints: string[];
  hintTip?: string;
  onSubmit: (answer: string) => void;
  onSkip: () => void;
  isSubmitting: boolean;
  showHint: boolean;
  onToggleHint: () => void;
}

export function V2QuestionPanel({
  sceneId,
  questionNumber,
  totalQuestions,
  difficulty,
  interviewerName,
  interviewerRole,
  questionText,
  coachingPrompt,
  hints,
  hintTip,
  onSubmit,
  onSkip,
  isSubmitting,
  showHint,
  onToggleHint,
}: V2QuestionPanelProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!answer.trim() || isSubmitting) return;
    onSubmit(answer.trim());
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
        <span className="uppercase tracking-wider font-medium text-slate-400">
          HR Interview
        </span>
        <span>
          Question {questionNumber} / {totalQuestions}
        </span>
        <span className="text-accent-cyan">{difficulty}</span>
      </div>

      <div className="flex items-start gap-4">
        <HeroPortrait
          characterId="sophia"
          size="lg"
          alt={interviewerName}
          showBorder
          className="shrink-0 hidden sm:block"
        />
        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <p className="text-xs font-semibold text-pink-300 uppercase tracking-wide">
              {interviewerName}
            </p>
            <p className="text-[11px] text-slate-500">{interviewerRole}</p>
          </div>
          <blockquote className="text-base sm:text-lg text-white leading-relaxed">
            &ldquo;{questionText}&rdquo;
          </blockquote>
          {coachingPrompt && coachingPrompt !== questionText && (
            <p className="text-sm text-slate-400">{coachingPrompt}</p>
          )}
        </div>
      </div>

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

      <div className="space-y-3">
        <MockAnswerPicker sceneId={sceneId} onSelect={setAnswer} />

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer in English..."
          rows={5}
          className="w-full bg-slate-900/60 border border-panel-border rounded-xl p-4 text-sm text-slate-100 resize-none focus:outline-none focus:border-accent-cyan/50"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
            size="lg"
            className="flex-1 sm:flex-none min-w-[140px]"
          >
            {isSubmitting ? "Analyzing..." : "Submit Answer"}
          </Button>
          <Button variant="secondary" onClick={onToggleHint}>
            Hint
          </Button>
          <Button variant="ghost" onClick={onSkip} disabled={isSubmitting}>
            Skip
          </Button>
        </div>
      </div>
    </div>
  );
}
