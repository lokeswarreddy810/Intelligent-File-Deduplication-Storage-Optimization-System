import {
  DeleteSweepOutlined,
  RefreshOutlined,
  StorageOutlined
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import DeletionHistoryTable from "../../components/deletion/DeletionHistoryTable";
import { deletionService } from "../../services/deletionService";
import type {
  DeletionHistory
} from "../../types/deletion";
import { formatFileSize } from "../../utils/file";

function getErrorMessage(
  error: unknown
): string {
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
      "Unable to load deletion history."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load deletion history.";
}

function DeletionHistoryPage() {
  const [history, setHistory] =
    useState<DeletionHistory[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadHistory = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result =
          await deletionService.getHistory();

        setHistory(result);
      } catch (requestError) {
        setHistory([]);
        setError(
          getErrorMessage(requestError)
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadHistory();
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [loadHistory]);

  const totalRecovered =
    history.reduce(
      (total, item) =>
        total + item.storage_recovered,
      0
    );

  return (
    <Box>
      <PageHeader
        title="Deletion History"
        description="Review completed file deletions and the storage recovered from each operation."
        action={
          <Button
            variant="outlined"
            startIcon={
              isLoading ? (
                <CircularProgress
                  size={18}
                  color="inherit"
                />
              ) : (
                <RefreshOutlined />
              )
            }
            onClick={() =>
              void loadHistory()
            }
            disabled={isLoading}
          >
            Refresh
          </Button>
        }
      />

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() =>
                void loadHistory()
              }
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)"
          },
          gap: 2.5,
          mb: 3
        }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "error.main",
                  backgroundColor:
                    "rgba(239, 68, 68, 0.12)"
                }}
              >
                <DeleteSweepOutlined />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Files Deleted
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800
                  }}
                >
                  {history.length}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "success.main",
                  backgroundColor:
                    "rgba(16, 185, 129, 0.12)"
                }}
              >
                <StorageOutlined />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Total Storage Recovered
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    color: "success.main"
                  }}
                >
                  {formatFileSize(
                    totalRecovered
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
              pb: 2
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700 }}
            >
              Deletion Records
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              Every completed deletion is recorded
              with its file information and storage
              impact.
            </Typography>
          </Box>

          <DeletionHistoryTable
            history={history}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default DeletionHistoryPage;