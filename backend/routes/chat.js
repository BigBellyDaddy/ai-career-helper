import express from "express";
import { handleChat, handleRoadmap } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", handleChat);
router.post("/roadmap", handleRoadmap);

export default router;
