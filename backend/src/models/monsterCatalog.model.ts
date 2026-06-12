import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import { CHALLENGE_RATING_VALUES, ENVIRONMENT_VALUES } from "./enums.js";

const coreStatsSchema = new Schema(
  {
    str: { type: Number, required: false },
    dex: { type: Number, required: false },
    con: { type: Number, required: false },
    int: { type: Number, required: false },
    wis: { type: Number, required: false },
    cha: { type: Number, required: false },
  },
  { _id: false }
);

const monsterCatalogSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    cr: { type: String, required: true, enum: CHALLENGE_RATING_VALUES, index: true },
    environments: { type: [String], required: true, enum: ENVIRONMENT_VALUES, default: [] },
    ac: { type: Number, required: false },
    hp: { type: Number, required: false },
    speed: { type: String, required: false },
    coreStats: { type: coreStatsSchema, required: false },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
    collection: "Monsters",
  }
);

monsterCatalogSchema.index({ name: 1, cr: 1 });

export type MonsterCatalogDocument = InferSchemaType<typeof monsterCatalogSchema>;
export type MonsterCatalogModelType = Model<MonsterCatalogDocument>;

export const MonsterCatalogModel =
  (mongoose.models.MonsterCatalog as MonsterCatalogModelType | undefined) ||
  mongoose.model<MonsterCatalogDocument, MonsterCatalogModelType>("MonsterCatalog", monsterCatalogSchema);
