import { Router } from "express";

const authRouter = Router();

authRouter.all("*", (_req, res) => {
  res.status(501).json({ message: "Auth API is not implemented yet" });
});

export default authRouter;
