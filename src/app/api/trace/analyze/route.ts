import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import {
  TRACE_SYSTEM_PROMPT,
  buildTraceUserPrompt,
} from "@/lib/trace/prompts";
import { buildMockTraceAnalysis } from "@/lib/trace/mock";
import { sanitizeTraceTransformations } from "@/lib/trace/answerTransform";
import { parseTraceResponse } from "@/lib/trace/parseTraceResponse";
import { buildProfileBackgroundSnippet } from "@/lib/interview/resumeProfiles";

const RequestSchema = z.object({
  episodeId: z.string(),
  sceneId: z.string(),
  promptContext: z.string(),
  userAnswer: z.string().min(1),
  targetLevel: z.enum(["natural", "staff"]).optional(),
  collocations: z.array(z.string()).optional(),
  userBackground: z.string().optional(),
  targetProfileId: z
    .enum(["engineering-manager", "architecture"])
    .optional(),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const cache = new Map<string, ReturnType<typeof parseTraceResponse>>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 3600000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

function hashAnswer(
  sceneId: string,
  answer: string,
  targetProfileId?: string
): string {
  return `${sceneId}:${targetProfileId ?? "default"}:${answer.slice(0, 200)}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RequestSchema.parse(body);

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }

    const cacheKey = hashAnswer(
      parsed.sceneId,
      parsed.userAnswer,
      parsed.targetProfileId
    );
    const cached = cache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const forceMock =
      process.env.TRACE_USE_MOCK === "true" ||
      process.env.NEXT_PUBLIC_API_MOCKING === "enabled";

    const targetProfileId = parsed.targetProfileId ?? "engineering-manager";
    const targetProfileContext =
      buildProfileBackgroundSnippet(targetProfileId);

    if (!apiKey || forceMock) {
      const mock = buildMockTraceAnalysis({
        userAnswer: parsed.userAnswer,
        sceneId: parsed.sceneId,
        episodeId: parsed.episodeId,
        collocations: parsed.collocations,
        promptContext: parsed.promptContext,
        targetProfileId,
      });
      cache.set(cacheKey, mock);
      return NextResponse.json(mock);
    }

    const openai = new OpenAI({ apiKey });

    const userPrompt = buildTraceUserPrompt({
      promptContext: parsed.promptContext,
      userAnswer: parsed.userAnswer,
      collocations: parsed.collocations,
      userBackground: parsed.userBackground,
      targetProfileContext,
    });

    let analysis;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: TRACE_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) throw new Error("Empty response from OpenAI");

      analysis = sanitizeTraceTransformations(
        parseTraceResponse(JSON.parse(content)),
        parsed.userAnswer
      );
    } catch {
      const repairCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: TRACE_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
          {
            role: "user",
            content:
              "Your previous response was invalid JSON. Return ONLY valid JSON matching the required schema.",
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const repairContent = repairCompletion.choices[0]?.message?.content;
      if (!repairContent) throw new Error("Repair attempt failed");
      analysis = sanitizeTraceTransformations(
        parseTraceResponse(JSON.parse(repairContent)),
        parsed.userAnswer
      );
    }

    cache.set(cacheKey, analysis);
    return NextResponse.json(analysis);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: e.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        error:
          e instanceof Error ? e.message : "Analysis failed. Please retry.",
      },
      { status: 500 }
    );
  }
}
