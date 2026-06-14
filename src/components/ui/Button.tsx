import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "primary" &&
          "bg-gradient-to-r from-accent-purple to-indigo-600 text-white hover:opacity-90 shadow-lg shadow-purple-900/30",
        variant === "secondary" &&
          "bg-panel border border-panel-border text-foreground hover:bg-slate-800",
        variant === "ghost" && "text-slate-300 hover:text-white hover:bg-white/5",
        variant === "outline" &&
          "border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan/10",
        size === "sm" && "px-3 py-1.5 text-xs",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
