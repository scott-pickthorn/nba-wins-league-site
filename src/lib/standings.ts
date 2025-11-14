import { readFileSync } from 'fs';
import { join } from 'path';

export async function fetchNBAStandings(): Promise<{ [key: string]: number }> {
  try {
    // Read standings from the JSON file in the public directory
    const standingsPath = join(process.cwd(), 'public', 'standings.json');
    const fileContent = readFileSync(standingsPath, 'utf-8');
    const data = JSON.parse(fileContent);

    if (!data.standings || Object.keys(data.standings).length === 0) {
      throw new Error('No standings data found in JSON file');
    }

    return data.standings;
  } catch (error) {
    console.error('Error reading standings from JSON file:', error);
    throw error;
  }
}
