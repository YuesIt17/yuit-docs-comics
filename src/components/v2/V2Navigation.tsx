"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/v2", label: "Home", match: (path: string) => path === "/v2" },
  {
    href: "/v2/practice/hr",
    label: "Practice",
    match: (path: string) => path.startsWith("/v2/practice"),
  },
  {
    href: "/v2/stories",
    label: "Stories",
    match: (path: string) => path.startsWith("/v2/stories"),
  },
  {
    href: "/v2/progress",
    label: "Progress",
    match: (path: string) => path.startsWith("/v2/progress"),
  },
] as const;

export function V2Navigation() {
  const pathname = usePathname();

  return (
    <header className="shrink-0 border-b border-panel-border bg-panel/40">
      <div className="flex items-center justify-between gap-4 px-4 h-14">
        <Link href="/v2" className="shrink-0">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 block">
            Interview Coach
          </span>
          <span className="text-sm font-semibold text-white">V2 Preview</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                item.match(pathname)
                  ? "bg-purple-950/60 text-white border border-purple-800/40"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/settings"
          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-white/5 shrink-0"
        >
          Settings
        </Link>
      </div>

      <nav className="flex sm:hidden border-t border-panel-border/60 overflow-x-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 min-w-0 text-center px-2 py-2 text-xs transition-colors",
              item.match(pathname)
                ? "text-white bg-purple-950/40"
                : "text-slate-500"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
