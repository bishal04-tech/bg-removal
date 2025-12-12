// controllers/authController.js
import bcrypt from "bcrypt";
import User from "../models/userModel.js"

import { sendAuth, publicUser } from "../utils/utilities.js";

/** POST /api/auth/register */
export async function register(req, res) {
  try {
    const { email, password, firstName, lastName, photo } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters" });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const hash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hash,
      firstName: firstName || "",
      lastName: lastName || "",
      photo: photo || "",
      // creditBalance uses schema default (5)
    });

    return sendAuth(res, user);
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

/** POST /api/auth/login */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    return sendAuth(res, user);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

/** GET /api/auth/me (Authorization: Bearer <token>) */
export async function me(req, res) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json({ user: publicUser(user) });
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
