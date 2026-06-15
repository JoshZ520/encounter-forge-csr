import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface JwtAuthPayload {
  sub: string;
  email?: string;
  iat?: number;
  exp?: number;
  lastActivityAt?: number;
}

export interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    email?: string;
  };
}

function getBearerToken(req: Request) {
  const authHeader = req.header("authorization");

  if (!authHeader) {
    return null;
  }

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

function isSessionExpired(payload: JwtAuthPayload) {
  const inactivityHours = Number(process.env.SESSION_INACTIVITY_HOURS || 24);
  const maxIdleSeconds = inactivityHours * 60 * 60;
  const now = Math.floor(Date.now() / 1000);
  const lastActivity = payload.lastActivityAt || payload.iat;

  if (!lastActivity) {
    return false;
  }

  return now - lastActivity > maxIdleSeconds;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = getBearerToken(req);

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret is not configured" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtAuthPayload;

    if (!decoded?.sub) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    if (isSessionExpired(decoded)) {
      return res.status(401).json({ message: "Session expired due to inactivity" });
    }

    req.auth = {
      userId: decoded.sub,
      email: decoded.email,
    };

    return next();
  } catch {
    return res.status(401).json({ message: "Invalid authentication token" });
  }
}
