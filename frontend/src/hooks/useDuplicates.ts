import { useCallback, useEffect, useState } from "react";
import { getDuplicateGroups } from "../api/duplicateApi";
import type { DuplicateGroup } from "../types/duplicate";

interface UseDuplicatesResult {
  groups: DuplicateGroup[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
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
      "Unable to load duplicate groups."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load duplicate groups.";
}

export function useDuplicates(): UseDuplicatesResult {
  const [groups, setGroups] = useState<DuplicateGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getDuplicateGroups();
      setGroups(data);
    } catch (requestError) {
      setGroups([]);
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
    groups,
    isLoading,
    error,
    refresh
  };
}