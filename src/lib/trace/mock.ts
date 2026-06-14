import type { TraceAnalysis } from "@/lib/episode-engine/types";
import {
  fixtureToTraceAnalysis,
  resolveHrDialogFixture,
} from "@/mocks/fixtures/hr-dialogs";

export interface MockAnalyzeInput {
  userAnswer: string;
  sceneId?: string;
  episodeId?: string;
  collocations?: string[];
  promptContext?: string;
}

const SCENE_FEEDBACK: Record<string, string> = {
  "scene-01":
    "Good start! State your level, domain, and one impact hook in the first 30 seconds.",
  "scene-02":
    "Add concrete scale signals — teams, traffic, or infrastructure size.",
  "scene-03":
    "Connect your technical work to a business or org outcome with numbers.",
  "scene-04":
    "Use STAR structure: situation, constraint, your action, measurable result.",
  "scene-05":
    "Show accountability and what changed after the failure — avoid blame.",
  "scene-06":
    "Demonstrate influence across teams without relying on authority.",
  "scene-07":
    "Link your strengths to this company's mission authentically.",
  "scene-08":
    "This is your closing argument — compress level, domain, impact, and intent.",
};

function detectCollocations(answer: string, collocations: string[]): string[] {
  const lower = answer.toLowerCase();
  return collocations.filter((c) => lower.includes(c.toLowerCase()));
}

function scoreAnswer(answer: string, detectedCount: number, totalTargets: number): number {
  const words = answer.trim().split(/\s+/).length;
  let score = 50;

  if (words >= 20) score += 10;
  if (words >= 40) score += 8;
  if (words >= 60) score += 5;
  if (words < 10) score -= 20;

  if (detectedCount > 0) score += detectedCount * 6;
  if (totalTargets > 0 && detectedCount >= totalTargets) score += 10;

  if (/(\d+%|\d+\s*(users|teams|requests|ms|rps|engineers))/i.test(answer)) {
    score += 12;
  }

  if (/\b(i|we)\b/i.test(answer) && /\b(built|led|designed|improved|reduced|scaled)\b/i.test(answer)) {
    score += 8;
  }

  return Math.max(35, Math.min(95, score));
}

function buildBreakdown(score: number): TraceAnalysis["breakdown"] {
  const variance = () => Math.round((Math.random() - 0.5) * 10);
  return {
    clarity: Math.min(100, Math.max(40, score + variance())),
    structure: Math.min(100, Math.max(40, score - 3 + variance())),
    vocabulary: Math.min(100, Math.max(40, score - 5 + variance())),
    fluency: Math.min(100, Math.max(40, score - 2 + variance())),
    impact: Math.min(100, Math.max(35, score - 8 + variance())),
  };
}

/** Shared mock used by MSW handlers and the API route fallback. */
export function buildMockTraceAnalysis(input: MockAnalyzeInput): TraceAnalysis {
  const {
    userAnswer,
    sceneId = "scene-01",
    collocations = [],
  } = input;

  if (userAnswer.trim().toLowerCase() === "[mock:error]") {
    throw new Error("Mock error scenario triggered");
  }

  const fixture = resolveHrDialogFixture(userAnswer, sceneId);
  if (fixture) {
    return fixtureToTraceAnalysis(fixture);
  }

  const detected = detectCollocations(userAnswer, collocations);
  const score = scoreAnswer(userAnswer, detected.length, collocations.length);
  const breakdown = buildBreakdown(score);

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (userAnswer.split(/\s+/).length >= 25) {
    strengths.push("Good answer length and detail");
  } else {
    improvements.push("Expand with more context and examples");
  }

  if (detected.length > 0) {
    strengths.push(`Used key collocations: ${detected.join(", ")}`);
  } else if (collocations.length > 0) {
    improvements.push(`Try using: ${collocations.slice(0, 2).join(", ")}`);
  }

  if (/\d/.test(userAnswer)) {
    strengths.push("Includes measurable signals");
  } else {
    improvements.push("Add scale or measurable impact");
  }

  if (score >= 75) {
    strengths.push("Confident professional tone");
  } else {
    improvements.push("Use more staff-level compression");
  }

  const feedback =
    SCENE_FEEDBACK[sceneId] ??
    "Good effort. Focus on clarity, impact, and natural engineering phrasing.";

  return {
    score,
    breakdown,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    feedback,
    naturalVersion: polishNatural(userAnswer),
    staffVersion: compressStaff(userAnswer, detected),
    detectedCollocations: detected.length > 0 ? detected : collocations.slice(0, 2),
    compressionLevels: {
      basic: userAnswer.trim() || "I am a software engineer with backend experience.",
      natural: polishNatural(userAnswer),
      staff: compressStaff(userAnswer, detected),
    },
  };
}

function polishNatural(answer: string): string {
  const trimmed = answer.trim();
  if (!trimmed) {
    return "I'm a Staff Software Engineer focused on building distributed systems and internal platforms.";
  }
  if (trimmed.length > 200) return trimmed.slice(0, 200) + "...";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

function compressStaff(answer: string, collocations: string[]): string {
  const hasPlatform = /platform|internal|infra/i.test(answer);
  const hasScale = /scale|distributed|throughput/i.test(answer);
  const collocationHint = collocations[0] ?? "operational impact";

  if (hasPlatform && hasScale) {
    return `Platform engineer — I improve ${collocationHint} and scalability under peak load.`;
  }
  if (hasPlatform) {
    return "Staff engineer building internal platforms with measurable team impact.";
  }
  return "Staff engineer — I make complex systems operable and align teams on priorities.";
}
