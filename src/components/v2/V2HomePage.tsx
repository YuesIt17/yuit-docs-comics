"use client";

import Link from "next/link";
import {
  DAILY_GOAL_MINUTES,
  useV2ProgressStore,
} from "@/store/v2ProgressStore";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { features } from "@/config/features";

const TARGET_ROLES = [
  "Engineering Manager",
  "Technical Engineering Manager",
  "Solution Architect",
  "Systems / Software Architect",
];

const COMING_SOON = [
  { label: "Practice STAR Story", track: "behavioral" },
  { label: "Leadership Drill", track: "leadership" },
  { label: "Technical Communication", track: "technical" },
] as const;

export function V2HomePage() {
  const { minutesToday, getSpeakingReadiness, tracks } = useV2ProgressStore();
  const readiness = getSpeakingReadiness();
  const hrTrack = tracks.hr;

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        <section className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-accent-cyan">
            Professional English Interview Coach
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            What should I practice today?
          </h1>
        </section>

        <section className="rounded-xl border border-panel-border bg-panel/30 p-4 space-y-2">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Target roles
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {TARGET_ROLES.slice(0, 2).join(" · ")}
            <span className="text-slate-500"> + senior technical leadership</span>
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500">
            Today
          </p>

          <Link
            href="/v2/practice/hr"
            className="block rounded-xl border border-purple-800/50 bg-gradient-to-br from-purple-950/60 to-slate-900/80 p-5 hover:border-purple-600/60 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white group-hover:text-purple-100">
                  Start HR Interview
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Recruiter questions with Trace feedback
                </p>
                <p className="text-xs text-slate-500 mt-2">15–20 min</p>
              </div>
              <span className="text-2xl shrink-0" aria-hidden>
                →
              </span>
            </div>
            {hrTrack.completedQuestions > 0 && (
              <p className="text-xs text-purple-300 mt-3">
                {hrTrack.completedQuestions} / {hrTrack.totalQuestions} questions
                completed
              </p>
            )}
          </Link>

          {COMING_SOON.map((item) => (
            <div
              key={item.track}
              className="rounded-xl border border-panel-border bg-panel/20 p-5 opacity-60"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-medium text-slate-400">
                    {item.label}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">Coming in v0.3.0</p>
                </div>
                <Button variant="secondary" size="sm" disabled>
                  Soon
                </Button>
              </div>
            </div>
          ))}
        </section>

        <section className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-panel-border bg-panel/30 p-4 space-y-3">
            <ProgressBar
              value={readiness}
              label="Speaking Readiness"
              color="cyan"
            />
          </div>
          <div className="rounded-xl border border-panel-border bg-panel/30 p-4 space-y-1">
            <p className="text-xs text-slate-400">Today</p>
            <p className="text-2xl font-semibold text-white">
              {minutesToday}{" "}
              <span className="text-sm font-normal text-slate-500">
                / {DAILY_GOAL_MINUTES} min
              </span>
            </p>
          </div>
        </section>

        {!features.storyBank && (
          <p className="text-xs text-slate-600 text-center">
            V1 experience still available at{" "}
            <Link href="/episodes/hr-intro" className="text-accent-cyan hover:underline">
              /episodes/hr-intro
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
