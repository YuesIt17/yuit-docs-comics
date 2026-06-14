"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { Transcript } from "./Transcript";
import { UserAnswerForm } from "./UserAnswerForm";
import type { DialogueEntry, Scene } from "@/lib/episode-engine/types";

interface DialogueTabsProps {
  scene: Scene;
  dialogueLog: DialogueEntry[];
  notes: string;
  onNotesChange: (notes: string) => void;
  onSubmitAnswer: (answer: string) => void;
  isSubmitting: boolean;
}

export function DialogueTabs({
  scene,
  dialogueLog,
  notes,
  onNotesChange,
  onSubmitAnswer,
  isSubmitting,
}: DialogueTabsProps) {
  const [activeTab, setActiveTab] = useState("dialogue");

  const tabs = [
    { id: "dialogue", label: "Dialogue" },
    { id: "notes", label: "Notes" },
    { id: "transcript", label: "Transcript" },
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "dialogue" && (
          <div className="space-y-4">
            <Transcript entries={dialogueLog} />
            <UserAnswerForm
              sceneId={scene.id}
              prompt={scene.interaction.prompt}
              hints={scene.interaction.hints}
              onSubmit={onSubmitAnswer}
              isSubmitting={isSubmitting}
            />
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
