"use client";

import { useState, useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import { ipl2025Teams } from "@/lib/data";
import { getAllPossibleScenarios } from "@/lib/playoffCalculator";
import { AlertCircle, ArrowRight, Trophy, Loader2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

export default function ScenarioSimulator() {
  const [targetTeam, setTargetTeam] = useState("");
  const [targetPosition, setTargetPosition] = useState("");
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState("");
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [numSimulations, setNumSimulations] = useState(10000);

  const handleSimulate = () => {
    if (!targetTeam || !targetPosition) {
      setError("Please select both a team and a target position");
      return;
    }

    setError("");
    setIsCalculating(true);
    setSimulationProgress(0);
    setScenarios([]);

    // Simulate calculation with progress updates
    const interval = setInterval(() => {
      setSimulationProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 100);

    // Run the simulation
    setTimeout(() => {
      try {
        // Get all possible scenarios using Monte Carlo simulation
        const allScenarios = getAllPossibleScenarios(numSimulations);

        // Filter scenarios where the target team reaches exactly the target position
        const targetTeamScenarios = allScenarios.filter((scenario) => {
          // Sort standings by points (descending)
          const sortedStandings = [...scenario.standings].sort(
            (a: any, b: any) => {
              return b.points - a.points;
            }
          );

          // Find the position of the target team
          const teamPosition =
            sortedStandings.findIndex((team) => team.teamId === targetTeam) + 1;

          // Check if the team reaches exactly the target position
          return teamPosition === parseInt(targetPosition);
        });

        // Calculate probability
        const probability =
          (targetTeamScenarios.length / allScenarios.length) * 100;

        // Get the best position achieved by the target team
        const bestPosition = Math.min(
          ...allScenarios.map((scenario) => {
            const sortedStandings = [...scenario.standings].sort(
              (a: any, b: any) => {
                return b.points - a.points;
              }
            );
            return (
              sortedStandings.findIndex((team) => team.teamId === targetTeam) +
              1
            );
          })
        );

        // Set the results
        setScenarios(targetTeamScenarios);

        // Clear the interval and set progress to 100%
        clearInterval(interval);
        setSimulationProgress(100);
      } catch (err) {
        setError("An error occurred while calculating scenarios");
        console.error(err);
      } finally {
        setIsCalculating(false);
      }
    }, 2000);
  };

  // Helper function to get ordinal suffix
  const getOrdinalSuffix = (n: number): string => {
    const j = n % 10;
    const k = n % 100;
    if (j === 1 && k !== 11) {
      return "st";
    }
    if (j === 2 && k !== 12) {
      return "nd";
    }
    if (j === 3 && k !== 13) {
      return "rd";
    }
    return "th";
  };

  // Get team name from ID
  const getTeamName = (teamId: string): string => {
    const team = ipl2025Teams.find((t) => t.id === teamId);
    return team ? team.name : teamId;
  };

  // Get team short name from ID
  const getTeamShortName = (teamId: string): string => {
    const team = ipl2025Teams.find((t) => t.id === teamId);
    return team ? team.shortName : teamId;
  };

  // Get team logo from ID
  const getTeamLogo = (teamId: string): string => {
    const team = ipl2025Teams.find((t) => t.id === teamId);
    return team ? team.logo : "/placeholder-logo.svg";
  };

  // Get team color from ID
  const getTeamColor = (teamId: string): string => {
    const team = ipl2025Teams.find((t) => t.id === teamId);
    return team ? team.primaryColor : "#000000";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Playoff Scenario Simulator</CardTitle>
        <CardDescription>
          Simulate different scenarios to see what it takes for your team to
          make the playoffs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Select Team
            </label>
            <Select value={targetTeam} onValueChange={setTargetTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a team" />
              </SelectTrigger>
              <SelectContent>
                {ipl2025Teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 relative">
                        <Image
                          src={
                            team.logo ||
                            "/placeholder-logo.svg?height=25&width=25"
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
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              Target Position
            </label>
            <Select value={targetPosition} onValueChange={setTargetPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Select position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Place</SelectItem>
                <SelectItem value="2">2nd Place</SelectItem>
                <SelectItem value="3">3rd Place</SelectItem>
                <SelectItem value="4">4th Place (Last Playoff Spot)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleSimulate}
              className="w-full"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Simulate Scenarios"
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isCalculating ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Simulation Progress</span>
              <span>{simulationProgress}%</span>
            </div>
            <Progress value={simulationProgress} />
          </div>
        ) : scenarios.length > 0 ? (
          <div className="space-y-6">
            <div
              className={`p-4 rounded-lg border ${
                scenarios.length > 0
                  ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
                  : "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Trophy
                  className={`h-6 w-6 ${
                    scenarios.length > 0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                />
                <div>
                  <h3
                    className={`font-semibold ${
                      scenarios.length > 0
                        ? "text-green-800 dark:text-green-300"
                        : "text-red-800 dark:text-red-300"
                    }`}
                  >
                    {scenarios.length > 0
                      ? "Scenario Possible!"
                      : "Scenario Not Possible"}
                  </h3>
                  <p
                    className={`text-sm ${
                      scenarios.length > 0
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-700 dark:text-red-400"
                    }`}
                  >
                    {getTeamName(targetTeam)} can{" "}
                    {scenarios.length > 0 ? "finish" : "not finish"} in{" "}
                    {targetPosition}
                    {getOrdinalSuffix(Number(targetPosition))} place
                    {scenarios.length > 0 &&
                      ` with a ${(
                        (scenarios.length / numSimulations) *
                        100
                      ).toFixed(1)}% probability`}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Info className="h-3 w-3" />
                    <span>
                      Probabilities are approximate and based on{" "}
                      {numSimulations.toLocaleString()} simulations. Results may
                      vary slightly between runs due to the random nature of the
                      simulation.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {scenarios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sample Scenarios</CardTitle>
                  <CardDescription>
                    Here are some sample scenarios where{" "}
                    {getTeamName(targetTeam)} reaches exactly {targetPosition}
                    {getOrdinalSuffix(Number(targetPosition))} place
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {scenarios.slice(0, 3).map((scenario, scenarioIndex) => (
                      <div
                        key={scenarioIndex}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <h3 className="font-medium">
                          Scenario {scenarioIndex + 1}
                        </h3>

                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Team</th>
                                <th className="text-center py-2">P</th>
                                <th className="text-center py-2">W</th>
                                <th className="text-center py-2">L</th>
                                <th className="text-center py-2">Pts</th>
                              </tr>
                            </thead>
                            <tbody>
                              {scenario.standings
                                .sort((a: any, b: any) => {
                                  return b.points - a.points;
                                })
                                .map((team: any, index: number) => (
                                  <tr
                                    key={team.team}
                                    className={`border-b ${
                                      team.teamId === targetTeam
                                        ? "font-bold"
                                        : ""
                                    }`}
                                    style={{
                                      backgroundColor:
                                        team.teamId === targetTeam
                                          ? `${getTeamColor(team.teamId)}10`
                                          : undefined,
                                    }}
                                  >
                                    <td className="py-2">
                                      <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 relative">
                                          <Image
                                            src={getTeamLogo(team.teamId)}
                                            alt={getTeamName(team.teamId)}
                                            fill
                                            className="object-contain"
                                          />
                                        </div>
                                        <span>{getTeamName(team.teamId)}</span>
                                      </div>
                                    </td>
                                    <td className="text-center py-2">
                                      {team.matches}
                                    </td>
                                    <td className="text-center py-2">
                                      {team.wins}
                                    </td>
                                    <td className="text-center py-2">
                                      {team.losses}
                                    </td>
                                    <td className="text-center py-2 font-bold">
                                      {team.points}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="mt-4">
                          <h4 className="font-medium mb-2">
                            Key Match Results:
                          </h4>
                          <ul className="space-y-2">
                            {scenario.matches.map(
                              (match: any, matchIndex: number) => (
                                <li
                                  key={matchIndex}
                                  className="flex items-center gap-2 p-2 rounded bg-muted"
                                >
                                  <div className="w-6 h-6 relative">
                                    <Image
                                      src={getTeamLogo(match.team1)}
                                      alt={getTeamName(match.team1)}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <span>{getTeamShortName(match.team1)}</span>
                                  <span>vs</span>
                                  <div className="w-6 h-6 relative">
                                    <Image
                                      src={getTeamLogo(match.team2)}
                                      alt={getTeamName(match.team2)}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <span>{getTeamShortName(match.team2)}</span>
                                  <ArrowRight className="h-4 w-4" />
                                  <span className="font-medium">
                                    {match.winner === match.team1
                                      ? `${getTeamShortName(match.team1)} wins`
                                      : `${getTeamShortName(match.team2)} wins`}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : targetTeam && targetPosition && !isCalculating ? (
          <div className="p-4 rounded-lg border bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-300">
                  No Scenarios Found
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400">
                  Based on {numSimulations.toLocaleString()} simulations,{" "}
                  {getTeamName(targetTeam)} cannot finish in {targetPosition}
                  {getOrdinalSuffix(Number(targetPosition))} place in any
                  scenario.
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  <span>
                    This result is based on {numSimulations.toLocaleString()}{" "}
                    simulations. The team may still have a very small chance of
                    reaching this position.
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
