import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import type { InsertGameResult } from "@shared/routes";

export function useSubmitGameResult() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertGameResult) => {
      const res = await fetch(api.game.submit.path, {
        method: api.game.submit.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to submit result");
      }

      return api.game.submit.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      if (data.isWin) {
        toast({
          title: "Result Saved!",
          description: `You completed the maze in ${data.movesCount} moves.`,
          variant: "default",
        });
      }
    },
    onError: () => {
      // Silently fail as requested
    },
  });
}
