import mongoose from "mongoose";

const DEFAULT_MONGO_URI = "mongodb://localhost:27017/encounter-forge";

export async function connectToDatabase() {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_MONGO_URI;

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
}

export async function disconnectFromDatabase() {
  if (mongoose.connection.readyState === 0) {
    return;
  }

  await mongoose.disconnect();
}
