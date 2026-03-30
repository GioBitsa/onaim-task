import type { Wheel } from "../types/wheel.types";
import { wheels } from "./wheel.mock";

let wheelsDB: Wheel[] = [...wheels];

export const getWheels = async (): Promise<Wheel[]> => {
  return new Promise((res) => setTimeout(() => res(wheelsDB), 300));
};

export const getWheelById = async (id: string): Promise<Wheel> => {
  const wheel = wheelsDB.find((w) => w.id === id);
  if (!wheel) throw new Error("Wheel not found");

  return new Promise((res) => setTimeout(() => res(wheel), 300));
};

export const createWheel = async (
  data: Omit<Wheel, "id" | "createdAt" | "updatedAt">
) => {
  const newWheel: Wheel = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  wheelsDB.push(newWheel);

  return newWheel;
};

export const updateWheel = async (id: string, data: Partial<Wheel>) => {
  const index = wheelsDB.findIndex((w) => w.id === id);
  if (index === -1) throw new Error("Not found");

  wheelsDB[index] = {
    ...wheelsDB[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return wheelsDB[index];
};

export const deleteWheel = async (id: string) => {
  wheelsDB = wheelsDB.filter((w) => w.id !== id);
};
