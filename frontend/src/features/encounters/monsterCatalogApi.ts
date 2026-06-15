import { apiClient } from "../../services/apiClient";
import { challengeRatingValues } from "./encounterValidation";

export interface MonsterCatalogItem {
  id: string;
  name: string;
  cr: (typeof challengeRatingValues)[number];
  environments: string[];
  ac?: number | null;
  hp?: number | null;
  speed?: string | null;
  coreStats?: {
    str?: number;
    dex?: number;
    con?: number;
    int?: number;
    wis?: number;
    cha?: number;
  };
  description?: string | null;
}

export interface MonsterCatalogResponse {
  items: MonsterCatalogItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface MonsterCatalogQuery {
  environment?: string;
  includeAll?: boolean;
  q?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchMonsterCatalog(query: MonsterCatalogQuery) {
  const response = await apiClient.get<MonsterCatalogResponse>("/monsters", { params: query });
  return response.data;
}
