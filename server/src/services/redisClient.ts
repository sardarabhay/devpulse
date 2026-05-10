import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
});

redis.on("connect", () => console.log("Redis connected ✅"));
redis.on("error", (err) => console.warn("Redis error (non-fatal):", err.message));

export default redis;