import { Request, Response } from "express";
import { fetchGitHubUser, fetchUserRepos } from "../services/githubRestService";
import { getCache, setCache, buildKey } from "../services/cacheService";
import axios from "axios";

export const getUserProfile = async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const cacheKey = buildKey("profile", username);


  const cached = await getCache(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return res.json(cached);
  }

 
  try {
    const [user, topRepos] = await Promise.all([
      fetchGitHubUser(username),
      fetchUserRepos(username),
    ]);

    const payload = { user, topRepos };

    
    await setCache(cacheKey, payload);
    console.log(`Cache set: ${cacheKey}`);

    res.json(payload);
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