import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import userRouter from "./routes/user";
import statsRouter from "./routes/stats";
import compareRouter from "./routes/compare";
import authRouter from "./routes/auth";
import redis from "./services/redisClient";
import cardRouter from "./routes/card";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, 
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DevPulse server running 🚀" });
});

app.use("/api/user", userRouter);
app.use("/api/stats", statsRouter);
app.use("/api/compare", compareRouter);
app.use("/auth", authRouter);
app.use("/api/card", cardRouter);

redis.connect().catch(() => {
  console.warn("Redis unavailable — caching disabled, app still works");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});