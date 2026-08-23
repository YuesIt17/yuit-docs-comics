"use client";

import { HeroPortrait } from "@/components/heroes/HeroPortrait";
import { cn } from "@/lib/utils";

interface V2ConversationExchangeProps {
  questionText: string;
  interviewerName?: string;
  interviewerRole?: string;
  protagonistName: string;
  submittedAnswerText?: string | null;
  followUpText?: string | null;
}

export function V2ConversationExchange({
  questionText,
  interviewerName = "Sophia",
  interviewerRole = "Recruiter / Talent Partner",
  protagonistName,
  submittedAnswerText,
  followUpText,
}: V2ConversationExchangeProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-4 space-y-4">
      {/* Sophia — left */}
      <div className="flex items-start gap-3 sm:gap-4 sm:max-w-[85%]">
        <HeroPortrait
          characterId="sophia"
          size="md"
          alt={interviewerName}
          showBorder
          className="shrink-0"
        />
        <div className="min-w-0 space-y-1">
          <div>
            <p className="text-xs font-semibold text-pink-300">{interviewerName}</p>
            <p className="text-[10px] text-slate-500">{interviewerRole}</p>
          </div>
          <div
            className={cn(
              "rounded-2xl rounded-tl-md border border-pink-900/40 bg-pink-950/30",
              "px-4 py-3 text-sm sm:text-base text-white leading-relaxed"
            )}
          >
            {questionText}
          </div>
        </div>
      </div>

      {/* Eugene — right (after submit) */}
      {submittedAnswerText && (
        <div className="flex items-start gap-3 sm:gap-4 sm:max-w-[85%] sm:ml-auto flex-row-reverse">
          <HeroPortrait
            characterId="protagonist"
            size="md"
            alt={protagonistName}
            showBorder
            className="shrink-0"
          />
          <div className="min-w-0 space-y-1 text-right">
            <p className="text-xs font-semibold text-indigo-300">
              {protagonistName}
            </p>
            <div
              className={cn(
                "rounded-2xl rounded-tr-md border border-indigo-900/40 bg-indigo-950/30",
                "px-4 py-3 text-sm sm:text-base text-slate-100 leading-relaxed text-left"
              )}
            >
              {submittedAnswerText}
            </div>
          </div>
        </div>
      )}

      {/* Optional recruiter follow-up */}
      {followUpText && (
        <div className="flex items-start gap-3 sm:gap-4 sm:max-w-[85%]">
          <HeroPortrait
            characterId="sophia"
            size="sm"
            alt={interviewerName}
            showBorder
            className="shrink-0"
          />
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold text-pink-300">{interviewerName}</p>
            <div className="rounded-2xl rounded-tl-md border border-panel-border bg-panel/40 px-4 py-3 text-sm text-slate-200 leading-relaxed">
              {followUpText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
