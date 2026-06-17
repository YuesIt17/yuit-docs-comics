import { z } from "zod";

export const PositionSchema = z.object({
  x: z.string(),
  y: z.string(),
  scale: z.number(),
  zIndex: z.number().optional(),
});

export const LayerSchema = z.object({
  characterId: z.string(),
  pose: z.string(),
  position: PositionSchema,
  flip: z.boolean().optional(),
});

export const DialogueLineSchema = z.object({
  speakerId: z.string(),
  text: z.string(),
  emotion: z.string().optional(),
});

export const InteractionSchema = z.object({
  type: z.literal("user_response"),
  prompt: z.string(),
  hints: z.array(z.string()),
  requiredCollocations: z.array(z.string()),
  traceContext: z.string(),
  starEnabled: z.boolean(),
  practice432Enabled: z.boolean(),
  advanceCondition: z.literal("analysis_submitted"),
});

export const SceneSchema = z.object({
  id: z.string(),
  index: z.number(),
  background: z.string(),
  music: z.string().nullable(),
  layers: z.array(LayerSchema),
  dialogue: z.array(DialogueLineSchema),
  interaction: InteractionSchema,
  uncleEugeneTip: z.string().optional(),
});

export const EpisodeSchema = z.object({
  id: z.string(),
  version: z.string(),
  path: z.string(),
  title: z.string(),
  subtitle: z.string(),
  difficulty: z.string(),
  meta: z.object({
    durationMinutes: z.number(),
    sceneCount: z.number(),
    tags: z.array(z.string()),
  }),
  characters: z.array(z.string()),
  collocationPackId: z.string(),
  scenes: z.array(SceneSchema),
  completion: z.object({
    title: z.string(),
    summaryTemplate: z.string(),
    rewardLabel: z.string(),
  }),
});

export type Position = z.infer<typeof PositionSchema>;
export type Layer = z.infer<typeof LayerSchema>;
export type DialogueLine = z.infer<typeof DialogueLineSchema>;
export type Interaction = z.infer<typeof InteractionSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type Episode = z.infer<typeof EpisodeSchema>;

export interface Character {
  id: string;
  name: string;
  title: string;
  role: string;
  bio?: string;
  traits: string[];
  poses?: string[];
  voiceStyle?: string;
  appearsIn?: string[];
  spritePath: string;
  color?: string;
  configurable?: boolean;
  defaultAvatarKey?: string;
  avatarOptions?: string[];
}

export interface CollocationItem {
  phrase: string;
  meaning: string;
  visualMetaphor: string;
  examples: string[];
}

export interface CollocationPack {
  id: string;
  title: string;
  items: CollocationItem[];
}

export interface TraceBreakdown {
  clarity: number;
  structure: number;
  vocabulary: number;
  fluency: number;
  impact: number;
}

export interface CompressionLevels {
  basic: string;
  natural: string;
  staff: string;
}

export interface TraceAnalysis {
  score: number;
  breakdown: TraceBreakdown;
  strengths: string[];
  improvements: string[];
  naturalVersion: string;
  staffVersion: string;
  detectedCollocations: string[];
  compressionLevels?: CompressionLevels;
  feedback?: string;
  recruiterFollowUp?: string;
}

export interface TraceAnalyzeRequest {
  episodeId: string;
  sceneId: string;
  promptContext: string;
  userAnswer: string;
  targetLevel?: "natural" | "staff";
  collocations?: string[];
  userBackground?: string;
}

export interface DialogueEntry {
  speakerId: string;
  speakerName: string;
  text: string;
  timestamp: number;
  isUser?: boolean;
}

export interface Round432Data {
  round: 1 | 2 | 3;
  durationMinutes: number;
  answer: string;
  completedAt?: number;
}

export interface SceneProgress {
  sceneId: string;
  submitted: boolean;
  bestAnswer?: string;
  bestStaffVersion?: string;
  score?: number;
  rounds432?: Round432Data[];
}

export interface EpisodeProgress {
  episodeId: string;
  currentSceneIndex: number;
  completedScenes: string[];
  sceneProgress: Record<string, SceneProgress>;
  notes: string;
  completedAt?: number;
}
