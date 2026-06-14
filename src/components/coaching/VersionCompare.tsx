"use client";

import { useState } from "react";

interface VersionCompareProps {
  naturalVersion: string;
  staffVersion: string;
}

export function VersionCompare({
  naturalVersion,
  staffVersion,
}: VersionCompareProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-lg bg-slate-900/60 border border-panel-border p-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-accent-cyan">
            Natural
          </span>
          <button
            onClick={() => copy(naturalVersion, "natural")}
            className="text-[10px] text-slate-500 hover:text-white"
          >
            {copied === "natural" ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{naturalVersion}</p>
      </div>
      <div className="rounded-lg bg-purple-950/30 border border-purple-800/40 p-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-purple-300">
            Staff-Level
          </span>
          <button
            onClick={() => copy(staffVersion, "staff")}
            className="text-[10px] text-slate-500 hover:text-white"
          >
            {copied === "staff" ? "Copied!" : "Use this"}
          </button>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed font-medium">
          {staffVersion}
        </p>
      </div>
    </div>
  );
}
