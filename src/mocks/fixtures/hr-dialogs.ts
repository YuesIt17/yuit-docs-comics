import type { TraceAnalysis } from "@/lib/episode-engine/types";

export type HrAnswerQuality = "weak" | "average" | "strong";

export interface HrDialogFixture {
  sceneId: string;
  topic: string;
  useCase: string;
  quality: HrAnswerQuality;
  label: string;
  userAnswer: string;
  analysis: TraceAnalysis;
  sophiaFollowUp: string;
}

export interface HrSceneMeta {
  sceneId: string;
  topic: string;
  useCase: string;
  sophiaQuestion: string;
}

export const HR_SCENE_META: HrSceneMeta[] = [
  {
    sceneId: "scene-01",
    topic: "Tell Me About Yourself",
    useCase: "introduction",
    sophiaQuestion:
      "Hi! Thanks for joining us today. Let's start with the basics — tell me about yourself.",
  },
  {
    sceneId: "scene-02",
    topic: "Systems & Scale",
    useCase: "technical_depth",
    sophiaQuestion:
      "Can you go deeper — what kind of systems have you built, and at what scale?",
  },
  {
    sceneId: "scene-03",
    topic: "Business Impact",
    useCase: "impact",
    sophiaQuestion:
      "What impact did your work have on the business or the engineering org?",
  },
  {
    sceneId: "scene-04",
    topic: "Biggest Challenge",
    useCase: "behavioral_star",
    sophiaQuestion:
      "Tell me about your biggest technical challenge. What made it hard?",
  },
  {
    sceneId: "scene-05",
    topic: "Failure Story",
    useCase: "failure",
    sophiaQuestion:
      "Tell me about a time something didn't go as planned.",
  },
  {
    sceneId: "scene-06",
    topic: "Leadership & Influence",
    useCase: "leadership",
    sophiaQuestion:
      "How do you influence teams without direct authority?",
  },
  {
    sceneId: "scene-07",
    topic: "Why This Company",
    useCase: "motivation",
    sophiaQuestion: "Why this company? And why this role specifically?",
  },
  {
    sceneId: "scene-08",
    topic: "Closing Pitch",
    useCase: "compression",
    sophiaQuestion:
      "If you had two minutes to summarize who you are as an engineer, what would you say?",
  },
];

function fx(
  score: number,
  partial: Omit<
    TraceAnalysis,
    "score" | "breakdown" | "detectedCollocations"
  > & { detectedCollocations?: string[] },
  breakdown?: Partial<TraceAnalysis["breakdown"]>
): TraceAnalysis {
  const b = breakdown ?? {};
  return {
    score,
    breakdown: {
      clarity: b.clarity ?? score + 2,
      structure: b.structure ?? score - 1,
      vocabulary: b.vocabulary ?? score - 3,
      fluency: b.fluency ?? score,
      impact: b.impact ?? score - 5,
    },
    detectedCollocations: partial.detectedCollocations ?? [],
    ...partial,
  };
}

/** All HR interview dialog fixtures: 8 scenes × weak / average / strong */
export const HR_DIALOG_FIXTURES: HrDialogFixture[] = [
  // ── Scene 01: Tell Me About Yourself ──
  {
    sceneId: "scene-01",
    topic: "Tell Me About Yourself",
    useCase: "introduction",
    quality: "weak",
    label: "Too vague",
    userAnswer: "I am engineer. I work with computers and code many years.",
    sophiaFollowUp:
      "Thanks — can you be more specific about your level and what kind of engineering you focus on?",
    analysis: fx(42, {
      strengths: ["Mentions engineering background"],
      improvements: [
        "State your level (Staff Engineer)",
        "Name your domain (platform, backend, etc.)",
        "Add one impact hook early",
      ],
      feedback:
        "Too vague for a staff-level screen. Recruiters need level, domain, and impact in the first 30 seconds.",
      naturalVersion:
        "I'm a Staff Software Engineer with over ten years of experience building backend systems and platform infrastructure.",
      staffVersion:
        "Staff engineer — platform and distributed systems, focused on operational impact at scale.",
      detectedCollocations: [],
      compressionLevels: {
        basic: "I am an engineer with many years of experience in software.",
        natural:
          "I'm a Staff Software Engineer focused on distributed systems and internal platforms.",
        staff: "Staff platform engineer — I build systems other teams depend on.",
      },
    }),
  },
  {
    sceneId: "scene-01",
    topic: "Tell Me About Yourself",
    useCase: "introduction",
    quality: "average",
    label: "Solid intro",
    userAnswer:
      "I'm a Staff Software Engineer with 10 years of experience. I work on distributed systems and internal platforms for product teams. Recently I led a migration that improved deployment speed.",
    sophiaFollowUp:
      "Good — I'd love to hear more about the scale of those systems and the measurable impact.",
    analysis: fx(74, {
      strengths: [
        "Clear role level stated",
        "Relevant domain: distributed systems",
        "Mentions internal platforms",
      ],
      improvements: ["Quantify the migration impact", "Compress the opening hook"],
      feedback:
        "Good start! You clearly stated your role and focus. Try adding a bit more about the impact you create.",
      naturalVersion:
        "I'm a Staff Software Engineer with 10 years of experience building distributed systems and internal platforms. I recently led a platform migration that significantly improved deployment speed for product teams.",
      staffVersion:
        "Staff engineer building platform infrastructure — I improve operational scalability and team velocity at scale.",
      detectedCollocations: ["distributed systems", "internal platforms"],
      compressionLevels: {
        basic:
          "I am a Staff Engineer with 10 years experience in distributed systems and platforms.",
        natural:
          "Staff engineer focused on distributed systems and internal platforms — recently improved deployment speed through a platform migration.",
        staff: "Platform engineer — I make complex systems operable and teams faster.",
      },
    }),
  },
  {
    sceneId: "scene-01",
    topic: "Tell Me About Yourself",
    useCase: "introduction",
    quality: "strong",
    label: "Staff-level intro",
    userAnswer:
      "I'm a Staff Software Engineer with 10+ years building distributed systems and internal platforms. I focus on operational efficiency at scale — my recent work reduced deployment time by 40% across 12 product teams serving 2M users.",
    sophiaFollowUp:
      "Excellent — that's exactly the kind of clarity we look for at staff level. Let's dig into the systems behind that.",
    analysis: fx(91, {
      strengths: [
        "Strong opening hook with level and domain",
        "Quantified impact: 40%, 12 teams, 2M users",
        "Natural use of operational efficiency",
      ],
      improvements: ["Optional: mention what you're looking for next"],
      feedback:
        "Excellent staff-level introduction. Level, domain, and impact are clear within the first sentences.",
      naturalVersion:
        "I'm a Staff Software Engineer with 10+ years building distributed systems and internal platforms. I focus on operational efficiency — recently reducing deployment time by 40% across 12 teams serving 2M users.",
      staffVersion:
        "Staff platform engineer — I improve operational efficiency and scalability for teams at 2M-user scale.",
      detectedCollocations: [
        "distributed systems",
        "internal platforms",
        "operational efficiency",
      ],
      compressionLevels: {
        basic:
          "I am a Staff Engineer with experience in distributed systems and platforms.",
        natural:
          "Staff engineer — distributed systems, internal platforms, 40% faster deploys at 2M-user scale.",
        staff: "Staff platform — ops efficiency, 2M users, 40% deploy gain.",
      },
    }),
  },

  // ── Scene 02: Systems & Scale ──
  {
    sceneId: "scene-02",
    topic: "Systems & Scale",
    useCase: "technical_depth",
    quality: "weak",
    label: "No scale signals",
    userAnswer: "I built microservices and APIs. We had many services and they talked to each other.",
    sophiaFollowUp: "Can you put numbers on that — traffic, teams, or data volume?",
    analysis: fx(38, {
      strengths: ["Mentions microservices architecture"],
      improvements: [
        "Add traffic or user scale",
        "Mention team size or service count",
        "Explain why scalability mattered",
      ],
      feedback:
        "Technical terms alone don't convey scale. Add concrete numbers — requests per second, teams, or users.",
      naturalVersion:
        "I built a microservices platform with 20+ services handling authentication, billing, and core product APIs across 4 engineering teams.",
      staffVersion:
        "Designed a 20-service platform at 5K rps — improved scalability and reduced cross-team coupling.",
      detectedCollocations: [],
      compressionLevels: {
        basic: "I built microservices that different parts of the product used.",
        natural:
          "I built a microservices platform serving multiple product teams with clear service boundaries.",
        staff: "Platform microservices — multi-team, production scale.",
      },
    }),
  },
  {
    sceneId: "scene-02",
    topic: "Systems & Scale",
    useCase: "technical_depth",
    quality: "average",
    label: "Some scale",
    userAnswer:
      "I designed a distributed event pipeline processing about 50K events per second. It supported 6 product teams and we worked to improve scalability during peak traffic.",
    sophiaFollowUp: "Interesting — what was the bottleneck and how did you address it?",
    analysis: fx(76, {
      strengths: [
        "Concrete throughput: 50K events/sec",
        "Multi-team scope: 6 teams",
        "Mentions scalability",
      ],
      improvements: [
        "Describe the bottleneck you identified",
        "Add outcome metrics after scaling work",
      ],
      feedback:
        "Good scale signals. Push further — what broke at peak load and what changed after?",
      naturalVersion:
        "I designed a distributed event pipeline handling 50K events per second for 6 product teams. During peak traffic we identified bottlenecks in the ingestion layer and improved scalability by partitioning the pipeline.",
      staffVersion:
        "Built 50K eps event pipeline for 6 teams — identified bottlenecks, improved scalability under peak load.",
      detectedCollocations: ["improve scalability"],
      compressionLevels: {
        basic:
          "I built an event pipeline that handled a lot of traffic for several teams.",
        natural:
          "Distributed event pipeline at 50K eps, 6 teams — improved scalability during peak traffic.",
        staff: "50K eps pipeline — scaled ingestion, multi-team platform.",
      },
    }),
  },
  {
    sceneId: "scene-02",
    topic: "Systems & Scale",
    useCase: "technical_depth",
    quality: "strong",
    label: "Full scale story",
    userAnswer:
      "I owned a distributed event pipeline at 50K events/sec across 6 teams. During Black Friday we hit 3× traffic. I identified bottlenecks in the ingestion tier, redesigned partitioning, and improved scalability — p99 latency dropped from 800ms to 120ms while cutting operational overhead by 30%.",
    sophiaFollowUp:
      "That's a strong example — clear constraint, action, and metrics. Let's talk about business impact.",
    analysis: fx(93, {
      strengths: [
        "Full scale picture: 50K eps, 6 teams, 3× peak",
        "Identified bottlenecks with measurable fix",
        "Operational efficiency quantified: 30%",
      ],
      improvements: [],
      feedback:
        "Excellent technical depth. Constraint, action, and metrics are all present — very staff-level.",
      naturalVersion:
        "I owned a 50K eps event pipeline for 6 teams. During a 3× traffic spike I identified ingestion bottlenecks, redesigned partitioning, and improved scalability — p99 dropped from 800ms to 120ms with 30% less operational overhead.",
      staffVersion:
        "50K eps pipeline — bottlenecked at 3× peak, fixed partitioning, 85% latency cut, 30% ops savings.",
      detectedCollocations: [
        "identify bottlenecks",
        "improve scalability",
        "operational efficiency",
      ],
      compressionLevels: {
        basic:
          "I managed a high-traffic pipeline and fixed performance problems during busy periods.",
        natural:
          "Owned 50K eps pipeline — identified bottlenecks during 3× peak, improved scalability and cut latency 85%.",
        staff: "Pipeline at scale — bottleneck fix, 85% latency drop, 30% ops reduction.",
      },
    }),
  },

  // ── Scene 03: Business Impact ──
  {
    sceneId: "scene-03",
    topic: "Business Impact",
    useCase: "impact",
    quality: "weak",
    label: "Tech only, no impact",
    userAnswer:
      "I refactored the codebase and migrated to Kubernetes. The system is more modern now.",
    sophiaFollowUp:
      "I hear the technical work — but what changed for the business or the teams?",
    analysis: fx(40, {
      strengths: ["Describes technical migration"],
      improvements: [
        "Connect to business outcome",
        "Quantify measurable impact",
        "Explain who benefited",
      ],
      feedback:
        "Impact beats implementation. Start with the outcome — revenue, velocity, cost, or reliability — then explain how.",
      naturalVersion:
        "I led a Kubernetes migration that reduced infrastructure costs by 25% and cut mean time to deploy from 2 hours to 15 minutes, enabling product teams to ship 2× faster.",
      staffVersion:
        "K8s migration — 25% cost reduction, 8× faster deploys, 2× team shipping velocity.",
      detectedCollocations: [],
      compressionLevels: {
        basic: "I modernized our infrastructure with Kubernetes.",
        natural:
          "Kubernetes migration that reduced costs and helped teams deploy faster.",
        staff: "Infra migration — cost down, velocity up.",
      },
    }),
  },
  {
    sceneId: "scene-03",
    topic: "Business Impact",
    useCase: "impact",
    quality: "average",
    label: "Some metrics",
    userAnswer:
      "My platform work improved operational efficiency for 8 engineering teams. We reduced incident frequency and deployment time improved significantly.",
    sophiaFollowUp: "Can you quantify 'significantly'? Even estimates help.",
    analysis: fx(68, {
      strengths: [
        "Multi-team scope",
        "Mentions operational efficiency",
        "Connects to incidents and deploys",
      ],
      improvements: [
        "Add specific percentages or time savings",
        "Link to revenue or customer impact if possible",
      ],
      feedback:
        "Good direction — add numbers to make the impact credible. 'Significantly' is vague for staff-level.",
      naturalVersion:
        "My platform work improved operational efficiency for 8 teams — we cut incidents by 40% and reduced deployment time from 90 minutes to 12 minutes.",
      staffVersion:
        "Platform work for 8 teams — 40% fewer incidents, 87% faster deploys, measurable operational efficiency.",
      detectedCollocations: ["operational efficiency"],
      compressionLevels: {
        basic: "My work helped teams deploy faster and have fewer incidents.",
        natural:
          "Improved operational efficiency for 8 teams — fewer incidents, much faster deployments.",
        staff: "8-team platform impact — incidents down, deploy velocity up.",
      },
    }),
  },
  {
    sceneId: "scene-03",
    topic: "Business Impact",
    useCase: "impact",
    quality: "strong",
    label: "Full impact story",
    userAnswer:
      "I built an internal developer platform that improved operational efficiency for 8 teams. Measurable impact: deployment frequency went from weekly to daily, incidents dropped 40%, and we saved $200K/year in cloud costs. Product teams shipped features 2× faster, which directly supported a 15% revenue increase in our core product line.",
    sophiaFollowUp:
      "Now that's impact I can take to the hiring manager. Tell me about a hard challenge along the way.",
    analysis: fx(94, {
      strengths: [
        "Clear measurable impact across multiple dimensions",
        "Business connection: 15% revenue",
        "Cost, velocity, and reliability metrics",
      ],
      improvements: [],
      feedback:
        "Outstanding impact answer. Technical work connected to business outcomes with credible numbers.",
      naturalVersion:
        "I built a developer platform for 8 teams with measurable impact: daily deploys, 40% fewer incidents, $200K annual savings, and 2× feature velocity supporting 15% revenue growth.",
      staffVersion:
        "Dev platform — 8 teams, daily deploys, 40% fewer incidents, $200K saved, 15% revenue lift.",
      detectedCollocations: ["measurable impact", "operational efficiency"],
      compressionLevels: {
        basic:
          "I built a platform that helped teams work faster and saved the company money.",
        natural:
          "Developer platform with measurable impact — faster shipping, fewer incidents, significant cost savings.",
        staff: "Platform → daily deploys, 40% fewer incidents, $200K saved, revenue up 15%.",
      },
    }),
  },

  // ── Scene 04: Biggest Challenge (STAR) ──
  {
    sceneId: "scene-04",
    topic: "Biggest Challenge",
    useCase: "behavioral_star",
    quality: "weak",
    label: "No STAR structure",
    userAnswer:
      "The biggest challenge was a hard project. There were many bugs and we fixed them.",
    sophiaFollowUp: "Walk me through it — what was the situation and what did you specifically do?",
    analysis: fx(35, {
      strengths: ["Acknowledges a difficult project"],
      improvements: [
        "Use STAR: Situation, Task, Action, Result",
        "Name the technical constraint",
        "Show your specific ownership",
      ],
      feedback:
        "Too generic. Name the constraint first, then your action, then a measurable result.",
      naturalVersion:
        "Situation: our auth service couldn't handle 10× login spike during launch. Task: restore reliability in 48 hours. Action: I identified bottlenecks in the token cache, redesigned the session layer, and led a war room. Result: p99 latency back to normal in 36 hours, zero downtime.",
      staffVersion:
        "Auth couldn't handle 10× spike — I found the bottleneck, redesigned sessions, restored p99 in 36h, zero downtime.",
      detectedCollocations: [],
      compressionLevels: {
        basic: "We had a hard launch and I helped fix performance problems.",
        natural:
          "During a launch spike I identified bottlenecks in auth and restored performance within 36 hours.",
        staff: "Launch spike — bottleneck fix, 36h recovery, zero downtime.",
      },
    }),
  },
  {
    sceneId: "scene-04",
    topic: "Biggest Challenge",
    useCase: "behavioral_star",
    quality: "average",
    label: "Partial STAR",
    userAnswer:
      "Situation: our CI/CD pipeline was a bottleneck blocking 5 teams. Action: I redesigned it with parallel builds and caching. Result: build times improved a lot.",
    sophiaFollowUp: "Good structure — what were the before/after numbers on build time?",
    analysis: fx(72, {
      strengths: [
        "Uses STAR elements",
        "Clear multi-team scope",
        "Shows ownership of redesign",
      ],
      improvements: [
        "Quantify 'improved a lot'",
        "Mention how you validated assumptions before redesign",
      ],
      feedback:
        "Good STAR skeleton. Add numbers — before/after build times make it credible.",
      naturalVersion:
        "Situation: CI/CD was blocking 5 teams with 45-minute builds. Task: unblock velocity. Action: I identified bottlenecks, added parallel builds and caching, and validated assumptions with a pilot team. Result: builds dropped to 8 minutes — 80% improvement.",
      staffVersion:
        "CI bottleneck for 5 teams — parallel builds + cache, 45min → 8min, validated with pilot.",
      detectedCollocations: ["identify bottlenecks"],
      compressionLevels: {
        basic: "Our builds were slow and I made them faster for several teams.",
        natural:
          "CI/CD bottleneck for 5 teams — redesigned with parallel builds, cut build time 80%.",
        staff: "CI bottleneck — 45min to 8min, 5 teams unblocked.",
      },
    }),
  },
  {
    sceneId: "scene-04",
    topic: "Biggest Challenge",
    useCase: "behavioral_star",
    quality: "strong",
    label: "Full STAR",
    userAnswer:
      "Situation: CI/CD was the bottleneck — 45-minute builds blocking 5 teams at a critical launch. Task: restore shipping velocity in 3 weeks. Action: I identified bottlenecks via profiling, validated assumptions with a pilot team, then rolled out parallel builds and distributed caching. Result: builds dropped to 8 minutes (82% improvement), teams shipped daily instead of weekly.",
    sophiaFollowUp:
      "Clear ownership and metrics — I appreciate the structured answer. Everyone fails sometimes though — tell me about that.",
    analysis: fx(92, {
      strengths: [
        "Complete STAR with constraint and deadline",
        "Validated assumptions before rollout",
        "Strong metrics: 82%, daily vs weekly",
      ],
      improvements: [],
      feedback:
        "Excellent behavioral answer. Constraint, ownership, validation, and measurable result — textbook staff-level.",
      naturalVersion:
        "CI/CD bottleneck at 45-minute builds blocking 5 teams. I identified bottlenecks, validated with a pilot, rolled out parallel builds — 8-minute builds, daily shipping.",
      staffVersion:
        "CI bottleneck — profiled, piloted, parallel builds, 45→8 min, weekly→daily shipping.",
      detectedCollocations: ["identify bottlenecks", "validate assumptions"],
      compressionLevels: {
        basic: "Builds were too slow and I fixed the pipeline so teams could ship faster.",
        natural:
          "CI/CD bottleneck for 5 teams — identified root cause, validated fix, 82% faster builds.",
        staff: "CI bottleneck — pilot, parallel builds, 82% faster, daily shipping.",
      },
    }),
  },

  // ── Scene 05: Failure ──
  {
    sceneId: "scene-05",
    topic: "Failure Story",
    useCase: "failure",
    quality: "weak",
    label: "Blame / no learning",
    userAnswer:
      "The project failed because management changed requirements and other teams didn't help.",
    sophiaFollowUp:
      "I understand frustration — but what would you do differently looking back?",
    analysis: fx(32, {
      strengths: ["Acknowledges a failed project"],
      improvements: [
        "Take accountability — avoid blaming others",
        "Describe what you learned",
        "Explain systemic changes you made after",
      ],
      feedback:
        "Failure answers need ownership. Show what you learned and what changed — not who to blame.",
      naturalVersion:
        "I underestimated integration complexity on a platform migration. I learned to validate assumptions earlier with pilot teams. Now I always run a 2-week proof-of-concept before full rollout.",
      staffVersion:
        "Underestimated integration risk — now I validate assumptions with POCs before full rollout.",
      detectedCollocations: [],
      compressionLevels: {
        basic: "A project didn't go well and I learned to plan better.",
        natural:
          "I underestimated complexity on a migration — now I validate assumptions with pilots first.",
        staff: "Migration failure → learned to POC before rollout.",
      },
    }),
  },
  {
    sceneId: "scene-05",
    topic: "Failure Story",
    useCase: "failure",
    quality: "average",
    label: "Some accountability",
    userAnswer:
      "I pushed a migration too fast without enough testing. We had an outage. I learned to validate assumptions more carefully and added better monitoring.",
    sophiaFollowUp: "Good honesty — what specifically changed in your process after?",
    analysis: fx(70, {
      strengths: [
        "Takes accountability",
        "Mentions validate assumptions",
        "Added monitoring",
      ],
      improvements: [
        "Quantify the outage impact and recovery",
        "Describe process changes more concretely",
      ],
      feedback:
        "Honest and accountable. Add specifics — how long was the outage and what process now prevents recurrence?",
      naturalVersion:
        "I pushed a migration without sufficient canary testing, causing a 2-hour outage. I learned to validate assumptions with staged rollouts and added observability dashboards — we haven't had a similar incident in 18 months.",
      staffVersion:
        "Migration too fast → 2h outage. Now: staged rollouts, observability, zero repeat in 18 months.",
      detectedCollocations: ["validate assumptions"],
      compressionLevels: {
        basic: "I caused an outage by moving too fast and now I'm more careful.",
        natural:
          "Pushed a migration too fast, 2-hour outage — now I validate with staged rollouts and better monitoring.",
        staff: "Fast migration, outage — staged rollouts + observability now.",
      },
    }),
  },
  {
    sceneId: "scene-05",
    topic: "Failure Story",
    useCase: "failure",
    quality: "strong",
    label: "Accountable + systemic fix",
    userAnswer:
      "I accelerated a database migration to meet a deadline without a proper canary. We caused a 2-hour outage affecting 500K users. I owned the postmortem, learned to validate assumptions with staged rollouts, and reduced complexity by consolidating three migration paths into one. We added observability alerts — zero similar incidents in 18 months.",
    sophiaFollowUp:
      "That's mature — ownership, learning, and systemic improvement. How do you lead without authority?",
    analysis: fx(90, {
      strengths: [
        "Full accountability without blame",
        "Quantified impact: 2h, 500K users",
        "Systemic fixes: validate assumptions, reduce complexity, observability",
      ],
      improvements: [],
      feedback:
        "Excellent failure story. Accountability, learning, and lasting process change — exactly what staff interviews probe for.",
      naturalVersion:
        "I rushed a DB migration — 2-hour outage, 500K users affected. I owned the postmortem, now validate with canaries, reduced complexity, added observability. Zero repeats in 18 months.",
      staffVersion:
        "Rushed migration → 2h/500K outage. Owned it, canaries now, reduced complexity, 18mo clean.",
      detectedCollocations: ["validate assumptions", "reduce complexity"],
      compressionLevels: {
        basic: "I caused an outage by rushing and fixed our process afterward.",
        natural:
          "Rushed migration caused 2h outage — owned postmortem, staged rollouts, reduced complexity, no repeat in 18 months.",
        staff: "Outage owned — canaries, less complexity, observability, 18mo clean.",
      },
    }),
  },

  // ── Scene 06: Leadership ──
  {
    sceneId: "scene-06",
    topic: "Leadership & Influence",
    useCase: "leadership",
    quality: "weak",
    label: "Authority-based",
    userAnswer:
      "I tell teams what to do and make sure they follow the plan. I'm senior so people listen.",
    sophiaFollowUp:
      "Staff roles often require influence without authority — can you give an example of that?",
    analysis: fx(36, {
      strengths: ["Shows confidence"],
      improvements: [
        "Show influence without authority",
        "Describe how you align on priorities across teams",
        "Focus on stakeholder management, not hierarchy",
      ],
      feedback:
        "Staff leadership is about making others successful, not directing them. Show cross-team alignment.",
      naturalVersion:
        "Three teams had conflicting platform priorities. I facilitated workshops to align on priorities, built a shared roadmap, and created a working group — all three teams adopted the plan within 6 weeks.",
      staffVersion:
        "3 teams misaligned — I facilitated priority alignment, shared roadmap, adoption in 6 weeks.",
      detectedCollocations: [],
      compressionLevels: {
        basic: "I helped different teams agree on what to work on.",
        natural:
          "Aligned 3 teams on platform priorities through workshops and a shared roadmap.",
        staff: "Cross-team misalignment → facilitated alignment, 6-week adoption.",
      },
    }),
  },
  {
    sceneId: "scene-06",
    topic: "Leadership & Influence",
    useCase: "leadership",
    quality: "average",
    label: "Some influence",
    userAnswer:
      "I worked with product and infra teams to align on priorities for a platform migration. I presented the tradeoffs and we agreed on a plan.",
    sophiaFollowUp: "What was the outcome — did all teams actually adopt it?",
    analysis: fx(71, {
      strengths: [
        "Cross-team collaboration",
        "Mentions align on priorities",
        "Discusses tradeoffs",
      ],
      improvements: [
        "Quantify adoption and outcome",
        "Describe stakeholder management challenges",
      ],
      feedback:
        "Good influence example. Add the outcome — did teams adopt it, and what improved?",
      naturalVersion:
        "Three teams had conflicting migration timelines. I facilitated alignment on priorities, presented tradeoffs to leadership, and drove stakeholder management through a shared RFC process. All teams adopted the plan — migration completed 3 weeks ahead of schedule.",
      staffVersion:
        "3 teams misaligned — aligned priorities, RFC process, stakeholder buy-in, 3 weeks early.",
      detectedCollocations: ["align on priorities"],
      compressionLevels: {
        basic: "I got different teams to agree on a migration plan.",
        natural:
          "Aligned 3 teams on migration priorities through tradeoff discussions and shared RFC.",
        staff: "Cross-team alignment → shared RFC, all teams adopted, 3 weeks early.",
      },
    }),
  },
  {
    sceneId: "scene-06",
    topic: "Leadership & Influence",
    useCase: "leadership",
    quality: "strong",
    label: "Cross-team influence",
    userAnswer:
      "Three teams had conflicting platform priorities with no shared owner. I couldn't direct anyone — so I mapped dependencies, facilitated workshops to align on priorities, and wrote an RFC presenting tradeoffs to engineering leadership. Through stakeholder management I got buy-in from all three leads. Result: shared roadmap adopted in 6 weeks, migration finished 3 weeks early, zero rollbacks.",
    sophiaFollowUp:
      "That's real staff-level influence. Why us — why this company and role?",
    analysis: fx(93, {
      strengths: [
        "Clear influence without authority",
        "align on priorities + stakeholder management",
        "Quantified outcome: 6 weeks, 3 weeks early",
      ],
      improvements: [],
      feedback:
        "Excellent leadership answer. Influence, alignment, and measurable multi-team outcome.",
      naturalVersion:
        "Three teams, conflicting priorities, no authority. I aligned priorities via workshops and RFC, managed stakeholders, got full adoption in 6 weeks — migration 3 weeks early.",
      staffVersion:
        "3 teams, no authority — aligned priorities, RFC, stakeholder buy-in, 6wk adoption, 3wk early.",
      detectedCollocations: ["align on priorities", "stakeholder management"],
      compressionLevels: {
        basic: "I got teams to agree on priorities even though I wasn't their manager.",
        natural:
          "Influenced 3 teams without authority — aligned priorities, RFC, stakeholder buy-in, early delivery.",
        staff: "No authority — alignment + RFC + stakeholders → 6wk adoption, 3wk early.",
      },
    }),
  },

  // ── Scene 07: Why This Company ──
  {
    sceneId: "scene-07",
    topic: "Why This Company",
    useCase: "motivation",
    quality: "weak",
    label: "Generic motivation",
    userAnswer:
      "I want this job because it's a good company and the salary is competitive. I think I would be a good fit.",
    sophiaFollowUp:
      "Can you be more specific — what about our mission or this staff role excites you?",
    analysis: fx(34, {
      strengths: ["Expresses interest in the role"],
      improvements: [
        "Research the company mission specifically",
        "Connect your strengths to their needs",
        "Avoid salary-focused answers in early screens",
      ],
      feedback:
        "Generic answers signal low interest. Show you've done homework — mission, product, and what you'll contribute.",
      naturalVersion:
        "I'm excited about your platform engineering challenges at scale — my experience building internal platforms for 8 teams maps directly to this staff role. I want to help improve operational efficiency as you expand into European markets.",
      staffVersion:
        "Your platform-at-scale challenges match my background — I can drive operational efficiency as you expand in EU.",
      detectedCollocations: [],
      compressionLevels: {
        basic: "I like your company and my experience fits this role.",
        natural:
          "Your platform challenges match my background — I can contribute to operational efficiency at scale.",
        staff: "Platform at scale — my fit, your EU expansion, operational impact.",
      },
    }),
  },
  {
    sceneId: "scene-07",
    topic: "Why This Company",
    useCase: "motivation",
    quality: "average",
    label: "Some research",
    userAnswer:
      "I'm interested because you're building AI-native engineering tools and I have experience with platform engineering. I think I can help improve scalability as the team grows.",
    sophiaFollowUp: "What specifically about our product or mission resonates with you?",
    analysis: fx(69, {
      strengths: [
        "Mentions company direction: AI-native",
        "Connects platform experience",
        "Mentions scalability",
      ],
      improvements: [
        "Be more specific about the product or mission",
        "Add measurable impact you would bring",
      ],
      feedback:
        "Better — connect your story to something specific about this company, not any startup.",
      naturalVersion:
        "Your AI-native developer platform resonates with my work building internal platforms. I've improved scalability for teams going from 10 to 50 engineers — I'd bring that operational experience to help you scale without proportional overhead.",
      staffVersion:
        "AI-native platform — I've scaled eng orgs 10→50, can improve scalability without linear overhead.",
      detectedCollocations: ["improve scalability"],
      compressionLevels: {
        basic: "Your AI tools match my platform experience and I can help you grow.",
        natural:
          "AI-native platform aligns with my work — I can help improve scalability as you scale the team.",
        staff: "AI-native platform + my scale experience → scalability without linear overhead.",
      },
    }),
  },
  {
    sceneId: "scene-07",
    topic: "Why This Company",
    useCase: "motivation",
    quality: "strong",
    label: "Researched + specific",
    userAnswer:
      "Three things: your AI-native platform vision aligns with how I think about developer experience. My background scaling internal platforms from 10 to 50 engineers maps to your growth stage. And your expansion into France matches my goal to contribute to a European engineering hub — I'd align on priorities around platform reliability while bringing measurable impact to your developer velocity metrics.",
    sophiaFollowUp:
      "You've clearly done your homework — I appreciate the specificity. Last question: two-minute summary.",
    analysis: fx(92, {
      strengths: [
        "Specific company research: AI-native, France expansion",
        "Clear fit: 10→50 engineer scaling",
        "align on priorities + measurable impact",
      ],
      improvements: [],
      feedback:
        "Excellent motivation answer. Authentic, researched, and connected to what you'll contribute.",
      naturalVersion:
        "Your AI-native platform, growth stage, and France expansion align with my experience scaling platforms and my career goals. I'd align on priorities around reliability while driving measurable impact on developer velocity.",
      staffVersion:
        "AI-native + growth stage + EU expansion — my platform scale experience, reliability + velocity impact.",
      detectedCollocations: ["align on priorities", "measurable impact"],
      compressionLevels: {
        basic: "Your company vision and growth match my experience and goals.",
        natural:
          "AI-native platform at your growth stage — my scaling experience fits, excited about EU expansion.",
        staff: "AI-native, growth stage, EU — platform scale fit, reliability + velocity impact.",
      },
    }),
  },

  // ── Scene 08: Closing Pitch ──
  {
    sceneId: "scene-08",
    topic: "Closing Pitch",
    useCase: "compression",
    quality: "weak",
    label: "Uncompressed ramble",
    userAnswer:
      "So I am engineer many years, I work on many things, platforms and backend and also frontend sometimes, and I like learning new things and I think I am good team player.",
    sophiaFollowUp:
      "Let me stop you there — if you had 30 seconds, what's the one thing you want me to remember?",
    analysis: fx(38, {
      strengths: ["Enthusiastic tone"],
      improvements: [
        "Compress — level, domain, impact, intent in under 60 seconds",
        "Remove filler and unrelated details",
        "End with what you're looking for",
      ],
      feedback:
        "Closing pitch must be compressed. Level + domain + impact + intent — nothing else.",
      naturalVersion:
        "I'm a Staff Software Engineer focused on distributed systems and internal platforms. I've improved operational efficiency for teams at 2M-user scale. I'm looking for a staff platform role where I can drive measurable impact.",
      staffVersion:
        "Staff platform engineer — distributed systems, operational efficiency at 2M scale, seeking staff impact role.",
      detectedCollocations: [],
      compressionLevels: {
        basic:
          "I am an experienced engineer who works on platforms and wants a good role.",
        natural:
          "Staff engineer, platform and distributed systems, operational efficiency at scale.",
        staff: "Staff platform — distributed systems, ops efficiency, 2M scale.",
      },
    }),
  },
  {
    sceneId: "scene-08",
    topic: "Closing Pitch",
    useCase: "compression",
    quality: "average",
    label: "Decent close",
    userAnswer:
      "I'm a Staff Software Engineer with 10 years in distributed systems and internal platforms. I've improved operational efficiency for 8 teams. I'm looking for a staff role where I can have measurable impact on platform reliability and developer velocity.",
    sophiaFollowUp:
      "Clean close — thank you, Eugene. We'll be in touch about next steps.",
    analysis: fx(78, {
      strengths: [
        "Hits level, domain, and intent",
        "Mentions operational efficiency",
        "Clear about what you're seeking",
      ],
      improvements: [
        "Add one quantified impact number",
        "Tighten further for true 2-minute delivery",
      ],
      feedback:
        "Solid closing pitch. One metric would make it memorable — e.g. '40% faster deploys'.",
      naturalVersion:
        "Staff Software Engineer, 10 years, distributed systems and internal platforms. Improved operational efficiency for 8 teams — 40% faster deploys. Seeking a staff role with measurable platform impact.",
      staffVersion:
        "Staff platform engineer — 10yr, distributed systems, 8 teams, 40% faster deploys, seeking impact.",
      detectedCollocations: ["distributed systems", "operational efficiency"],
      compressionLevels: {
        basic: "Staff engineer in platforms looking for impact role.",
        natural:
          "Staff engineer — distributed systems, operational efficiency, seeking platform impact.",
        staff: "Staff platform — distributed systems, ops efficiency, impact role.",
      },
    }),
  },
  {
    sceneId: "scene-08",
    topic: "Closing Pitch",
    useCase: "compression",
    quality: "strong",
    label: "Perfect 2-min pitch",
    userAnswer:
      "Staff Software Engineer, 10 years, distributed systems and internal platforms. I improve operational efficiency at scale — 8 teams, 2M users, 40% faster deploys, 40% fewer incidents. I compress complex problems into operable systems. I'm looking for a staff platform role where I drive measurable impact — and your AI-native vision is exactly where I want to apply that.",
    sophiaFollowUp:
      "That's the best two-minute pitch I've heard today. Thank you — we'll be in touch soon.",
    analysis: fx(96, {
      strengths: [
        "Perfect compression: level, domain, metrics, intent",
        "Multiple measurable impacts",
        "Memorable closing hook tied to company",
      ],
      improvements: [],
      feedback:
        "Outstanding closing pitch. Staff-level compression with impact, intent, and personalization.",
      naturalVersion:
        "Staff engineer, 10 years, distributed systems and platforms. Operational efficiency at scale — 8 teams, 2M users, 40% faster deploys. Seeking staff platform role with measurable impact.",
      staffVersion:
        "Staff platform — 10yr, 2M users, 40% faster deploys, 40% fewer incidents, AI-native fit.",
      detectedCollocations: [
        "distributed systems",
        "operational efficiency",
        "measurable impact",
      ],
      compressionLevels: {
        basic:
          "Experienced staff engineer in platforms with strong results looking for impact role.",
        natural:
          "Staff platform engineer — distributed systems, 8 teams, 2M users, 40% faster deploys, seeking impact.",
        staff: "Staff platform — 2M scale, 40% deploy gain, 40% fewer incidents, AI-native.",
      },
    }),
  },
];

export function getFixturesForScene(sceneId: string): HrDialogFixture[] {
  return HR_DIALOG_FIXTURES.filter((f) => f.sceneId === sceneId);
}

export function getFixtureBySceneAndQuality(
  sceneId: string,
  quality: HrAnswerQuality
): HrDialogFixture | undefined {
  return HR_DIALOG_FIXTURES.find(
    (f) => f.sceneId === sceneId && f.quality === quality
  );
}

/** Match exact fixture answer text or mock command like [mock:weak] */
export function resolveHrDialogFixture(
  userAnswer: string,
  sceneId?: string
): HrDialogFixture | undefined {
  const trimmed = userAnswer.trim();
  const lower = trimmed.toLowerCase();

  // Command: [mock:weak] [mock:average] [mock:strong]
  const qualityMatch = lower.match(/^\[mock:(weak|average|strong)\]$/);
  if (qualityMatch && sceneId) {
    return getFixtureBySceneAndQuality(
      sceneId,
      qualityMatch[1] as HrAnswerQuality
    );
  }

  // Command: [mock:scene-04:strong]
  const sceneQualityMatch = lower.match(
    /^\[mock:(scene-\d+):(weak|average|strong)\]$/
  );
  if (sceneQualityMatch) {
    return getFixtureBySceneAndQuality(
      sceneQualityMatch[1],
      sceneQualityMatch[2] as HrAnswerQuality
    );
  }

  // Exact answer match
  const exact = HR_DIALOG_FIXTURES.find(
    (f) =>
      f.userAnswer.trim() === trimmed &&
      (!sceneId || f.sceneId === sceneId)
  );
  if (exact) return exact;

  return undefined;
}

export function fixtureToTraceAnalysis(
  fixture: HrDialogFixture
): TraceAnalysis & { recruiterFollowUp?: string } {
  return {
    ...fixture.analysis,
    recruiterFollowUp: fixture.sophiaFollowUp,
  };
}
