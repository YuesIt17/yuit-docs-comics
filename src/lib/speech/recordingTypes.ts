/**
 * Future-ready types for MediaRecorder-based answer capture.
 * Not wired to UI yet — keep UI decoupled from browser TTS/STT.
 */

export interface AudioRecordingBlob {
  blob: Blob;
  mimeType: string;
  durationMs?: number;
  createdAt: number;
}

export interface RecordingProviderCallbacks {
  onData?: (chunk: Blob) => void;
  onStop?: (recording: AudioRecordingBlob) => void;
  onError?: (message: string) => void;
}

export interface RecordingProvider {
  isSupported(): boolean;
  start(callbacks?: RecordingProviderCallbacks): Promise<void>;
  stop(): Promise<AudioRecordingBlob | null>;
  abort(): void;
}

/** Placeholder for Whisper / server transcription of saved recordings. */
export interface RecordingTranscriptionRequest {
  recording: AudioRecordingBlob;
  language?: string;
}

export interface RecordingTranscriptionResult {
  text: string;
  provider: "browser-stt" | "whisper" | "mock";
}
