"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { SPEECH_RATE_OPTIONS } from "@/lib/speech/voicePrefs";

export function V2VoiceSettings() {
  const tts = useSpeechSynthesis();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!tts.isSupported) return null;

  return (
    <div className="relative" ref={panelRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        Voice ⚙
      </Button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Voice settings"
          className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-panel-border bg-slate-950/95 p-3 shadow-xl shadow-black/40 space-y-3"
        >
          <div className="space-y-1.5">
            <label
              htmlFor={`${panelId}-voice`}
              className="text-[10px] uppercase tracking-wider text-slate-500"
            >
              Voice
            </label>
            <select
              id={`${panelId}-voice`}
              value={tts.selectedVoiceURI}
              onChange={(e) => {
                const voice = tts.voices.find(
                  (v) => v.voiceURI === e.target.value
                );
                if (voice) tts.setVoice(voice);
              }}
              className="w-full rounded-lg border border-panel-border bg-slate-900 px-2 py-1.5 text-xs text-slate-100"
            >
              <option value="">Browser default (English)</option>
              {tts.voices.map((voice) => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
            {tts.voices.length === 0 && (
              <p className="text-[11px] text-slate-500">
                Voices are still loading…
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Speech rate
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SPEECH_RATE_OPTIONS.map((rate) => (
                <Button
                  key={rate}
                  type="button"
                  size="sm"
                  variant={tts.rate === rate ? "outline" : "ghost"}
                  onClick={() => tts.setRate(rate)}
                >
                  {rate.toFixed(2).replace(/\.00$/, ".0")}x
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() =>
                tts.previewVoice(tts.selectedVoiceURI || undefined)
              }
            >
              Preview voice
            </Button>
            {tts.isSpeaking && (
              <Button type="button" size="sm" variant="ghost" onClick={tts.stop}>
                Stop
              </Button>
            )}
          </div>

          {tts.error && (
            <p className="text-xs text-amber-300/90" role="alert">
              {tts.error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
