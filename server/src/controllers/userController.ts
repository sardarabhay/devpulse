import { Request, Response } from "express";
import { fetchGitHubUser, fetchUserRepos } from "../services/githubRestService";
import axios from "axios";

export const getUserProfile = async (req: Request, res: Response) => {
  const username = req.params.username as string;

  try {
    const [user, topRepos] = await Promise.all([
      fetchGitHubUser(username),
      fetchUserRepos(username),
    ]);

    res.json({ user, topRepos });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;

      if (status === 404) {
        return res.status(404).json({ error: `User "${username}" not found on GitHub.` });
      }

      if (status === 403) {
        return res.status(429).json({ error: "GitHub API rate limit hit. Try again later." });
      }
    }

    console.error("Unexpected error in getUserProfile:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};