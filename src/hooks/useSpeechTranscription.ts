"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserSpeechTranscriber } from "@/lib/speech/browserSpeechTranscriber";
import type {
  SpeechTranscriber,
  SpeechTranscriberError,
} from "@/lib/speech/types";

export interface UseSpeechTranscriptionResult {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: SpeechTranscriberError | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
  clearError: () => void;
}

export function useSpeechTranscription(
  lang = "en-US"
): UseSpeechTranscriptionResult {
  const [transcriber] = useState<SpeechTranscriber | null>(() => {
    if (typeof window === "undefined") return null;
    return createBrowserSpeechTranscriber(lang);
  });

  const isSupported = transcriber?.isSupported() ?? false;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<SpeechTranscriberError | null>(null);

  useEffect(() => {
    return () => {
      transcriber?.abort();
    };
  }, [transcriber]);

  const start = useCallback(() => {
    if (!transcriber?.isSupported()) {
      setError({
        code: "unsupported",
        message:
          "Voice input isn't supported in this browser. You can still type your answer.",
      });
      return;
    }

    setError(null);
    setTranscript("");
    setInterimTranscript("");
    setIsListening(true);

    transcriber.start({
      onFinal: (text) => {
        setTranscript((prev) => {
          const piece = text.trim();
          if (!piece) return prev;
          return prev ? `${prev} ${piece}` : piece;
        });
        setInterimTranscript("");
      },
      onInterim: (text) => setInterimTranscript(text),
      onError: (err) => {
        if (err.code === "aborted") return;
        setError(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
        setInterimTranscript("");
      },
    });
  }, [transcriber]);

  const stop = useCallback(() => {
    transcriber?.stop();
    setIsListening(false);
    setInterimTranscript("");
  }, [transcriber]);

  const reset = useCallback(() => {
    transcriber?.abort();
    setIsListening(false);
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, [transcriber]);

  const clearError = useCallback(() => setError(null), []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
    reset,
    clearError,
  };
}
