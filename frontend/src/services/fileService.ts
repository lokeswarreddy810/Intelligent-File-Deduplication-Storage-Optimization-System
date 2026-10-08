import {
  downloadFile,
  getFile,
  getFileMetadata,
  getFiles,
  uploadFile,
  type FileListParams
} from "../api/fileApi";
import type {
  FileItem,
  FileListResponse,
  FileMetadata
} from "../types/file";

export const fileService = {
  upload(file: File): Promise<FileItem> {
    return uploadFile(file);
  },

  list(
    params: FileListParams
  ): Promise<FileListResponse> {
    return getFiles(params);
  },

  getById(fileId: string): Promise<FileItem> {
    return getFile(fileId);
  },

  getMetadata(
    fileId: string
  ): Promise<FileMetadata> {
    return getFileMetadata(fileId);
  },

  async download(file: FileItem): Promise<void> {
    const blob = await downloadFile(file.id);

    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = file.original_filename;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.URL.revokeObjectURL(url);
  }
};