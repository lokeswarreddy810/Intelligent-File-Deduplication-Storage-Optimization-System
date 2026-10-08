import {
  ArrowBackOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DescriptionOutlined,
  RefreshOutlined,
  SecurityOutlined
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import FileMetadataDialog from "../../components/files/FileMetadataDialog";
import DeletionImpactDialog from "../../components/deletion/DeletionImpactDialog";
import { deletionService } from "../../services/deletionService";
import { fileService } from "../../services/fileService";
import type {
  DeletionImpact
} from "../../types/deletion";
import type {
  FileItem
} from "../../types/file";
import { formatDate } from "../../utils/date";
import { formatFileSize } from "../../utils/file";

function getErrorMessage(
  error: unknown,
  fallback: string
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
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

function FileDetailsPage() {
  const navigate = useNavigate();
  const { fileId } = useParams<{
    fileId: string;
  }>();

  const [file, setFile] =
    useState<FileItem | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [metadataOpen, setMetadataOpen] =
    useState(false);

  const [impact, setImpact] =
    useState<DeletionImpact | null>(null);

  const [impactLoading, setImpactLoading] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [actionError, setActionError] =
    useState<string | null>(null);

  const loadFile = useCallback(async () => {
    if (!fileId) {
      setError(
        "File identifier is missing."
      );
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result =
        await fileService.getById(fileId);

      setFile(result);
    } catch (requestError) {
      setFile(null);
      setError(
        getErrorMessage(
          requestError,
          "Unable to load file details."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [fileId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadFile();
    }, 0);

    return () =>
      window.clearTimeout(timer);
  }, [loadFile]);

  const handleDownload = async () => {
    if (!file) {
      return;
    }

    setActionError(null);

    try {
      await fileService.download(file);
    } catch (downloadError) {
      setActionError(
        getErrorMessage(
          downloadError,
          "Unable to download the selected file."
        )
      );
    }
  };

  const handleDeleteRequest = async () => {
    if (!file) {
      return;
    }

    setActionError(null);
    setImpactLoading(true);

    try {
      const result =
        await deletionService.getImpact(
          file.id
        );

      setImpact(result);
    } catch (requestError) {
      setActionError(
        getErrorMessage(
          requestError,
          "Unable to determine the deletion impact."
        )
      );
    } finally {
      setImpactLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!file || !impact) {
      return;
    }

    setDeleting(true);
    setActionError(null);

    try {
      await deletionService.delete(
        file.id,
        true
      );

      setImpact(null);
      navigate("/deletion-history", {
        replace: true
      });
    } catch (deleteError) {
      setActionError(
        getErrorMessage(
          deleteError,
          "Unable to delete the selected file."
        )
      );
    } finally {
      setDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!file) {
    return (
      <Box>
        <PageHeader
          title="File Details"
          description="Review file information and manage the selected file."
          action={
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlined />}
              onClick={() =>
                navigate("/files")
              }
            >
              Back to Files
            </Button>
          }
        />

        <Alert severity="error">
          {error ??
            "The requested file could not be found."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="File Details"
        description="Review file information, metadata, storage impact, and safe deletion options."
        action={
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap"
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackOutlined />}
              onClick={() =>
                navigate("/files")
              }
            >
              Back
            </Button>

            <Button
              variant="outlined"
              startIcon={<RefreshOutlined />}
              onClick={() =>
                void loadFile()
              }
              disabled={isLoading}
            >
              Refresh
            </Button>
          </Box>
        }
      />

      {actionError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() =>
            setActionError(null)
          }
        >
          {actionError}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gap: 3
        }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap"
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  minWidth: 0
                }}
              >
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor:
                      "rgba(99, 102, 241, 0.12)",
                    color: "primary.main",
                    flexShrink: 0
                  }}
                >
                  <DescriptionOutlined />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      wordBreak: "break-word"
                    }}
                  >
                    {file.original_filename}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Uploaded{" "}
                    {formatDate(
                      file.created_at
                    )}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={file.status}
                color={
                  file.status === "duplicate"
                    ? "warning"
                    : file.status === "ready"
                      ? "success"
                      : file.status ===
                        "processing"
                        ? "info"
                        : "default"
                }
                variant="outlined"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(4, 1fr)"
                },
                gap: 3
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  File Size
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  {formatFileSize(
                    file.file_size
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  File Type
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  .{file.extension}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  MIME Type
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    wordBreak: "break-word"
                  }}
                >
                  {file.mime_type}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Protection
                </Typography>

                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    size="small"
                    icon={
                      <SecurityOutlined />
                    }
                    label={
                      file.is_protected
                        ? "Protected"
                        : "Not Protected"
                    }
                    color={
                      file.is_protected
                        ? "warning"
                        : "default"
                    }
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2
              }}
            >
              File Information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)"
                },
                gap: 2.5
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  File ID
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    wordBreak: "break-all"
                  }}
                >
                  {file.id}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Stored Filename
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    wordBreak: "break-all"
                  }}
                >
                  {file.stored_filename}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Created
                </Typography>

                <Typography variant="body2">
                  {formatDate(
                    file.created_at
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Last Updated
                </Typography>

                <Typography variant="body2">
                  {formatDate(
                    file.updated_at
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2
              }}
            >
              File Actions
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap"
              }}
            >
              <Button
                variant="outlined"
                startIcon={
                  <DescriptionOutlined />
                }
                onClick={() =>
                  setMetadataOpen(true)
                }
              >
                View Metadata
              </Button>

              <Button
                variant="outlined"
                startIcon={
                  <DownloadOutlined />
                }
                onClick={() =>
                  void handleDownload()
                }
              >
                Download
              </Button>

              <Button
                variant="contained"
                color="error"
                startIcon={
                  impactLoading ? (
                    <CircularProgress
                      size={18}
                      color="inherit"
                    />
                  ) : (
                    <DeleteOutlined />
                  )
                }
                onClick={() =>
                  void handleDeleteRequest()
                }
                disabled={
                  impactLoading ||
                  file.is_protected
                }
              >
                {file.is_protected
                  ? "Protected File"
                  : "Delete File"}
              </Button>
            </Box>

            {file.is_protected && (
              <Alert
                severity="warning"
                sx={{ mt: 2 }}
              >
                This file is protected and cannot
                be deleted through the safe deletion
                workflow.
              </Alert>
            )}
          </CardContent>
        </Card>
      </Box>

      <FileMetadataDialog
        file={
          metadataOpen
            ? file
            : null
        }
        onClose={() =>
          setMetadataOpen(false)
        }
      />

      <DeletionImpactDialog
        impact={impact}
        open={impact !== null}
        isDeleting={deleting}
        onClose={() =>
          deleting
            ? undefined
            : setImpact(null)
        }
        onConfirm={() =>
          void handleDeleteConfirm()
        }
      />
    </Box>
  );
}

export default FileDetailsPage;