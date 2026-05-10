import redis from "./redisClient";

const TTL_SECONDS = 60 * 60; // 1 hour

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const cached = await redis.get(key);
    if (!cached) return null;
    return JSON.parse(cached) as T;
  } catch {
    return null; 
  }
};

export const setCache = async (key: string, value: unknown): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(value), "EX", TTL_SECONDS);
  } catch {
    
  }
};

export const buildKey = (type: string, username: string): string =>
  `devpulse:${type}:${username.toLowerCase()}`;