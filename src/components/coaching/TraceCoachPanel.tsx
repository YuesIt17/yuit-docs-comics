"use client";

import Image from "next/image";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TraceScoreRing } from "@/components/coaching/TraceScoreRing";
import { FeedbackCard } from "@/components/coaching/FeedbackCard";
import { VersionCompare } from "@/components/coaching/VersionCompare";
import { StarFrameworkCard } from "@/components/coaching/StarFrameworkCard";
import { CollocationChips } from "@/components/coaching/CollocationChips";
import { CHARACTER_ASSETS } from "@/lib/assets/registry";
import { useTraceStore } from "@/store/traceStore";
import type { CollocationItem } from "@/lib/episode-engine/types";

interface TraceCoachPanelProps {
  collocations?: string[];
  collocationItems?: CollocationItem[];
  starEnabled?: boolean;
}

export function TraceCoachPanel({
  collocations = [],
  collocationItems = [],
  starEnabled = true,
}: TraceCoachPanelProps) {
  const { analysis, isLoading, error } = useTraceStore();

  return (
    <aside className="w-72 shrink-0 flex flex-col border-l border-panel-border bg-panel/50 overflow-y-auto">
      <div className="p-4 border-b border-panel-border">
        <div className="flex items-center gap-2 mb-1">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cyan-500/40 trace-scan shrink-0">
            <Image
              src={CHARACTER_ASSETS.trace}
              alt="Trace"
              fill
              className="object-cover object-top"
              sizes="40px"
            />
          </div>
          <h2 className="text-sm font-semibold text-white">Trace AI Coach</h2>
        </div>
        <p className="text-[10px] text-slate-500">
          Helpful, not perfect. Human reasoning required.
        </p>
      </div>

      <div className="p-4 space-y-4 flex-1">
        {isLoading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-24 bg-slate-800 rounded-full mx-auto w-24" />
            <div className="h-4 bg-slate-800 rounded w-3/4" />
            <div className="h-4 bg-slate-800 rounded w-full" />
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-950/40 border border-red-800 p-3 text-xs text-red-300">
            {error}
            <p className="mt-2 text-slate-400">
              Uncle Eugene says: Keep going — clarity comes with practice.
            </p>
          </div>
        )}

        {!isLoading && !analysis && !error && (
          <div className="text-center py-8 text-slate-500 text-sm">
            Submit an answer to get Trace analysis
          </div>
        )}

        {analysis && !isLoading && (
          <>
            <div className="flex justify-center">
              <TraceScoreRing score={analysis.score} />
            </div>

            <div className="space-y-1.5">
              {(Object.entries(analysis.breakdown) as [string, number][]).map(
                ([key, val]) => (
                  <ProgressBar
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={val}
                    color="cyan"
                  />
                )
              )}
            </div>

            <FeedbackCard
              feedback={analysis.feedback}
              strengths={analysis.strengths}
              improvements={analysis.improvements}
            />

            <VersionCompare
              naturalVersion={analysis.naturalVersion}
              staffVersion={analysis.staffVersion}
            />
          </>
        )}

        <StarFrameworkCard enabled={starEnabled} />

        <CollocationChips
          collocations={collocations}
          detected={analysis?.detectedCollocations}
          packItems={collocationItems}
        />
      </div>
    </aside>
  );
}
