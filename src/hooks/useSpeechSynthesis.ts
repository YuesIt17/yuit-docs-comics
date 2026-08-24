"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createBrowserSpeechSynthesizer } from "@/lib/speech/browserSpeechSynthesizer";
import {
  PREVIEW_VOICE_SENTENCE,
  isEnglishVoiceLang,
} from "@/lib/speech/voicePrefs";
import type {
  SpeechSynthesisVoiceInfo,
  SpeechSynthesizer,
} from "@/lib/speech/types";
import { useSettingsStore } from "@/store/settingsStore";

const RATE_STEPS = [1, 0.85, 0.7] as const;

export interface UseSpeechSynthesisResult {
  isSupported: boolean;
  isSpeaking: boolean;
  rate: number;
  lastText: string | null;
  error: string | null;
  voices: SpeechSynthesisVoiceInfo[];
  selectedVoiceURI: string;
  play: (text: string, overrideRate?: number, voiceURI?: string) => void;
  stop: () => void;
  replay: () => void;
  previewVoice: (voiceURI?: string) => void;
  cycleSlower: () => number;
  setRate: (rate: number) => void;
  setVoice: (voice: SpeechSynthesisVoiceInfo) => void;
  clearError: () => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisResult {
  const [synth] = useState<SpeechSynthesizer | null>(() => {
    if (typeof window === "undefined") return null;
    return createBrowserSpeechSynthesizer();
  });

  const isSupported = synth?.isSupported() ?? false;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastText, setLastText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoiceInfo[]>([]);

  const speechVoiceURI = useSettingsStore((s) => s.speechVoiceURI);
  const speechVoiceName = useSettingsStore((s) => s.speechVoiceName);
  const speechVoiceLang = useSettingsStore((s) => s.speechVoiceLang);
  const speechRate = useSettingsStore((s) => s.speechRate);
  const setSpeechVoice = useSettingsStore((s) => s.setSpeechVoice);
  const setSpeechRate = useSettingsStore((s) => s.setSpeechRate);

  const prefsRef = useRef({
    speechVoiceURI,
    speechVoiceName,
    speechVoiceLang,
    speechRate,
  });

  useEffect(() => {
    prefsRef.current = {
      speechVoiceURI,
      speechVoiceName,
      speechVoiceLang,
      speechRate,
    };
  }, [speechVoiceURI, speechVoiceName, speechVoiceLang, speechRate]);

  useEffect(() => {
    return () => {
      synth?.stop();
    };
  }, [synth]);

  useEffect(() => {
    if (!synth?.isSupported()) return;

    const loadVoices = () => {
      const english = synth
        .getVoices()
        .filter((v) => isEnglishVoiceLang(v.lang));
      setVoices(english);
    };

    loadVoices();
    if (typeof window === "undefined") return;
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [synth]);

  const play = useCallback(
    (text: string, overrideRate?: number, voiceURI?: string) => {
      if (!synth?.isSupported()) {
        setError("Voice playback isn't supported in this browser.");
        return;
      }
      const trimmed = text.trim();
      if (!trimmed) return;

      const prefs = prefsRef.current;
      setError(null);
      setLastText(trimmed);
      setIsSpeaking(true);
      synth.speak(
        trimmed,
        {
          rate: overrideRate ?? prefs.speechRate,
          lang: prefs.speechVoiceLang || "en-US",
          voiceURI: voiceURI || prefs.speechVoiceURI || undefined,
          voiceName: prefs.speechVoiceName || undefined,
        },
        {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
          onError: (message) => {
            setError(message);
            setIsSpeaking(false);
          },
        }
      );
    },
    [synth]
  );

  const stop = useCallback(() => {
    synth?.stop();
    setIsSpeaking(false);
  }, [synth]);

  const replay = useCallback(() => {
    if (lastText) play(lastText);
  }, [lastText, play]);

  const previewVoice = useCallback(
    (voiceURI?: string) => {
      play(PREVIEW_VOICE_SENTENCE, undefined, voiceURI);
    },
    [play]
  );

  const setRate = useCallback(
    (next: number) => {
      setSpeechRate(next);
    },
    [setSpeechRate]
  );

  const setVoice = useCallback(
    (voice: SpeechSynthesisVoiceInfo) => {
      setSpeechVoice({
        voiceURI: voice.voiceURI,
        voiceName: voice.name,
        voiceLang: voice.lang,
      });
    },
    [setSpeechVoice]
  );

  const cycleSlower = useCallback((): number => {
    const current = prefsRef.current.speechRate;
    const idx = RATE_STEPS.indexOf(current as (typeof RATE_STEPS)[number]);
    const next =
      idx >= 0 && idx < RATE_STEPS.length - 1
        ? RATE_STEPS[idx + 1]
        : RATE_STEPS[0];
    return next;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    isSupported,
    isSpeaking,
    rate: speechRate,
    lastText,
    error,
    voices,
    selectedVoiceURI: speechVoiceURI,
    play,
    stop,
    replay,
    previewVoice,
    cycleSlower,
    setRate,
    setVoice,
    clearError,
  };
}

export { RATE_STEPS };
