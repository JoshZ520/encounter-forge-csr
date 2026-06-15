import { apiClient } from "../../services/apiClient";
import type { EncounterFormValues } from "./encounterValidation";

export interface EncounterListItem {
  id: string;
  title: string;
  partySize: number;
  partyLevel: number;
  environment: string;
  difficulty: string;
  targetCR: string;
  status: string;
  updatedAt: string;
}

export interface EncounterDetail extends EncounterListItem {
  ownerUserId: string;
  notes?: string;
  monsters: EncounterFormValues["monsters"];
  createdAt: string;
}

export interface EncounterListResponse {
  items: EncounterListItem[];
  page: number;
  pageSize: number;
  total: number;
}

export async function fetchEncounters(page = 1, pageSize = 20) {
  const response = await apiClient.get<EncounterListResponse>("/encounters", {
    params: { page, pageSize },
  });

  return response.data;
}

export async function fetchEncounter(encounterId: string) {
  const response = await apiClient.get<EncounterDetail>(`/encounters/${encounterId}`);
  return response.data;
}

export async function createEncounter(values: EncounterFormValues) {
  const response = await apiClient.post<EncounterDetail>("/encounters", values);
  return response.data;
}

export async function updateEncounter(encounterId: string, values: EncounterFormValues) {
  const response = await apiClient.put<EncounterDetail>(`/encounters/${encounterId}`, values);
  return response.data;
}

export async function deleteEncounter(encounterId: string) {
  await apiClient.delete(`/encounters/${encounterId}`);
}
