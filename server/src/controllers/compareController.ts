import { Request, Response } from "express";
import { fetchGitHubUser, fetchUserRepos } from "../services/githubRestService";
import { fetchContributions, fetchLanguageStats } from "../services/githubGraphQLService";
import { computePersona } from "../services/personaService";
import { getCache, setCache, buildKey } from "../services/cacheService";

const buildUserData = async (username: string) => {
  const profileKey = buildKey("profile", username);
  const statsKey = buildKey("stats", username);

  
  const [cachedProfile, cachedStats] = await Promise.all([
    getCache(profileKey),
    getCache(statsKey),
  ]);

 
  const [profile, stats] = await Promise.all([
    cachedProfile
      ? Promise.resolve(cachedProfile)
      : Promise.all([fetchGitHubUser(username), fetchUserRepos(username)]).then(
          async ([user, topRepos]) => {
            const payload = { user, topRepos };
            await setCache(profileKey, payload);
            return payload;
          }
        ),

    cachedStats
      ? Promise.resolve(cachedStats)
      : Promise.all([
          fetchContributions(username),
          fetchLanguageStats(username),
        ]).then(async ([contributions, languages]) => {
          const persona = computePersona(contributions);
          const payload = { contributions, languages, persona };
          await setCache(statsKey, payload);
          return payload;
        }),
  ]);

  return { ...(profile as object), ...(stats as object), username };
};

export const compareUsers = async (req: Request, res: Response) => {
  const user1 = req.params.user1 as string;
  const user2 = req.params.user2 as string;

  const compareKey = buildKey("compare", `${user1}_${user2}`);

  const cached = await getCache(compareKey);
  if (cached) {
    console.log(`Cache hit: ${compareKey}`);
    return res.json(cached);
  }

  try {
    
    const [userData1, userData2] = await Promise.all([
      buildUserData(user1),
      buildUserData(user2),
    ]);

    const payload = { user1: userData1, user2: userData2 };

    await setCache(compareKey, payload);
    res.json(payload);
  } catch (err: any) {
    if (err.message?.includes("Could not resolve to a User")) {
      return res.status(404).json({ error: "One or both users not found on GitHub." });
    }

    console.error("Error in compareUsers:", err.message);
    res.status(500).json({ error: "Failed to fetch comparison data." });
  }
};