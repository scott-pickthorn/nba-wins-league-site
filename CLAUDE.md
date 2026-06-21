# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start local dev server at http://localhost:3000
npm run build        # Build static export (output goes to ./out)
npm run lint         # Run ESLint via next lint
npm run fetch-standings  # Fetch live NBA standings from The Rundown API (requires SPORTS_API_KEY in .env.local)
```

No test suite exists in this project.

To fetch standings locally, create `.env.local` with:
```
SPORTS_API_KEY=<your_key_from_apilayer.com>
```

## Architecture

This is a **Next.js 15 static export** (`output: 'export'` in `next.config.ts`). There is no server — `npm run build` produces a fully static `./out` directory that is deployed to GitHub Pages. The `basePath` is `/nba-wins-league-site` in production and empty in development.

### Data flow

```
public/standings.json
       │
       ▼
src/lib/leagueStandings.ts   ← reads file, joins with leagueData, computes per-player wins
       │
       ▼
src/app/page.tsx              ← async Server Component: calls computePlayerWins(), sorts by totalWins
       │
       ▼
src/app/standings-client.tsx  ← "use client" component: renders leaderboard table, handles row expand
```

### Key files and their roles

- **`src/data/leagueData.json`** — canonical source for the 10 players and their 3 assigned NBA teams each. Edit this to change team assignments.
- **`src/lib/leagueData.ts`** — re-exports `leagueData.json` with TypeScript types (`Player`, `Team`). Both the app and `fetch-standings.mjs` read from the same JSON to stay in sync.
- **`src/lib/leagueStandings.ts`** — `computePlayerWins()` reads `public/standings.json`, looks up each team by abbreviation in `teamsByAbbr`, and returns per-player win totals. This is the main computation function.
- **`public/standings.json`** — written by `fetch-standings.mjs`; contains `lastUpdated`, `teams[]`, and `teamsByAbbr` (keyed by abbreviation). Committed to the repo and updated daily by GitHub Actions.
- **`public/league-mapping.json`** — also written by `fetch-standings.mjs` as a precomputed snapshot of player→wins. Not currently consumed by the app (the app recomputes at build time from `standings.json`).
- **`src/lib/standings.ts`** — legacy utility that reads a `standings` dict format; not used by the current app.

### Standings update pipeline

`scripts/fetch-standings.mjs` calls The Rundown API (`apilayer.com`) for NBA teams (sport ID 4, team IDs 1–30), normalizes non-standard abbreviations, and writes `public/standings.json` and `public/league-mapping.json`.

**Abbreviation normalization** is critical — the API returns non-standard abbreviations that must map to the ones in `leagueData.json`:

| API returns | Normalized to |
|-------------|--------------|
| UTAH        | UTA          |
| SA          | SAS          |
| GS          | GSW          |
| NO          | NOP          |
| WSH         | WAS          |

If abbreviations in `leagueData.json` don't match `teamsByAbbr` keys in `standings.json`, those teams will show 0 wins.

### GitHub Actions

- **`update-standings.yml`** — runs hourly 4–10 PM PST (12–6 AM UTC), fetches standings, commits `public/standings.json` to `main`, then dispatches a `trigger-deploy` event.
- **`deploy.yml`** — triggered by pushes to `main` or `trigger-deploy` dispatch; runs `npm run build` and publishes `./out` to `gh-pages` via `peaceiris/actions-gh-pages`.
- **`ci.yml`** — runs lint + build on all PRs and pushes to `main`.

The `SPORTS_API_KEY` secret must be set in GitHub repository settings for the update workflow to function.
