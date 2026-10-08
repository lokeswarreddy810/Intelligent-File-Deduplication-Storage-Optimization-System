export interface FileItem {
  id: string;
  original_filename: string;
  stored_filename: string;
  file_size: number;
  mime_type: string;
  extension: string;
  status: string;
  is_protected: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface FileListResponse {
  items: FileItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface FileMetadata {
  id: string;
  file_id: string;
  file_type: string | null;
  created_date: string | null;
  modified_date: string | null;
  last_accessed: string | null;
  metadata_json: Record<string, unknown> | null;
}

export interface FileFilters {
  search: string;
  extension: string;
  minSize: string;
  maxSize: string;
  startDate: string;
  endDate: string;
  duplicateOnly: boolean;
  sortBy:
    | "filename"
    | "size"
    | "created_at"
    | "updated_at"
    | "extension";
  sortOrder: "asc" | "desc";
}

export interface FileUploadResult {
  file: FileItem;
  message?: string;
}