import {
  CheckCircleOutlined,
  ContentCopyOutlined,
  InsertDriveFileOutlined
} from "@mui/icons-material";
import {
  Box,
  Chip,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import type { DuplicateFile } from "../../types/duplicate";
import { formatDate } from "../../utils/date";
import { formatFileSize } from "../../utils/file";

interface DuplicateFileRowProps {
  file: DuplicateFile;
  isOriginal?: boolean;
}

function DuplicateFileRow({
  file,
  isOriginal = false
}: DuplicateFileRowProps) {
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
            color={
              isOriginal
                ? "primary"
                : "warning"
            }
            fontSize="small"
          />

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600
              }}
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
          icon={
            isOriginal ? (
              <CheckCircleOutlined />
            ) : (
              <ContentCopyOutlined />
            )
          }
          label={
            isOriginal
              ? "Original"
              : "Duplicate"
          }
          color={
            isOriginal
              ? "success"
              : "warning"
          }
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
    </TableRow>
  );
}

export default DuplicateFileRow;