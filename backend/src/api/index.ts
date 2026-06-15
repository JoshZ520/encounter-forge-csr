import { Router } from "express";
import authRouter from "./auth/auth.routes.js";
import encountersRouter from "./encounters/encounters.routes.js";
import monstersRouter from "./monsters/monsters.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/encounters", encountersRouter);
apiRouter.use("/monsters", monstersRouter);

export default apiRouter;
