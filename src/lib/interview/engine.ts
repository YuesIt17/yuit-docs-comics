import { getHrCoreTopics } from "@/lib/content";
import {
  getProfileFollowUps,
  type TargetProfileId,
} from "@/lib/interview/resumeProfiles";
import type {
  InterviewPhase,
  InterviewSessionState,
  InterviewTurn,
} from "./types";

const SHORT_ANSWER_WORDS = 12;

export function createMockInterviewSession(
  targetProfileId: TargetProfileId = "engineering-manager"
): InterviewSessionState {
  const topics = getHrCoreTopics();
  const first = topics[0];
  return {
    id: `mock-${Date.now()}`,
    mode: "mock",
    targetProfileId,
    startedAt: new Date().toISOString(),
    topicIndex: 0,
    phase: (first?.phase as InterviewPhase) ?? "opening",
    turns: first
      ? [
          {
            topicId: first.id,
            phase: first.phase as InterviewPhase,
            sophiaPrompt: first.sophiaPrompt,
          },
        ]
      : [],
    topicsCovered: [],
    status: "in_progress",
  };
}

export function getCurrentPrompt(session: InterviewSessionState): string {
  const last = session.turns[session.turns.length - 1];
  return last?.sophiaPrompt ?? "";
}

export function shouldOfferShortFollowUp(answer: string): boolean {
  const words = answer.trim().split(/\s+/).filter(Boolean);
  return words.length > 0 && words.length < SHORT_ANSWER_WORDS;
}

export function buildShortFollowUp(
  phase: InterviewPhase,
  targetProfileId: TargetProfileId = "engineering-manager"
): string {
  const profileFollowUps = getProfileFollowUps(targetProfileId);
  switch (phase) {
    case "background":
      return profileFollowUps[0] ?? "Could you say a bit more about your current scope and team?";
    case "motivation":
      return (
        profileFollowUps[profileFollowUps.length - 1] ??
        "What specifically attracts you to this direction right now?"
      );
    case "current_role":
      return (
        profileFollowUps[1] ??
        "What does day-to-day ownership look like in that role?"
      );
    case "experience":
      return "What was your personal ownership in that example?";
    default:
      return "Could you expand on that with one concrete detail?";
  }
}

export function recordAnswer(
  session: InterviewSessionState,
  answer: string,
  source: "typed" | "voice" | "mock"
): InterviewSessionState {
  const turns = [...session.turns];
  const lastIdx = turns.length - 1;
  if (lastIdx < 0) return session;

  const last = { ...turns[lastIdx], userAnswer: answer, answerSource: source, answeredAt: Date.now() };
  turns[lastIdx] = last;

  const topicsCovered = last.isFollowUp
    ? session.topicsCovered
    : session.topicsCovered.includes(last.topicId)
      ? session.topicsCovered
      : [...session.topicsCovered, last.topicId];

  return { ...session, turns, topicsCovered };
}

export function advanceOrFollowUp(
  session: InterviewSessionState,
  answeredText: string
): InterviewSessionState {
  const topics = getHrCoreTopics();
  const current = session.turns[session.turns.length - 1];
  if (!current) return session;

  // One short follow-up max per primary topic
  if (
    !current.isFollowUp &&
    shouldOfferShortFollowUp(answeredText) &&
    current.phase !== "opening" &&
    current.phase !== "closing" &&
    current.phase !== "candidate_questions"
  ) {
    const followUp: InterviewTurn = {
      topicId: current.topicId,
      phase: current.phase,
      sophiaPrompt: buildShortFollowUp(current.phase, session.targetProfileId),
      isFollowUp: true,
    };
    return {
      ...session,
      turns: [...session.turns, followUp],
      phase: current.phase,
    };
  }

  const nextIndex = session.topicIndex + 1;
  if (nextIndex >= topics.length) {
    return {
      ...session,
      topicIndex: nextIndex,
      phase: "review",
      status: "review",
    };
  }

  const next = topics[nextIndex];
  const turn: InterviewTurn = {
    topicId: next.id,
    phase: next.phase as InterviewPhase,
    sophiaPrompt: next.sophiaPrompt,
  };

  return {
    ...session,
    topicIndex: nextIndex,
    phase: next.phase as InterviewPhase,
    turns: [...session.turns, turn],
  };
}

export function buildEndOfInterviewReview(session: InterviewSessionState): {
  overall: number;
  strong: string[];
  improve: string[];
  englishPatterns: string[];
  readiness: string;
} {
  const answers = session.turns
    .filter((t) => t.userAnswer?.trim())
    .map((t) => t.userAnswer!.trim());

  const avgLen =
    answers.reduce((sum, a) => sum + a.split(/\s+/).length, 0) /
    Math.max(answers.length, 1);

  let overall = 6;
  if (avgLen >= 40) overall = 8;
  else if (avgLen >= 20) overall = 7;
  else if (avgLen < 10) overall = 5;

  const strong: string[] = [];
  const improve: string[] = [];

  if (answers.length >= 5) strong.push("You stayed engaged across the full screen.");
  if (avgLen >= 25) strong.push("Several answers had enough substance for a recruiter.");
  if (avgLen < 20) improve.push("Add one concrete example or metric from verified experience.");
  if (session.turns.some((t) => t.isFollowUp)) {
    improve.push("Watch short answers — recruiters often probe ownership and evidence.");
  } else {
    strong.push("Answers were generally complete enough to avoid extra probes.");
  }

  const englishPatterns: string[] = [
    "Prefer complete sentences over fragments under pressure.",
    "Lead with the point, then give one example.",
  ];

  const readiness =
    overall >= 8
      ? "Ready for fuller mock screens with unexpected follow-ups."
      : overall >= 6
        ? "Solid base — practice motivation and ownership stories next."
        : "Focus on longer spoken answers in Practice Mode before another mock.";

  return { overall, strong, improve, englishPatterns, readiness };
}
