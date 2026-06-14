"use client";

export function RecordButtonStub() {
  return (
    <div
      className="flex flex-col items-center justify-center min-w-[100px] p-3 rounded-xl border border-dashed border-slate-700 opacity-60 cursor-not-allowed"
      title="Voice coming soon"
    >
      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl mb-2">
        🎙️
      </div>
      <span className="text-[10px] text-slate-500 text-center">
        Record Your Answer
      </span>
      <span className="text-[9px] text-slate-600 mt-1">Voice coming soon</span>
      <div className="flex gap-0.5 mt-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-0.5 bg-slate-600 rounded"
            style={{ height: `${8 + (i % 3) * 4}px` }}
          />
        ))}
      </div>
    </div>
  );
}
