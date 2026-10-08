import { useCallback, useEffect, useState } from "react";
import { getDuplicateGroup } from "../api/duplicateApi";
import type { DuplicateGroup } from "../types/duplicate";

interface UseDuplicateDetailsResult {
  group: DuplicateGroup | null;
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
      "Unable to load duplicate group."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load duplicate group.";
}

export function useDuplicateDetails(
  groupId: string
): UseDuplicateDetailsResult {
  const [group, setGroup] =
    useState<DuplicateGroup | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data =
        await getDuplicateGroup(groupId);

      setGroup(data);
    } catch (requestError) {
      setGroup(null);
      setError(
        getErrorMessage(requestError)
      );
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [refresh]);

  return {
    group,
    isLoading,
    error,
    refresh
  };
}