import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  applyLightEnglishFixes,
  groundStaffVersion,
  isInsufficientInterviewAnswer,
  isMeaningfulCorrection,
  sanitizeTraceTransformations,
} from "./answerTransform";

describe("answerTransform", () => {
  it("treats capitalization and final punctuation as cosmetic", () => {
    assert.equal(
      isMeaningfulCorrection("just testing", "Just testing."),
      false
    );
  });

  it("treats a real grammar fix as meaningful", () => {
    const original = "I responsible for architecture decisions.";
    const corrected = applyLightEnglishFixes(original);
    assert.equal(corrected, "I'm responsible for architecture decisions.");
    assert.equal(isMeaningfulCorrection(original, corrected), true);
  });

  it("flags placeholder answers as insufficient", () => {
    assert.equal(isInsufficientInterviewAnswer("just testing"), true);
    assert.equal(isInsufficientInterviewAnswer("test"), true);
    assert.equal(isInsufficientInterviewAnswer("I don't know"), true);
  });

  it("keeps a short but substantive answer", () => {
    assert.equal(
      isInsufficientInterviewAnswer(
        "I responsible for architecture decisions."
      ),
      false
    );
  });

  it("does not invent a career Strong B2 for insufficient content", () => {
    const grounded = groundStaffVersion(
      "just testing",
      "Staff engineer — I make complex systems operable and align teams on priorities."
    );
    assert.equal(grounded.available, false);
    assert.equal(grounded.text, "");
  });

  it("sanitizes mock-style fabricated staff copy", () => {
    const result = sanitizeTraceTransformations(
      {
        naturalVersion: "Just testing.",
        staffVersion:
          "Staff engineer — I make complex systems operable and align teams on priorities.",
        strengths: ["ok"],
        improvements: ["more"],
        score: 44,
        breakdown: {
          clarity: 40,
          structure: 40,
          vocabulary: 40,
          fluency: 40,
          impact: 40,
        },
      },
      "just testing"
    );
    assert.equal(result.evaluationGate, "insufficient_content");
    assert.equal(result.staffVersion, "");
    assert.equal(result.score, 0);
  });
});
