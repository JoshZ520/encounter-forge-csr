import { Router } from "express";
import { z } from "zod";
import { validateBody, validateParams, validateQuery } from "../../lib/validation.js";
import { requireAuth } from "../../middleware/auth.js";
import type { AuthenticatedRequest } from "../../middleware/auth.js";
import {
  createEncounter,
  deleteEncounter,
  getEncounterById,
  listEncounters,
  updateEncounter,
} from "../../services/encounter.service.js";
import {
  CHALLENGE_RATING_VALUES,
  DIFFICULTY_VALUES,
  ENCOUNTER_STATUS_VALUES,
  ENVIRONMENT_VALUES,
} from "../../models/enums.js";

const encountersRouter = Router();

const encounterMonsterSchema = z.object({
  sourceMonsterId: z.string().optional(),
  isManual: z.boolean(),
  name: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
  cr: z.enum(CHALLENGE_RATING_VALUES),
  ac: z.number().optional(),
  hp: z.number().optional(),
  speed: z.string().optional(),
  coreStats: z
    .object({
      str: z.number().optional(),
      dex: z.number().optional(),
      con: z.number().optional(),
      int: z.number().optional(),
      wis: z.number().optional(),
      cha: z.number().optional(),
    })
    .optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
});

const encounterUpsertSchema = z.object({
  title: z.string().min(1),
  partySize: z.number().int().min(1).max(10),
  partyLevel: z.number().int().min(1).max(20),
  environment: z.enum(ENVIRONMENT_VALUES),
  difficulty: z.enum(DIFFICULTY_VALUES),
  targetCR: z.enum(CHALLENGE_RATING_VALUES),
  notes: z.string().optional(),
  status: z.enum(ENCOUNTER_STATUS_VALUES),
  monsters: z.array(encounterMonsterSchema),
});

const encounterParamsSchema = z.object({
  encounterId: z.string().min(1),
});

const encounterListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

function getUserId(req: AuthenticatedRequest) {
  return req.auth?.userId;
}

encountersRouter.get("/", requireAuth, validateQuery(encounterListQuerySchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { page, pageSize } = req.query as unknown as { page: number; pageSize: number };
    const result = await listEncounters(userId, page, pageSize);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

encountersRouter.post("/", requireAuth, validateBody(encounterUpsertSchema), async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const result = await createEncounter(userId, req.body);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
});

encountersRouter.get(
  "/:encounterId",
  requireAuth,
  validateParams(encounterParamsSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { encounterId } = req.params;
      const result = await getEncounterById(userId, encounterId);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

encountersRouter.put(
  "/:encounterId",
  requireAuth,
  validateParams(encounterParamsSchema),
  validateBody(encounterUpsertSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { encounterId } = req.params;
      const result = await updateEncounter(userId, encounterId, req.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

encountersRouter.delete(
  "/:encounterId",
  requireAuth,
  validateParams(encounterParamsSchema),
  async (req: AuthenticatedRequest, res, next) => {
    try {
      const userId = getUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { encounterId } = req.params;
      await deleteEncounter(userId, encounterId);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
);

export default encountersRouter;
