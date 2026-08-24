import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { loadEpisode } from "@/lib/episode-engine/loadEpisode";
import { resolvePlaceholders } from "@/lib/episode-engine/sceneResolver";
import { createMockInterviewSession } from "@/lib/interview/engine";
import { parseResumeMarkdown } from "@/lib/interview/parseResumeMarkdown";
import {
  buildRolePositioningFeedback,
  frameStrongB2ForProfile,
  getResumeRoleContext,
} from "@/lib/interview/resumeProfiles";

describe("resume markdown parsing", () => {
  it("parses engineering-manager frontmatter and summary", () => {
    const raw = readFileSync(
      join(process.cwd(), "src/content/me/resumes/engineering-manager.md"),
      "utf8"
    );
    const parsed = parseResumeMarkdown(raw);
    assert.equal(parsed.frontmatter.version, "engineering-manager");
    assert.equal(parsed.frontmatter.target, "Engineering Manager");
    assert.match(parsed.summary, /Technical Engineering Manager/i);
  });

  it("parses architecture frontmatter and summary", () => {
    const raw = readFileSync(
      join(process.cwd(), "src/content/me/resumes/architecture.md"),
      "utf8"
    );
    const parsed = parseResumeMarkdown(raw);
    assert.equal(parsed.frontmatter.version, "architecture");
    assert.equal(parsed.frontmatter.target, "Solution Architect");
    assert.match(parsed.summary, /Solution Architecture/i);
  });
});

describe("resume role context", () => {
  it("loads both role profiles without inventing SA tenure", () => {
    const em = getResumeRoleContext("engineering-manager");
    const sa = getResumeRoleContext("architecture");
    assert.equal(em.version, "engineering-manager");
    assert.equal(sa.version, "architecture");
    assert.match(sa.positioningLine, /not formal multi-year SA tenure/i);
  });

  it("frames Strong B2 differently by profile from the same facts", () => {
    const answer =
      "I manage backend frontend QA and analysts and also work on architecture.";
    const em = frameStrongB2ForProfile("engineering-manager", answer);
    const sa = frameStrongB2ForProfile("architecture", answer);
    assert.match(em, /cross-functional engineering team/i);
    assert.match(em, /architecture and delivery/i);
    assert.match(sa, /system architecture/i);
    assert.match(sa, /integrations/i);
    assert.notEqual(em, sa);
  });

  it("flags architecture positioning gaps for EM-only answers", () => {
    const feedback = buildRolePositioningFeedback(
      "architecture",
      "I manage people and run delivery for my team every week."
    );
    assert.ok(feedback);
    assert.match(feedback!, /architecture work/i);
  });
});

describe("HR session first question", () => {
  it("scene-01 opens with Tell me about yourself", () => {
    const episode = loadEpisode("hr-intro");
    const scene = episode.scenes[0];
    assert.equal(scene.id, "scene-01");
    const npc = scene.dialogue.filter((l) => l.speakerId !== "protagonist");
    const text = resolvePlaceholders(npc[0].text, {
      protagonistName: "Eugene",
    });
    assert.match(text, /tell me about yourself/i);
    assert.doesNotMatch(text, /Interesting\. What impact/i);
  });

  it("mock interview session stores target profile and starts at opening", () => {
    const session = createMockInterviewSession("architecture");
    assert.equal(session.targetProfileId, "architecture");
    assert.equal(session.topicIndex, 0);
    assert.equal(session.turns[0]?.topicId, "opening");
  });
});
