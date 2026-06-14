"use client";

interface FeedbackCardProps {
  feedback?: string;
  strengths: string[];
  improvements: string[];
}

export function FeedbackCard({
  feedback,
  strengths,
  improvements,
}: FeedbackCardProps) {
  return (
    <div className="space-y-3">
      {feedback && (
        <p className="text-sm text-slate-300 leading-relaxed">{feedback}</p>
      )}
      {strengths.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-accent-green mb-1.5">
            Strengths
          </p>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2">
                <span className="text-accent-green">+</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
      {improvements.length > 0 && (
        <div>
          <p className="text-[10px] uppercase tracking-wider text-accent-orange mb-1.5">
            Improvements
          </p>
          <ul className="space-y-1">
            {improvements.map((s, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-2">
                <span className="text-accent-orange">→</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
