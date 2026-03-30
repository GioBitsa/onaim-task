import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { Wheel } from "../types/wheel.types";
import {
  createWheel,
  deleteWheel,
  getWheelById,
  getWheels,
  updateWheel,
} from "../api/wheel.api";

// 🔑 Query Keys (IMPORTANT for assessment)
export const wheelKeys = {
  all: ["wheels"] as const,
  lists: () => [...wheelKeys.all, "list"] as const,
  detail: (id: string) => [...wheelKeys.all, "detail", id] as const,
};

export const useWheels = () => {
  const queryClient = useQueryClient();

  // 📄 LIST
  const listQuery = useQuery({
    queryKey: wheelKeys.lists(),
    queryFn: getWheels,
  });

  // 🔍 DETAIL
  const detailQuery = (id: string) =>
    useQuery({
      queryKey: wheelKeys.detail(id),
      queryFn: () => getWheelById(id),
      enabled: !!id,
    });

  // ➕ CREATE
  const createMutation = useMutation({
    mutationFn: (payload: Omit<Wheel, "id" | "createdAt" | "updatedAt">) =>
      createWheel(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wheelKeys.lists() });
    },
  });

  // ✏️ UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Wheel> }) =>
      updateWheel(id, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: wheelKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: wheelKeys.detail(variables.id),
      });
    },
  });

  // ❌ DELETE
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWheel(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wheelKeys.lists() });
    },
  });

  return {
    listQuery,
    detailQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
