"use client";

import type { DialogueEntry } from "@/lib/episode-engine/types";

interface TranscriptProps {
  entries: DialogueEntry[];
  showTimestamps?: boolean;
}

export function Transcript({ entries, showTimestamps = false }: TranscriptProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-slate-500 italic">
        Dialogue will appear here as the conversation progresses...
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry, i) => (
        <div
          key={i}
          className={`text-sm ${entry.isUser ? "text-accent-cyan" : "text-slate-300"}`}
        >
          <span className="font-semibold text-white">{entry.speakerName}: </span>
          {entry.text}
          {showTimestamps && (
            <span className="text-[10px] text-slate-600 ml-2">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
