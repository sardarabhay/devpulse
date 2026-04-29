import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRouter from "./routes/user";


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DevPulse server running 🚀" });
});

app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});