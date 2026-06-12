import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { performance } from "node:perf_hooks";
import request from "supertest";
import monstersRouter from "../../src/api/monsters/monsters.routes.js";
import { connectToDatabase, disconnectFromDatabase } from "../../src/lib/mongoose.js";
import { errorHandler, notFoundHandler } from "../../src/middleware/errorHandler.js";
import { MonsterCatalogModel } from "../../src/models/monsterCatalog.model.js";

const hasMongoUri = Boolean(process.env.MONGODB_URI);
const describeIfMongo = hasMongoUri ? describe : describe.skip;

describeIfMongo("Monster catalog performance regression", () => {
  const app = express();
  const userId = "000000000000000000000444";

  function createToken() {
    return jwt.sign(
      {
        sub: userId,
        email: "perf@example.com",
        lastActivityAt: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  }

  const token = createToken();

  app.use(express.json());
  app.use("/monsters", monstersRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "integration-secret";
    process.env.SESSION_INACTIVITY_HOURS = "24";
    await connectToDatabase();
  });

  beforeEach(async () => {
    await MonsterCatalogModel.deleteMany({ name: /PerfSpec-/i });
  });

  afterAll(async () => {
    await MonsterCatalogModel.deleteMany({ name: /PerfSpec-/i });
    await disconnectFromDatabase();
  });

  it("returns a filtered monster page within the regression budget", async () => {
    const tag = `PerfSpec-${Date.now()}`;

    await MonsterCatalogModel.create(
      Array.from({ length: 24 }, (_, index) => ({
        name: `${tag} Monster ${index + 1}`,
        cr: index % 2 === 0 ? "1" : "2",
        environments: [index % 2 === 0 ? "Dungeon" : "Forest"],
      }))
    );

    const startedAt = performance.now();
    const response = await request(app)
      .get("/monsters")
      .set("Authorization", `Bearer ${token}`)
      .query({ q: tag, includeAll: true, page: 1, pageSize: 10 });
    const elapsedMs = performance.now() - startedAt;

    expect(response.status).toBe(200);
    expect(response.body.items.length).toBe(10);
    expect(response.body.total).toBe(24);
    expect(elapsedMs).toBeLessThan(1500);
  });
});