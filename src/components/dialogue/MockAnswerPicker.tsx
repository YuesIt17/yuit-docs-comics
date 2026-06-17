"use client";

import { getFixturesForScene, type HrDialogFixture } from "@/mocks/fixtures/hr-dialogs";

interface MockAnswerPickerProps {
  sceneId: string;
  onSelect: (answer: string) => void;
}

const QUALITY_STYLE: Record<string, string> = {
  weak: "border-red-800/60 bg-red-950/30 text-red-300 hover:bg-red-950/50",
  average: "border-amber-800/60 bg-amber-950/30 text-amber-200 hover:bg-amber-950/50",
  strong: "border-green-800/60 bg-green-950/30 text-green-300 hover:bg-green-950/50",
};

export function MockAnswerPicker({ sceneId, onSelect }: MockAnswerPickerProps) {
  const fixtures = getFixturesForScene(sceneId);
  if (fixtures.length === 0) return null;

  return (
    <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-3 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
          HR Mock Answers
        </p>
        <span className="text-[9px] text-slate-600 font-mono">demo fixtures</span>
      </div>
      <p className="text-[10px] text-slate-500">
        Load a sample answer for this scene — weak, average, or staff-level strong.
      </p>
      <div className="flex flex-wrap gap-1.5">
        {fixtures.map((fixture: HrDialogFixture) => (
          <button
            key={`${fixture.sceneId}-${fixture.quality}`}
            type="button"
            onClick={() => onSelect(fixture.userAnswer)}
            className={`text-[10px] px-2.5 py-1.5 rounded-lg border transition-colors ${QUALITY_STYLE[fixture.quality]}`}
            title={fixture.userAnswer.slice(0, 120) + "..."}
          >
            {fixture.quality}: {fixture.label}
          </button>
        ))}
      </div>
      <p className="text-[9px] text-slate-600 font-mono">
        Or type: [mock:weak] · [mock:average] · [mock:strong]
      </p>
    </div>
  );
}
