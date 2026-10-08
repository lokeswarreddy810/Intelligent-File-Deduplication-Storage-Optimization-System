import {
  CloseOutlined,
  WarningAmberOutlined
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from "@mui/material";

interface DuplicateDeleteDialogProps {
  open: boolean;
  filename: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

function DuplicateDeleteDialog({
  open,
  filename,
  onClose,
  onConfirm,
  isDeleting = false
}: DuplicateDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={
        isDeleting
          ? undefined
          : onClose
      }
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1
        }}
      >
        <WarningAmberOutlined
          color="warning"
        />

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
        <Typography variant="body1">
          Are you sure you want to delete:
        </Typography>

        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            mt: 1,
            wordBreak: "break-word"
          }}
        >
          {filename}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          The deletion workflow will verify the
          file's protection status and storage
          impact before permanently completing
          the operation.
        </Typography>
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
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting
            ? "Deleting..."
            : "Delete File"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DuplicateDeleteDialog;