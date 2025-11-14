# NBA Wins League

A static website built with Next.js and Tailwind CSS that tracks fantasy NBA wins league standings for your friends' group.

## Features

- **Static Site Generation**: Built once during the build process for optimal performance
- **Daily Automated Updates**: GitHub Actions automatically updates standings data daily
- **Real NBA Data**: Fetches current NBA team wins from The Rundown API
- **10 Players with 3 Teams Each**: Each player owns 3 NBA teams, and their total wins are the sum of all their teams' wins
- **Sorted Leaderboard**: Automatically sorts players by total wins in descending order
- **Responsive Design**: Beautiful, mobile-friendly interface built with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## How the League Works

1. **Team Assignment**: Each of the 10 players is assigned 3 NBA teams
2. **Win Calculation**: A player's total wins = sum of wins from all 3 of their teams
3. **Winner**: The player with the highest total wins at the end of the season wins the prize

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with global styles
│   ├── page.tsx                # Server component that loads standings
│   ├── standings-client.tsx    # Client component that renders the UI
│   └── globals.css             # Global Tailwind CSS
├── lib/
│   ├── leagueData.ts           # League configuration and player/team data
│   └── standings.ts            # Utility to read standings from JSON
public/
├── standings.json              # NBA standings data (updated daily by GitHub Actions)
```

## Standings Data

The standings data is stored in `public/standings.json` with the following structure:

```json
{
  "lastUpdated": "2024-11-13T12:00:00Z",
  "standings": {
    "BOS": 28,
    "DEN": 26,
    "MIL": 25,
    ...
  }
}
```

## GitHub Actions Setup

The project includes a GitHub Actions workflow that automatically updates the standings daily.

### Setting Up the Workflow

1. Add your Sports API key as a GitHub secret:
   - Go to your repository settings
   - Click "Secrets and variables" → "Actions"
   - Click "New repository secret"
   - Name: `SPORTS_API_KEY`
   - Value: Your API key from apilayer.com

2. The workflow will:
   - Run daily at 2 AM UTC (configurable in `.github/workflows/update-standings.yml`)
   - Fetch the latest NBA standings from The Rundown API
   - Update `public/standings.json`
   - Commit and push the changes automatically

3. You can also manually trigger the workflow from the GitHub Actions tab

## Technologies Used

- **Next.js 15**: React framework for production
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **React Hooks**: Client-side state management (useState, useEffect)

## Customization

### To modify the league players and teams

Edit `src/lib/leagueData.ts`:

```typescript
export const leagueData: Player[] = [
  {
    id: 1,
    name: "Player Name",
    teams: [
      { name: "Team 1", abbreviation: "T1" },
      { name: "Team 2", abbreviation: "T2" },
      { name: "Team 3", abbreviation: "T3" },
    ],
    totalWins: 0,
  },
  // ... more players
];
```

### To change the GitHub Actions schedule

Edit `.github/workflows/update-standings.yml` and modify the cron expression:

```yaml
on:
  schedule:
    # Change this cron expression to your desired schedule
    - cron: '0 2 * * *'  # Daily at 2 AM UTC
```

## Deployment

The site is a true static site and can be deployed to any static hosting service:

- **Vercel**: Automatic deployments on push
- **Netlify**: Automatic deployments on push
- **GitHub Pages**: Manual or automated deployments
- **AWS S3 + CloudFront**: Static hosting with CDN

## License

MIT
