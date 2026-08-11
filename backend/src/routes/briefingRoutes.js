import express from "express";
import {
  generateBriefing,
  getBriefingHistory,
} from "../controllers/briefingController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/generate", auth, generateBriefing);
router.get("/history", auth, getBriefingHistory);

export default router;
