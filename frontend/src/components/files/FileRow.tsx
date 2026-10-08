import {
  DownloadOutlined,
  InfoOutlined,
  InsertDriveFileOutlined
} from "@mui/icons-material";
import {
  Chip,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
  Box
} from "@mui/material";
import type { FileItem } from "../../types/file";
import { formatDate } from "../../utils/date";
import { formatFileSize } from "../../utils/file";

interface FileRowProps {
  file: FileItem;
  onMetadata: (file: FileItem) => void;
  onDownload: (file: FileItem) => Promise<void>;
}

function FileRow({
  file,
  onMetadata,
  onDownload
}: FileRowProps) {
  const statusColor =
    file.status === "duplicate"
      ? "warning"
      : file.status === "processing"
        ? "info"
        : file.status === "ready"
          ? "success"
          : "default";

  return (
    <TableRow hover>
      <TableCell>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0
          }}
        >
          <InsertDriveFileOutlined
            color="primary"
            fontSize="small"
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ fontWeight: 600 }}
              noWrap
            >
              {file.original_filename}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
            >
              .{file.extension}
            </Typography>
          </Box>
        </Box>
      </TableCell>

      <TableCell>
        {formatFileSize(file.file_size)}
      </TableCell>

      <TableCell>
        <Chip
          size="small"
          label={file.status}
          color={statusColor}
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {formatDate(file.created_at)}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <Tooltip title="Metadata">
          <IconButton
            size="small"
            onClick={() =>
              onMetadata(file)
            }
          >
            <InfoOutlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Download">
          <IconButton
            size="small"
            onClick={() =>
              void onDownload(file)
            }
          >
            <DownloadOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}

export default FileRow;