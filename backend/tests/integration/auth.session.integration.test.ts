import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { requireAuth } from "../../src/middleware/auth";

describe("Auth session middleware", () => {
  const app = express();

  app.get("/protected", requireAuth, (_req, res) => {
    res.status(200).json({ ok: true });
  });

  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
    process.env.SESSION_INACTIVITY_HOURS = "24";
  });

  it("allows access with a valid token", async () => {
    const token = jwt.sign(
      {
        sub: "user-123",
        email: "dm@example.com",
        lastActivityAt: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const response = await request(app).get("/protected").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  it("denies access when token is missing", async () => {
    const response = await request(app).get("/protected");

    expect(response.status).toBe(401);
    expect(response.body.message).toContain("Authentication required");
  });

  it("denies access when session is expired by inactivity", async () => {
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        sub: "user-123",
        email: "dm@example.com",
        lastActivityAt: now - 60 * 60 * 25,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "26h" }
    );

    const response = await request(app).get("/protected").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toContain("Session expired");
  });
});
