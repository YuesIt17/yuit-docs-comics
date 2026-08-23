# Changelog — The Staff Engineering Team

Формат основан на [Keep a Changelog](https://keepachangelog.com/).  
Версионирование следует [Semantic Versioning](https://semver.org/).

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
