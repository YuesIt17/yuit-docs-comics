import type {
  SpeechSynthesizer,
  SpeechSynthesizerCallbacks,
  SpeechSynthesizerOptions,
  SpeechSynthesisVoiceInfo,
} from "./types";
import { isEnglishVoiceLang } from "./voicePrefs";

function pickEnglishVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;
  const prefer = (pred: (v: SpeechSynthesisVoice) => boolean) =>
    voices.find(pred) ?? null;

  return (
    prefer((v) => /^en-US/i.test(v.lang)) ??
    prefer((v) => /^en-GB/i.test(v.lang)) ??
    prefer((v) => isEnglishVoiceLang(v.lang)) ??
    null
  );
}

function resolveVoice(
  voices: SpeechSynthesisVoice[],
  options: SpeechSynthesizerOptions
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  if (options.voiceURI) {
    const byUri = voices.find((v) => v.voiceURI === options.voiceURI);
    if (byUri) return byUri;
  }

  if (options.voiceName) {
    const byNameAndLang = voices.find(
      (v) =>
        v.name === options.voiceName &&
        (!options.lang || v.lang === options.lang)
    );
    if (byNameAndLang) return byNameAndLang;
    const byName = voices.find((v) => v.name === options.voiceName);
    if (byName) return byName;
  }

  if (options.lang) {
    const byLang = voices.find((v) => v.lang === options.lang);
    if (byLang) return byLang;
  }

  return pickEnglishVoice(voices);
}

function applyVoice(
  utterance: SpeechSynthesisUtterance,
  voices: SpeechSynthesisVoice[],
  options: SpeechSynthesizerOptions
) {
  const voice = resolveVoice(voices, options);
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else if (options.lang) {
    utterance.lang = options.lang;
  }
}

function toVoiceInfo(v: SpeechSynthesisVoice): SpeechSynthesisVoiceInfo {
  return {
    name: v.name,
    lang: v.lang,
    default: v.default,
    voiceURI: v.voiceURI,
  };
}

export function createBrowserSpeechSynthesizer(): SpeechSynthesizer {
  return {
    isSupported() {
      return typeof window !== "undefined" && "speechSynthesis" in window;
    },

    getVoices(): SpeechSynthesisVoiceInfo[] {
      if (!this.isSupported()) return [];
      return window.speechSynthesis.getVoices().map(toVoiceInfo);
    },

    speak(
      text: string,
      options: SpeechSynthesizerOptions = {},
      callbacks: SpeechSynthesizerCallbacks = {}
    ) {
      if (!this.isSupported()) {
        callbacks.onError?.("Speech synthesis is not supported in this browser.");
        return;
      }

      const trimmed = text.trim();
      if (!trimmed) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(trimmed);
      utterance.rate = options.rate ?? 1;
      utterance.lang = options.lang ?? "en-US";

      utterance.onstart = () => callbacks.onStart?.();
      utterance.onend = () => callbacks.onEnd?.();
      utterance.onerror = () => {
        callbacks.onError?.("Speech playback failed.");
        callbacks.onEnd?.();
      };

      const speakNow = () => {
        applyVoice(utterance, window.speechSynthesis.getVoices(), options);
        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) {
        const onVoices = () => {
          window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
          speakNow();
        };
        window.speechSynthesis.addEventListener("voiceschanged", onVoices);
        window.setTimeout(() => {
          if (!window.speechSynthesis.speaking) {
            window.speechSynthesis.removeEventListener("voiceschanged", onVoices);
            speakNow();
          }
        }, 250);
        return;
      }

      speakNow();
    },

    stop() {
      if (!this.isSupported()) return;
      window.speechSynthesis.cancel();
    },
  };
}

export function isBrowserSpeechSynthesisSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
