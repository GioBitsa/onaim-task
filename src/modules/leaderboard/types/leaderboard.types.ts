export type LeaderboardStatus = "draft" | "active" | "completed";

export type ScoringType = "points" | "wins" | "wagered";

export interface LeaderboardPrize {
  id: string;
  rank: number;
  name: string;
  type: "coins" | "freeSpin" | "bonus";
  amount: number;
  imageUrl: string;
}

export interface Leaderboard {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: LeaderboardStatus;
  scoringType: ScoringType;
  prizes: LeaderboardPrize[];
  maxParticipants: number;
  createdAt: string;
  updatedAt: string;
}
