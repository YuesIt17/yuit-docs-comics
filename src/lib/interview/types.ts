export type InterviewPhase =
  | "opening"
  | "background"
  | "current_role"
  | "motivation"
  | "role_fit"
  | "experience"
  | "logistics"
  | "candidate_questions"
  | "closing"
  | "review";

export type InterviewMode = "practice" | "mock";

export interface InterviewTurn {
  topicId: string;
  phase: InterviewPhase;
  sophiaPrompt: string;
  userAnswer?: string;
  answerSource?: "typed" | "voice" | "mock";
  isFollowUp?: boolean;
  answeredAt?: number;
}

export interface InterviewSessionState {
  id: string;
  mode: InterviewMode;
  targetProfileId: "engineering-manager" | "architecture";
  startedAt: string;
  topicIndex: number;
  phase: InterviewPhase;
  turns: InterviewTurn[];
  topicsCovered: string[];
  status: "idle" | "in_progress" | "review" | "complete";
}
