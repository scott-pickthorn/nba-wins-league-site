"use client";

import React, { useMemo, useState } from "react";
import type { PlayerWins } from "@/lib/leagueStandings";

interface StandingsClientProps {
  players: PlayerWins[];
  lastUpdated?: string;
}

export default function StandingsClient({ players, lastUpdated }: StandingsClientProps) {
  const [expandedPlayerId, setExpandedPlayerId] = useState<number | null>(null);

  const sortedPlayers = useMemo(() => {
    // clone array to avoid mutating props
    return [...players].sort((a, b) => b.totalWins - a.totalWins);
  }, [players]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2 text-center">NBA Wins League</h1>
      <p className="text-center text-gray-400 mb-8">
        Fantasy league standings - Most wins wins the money!
      </p>

      {lastUpdated && (
        <p className="text-center text-gray-500 text-sm mb-6">
          Last updated: {new Date(lastUpdated).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
          })}
        </p>
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
            {sortedPlayers.map((player, index) => (
              <React.Fragment key={player.id}>
                <tr
                  className={`border-b border-gray-700 hover:bg-gray-800 transition cursor-pointer ${
                    index === 0
                      ? "bg-yellow-900 bg-opacity-30"
                      : index === 1
                        ? "bg-gray-700 bg-opacity-20"
                        : index === 2
                          ? "bg-orange-900 bg-opacity-20"
                          : ""
                  }`}
                  onClick={() => setExpandedPlayerId(expandedPlayerId === player.id ? null : player.id)}
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
                        <span key={team.abbreviation} className="bg-blue-600 px-3 py-1 rounded text-sm font-medium">
                          {team.abbreviation}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-xl">
                    {player.totalWins}
                  </td>
                </tr>
                {expandedPlayerId === player.id && (
                  <tr className="bg-gray-750 border-b border-gray-700">
                    <td colSpan={4} className="px-6 py-4">
                      <div className="text-gray-300">
                        <p className="font-semibold mb-3">{player.name}&apos;s Team Breakdown:</p>
                        <div className="space-y-2">
                          {player.teams.map((team) => (
                            <div key={team.abbreviation} className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded">
                              <div>
                                <span className="font-medium">{team.name}</span>
                                <span className="text-gray-400 ml-2">({team.abbreviation})</span>
                              </div>
                              <span className="font-bold text-blue-400">{team.wins || 0} wins</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
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
        </ul>
      </div>
    </div>
  );
}