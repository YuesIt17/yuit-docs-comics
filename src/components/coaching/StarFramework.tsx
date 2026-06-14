"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface StarData {
  situation: string;
  task: string;
  action: string;
  result: string;
}

interface StarFrameworkProps {
  enabled?: boolean;
}

export function StarFramework({ enabled = true }: StarFrameworkProps) {
  const [open, setOpen] = useState(false);
  const [star, setStar] = useState<StarData>({
    situation: "",
    task: "",
    action: "",
    result: "",
  });

  if (!enabled) return null;

  const fields: { key: keyof StarData; label: string; icon: string }[] = [
    { key: "situation", label: "Situation", icon: "S" },
    { key: "task", label: "Task", icon: "T" },
    { key: "action", label: "Action", icon: "A" },
    { key: "result", label: "Result", icon: "R" },
  ];

  return (
    <div className="rounded-lg border border-panel-border bg-slate-900/40 p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
          STAR Framework
        </h4>
        <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
          {open ? "Close" : "Open STAR Builder"}
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-1 mb-2">
        {fields.map((f) => (
          <div
            key={f.key}
            className="text-center p-1.5 rounded bg-slate-800/60"
            title={f.label}
          >
            <div className="text-accent-purple font-bold text-sm">{f.icon}</div>
            <div className="text-[9px] text-slate-500">{f.label}</div>
          </div>
        ))}
      </div>
      {open && (
        <div className="space-y-2 mt-3">
          {fields.map((f) => (
            <input
              key={f.key}
              value={star[f.key]}
              onChange={(e) => setStar({ ...star, [f.key]: e.target.value })}
              placeholder={f.label}
              className="w-full bg-slate-900/60 border border-panel-border rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-accent-purple"
            />
          ))}
        </div>
      )}
    </div>
  );
}
