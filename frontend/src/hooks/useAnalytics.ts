import { useCallback, useEffect, useState } from "react";
import { analyticsService } from "../services/analyticsService";
import type { StorageAnalytics } from "../types/analytics";

interface UseAnalyticsResult {
  analytics: StorageAnalytics | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (
      error as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      }
    ).response;

    return (
      response?.data?.detail ??
      response?.data?.message ??
      "Unable to load storage analytics."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load storage analytics.";
}

export function useAnalytics(): UseAnalyticsResult {
  const [analytics, setAnalytics] =
    useState<StorageAnalytics | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        await analyticsService.getStorageAnalytics(10, 10);

      setAnalytics(data);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [refresh]);

  return {
    analytics,
    isLoading,
    error,
    refresh
  };
}