import { Request, Response } from "express";
import { fetchContributions, fetchLanguageStats } from "../services/githubGraphQLService";
import { getCache, setCache, buildKey } from "../services/cacheService";
import { computePersona } from "../services/personaService";

export const getUserStats = async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const cacheKey = buildKey("stats", username);

  const cached = await getCache(cacheKey);
  if (cached) {
    console.log(`Cache hit: ${cacheKey}`);
    return res.json(cached);
  }

  try {
    const [contributions, languages] = await Promise.all([
      fetchContributions(username),
      fetchLanguageStats(username),
    ]);

    const persona = computePersona(contributions); 

    const payload = { contributions, languages, persona }; 

    await setCache(cacheKey, payload);
    console.log(`Cache set: ${cacheKey}`);

    res.json(payload);
  } catch (err: any) {
    if (err.message?.includes("Could not resolve to a User")) {
      return res.status(404).json({ error: `User "${username}" not found.` });
    }

    console.error("Error in getUserStats:", err.message);
    res.status(500).json({ error: "Failed to fetch stats from GitHub." });
  }
};