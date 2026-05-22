import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    if (times > 5) {
      console.warn("Redis unavailable after 5 retries — giving up");
      return null;
    }
    return Math.min(times * 500, 3000);
  },
});

redis.on("connect", () => console.log("Redis connected ✅"));
redis.on("error", (err) => console.warn("Redis error (non-fatal):", err.message));

export default redis;