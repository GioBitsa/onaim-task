import type { Leaderboard, LeaderboardPrize } from "../types/leaderboard.types";

const prizes: LeaderboardPrize[] = [
  {
    id: "p1",
    rank: 1,
    name: "Gold Coins",
    type: "coins",
    amount: 1000,
    imageUrl: "",
  },
  {
    id: "p2",
    rank: 2,
    name: "Free Spin",
    type: "freeSpin",
    amount: 1,
    imageUrl: "",
  },
];

export const leaderboards: Leaderboard[] = Array.from({ length: 20 }).map(
  (_, i) => {
    const id = (i + 1).toString();
    const statuses: Leaderboard["status"][] = ["active", "draft", "completed"];
    const scoringTypes: Leaderboard["scoringType"][] = [
      "points",
      "wins",
      "wagered",
    ];
    const maxParticipantsOptions = [50, 100, 200, 500];

    const startOffset = i * 2; // stagger start dates
    const duration = [7, 14, 30][i % 3]; // 1 week, 2 weeks, 1 month

    return {
      id,
      title: `Leaderboard ${i + 1}`,
      description: `This is leaderboard number ${i + 1}`,
      startDate: new Date(
        Date.now() + startOffset * 24 * 60 * 60 * 1000
      ).toISOString(),
      endDate: new Date(
        Date.now() + (startOffset + duration) * 24 * 60 * 60 * 1000
      ).toISOString(),
      status: statuses[i % statuses.length],
      scoringType: scoringTypes[i % scoringTypes.length],
      prizes,
      maxParticipants:
        maxParticipantsOptions[i % maxParticipantsOptions.length],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
);
