import fs from 'fs';
import path from 'path';
import { leagueData, Player, Team } from './leagueData';

type TeamRecord = {
  team_id: number;
  name: string;
  mascot: string;
  abbreviation: string;
  wins: number;
};

type StandingsFile = {
  lastUpdated: string;
  teams: TeamRecord[];
  teamsByAbbr?: Record<string, TeamRecord>;
};

function readStandings(): StandingsFile | null {
  try {
    const p = path.join(process.cwd(), 'public', 'standings.json');
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw) as StandingsFile;
  } catch (err) {
    console.warn('Could not read public/standings.json:', (err as Error)?.message || err);
    return null;
  }
}

export type PlayerWins = {
  id: number;
  name: string;
  teams: Array<{ abbreviation: string; name: string; wins: number }>;
  totalWins: number;
};

export function computePlayerWins(): { lastUpdated: string | null; players: PlayerWins[] } {
  const standings = readStandings();
  const lastUpdated = standings ? standings.lastUpdated : null;
  const teamsByAbbr = (standings && standings.teamsByAbbr) ? standings.teamsByAbbr : {};

  const players: PlayerWins[] = leagueData.map((p) => {
    let total = 0;
    const teamsInfo = p.teams.map((t) => {
      const abbr = (t.abbreviation || '').toUpperCase();
      const rec = teamsByAbbr[abbr];
      let wins = 0;
      let name = t.name;
      if (rec) {
        wins = rec.wins || 0;
        name = rec.name || name;
      }
      total += wins;
      return { abbreviation: abbr, name, wins };
    });

    return {
      id: p.id,
      name: p.name,
      teams: teamsInfo,
      totalWins: total,
    };
  });

  return { lastUpdated, players };
}

export function getPlayerMapById(): Record<number, PlayerWins> {
  const { players } = computePlayerWins();
  const map: Record<number, PlayerWins> = {};
  players.forEach((p) => (map[p.id] = p));
  return map;
}

export default computePlayerWins;
