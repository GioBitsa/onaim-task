// import type { Leaderboard } from "../types/leaderboard.types";

// // Get all leaderboards
// export const getLeaderboards = async (): Promise<Leaderboard[]> => {
//   const { data } = await axiosInstance.get("/leaderboards");
//   return data;
// };

// // Get a single leaderboard by ID
// export const getLeaderboardById = async (id: string): Promise<Leaderboard> => {
//   const { data } = await axiosInstance.get(`/leaderboards/${id}`);
//   return data;
// };

// // Create a new leaderboard
// export const createLeaderboard = async (
//   payload: Omit<Leaderboard, "id" | "createdAt" | "updatedAt">
// ): Promise<Leaderboard> => {
//   const { data } = await axiosInstance.post("/leaderboards", payload);
//   return data;
// };

// // Update an existing leaderboard
// export const updateLeaderboard = async (
//   id: string,
//   payload: Partial<Leaderboard>
// ): Promise<Leaderboard> => {
//   const { data } = await axiosInstance.put(`/leaderboards/${id}`, payload);
//   return data;
// };

// // Delete a leaderboard
// export const deleteLeaderboard = async (id: string): Promise<void> => {
//   await axiosInstance.delete(`/leaderboards/${id}`);
// };

import type { Leaderboard } from "../types/leaderboard.types";
import { leaderboards as dummyData } from "./leaderboard.mock";

let leaderboardsDB: Leaderboard[] = [...dummyData];

export const getLeaderboards = async (): Promise<Leaderboard[]> => {
  // Simulate network delay
  return new Promise((resolve) =>
    setTimeout(() => resolve(leaderboardsDB), 500)
  );
};

export const getLeaderboardById = async (id: string): Promise<Leaderboard> => {
  const lb = leaderboardsDB.find((l) => l.id === id);
  if (!lb) throw new Error("Leaderboard not found");
  return new Promise((resolve) => setTimeout(() => resolve(lb), 500));
};

export const createLeaderboard = async (
  payload: Omit<Leaderboard, "id" | "createdAt" | "updatedAt">
): Promise<Leaderboard> => {
  const newLb: Leaderboard = {
    ...payload,
    id: String(leaderboardsDB.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  leaderboardsDB.push(newLb);
  return new Promise((resolve) => setTimeout(() => resolve(newLb), 500));
};

export const updateLeaderboard = async (
  id: string,
  payload: Partial<Leaderboard>
): Promise<Leaderboard> => {
  const index = leaderboardsDB.findIndex((l) => l.id === id);
  if (index === -1) throw new Error("Leaderboard not found");
  leaderboardsDB[index] = {
    ...leaderboardsDB[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };
  return new Promise((resolve) =>
    setTimeout(() => resolve(leaderboardsDB[index]), 500)
  );
};

export const deleteLeaderboard = async (id: string): Promise<void> => {
  leaderboardsDB = leaderboardsDB.filter((l) => l.id !== id);
  return new Promise((resolve) => setTimeout(resolve, 500));
};
