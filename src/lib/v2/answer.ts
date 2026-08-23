export type AnswerSource = "typed" | "voice" | "mock";

export interface SubmittedAnswer {
  text: string;
  source: AnswerSource;
}
