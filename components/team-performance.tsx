"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ipl2025Teams, ipl2025PointsTable, ipl2025Fixtures } from "@/lib/data";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import Image from "next/image";
import { TeamStanding } from "@/lib/types";

export default function TeamPerformance() {
  const [selectedTeam, setSelectedTeam] = useState(ipl2025Teams[0].id);

  const teamInfo = ipl2025Teams.find((t) => t.id === selectedTeam);
  const teamStanding = ipl2025PointsTable.find(
    (t) => t.team === teamInfo?.name
  );

  // Filter match results for the selected team
  const teamMatches = ipl2025Fixtures.filter(
    (match) => match.team1 === selectedTeam || match.team2 === selectedTeam
  );

  // Create data for points progression chart
  const pointsProgressionData: Array<{
    match: number;
    points: number;
    opponent: string;
    result: string;
  }> = [];
  let cumulativePoints = 0;

  teamMatches.forEach((match, index) => {
    const isTeam1 = match.team1 === selectedTeam;
    const opponent = isTeam1 ? match.team2 : match.team1;
    const opponentInfo = ipl2025Teams.find((t) => t.id === opponent);

    // Add 2 points for a win, 1 for no result, 0 for loss
    if (match.winner === selectedTeam) {
      cumulativePoints += 2;
    } else if (match.winner === "no-result") {
      cumulativePoints += 1;
    }

    pointsProgressionData.push({
      match: index + 1,
      points: cumulativePoints,
      opponent: opponentInfo?.shortName || opponent,
      result:
        match.winner === selectedTeam
          ? "W"
          : match.winner === "no-result"
          ? "NR"
          : "L",
    });
  });

  // Create data for run rate chart
  const runRateData = teamMatches.map((match, index) => {
    // Since we don't have run rate data in the fixtures, we'll use a placeholder
    // In a real app, you would calculate this from actual match data
    const matchRunRate = Math.random() * 2 - 1; // Random value between -1 and 1
    const cumulativeRunRate = Math.random() * 2 - 1; // Random value between -1 and 1

    return {
      match: index + 1,
      runRate: matchRunRate,
      cumulativeRunRate: cumulativeRunRate,
    };
  });

  // Calculate playoff chance based on points
  const getPlayoffChance = (points: number | undefined) => {
    if (points === undefined) return "10%";
    if (points >= 16) return "100%";
    if (points >= 14) return "90%";
    if (points >= 12) return "75%";
    if (points >= 10) return "50%";
    if (points >= 8) return "25%";
    return "10%";
  };

  // Get playoff chance color
  const getPlayoffChanceColor = (points: number | undefined) => {
    if (points === undefined) return "rgb(220, 38, 38)";
    if (points >= 16) return "rgb(22, 163, 74)";
    if (points >= 12) return "rgb(217, 119, 6)";
    return "rgb(220, 38, 38)";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Performance Analysis</CardTitle>
          <CardDescription>
            Detailed performance metrics and trends for each IPL team
          </CardDescription>
        </div>
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select team" />
          </SelectTrigger>
          <SelectContent>
            {ipl2025Teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 relative">
                    <Image
                      src={
                        team.logo || "/placeholder-logo.svg?height=20&width=20"
                      }
                      alt={team.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span>{team.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-8">
        <div
          className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-lg"
          style={{ backgroundColor: `${teamInfo?.primaryColor}10` }}
        >
          <div className="w-24 h-24 relative">
            <Image
              src={teamInfo?.logo || "/placeholder-logo.svg?height=96&width=96"}
              alt={teamInfo?.name || ""}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2
              className="text-2xl font-bold"
              style={{ color: teamInfo?.primaryColor }}
            >
              {teamInfo?.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <div className="text-sm text-muted-foreground">Matches</div>
                <div className="text-xl font-bold">
                  {teamStanding?.matches || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Points</div>
                <div className="text-xl font-bold">
                  {teamStanding?.points || 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">NRR</div>
                <div className="text-xl font-bold">
                  {teamStanding?.nrr !== undefined
                    ? teamStanding.nrr > 0
                      ? `+${teamStanding.nrr}`
                      : teamStanding.nrr
                    : 0}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Playoff Chance
                </div>
                <div
                  className="text-xl font-bold"
                  style={{
                    color: getPlayoffChanceColor(teamStanding?.points),
                  }}
                >
                  {getPlayoffChance(teamStanding?.points)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Points Progression</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={pointsProgressionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="match"
                  label={{
                    value: "Match Number",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: "Points",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[0, 20]}
                />
                <Tooltip
                  formatter={(value, name) => [value, "Points"]}
                  labelFormatter={(value) => `Match ${value}`}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border rounded shadow-sm">
                          <p className="font-semibold">
                            Match {label}: vs {data.opponent}
                          </p>
                          <p>
                            Result:{" "}
                            <span
                              className={
                                data.result === "W"
                                  ? "text-green-600 font-bold"
                                  : data.result === "NR"
                                  ? "text-amber-600 font-bold"
                                  : "text-red-600 font-bold"
                              }
                            >
                              {data.result}
                            </span>
                          </p>
                          <p>Points: {data.points}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke={teamInfo?.primaryColor}
                  strokeWidth={3}
                  dot={{ fill: teamInfo?.primaryColor, r: 6 }}
                  activeDot={{ r: 8, fill: teamInfo?.secondaryColor }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Net Run Rate Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={runRateData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="match"
                  label={{
                    value: "Match Number",
                    position: "insideBottom",
                    offset: -10,
                  }}
                />
                <YAxis
                  label={{
                    value: "Net Run Rate",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    value.toFixed(3),
                    name === "runRate" ? "Match NRR" : "Cumulative NRR",
                  ]}
                  labelFormatter={(value) => `Match ${value}`}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="runRate"
                  name="Match NRR"
                  stroke={teamInfo?.secondaryColor}
                  fill={`${teamInfo?.secondaryColor}40`}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="cumulativeRunRate"
                  name="Cumulative NRR"
                  stroke={teamInfo?.primaryColor}
                  fill={`${teamInfo?.primaryColor}40`}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
