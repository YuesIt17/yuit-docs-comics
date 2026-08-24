"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { V2PracticeLayout } from "@/components/v2/V2PracticeLayout";
import { V2ConversationExchange } from "@/components/v2/V2ConversationExchange";
import { V2AnswerComposer } from "@/components/v2/V2AnswerComposer";
import { V2TargetProfileSelector } from "@/components/v2/V2TargetProfileSelector";
import { V2ResetSessionControl } from "@/components/v2/V2ResetSessionControl";
import { V2VoiceSettings } from "@/components/v2/V2VoiceSettings";
import { Button } from "@/components/ui/Button";
import {
  buildEndOfInterviewReview,
  getCurrentPrompt,
} from "@/lib/interview/engine";
import { getPersonalContext } from "@/lib/interview/personalContext";
import {
  getTargetProfileLabel,
  type TargetProfileId,
} from "@/lib/interview/resumeProfiles";
import { useInterviewSessionStore } from "@/store/interviewSessionStore";
import { useSettingsStore } from "@/store/settingsStore";
import type { SubmittedAnswer } from "@/lib/v2/answer";

export function V2MockInterviewSession() {
  const { session, startMock, submitAnswer, reset } = useInterviewSessionStore();
  const { targetProfileId, setTargetProfileId } = useSettingsStore();
  const [composerKey, setComposerKey] = useState(0);
  const [sessionProfileId, setSessionProfileId] =
    useState<TargetProfileId>(targetProfileId);
  const ctx = getPersonalContext();

  useEffect(() => {
    startMock(sessionProfileId);
    return () => reset();
    // Start once on mount with current session profile.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restartWithProfile = (id: TargetProfileId) => {
    setTargetProfileId(id);
    setSessionProfileId(id);
    startMock(id);
    setComposerKey((k) => k + 1);
  };

  const handleProfileChange = (next: TargetProfileId) => {
    if (next === sessionProfileId) return;
    const hasProgress = (session?.turns.length ?? 0) > 1;
    if (hasProgress) {
      const ok = window.confirm(
        "Switching target profile starts a new mock interview. Continue?"
      );
      if (!ok) return;
    }
    restartWithProfile(next);
  };

  if (!session) {
    return (
      <V2PracticeLayout title="HR Mock Interview" subtitle="Starting…">
        <p className="px-4 py-8 text-sm text-slate-400">Preparing session…</p>
      </V2PracticeLayout>
    );
  }

  const profileLabel = getTargetProfileLabel(
    session.targetProfileId ?? sessionProfileId
  );

  if (session.status === "review" || session.phase === "review") {
    const review = buildEndOfInterviewReview(session);
    return (
      <V2PracticeLayout
        title={`HR Mock Interview · ${profileLabel}`}
        subtitle="Trace · Interview Review"
        actions={
          <>
            <V2VoiceSettings />
          </>
        }
      >
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-accent-cyan">
              Trace — Interview Review
            </p>
            <h2 className="text-2xl font-bold text-white mt-1">
              Overall: {review.overall} / 10
            </h2>
          </div>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-emerald-400">
              Strong
            </h3>
            <ul className="text-sm text-slate-300 space-y-1">
              {review.strong.map((s) => (
                <li key={s}>+ {s}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-amber-400">
              Improve
            </h3>
            <ul className="text-sm text-slate-300 space-y-1">
              {review.improve.map((s) => (
                <li key={s}>→ {s}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-2">
            <h3 className="text-xs font-semibold uppercase text-slate-400">
              English patterns
            </h3>
            <ul className="text-sm text-slate-300 space-y-1">
              {review.englishPatterns.map((s) => (
                <li key={s}>· {s}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-panel-border bg-panel/30 p-4">
            <p className="text-xs uppercase text-slate-500 mb-1">
              Interview readiness
            </p>
            <p className="text-sm text-slate-200">{review.readiness}</p>
          </section>

          <p className="text-[11px] text-slate-600">
            Trace stayed silent during the screen. Personal facts come from
            verified content/me only — demo fixtures are not personal history.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => restartWithProfile(sessionProfileId)}
            >
              Run mock again
            </Button>
            <Link href="/v2/practice/hr">
              <Button variant="secondary">Practice Mode (with Trace)</Button>
            </Link>
            <Link href="/v2">
              <Button variant="ghost">Home</Button>
            </Link>
          </div>
        </div>
      </V2PracticeLayout>
    );
  }

  const prompt = getCurrentPrompt(session);
  const currentTurn = session.turns[session.turns.length - 1];
  const phaseLabel = session.phase.replace(/_/g, " ");

  const handleSubmit = (answer: SubmittedAnswer) => {
    submitAnswer(answer.text, answer.source);
    setComposerKey((k) => k + 1);
  };

  const handleSkip = () => {
    submitAnswer("(skipped)", "typed");
    setComposerKey((k) => k + 1);
  };

  return (
    <V2PracticeLayout
      title={`HR Mock Interview · ${profileLabel}`}
      subtitle={`Recruiter screen · ${phaseLabel}`}
      actions={
        <>
          <V2TargetProfileSelector
            value={sessionProfileId}
            onChange={handleProfileChange}
          />
          <V2VoiceSettings />
          <V2ResetSessionControl
            onConfirmReset={() => restartWithProfile(sessionProfileId)}
          />
        </>
      }
    >
      <div className="max-w-3xl mx-auto px-4 pt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
        <span className="rounded-full border border-panel-border px-2 py-0.5">
          Simulation — Trace silent until the end
        </span>
        <span className="rounded-full border border-panel-border px-2 py-0.5">
          Topics covered: {session.topicsCovered.length}
        </span>
      </div>

      <V2ConversationExchange
        questionText={prompt}
        protagonistName={ctx.preferredName}
        submittedAnswerText={null}
      />

      <V2AnswerComposer
        key={`${currentTurn?.topicId ?? "t"}-${composerKey}-${session.turns.length}-${sessionProfileId}`}
        sceneId={currentTurn?.topicId ?? "mock"}
        hints={[]}
        starEnabled={session.phase === "experience"}
        questionText={prompt}
        traceContext={session.phase}
        isSubmitting={false}
        onSubmit={handleSubmit}
        onSkip={handleSkip}
        showCompressionToggle={false}
      />
    </V2PracticeLayout>
  );
}
