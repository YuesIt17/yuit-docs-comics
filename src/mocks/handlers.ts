import { http, HttpResponse, delay } from "msw";
import { buildMockTraceAnalysis } from "@/lib/trace/mock";

interface TraceAnalyzeBody {
  episodeId?: string;
  sceneId?: string;
  promptContext?: string;
  userAnswer?: string;
  collocations?: string[];
  userBackground?: string;
}

export const handlers = [
  http.post("/api/trace/analyze", async ({ request }) => {
    const body = (await request.json()) as TraceAnalyzeBody;
    const userAnswer = body.userAnswer ?? "";

    if (!userAnswer.trim()) {
      return HttpResponse.json(
        { error: "userAnswer is required" },
        { status: 400 }
      );
    }

    const isSlow = userAnswer.trim().toLowerCase() === "[mock:slow]";
    await delay(isSlow ? 3000 : 600);

    try {
      const analysis = buildMockTraceAnalysis({
        userAnswer,
        sceneId: body.sceneId,
        episodeId: body.episodeId,
        collocations: body.collocations,
        promptContext: body.promptContext,
      });

      return HttpResponse.json(analysis, {
        headers: { "X-Mock-Mode": "msw" },
      });
    } catch (e) {
      return HttpResponse.json(
        {
          error:
            e instanceof Error ? e.message : "Mock analysis failed",
        },
        { status: 500 }
      );
    }
  }),
];
