import { Router } from "express";
import { getUserStats } from "../controllers/statsController";

const router = Router();

router.get("/:username", getUserStats);

export default router;