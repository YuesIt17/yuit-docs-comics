import { z } from "zod";
import type { TraceAnalysis } from "@/lib/episode-engine/types";

const TraceBreakdownSchema = z.object({
  clarity: z.number(),
  structure: z.number(),
  vocabulary: z.number(),
  fluency: z.number(),
  impact: z.number(),
});

export const TraceAnalysisSchema = z.object({
  score: z.number(),
  breakdown: TraceBreakdownSchema,
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  naturalVersion: z.string(),
  staffVersion: z.string(),
  detectedCollocations: z.array(z.string()),
  compressionLevels: z
    .object({
      basic: z.string(),
      natural: z.string(),
      staff: z.string(),
    })
    .optional(),
  feedback: z.string().optional(),
  recruiterFollowUp: z.string().optional(),
});

export function parseTraceResponse(data: unknown): TraceAnalysis {
  return TraceAnalysisSchema.parse(data);
}
