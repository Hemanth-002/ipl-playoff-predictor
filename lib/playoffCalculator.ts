import { ipl2025PointsTable, ipl2025Fixtures, ipl2025Teams } from "./data";
import { getRemainingMatches } from "./utils";

// Types for our scenario simulator
interface Match {
  id: string;
  matchNumber: number;
  team1: string;
  team2: string;
  isCompleted: boolean;
  winner: string | null;
}

interface TeamScenario {
  team: string;
  matches: number;
  wins: number;
  losses: number;
  ties: number;
  noResult: number;
  points: number;
  teamId: string;
}

interface Scenario {
  matches: Match[];
  standings: TeamScenario[];
  targetTeamPosition: number;
  probability: number;
}

export const getAllPossibleScenarios = (numSimulations = 10000) => {
  const remainingMatches = getRemainingMatches(ipl2025Fixtures);
  const scenarios: Scenario[] = [];

  const createPointsTableCopy = (): TeamScenario[] => {
    return ipl2025Teams.map((team) => {
      const existing = ipl2025PointsTable.find((t) => t.teamId === team.id);
      return existing
        ? { ...existing }
        : {
            team: team.id,
            teamId: team.id,
            matches: 0,
            wins: 0,
            losses: 0,
            ties: 0,
            noResult: 0,
            points: 0,
          };
    });
  };

  const updatePointsTable = (
    pointsTable: TeamScenario[],
    match: Match,
    winner: string
  ) => {
    const team1Standing = pointsTable.find((t) => t.teamId === match.team1);
    const team2Standing = pointsTable.find((t) => t.teamId === match.team2);

    if (!team1Standing || !team2Standing) {
      console.error(
        `Team not found in points table: ${match.team1} or ${match.team2}`
      );
      return;
    }

    if (winner === match.team1) {
      team1Standing.wins++;
      team1Standing.points += 2;
      team2Standing.losses++;
    } else {
      team2Standing.wins++;
      team2Standing.points += 2;
      team1Standing.losses++;
    }

  };

  for (let i = 0; i < numSimulations; i++) {
    const simulatedPointsTable = createPointsTableCopy();
    const simulatedMatches: Match[] = [];

    // Create a map to track extra matches played
    const extraMatchesPlayed: Record<string, number> = {};

    for (const match of remainingMatches) {
      const winner = Math.random() < 0.5 ? match.team1 : match.team2;
      updatePointsTable(simulatedPointsTable, match, winner);
      simulatedMatches.push({ ...match, winner });

      extraMatchesPlayed[match.team1] =
        (extraMatchesPlayed[match.team1] || 0) + 1;
      extraMatchesPlayed[match.team2] =
        (extraMatchesPlayed[match.team2] || 0) + 1;
    }

    // After all simulations, update total matches
    simulatedPointsTable.forEach((team) => {
      const extra = extraMatchesPlayed[team.teamId] || 0;
      const played =
        (ipl2025PointsTable.find((t) => t.teamId === team.teamId)?.matches ||
          0) + extra;

      if (played < 14) {
        const unplayed = 14 - played;
        team.losses += unplayed; // Assume missing ones are losses
      }

      team.matches = 14; // force matches to exactly 14
    });

    scenarios.push({
      matches: simulatedMatches,
      standings: simulatedPointsTable,
      targetTeamPosition: 0,
      probability: 1 / numSimulations,
    });
  }

  return scenarios;
};
