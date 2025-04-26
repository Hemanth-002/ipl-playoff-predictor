"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ipl2025Teams, ipl2025PointsTable } from "@/lib/data";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from "recharts";
import Image from "next/image";

export default function PlayoffChances() {
  const [leftMargin, setLeftMargin] = useState(120);

  useEffect(() => {
    const updateMargins = () => {
      if (window.innerWidth < 480) {
        setLeftMargin(10); // super small for tiny phones
      } else if (window.innerWidth < 640) {
        setLeftMargin(20); // small margin for normal phones
      } else if (window.innerWidth < 768) {
        setLeftMargin(40);
      } else if (window.innerWidth < 1024) {
        setLeftMargin(80);
      } else {
        setLeftMargin(120);
      }
    };

    updateMargins();
    window.addEventListener("resize", updateMargins);
    return () => window.removeEventListener("resize", updateMargins);
  }, []);

  // Calculate playoff chance based on points, NRR and remaining matches
  const getPlayoffChance = (team: (typeof ipl2025PointsTable)[0]) => {
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
    let finalChance = baseChance + nrrAdjustment + remainingMatchesAdjustment;

    // Ensure chance stays between 0 and 100
    return Math.max(0, Math.min(finalChance, 100));
  };

  // Create a sorted array of teams with playoff chances
  const sortedTeams = [...ipl2025PointsTable]
    .map((team) => {
      const teamInfo = ipl2025Teams.find((t) => t.name === team.team);
      return {
        ...team,
        id: teamInfo?.id || team.team,
        playoffChance: getPlayoffChance(team),
      };
    })
    .sort((a, b) => b.playoffChance - a.playoffChance);

  const chartData = sortedTeams.map((team) => {
    const teamInfo = ipl2025Teams.find((t) => t.name === team.team);
    return {
      name: teamInfo?.shortName || team.team,
      chance: team.playoffChance,
      color: teamInfo?.primaryColor,
      logo: teamInfo?.logo,
      fullName: teamInfo?.name,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-3 shadow-xl">
        <div className="flex items-center gap-2">
          <Image
            src={data.logo || "/placeholder-logo.svg"}
            alt={data.fullName || ""}
            width={24}
            height={24}
            className="rounded-full"
          />
          <div>
            <p className="font-medium">{data.fullName}</p>
            <p className="text-sm text-muted-foreground">
              Playoff Chance: {data.chance}%
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playoff Qualification Chances</CardTitle>
        <CardDescription>
          Current probability of each team qualifying for the IPL 2025 playoffs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 20, left: leftMargin, bottom: 60 }}
              layout="vertical"
              barSize={20}
            >
              <XAxis
                type="number"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                tick={(props) => {
                  const { x, y, payload } = props;
                  const team = chartData.find((t) => t.name === payload.value);

                  return (
                    <g transform={`translate(${x},${y})`}>
                      <image
                        href={
                          team?.logo ||
                          "/placeholder-logo.svg?height=24&width=24"
                        }
                        x={-85}
                        y={-12}
                        height={24}
                        width={24}
                      />
                      <text
                        x={-25}
                        y={4}
                        textAnchor="end"
                        fill="#666"
                        className="text-sm"
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "transparent" }}
              />
              <Bar dataKey="chance" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {sortedTeams.slice(0, 4).map((team) => {
            const teamInfo = ipl2025Teams.find((t) => t.name === team.team);
            return (
              <Card
                key={team.id}
                className="overflow-hidden"
                style={{
                  borderTop: `4px solid ${teamInfo?.primaryColor}`,
                  backgroundColor: `${teamInfo?.primaryColor}05`,
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 relative">
                      <Image
                        src={
                          teamInfo?.logo ||
                          "/placeholder-logo.svg?height=48&width=48"
                        }
                        alt={teamInfo?.name || ""}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">{teamInfo?.name}</h3>
                      <div
                        className="text-2xl font-bold"
                        style={{ color: teamInfo?.primaryColor }}
                      >
                        {team.playoffChance}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
