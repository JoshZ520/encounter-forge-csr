import { Types } from "mongoose";
import { ApiError } from "../middleware/errorHandler.js";
import { MonsterCatalogModel, type MonsterCatalogDocument } from "../models/monsterCatalog.model.js";

export interface MonsterCatalogQueryInput {
  environment?: string;
  includeAll?: boolean;
  q?: string;
  page: number;
  pageSize: number;
}

export interface MonsterCatalogListItem {
  id: string;
  name: string;
  cr: string;
  environments: string[];
  ac?: number | null;
  hp?: number | null;
  speed?: string | null;
  coreStats?: MonsterCatalogDocument["coreStats"];
  description?: string | null;
}

export interface MonsterCatalogListResult {
  items: MonsterCatalogListItem[];
  page: number;
  pageSize: number;
  total: number;
}

function buildCatalogFilter(input: MonsterCatalogQueryInput) {
  const filter: Record<string, unknown> = {};

  if (input.q) {
    filter.name = { $regex: input.q.trim(), $options: "i" };
  }

  if (!input.includeAll && input.environment) {
    filter.environments = input.environment;
  }

  return filter;
}

function normalizeNumber(value: unknown): number | undefined {
  return typeof value === "number" ? value : undefined;
}

function normalizeString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function toCatalogItem(doc: MonsterCatalogDocument & { _id: Types.ObjectId }): MonsterCatalogListItem {
  return {
    id: doc._id.toString(),
    name: doc.name,
    cr: doc.cr,
    environments: doc.environments,
    ac: normalizeNumber(doc.ac),
    hp: normalizeNumber(doc.hp),
    speed: normalizeString(doc.speed),
    coreStats: doc.coreStats,
    description: normalizeString(doc.description),
  } as MonsterCatalogListItem;
}

export async function listMonsterCatalog(input: MonsterCatalogQueryInput): Promise<MonsterCatalogListResult> {
  const skip = (input.page - 1) * input.pageSize;
  const filter = buildCatalogFilter(input);

  const [items, total] = await Promise.all([
    MonsterCatalogModel.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(input.pageSize)
      .lean(),
    MonsterCatalogModel.countDocuments(filter),
  ]) as [Array<MonsterCatalogDocument & { _id: Types.ObjectId }>, number];

  return {
    items: items.map(toCatalogItem),
    page: input.page,
    pageSize: input.pageSize,
    total,
  };
}

export async function createMonsterCatalogEntry(input: Partial<MonsterCatalogDocument>) {
  return MonsterCatalogModel.create(input);
}

export async function ensureLookupQueryIsValid(input: MonsterCatalogQueryInput) {
  if (input.page < 1 || input.pageSize < 1) {
    throw new ApiError(400, "Invalid paging parameters");
  }
}
