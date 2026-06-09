import { Router } from "express";

const monstersRouter = Router();

monstersRouter.all("*", (_req, res) => {
  res.status(501).json({ message: "Monsters API is not implemented yet" });
});

export default monstersRouter;
