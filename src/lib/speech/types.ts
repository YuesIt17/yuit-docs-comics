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
