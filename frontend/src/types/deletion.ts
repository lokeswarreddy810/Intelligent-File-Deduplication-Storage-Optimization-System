export interface DeletionImpact {
  file_id: string;
  filename: string;
  file_size: number;
  is_protected: boolean;
  is_duplicate: boolean;
  is_original: boolean;
  storage_recovered: number;
  replacement_original_id: string | null;
  requires_confirmation: boolean;
}

export interface FileDeleteRequest {
  confirm: boolean;
}

export interface FileDeleteResponse {
  file_id: string;
  filename: string;
  storage_recovered: number;
  deleted_at: string;
  message: string;
}

export interface DeletionHistory {
  id: string;
  file_id: string;
  filename: string;
  file_size: number;
  reason: string;
  storage_recovered: number;
  deleted_at: string;
}