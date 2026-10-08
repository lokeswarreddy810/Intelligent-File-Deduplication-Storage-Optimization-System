import apiClient from "./axios";
import type { StorageAnalytics } from "../types/analytics";

export const getStorageAnalytics = async (
  largestLimit = 10,
  recentLimit = 10
): Promise<StorageAnalytics> => {
  const response = await apiClient.get<StorageAnalytics>(
    "/analytics/storage",
    {
      params: {
        largest_limit: largestLimit,
        recent_limit: recentLimit
      }
    }
  );

  return response.data;
};