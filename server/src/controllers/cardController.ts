import type { Request, Response } from "express";
import { generateCard } from "../services/cardService";
import { getCache, setCache, buildKey } from "../services/cacheService";

export const getShareableCard = async (req: Request, res: Response) => {
  const username = req.params.username as string;
  const cacheKey = buildKey("card", username);

  const cached = await getCache<string>(cacheKey);
  if (cached) {
    const buf = Buffer.from(cached, "base64");
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.send(buf);
  }

  try {
    const buffer = await generateCard(username);
    await setCache(cacheKey, buffer.toString("base64"));

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(buffer);
  } catch (err) {
    console.error("Card generation error:", err);
    res.status(500).json({ error: "Failed to generate card." });
  }
};