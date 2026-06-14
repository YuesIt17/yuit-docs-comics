"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { Round432Data } from "@/lib/episode-engine/types";

interface TimerRoundProps {
  round: 1 | 2 | 3;
  durationMinutes: number;
  label: string;
  color: "purple" | "green" | "orange";
  isActive: boolean;
  onStart: () => void;
  onStop: () => void;
  onSave: (answer: string) => void;
  saved?: Round432Data;
  hint?: string;
}

const COLOR_MAP = {
  purple: "border-purple-700 bg-purple-950/40",
  green: "border-green-700 bg-green-950/40",
  orange: "border-orange-700 bg-orange-950/40",
};

export function TimerRound({
  durationMinutes,
  label,
  color,
  isActive,
  onStart,
  onStop,
  onSave,
  saved,
  hint,
}: TimerRoundProps) {
  const totalSeconds = durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [answer, setAnswer] = useState(saved?.answer ?? "");
  const [running, setRunning] = useState(false);
  const prevActive = useRef(isActive);

  useEffect(() => {
    if (isActive && !prevActive.current) {
      setRunning(true);
      setSecondsLeft(totalSeconds);
    }
    if (!isActive && prevActive.current) {
      setRunning(false);
      setSecondsLeft(totalSeconds);
    }
    prevActive.current = isActive;
  }, [isActive, totalSeconds]);

  useEffect(() => {
    if (!running) return;

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [running]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const handleStart = () => {
    setSecondsLeft(totalSeconds);
    setRunning(true);
    onStart();
  };

  const handleDone = () => {
    setRunning(false);
    onStop();
    if (answer.trim()) onSave(answer.trim());
  };

  return (
    <div
      className={`flex-1 min-w-[140px] rounded-xl border p-3 ${COLOR_MAP[color]} ${saved ? "opacity-80" : ""}`}
    >
      <div className="text-lg font-bold text-white">{durationMinutes} min</div>
      <div className="text-[10px] text-slate-400 mb-2">{label}</div>
      {hint && (
        <p className="text-[10px] text-slate-500 mb-2 line-clamp-2">{hint}</p>
      )}
      {running ? (
        <div className="space-y-2">
          <div className="text-2xl font-mono text-white">
            {mins}:{secs.toString().padStart(2, "0")}
          </div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={2}
            placeholder="Type while you practice..."
            className="w-full bg-black/30 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 resize-none"
          />
          <Button size="sm" variant="secondary" onClick={handleDone}>
            Done
          </Button>
        </div>
      ) : saved ? (
        <div className="text-[10px] text-accent-green">Completed ✓</div>
      ) : (
        <Button size="sm" variant="outline" onClick={handleStart}>
          START
        </Button>
      )}
    </div>
  );
}
