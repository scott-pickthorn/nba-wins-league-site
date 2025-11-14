// Mock league data - 10 players with 3 teams each
export interface Team {
  name: string;
  abbreviation: string;
}

export interface Player {
  id: number;
  name: string;
  teams: Team[];
  totalWins: number;
}

export const leagueData: Player[] = [
  {
    id: 1,
    name: "James",
    teams: [
      { name: "Oklahoma City Thunder", abbreviation: "OKC" },
      { name: "Detroit Pistons", abbreviation: "DET" },
      { name: "Utah Jazz", abbreviation: "UTA" },
    ],
    totalWins: 0,
  },
  {
    id: 2,
    name: "AJ",
    teams: [
      { name: "Denver Nuggets", abbreviation: "DEN" },
      { name: "Dallas Mavericks", abbreviation: "DAL" },
      { name: "Washington Wizards", abbreviation: "WAS" },
    ],
    totalWins: 0,
  },
  {
    id: 3,
    name: "Aaron",
    teams: [
      { name: "Cleveland Cavaliers", abbreviation: "CLE" },
      { name: "San Antonio Spurs", abbreviation: "SAS" },
      { name: "Portland Trail Blazers", abbreviation: "POR" },
    ],
    totalWins: 0,
  },
  {
    id: 4,
    name: "Kyle",
    teams: [
      { name: "New York Knicks", abbreviation: "NYK" },
      { name: "Atlanta Hawks", abbreviation: "ATL" },
      { name: "Charlotte Hornets", abbreviation: "CHA" },
    ],
    totalWins: 0,
  },
  {
    id: 5,
    name: "Luke",
    teams: [
      { name: "Orlando Magic", abbreviation: "ORL" },
      { name: "Toronto Raptors", abbreviation: "TOR" },
      { name: "Chicago Bulls", abbreviation: "CHI" },
    ],
    totalWins: 0,
  },
  {
    id: 6,
    name: "Godfrey",
    teams: [
      { name: "Golden State Warriors", abbreviation: "GSW" },
      { name: "Memphis Grizzlies", abbreviation: "MEM" },
      { name: "New Orleans Pelicans", abbreviation: "NOP" },
    ],
    totalWins: 0,
  },
  {
    id: 7,
    name: "Gardepie",
    teams: [
      { name: "Philadelphia 76ers", abbreviation: "PHI" },
      { name: "Boston Celtics", abbreviation: "BOS" },
      { name: "Brooklyn Nets", abbreviation: "BKN" },
    ],
    totalWins: 0,
  },
  {
    id: 8,
    name: "Eric",
    teams: [
      { name: "Los Angeles Clippers", abbreviation: "LAC" },
      { name: "Indiana Pacers", abbreviation: "IND" },
      { name: "Sacramento Kings", abbreviation: "SAC" },
    ],
    totalWins: 0,
  },
  {
    id: 9,
    name: "Drake",
    teams: [
      { name: "Los Angeles Lakers", abbreviation: "LAL" },
      { name: "Minnesota Timberwolves", abbreviation: "MIN" },
      { name: "Miami Heat", abbreviation: "MIA" },
    ],
    totalWins: 0,
  },
  {
    id: 10,
    name: "Scott",
    teams: [
      { name: "Houston Rockets", abbreviation: "HOU" },
      { name: "Milwaukee Bucks", abbreviation: "MIL" },
      { name: "Phoenix Suns", abbreviation: "PHX" },
    ],
    totalWins: 0,
  },
];
