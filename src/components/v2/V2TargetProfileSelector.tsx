"use client";

import { getTargetProfileLabel, type TargetProfileId } from "@/lib/interview/resumeProfiles";

interface V2TargetProfileSelectorProps {
  value: TargetProfileId;
  onChange: (id: TargetProfileId) => void;
  disabled?: boolean;
}

const OPTIONS: { id: TargetProfileId; label: string }[] = [
  { id: "engineering-manager", label: "Technical Engineering Manager" },
  { id: "architecture", label: "Solution Architect" },
];

export function V2TargetProfileSelector({
  value,
  onChange,
  disabled = false,
}: V2TargetProfileSelectorProps) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-400">
      <span className="shrink-0 uppercase tracking-wider text-[10px] text-slate-500">
        Target
      </span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as TargetProfileId)}
        className="max-w-[11rem] sm:max-w-[14rem] rounded-lg border border-panel-border bg-slate-900 px-2 py-1 text-xs text-slate-100 disabled:opacity-60"
        aria-label={`Target profile: ${getTargetProfileLabel(value)}`}
      >
        {OPTIONS.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
