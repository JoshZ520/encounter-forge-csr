import { Types } from "mongoose";
import { ApiError } from "../middleware/errorHandler";
import { EncounterModel, type EncounterDocument } from "../models/encounter.model";

interface EncounterMonsterInput {
  sourceMonsterId?: string;
  isManual: boolean;
  name: string;
  quantity: number;
  cr: string;
  ac?: number;
  hp?: number;
  speed?: string;
  coreStats?: {
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    cha?: number;
  };
  description?: string;
  notes?: string;
}

export interface EncounterUpsertInput {
  title: string;
  partySize: number;
  partyLevel: number;
  environment: string;
  difficulty: string;
  targetCR: string;
  notes?: string;
  status: "draft" | "ready";
  monsters: EncounterMonsterInput[];
}

interface EncounterListItem {
  id: string;
  title: string;
  partySize: number;
  partyLevel: number;
  environment: string;
  difficulty: string;
  targetCR: string;
  status: string;
  updatedAt: Date;
}

export interface EncounterListResult {
  items: EncounterListItem[];
  page: number;
  pageSize: number;
  total: number;
}

function assertReadyState(input: EncounterUpsertInput) {
  if (input.status === "ready" && input.monsters.length < 1) {
    throw new ApiError(400, "Ready encounters must include at least one monster");
  }
}

function toEncounterDetail(doc: EncounterDocument & { _id: Types.ObjectId }) {
  return {
    id: doc._id.toString(),
    ownerUserId: doc.ownerUserId.toString(),
    title: doc.title,
    partySize: doc.partySize,
    partyLevel: doc.partyLevel,
    environment: doc.environment,
    difficulty: doc.difficulty,
    targetCR: doc.targetCR,
    notes: doc.notes,
    status: doc.status,
    monsters: doc.monsters.map((monster: any) => ({
      id: monster._id?.toString(),
      sourceMonsterId: monster.sourceMonsterId,
      isManual: monster.isManual,
      name: monster.name,
      quantity: monster.quantity,
      cr: monster.cr,
      ac: monster.ac,
      hp: monster.hp,
      speed: monster.speed,
      coreStats: monster.coreStats,
      description: monster.description,
      notes: monster.notes,
    })),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function normalizeUpsertInput(input: EncounterUpsertInput) {
  return {
    ...input,
    title: input.title.trim(),
    notes: input.notes?.trim() || undefined,
    monsters: input.monsters.map((monster) => ({
      ...monster,
      name: monster.name.trim(),
      notes: monster.notes?.trim() || undefined,
      description: monster.description?.trim() || undefined,
    })),
  };
}

async function findOwnedEncounterOrThrow(ownerUserId: string, encounterId: string) {
  if (!Types.ObjectId.isValid(encounterId)) {
    throw new ApiError(404, "Encounter not found");
  }

  const encounter = await EncounterModel.findOne({
    _id: encounterId,
    ownerUserId,
  });

  if (!encounter) {
    throw new ApiError(404, "Encounter not found");
  }

  return encounter;
}

export async function listEncounters(
  ownerUserId: string,
  page: number,
  pageSize: number
): Promise<EncounterListResult> {
  const skip = (page - 1) * pageSize;

  const [items, total] = await Promise.all([
    EncounterModel.find({ ownerUserId })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .select("title partySize partyLevel environment difficulty targetCR status updatedAt")
      .lean(),
    EncounterModel.countDocuments({ ownerUserId }),
  ]);

  return {
    items: items.map((item) => ({
      id: item._id.toString(),
      title: item.title,
      partySize: item.partySize,
      partyLevel: item.partyLevel,
      environment: item.environment,
      difficulty: item.difficulty,
      targetCR: item.targetCR,
      status: item.status,
      updatedAt: item.updatedAt,
    })),
    page,
    pageSize,
    total,
  };
}

export async function createEncounter(ownerUserId: string, input: EncounterUpsertInput) {
  const normalized = normalizeUpsertInput(input);
  assertReadyState(normalized);

  const encounter = await EncounterModel.create({
    ...normalized,
    ownerUserId,
  });

  return toEncounterDetail(encounter);
}

export async function getEncounterById(ownerUserId: string, encounterId: string) {
  const encounter = await findOwnedEncounterOrThrow(ownerUserId, encounterId);
  return toEncounterDetail(encounter);
}

export async function updateEncounter(ownerUserId: string, encounterId: string, input: EncounterUpsertInput) {
  const normalized = normalizeUpsertInput(input);
  assertReadyState(normalized);

  const encounter = await findOwnedEncounterOrThrow(ownerUserId, encounterId);
  encounter.set(normalized);
  await encounter.save();

  return toEncounterDetail(encounter);
}

export async function deleteEncounter(ownerUserId: string, encounterId: string) {
  const encounter = await findOwnedEncounterOrThrow(ownerUserId, encounterId);
  await encounter.deleteOne();
}
