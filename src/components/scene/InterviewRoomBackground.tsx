"use client";

/** CSS-composed interview room — no raster background. */
export function InterviewRoomBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0e14]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f1520] via-[#111827] to-[#07090d]" />

      {/* Ambient color wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_30%,rgba(99,102,241,0.08),transparent)]" />

      {/* Night window */}
      <div className="absolute top-[6%] left-[8%] right-[8%] h-[34%] rounded-2xl overflow-hidden border border-white/[0.07] shadow-[inset_0_0_60px_rgba(0,0,0,0.6)]">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-950 to-black" />
        <div className="absolute inset-0 opacity-70">
          {[
            [10, 50, 7, 16],
            [20, 38, 5, 20],
            [32, 58, 9, 11],
            [45, 32, 6, 24],
            [55, 55, 8, 14],
            [68, 40, 5, 18],
            [80, 62, 10, 10],
            [15, 75, 4, 9],
            [40, 80, 7, 8],
            [62, 72, 5, 11],
            [85, 45, 6, 15],
            [72, 25, 4, 13],
          ].map(([left, top, w, h], i) => (
            <div
              key={i}
              className="absolute rounded-[1px] bg-amber-100/35"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${w}%`,
                height: `${h}%`,
                boxShadow: "0 0 10px rgba(251,191,36,0.2)",
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-indigo-900/25" />
        {/* Window frame */}
        <div className="absolute inset-y-[10%] left-1/2 w-px bg-white/[0.06]" />
        <div className="absolute inset-x-[10%] top-1/2 h-px bg-white/[0.06]" />
      </div>

      {/* Wall art / panels */}
      <div className="absolute top-[43%] left-[6%] w-[16%] h-[18%] rounded-lg border border-white/[0.04] bg-gradient-to-br from-white/[0.03] to-transparent" />
      <div className="absolute top-[46%] right-[7%] w-[12%] h-[14%] rounded-lg border border-purple-500/10 bg-gradient-to-br from-purple-900/15 to-transparent flex items-end justify-center pb-1">
        <span className="text-[6px] text-white/20 uppercase tracking-widest">Impact</span>
      </div>

      {/* Practical lights */}
      <div className="absolute top-[40%] left-[10%] w-32 h-32 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute top-[36%] right-[18%] w-24 h-24 bg-cyan-500/6 rounded-full blur-2xl" />

      {/* Floor */}
      <div className="absolute bottom-0 inset-x-0 h-[35%] bg-gradient-to-t from-black/70 via-[#0a0e14]/80 to-transparent" />
      <div className="absolute bottom-[22%] inset-x-0 h-px bg-white/[0.03]" />
    </div>
  );
}
