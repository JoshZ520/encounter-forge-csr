import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { connectToDatabase, disconnectFromDatabase } from "../../src/lib/mongoose";
import encountersRouter from "../../src/api/encounters/encounters.routes";
import { errorHandler, notFoundHandler } from "../../src/middleware/errorHandler";
import { EncounterModel } from "../../src/models/encounter.model";

const hasMongoUri = Boolean(process.env.MONGODB_URI);

const describeIfMongo = hasMongoUri ? describe : describe.skip;

describeIfMongo("Encounters CRUD integration", () => {
  const app = express();
  const userA = "000000000000000000000111";
  const userB = "000000000000000000000222";

  function createToken(userId: string) {
    return jwt.sign(
      {
        sub: userId,
        email: `${userId}@example.com`,
        lastActivityAt: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  }

  const basePayload = {
    title: "Integration Encounter",
    partySize: 4,
    partyLevel: 5,
    environment: "Dungeon",
    difficulty: "Medium",
    targetCR: "5",
    status: "draft",
    monsters: [],
  };

  app.use(express.json());
  app.use("/encounters", encountersRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "integration-secret";
    process.env.SESSION_INACTIVITY_HOURS = "24";
    await connectToDatabase();
  });

  beforeEach(async () => {
    await EncounterModel.deleteMany({ title: /Integration Encounter/i });
  });

  afterAll(async () => {
    await EncounterModel.deleteMany({ title: /Integration Encounter/i });
    await disconnectFromDatabase();
  });

  it("creates, lists, updates, enforces ownership, and deletes encounters", async () => {
    const tokenA = createToken(userA);
    const tokenB = createToken(userB);

    const createResponse = await request(app)
      .post("/encounters")
      .set("Authorization", `Bearer ${tokenA}`)
      .send(basePayload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.title).toBe(basePayload.title);
    expect(createResponse.body.ownerUserId).toBe(userA);

    const encounterId = createResponse.body.id;

    const listResponse = await request(app)
      .get("/encounters")
      .set("Authorization", `Bearer ${tokenA}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.total).toBeGreaterThanOrEqual(1);
    expect(listResponse.body.items[0].id).toBe(encounterId);

    const updateResponse = await request(app)
      .put(`/encounters/${encounterId}`)
      .set("Authorization", `Bearer ${tokenA}`)
      .send({
        ...basePayload,
        title: "Integration Encounter Updated",
        status: "ready",
        monsters: [
          {
            isManual: true,
            name: "Ogre",
            quantity: 1,
            cr: "2",
          },
        ],
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.title).toBe("Integration Encounter Updated");
    expect(updateResponse.body.status).toBe("ready");

    const otherUserGetResponse = await request(app)
      .get(`/encounters/${encounterId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(otherUserGetResponse.status).toBe(404);

    const otherUserDeleteResponse = await request(app)
      .delete(`/encounters/${encounterId}`)
      .set("Authorization", `Bearer ${tokenB}`);

    expect(otherUserDeleteResponse.status).toBe(404);

    const ownerDeleteResponse = await request(app)
      .delete(`/encounters/${encounterId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(ownerDeleteResponse.status).toBe(204);

    const afterDeleteResponse = await request(app)
      .get(`/encounters/${encounterId}`)
      .set("Authorization", `Bearer ${tokenA}`);

    expect(afterDeleteResponse.status).toBe(404);
  });

  it("rejects unauthenticated access", async () => {
    const response = await request(app).get("/encounters");
    expect(response.status).toBe(401);
  });
});
