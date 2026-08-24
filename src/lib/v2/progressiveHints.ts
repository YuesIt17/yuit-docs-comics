import { getMyStories, type MyStory } from "@/lib/content";

export interface ProgressiveHintInput {
  starEnabled: boolean;
  hints: string[];
  questionText: string;
  traceContext: string;
}

export interface ProgressiveHintLevel {
  level: 1 | 2 | 3;
  label: string;
  text: string;
}

const OPENERS = [
  "One example that comes to mind is…",
  "In a recent situation, I…",
  "What helped most was…",
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function matchStory(
  questionText: string,
  traceContext: string,
  stories: MyStory[]
): MyStory | null {
  const haystack = new Set([
    ...tokenize(questionText),
    ...tokenize(traceContext),
  ]);
  if (haystack.size === 0) return null;

  let best: { story: MyStory; score: number } | null = null;
  for (const story of stories) {
    let score = 0;
    for (const tag of story.tags) {
      const parts = tokenize(tag);
      for (const part of parts) {
        if (haystack.has(part)) score += 1;
      }
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { story, score };
    }
  }
  return best?.story ?? null;
}

export function buildProgressiveHints(
  input: ProgressiveHintInput
): ProgressiveHintLevel[] {
  const levels: ProgressiveHintLevel[] = [];

  levels.push({
    level: 1,
    label: "Structure",
    text: input.starEnabled
      ? "Think: situation → your action → result."
      : "Lead with the point, then give one concrete example.",
  });

  const phraseSource = input.hints[0]?.trim() || OPENERS[0];
  const phraseText = phraseSource.toLowerCase().startsWith("try")
    ? phraseSource
    : `Try: “${phraseSource}”`;

  levels.push({
    level: 2,
    label: "Useful phrase",
    text: phraseText,
  });

  const story = matchStory(
    input.questionText,
    input.traceContext,
    getMyStories()
  );
  if (story) {
    levels.push({
      level: 3,
      label: "Personal story cue",
      text: story.cue ?? "Use a verified story from your experience — without inventing metrics.",
    });
  }

  return levels;
}
