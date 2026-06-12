import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";
import {
  CHALLENGE_RATING_VALUES,
  DIFFICULTY_VALUES,
  ENCOUNTER_STATUS_VALUES,
  ENVIRONMENT_VALUES,
} from "./enums";

const encounterMonsterSnapshotSchema = new Schema(
  {
    sourceMonsterId: { type: String, required: false },
    isManual: { type: Boolean, required: true },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1, max: 99, default: 1 },
    cr: { type: String, required: true, enum: CHALLENGE_RATING_VALUES },
    ac: { type: Number, required: false },
    hp: { type: Number, required: false },
    speed: { type: String, required: false },
    coreStats: {
      str: { type: Number, required: false },
      dex: { type: Number, required: false },
      con: { type: Number, required: false },
      int: { type: Number, required: false },
      wis: { type: Number, required: false },
      cha: { type: Number, required: false },
    },
    description: { type: String, required: false },
    notes: { type: String, required: false },
  },
  { _id: true }
);

const encounterSchema = new Schema(
  {
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    partySize: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    partyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },
    environment: {
      type: String,
      required: true,
      enum: ENVIRONMENT_VALUES,
    },
    difficulty: {
      type: String,
      required: true,
      enum: DIFFICULTY_VALUES,
    },
    targetCR: {
      type: String,
      required: true,
      enum: CHALLENGE_RATING_VALUES,
    },
    notes: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ENCOUNTER_STATUS_VALUES,
    },
    monsters: {
      type: [encounterMonsterSnapshotSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export type EncounterDocument = InferSchemaType<typeof encounterSchema>;
export type EncounterModelType = Model<EncounterDocument>;

export const EncounterModel =
  (mongoose.models.Encounter as EncounterModelType | undefined) ||
  mongoose.model<EncounterDocument, EncounterModelType>("Encounter", encounterSchema);
