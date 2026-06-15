import { Router } from "express";
import { z } from "zod";
import { validateQuery } from "../../lib/validation.js";
import { requireAuth } from "../../middleware/auth.js";
import { listMonsterCatalog } from "../../services/monsterCatalog.service.js";

const monstersRouter = Router();

const monsterCatalogQuerySchema = z.object({
  environment: z.enum(["Dungeon", "Forest", "Urban", "Wilderness", "Underdark", "Other"]).optional(),
  includeAll: z.coerce.boolean().default(false),
  q: z.string().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

monstersRouter.get(
  "/",
  requireAuth,
  validateQuery(monsterCatalogQuerySchema),
  async (req, res, next) => {
    try {
      const query = monsterCatalogQuerySchema.parse(req.query as any);
      const result = await listMonsterCatalog(query);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  }
);

export default monstersRouter;
