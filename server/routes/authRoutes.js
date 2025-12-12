import { Router } from "express";
import express from "express";
import { login, register, me } from "../controllers/authController.js";
import { requireAuth } from "../utils/utilities.js";

const router = express.Router()
router.get('/health', (_req, res) => res.json({ ok: true })); // debug
router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, me);

export default router;
