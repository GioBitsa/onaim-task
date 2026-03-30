import type { Raffle } from "../types/raffle.types";
import { raffles as dummyData } from "./raffle.mock";

// raffle.api.ts
let rafflesDB: Raffle[] = [...dummyData];

export const getRaffles = async (): Promise<Raffle[]> =>
  new Promise((res) => setTimeout(() => res(rafflesDB), 500));

export const getRaffleById = async (id: string): Promise<Raffle> => {
  const r = rafflesDB.find((r) => r.id === id);
  if (!r) throw new Error("Raffle not found");
  return new Promise((res) => setTimeout(() => res(r), 500));
};

export const createRaffle = async (
  payload: Omit<Raffle, "id" | "createdAt" | "updatedAt">
): Promise<Raffle> => {
  const newRaffle = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  rafflesDB.push(newRaffle);
  return new Promise((res) => setTimeout(() => res(newRaffle), 500));
};

export const updateRaffle = async (
  id: string,
  payload: Partial<Raffle>
): Promise<Raffle> => {
  const index = rafflesDB.findIndex((r) => r.id === id);
  if (index === -1) throw new Error("Not found");

  rafflesDB[index] = {
    ...rafflesDB[index],
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  return new Promise((res) => setTimeout(() => res(rafflesDB[index]), 500));
};

export const deleteRaffle = async (id: string) => {
  rafflesDB = rafflesDB.filter((r) => r.id !== id);
};
