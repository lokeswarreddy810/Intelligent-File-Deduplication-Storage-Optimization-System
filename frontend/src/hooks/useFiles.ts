import {
  useCallback,
  useEffect,
  useState
} from "react";
import { fileService } from "../services/fileService";
import type {
  FileFilters,
  FileListResponse
} from "../types/file";

const defaultFilters: FileFilters = {
  search: "",
  extension: "",
  minSize: "",
  maxSize: "",
  startDate: "",
  endDate: "",
  duplicateOnly: false,
  sortBy: "created_at",
  sortOrder: "desc"
};

interface ValidationErrorItem {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
}

function getErrorMessage(
  error: unknown
): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          status?: number;
          data?: {
            detail?:
            | string
            | ValidationErrorItem[];
            message?: string;
          };
        };
      }
    ).response;

    const detail =
      response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      const messages = detail
        .map(
          (item) => item?.msg
        )
        .filter(
          (
            message
          ): message is string =>
            typeof message === "string"
        );

      if (messages.length > 0) {
        return messages.join(", ");
      }
    }

    if (
      typeof response?.data?.message ===
      "string"
    ) {
      return response.data.message;
    }

    if (response?.status === 422) {
      return "The uploaded file request was rejected. Please select a valid file and try again.";
    }

    return "Unable to load files.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load files.";
}

export function useFiles() {
  const [data, setData] =
    useState<FileListResponse | null>(null);

  const [filters, setFilters] =
    useState<FileFilters>(
      defaultFilters
    );

  const [page, setPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(10);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUploading, setIsUploading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadFiles =
    useCallback(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = {
          page,
          page_size: pageSize,
          search:
            filters.search.trim() ||
            undefined,
          extension:
            filters.extension ||
            undefined,
          min_size:
            filters.minSize
              ? Number(filters.minSize)
              : undefined,
          max_size:
            filters.maxSize
              ? Number(filters.maxSize)
              : undefined,
          start_date:
            filters.startDate
              ? `${filters.startDate}T00:00:00`
              : undefined,
          end_date:
            filters.endDate
              ? `${filters.endDate}T23:59:59`
              : undefined,
          duplicate_only:
            filters.duplicateOnly,
          sort_by: filters.sortBy,
          sort_order:
            filters.sortOrder
        };

        const result =
          await fileService.list(
            params
          );

        setData(result);
      } catch (requestError) {
        setError(
          getErrorMessage(
            requestError
          )
        );
      } finally {
        setIsLoading(false);
      }
    }, [
      page,
      pageSize,
      filters
    ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadFiles();
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [loadFiles]);

  const upload =
    useCallback(
      async (file: File) => {
        setIsUploading(true);
        setError(null);

        try {
          const uploaded =
            await fileService.upload(
              file
            );

          await loadFiles();

          return uploaded;
        } catch (uploadError) {
          setError(
            getErrorMessage(
              uploadError
            )
          );

          throw uploadError;
        } finally {
          setIsUploading(false);
        }
      },
      [loadFiles]
    );

  const updateFilters =
    useCallback(
      (
        updates: Partial<FileFilters>
      ) => {
        setPage(1);

        setFilters(
          (current) => ({
            ...current,
            ...updates
          })
        );
      },
      []
    );

  const resetFilters =
    useCallback(() => {
      setPage(1);
      setFilters(
        defaultFilters
      );
    }, []);

  return {
    files: data?.items ?? [],
    total: data?.total ?? 0,
    totalPages:
      data?.total_pages ?? 0,
    currentPage: page,
    pageSize,
    filters,
    isLoading,
    isUploading,
    error,
    setPage,
    setPageSize,
    updateFilters,
    resetFilters,
    upload,
    refresh: loadFiles
  };
}