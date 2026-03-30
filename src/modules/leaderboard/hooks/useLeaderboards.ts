import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getLeaderboards,
  getLeaderboardById,
  createLeaderboard,
  updateLeaderboard,
  deleteLeaderboard,
} from "../api/leaderboard.api";
import type { Leaderboard } from "../types/leaderboard.types";

// Query keys
const LEADERBOARDS_KEY = ["leaderboards"];
const LEADERBOARD_KEY = (id: string) => ["leaderboard", id];

export const useLeaderboards = () => {
  const queryClient = useQueryClient();

  // Fetch all leaderboards
  const listQuery = useQuery({
    queryKey: LEADERBOARDS_KEY,
    queryFn: getLeaderboards,
  });

  // Fetch single leaderboard by ID
  const detailQuery = (id: string) =>
    useQuery({
      queryKey: LEADERBOARD_KEY(id),
      queryFn: () => getLeaderboardById(id),
      enabled: !!id,
    });

  // Create a new leaderboard
  const createMutation = useMutation({
    mutationFn: createLeaderboard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARDS_KEY });
    },
  });

  // Update an existing leaderboard
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Leaderboard>;
    }) => updateLeaderboard(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARDS_KEY });
      queryClient.invalidateQueries({
        queryKey: LEADERBOARD_KEY(variables.id),
      });
    },
  });

  // Delete a leaderboard
  const deleteMutation = useMutation({
    mutationFn: deleteLeaderboard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LEADERBOARDS_KEY });
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
