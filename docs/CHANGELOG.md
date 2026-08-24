# Changelog — The Staff Engineering Team

Формат основан на [Keep a Changelog](https://keepachangelog.com/).  
Версионирование следует [Semantic Versioning](https://semver.org/).

---

## [0.4.0] — 2026-08-24

V2.4: role profile / resume context + HR session initialization fix.

### Added
- Target profile selector: Technical Engineering Manager · Solution Architect
- Resume markdown sources parsed into `ResumeRoleContext` (`engineering-manager` / `architecture`)
- Profile-aware Trace feedback, Strong B2 framing, and Sophia follow-ups
- Profile persisted in `settingsStore`; switching mid-session confirms and restarts from Q1
- Profile wired into Practice + Mock Interview session state

### Fixed
- HR Practice Q1 no longer shows a mid-intro “Interesting… impact…” follow-up
- New Practice sessions always start at scene 0 (no silent stale resume from progress index)
- `getInterviewerQuestion` uses the opening NPC line, not scripted later follow-ups

### Changed
- `scene-01` content aligned to “Tell me about yourself”
- Trace analyze API accepts `targetProfileId` and includes resume positioning context

### Unchanged
- V2.2 voice / reset / correction safety
- Browser STT/TTS; no external TTS provider

---

## [0.3.1] — 2026-08-24

V2.2 Practice UX: session reset, voice controls, Trace correction safety.

### Added
- `Reset session` on HR Practice (confirm → first question; voice prefs unchanged)
- Voice Settings popover: English voices, rate 0.75 / 1.0 / 1.15, Preview voice
- Persist speech voice + rate in `settingsStore` / localStorage
- `Listen to my answer` in the answer composer before Trace submit
- `answerTransform` helpers + focused Node tests for cosmetic / insufficient / grounding gates

### Changed
- Minimal correction UI: cosmetic-only diffs show “No meaningful correction needed”
- Strong B2: no fabricated career content; insufficient answers get coaching prompt instead
- Trace mock + live API sanitize transformations; prompt rules updated for grounding
- Trace debrief: insufficient state instead of arbitrary identical axis scores

### Unchanged
- Core Practice / Mock Interview flow and dark V2 visual language
- Browser STT; no external TTS provider

---

## [0.3.0] — 2026-08-23

V2.1 P0: HR Mock Interview Mode separated from Practice Mode + verified personal grounding.

### Added
- `/v2/practice/hr/mock` — full recruiter screen simulation (Trace silent until end)
- `InterviewSession` store + thin interview engine (phases, turns, short follow-up nudge)
- End-of-interview Trace review (overall / strong / improve / English / readiness)
- Verified `content/me/profile.json`, `career.json`, `hr-context.json`
- `content/interviews/hr-core-bank.json` + question bank notes (CORE provenance)
- Home CTAs: HR Practice vs HR Mock Interview

### Changed
- Episode protagonist positioning → Technical Engineering Manager / architecture direction
- Demo STAR cues removed from `content/me/stories.json`
- HR dialog fixtures marked `GENERIC_DEMO` (not personal facts)
- Settings background placeholder softened toward TEM positioning

### Unchanged
- Practice Mode coaching loop at `/v2/practice/hr`
- Browser STT/TTS and Listening Mode
- V1 routes

---

## [0.2.2] — 2026-08-23

V2 practice: mentor progressive hints + browser TTS playback + Listening Mode.

### Added
- Progressive Uncle Eugene hints (structure → phrase → personal story cue from `content/me`)
- `src/content/me/stories.json` — minimal story bank for Level 3 cues
- TTS abstraction: `browserSpeechSynthesizer` + `useSpeechSynthesis`
- Interviewer Listen / Stop / Replay / Slower on Sophia questions
- Listening Mode: hear first, show transcript on demand
- Trace debrief Listen for My version / Minimal correction / Strong B2
- Future-ready `recordingTypes.ts` for MediaRecorder (not wired to UI)

### Changed
- Compression practice rounds: ~2.5 min → 90s → 60s
- Hint no longer dumps raw tip chips; mentor card instead

### Unchanged
- V1 routes and Trace API schemas
- Conversation-first practice layout

---

## [0.2.1] — 2026-08-23

V2 HR Practice: conversation-first interview UX + browser voice transcription MVP.

### Added
- Asymmetric dialogue exchange (Sophia left / protagonist right)
- Unified answer pipeline: typed · voice · mock → same Trace submit
- `useSpeechTranscription` + browser `SpeechRecognition` abstraction
- Voice controls: Start speaking / Stop, interim transcript, graceful fallbacks
- Mock answer picker gated behind `NEXT_PUBLIC_API_MOCKING`
- Optional «Practice compression» (4-3-2) instead of always-on card

### Changed
- Primary question shown once in Sophia bubble (comic scene collapsed by default)
- Trace debrief appears below the conversation after submit
- Try Again reopens composer seeded with previous answer
- Continue may surface recruiter follow-up before advancing

### Unchanged
- V1 routes and stores
- Trace API / mock analysis pipeline

---

## [0.2.0] — 2026-08-23

V2 preview: simplified Professional English Interview Coach UX alongside preserved V1.

### Added

#### V2 Route Namespace
- `/v2` — Home: target roles, today's practice, speaking readiness, minutes goal
- `/v2/practice/hr` — HR interview practice (reuses `hr-intro` episode engine)
- `/v2/stories`, `/v2/progress` — stubs for v0.3.0
- `V2Navigation`, `V2PracticeLayout`, `V2PracticeSession`, `V2QuestionPanel`, `V2TraceDebrief`
- Collapsible scene preview on mobile; full scene on desktop

#### V2 State & Config
- `src/config/features.ts` — typed feature flags
- `src/store/v2ProgressStore.ts` — separate `set-progress-v2` localStorage key
- Simplified progress: track completion, speaking readiness, daily minutes

#### Trace Debrief (V2 presentation)
- Post-answer review flow: Try Again / Next Question
- Neutral labels: Content, Structure, Seniority, English, Naturalness
- `staffVersion` displayed as "Interview-ready version"

### Unchanged
- V1 routes (`/episodes/hr-intro`, `/heroes`, `/settings`) fully preserved
- V1 localStorage keys (`set-progress`, `set-settings`) untouched
- Episode engine, Trace API, mock infrastructure reused

---

## [0.1.0] — 2026-08-23

Первый MVP-релиз. Интерактивная платформа для практики operational English через комикс-симуляции HR-интервью.

### Added

#### Ядро приложения
- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4
- Static export (`output: "export"`) для деплоя на GitHub Pages
- Dark theme UI с Geist fonts
- Root redirect `/` → `/episodes/hr-intro`

#### Episode Engine
- JSON-driven движок эпизодов с Zod-валидацией
- Эпизод **hr-intro** — «Tell Me About Yourself», 8 сцен
- Linear flow: scripted dialogue → user response → Trace analysis → next scene
- Placeholder `{protagonistName}` для персонализации
- Uncle Eugene tips на каждой сцене
- Completion screen с replay и переходом к Heroes

#### Comic Scene Renderer
- `SceneRenderer` с Framer Motion transitions
- Composed interview room layout (фон + стол + персонажи)
- Character sprites с position/scale/flip/framing
- Speech bubbles для Sophia, protagonist, Trace
- Live preview ответа пользователя в bubble протагониста
- Visual metaphor tags для collocations
- Scene meta overlay (episode title, difficulty, scene counter)

#### Trace AI Coach
- POST `/api/trace/analyze` — OpenAI gpt-4o-mini integration
- Score 0–100 + breakdown (clarity, structure, vocabulary, fluency, impact)
- Natural + Staff level rewrites
- Strengths / improvements feedback
- Sophia recruiter follow-up после анализа
- Rate limiting (20 req/hour per IP) + in-memory cache
- JSON repair retry при invalid LLM response

#### Coaching UI
- `TraceCoachPanel` — правая панель в эпизоде
- TraceScoreRing, FeedbackCard, VersionCompare
- STAR Framework card
- Collocation chips с detected-state

#### Speaking Practice
- 4-3-2 method: 4 min → 3 min → 2 min compression rounds
- TimerRound с save в progress store
- Staff hint на финальном раунде
- RecordButtonStub (заглушка для будущей записи)

#### Dialogue & Input
- DialoguePanel с табами: Dialogue / Notes / Transcript
- UserAnswerForm с prompt, hints, textarea
- Persistent episode notes (localStorage)

#### Mock Layer (MSW)
- MSW 2.x для intercept `POST /api/trace/analyze`
- `MockProvider` — инициализация worker + status badge
- `buildMockTraceAnalysis()` — эвристический скоринг без OpenAI
- Client-side mock fallback для GitHub Pages (subpath)
- Mock shortcuts: `[mock:error]`, `[mock:slow]`

#### HR Dialog Fixtures
- 24 сценария: 8 scenes × weak/average/strong
- Полные ответы + Trace analysis + Sophia follow-up
- `MockAnswerPicker` UI для быстрого выбора
- Shortcuts: `[mock:weak]`, `[mock:average]`, `[mock:strong]`, `[mock:scene-XX:quality]`

#### Content
- `hr-intro.json` — 8-scene HR interview episode
- `roster.json` — 6 characters (Uncle Eugene, Trace, Sophia, Protagonist, Archi, Reli)
- `hr-pack-01.json` — collocation pack с visual metaphors
- `uncle-eugene.json` — mentor tips

#### Characters & Assets
- PNG sprites в `public/characters/`
- Background images в `public/backgrounds/`
- Asset registry с basePath support
- `extract-character-assets.mjs` script

#### Heroes Gallery
- `/heroes` — grid карточек персонажей
- HeroCard с bio, traits, color accent
- HeroPortrait — reusable avatar component

#### Settings
- `/settings` — имя протагониста, avatar (eugene/alex)
- Optional user background для Trace personalization
- Reset episode progress / reset all progress

#### State Management (Zustand)
- `episodeStore` — session state (scene, dialogue log)
- `progressStore` — persisted progress (XP, scenes, notes, 432 rounds)
- `settingsStore` — persisted user preferences
- `traceStore` — Trace analysis session state

#### Layout & Navigation
- Sidebar: learning paths (1 active, 4 locked), XP/level, skill progress bars
- BottomMissionBar: step counter, mission title, reward
- Header с link на Settings

#### Deployment
- GitHub Actions workflow: build + deploy to Pages
- `NEXT_PUBLIC_BASE_PATH=/yuit-docs-comics`
- `.nojekyll` для корректной работы `_next` assets

### Fixed

- **Heroes visibility** — исправлено отображение портретов персонажей (`759498a`, `095cab4`)
- **Mock answers** — доработаны HR fixtures и MockAnswerPicker (`fa4d60d`, `afcade0`)

### Technical Notes

- API route не доступен на static GitHub Pages — используется client mock
- Прогресс хранится только в localStorage (нет cloud sync)
- Один зарегистрированный эпизод; остальные paths locked в UI
- Pose variants в JSON не используются — static PNG per character

---

## Roadmap (не в v0.1.0)

- [ ] Эпизоды: Startup Conversations, Architecture Reviews, Technical Leadership
- [ ] Голосовая запись и speech-to-text
- [ ] Branching dialogue trees
- [ ] Sprite sheets с pose variants
- [ ] Backend + user accounts + cloud progress
- [ ] Mobile-responsive scene layout improvements

---

[0.1.0]: https://github.com/your-org/yuit-docs-comics/releases/tag/v0.1.0
