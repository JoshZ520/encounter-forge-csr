import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../../lib/validation.js";
import { requireAuth } from "../../middleware/auth.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";
import { registerUser, loginUser, logoutUser } from "../../services/auth.service.js";

const authRouter = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// POST /auth/register
authRouter.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await registerUser({ email, password });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

// POST /auth/login
authRouter.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

// POST /auth/logout
authRouter.post("/logout", requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    await logoutUser(userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default authRouter;
