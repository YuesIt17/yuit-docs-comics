"use client";

import type { TraceAnalysis } from "@/lib/episode-engine/types";
import { Button } from "@/components/ui/Button";
import { HeroPortrait } from "@/components/heroes/HeroPortrait";

interface V2TraceDebriefProps {
  analysis: TraceAnalysis;
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

export function V2TraceDebrief({
  analysis,
  onTryAgain,
  onNextQuestion,
  isLastQuestion = false,
}: V2TraceDebriefProps) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <HeroPortrait characterId="trace" size="md" alt="Trace" showBorder />
        <div>
          <p className="text-xs uppercase tracking-widest text-accent-cyan">
            Trace · Answer Review
          </p>
          <p className="text-sm text-slate-400">
            Overall score: {analysis.score}/100
          </p>
        </div>
      </div>

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

      {analysis.strengths.length > 0 && (
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

      {analysis.improvements.length > 0 && (
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

      <section className="space-y-3 rounded-xl border border-panel-border bg-slate-900/40 p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-accent-cyan">
          English
        </h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-[10px] uppercase text-slate-500 mb-1">
              Natural version
            </p>
            <p className="text-slate-300 leading-relaxed">
              {analysis.naturalVersion}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase text-slate-500 mb-1">
              Interview-ready version
            </p>
            <p className="text-slate-200 leading-relaxed">
              {analysis.staffVersion}
            </p>
          </div>
        </div>
      </section>

      {analysis.detectedCollocations.length > 0 && (
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
