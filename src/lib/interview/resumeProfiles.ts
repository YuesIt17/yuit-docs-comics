import {
  RESUME_MARKDOWN_SOURCES,
  type ResumeMarkdownId,
} from "@/content/me/resumes/sources";
import { parseResumeMarkdown } from "@/lib/interview/parseResumeMarkdown";

export type TargetProfileId = "engineering-manager" | "architecture";

export interface ResumeRoleContext {
  id: TargetProfileId;
  targetRole: string;
  label: string;
  version: string;
  summary: string;
  currentRole: string;
  emphasis: string[];
  evidence: string[];
  positioningLine: string;
}

export const TARGET_PROFILE_IDS: TargetProfileId[] = [
  "engineering-manager",
  "architecture",
];

const PROFILE_META: Record<
  TargetProfileId,
  {
    label: string;
    currentRole: string;
    positioningLine: string;
    emphasis: string[];
    evidence: string[];
  }
> = {
  "engineering-manager": {
    label: "Technical Engineering Manager",
    currentRole: "Engineering Manager",
    positioningLine:
      "Technical Engineering Manager — cross-functional leadership with strong engineering depth.",
    emphasis: [
      "current Engineering Manager role",
      "cross-functional engineering leadership",
      "~15-person team",
      "backend, frontend, QA, automation, analysis",
      "end-to-end technical delivery",
      "architecture involvement",
      "engineering productivity",
      "observability and reliability",
      "AI-assisted SDLC",
    ],
    evidence: [
      "Leads a ~15-person cross-functional engineering team",
      "Owns end-to-end delivery across analysis, architecture, development, testing, release",
      "Stays involved in system/solution architecture and cross-team coordination",
      "Improves productivity through observability and AI-assisted SDLC",
    ],
  },
  architecture: {
    label: "Solution Architect",
    currentRole: "Engineering Manager",
    positioningLine:
      "Engineering Manager with strong Systems / Solution Architecture direction — not formal multi-year SA tenure.",
    emphasis: [
      "systems-oriented engineering background",
      "system and solution architecture",
      "cross-system integrations",
      "REST / Kafka interactions",
      "data flows and technical dependencies",
      "sequence diagrams / interaction models",
      "architecture evolution",
      "observability",
      "coordination with architects and adjacent teams",
      "current EM experience as supporting context",
    ],
    evidence: [
      "Drives system and solution architecture across distributed services",
      "Works on REST/Kafka integrations, service interactions, and data flows",
      "Uses sequence diagrams and system interaction models",
      "Coordinates architecture with adjacent teams while leading a cross-functional team",
    ],
  },
};

function assertVersion(id: TargetProfileId, version: string | undefined) {
  if (version && version !== id) {
    throw new Error(
      `Resume version mismatch for ${id}: frontmatter version="${version}"`
    );
  }
}

export function getResumeRoleContext(id: TargetProfileId): ResumeRoleContext {
  const sourceId = id as ResumeMarkdownId;
  const raw = RESUME_MARKDOWN_SOURCES[sourceId];
  const parsed = parseResumeMarkdown(raw);
  assertVersion(id, parsed.frontmatter.version);

  const meta = PROFILE_META[id];
  return {
    id,
    targetRole: parsed.frontmatter.target ?? meta.label,
    label: meta.label,
    version: parsed.frontmatter.version ?? id,
    summary: parsed.summary || meta.positioningLine,
    currentRole: meta.currentRole,
    emphasis: meta.emphasis,
    evidence: meta.evidence,
    positioningLine: meta.positioningLine,
  };
}

export function listResumeRoleContexts(): ResumeRoleContext[] {
  return TARGET_PROFILE_IDS.map(getResumeRoleContext);
}

export function getTargetProfileLabel(id: TargetProfileId): string {
  return PROFILE_META[id].label;
}

/** Profile-aware recruiter follow-ups (shared bank + role weighting). */
export function getProfileFollowUps(id: TargetProfileId): string[] {
  if (id === "engineering-manager") {
    return [
      "How large is your team?",
      "How do you balance technical work and management?",
      "What does end-to-end delivery look like in your current role?",
      "How do you work across engineering disciplines?",
      "How hands-on are you technically today?",
      "What kind of Engineering Manager role are you looking for next?",
    ];
  }
  return [
    "You're currently an Engineering Manager. Why are you moving toward Solution Architecture?",
    "What architecture responsibilities do you already have today?",
    "Can you give me a high-level example of a cross-system integration you worked on?",
    "How do you use sequence diagrams or system interaction models?",
    "How do you work with architects and adjacent engineering teams?",
    "What kind of architecture role are you looking for next?",
  ];
}

export function pickProfileFollowUp(
  id: TargetProfileId,
  sceneId?: string
): string {
  const list = getProfileFollowUps(id);
  if (sceneId === "scene-01") return list[0];
  if (sceneId === "scene-07") return list[list.length - 1];
  const hash = (sceneId ?? "x")
    .split("")
    .reduce((n, ch) => n + ch.charCodeAt(0), 0);
  return list[hash % list.length];
}

export function buildRolePositioningFeedback(
  id: TargetProfileId,
  userAnswer: string
): string | null {
  const lower = userAnswer.toLowerCase();
  const hasLeadership =
    /team|lead|manage|manager|delivery|cross-functional|people|stakeholders/.test(
      lower
    );
  const hasArchitecture =
    /architect|integration|system|kafka|sequence|dependency|data flow|observability/.test(
      lower
    );

  if (id === "architecture" && hasLeadership && !hasArchitecture) {
    return "Your answer is credible, but it currently sounds mostly like an Engineering Manager answer. Bring forward the architecture work you already do: integrations, sequence diagrams, system interactions, and technical decisions.";
  }

  if (id === "engineering-manager" && hasArchitecture && !hasLeadership) {
    return "Your answer shows strong architecture depth, but the recruiter still needs a clearer picture of your cross-functional leadership, team scope, and delivery responsibility.";
  }

  return null;
}

export function frameStrongB2ForProfile(
  id: TargetProfileId,
  userAnswer: string
): string {
  const trimmed = userAnswer.trim().replace(/\s+/g, " ");
  if (!trimmed) return "";

  let text = trimmed;
  text = text.replace(/\bI responsible\b/gi, "I'm responsible");
  text = text.replace(/\bi'm\b/g, "I'm");
  text = text.replace(/\bi\b/g, "I");
  text = text.replace(/\bbackend frontend QA\b/gi, "backend, frontend, QA");
  text = text.replace(/\bQA and analysts\b/gi, "QA, and analysts");

  if (id === "engineering-manager") {
    if (/manage|lead|team/i.test(text) && /architect/i.test(text)) {
      return capitalize(
        text
          .replace(
            /I manage backend,\s*frontend,\s*QA,\s*and analysts and also work on architecture\.?/i,
            "I lead a cross-functional engineering team across backend, frontend, QA, and analysis, while staying technically involved in architecture and delivery."
          )
          .replace(
            /I manage backend frontend QA and analysts and also work on architecture\.?/i,
            "I lead a cross-functional engineering team across backend, frontend, QA, and analysis, while staying technically involved in architecture and delivery."
          )
      );
    }
  }

  if (id === "architecture") {
    if (/manage|lead|team/i.test(text) && /architect/i.test(text)) {
      return capitalize(
        text
          .replace(
            /I manage backend,\s*frontend,\s*QA,\s*and analysts and also work on architecture\.?/i,
            "I currently lead a cross-functional engineering team, but a significant part of my work also involves system architecture, integrations, and cross-system technical decisions."
          )
          .replace(
            /I manage backend frontend QA and analysts and also work on architecture\.?/i,
            "I currently lead a cross-functional engineering team, but a significant part of my work also involves system architecture, integrations, and cross-system technical decisions."
          )
      );
    }
  }

  if (!/[.!?]$/.test(text)) text += ".";
  return capitalize(text);
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function buildProfileBackgroundSnippet(id: TargetProfileId): string {
  const ctx = getResumeRoleContext(id);
  return [
    `Target profile: ${ctx.label} (${ctx.version})`,
    `Current role: ${ctx.currentRole}`,
    `Positioning: ${ctx.positioningLine}`,
    `Summary: ${ctx.summary}`,
    `Emphasis: ${ctx.emphasis.slice(0, 6).join("; ")}`,
    `Verified evidence cues: ${ctx.evidence.slice(0, 4).join("; ")}`,
    "Do not invent formal Solution Architect title tenure. Do not invent metrics beyond verified context.",
  ].join("\n");
}
