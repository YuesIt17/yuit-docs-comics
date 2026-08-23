# The Staff Engineering Team — описание реализации (v0.1.0)

> AI-native платформа для практики operational English через интерактивные комикс-симуляции, Trace AI коучинг и тренировку инженерных интервью.

**Версия:** 0.1.0 (MVP)  
**Стек:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · Zustand · Zod · OpenAI · MSW

---

## Содержание

1. [Обзор продукта](#обзор-продукта)
2. [История разработки](#история-разработки)
3. [Архитектура высокого уровня](#архитектура-высокого-уровня)
4. [Пользовательский сценарий (User Flow)](#пользовательский-сценарий-user-flow)
5. [Структура проекта по папкам](#структура-проекта-по-папкам)
6. [Детальное описание модулей](#детальное-описание-модулей)
7. [Контент и данные](#контент-и-данные)
8. [Trace AI — анализ ответов](#trace-ai--анализ-ответов)
9. [Моки и офлайн-режим](#моки-и-офлайn-режим)
10. [Состояние приложения (Zustand)](#состояние-приложения-zustand)
11. [Деплой и окружение](#деплой-и-окружение)
12. [Ограничения MVP и планы](#ограничения-mvp-и-планы)

---

## Обзор продукта

**The Staff Engineering Team** — веб-приложение для инженеров, которое обучает английскому в профессиональном контексте через:

| Функция | Описание |
|---------|----------|
| **HR Interview Episode** | Эпизод «Tell Me About Yourself» — 8 последовательных сцен без ветвления |
| **Comic Engine** | JSON-driven движок сцен: фоны, персонажи, speech bubbles, анимации |
| **Trace AI Coach** | Оценка ответа (0–100), breakdown по 5 осям, Natural + Staff rewrites |
| **4-3-2 Speaking Practice** | Таймерные раунды сжатия речи: 4 → 3 → 2 минуты |
| **STAR Framework** | Карточка-подсказка для behavioral-ответов |
| **Collocation Packs** | Инженерные фразы с визуальными метафорами |
| **Hero Gallery** | Галерея персонажей команды |
| **Settings** | Имя протагониста, аватар, background для Trace, сброс прогресса |

Главная страница (`/`) редиректит на `/episodes/hr-intro`.

---

## История разработки

| Коммит | Описание |
|--------|----------|
| `619d73a` | **feat: init project** — базовый каркас Next.js 16, episode engine, UI, Trace API, контент hr-intro |
| `759498a` | **fix: heros** — исправления отображения героев |
| `9b593e1` | **feat: add github pages** — static export, basePath, CI/CD workflow |
| `095cab4` | **fix: visible heros** — видимость портретов персонажей |
| `fa4d60d` | **fix: mocks answers** — HR dialog fixtures (24 сценария), MockAnswerPicker |
| `afcade0` | **fix** — доработки моков и UI |

Подробнее — в [CHANGELOG.md](./CHANGELOG.md).

---

## Архитектура высокого уровня

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Client)                          │
├──────────────┬──────────────────────────────┬───────────────────┤
│   Sidebar    │      Episode Player          │  Trace Coach      │
│  (paths,     │  ┌────────────────────────┐  │  Panel            │
│   progress,  │  │ SceneRenderer (comic)  │  │  (score, feedback,│
│   Eugene tip)│  ├────────────────────────┤  │   STAR, collocs)  │
│              │  │ DialoguePanel          │  │                   │
│              │  │ (transcript, input)    │  │                   │
│              │  ├────────────────────────┤  │                   │
│              │  │ Speaking432 (optional) │  │                   │
│              │  └────────────────────────┘  │                   │
├──────────────┴──────────────────────────────┴───────────────────┤
│  Zustand Stores: episode · progress · settings · trace           │
│  localStorage: progress, settings                                │
└───────────────────────────┬─────────────────────────────────────┘
                            │ POST /api/trace/analyze
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│  Trace API Route (Next.js)                                       │
│  ├─ OpenAI gpt-4o-mini (live)                                   │
│  ├─ buildMockTraceAnalysis (fallback)                           │
│  └─ Rate limit + in-memory cache                                │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │ MSW intercept (local dev)
┌─────────────────────────────────────────────────────────────────┐
│  Mock Layer: MSW handlers · hr-dialogs fixtures · client mock   │
└─────────────────────────────────────────────────────────────────┘
```

### Ключевые архитектурные решения

1. **Content-driven episodes** — сцены описываются в JSON, валидируются Zod при загрузке.
2. **Static export** — `output: "export"` для GitHub Pages; API route работает только при `next dev` / server mode.
3. **Dual mock strategy** — MSW в локальной разработке; in-process mock на GitHub Pages (service worker не работает на subpath).
4. **Разделение session vs persistent state** — прогресс в localStorage; dialogue log и Trace analysis — в памяти сессии.

---

## Пользовательский сценарий (User Flow)

```
/  →  redirect  →  /episodes/hr-intro
                         │
                         ▼
              EpisodePlayer загружает JSON
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
   Просмотр scripted dialogue     Кнопка "Next line"
   (Sophia → Protagonist → ...)         │
         │                               │
         └───────────────┬───────────────┘
                         ▼
              Script complete → show input
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   MockAnswerPicker  textarea      Submit to Trace
   (weak/avg/strong)                    │
                         ┌─────────────┴─────────────┐
                         ▼                           ▼
                  Trace analysis              Sophia follow-up
                  (score, rewrites)           в dialogue log
                         │
                         ▼
              "Continue episode" → next scene
                         │
                         ▼
              Scene 8 complete → Completion screen
              (Replay / Meet the Heroes)
```

**Условие перехода между сценами:** `advanceCondition: "analysis_submitted"` — пользователь должен отправить ответ и получить анализ Trace.

---

## Структура проекта по папкам

```
yuit-docs-comics/
├── .github/workflows/
│   └── deploy-pages.yml      # CI: build + deploy на GitHub Pages
├── docs/
│   ├── design/
│   │   └── episode-authoring.md   # Гайд по созданию эпизодов
│   ├── CHANGELOG.md               # Release notes
│   └── IMPLEMENTATION.md          # Этот документ
├── public/
│   ├── characters/           # PNG спрайты персонажей
│   ├── backgrounds/          # PNG фоны сцен
│   ├── ui/                   # Референс-мокапы
│   ├── mockServiceWorker.js  # MSW service worker
│   └── .nojekyll             # Для GitHub Pages
├── scripts/
│   └── extract-character-assets.mjs  # Утилита извлечения ассетов
└── src/
    ├── app/                  # Next.js App Router — маршруты
    ├── components/           # React-компоненты UI
    ├── content/              # Статический контент (JSON)
    ├── lib/                  # Бизнес-логика, движок, Trace
    ├── mocks/                # MSW + HR fixtures
    └── store/                # Zustand stores
```

---

## Детальное описание модулей

### `src/app/` — маршруты (Next.js App Router)

| Файл | Назначение |
|------|------------|
| `layout.tsx` | Root layout: шрифты Geist, dark theme, `MockProvider` |
| `page.tsx` | Редирект `/` → `/episodes/hr-intro` |
| `globals.css` | Tailwind v4, CSS-переменные темы (panel, accent colors) |
| `episodes/[episodeId]/page.tsx` | Server Component: загрузка эпизода, `generateStaticParams` |
| `heroes/page.tsx` | Галерея персонажей из `roster.json` |
| `settings/page.tsx` | Настройки протагониста, background, сброс прогресса |
| `api/trace/analyze/route.ts` | POST endpoint: OpenAI / mock, rate limit, cache |

### `src/components/` — UI-слой

#### `episode/` — ядро игрового процесса

| Компонент | Роль |
|-----------|------|
| `EpisodePlayer.tsx` | **Оркестратор эпизода**: state machine сцен, submit → Trace, continue, completion |
| `EpisodeLayout.tsx` | Layout эпизода: Sidebar + main + TraceCoachPanel + BottomMissionBar |
| `DialoguePanel.tsx` | Табы Dialogue / Notes / Transcript + форма ответа |

#### `scene/` — comic engine (рендер сцен)

| Компонент | Роль |
|-----------|------|
| `SceneRenderer.tsx` | Композиция сцены: фон, персонажи, bubbles, мета-оверлей |
| `CharacterSprite.tsx` | PNG персонажа с position/scale/flip/framing |
| `SpeechBubble.tsx` | Анимированный bubble (Framer Motion) |
| `InterviewRoomBackground.tsx` | CSS-composed фон интервью-комнаты |
| `InterviewTable.tsx` | Стол между персонажами |

#### `coaching/` — Trace AI панель

| Компонент | Роль |
|-----------|------|
| `TraceCoachPanel.tsx` | Правая панель в эпизоде: score ring, feedback, versions |
| `TraceScoreRing.tsx` | Круговой индикатор оценки |
| `FeedbackCard.tsx` | Strengths + improvements |
| `VersionCompare.tsx` | Natural vs Staff rewrite |
| `StarFrameworkCard.tsx` | STAR подсказка (Situation/Task/Action/Result) |
| `CollocationChips.tsx` | Чипы коллокаций с detected-state |

#### `dialogue/` — диалог и ввод

| Компонент | Роль |
|-----------|------|
| `Transcript.tsx` | Лента сообщений с speaker names |
| `UserAnswerForm.tsx` | Prompt, hints, textarea, submit |
| `MockAnswerPicker.tsx` | Picker weak/average/strong (при MSW enabled) |
| `DialogueTabs.tsx` | (legacy) табы — используется через `ui/Tabs` |

#### `practice/` — speaking practice

| Компонент | Роль |
|-----------|------|
| `SpeakingPracticeCard.tsx` | Обёртка над Speaking432 |
| `Speaking432.tsx` | 3 раунда: 4/3/2 минуты |
| `TimerRound.tsx` | Таймер + textarea + save |
| `RecordButtonStub.tsx` | Заглушка записи голоса (будущее) |

#### `heroes/` — галерея

| Компонент | Роль |
|-----------|------|
| `HeroCard.tsx` | Карточка персонажа с bio и traits |
| `HeroPortrait.tsx` | Круглый аватар из asset registry |

#### `layout/` — оболочка приложения

| Компонент | Роль |
|-----------|------|
| `Sidebar.tsx` | Learning paths, XP/level, progress bars, Eugene tip |
| `BottomMissionBar.tsx` | Step counter, mission title, reward label |
| `AppShell.tsx` | Альтернативный shell (TracePanel вместо TraceCoachPanel) |
| `TracePanel.tsx` | Вариант Trace panel с HeroPortrait |

#### `ui/` — примитивы

`Button.tsx` · `Badge.tsx` · `Tabs.tsx` · `ProgressBar.tsx`

#### `providers/`

| Компонент | Роль |
|-----------|------|
| `MockProvider.tsx` | Инициализация MSW / индикатор mock mode |

### `src/lib/` — бизнес-логика

#### `episode-engine/` — движок эпизодов

| Файл | Назначение |
|------|------------|
| `types.ts` | Zod-схемы + TypeScript типы (Episode, Scene, TraceAnalysis, Progress) |
| `loadEpisode.ts` | Реестр эпизодов, `loadEpisode()`, `listEpisodes()` |
| `sceneResolver.ts` | `getCurrentScene`, `canAdvance`, placeholders, display names |

#### `scene/` — layout сцен

| Файл | Назначение |
|------|------------|
| `mapLayers.ts` | Конвертация JSON layers → CharacterPlacement |
| `sceneLayout.ts` | Interview room layout, bubble placement, framing |

#### `assets/`

| Файл | Назначение |
|------|------------|
| `registry.ts` | Пути к PNG, resolveCharacterAsset, resolveBackgroundAsset |

#### `trace/` — Trace AI

| Файл | Назначение |
|------|------------|
| `prompts.ts` | System prompt + user prompt builder для OpenAI |
| `parseTraceResponse.ts` | Zod-валидация ответа LLM |
| `mock.ts` | `buildMockTraceAnalysis()` — эвристический скоринг + fixtures |

#### Прочее

| Файл | Назначение |
|------|------------|
| `content.ts` | Загрузка roster, collocation packs, tips |
| `basePath.ts` | `NEXT_PUBLIC_BASE_PATH` для GitHub Pages |
| `utils.ts` | `cn()` — classnames helper |

### `src/store/` — Zustand

| Store | Persist | Назначение |
|-------|---------|------------|
| `episodeStore.ts` | ❌ | Текущая сцена, dialogue log, hint flag |
| `progressStore.ts` | ✅ localStorage | XP, level, scene progress, notes, 432 rounds |
| `settingsStore.ts` | ✅ localStorage | userName, avatarKey, userBackground |
| `traceStore.ts` | ❌ | analysis, loading, error, lastSceneId |

### `src/mocks/` — мок-слой

| Файл | Назначение |
|------|------------|
| `index.ts` | `isMockingEnabled()`, `useClientMock()`, `initMocks()` |
| `browser.ts` | MSW worker setup |
| `server.ts` | MSW server (SSR/tests) |
| `handlers.ts` | POST `/api/trace/analyze` handler |
| `fixtures/hr-dialogs.ts` | 24 fixture (8 scenes × 3 quality levels) |

---

## Контент и данные

### Эпизоды — `src/content/episodes/`

**`hr-intro.json`** — референсный эпизод:

- 8 сцен (`scene-01` … `scene-08`)
- Каждая сцена: `background`, `layers[]`, `dialogue[]`, `interaction`, `uncleEugeneTip`
- Placeholder `{protagonistName}` в текстах NPC
- `collocationPackId: "hr-pack-01"`

### Персонажи — `src/content/characters/roster.json`

| ID | Имя | Роль |
|----|-----|------|
| `uncle_eugene` | Uncle Eugene | Narrator / mentor tips |
| `trace` | Trace | AI coach |
| `protagonist` | Eugene (configurable) | Player avatar |
| `sophia` | Sophia | HR interviewer NPC |
| `archi` | Archi | Architect (future episodes) |
| `reli` | Reli | Reliability guardian (future) |

### Collocations — `src/content/collocations/hr-pack-01.json`

Фразы с `phrase`, `meaning`, `visualMetaphor`, `examples`.  
Метафоры отображаются как иконки на сцене (⚡ bottleneck, 📈 scalability, …).

### Tips — `src/content/tips/uncle-eugene.json`

Массив советов Uncle Eugene (используется через `getRandomTip()`).

---

## Trace AI — анализ ответов

### Request (POST `/api/trace/analyze`)

```json
{
  "episodeId": "hr-intro",
  "sceneId": "scene-01",
  "promptContext": "...",
  "userAnswer": "...",
  "collocations": ["measurable impact", "operational efficiency"],
  "userBackground": "Staff Engineer, 10+ years..."
}
```

### Response (`TraceAnalysis`)

```typescript
{
  score: number;                    // 0–100
  breakdown: { clarity, structure, vocabulary, fluency, impact };
  strengths: string[];
  improvements: string[];
  naturalVersion: string;
  staffVersion: string;
  detectedCollocations: string[];
  feedback?: string;
  recruiterFollowUp?: string;       // Sophia follow-up
}
```

### Режимы работы

| Режим | Условие | Поведение |
|-------|---------|-----------|
| **Live OpenAI** | `OPENAI_API_KEY` + mocking disabled | gpt-4o-mini, JSON mode, repair retry |
| **Server mock** | Нет ключа или `TRACE_USE_MOCK=true` | `buildMockTraceAnalysis()` |
| **MSW** | `NEXT_PUBLIC_API_MOCKING=enabled`, no basePath | Intercept в browser |
| **Client mock** | mocking enabled + basePath (GitHub Pages) | In-process в EpisodePlayer |

---

## Моки и офлайн-режим

### HR Dialog Fixtures (`hr-dialogs.ts`)

- **24 сценария:** 8 сцен × 3 уровня (weak / average / strong)
- Каждый fixture: `userAnswer`, `analysis`, `sophiaFollowUp`
- **Shortcuts в textarea:**
  - `[mock:weak]` · `[mock:average]` · `[mock:strong]`
  - `[mock:scene-04:strong]` — конкретная сцена
  - `[mock:error]` · `[mock:slow]` — симуляция ошибки / latency

### MockAnswerPicker

UI-кнопки для быстрого выбора fixture-ответа по текущей сцене.

### MSW vs Client Mock

```typescript
// src/mocks/index.ts
export function useClientMock(): boolean {
  return isMockingEnabled() && Boolean(basePath);
}
```

На GitHub Pages (`NEXT_PUBLIC_BASE_PATH=/yuit-docs-comics`) MSW service worker не используется — mock выполняется напрямую в `EpisodePlayer`.

---

## Состояние приложения (Zustand)

### Жизненный цикл эпизода

```
mount EpisodePlayer
  → resetEpisode(episodeId)
  → initEpisode(episodeId)          // progressStore
  → restore currentSceneIndex       // from localStorage

scene change
  → setScriptLineIndex(0)
  → clear answerDraft
  → auto-add dialogue lines

submit answer
  → addDialogue (user)
  → fetch Trace
  → setAnalysis + markSceneSubmitted
  → addDialogue (Sophia follow-up)

continue
  → setSceneIndex(next)
  → setAnalysis(null)
```

### localStorage keys

| Key | Store | Данные |
|-----|-------|--------|
| `set-progress` | progressStore | episodes, XP, level, scene progress, notes |
| `set-settings` | settingsStore | userName, avatarKey, userBackground |

---

## Деплой и окружение

### Локальная разработка

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

### GitHub Pages

- Workflow: `.github/workflows/deploy-pages.yml`
- Build: `NEXT_PUBLIC_BASE_PATH=/yuit-docs-comics`, `NEXT_PUBLIC_API_MOCKING=enabled`
- Output: static export в `out/`
- Deploy: GitHub Pages artifact

### Переменные окружения

| Variable | Default | Описание |
|----------|---------|----------|
| `NEXT_PUBLIC_API_MOCKING` | `enabled` | MSW / client mock |
| `NEXT_PUBLIC_BASE_PATH` | `""` | Base path для GitHub Pages |
| `OPENAI_API_KEY` | — | Live Trace analysis |
| `TRACE_USE_MOCK` | — | Force server-side mock |

### next.config.ts

```typescript
output: "export"          // Static HTML export
trailingSlash: true       // /episodes/hr-intro/
images: { unoptimized: true }
basePath / assetPrefix   // when NEXT_PUBLIC_BASE_PATH set
```

---

## Ограничения MVP и планы

### Реализовано

- [x] Один эпизод (hr-intro, 8 сцен)
- [x] Linear flow без ветвления
- [x] Trace mock + optional OpenAI
- [x] 4-3-2 practice UI
- [x] STAR framework card
- [x] Collocation tracking
- [x] Progress persistence
- [x] GitHub Pages deploy
- [x] 24 HR dialog fixtures

### Не реализовано / заглушки

- [ ] Голосовая запись (`RecordButtonStub`)
- [ ] Дополнительные learning paths (locked в Sidebar)
- [ ] Branching scenes
- [ ] Backend / auth / cloud sync
- [ ] Sprite sheets / pose variants (используются static PNG)
- [ ] Музыка сцен (`music: null`)

### Добавление нового эпизода

1. Создать `src/content/episodes/my-episode.json`
2. Зарегистрировать в `loadEpisode.ts`
3. Добавить в Sidebar + `generateStaticParams`
4. `npm run build` — Zod validation

См. [episode-authoring.md](./design/episode-authoring.md).

---

## Диаграмма зависимостей компонентов

```
EpisodePage
  └── EpisodePlayer
        ├── EpisodeLayout
        │     ├── Sidebar
        │     ├── TraceCoachPanel
        │     │     ├── TraceScoreRing
        │     │     ├── FeedbackCard
        │     │     ├── VersionCompare
        │     │     ├── StarFrameworkCard
        │     │     └── CollocationChips
        │     └── BottomMissionBar
        ├── SceneRenderer
        │     ├── InterviewRoomBackground
        │     ├── CharacterSprite × N
        │     ├── InterviewTable
        │     └── SpeechBubble
        ├── DialoguePanel
        │     ├── Transcript
        │     └── UserAnswerForm
        │           └── MockAnswerPicker
        └── SpeakingPracticeCard
              └── Speaking432
                    └── TimerRound
```

---

*Документ актуален для версии 0.1.0. Обновляйте при добавлении эпизодов, API или изменении архитектуры.*
