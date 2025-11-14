import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = 'ma14n28DafdF1ZX817GWvGK4rObeCpHs';
    const nbaId = 4; // NBA sport ID from The Rundown API

    // Fetch the teams for NBA
    const teamsResponse = await fetch(
      `https://api.apilayer.com/therundown/sports/${nbaId}/teams`,
      {
        method: 'GET',
        headers: {
          'apikey': apiKey,
        },
      }
    );

    if (!teamsResponse.ok) {
      throw new Error('Failed to fetch NBA teams from The Rundown API');
    }

    const teamsData = await teamsResponse.json();
    // console.log('Teams Data Response:', JSON.stringify(teamsData, null, 2));
    const teamWins: { [key: string]: number } = {};
    // console.log(teamsData)
    // Parse the teams data
    if (teamsData.teams ) {
      teamsData.teams.forEach((team: any) => {
        console.log(team)
        const teamAbbr = team.abbreviation?.toUpperCase();
        // Extract wins from the record string (format: "wins-losses")
        const recordString = team.record;
        if (recordString && typeof recordString === 'string') {
          const wins = parseInt(recordString.split('-')[0]);
          console.log('Team:', teamAbbr, 'Record:', recordString, 'Wins:', wins);
          if (teamAbbr && !isNaN(wins)) {
            teamWins[teamAbbr] = wins;
          }
        }
      });
    }
    console.log('Parsed Team Wins:', teamWins);
    if (Object.keys(teamWins).length === 0) {
      console.warn('No standings data found in The Rundown API response');
      throw new Error('No standings data found');
    }

    return NextResponse.json(teamWins);
  } catch (error) {
    console.error('Error fetching from The Rundown API:', error);
    
    // Fallback to ESPN API
    try {
      const espnResponse = await fetch(
        'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/standings',
        {
          next: {
            revalidate: 60,
          },
        }
      );

      if (!espnResponse.ok) {
        throw new Error('ESPN API failed');
      }

      const data = await espnResponse.json();
      const teamWins: { [key: string]: number } = {};

      // Check if we have the expected structure
      if (data.standings && Array.isArray(data.standings)) {
        data.standings.forEach((standing: any) => {
          if (standing.entries && Array.isArray(standing.entries)) {
            standing.entries.forEach((entry: any) => {
              const teamAbbreviation = entry.team?.abbreviation;
              const wins = entry.stats?.find(
                (stat: any) => stat.name === 'wins'
              )?.value;
              if (teamAbbreviation && wins !== undefined) {
                teamWins[teamAbbreviation.toUpperCase()] = wins;
              }
            });
          }
        });
      } else if (data.children && Array.isArray(data.children)) {
        // Alternative structure with conferences
        data.children.forEach((conference: any) => {
          if (conference.standings?.entries) {
            conference.standings.entries.forEach((entry: any) => {
              const teamAbbreviation = entry.team?.abbreviation;
              const wins = entry.stats?.find(
                (stat: any) => stat.name === 'wins'
              )?.value;
              if (teamAbbreviation && wins !== undefined) {
                teamWins[teamAbbreviation.toUpperCase()] = wins;
              }
            });
          }
        });
      }

      if (Object.keys(teamWins).length === 0) {
        return NextResponse.json({ error: 'No standings data found' }, { status: 500 });
      }

      return NextResponse.json(teamWins);
    } catch (fallbackError) {
      console.error('Both APIs failed:', fallbackError);
      return NextResponse.json({ error: 'Failed to fetch standings from all sources' }, { status: 500 });
    }
  }
}
