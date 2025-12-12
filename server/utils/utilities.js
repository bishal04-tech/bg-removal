// utils/utilities.js
import jwt from "jsonwebtoken";

/** Create a signed JWT for a user id */
export function createToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

/** Strip sensitive fields before sending user to client */
export function publicUser(userDoc) {
  if (!userDoc) return null;
  // userDoc might be a Mongoose doc — access via plain object
  const { _id, email, photo, firstName, lastName, creditBalance } =
    userDoc.toObject ? userDoc.toObject() : userDoc;

  return { _id, email, photo, firstName, lastName, creditBalance };
}

/** Send token + safe user to client (no cookies; JSON only) */
export function sendAuth(res, user) {
  const token = createToken(user._id);
  return res.status(200).json({ token, user: publicUser(user) });
}

/** Auth guard middleware (simple: responds 401 on failure) */
export function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    return next(); // proceed to the actual handler
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

/** Tiny async wrapper if you want it */
export const asyncHandler =
  (fn) =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
