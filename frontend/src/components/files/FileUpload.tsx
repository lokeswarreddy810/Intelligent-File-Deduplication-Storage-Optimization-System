import {
  CloudUploadOutlined,
  InsertDriveFileOutlined
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography
} from "@mui/material";
import {
  useRef,
  useState,
  type ChangeEvent
} from "react";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

function FileUpload({
  onUpload,
  isUploading
}: FileUploadProps) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ?? null;

    setError(null);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file.");
      return;
    }

    try {
      await onUpload(selectedFile);

      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch {
      return;
    }
  };

  return (
    <Box>
      <input
        ref={inputRef}
        hidden
        type="file"
        onChange={handleFileChange}
      />

      <Box
        sx={{
          p: 3,
          border: "1px dashed",
          borderColor: "primary.main",
          borderRadius: 3,
          backgroundColor:
            "rgba(99, 102, 241, 0.04)"
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2
          }}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor:
                "rgba(99, 102, 241, 0.12)",
              color: "primary.main"
            }}
          >
            <CloudUploadOutlined />
          </Box>

          <Box>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700 }}
            >
              Upload a file
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Select a file to add it to your storage.
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        {selectedFile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              mb: 2,
              borderRadius: 2,
              backgroundColor:
                "rgba(255,255,255,0.03)"
            }}
          >
            <InsertDriveFileOutlined
              color="primary"
            />

            <Box
              sx={{
                minWidth: 0,
                flex: 1
              }}
            >
              <Typography
                variant="body2"
                noWrap
              >
                {selectedFile.name}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                {(
                  selectedFile.size /
                  1024
                ).toFixed(1)}{" "}
                KB
              </Typography>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            flexWrap: "wrap"
          }}
        >
          <Button
            variant="outlined"
            onClick={() =>
              inputRef.current?.click()
            }
            disabled={isUploading}
          >
            Choose File
          </Button>

          <Button
            variant="contained"
            onClick={() =>
              void handleUpload()
            }
            disabled={
              isUploading ||
              !selectedFile
            }
          >
            {isUploading ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              "Upload"
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default FileUpload;