const PLACEHOLDER_PATTERNS: RegExp[] = [
  /^(just\s+)?test(ing)?[.!?]*$/i,
  /^i don'?t know[.!?]*$/i,
  /^idk[.!?]*$/i,
  /^lorem ipsum/i,
  /^(asdf+|qwerty|foo(\s+bar)?|bar|aaa+|xxx+|n\/?a)[.!?]*$/i,
  /^(hello|hi|hey)[.!?]*$/i,
];

const SUBSTANCE_RE =
  /\b(lead|led|manage|manager|responsible|architect|architecture|engineer|engineering|team|role|scope|built|design|designed|platform|system|systems|work|worked|experience|integrat|backend|frontend|qa|analyst)/i;

export type EvaluationGate = "ok" | "insufficient_content";

export function normalizeAnswerForComparison(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.!?…]+$/g, "")
    .toLowerCase();
}

export function isMeaningfulCorrection(
  original: string,
  corrected: string
): boolean {
  if (!corrected.trim()) return false;
  return (
    normalizeAnswerForComparison(original) !==
    normalizeAnswerForComparison(corrected)
  );
}

export function isInsufficientInterviewAnswer(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return true;

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (PLACEHOLDER_PATTERNS.some((re) => re.test(trimmed))) return true;
  if (words.length <= 2) return true;
  if (words.length < 8 && !SUBSTANCE_RE.test(trimmed)) return true;
  return false;
}

export function applyLightEnglishFixes(text: string): string {
  let t = text.trim().replace(/\s+/g, " ");
  if (!t) return t;

  t = t.replace(/\bI responsible\b/gi, "I'm responsible");
  t = t.replace(/\bi'm\b/g, "I'm");
  t = t.replace(/\bi\b/g, "I");
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (!/[.!?]$/.test(t)) t += ".";
  return t;
}

export function improveGroundedB2(text: string): string {
  let t = applyLightEnglishFixes(text);
  t = t.replace(/\bbackend frontend QA\b/gi, "backend, frontend, QA");
  t = t.replace(/\bQA and analysts\b/gi, "QA, and analysts");
  t = t.replace(/,\s*,/g, ",");
  return t;
}

export const INSUFFICIENT_FEEDBACK =
  "I don't have enough information to improve this into an interview-ready answer yet.";

export const INSUFFICIENT_HR_PROMPT =
  "Start with your current role and one sentence about your scope.";

export const STRONG_B2_UNAVAILABLE =
  "More context is needed before I can create an interview-ready version.";

function introducesUnsupportedClaims(
  source: string,
  candidate: string
): boolean {
  if (!candidate.trim()) return false;
  const src = source.toLowerCase();
  const cand = candidate.toLowerCase();

  const metricRe = /(\d+%|\d+\s*(users|teams|engineers|requests|ms|rps))/gi;
  const sourceMetrics = source.match(metricRe) ?? [];
  const candidateMetrics = candidate.match(metricRe) ?? [];
  if (
    candidateMetrics.some(
      (m) => !sourceMetrics.some((s) => s.toLowerCase() === m.toLowerCase())
    )
  ) {
    return true;
  }

  if (
    /\bstaff engineer\b/.test(cand) &&
    !/\bstaff\b/.test(src) &&
    !/\bengineer\b/.test(src)
  ) {
    return true;
  }

  if (
    /\b(2m users|40%|operable and align teams on priorities)\b/i.test(candidate)
  ) {
    if (!/2m|40%|operable/i.test(source)) return true;
  }

  return false;
}

export function groundStaffVersion(
  userAnswer: string,
  candidate: string
): { text: string; available: boolean } {
  if (isInsufficientInterviewAnswer(userAnswer)) {
    return { text: "", available: false };
  }

  const trimmed = candidate.trim();
  if (!trimmed || introducesUnsupportedClaims(userAnswer, trimmed)) {
    return { text: improveGroundedB2(userAnswer), available: true };
  }

  return { text: trimmed, available: true };
}

export interface SanitizedTraceFields {
  evaluationGate: EvaluationGate;
  naturalVersion: string;
  staffVersion: string;
  feedback?: string;
  strengths: string[];
  improvements: string[];
  score: number;
  breakdown: {
    clarity: number;
    structure: number;
    vocabulary: number;
    fluency: number;
    impact: number;
  };
}

export function sanitizeTraceTransformations<
  T extends {
    naturalVersion: string;
    staffVersion: string;
    feedback?: string;
    strengths: string[];
    improvements: string[];
    score: number;
    breakdown: SanitizedTraceFields["breakdown"];
  },
>(analysis: T, userAnswer: string): T & { evaluationGate: EvaluationGate } {
  const insufficient = isInsufficientInterviewAnswer(userAnswer);
  const naturalVersion = analysis.naturalVersion?.trim()
    ? analysis.naturalVersion
    : applyLightEnglishFixes(userAnswer);

  if (insufficient) {
    return {
      ...analysis,
      evaluationGate: "insufficient_content",
      naturalVersion,
      staffVersion: "",
      feedback: INSUFFICIENT_FEEDBACK,
      strengths: [],
      improvements: [INSUFFICIENT_HR_PROMPT],
      score: 0,
      breakdown: {
        clarity: 0,
        structure: 0,
        vocabulary: 0,
        fluency: 0,
        impact: 0,
      },
    };
  }

  const grounded = groundStaffVersion(userAnswer, analysis.staffVersion);
  return {
    ...analysis,
    evaluationGate: "ok",
    naturalVersion,
    staffVersion: grounded.text,
  };
}
