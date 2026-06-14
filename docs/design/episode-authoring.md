# Episode Authoring Guide

Episodes are JSON files in `src/content/episodes/`.

## Schema

See `hr-intro.json` for the reference episode. Key fields:

- `scenes[]` — sequential scenes (no branching in MVP)
- `layers[]` — character sprites positioned with `{ x, y, scale }`
- `dialogue[]` — NPC lines; use `{protagonistName}` for personalization
- `interaction` — user prompt, collocations, Trace context

## Adding a New Episode

1. Create `src/content/episodes/my-episode.json`
2. Register in `src/lib/episode-engine/loadEpisode.ts`
3. Add route to sidebar in `src/components/layout/Sidebar.tsx`
4. Run `npm run build` — Zod validates on import

## Collocations

Link episodes to packs via `collocationPackId`. Packs live in `src/content/collocations/`.

## Assets

- Backgrounds: CSS gradients (MVP) or `public/backgrounds/{id}.webp`
- Sprites: `public/sprites/{characterId}/{pose}.webp`
- Character registry: `src/content/characters/roster.json`
