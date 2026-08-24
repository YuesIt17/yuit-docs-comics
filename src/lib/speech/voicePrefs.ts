export const PREVIEW_VOICE_SENTENCE =
  "Hi Eugene. Let's start with your interview practice.";

export const SPEECH_RATE_OPTIONS = [0.75, 1, 1.15] as const;

export function isEnglishVoiceLang(lang: string): boolean {
  return /^en([-_]|$)/i.test(lang.trim());
}
