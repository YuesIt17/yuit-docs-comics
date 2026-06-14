import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: "cyan" | "purple" | "orange" | "green";
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  color = "purple",
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));

  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <div className="flex justify-between text-xs text-slate-400">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            color === "cyan" && "bg-accent-cyan",
            color === "purple" && "bg-accent-purple",
            color === "orange" && "bg-accent-orange",
            color === "green" && "bg-accent-green"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
