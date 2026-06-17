"use client";

import Link from "next/link";
import { Sidebar } from "@/components/layout/Sidebar";
import { TraceCoachPanel } from "@/components/coaching/TraceCoachPanel";
import { BottomMissionBar } from "@/components/layout/BottomMissionBar";
import type { CollocationItem } from "@/lib/episode-engine/types";

interface EpisodeLayoutProps {
  children: React.ReactNode;
  uncleEugeneTip?: string;
  episodeProgress?: number;
  missionTitle?: string;
  currentStep?: number;
  totalSteps?: number;
  rewardLabel?: string;
  collocations?: string[];
  collocationItems?: CollocationItem[];
  starEnabled?: boolean;
}

export function EpisodeLayout({
  children,
  uncleEugeneTip,
  episodeProgress,
  missionTitle = "Introduce Yourself in a Staff Engineer Interview",
  currentStep = 1,
  totalSteps = 8,
  rewardLabel = "+150 XP — New Collocations Pack",
  collocations = [],
  collocationItems = [],
  starEnabled = true,
}: EpisodeLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <header className="h-12 shrink-0 border-b border-panel-border flex items-center justify-between px-4 bg-panel/30">
        <Link href="/" className="text-sm font-semibold text-slate-300 hover:text-white">
          The Staff Engineering Team
        </Link>
        <Link
          href="/settings"
          className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5"
        >
          Settings
        </Link>
      </header>

      <div className="flex flex-1 min-h-0">
        <Sidebar uncleEugeneTip={uncleEugeneTip} episodeProgress={episodeProgress} />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {children}
        </main>
        <TraceCoachPanel
          collocations={collocations}
          collocationItems={collocationItems}
          starEnabled={starEnabled}
        />
      </div>

      <BottomMissionBar
        missionTitle={missionTitle}
        currentStep={currentStep}
        totalSteps={totalSteps}
        rewardLabel={rewardLabel}
      />
    </div>
  );
}
