"use client";

import Link from "next/link";
import { useSettingsStore } from "@/store/settingsStore";
import { Button } from "@/components/ui/Button";
import { HeroPortrait } from "@/components/heroes/HeroPortrait";

export default function SettingsPage() {
  const {
    userName,
    avatarKey,
    userBackground,
    setUserName,
    setAvatarKey,
    setUserBackground,
  } = useSettingsStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-panel-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <Link
          href="/episodes/hr-intro"
          className="text-sm text-accent-cyan hover:underline"
        >
          ← Back to Episode
        </Link>
      </header>

      <main className="max-w-lg mx-auto p-6 space-y-6">
        <section className="rounded-xl border border-panel-border bg-panel/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Protagonist
          </h2>
          <div>
            <label className="text-xs text-slate-400 block mb-1">Display Name</label>
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-slate-900 border border-panel-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-accent-purple"
              placeholder="Eugene"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 block mb-2">Avatar</label>
            <div className="flex gap-3">
              {(["eugene", "alex"] as const).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAvatarKey(key)}
                  className={`flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-lg border text-sm transition-colors ${
                    avatarKey === key
                      ? "border-accent-purple bg-purple-950/50 text-white"
                      : "border-panel-border text-slate-400 hover:border-slate-600"
                  }`}
                >
                  <HeroPortrait characterId="protagonist" size="md" alt={key} showBorder />
                  <span className="capitalize">{key}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-panel-border bg-panel/50 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
            Background (optional)
          </h2>
          <p className="text-xs text-slate-500">
            Helps Trace personalize feedback for your experience level.
          </p>
          <textarea
            value={userBackground}
            onChange={(e) => setUserBackground(e.target.value)}
            rows={4}
            placeholder="Staff Software Engineer, 10+ years, distributed systems, platform engineering..."
            className="w-full bg-slate-900 border border-panel-border rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-accent-cyan"
          />
        </section>

        <Link href="/episodes/hr-intro">
          <Button className="w-full">Save & Continue</Button>
        </Link>
      </main>
    </div>
  );
}
