"use client";

import { useState } from "react";

const METAPHOR_ICONS: Record<string, string> = {
  bottleneck: "⚡",
  scalability: "📈",
  reliability: "🛡️",
  observability: "📡",
  tradeoff: "⚖️",
  alignment: "🎯",
  complexity: "🕸️",
  maintainability: "🧩",
};

interface CollocationTagsProps {
  collocations: string[];
  detected?: string[];
  packItems?: { phrase: string; visualMetaphor: string }[];
}

export function CollocationTags({
  collocations,
  detected = [],
  packItems = [],
}: CollocationTagsProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const getIcon = (phrase: string) => {
    const item = packItems.find(
      (p) => p.phrase.toLowerCase() === phrase.toLowerCase()
    );
    return item ? (METAPHOR_ICONS[item.visualMetaphor] ?? "💬") : "💬";
  };

  const copy = async (phrase: string) => {
    await navigator.clipboard.writeText(phrase);
    setCopied(phrase);
    setTimeout(() => setCopied(null), 1500);
  };

  if (collocations.length === 0) return null;

  return (
    <div>
      <h4 className="text-[10px] uppercase tracking-wider text-slate-400 mb-2">
        Key Collocations
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {collocations.map((phrase) => {
          const isDetected = detected.some(
            (d) => d.toLowerCase() === phrase.toLowerCase()
          );
          return (
            <button
              key={phrase}
              onClick={() => copy(phrase)}
              className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                isDetected
                  ? "bg-cyan-950/60 border-cyan-700 text-accent-cyan"
                  : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              {getIcon(phrase)} {phrase}
              {copied === phrase && " ✓"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
