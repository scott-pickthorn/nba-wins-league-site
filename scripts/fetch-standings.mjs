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

if (!API_KEY) {
  console.error('Error: SPORTS_API_KEY not found in .env.local');
  process.exit(1);
}

async function fetchNBAStandings() {
  try {
    const nbaId = 4; // NBA sport ID from The Rundown API

    console.log('Fetching NBA standings from The Rundown API...');
    
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
      throw new Error(`API request failed with status ${response.status}`);
    }

    const teamsData = await response.json();
    const standings = {};

    if (teamsData.teams && Array.isArray(teamsData.teams)) {
      teamsData.teams.forEach((team) => {
        const teamAbbr = team.abbreviation?.toUpperCase();
        const recordString = team.record;
        
        if (recordString && typeof recordString === 'string') {
          const wins = parseInt(recordString.split('-')[0]);
          if (teamAbbr && !isNaN(wins)) {
            standings[teamAbbr] = wins;
          }
        }
      });
    }

    if (Object.keys(standings).length === 0) {
      throw new Error('No standings data found');
    }

    const data = {
      lastUpdated: new Date().toISOString(),
      standings: standings,
    };

    // Write to public/standings.json
    const standingsPath = path.join(__dirname, '..', 'public', 'standings.json');
    fs.writeFileSync(standingsPath, JSON.stringify(data, null, 2));
    
    console.log(`✓ Successfully updated standings.json with ${Object.keys(standings).length} teams`);
    console.log(`✓ Last updated: ${data.lastUpdated}`);
    
    return true;
  } catch (error) {
    console.error('Error fetching standings:', error);
    return false;
  }
}

fetchNBAStandings().then(success => {
  process.exit(success ? 0 : 1);
});
