export interface AnalyticsFileItem {
  id: string;
  original_filename: string;
  file_size: number;
  mime_type: string;
  extension: string;
  status: string;
  created_at: string;
}

export interface StorageAnalytics {
  total_files: number;
  total_storage: number;
  duplicate_files: number;
  duplicate_storage: number;
  potential_storage_savings: number;
  largest_files: AnalyticsFileItem[];
  recent_uploads: AnalyticsFileItem[];
}