import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "cyan" | "orange" | "purple" | "green";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-slate-700 text-slate-200",
        variant === "cyan" && "bg-cyan-950 text-accent-cyan border border-cyan-800",
        variant === "orange" && "bg-orange-950 text-accent-orange border border-orange-800",
        variant === "purple" && "bg-purple-950 text-purple-300 border border-purple-800",
        variant === "green" && "bg-green-950 text-accent-green border border-green-800",
        className
      )}
    >
      {children}
    </span>
  );
}
