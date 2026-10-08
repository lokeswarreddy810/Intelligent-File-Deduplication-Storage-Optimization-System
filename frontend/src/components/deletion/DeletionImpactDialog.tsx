import {
  CloseOutlined,
  DeleteOutlined,
  SecurityOutlined,
  WarningAmberOutlined
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";
import type { DeletionImpact } from "../../types/deletion";
import { formatFileSize } from "../../utils/file";

interface DeletionImpactDialogProps {
  open: boolean;
  impact: DeletionImpact | null;
  isDeleting?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeletionImpactDialog({
  open,
  impact,
  isDeleting = false,
  onClose,
  onConfirm
}: DeletionImpactDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={
        isDeleting
          ? undefined
          : onClose
      }
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
        <WarningAmberOutlined color="warning" />

        Confirm File Deletion

        <IconButton
          onClick={onClose}
          disabled={isDeleting}
          sx={{ ml: "auto" }}
        >
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {!impact ? (
          <Typography color="text.secondary">
            Loading deletion impact...
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 2.5
            }}
          >
            <Alert severity="warning">
              Deleting this file is a permanent
              storage-management action. Review the
              impact before confirming.
            </Alert>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Selected File
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  fontWeight: 700,
                  mt: 0.5,
                  wordBreak: "break-word"
                }}
              >
                {impact.filename}
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
                  File Size
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  {formatFileSize(
                    impact.file_size
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Storage Recovered
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: "success.main"
                  }}
                >
                  {formatFileSize(
                    impact.storage_recovered
                  )}
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 1,
                flexWrap: "wrap"
              }}
            >
              {impact.is_duplicate && (
                <Chip
                  label="Duplicate"
                  color="warning"
                  variant="outlined"
                />
              )}

              {impact.is_original && (
                <Chip
                  label="Original File"
                  color="primary"
                  variant="outlined"
                />
              )}

              {impact.is_protected && (
                <Chip
                  icon={<SecurityOutlined />}
                  label="Protected"
                  color="error"
                  variant="outlined"
                />
              )}
            </Box>

            {impact.is_original &&
              impact.replacement_original_id && (
                <Alert severity="info">
                  This file is currently the
                  original file for its duplicate
                  group. Another file will become the
                  replacement original if deletion is
                  confirmed.
                </Alert>
              )}

            {impact.is_protected && (
              <Alert severity="error">
                This file is protected and cannot be
                deleted.
              </Alert>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          startIcon={
            isDeleting ? (
              <DeleteOutlined />
            ) : (
              <DeleteOutlined />
            )
          }
          onClick={onConfirm}
          disabled={
            isDeleting ||
            !impact ||
            impact.is_protected
          }
        >
          {isDeleting
            ? "Deleting..."
            : "Confirm Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeletionImpactDialog;