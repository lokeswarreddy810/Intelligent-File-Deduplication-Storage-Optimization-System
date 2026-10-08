import {
  CloseOutlined,
  DescriptionOutlined
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { fileService } from "../../services/fileService";
import type {
  FileItem,
  FileMetadata
} from "../../types/file";
import { formatDate } from "../../utils/date";
import { formatFileSize } from "../../utils/file";

interface FileMetadataDialogProps {
  file: FileItem | null;
  onClose: () => void;
}

function FileMetadataDialog({
  file,
  onClose
}: FileMetadataDialogProps) {
  const [metadata, setMetadata] =
    useState<FileMetadata | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (!file) {
        if (!cancelled) {
          setMetadata(null);
          setError(null);
          setIsLoading(false);
        }

        return;
      }

      const loadMetadata = async () => {
        if (!cancelled) {
          setMetadata(null);
          setIsLoading(true);
          setError(null);
        }

        try {
          const result =
            await fileService.getMetadata(
              file.id
            );

          if (!cancelled) {
            setMetadata(result);
          }
        } catch (requestError) {
          if (!cancelled) {
            setError(
              requestError instanceof Error
                ? requestError.message
                : "Unable to load metadata."
            );
          }
        } finally {
          if (!cancelled) {
            setIsLoading(false);
          }
        }
      };

      void loadMetadata();
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [file]);

  return (
    <Dialog
      open={Boolean(file)}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <DescriptionOutlined color="primary" />

        File Metadata

        <IconButton
          onClick={onClose}
          sx={{ ml: "auto" }}
        >
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        {file && (
          <Box
            sx={{
              display: "grid",
              gap: 2
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Filename
              </Typography>

              <Typography
                variant="body1"
                sx={{ fontWeight: 600 }}
              >
                {file.original_filename}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)"
                },
                gap: 2
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  File size
                </Typography>

                <Typography variant="body2">
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
                  MIME type
                </Typography>

                <Typography variant="body2">
                  {file.mime_type}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Extension
                </Typography>

                <Typography variant="body2">
                  .{file.extension}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Status
                </Typography>

                <Typography variant="body2">
                  {file.status}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Uploaded
              </Typography>

              <Typography variant="body2">
                {formatDate(file.created_at)}
              </Typography>
            </Box>

            {isLoading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 2
                }}
              >
                <CircularProgress size={28} />
              </Box>
            )}

            {error && (
              <Typography
                variant="body2"
                color="error"
              >
                {error}
              </Typography>
            )}

            {metadata && (
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 700,
                    mb: 1
                  }}
                >
                  Metadata
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor:
                      "rgba(255,255,255,0.03)",
                    overflow: "auto"
                  }}
                >
                  <Typography
                    component="pre"
                    variant="body2"
                    sx={{
                      m: 0,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontFamily: "monospace"
                    }}
                  >
                    {JSON.stringify(
                      metadata.metadata_json,
                      null,
                      2
                    )}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default FileMetadataDialog;