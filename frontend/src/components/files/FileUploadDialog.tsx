import {
  CloseOutlined,
  CloudUploadOutlined
} from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton
} from "@mui/material";
import FileUpload from "./FileUpload";

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

function FileUploadDialog({
  open,
  onClose,
  onUpload,
  isUploading
}: FileUploadDialogProps) {
  const handleUpload = async (
    file: File
  ) => {
    await onUpload(file);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={
        isUploading
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
        <CloudUploadOutlined color="primary" />

        Upload File

        <IconButton
          onClick={onClose}
          disabled={isUploading}
          sx={{ ml: "auto" }}
        >
          <CloseOutlined />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <FileUpload
          onUpload={handleUpload}
          isUploading={isUploading}
        />
      </DialogContent>
    </Dialog>
  );
}

export default FileUploadDialog;