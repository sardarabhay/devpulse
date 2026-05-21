import { Router } from "express";
import {
  redirectToGitHub,
  handleGitHubCallback,
  getMe,
  logout,
} from "../controllers/authController";

const router = Router();

router.get("/github", redirectToGitHub);
router.get("/github/callback", handleGitHubCallback);
router.get("/me", getMe);
router.post("/logout", logout);

export default router;