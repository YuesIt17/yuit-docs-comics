"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeroPortrait } from "@/components/heroes/HeroPortrait";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { useProgressStore } from "@/store/progressStore";
import { cn } from "@/lib/utils";

const PATHS = [
  { id: "hr-interviews", label: "HR Interviews", href: "/episodes/hr-intro", active: true },
  { id: "startup", label: "Startup Conversations", locked: true },
  { id: "architecture", label: "Architecture Reviews", locked: true },
  { id: "leadership", label: "Technical Leadership", locked: true },
  { id: "ai-native", label: "AI-Native Engineering", locked: true },
];

interface SidebarProps {
  uncleEugeneTip?: string;
  episodeProgress?: number;
}

export function Sidebar({ uncleEugeneTip, episodeProgress = 0 }: SidebarProps) {
  const pathname = usePathname();
  const { xp, level } = useProgressStore();

  const levelProgress = 72;

  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-panel-border bg-panel/50 overflow-y-auto">
      <div className="p-4 border-b border-panel-border">
        <Link href="/" className="flex items-center gap-2">
          <HeroPortrait characterId="uncle_eugene" size="xs" alt="The Staff Engineering Team" />
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">
              The
            </div>
            <div className="text-xs font-bold text-white leading-tight">
              STAFF ENGINEERING TEAM
            </div>
          </div>
        </Link>
      </div>

      <nav className="p-3 space-y-1">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 px-2 mb-2">
          Learning Paths
        </p>
        {PATHS.map((path) => (
          <Link
            key={path.id}
            href={path.locked ? "#" : (path.href ?? "#")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
              path.locked
                ? "text-slate-600 cursor-not-allowed"
                : pathname.includes("hr-intro")
                  ? "bg-purple-950/50 text-white border border-purple-800/40"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
            onClick={(e) => path.locked && e.preventDefault()}
          >
            {path.locked ? "🔒" : "▶"} {path.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 space-y-4 flex-1">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">
            My Progress
          </p>
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <svg className="w-full h-full -rotate-90">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#1e293b" strokeWidth="4" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="4"
                  strokeDasharray={`${levelProgress * 1.51} 151`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {levelProgress}%
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold">Staff Engineer Lvl {level}</div>
              <div className="text-[10px] text-slate-500">{xp} XP</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <ProgressBar label="Interview Communication" value={78} color="purple" />
          <ProgressBar label="Technical Storytelling" value={64} color="cyan" />
          <ProgressBar label="Vocabulary & Collocations" value={71} color="green" />
          <ProgressBar label="Speaking Fluency" value={68} color="orange" />
        </div>

        {episodeProgress > 0 && (
          <ProgressBar
            label="Episode Progress"
            value={episodeProgress}
            color="purple"
          />
        )}

        <div className="text-[10px] text-slate-500">
          Daily Goal: <span className="text-accent-green">15 / 20 min</span>
        </div>
      </div>

      {uncleEugeneTip && (
        <div className="m-3 p-3 rounded-xl bg-amber-950/30 border border-amber-800/40">
          <div className="flex items-center gap-2 mb-2">
            <HeroPortrait characterId="uncle_eugene" size="sm" alt="Uncle Eugene" showBorder />
            <div>
              <div className="text-xs font-semibold text-amber-200">Uncle Eugene</div>
              <Badge variant="orange" className="mt-0.5">Staff Engineer Tip</Badge>
            </div>
          </div>
          <p className="text-[11px] text-amber-100/80 italic leading-relaxed">
            &ldquo;{uncleEugeneTip}&rdquo;
          </p>
        </div>
      )}

      <div className="p-3 border-t border-panel-border space-y-1">
        <Link
          href="/heroes"
          className="block px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
        >
          Meet the Heroes
        </Link>
        <Link
          href="/settings"
          className="block px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
        >
          Settings
        </Link>
      </div>
    </aside>
  );
}
