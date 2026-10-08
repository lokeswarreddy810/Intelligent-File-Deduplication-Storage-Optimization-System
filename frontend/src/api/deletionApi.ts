import apiClient from "./axios";
import type {
  DeletionHistory,
  DeletionImpact,
  FileDeleteResponse
} from "../types/deletion";

export const getDeletionImpact = async (
  fileId: string
): Promise<DeletionImpact> => {
  const response = await apiClient.get<DeletionImpact>(
    `/deletion/${fileId}/impact`
  );

  return response.data;
};

export const deleteFile = async (
  fileId: string,
  confirm: boolean
): Promise<FileDeleteResponse> => {
  const response = await apiClient.post<FileDeleteResponse>(
    `/deletion/${fileId}`,
    {
      confirm
    }
  );

  return response.data;
};

export const getDeletionHistory = async (): Promise<
  DeletionHistory[]
> => {
  const response = await apiClient.get<DeletionHistory[]>(
    "/deletion/history"
  );

  return response.data;
};