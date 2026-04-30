import { Request, Response } from "express";
import {
  fetchContributions,
  fetchLanguageStats,
} from "../services/githubGraphQLService";

export const getUserStats = async (req: Request, res: Response) => {
  const username = req.params.username as string;

  try {
    const [contributions, languages] = await Promise.all([
      fetchContributions(username),
      fetchLanguageStats(username),
    ]);

    res.json({ contributions, languages });
  } catch (err: any) {
    // GraphQL returns 200 even for errors — check message
    if (err.message?.includes("Could not resolve to a User")) {
      return res.status(404).json({ error: `User "${username}" not found.` });
    }

    console.error("Error in getUserStats:", err.message);
    res.status(500).json({ error: "Failed to fetch stats from GitHub." });
  }
};