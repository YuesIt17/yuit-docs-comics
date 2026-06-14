# The Staff Engineering Team

An AI-native communication platform for software engineers. Practice operational English fluency through interactive comic-based simulations, Trace AI coaching, and engineering conversation training.

## Features (MVP)

- **HR Interview Episode** — "Tell Me About Yourself" (8 scenes)
- **JSON-driven comic engine** — layered backgrounds, characters, speech bubbles
- **Trace AI Coach** — score, feedback, Natural + Staff-level rewrites
- **4-3-2 Speaking Practice** — timed compression rounds
- **STAR Framework** — behavioral answer builder
- **Collocation packs** — engineering phrase patterns with visual metaphors
- **Configurable protagonist** — default Eugene, switch to Alex in Settings
- **Hero gallery** — meet Uncle Eugene, Trace, Sophia, and the team

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Zustand (persisted to localStorage)
- OpenAI gpt-4o-mini (optional)

## Getting Started

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to `/episodes/hr-intro`.

### API Mocking (MSW)

By default, local dev uses **[MSW](https://mswjs.io/)** to mock `POST /api/trace/analyze` — no OpenAI key required.

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_MOCKING` | `enabled` in `.env.local.example` | MSW intercepts Trace API in the browser |
| `OPENAI_API_KEY` | — | Live Trace analysis (set `NEXT_PUBLIC_API_MOCKING=disabled`) |
| `TRACE_USE_MOCK` | — | Force server route mock even with API key |

**Mock scenarios** (type as your answer):

- `[mock:error]` — simulates API failure (500)
- `[mock:slow]` — simulates 3s latency

### HR dialog fixtures (24 scenarios)

When `NEXT_PUBLIC_API_MOCKING=enabled`, each scene shows **HR Mock Answers** picker with weak / average / strong samples.

| Scene | Topic | Use case |
|-------|-------|----------|
| 01 | Tell Me About Yourself | introduction |
| 02 | Systems & Scale | technical_depth |
| 03 | Business Impact | impact |
| 04 | Biggest Challenge | behavioral_star |
| 05 | Failure Story | failure |
| 06 | Leadership & Influence | leadership |
| 07 | Why This Company | motivation |
| 08 | Closing Pitch | compression |

**Shortcuts:** `[mock:weak]` · `[mock:average]` · `[mock:strong]` · `[mock:scene-04:strong]`

Each fixture includes: sample answer, Trace analysis, and Sophia follow-up dialogue.

Fixtures live in `src/mocks/fixtures/hr-dialogs.ts`.

To use live OpenAI instead, create `.env.local`:

```
NEXT_PUBLIC_API_MOCKING=disabled
OPENAI_API_KEY=sk-...
```

## Project Structure

```
src/
├── app/                    # Next.js routes
├── components/             # UI, comic, coaching, practice
├── content/                # Episode JSON, characters, collocations
├── lib/                    # Episode engine, Trace prompts & mocks
├── mocks/                  # MSW handlers (browser + node)
└── store/                  # Zustand state
```

## Episode Authoring

Episodes live in `src/content/episodes/`. Each scene defines:

- Background and character layers (position, pose)
- NPC dialogue with `{protagonistName}` placeholders
- Interaction config (prompt, collocations, Trace context)

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_MOCKING` | No | `enabled` = MSW mocks Trace API in browser (default for dev) |
| `OPENAI_API_KEY` | No | Live Trace via OpenAI when mocking is disabled |
| `TRACE_USE_MOCK` | No | Server-side mock fallback override |

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — ESLint

## License

Private — Coraium / Eugene Yulov
