"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { MockAnswerPicker } from "./MockAnswerPicker";

interface UserAnswerFormProps {
  sceneId: string;
  prompt: string;
  hints: string[];
  onSubmit: (answer: string) => void;
  isSubmitting: boolean;
}

export function UserAnswerForm({
  sceneId,
  prompt,
  hints,
  onSubmit,
  isSubmitting,
}: UserAnswerFormProps) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(answer.trim());
  };

  return (
    <div className="space-y-3 border-t border-panel-border pt-4">
      <p className="text-sm font-medium text-slate-200">{prompt}</p>
      <div className="flex flex-wrap gap-1.5">
        {hints.map((hint) => (
          <span
            key={hint}
            className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400"
          >
            {hint}
          </span>
        ))}
      </div>

      <MockAnswerPicker sceneId={sceneId} onSelect={setAnswer} />

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        rows={4}
        className="w-full bg-slate-900/60 border border-panel-border rounded-lg p-3 text-sm text-slate-100 resize-none focus:outline-none focus:border-accent-cyan/50"
      />
      <Button
        onClick={handleSubmit}
        disabled={!answer.trim() || isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? "Trace is analyzing..." : "Submit to Trace"}
      </Button>
    </div>
  );
}
