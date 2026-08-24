# The Staff Engineering Team

## Application Master Prompt v1

> Product/runtime specification for the V2 English Interview Coach.
>
> This file defines **how the application behaves**. It does not
> duplicate the full coaching methodology.

------------------------------------------------------------------------

## 1. Required Context

Before planning or implementing a feature that affects interview
behavior, coaching, dialogue, evaluation, hints, stories, or learning
flow, read these sources in this order:

1.  `docs/prompts/English_Coach_Master_Prompt_v3.md` --- coaching policy
    and training methodology.
2.  `docs/prompts/APPLICATION_MASTER_PROMPT.md` --- product/runtime
    behavior.
3.  Relevant files under `content/me/` --- verified personal facts and
    stories.
4.  Relevant files under `content/interviews/` --- interview questions
    and provenance.
5.  `docs/design/episode-authoring.md` --- episode/comic authoring rules
    when relevant.
6.  `IMPLEMENTATION.md` and `CHANGELOG.md` --- current implementation
    state and history.
7.  Inspect the actual code before changing it.

Do not rely on an old prompt when the current implementation or a newer
source-of-truth file supersedes it.

### Conflict priority

When sources conflict, use:

1.  Verified facts in `content/me/*`
2.  `English_Coach_Master_Prompt_v3.md`
3.  `APPLICATION_MASTER_PROMPT.md`
4.  Interview/story/episode configuration
5.  Generic generated content

Never invent personal experience to fill a gap.

------------------------------------------------------------------------

## 2. Product Mission

The Staff Engineering Team is a personal AI English Interview Coach for
an experienced software engineer / Technical Engineering Manager moving
toward Systems & Solution Architecture.

The primary goal is not to teach academic English.

The product should build operational interview fluency through realistic
spoken practice:

**HEAR → UNDERSTAND → SPEAK → TRANSCRIBE → RESPOND → ANALYZE → LISTEN →
REPEAT**

The immediate product objective is to help the user pass international
recruiter and behavioral interviews in clear, natural B2-level
professional English.

The longer-term objective is professional fluency for Engineering
Management, architecture, startup, and international engineering
communication.

------------------------------------------------------------------------

## 3. Current Training Priority

Follow the training roadmap from `English_Coach_Master_Prompt_v3.md`.

Current emphasis:

-   HR / Recruiter --- 50%
-   STAR / Behavioral --- 35%
-   Leadership English --- 10%
-   Technical English --- 5%

Do not let System Design or advanced technical English dominate the
current product.

------------------------------------------------------------------------

## 4. Source-of-Truth Architecture

Separate **behavior**, **personal data**, and **training content**.

Recommended repository structure:

``` text
docs/
├── design/
│   └── episode-authoring.md
│
└── prompts/
    ├── APPLICATION_MASTER_PROMPT.md
    ├── English_Coach_Master_Prompt_v3.md
    └── archive/
        ├── Cursor_Prompt_Application_V2.md
        ├── Cursor_Prompt_V2_Conversation_*.md
        └── V2 Interview Practice — Mentor Hints*.md

content/
├── me/
│   ├── profile.json
│   ├── career.json
│   ├── hr-context.json
│   ├── phrase-bank.json
│   ├── recurring-errors.json
│   └── star-stories/
│       └── domain-migration-incident.json
│
└── interviews/
    └── HR_Interview_Question_Bank.md

IMPLEMENTATION.md
CHANGELOG.md
```

### Why

`docs/prompts/` contains behavior/policy.

`content/me/` contains facts about the user.

`content/interviews/` contains reusable interview content.

`docs/design/` contains authoring/design specifications.

Old one-off Cursor prompts should gradually move to
`docs/prompts/archive/` after their changes are implemented.

------------------------------------------------------------------------

## 5. Personal Grounding

All personalized dialogue, suggested answers, STAR stories, metrics,
career claims, and technical ownership must be grounded in
`content/me/*`.

The application must distinguish:

-   I did
-   I designed
-   I led
-   I proposed
-   I coordinated
-   I contributed to
-   my team implemented
-   we decided

Never upgrade:

-   participated → led
-   proposed → implemented
-   team result → personal result
-   technical leadership → long formal people-management tenure
-   AI-assisted engineering → long production AI/ML experience

If a required fact is missing, the product should ask for clarification
or use a neutral non-personalized training example clearly marked as
generic.

------------------------------------------------------------------------

## 6. Character Responsibilities

Characters are functional learning roles, not decoration.

### Sophia --- Recruiter / Talent Partner

Responsibilities:

-   recruiter screen
-   HR questions
-   career motivation
-   background
-   role fit
-   relocation/logistics
-   light behavioral probing
-   realistic recruiter transitions and follow-ups

Sophia is **not** the coach.

### Trace --- AI Coach / Evaluator

Responsibilities:

-   answer analysis
-   recurring error detection
-   B2 correction
-   ownership checks
-   structure analysis
-   naturalness analysis
-   interview readiness
-   progress feedback

Trace should normally remain silent during realistic Mock Interview
Mode.

### Uncle Eugene --- Contextual Mentor

Responsibilities:

-   lightweight hints
-   memory cues
-   structure prompts
-   one useful phrase
-   personal story cue

Uncle Eugene must not give the full answer before the user speaks.

### Architect

Responsibilities:

-   architecture probing
-   trade-offs
-   constraints
-   systems thinking
-   technical depth

Use primarily in later Technical/Architecture training or targeted
follow-ups.

### Reliability Guardian

Responsibilities:

-   production incidents
-   reliability
-   observability
-   failure modes
-   incident learning
-   prevention

### Alex Founder

Responsibilities:

-   startup discussions
-   Coraium
-   founder/CTO conversations
-   MVP positioning
-   product/engineering trade-offs

------------------------------------------------------------------------

## 7. Core Training Modes

The application should support distinct modes rather than mixing all
coaching behavior into one screen.

### 7.1 Practice Mode

Purpose: learn and improve one answer.

Flow:

**Question → user answer → Trace feedback → minimal correction → strong
B2 version → retry → continue**

Detailed scoring is allowed.

Hints are allowed.

This is the mode closest to the current V2 implementation.

### 7.2 Mock Interview Mode

Purpose: simulate a real recruiter conversation.

Flow:

**opening → recruiter dialogue → user answer → contextual follow-up →
user answer → natural transition → next topic → closing → Trace
interview review**

Trace does not interrupt after every answer.

No score cards during the interview.

Do not expose ideal answers before the user speaks.

### 7.3 STAR Mode

Purpose: build one truthful reusable behavioral story.

First establish facts.

Then train:

**Situation → Task → Action → Result → Learning**

The visible answer should not sound like a mechanical STAR template.

Use the senior-story standard from the Coach Master Prompt.

### 7.4 Minimum Mode

Purpose: preserve consistency on difficult days.

One question → one spoken answer → one correction → one repeat.

A minimum session is a successful session.

### 7.5 Listening Mode

Purpose: simulate hearing a recruiter rather than reading a
questionnaire.

Flow:

1.  Show interviewer.
2.  Play the question.
3.  Hide transcript initially.
4.  Allow replay.
5.  Allow slower playback.
6.  Allow transcript reveal.
7.  User answers.

------------------------------------------------------------------------

## 8. HR Mock Interview Behavior

A Full Recruiter Screen should feel conversational rather than like
`Question 5 / 8`.

Typical flow:

1.  Opening / brief professional small talk
2.  Background
3.  Current role
4.  Motivation
5.  Target role / career direction
6.  Role/company fit
7.  Selective experience or behavioral probe
8.  Logistics where appropriate
9.  Candidate questions
10. Closing

Do not force every interview through the same exact questions.

Typical length: 20--30 minutes.

Use approximately 5--8 primary topics plus follow-ups, not exactly eight
independent questions.

------------------------------------------------------------------------

## 9. Dynamic Follow-Ups

Follow-ups should depend on what the user actually said.

Trigger a follow-up when:

-   the answer is vague
-   ownership is unclear
-   motivation is unclear
-   an important claim needs evidence
-   the answer conflicts with known profile facts
-   career direction needs clarification
-   a useful example deserves exploration
-   the answer is too generic

Follow-up taxonomy:

-   Clarification
-   Evidence
-   Ownership
-   Motivation
-   Career Direction
-   Scope
-   Technical Depth
-   Pressure

Examples:

> "You mentioned architecture. What does that look like in your current
> role?"

> "When you say technical leadership, what kind of responsibilities do
> you want to keep?"

> "How hands-on are you technically today?"

> "What was your responsibility specifically?"

Do not turn recruiter follow-ups into deep System Design unless the
selected mode calls for it.

------------------------------------------------------------------------

## 10. Natural Recruiter Dialogue

Sophia should use short transitions so the experience does not feel like
a question database.

Examples:

-   "That makes sense. Let me ask about your current role."
-   "You mentioned architecture --- how much of your work is still
    hands-on?"
-   "Got it. And what are you looking for next?"
-   "Thanks, that's helpful context."
-   "Let's talk a little about your motivation."

Do not praise every answer.

------------------------------------------------------------------------

## 11. Question Bank

Use `content/interviews/HR_Interview_Question_Bank.md` as the primary HR
question source when available.

Preserve provenance:

-   REAL --- INTERVIEW
-   REAL --- APPLICATION
-   PREDICTED
-   CORE

Never present a predicted question as something a real company asked.

Recommended model:

``` ts
type InterviewQuestion = {
  id: string
  text: string
  source: "real_interview" | "real_application" | "predicted" | "core"
  company?: string
  role?: string
  competency: string[]
  difficulty: "core" | "follow_up" | "pressure"
  followUpRules?: FollowUpRule[]
}
```

Modes should include:

-   Random HR Interview
-   Past Interview Replay
-   Company-Specific HR
-   Minimum Practice
-   Full Recruiter Screen

------------------------------------------------------------------------

## 12. Answer Evaluation

Follow the evaluation policy from the Coach Master Prompt.

For important answers consider:

-   Content
-   Structure
-   Seniority Signal
-   Ownership
-   Leadership
-   English
-   Naturalness
-   Length

### Practice Mode

Detailed per-answer feedback is appropriate.

Show:

-   MY VERSION
-   MINIMAL CORRECTION
-   STRONG B2 VERSION

Do not automatically generate C1/C2 corporate language.

### Mock Interview Mode

Do not score each turn visibly.

At the end show a concise interview review.

Prefer qualitative scoring such as:

`Overall: 6.5 / 10`

rather than fake precision such as `35/100`.

Include:

-   top strengths
-   top improvements
-   recurring English patterns
-   professional positioning
-   interview readiness

Example:

> "Your English is sufficient for a recruiter conversation, but your
> answers become too long when you discuss technical projects."

------------------------------------------------------------------------

## 13. Error Correction

Do not correct every error.

Prioritize:

1.  meaning-changing errors
2.  errors that make communication difficult
3.  recurring errors
4.  translated-from-Russian constructions
5.  errors that materially weaken professional seniority
6.  reusable patterns

Store recurring errors when persistence is implemented.

Format:

**WRONG → CORRECT → MY PROFESSIONAL EXAMPLE**

------------------------------------------------------------------------

## 14. Uncle Eugene Hint System

The `Hint` action should invoke Uncle Eugene.

Progressive hints:

### Level 1 --- Structure

Example:

> "Think: situation → your action → result."

### Level 2 --- One useful phrase

Example:

> "Try: 'One example that comes to mind is...'"

### Level 3 --- Personal story cue

Example:

> "Your domain-migration incident could work here."

Never provide the full personalized answer before the user speaks.

------------------------------------------------------------------------

## 15. Voice and TTS

Voice is a core speaking feature, not decoration.

For MVP, browser Web Speech APIs are acceptable.

### Interviewer TTS

Provide lightweight controls:

-   Listen
-   Stop
-   Replay
-   Slower

Prefer available English voices (`en-US` / `en-GB`) without hardcoding a
browser-specific voice name.

### Answer playback

After submission, allow TTS playback of:

-   user's transcript
-   minimal correction
-   strong B2 version

Do not autoplay corrections.

### Architecture

Keep TTS behind an abstraction so browser speech synthesis can later be
replaced by a higher-quality provider without rewriting interview
components.

Prepare the architecture for future:

-   MediaRecorder
-   user audio replay
-   speech-to-text
-   server-side transcription
-   pronunciation/fluency analysis

------------------------------------------------------------------------

## 16. 4/3/2 Speaking Loop

For important HR and STAR stories support timed repetition.

Suggested adaptation:

-   Round 1 --- 2--3 minutes: meaning first
-   Round 2 --- 90 seconds: remove unnecessary detail
-   Round 3 --- 60 seconds: interview-ready summary
-   Then one unexpected follow-up

The goal is automatic retrieval, not memorization.

Do not force this loop for every question.

------------------------------------------------------------------------

## 17. STAR Story Grounding

Personal STAR stories belong under:

`content/me/star-stories/`

The primary current story is the anonymized domain / Commercial Proposal
incident defined in the Coach Master Prompt.

When migrated to structured data, preserve:

-   factual situation
-   business impact
-   systems involved
-   exact ownership
-   RESTORE
-   STABILIZE
-   EVOLVE
-   trade-off
-   result
-   learning
-   what was implemented
-   what was only proposed
-   questions the story can answer

Do not claim long-term R&D work was completed unless verified.

------------------------------------------------------------------------

## 18. No Invented Personalized Fixtures

Audit demo fixtures.

The application must not present invented examples such as fictional:

-   10× login spikes
-   p99 recovery numbers
-   36-hour incident timelines
-   zero downtime
-   projects not in the knowledge base
-   metrics not confirmed by the user

as Eugene's experience.

Generic fixtures are allowed only if clearly labeled as generic training
examples.

Personalized recommendations must be grounded in `content/me/*`.

------------------------------------------------------------------------

## 19. Session State

Mock interviews should maintain conversational state.

Recommended model:

``` ts
type InterviewSession = {
  id: string
  mode: InterviewMode
  company?: string
  targetRole?: string
  startedAt: string
  turns: InterviewTurn[]
  topicsCovered: string[]
  topicsRemaining: string[]
  detectedWeaknesses: string[]
  recurringErrors: string[]
  claimsToProbe: Claim[]
  interviewPhase:
    | "opening"
    | "background"
    | "motivation"
    | "experience"
    | "behavioral"
    | "logistics"
    | "candidate_questions"
    | "closing"
}
```

Question/follow-up selection must use session context rather than
selecting every question independently.

------------------------------------------------------------------------

## 20. UI / UX Principles

Preserve the current V2 visual language unless a task explicitly
requests redesign.

### Practice Mode

A question counter may remain.

### Mock Interview Mode

Avoid quiz-like UI such as:

`Question 5 / 8`

Prefer:

-   `Recruiter Screen`
-   `Interview in progress`
-   elapsed/approximate time
-   subtle phase progress

Do not display Trace score cards during the live mock.

Voice controls should remain lightweight:

-   Speak
-   Listen
-   Replay

Do not turn the interface into a full audio player.

------------------------------------------------------------------------

## 21. Comic / Scene Layer

The comic/character layer should support learning, not dominate it.

Use the scene model:

**SCENE → DIALOGUE → PROBLEM → USER RESPONSE → CONSEQUENCE → COACH
FEEDBACK → REPLAY**

Visual associations can reinforce:

-   recurring phrases
-   story structure
-   system concepts
-   character roles
-   memory cues

Avoid excessive animation that slows practice.

------------------------------------------------------------------------

## 22. Progress Model

Progress should eventually track useful learning signals rather than
vanity XP alone.

Potential signals:

-   HR questions practiced
-   answers repeated
-   speaking streak
-   STAR stories ready
-   recurring errors
-   active phrases
-   response length
-   retry improvement
-   mock interview readiness
-   listening transcript-reveal rate

Do not implement all metrics at once.

------------------------------------------------------------------------

## 23. Implementation Rules for Cursor

Before changing code:

1.  Inspect the current implementation.
2.  Identify reusable components.
3.  Identify hard-coded fixtures.
4.  Identify hard-coded evaluation logic.
5.  Identify where personal facts are embedded.
6.  Read `IMPLEMENTATION.md`.
7.  Read recent `CHANGELOG.md` entries.
8.  Propose the smallest coherent change.
9.  Implement incrementally.
10. Update `IMPLEMENTATION.md` and `CHANGELOG.md` when appropriate.

Prefer incremental refactoring over rewriting V2.

Do not create abstractions without a concrete use case.

------------------------------------------------------------------------

## 24. Recommended Runtime Components

Use these as conceptual boundaries, not mandatory class names:

-   `InterviewEngine`
-   `InterviewSession`
-   `QuestionBank`
-   `FollowUpSelector`
-   `CoachEvaluator`
-   `PersonalContextProvider`
-   `SpeechService`
-   `HintProvider`

Reuse existing V2 components where they already satisfy these
responsibilities.

------------------------------------------------------------------------

## 25. Implementation Priority

### Phase A --- Correctness

-   separate Practice and Mock Interview behavior
-   establish InterviewSession
-   realistic recruiter flow
-   remove invented personalized fixtures
-   ground personal content

### Phase B --- Conversation

-   dynamic follow-ups
-   natural recruiter transitions
-   session-aware topic selection
-   lightweight small talk

### Phase C --- Coaching

-   end-of-interview Trace review
-   recurring errors
-   interview readiness
-   retry comparison

### Phase D --- Personalization

-   company-specific interviews
-   past interview replay
-   richer question-bank integration
-   persistent learning state

### Phase E --- Voice

-   listening mode refinement
-   audio recording
-   transcription abstraction
-   user recording replay

Do not attempt all phases in one rewrite.

------------------------------------------------------------------------

## 26. Acceptance Scenario

A successful Full Recruiter Screen should support behavior similar to:

**Sophia**

> "Hi Eugene, thanks for joining. How are you today?"

**Eugene**

> \[spoken answer\]

**Sophia**

> "Thanks. Let's start with your background. Tell me about yourself."

**Eugene**

> \[45--90 second spoken answer\]

Sophia detects that Eugene mentioned architecture.

**Sophia**

> "You mentioned that you're moving toward Systems and Solution
> Architecture. What is driving that direction?"

**Eugene**

> \[answer\]

**Sophia**

> "And how technical is your current Engineering Manager role?"

The conversation continues naturally.

Trace remains silent during the interview.

At the end:

### TRACE --- INTERVIEW REVIEW

**Overall: 6.5 / 10**

Strong:

-   credible technical background
-   understandable career progression
-   clear current engineering scope

Improve:

-   architecture direction still sounds broad
-   several answers are too long
-   recurring article/preposition errors

Interview readiness:

> "Your English is sufficient for a recruiter conversation. The main
> risk is response speed and concise motivation answers rather than
> grammar."

------------------------------------------------------------------------

## 27. Non-Goals

Do not:

-   redesign V2 without an explicit task
-   build deep System Design now
-   generate fictional personal stories
-   turn the product into a vocabulary application
-   expose ideal answers before the user speaks
-   overcorrect grammar
-   require C1/C2 English
-   make every question behavioral
-   make every session identical
-   turn Sophia into the coach
-   turn Trace into the interviewer
-   make Uncle Eugene answer on the user's behalf
-   optimize for gamification over speaking practice

------------------------------------------------------------------------

## 28. Definition of Product Success

The product succeeds when the user can:

1.  understand recruiter questions by ear;
2.  answer without mentally translating every sentence;
3.  explain current role and career direction clearly;
4.  handle follow-up questions without a memorized script;
5.  tell 6--8 truthful STAR stories in 60--120 seconds;
6.  communicate ownership and trade-offs credibly;
7.  recover naturally when English is imperfect;
8.  complete a 20--30 minute international recruiter screen with calm
    technical authority.

The application exists to make English something the user **uses**, not
something the user periodically tries to study.
