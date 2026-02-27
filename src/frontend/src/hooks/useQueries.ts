import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Game, LuckyNumberSet } from "../backend.d";
import { useActor } from "./useActor";

export function useAllGames() {
  const { actor, isFetching } = useActor();
  return useQuery<Game[]>({
    queryKey: ["games"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGames();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGame(gameId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Game | null>({
    queryKey: ["game", gameId?.toString()],
    queryFn: async () => {
      if (!actor || gameId === null) return null;
      return actor.getGame(gameId);
    },
    enabled: !!actor && !isFetching && gameId !== null,
  });
}

export function useLuckyNumberSetsForGame(gameId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<LuckyNumberSet[]>({
    queryKey: ["luckyNumbers", gameId?.toString()],
    queryFn: async () => {
      if (!actor || gameId === null) return [];
      return actor.getLuckyNumberSetsForGame(gameId);
    },
    enabled: !!actor && !isFetching && gameId !== null,
  });
}

export function useGenerateLuckyNumbers() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: bigint) => {
      if (!actor) throw new Error("No actor");
      const id = await actor.generateAndSaveLuckyNumbers(gameId);
      return id;
    },
    onSuccess: (_, gameId) => {
      queryClient.invalidateQueries({
        queryKey: ["luckyNumbers", gameId.toString()],
      });
    },
  });
}

export function useCreateGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      drawTime,
      colorTheme,
    }: {
      name: string;
      drawTime: bigint;
      colorTheme: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.createGame(name, drawTime, colorTheme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useUpdateGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      gameId,
      name,
      drawTime,
      colorTheme,
    }: {
      gameId: bigint;
      name: string;
      drawTime: bigint;
      colorTheme: string;
    }) => {
      if (!actor) throw new Error("No actor");
      return actor.updateGame(gameId, name, drawTime, colorTheme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}

export function useDeleteGame() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (gameId: bigint) => {
      if (!actor) throw new Error("No actor");
      return actor.deleteGame(gameId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["games"] });
    },
  });
}
