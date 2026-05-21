import { Router } from "express";
import { getShareableCard } from "../controllers/cardController";

const router = Router();

router.get("/:username", getShareableCard);

export default router;