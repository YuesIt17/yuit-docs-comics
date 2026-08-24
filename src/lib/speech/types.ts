export type SpeechTranscriberErrorCode =
  | "unsupported"
  | "permission-denied"
  | "no-speech"
  | "network"
  | "aborted"
  | "unknown";

export interface SpeechTranscriberError {
  code: SpeechTranscriberErrorCode;
  message: string;
}

export interface SpeechTranscriberCallbacks {
  onFinal: (text: string) => void;
  onInterim: (text: string) => void;
  onError: (error: SpeechTranscriberError) => void;
  onEnd: () => void;
}

export interface SpeechTranscriber {
  isSupported(): boolean;
  start(callbacks: SpeechTranscriberCallbacks): void;
  stop(): void;
  abort(): void;
}

export interface SpeechSynthesizerOptions {
  rate?: number;
  lang?: string;
  voiceURI?: string;
  voiceName?: string;
}

export interface SpeechSynthesizerCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (message: string) => void;
}

export interface SpeechSynthesizer {
  isSupported(): boolean;
  speak(
    text: string,
    options?: SpeechSynthesizerOptions,
    callbacks?: SpeechSynthesizerCallbacks
  ): void;
  stop(): void;
  getVoices(): SpeechSynthesisVoiceInfo[];
}

export interface SpeechSynthesisVoiceInfo {
  name: string;
  lang: string;
  default: boolean;
  voiceURI: string;
}
