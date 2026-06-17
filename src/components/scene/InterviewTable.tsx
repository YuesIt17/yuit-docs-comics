"use client";

/** Foreground meeting table — simple centered surface. */
export function InterviewTable() {
  return (
    <div className="absolute bottom-0 inset-x-0 z-[12] h-[22%] pointer-events-none">
      <div className="absolute inset-x-[12%] bottom-0 h-6 bg-black/40 blur-xl rounded-[100%]" />
      <div className="absolute inset-x-[8%] top-0 h-[50%] rounded-t-2xl bg-gradient-to-b from-[#3a4a60] via-[#283444] to-[#1c2530] border-t border-white/15 shadow-[0_-8px_32px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-br from-white/[0.08] via-transparent to-transparent" />
        <div className="absolute top-0 inset-x-[10%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <div className="absolute inset-x-[6%] bottom-0 top-[42%] rounded-b-xl bg-gradient-to-b from-[#181f2a] via-[#10151c] to-[#080a0f] border-x border-white/[0.05]" />
    </div>
  );
}
