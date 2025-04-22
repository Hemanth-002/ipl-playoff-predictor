export type Match = {
  id: string;
  matchNumber: number;
  team1: string;
  team2: string;
  isCompleted: boolean;
  winner: string | null;
};

export type TeamStanding = {
  team: string;
  teamId: string;
  matches: number;
  wins: number;
  losses: number;
  ties: number;
  noResult: number;
  points: number;
  nrr: number;
};
