"use client";

import { useEffect, useState } from "react";
import { leagueData, Player } from "@/lib/leagueData";

interface TeamStats {
  [key: string]: number;
}

interface StandingsClientProps {
  teamWins: TeamStats;
}

export default function StandingsClient({ teamWins }: StandingsClientProps) {
  const [standings, setStandings] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    try {
      // Calculate total wins for each player using the pre-fetched data
      const updatedStandings = leagueData.map((player) => ({
        ...player,
        totalWins: player.teams.reduce(
          (sum, team) => sum + (teamWins[team.abbreviation.toUpperCase()] || 0),
          0
        ),
      }));

      // Sort by total wins in descending order
      updatedStandings.sort((a, b) => b.totalWins - a.totalWins);

      setStandings(updatedStandings);
    } catch (err) {
      console.error("Error processing standings:", err);
      setError("Failed to process standings data.");
    } finally {
      setLoading(false);
    }
  }, [teamWins]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold">Loading standings...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-center">NBA Wins League</h1>
      <p className="text-center text-gray-400 mb-8">
        Fantasy league standings - Most wins wins the money!
      </p>

      {error && (
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-100 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 border-b-2 border-gray-600">
              <th className="px-6 py-4 text-left font-bold text-lg">Rank</th>
              <th className="px-6 py-4 text-left font-bold text-lg">Player</th>
              <th className="px-6 py-4 text-left font-bold text-lg">Teams</th>
              <th className="px-6 py-4 text-center font-bold text-lg">
                Total Wins
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((player, index) => (
              <tr
                key={player.id}
                className={`border-b border-gray-700 hover:bg-gray-800 transition ${
                  index === 0
                    ? "bg-yellow-900 bg-opacity-30"
                    : index === 1
                      ? "bg-gray-700 bg-opacity-20"
                      : index === 2
                        ? "bg-orange-900 bg-opacity-20"
                        : ""
                }`}
              >
                <td className="px-6 py-4">
                  <span className="text-2xl font-bold">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-lg">
                  {player.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {player.teams.map((team) => (
                      <span
                        key={team.abbreviation}
                        className="bg-blue-600 px-3 py-1 rounded text-sm font-medium"
                      >
                        {team.abbreviation}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-bold text-xl">
                  {player.totalWins}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 p-6 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">League Rules</h2>
        <ul className="text-gray-300 space-y-2">
          <li>• Each player owns 3 NBA teams</li>
          <li>• Total wins are calculated by summing the wins of all 3 teams</li>
          <li>• Player with the most total wins at season end wins the prize</li>
          <li>
            • Standings update every hour with the latest NBA data
          </li>
        </ul>
      </div>
    </div>
  );
}