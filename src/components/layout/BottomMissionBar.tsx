"use client";

interface BottomMissionBarProps {
  missionTitle: string;
  currentStep: number;
  totalSteps: number;
  rewardLabel?: string;
  streak?: number;
}

export function BottomMissionBar({
  missionTitle,
  currentStep,
  totalSteps,
  rewardLabel,
  streak = 7,
}: BottomMissionBarProps) {
  const pct = Math.round((currentStep / totalSteps) * 100);

  return (
    <footer className="h-12 shrink-0 border-t border-panel-border bg-panel/80 flex items-center px-4 gap-4 text-xs">
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <span className="text-slate-500 shrink-0">Current Mission:</span>
        <span className="text-slate-200 truncate font-medium">{missionTitle}</span>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-purple rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-slate-500">
            {currentStep} / {totalSteps}
          </span>
        </div>
      </div>

      {rewardLabel && (
        <div className="hidden md:flex items-center gap-1.5 text-purple-300 shrink-0">
          <span>💎</span>
          <span>{rewardLabel}</span>
        </div>
      )}

      <div className="flex items-center gap-1.5 text-orange-400 shrink-0">
        <span>🔥</span>
        <span>{streak} days</span>
      </div>
    </footer>
  );
}
