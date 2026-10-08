import {
  ArrowForwardOutlined,
  ContentCopyOutlined,
  FolderOutlined
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from "@mui/material";
import type { DuplicateGroup } from "../../types/duplicate";
import { formatDate } from "../../utils/date";
import { formatFileSize } from "../../utils/file";
import { EmptyState } from "../common/EmptyState";
import { LoadingSpinner } from "../common/LoadingSpinner";

interface DuplicateGroupTableProps {
  groups: DuplicateGroup[];
  isLoading: boolean;
  onViewDetails: (groupId: string) => void;
}

function DuplicateGroupTable({
  groups,
  isLoading,
  onViewDetails
}: DuplicateGroupTableProps) {
  if (isLoading) {
    return (
      <LoadingSpinner
        message="Loading duplicate groups..."
      />
    );
  }

  if (groups.length === 0) {
    return (
      <EmptyState
        title="No duplicate groups found"
        description="Files with identical content will appear here after duplicate detection."
        icon={<FolderOutlined />}
      />
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Original File
            </TableCell>

            <TableCell>
              Duplicates
            </TableCell>

            <TableCell>
              File Size
            </TableCell>

            <TableCell>
              Storage Consumed
            </TableCell>

            <TableCell>
              Potential Savings
            </TableCell>

            <TableCell>
              Last Detected
            </TableCell>

            <TableCell align="right">
              Action
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {groups.map((group) => (
            <TableRow
              key={group.id}
              hover
            >
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    minWidth: 180
                  }}
                >
                  <FolderOutlined
                    fontSize="small"
                    color="primary"
                  />

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700
                      }}
                      noWrap
                    >
                      {
                        group.original_file
                          .original_filename
                      }
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Original file
                    </Typography>
                  </Box>
                </Box>
              </TableCell>

              <TableCell>
                <Chip
                  icon={
                    <ContentCopyOutlined />
                  }
                  label={`${group.duplicate_files.length} ${
                    group.duplicate_files.length === 1
                      ? "duplicate"
                      : "duplicates"
                  }`}
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              </TableCell>

              <TableCell>
                {formatFileSize(
                  group.file_size
                )}
              </TableCell>

              <TableCell>
                {formatFileSize(
                  group.total_storage
                )}
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 700,
                    color: "success.main"
                  }}
                >
                  {formatFileSize(
                    group.potential_savings
                  )}
                </Typography>
              </TableCell>

              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {formatDate(
                    group.last_detected_at
                  )}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Button
                  size="small"
                  endIcon={
                    <ArrowForwardOutlined />
                  }
                  onClick={() =>
                    onViewDetails(group.id)
                  }
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DuplicateGroupTable;