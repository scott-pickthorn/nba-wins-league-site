import StandingsClient from "./standings-client";
import { computePlayerWins } from "@/lib/leagueStandings";

export default async function Page() {
  // computePlayerWins reads `public/standings.json` and maps players to their team wins
  const { lastUpdated, players } = computePlayerWins();

  // Sort players by totalWins descending
  players.sort((a, b) => b.totalWins - a.totalWins);

  return <StandingsClient players={players} lastUpdated={lastUpdated || undefined} />;
}
