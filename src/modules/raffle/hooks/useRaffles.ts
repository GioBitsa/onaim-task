import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/raffle.api";

const RAFFLES_KEY = ["raffles"];
const RAFFLE_KEY = (id: string) => ["raffle", id];

export const useRaffles = () => {
  const qc = useQueryClient();

  const listQuery = useQuery({
    queryKey: RAFFLES_KEY,
    queryFn: api.getRaffles,
  });

  const detailQuery = (id: string) =>
    useQuery({
      queryKey: RAFFLE_KEY(id),
      queryFn: () => api.getRaffleById(id),
      enabled: !!id,
    });

  const createMutation = useMutation({
    mutationFn: api.createRaffle,
    onSuccess: () => qc.invalidateQueries({ queryKey: RAFFLES_KEY }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      api.updateRaffle(id, payload),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: RAFFLES_KEY });
      qc.invalidateQueries({ queryKey: RAFFLE_KEY(v.id) });
    },
  });

  return { listQuery, detailQuery, createMutation, updateMutation };
};
