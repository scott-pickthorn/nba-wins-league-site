#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const API_KEY = process.env.SPORTS_API_KEY;
console.log('API Key Loaded:', API_KEY);
if (!API_KEY) {
  console.error('Error: SPORTS_API_KEY not found in .env.local');
  process.exit(1);
}

async function fetchNBAStandings() {
  try {
    const nbaId = 4; // NBA sport ID from The Rundown API
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Fetching NBA standings (attempt ${attempt}/${maxRetries})...`);
        
        const response = await fetch(
          `https://api.apilayer.com/therundown/sports/${nbaId}/teams`,
          {
            method: 'GET',
            headers: {
              'apikey': API_KEY,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }

        const teamsData = await response.json();

        const teams = [];
        const teamsByAbbr = {};

        if (teamsData.teams && Array.isArray(teamsData.teams)) {
          // Filter teams whose API team id is in the range 1-30 (NBA teams per request)
          teamsData.teams.forEach((team) => {
            const id = team.id ?? team.team_id ?? team.teamId ?? null;
            if (typeof id !== 'number') return;
            if (id < 1 || id > 30) return;

            let abbreviation = (team.abbreviation || team.abbr || '').toUpperCase();
            
            // --- Normalization step ---
            // The Rundown API uses some non-standard abbreviations.
            // We normalize them here to match leagueData.json.
            const normalizationMap = {
              'UTAH': 'UTA',
              'SA': 'SAS',
              'GS': 'GSW',
              'NO': 'NOP',
              'WSH': 'WAS',
            };
            if (normalizationMap[abbreviation]) {
              abbreviation = normalizationMap[abbreviation];
            }
            // --- End Normalization ---

            const recordString = team.record || team.recordString || team.record_text || '';
            let wins = null;
            if (recordString && typeof recordString === 'string') {
              const parts = recordString.split('-');
              const parsed = parseInt(parts[0]);
              if (!isNaN(parsed)) wins = parsed;
            }

            // Fallback: some APIs provide wins directly
            if (wins === null && typeof team.wins === 'number') wins = team.wins;

            const name = team.name || team.fullName || team.teamName || team.market || '';
            const mascot = team.mascot || team.nickname || team.city || '';

            const teamObj = {
              team_id: id,
              name: name,
              mascot: mascot,
              abbreviation: abbreviation,
              wins: wins === null ? 0 : wins,
            };

            teams.push(teamObj);
            if (abbreviation) teamsByAbbr[abbreviation] = teamObj;
          });
        }

        if (teams.length === 0) {
          throw new Error('No NBA teams (team_id 1-30) found in API response');
        }

        const data = {
          lastUpdated: new Date().toISOString(),
          teams: teams,
          teamsByAbbr: teamsByAbbr,
        };

        // Write to public/standings.json
        const standingsPath = path.join(__dirname, '..', 'public', 'standings.json');
        fs.writeFileSync(standingsPath, JSON.stringify(data, null, 2));

        console.log(`✓ Successfully updated standings.json with ${teams.length} NBA teams (team_id 1-30)`);
        console.log(`✓ Last updated: ${data.lastUpdated}`);
        // Also compute a precomputed league mapping (players -> team wins)
        try {
          const leagueDataPath = path.join(__dirname, '..', 'src', 'data', 'leagueData.json');
          const leagueRaw = fs.readFileSync(leagueDataPath, 'utf-8');
          const league = JSON.parse(leagueRaw);

          const playersOut = league.map((p) => {
            const teams = p.teams.map((t) => {
              const abbr = (t.abbreviation || '').toUpperCase();
              const teamRec = teamsByAbbr[abbr];
              return {
                abbreviation: abbr,
                name: t.name,
                wins: teamRec ? (teamRec.wins || 0) : 0,
              };
            });

            const totalWins = teams.reduce((s, t) => s + (t.wins || 0), 0);

            return {
              id: p.id,
              name: p.name,
              teams,
              totalWins,
            };
          });

          const mapping = {
            lastUpdated: data.lastUpdated,
            players: playersOut,
          };

          const mappingPath = path.join(__dirname, '..', 'public', 'league-mapping.json');
          fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
          console.log(`✓ Successfully wrote precomputed league-mapping.json with ${playersOut.length} players`);
        } catch (e) {
          console.warn('Failed to write league-mapping.json:', e?.message || e);
        }
        
        return true;
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed:`, error.message);
        
        if (attempt < maxRetries) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`Retrying in ${waitTime / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    throw lastError;
  } catch (error) {
    console.error('Error fetching standings:', error.message);
    return false;
  }
}

fetchNBAStandings().then(success => {
  process.exit(success ? 0 : 1);
});
