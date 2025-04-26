"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ipl2025Teams, ipl2025PointsTable } from "@/lib/data";
import Image from "next/image";

export default function StandingsTable() {
  const sortedStandings = [...ipl2025PointsTable].sort((a, b) => {
    if (b.points === a.points) {
      return b.nrr - a.nrr;
    }
    return b.points - a.points;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Standings</CardTitle>
        <CardDescription>
          Current IPL 2025 points table with team positions, matches played, and
          net run rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Pos</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-center">P</TableHead>
              <TableHead className="text-center">W</TableHead>
              <TableHead className="text-center">L</TableHead>
              <TableHead className="text-center">NR</TableHead>
              <TableHead className="text-center">NRR</TableHead>
              <TableHead className="text-center">Pts</TableHead>
              <TableHead className="text-center">Playoff Chance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedStandings.map((team, index) => {
              // Find the team info by matching the team name
              const teamInfo = ipl2025Teams.find((t) => t.name === team.team);

              // Calculate playoff chance based on points, NRR and remaining matches
              const remainingMatches = 14 - team.matches;
              const maxPossiblePoints = team.points + remainingMatches * 2;

              // Base chance on current points with more granular steps
              let baseChance = 0;
              if (team.points >= 18) baseChance = 100;
              else if (team.points >= 16) baseChance = 95;
              else if (team.points >= 14) baseChance = 85;
              else if (team.points >= 12) baseChance = 70;
              else if (team.points >= 10) baseChance = 50;
              else if (team.points >= 8) baseChance = 35;
              else if (team.points >= 6) baseChance = 20;
              else if (team.points >= 4) baseChance = 10;
              else if (team.points >= 2) baseChance = 5;
              else baseChance = 2;

              // Adjust based on NRR with more granular steps
              let nrrAdjustment = 0;
              if (team.nrr > 1.0) nrrAdjustment = 15;
              else if (team.nrr > 0.5) nrrAdjustment = 10;
              else if (team.nrr > 0.2) nrrAdjustment = 5;
              else if (team.nrr > 0) nrrAdjustment = 2;
              else if (team.nrr < -0.5) nrrAdjustment = -5;
              else if (team.nrr < -0.2) nrrAdjustment = -2;

              // Adjust based on remaining matches
              const remainingMatchesAdjustment =
                remainingMatches > 5 ? 10 : remainingMatches > 3 ? 5 : 0;

              // Calculate final chance
              const playoffChance = Math.max(
                0,
                Math.min(
                  baseChance + nrrAdjustment + remainingMatchesAdjustment,
                  100
                )
              );

              const playoffChanceColor =
                playoffChance > 75
                  ? "text-green-600"
                  : playoffChance > 40
                  ? "text-amber-600"
                  : "text-red-600";

              return (
                <TableRow
                  key={team.team}
                  style={{
                    borderLeft: `4px solid ${teamInfo?.primaryColor}`,
                    backgroundColor:
                      index < 4 ? `${teamInfo?.primaryColor}10` : undefined,
                  }}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 relative">
                        <Image
                          src={
                            teamInfo?.logo ||
                            "/placeholder-logo.svg?height=32&width=32"
                          }
                          alt={teamInfo?.name || ""}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <span>{teamInfo?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{team.matches}</TableCell>
                  <TableCell className="text-center">{team.wins}</TableCell>
                  <TableCell className="text-center">{team.losses}</TableCell>
                  <TableCell className="text-center">{team.noResult}</TableCell>
                  <TableCell className="text-center">
                    {team.nrr > 0 ? `+${team.nrr}` : team.nrr}
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {team.points}
                  </TableCell>
                  <TableCell
                    className={`text-center font-bold ${playoffChanceColor}`}
                  >
                    {playoffChance}%
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
