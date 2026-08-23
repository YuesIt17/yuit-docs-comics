import type {
  SpeechTranscriber,
  SpeechTranscriberCallbacks,
  SpeechTranscriberError,
  SpeechTranscriberErrorCode,
} from "./types";

const DEFAULT_LANG = "en-US";

function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function mapError(error: string): SpeechTranscriberError {
  const code: SpeechTranscriberErrorCode =
    error === "not-allowed" || error === "service-not-allowed"
      ? "permission-denied"
      : error === "no-speech"
        ? "no-speech"
        : error === "network"
          ? "network"
          : error === "aborted"
            ? "aborted"
            : "unknown";

  const messages: Record<SpeechTranscriberErrorCode, string> = {
    unsupported: "Voice input isn't supported in this browser. You can still type your answer.",
    "permission-denied":
      "Microphone permission was denied. Enable microphone access or continue by typing.",
    "no-speech": "No speech detected. Try again or type your answer.",
    network: "Voice transcription had a network problem. You can still type your answer.",
    aborted: "Voice transcription stopped.",
    unknown: "Voice transcription failed. You can still type your answer.",
  };

  return { code, message: messages[code] };
}

export function createBrowserSpeechTranscriber(
  lang: string = DEFAULT_LANG
): SpeechTranscriber {
  let recognition: SpeechRecognition | null = null;
  let active = false;

  return {
    isSupported() {
      return getSpeechRecognitionCtor() !== null;
    },

    start(callbacks: SpeechTranscriberCallbacks) {
      const Ctor = getSpeechRecognitionCtor();
      if (!Ctor) {
        callbacks.onError(mapError("unsupported"));
        return;
      }

      this.stop();
      recognition = new Ctor();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;
      active = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let finalChunk = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const piece = result[0]?.transcript ?? "";
          if (result.isFinal) {
            finalChunk += piece;
          } else {
            interim += piece;
          }
        }
        if (finalChunk) callbacks.onFinal(finalChunk);
        callbacks.onInterim(interim);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error === "aborted") return;
        callbacks.onError(mapError(event.error));
      };

      recognition.onend = () => {
        active = false;
        callbacks.onEnd();
      };

      try {
        recognition.start();
      } catch {
        active = false;
        callbacks.onError(mapError("unknown"));
      }
    },

    stop() {
      if (!recognition) return;
      try {
        if (active) recognition.stop();
      } catch {
        /* ignore */
      }
      recognition = null;
      active = false;
    },

    abort() {
      if (!recognition) return;
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
      recognition = null;
      active = false;
    },
  };
}

export function isBrowserSpeechSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}
