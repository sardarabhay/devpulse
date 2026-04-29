import { Router } from "express";
import { getUserProfile } from "../controllers/userController";

const router = Router();

router.get("/:username", getUserProfile);

export default router;