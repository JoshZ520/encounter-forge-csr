import "dotenv/config";
import cors from "cors";
import express from "express";
import apiRouter from "./api";
import { connectToDatabase } from "./lib/mongoose";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

const port = Number(process.env.PORT || 3000);

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Backend server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend server", error);
    process.exit(1);
  }
}

void startServer();
