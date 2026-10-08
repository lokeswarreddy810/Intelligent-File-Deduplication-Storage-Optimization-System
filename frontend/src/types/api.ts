export interface ApiErrorResponse {
  detail?: string;
  message?: string;
}

export interface PaginationResponse {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}