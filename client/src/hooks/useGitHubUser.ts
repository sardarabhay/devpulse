import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../api/github";

export const useGitHubUser = (username: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: () => fetchUserProfile(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 60, // 1 hour — matches server TTL
    retry: false,
  });
};