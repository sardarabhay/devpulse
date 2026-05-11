import dotenv from "dotenv";
import redis from "./services/redisClient";
dotenv.config();

import express from "express";
import cors from "cors";
import userRouter from "./routes/user";
import statsRouter from "./routes/stats";
import compareRouter from "./routes/compare";

redis.connect().catch(() => {
  console.warn("Redis unavailable .. caching disabled, app still works");
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DevPulse server running 🚀" });
});

app.use("/api/user", userRouter);
app.use("/api/stats", statsRouter);
app.use("/api/compare", compareRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});