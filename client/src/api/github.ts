import axios from "axios";
import type { UserProfileResponse } from "../types/github";
import type { StatsResponse } from "../types/github";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchUserProfile = async (
  username: string
): Promise<UserProfileResponse> => {
  const { data } = await api.get<UserProfileResponse>(`/api/user/${username}`);
  return data;
};

export const fetchUserStats = async (
  username: string
): Promise<StatsResponse> => {
  const { data } = await api.get<StatsResponse>(`/api/stats/${username}`);
  return data;
};