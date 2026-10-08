import apiClient from "./axios";
import type {
  FileItem,
  FileListResponse,
  FileMetadata
} from "../types/file";

export interface FileListParams {
  page: number;
  page_size: number;
  search?: string;
  extension?: string;
  min_size?: number;
  max_size?: number;
  start_date?: string;
  end_date?: string;
  duplicate_only?: boolean;
  sort_by?: string;
  sort_order?: string;
}

export async function uploadFile(
  file: File
): Promise<FileItem> {
  const formData = new FormData();

  formData.append("file", file, file.name);

  const response = await apiClient.post<FileItem>(
    "/files/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
}

export async function getFiles(
  params: FileListParams
): Promise<FileListResponse> {
  const response =
    await apiClient.get<FileListResponse>(
      "/files",
      { params }
    );

  return response.data;
}

export async function getFile(
  fileId: string
): Promise<FileItem> {
  const response =
    await apiClient.get<FileItem>(
      `/files/${fileId}`
    );

  return response.data;
}

export async function getFileMetadata(
  fileId: string
): Promise<FileMetadata> {
  const response =
    await apiClient.get<FileMetadata>(
      `/files/${fileId}/metadata`
    );

  return response.data;
}

export async function downloadFile(
  fileId: string
): Promise<Blob> {
  const response =
    await apiClient.get<Blob>(
      `/files/${fileId}/download`,
      {
        responseType: "blob"
      }
    );

  return response.data;
}