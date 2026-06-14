"use client";

import { motion } from "framer-motion";

interface SpeechBubbleProps {
  speakerName: string;
  text: string;
  position?: "left" | "right" | "center";
  delay?: number;
}

export function SpeechBubble({
  speakerName,
  text,
  position = "left",
  delay = 0,
}: SpeechBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className={`absolute max-w-[45%] z-40 ${
        position === "left"
          ? "left-[5%] top-[8%]"
          : position === "right"
            ? "right-[5%] top-[12%]"
            : "left-1/2 -translate-x-1/2 top-[5%]"
      }`}
    >
      <div className="bg-white/95 text-slate-900 rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg">
        <p className="text-[10px] font-semibold text-purple-600 mb-1 uppercase tracking-wide">
          {speakerName}
        </p>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
      <div className="w-3 h-3 bg-white/95 rotate-45 -mt-1.5 ml-4" />
    </motion.div>
  );
}
