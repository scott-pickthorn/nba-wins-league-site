import { fetchNBAStandings } from "@/lib/standings";
import StandingsClient from "./standings-client";

export default async function Page() {
  let teamWins = {};

  try {
    teamWins = await fetchNBAStandings();
  } catch (err) {
    console.error("Failed to load standings from JSON file:", err);
    // Fall back to empty object
  }

  return <StandingsClient teamWins={teamWins} />;
}
