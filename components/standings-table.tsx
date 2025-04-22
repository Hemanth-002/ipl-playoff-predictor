"use client";

import { useState } from "react";
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
import { TeamStanding } from "@/lib/types";

export default function StandingsTable() {
  const [standings, setStandings] =
    useState<TeamStanding[]>(ipl2025PointsTable);

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
            {standings.map((team, index) => {
              // Find the team info by matching the team name
              const teamInfo = ipl2025Teams.find((t) => t.name === team.team);

              // Calculate playoff chance based on points (simplified logic)
              const playoffChance =
                team.points >= 16
                  ? 100
                  : team.points >= 14
                  ? 90
                  : team.points >= 12
                  ? 75
                  : team.points >= 10
                  ? 50
                  : team.points >= 8
                  ? 25
                  : 10;

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
