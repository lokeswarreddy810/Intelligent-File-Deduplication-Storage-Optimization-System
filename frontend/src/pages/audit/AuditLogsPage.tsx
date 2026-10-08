import {
  AssessmentOutlined,
  RefreshOutlined
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
import AuditLogTable from "../../components/audit/AuditLogTable";
import { auditService } from "../../services/auditService";
import type { AuditLog } from "../../types/audit";

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
      "Unable to load audit logs."
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to load audit logs.";
}

function AuditLogsPage() {
  const [logs, setLogs] =
    useState<AuditLog[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadLogs = useCallback(
    async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result =
          await auditService.getLogs();

        setLogs(result);
      } catch (requestError) {
        setLogs([]);
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
      void loadLogs();
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [loadLogs]);

  return (
    <Box>
      <PageHeader
        title="Audit Logs"
        description="Review security and file-management activities recorded for your account."
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
              void loadLogs()
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
                void loadLogs()
              }
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box
            sx={{
              p: 3,
              pb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1.5
            }}
          >
            <AssessmentOutlined color="primary" />

            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Activity History
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Recorded actions associated with
                files and storage management.
              </Typography>
            </Box>
          </Box>

          <AuditLogTable
            logs={logs}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default AuditLogsPage;