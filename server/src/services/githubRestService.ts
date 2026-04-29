import axios from "axios";
import { GitHubUser, GitHubRepo } from "../types/github";

const githubClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
});

export const fetchGitHubUser = async (username: string): Promise<GitHubUser> => {
  const { data } = await githubClient.get<GitHubUser>(`/users/${username}`);
  return data;
};

export const fetchUserRepos = async (username: string): Promise<GitHubRepo[]> => {
  const { data } = await githubClient.get<GitHubRepo[]>(
    `/users/${username}/repos`,
    {
      params: {
        sort: "updated",
        per_page: 100, // fetch all, we'll filter top 6 ourselves
        type: "owner",
      },
    }
  );

  // Sort by stars, return top 6
  return data
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);
};