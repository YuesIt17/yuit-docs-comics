"use client";

import { Tabs } from "@/components/ui/Tabs";
import { Transcript } from "@/components/dialogue/Transcript";
import { UserAnswerForm } from "@/components/dialogue/UserAnswerForm";
import type { DialogueEntry, Scene } from "@/lib/episode-engine/types";
import { useState } from "react";

interface DialoguePanelProps {
  scene: Scene;
  dialogueLog: DialogueEntry[];
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmitAnswer: (answer: string) => void;
  onAnswerDraftChange?: (answer: string) => void;
  isSubmitting: boolean;
  showInput: boolean;
}

export function DialoguePanel({
  scene,
  dialogueLog,
  notes,
  onNotesChange,
  onSubmitAnswer,
  onAnswerDraftChange,
  isSubmitting,
  showInput,
}: DialoguePanelProps) {
  const [activeTab, setActiveTab] = useState("dialogue");

  const tabs = [
    { id: "dialogue", label: "Dialogue" },
    { id: "notes", label: "Notes" },
    { id: "transcript", label: "Transcript" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-[280px] border-t border-panel-border bg-panel/20">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "dialogue" && (
          <div className="space-y-4">
            <Transcript entries={dialogueLog} />
            {showInput && (
              <UserAnswerForm
                sceneId={scene.id}
                prompt={scene.interaction.prompt}
                hints={scene.interaction.hints}
                onSubmit={onSubmitAnswer}
                onDraftChange={onAnswerDraftChange}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        )}
        {activeTab === "notes" && (
          <textarea
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Episode notes (saved locally)..."
            className="w-full h-40 bg-slate-900/50 border border-panel-border rounded-lg p-3 text-sm text-slate-200 resize-none focus:outline-none focus:border-accent-purple"
          />
        )}
        {activeTab === "transcript" && (
          <Transcript entries={dialogueLog} showTimestamps />
        )}
      </div>
    </div>
  );
}
