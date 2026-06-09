import { Router } from "express";

const encountersRouter = Router();

encountersRouter.all("*", (_req, res) => {
  res.status(501).json({ message: "Encounters API is not implemented yet" });
});

export default encountersRouter;
