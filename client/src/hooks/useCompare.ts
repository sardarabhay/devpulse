import { useQuery } from "@tanstack/react-query";
import { fetchCompare } from "../api/github";

export const useCompare = (user1: string, user2: string) => {
  return useQuery({
    queryKey: ["compare", user1, user2],
    queryFn: () => fetchCompare(user1, user2),
    enabled: !!user1 && !!user2,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};