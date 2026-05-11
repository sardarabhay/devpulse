import { Router } from "express";
import { compareUsers } from "../controllers/compareController";

const router = Router();

router.get("/:user1/:user2", compareUsers);

export default router;