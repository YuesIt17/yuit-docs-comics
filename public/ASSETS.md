# Static assets

Place pre-generated PNG files here. The app loads them via `next/image` — **no runtime image generation**.

## Characters (`/public/characters/`)

| File | Character |
|------|-----------|
| `uncle-eugene.png` | Uncle Eugene (mentor) |
| `trace.png` | Trace AI coach |
| `hr-recruiter.png` | Sophia (recruiter) |
| `young-founder.png` | Protagonist / founder engineer |
| `architect.png` | Archi (principal architect) |
| `reliability-guardian.png` | Reli (SRE) |

## Backgrounds (`/public/backgrounds/`)

| File | Scene |
|------|-------|
| `startup-office.png` | HR interview / startup office |
| `architecture-room.png` | Architecture reviews |
| `incident-room.png` | Incident / reliability |

## UI (`/public/ui/`)

| File | Purpose |
|------|---------|
| `mockup-reference.png` | Design reference (not used in runtime UI) |

## Regenerate heroes from character sheet

Place the 2×3 hero sheet at `public/images/character-sheet.png`, then run:

```bash
npm run extract-assets
```

Grid layout (top → bottom, left → right):

1. Uncle Eugene · Trace · Sophia  
2. Alex · Architect · Reliability Guardian  

Replace any PNG with your own illustrated asset — keep the same filename.
