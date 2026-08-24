/**
 * Personal grounding for V2.1+.
 * Never invent biography/metrics — only verified content/me files.
 */

import {
  getMeCareer,
  getMeProfile,
  getMyStories,
  getRecruiterSafeClaims,
} from "@/lib/content";

export interface PersonalContext {
  preferredName: string;
  positioning: string;
  currentRoleTitle: string;
  teamSize: number;
  product: string;
  scaleNote: string;
  targetRoles: string[];
  safeClaims: string[];
  storyCuesAvailable: number;
}

export function getPersonalContext(): PersonalContext {
  const profile = getMeProfile();
  const career = getMeCareer() as {
    currentRole?: {
      title?: string;
      teamSize?: number;
      product?: string;
      scale?: { dailyActiveUsers?: string };
    };
  };

  return {
    preferredName: profile.preferredName,
    positioning: profile.positioning,
    currentRoleTitle: career.currentRole?.title ?? "Engineering Manager",
    teamSize: career.currentRole?.teamSize ?? 0,
    product: career.currentRole?.product ?? "",
    scaleNote: career.currentRole?.scale?.dailyActiveUsers ?? "",
    targetRoles: profile.targetRoles,
    safeClaims: getRecruiterSafeClaims(),
    storyCuesAvailable: getMyStories().length,
  };
}

export function buildBackgroundSeedAnswer(): string {
  const ctx = getPersonalContext();
  return [
    `I'm a ${ctx.currentRoleTitle} leading a cross-functional team of about ${ctx.teamSize} people`,
    ctx.product
      ? `on our ${ctx.product}${ctx.scaleNote ? ` (${ctx.scaleNote} DAU)` : ""}.`
      : ".",
    `I'm moving toward Systems and Solution Architecture while staying hands-on in technical decisions.`,
  ].join(" ");
}
