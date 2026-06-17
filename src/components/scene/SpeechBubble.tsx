"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { InterviewBubblePlacement } from "@/lib/scene/sceneLayout";

export type BubbleSide = "left" | "right" | "top";

export interface SpeechBubbleProps {
  speakerName: string;
  text: string;
  /** Legacy scene layout */
  side?: BubbleSide;
  /** Interview layout — bubble beside character */
  placement?: InterviewBubblePlacement;
  className?: string;
  delay?: number;
}

export function SpeechBubble({
  speakerName,
  text,
  side = "left",
  placement,
  className,
  delay = 0,
}: SpeechBubbleProps) {
  const interview = placement != null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={cn(
        "absolute z-40",
        interview &&
          placement === "beside-left" &&
          "left-[1%] bottom-[38%] max-w-[min(38%,260px)]",
        interview &&
          placement === "beside-right" &&
          "right-[1%] bottom-[38%] max-w-[min(38%,260px)]",
        interview &&
          placement === "above" &&
          "right-[4%] bottom-[50%] max-w-[min(32%,220px)]",
        !interview && "max-w-[min(42%,320px)]",
        !interview && side === "left" && "left-[4%] top-[6%]",
        !interview && side === "right" && "right-[4%] top-[10%]",
        !interview && side === "top" && "left-1/2 -translate-x-1/2 top-[2%]",
        className
      )}
    >
      <div className="relative">
        {/* Tail pointing toward speaker */}
        {interview && placement === "beside-left" && (
          <div
            className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white/95 rotate-45 border-r border-t border-white/80"
            aria-hidden
          />
        )}
        {interview && placement === "beside-right" && (
          <div
            className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white/95 rotate-45 border-l border-b border-white/80"
            aria-hidden
          />
        )}
        {interview && placement === "above" && (
          <div
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white/95 rotate-45 border-b border-r border-white/80"
            aria-hidden
          />
        )}

        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 shadow-xl border",
            "bg-white/95 text-slate-900 border-white/80",
            "backdrop-blur-sm"
          )}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-0.5">
            {speakerName}
          </p>
          <p className="text-[13px] leading-snug text-slate-800">{text}</p>
        </div>
      </div>

      {/* Legacy downward tail */}
      {!interview && (
        <div
          className={cn(
            "w-3 h-3 bg-white/95 rotate-45 border border-white/80",
            side === "left" && "-mt-1.5 ml-6",
            side === "right" && "-mt-1.5 mr-6 ml-auto",
            side === "top" && "-mt-1.5 mx-auto"
          )}
        />
      )}
    </motion.div>
  );
}
