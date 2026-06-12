import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import encountersRouter from "../../src/api/encounters/encounters.routes.js";
import { connectToDatabase, disconnectFromDatabase } from "../../src/lib/mongoose.js";
import monstersRouter from "../../src/api/monsters/monsters.routes.js";
import { errorHandler, notFoundHandler } from "../../src/middleware/errorHandler.js";
import { EncounterModel } from "../../src/models/encounter.model.js";
import { MonsterCatalogModel } from "../../src/models/monsterCatalog.model.js";

const hasMongoUri = Boolean(process.env.MONGODB_URI);
const describeIfMongo = hasMongoUri ? describe : describe.skip;

describeIfMongo("Monster snapshots integration", () => {
  const app = express();
  const ownerUserId = "000000000000000000000333";

  function createToken() {
    return jwt.sign(
      {
        sub: ownerUserId,
        email: "dm@example.com",
        lastActivityAt: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
  }

  const token = createToken();

  const manualPayload = {
    title: "Monster Snapshot Manual",
    partySize: 4,
    partyLevel: 5,
    environment: "Dungeon",
    difficulty: "Medium",
    targetCR: "5",
    status: "draft",
    notes: "",
    monsters: [
      {
        isManual: true,
        name: "Custom Ogre",
        quantity: 2,
        cr: "2",
        notes: "A hand-written boss",
      },
    ],
  };

  app.use(express.json());
  app.use("/encounters", encountersRouter);
  app.use("/monsters", monstersRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || "integration-secret";
    process.env.SESSION_INACTIVITY_HOURS = "24";
    await connectToDatabase();
  });

  beforeEach(async () => {
    await EncounterModel.deleteMany({ title: /Monster Snapshot/i });
    await MonsterCatalogModel.deleteMany({ name: /Snapshot/i });
  });

  afterAll(async () => {
    await EncounterModel.deleteMany({ title: /Monster Snapshot/i });
    await MonsterCatalogModel.deleteMany({ name: /Snapshot/i });
    await disconnectFromDatabase();
  });

  it("returns catalog lookups with filtering, fallback, and pagination", async () => {
    const uniqueTag = `Spec-${Date.now()}`;

    await MonsterCatalogModel.create([
      { name: `${uniqueTag} Dungeon Goblin`, cr: "1", environments: ["Dungeon"] },
      { name: `${uniqueTag} Forest Drake`, cr: "5", environments: ["Forest"] },
      { name: `${uniqueTag} Urban Guard`, cr: "2", environments: ["Urban"] },
    ]);

    const dungeonResponse = await request(app)
      .get("/monsters")
      .set("Authorization", `Bearer ${token}`)
      .query({ environment: "Dungeon", q: uniqueTag, page: 1, pageSize: 10 });

    expect(dungeonResponse.status).toBe(200);
    expect(dungeonResponse.body.total).toBe(1);
    expect(dungeonResponse.body.items[0].name).toBe(`${uniqueTag} Dungeon Goblin`);

    const fallbackResponse = await request(app)
      .get("/monsters")
      .set("Authorization", `Bearer ${token}`)
      .query({ environment: "Dungeon", includeAll: true, q: uniqueTag, page: 1, pageSize: 10 });

    expect(fallbackResponse.status).toBe(200);
    expect(fallbackResponse.body.total).toBe(3);

    const pagedResponse = await request(app)
      .get("/monsters")
      .set("Authorization", `Bearer ${token}`)
      .query({ includeAll: true, q: uniqueTag, page: 2, pageSize: 2 });

    expect(pagedResponse.status).toBe(200);
    expect(pagedResponse.body.page).toBe(2);
    expect(pagedResponse.body.pageSize).toBe(2);
    expect(pagedResponse.body.items.length).toBe(1);
  });

  it("keeps encounter snapshots immutable after the source catalog changes", async () => {
    const sourceMonster = await MonsterCatalogModel.create({
      name: "Snapshot Hydra",
      cr: "5",
      environments: ["Wilderness"],
      description: "Original catalog description",
    });

    const createEncounterResponse = await request(app)
      .post("/encounters")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...manualPayload,
        title: "Monster Snapshot Encounter",
        monsters: [
          {
            sourceMonsterId: sourceMonster.id,
            isManual: false,
            name: sourceMonster.name,
            quantity: 1,
            cr: sourceMonster.cr,
            description: sourceMonster.description,
            notes: "Captured from catalog",
          },
        ],
      });

    expect(createEncounterResponse.status).toBe(201);
    expect(createEncounterResponse.body.monsters[0].name).toBe("Snapshot Hydra");
    expect(createEncounterResponse.body.monsters[0].description).toBe("Original catalog description");

    await MonsterCatalogModel.updateOne(
      { _id: sourceMonster._id },
      { $set: { name: "Snapshot Hydra Updated", description: "Changed catalog description" } }
    );

    const loadedEncounter = await EncounterModel.findById(createEncounterResponse.body.id).lean();
    expect(loadedEncounter?.monsters[0].name).toBe("Snapshot Hydra");
    expect(loadedEncounter?.monsters[0].description).toBe("Original catalog description");
  });
});
