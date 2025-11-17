// leagueData now imported from canonical JSON so scripts can reuse the same source
import leagueJson from "../data/leagueData.json";

export interface Team {
  name: string;
  abbreviation: string;
}

export interface Player {
  id: number;
  name: string;
  teams: Team[];
  totalWins?: number;
}

export const leagueData: Player[] = leagueJson as Player[];

export default leagueData;
