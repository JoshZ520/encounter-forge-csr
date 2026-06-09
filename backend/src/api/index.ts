import { Router } from "express";
import authRouter from "./auth/auth.routes";
import encountersRouter from "./encounters/encounters.routes";
import monstersRouter from "./monsters/monsters.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/encounters", encountersRouter);
apiRouter.use("/monsters", monstersRouter);

export default apiRouter;
