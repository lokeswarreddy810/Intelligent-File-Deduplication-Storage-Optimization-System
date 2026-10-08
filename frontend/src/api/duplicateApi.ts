import apiClient from "./axios";
import type { DuplicateGroup } from "../types/duplicate";

export const getDuplicateGroups = async (): Promise<
  DuplicateGroup[]
> => {
  const response = await apiClient.get<DuplicateGroup[]>(
    "/duplicates"
  );

  return response.data;
};

export const getDuplicateGroup = async (
  groupId: string
): Promise<DuplicateGroup> => {
  const response = await apiClient.get<DuplicateGroup>(
    `/duplicates/${groupId}`
  );

  return response.data;
};