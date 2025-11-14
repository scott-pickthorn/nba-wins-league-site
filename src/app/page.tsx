import { fetchNBAStandings } from "@/lib/standings";
import StandingsClient from "./standings-client";

interface StandingsData {
  standings: { [key: string]: number };
  lastUpdated?: string;
}

export default async function Page() {
  let teamWins = {};
  let lastUpdated: string | undefined;

  try {
    const data: StandingsData = await fetchNBAStandings();
    teamWins = data.standings;
    lastUpdated = data.lastUpdated;
  } catch (err) {
    console.error("Failed to load standings from JSON file:", err);
    // Fall back to empty object
  }

  return <StandingsClient teamWins={teamWins} lastUpdated={lastUpdated} />;
}
