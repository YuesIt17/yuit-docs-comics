"use client";

import Link from "next/link";

interface V2PracticeLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function V2PracticeLayout({
  children,
  title = "HR Interview",
  subtitle,
}: V2PracticeLayoutProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="shrink-0 px-4 py-3 border-b border-panel-border flex items-center gap-3">
        <Link
          href="/v2"
          className="text-xs text-slate-400 hover:text-white shrink-0"
        >
          ← Home
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-sm font-semibold text-white truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-slate-500 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}
