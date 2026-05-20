import { useQuery } from "@tanstack/react-query";
import { fetchUserStats } from "../api/github";

export const useGitHubStats = (username: string) => {
  return useQuery({
    queryKey: ["stats", username],
    queryFn: () => fetchUserStats(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
};