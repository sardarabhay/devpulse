import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "DevPulse server running " });
});

app.get("/api/user/:username", async (req, res) => {
  const { username } = req.params;
  res.json({ message: `Will fetch GitHub data for ${username} soon.` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});