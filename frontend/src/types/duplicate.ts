export interface DuplicateFile {
  id: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  extension: string;
  status: string;
  created_at: string;
}

export interface DuplicateGroup {
  id: string;
  hash_value: string;
  algorithm: string;
  original_file: DuplicateFile;
  duplicate_files: DuplicateFile[];
  total_files: number;
  file_size: number;
  total_storage: number;
  potential_savings: number;
  last_detected_at: string;
}